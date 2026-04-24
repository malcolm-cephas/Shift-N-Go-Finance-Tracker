'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useFinance } from '@/context/FinanceContext';
import { TRANSACTION_CATEGORIES } from '@/types/finance';
import { formatAppDate } from '@/utils/financeUtils';
import { useCurrency } from '@/context/CurrencyContext';
import { useAuth } from '@/context/AuthContext';

export const LogTransactions = () => {
    const searchParams = useSearchParams();
    const { accounts, transactions, addTransaction, deleteTransaction, inventory, investorEmails, getNickname } = useFinance();

    useEffect(() => {
        const vid = searchParams.get('vehicleId');
        if (vid) setVehicleId(vid);
    }, [searchParams]);
    const { formatCurrency } = useCurrency();
    const { role, user } = useAuth();
    const isReadOnly = role === 'INVESTOR';

    // Form State
    const [amount, setAmount] = useState<string>('');
    const [type, setType] = useState<'income' | 'expense'>('expense');
    const [category, setCategory] = useState<string>(TRANSACTION_CATEGORIES.expense[0]);
    const [accountId, setAccountId] = useState<string>(accounts[0]?.id || '');
    const [vehicleId, setVehicleId] = useState<string>('');
    const [selectedInvestorEmails, setSelectedInvestorEmails] = useState<string[]>([]);
    const [description, setDescription] = useState<string>('');
    const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

    // Custom Vehicle Picker State
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [pickerLevel, setPickerLevel] = useState<'brand' | 'model' | 'unit'>('brand');
    const [tempBrand, setTempBrand] = useState<string | null>(null);
    const [tempModel, setTempModel] = useState<string | null>(null);

    const vehicleHierarchy = useMemo(() => {
        const hierarchy: Record<string, Record<string, typeof inventory>> = {};
        inventory.forEach(car => {
            const parts = car.name.split(' ');
            const brand = parts[0] || 'Other';
            const model = parts.slice(1).join(' ') || 'Standard';
            
            if (!hierarchy[brand]) hierarchy[brand] = {};
            if (!hierarchy[brand][model]) hierarchy[brand][model] = [];
            hierarchy[brand][model].push(car);
        });
        return hierarchy;
    }, [inventory]);

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
            investorEmails: selectedInvestorEmails.length > 0 ? selectedInvestorEmails : undefined,
            amount: parseFloat(amount),
            type,
            category,
            description,
            date: date ? new Date(date) : new Date(),
        });

        setAmount('');
        setDescription('');
        setVehicleId('');
        setSelectedInvestorEmails([]);
        setDate(new Date().toISOString().split('T')[0]);
    };

    // Filtered and Sorted Logic with Role-Based Visibility
    const filteredTransactions = useMemo(() => {
        const searchStr = searchTerm.toLowerCase();
        const investorEmail = user?.email?.toLowerCase();
        const isInvestor = role === 'INVESTOR';

        // 1. First filter by Role (Privacy)
        let visibleTransactions = transactions;
        if (isInvestor && investorEmail) {
            // Map of carId to its investor emails for efficient lookup
            const carInvestorMap = new Map(inventory.map(c => [c.id, c.investorEmails?.map(e => e.toLowerCase()) || []]));
            
            visibleTransactions = transactions.filter(tx => {
                // Check if investor is tagged directly in transaction
                const isTaggedInTx = tx.investorEmails?.some(e => e.toLowerCase() === investorEmail);
                
                // Check if investor is tagged in the related vehicle
                const relatedCarInvestors = tx.vehicleId ? carInvestorMap.get(tx.vehicleId) : [];
                const isTaggedInVehicle = relatedCarInvestors?.includes(investorEmail);

                return isTaggedInTx || isTaggedInVehicle;
            });
        }

        // 2. Then filter by Search Term
        return visibleTransactions.filter(tx => {
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
    }, [transactions, searchTerm, accounts, role, user, inventory]);

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

    const groupedInventory = useMemo(() => {
        const groups: Record<string, typeof inventory> = {};
        inventory.forEach(item => {
            const brand = item.name.split(' ')[0] || 'General';
            if (!groups[brand]) groups[brand] = [];
            groups[brand].push(item);
        });
        return groups;
    }, [inventory]);

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
                                <label className="block text-xs font-black text-gray-500 dark:text-neutral-400 mb-1 uppercase tracking-wider">
                                    Link to Vehicle
                                </label>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsPickerOpen(true);
                                        setPickerLevel('brand');
                                    }}
                                    className="w-full px-3 py-2 border rounded-md dark:bg-neutral-700 dark:border-neutral-600 font-bold text-brand-red text-left flex justify-between items-center"
                                >
                                    <span className="truncate">
                                        {vehicleId ? (inventory.find(i => i.id === vehicleId)?.name || 'Linked Unit') : '-- General Expense --'}
                                    </span>
                                    <span>▼</span>
                                </button>

                                {isPickerOpen && (
                                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                                        <div className="bg-white dark:bg-neutral-800 rounded-[2rem] shadow-2xl w-full max-w-md border-2 border-brand-red overflow-hidden flex flex-col max-h-[80vh]">
                                            <div className="p-6 bg-neutral-900 text-white flex justify-between items-center">
                                                <div>
                                                    <h3 className="text-xl font-black uppercase tracking-tighter">Select Vehicle</h3>
                                                    <div className="flex gap-2 text-[9px] font-black uppercase tracking-widest text-neutral-400 mt-1">
                                                        <span className={pickerLevel === 'brand' ? 'text-brand-red' : ''}>Brand</span>
                                                        <span>/</span>
                                                        <span className={pickerLevel === 'model' ? 'text-brand-red' : ''}>Model</span>
                                                        <span>/</span>
                                                        <span className={pickerLevel === 'unit' ? 'text-brand-red' : ''}>Unit</span>
                                                    </div>
                                                </div>
                                                <button 
                                                    type="button"
                                                    onClick={() => setIsPickerOpen(false)}
                                                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                                                >
                                                    ✕
                                                </button>
                                            </div>

                                            <div className="p-4 bg-neutral-50 dark:bg-neutral-900 border-b dark:border-neutral-700 flex gap-2 overflow-x-auto whitespace-nowrap custom-scrollbar">
                                                <button 
                                                    type="button"
                                                    onClick={() => { setPickerLevel('brand'); setTempBrand(null); setTempModel(null); }}
                                                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${pickerLevel === 'brand' ? 'bg-brand-red text-white border-brand-red' : 'bg-white dark:bg-neutral-800 text-neutral-400 border-neutral-200 dark:border-neutral-700'}`}
                                                >
                                                    Start
                                                </button>
                                                {tempBrand && (
                                                    <button 
                                                        type="button"
                                                        onClick={() => { setPickerLevel('model'); setTempModel(null); }}
                                                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${pickerLevel === 'model' ? 'bg-brand-red text-white border-brand-red' : 'bg-white dark:bg-neutral-800 text-neutral-400 border-neutral-200 dark:border-neutral-700'}`}
                                                    >
                                                        {tempBrand}
                                                    </button>
                                                )}
                                                {tempModel && (
                                                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-brand-red text-white border border-brand-red">
                                                        {tempModel}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                                                {pickerLevel === 'brand' && (
                                                    <>
                                                        <button
                                                            type="button"
                                                            onClick={() => { setVehicleId(''); setIsPickerOpen(false); }}
                                                            className="w-full flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-900/50 border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-2xl hover:border-brand-red hover:bg-white dark:hover:bg-neutral-800 group transition-all mb-4"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-xl">🏢</span>
                                                                <span className="font-black uppercase tracking-widest text-xs text-neutral-500 group-hover:text-brand-red">-- General Business Expense --</span>
                                                            </div>
                                                            <span className="text-neutral-300 group-hover:text-brand-red">✓</span>
                                                        </button>
                                                        <div className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-3 ml-2">Select Vehicle Brand</div>
                                                        {Object.keys(vehicleHierarchy).sort().map(brand => (
                                                            <button
                                                                key={brand}
                                                                type="button"
                                                                onClick={() => { setTempBrand(brand); setPickerLevel('model'); }}
                                                                className="w-full flex items-center justify-between p-4 bg-white dark:bg-neutral-900 border dark:border-neutral-700 rounded-2xl hover:border-brand-red group transition-all"
                                                            >
                                                                <span className="font-black uppercase tracking-widest text-sm text-gray-700 dark:text-neutral-300 group-hover:text-brand-red">{brand}</span>
                                                                <span className="text-neutral-300 group-hover:text-brand-red">→</span>
                                                            </button>
                                                        ))}
                                                    </>
                                                )}

                                                {pickerLevel === 'model' && tempBrand && (
                                                    Object.keys(vehicleHierarchy[tempBrand]).sort().map(model => (
                                                        <button
                                                            key={model}
                                                            type="button"
                                                            onClick={() => {
                                                                const units = vehicleHierarchy[tempBrand][model];
                                                                if (units.length === 1) {
                                                                    setVehicleId(units[0].id);
                                                                    setIsPickerOpen(false);
                                                                } else {
                                                                    setTempModel(model);
                                                                    setPickerLevel('unit');
                                                                }
                                                            }}
                                                            className="w-full flex items-center justify-between p-4 bg-white dark:bg-neutral-900 border dark:border-neutral-700 rounded-2xl hover:border-brand-red group transition-all"
                                                        >
                                                            <span className="font-black uppercase tracking-widest text-sm text-gray-700 dark:text-neutral-300 group-hover:text-brand-red">{model}</span>
                                                            <div className="flex items-center gap-3">
                                                                <span className="bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded text-[10px] font-black text-neutral-500">{vehicleHierarchy[tempBrand][model].length} UNITS</span>
                                                                <span className="text-neutral-300 group-hover:text-brand-red">→</span>
                                                            </div>
                                                        </button>
                                                    ))
                                                )}

                                                {pickerLevel === 'unit' && tempBrand && tempModel && (
                                                    vehicleHierarchy[tempBrand][tempModel].map(unit => (
                                                        <button
                                                            key={unit.id}
                                                            type="button"
                                                            onClick={() => { setVehicleId(unit.id); setIsPickerOpen(false); }}
                                                            className="w-full flex flex-col p-4 bg-white dark:bg-neutral-900 border dark:border-neutral-700 rounded-2xl hover:border-brand-red group transition-all"
                                                        >
                                                            <span className="font-black uppercase tracking-tighter text-lg text-gray-800 dark:text-neutral-200 group-hover:text-brand-red">
                                                                {unit.licensePlate || 'NO PLATE'}
                                                            </span>
                                                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">ID: {unit.id.slice(0, 8)}</span>
                                                        </button>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Investor Multi-Select Dropdown */}
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Tag Investors</label>
                                <div className="space-y-3">
                                    <select
                                        className="w-full px-3 py-2 border rounded-md dark:bg-neutral-700 dark:border-neutral-600 font-bold"
                                        onChange={(e) => {
                                            const email = e.target.value;
                                            if (email && !selectedInvestorEmails.includes(email)) {
                                                setSelectedInvestorEmails(prev => [...prev, email]);
                                            }
                                            e.target.value = ''; // Reset dropdown after selection
                                        }}
                                    >
                                        <option value="">-- Add Investor Tag --</option>
                                        {investorEmails.map(email => (
                                            <option key={email} value={email}>
                                                {getNickname(email)} ({email})
                                            </option>
                                        ))}
                                    </select>
                                    
                                    {selectedInvestorEmails.length > 0 && (
                                        <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-neutral-900/50 border border-dashed rounded-2xl">
                                            {selectedInvestorEmails.map(email => (
                                                <div 
                                                    key={email} 
                                                    className="flex items-center gap-2 bg-white dark:bg-neutral-800 border dark:border-neutral-700 px-3 py-1.5 rounded-full shadow-sm"
                                                >
                                                    <span className="text-[10px] font-black text-brand-red uppercase italic">👤 {getNickname(email)}</span>
                                                    <button 
                                                        type="button"
                                                        onClick={() => setSelectedInvestorEmails(prev => prev.filter(e => e !== email))}
                                                        className="text-gray-400 hover:text-brand-red transition-colors font-black text-xs"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
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
                                    <th className="py-2">Date (DD/MM/YYYY)</th>
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
                                            {tx.investorEmails && tx.investorEmails.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {tx.investorEmails.map(email => (
                                                        <span key={email} className="text-[10px] bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded italic" title={email}>
                                                            👤 {getNickname(email)}
                                                        </span>
                                                    ))}
                                                </div>
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
