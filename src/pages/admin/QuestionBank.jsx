import React, { useState, useEffect } from 'react';
import { Plus, Search, ArrowLeft } from 'lucide-react';
import ApiService from '../../services/ApiService';
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import PageHeader from '../../components/PageHeader';

// Modular Components
import QuestionStats from './components/QuestionBank/QuestionStats';
import QuestionFilters from './components/QuestionBank/QuestionFilters';
import QuestionTable from './components/QuestionBank/QuestionTable';
import QuestionArchitect from './components/QuestionBank/QuestionArchitect';

const QuestionBank = () => {
    const [questions, setQuestions] = useState([]);
    const [vacancies, setVacancies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPosition, setSelectedPosition] = useState('all');
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        id: '', position: '', type: 'mcq', level: 'Basic', text: '', options: ['', '', '', ''], correct: '', selected: false
    });

    const [bulkConfig, setBulkConfig] = useState({ position: '', level: 'Basic' });
    const [rows, setRows] = useState([]);
    const [notification, setNotification] = useState(null);

    const showNotification = (message, type = 'info') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 5000);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [qData, vData] = await Promise.all([
                ApiService.get('/api/admin/questions'),
                ApiService.get('/api/vacancies')
            ]);
            
            // Map Backend fields to Frontend expected fields
            const mappedQuestions = (qData || []).map(q => ({
                ...q,
                text: q.questionText || '',
                correct: q.correctAnswer ? String(q.correctAnswer.charCodeAt(0) - 65) : '',
                level: q.difficulty || 'Basic'
            }));

            setQuestions(mappedQuestions);
            setVacancies(vData || []);
        } catch (error) {
            console.error('Error fetching data:', error);
            showNotification('Failed to load data from server. Please refresh.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleSelection = async (question) => {
        try {
            const updated = { ...question, selected: !question.selected };
            // Mapping back for persistence
            const payload = {
                ...updated,
                questionText: updated.text,
                correctAnswer: String.fromCharCode(65 + parseInt(updated.correct)),
                difficulty: updated.level
            };
            await ApiService.put(`/api/admin/questions/${question.id}`, payload);
            setQuestions(prev => prev.map(q => q.id === question.id ? updated : q));
        } catch (error) {
            console.error('Error toggling status:', error);
            showNotification('Failed to update question status.', 'error');
        }
    };

    const handleBulkSelect = async (select) => {
        try {
            const filtered = [...filteredQuestions];
            const updatedQuestions = [];
            
            // Sequential processing is more stable for json-server file writes
            for (const q of filtered) {
                try {
                    const updated = { ...q, selected: select };
                    await ApiService.put(`/questions/${q.id}`, updated);
                    updatedQuestions.push(updated);
                } catch (err) {
                    console.error(`Failed to update question ${q.id}:`, err);
                }
            }

            const mappedQuestions = questions.map(q => {
                const update = updatedQuestions.find(u => u.id === q.id);
                return update || q;
            });
            setQuestions(mappedQuestions);

            const message = updatedQuestions.length < filtered.length 
                ? `Updated ${updatedQuestions.length} of ${filtered.length} questions. Some failed.`
                : 'Bulk update successful!';
            const type = updatedQuestions.length < filtered.length ? 'warning' : 'success';
            showNotification(message, type);
        } catch (error) {
            console.error('Error in bulk update:', error);
            showNotification('Failed to perform bulk update.', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (!globalThis.confirm('Delete this question?')) return;
        try {
            await ApiService.delete(`/api/admin/questions/${id}`);
            setQuestions(prev => prev.filter(q => q.id !== id));
            showNotification('Question deleted successfully.', 'success');
        } catch (error) {
            console.error('Error deleting:', error);
            showNotification('Failed to delete question.', 'error');
        }
    };


    const [viewMode, setViewMode] = useState('pool'); // 'pool' or 'architect'

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setSubmitting(true);
        try {
            if (formData.id) {
                const payload = {
                    ...formData,
                    questionText: formData.text,
                    correctAnswer: String.fromCharCode(65 + parseInt(formData.correct)),
                    difficulty: formData.level
                };
                await ApiService.put(`/api/admin/questions/${formData.id}`, payload);
                showNotification('Question updated successfully.', 'success');
            } else {
                if (!bulkConfig.position) return showNotification('Please select a target vacancy first.', 'warning');
                
                const validRows = rows.filter(r => r.text.trim());
                if (validRows.length === 0) return showNotification('Please add at least one question.', 'warning');

                await Promise.all(validRows.map(row => {
                    const payload = {
                        questionText: row.text,
                        correctAnswer: String.fromCharCode(65 + parseInt(row.correct)),
                        difficulty: bulkConfig.level,
                        position: bulkConfig.position,
                        type: 'mcq'
                    };
                    return ApiService.post('/api/admin/questions', payload);
                }));
                showNotification(`${validRows.length} questions added successfully.`, 'success');
            }
            fetchData();
            setViewMode('pool');
            setFormData({ id: '', position: '', type: 'mcq', level: 'Basic', text: '', options: ['', '', '', ''], correct: '', selected: false });
            setRows([]);
            setBulkConfig({ position: '', level: 'Basic' });
        } catch (error) {
            console.error('Error saving:', error);
            showNotification('Failed to save. Please check your network.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (q) => {
        // Prepare for architect view in "edit" mode (single row)
        setFormData(q);
        setBulkConfig({ position: q.position, level: q.level });
        setRows([{ ...q, tempId: q.id }]);
        setViewMode('architect');
    };

    const handleArchitectMode = () => {
        setFormData({ id: '', position: '', type: 'mcq', level: 'Basic', text: '', options: ['', '', '', ''], correct: '', selected: false });
        setBulkConfig({ position: selectedPosition === 'all' ? '' : selectedPosition, level: 'Basic' });
        setRows([{ tempId: Date.now(), text: '', options: ['', '', '', ''], correct: '' }]);
        setViewMode('architect');
    };

    const filteredQuestions = React.useMemo(() => {
        const lowerSearch = searchTerm.toLowerCase();
        return questions.filter(q => {
            const matchesSearch = q.text.toLowerCase().includes(lowerSearch);
            const matchesPosition = selectedPosition === 'all' || q.position === selectedPosition;
            return matchesSearch && matchesPosition;
        });
    }, [questions, searchTerm, selectedPosition]);

    const activeCount = React.useMemo(() => questions.filter(q => q.selected).length, [questions]);
    if (loading) return <Loader />;

    return (
        <div className="space-y-6 page-fade-in min-h-screen">
            <PageHeader
                title={viewMode === 'pool' ? "Question Bank" : "Architect Assessment"}
                subtitle={viewMode === 'pool' ? "Manage and curate vacancy-specific assessment pools." : "Create and configure high-quality assessment questions."}
                actions={
                    <div className="flex items-center gap-3">
                        {viewMode === 'pool' && (
                            <>
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
                                    variant="secondary"
                                    onClick={handleArchitectMode}
                                >
                                    Architect Questions
                                </Button>
                            </>
                        )}
                        {viewMode === 'architect' && (
                            <Button variant="ghost" onClick={() => setViewMode('pool')} icon={ArrowLeft}>
                                Back to Pool
                            </Button>
                        )}
                    </div>
                }
            />

            {viewMode === 'pool' ? (
                <>
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
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </>
            ) : (
                <QuestionArchitect
                    vacancies={vacancies}
                    bulkConfig={bulkConfig}
                    setBulkConfig={setBulkConfig}
                    rows={rows}
                    setRows={setRows}
                    onSubmit={handleSubmit}
                    submitting={submitting}
                    onBack={() => setViewMode('pool')}
                />
            )}

            {notification && (() => {
                const { type, message } = notification;
                let bgClass = 'bg-emerald-50 border-emerald-100 text-emerald-600';
                let dotClass = 'bg-emerald-500';

                if (type === 'error') {
                    bgClass = 'bg-rose-50 border-rose-100 text-rose-600';
                    dotClass = 'bg-rose-500';
                } else if (type === 'warning') {
                    bgClass = 'bg-orange-50 border-orange-100 text-orange-600';
                    dotClass = 'bg-orange-500';
                }

                return (
                    <div className={`fixed bottom-8 right-8 px-6 py-4 rounded-2xl shadow-2xl z-50 animate-in slide-in-from-bottom-4 duration-300 flex items-center gap-3 border ${bgClass}`}>
                        <div className={`w-2 h-2 rounded-full ${dotClass}`} />
                        <span className="text-sm font-bold">{message}</span>
                    </div>
                );
            })()}
        </div>
    );
};

export default QuestionBank;
