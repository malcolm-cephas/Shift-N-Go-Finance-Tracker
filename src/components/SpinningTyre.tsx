'use client';

import Image from 'next/image';
import Link from 'next/link';

export const SpinningTyre = () => {
    return (
        <div className="fixed bottom-6 left-6 z-[9999] group cursor-pointer">
            <Link href="/" className="relative block">
                {/* Outer Glow */}
                <div className="absolute inset-0 bg-neutral-50 dark:bg-neutral-8000/20 rounded-full blur-xl scale-125 animate-pulse"></div>
                
                {/* The Spinning Tyre Image */}
                <div className="relative animate-[spin_3s_linear_infinite] drop-shadow-lg hover:animate-[spin_1s_linear_infinite] transition-all">
                    <Image 
                        src="/tire.png" 
                        alt="Spinning Tyre" 
                        width={48} 
                        height={48} 
                        className="object-contain"
                    />
                </div>

                {/* Branding Tooltip on Hover */}
                <div className="absolute left-14 bottom-0 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-neutral-900 text-white text-xs px-2 py-1 rounded shadow-lg pointer-events-none">
                    Shift N Go - Dealer Dashboard
                </div>
            </Link>
        </div>
    );
};



