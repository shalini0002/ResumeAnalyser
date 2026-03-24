"use client";

import { useEffect, useState } from 'react';

interface SnackbarProps {
    message: string;
    type?: 'info' | 'warning' | 'error' | 'success';
    duration?: number;
    onClose?: () => void;
}

export function Snackbar({ message, type = 'info', duration = 3000, onClose }: SnackbarProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger animation
        setIsVisible(true);
        
        // Auto hide after duration
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => {
                onClose?.();
            }, 300);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const getTypeStyles = () => {
        switch (type) {
            case 'error':
                return 'bg-red-50 border-red-300 text-red-800';
            case 'warning':
                return 'bg-yellow-50 border-yellow-300 text-yellow-800';
            case 'success':
                return 'bg-green-50 border-green-300 text-green-800';
            default:
                return 'bg-blue-50 border-blue-300 text-blue-800';
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'error':
                return '⚠️';
            case 'warning':
                return '📝';
            case 'success':
                return '✅';
            default:
                return 'ℹ️';
        }
    };

    return (
        <div className={`fixed top-20 right-4 z-50 transform transition-all duration-300 ${
            isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}>
            <div className={`relative max-w-sm p-4 rounded-lg border-2 shadow-xl transform -rotate-1 ${getTypeStyles()}`}>
                {/* Sketchy border effect */}
                <div className={`absolute inset-0 border-2 border-gray-800 rounded-lg transform scale-105 pointer-events-none opacity-20`}></div>
                
                {/* Paper texture background */}
                <div className="absolute inset-0 opacity-5 rounded-lg">
                    <div className="h-full w-full rounded-lg" style={{ 
                        backgroundImage: `repeating-linear-gradient(
                            45deg,
                            transparent,
                            transparent 1px,
                            rgba(0,0,0,0.01) 1px,
                            rgba(0,0,0,0.01) 2px
                        )`
                    }}></div>
                </div>

                <div className="relative flex items-center space-x-3">
                    <span className="text-xl">{getIcon()}</span>
                    <p className="text-sm font-medium flex-1">{message}</p>
                    
                    {/* Close button */}
                    <button
                        onClick={() => {
                            setIsVisible(false);
                            setTimeout(() => onClose?.(), 300);
                        }}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Doodle decoration */}
                <div className="absolute -top-1 -right-1 w-3 h-3 border-2 border-yellow-400 rounded-full transform rotate-12 opacity-60"></div>
                <div className="absolute -bottom-1 -left-1 w-2 h-2 border-2 border-green-400 transform rotate-45"></div>
            </div>
        </div>
    );
}

// Hook for using snackbar
export function useSnackbar() {
    const [snackbar, setSnackbar] = useState<{
        message: string;
        type: 'info' | 'warning' | 'error' | 'success';
        isVisible: boolean;
    } | null>(null);

    const showSnackbar = (message: string, type: 'info' | 'warning' | 'error' | 'success' = 'info') => {
        setSnackbar({ message, type, isVisible: true });
    };

    const hideSnackbar = () => {
        setSnackbar(null);
    };

    const SnackbarComponent = snackbar ? (
        <Snackbar
            message={snackbar.message}
            type={snackbar.type}
            onClose={hideSnackbar}
        />
    ) : null;

    return { showSnackbar, hideSnackbar, SnackbarComponent };
}
