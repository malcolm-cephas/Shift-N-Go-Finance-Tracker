'use client';

import { useState, useMemo } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { TRANSACTION_CATEGORIES } from '@/types/finance';
import { formatAppDate } from '@/utils/financeUtils';
import { useCurrency } from '@/context/CurrencyContext';
import { useAuth } from '@/context/AuthContext';

export const LogTransactions = () => {
    const { accounts, transactions, addTransaction, deleteTransaction, inventory, investorEmails, getNickname } = useFinance();
    const { formatCurrency } = useCurrency();
    const { role } = useAuth();
    const isReadOnly = role === 'INVESTOR';

    // Form State
    const [amount, setAmount] = useState<string>('');
    const [type, setType] = useState<'income' | 'expense'>('expense');
    const [category, setCategory] = useState<string>(TRANSACTION_CATEGORIES.expense[0]);
    const [accountId, setAccountId] = useState<string>(accounts[0]?.id || '');
    const [vehicleId, setVehicleId] = useState<string>('');
    const [investorEmail, setInvestorEmail] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

    // View State
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const itemsPerPage = 20;


    const handleTypeChange = (newType: 'income' | 'expense') => {
        setType(newType);
        setCategory(TRANSACTION_CATEGORIES[newType][0]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !accountId) return;

        addTransaction({
            accountId,
            vehicleId: vehicleId || undefined,
            investorEmail: investorEmail || undefined,
            amount: parseFloat(amount),
            type,
            category,
            description,
            date: date ? new Date(date) : new Date(),
        });

        setAmount('');
        setDescription('');
        setVehicleId('');
        setInvestorEmail('');
        setDate(new Date().toISOString().split('T')[0]);
    };

    // Filtered and Sorted Logic
    const filteredTransactions = useMemo(() => {
        const searchStr = searchTerm.toLowerCase();
        return transactions.filter(tx => {
            const accountName = accounts.find(a => a.id === tx.accountId)?.name || '';
            const txDate = formatAppDate(new Date(tx.date));
            return (
                tx.description?.toLowerCase().includes(searchStr) ||
                tx.category?.toLowerCase().includes(searchStr) ||
                accountName.toLowerCase().includes(searchStr) ||
                txDate.includes(searchStr) ||
                tx.amount.toString().includes(searchStr)
            );
        });
    }, [transactions, searchTerm, accounts]);

    const sortedTransactions = useMemo(() => {
        return [...filteredTransactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [filteredTransactions]);

    const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);
    const paginatedTransactions = useMemo(() => {
        return sortedTransactions.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        );
    }, [sortedTransactions, currentPage, itemsPerPage]);

    return (
        <div className="max-w-4xl mx-auto space-y-6 text-sm">
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-neutral-100 mb-6 text-center">
                    Log Business Transactions
                </h1>


                {!isReadOnly && (
                    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 dark:bg-neutral-700/30 p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-neutral-400 mb-1 uppercase tracking-wider">
                                    Type
                                </label>
                                <div className="flex space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => handleTypeChange('expense')}
                                        className={`flex-1 py-2 rounded-md border font-bold text-xs ${type === 'expense'
                                            ? 'bg-red-100 border-red-500 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                                            : 'bg-white border-gray-300 dark:bg-neutral-700 dark:border-neutral-600'
                                            }`}
                                    >
                                        Expense 💸
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleTypeChange('income')}
                                        className={`flex-1 py-2 rounded-md border font-bold text-xs ${type === 'income'
                                            ? 'bg-green-100 border-green-500 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                                            : 'bg-white border-gray-300 dark:bg-neutral-700 dark:border-neutral-600'
                                            }`}
                                    >
                                        Income 💰
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="date" className="block text-xs font-bold text-gray-500 dark:text-neutral-400 mb-1 uppercase tracking-wider">
                                    Transaction Date
                                </label>
                                <input
                                    id="date"
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md dark:bg-neutral-700 dark:border-neutral-600 font-medium"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="amount" className="block text-xs font-bold text-gray-500 dark:text-neutral-400 mb-1 uppercase tracking-wider">
                                    Amount
                                </label>
                                <input
                                    id="amount"
                                    type="number"
                                    step="0.01"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md dark:bg-neutral-700 dark:border-neutral-600 font-bold"
                                    placeholder="0.00"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="account" className="block text-xs font-bold text-gray-500 dark:text-neutral-400 mb-1 uppercase tracking-wider">
                                    Affected Account
                                </label>
                                <select
                                    id="account"
                                    value={accountId}
                                    onChange={(e) => setAccountId(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md dark:bg-neutral-700 dark:border-neutral-600"
                                    required
                                >
                                    <option value="">Select an account</option>
                                    {accounts.map(acc => (
                                        <option key={acc.id} value={acc.id}>{acc.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="category" className="block text-xs font-bold text-gray-500 dark:text-neutral-400 mb-1 uppercase tracking-wider">
                                    Category
                                </label>
                                <select
                                    id="category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md dark:bg-neutral-700 dark:border-neutral-600"
                                >
                                    {TRANSACTION_CATEGORIES[type].map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="description" className="block text-xs font-bold text-gray-500 dark:text-neutral-400 mb-1 uppercase tracking-wider">
                                    Details
                                </label>
                                <input
                                    id="description"
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md dark:bg-neutral-700 dark:border-neutral-600"
                                    placeholder="e.g. Maruti Swift Service"
                                />
                            </div>

                            <div>
                                <label htmlFor="vehicle" className="block text-xs font-bold text-gray-500 dark:text-neutral-400 mb-1 uppercase tracking-wider">
                                    Link to Vehicle (Inventory)
                                </label>
                                <select
                                    id="vehicle"
                                    value={vehicleId}
                                    onChange={(e) => setVehicleId(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md dark:bg-neutral-700 dark:border-neutral-600 font-bold text-brand-red"
                                >
                                    <option value="">-- General Expense --</option>
                                    {inventory.map(item => (
                                        <option key={item.id} value={item.id}>🚗 {item.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="investor" className="block text-xs font-bold text-gray-500 dark:text-neutral-400 mb-1 uppercase tracking-wider">
                                    Investor Email (For funding)
                                </label>
                                <input
                                    id="investor"
                                    type="email"
                                    list="investor-emails"
                                    value={investorEmail}
                                    onChange={(e) => setInvestorEmail(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md dark:bg-neutral-700 dark:border-neutral-600 font-bold text-blue-600"
                                    placeholder="investor@example.com"
                                />
                                <datalist id="investor-emails">
                                    {investorEmails.map(email => (
                                        <option key={email} value={email}>{getNickname(email)}</option>
                                    ))}
                                </datalist>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-brand-red hover:bg-brand-red-dark text-white font-black uppercase tracking-widest py-3 rounded-md transition-colors shadow-lg"
                        >
                            Log Transaction
                        </button>
                    </form>
                )}

                <div className="mt-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
                        <div>
                            <h2 className="text-xl font-bold uppercase tracking-tight">Recent Business Logs</h2>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Audit Trail & Transaction History</p>
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                                <input
                                    type="text"
                                    placeholder="Search Toyota, Sale, Bank..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1); 
                                    }}
                                    className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-full text-xs font-medium focus:ring-2 focus:ring-brand-red outline-none transition-all shadow-inner"
                                />
                            </div>
                            {totalPages > 1 && (
                                <div className="hidden sm:block text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 dark:bg-neutral-700 px-3 py-1.5 rounded-full border dark:border-neutral-600">
                                    Page {currentPage} of {totalPages}
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b dark:border-neutral-700 text-xs font-black text-gray-400 uppercase tracking-widest">
                                    <th className="py-2">Date (DD/MM)</th>
                                    <th className="py-2">Details</th>
                                    <th className="py-2">Category</th>
                                    <th className="py-2 text-right">Amount</th>
                                    {!isReadOnly && <th className="py-2 text-right w-10"></th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y dark:divide-neutral-700">
                                {paginatedTransactions.map(tx => (
                                    <tr key={tx.id} className="text-sm">
                                        <td className="py-3 font-semibold text-gray-500">{formatAppDate(new Date(tx.date))}</td>
                                        <td className="py-3 text-nowrap">
                                            <div className="font-bold text-gray-800 dark:text-neutral-200">
                                                {tx.description || 'General Entry'}
                                                {tx.vehicleId && (
                                                    <span className="ml-2 px-2 py-0.5 bg-neutral-100 dark:bg-neutral-700 text-[10px] font-black text-brand-red rounded-full uppercase italic">
                                                         {inventory.find(i => i.id === tx.vehicleId)?.name}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-[10px] uppercase font-bold text-gray-400 flex flex-wrap gap-2">
                                                <span>{accounts.find(a => a.id === tx.accountId)?.name}</span>
                                                {tx.investorEmail && (
                                                    <span className="text-blue-500 italic" title={tx.investorEmail}>👤 {getNickname(tx.investorEmail)}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-3">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter ${tx.type === 'income'
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30'
                                                    : 'bg-red-100 text-red-700 dark:bg-red-900/30'
                                                }`}>
                                                {tx.category}
                                            </span>
                                        </td>
                                        <td className={`py-3 text-right font-black ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                                        </td>
                                        {!isReadOnly && (
                                            <td className="py-3 text-right">
                                                <button
                                                    onClick={() => deleteTransaction(tx.id)}
                                                    className="text-gray-300 hover:text-brand-red transition-colors"
                                                >
                                                    ✕
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                                {filteredTransactions.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="py-10 text-center text-gray-500 italic">
                                            {searchTerm ? `No transactions matching "${searchTerm}"` : 'No business transactions recorded yet.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-6 pt-6 border-t dark:border-neutral-700">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 text-xs font-black uppercase tracking-widest border rounded-md disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
                            >
                                ← Previous
                            </button>
                            <div className="flex space-x-1">
                                {Array.from({ length: totalPages }, (_, i) => {
                                    const pageNum = i + 1;
                                    // Only show current page and its neighbors
                                    if (pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setCurrentPage(pageNum)}
                                                className={`w-8 h-8 flex items-center justify-center rounded-md text-[10px] font-bold transition-all ${currentPage === pageNum 
                                                    ? 'bg-brand-red text-white shadow-lg' 
                                                    : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-neutral-700'}`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    }
                                    if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                                        return <span key={pageNum} className="px-1 text-gray-400">...</span>;
                                    }
                                    return null;
                                })}
                            </div>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 text-xs font-black uppercase tracking-widest border rounded-md disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
                            >
                                Next →
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
