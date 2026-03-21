import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import ErrorBoundary from '../components/ErrorBoundary';

const DashboardLayout = lazy(() => import('../layouts/DashboardLayout'));
const Register = lazy(() => import('../pages/candidate/Register'));
const Login = lazy(() => import('../pages/candidate/Login'));
const ExamInstructions = lazy(() => import('../pages/candidate/ExamInstructions'));
const ExamPage = lazy(() => import('../pages/candidate/ExamPage'));

const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const CandidatesList = lazy(() => import('../pages/admin/CandidatesList'));
const Vacancies = lazy(() => import('../pages/admin/Vacancies'));
const QuestionBank = lazy(() => import('../pages/admin/QuestionBank'));
const AllInterviews = lazy(() => import('../pages/admin/AllInterviews'));
const TeamManagement = lazy(() => import('../pages/admin/TeamManagement'));
const ProctoringDashboard = lazy(() => import('../pages/admin/ProctoringDashboard'));

const InterviewerDashboard = lazy(() => import('../pages/interviewer/Dashboard'));
const AssignedInterviews = lazy(() => import('../pages/interviewer/AssignedInterviews'));
const TechnicalReview = lazy(() => import('../pages/interviewer/TechnicalReview'));

const HRDashboard = lazy(() => import('../pages/hr/Dashboard'));
const HRProfiles = lazy(() => import('../pages/hr/HRProfiles'));
const CommunicationPortal = lazy(() => import('../pages/hr/CommunicationPortal'));

const Settings = lazy(() => import('../pages/common/Settings'));
const Help = lazy(() => import('../pages/common/Help'));
const Unauthorized = lazy(() => import('../pages/public/Unauthorized'));

const LoadingFallback = () => (
    <div className="fixed top-0 left-0 w-full h-1 z-[100] bg-slate-100 overflow-hidden">
        <div className="h-full bg-[#ff6e00] w-full"
            style={{ backgroundImage: 'linear-gradient(90deg, #ff6e00 0%, #ff9e00 50%, #ff6e00 100%)' }}>
        </div>
    </div>
);

const AppRoutes = () => (
    <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* Candidate exam flow — just needs token */}
                <Route path="/exam-instructions" element={
                    <ProtectedRoute><ExamInstructions /></ProtectedRoute>
                } />
                <Route path="/exam" element={
                    <ProtectedRoute><ExamPage /></ProtectedRoute>
                } />

                {/* Admin / HR dashboard */}
                <Route path="/admin" element={
                    <ProtectedRoute><DashboardLayout /></ProtectedRoute>
                }>
                    <Route index element={<AdminDashboard />} />
                    <Route path="proctoring" element={<ProctoringDashboard />} />
                    <Route path="candidates" element={<CandidatesList />} />
                    <Route path="vacancies" element={<Vacancies />} />
                    <Route path="questions" element={<QuestionBank />} />
                    <Route path="interviews" element={<AllInterviews />} />
                    <Route path="team" element={<TeamManagement />} />
                    <Route path="emails" element={<CommunicationPortal />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="help" element={<Help />} />
                </Route>

                {/* Interviewer dashboard */}
                <Route path="/interviewer" element={
                    <ProtectedRoute><DashboardLayout /></ProtectedRoute>
                }>
                    <Route index element={<InterviewerDashboard />} />
                    <Route path="interviews" element={<AssignedInterviews />} />
                    <Route path="reviews" element={<TechnicalReview />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="help" element={<Help />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Suspense>
    </ErrorBoundary>
);

export default AppRoutes;