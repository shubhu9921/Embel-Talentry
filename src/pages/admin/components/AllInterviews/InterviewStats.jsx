import React from 'react';
import { Calendar, Clock, CheckCircle, Filter } from 'lucide-react';
import KpiCard from '../../../../components/KpiCard';

const InterviewStats = ({ stats = {} }) => {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <KpiCard
                title="Total Sessions"
                value={(stats?.total || 0).toString().padStart(2, '0')}
                icon={Calendar}
            />
            <KpiCard
                title="Upcoming"
                value={(stats?.upcoming || 0).toString().padStart(2, '0')}
                icon={Clock}
            />
            <KpiCard
                title="Completed"
                value={(stats?.completed || 0).toString().padStart(2, '0')}
                icon={CheckCircle}
            />
            <KpiCard
                title="Canceled"
                value={(stats?.canceled || 0).toString().padStart(2, '0')}
                icon={Filter}
            />
        </div>
    );
};

export default InterviewStats;
