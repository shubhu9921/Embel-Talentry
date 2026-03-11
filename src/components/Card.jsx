import React from 'react';

const Card = ({ children, title, subtitle, footer, className = '', noPadding = false, ...props }) => {
    return (
        <div className={`bg-white rounded-2xl shadow-elevation-high hover-lift ${className}`} {...props}>
            {(title || subtitle) && (
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/30">
                    {title && <h3 className="text-lg font-bold text-slate-800 tracking-tight">{title}</h3>}
                    {subtitle && <p className="text-sm text-slate-500 mt-1 font-medium">{subtitle}</p>}
                </div>
            )}
            <div className={noPadding ? '' : 'p-6'}>
                {children}
            </div>
            {footer && (
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 text-sm">
                    {footer}
                </div>
            )}
        </div>
    );
};

export default Card;
