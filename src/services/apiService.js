import api from './api';

const ApiService = {
    get: (url) => api.get(url).then(res => res.data).catch(err => {
        console.error(`API Get Error [${url}]:`, err);
        throw err;
    }),
    post: (url, data) => api.post(url, data).then(res => res.data).catch(err => {
        console.error(`API Post Error [${url}]:`, err);
        throw err;
    }),
    put: (url, data) => api.put(url, data).then(res => res.data).catch(err => {
        console.error(`API Put Error [${url}]:`, err);
        throw err;
    }),
    patch: (url, data) => api.patch(url, data).then(res => res.data).catch(err => {
        console.error(`API Patch Error [${url}]:`, err);
        throw err;
    }),
    delete: (url) => api.delete(url).then(res => res.data).catch(err => {
        console.error(`API Delete Error [${url}]:`, err);
        throw err;
    }),

    async uploadResume(candidateId, formData) {
        return api.post(`/api/candidates/${candidateId}/resume`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    // Specific methods
    getUsers: () => api.get('/api/admin/users').then(res => res.data),
    async updateAdminUser(id, data) {
        return api.put(`/api/admin/users/${id}`, data);
    },

    // Phase 5: Exam Flow (Guide Alignment)
    async startExam(candidateId) {
        return api.post(`/api/exam/start/${candidateId}`);
    },

    async getQuestions(candidateId) {
        return api.get(`/api/exam/questions/${candidateId}`);
    },

    async saveAnswer(candidateId, questionId, selectedAnswer) {
        return api.post('/api/exam/answer', { candidateId, questionId, selectedAnswer });
    },

    async submitExam(candidateId) {
        return api.post(`/api/exam/submit/${candidateId}`);
    },

    // Phase 6 & Proctoring (Guide Alignment)
    async logProctoringEvent(candidateId, eventType, eventDetails) {
        return api.post('/api/proctoring/log', { candidateId, eventType, eventDetails });
    },

    // Phase 8 & 9: HR & Interviewer Decisions (Guide Alignment)
    async submitInterviewerFeedback(feedback) {
        return api.post('/api/interviewer/feedback', feedback);
    },

    async submitHrDecision(decision) {
        return api.post('/api/hr/decision', decision);
    },

    async getHrCandidates() {
        return api.get('/api/hr/candidates');
    },

    async scheduleInterview(candidateId, interviewData) {
        // Guide mentions no backend endpoint yet, keeping as placeholder or matching potential team controller
        return api.post('/api/interviews/schedule', { candidateId, ...interviewData });
    },

    // Spring Boot Auth Integration
    login: async (email, password) => {
        try {
            const data = await api.post('/api/auth/login', { email, password }).then(res => res.data);
            
            if (data && data.token) {
                // Guide Step 4: roleMap strictly matching RoleType enum
                const roleMap = {
                    'ROLE_SUPER_ADMIN': 'superadmin',
                    'ROLE_HR':          'hr',
                    'ROLE_INTERVIEWER': 'interviewer',
                };
                
                const role = roleMap[data.role] || data.role.replace('ROLE_','').toLowerCase();
                
                // Guide Step 4: THIS IS CRITICAL - interceptor reads 'user'
                localStorage.setItem('user', JSON.stringify({ token: data.token }));
                
                sessionStorage.setItem('isAuthenticated', 'true');
                sessionStorage.setItem('userRole', role);
                sessionStorage.setItem('userId', String(data.userId));
                sessionStorage.setItem('userName', data.name);
                localStorage.setItem('admin_user', JSON.stringify(data));

                return { 
                    user: { id: data.userId, email, role: data.role }, 
                    type: role === 'candidate' ? 'candidate' : 'staff' 
                };
            }
            return null;
        } catch (error) {
            console.error('Login Error:', error);
            const message = error.response?.data?.message || 'Invalid email or password.';
            throw new Error(message);
        }
    }
};

export default ApiService;
