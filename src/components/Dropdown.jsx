import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const Dropdown = ({ 
    trigger, 
    children, 
    align = 'left', 
    className = '', 
    contentClassName = '',
    closeOnClick = true 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const alignmentClasses = {
        left: 'left-0 origin-top-left',
        right: 'right-0 origin-top-right',
        center: 'left-1/2 -translate-x-1/2 origin-top',
    };

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <div 
                className="cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setIsOpen(!isOpen);
                    }
                }}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                role="button"
                tabIndex={0}
            >
                {trigger}
            </div>

            {isOpen && (
                <div 
                    className={`
                        absolute z-50 mt-2
                        ${alignmentClasses[align]}
                        ${contentClassName}
                        animate-in fade-in zoom-in-95 duration-200
                    `}
                    onClick={closeOnClick ? () => setIsOpen(false) : undefined}
                    onKeyDown={closeOnClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') setIsOpen(false); } : undefined}
                    tabIndex={closeOnClick ? 0 : -1}
                    role={closeOnClick ? "button" : undefined}
                >
                    {children}
                </div>
            )}
        </div>
    );
};

Dropdown.propTypes = {
    trigger: PropTypes.node.isRequired,
    children: PropTypes.node.isRequired,
    align: PropTypes.oneOf(['left', 'right', 'center']),
    className: PropTypes.string,
    contentClassName: PropTypes.string,
    closeOnClick: PropTypes.bool
};

export default Dropdown;
