import React from 'react';
import { Briefcase, CheckCircle2, Users } from 'lucide-react';
import KpiCard from '../../../../components/KpiCard';

const VacancyStats = ({ stats = {} }) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <KpiCard
                title="Total Openings"
                value={(stats?.total || 0).toString().padStart(2, '0')}
                icon={Briefcase}
            />
            <KpiCard
                title="Currently Hiring"
                value={(stats?.active || 0).toString().padStart(2, '0')}
                icon={CheckCircle2}
            />
            <KpiCard
                title="Total Applicants"
                value={(stats?.applicants || 0).toString().padStart(2, '0')}
                icon={Users}
            />
        </div>
    );
};

export default VacancyStats;
