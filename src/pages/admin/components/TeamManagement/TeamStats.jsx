import React from 'react';
import { Users } from 'lucide-react';
import KpiCard from '../../../../components/KpiCard';

const TeamStats = ({ count = 0 }) => {
    return (
        <KpiCard
            title="Internal Workforce"
            value={(count || 0).toString().padStart(2, '0')}
            icon={Users}
            className="w-full"
        />
    );
};

export default TeamStats;
