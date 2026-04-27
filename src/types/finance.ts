export type AccountType = 'asset' | 'liability' | 'equity';

export interface InvestorShare {
  email: string;
  share: number; // Percentage, e.g. 25 for 25%
}

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  category: string;
  createdAt: Date;
}

export interface Balance {
  id: string;
  accountId: string;
  amount: number;
  date: Date;
}

export interface InventoryItem {
  id: string;
  name: string;
  purchasePrice: number;
  salePrice?: number;
  sellingBrokerCommission?: number;
  status: 'available' | 'sold' | 'reserved';
  licensePlate?: string; // Optional: Registration number
  investorEmails?: string[]; // Deprecated: Tagged investors who funded this car
  investors?: InvestorShare[]; // New: Investors with their specific shares
  createdAt: Date;
  soldAt?: Date;
}

export interface Transaction {
  id: string;
  accountId: string; // The account this transaction affected (e.g. Cash)
  vehicleId?: string; // Optional: Link to a specific car in inventory
  investorEmails?: string[]; // Optional: Attribute this transaction to specific investors
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  date: Date;
}

export interface AccountWithBalance extends Account {
  currentBalance: number;
}

export interface AccountWithHistory extends Account {
  balanceHistory: { date: Date; amount: number }[];
}

export interface ACCOUNT_CATEGORIES_TYPE {
  asset: string[];
  liability: string[];
  equity: string[];
}

export const ACCOUNT_CATEGORIES: ACCOUNT_CATEGORIES_TYPE = {
  asset: [
    'Inventory (Pre-owned Cars)',
    'Accounts Receivable (Financing)',
    'Petty Cash',
    'Main Business Bank Account',
    'Fixed Assets (Showroom, etc.)',
    'Other Business Assets'
  ],
  liability: [
    'Floor Plan Financing',
    'Accounts Payable (Vendors)',
    'Vendor Bills (Repairs/Detailing)',
    'Business Loans',
    'Tax Liabilities (GST/VAT)',
    'Other Business Liabilities'
  ],
  equity: [
    'Owner Investment',
    'Retained Earnings'
  ]
} as const;

export const TRANSACTION_CATEGORIES = {
  income: [
    'Car Sale',
    'Investor Funding',
    'Financing Commission',
    'Service/Repair Revenue',
    'Other Income'
  ],
  expense: [
    'Car Purchase (Inventory)',
    'Repair & Maintenance',
    'Detailing & Cleaning',
    'Marketing & Advertising',
    'Rent & Utilities',
    'Salaries & Commissions',
    'Taxes & Licenses',
    'Fuel & Tolls',
    'Other Expenses'
  ]
} as const;
