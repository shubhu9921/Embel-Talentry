import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import Button from '../../components/Button';

const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="text-center max-w-md animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-red-100">
                    <ShieldAlert size={48} />
                </div>
                <h1 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">Access Denied</h1>
                <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                    You do not have permission to access this module. Please ensure you are logged in with the correct role account or contact a systems administrator.
                </p>
                <div className="flex justify-center gap-4">
                    <Button onClick={() => navigate(-1)} variant="outline" icon={ArrowLeft} className="rounded-xl px-6">
                        Go Back
                    </Button>
                    <Button onClick={() => navigate('/login')} className="bg-[#ff6e00] hover:bg-[#e05d00] text-white rounded-xl px-8 border-none shadow-lg shadow-orange-500/20">
                        Sign In as Different User
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;
