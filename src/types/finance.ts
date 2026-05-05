export interface InvestorShare {
  email: string;
  share: number; // Percentage, e.g. 25 for 25%
}

export interface Account {
  id: string;
  name: string;
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
  name: string; // Keep as fallback/display name
  brand: string;
  model: string;
  year: number;
  variant: string; // Engine capacity or specific variant
  fuelType: 'Petrol' | 'Diesel' | 'CNG' | 'Electric';
  transmission: 'Manual' | 'Automatic';
  purchasePrice: number;
  salePrice?: number;
  sellingBrokerCommission?: number;
  status: 'available' | 'sold' | 'reserved';
  licensePlate: string;
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

export const ACCOUNT_CATEGORIES = [
  'Bank Account',
  'Cash',
  'Mobile Money (UPI)',
  'Credit Card',
  'Business Loans',
  'Other'
];

export const TRANSACTION_CATEGORIES = {
  income: [
    'Car Sale',
    'Reservation',
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
