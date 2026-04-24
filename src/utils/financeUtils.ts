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

    return {
        otherExpenses,
        totalCosting,
        netProfit,
        profitPerPerson: netProfit / 2,
        transactions: carTx
    };
};

/**
 * Extracts a unique list of investor emails from inventory and transactions
 */
export const getUniqueInvestorEmails = (inventory: InventoryItem[], transactions: Transaction[]) => {
    return Array.from(new Set([
        ...inventory.map(i => i.investorEmail),
        ...transactions.map(t => t.investorEmail)
    ].filter(Boolean) as string[]));
};
