import { InventoryItem, Transaction } from '@/types/finance';
import carBrandsData from '@/data/carBrands.json';

const ALL_BRANDS = [
    ...carBrandsData.car_brands_india_preowned.active_brands,
    ...carBrandsData.car_brands_india_preowned.discontinued_or_exited_brands
].sort((a, b) => b.length - a.length); // Sort longest first to match "Maruti Suzuki" before "Maruti"

/**
 * Normalizes a car brand name based on the predefined list.
 * e.g., "mercedes", "benz", "mercedes benz" -> "Mercedes-Benz"
 */
export const normalizeBrand = (input: string): string => {
    if (!input) return 'Other';
    
    const lowerInput = input.toLowerCase().trim();
    const normalizedInput = lowerInput.replace(/[-\s]/g, ''); // Remove spaces and hyphens for comparison
    
    // Special handling for Mercedes-Benz
    if (lowerInput === 'mercedes' || lowerInput === 'benz' || lowerInput.includes('mercedes benz') || lowerInput.includes('mercedes-benz')) {
        return 'Mercedes-Benz';
    }

    // Special handling for Suzuki
    if (lowerInput === 'maruti' || lowerInput === 'maruti suzuki' || lowerInput.includes('maruti suzuki')) {
        return 'Suzuki';
    }

    // Try to find a match in the list
    for (const brand of ALL_BRANDS) {
        const lowerBrand = brand.toLowerCase();
        const normalizedBrand = lowerBrand.replace(/[-\s]/g, '');
        
        // Exact match (ignoring spaces/hyphens)
        if (normalizedInput === normalizedBrand) return brand;
        
        // Input contains brand or brand contains input
        if (lowerInput.includes(lowerBrand) || lowerBrand.includes(lowerInput) || 
            normalizedInput.includes(normalizedBrand) || normalizedBrand.includes(normalizedInput)) {
            if (normalizedInput.length >= 3) {
                return brand;
            }
        }
    }

    // Capitalize first letter as fallback
    return input.charAt(0).toUpperCase() + input.slice(1);
};

/**
 * Extracts normalized brand and model from a full name string.
 */
export const parseCarName = (fullName: string) => {
    const trimmed = fullName.trim();
    if (!trimmed) return { brand: 'Other', model: 'Standard' };

    const lowerTrimmed = trimmed.toLowerCase();

    // Try to find which brand from our list is in the name
    let foundBrand = '';
    let foundBrandLower = '';

    for (const brand of ALL_BRANDS) {
        const lowerBrand = brand.toLowerCase();
        const variations = [
            lowerBrand,
            lowerBrand.replace('-', ' '),
            lowerBrand.replace(' ', '-'),
            lowerBrand.replace(/[-\s]/g, '')
        ];

        // Check if the name starts with any variation of the brand
        const matchedVariation = variations.find(v => lowerTrimmed.startsWith(v));
        
        if (matchedVariation) {
            if (brand.length > foundBrand.length) {
                foundBrand = brand;
                foundBrandLower = matchedVariation;
            }
        }
    }

    // Special case for Mercedes/Benz if not matched by prefix
    if (!foundBrand) {
        if (lowerTrimmed.includes('mercedes') || lowerTrimmed.includes('benz')) {
            foundBrand = 'Mercedes-Benz';
        } else if (lowerTrimmed.includes('maruti')) {
            foundBrand = 'Suzuki';
        }
    }

    if (foundBrand) {
        let model = '';
        if (foundBrandLower && lowerTrimmed.startsWith(foundBrandLower)) {
            model = trimmed.slice(foundBrandLower.length).trim();
        } else {
            // Robust removal of brand variations from anywhere in the string
            model = trimmed
                .replace(new RegExp(foundBrand.replace(/[-\s]/g, '[-\\s]?'), 'gi'), '')
                .replace(/mercedes/gi, '')
                .replace(/benz/gi, '')
                .replace(/maruti/gi, '')
                .trim();
        }

        return {
            brand: foundBrand,
            model: model || 'Standard'
        };
    }

    // Fallback: split by space
    const parts = trimmed.split(' ');
    const brand = normalizeBrand(parts[0]);
    const model = parts.slice(1).join(' ') || 'Standard';

    return { brand, model };
};

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
        .filter(t => t.type === 'expense' && t.category !== 'Car Purchase (Inventory)')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const totalCosting = car.purchasePrice + otherExpenses;
    const soldPrice = car.salePrice || 0;
    const brokerComm = car.sellingBrokerCommission || 0;
    const netProfit = soldPrice > 0 ? (soldPrice - totalCosting - brokerComm) : 0;

    // Default business model: 50% to Company, 50% split among Investors
    const investorPool = netProfit / 2;
    
    let investorSplits: Record<string, number> = {};
    
    if (car.investors && car.investors.length > 0) {
        // Use variable shares
        car.investors.forEach(inv => {
            investorSplits[inv.email] = (investorPool * inv.share) / 100;
        });
    } else {
        // Fallback to equal split
        const numInvestors = car.investorEmails?.length || 1;
        const profitPerPerson = investorPool / numInvestors;
        (car.investorEmails || []).forEach(email => {
            investorSplits[email] = profitPerPerson;
        });
        if (!car.investorEmails || car.investorEmails.length === 0) {
            investorSplits['default'] = profitPerPerson;
        }
    }

    const profitPerPerson = Object.values(investorSplits)[0] || 0;

    return {
        otherExpenses,
        totalCosting,
        netProfit,
        profitPerPerson,
        investorSplits, // Return full split mapping
        transactions: carTx
    };
};

/**
 * Extracts a unique list of investor emails from inventory and transactions
 */
export const getUniqueInvestorEmails = (inventory: InventoryItem[], transactions: Transaction[]) => {
    const fromInventory = inventory.flatMap(i => [
        ...(i.investorEmails || []),
        ...(i.investors?.map(inv => inv.email) || [])
    ]);
    const fromTransactions = transactions.flatMap(t => t.investorEmails || []);
    
    return Array.from(new Set([
        ...fromInventory,
        ...fromTransactions
    ].filter(Boolean) as string[]));
};
