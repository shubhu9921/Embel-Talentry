import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PageHeader = ({
    title,
    subtitle,
    actions,
    breadcrumbs = [],
    className = ''
}) => {
    return (
        <div className={`bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 mb-8 ${className}`}>
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    {breadcrumbs.length > 0 && (
                        <nav className="flex items-center text-xs font-medium text-slate-500 mb-2 space-x-2">
                            {breadcrumbs.map((crumb, index) => (
                                <React.Fragment key={index}>
                                    {crumb.path ? (
                                        <Link to={crumb.path} className="hover:text-[#ff6e00] transition-colors">{crumb.label}</Link>
                                    ) : (
                                        <span className="text-slate-400">{crumb.label}</span>
                                    )}
                                    {index < breadcrumbs.length - 1 && <ChevronRight className="h-3 w-3" />}
                                </React.Fragment>
                            ))}
                        </nav>
                    )}
                    <h1 className="text-2xl font-extrabold text-[#19325c] tracking-tight">{title}</h1>
                    {subtitle && <p className="text-slate-500 text-sm mt-1 font-medium">{subtitle}</p>}
                </div>
                {actions && (
                    <div className="flex items-center gap-3">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PageHeader;
