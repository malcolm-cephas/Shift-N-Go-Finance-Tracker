'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const TermsPage = () => {
    const { isAuthConfigured } = useAuth();
    
    return (
        <div className="min-h-screen bg-[#FDFDFD] dark:bg-neutral-950 py-16 px-6">
            <div className="max-w-5xl mx-auto">
                
                {/* Formal Document Header */}
                <header className="border-b-2 border-neutral-900 dark:border-white pb-8 mb-12">
                    <div className="flex flex-col md:flex-row justify-between items-baseline gap-4">
                        <div>
                            <h1 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                                Service <span className="text-brand-red">Agreement</span>
                            </h1>
                            <p className="text-xs font-bold text-neutral-500 uppercase tracking-[0.2em] mt-2">Shift N Go Dealership Financial Infrastructure</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Document ID: SNG-LEG-2026-001</p>
                            <p className="text-[10px] font-black text-neutral-900 dark:text-white uppercase tracking-widest mt-1">Effective: April 07, 2026</p>
                        </div>
                    </div>
                </header>

                <div className="grid lg:grid-cols-[280px_1fr] gap-16">
                    
                    {/* Sticky Table of Contents */}
                    <aside className="hidden lg:block">
                        <div className="sticky top-24 space-y-6">
                            <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest border-b border-neutral-200 dark:border-neutral-800 pb-2">Master Index</h3>
                            <nav className="flex flex-col gap-3">
                                {[
                                    {id: 1, title: 'Our Services'},
                                    {id: 2, title: 'Intellectual Property'},
                                    {id: 3, title: 'Purchases & Payment'},
                                    {id: 4, title: 'Prohibited Activities'},
                                    {id: 5, title: 'Governing Law'},
                                    {id: 6, title: 'Dispute Resolution'},
                                    {id: 7, title: 'Disclaimer'},
                                    {id: 8, title: 'Contact Office'},
                                ].map(section => (
                                    <a 
                                        key={section.id} 
                                        href={`#section-${section.id}`} 
                                        className="text-[11px] font-bold text-gray-600 dark:text-neutral-500 hover:text-brand-red transition-colors uppercase tracking-tight"
                                    >
                                        {section.id}. {section.title}
                                    </a>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Main Legal Content */}
                    <main className="space-y-16 pb-24 border-l border-neutral-100 dark:border-neutral-900 pl-8 lg:pl-16">
                        
                        {/* Preface */}
                        <section className="space-y-4">
                            <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Introduction</h2>
                            <div className="text-sm text-neutral-500 leading-relaxed space-y-4 font-medium">
                                <p>We are <span className="text-gray-900 dark:text-white font-bold">Shift N Go</span> (&apos;Company&apos;, &apos;we&apos;, &apos;us&apos;, or &apos;our&apos;). We operate the website shift-n-go-finance-tracker.com (the &apos;Site&apos;), as well as any other related products and services that refer or link to these legal terms (the &apos;Legal Terms&apos;).</p>
                                <p className="border-l-2 border-brand-red pl-6 py-2 italic text-gray-700 dark:text-neutral-400">
                                    This platform is a secure, role-based dealership audit environment. By accessing the Services, you acknowledge you have read and agreed to be bound by these corporate standards.
                                </p>
                            </div>
                        </section>

                        <div className="h-px bg-neutral-100 dark:bg-neutral-900"></div>

                        {/* Section 1 */}
                        <section id="section-1" className="scroll-mt-24 space-y-4">
                            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">1. Our Services</h3>
                            <p className="text-sm text-neutral-500 leading-relaxed font-medium">
                                Information provided within the Services is not intended for distribution in jurisdictions where such use would violate local regulations. Users accessing from outside primary operational zones do so at their own risk and are responsible for local compliance.
                            </p>
                        </section>

                        {/* Section 2 */}
                        <section id="section-2" className="scroll-mt-24 space-y-6">
                            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">2. Intellectual Property Rights</h3>
                            <div className="space-y-4 text-sm text-neutral-500 leading-relaxed font-medium">
                                <p>We maintain exclusive ownership or licensing of all source code, databases, software, and designs (Content), and all trademarks and logos (Marks) contained within the Services.</p>
                                <p>Subject to compliance, we grant you a non-exclusive, non-transferable license to access the Services solely for internal dealership auditing purposes.</p>
                            </div>
                        </section>

                        {/* Section 3 */}
                        <section id="section-3" className="scroll-mt-24 space-y-4">
                            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">3. Purchases and Payment</h3>
                            <div className="bg-neutral-50 dark:bg-neutral-900/50 p-6 border dark:border-neutral-800">
                                <p className="text-sm text-neutral-500 leading-relaxed font-medium mb-4">
                                    All financial processing within the platform defaults to the following standard for accurate cross-border auditing:
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="text-[10px] font-black bg-neutral-900 dark:bg-white text-white dark:text-black px-3 py-1 uppercase">Audit Currency</div>
                                    <span className="text-lg font-black text-brand-red">INR (₹)</span>
                                </div>
                            </div>
                        </section>

                        {/* Section 4 */}
                        <section id="section-4" className="scroll-mt-24 space-y-4">
                            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">4. Prohibited Activities</h3>
                            <div className="grid md:grid-cols-2 gap-x-12 gap-y-4 text-[11px] font-bold text-neutral-500 uppercase tracking-tight">
                                <div className="flex gap-3 items-baseline border-b border-neutral-50 dark:border-neutral-900 pb-2">
                                    <span className="text-brand-red">01</span>
                                    <span>Systematic data mining or scraping</span>
                                </div>
                                <div className="flex gap-3 items-baseline border-b border-neutral-50 dark:border-neutral-900 pb-2">
                                    <span className="text-brand-red">02</span>
                                    <span>Circumvention of role security</span>
                                </div>
                                <div className="flex gap-3 items-baseline border-b border-neutral-50 dark:border-neutral-900 pb-2">
                                    <span className="text-brand-red">03</span>
                                    <span>Unauthorized API interference</span>
                                </div>
                                <div className="flex gap-3 items-baseline border-b border-neutral-50 dark:border-neutral-900 pb-2">
                                    <span className="text-brand-red">04</span>
                                    <span>Proprietary content redistribution</span>
                                </div>
                            </div>
                        </section>

                        {/* Section 5 */}
                        <section id="section-5" className="scroll-mt-24 space-y-4">
                            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">5. Governing Law</h3>
                            <p className="text-sm text-neutral-500 leading-relaxed font-medium">
                                These terms are governed by the laws of <strong>India</strong>. Users irrevocably consent to the exclusive jurisdiction of Indian courts for all matters arising from these Legal Terms.
                            </p>
                        </section>

                        {/* Section 6 */}
                        <section id="section-6" className="scroll-mt-24 space-y-6">
                            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">6. Dispute Resolution</h3>
                            <div className="bg-white dark:bg-neutral-900 border-2 border-neutral-100 dark:border-neutral-800 p-8 space-y-6">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <h4 className="text-[10px] font-black uppercase text-neutral-400">Negotiation Period</h4>
                                        <p className="text-sm font-bold text-gray-800 dark:text-neutral-200">30-Day Mandatory Consultation</p>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-[10px] font-black uppercase text-neutral-400">Seat of Proceedings</h4>
                                        <p className="text-sm font-bold text-gray-800 dark:text-neutral-200">Madurai, Tamil Nadu, India</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Section 7 */}
                        <section id="section-7" className="scroll-mt-24 space-y-4">
                            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">7. Disclaimer</h3>
                            <div className="bg-gray-900 p-10 text-white font-medium text-xs leading-loose uppercase tracking-widest">
                                The services are provided on an &quot;as-is&quot; basis. Shift N Go disclaims all liability for data loss resulting from local browser cache clearing or unauthorized user sync settings. All financial decisions made using platform data are the sole responsibility of the user.
                            </div>
                        </section>

                        {/* Section 8 */}
                        <section id="section-8" className="scroll-mt-24 pt-12">
                            <div className="border-t-4 border-neutral-900 dark:border-neutral-800 pt-12">
                                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-6">8. Contact Information</h3>
                                <div className="space-y-2">
                                    <p className="text-xs font-black uppercase tracking-widest">Corporate Secretary</p>
                                    <p className="text-sm font-bold text-neutral-500">admin@shift-n-go-finance-tracker.com</p>
                                    <p className="text-sm font-bold text-neutral-500">Madurai, Tamil Nadu, India</p>
                                </div>
                            </div>
                        </section>

                    </main>
                </div>

                {/* Document Footer Controls */}
                <footer className="mt-12 border-t border-neutral-200 dark:border-neutral-800 pt-12 flex flex-col sm:flex-row justify-center gap-6">
                    <Link
                        href="/"
                        className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-12 py-4 font-black uppercase tracking-widest text-[10px] hover:bg-brand-red dark:hover:bg-brand-red dark:hover:text-white transition-all text-center"
                    >
                        Return to Command Center
                    </Link>
                    <Link
                        href="/disclaimer"
                        className="border-2 border-neutral-900 dark:border-neutral-800 px-12 py-3.5 font-black uppercase tracking-widest text-[10px] text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-all text-center"
                    >
                        View Privacy Charter
                    </Link>
                </footer>
            </div>
        </div>
    );
};

export default TermsPage;
