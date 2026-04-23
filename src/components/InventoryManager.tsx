'use client';

import { useState, useMemo } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useAuth } from '@/context/AuthContext';
import { InventoryItem } from '@/types/finance';

export const InventoryManager = () => {
    const { accounts, inventory, transactions, addInventoryItem, updateInventoryItem, deleteInventoryItem, addTransaction } = useFinance();
    const { formatCurrency } = useCurrency();
    const { role, user } = useAuth();
    const isAdmin = role === 'ADMIN' || role === 'MANAGER';
    const investorEmailIdentity = user?.email?.toLowerCase();

    // FILTER: If investor, only show their cars
    const displayInventory = useMemo(() => {
        if (role === 'INVESTOR' && investorEmailIdentity) {
            return inventory.filter(item => item.investorEmail?.toLowerCase() === investorEmailIdentity);
        }
        return inventory;
    }, [inventory, role, investorEmailIdentity]);

    const [isAdding, setIsAdding] = useState(false);
    const [selectedCarId, setSelectedCarId] = useState<string | null>(null);

    // Form State
    const [name, setName] = useState('');
    const [purchasePrice, setPurchasePrice] = useState('');
    const [licensePlate, setLicensePlate] = useState('');
    const [investorEmail, setInvestorEmail] = useState('');
    
    // Mark as Sold Modal State
    const [isMarkingSold, setIsMarkingSold] = useState(false);
    const [soldPrice, setSoldPrice] = useState('');
    const [soldComm, setSoldComm] = useState('0');
    const [soldAccountId, setSoldAccountId] = useState('');

    const handleAddCar = (e: React.FormEvent) => {
        e.preventDefault();
        addInventoryItem({
            name,
            purchasePrice: parseFloat(purchasePrice),
            licensePlate: licensePlate || undefined,
            status: 'available',
            investorEmail: investorEmail || undefined,
        });
        setIsAdding(false);
        setName('');
        setPurchasePrice('');
        setLicensePlate('');
        setInvestorEmail('');
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

        // 2. Automatically Log Transaction
        addTransaction({
            accountId: soldAccountId,
            vehicleId: car.id,
            investorEmail: car.investorEmail,
            amount: price,
            type: 'income',
            category: 'Car Sale',
            description: `Sale of ${car.name} (${car.licensePlate || 'No Plate'})`,
            date: new Date()
        });

        setIsMarkingSold(false);
        setSoldPrice('');
        setSoldComm('0');
        setSoldAccountId('');
    };

    const calculateCarStats = (car: InventoryItem) => {
        const carTx = getCarTransactions(car.id);
        const otherExpenses = carTx
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const totalCosting = car.purchasePrice + otherExpenses;
        const soldPrice = car.salePrice || 0;
        const brokerComm = car.sellingBrokerCommission || 0;
        const netProfit = soldPrice > 0 ? (soldPrice - totalCosting - brokerComm) : 0;

        return {
            otherExpenses,
            totalCosting,
            netProfit,
            profitPerPerson: netProfit / 2
        };
    };

    const selectedCar = inventory.find(c => c.id === selectedCarId);
    const selectedCarStats = selectedCar ? calculateCarStats(selectedCar) : null;

    return (
        <div className="max-w-6xl mx-auto space-y-8 p-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Vehicle Inventory</h1>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Car-wise Profitability & Investor Tracking</p>
                </div>
                {isAdmin && (
                    <button 
                        onClick={() => setIsAdding(!isAdding)}
                        className="bg-brand-red text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-red-200"
                    >
                        {isAdding ? 'CLOSE FORM' : 'ADD NEW VEHICLE'}
                    </button>
                )}
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
                                placeholder="e.g. MH 01 AB 1234"
                                className="w-full px-6 py-4 bg-gray-50 dark:bg-neutral-900 border rounded-2xl focus:ring-2 focus:ring-brand-red outline-none font-bold uppercase"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Tag Investor (Email)</label>
                            <input 
                                type="email" 
                                list="investor-emails"
                                value={investorEmail}
                                onChange={(e) => setInvestorEmail(e.target.value)}
                                placeholder="investor@example.com"
                                className="w-full px-6 py-4 bg-gray-50 dark:bg-neutral-900 border rounded-2xl focus:ring-2 focus:ring-brand-red outline-none font-bold"
                            />
                            <datalist id="investor-emails">
                                {Array.from(new Set([
                                    ...inventory.map(i => i.investorEmail),
                                    ...transactions.map(t => t.investorEmail)
                                ].filter(Boolean))).map(email => (
                                    <option key={email} value={email!} />
                                ))}
                            </datalist>
                        </div>
                        <button type="submit" className="md:col-span-3 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-black py-4 rounded-2xl uppercase tracking-widest transition-all active:scale-[0.98]">
                            INITIALIZE VEHICLE LOGS
                        </button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Car List */}
                <div className="lg:col-span-1 space-y-4 h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                    {displayInventory.length === 0 && (
                        <div className="text-center py-20 bg-gray-50 dark:bg-neutral-900/50 rounded-[2.5rem] border border-dashed text-gray-400 font-bold">
                            {role === 'INVESTOR' ? 'No units tagged to your account.' : 'No units in inventory.'}
                        </div>
                    )}
                    {displayInventory.map(car => {
                        const stats = calculateCarStats(car);
                        return (
                            <button 
                                key={car.id}
                                onClick={() => setSelectedCarId(car.id)}
                                className={`w-full text-left p-6 rounded-[2rem] border transition-all duration-300 group ${selectedCarId === car.id 
                                    ? 'bg-brand-red border-brand-red shadow-xl shadow-red-200 -translate-y-1' 
                                    : 'bg-white dark:bg-neutral-800 border-neutral-100 dark:border-neutral-700 hover:border-brand-red'}`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className={`text-[10px] font-black uppercase tracking-widest ${selectedCarId === car.id ? 'text-red-100' : 'text-gray-400'}`}>Vehicle ID: {car.id.slice(0, 8)}</p>
                                            {car.licensePlate && (
                                                <span className={`px-2 py-0.5 border-2 rounded text-[10px] font-black uppercase tracking-tighter ${selectedCarId === car.id ? 'bg-white text-brand-red border-white' : 'bg-gray-100 dark:bg-neutral-700 border-neutral-900 dark:border-white text-gray-900 dark:text-white'}`}>
                                                    {car.licensePlate}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className={`text-xl font-black mt-1 ${selectedCarId === car.id ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{car.name}</h3>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${car.status === 'sold' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                        {car.status}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className={`text-[10px] font-black uppercase tracking-widest ${selectedCarId === car.id ? 'text-red-200' : 'text-gray-400'}`}>Costing</p>
                                        <p className={`font-bold ${selectedCarId === car.id ? 'text-white' : 'text-gray-800 dark:text-neutral-200'}`}>{formatCurrency(stats.totalCosting)}</p>
                                    </div>
                                    {car.status === 'sold' && (
                                        <div>
                                            <p className={`text-[10px] font-black uppercase tracking-widest ${selectedCarId === car.id ? 'text-red-200' : 'text-gray-400'}`}>Net Profit</p>
                                            <p className={`font-bold ${selectedCarId === car.id ? 'text-white' : 'text-green-600'}`}>{formatCurrency(stats.netProfit)}</p>
                                        </div>
                                    )}
                                </div>
                                {car.investorEmail && (
                                    <div className={`mt-4 pt-4 border-t ${selectedCarId === car.id ? 'border-white/20' : 'border-neutral-50 dark:border-neutral-700'}`}>
                                        <p className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${selectedCarId === car.id ? 'text-white' : 'text-gray-500'}`}>
                                            👤 {car.investorEmail}
                                        </p>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Car Details / Transaction Sheet */}
                <div className="lg:col-span-2">
                    {selectedCar ? (
                        <div className="bg-white dark:bg-neutral-800 rounded-[2.5rem] shadow-2xl border dark:border-neutral-700 overflow-hidden flex flex-col h-[70vh]">
                            <div className="p-8 bg-neutral-900 text-white relative flex justify-between items-center">
                                <div className="flex items-center gap-6">
                                    {selectedCar.licensePlate && (
                                        <div className="bg-white text-neutral-900 px-3 py-1.5 rounded-lg border-2 border-brand-red font-black text-xs uppercase tracking-tight shadow-lg">
                                            {selectedCar.licensePlate}
                                        </div>
                                    )}
                                    <div>
                                        <h2 className="text-3xl font-black uppercase tracking-tighter">{selectedCar.name}</h2>
                                        <p className="text-xs font-bold text-red-400 uppercase tracking-[0.3em] mt-1 italic leading-none">Vehicle Operational Sheet</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    {selectedCar.status === 'available' && isAdmin && (
                                        <button 
                                            onClick={() => {
                                                setSoldAccountId(accounts[0]?.id || '');
                                                setIsMarkingSold(true);
                                            }}
                                            className="bg-brand-red px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest"
                                        >
                                            MARK AS SOLD
                                        </button>
                                    )}
                                    {selectedCar.status === 'sold' && (
                                        <div className="bg-green-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
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
                                                <div className="mt-4 p-4 bg-gray-50 dark:bg-neutral-900 rounded-2xl flex justify-between items-center">
                                                    <span className="text-[10px] font-black uppercase italic text-gray-400">Profit Split (50/50)</span>
                                                    <span className="font-black text-brand-red">{formatCurrency(selectedCarStats!.profitPerPerson)} each</span>
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
                                                        <p className="text-[10px] uppercase font-black text-gray-400">{tx.category}</p>
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
        </div>
    );
};
