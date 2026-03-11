import React, { useState, useEffect } from 'react';
import { FileText, Plus, Search } from 'lucide-react';
import ApiService from '../../services/ApiService';
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import PageHeader from '../../components/PageHeader';

// Modular Components
import QuestionStats from './components/QuestionBank/QuestionStats';
import QuestionFilters from './components/QuestionBank/QuestionFilters';
import QuestionTable from './components/QuestionBank/QuestionTable';
import QuestionFormModal from './components/QuestionBank/QuestionFormModal';

const QuestionBank = () => {
    const [questions, setQuestions] = useState([]);
    const [vacancies, setVacancies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPosition, setSelectedPosition] = useState('all');
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        id: '', position: '', type: 'mcq', level: 'Basic', text: '', options: ['', '', '', ''], correct: '', selected: false
    });

    const [bulkConfig, setBulkConfig] = useState({ position: '', level: 'Basic' });
    const [rows, setRows] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [qData, vData] = await Promise.all([
                ApiService.get('/questions'),
                ApiService.get('/vacancies')
            ]);
            setQuestions(qData);
            setVacancies(vData);
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Failed to load data from server. Please refresh.');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleSelection = async (question) => {
        try {
            const updated = { ...question, selected: !question.selected };
            await ApiService.put(`/questions/${question.id}`, updated);
            setQuestions(prev => prev.map(q => q.id === question.id ? updated : q));
        } catch (error) {
            console.error('Error toggling status:', error);
            alert('Failed to update question status. Please try again.');
        }
    };

    const handleBulkSelect = async (select) => {
        try {
            const filtered = filteredQuestions;
            const updates = filtered.map(q => ({ ...q, selected: select }));
            await Promise.all(updates.map(u => ApiService.put(`/questions/${u.id}`, u)));
            setQuestions(prev => prev.map(q => {
                const update = updates.find(u => u.id === q.id);
                return update ? update : q;
            }));
        } catch (error) {
            console.error('Error in bulk update:', error);
            alert('Failed to perform bulk update. Some questions might not have been updated.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (formData.id) {
                await ApiService.put(`/questions/${formData.id}`, formData);
            } else {
                if (!bulkConfig.position) return alert('Select vacancy');
                await Promise.all(rows.map(row => ApiService.post('/questions', {
                    ...row,
                    position: bulkConfig.position,
                    level: bulkConfig.level,
                    type: 'mcq',
                    id: `q-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
                    selected: false
                })));
            }
            fetchData();
            setIsModalOpen(false);
            setFormData({ id: '', position: '', type: 'mcq', level: 'Basic', text: '', options: ['', '', '', ''], correct: '', selected: false });
            setRows([]);
        } catch (error) {
            console.error('Error saving:', error);
            alert('Failed to save question(s). Please check your input and network connection.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this question?')) return;
        try {
            await ApiService.delete(`/questions/${id}`);
            setQuestions(prev => prev.filter(q => q.id !== id));
        } catch (error) {
            console.error('Error deleting:', error);
            alert('Failed to delete question. It might be referenced elsewhere.');
        }
    };

    const filteredQuestions = questions.filter(q => {
        const matchesSearch = q.text.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPosition = selectedPosition === 'all' || q.position === selectedPosition;
        return matchesSearch && matchesPosition;
    });

    const activeCount = questions.filter(q => q.selected).length;


    return (
        <div className="space-y-6 page-fade-in">
            <PageHeader
                title="Question Bank"
                subtitle="Manage and curate vacancy-specific assessment pools."
                actions={
                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#ff6e00] transition-colors" />
                            <input
                                type="text"
                                placeholder="Search keywords..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-[#ff6e00] transition-all w-64 shadow-sm"
                            />
                        </div>
                        <Button
                            icon={Plus}
                            onClick={() => {
                                setFormData({ id: '', position: '', type: 'mcq', level: 'Basic', text: '', options: ['', '', '', ''], correct: '', selected: false });
                                setBulkConfig({ position: selectedPosition === 'all' ? '' : selectedPosition, level: 'Basic' });
                                setRows([{ tempId: Date.now(), text: '', options: ['', '', '', ''], correct: '' }]);
                                setIsModalOpen(true);
                            }}
                            className="rounded-xl shadow-orange-500/20 shadow-2xl"
                        >
                            Architect Questions
                        </Button>
                    </div>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <QuestionStats activeCount={activeCount} />
                <QuestionFilters
                    selectedPosition={selectedPosition}
                    setSelectedPosition={setSelectedPosition}
                    vacancies={vacancies}
                    onBulkSelect={handleBulkSelect}
                    stats={{
                        active: filteredQuestions.filter(q => q.selected).length,
                        inactive: filteredQuestions.filter(q => !q.selected).length
                    }}
                />
            </div>

            <QuestionTable
                questions={filteredQuestions}
                vacancies={vacancies}
                onToggleSelection={handleToggleSelection}
                onEdit={(q) => { setFormData(q); setIsModalOpen(true); }}
                onDelete={handleDelete}
            />

            <QuestionFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                formData={formData}
                setFormData={setFormData}
                bulkConfig={bulkConfig}
                setBulkConfig={setBulkConfig}
                rows={rows}
                setRows={setRows}
                vacancies={vacancies}
                onSubmit={handleSubmit}
                submitting={submitting}
            />
        </div>
    );
};

export default QuestionBank;
