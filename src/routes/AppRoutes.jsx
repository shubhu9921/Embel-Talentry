import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Loader from '../components/Loader';
import ProtectedRoute from '../components/ProtectedRoute';
import ErrorBoundary from '../components/ErrorBoundary';

// Lazy load components
const DashboardLayout = lazy(() => import('../layouts/DashboardLayout'));
const Register = lazy(() => import('../pages/candidate/Register'));
const Login = lazy(() => import('../pages/candidate/Login'));
const ExamInstructions = lazy(() => import('../pages/candidate/ExamInstructions'));
const ExamPage = lazy(() => import('../pages/candidate/ExamPage'));

// Admin Pages
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const CandidatesList = lazy(() => import('../pages/admin/CandidatesList'));
const Vacancies = lazy(() => import('../pages/admin/Vacancies'));
const QuestionBank = lazy(() => import('../pages/admin/QuestionBank'));
const AllInterviews = lazy(() => import('../pages/admin/AllInterviews'));
const TeamManagement = lazy(() => import('../pages/admin/TeamManagement'));
const ProctoringDashboard = lazy(() => import('../pages/admin/ProctoringDashboard'));

// Interviewer Pages
const InterviewerDashboard = lazy(() => import('../pages/interviewer/Dashboard'));
const AssignedInterviews = lazy(() => import('../pages/interviewer/AssignedInterviews'));
const TechnicalReview = lazy(() => import('../pages/interviewer/TechnicalReview'));

// HR Pages
const HRDashboard = lazy(() => import('../pages/hr/Dashboard'));
const HRProfiles = lazy(() => import('../pages/hr/HRProfiles'));
const CommunicationPortal = lazy(() => import('../pages/hr/CommunicationPortal'));

// Common Pages
const Settings = lazy(() => import('../pages/common/Settings'));
const Help = lazy(() => import('../pages/common/Help'));
const Unauthorized = lazy(() => import('../pages/public/Unauthorized'));

const LoadingFallback = () => (
    <div className="fixed top-0 left-0 w-full h-1 z-[100] bg-slate-100 overflow-hidden">
        <div className="h-full bg-[#ff6e00] animate-[shimmer_2s_infinite] w-full" style={{ backgroundSize: '200% 100%', backgroundImage: 'linear-gradient(90deg, #ff6e00 0%, #ff9e00 50%, #ff6e00 100%)' }}></div>
    </div>
);

const AppRoutes = () => {
    return (
        <ErrorBoundary>
            <Suspense fallback={<LoadingFallback />}>
                <Routes>
                    {/* Default Redirection */}
                    <Route path="/" element={<Navigate to="/login" replace />} />

                    {/* Authentication & Candidate Flow */}
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/exam-instructions" element={<ProtectedRoute allowedRoles={['candidate']}><ExamInstructions /></ProtectedRoute>} />
                    <Route path="/exam" element={<ProtectedRoute allowedRoles={['candidate']}><ExamPage /></ProtectedRoute>} />
                    <Route path="/unauthorized" element={<Unauthorized />} />

                    {/* Super Admin Module */}
                    <Route path="/admin" element={<ProtectedRoute allowedRoles={['superadmin', 'admin']}><DashboardLayout role="superadmin" /></ProtectedRoute>}>
                        <Route index element={<AdminDashboard />} />
                        <Route path="proctoring" element={<ProctoringDashboard />} />
                        <Route path="candidates" element={<CandidatesList />} />
                        <Route path="vacancies" element={<Vacancies />} />
                        <Route path="questions" element={<QuestionBank />} />
                        <Route path="interviews" element={<AllInterviews />} />
                        <Route path="team" element={<TeamManagement />} />
                        <Route path="settings" element={<Settings />} />
                        <Route path="help" element={<Help />} />
                    </Route>

                    {/* Interviewer Module */}
                    <Route path="/interviewer" element={<ProtectedRoute allowedRoles={['interviewer']}><DashboardLayout role="interviewer" /></ProtectedRoute>}>
                        <Route index element={<InterviewerDashboard />} />
                        <Route path="interviews" element={<AssignedInterviews />} />
                        <Route path="reviews" element={<TechnicalReview />} />
                        <Route path="settings" element={<Settings />} />
                        <Route path="help" element={<Help />} />
                    </Route>

                    {/* HR Module */}
                    <Route path="/hr" element={<ProtectedRoute allowedRoles={['hr']}><DashboardLayout role="hr" /></ProtectedRoute>}>
                        <Route index element={<HRDashboard />} />
                        <Route path="candidates" element={<HRProfiles />} />
                        <Route path="interviews" element={<AllInterviews />} />
                        <Route path="emails" element={<CommunicationPortal />} />
                        <Route path="settings" element={<Settings />} />
                        <Route path="help" element={<Help />} />
                    </Route>

                    {/* Catch-all */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Suspense>
        </ErrorBoundary>
    );
};

export default AppRoutes;
