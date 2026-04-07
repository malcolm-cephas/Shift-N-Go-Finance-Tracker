'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const TermsPage = () => {
    const { isAuthConfigured } = useAuth();
    
    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-12 px-6">
            <div className="max-w-4xl mx-auto space-y-10 pb-32">
                {/* Header Card */}
                <div className="bg-white dark:bg-neutral-900 rounded-[3rem] shadow-2xl p-10 md:p-16 border border-neutral-100 dark:border-neutral-800 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-red via-red-500 to-brand-red"></div>
                    <div className="text-6xl mb-8 drop-shadow-xl">⚖️</div>
                    <h1 className="text-5xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-4">
                        Legal <span className="text-brand-red">Terms</span>
                    </h1>
                    <p className="text-neutral-500 font-bold uppercase tracking-[0.3em] text-xs">Shift N Go Dealership Service Agreement</p>
                    <p className="mt-8 text-[10px] font-black text-neutral-400 uppercase tracking-widest">Last updated April 07, 2026</p>
                </div>

                {/* Agreement Summary */}
                <div className="bg-neutral-900 text-white p-10 rounded-[2.5rem] shadow-xl border border-neutral-800 relative overflow-hidden group">
                    <div className="absolute -right-10 -bottom-10 text-[15rem] grayscale opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">🛡️</div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter mb-6 border-b border-neutral-800 pb-4">AGREEMENT TO OUR LEGAL TERMS</h2>
                    <div className="space-y-6 text-sm font-medium text-neutral-400 leading-relaxed">
                        <p>We are <span className="text-white font-black">Shift N Go</span> (&apos;Company&apos;, &apos;we&apos;, &apos;us&apos;, or &apos;our&apos;).</p>
                        <p>We operate the website <span className="text-brand-red font-bold underline">shift-n-go-finance-tracker.com</span> (the &apos;Site&apos;), as well as any other related products and services that refer or link to these legal terms (the &apos;Legal Terms&apos;) (collectively, the &apos;Services&apos;).</p>
                        <p className="bg-neutral-800/50 p-6 rounded-3xl border border-neutral-700 text-white italic">
                            Shift N Go Finance Tracker is a premium, whitelist-secured Dealership Audit Platform. It provides a transparent, role-based &quot;Master Ledger&quot; for Founders, Managers, and Investors to track car sales, expenses, and overall dealership performance with total financial security.
                        </p>
                        <p>You can contact us by email at <span className="text-white font-black">admin@shift-n-go-finance-tracker.com</span> or by mail to <span className="text-white font-black">Madurai, Tamil Nadu, India</span>.</p>
                        <p>These Legal Terms constitute a legally binding agreement made between you, personally or on behalf of an entity (&apos;you&apos;), and Shift N Go, concerning your access to and use of the Services.</p>
                        <p className="font-black text-white uppercase tracking-widest text-[10px]">IF YOU DO NOT AGREE WITH ALL OF THESE LEGAL TERMS, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SERVICES AND YOU MUST DISCONTINUE USE IMMEDIATELY.</p>
                    </div>
                </div>

                {/* Table of Contents Wrapper */}
                <div className="bg-white dark:bg-neutral-900 rounded-[2.5rem] shadow-xl border border-neutral-100 dark:border-neutral-800 p-10 md:p-12">
                    <h3 className="text-xs font-black text-neutral-400 uppercase tracking-[0.4em] mb-8 border-b border-dashed dark:border-neutral-800 pb-2">Master Index</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            {id: 1, title: 'OUR SERVICES'},
                            {id: 2, title: 'INTELLECTUAL PROPERTY RIGHTS'},
                            {id: 3, title: 'USER REPRESENTATIONS'},
                            {id: 4, title: 'USER REGISTRATION'},
                            {id: 5, title: 'PURCHASES AND PAYMENT'},
                            {id: 6, title: 'PROHIBITED ACTIVITIES'},
                            {id: 7, title: 'USER GENERATED CONTRIBUTIONS'},
                            {id: 8, title: 'CONTRIBUTION LICENCE'},
                            {id: 9, title: 'THIRD-PARTY WEBSITES AND CONTENT'},
                            {id: 10, title: 'SERVICES MANAGEMENT'},
                            {id: 11, title: 'TERM AND TERMINATION'},
                            {id: 12, title: 'MODIFICATIONS AND INTERRUPTIONS'},
                            {id: 13, title: 'GOVERNING LAW'},
                            {id: 14, title: 'DISPUTE RESOLUTION'},
                            {id: 15, title: 'CORRECTIONS'},
                            {id: 16, title: 'DISCLAIMER'},
                            {id: 17, title: 'LIMITATIONS OF LIABILITY'},
                            {id: 18, title: 'INDEMNIFICATION'},
                            {id: 19, title: 'USER DATA'},
                            {id: 20, title: 'ELECTRONIC COMMUNICATIONS'},
                            {id: 21, title: 'MISCELLANEOUS'},
                            {id: 22, title: 'CONTACT US'},
                        ].map(section => (
                            <a 
                                key={section.id} 
                                href={`#section-${section.id}`} 
                                className="text-[10px] font-black text-gray-700 dark:text-neutral-400 hover:text-brand-red transition-colors uppercase tracking-widest flex items-center gap-2"
                            >
                                <span className="w-6 h-6 flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 rounded-lg text-[8px]">{section.id}</span>
                                {section.title}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Detailed Sections Content */}
                <div className="bg-white dark:bg-neutral-900 rounded-[2.5rem] shadow-xl border border-neutral-100 dark:border-neutral-800 p-10 md:p-12 space-y-16">
                    {/* Section 1 */}
                    <div id="section-1">
                        <h4 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-4">1. OUR SERVICES</h4>
                        <p className="text-sm text-neutral-500 font-medium leading-relaxed">
                            The information provided when using the Services is not intended for distribution to or use by any person or entity in any jurisdiction or country where such distribution or use would be contrary to law or regulation. Those who choose to access the Services from other locations do so on their own initiative and are solely responsible for compliance with local laws.
                        </p>
                    </div>

                    {/* Section 2 */}
                    <div id="section-2">
                        <h4 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-4">2. INTELLECTUAL PROPERTY RIGHTS</h4>
                        <div className="space-y-4">
                            <p className="text-sm font-black text-brand-red uppercase tracking-widest text-[10px]">Our intellectual property</p>
                            <p className="text-sm text-neutral-500 font-medium leading-relaxed">
                                We are the owner or the licensee of all intellectual property rights in our Services, including all source code, databases, functionality, software, website designs, text, and graphics in the Services (collectively, the &apos;Content&apos;), as well as the trademarks and logos contained therein (the &apos;Marks&apos;).
                            </p>
                            <p className="text-sm text-neutral-500 font-medium leading-relaxed italic border-l-2 border-brand-red pl-4">
                                If you wish to make any use of the Services, Content, or Marks other than as set out in this section, please address your request to: <span className="text-gray-900 dark:text-white font-black underline">admin@shift-n-go-finance-tracker.com</span>.
                            </p>
                        </div>
                    </div>

                    {/* Section 5 */}
                    <div id="section-5">
                        <h4 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-4">5. PURCHASES AND PAYMENT</h4>
                        <p className="text-sm text-neutral-500 font-medium leading-relaxed mb-4">
                            All purchases are non-refundable. We accept major payment methods as deemed required by us.
                        </p>
                        <p className="bg-neutral-50 dark:bg-neutral-800 p-6 rounded-2xl border dark:border-neutral-700 text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">
                            Official Audit Currency: <span className="text-brand-red">INR (₹)</span>
                        </p>
                    </div>

                    {/* Section 6 */}
                    <div id="section-6">
                        <h4 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-4">6. PROHIBITED ACTIVITIES</h4>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] font-bold text-neutral-500">
                           {[
                               'Systematically retrieve data to create compilations',
                               'Trick, defraud, or mislead other users',
                               'Circumvent security-related features',
                               'Disparage, tarnish, or harm the Services',
                               'Automated use of the system (bots/scripts)',
                               'Interfering with proper network functions'
                           ].map(item => (
                               <li key={item} className="flex items-start gap-2">
                                   <span className="text-brand-red mt-0.5">✖</span> {item}
                               </li>
                           ))}
                        </ul>
                    </div>

                    {/* Section 13 & 14 */}
                    <div id="section-13">
                        <h4 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-4">13. GOVERNING LAW</h4>
                        <p className="text-sm text-neutral-500 font-medium leading-relaxed">
                            These Legal Terms shall be governed by and defined following the laws of <strong>India</strong>. Shift N Go and yourself irrevocably consent that the courts of India shall have exclusive jurisdiction to resolve any dispute.
                        </p>
                    </div>

                    <div id="section-14" className="bg-neutral-50 dark:bg-neutral-800/50 p-8 rounded-[2.5rem] border dark:border-neutral-700">
                        <h4 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-4">14. DISPUTE RESOLUTION</h4>
                        <div className="space-y-6 text-sm text-neutral-500 font-medium">
                            <p><span className="font-black text-gray-900 dark:text-white uppercase text-[10px]">Informal Negotiations:</span> Parties agree to attempt 30 days of informal negotiation before initiating arbitration.</p>
                            <p><span className="font-black text-gray-900 dark:text-white uppercase text-[10px]">Binding Arbitration:</span> Any dispute shall be referred to and finally resolved by the International Commercial Arbitration Court.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-neutral-950 p-6 rounded-2xl border dark:border-neutral-800">
                                <div>
                                    <p className="text-[10px] font-black uppercase text-neutral-400">Seat of Arbitration</p>
                                    <p className="text-xs font-black text-gray-900 dark:text-white">Madurai, India</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-neutral-400">Language of Proceedings</p>
                                    <p className="text-xs font-black text-gray-900 dark:text-white">Tamil</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 16 */}
                    <div id="section-16" className="bg-red-50 dark:bg-red-950/20 p-8 rounded-[2rem] border border-red-100 dark:border-red-900/50">
                        <h4 className="text-lg font-black text-red-700 dark:text-red-400 uppercase tracking-tighter mb-4">16. DISCLAIMER</h4>
                        <p className="text-[10px] font-black text-red-900/70 dark:text-red-300 leading-relaxed uppercase tracking-widest">
                            THE SERVICES ARE PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE THAT YOUR USE OF THE SERVICES WILL BE AT YOUR SOLE RISK. WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
                        </p>
                    </div>

                    {/* Section 22 */}
                    <div id="section-22" className="bg-white dark:bg-neutral-900 rounded-[2.5rem] shadow-xl border border-neutral-100 dark:border-neutral-800 p-10 md:p-12 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red/5 rounded-full -translate-y-16 translate-x-16"></div>
                        <h4 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-4">22. CONTACT US</h4>
                        <p className="text-sm text-neutral-500 font-medium mb-8">In order to resolve a complaint regarding the Services or to receive further information regarding use of the Services, please contact us at:</p>
                        <div className="space-y-4">
                            <div className="inline-block bg-neutral-900 text-white px-8 py-5 rounded-2xl font-black uppercase text-xs tracking-widest">
                                Shift N Go
                            </div>
                            <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                                admin@shift-n-go-finance-tracker.com <br/>
                                Madurai, Tamil Nadu, India
                            </div>
                        </div>
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

export default TermsPage;
