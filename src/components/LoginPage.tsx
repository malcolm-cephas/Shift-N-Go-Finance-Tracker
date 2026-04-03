'use client';

import Link from 'next/link';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-neutral-800 rounded-[2.5rem] shadow-2xl dark:shadow-neutral-950 p-10 border border-neutral-100 dark:border-neutral-700">
          {/* Logo/Header */}
          <div className="text-center mb-10">
            <div className="h-1.5 w-16 bg-brand-red mx-auto mb-6 rounded-full"></div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-3 tracking-tighter uppercase">
              Shift <span className="text-brand-red italic">N</span> Go
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 font-medium">
              Enterprise Financial Intelligence
            </p>
          </div>

          {/* Authentication Action */}
          <div className="space-y-6">
            <div className="bg-neutral-50 dark:bg-neutral-700/30 rounded-3xl p-6 border border-dashed border-neutral-200 dark:border-neutral-600 mb-8">
              <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center leading-relaxed">
                Securely manage dealership inventory, log operations, and generate investor-ready reports.
              </p>
            </div>

            <a
              href="/auth/login"
              className="group relative w-full flex items-center justify-center py-4 px-6 bg-brand-red hover:bg-brand-red-dark text-white text-lg font-black rounded-2xl transition-all shadow-xl shadow-red-600/20 active:scale-[0.98]"
            >
              SIGN IN TO SYSTEM
            </a>

            <div className="flex items-center justify-center gap-4 py-4">
              <div className="h-px flex-1 bg-neutral-100 dark:bg-neutral-700"></div>
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Security Verified</span>
              <div className="h-px flex-1 bg-neutral-100 dark:bg-neutral-700"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-neutral-50 dark:bg-neutral-700/50 p-4 rounded-2xl text-center">
                <span className="block text-xl mb-1">🛡️</span>
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-tight leading-none">Role Based Access</span>
              </div>
              <div className="bg-neutral-50 dark:bg-neutral-700/50 p-4 rounded-2xl text-center">
                <span className="block text-xl mb-1">☁️</span>
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-tight leading-none">Cloud Persistent</span>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-10 pt-8 border-t border-neutral-100 dark:border-neutral-700 text-center">
            <p className="text-xs text-neutral-400 font-medium uppercase tracking-widest mb-4">
              Restricted Access
            </p>
            <div className="flex justify-center gap-6">
              <Link href="/disclaimer" className="text-xs text-neutral-500 hover:text-brand-red transition-colors font-bold uppercase tracking-tighter">
                Disclaimer
              </Link>
              <span className="text-neutral-200">|</span>
              <span className="text-xs text-neutral-500 font-bold uppercase tracking-tighter">
                v2.0.4-Sync
              </span>
            </div>
          </div>
        </div>
        
        {/* Sub-footer Branding */}
        <p className="text-center mt-8 text-neutral-400 dark:text-neutral-600 text-[10px] font-bold uppercase tracking-[0.2em]">
          © {new Date().getFullYear()} Shift N Go
        </p>
      </div>
    </div>
  );
};

export default LoginPage;



