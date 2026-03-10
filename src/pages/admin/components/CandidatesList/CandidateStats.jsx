import React from 'react';
import { Users, CheckCircle2, XCircle, Clock } from 'lucide-react';
import KpiCard from '../../../../components/KpiCard';

const CandidateStats = ({ stats = {}, setStatusFilter }) => {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <KpiCard title="All Applicants" value={stats?.total || 0} icon={Users} onClick={() => setStatusFilter?.('all')} />
            <KpiCard title="Shortlisted" value={stats?.shortlisted || 0} icon={CheckCircle2} onClick={() => setStatusFilter?.('shortlisted')} />
            <KpiCard title="Rejected" value={stats?.rejected || 0} icon={XCircle} onClick={() => setStatusFilter?.('rejected')} />
            <KpiCard title="New Applied" value={stats?.pending || 0} icon={Clock} onClick={() => setStatusFilter?.('applied')} />
        </div>
    );
};

export default CandidateStats;
