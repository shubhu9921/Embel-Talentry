import React, { useEffect, useRef } from 'react';
import { ChevronDown, Calendar } from 'lucide-react';
import Modal from '../../../../components/Modal';
import Button from '../../../../components/Button';

const InterviewScheduleModal = ({
    isOpen,
    onClose,
    interviewData,
    setInterviewData,
    interviewers,
    onSchedule
}) => {
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') setIsDropdownOpen(false);
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsDropdownOpen(!isDropdownOpen);
        }
    };

    const handleSelectInterviewer = (id) => {
        setInterviewData({ ...interviewData, interviewerId: id });
        setIsDropdownOpen(false);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Schedule Technical Interview"
        >
            <div className="space-y-5">
                <div className="space-y-1.5">
                    <label htmlFor="interviewer-select" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Select Interviewer</label>
                    <div 
                        className={`relative dropdown ${isDropdownOpen ? 'dropdown-open' : ''} w-full`}
                        ref={dropdownRef}
                    >
                        <div
                            tabIndex={0}
                            role="combobox"
                            aria-expanded={isDropdownOpen}
                            aria-haspopup="listbox"
                            aria-controls="interviewer-listbox"
                            onKeyDown={handleKeyDown}
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            id="interviewer-select"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm flex items-center justify-between focus:outline-none focus:ring-4 focus:ring-[#ff6e00]/10 transition-all cursor-pointer"
                        >
                            <span className={interviewData.interviewerId ? "text-slate-900 font-bold" : "text-slate-400"}>
                                {interviewData.interviewerId ? interviewers.find(i => String(i.id) === String(interviewData.interviewerId))?.name : 'Choose expert...'}
                            </span>
                            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </div>
                        {isDropdownOpen && (
                            <ul 
                                role="listbox"
                                id="interviewer-listbox"
                                className="dropdown-content menu bg-white rounded-xl z-[200] w-full p-2 shadow-elevation-high border border-slate-100 mt-2 absolute top-full left-0 animate-in fade-in slide-in-from-top-1 duration-200"
                            >
                                <li role="option" aria-selected={!interviewData.interviewerId}>
                                    <button
                                        type="button"
                                        onClick={() => handleSelectInterviewer('')}
                                        className={`w-full text-left px-4 py-3 rounded-lg hover:bg-slate-50 transition-colors ${!interviewData.interviewerId ? 'bg-orange-50 text-[#ff6e00] font-bold' : ''}`}
                                    >
                                        Choose expert...
                                    </button>
                                </li>
                                {interviewers.map(i => (
                                    <li key={i.id} role="option" aria-selected={String(interviewData.interviewerId) === String(i.id)}>
                                        <button
                                            type="button"
                                            onClick={() => handleSelectInterviewer(i.id)}
                                            className={`w-full text-left px-4 py-3 rounded-lg hover:bg-slate-50 transition-colors ${String(interviewData.interviewerId) === String(i.id) ? 'bg-orange-50 text-[#ff6e00] font-bold' : ''}`}
                                        >
                                            {i.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label htmlFor="interview-date" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Interview Date</label>
                        <input
                            id="interview-date"
                            type="date"
                            min={new Date().toLocaleDateString('en-CA')} // YYYY-MM-DD local
                            value={interviewData.date}
                            onChange={(e) => setInterviewData({ ...interviewData, date: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/5 transition-all"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label htmlFor="interview-time" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Start Time</label>
                        <input
                            id="interview-time"
                            type="time"
                            value={interviewData.time}
                            onChange={(e) => setInterviewData({ ...interviewData, time: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/5 transition-all"
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <Button
                        onClick={() => {
                            if (!interviewData.interviewerId || !interviewData.date || !interviewData.time) {
                                return alert('Please complete all scheduling fields.');
                            }
                            onSchedule();
                        }}
                        className="w-full py-4 rounded-xl flex items-center justify-center gap-2 bg-[#ff6e00] hover:bg-[#e05d00] border-none shadow-xl shadow-orange-500/20"
                    >
                        <Calendar className="w-4 h-4" />
                        <span>Confirm Schedule</span>
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default InterviewScheduleModal;
