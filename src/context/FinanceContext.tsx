'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Account, Balance, Transaction, InventoryItem, AccountWithBalance, AccountWithHistory } from '@/types/finance';
import { isCloudSyncAllowed } from '@/lib/offline';

interface FinanceContextType {
  accounts: Account[];
  balances: Balance[];
  transactions: Transaction[];
  inventory: InventoryItem[];
  isLoading: boolean;
  addAccount: (account: Omit<Account, 'id' | 'createdAt'>) => void;
  updateBalance: (accountId: string, amount: number) => void;
  updateMultipleBalances: (updates: { accountId: string; amount: number }[], date?: Date, replaceExisting?: boolean) => void;
  importBalances: (entries: { accountId: string; amount: number; date: Date }[], replaceExisting?: boolean) => void;
  getAccountsWithBalances: () => AccountWithBalance[];
  getAccountsWithHistory: () => AccountWithHistory[];
  deleteAccount: (accountId: string) => void;
  updateAccount: (accountId: string, updates: Pick<Account, 'name' | 'category' | 'type'>) => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'> & { date?: Date }) => void;
  deleteTransaction: (transactionId: string) => void;
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'createdAt'>) => void;
  updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;
  exportData: () => string;
  importData: (jsonData: string) => boolean;
  clearAllData: () => void;
  triggerCloudSync: () => Promise<void>;
  triggerRemoveCloudData: () => Promise<void>;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [balances, setBalances] = useState<Balance[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from API on mount
  useEffect(() => {
    const savedAccounts = localStorage.getItem('finance-accounts');
    const savedBalances = localStorage.getItem('finance-balances');
    const savedTransactions = localStorage.getItem('finance-transactions');
    const savedInventory = localStorage.getItem('finance-inventory');

    if (savedAccounts) {
      const parsedAccounts = JSON.parse(savedAccounts);
      setAccounts(parsedAccounts.map((acc: Account) => ({
        ...acc,
        createdAt: new Date(acc.createdAt)
      })));
    }
    if (savedBalances) {
      const parsedBalances = JSON.parse(savedBalances);
      setBalances(parsedBalances.map((bal: Balance) => ({
        ...bal,
        date: new Date(bal.date)
      })));
    }
    if (savedTransactions) {
      const parsedTransactions = JSON.parse(savedTransactions);
      setTransactions(parsedTransactions.map((tx: Transaction) => ({
        ...tx,
        date: new Date(tx.date)
      })));
    }
    if (savedInventory) {
      const parsedInventory = JSON.parse(savedInventory);
      setInventory(parsedInventory.map((item: InventoryItem) => ({
        ...item,
        createdAt: new Date(item.createdAt),
        soldAt: item.soldAt ? new Date(item.soldAt) : undefined
      })));
    }

    if (!isCloudSyncAllowed()) {
      setIsLoading(false);
      return;
    }
    getUserCloudData()
        .then((res: { accounts: Account[]; balances: Balance[]; transactions: Transaction[]; inventory: InventoryItem[] } | null) => {

          if (res !== null) {
            setAccounts(res.accounts);
            setBalances(res.balances.map(b => ({ ...b, date: new Date(b.date) })));
            setTransactions(res.transactions.map(t => ({ ...t, date: new Date(t.date) })));
            setInventory((res.inventory || []).map(i => ({ 
              ...i, 
              createdAt: new Date(i.createdAt),
              soldAt: i.soldAt ? new Date(i.soldAt) : undefined 
            })));

            localStorage.setItem('finance-accounts', JSON.stringify(res.accounts));
            localStorage.setItem('finance-balances', JSON.stringify(res.balances));
            localStorage.setItem('finance-transactions', JSON.stringify(res.transactions));
            localStorage.setItem('finance-inventory', JSON.stringify(res.inventory || []));
          }
        })
        .catch((error) => {
          console.error('Error fetching user cloud data:', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
  }, []);

  const getUserCloudData = async (): Promise<{ accounts: Account[]; balances: Balance[]; transactions: Transaction[]; inventory: InventoryItem[] } | null> => {
    console.warn('Fetching user cloud data from API');
    const response = await fetch('/api/data', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    return data;
  }

  const saveUserCloudData = async (accounts: Account[], balances: Balance[], transactions: Transaction[], inventory: InventoryItem[]) => {
    console.warn('Saving user cloud data to API');
    const response = await fetch('/api/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ accounts, balances, transactions, inventory }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to save user cloud data');
    }

    return;
  }

  const deleteUserCloudData = async (): Promise<void> => {
    console.warn('Deleting user cloud data from API');
    const response = await fetch('/api/data', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete user cloud data');
    }

    return;
  }

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('finance-accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('finance-balances', JSON.stringify(balances));
  }, [balances]);

  useEffect(() => {
    localStorage.setItem('finance-transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('finance-inventory', JSON.stringify(inventory));
  }, [inventory]);

  const triggerCloudSync = () => {
    return saveUserCloudData(accounts, balances, transactions, inventory);
  }

  const triggerRemoveCloudData = () => {
    return deleteUserCloudData();
  }

  const addAccount = (accountData: Omit<Account, 'id' | 'createdAt'>) => {
    const newAccount: Account = {
      ...accountData,
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11),
      createdAt: new Date(),
    };
    setAccounts(prev => [...prev, newAccount]);

    if (isCloudSyncAllowed()) {
      return saveUserCloudData([...accounts, newAccount], balances, transactions, inventory);
    }
  };

  const updateBalance = (accountId: string, amount: number) => {
    const newBalance: Balance = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11),
      accountId,
      amount,
      date: new Date(),
    };
    setBalances(prev => [...prev, newBalance]);

    if (isCloudSyncAllowed()) {
      return saveUserCloudData(accounts, [...balances, newBalance], transactions, inventory);
    }
  };

  const updateAccount = (accountId: string, updates: Pick<Account, 'name' | 'category' | 'type'>) => {
    setAccounts(prev => {
      const updatedAccounts = prev.map(account =>
        account.id === accountId ? { ...account, ...updates } : account
      );

      if (isCloudSyncAllowed()) {
        saveUserCloudData(updatedAccounts, balances, transactions, inventory);
      }

      return updatedAccounts;
    });
  };

  const addTransaction = (transactionData: Omit<Transaction, 'id' | 'date'> & { date?: Date }) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11),
      date: transactionData.date || new Date(),
    };
    setTransactions(prev => [...prev, newTransaction]);

    if (isCloudSyncAllowed()) {
      saveUserCloudData(accounts, balances, [...transactions, newTransaction], inventory);
    }
  };

  const deleteTransaction = (transactionId: string) => {
    setTransactions(prev => {
      const updatedTransactions = prev.filter(t => t.id !== transactionId);
      if (isCloudSyncAllowed()) {
        saveUserCloudData(accounts, balances, updatedTransactions, inventory);
      }
      return updatedTransactions;
    });
  };

  const addInventoryItem = (itemData: Omit<InventoryItem, 'id' | 'createdAt'>) => {
    const newItem: InventoryItem = {
      ...itemData,
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11),
      createdAt: new Date(),
    };
    setInventory(prev => [...prev, newItem]);

    if (isCloudSyncAllowed()) {
      saveUserCloudData(accounts, balances, transactions, [...inventory, newItem]);
    }
  }

  const updateInventoryItem = (id: string, updates: Partial<InventoryItem>) => {
    setInventory(prev => {
      const updated = prev.map(item => item.id === id ? { ...item, ...updates } : item);
      if (isCloudSyncAllowed()) {
        saveUserCloudData(accounts, balances, transactions, updated);
      }
      return updated;
    });
  }

  const deleteInventoryItem = (id: string) => {
    setInventory(prev => {
      const updated = prev.filter(item => item.id !== id);
      if (isCloudSyncAllowed()) {
        saveUserCloudData(accounts, balances, transactions, updated);
      }
      return updated;
    });
  }

  const updateMultipleBalances = (
    updates: { accountId: string; amount: number }[],
    date?: Date,
    replaceExisting: boolean = false
  ) => {
    const balanceDate = date || new Date();
    const targetDateString = balanceDate.toISOString().split('T')[0];

    const newBalances = updates.map(update => ({
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11),
      accountId: update.accountId,
      amount: update.amount,
      date: balanceDate,
    }));

    setBalances(prev => {
      const filteredPrev = replaceExisting
        ? prev.filter(balance => balance.date.toISOString().split('T')[0] !== targetDateString)
        : prev;

      const updatedBalances = [...filteredPrev, ...newBalances];

      if (isCloudSyncAllowed()) {
        saveUserCloudData(accounts, updatedBalances, transactions, inventory);
      }

      return updatedBalances;
    });
  };

  const importBalances = (
    entries: { accountId: string; amount: number; date: Date }[],
    replaceExisting: boolean = false
  ) => {
    if (entries.length === 0) return;

    setBalances(prev => {
      let updatedPrev = prev;

      if (replaceExisting) {
        const dateKeys = new Set(
          entries.map(entry => `${entry.accountId}|${entry.date.toISOString().split('T')[0]}`)
        );
        updatedPrev = prev.filter(
          balance => !dateKeys.has(`${balance.accountId}|${balance.date.toISOString().split('T')[0]}`)
        );
      }

      const newBalances = entries.map(entry => ({
        id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11),
        accountId: entry.accountId,
        amount: entry.amount,
        date: entry.date,
      }));

      const mergedBalances = [...updatedPrev, ...newBalances];

      if (isCloudSyncAllowed()) {
        saveUserCloudData(accounts, mergedBalances, transactions, inventory);
      }

      return mergedBalances;
    });
  };

  const getAccountsWithBalances = (): AccountWithBalance[] => {
    return accounts.map(account => {
      const accountBalances = balances
        .filter(balance => balance.accountId === account.id)
        .sort((a, b) => b.date.getTime() - a.date.getTime());
      
      const currentBalance = accountBalances.length > 0 ? accountBalances[0].amount : 0;
      
      return {
        ...account,
        currentBalance,
      };
    });
  };

  const deleteAccount = (accountId: string) => {
    setAccounts(prev => prev.filter(account => account.id !== accountId));
    setBalances(prev => prev.filter(balance => balance.accountId !== accountId));
    setTransactions(prev => prev.filter(t => t.accountId !== accountId));

    if (isCloudSyncAllowed()) {
      return deleteUserCloudData();
    }
  };

  const exportData = (): string => {
    const exportData = {
      version: '1.2',
      exportDate: new Date().toISOString(),
      accounts,
      balances,
      transactions,
      inventory,
    };
    return JSON.stringify(exportData, null, 2);
  };

  const importData = (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);
      
      if (!data.accounts || !data.balances || !Array.isArray(data.accounts) || !Array.isArray(data.balances)) {
        return false;
      }

      const importedAccounts = data.accounts.map((acc: Account) => ({
        ...acc,
        createdAt: new Date(acc.createdAt)
      }));

      const importedBalances = data.balances.map((bal: Balance) => ({
        ...bal,
        date: new Date(bal.date)
      }));

      const importedTransactions = (data.transactions || []).map((tx: Transaction) => ({
        ...tx,
        date: new Date(tx.date)
      }));

      const importedInventory = (data.inventory || []).map((item: InventoryItem) => ({
        ...item,
        createdAt: new Date(item.createdAt),
        soldAt: item.soldAt ? new Date(item.soldAt) : undefined
      }));

      setAccounts(importedAccounts);
      setBalances(importedBalances);
      setTransactions(importedTransactions);
      setInventory(importedInventory);

      if (isCloudSyncAllowed()) {
        saveUserCloudData(importedAccounts, importedBalances, importedTransactions, importedInventory);
      }

      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  };

  const clearAllData = () => {
    setAccounts([]);
    setBalances([]);
    setTransactions([]);
    setInventory([]);
    localStorage.removeItem('finance-accounts');
    localStorage.removeItem('finance-balances');
    localStorage.removeItem('finance-transactions');
    localStorage.removeItem('finance-inventory');
  };

  const getAccountsWithHistory = (): AccountWithHistory[] => {
    return accounts.map(account => {
      const accountBalances = balances
        .filter(balance => balance.accountId === account.id)
        .sort((a, b) => b.date.getTime() - a.date.getTime());
        
      return {
        ...account,
        balanceHistory: accountBalances,
      };
    });
  }

  return (
    <FinanceContext.Provider
      value={{
        accounts,
        balances,
        transactions,
        inventory,
        isLoading,
        addAccount,
        updateBalance,
        updateMultipleBalances,
        importBalances,
        getAccountsWithBalances,
        updateAccount,
        deleteAccount,
        addTransaction,
        deleteTransaction,
        addInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
        exportData,
        importData,
        clearAllData,
        triggerCloudSync,
        triggerRemoveCloudData,
        getAccountsWithHistory,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};



