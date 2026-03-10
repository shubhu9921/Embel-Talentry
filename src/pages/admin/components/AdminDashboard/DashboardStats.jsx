import React from 'react';
import { Users, FileUser, CheckCircle2, Clock } from 'lucide-react';
import KpiCard from '../../../../components/KpiCard';

const DashboardStats = ({ data = {} }) => {
    const getTrend = (val) => String(val || '').startsWith('-') ? 'down' : 'up';

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <KpiCard
                title="Total Candidates"
                value={data?.totalCandidates || 0}
                change={data?.candidateTrend}
                trend={getTrend(data?.candidateTrend)}
                icon={Users}
            />
            <KpiCard
                title="Active Assessments"
                value={data?.activeAssessments || 0}
                change={data?.assessmentTrend}
                trend={getTrend(data?.assessmentTrend)}
                icon={FileUser}
            />
            <KpiCard
                title="Interviews Completed"
                value={data?.interviewsCompleted || 0}
                change={data?.interviewTrend}
                trend={getTrend(data?.interviewTrend)}
                icon={CheckCircle2}
            />
            <KpiCard
                title="Avg. Time to Hire"
                value={data?.avgTimeToHire || 'N/A'}
                change={data?.timeTrend}
                trend={getTrend(data?.timeTrend)}
                icon={Clock}
            />
        </div>
    );
};

export default DashboardStats;
