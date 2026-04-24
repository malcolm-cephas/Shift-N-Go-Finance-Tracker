'use client';

import { useState, useEffect } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useAuth } from '@/context/AuthContext';
import { calculateCarStats, formatAppDate } from '@/utils/financeUtils';

export const InvestorOverview = () => {
    const { getAccountsWithBalances, transactions, inventory } = useFinance();
    const { formatCurrency } = useCurrency();
    const { role, user } = useAuth();
    const accounts = getAccountsWithBalances();
    const [mounted, setMounted] = useState(false);
    const investorEmail = user?.email?.toLowerCase();

    useEffect(() => {
        setMounted(true);
    }, []);

    const isSpecificInvestor = role === 'INVESTOR' && investorEmail;

    // Filter relevant cars and transactions for this specific investor
    const myCars = isSpecificInvestor 
        ? inventory.filter(c => c.investorEmails?.some(e => e.toLowerCase() === investorEmail))
        : inventory;

    const myCarIds = new Set(myCars.map(c => c.id));
    
    const myTransactions = isSpecificInvestor
        ? transactions.filter(t => 
            (t.vehicleId && myCarIds.has(t.vehicleId)) || 
            (t.investorEmails?.some(e => e.toLowerCase() === investorEmail))
        )
        : transactions;

    // Stats Calculation
    const myCapitalContribution = isSpecificInvestor
        ? transactions
            .filter(t => t.investorEmails?.some(e => e.toLowerCase() === investorEmail) && t.type === 'income' && (t.category === 'Owner Investment' || t.category === 'Investor Funding'))
            .reduce((sum, t) => sum + t.amount, 0)
        : 0;

    const inventoryValue = inventory
        .filter(i => i.status !== 'sold')
        .reduce((sum, i) => sum + i.purchasePrice, 0);

    const totalAssets = accounts
        .filter(a => a.type === 'asset')
        .reduce((sum, acc) => sum + acc.currentBalance, 0);

    const totalLiabilities = accounts
        .filter(a => a.type === 'liability')
        .reduce((sum, acc) => sum + acc.currentBalance, 0);

    // Operational Profit (Aggregate or Personalized)
    const personalTotalSales = myTransactions
        .filter(t => t.type === 'income' && t.category === 'Car Sale')
        .reduce((sum, t) => sum + t.amount, 0);

    const personalTotalExpenses = myTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const personalOtherIncome = myTransactions
        .filter(t => t.type === 'income' && t.category !== 'Car Sale' && t.category !== 'Owner Investment')
        .reduce((sum, t) => sum + t.amount, 0);

    const personalInventoryValue = myCars
        .filter(i => i.status !== 'sold')
        .reduce((sum, i) => sum + i.purchasePrice, 0);

    // Personal Position = (Personal Cash Flow) + (Unsold Asset Value)
    const personalNetProfit = (personalTotalSales + personalOtherIncome - personalTotalExpenses) + personalInventoryValue;
    const investorShare = personalNetProfit / 2;

    const totalSales = transactions
        .filter(t => t.type === 'income' && t.category === 'Car Sale')
        .reduce((sum, t) => sum + t.amount, 0);

    const otherIncome = transactions
        .filter(t => t.type === 'income' && t.category !== 'Car Sale' && t.category !== 'Owner Investment')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const inventoryPurchases = transactions
        .filter(t => t.type === 'expense' && t.category === 'Car Purchase (Inventory)')
        .reduce((sum, t) => sum + t.amount, 0);

    const operationalExpenses = totalExpenses - inventoryPurchases;

    // Business Value Net = (Cash Flow) + (Unsold Asset Value)
    // Here we treat car purchases as an asset swap (Cash -> Inventory), not a P&L loss.
    const netProfit = (totalSales + otherIncome - operationalExpenses) + (inventoryValue - inventoryPurchases);

    const realizedProfit = inventory
        .filter(i => i.status === 'sold')
        .reduce((sum, car) => sum + calculateCarStats(car, transactions).netProfit, 0);

    // Marketing/Aggregate Metadata
    const totalUnitsSold = inventory.filter(i => i.status === 'sold').length;
    const allSoldCarsProfit = inventory
        .filter(i => i.status === 'sold')
        .reduce((sum, car) => sum + calculateCarStats(car, transactions).netProfit, 0);
    
    const avgProfitPerUnit = totalUnitsSold > 0 ? allSoldCarsProfit / totalUnitsSold : 0;

    const repairExpenses = transactions
        .filter(t => t.type === 'expense' && t.category === 'Repair & Maintenance')
        .reduce((sum, t) => sum + t.amount, 0);

    const fuelExpenses = transactions
        .filter(t => t.type === 'expense' && t.category === 'Fuel')
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
                    <p className="text-sm font-black text-gray-900">{mounted ? formatAppDate(new Date()) : ''}</p>
                </div>
            </div>

            {/* Web-Only Header */}
            <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4 border-b pb-8 print:hidden">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-neutral-100 italic">Investor Progress Report</h1>
                    <p className="text-lg text-gray-500 mt-2 font-medium">Shift N Go — {isSpecificInvestor ? 'Personalized Portfolio' : 'Full Dealership Aggregate'}</p>
                </div>
                <div className="flex flex-col items-center md:items-end gap-2">
                    <button
                        onClick={handlePrint}
                        className="bg-neutral-800 text-white px-4 py-2 rounded-md hover:bg-neutral-700 transition-colors text-sm print:hidden"
                    >
                        Print PDF Report 📄
                    </button>
                </div>
            </div>

            {/* Personalized Stats for Investors */}
            {isSpecificInvestor && (
                <div className="bg-neutral-900 dark:bg-black p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group border-2 border-brand-red">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-700 text-6xl">🏎️</div>
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div>
                            <p className="text-red-400 text-[10px] font-black uppercase tracking-[0.4em] mb-2 italic">Active Portfolio Insight</p>
                            <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">{user.name || user.email?.split('@')[0]}'s Investment</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12 text-center md:text-left">
                            <div className="min-w-max">
                                <p className="text-red-400/60 text-[10px] font-black uppercase tracking-widest mb-1">Capital Provided</p>
                                <p className="text-3xl font-black text-white tabular-nums">{formatCurrency(myCapitalContribution)}</p>
                            </div>
                            <div className="min-w-max">
                                <p className="text-red-400/60 text-[10px] font-black uppercase tracking-widest mb-1">Your 50% Share</p>
                                <p className="text-3xl font-black text-white tabular-nums">{formatCurrency(investorShare)}</p>
                            </div>
                            <div className="min-w-max">
                                <p className="text-red-400/60 text-[10px] font-black uppercase tracking-widest mb-1">Vehicles Funded</p>
                                <p className="text-3xl font-black text-brand-red tabular-nums">{myCars.length}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 print:grid-cols-5 print:gap-2 font-heading">
                <div className="bg-brand-red/5 dark:bg-neutral-800 p-6 rounded-xl border border-brand-red/10 dark:border-neutral-700 min-w-0 print:bg-white print:border-neutral-200 print:p-3">
                    <p className="text-[10px] font-black text-brand-red uppercase tracking-widest mb-1">Total Inventory</p>
                    <p className="text-xl font-black text-gray-900 dark:text-white print:text-[14px] break-words">{formatCompact(inventoryValue)}</p>
                </div>
                <div className="bg-green-50 dark:bg-neutral-800 p-6 rounded-xl border border-green-100 dark:border-neutral-700 min-w-0 print:bg-white print:border-neutral-200 print:p-3">
                    <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-1">Company Sales</p>
                    <p className="text-xl font-black text-green-900 dark:text-neutral-100 print:text-[14px] break-words">{formatCompact(totalSales)}</p>
                </div>
                <div className="bg-red-50 dark:bg-neutral-800 p-6 rounded-xl border border-red-100 dark:border-neutral-700 min-w-0 print:bg-white print:border-neutral-200 print:p-3">
                    <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1">Operational Expenses</p>
                    <p className="text-xl font-black text-red-900 dark:text-neutral-100 print:text-[14px] break-words">{formatCompact(operationalExpenses)}</p>
                </div>
                <div className="bg-purple-50 dark:bg-neutral-800 p-6 rounded-xl border border-purple-100 dark:border-neutral-700 min-w-0 print:bg-white print:border-neutral-200 print:p-3">
                    <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest mb-1">Net Position (Profit + Stock)</p>
                    <p className={`text-xl font-black print:text-[14px] break-words ${netProfit >= 0 ? 'text-purple-900 dark:text-purple-100' : 'text-red-700'}`}>
                        {formatCompact(netProfit)}
                    </p>
                </div>
                <div className="bg-blue-50 dark:bg-neutral-800 p-6 rounded-xl border border-blue-100 dark:border-neutral-700 min-w-0 print:bg-white print:border-neutral-200 print:p-3">
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Realized Profit</p>
                    <p className={`text-xl font-black print:text-[14px] break-words ${realizedProfit >= 0 ? 'text-blue-900 dark:text-blue-100' : 'text-red-700'}`}>
                        {formatCompact(realizedProfit)}
                    </p>
                </div>
            </div>

            {/* Marketing & Market Performance HUD */}
            <div className="bg-white dark:bg-neutral-800 rounded-[2.5rem] border-4 border-neutral-900 dark:border-white p-8 shadow-2xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                    <div>
                        <span className="text-brand-red text-[10px] font-black uppercase tracking-[0.5em] italic">Market Leadership HUD</span>
                        <h2 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Dealership Track Record</h2>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Fleet Turnover & Profitability Metrics</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-6 bg-gray-50 dark:bg-neutral-900 rounded-3xl border-2 border-neutral-100 dark:border-neutral-700 hover:scale-[1.02] transition-transform cursor-default group">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-3xl grayscale group-hover:grayscale-0 transition-all duration-500">🏆</span>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest pt-2">Vehicles Delivered</span>
                        </div>
                        <p className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter">{totalUnitsSold}</p>
                        <p className="text-xs font-bold text-gray-500 mt-2 uppercase">Total Lifecycle Completions</p>
                    </div>

                    <div className="p-6 bg-gray-50 dark:bg-neutral-900 rounded-3xl border-2 border-neutral-100 dark:border-neutral-700 hover:scale-[1.02] transition-transform cursor-default group">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-3xl grayscale group-hover:grayscale-0 transition-all duration-500">📈</span>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest pt-2">Avg Margin</span>
                        </div>
                        <p className="text-5xl font-black text-green-600 tracking-tighter break-words">{formatCompact(avgProfitPerUnit)}</p>
                        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 mt-2 uppercase">Per Vehicle Efficiency</p>
                    </div>

                    <div className="p-6 bg-neutral-900 dark:bg-white rounded-3xl shadow-xl hover:scale-[1.02] transition-transform cursor-default group">
                        <div className="flex justify-between items-start mb-4 text-white dark:text-neutral-900">
                            <span className="text-3xl">🔥</span>
                            <span className="text-[10px] font-black uppercase tracking-widest pt-2 opacity-50">Dealership Net</span>
                        </div>
                        <p className={`text-5xl font-black tracking-tighter break-words ${netProfit >= 0 ? 'text-white dark:text-neutral-900' : 'text-red-500'}`}>
                            {formatCompact(netProfit)}
                        </p>
                        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 mt-2 uppercase">Total Retained Earnings</p>
                    </div>
                </div>
            </div>

            {/* Financial Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Income Statement Summary */}
                <div className="space-y-6 bg-gray-50 dark:bg-neutral-700/20 p-6 rounded-xl border border-gray-100 dark:border-neutral-700 print:bg-white print:border-neutral-200">
                    <h2 className="text-xl font-bold border-b pb-2">Operational Analytics</h2>
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
                            <span className="text-red-600 font-bold">-{formatCurrency(inventoryPurchases)}</span>
                        </div>
                        <div className="flex justify-between items-center bg-white dark:bg-neutral-800 p-3 rounded-lg border dark:border-neutral-600 print:border-none print:px-0">
                            <span className="font-medium">Repair & Detailing Costs</span>
                            <span className="text-red-600 font-bold">-{formatCurrency(repairExpenses)}</span>
                        </div>
                        <div className="flex justify-between items-center bg-white dark:bg-neutral-800 p-3 rounded-lg border dark:border-neutral-600 print:border-none print:px-0">
                            <span className="font-medium">Fuel & Logistics</span>
                            <span className="text-red-600 font-bold">-{formatCurrency(fuelExpenses)}</span>
                        </div>
                        <div className="flex justify-between items-center bg-white dark:bg-neutral-800 p-3 rounded-lg border dark:border-neutral-600 print:border-none print:px-0">
                            <span className="font-medium text-gray-500">Other Expenses</span>
                            <span className="text-red-500 font-medium">-{formatCurrency(totalExpenses - inventoryPurchases - repairExpenses - fuelExpenses)}</span>
                        </div>
                    </div>
                </div>

                {/* Account Balance Summary */}
                <div className="space-y-6 bg-gray-50 dark:bg-neutral-700/20 p-6 rounded-xl border border-gray-100 dark:border-neutral-700 print:bg-white print:border-neutral-200">
                    <h2 className="text-xl font-bold border-b pb-2">Business Equity</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center bg-white dark:bg-neutral-800 p-3 rounded-lg border dark:border-neutral-600 print:border-none print:px-0">
                            <span className="font-medium">Total Current Cash (Accounts)</span>
                            <span className="text-brand-red font-bold">{formatCurrency(totalAssets)}</span>
                        </div>
                        <div className="flex justify-between items-center bg-white dark:bg-neutral-800 p-3 rounded-lg border dark:border-neutral-600 print:border-none print:px-0">
                            <span className="font-medium">Total Inventory Value</span>
                            <span className="text-brand-red font-bold">{formatCurrency(inventoryValue)}</span>
                        </div>
                        <div className="flex justify-between items-center bg-white dark:bg-neutral-800 p-3 rounded-lg border dark:border-neutral-600 print:border-none print:px-0">
                            <span className="font-medium">Total Liabilities</span>
                            <span className="text-red-600 font-bold">({formatCurrency(totalLiabilities)})</span>
                        </div>
                        <div className="pt-4 border-t-2 border-dashed border-gray-200 dark:border-neutral-700">
                            <div className="flex justify-between items-center p-4 bg-brand-red rounded-xl shadow-lg shadow-red-600/20 print:bg-white print:border-2 print:border-brand-red print:shadow-none">
                                <span className="text-lg font-bold text-white uppercase tracking-wider print:text-brand-red">Business Net Worth</span>
                                <span className="text-2xl font-black text-white print:text-brand-red">{formatCurrency(totalAssets + inventoryValue - totalLiabilities)}</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center p-3 text-sm text-gray-500 italic">
                            <span>* Calculated using the most recent recorded balances for all business vehicles.</span>
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



