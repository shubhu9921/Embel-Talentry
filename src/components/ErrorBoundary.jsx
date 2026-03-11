import React, { Component } from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    handleReset = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 p-4 font-sans">
                    <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-100 text-center animate-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="w-10 h-10 text-red-500" />
                        </div>
                        <h1 className="text-2xl font-black text-slate-800 mb-2">Something went wrong</h1>
                        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                            We apologize for the inconvenience. An unexpected error has occurred in the application.
                        </p>

                        <div className="space-y-4">
                            <button
                                onClick={this.handleReset}
                                className="w-full py-4 bg-[#ff6e00] hover:bg-[#e05d00] text-white rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
                            >
                                <RefreshCcw className="w-4 h-4" /> Try Again
                            </button>
                            <a href="/"
                                className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-black uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-2"
                            >
                                <Home className="w-4 h-4" /> Return Home
                            </a>
                        </div>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <div className="mt-8 text-left bg-slate-900 rounded-xl p-4 overflow-auto max-h-48 text-[10px] sm:text-xs">
                                <p className="text-red-400 font-mono mb-2">{this.state.error.toString()}</p>
                                <pre className="text-slate-400 font-mono whitespace-pre-wrap">{this.state.errorInfo?.componentStack}</pre>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
