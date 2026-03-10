import React from 'react';
import { Users, Mail, Shield, ChevronRight, ChevronDown, Loader2 } from 'lucide-react';
import Modal from '../../../../components/Modal';

const TeamMemberModal = ({
    isOpen,
    onClose,
    editingMember,
    formData,
    setFormData,
    vacancies,
    submitting,
    onSubmit
}) => {
    const roles = [
        { id: 'interviewer', label: 'Interviewer' },
        { id: 'hr', label: 'HR Manager' }
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={editingMember ? 'Update Authority' : 'Create Authority'}
            subtitle="Configure access levels and technical domains."
            size="md"
        >
            <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label htmlFor="member-name" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                        <div className="relative group">
                            <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#ff6e00] transition-colors" />
                            <input
                                id="member-name"
                                required
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-[#ff6e00] transition-all"
                                placeholder="e.g. John Doe"
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label htmlFor="member-email" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#ff6e00] transition-colors" />
                            <input
                                id="member-email"
                                required
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-[#ff6e00] transition-all"
                                placeholder="doe@embel.co.in"
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label htmlFor="member-password" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                            Password {editingMember && "(Leave blank to keep current)"}
                        </label>
                        <div className="relative group">
                            <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#ff6e00] transition-colors" />
                            <input
                                id="member-password"
                                required={!editingMember}
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-[#ff6e00] transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">System Role</label>
                        <div className="flex p-1 bg-slate-50 rounded-xl border border-slate-100">
                            {roles.map(r => (
                                <button
                                    key={r.id}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: r.id })}
                                    className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${formData.role === r.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    {r.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {formData.role === 'interviewer' && (
                    <div className="space-y-1.5 dropdown dropdown-hover w-full flex flex-col">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Technical Domain</label>
                        <div tabIndex={0} role="button" className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold flex items-center justify-between focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-[#ff6e00] transition-all cursor-pointer">
                            <span className={formData.domain ? "text-slate-900" : "text-slate-400"}>
                                {formData.domain ? vacancies.find(v => v.id === formData.domain)?.title : 'Select Domain Expertise'}
                            </span>
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                        </div>
                        <ul tabIndex={0} className="dropdown-content menu bg-white rounded-xl z-[100] w-full p-2 shadow-elevation-high border border-slate-100 mt-2">
                            <li><a onClick={() => setFormData({ ...formData, domain: '' })} className={!formData.domain ? 'active' : ''}>Select Domain Expertise</a></li>
                            {vacancies.map(v => (
                                <li key={v.id}>
                                    <a onClick={() => setFormData({ ...formData, domain: v.id })} className={formData.domain === v.id ? 'active' : ''}>{v.title}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="flex items-center gap-4 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-4 text-xs font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        Discard
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex-[2] py-4 bg-[#ff6e00] text-white font-black rounded-xl shadow-xl shadow-orange-500/20 hover:bg-[#e05d00] transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {submitting ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                {editingMember ? 'UPDATE ACCESS' : 'CONFIRM ACCESS'}
                                <ChevronRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default TeamMemberModal;
