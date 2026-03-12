import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import Button from './Button';

const Modal = ({ isOpen, onClose, title, children, footer, size = 'md' }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-2xl',
        lg: 'max-w-4xl',
        xl: 'max-w-6xl',
        full: 'max-w-full m-4',
    };

    const modalContent = (
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={onClose}
        >
            <div 
                className={`bg-white rounded-[2.5rem] shadow-2xl w-full ${sizes[size]} overflow-hidden animate-in zoom-in-95 duration-300 ring-1 ring-white/10`}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-white">
                    <div>
                        <h3 id="modal-title" className="text-2xl font-black text-[#19325c] tracking-tight">{title}</h3>
                        <div className="h-1 w-12 bg-[#ff6e00] rounded-full mt-2"></div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        icon={X}
                        onClick={onClose}
                        aria-label="Close modal"
                        className="p-3 rounded-2xl hover:bg-slate-50 text-slate-400 hover:text-[#ff6e00] transition-all border-none bg-transparent"
                    />
                </div>
                
                <div className="p-10 overflow-y-auto max-h-[75vh] custom-scrollbar">
                    {children}
                </div>
                
                {footer && (
                    <div className="px-10 py-8 bg-slate-50/50 border-t border-slate-100 flex justify-end items-center">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default Modal;
