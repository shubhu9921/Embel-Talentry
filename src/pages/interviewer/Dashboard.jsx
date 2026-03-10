import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import ApiService from '../../services/ApiService';
import KpiCard from '../../components/KpiCard';

const InterviewerDashboard = () => {
    const [stats, setStats] = useState({
        pending: 0,
        completedToday: 0,
        loading: true
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const candidates = await ApiService.get('/candidates');
                const interviews = await ApiService.get('/interviews') || [];

                const pending = candidates.filter(c => c.examScore !== null && c.status === 'pending').length;
                const today = new Date().toISOString().split('T')[0];
                const completedToday = interviews.filter(i => i.date === today && i.status === 'completed').length;

                setStats({
                    pending,
                    completedToday,
                    loading: false
                });
            } catch (error) {
                console.error("Error fetching interviewer stats:", error);
                setStats(prev => ({ ...prev, loading: false }));
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="pb-4 pt-4 border-b border-slate-200/50 mb-4">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Interviewer Workspace</h1>
                <p className="text-slate-500 font-medium mt-1">Review assigned candidates and conduct technical assessments.</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard
                    title="Pending Reviews"
                    value={stats.pending.toString().padStart(2, '0')}
                    icon={AlertCircle}
                />
                <KpiCard
                    title="Completed Today"
                    value={stats.completedToday.toString().padStart(2, '0')}
                    icon={CheckCircle2}
                />
            </div>
        </div>
    );
};

export default InterviewerDashboard;
