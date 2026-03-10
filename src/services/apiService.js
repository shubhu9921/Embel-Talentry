import api from './api';

const ApiService = {
    get: (url) => api.get(url).then(res => res.data),
    post: (url, data) => api.post(url, data).then(res => res.data),
    put: (url, data) => api.put(url, data).then(res => res.data),
    patch: (url, data) => api.patch(url, data).then(res => res.data),
    delete: (url) => api.delete(url).then(res => res.data),

    // Specific methods
    getUsers: () => api.get('/admin_users').then(res => res.data),
    updateAdminUser: (id, data) => api.put(`/admin_users/${id}`, data).then(res => res.data),

    // Better Auth Logic (simulated)
    login: async (email, password) => {
        // First check admin_users
        const adminUsers = await api.get(`/admin_users?email=${encodeURIComponent(email)}`).then(res => res.data);
        const admin = adminUsers.find(u => u.password === password);
        if (admin) return { user: admin, type: 'staff' };

        // Then check candidates (some use email as username)
        const candidates = await api.get(`/candidates?email=${encodeURIComponent(email)}`).then(res => res.data);
        const candidate = candidates.find(c => c.password === password);
        if (candidate) return { user: candidate, type: 'candidate' };

        return null;
    }
};

export default ApiService;
