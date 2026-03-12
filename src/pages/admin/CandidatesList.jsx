import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import ApiService from '../../services/ApiService';
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import PageHeader from '../../components/PageHeader';

// Modular Components
import CandidateStats from './components/CandidatesList/CandidateStats';
import CandidateCard from './components/CandidatesList/CandidateCard';
import CandidateDetailModal from './components/CandidatesList/CandidateDetailModal';
import InterviewScheduleModal from './components/CandidatesList/InterviewScheduleModal';

const CandidatesList = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialStatus = queryParams.get('status') || 'all';

    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
    const [interviewData, setInterviewData] = useState({ date: '', time: '', interviewerId: '' });
    const [interviewers, setInterviewers] = useState([]);
    const [interviews, setInterviews] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [statusFilter, setStatusFilter] = useState(initialStatus);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [candData, adminData, qData] = await Promise.all([
                ApiService.get('/api/candidates'),
                ApiService.get('/api/admin/users'),
                ApiService.get('/api/admin/questions')
            ]);
            setCandidates(candData || []);
            setInterviewers((adminData || []).filter(u => u.role === 'interviewer' || u.role === 'INTERVIEWER'));
            setQuestions(qData || []);
            setInterviews([]); // Resetting interviews as per Phase 3 directive if backend doesn't support it yet
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

const STATUS_GROUPS = {
    shortlisted: ['SHORTLISTED', 'SCHEDULED', 'INTERVIEW_PENDING', 'INTERVIEW_COMPLETED'],
    rejected: ['REJECTED'],
    applied: ['APPLIED', 'EXAM_COMPLETED']
};

    const stats = React.useMemo(() => ({
        total: candidates.length,
        shortlisted: candidates.filter(c => STATUS_GROUPS.shortlisted.includes(c.status)).length,
        rejected: candidates.filter(c => STATUS_GROUPS.rejected.includes(c.status)).length,
        pending: candidates.filter(c => STATUS_GROUPS.applied.includes(c.status)).length
    }), [candidates]);

    const handleUpdateStatus = async (id, status, extraData = {}) => {
        try {
            // Phase 9: If status is SELECTED or REJECTED, use the HR Decision API
            if (status === 'SELECTED' || status === 'REJECTED') {
                await ApiService.submitHrDecision(id, status, extraData.notes || 'Decision via TalentSphere Admin');
            } else {
                await ApiService.put(`/api/candidates/${id}/status`, { status, ...extraData });
            }
            
            setCandidates(prev => prev.map(c => c.id === id ? { ...c, status, ...extraData } : c));
            if (selectedCandidate?.id === id) {
                setSelectedCandidate(prev => ({ ...prev, status, ...extraData }));
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update candidate status. Please check your connection.');
        }
    };

    const handleDeleteCandidate = async (id) => {
        if (!globalThis.confirm('Are you sure you want to permanently delete this candidate?')) return;
        try {
            await ApiService.delete(`/api/candidates/${id}`);
            setCandidates(prev => prev.filter(c => c.id !== id));
            if (selectedCandidate?.id === id) {
                setIsDetailModalOpen(false);
                setSelectedCandidate(null);
            }
        } catch (error) {
            console.error('Error deleting candidate:', error);
            alert('Failed to delete candidate. Please try again.');
        }
    };

    const handleScheduleInterview = async () => {
        try {
            if (!interviewData.date || !interviewData.time) {
                return alert('Please select both a date and time for the interview.');
            }
            const selectedDateTime = new Date(`${interviewData.date}T${interviewData.time}`);
            const now = new Date();
            if (selectedDateTime <= now) return alert('Interview must be scheduled for a future date/time.');

            await ApiService.scheduleInterview(selectedCandidate.id, {
                interviewerId: Number.parseInt(interviewData.interviewerId, 10),
                date: interviewData.date,
                time: interviewData.time
            });
            await handleUpdateStatus(selectedCandidate.id, 'SCHEDULED');
            setIsInterviewModalOpen(false);
            setInterviewData({ date: '', time: '', interviewerId: '' });
            fetchData(); // Refresh all data including interviews
        } catch (error) {
            console.error('Error scheduling interview:', error);
            alert('Failed to schedule interview. Ensure an interviewer is selected.');
        }
    };

    const filteredCandidates = React.useMemo(() => {
        const lowerSearch = searchTerm.toLowerCase();
        return candidates.filter(c => {
            const matchesSearch = (c.name || '').toLowerCase().includes(lowerSearch) ||
                (c.email || '').toLowerCase().includes(lowerSearch);
            const matchesStatus = statusFilter === 'all' || 
                                 (STATUS_GROUPS[statusFilter] ? STATUS_GROUPS[statusFilter].includes(c.status) : c.status === statusFilter);
            return matchesSearch && matchesStatus;
        });
    }, [candidates, searchTerm, statusFilter]);


    if (loading) return <div className="p-10 flex justify-center"><Loader size="lg" /></div>;

    return (
        <div className="space-y-10 page-fade-in">
            <PageHeader
                title="Candidates Talent Pool"
                subtitle="Review applicant profiles, assessment scores, and manage hiring stages."
                actions={
                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#ff6e00] transition-colors" />
                            <input
                                type="text"
                                placeholder="Find application..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-[#ff6e00] transition-all w-64 shadow-sm"
                            />
                        </div>
                        <Button 
                            variant="outline" 
                            icon={Filter} 
                            onClick={() => console.log('Filter clicked')}
                        >
                            Filter
                        </Button>
                    </div>
                }
            />

            <CandidateStats stats={stats} setStatusFilter={setStatusFilter} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredCandidates.map((candidate) => (
                    <CandidateCard
                        key={candidate.id}
                        candidate={candidate}
                        interviews={interviews}
                        interviewers={interviewers}
                        onClick={() => { setSelectedCandidate(candidate); setIsDetailModalOpen(true); }}
                        onDelete={handleDeleteCandidate}
                    />
                ))}
            </div>

            <CandidateDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                candidate={selectedCandidate}
                questions={questions}
                interviews={interviews}
                interviewers={interviewers}
                onUpdateStatus={handleUpdateStatus}
                onScheduleInterview={() => setIsInterviewModalOpen(true)}
            />

            <InterviewScheduleModal
                isOpen={isInterviewModalOpen}
                onClose={() => setIsInterviewModalOpen(false)}
                interviewData={interviewData}
                setInterviewData={setInterviewData}
                interviewers={interviewers}
                onSchedule={handleScheduleInterview}
            />
        </div>
    );
};

export default CandidatesList;
