// EVO ART Designer Hub - API Client Service
// Integrates React frontend with the Express + MongoDB backend
const API_BASE = import.meta.env?.VITE_API_URL || 'http://localhost:5000/api';
class ApiService {
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
        };
        const token = localStorage.getItem('evo_hub_token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    }
    async request(endpoint, options = {}) {
        const url = `${API_BASE}${endpoint}`;
        const res = await fetch(url, {
            ...options,
            headers: {
                ...this.getHeaders(),
                ...(options.headers || {}),
            },
        });
        const data = await res.json().catch(() => null);
        if (!res.ok) {
            const errorMsg = data?.message || `HTTP ${res.status}: ${res.statusText}`;
            throw new Error(errorMsg);
        }
        return data;
    }
    // Auth
    auth = {
        login: (credentials) => this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        }),
        me: () => this.request('/auth/me'),
        changePassword: (passwords) => this.request('/auth/change-password', {
            method: 'POST',
            body: JSON.stringify(passwords),
        }),
    };
    // Projects
    projects = {
        getAll: (params) => {
            const q = new URLSearchParams(params).toString();
            return this.request(`/projects${q ? `?${q}` : ''}`);
        },
        getById: (id) => this.request(`/projects/${id}`),
        create: (projectData) => this.request('/projects', {
            method: 'POST',
            body: JSON.stringify(projectData),
        }),
        update: (id, updates) => this.request(`/projects/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
        }),
        delete: (id) => this.request(`/projects/${id}`, {
            method: 'DELETE',
        }),
        submitBid: (projectId, bidData) => this.request(`/projects/${projectId}/bids`, {
            method: 'POST',
            body: JSON.stringify(bidData),
        }),
        withdrawBid: (projectId) => this.request(`/projects/${projectId}/bids`, {
            method: 'DELETE',
        }),
        award: (projectId, awardData) => this.request(`/projects/${projectId}/award`, {
            method: 'POST',
            body: JSON.stringify(awardData),
        }),
        submitDelivery: (projectId, deliveryData) => this.request(`/projects/${projectId}/deliveries`, {
            method: 'POST',
            body: JSON.stringify(deliveryData),
        }),
        approve: (projectId) => this.request(`/projects/${projectId}/approve`, {
            method: 'POST',
        }),
        requestRevision: (projectId, revisionData) => this.request(`/projects/${projectId}/revisions`, {
            method: 'POST',
            body: JSON.stringify(revisionData),
        }),
        addComment: (projectId, commentData) => this.request(`/projects/${projectId}/comments`, {
            method: 'POST',
            body: JSON.stringify(commentData),
        }),
    };
    // Designers
    designers = {
        getAll: (params) => {
            const q = new URLSearchParams(params).toString();
            return this.request(`/designers${q ? `?${q}` : ''}`);
        },
        getById: (id) => this.request(`/designers/${id}`),
        create: (designerData) => this.request('/designers', {
            method: 'POST',
            body: JSON.stringify(designerData),
        }),
        update: (id, updates) => this.request(`/designers/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
        }),
        delete: (id) => this.request(`/designers/${id}`, {
            method: 'DELETE',
        }),
    };
    // Payments
    payments = {
        getAll: (params) => {
            const q = new URLSearchParams(params).toString();
            return this.request(`/payments${q ? `?${q}` : ''}`);
        },
        updateStatus: (id, status) => this.request(`/payments/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        }),
    };
    // Dev utility
    seed = () => this.request('/seed', {
        method: 'POST',
    });
}
export const api = new ApiService();
