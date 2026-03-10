import React from 'react';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    className = '',
    icon: Icon,
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg';

    const variants = {
        primary: 'bg-[#19325c] text-white hover:bg-[#122545] focus:ring-[#19325c] shadow-md hover:shadow-lg',
        secondary: 'bg-[#ff6e00] text-white hover:bg-[#e05d00] focus:ring-[#ff6e00] shadow-md hover:shadow-lg',
        outline: 'border-2 border-[#19325c] text-[#19325c] hover:bg-slate-50 focus:ring-[#19325c]',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600 shadow-md',
        success: 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-600 shadow-md',
        ghost: 'bg-transparent hover:bg-slate-100 text-slate-600 focus:ring-slate-300',
    };

    const sizes = {
        xs: 'px-2.5 py-1.5 text-xs',
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    return (
        <button
            {...props}
            disabled={loading || props.disabled}
            className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
        >
            {loading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
            {!loading && Icon && <Icon className="mr-2 h-4 w-4" />}
            {children}
        </button>
    );
};

export default Button;
