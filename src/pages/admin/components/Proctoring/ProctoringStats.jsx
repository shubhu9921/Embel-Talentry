import React from 'react';
import { Users, AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';
import KpiCard from '../../../../components/KpiCard';

const ProctoringStats = ({ candidates = [], violationCount = 0, terminatedCount = 0, clearCount = 0 }) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <KpiCard
                title="Total Active"
                value={(candidates?.length || 0).toString().padStart(2, '0')}
                icon={Users}
            />
            <KpiCard
                title="Violations Found"
                value={(violationCount || 0).toString().padStart(2, '0')}
                icon={AlertTriangle}
            />
            <KpiCard
                title="Terminated"
                value={(terminatedCount || 0).toString().padStart(2, '0')}
                icon={ShieldAlert}
            />
            <KpiCard
                title="Clear Exams"
                value={(clearCount || 0).toString().padStart(2, '0')}
                icon={CheckCircle2}
            />
        </div>
    );
};

export default ProctoringStats;
