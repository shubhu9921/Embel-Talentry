import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const location = useLocation();

    // Check candidate access
    if (allowedRoles.includes('candidate')) {
        const candidateData = localStorage.getItem('candidate');
        if (!candidateData) {
            return <Navigate to="/login" state={{ from: location }} replace />;
        }
        return children;
    }

    // Check staff access (HR, Admin, Interviewer)
    const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
    const userRole = sessionStorage.getItem('userRole');

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!allowedRoles.includes(userRole)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;
