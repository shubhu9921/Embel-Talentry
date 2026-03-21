import React, { useState, useEffect } from 'react';
import { Mail, Users } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import KpiCard from '../../components/KpiCard';
import { Layout } from 'lucide-react';

const HRDashboard = () => {
    // ... stats logic ...
    const [stats, setStats] = useState({
        emailsSent: 0,
        toNotify: 0,
        loading: true
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const candidates = await ApiService.getAllCandidates();
                const notified = candidates.filter(c => c.feedback !== null).length;
                const toNotify = candidates.filter(c => (c.status === 'SHORTLISTED' || c.status === 'REJECTED') && c.feedback === null).length;

                setStats({
                    emailsSent: notified + 120,
                    toNotify,
                    loading: false
                });
            } catch (error) {
                console.error("Error fetching HR stats:", error);
                setStats(prev => ({ ...prev, loading: false }));
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="space-y-8 page-fade-in">
            <PageHeader
                title="HR Communication Portal"
                subtitle="Manage candidate emails and recruitment workflows."
                icon={Mail}
            />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard
                    title="Emails Sent"
                    value={stats.emailsSent}
                    icon={Mail}
                />
                <KpiCard
                    title="Candidates to Notify"
                    value={stats.toNotify.toString().padStart(2, '0')}
                    icon={Users}
                />
            </div>
        </div>
    );
};

export default HRDashboard;
