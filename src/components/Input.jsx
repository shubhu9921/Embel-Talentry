import React from 'react';

const Input = ({ label, error, icon: Icon, className = '', containerClassName = '', ...props }) => {
    return (
        <div className={`space-y-2 ${containerClassName}`}>
            {label && (
                <label className="block text-sm font-semibold text-slate-700 ml-1">
                    {label}
                </label>
            )}
            <div className="relative group">
                {Icon && (
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#19325c] transition-colors duration-200">
                        <Icon size={18} />
                    </div>
                )}
                <input
                    className={`
                        w-full ${Icon ? 'pl-11' : 'pl-4'} pr-4 py-2.5 
                        bg-white border-2 border-slate-100 rounded-xl text-sm 
                        focus:outline-none focus:border-[#19325c] focus:ring-4 focus:ring-[#19325c]/5 
                        transition-all duration-200 placeholder:text-slate-400
                        ${error ? 'border-red-500 focus:ring-red-500/10 focus:border-red-500' : ''}
                        ${className}
                    `}
                    {...props}
                />
            </div>
            {error && (
                <p className="text-xs font-medium text-red-500 ml-1">{error}</p>
            )}
        </div>
    );
};

export default Input;
