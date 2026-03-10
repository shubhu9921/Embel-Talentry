import React from 'react';
import { Edit2, Trash2, CheckCircle2, Search } from 'lucide-react';
import Card from '../../../../components/Card';
import Badge from '../../../../components/Badge';

const QuestionTable = ({
    questions = [],
    vacancies = [],
    onToggleSelection,
    onEdit,
    onDelete
}) => {
    return (
        <Card className="border-none shadow-elevation-high overflow-hidden rounded-[2.5rem]" noPadding>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest w-20 text-center">Active</th>
                            <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest min-w-75">Question Details</th>
                            <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Vacancy</th>
                            <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Difficulty</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {questions.map((q) => (
                            <tr key={q.id} className={`group transition-all duration-300 ${q.selected ? 'bg-orange-50/10' : ''}`}>
                                <td className="px-8 py-6">
                                    <div className="flex justify-center">
                                        <button
                                            aria-label={q.selected ? "Deselect question" : "Select question"}
                                            onClick={() => onToggleSelection?.(q)}
                                            className={`w-6 h-6 rounded-lg transition-all flex items-center justify-center border-2 ${q.selected ? 'bg-[#ff6e00] border-[#ff6e00] text-white' : 'bg-white border-slate-200 text-transparent'}`}
                                        >
                                            <CheckCircle2 size={14} className={q.selected ? 'opacity-100' : 'opacity-0'} />
                                        </button>
                                    </div>
                                </td>
                                <td className="px-6 py-6">
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-slate-800 leading-relaxed group-hover:text-[#ff6e00] transition-colors">{q.text}</p>
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {(q.options || []).map((opt, i) => (
                                                <Badge
                                                    key={i}
                                                    variant={opt === q.correct ? 'success' : 'neutral'}
                                                    size="sm"
                                                    className="uppercase tracking-wider"
                                                >
                                                    {opt}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-6">
                                    <span className="px-3 py-1 bg-white border border-slate-200 text-slate-600 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm">
                                        {vacancies.find(v => v.id === q.position)?.title || q.position || 'N/A'}
                                    </span>
                                </td>
                                <td className="px-6 py-6">
                                    <Badge
                                        variant={q.level === 'Basic' ? 'success' : q.level === 'Intermediate' ? 'warning' : 'danger'}
                                        size="md"
                                        className="uppercase tracking-widest"
                                    >
                                        {q.level || 'General'}
                                    </Badge>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            aria-label="Edit Question"
                                            onClick={() => onEdit?.(q)}
                                            className="p-2.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                                            title="Edit"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            aria-label="Delete Question"
                                            onClick={() => onDelete?.(q.id)}
                                            className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {questions.length === 0 && (
                    <div className="text-center py-24 bg-white">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mx-auto mb-4">
                            <Search size={32} />
                        </div>
                        <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">No questions found matching criteria</p>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default QuestionTable;
