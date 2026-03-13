import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const DashboardLayout = ({ role: propRole }) => {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();
    const VALID_ROLES = ['superadmin', 'hr', 'interviewer'];
    const rawRole = propRole || sessionStorage.getItem('userRole');
    const role = VALID_ROLES.includes(rawRole) ? rawRole : '';

    useEffect(() => {
        // SSR safety: access window only after mount
        if (window.innerWidth < 1024) {
            setCollapsed(true);
        }
    }, [location]);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setCollapsed(true);
            } else {
                setCollapsed(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleMainContentClick = () => {
        if (window.innerWidth < 1024 && !collapsed) {
            setCollapsed(true);
        }
    };

    return (
        <div className="h-screen bg-[#f8fafc] flex overflow-hidden">
            <Sidebar
                role={role}
                collapsed={collapsed}
                setCollapsed={setCollapsed}
            />

            <div
                className="flex-1 flex flex-col min-w-0 relative overflow-hidden"
                onClick={handleMainContentClick}
            >
                <Header role={role} setCollapsed={setCollapsed} collapsed={collapsed} />

                <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8 custom-scrollbar">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>

                <footer className="px-8 py-6 text-center text-[10px] font-bold text-slate-400 border-t border-slate-100 bg-white/50 backdrop-blur-md uppercase tracking-widest">
                    &copy; {new Date().getFullYear()} Embel TalentTry. Optimized for Performance.
                </footer>
            </div>
        </div>
    );
};

export default DashboardLayout;
