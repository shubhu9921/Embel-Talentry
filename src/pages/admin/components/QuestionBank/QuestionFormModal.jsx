import React, { useRef } from 'react';
import { ChevronDown, Briefcase, Layers, Upload, Trash2, Plus, ArrowRight } from 'lucide-react';
import Modal from '../../../../components/Modal';
import Button from '../../../../components/Button';
import Loader from '../../../../components/Loader';

const QuestionFormModal = ({
    isOpen, onClose, formData, setFormData,
    bulkConfig, setBulkConfig, rows, setRows,
    vacancies, onSubmit, submitting
}) => {
    const fileInputRef = useRef(null);

    const handleCSVImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target.result;
            const lines = content.split(/\r?\n/);
            const dataRows = lines.slice(1).filter(line => line.trim());

            const newQuestions = dataRows.map(line => {
                const columns = [];
                let current = '';
                let inQuotes = false;
                for (let i = 0; i < line.length; i++) {
                    const char = line[i];
                    if (char === '"' && line[i + 1] === '"') {
                        current += '"';
                        i++; // skip escaped quote
                    } else if (char === '"') {
                        inQuotes = !inQuotes;
                    } else if (char === ',' && !inQuotes) {
                        columns.push(current.trim());
                        current = '';
                    } else {
                        current += char;
                    }
                }
                columns.push(current.trim());

                if (columns.length < 6) return null;
                return {
                    tempId: Date.now() + Math.random(),
                    text: columns[0],
                    options: [columns[1], columns[2], columns[3], columns[4]],
                    correct: columns[5]
                };
            }).filter(q => q !== null);

            if (newQuestions.length > 0) {
                // Keep rows that have any content (text, correct answer, or any non-empty option)
                setRows(prev => [
                    ...prev.filter(r => r.text?.trim() || r.correct?.trim() || r.options.some(o => o?.trim())),
                    ...newQuestions
                ]);
            }
        };
        reader.onerror = () => {
            console.error("FileReader error occurred");
            alert("An error occurred while reading the file. Please check if the file is corrupted.");
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    const addRow = () => setRows([...rows, { tempId: Date.now() + Math.random(), text: '', options: ['', '', '', ''], correct: '' }]);
    const removeRow = (index) => rows.length > 1 && setRows(rows.filter((_, i) => i !== index));
    const updateRow = (index, field, value) => {
        const newRows = [...rows];
        newRows[index] = { ...newRows[index], [field]: value };
        setRows(newRows);
    };
    const updateOption = (rowIndex, optIndex, value) => {
        const newRows = [...rows];
        const newOptions = [...newRows[rowIndex].options];
        newOptions[optIndex] = value;
        newRows[rowIndex] = { ...newRows[rowIndex], options: newOptions };
        setRows(newRows);
    };

    const DropdownSelect = ({ label, value, options, onSelect, placeholder, required = false }) => (
        <div className="space-y-2 relative">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
            <div className="relative dropdown dropdown-hover w-full">
                <input type="text" className="hidden" required={required} value={value || ''} readOnly />
                <div tabIndex={0} role="button" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold flex items-center justify-between transition-all cursor-pointer">
                    <span>{value || placeholder}</span>
                    <ChevronDown size={14} />
                </div>
                <ul tabIndex={0} className="dropdown-content menu bg-white rounded-2xl z-100 w-full p-2 shadow-lg border border-slate-100 mt-2">
                    {options.map(opt => (
                        <li key={opt.id || opt}><a onClick={() => onSelect(opt.id || opt)} className={value === (opt.label || opt) ? 'active' : ''}>{opt.label || opt}</a></li>
                    ))}
                </ul>
            </div>
        </div>
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={formData.id ? 'Edit Question' : 'Bulk Import Questions'} size="xl">
            <form onSubmit={onSubmit} className="flex flex-col h-full max-h-[80vh]">
                {!formData.id && (
                    <div className="bg-slate-900 p-6 rounded-3xl mb-6 flex flex-col md:flex-row gap-6 items-center">
                        <div className="flex-1 grid grid-cols-2 gap-4">
                            <DropdownSelect label="Vacancy" value={vacancies.find(v => v.id === bulkConfig.position)?.title} options={vacancies.map(v => ({ id: v.id, label: v.title }))} onSelect={id => setBulkConfig({ ...bulkConfig, position: id })} placeholder="Select Vacancy" />
                            <DropdownSelect label="Level" value={bulkConfig.level} options={['Basic', 'Intermediate', 'Advanced']} onSelect={l => setBulkConfig({ ...bulkConfig, level: l })} placeholder="Select Level" />
                        </div>
                        <Button type="button" onClick={() => fileInputRef.current.click()} variant="secondary" size="lg" className="rounded-2xl shrink-0">
                            <Upload className="mr-2" size={16} /> Import CSV
                        </Button>
                        <input type="file" ref={fileInputRef} onChange={handleCSVImport} accept=".csv" className="hidden" />
                    </div>
                )}
                <div className="flex-1 overflow-y-auto px-1 scrollbar-hide">
                    {formData.id ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <DropdownSelect label="Vacancy" value={vacancies.find(v => v.id === formData.position)?.title} options={vacancies.map(v => ({ id: v.id, label: v.title }))} onSelect={id => setFormData({ ...formData, position: id })} placeholder="Select Vacancy" />
                                <DropdownSelect label="Level" value={formData.level} options={['Basic', 'Intermediate', 'Advanced']} onSelect={l => setFormData({ ...formData, level: l })} placeholder="Select Level" />
                            </div>
                            <textarea required value={formData.text} onChange={e => setFormData({ ...formData, text: e.target.value })} placeholder="Question Text" className="w-full p-4 bg-slate-50 border rounded-2xl text-sm font-medium h-32 outline-none" />
                            <div className="grid grid-cols-2 gap-4">
                                {formData.options.map((opt, i) => (
                                    <input key={i} required value={opt} onChange={e => { const newOps = [...formData.options]; newOps[i] = e.target.value; setFormData({ ...formData, options: newOps }); }} placeholder={String.fromCharCode(65 + i)} className="p-3.5 bg-slate-50 border rounded-2xl text-sm font-medium outline-none" />
                                ))}
                            </div>
                            <DropdownSelect label="Correct Option" value={formData.correct} options={formData.options.filter(o => o)} onSelect={opt => setFormData({ ...formData, correct: opt })} placeholder="Select Correct Answer" />
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {rows.map((row, i) => (
                                <div key={row.tempId} className="flex gap-2 items-start border-b pb-4 border-slate-100">
                                    <div className="flex-1 space-y-2">
                                        <textarea required rows={1} value={row.text} onChange={e => updateRow(i, 'text', e.target.value)} placeholder="Question" className="w-full p-3 bg-slate-50 border rounded-xl text-xs outline-none" />
                                        <div className="grid grid-cols-4 gap-2">
                                            {row.options.map((opt, j) => <input key={j} required value={opt} onChange={e => updateOption(i, j, e.target.value)} placeholder={String.fromCharCode(65 + j)} className="p-2 bg-slate-50 border rounded-xl text-[10px] outline-none" />)}
                                        </div>
                                    </div>
                                    <div className="w-32">
                                        <select required value={row.correct} onChange={e => updateRow(i, 'correct', e.target.value)} className="w-full p-3 bg-orange-50 text-[#ff6e00] rounded-xl text-[10px] font-bold outline-none border-none">
                                            <option value="">Correct</option>
                                            {row.options.map((opt, j) => opt && <option key={j} value={opt}>{String.fromCharCode(65 + j)}</option>)}
                                        </select>
                                    </div>
                                    <button type="button" onClick={() => removeRow(i)} className="p-3 text-slate-300 hover:text-red-500"><Trash2 size={16} /></button>
                                </div>
                            ))}
                            <Button type="button" onClick={addRow} variant="ghost" className="w-full border-2 border-dashed border-slate-200 rounded-2xl py-6 mt-4">
                                <Plus size={16} className="mr-2" /> Add Question
                            </Button>
                        </div>
                    )}
                </div>
                <div className="flex justify-end pt-6 mt-4 border-t">
                    <Button type="submit" loading={submitting} size="lg" className="rounded-2xl px-12">
                        {formData.id ? 'Save Changes' : 'Publish Questions'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default QuestionFormModal;
