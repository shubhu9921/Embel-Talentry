import React from 'react';
import { Filter, ChevronDown, CheckSquare, Square } from 'lucide-react';

const QuestionFilters = ({
    selectedPosition,
    setSelectedPosition,
    vacancies,
    onBulkSelect,
    stats: { active = 0, inactive = 0 } = {}
}) => {
    return (
        <div className="lg:col-span-3 bg-white rounded-[2rem] shadow-elevation-high border border-slate-100 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 w-full md:w-auto">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2">Filter by Vacancy</p>
                <div className="relative dropdown dropdown-hover w-full">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none z-10" />
                    <div tabIndex={0} role="button" className="w-full pl-11 pr-10 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold flex items-center justify-between focus:outline-none focus:border-[#ff6e00] transition-all cursor-pointer">
                        <span>{selectedPosition === 'all' ? 'All Vacancies' : (vacancies.find(v => v.id === selectedPosition)?.title || 'All Vacancies')}</span>
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                    </div>
                    <ul tabIndex={0} className="dropdown-content menu bg-white rounded-2xl z-[100] w-full p-2 shadow-elevation-high border border-slate-100 mt-2">
                        <li>
                            <button onClick={() => setSelectedPosition('all')} className={selectedPosition === 'all' ? 'active w-full text-left' : 'w-full text-left'}>All Vacancies</button>
                        </li>
                        {vacancies.map(v => (
                            <li key={v.id}>
                                <button onClick={() => setSelectedPosition(v.id)} className={selectedPosition === v.id ? 'active w-full text-left' : 'w-full text-left'}>{v.title}</button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="flex items-center gap-4 mt-3 ml-2">
                    <div className="flex items-center gap-1.5 text-emerald-600 font-bold uppercase tracking-widest text-[10px]">
                        <span>{active} Active</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                        <span>{inactive} Inactive</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
                <button
                    onClick={() => onBulkSelect(true)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-orange-50 text-[#ff6e00] font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-orange-100 transition-all active:scale-95"
                >
                    <CheckSquare size={16} /> Activate All
                </button>
                <button
                    onClick={() => onBulkSelect(false)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-slate-50 text-slate-400 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95"
                >
                    <Square size={16} /> Deactivate All
                </button>
            </div>
        </div>
    );
};

export default QuestionFilters;
