'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export const SpinningTyre = () => {
    const { role } = useAuth();
    const isAdmin = role === 'ADMIN' || role === 'MANAGER';
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div 
            className="fixed bottom-6 left-6 z-[9999] group print:hidden"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <div className="relative">
                {/* Outer Glow */}
                <div className="absolute inset-0 bg-brand-red opacity-10 rounded-full blur-2xl scale-150 animate-pulse"></div>
                
                {/* Quick Menu Popover */}
                {isAdmin && isOpen && (
                    <div className="absolute left-0 bottom-16 bg-white dark:bg-neutral-900 border-2 border-brand-red p-3 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-4 duration-300 min-w-[200px]">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-2">Quick Navigation</div>
                        <div className="flex flex-col gap-1">
                            <Link href="/inventory" className="flex items-center gap-3 px-3 py-2.5 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl transition-all group/item">
                                <span className="text-lg grayscale group-hover/item:grayscale-0 transition-all">📂</span>
                                <span className="text-xs font-black uppercase tracking-widest text-gray-700 dark:text-neutral-300 group-hover/item:text-brand-red">Inventory</span>
                            </Link>
                            <Link href="/log-expenses" className="flex items-center gap-3 px-3 py-2.5 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl transition-all group/item">
                                <span className="text-lg grayscale group-hover/item:grayscale-0 transition-all">📝</span>
                                <span className="text-xs font-black uppercase tracking-widest text-gray-700 dark:text-neutral-300 group-hover/item:text-brand-red">Log Expenses</span>
                            </Link>
                            <Link href="/investor-dashboard" className="flex items-center gap-3 px-3 py-2.5 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl transition-all group/item">
                                <span className="text-lg grayscale group-hover/item:grayscale-0 transition-all">👥</span>
                                <span className="text-xs font-black uppercase tracking-widest text-gray-700 dark:text-neutral-300 group-hover/item:text-brand-red">Investors</span>
                            </Link>
                        </div>
                    </div>
                )}

                {/* The Spinning Tyre Image */}
                <Link href="/" className="relative block animate-[spin_3s_linear_infinite] drop-shadow-lg hover:animate-[spin_1s_linear_infinite] transition-all">
                    <Image 
                        src="/tire.png" 
                        alt="Spinning Tyre" 
                        width={48} 
                        height={48} 
                        className="object-contain"
                    />
                </Link>

                {/* Branding Tooltip on Hover */}
                {!isOpen && (
                    <div className="absolute left-14 bottom-0 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-neutral-900 text-white text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-lg shadow-lg pointer-events-none">
                        Shift N Go - Dealer Command
                    </div>
                )}
            </div>
        </div>
    );
};
