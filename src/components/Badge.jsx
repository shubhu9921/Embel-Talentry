import React from 'react';
import PropTypes from 'prop-types';

const Badge = ({
    children,
    variant = 'primary',
    size = 'md',
    className = ''
}) => {
    const variants = {
        primary: 'bg-blue-100 text-blue-800 border-blue-200',
        secondary: 'bg-orange-100 text-orange-800 border-orange-200',
        success: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        danger: 'bg-red-100 text-red-800 border-red-200',
        warning: 'bg-amber-100 text-amber-800 border-amber-200',
        info: 'bg-sky-100 text-sky-800 border-sky-200',
        neutral: 'bg-slate-100 text-slate-800 border-slate-200',
    };

    const sizes = {
        sm: 'px-2 py-0.5 text-[10px]',
        md: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
    };

    return (
        <span className={`inline-flex items-center font-semibold border rounded-full ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}>
            {children}
        </span>
    );
};

Badge.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'neutral']),
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    className: PropTypes.string
};

export default Badge;
