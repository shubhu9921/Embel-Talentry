import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import Modal from '../../../../components/Modal';
import Button from '../../../../components/Button';

const VacancyFormModal = ({ isOpen, onClose, formData = {}, setFormData, onSubmit }) => {
    const formId = "vacancy-form";

    const footer = (
        <Button 
            type="submit" 
            form={formId}
            variant="secondary" 
            icon={CheckCircle2}
            className="w-full sm:w-auto min-w-[200px]"
        >
            {formData.id ? 'Save Changes' : 'Publish Vacancy'}
        </Button>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={formData.id ? 'Update Position' : 'Create New Vacancy'}
            size="md"
            footer={footer}
        >
            <form id={formId} onSubmit={onSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label htmlFor="vacancy-title" className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Job Title</label>
                    <input
                        id="vacancy-title"
                        required
                        type="text"
                        value={formData.position || ''}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        placeholder="e.g. Senior Frontend Engineer"
                        className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all outline-none"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="vacancy-desc" className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Description & Requirements</label>
                    <textarea
                        id="vacancy-desc"
                        required
                        rows={6}
                        value={formData.description || ''}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Describe the role and key requirements..."
                        className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all outline-none resize-none"
                    />
                </div>
            </form>
        </Modal>
    );
};

export default VacancyFormModal;
