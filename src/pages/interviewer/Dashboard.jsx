import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, AlertCircle, User } from 'lucide-react';
import ApiService from '../../services/apiService';
import PageHeader from '../../components/PageHeader';
import KpiCard from '../../components/KpiCard';

const InterviewerDashboard = () => {
    const userId = sessionStorage.getItem('userId') ||
        JSON.parse(localStorage.getItem('admin_user') || '{}')?.id;

    const [stats, setStats] = useState({
        pending: 0, completedToday: 0, assignedRounds: 0, loading: true
    });

    useEffect(() => {
        if (!userId) { setStats(prev => ({ ...prev, loading: false })); return; }

        const fetchStats = async () => {
            try {
                const interviews = await ApiService.getAllInterviews();
                const today = new Date().toISOString().split('T')[0];

                const mine = (interviews || []).filter(i =>
                    String(i.interviewerId) === String(userId));

                setStats({
                    assignedRounds: mine.length,
                    pending: mine.filter(i => i.status === 'SCHEDULED').length,
                    completedToday: mine.filter(i =>
                        i.status === 'COMPLETED' &&
                        (i.scheduledAt || '').startsWith(today)).length,
                    loading: false
                });
            } catch (error) {
                console.error('Error fetching interviewer stats:', error);
                setStats(prev => ({ ...prev, loading: false }));
            }
        };
        fetchStats();
    }, [userId]);

    return (
        <div className="space-y-10 page-fade-in">
            <PageHeader
                title="Interviewer Assessment Workspace"
                subtitle="Review assigned candidates and conduct technical assessments."
                icon={User}
            />
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                <KpiCard title="Assigned Rounds"
                    value={String(stats.assignedRounds).padStart(2, '0')}
                    icon={User}
                    className="ring-1 ring-slate-100 shadow-elevation-high" />
                <KpiCard title="Pending Reviews"
                    value={String(stats.pending).padStart(2, '0')}
                    icon={AlertCircle}
                    className="ring-1 ring-slate-100 shadow-elevation-high" />
                <KpiCard title="Completed Today"
                    value={String(stats.completedToday).padStart(2, '0')}
                    icon={CheckCircle2}
                    className="ring-1 ring-slate-100 shadow-elevation-high" />
            </div>
        </div>
    );
};

export default InterviewerDashboard;