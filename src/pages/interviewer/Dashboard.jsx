import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, AlertCircle, User } from 'lucide-react';
import ApiService from '../../services/ApiService';
import PageHeader from '../../components/PageHeader';
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
                const candidates = await ApiService.get('/api/candidates');

                const pending = (candidates || []).filter(c => c.status === 'INTERVIEW_PENDING').length;
                const today = new Date().toISOString().split('T')[0];
                
                const myInterviews = (candidates || []).filter(c => 
                    String(c.interviewerId) === String(user.id) && 
                    (c.status === 'SCHEDULED' || c.status === 'INTERVIEW_PENDING' || c.status === 'INTERVIEW_COMPLETED')
                );

                const completedToday = myInterviews.filter(i => 
                    i.interviewDate === today && 
                    i.status === 'INTERVIEW_COMPLETED'
                ).length;

                const assignedRounds = myInterviews.length;

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
        <div className="space-y-10 page-fade-in">
            <PageHeader
                title="Interviewer Assessment Workspace"
                subtitle="Review assigned candidates and conduct technical assessments."
                icon={User}
            />

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
