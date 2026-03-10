import React from 'react';
import { Mail, Trash2, Briefcase, Phone } from 'lucide-react';
import Card from '../../../../components/Card';
import Badge from '../../../../components/Badge';

const CandidateCard = ({ candidate, onClick, onDelete }) => {
    const getStatusVariant = (status) => {
        switch (status) {
            case 'applied': return 'success';
            case 'shortlisted': return 'warning';
            case 'rejected': return 'danger';
            case 'hired': return 'primary';
            default: return 'neutral';
        }
    };

    return (
        <Card
            onClick={onClick}
            className={`p-8 border-none shadow-elevation-high ring-1 ring-slate-100 group transition-all duration-500 hover:ring-[#ff6e00] overflow-hidden relative ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100/20 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>

            <div className="flex items-start justify-between relative z-10 mb-8">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-4xl bg-[#ff6e00] flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-[#ff6e00]/20 transform group-hover:rotate-6 transition-transform">
                        {candidate.name?.charAt(0) || '?'}
                    </div>
                    <div className="space-y-1.5">
                        <h3 className="text-xl font-black text-slate-900 group-hover:text-[#ff6e00] transition-colors">{candidate.name || 'Anonymous candidate'}</h3>
                        <div className="flex items-center gap-2 text-slate-400">
                            <Mail className="w-3.5 h-3.5" />
                            <span className="text-xs font-bold">{candidate.email || 'No email provided'}</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                    <div className="flex items-center gap-2">
                        <Badge variant={getStatusVariant(candidate.status)} size="sm" className="uppercase tracking-widest">
                            {candidate.status}
                        </Badge>
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete?.(candidate.id); }}
                            className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                            aria-label="Delete candidate"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl ring-1 ring-emerald-100 shadow-sm transition-all group-hover:bg-emerald-500 group-hover:text-white group-hover:ring-emerald-500">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Score</span>
                        <span className="text-sm font-black leading-none">{candidate.examScore ?? '--'}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-6 pt-6 border-t border-slate-100 relative z-10">
                <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Position</p>
                    <div className="flex items-center gap-2.5 text-slate-700">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-[#ff6e00]">
                            <Briefcase className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-bold capitalize">{candidate.position || 'Not specified'}</span>
                    </div>
                </div>
                <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Contact Status</p>
                    <div className="flex items-center gap-2.5 justify-end text-slate-700">
                        <span className="text-sm font-bold">{candidate.phone || 'No phone info'}</span>
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600" title="Contact Verification Status">
                            <Phone className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default CandidateCard;
