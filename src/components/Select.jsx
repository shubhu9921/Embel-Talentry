import React from 'react';
import PropTypes from 'prop-types';
import { ChevronDown } from 'lucide-react';
import Dropdown from './Dropdown';

const Select = ({ 
    label, 
    value, 
    options = [], 
    onSelect, 
    placeholder = 'Select option...', 
    icon: Icon,
    className = '',
    triggerClassName = '',
    contentClassName = '',
    error,
    required = false,
    searchable = false,
    id: providedId
}) => {
    const internalId = React.useId();
    const selectId = providedId || internalId;
    const listboxId = `${selectId}-listbox`;
    const [searchTerm, setSearchTerm] = React.useState('');

    // Determine the label to display
    const getDisplayValue = () => {
        if (value === undefined || value === null || value === '') return placeholder;
        const option = options.find(opt => opt.id === value || opt.value === value || opt === value);
        return typeof option === 'object' ? (option.label || option.name) : option;
    };

    const trigger = (
        <div className="space-y-2">
            {label && (
                <label 
                    htmlFor={selectId}
                    className="block text-xs font-black text-slate-900 uppercase tracking-widest ml-1"
                >
                    {label}
                    {required && <span className="text-red-500 ml-1 font-black">*</span>}
                </label>
            )}
            <button 
                id={selectId}
                type="button"
                className={`
                    relative w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl 
                    flex items-center justify-between transition-all group
                    hover:border-orange-500/30 hover:bg-white
                    ${error ? 'border-rose-500/50' : 'focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5'}
                    ${triggerClassName || className}
                `}
            >
                <div className="flex items-center gap-3 overflow-hidden text-left pointer-events-none">
                    {Icon && <Icon className="w-5 h-5 text-slate-400 group-hover:text-orange-500 transition-colors" />}
                    <span className={`text-sm font-bold truncate ${(value === undefined || value === null || value === '') ? 'text-slate-400' : 'group-hover:text-orange-600 transition-colors'}`}>
                        {getDisplayValue()}
                    </span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-orange-500 transition-all duration-300 pointer-events-none" />
            </button>
            {error && <p className="text-[10px] font-bold text-rose-500 px-1 uppercase tracking-wider">{error}</p>}
        </div>
    );

    return (
        <Dropdown 
            trigger={trigger} 
            className="w-full"
            contentClassName="w-full bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
            onClose={() => setSearchTerm('')}
        >
            <div className="flex flex-col max-h-80">
                {searchable && (
                    <div className="p-2 border-b border-slate-50">
                        <input
                            type="text"
                            placeholder="Type to filter..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                )}
                <ul 
                    id={listboxId}
                    role="listbox"
                    className="overflow-y-auto p-1.5 scrollbar-hide"
                >
                    {(() => {
                        const filteredOptions = options.filter(opt => {
                            if (!searchTerm) return true;
                            const label = typeof opt === 'object' ? (opt.label || opt.name || '') : String(opt);
                            return label.toLowerCase().includes(searchTerm.toLowerCase());
                        });

                        if (filteredOptions.length === 0) {
                            return <div className="p-4 text-center text-slate-400 text-xs font-bold">No results found</div>;
                        }

                        return filteredOptions.map((opt) => {
                        const optValue = typeof opt === 'object' ? (opt.id || opt.value || opt.label) : opt;
                        const optLabel = typeof opt === 'object' ? (opt.label || opt.name) : opt;
                        const isActive = value === optValue;

                        return (
                                <li key={String(optValue)} className="w-full">
                                    <button
                                        type="button"
                                        role="option"
                                        aria-selected={isActive}
                                        onClick={() => onSelect(optValue)}
                                        className={`
                                            flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all w-full text-left
                                            ${isActive 
                                                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' 
                                                : 'text-slate-600 hover:bg-orange-50 hover:text-orange-600'
                                            }
                                        `}
                                    >
                                        <span className="text-sm font-bold truncate">{optLabel}</span>
                                    </button>
                                </li>
                        );
                        });
                    })()}
                </ul>
            </div>
        </Dropdown>
    );
};

Select.propTypes = {
    label: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    options: PropTypes.array,
    onSelect: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    icon: PropTypes.elementType,
    className: PropTypes.string,
    triggerClassName: PropTypes.string,
    contentClassName: PropTypes.string,
    error: PropTypes.string,
    required: PropTypes.bool,
    searchable: PropTypes.bool,
    id: PropTypes.string
};

export default Select;
