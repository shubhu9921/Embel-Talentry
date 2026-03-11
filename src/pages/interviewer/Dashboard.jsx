import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, AlertCircle, User } from 'lucide-react';
import ApiService from '../../services/ApiService';
import KpiCard from '../../components/KpiCard';

const InterviewerDashboard = () => {
    const getInitialUser = () => {
        try {
            return JSON.parse(localStorage.getItem('admin_user')) || {};
        } catch (e) {
            console.error("Failed to parse user data:", e);
            return {};
        }
    };
    const user = getInitialUser();
    const [stats, setStats] = useState({
        pending: 0,
        completedToday: 0,
        assignedRounds: 0,
        loading: true
    });

    useEffect(() => {
        if (!user || !user.id) {
            setStats(prev => ({ ...prev, loading: false }));
            return;
        }
        const fetchStats = async () => {
            try {
                const [candidates, interviewsData] = await Promise.all([
                    ApiService.get('/candidates'),
                    ApiService.get('/interviews')
                ]);
                const interviews = interviewsData || [];

                const pending = candidates.filter(c => c.examScore !== null && c.status === 'pending').length;
                const today = new Date().toISOString().split('T')[0];
                const completedToday = interviews.filter(i => 
                    String(i.interviewerId) === String(user.id) && 
                    i.date === today && 
                    i.status === 'completed'
                ).length;

                const assignedRounds = interviews.filter(i => 
                    String(i.interviewerId) === String(user.id)
                ).length;

                setStats({
                    pending,
                    completedToday,
                    assignedRounds,
                    loading: false
                });
            } catch (error) {
                console.error("Error fetching interviewer stats:", error);
                setStats(prev => ({ ...prev, loading: false }));
            }
        };
        fetchStats();
    }, [user.id]);

    return (
        <div className="space-y-8 page-fade-in">
            <div className="pb-4 pt-4 border-b border-slate-200/50 mb-4">
                <h1 className="text-2xl font-black text-[#19325c] tracking-tight">Interviewer Workspace</h1>
                <p className="text-slate-500 font-medium mt-1">Review assigned candidates and conduct technical assessments.</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard
                    title="Assigned Rounds"
                    value={stats.assignedRounds.toString().padStart(2, '0')}
                    icon={User}
                    className="ring-1 ring-slate-100 shadow-elevation-high"
                />
                <KpiCard
                    title="Pending Reviews"
                    value={stats.pending.toString().padStart(2, '0')}
                    icon={AlertCircle}
                    className="ring-1 ring-slate-100 shadow-elevation-high"
                />
                <KpiCard
                    title="Completed Today"
                    value={stats.completedToday.toString().padStart(2, '0')}
                    icon={CheckCircle2}
                    className="ring-1 ring-slate-100 shadow-elevation-high"
                />
            </div>
        </div>
    );
};

export default InterviewerDashboard;
