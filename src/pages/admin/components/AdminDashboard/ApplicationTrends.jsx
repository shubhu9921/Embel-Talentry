import React from 'react';
import { TrendingUp } from 'lucide-react';
import Card from '../../../../components/Card';

const ApplicationTrends = ({ totalCandidates }) => {
    return (
        <Card className="lg:col-span-2 p-8 border-none ring-1 ring-slate-100 shadow-premium hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100/50 rounded-lg text-[#ff6e00]">
                        <TrendingUp size={20} />
                    </div>
                    <h3 className="font-bold text-slate-900">Application Trends</h3>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#ff6e00]"></span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Applications</span>
                </div>
            </div>
            <div className="h-64 flex items-center justify-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                <div className="text-center">
                    <p className="text-slate-400 font-bold italic tracking-wider mb-2">Real-time Analytics View</p>
                    <p className="text-[10px] text-slate-400 uppercase font-black">Tracking {totalCandidates} Total Applicants</p>
                </div>
            </div>
        </Card>
    );
};

export default ApplicationTrends;
