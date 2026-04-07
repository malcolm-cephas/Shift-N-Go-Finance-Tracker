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
        .filter(t => t.type === 'income' && t.category !== 'Car Sale' && t.category !== 'Owner Investment')
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

    // Helper to format without decimals for high-value dashboard cards
    const formatCompact = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const handlePrint = () => {
        const originalTitle = document.title;
        document.title = `Shift_N_Go_Financial_Report_${new Date().toISOString().split('T')[0]}`;
        window.print();
        document.title = originalTitle;
    };

    if (!mounted) return null;

    return (
        <div className="max-w-6xl mx-auto space-y-8 p-0 md:p-8 bg-white dark:bg-neutral-800 rounded-xl shadow-xl border dark:border-neutral-700 print:shadow-none print:border-none print:p-0">
            {/* Print-Only Professional Header */}
            <div className="hidden print:flex justify-between items-start border-b-4 border-brand-red pb-6 mb-8 uppercase">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Shift N Go Financials</h1>
                    <p className="text-sm font-bold text-gray-500 tracking-widest mt-1">Executive Investment Report</p>
                </div>
                <div className="text-right">
                    <p className="text-xs font-bold text-gray-400">Generated On</p>
                    <p className="text-sm font-black text-gray-900">{mounted ? new Date().toLocaleDateString('en-IN', { dateStyle: 'long' }) : ''}</p>
                </div>
            </div>

            {/* Web-Only Header */}
            <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4 border-b pb-8 print:hidden">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-neutral-100 italic">Investor Progress Report</h1>
                    <p className="text-lg text-gray-500 mt-2 font-medium">Shift N Go — Private High-Volume View</p>
                </div>
                <div className="flex flex-col items-center md:items-end gap-2">
                    <CurrencySelector size="lg" />
                    <button
                        onClick={handlePrint}
                        className="bg-neutral-800 text-white px-4 py-2 rounded-md hover:bg-neutral-700 transition-colors text-sm print:hidden"
                    >
                        Print PDF Report 📄
                    </button>
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 print:grid-cols-4 print:gap-2 font-heading">
                <div className="bg-brand-red/5 dark:bg-neutral-800 p-6 rounded-xl border border-brand-red/10 dark:border-neutral-700 print:bg-white print:border-neutral-200 print:p-3">
                    <p className="text-[10px] font-black text-brand-red uppercase tracking-widest mb-1">Inventory Value</p>
                    <p className="text-2xl font-black text-gray-900 dark:text-white print:text-[14px] truncate">{formatCompact(inventoryValue)}</p>
                </div>
                <div className="bg-green-50 dark:bg-neutral-800 p-6 rounded-xl border border-green-100 dark:border-neutral-700 print:bg-white print:border-neutral-200 print:p-3">
                    <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-1">Total Sales</p>
                    <p className="text-2xl font-black text-green-900 dark:text-neutral-100 print:text-[14px] truncate">{formatCompact(totalSales)}</p>
                </div>
                <div className="bg-red-50 dark:bg-neutral-800 p-6 rounded-xl border border-red-100 dark:border-neutral-700 print:bg-white print:border-neutral-200 print:p-3">
                    <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1">Operating Expenses</p>
                    <p className="text-2xl font-black text-red-900 dark:text-neutral-100 print:text-[14px] truncate">{formatCompact(totalExpenses)}</p>
                </div>
                <div className="bg-purple-50 dark:bg-neutral-800 p-6 rounded-xl border border-purple-100 dark:border-neutral-700 print:bg-white print:border-neutral-200 print:p-3">
                    <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest mb-1">Net Performance</p>
                    <p className={`text-2xl font-black print:text-[14px] truncate ${netProfit >= 0 ? 'text-purple-900 dark:text-purple-100' : 'text-red-700'}`}>
                        {formatCompact(netProfit)}
                    </p>
                </div>
            </div>

            {/* Financial Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Income Statement Summary */}
                <div className="space-y-6 bg-gray-50 dark:bg-neutral-700/20 p-6 rounded-xl border border-gray-100 dark:border-neutral-700 print:bg-white print:border-neutral-200">
                    <h2 className="text-xl font-bold border-b pb-2">Operational Performance</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center bg-white dark:bg-neutral-800 p-3 rounded-lg border dark:border-neutral-600 print:border-none print:px-0">
                            <span className="font-medium">Car Sales Revenue</span>
                            <span className="text-green-600 font-bold">{formatCurrency(totalSales)}</span>
                        </div>
                        <div className="flex justify-between items-center bg-white dark:bg-neutral-800 p-3 rounded-lg border dark:border-neutral-600 print:border-none print:px-0">
                            <span className="font-medium">Service & Other Revenue</span>
                            <span className="text-green-600 font-bold">{formatCurrency(otherIncome)}</span>
                        </div>
                        <div className="pt-2 border-t">
                            <div className="flex justify-between items-center p-3 print:px-0">
                                <span className="font-semibold">Subtotal Revenue</span>
                                <span className="text-green-700 dark:text-green-400 font-extrabold">{formatCurrency(totalSales + otherIncome)}</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center bg-white dark:bg-neutral-800 p-3 rounded-lg border dark:border-neutral-600 print:border-none print:px-0">
                            <span className="font-medium">Inventory Purchases</span>
                            <span className="text-red-600 font-bold">-{formatCurrency(carPurchaseExpenses)}</span>
                        </div>
                        <div className="flex justify-between items-center bg-white dark:bg-neutral-800 p-3 rounded-lg border dark:border-neutral-600 print:border-none print:px-0">
                            <span className="font-medium">Repair & Detailing Costs</span>
                            <span className="text-red-600 font-bold">-{formatCurrency(repairExpenses)}</span>
                        </div>
                        <div className="flex justify-between items-center bg-white dark:bg-neutral-800 p-3 rounded-lg border dark:border-neutral-600 print:border-none print:px-0">
                            <span className="font-medium text-gray-500">Other Expenses</span>
                            <span className="text-red-500 font-medium">-{formatCurrency(totalExpenses - carPurchaseExpenses - repairExpenses)}</span>
                        </div>
                    </div>
                </div>

                {/* Account Balance Summary */}
                <div className="space-y-6 bg-gray-50 dark:bg-neutral-700/20 p-6 rounded-xl border border-gray-100 dark:border-neutral-700 print:bg-white print:border-neutral-200">
                    <h2 className="text-xl font-bold border-b pb-2">Business Equity</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center bg-white dark:bg-neutral-800 p-3 rounded-lg border dark:border-neutral-600 print:border-none print:px-0">
                            <span className="font-medium">Total Current Assets</span>
                            <span className="text-brand-red font-bold">{formatCurrency(totalAssets)}</span>
                        </div>
                        <div className="flex justify-between items-center bg-white dark:bg-neutral-800 p-3 rounded-lg border dark:border-neutral-600 print:border-none print:px-0">
                            <span className="font-medium">Total Liabilities</span>
                            <span className="text-red-600 font-bold">({formatCurrency(totalLiabilities)})</span>
                        </div>
                        <div className="pt-4 border-t-2 border-dashed border-gray-200 dark:border-neutral-700">
                            <div className="flex justify-between items-center p-4 bg-brand-red rounded-xl shadow-lg shadow-red-600/20 print:bg-white print:border-2 print:border-brand-red print:shadow-none">
                                <span className="text-lg font-bold text-white uppercase tracking-wider print:text-brand-red">Business Net Worth</span>
                                <span className="text-2xl font-black text-white print:text-brand-red">{formatCurrency(totalAssets - totalLiabilities)}</span>
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



