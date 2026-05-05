'use client';

import { useState, type FormEvent } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { ACCOUNT_CATEGORIES } from '@/types/finance';
import { useAnalytics } from '@/hooks/useAnalytics';

interface AddAccountFormProps {
  onSuccess?: () => void;
}

export const AddAccountForm = ({ onSuccess }: AddAccountFormProps) => {
  const { addAccount } = useFinance();
  const { trackEvent } = useAnalytics();
  const [formData, setFormData] = useState({
    name: '',
    category: ACCOUNT_CATEGORIES[0] as string,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.category) return;

    addAccount({
      name: formData.name.trim(),
      category: formData.category,
    });

    // Track account creation
    trackEvent('account_created', {
      account_category: formData.category,
    });

    // Reset form
    setFormData({
      name: '',
      category: ACCOUNT_CATEGORIES[0],
    });

    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="accountName" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
          Account Name
        </label>
        <input
          type="text"
          id="accountName"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent bg-white dark:bg-neutral-700 text-gray-900 dark:text-neutral-100"
          placeholder="e.g., Checking Account, Credit Card, etc."
          required
        />
      </div>



      <div>
        <label htmlFor="accountCategory" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
          Category
        </label>
        <select
          id="accountCategory"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent bg-white dark:bg-neutral-700 text-gray-900 dark:text-neutral-100"
        >
          {ACCOUNT_CATEGORIES.map((category: string) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-brand-red text-white py-2 px-4 rounded-md hover:bg-brand-red-dark focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2 dark:focus:ring-offset-neutral-800 transition-colors"
      >
        Add Account
      </button>
    </form>
  );
};



