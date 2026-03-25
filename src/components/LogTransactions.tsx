'use client';

import { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { TRANSACTION_CATEGORIES } from '@/types/finance';
import { useCurrency } from '@/context/CurrencyContext';
import { CurrencySelector } from './CurrencySelector';

export const LogTransactions = () => {
    const { accounts, transactions, addTransaction, deleteTransaction } = useFinance();
    const { formatCurrency } = useCurrency();
    const [amount, setAmount] = useState<string>('');
    const [type, setType] = useState<'income' | 'expense'>('expense');
    const [category, setCategory] = useState<string>(TRANSACTION_CATEGORIES.expense[0]);
    const [accountId, setAccountId] = useState<string>(accounts[0]?.id || '');
    const [description, setDescription] = useState<string>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !accountId) return;

        addTransaction({
            accountId,
            amount: parseFloat(amount),
            type,
            category,
            description,
        });

        setAmount('');
        setDescription('');
    };

    const handleTypeChange = (newType: 'income' | 'expense') => {
        setType(newType);
        setCategory(TRANSACTION_CATEGORIES[newType][0]);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-neutral-100 mb-6 text-center">
                    Log Business Transactions
                </h1>

                <div className="flex justify-end mb-4">
                    <CurrencySelector size="sm" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 dark:bg-neutral-700/30 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                                Transaction Type
                            </label>
                            <div className="flex space-x-2">
                                <button
                                    type="button"
                                    onClick={() => handleTypeChange('expense')}
                                    className={`flex-1 py-2 rounded-md border ${type === 'expense'
                                        ? 'bg-red-100 border-red-500 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                                        : 'bg-white border-gray-300 dark:bg-neutral-700 dark:border-neutral-600'
                                        }`}
                                >
                                    Expense 💸
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleTypeChange('income')}
                                    className={`flex-1 py-2 rounded-md border ${type === 'income'
                                        ? 'bg-green-100 border-green-500 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                                        : 'bg-white border-gray-300 dark:bg-neutral-700 dark:border-neutral-600'
                                        }`}
                                >
                                    Income 💰
                                </button>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                                Amount
                            </label>
                            <input
                                id="amount"
                                type="number"
                                step="0.01"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md dark:bg-neutral-700 dark:border-neutral-600"
                                placeholder="0.00"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="account" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
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
                                    <option key={acc.id} value={acc.id}>{acc.name} ({acc.category})</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
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
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                            Description / Car Details
                        </label>
                        <input
                            id="description"
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md dark:bg-neutral-700 dark:border-neutral-600"
                            placeholder="e.g. 2018 Toyota Camry - Engine Repair"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-brand-red hover:bg-brand-red-dark text-white font-bold py-2 rounded-md transition-colors"
                    >
                        Log Transaction
                    </button>
                </form>

                <div className="mt-8">
                    <h2 className="text-xl font-bold mb-4">Recent Logs</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b dark:border-neutral-700 text-sm font-medium text-gray-500 uppercase">
                                    <th className="py-2">Date</th>
                                    <th className="py-2">Description</th>
                                    <th className="py-2">Category</th>
                                    <th className="py-2 text-right">Amount</th>
                                    <th className="py-2 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y dark:divide-neutral-700">
                                {transactions.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 50).map(tx => (
                                    <tr key={tx.id} className="text-sm">
                                        <td className="py-3">{new Date(tx.date).toLocaleDateString()}</td>
                                        <td className="py-3">
                                            <div className="font-medium text-gray-800 dark:text-neutral-200">{tx.description || 'No description'}</div>
                                            <div className="text-xs text-gray-400">
                                                {accounts.find(a => a.id === tx.accountId)?.name || 'Unknown Account'}
                                            </div>
                                        </td>
                                        <td className="py-3">
                                            <span className={`px-2 py-0.5 rounded text-xs ${tx.type === 'income'
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30'
                                                    : 'bg-red-100 text-red-700 dark:bg-red-900/30'
                                                }`}>
                                                {tx.category}
                                            </span>
                                        </td>
                                        <td className={`py-3 text-right font-medium ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                                        </td>
                                        <td className="py-3 text-right">
                                            <button
                                                onClick={() => deleteTransaction(tx.id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                ✕
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {transactions.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="py-10 text-center text-gray-500">
                                            No transactions logged yet. Start by logging an expense or sale!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};



