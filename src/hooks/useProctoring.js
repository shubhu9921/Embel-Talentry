import { useState, useEffect, useRef, useCallback } from 'react';
import * as faceapi from 'face-api.js';
import ApiService from '../services/apiService';

const MODEL_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/';

const useProctoring = (onAutoSubmit, videoRef, candidateId, maxViolations = 3) => {
    const onAutoSubmitRef = useRef(onAutoSubmit);
    const [violations, setViolations] = useState(0);
    const [lastViolationType, setLastViolationType] = useState('');
    const [isFaceMissing, setIsFaceMissing] = useState(false);
    const [isMultipleFaces, setIsMultipleFaces] = useState(false);
    const [isSuspiciousMovement, setIsSuspiciousMovement] = useState(false);
    const [isVoiceDetected, setIsVoiceDetected] = useState(false);
    const [isTabViolation, setIsTabViolation] = useState(false);

    // Refs for tracking state across intervals/listeners
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const streamRef = useRef(null);
    const animationFrameRef = useRef(null);
    const faceDetectionIntervalRef = useRef(null);
    const noFaceStartRef = useRef(null);
    const suspiciousMovementStartRef = useRef(null);
    const voiceStartRef = useRef(null);
    const localLogsRef = useRef([]);

    useEffect(() => {
        if (typeof onAutoSubmit === 'function') {
            onAutoSubmitRef.current = onAutoSubmit;
        }
    }, [onAutoSubmit]);

    const captureScreenshot = useCallback(() => {
        if (videoRef?.current) {
            try {
                return videoRef.current.getScreenshot();
            } catch (err) {
                console.error('Failed to capture screenshot', err);
            }
        }
        return null;
    }, [videoRef]);

    const logViolationToDB = useCallback(async (type, evidence = null) => {
        if (!candidateId) return;
        try {
            // Check local cache first to avoid redundant fetches (10s throttle)
            const now = Date.now();
            if (localLogsRef.current.some(log => log.type === type && (now - new Date(log.timestamp).getTime()) < 10000)) {
                return;
            }

            // Phase 6: Log proctoring event to Spring Boot backend
            await ApiService.logProctoringEvent({
                candidateId:  candidateId,
                eventType:    type,
                eventDetails: { evidence }
            });

            localLogsRef.current.push({ type, timestamp: new Date().toISOString() });
            console.log(`Violation logged to backend: ${type}`);
        } catch (err) {
            console.error('Failed to log violation to backend:', err);
        }
    }, [candidateId]);

    const addViolation = useCallback((type, immediate = false) => {
        console.warn(`Proctoring violation: ${type}`);
        setLastViolationType(type);

        const evidence = captureScreenshot();
        logViolationToDB(type, evidence);

        if (immediate) {
            onAutoSubmitRef.current?.(`CRITICAL MALPRACTICE: ${type}`);
            return;
        }

        setViolations((prev) => {
            const next = prev + 1;
            if (next >= maxViolations) {
                if (typeof onAutoSubmitRef.current === 'function') {
                    onAutoSubmitRef.current('Interview terminated due to suspicious activity.');
                }
            }
            return next;
        });
    }, [maxViolations, captureScreenshot, logViolationToDB]);

    // 1. Model Loading & Face Detection
    useEffect(() => {
        let isMounted = true;

        const startDetection = async () => {
            try {
                await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
                await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
                if (!isMounted) return;

                faceDetectionIntervalRef.current = setInterval(async () => {
                    const video = videoRef?.current?.video;
                    if (!video || video.readyState !== 4) return;

                    const detections = await faceapi.detectAllFaces(
                        video,
                        new faceapi.TinyFaceDetectorOptions()
                    ).withFaceLandmarks();

                    if (!isMounted) return;

                    if (detections.length > 1) {
                        noFaceStartRef.current = null;
                        setIsFaceMissing(false);
                        setIsMultipleFaces(true);
                        addViolation('Multiple Faces Detected');
                    } else if (detections.length === 1) {
                        noFaceStartRef.current = null;
                        setIsFaceMissing(false);
                        setIsMultipleFaces(false);
                        setIsSuspiciousMovement(false);

                        // Pose Estimation Logic
                        const landmarks = detections[0].landmarks;
                        const nose = landmarks.getNose()[3];
                        const leftEye = landmarks.getLeftEye()[0];
                        const rightEye = landmarks.getRightEye()[3];
                        const jawOutline = landmarks.getJawOutline();
                        const leftJaw = jawOutline[0];
                        const rightJaw = jawOutline[16];

                        const faceWidth = rightJaw.x - leftJaw.x;
                        const nosePos = (nose.x - leftJaw.x) / faceWidth;
                        const vertRatio = (nose.y - (leftEye.y + rightEye.y) / 1.1) / faceWidth;

                        const isLookingAway = nosePos < 0.35 || nosePos > 0.65 || vertRatio < 0.1 || vertRatio > 0.45;

                        if (isLookingAway) {
                            if (!suspiciousMovementStartRef.current) suspiciousMovementStartRef.current = Date.now();
                            else {
                                const duration = (Date.now() - suspiciousMovementStartRef.current) / 1000;
                                if (duration > 3) {
                                    setIsSuspiciousMovement(true);
                                    addViolation('Suspicious Head Movement');
                                }
                            }
                        } else {
                            suspiciousMovementStartRef.current = null;
                        }
                    } else {
                        if (!noFaceStartRef.current) noFaceStartRef.current = Date.now();
                        else {
                            const duration = (Date.now() - noFaceStartRef.current) / 1000;
                            if (duration > 5) {
                                setIsFaceMissing(true);
                                if (Math.floor(duration) % 15 === 0) addViolation('Face Not Detected for > 5s');
                            }
                        }
                        setIsMultipleFaces(false);
                    }
                }, 1000);
            } catch (err) {
                console.error('FaceAPI Init Error:', err);
            }
        };

        startDetection();
        return () => {
            isMounted = false;
            clearInterval(faceDetectionIntervalRef.current);
        };
    }, [videoRef, addViolation]);

    // 2. Audio Monitoring
    useEffect(() => {
        let isMounted = true;

        const startAudio = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                if (!isMounted) {
                    stream.getTracks().forEach(t => t.stop());
                    return;
                }
                streamRef.current = stream;
                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext || globalThis.AudioContext || globalThis.webkitAudioContext)();
                analyserRef.current = audioContextRef.current.createAnalyser();
                const source = audioContextRef.current.createMediaStreamSource(stream);
                source.connect(analyserRef.current);
                analyserRef.current.fftSize = 256;

                const bufferLength = analyserRef.current.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);

                const checkNoise = () => {
                    if (!isMounted || !analyserRef.current) return;
                    analyserRef.current.getByteFrequencyData(dataArray);
                    const average = dataArray.reduce((p, c) => p + c, 0) / bufferLength;

                    if (average > 50) {
                        if (!voiceStartRef.current) voiceStartRef.current = Date.now();
                        else if ((Date.now() - voiceStartRef.current) / 1000 > 2) {
                            setIsVoiceDetected(true);
                            addViolation('Background Voice Detected');
                        }
                    } else {
                        voiceStartRef.current = null;
                        setIsVoiceDetected(false);
                    }
                    animationFrameRef.current = requestAnimationFrame(checkNoise);
                };
                checkNoise();
            } catch (err) {
                console.error('Audio Monitor Error:', err);
                addViolation('Microphone Access Denied', true);
            }
        };

        startAudio();
        return () => {
            isMounted = false;
            cancelAnimationFrame(animationFrameRef.current);
            if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
            if (audioContextRef.current) audioContextRef.current.close();
        };
    }, [addViolation]);

    // 3. Window & Event Listeners
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setIsTabViolation(true);
                addViolation('Tab Switch Detected');
            }
        };
        const handleBlur = () => {
            setIsTabViolation(true);
            addViolation('Window Minimized / Lost Focus');
        };
        const handleContextMenu = (e) => {
            e.preventDefault();
            addViolation('Right Click Attempted');
        };
        const handleFullscreenChange = () => {
            const isFull = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
            if (!isFull) addViolation('Fullscreen Exited', true);
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("blur", handleBlur);
        document.addEventListener("contextmenu", handleContextMenu);
        const fsEvents = ["fullscreenchange", "webkitfullscreenchange", "mozfullscreenchange", "MSFullscreenChange"];
        fsEvents.forEach(e => document.addEventListener(e, handleFullscreenChange));

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("blur", handleBlur);
            document.removeEventListener("contextmenu", handleContextMenu);
            fsEvents.forEach(e => document.removeEventListener(e, handleFullscreenChange));
        };
    }, [addViolation]);

    return {
        violations,
        lastViolationType,
        isFaceMissing,
        isMultipleFaces,
        isSuspiciousMovement,
        isVoiceDetected,
        isTabViolation,
        resetTabViolation: () => setIsTabViolation(false)
    };
};

export default useProctoring;
