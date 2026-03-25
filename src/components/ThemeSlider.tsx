'use client';

import { useTheme } from '@/context/ThemeContext';
import { useEffect, useState } from 'react';

export const ThemeSlider = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="w-24 h-8 bg-gray-100 dark:bg-neutral-800 rounded-full animate-pulse"></div>;

    const isDark = theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    const toggleTheme = () => {
        setTheme(isDark ? 'light' : 'dark');
    };

    return (
        <div className="flex items-center space-x-2 bg-gray-100 dark:bg-neutral-800/50 p-1 rounded-full border border-gray-200 dark:border-neutral-700 shadow-inner">
            <button
                onClick={toggleTheme}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2 dark:focus:ring-offset-neutral-900 shadow-sm"
                style={{ backgroundColor: isDark ? 'var(--brand-red)' : '#d1d5db' }}
            >
                <span className="sr-only">Toggle theme</span>
                <span
                    className={`${
                        isDark ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-300 ease-in-out shadow-md`}
                />
            </button>
        </div>
    );
};
