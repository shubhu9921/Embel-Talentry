import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Search, ChevronDown, X } from 'lucide-react';

const Autocomplete = ({
    label,
    value,
    onChange,
    onSelect,
    options = [],
    placeholder = 'Type to search...',
    icon: Icon,
    error,
    required = false,
    className = "",
    containerClassName = "",
    strict = false,
    id: providedId
}) => {
    const internalId = React.useId();
    const inputId = providedId || internalId;
    const listboxId = `${inputId}-listbox`;
    const [isOpen, setIsOpen] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [searchTerm, setSearchTerm] = useState(value || '');
    const containerRef = useRef(null);
    const debounceTimer = useRef(null);

    // Levenshtein Distance for fuzzy matching
    const getLevenshteinDistance = (a, b) => {
        const matrix = [];
        for (let i = 0; i <= b.length; i++) matrix[i] = [i];
        for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        return matrix[b.length][a.length];
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        setSearchTerm(value || '');
    }, [value]);

    useEffect(() => {
        if (debounceTimer.current) clearTimeout(debounceTimer.current);

        debounceTimer.current = setTimeout(() => {
            if (searchTerm && isOpen) {
                const search = searchTerm.toLowerCase();
                const filtered = options.map(opt => {
                    const label = String(typeof opt === 'object' ? (opt.label || opt.name || '') : opt);
                    const lowerLabel = label.toLowerCase();
                    
                    // Scoring logic
                    let score = 0;
                    if (lowerLabel === search) score = 100;
                    else if (lowerLabel.startsWith(search)) score = 80;
                    else if (lowerLabel.includes(search)) score = 60;
                    else {
                        const distance = getLevenshteinDistance(search, lowerLabel);
                        if (distance <= 2) score = 40; // Fuzzy match threshold
                    }
                    
                    return { opt, label, score };
                })
                .filter(item => item.score > 0 && item.label.toLowerCase() !== search)
                .sort((a, b) => b.score - a.score)
                .slice(0, 8); // Limit suggestions

                setSuggestions(filtered.map(f => f.opt));
            } else {
                setSuggestions([]);
            }
        }, 200);

        return () => clearTimeout(debounceTimer.current);
    }, [searchTerm, options, isOpen]);

    const handleInputChange = (e) => {
        const val = e.target.value;
        setSearchTerm(val);
        onChange(val);
        setIsOpen(true);
    };

    const handleBlur = () => {
        setTimeout(() => {
            if (strict && searchTerm) {
                const exactMatch = options.find(opt => {
                    const label = String(typeof opt === 'object' ? (opt.label || opt.name || '') : opt);
                    return label.toLowerCase() === searchTerm.toLowerCase();
                });

                if (exactMatch) {
                    const optValue = typeof exactMatch === 'object' ? (exactMatch.id || exactMatch.value || exactMatch.label || exactMatch.name) : exactMatch;
                    onSelect(optValue);
                } else {
                    // Clear or handle invalid
                    onSelect('');
                    setSearchTerm('');
                }
            }
            setIsOpen(false);
        }, 200);
    };

    const handleSelect = (opt) => {
        const optValue = typeof opt === 'object' ? (opt.id || opt.value || opt.label || opt.name) : opt;
        onSelect(optValue);
        setIsOpen(false);
    };

    const clearInput = () => {
        onChange('');
        setIsOpen(false);
    };

    return (
        <div className={`space-y-2 relative ${containerClassName}`} ref={containerRef}>
            {label && (
                <label 
                    htmlFor={inputId}
                    className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1"
                >
                    {label}
                    {required && <span className="text-rose-500 ml-1 font-black">*</span>}
                </label>
            )}
            <div className="relative group/field">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    {Icon ? (
                        <Icon className="h-5 w-5 text-slate-300 group-focus-within/field:text-[#ff6e00] transition-colors" />
                    ) : (
                        <Search className="h-4 w-4 text-slate-300 group-focus-within/field:text-[#ff6e00] transition-colors" />
                    )}
                </div>
                <input
                    id={inputId}
                    type="text"
                    value={searchTerm}
                    onChange={handleInputChange}
                    onFocus={() => setIsOpen(true)}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    autoComplete="off"
                    role="combobox"
                    aria-expanded={isOpen}
                    aria-haspopup="listbox"
                    aria-autocomplete="list"
                    aria-controls={isOpen ? listboxId : undefined}
                    className={`
                        block w-full pl-11 pr-12 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl 
                        text-slate-900 focus:ring-4 focus:ring-orange-500/5 focus:border-[#ff6e00] 
                        transition-all outline-none text-sm font-bold placeholder:text-slate-300 shadow-inner
                        ${error ? 'border-rose-500/50' : ''}
                        ${className}
                    `}
                />
                
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center gap-2">
                    {searchTerm && (
                        <button 
                            type="button"
                            onClick={clearInput}
                            className="p-1 hover:bg-slate-100 rounded-lg text-slate-300 hover:text-slate-500 transition-all"
                        >
                            <X size={14} />
                        </button>
                    )}
                    <ChevronDown className={`w-4 h-4 text-slate-300 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </div>

            {error && <p className="text-[10px] font-bold text-rose-500 px-1 uppercase tracking-wider">{error}</p>}

            {/* Suggestions Popover */}
            {isOpen && suggestions.length > 0 && (
                <div className="absolute z-100 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <ul 
                        id={listboxId}
                        role="listbox"
                        className="max-h-60 overflow-y-auto p-1.5 scrollbar-hide"
                    >
                        {suggestions.map((opt, idx) => {
                            const optId = typeof opt === 'object' ? (opt.id || opt.value || idx) : opt;
                            const isSelected = value === (typeof opt === 'object' ? (opt.id || opt.value) : opt);
                            
                            return (
                                <li
                                    key={optId}
                                    onClick={() => handleSelect(opt)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') handleSelect(opt); }}
                                    tabIndex={0}
                                    role="option"
                                    aria-selected={isSelected}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all text-slate-600 hover:bg-orange-50 hover:text-orange-600 group/item outline-none focus:bg-orange-50 focus:text-orange-600"
                                >
                                    <span className="text-sm font-bold truncate group-hover/item:translate-x-1 transition-transform">
                                        {(() => {
                                            const labelText = String(typeof opt === 'object' ? (opt.label || opt.name) : opt);
                                            if (!searchTerm) return <span>{labelText}</span>;
                                            
                                            const escapedSearch = searchTerm.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
                                            const parts = labelText.split(new RegExp(`(${escapedSearch})`, 'gi'));
                                            
                                            return (
                                                <>
                                                    {parts.map((part, i) => {
                                                        const isMatch = part.toLowerCase() === searchTerm.toLowerCase();
                                                        return (
                                                            <span 
                                                                key={`${idx}-${i}`} 
                                                                className={isMatch ? "text-[#ff6e00] underline decoration-2 underline-offset-4" : ""}
                                                            >
                                                                {part}
                                                            </span>
                                                        );
                                                    })}
                                                </>
                                            );
                                        })()}
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
};

Autocomplete.propTypes = {
    label: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    options: PropTypes.array,
    placeholder: PropTypes.string,
    icon: PropTypes.elementType,
    error: PropTypes.string,
    required: PropTypes.bool,
    className: PropTypes.string,
    containerClassName: PropTypes.string,
    strict: PropTypes.bool,
    id: PropTypes.string
};

export default Autocomplete;
