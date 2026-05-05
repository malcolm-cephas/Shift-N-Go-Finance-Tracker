'use client';

import { useEffect, useMemo, useState } from 'react';
import { Account, ACCOUNT_CATEGORIES } from '@/types/finance';

interface ManageAccountModalProps {
  account: Account;
  onSave: (updates: Pick<Account, 'name' | 'category'>) => void;
  onClose: () => void;
}

export const ManageAccountModal = ({ account, onSave, onClose }: ManageAccountModalProps) => {
  const [name, setName] = useState(account.name);
  const [category, setCategory] = useState(account.category);

  const categoryOptions = useMemo(() => {
    const options = ACCOUNT_CATEGORIES as readonly string[];
    return options.includes(category as string) ? options : [...options, category];
  }, [category]);

  useEffect(() => {
    const options = ACCOUNT_CATEGORIES as readonly string[];
    if (!options.includes(category)) {
      setCategory(options[0]);
    }
  }, [category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;
    onSave({ name: trimmedName, category });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl dark:shadow-neutral-900/50 w-full max-w-md p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-neutral-100">Edit Account</h2>
            <p className="text-sm text-gray-500 dark:text-neutral-400">Update the account name or category.</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-200"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="account-name" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
              Account Name
            </label>
            <input
              id="account-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 dark:border-neutral-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-brand-red focus:border-brand-red/20 bg-white dark:bg-neutral-700 text-gray-900 dark:text-neutral-100"
              placeholder="e.g., Checking Account"
              required
            />
          </div>



          <div>
            <label htmlFor="account-category" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
              Category
            </label>
            <select
              id="account-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 dark:border-neutral-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-brand-red focus:border-brand-red/20 bg-white dark:bg-neutral-700 text-gray-900 dark:text-neutral-100"
            >
              {categoryOptions.map((option: string) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-brand-red text-white hover:bg-brand-red-dark"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};



