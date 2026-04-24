'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFinance } from '@/context/FinanceContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useAuth } from '@/context/AuthContext';
import { InventoryItem } from '@/types/finance';
import { calculateCarStats, formatAppDate } from '@/utils/financeUtils';

export const InventoryManager = () => {
    const router = useRouter();
    const { accounts, inventory, transactions, addInventoryItem, updateInventoryItem, deleteInventoryItem, addTransaction, investorEmails, getNickname } = useFinance();
    const { formatCurrency } = useCurrency();
    const { role, user } = useAuth();
    const isAdmin = role === 'ADMIN' || role === 'MANAGER';
    const investorEmailIdentity = user?.email?.toLowerCase();

    // FILTER: If investor, only show their cars
    const displayInventory = useMemo(() => {
        if (role === 'INVESTOR' && investorEmailIdentity) {
            return inventory.filter(item => item.investorEmails?.some(e => e.toLowerCase() === investorEmailIdentity));
        }
        return inventory;
    }, [inventory, role, investorEmailIdentity]);

    const [isAdding, setIsAdding] = useState(false);
    const [selectedCarId, setSelectedCarId] = useState<string | null>(null);

    // Form State
    const [name, setName] = useState('');
    const [purchasePrice, setPurchasePrice] = useState('');
    const [licensePlate, setLicensePlate] = useState('');
    const [selectedInvestorEmails, setSelectedInvestorEmails] = useState<string[]>([]);
    
    // Mark as Sold Modal State
    const [isMarkingSold, setIsMarkingSold] = useState(false);
    const [soldPrice, setSoldPrice] = useState('');
    const [soldComm, setSoldComm] = useState('0');
    const [soldAccountId, setSoldAccountId] = useState('');
    
    // Edit/Delete State
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState('');
    const [purchaseAccountId, setPurchaseAccountId] = useState('');

    const handleAddCar = (e: React.FormEvent) => {
        e.preventDefault();
        const price = parseFloat(purchasePrice);
        
        // 1. Add to Inventory
        const newItem = addInventoryItem({
            name,
            purchasePrice: price,
            licensePlate: licensePlate || undefined,
            status: 'available',
            investorEmails: selectedInvestorEmails.length > 0 ? selectedInvestorEmails : undefined,
        });

        // 2. Automatically Log Transaction (Expense)
        if (purchaseAccountId && price > 0) {
            addTransaction({
                accountId: purchaseAccountId,
                vehicleId: newItem.id,
                investorEmails: newItem.investorEmails,
                amount: price,
                type: 'expense',
                category: 'Car Purchase (Inventory)',
                description: `Acquisition of ${newItem.name} (${newItem.licensePlate || 'No Plate'})`,
                date: new Date()
            });
        }

        setIsAdding(false);
        setName('');
        setPurchasePrice('');
        setLicensePlate('');
        setSelectedInvestorEmails([]);
        setPurchaseAccountId('');
    };

    const getCarTransactions = (carId: string) => {
        return transactions.filter(t => t.vehicleId === carId);
    };

    const handleMarkSoldSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCarId || !soldPrice || !soldAccountId) return;
        const car = inventory.find(c => c.id === selectedCarId);
        if (!car) return;

        const price = parseFloat(soldPrice);
        const comm = parseFloat(soldComm);

        // 1. Update Inventory Status
        updateInventoryItem(car.id, { 
            status: 'sold', 
            salePrice: price, 
            sellingBrokerCommission: comm,
            soldAt: new Date()
        });

        // 2. Automatically Log Transaction (Income)
        addTransaction({
            accountId: soldAccountId,
            vehicleId: car.id,
            investorEmails: car.investorEmails,
            amount: price,
            type: 'income',
            category: 'Car Sale',
            description: `Sale of ${car.name} (${car.licensePlate || 'No Plate'})`,
            date: new Date()
        });

        // 3. Automatically Log Broker Commission (Expense) if applicable
        if (comm > 0) {
            addTransaction({
                accountId: soldAccountId,
                vehicleId: car.id,
                investorEmails: car.investorEmails,
                amount: comm,
                type: 'expense',
                category: 'Broker Commission',
                description: `Selling Broker Commission for ${car.name}`,
                date: new Date()
            });
        }

        setIsMarkingSold(false);
        setSoldPrice('');
        setSoldComm('0');
        setSoldAccountId('');
    };

    const handleEditCarSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCarId) return;
        updateInventoryItem(selectedCarId, {
            name,
            purchasePrice: parseFloat(purchasePrice),
            licensePlate: licensePlate || undefined,
            investorEmails: selectedInvestorEmails.length > 0 ? selectedInvestorEmails : undefined,
        });
        setIsEditing(false);
    };

    const handleDeleteCar = () => {
        if (!selectedCarId || deleteConfirmation !== 'Shift N Go') return;
        deleteInventoryItem(selectedCarId);
        setSelectedCarId(null);
        setIsDeleting(false);
        setDeleteConfirmation('');
    };

    const startEditing = () => {
        if (!selectedCar) return;
        setName(selectedCar.name);
        setPurchasePrice(selectedCar.purchasePrice.toString());
        setLicensePlate(selectedCar.licensePlate || '');
        setSelectedInvestorEmails(selectedCar.investorEmails || []);
        setIsEditing(true);
    };


    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'reserved' | 'sold'>('available');
    const [expandedBrands, setExpandedBrands] = useState<string[]>([]);
    const [expandedModels, setExpandedModels] = useState<string[]>([]);

    const getBrand = (name: string) => name.split(' ')[0] || 'Unknown';
    const getModel = (name: string) => name.split(' ').slice(1).join(' ') || 'Standard';

    const filteredInventory = useMemo(() => {
        return displayInventory.filter(car => {
            const matchesSearch = car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 car.licensePlate?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || car.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [displayInventory, searchTerm, statusFilter]);

    const groupedInventory = useMemo(() => {
        const groups: Record<string, Record<string, InventoryItem[]>> = {};
        filteredInventory.forEach(car => {
            const brand = getBrand(car.name);
            const model = getModel(car.name);
            if (!groups[brand]) groups[brand] = {};
            if (!groups[brand][model]) groups[brand][model] = [];
            groups[brand][model].push(car);
        });
        return groups;
    }, [filteredInventory]);

    const toggleBrand = (brand: string) => {
        setExpandedBrands(prev => 
            prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
        );
    };

    const toggleModel = (modelKey: string) => {
        setExpandedModels(prev => 
            prev.includes(modelKey) ? prev.filter(m => m !== modelKey) : [...prev, modelKey]
        );
    };

    // Auto-expand folder if search is active
    useEffect(() => {
        if (searchTerm) {
            const brands = Object.keys(groupedInventory);
            const models: string[] = [];
            brands.forEach(b => {
                Object.keys(groupedInventory[b]).forEach(m => models.push(`${b}-${m}`));
            });
            setExpandedBrands(brands);
            setExpandedModels(models);
        }
    }, [searchTerm, groupedInventory]);

    const selectedCar = inventory.find(c => c.id === selectedCarId);
    const selectedCarStats = selectedCar ? calculateCarStats(selectedCar, transactions) : null;

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Vehicle Inventory</h1>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Car-wise Profitability & Investor Tracking</p>
                </div>
                <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex bg-gray-100 dark:bg-neutral-800 p-1 rounded-xl border dark:border-neutral-700 h-[42px]">
                        {(['all', 'available', 'reserved', 'sold'] as const).map((s) => (
                            <button
                                key={s}
                                onClick={() => setStatusFilter(s)}
                                className={`px-4 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                    statusFilter === s 
                                    ? s === 'available' ? 'bg-brand-red text-white shadow-lg'
                                      : s === 'reserved' ? 'bg-amber-500 text-white shadow-lg'
                                      : s === 'sold' ? 'bg-emerald-500 text-white shadow-lg'
                                      : 'bg-neutral-900 dark:bg-neutral-600 text-white shadow-lg'
                                    : 'text-neutral-400 hover:text-gray-900 dark:hover:text-white'
                                }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                    <div className="relative group">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs">🔍</span>
                        <input 
                            type="text"
                            placeholder="Search fleet..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2.5 bg-white dark:bg-neutral-800 border rounded-xl text-[11px] font-bold focus:ring-2 focus:ring-brand-red outline-none min-w-[180px]"
                        />
                    </div>
                    {isAdmin && (
                        <button 
                            onClick={() => setIsAdding(!isAdding)}
                            className="bg-brand-red text-white px-6 py-2.5 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-red-200 whitespace-nowrap"
                        >
                            {isAdding ? 'CLOSE' : 'ADD UNIT'}
                        </button>
                    )}
                </div>
            </div>

            {isAdding && (
                <div className="bg-white dark:bg-neutral-800 p-8 rounded-[2.5rem] border-2 border-brand-red shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
                    <form onSubmit={handleAddCar} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Car Name / Model</label>
                            <input 
                                type="text" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Innova Crysta 2021"
                                className="w-full px-6 py-4 bg-gray-50 dark:bg-neutral-900 border rounded-2xl focus:ring-2 focus:ring-brand-red outline-none font-bold"
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Purchase Price (Initial)</label>
                            <input 
                                type="number" 
                                value={purchasePrice}
                                onChange={(e) => setPurchasePrice(e.target.value)}
                                placeholder="1600000"
                                className="w-full px-6 py-4 bg-gray-50 dark:bg-neutral-900 border rounded-2xl focus:ring-2 focus:ring-brand-red outline-none font-bold"
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Number Plate (Optional)</label>
                            <input 
                                type="text" 
                                value={licensePlate}
                                onChange={(e) => setLicensePlate(e.target.value)}
                                placeholder="MH 12 AB 1234"
                                className="w-full px-6 py-4 bg-gray-50 dark:bg-neutral-900 border rounded-2xl focus:ring-2 focus:ring-brand-red outline-none font-bold"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Funding Account (Logs Expense)</label>
                            <select 
                                value={purchaseAccountId}
                                onChange={(e) => setPurchaseAccountId(e.target.value)}
                                className="w-full px-6 py-4 bg-gray-50 dark:bg-neutral-900 border rounded-2xl focus:ring-2 focus:ring-brand-red outline-none font-bold text-xs uppercase"
                                required
                            >
                                <option value="">Select Account</option>
                                {accounts.map(acc => (
                                    <option key={acc.id} value={acc.id}>{acc.name} ({acc.category})</option>
                                ))}
                            </select>
                        </div>
                        <div className="md:col-span-3">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Tag Investors</label>
                            <div className="flex flex-wrap gap-4 p-4 bg-gray-50 dark:bg-neutral-900 border rounded-2xl">
                                {investorEmails.map(email => (
                                    <label key={email} className="flex items-center gap-2 cursor-pointer group">
                                        <input 
                                            type="checkbox"
                                            checked={selectedInvestorEmails.includes(email)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedInvestorEmails(prev => [...prev, email]);
                                                } else {
                                                    setSelectedInvestorEmails(prev => prev.filter(e => e !== email));
                                                }
                                            }}
                                            className="w-5 h-5 rounded border-neutral-300 text-brand-red focus:ring-brand-red cursor-pointer"
                                        />
                                        <span className="text-sm font-bold text-gray-700 dark:text-neutral-300 group-hover:text-brand-red transition-colors">
                                            {getNickname(email)}
                                        </span>
                                    </label>
                                ))}
                                {investorEmails.length === 0 && (
                                    <p className="text-xs text-neutral-400 font-bold italic">No known investors yet. Tag them in transactions first.</p>
                                )}
                            </div>
                        </div>
                        <button type="submit" className="md:col-span-3 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-black py-4 rounded-2xl uppercase tracking-widest transition-all active:scale-[0.98]">
                            INITIALIZE VEHICLE LOGS
                        </button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Car List */}
                <div className="lg:col-span-1 space-y-6 h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                    {Object.keys(groupedInventory).length === 0 && (
                        <div className="text-center py-20 bg-gray-50 dark:bg-neutral-900/50 rounded-[2.5rem] border border-dashed text-gray-400 font-bold">
                            {role === 'INVESTOR' ? 'No units tagged to your account.' : 'No units in inventory.'}
                        </div>
                    )}
                    
                    {Object.entries(groupedInventory).map(([brand, models]) => {
                        const brandCount = Object.values(models).reduce((sum, units) => sum + units.length, 0);
                        return (
                            <div key={brand} className="space-y-3">
                                <button 
                                    onClick={() => toggleBrand(brand)}
                                    className="flex items-center gap-3 w-full px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-2xl transition-colors group"
                                >
                                    <span className="text-xl transition-transform duration-300" style={{ transform: expandedBrands.includes(brand) ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                                        📂
                                    </span>
                                    <span className="text-sm font-black uppercase tracking-[0.1em] text-gray-800 dark:text-gray-200 group-hover:text-brand-red transition-colors">
                                        {brand}
                                    </span>
                                    <span className="ml-auto bg-neutral-200 dark:bg-neutral-700 text-[10px] font-black px-2 py-0.5 rounded-full text-neutral-500">
                                        {brandCount}
                                    </span>
                                </button>

                                {expandedBrands.includes(brand) && (
                                    <div className="space-y-4 ml-4 pl-4 border-l-2 border-neutral-100 dark:border-neutral-800 animate-in slide-in-from-left-2 duration-300">
                                        {Object.entries(models).map(([model, units]) => {
                                            const modelKey = `${brand}-${model}`;
                                            return (
                                                <div key={model} className="space-y-2">
                                                    <button 
                                                        onClick={() => toggleModel(modelKey)}
                                                        className="flex items-center gap-2 w-full px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors group"
                                                    >
                                                        <span className="text-sm grayscale opacity-50">{expandedModels.includes(modelKey) ? '📂' : '📁'}</span>
                                                        <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 group-hover:text-brand-red">
                                                            {model}
                                                        </span>
                                                        <span className="ml-auto text-[9px] font-black text-neutral-400 bg-neutral-50 dark:bg-neutral-900 px-2 py-0.5 rounded border dark:border-neutral-700">
                                                            {units.length}
                                                        </span>
                                                    </button>

                                                    {expandedModels.includes(modelKey) && (
                                                        <div className="space-y-3 ml-4 pl-4 border-l border-dashed border-neutral-200 dark:border-neutral-700 animate-in slide-in-from-top-1 duration-200">
                                                            {units.map(car => {
                                                                const stats = calculateCarStats(car, transactions);
                                                                const isSelected = selectedCarId === car.id;
                                                                return (
                                                                    <button 
                                                                        key={car.id}
                                                                        onClick={() => setSelectedCarId(car.id)}
                                                                        className={`w-full text-left p-6 rounded-[2rem] border transition-all duration-500 group relative overflow-hidden ${
                                                                            isSelected 
                                                                            ? 'bg-neutral-900 dark:bg-white border-neutral-900 dark:border-white shadow-2xl shadow-red-500/20 -translate-y-1' 
                                                                            : 'bg-white/80 dark:bg-neutral-800/50 backdrop-blur-sm border-neutral-100 dark:border-neutral-700 hover:border-brand-red/50 hover:shadow-lg'
                                                                        }`}
                                                                    >
                                                                        {isSelected && (
                                                                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red opacity-10 blur-3xl -mr-16 -mt-16 animate-pulse"></div>
                                                                        )}
                                                                        
                                                                        <div className="flex justify-between items-start gap-4 mb-6 relative z-10">
                                                                            <div className="flex-1 min-w-0">
                                                                                <div className="flex items-center gap-3 mb-1">
                                                                                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap ${isSelected ? 'text-neutral-400 dark:text-neutral-500' : 'text-neutral-400'}`}>
                                                                                        #{car.id.slice(0, 6)}
                                                                                    </span>
                                                                                    {car.licensePlate && (
                                                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter border whitespace-nowrap ${
                                                                                            isSelected 
                                                                                            ? 'bg-brand-red border-brand-red text-white' 
                                                                                            : 'bg-neutral-100 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-600 text-neutral-600 dark:text-neutral-300'
                                                                                        }`}>
                                                                                            {car.licensePlate}
                                                                                        </span>
                                                                                    )}
                                                                                </div>
                                                                                <h3 className={`text-sm font-black uppercase tracking-tight truncate ${isSelected ? 'text-white dark:text-neutral-900' : 'text-neutral-900 dark:text-white'}`}>
                                                                                    {car.licensePlate || car.name}
                                                                                </h3>
                                                                            </div>
                                                                            <span className={`shrink-0 px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest shadow-sm ${
                                                                                car.status === 'sold' 
                                                                                ? 'bg-emerald-500 text-white' 
                                                                                : car.status === 'reserved'
                                                                                ? 'bg-amber-500 text-white'
                                                                                : 'bg-brand-red text-white'
                                                                            }`}>
                                                                                {car.status}
                                                                            </span>
                                                                        </div>

                                                                        <div className="grid grid-cols-2 gap-4 relative z-10">
                                                                            <div className="space-y-1">
                                                                                <p className={`text-[9px] font-black uppercase tracking-[0.1em] ${isSelected ? 'text-neutral-400 dark:text-neutral-500' : 'text-neutral-400'}`}>Cost</p>
                                                                                <p className={`text-sm font-black tabular-nums ${isSelected ? 'text-white dark:text-neutral-900' : 'text-neutral-900 dark:text-white'}`}>
                                                                                    {formatCurrency(stats.totalCosting)}
                                                                                </p>
                                                                            </div>
                                                                            {car.status === 'sold' ? (
                                                                                <div className="space-y-1">
                                                                                    <p className={`text-[9px] font-black uppercase tracking-[0.1em] ${isSelected ? 'text-emerald-400' : 'text-neutral-400'}`}>Profit</p>
                                                                                    <p className={`text-sm font-black tabular-nums ${isSelected ? 'text-emerald-400' : 'text-emerald-600 dark:text-emerald-500'}`}>
                                                                                        +{formatCurrency(stats.netProfit)}
                                                                                    </p>
                                                                                </div>
                                                                            ) : (
                                                                                isAdmin && (
                                                                                    <button 
                                                                                        onClick={(e) => {
                                                                                            e.stopPropagation();
                                                                                            router.push(`/log-expenses?vehicleId=${car.id}`);
                                                                                        }}
                                                                                        className={`mt-auto py-2 rounded-xl text-[8px] font-black uppercase tracking-widest border transition-all ${
                                                                                            isSelected 
                                                                                            ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
                                                                                            : 'bg-neutral-50 border-neutral-100 text-neutral-400 hover:border-brand-red hover:text-brand-red'
                                                                                        }`}
                                                                                    >
                                                                                        + ADD EXPENSE
                                                                                    </button>
                                                                                )
                                                                            )}
                                                                        </div>
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Car Details / Transaction Sheet */}
                <div className="lg:col-span-2">
                    {selectedCar ? (
                        <div className="bg-white dark:bg-neutral-800 rounded-[2.5rem] shadow-2xl border dark:border-neutral-700 overflow-hidden flex flex-col h-[70vh]">
                            <div className="p-8 bg-neutral-900 text-white relative flex flex-wrap justify-between items-center gap-6">
                                <div className="flex items-center gap-6 min-w-0">
                                    {selectedCar.licensePlate && (
                                        <div className="shrink-0 bg-white text-neutral-900 px-3 py-1.5 rounded-lg border-2 border-brand-red font-black text-xs uppercase tracking-tight shadow-lg">
                                            {selectedCar.licensePlate}
                                        </div>
                                    )}
                                    <div className="min-w-0">
                                        <h2 className="text-3xl font-black uppercase tracking-tighter truncate">{selectedCar.name}</h2>
                                        <div className="flex items-center gap-2 mt-1">
                                            <p className="text-xs font-bold text-red-400 uppercase tracking-[0.3em] italic leading-none whitespace-nowrap">Vehicle Operational Sheet</p>
                                            {selectedCar.investorEmails && selectedCar.investorEmails.length > 0 && (
                                                <div className="flex flex-wrap gap-1 ml-2">
                                                    {selectedCar.investorEmails.map(email => (
                                                        <span 
                                                            key={email}
                                                            className="text-[9px] font-black text-gray-400 bg-white/10 px-2 py-0.5 rounded uppercase tracking-widest border border-white/20 whitespace-nowrap"
                                                            title={email}
                                                        >
                                                            👤 {getNickname(email)}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 shrink-0">
                                    {isAdmin && (
                                        <>
                                            <button 
                                                onClick={startEditing}
                                                className="p-2 text-gray-400 hover:text-white transition-colors"
                                                title="Edit Vehicle"
                                            >
                                                ✏️
                                            </button>
                                            <button 
                                                onClick={() => setIsDeleting(true)}
                                                className="p-2 text-gray-400 hover:text-brand-red transition-colors"
                                                title="Delete Vehicle"
                                            >
                                                🗑️
                                            </button>
                                        </>
                                    )}
                                    {selectedCar.status === 'available' && isAdmin && (
                                        <>
                                            <button 
                                                onClick={() => updateInventoryItem(selectedCar.id, { status: 'reserved' })}
                                                className="bg-amber-500 hover:bg-amber-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors"
                                            >
                                                RESERVE
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    setSoldAccountId(accounts[0]?.id || '');
                                                    setIsMarkingSold(true);
                                                }}
                                                className="bg-brand-red px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-500/20"
                                            >
                                                MARK AS SOLD
                                            </button>
                                        </>
                                    )}
                                    {selectedCar.status === 'reserved' && isAdmin && (
                                        <>
                                            <button 
                                                onClick={() => updateInventoryItem(selectedCar.id, { status: 'available' })}
                                                className="bg-neutral-700 hover:bg-neutral-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors"
                                            >
                                                UNRESERVE
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    setSoldAccountId(accounts[0]?.id || '');
                                                    setIsMarkingSold(true);
                                                }}
                                                className="bg-brand-red px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-500/20"
                                            >
                                                MARK AS SOLD
                                            </button>
                                        </>
                                    )}
                                    {selectedCar.status === 'sold' && (
                                        <div className="bg-emerald-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20">
                                            COMPLETED VEHICLE
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                                <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b pb-2">Vehicle Financials</h4>
                                        <div className="flex justify-between font-bold">
                                            <span className="text-gray-500">Buying Price</span>
                                            <span>{formatCurrency(selectedCar.purchasePrice)}</span>
                                        </div>
                                        <div className="flex justify-between font-bold">
                                            <span className="text-gray-500">Operational Expenses</span>
                                            <span className="text-red-500">{formatCurrency(selectedCarStats!.otherExpenses)}</span>
                                        </div>
                                        <div className="flex justify-between font-black text-lg pt-4 border-t border-dashed">
                                            <span className="uppercase text-xs tracking-widest">Total Costing</span>
                                            <span>{formatCurrency(selectedCarStats!.totalCosting)}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b pb-2">Sales Summary</h4>
                                        {selectedCar.status === 'sold' ? (
                                            <>
                                                <div className="flex justify-between font-bold">
                                                    <span className="text-gray-500">Selling Price</span>
                                                    <span className="text-green-600">{formatCurrency(selectedCar.salePrice || 0)}</span>
                                                </div>
                                                <div className="flex justify-between font-bold">
                                                    <span className="text-gray-500">Brokerage</span>
                                                    <span className="text-red-500">-{formatCurrency(selectedCar.sellingBrokerCommission || 0)}</span>
                                                </div>
                                                <div className="flex justify-between font-black text-lg pt-4 border-t-4 border-neutral-900 dark:border-white">
                                                    <span className="uppercase text-xs tracking-widest">Net Profit</span>
                                                    <span className={selectedCarStats!.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}>
                                                        {formatCurrency(selectedCarStats!.netProfit)}
                                                    </span>
                                                </div>
                                                <div className="mt-4 p-6 bg-red-50 dark:bg-red-950/20 rounded-[2rem] border border-red-100 dark:border-red-900/30">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-red-600 dark:text-red-400">Profit Distribution</span>
                                                        <span className="text-[9px] font-bold text-red-400 uppercase italic">50/50 Dealer split</span>
                                                    </div>
                                                    <div className="flex justify-between items-end">
                                                        <span className="text-2xl font-black text-brand-red">{formatCurrency(selectedCarStats!.profitPerPerson)}</span>
                                                        <span className="text-[10px] font-bold text-red-600/60 uppercase tracking-tighter">Per Investor Share</span>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-gray-50 dark:bg-neutral-900/50 rounded-[2rem] border border-dashed">
                                                <p className="text-xs font-bold text-gray-400">Profit realized upon sale.</p>
                                            </div>
                                        )}
                                    </div>
                                </section>

                                <section>
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Granular Expense Log</h4>
                                    <div className="space-y-2">
                                        {getCarTransactions(selectedCar.id).length === 0 && (
                                            <div className="text-xs italic text-gray-400">No specific expenses logged yet for this car. Use the Log Expenses page to add entries.</div>
                                        )}
                                        {getCarTransactions(selectedCar.id).map(tx => (
                                            <div key={tx.id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-neutral-900/40 rounded-2xl border dark:border-neutral-700 group hover:border-brand-red transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-2 h-2 rounded-full ${tx.type === 'income' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                    <div>
                                                        <p className="font-bold text-sm">{tx.description}</p>
                                                        <p className="text-[10px] uppercase font-black text-gray-400">{formatAppDate(tx.date)} • {tx.category}</p>
                                                    </div>
                                                </div>
                                                <div className={`font-black ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>
                        </div>
                    ) : (
                        <div className="h-[70vh] flex flex-col items-center justify-center bg-gray-50 dark:bg-neutral-900/20 rounded-[2.5rem] border-2 border-dashed dark:border-neutral-700">
                            <div className="text-6xl mb-4 grayscale opacity-20">🚙</div>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Select a Vehicle to view Financial Logs</p>
                        </div>
                    )}
                </div>
            </div>
            {/* Mark as Sold Modal */}
            {isMarkingSold && selectedCar && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-neutral-800 p-8 rounded-[2.5rem] shadow-2xl max-w-md w-full border-2 border-brand-red">
                        <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">Finalize Sale</h3>
                        <p className="text-gray-500 text-sm mb-6 font-bold">Completing the lifecycle for <span className="text-brand-red">{selectedCar.name}</span></p>
                        
                        <form onSubmit={handleMarkSoldSubmit} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Final Sale Price</label>
                                <input 
                                    type="number" 
                                    value={soldPrice}
                                    onChange={(e) => setSoldPrice(e.target.value)}
                                    placeholder="e.g. 1850000"
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-neutral-900 border rounded-xl outline-none font-bold focus:ring-2 focus:ring-brand-red"
                                    required 
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Broker Commission (if any)</label>
                                <input 
                                    type="number" 
                                    value={soldComm}
                                    onChange={(e) => setSoldComm(e.target.value)}
                                    placeholder="e.g. 25000"
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-neutral-900 border rounded-xl outline-none font-bold focus:ring-2 focus:ring-brand-red"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Account Receiving Payment</label>
                                <select 
                                    value={soldAccountId}
                                    onChange={(e) => setSoldAccountId(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-neutral-900 border rounded-xl outline-none font-bold focus:ring-2 focus:ring-brand-red"
                                    required
                                >
                                    {accounts.map(acc => (
                                        <option key={acc.id} value={acc.id}>{acc.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="pt-4 flex gap-4">
                                <button 
                                    type="button"
                                    onClick={() => setIsMarkingSold(false)}
                                    className="flex-1 py-4 rounded-xl font-black uppercase tracking-widest text-xs bg-gray-100 text-gray-500"
                                >
                                    CANCEL
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-[2] py-4 rounded-xl font-black uppercase tracking-widest text-xs bg-brand-red text-white shadow-lg"
                                >
                                    LOG SALE & CLOSE VEHICLE
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Vehicle Modal */}
            {isEditing && selectedCar && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-neutral-800 p-8 rounded-[2.5rem] shadow-2xl max-w-2xl w-full border-2 border-brand-red">
                        <h3 className="text-2xl font-black uppercase tracking-tighter mb-6">Update Vehicle Details</h3>
                        <form onSubmit={handleEditCarSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Car Name / Model</label>
                                <input 
                                    type="text" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-6 py-4 bg-gray-50 dark:bg-neutral-900 border rounded-2xl focus:ring-2 focus:ring-brand-red outline-none font-bold"
                                    required 
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Purchase Price</label>
                                <input 
                                    type="number" 
                                    value={purchasePrice}
                                    onChange={(e) => setPurchasePrice(e.target.value)}
                                    className="w-full px-6 py-4 bg-gray-50 dark:bg-neutral-900 border rounded-2xl focus:ring-2 focus:ring-brand-red outline-none font-bold"
                                    required 
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Number Plate</label>
                                <input 
                                    type="text" 
                                    value={licensePlate}
                                    onChange={(e) => setLicensePlate(e.target.value)}
                                    className="w-full px-6 py-4 bg-gray-50 dark:bg-neutral-900 border rounded-2xl focus:ring-2 focus:ring-brand-red outline-none font-bold uppercase"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Tag Investors</label>
                                <div className="flex flex-wrap gap-4 p-4 bg-gray-50 dark:bg-neutral-900 border rounded-2xl">
                                    {investorEmails.map(email => (
                                        <label key={email} className="flex items-center gap-2 cursor-pointer group">
                                            <input 
                                                type="checkbox"
                                                checked={selectedInvestorEmails.includes(email)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedInvestorEmails(prev => [...prev, email]);
                                                    } else {
                                                        setSelectedInvestorEmails(prev => prev.filter(e => e !== email));
                                                    }
                                                }}
                                                className="w-5 h-5 rounded border-neutral-300 text-brand-red focus:ring-brand-red cursor-pointer"
                                            />
                                            <span className="text-sm font-bold text-gray-700 dark:text-neutral-300 group-hover:text-brand-red transition-colors">
                                                {getNickname(email)}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="md:col-span-2 flex gap-4 pt-4">
                                <button 
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-xs bg-gray-100 text-gray-500"
                                >
                                    CANCEL
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-[2] py-4 rounded-2xl font-black uppercase tracking-widest text-xs bg-brand-red text-white shadow-lg"
                                >
                                    SAVE UPDATES
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Confirm Delete Modal */}
            {isDeleting && selectedCar && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="bg-white dark:bg-neutral-800 p-10 rounded-[3rem] shadow-2xl max-w-md w-full border-4 border-brand-red animate-in zoom-in-95 duration-200">
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 text-brand-red rounded-full flex items-center justify-center text-4xl mx-auto mb-6">⚠️</div>
                            <h3 className="text-3xl font-black uppercase tracking-tighter mb-2 text-gray-900 dark:text-white">Dangerous Action</h3>
                            <p className="text-gray-500 dark:text-neutral-400 text-sm font-bold leading-relaxed">
                                You are about to permanently delete <span className="text-brand-red font-black underline decoration-2 underline-offset-4">{selectedCar.name}</span>. This will remove all associated logs and profitability data.
                            </p>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="bg-gray-50 dark:bg-neutral-900/50 p-4 rounded-2xl border-2 border-dashed border-gray-200 dark:border-neutral-700">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center mb-3">Type the following to confirm</p>
                                <p className="text-xl font-black text-center text-gray-900 dark:text-white tracking-[0.2em]">Shift N Go</p>
                            </div>

                            <input 
                                type="text" 
                                value={deleteConfirmation}
                                onChange={(e) => setDeleteConfirmation(e.target.value)}
                                placeholder="Enter verification text"
                                className="w-full px-6 py-4 bg-white dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 rounded-2xl outline-none font-bold text-center focus:border-brand-red transition-all"
                            />

                            <div className="flex flex-col gap-3">
                                <button 
                                    onClick={handleDeleteCar}
                                    disabled={deleteConfirmation !== 'Shift N Go'}
                                    className="w-full py-5 rounded-2xl font-black uppercase tracking-widest text-sm bg-brand-red text-white shadow-xl shadow-red-500/20 disabled:opacity-30 disabled:grayscale transition-all active:scale-95"
                                >
                                    CONFIRM PERMANENT DELETE
                                </button>
                                <button 
                                    onClick={() => {
                                        setIsDeleting(false);
                                        setDeleteConfirmation('');
                                    }}
                                    className="w-full py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                                >
                                    I CHANGED MY MIND (CANCEL)
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
