/**
 * Global Constants for Embel TalentSphere
 */

export const ROLES = {
    SUPER_ADMIN: 'superadmin',
    INTERVIEWER: 'interviewer',
    HR: 'hr',
    CANDIDATE: 'candidate'
};

export const API_ENDPOINTS = {
    CANDIDATES: '/candidates',
    INTERVIEWS: '/interviews',
    VACANCIES: '/vacancies',
    QUESTIONS: '/questions',
    ADMIN_USERS: '/admin_users',
};

export const THEME = {
    COLORS: {
        PRIMARY: '#19325c',
        ACCENT: '#ff6e00',
        ACCENT_HOVER: '#e05d00',
        DANGER: '#ef4444',
        SUCCESS: '#10b981',
        WARNING: '#f59e0b',
        INFO: '#3b82f6',
    },
    SHADOWS: {
        ELEVATION_HIGH: 'shadow-elevation-high',
    }
};

export const AUTH_KEYS = {
    USER: 'user',
    ADMIN_USER: 'admin_user',
};
