import { InventoryItem, Transaction } from '@/types/finance';

/**
 * Formats a date to DD/MM/YYYY
 */
export const formatAppDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

/**
 * Calculates financial statistics for a specific vehicle
 */
export const calculateCarStats = (car: InventoryItem, transactions: Transaction[]) => {
    const carTx = transactions.filter(t => t.vehicleId === car.id);
    const otherExpenses = carTx
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const totalCosting = car.purchasePrice + otherExpenses;
    const soldPrice = car.salePrice || 0;
    const brokerComm = car.sellingBrokerCommission || 0;
    const netProfit = soldPrice > 0 ? (soldPrice - totalCosting - brokerComm) : 0;

    // Default business model: 50% to Company, 50% split among Investors
    const investorPool = netProfit / 2;
    const numInvestors = car.investorEmails?.length || 1;
    const profitPerPerson = investorPool / numInvestors;

    return {
        otherExpenses,
        totalCosting,
        netProfit,
        profitPerPerson,
        transactions: carTx
    };
};

/**
 * Extracts a unique list of investor emails from inventory and transactions
 */
export const getUniqueInvestorEmails = (inventory: InventoryItem[], transactions: Transaction[]) => {
    const fromInventory = inventory.flatMap(i => i.investorEmails || []);
    const fromTransactions = transactions.flatMap(t => t.investorEmails || []);
    
    return Array.from(new Set([
        ...fromInventory,
        ...fromTransactions
    ].filter(Boolean) as string[]));
};
