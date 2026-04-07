'use client';

import { useState, useMemo } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useFinance } from '@/context/FinanceContext';
import { useCurrency } from '@/context/CurrencyContext';
import { TRANSACTION_CATEGORIES } from '@/types/finance';
import { CurrencySelector } from '@/components/CurrencySelector';

export default function TransactionsMasterPage() {
    const { transactions, accounts } = useFinance();
    const { formatCurrency } = useCurrency();

    // -- Filter State --
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    
    // -- Pagination State --
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    // -- Derived Data (Filtering logic) --
    const filteredTransactions = useMemo(() => {
        return transactions.filter(tx => {
            const searchStr = searchTerm.toLowerCase();
            const accountName = accounts.find(a => a.id === tx.accountId)?.name || '';
            const txDate = new Date(tx.date);
            const txDateStr = txDate.toLocaleDateString('en-GB');

            // 1. Text Search
            const matchesSearch = 
                tx.description?.toLowerCase().includes(searchStr) ||
                tx.category?.toLowerCase().includes(searchStr) ||
                accountName.toLowerCase().includes(searchStr) ||
                txDateStr.includes(searchStr) ||
                tx.amount.toString().includes(searchStr);

            // 2. Type Filter
            const matchesType = typeFilter === 'all' || tx.type === typeFilter;

            // 3. Category Filter
            const matchesCategory = categoryFilter === 'all' || tx.category === categoryFilter;

            // 4. Date Filter
            let matchesDate = true;
            if (startDate) {
                const sDate = new Date(startDate);
                sDate.setHours(0, 0, 0, 0);
                if (txDate < sDate) matchesDate = false;
            }
            if (endDate) {
                const eDate = new Date(endDate);
                eDate.setHours(23, 59, 59, 999);
                if (txDate > eDate) matchesDate = false;
            }

            return matchesSearch && matchesType && matchesCategory && matchesDate;
        });
    }, [transactions, searchTerm, typeFilter, categoryFilter, startDate, endDate, accounts]);

    // -- Sorting (Most recent first) --
    const sortedTransactions = useMemo(() => {
        return [...filteredTransactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [filteredTransactions]);

    // -- Pagination Logic --
    const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);
    const paginatedTransactions = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return sortedTransactions.slice(start, start + itemsPerPage);
    }, [sortedTransactions, currentPage, itemsPerPage]);

    const formatAppDate = (date: Date | string) => {
        return new Date(date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    // All unique categories based on current type filter
    const availableCategories = useMemo(() => {
        if (typeFilter === 'income') return TRANSACTION_CATEGORIES.income;
        if (typeFilter === 'expense') return TRANSACTION_CATEGORIES.expense;
        return [...TRANSACTION_CATEGORIES.income, ...TRANSACTION_CATEGORIES.expense];
    }, [typeFilter]);

    return (
        <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'INVESTOR']}>
            <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
                {/* Header Area */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white dark:bg-neutral-800 p-8 rounded-[2.5rem] shadow-xl border border-neutral-100 dark:border-neutral-700">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <span className="text-4xl">📊</span>
                            <h1 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Master History</h1>
                        </div>
                        <p className="text-xs font-black text-neutral-400 uppercase tracking-[0.3em]">Full Audit Trail & Financial Transparency</p>
                    </div>
                    <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                        <CurrencySelector size="sm" />
                        <div className="px-4 py-2 bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-700">
                           <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest whitespace-nowrap">
                             Total Matching Logs: <span className="text-gray-900 dark:text-white ml-1">{filteredTransactions.length}</span>
                           </p>
                        </div>
                    </div>
                </div>

                {/* Advanced Filter Bar */}
                <div className="bg-white dark:bg-neutral-800 rounded-[2.5rem] shadow-2xl p-8 border border-neutral-50 dark:border-neutral-700 flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Global Search */}
                        <div className="relative group">
                            <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2 ml-2">Quick Search</label>
                            <span className="absolute left-4 top-10 text-gray-400 opacity-60 group-focus-within:opacity-100 transition-opacity">🔍</span>
                            <input
                                type="text"
                                placeholder="Search Details, Client, Account..."
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                className="w-full pl-10 pr-4 py-3 bg-neutral-50 dark:bg-neutral-900/50 border dark:border-neutral-700 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-brand-red transition-all"
                            />
                        </div>

                        {/* Date Range Start */}
                        <div>
                            <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2 ml-2">From Date</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }}
                                className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900/50 border dark:border-neutral-700 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-brand-red transition-all"
                            />
                        </div>

                        {/* Date Range End */}
                        <div>
                            <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2 ml-2">To Date</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }}
                                className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900/50 border dark:border-neutral-700 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-brand-red transition-all"
                            />
                        </div>

                        {/* Transaction Type */}
                        <div>
                            <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2 ml-2">Record Type</label>
                            <div className="flex bg-neutral-50 dark:bg-neutral-900/50 p-1 rounded-2xl border dark:border-neutral-700 h-[46px]">
                                {['all', 'income', 'expense'].map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => { setTypeFilter(t as any); setCategoryFilter('all'); setCurrentPage(1); }}
                                        className={`flex-1 rounded-xl text-[10px] font-black uppercase transition-all ${
                                            typeFilter === t 
                                            ? 'bg-white dark:bg-neutral-800 shadow-md text-brand-red' 
                                            : 'text-neutral-400 hover:text-gray-900 dark:hover:text-white'
                                        }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-2 border-t dark:border-neutral-700 border-dashed">
                       {/* Category Filter */}
                       <div>
                            <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2 ml-2">Category</label>
                            <select
                                value={categoryFilter}
                                onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
                                className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900/50 border dark:border-neutral-700 rounded-2xl text-xs font-black uppercase outline-none focus:ring-2 focus:ring-brand-red transition-all"
                            >
                                <option value="all">ALL CATEGORIES</option>
                                {availableCategories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Items Per Page Selector */}
                        <div>
                            <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2 ml-2">Display Density</label>
                            <div className="flex items-center gap-3 bg-neutral-50 dark:bg-neutral-900/50 px-4 py-3 rounded-2xl border dark:border-neutral-700">
                                <span className="text-[10px] font-bold text-neutral-400">SHOW:</span>
                                {[10, 20, 30].map(n => (
                                    <button
                                        key={n}
                                        onClick={() => { setItemsPerPage(n); setCurrentPage(1); }}
                                        className={`text-[10px] font-black transition-all ${itemsPerPage === n ? 'text-brand-red underline underline-offset-4' : 'text-neutral-400'}`}
                                    >
                                        {n}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table Area */}
                <div className="bg-white dark:bg-neutral-800 rounded-[2.5rem] shadow-xl overflow-hidden border border-neutral-100 dark:border-neutral-700">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-neutral-50 dark:bg-neutral-900/80 text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] border-b dark:border-neutral-700">
                                    <th className="px-8 py-6">Date</th>
                                    <th className="px-8 py-6">Dealership Account</th>
                                    <th className="px-8 py-6">Log Description</th>
                                    <th className="px-8 py-6">Category</th>
                                    <th className="px-8 py-6 text-right">Value</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y dark:divide-neutral-700/50">
                                {paginatedTransactions.map(tx => (
                                    <tr key={tx.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-700/30 transition-colors group">
                                        <td className="px-8 py-5">
                                            <p className="font-black text-gray-900 dark:text-neutral-100">{formatAppDate(tx.date)}</p>
                                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-tighter">Business Log</p>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                              <div className="w-2 h-2 rounded-full bg-brand-red"></div>
                                              <p className="text-xs font-bold text-gray-700 dark:text-neutral-300">
                                                {accounts.find(a => a.id === tx.accountId)?.name}
                                              </p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <p className="text-xs font-bold text-gray-800 dark:text-neutral-200">{tx.description || 'General Entry'}</p>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest inline-block border ${
                                                tx.type === 'income' 
                                                ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:border-green-800' 
                                                : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:border-red-800'
                                            }`}>
                                                {tx.category}
                                            </span>
                                        </td>
                                        <td className={`px-8 py-5 text-right font-black text-sm tabular-nums ${
                                            tx.type === 'income' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                            {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                                        </td>
                                    </tr>
                                ))}
                                {filteredTransactions.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="py-32 text-center">
                                          <div className="flex flex-col items-center gap-4">
                                            <span className="text-6xl grayscale opacity-30">📂</span>
                                            <p className="text-sm font-black text-neutral-400 uppercase tracking-widest">No matching transactions found for current filters</p>
                                          </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer / Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="p-8 bg-neutral-50 dark:bg-neutral-900/50 border-t dark:border-neutral-700 flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                                Showing Page <span className="text-gray-900 dark:text-white">{currentPage}</span> of {totalPages}
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="px-6 py-3 rounded-2xl bg-white dark:bg-neutral-800 border dark:border-neutral-700 text-[10px] font-black uppercase tracking-widest shadow-sm hover:shadow-md transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <div className="flex gap-2">
                                    {Array.from({ length: totalPages }, (_, i) => {
                                        const p = i + 1;
                                        if (p === 1 || p === totalPages || (p >= currentPage - 1 && p <= currentPage + 1)) {
                                            return (
                                                <button
                                                    key={p}
                                                    onClick={() => setCurrentPage(p)}
                                                    className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all ${
                                                        currentPage === p 
                                                        ? 'bg-brand-red text-white shadow-lg shadow-red-200 dark:shadow-none' 
                                                        : 'bg-white dark:bg-neutral-800 border dark:border-neutral-700 text-neutral-400'
                                                    }`}
                                                >
                                                    {p}
                                                </button>
                                            );
                                        }
                                        if (p === currentPage - 2 || p === currentPage + 2) return <span key={p} className="text-neutral-400 self-center">...</span>;
                                        return null;
                                    })}
                                </div>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-6 py-3 rounded-2xl bg-white dark:bg-neutral-800 border dark:border-neutral-700 text-[10px] font-black uppercase tracking-widest shadow-sm hover:shadow-md transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
