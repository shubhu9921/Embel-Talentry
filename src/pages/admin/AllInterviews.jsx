import React, { useState, useEffect } from 'react';
import { Search, Calendar } from 'lucide-react';
import ApiService from '../../services/ApiService';
import Loader from '../../components/Loader';
import PageHeader from '../../components/PageHeader';

// Modular Components
import InterviewStats from './components/AllInterviews/InterviewStats';
import InterviewRow from './components/AllInterviews/InterviewRow';

const AllInterviews = () => {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [candData, adminData] = await Promise.all([
                    ApiService.get('/api/candidates'),
                    ApiService.get('/api/admin/users')
                ]);

                // Map candidates with interview info to the "Interview" structure
                const enrichedInterviews = (candData || [])
                    .filter(c => c.status === 'SCHEDULED' || c.status === 'INTERVIEW_PENDING' || c.status === 'INTERVIEW_COMPLETED')
                    .map(c => ({
                        id: `int-${c.id}`,
                        candidateId: c.id,
                        candidate: c,
                        interviewer: adminData?.find(a => String(a.id) === String(c.interviewerId)),
                        date: c.interviewDate || 'TBD',
                        time: c.interviewTime || 'TBD',
                        status: c.status === 'INTERVIEW_COMPLETED' ? 'completed' : 'scheduled'
                    }));

                setInterviews(enrichedInterviews);
            } catch (error) {
                console.error('Error fetching all interviews:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, []);

    const stats = {
        total: interviews.length,
        upcoming: interviews.filter(i => i.status === 'scheduled').length,
        completed: interviews.filter(i => i.status === 'completed').length,
        canceled: interviews.filter(i => i.status === 'canceled').length
    };

    const filteredInterviews = interviews.filter(i =>
        i.candidate?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.interviewer?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );


    if (loading) return <div className="p-10 flex justify-center"><Loader size="lg" /></div>;

    return (
        <div className="space-y-10 page-fade-in">
            <PageHeader
                title="Global Interview Schedule"
                subtitle="Monitor all technical rounds and interview performance across the platform."
                icon={Calendar}
                actions={
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#ff6e00] transition-colors" />
                        <input
                            type="text"
                            placeholder="Find session..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6e00]/20 focus:border-[#ff6e00] transition-all w-64 shadow-sm"
                        />
                    </div>
                }
            />

            <InterviewStats stats={stats} />

            <div className="grid grid-cols-1 gap-4">
                {filteredInterviews.map((interview) => (
                    <InterviewRow key={interview.id} interview={interview} />
                ))}

                {filteredInterviews.length === 0 && (
                    <div className="text-center py-20 bg-white/50 rounded-[2.5rem] border border-dashed border-slate-200">
                        <Calendar className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-400 font-medium">No matching interview sessions found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllInterviews;
