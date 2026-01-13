'use client';

import { XMarkIcon } from '@heroicons/react/24/solid';
import { ReactNode, useEffect } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    icon?: ReactNode;
    children: ReactNode;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export default function Modal({ isOpen, onClose, title, icon, children, maxWidth = 'lg' }: ModalProps) {
    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const maxWidthClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Container */}
            <div className="flex min-h-full items-center justify-center p-4">
                {/* Modal Content */}
                <div
                    className={`relative ${maxWidthClasses[maxWidth]} w-full animate-scale-in`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Card */}
                    <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-200 overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {icon && (
                                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                                        {icon}
                                    </div>
                                )}
                                <h2 className="text-2xl font-bold text-white">{title}</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <XMarkIcon className="h-6 w-6 text-white" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
