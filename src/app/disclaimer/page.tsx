'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const DisclaimerPage = () => {
    const { isAuthConfigured } = useAuth();
    
    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-12 px-6">
            <div className="max-w-4xl mx-auto space-y-10">
                {/* Main Header Card */}
                <div className="bg-white dark:bg-neutral-900 rounded-[3rem] shadow-2xl p-10 md:p-16 border border-neutral-100 dark:border-neutral-800 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-red via-red-500 to-brand-red"></div>
                    <h1 className="text-5xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-4">
                        Security & Privacy <br/> <span className="text-brand-red">Charter</span>
                    </h1>
                    <p className="text-neutral-500 font-bold uppercase tracking-[0.3em] text-xs">Shift N Go Dealership Financial Standards</p>
                </div>

                {/* The Gatekeeper Commitment */}
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-red-50/50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/50 p-8 rounded-[2.5rem] relative overflow-hidden group">
                        <h2 className="text-xl font-black text-red-700 dark:text-red-400 uppercase tracking-tighter mb-4 flex items-center gap-3">
                            The Gatekeeper
                        </h2>
                        <p className="text-sm font-medium text-red-900/70 dark:text-red-300/70 leading-relaxed">
                            Access to this financial tracker is <strong>Strictly Whitelist-Only</strong>. Every digital identity that reaches our login gate is automatically held in a &quot;Pending&quot; lobby. No data is revealed until the <strong>Founder</strong> manually verifies and assigns an official dealership role.
                        </p>
                    </div>

                    <div className="bg-neutral-900 text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
                        <h2 className="text-xl font-black text-white uppercase tracking-tighter mb-4 flex items-center gap-3">
                            Role Integrity
                        </h2>
                        <p className="text-sm font-medium text-neutral-400 leading-relaxed">
                            Our system enforces strict <strong>Role-Based Access Control (RBAC)</strong>. Investors can only audit performance, while Managers handle dealership operations. Only the Founder possesses the keys to the Master Security Registry.
                        </p>
                    </div>
                </div>

                {/* Core Privacy Policies */}
                <div className="bg-white dark:bg-neutral-900 rounded-[2.5rem] shadow-xl border border-neutral-100 dark:border-neutral-800 p-10 md:p-12">
                   <div className="space-y-12">
                       {/* Authentication Section */}
                       <section>
                           <h3 className="text-xs font-black text-neutral-400 uppercase tracking-[0.4em] mb-6 border-b border-dashed dark:border-neutral-800 pb-2">Digital Identification</h3>
                           <div className="grid md:grid-cols-2 gap-10">
                               <div>
                                   <h4 className="font-black text-gray-900 dark:text-white uppercase text-sm mb-3">Google One-Tap OAuth</h4>
                                   <p className="text-sm text-neutral-500 font-medium leading-relaxed">
                                       We utilize <strong>Auth0 Enterprise Infrastructure</strong> for all identity management. For maximum security and verified audit trails, we exclusively integrate with <strong>Google OAuth</strong>. We never see, touch, or store your passwords.
                                   </p>
                               </div>
                               <ul className="space-y-3">
                                   {['Industry-standard encryption', 'Verified Google Identity Layer', 'One-Click Secure Entry', 'No password storage on server'].map(item => (
                                       <li key={item} className="flex items-center gap-3 text-xs font-bold text-gray-700 dark:text-neutral-300">
                                           <span className="text-brand-red">•</span> {item}
                                       </li>
                                   ))}
                               </ul>
                           </div>
                       </section>

                       {/* Data Sovereignty Section */}
                       <section>
                           <h3 className="text-xs font-black text-neutral-400 uppercase tracking-[0.4em] mb-6 border-b border-dashed dark:border-neutral-800 pb-2">Data Sovereignty</h3>
                           <div className="grid md:grid-cols-2 gap-10">
                               <div className="bg-neutral-50 dark:bg-neutral-800/50 p-6 rounded-3xl border dark:border-neutral-800">
                                   <h4 className="font-black text-gray-900 dark:text-white uppercase text-xs mb-3">Browser Residency</h4>
                                   <p className="text-[11px] text-neutral-500 font-bold leading-relaxed">
                                       By default, your dealership logs live within your browser&apos;s local memory. Maximum privacy—your data never leaves your machine unless you choose to activate the Cloud Audit Sync.
                                   </p>
                               </div>
                               <div className="bg-neutral-50 dark:bg-neutral-800/50 p-6 rounded-3xl border dark:border-neutral-800">
                                   <h4 className="font-black text-gray-900 dark:text-white uppercase text-xs mb-3">Encrypted Cloud Sync</h4>
                                   <p className="text-[11px] text-neutral-500 font-bold leading-relaxed">
                                       When sync is enabled, your data is mirrored to our <strong>MongoDB Enterprise Database</strong> (Hosted on AWS). Every bit is encrypted in transit and at rest.
                                   </p>
                               </div>
                           </div>
                       </section>

                       {/* Legal Disclaimer Section */}
                       <section>
                           <h3 className="text-xs font-black text-neutral-400 uppercase tracking-[0.4em] mb-6 border-b border-dashed dark:border-neutral-800 pb-2">Legal Accountability</h3>
                           <div className="bg-gray-900 rounded-[2rem] p-8 text-neutral-400 text-[11px] font-medium uppercase tracking-widest leading-loose">
                               <p className="mb-4 text-white font-black italic border-l-2 border-brand-red pl-4">Disclaimer of Professional Liability:</p>
                               <ul className="space-y-4 list-none">
                                   <li>• This platform is an auditing tool, not professional financial advice.</li>
                                   <li>• The accuracy of business logs is the sole responsibility of the log creator.</li>
                                   <li>• We provide NO warranty for data integrity in the event of local browser clearing.</li>
                                   <li>• Shift N Go reserve the right to revoke access to any ID at any time for security audits.</li>
                                   <li>• By using this system, you agree to these security protocols.</li>
                               </ul>
                           </div>
                       </section>
                   </div>
                </div>

                {/* Footer Navigation */}
                <div className="flex flex-col sm:flex-row justify-center gap-6 pt-10">
                    <Link
                        href="/"
                        className="bg-brand-red hover:bg-brand-red-dark text-white px-10 py-5 rounded-2xl font-black transition-all text-center uppercase tracking-widest text-xs shadow-xl shadow-red-200 dark:shadow-none active:scale-95"
                    >
                        Back to Command Center
                    </Link>
                    <Link
                        href="/terms"
                        className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-gray-900 dark:text-white px-10 py-5 rounded-2xl font-black transition-all text-center uppercase tracking-widest text-xs shadow-md active:scale-95"
                    >
                        Detailed Legal Terms
                    </Link>
                    <Link
                        href="/settings"
                        className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-gray-900 dark:text-white px-10 py-5 rounded-2xl font-black transition-all text-center uppercase tracking-widest text-xs shadow-md active:scale-95"
                    >
                        Security Settings
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default DisclaimerPage;
