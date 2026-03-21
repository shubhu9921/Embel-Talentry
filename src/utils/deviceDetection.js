export const isMobileDevice = () => {
    // Basic user agent check
    const userAgent = navigator.userAgent || globalThis.opera;
    return /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
};
