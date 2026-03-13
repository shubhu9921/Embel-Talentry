import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8083'
});

const RESOURCE_MAP = {
    'admin/questions': 'questions',
    'admin/users': 'users',
    'admin/vacancies': 'vacancies',
    'hr/candidates': 'candidates',
    'exam/questions': 'questions',
    'candidates/register': 'candidates',
    'candidates': 'candidates'
};

const cleanResource = (resource) => {
    let path = resource.replace('/api', '').split('?')[0];
    path = path.replace(/^\/+|\/+$/g, '');
    
    const parts = path.split('/');
    // Check prefixes from longest to shortest
    for (let i = parts.length; i > 0; i--) {
        const prefix = parts.slice(0, i).join('/');
        if (RESOURCE_MAP[prefix]) {
            const mapped = RESOURCE_MAP[prefix];
            const remaining = parts.slice(i).join('/');
            return remaining ? `${mapped}/${remaining}` : mapped;
        }
    }
    return path;
};

const normalizeData = (key, data) => {
    if (!data) return data;
    if (key === 'questions') {
        const normalize = (q) => ({
            ...q,
            questionText: q.questionText || q.text || '',
            difficulty: q.difficulty || q.level || 'Basic'
        });
        return Array.isArray(data) ? data.map(normalize) : normalize(data);
    }
    return data;
};

const ApiService = {
    get: async (resource) => {
        const key = cleanResource(resource);
        const { data } = await api.get(key);
        return normalizeData(key, data);
    },

    post: async (resource, data) => {
        const key = cleanResource(resource);
        const res = await api.post(key, data);
        return res.data;
    },

    put: async (resource, data) => {
        const key = cleanResource(resource);
        const res = await api.put(key, data);
        return res.data;
    },

    patch: async (resource, data) => {
        const key = cleanResource(resource);
        const res = await api.patch(key, data);
        return res.data;
    },

    delete: async (resource) => {
        const key = cleanResource(resource);
        const res = await api.delete(key);
        return res.data;
    },

    async uploadResume(candidateId, formData) {
        console.warn('Simulating resume upload locally');
        return { success: true, path: '/mock/resumes/uploaded.pdf' };
    },

    getUsers: async () => {
        return ApiService.get('/users');
    },
    
    async updateAdminUser(id, data) {
        return ApiService.put(`/users/${id}`, data);
    },

    async startExam(candidateId) {
        return ApiService.post('/exams', { candidateId, startTime: new Date().toISOString() });
    },

    async getQuestions() {
        return ApiService.get('/questions');
    },

    async saveAnswer(candidateId, questionId, selectedAnswer) {
        return ApiService.post('/answers', { candidateId, questionId, selectedAnswer });
    },

    async submitExam(candidateId) {
        return ApiService.patch(`/exams/${candidateId}`, { status: 'submitted' });
    },

    async logProctoringEvent(candidateId, eventType, eventDetails) {
        return ApiService.post('/proctoring_logs', { candidateId, eventType, eventDetails });
    },

    async submitInterviewerFeedback(feedback) {
        return ApiService.post('/interviewer_feedback', feedback);
    },

    async submitHrDecision(candidateId, decision, comments) {
        return ApiService.post('/hr_decisions', { candidateId, decision, comments, createdAt: new Date().toISOString() });
    },

    async getHrCandidates() {
        return ApiService.get('/candidates');
    },

    async scheduleInterview(candidateId, interviewData) {
        return ApiService.post('/interviews', { candidateId, ...interviewData });
    },

    login: async (email) => {
        try {
            // Check both users (staff) and candidates collections
            const [users, candidates] = await Promise.all([
                ApiService.get('/users'),
                ApiService.get('/candidates')
            ]);
            
            let user = (users || []).find(u => u.email === email);
            let isCandidate = false;

            if (!user) {
                user = (candidates || []).find(c => c.email === email);
                if (user) {
                    isCandidate = true;
                    user.role = 'ROLE_CANDIDATE'; // Assign candidate role if found in candidates table
                }
            }
            
            if (user) {
                const roleMap = {
                    'ROLE_SUPER_ADMIN': 'superadmin',
                    'ROLE_HR':          'hr',
                    'ROLE_INTERVIEWER': 'interviewer',
                    'ROLE_CANDIDATE':   'candidate'
                };
                
                const role = roleMap[user.role] || user.role.replace('ROLE_','').toLowerCase();
                
                localStorage.setItem('user', JSON.stringify({ token: 'mock-token-' + role }));
                sessionStorage.setItem('isAuthenticated', 'true');
                sessionStorage.setItem('userRole', role);
                sessionStorage.setItem('userId', String(user.id));
                sessionStorage.setItem('userName', user.name);
                localStorage.setItem('admin_user', JSON.stringify({ ...user, role: role }));

                return { 
                    user: { 
                        ...user,
                        role: role
                    }, 
                    type: isCandidate ? 'candidate' : 'staff' 
                };
            }
            throw new Error('User not found in mock database.');
        } catch (error) {
            console.error('Login Error:', error);
            throw new Error(error.message || 'Login failed.');
        }
    }
};

export default ApiService;
