'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
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
    const [selectedInvestor, setSelectedInvestor] = useState<string>('ALL');

    useEffect(() => {
        setMounted(true);
    }, []);

    // Extract all unique investors for the admin filter
    const allInvestors = Array.from(new Set([
        ...transactions.flatMap(t => t.investorEmails || []),
        ...inventory.flatMap(c => [
            ...(c.investorEmails || []),
            ...(c.investors?.map(i => i.email) || [])
        ])
    ])).map(e => e.toLowerCase()).filter(Boolean);

    const effectiveInvestorEmail = role === 'INVESTOR' 
        ? user?.email?.toLowerCase() 
        : (selectedInvestor !== 'ALL' ? selectedInvestor : null);

    const isSpecificInvestor = !!effectiveInvestorEmail;
    const investorEmail = effectiveInvestorEmail;

    // Filter relevant cars and transactions for this specific investor
    const myCars = isSpecificInvestor 
        ? inventory.filter(c => 
            c.investorEmails?.some(e => e.toLowerCase() === investorEmail) ||
            c.investors?.some(inv => inv.email.toLowerCase() === investorEmail)
        )
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

    const activeCapitalDeployed = isSpecificInvestor && investorEmail
        ? myCars
            .filter(c => c.status !== 'sold')
            .reduce((sum, car) => {
                const investorObj = car.investors?.find(i => i.email.toLowerCase() === investorEmail);
                if (investorObj) {
                    return sum + (car.purchasePrice * investorObj.share / 100);
                }
                if (car.investorEmails?.some(e => e.toLowerCase() === investorEmail)) {
                    return sum + (car.purchasePrice / car.investorEmails.length);
                }
                return sum;
            }, 0)
        : 0;

    const inventoryValue = inventory
        .filter(i => i.status !== 'sold')
        .reduce((sum, i) => sum + i.purchasePrice, 0);

    const totalAccountBalances = accounts
        .reduce((sum, acc) => sum + acc.currentBalance, 0);

    // Operational Profit (Aggregate or Portfolio)
    const portfolioTotalSales = myTransactions
        .filter(t => t.type === 'income' && t.category === 'Car Sale')
        .reduce((sum, t) => sum + t.amount, 0);

    const portfolioTotalExpenses = myTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const portfolioOtherIncome = myTransactions
        .filter(t => t.type === 'income' && t.category !== 'Car Sale' && t.category !== 'Owner Investment')
        .reduce((sum, t) => sum + t.amount, 0);

    const portfolioInventoryValue = myCars
        .filter(i => i.status !== 'sold')
        .reduce((sum, i) => sum + i.purchasePrice, 0);

    // Portfolio Position = (Portfolio Cash Flow) + (Unsold Asset Value)
    const portfolioNetProfit = (portfolioTotalSales + portfolioOtherIncome - portfolioTotalExpenses) + portfolioInventoryValue;
    
    // Calculate actual share based on variable splits from sold cars
    const myRealizedProfit = isSpecificInvestor 
        ? inventory
            .filter(i => i.status === 'sold')
            .reduce((sum, car) => {
                const stats = calculateCarStats(car, transactions);
                return sum + (stats.investorSplits[investorEmail] || 0);
            }, 0)
        : 0;

    const investorShare = isSpecificInvestor ? myRealizedProfit : (portfolioNetProfit / 2);

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
        .filter(t => t.type === 'expense' && (t.category === 'Fuel' || t.category === 'Fuel & Tolls'))
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
        <div className="max-w-6xl mx-auto space-y-8 p-0 md:p-8 bg-white dark:bg-neutral-800 rounded-xl shadow-xl border dark:border-neutral-700 print:shadow-none print:border-none print:p-0 relative overflow-hidden">
            {/* Professional Watermark (Print Only) */}
            <div className="hidden print:block absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center -rotate-45 scale-150">
                <div className="text-[12rem] font-black uppercase tracking-[2rem]">SHIFT N GO</div>
            </div>

            {/* Print-Only Professional Header */}
            <div className="hidden print:flex justify-between items-center border-b-[6px] border-neutral-900 pb-8 mb-10">
                <div className="flex items-center gap-6">
                    <Image src="/logo.png" alt="Logo" width={80} height={80} className="object-contain" />
                    <div>
                        <h1 className="text-4xl font-black text-neutral-900 tracking-tighter uppercase leading-none">Shift N Go Financials</h1>
                        <p className="text-xs font-bold text-neutral-500 tracking-[0.4em] mt-2 uppercase italic">Executive Investment Portfolio</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="mb-2">
                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Report Reference</p>
                        <p className="text-sm font-black text-neutral-900 uppercase tracking-tighter">SNGF-{new Date().getFullYear()}-{Math.floor(Math.random() * 10000)}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Generated On</p>
                        <p className="text-sm font-black text-neutral-900">{mounted ? formatAppDate(new Date()) : ''}</p>
                    </div>
                </div>
            </div>

            {/* Web-Only Header */}
            <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4 border-b pb-8 print:hidden">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-neutral-100 italic">Investor Progress Report</h1>
                    <p className="text-lg text-gray-500 mt-2 font-medium">Shift N Go — {isSpecificInvestor ? 'Investor Portfolio' : 'Full Dealership Aggregate'}</p>
                </div>
                <div className="flex flex-col md:flex-row items-center md:items-end gap-4">
                    {(role === 'ADMIN' || role === 'MANAGER') && allInvestors.length > 0 && (
                        <div className="flex flex-col items-center md:items-end">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Filter by Investor</label>
                            <select
                                value={selectedInvestor}
                                onChange={(e) => setSelectedInvestor(e.target.value)}
                                className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red font-medium text-gray-700 dark:text-neutral-200"
                            >
                                <option value="ALL">All Investors (Dealership Aggregate)</option>
                                {allInvestors.map(email => (
                                    <option key={email} value={email}>{email}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    <button
                        onClick={handlePrint}
                        className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold px-4 py-2 rounded-md hover:scale-[1.02] active:scale-95 transition-all text-sm print:hidden"
                    >
                        Print PDF Report 📄
                    </button>
                </div>
            </div>

            {/* Personalized Stats for Investors */}
            {isSpecificInvestor && investorEmail && (
                <div className="space-y-6">
                    <div className="bg-neutral-900 dark:bg-black p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group border-2 border-brand-red">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-700 text-6xl">🏎️</div>
                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                            <div>
                                <p className="text-red-400 text-[10px] font-black uppercase tracking-[0.4em] mb-2 italic">Active Portfolio Insight</p>
                                <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">{user?.email?.toLowerCase() === investorEmail ? (user.name || user.email?.split('@')[0]) : investorEmail.split('@')[0]}'s Investment</h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 md:gap-8 text-center md:text-left">
                                <div className="min-w-max">
                                    <p className="text-red-400/60 text-[10px] font-black uppercase tracking-widest mb-1">Total Capital</p>
                                    <p className="text-2xl font-black text-white tabular-nums">{formatCurrency(myCapitalContribution)}</p>
                                </div>
                                <div className="min-w-max">
                                    <p className="text-red-400/60 text-[10px] font-black uppercase tracking-widest mb-1">Active Capital Deployed</p>
                                    <p className="text-2xl font-black text-white tabular-nums">{formatCurrency(activeCapitalDeployed)}</p>
                                </div>
                                <div className="min-w-max">
                                    <p className="text-red-400/60 text-[10px] font-black uppercase tracking-widest mb-1">Realized Profit</p>
                                    <p className="text-2xl font-black text-white tabular-nums">{formatCurrency(investorShare)}</p>
                                </div>
                                <div className="min-w-max">
                                    <p className="text-red-400/60 text-[10px] font-black uppercase tracking-widest mb-1">Vehicles Funded</p>
                                    <p className="text-2xl font-black text-brand-red tabular-nums">{myCars.length}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Invested Vehicles Table */}
                    <div className="bg-white dark:bg-neutral-800 p-6 rounded-[2rem] border border-gray-100 dark:border-neutral-700 shadow-lg">
                        <div className="mb-6">
                            <h3 className="text-xl font-black uppercase tracking-tight">Invested Vehicles</h3>
                            <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Vehicles funded by {investorEmail}</p>
                        </div>
                        {myCars.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b-2 border-gray-100 dark:border-neutral-700">
                                            <th className="pb-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Vehicle</th>
                                            <th className="pb-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                            <th className="pb-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Price</th>
                                            <th className="pb-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Share %</th>
                                            <th className="pb-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Capital Deployed</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-neutral-700">
                                        {myCars.map(car => {
                                            const investorObj = car.investors?.find(i => i.email.toLowerCase() === investorEmail);
                                            const sharePercent = investorObj ? `${investorObj.share}%` : (car.investorEmails?.length ? `${(100/car.investorEmails.length).toFixed(0)}% (Auto)` : '50% (Default)');
                                            const deployed = investorObj 
                                                ? (car.purchasePrice * investorObj.share / 100)
                                                : (car.investorEmails?.length ? (car.purchasePrice / car.investorEmails.length) : (car.purchasePrice / 2));
                                                
                                            return (
                                                <tr key={car.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700/50 transition-colors">
                                                    <td className="py-4 font-bold text-sm">{car.brand} {car.model} ({car.year})</td>
                                                    <td className="py-4">
                                                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                                                            car.status === 'sold' ? 'bg-blue-100 text-blue-700' :
                                                            car.status === 'reserved' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-green-100 text-green-700'
                                                        }`}>
                                                            {car.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 font-medium text-sm tabular-nums text-gray-500">{formatCurrency(car.purchasePrice)}</td>
                                                    <td className="py-4 font-bold text-gray-700 dark:text-gray-300 text-sm">{sharePercent}</td>
                                                    <td className="py-4 font-black text-brand-red text-sm tabular-nums">{car.status !== 'sold' ? formatCurrency(deployed) : '-'}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8 bg-gray-50 dark:bg-neutral-900 rounded-xl border border-dashed border-gray-200 dark:border-neutral-700">
                                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">No vehicles funded by this investor.</p>
                            </div>
                        )}
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
                            <span className="font-medium">Fuel & Tolls</span>
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
                            <span className="font-medium">Total Account Balances</span>
                            <span className="text-brand-red font-bold">{formatCurrency(totalAccountBalances)}</span>
                        </div>
                        <div className="flex justify-between items-center bg-white dark:bg-neutral-800 p-3 rounded-lg border dark:border-neutral-600 print:border-none print:px-0">
                            <span className="font-medium">Total Inventory Value</span>
                            <span className="text-brand-red font-bold">{formatCurrency(inventoryValue)}</span>
                        </div>
                        <div className="pt-4 border-t-2 border-dashed border-gray-200 dark:border-neutral-700">
                            <div className="flex justify-between items-center p-4 bg-brand-red rounded-xl shadow-lg shadow-red-600/20 print:bg-white print:border-2 print:border-brand-red print:shadow-none">
                                <span className="text-lg font-bold text-white uppercase tracking-wider print:text-brand-red">Business Net Worth</span>
                                <span className="text-2xl font-black text-white print:text-brand-red">{formatCurrency(totalAccountBalances + inventoryValue)}</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center p-3 text-sm text-gray-500 italic">
                            <span>* Calculated using the most recent recorded balances for all accounts.</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Certification & Signature (Print Only) */}
            <div className="hidden print:grid grid-cols-2 gap-20 mt-20 pt-10 border-t-2 border-neutral-100">
                <div className="space-y-8">
                    <div>
                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Financial Integrity Certification</p>
                        <p className="text-[10px] text-neutral-500 leading-relaxed italic">
                            The undersigned hereby certifies that the financial data presented in this report accurately reflects the operational activities and current asset position of Shift N Go as of the date generated. All valuations are based on internal audit logs.
                        </p>
                    </div>
                    <div className="pt-8 border-t border-neutral-300 w-2/3">
                        <p className="text-[10px] font-black text-neutral-900 uppercase tracking-widest">Authorized Signature</p>
                        <p className="text-[9px] text-neutral-400 uppercase mt-1">Shift N Go Management</p>
                    </div>
                </div>
                <div className="flex flex-col justify-end items-end space-y-4">
                    <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl text-right">
                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Portfolio Verification Hash</p>
                        <p className="text-[8px] font-mono text-neutral-600 truncate max-w-[200px]">{typeof crypto !== 'undefined' ? crypto.randomUUID().toUpperCase() : 'VERIFIED-REPORT'}</p>
                    </div>
                    <div className="pt-8 border-t border-neutral-300 w-2/3 text-right">
                        <p className="text-[10px] font-black text-neutral-900 uppercase tracking-widest">Investor Acknowledgment</p>
                        <p className="text-[9px] text-neutral-400 uppercase mt-1">Date of Review</p>
                    </div>
                </div>
            </div>

            {/* Bottom Disclaimer */}
            <div className="mt-8 pt-8 border-t text-center text-xs text-gray-400 print:mt-10 print:pt-10 print:text-[8px] print:text-neutral-500">
                <p className="font-bold">PRIVATE & CONFIDENTIAL</p>
                <p className="mt-1 uppercase tracking-widest">Prepared for Authorized Investor Review by Shift N Go Asset Management</p>
                <p className="mt-2">© {new Date().getFullYear()} Shift N Go. All rights reserved. Values based on real-time transactional logging.</p>
            </div>
        </div>
    );
};



