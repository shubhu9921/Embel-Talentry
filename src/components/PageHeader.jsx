import React from 'react';
import PropTypes from 'prop-types';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PageHeader = ({
    title,
    subtitle,
    actions,
    breadcrumbs = [],
    className = ''
}) => {
    const renderTitle = () => {
        if (typeof title !== 'string') return title;
        
        const words = title.split(' ');
        if (words.length <= 1) return title;
        
        const lastWord = words.pop();
        return (
            <>
                {words.join(' ')} <span className="text-[#ff6e00]">{lastWord}</span>
            </>
        );
    };

    return (
        <div className={`bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-6 mb-10 ${className}`}>
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                    {breadcrumbs.length > 0 && (
                        <nav className="flex items-center text-[10px] font-black text-slate-400 mb-3 space-x-2 uppercase tracking-widest">
                            {breadcrumbs.map((crumb, idx) => (
                                <React.Fragment key={crumb.path || crumb.label}>
                                    {crumb.path ? (
                                        <Link to={crumb.path} className="hover:text-[#ff6e00] transition-colors">{crumb.label}</Link>
                                    ) : (
                                        <span>{crumb.label}</span>
                                    )}
                                    {idx < breadcrumbs.length - 1 && <ChevronRight className="h-2 w-2" />}
                                </React.Fragment>
                            ))}
                        </nav>
                    )}
                    <h1 className="text-3xl font-black text-[#19325c] tracking-tight leading-none">{renderTitle()}</h1>
                    {subtitle && <p className="text-slate-500 text-sm mt-3 font-medium max-w-2xl">{subtitle}</p>}
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

PageHeader.propTypes = {
    title: PropTypes.node.isRequired,
    subtitle: PropTypes.string,
    actions: PropTypes.node,
    breadcrumbs: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        path: PropTypes.string
    })),
    className: PropTypes.string
};

export default PageHeader;
