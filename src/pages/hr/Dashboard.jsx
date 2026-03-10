import React, { useState, useEffect } from 'react';
import { Mail, Users } from 'lucide-react';
import ApiService from '../../services/ApiService';
import KpiCard from '../../components/KpiCard';

const HRDashboard = () => {
    const [stats, setStats] = useState({
        emailsSent: 0,
        toNotify: 0,
        loading: true
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const candidates = await ApiService.get('/candidates');
                const notified = candidates.filter(c => c.feedback !== null).length;
                const toNotify = candidates.filter(c => (c.status === 'shortlisted' || c.status === 'rejected') && c.feedback === null).length;

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
        <div className="space-y-8 animate-in fade-in duration-700">
            <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">HR Communication Portal</h1>
                <p className="text-slate-500 font-medium mt-1">Manage candidate emails and recruitment workflows.</p>
            </div>

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
