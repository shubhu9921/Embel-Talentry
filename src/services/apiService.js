// ApiService.js
import axios from 'axios';

// ───────────── API INSTANCE ─────────────
const api = axios.create({
    baseURL: 'http://localhost:8081/api', // Spring Boot backend
    headers: { 'Content-Type': 'application/json' },
});

// ───────────── REQUEST INTERCEPTOR ─────────────
api.interceptors.request.use(
    (config) => {
        let token = localStorage.getItem('token');

        // ───────────── DEVELOPMENT: fallback mock token ─────────────
        if (!token && process.env.NODE_ENV === 'development') {
            const user = JSON.parse(localStorage.getItem('admin_user'));
            if (user && ['ADMIN', 'HR', 'INTERVIEWER'].includes(user.role.toUpperCase())) {
                token = 'mock-jwt-' + user.role.toUpperCase();
                localStorage.setItem('token', token);
                console.log(`[DEV] Mock token set for role: ${user.role.toUpperCase()}`);
            }
        }

        // ───────────── Attach JWT if exists ─────────────
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
            console.log(`[API] Authorization header set: ${config.headers['Authorization']}`);
        }

        return config;
    },
    (error) => {
        console.error("[API] Request interceptor error:", error);
        return Promise.reject(error);
    }
);

// ───────────── RESPONSE / ERROR HANDLER ─────────────
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error("Unauthorized! Redirecting to login.");
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

const handleResponse = (response) => response.data;

const handleError = (error) => {
    console.error("API Error:", error.response?.data || error.message);
    throw new Error(error?.response?.data?.message || error?.message || "Something went wrong");
};

// ───────────── API SERVICE ─────────────
const ApiService = {

    // ───────────── AUTH ─────────────
    login: async (email, password) => {
        try {
            const staffMocks = {
                'admin@embel.com': { id: 1, name: 'Admin User', role: 'ADMIN', password: 'admin123' },
                'hr@embel.com': { id: 2, name: 'HR Manager', role: 'HR', password: 'hr123' },
                'interviewer@embel.com': { id: 3, name: 'Technical Interviewer', role: 'INTERVIEWER', password: 'interviewer@123' },
            };

            const mock = staffMocks[email.toLowerCase()];
            if (mock && password === mock.password) {
                return ApiService._completeLogin('mock-jwt-' + mock.role.toUpperCase(), mock);
            }

            const { data } = await api.post('/auth/login', { email, password });
            const { token, user } = data;

            if (!token || !user?.id) throw new Error("Invalid login response from server");

            const normalizedUser = {
                id: user.id || user.userId,
                name: user.name || user.userName,
                email: user.email || user.userEmail,
                role: user.role.toUpperCase(),
            };

            return ApiService._completeLogin(token, normalizedUser);
        } catch (error) {
            handleError(error);
        }
    },

    _completeLogin: (token, user) => {
        localStorage.setItem('token', token);
        localStorage.setItem('admin_user', JSON.stringify(user));
        sessionStorage.setItem('isAuthenticated', 'true');
        sessionStorage.setItem('userId', String(user.id));
        sessionStorage.setItem('userName', user.name || '');
        sessionStorage.setItem('userEmail', user.email || '');
        sessionStorage.setItem('userRole', user.role || '');
        const type = ['CANDIDATE'].includes(user.role) ? 'candidate' : 'staff';
        return { user, type };
    },

    logout: () => {
        localStorage.clear();
        sessionStorage.clear();
    },

    // ───────────── GENERIC METHODS ─────────────
    get: async (url) => { try { return handleResponse(await api.get(url)); } catch (e) { handleError(e); } },
    post: async (url, payload, config = {}) => { try { return handleResponse(await api.post(url, payload, config)); } catch (e) { handleError(e); } },
    put: async (url, payload) => { try { return handleResponse(await api.put(url, payload)); } catch (e) { handleError(e); } },
    delete: async (url) => { try { return handleResponse(await api.delete(url)); } catch (e) { handleError(e); } },

    // ───────────── ADMIN ENDPOINTS ─────────────
    getUsers: async () => ApiService.get('/admin/users'),
    getUserById: async (id) => ApiService.get(`/admin/users/${id}`),
    createUser: async (payload) => ApiService.post('/admin/users', payload),
    updateAdminUser: async (id, payload) => ApiService.put(`/admin/users/${id}`, payload),
    deleteUser: async (id) => ApiService.delete(`/admin/users/${id}`),
    getAdminQuestions: async () => ApiService.get('/admin/questions'),
    addQuestion: async (payload) => ApiService.post('/admin/questions', payload),
    updateQuestion: async (id, payload) => ApiService.put(`/admin/questions/${id}`, payload),
    deleteQuestion: async (id) => ApiService.delete(`/admin/questions/${id}`),
    getAdminVacancies: async (openOnly = false) => ApiService.get(`/admin/vacancies${openOnly ? '?openOnly=true' : ''}`),

    // ───────────── HR ENDPOINTS ─────────────
    getHrCandidates: async () => ApiService.get('/hr/decisions/candidates'),
    scheduleInterview: async (payload) => ApiService.post('/hr/interviews', payload),
    getAllInterviews: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return ApiService.get(`/hr/interviews${query ? '?' + query : ''}`);
    },

    // ───────────── INTERVIEWER ENDPOINTS ─────────────
    getInterviewerInterviews: async () => ApiService.get('/interviewer/interviews'),
    submitInterviewFeedback: async (id, payload) => ApiService.post(`/interviewer/interviews/${id}/feedback`, payload),

    // ───────────── PROCTORING ENDPOINTS ─────────────
    getProctoringSessions: async () => ApiService.get('/proctoring/sessions'),
    sendProctoringNotification: async (payload) => ApiService.post('/proctoring/notify', payload),

    // ───────────── CANDIDATE ENDPOINTS ─────────────
    registerCandidate: async (payload) => ApiService.post('/candidates', payload),
    getAllCandidates: async () => ApiService.get('/candidates'),
};

export default ApiService;