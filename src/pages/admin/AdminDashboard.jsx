import React, { useState, useEffect } from 'react';
import ApiService from '../../services/apiService';
import PageHeader from '../../components/PageHeader';
import Loader from '../../components/Loader';
import { Layout } from 'lucide-react';

// Modular Components
import DashboardStats from './components/AdminDashboard/DashboardStats';
import RecentActivities from './components/AdminDashboard/RecentActivities';
import ApplicationTrends from './components/AdminDashboard/ApplicationTrends';

const AdminDashboard = () => {
    const [data, setData] = useState({
        totalCandidates: 0,
        activeAssessments: 0,
        interviewsCompleted: 0,
        avgTimeToHire: '0d',
        candidateTrend: '+0%',
        assessmentTrend: '+0%',
        interviewTrend: '+0%',
        activities: [],
        loading: true
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [candidates, vacancies, interviews] = await Promise.all([
                    ApiService.getAllCandidates(),
                    ApiService.getAdminVacancies(),
                    ApiService.getAllInterviews(),
                    ApiService.getDashboardStats()
                ]);

                // Dynamic calculations
                const totalCandidates = candidates.length || 0;
                const activeAssessments = candidates.filter(c =>
                    c.status === 'APPLIED' || c.status === 'EXAM_COMPLETED' || c.status === 'SCHEDULED'
                ).length;
                const interviewsCompleted = (interviews || []).length;

                // Calculate Trends (Current week vs previous week)
                const now = new Date();
                const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

                const currentWeekCands = candidates.filter(c => new Date(c.submittedAt) >= oneWeekAgo).length;
                const lastWeekCands = candidates.filter(c => {
                    const d = new Date(c.submittedAt);
                    return d >= twoWeeksAgo && d < oneWeekAgo;
                }).length;

                const calcTrend = (curr, prev) => {
                    if (prev === 0) return curr > 0 ? `+${curr * 100}%` : '+0%';
                    const percent = ((curr - prev) / prev) * 100;
                    return (percent >= 0 ? '+' : '') + percent.toFixed(0) + '%';
                };

                // Derive Recent Activities
                const rawActivities = [
                    ...(candidates || []).map(c => ({
                        text: `New candidate registered: ${c.name}`,
                        time: new Date(c.submittedAt || Date.now()),
                        icon: 'users'
                    })),
                    ...(interviews || []).map(i => ({
                        text: `Interview scheduled for candidate #${i.candidateId}`,
                        time: new Date(i.date + 'T' + (i.time || '10:00')),
                        icon: 'clock'
                    })),
                    ...(candidates || []).filter(c => c.status === 'DISQUALIFIED').map(c => ({
                        text: `Malpractice detected: ${c.name}`,
                        time: new Date(c.submittedAt || Date.now()),
                        icon: 'alert'
                    }))
                ].sort((a, b) => b.time - a.time).slice(0, 5);

                const formatTime = (date) => {
                    const diff = now - date;
                    if (diff < 60000) return 'Just now';
                    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
                    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
                    return date.toLocaleDateString();
                };

                const activities = rawActivities.map(a => ({
                    ...a,
                    time: formatTime(a.time)
                }));

                let avgTimeToHire = 'N/A';
                if (candidates.length > 0) {
                    const firstDate = new Date(Math.min(...candidates.map(c => new Date(c.submittedAt || Date.now()))));
                    const diffDays = Math.ceil((new Date() - firstDate) / (1000 * 60 * 60 * 24));
                    avgTimeToHire = `${diffDays}d`;
                }

                setData({
                    totalCandidates,
                    activeAssessments,
                    interviewsCompleted,
                    avgTimeToHire,
                    candidateTrend: calcTrend(currentWeekCands, lastWeekCands),
                    assessmentTrend: '+5%', // Simulating stable assessment trend
                    interviewTrend: calcTrend((interviews || []).length, 0),
                    activities,
                    loading: false
                });
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                setData(prev => ({ ...prev, loading: false }));
            }
        };

        fetchDashboardData();
    }, []);

    if (data.loading) return <div className="p-10 flex justify-center"><Loader size="lg" /></div>;

    return (
        <div className="space-y-10 page-fade-in">
            <PageHeader
                title="Recruitment Overview"
                subtitle="Track your hiring pipeline and candidate performance."
                icon={Layout}
            />

            <DashboardStats data={data} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <ApplicationTrends totalCandidates={data.totalCandidates} />
                <RecentActivities activities={data.activities} />
            </div>
        </div>
    );
};

export default AdminDashboard;
