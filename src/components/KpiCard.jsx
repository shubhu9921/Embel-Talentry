import React from 'react';
import Card from './Card';

const KpiCard = ({ title, value, change, trend, icon: Icon, onClick, className = '' }) => {
    return (
        <Card
            onClick={onClick}
            className={`p-4 border-none cursor-pointer group bg-white ${className}`}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-black text-[#19325c] uppercase tracking-widest block truncate">{title}</span>
                    <p className="text-2xl font-black text-[#19325c] mt-1 truncate">{value}</p>

                    {change && (
                        <div className="flex items-center gap-1.5 mt-2">
                            <span className={`text-[10px] font-bold ${trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {trend === 'up' ? '↑' : '↓'} {change}
                            </span>
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">vs last month</span>
                        </div>
                    )}
                </div>
                <div className="w-10 h-10 rounded-xl bg-orange-100/50 flex items-center justify-center text-[#ff6e00] shadow-sm shrink-0 group-hover:bg-[#ff6e00] group-hover:text-white transition-colors duration-300">
                    {Icon && <Icon size={20} />}
                </div>
            </div>
        </Card>
    );
};

export default KpiCard;
