import React from 'react';
import { Mail, Phone, Calendar, BookOpen, GraduationCap, History, Award, AlertCircle, ShieldCheck, Download, XCircle, CheckCircle2, Trash2 } from 'lucide-react';
import Modal from '../../../../components/Modal';
import Button from '../../../../components/Button';
import Badge from '../../../../components/Badge';

const CandidateDetailModal = ({
    isOpen,
    onClose,
    candidate,
    questions,
    onUpdateStatus,
    onScheduleInterview
}) => {
    if (!candidate) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Application Profile"
            size="xl"
        >
            <div className="space-y-8 py-2">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-5">
                        <div className="w-20 h-20 rounded-4xl bg-[#ff6e00] flex items-center justify-center text-white text-2xl font-black shadow-2xl shadow-[#ff6e00]/30">
                            {candidate.name?.charAt(0) || '?'}
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 leading-tight">{candidate.name}</h2>
                            <div className="flex items-center gap-3 mt-1.5">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{candidate.position}</span>
                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                <Badge variant={candidate.status === 'applied' ? 'success' : candidate.status === 'shortlisted' ? 'warning' : 'danger'} size="sm" className="uppercase tracking-widest">
                                    {candidate.status}
                                </Badge>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-2xl ring-1 ring-emerald-100 shadow-sm">
                            <span className="text-xs font-black uppercase tracking-widest text-emerald-400">Exam Score</span>
                            <span className="text-xl font-black">{candidate.examScore ?? '--'}</span>
                        </div>
                        <Button
                            variant="outline"
                            className="rounded-xl flex items-center gap-2 h-10 py-1 text-xs"
                            onClick={() => candidate.cvUrl && window.open(candidate.cvUrl, '_blank', 'noopener,noreferrer')}
                            disabled={!candidate.cvUrl}
                        >
                            <Download className="w-4 h-4" />
                            <span>{candidate.cvUrl ? 'Download CV' : 'No CV Available'}</span>
                        </Button>
                    </div>
                </div>

                {candidate.submissionReason && (
                    <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="w-5 h-5 text-[#ff6e00]" />
                            <div>
                                <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Assessment Integrity</p>
                                <p className="text-sm font-bold text-slate-700">{candidate.submissionReason}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Timestamp</p>
                            <p className="text-xs font-bold text-slate-500">
                                {candidate.submittedAt ? new Date(candidate.submittedAt).toLocaleString() : 'N/A'}
                            </p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pb-2 border-b border-slate-100">Contact Information</h3>
                        <div className="space-y-4">
                            {[
                                { icon: Mail, label: 'Email Address', value: candidate.email },
                                { icon: Phone, label: 'Phone Number', value: candidate.phone },
                                { icon: Calendar, label: 'Date of Birth', value: candidate.dob || 'Not provided' }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 group">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-orange-50 group-hover:text-[#ff6e00] transition-all">
                                        <item.icon size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</p>
                                        <p className="text-sm font-bold text-slate-900 mt-0.5">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pb-2 border-b border-slate-100">Academic Background</h3>
                        <div className="space-y-4">
                            {[
                                { icon: BookOpen, label: 'College / University', value: candidate.college || 'Not specified' },
                                { icon: GraduationCap, label: 'Degree / Specification', value: candidate.education }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 group">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-orange-50 group-hover:text-[#ff6e00] transition-all">
                                        <item.icon size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</p>
                                        <p className="text-sm font-bold text-slate-900 mt-0.5 uppercase">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-4 group">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-orange-50 group-hover:text-[#ff6e00] transition-all">
                                        <History size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Passing Year</p>
                                        <p className="text-sm font-bold text-slate-900 mt-0.5">{candidate.passingYear || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 group">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-orange-50 group-hover:text-[#ff6e00] transition-all">
                                        <Award size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">CGPA / %</p>
                                        <p className="text-sm font-bold text-slate-900 mt-0.5">{candidate.cgpa || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                            {candidate.activeBacklogs === 'yes' && (
                                <div className="flex items-center gap-4 group p-3 bg-red-50 rounded-2xl border border-red-100">
                                    <div className="w-10 h-10 rounded-xl bg-white text-red-500 flex items-center justify-center shadow-sm">
                                        <AlertCircle size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Active Backlogs</p>
                                        <p className="text-sm font-black text-red-600 mt-0.5">{candidate.backlogCount || 0} Pending</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-6 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assessment Detail</h3>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-lg text-[9px] font-black">{candidate.assignedQuestions?.length || 0} Questions Assigned</span>
                    </div>
                    {candidate.assignedQuestions?.length > 0 ? (
                        <div className="space-y-3">
                            {candidate.assignedQuestions.map(qId => {
                                const question = questions?.find(q => q.id === qId);
                                return question ? (
                                    <div key={qId} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start justify-between group/q">
                                        <div className="flex items-start gap-3">
                                            <div className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-400 shrink-0">
                                                {question.level?.charAt(0) || 'G'}
                                            </div>
                                            <p className="text-xs font-bold text-slate-700 leading-relaxed">{question.text}</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                const updated = candidate.assignedQuestions.filter(id => id !== qId);
                                                onUpdateStatus(candidate.id, candidate.status, { assignedQuestions: updated });
                                            }}
                                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-rose-50 rounded-lg opacity-0 group-hover/q:opacity-100 focus:opacity-100 transition-all shrink-0"
                                            aria-label="Remove question"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ) : null;
                            })}
                        </div>
                    ) : (
                        <div className="py-8 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No assessment data available</p>
                        </div>
                    )}
                </div>

                <div className="pt-8 border-t border-slate-100 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Button
                            onClick={() => onUpdateStatus(candidate.id, 'rejected')}
                            variant="danger"
                            className="rounded-xl px-6 flex items-center gap-2"
                            disabled={candidate.status === 'rejected'}
                        >
                            <XCircle className="w-4 h-4" />
                            <span>Reject</span>
                        </Button>
                        <Button
                            onClick={() => onUpdateStatus(candidate.id, 'shortlisted')}
                            variant="outline"
                            className="rounded-xl px-6 flex items-center gap-2 border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                            disabled={candidate.status === 'shortlisted'}
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Approve</span>
                        </Button>
                    </div>
                    <Button
                        onClick={onScheduleInterview}
                        className="rounded-xl px-8 bg-[#19325c] hover:bg-[#112445] flex items-center gap-2 border-none shadow-xl shadow-blue-900/10"
                    >
                        <Calendar className="w-4 h-4" />
                        <span>Schedule Interview</span>
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default CandidateDetailModal;
