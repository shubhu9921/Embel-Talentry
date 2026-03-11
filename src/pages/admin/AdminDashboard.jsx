import React, { useState, useEffect } from 'react';
import ApiService from '../../services/ApiService';
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
        candidateTrend: '0%',
        assessmentTrend: '0%',
        interviewTrend: '0%',
        loading: true
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [candidates, interviews] = await Promise.all([
                    ApiService.get('/candidates'),
                    ApiService.get('/interviews')
                ]);

                const total = (candidates || []).length;
                const assessments = (candidates || []).filter(c => c.examScore !== null).length;
                // Only count truly completed interviews
                const trulyCompletedInterviews = (interviews || []).filter(i => i.status === 'completed').length;

                setData({
                    totalCandidates: total, // Keep as number for the component to handle formatting if needed
                    activeAssessments: assessments,
                    interviewsCompleted: trulyCompletedInterviews,
                    avgTimeToHire: '12d',
                    candidateTrend: '+5%', // Simplified mock for now
                    assessmentTrend: '+2%',
                    interviewTrend: '+0%',
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
                <RecentActivities />
            </div>
        </div>
    );
};

export default AdminDashboard;
