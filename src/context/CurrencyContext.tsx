'use client';

import React, { createContext, useContext, useState } from 'react';

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  locale: string;
}

export const SUPPORTED_CURRENCIES: Currency[] = [
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', locale: 'en-IN' },
];

interface CurrencyContextType {
  selectedCurrency: Currency;
  setSelectedCurrency: (currency: Currency) => void;
  formatCurrency: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCurrency] = useState<Currency>(SUPPORTED_CURRENCIES[0]);

  // Logic to set currency is removed as only INR is supported
  const setSelectedCurrency = () => {
    console.warn('Currency changes are disabled. Only INR is supported.');
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat(selectedCurrency.locale, {
      style: 'currency',
      currency: selectedCurrency.code,
    }).format(amount);
  };

  return (
    <CurrencyContext.Provider
      value={{
        selectedCurrency,
        setSelectedCurrency,
        formatCurrency,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};
