'use client';

import { useState, useEffect } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { useCurrency } from '@/context/CurrencyContext';
import { CurrencySelector } from './CurrencySelector';

export const InvestorOverview = () => {
    const { getAccountsWithBalances, transactions } = useFinance();
    const { formatCurrency } = useCurrency();
    const accounts = getAccountsWithBalances();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const inventoryValue = accounts
        .filter(a => a.category === 'Inventory (Pre-owned Cars)')
        .reduce((sum, acc) => sum + acc.currentBalance, 0);

    const totalAssets = accounts
        .filter(a => a.type === 'asset')
        .reduce((sum, acc) => sum + acc.currentBalance, 0);

    const totalLiabilities = accounts
        .filter(a => a.type === 'liability')
        .reduce((sum, acc) => sum + acc.currentBalance, 0);

    const totalSales = transactions
        .filter(t => t.type === 'income' && t.category === 'Car Sale')
        .reduce((sum, t) => sum + t.amount, 0);

    const otherIncome = transactions
        .filter(t => t.type === 'income' && t.category !== 'Car Sale')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const netProfit = (totalSales + otherIncome) - totalExpenses;

    const carPurchaseExpenses = transactions
        .filter(t => t.type === 'expense' && t.category === 'Car Purchase (Inventory)')
        .reduce((sum, t) => sum + t.amount, 0);

    const repairExpenses = transactions
        .filter(t => t.type === 'expense' && t.category === 'Repair & Maintenance')
        .reduce((sum, t) => sum + t.amount, 0);

    return (
        <div className="space-y-8 bg-white dark:bg-neutral-800 p-8 rounded-xl shadow-xl border dark:border-neutral-700 print:shadow-none print:border-none">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4 border-b pb-8">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-neutral-100">Investor Progress Report</h1>
                    <p className="text-lg text-gray-500 mt-2">Pre-owned Car Dealership Overview — {mounted ? new Date().toLocaleDateString() : ''}</p>
                </div>
                <div className="flex flex-col items-center md:items-end gap-2">
                    <CurrencySelector size="lg" />
                    <button
                        onClick={() => window.print()}
                        className="bg-neutral-800 text-white px-4 py-2 rounded-md hover:bg-neutral-700 transition-colors text-sm print:hidden"
                    >
                        Print PDF Report 📄
                    </button>
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-brand-red/5 dark:bg-neutral-50 dark:bg-neutral-800 p-6 rounded-xl border border-brand-red/10 dark:border-brand-red/30">
                    <p className="text-sm font-bold text-brand-red uppercase tracking-wider mb-1">Current Inventory Value</p>
                    <p className="text-3xl font-black text-gray-900 dark:text-white">{formatCurrency(inventoryValue)}</p>
                    <p className="text-xs text-gray-500 dark:text-neutral-500 mt-2 font-medium">Active assets on lot</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/10 p-6 rounded-xl border border-green-100 dark:border-green-900/30">
                    <p className="text-sm font-semibold text-green-600 dark:text-green-400 mb-1">Total Sales Record</p>
                    <p className="text-3xl font-bold text-green-900 dark:text-green-100">{formatCurrency(totalSales)}</p>
                    <p className="text-xs text-green-500 mt-2">Cumulative revenue from sales</p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-xl border border-red-100 dark:border-red-900/30">
                    <p className="text-sm font-semibold text-red-600 dark:text-red-400 mb-1">Total Operating Expenses</p>
                    <p className="text-3xl font-bold text-red-900 dark:text-red-100">{formatCurrency(totalExpenses)}</p>
                    <p className="text-xs text-red-500 mt-2">Including repairs & inventory</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/10 p-6 rounded-xl border border-purple-100 dark:border-purple-900/30">
                    <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 mb-1">Estimated Net Profit</p>
                    <p className={`text-3xl font-bold ${netProfit >= 0 ? 'text-purple-900 dark:text-purple-100' : 'text-red-700'}`}>
                        {formatCurrency(netProfit)}
                    </p>
                    <p className="text-xs text-purple-500 mt-2">Before taxes & final overhead</p>
                </div>
            </div>

            {/* Financial Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Income Statement Summary */}
                <div className="space-y-6 bg-gray-50 dark:bg-neutral-700/20 p-6 rounded-xl border border-gray-100 dark:border-neutral-700">
                    <h2 className="text-xl font-bold border-b pb-2">Operational Performance</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center bg-white dark:bg-neutral-800 p-3 rounded-lg border dark:border-neutral-600">
                            <span className="font-medium">Car Sales Revenue</span>
                            <span className="text-green-600 font-bold">{formatCurrency(totalSales)}</span>
                        </div>
                        <div className="flex justify-between items-center bg-white dark:bg-neutral-800 p-3 rounded-lg border dark:border-neutral-600">
                            <span className="font-medium">Service & Other Revenue</span>
                            <span className="text-green-600 font-bold">{formatCurrency(otherIncome)}</span>
                        </div>
                        <div className="pt-2 border-t">
                            <div className="flex justify-between items-center p-3">
                                <span className="font-semibold">Subtotal Revenue</span>
                                <span className="text-green-700 dark:text-green-400 font-extrabold">{formatCurrency(totalSales + otherIncome)}</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center bg-white dark:bg-neutral-800 p-3 rounded-lg border dark:border-neutral-600">
                            <span className="font-medium">Inventory Purchases</span>
                            <span className="text-red-600 font-bold">-{formatCurrency(carPurchaseExpenses)}</span>
                        </div>
                        <div className="flex justify-between items-center bg-white dark:bg-neutral-800 p-3 rounded-lg border dark:border-neutral-600">
                            <span className="font-medium">Repair & Detailing Costs</span>
                            <span className="text-red-600 font-bold">-{formatCurrency(repairExpenses)}</span>
                        </div>
                        <div className="flex justify-between items-center bg-white dark:bg-neutral-800 p-3 rounded-lg border dark:border-neutral-600">
                            <span className="font-medium text-gray-500">Other Expenses</span>
                            <span className="text-red-500 font-medium">-{formatCurrency(totalExpenses - carPurchaseExpenses - repairExpenses)}</span>
                        </div>
                    </div>
                </div>

                {/* Account Balance Summary */}
                <div className="space-y-6 bg-gray-50 dark:bg-neutral-700/20 p-6 rounded-xl border border-gray-100 dark:border-neutral-700">
                    <h2 className="text-xl font-bold border-b pb-2">Business Equity</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center bg-white dark:bg-neutral-800 p-3 rounded-lg border dark:border-neutral-600">
                            <span className="font-medium">Total Current Assets</span>
                            <span className="text-brand-red font-bold">{formatCurrency(totalAssets)}</span>
                        </div>
                        <div className="flex justify-between items-center bg-white dark:bg-neutral-800 p-3 rounded-lg border dark:border-neutral-600">
                            <span className="font-medium">Total Liabilities</span>
                            <span className="text-red-600 font-bold">({formatCurrency(totalLiabilities)})</span>
                        </div>
                        <div className="pt-4 border-t-2 border-dashed border-gray-200 dark:border-neutral-700">
                            <div className="flex justify-between items-center p-4 bg-brand-red rounded-xl shadow-lg shadow-red-600/20">
                                <span className="text-lg font-bold text-white uppercase tracking-wider">Business Net Worth</span>
                                <span className="text-2xl font-black text-white">{formatCurrency(totalAssets - totalLiabilities)}</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center p-3 text-sm text-gray-500 italic">
                            <span>* Calculated using the most recent recorded balances for all business units.</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Disclaimer */}
            <div className="mt-8 pt-8 border-t text-center text-xs text-gray-400">
                <p>Private & Confidential. Prepared for investor review by Shift N Go.</p>
                <p className="mt-1">© {new Date().getFullYear()} Shift N Go. All values based on user-entered data logs.</p>
            </div>
        </div>
    );
};



