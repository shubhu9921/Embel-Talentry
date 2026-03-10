import React from 'react';
import { FileQuestion } from 'lucide-react';
import KpiCard from '../../../../components/KpiCard';

const QuestionStats = ({ activeCount = 0 }) => {
    return (
        <KpiCard
            title="Active Pool"
            value={(activeCount || 0).toString().padStart(2, '0')}
            icon={FileQuestion}
            className="h-full"
        />
    );
};

export default QuestionStats;
