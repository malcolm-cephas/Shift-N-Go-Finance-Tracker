'use client';

import { useState, type ChangeEvent } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { useCurrency } from '@/context/CurrencyContext';
import { CurrencySelector } from './CurrencySelector';
import { ThemeToggle } from './ThemeToggle';
import { ConfirmationModal } from './ui/ConfirmationModal';

const Settings = () => {
  const {
    accounts,
    balances,
    importData,
    exportData,
    clearAllData
  } = useFinance();
  const { selectedCurrency } = useCurrency();

  const [importFile, setImportFile] = useState<File | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [importStatus, setImportStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleExport = () => {
    try {
      const data = exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `personal-finance-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      setImportStatus({
        type: 'error',
        message: 'Export failed. Please try again.'
      });
    }
  };

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImportFile(file);
      setImportStatus({ type: null, message: '' });
    }
  };

  const handleImport = async () => {
    if (!importFile) {
      setImportStatus({
        type: 'error',
        message: 'Please select a file to import.'
      });
      return;
    }

    try {
      const text = await importFile.text();
      const success = importData(text);

      if (success) {
        setImportStatus({
          type: 'success',
          message: 'Data imported successfully!'
        });
        setImportFile(null);
        // Reset file input
        const fileInput = document.getElementById('import-file') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        setImportStatus({
          type: 'error',
          message: 'Import failed. Please check your file format and try again.'
        });
      }
    } catch (error) {
      console.error('Import failed:', error);
      setImportStatus({
        type: 'error',
        message: 'Import failed. Please check your file format and try again.'
      });
    }
  };

  const handleClearAllData = () => {
    clearAllData();
    setShowConfirmDelete(false);
    setImportStatus({
      type: 'success',
      message: 'All data has been cleared.'
    });
  };

  const dataStats = {
    accountsCount: accounts.length,
    balancesCount: balances.length,
    totalRecords: accounts.length + balances.length
  };

  return (
    <div className="space-y-8">
      {/* Status Messages */}
      {importStatus.type && (
        <div className={`p-4 rounded-md ${importStatus.type === 'success'
          ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300'
          : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
          }`}>
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-lg font-bold">
                {importStatus.type === 'success' ? ' SUCCESS ' : ' ERROR '}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{importStatus.message}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setImportStatus({ type: null, message: '' })}
                className="text-sm underline hover:no-underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Appearance */}
      <div className="bg-gray-50 dark:bg-neutral-700/50 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-neutral-100 mb-4 uppercase tracking-wider text-brand-red">Appearance</h2>
        <p className="text-gray-600 dark:text-neutral-400 mb-4">
          Choose your preferred color theme. System will automatically match your device settings.
        </p>
        <ThemeToggle />
      </div>

      {/* Currency Preferences */}
      <div className="bg-gray-50 dark:bg-neutral-700/50 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-neutral-100 mb-4 uppercase tracking-wider text-brand-red">Currency Preferences</h2>
        <p className="text-gray-600 dark:text-neutral-400 mb-4">
          Select your preferred currency for displaying financial data. This will update all balance sheets and charts.
        </p>
        <div className="flex items-center space-x-4">
          <div className="flex-1 max-w-xs">
            <CurrencySelector showLabel={true} />
          </div>
          <div className="text-sm text-gray-500 dark:text-neutral-400">
            Currently using: <span className="font-medium">{selectedCurrency.name} ({selectedCurrency.symbol})</span>
          </div>
        </div>
      </div>

      {/* Data Overview */}
      <div className="bg-gray-50 dark:bg-neutral-700/50 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-neutral-100 mb-4 uppercase tracking-wider text-brand-red">Data Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-neutral-800 p-4 rounded-md border dark:border-neutral-600">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{dataStats.accountsCount}</div>
            <div className="text-sm text-gray-600 dark:text-neutral-400">Accounts</div>
          </div>
          <div className="bg-white dark:bg-neutral-800 p-4 rounded-md border dark:border-neutral-600">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{dataStats.balancesCount}</div>
            <div className="text-sm text-gray-600 dark:text-neutral-400">Balance Records</div>
          </div>
          <div className="bg-white dark:bg-neutral-800 p-4 rounded-md border dark:border-neutral-600">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{dataStats.totalRecords}</div>
            <div className="text-sm text-gray-600 dark:text-neutral-400">Total Records</div>
          </div>
        </div>
      </div>


      {/* Export Section */}
      <div className="bg-gray-50 dark:bg-neutral-700/50 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-neutral-100 mb-4 uppercase tracking-wider text-brand-red">Export Data</h2>
        <p className="text-gray-600 dark:text-neutral-400 mb-4">
          Download a backup of all your financial data in JSON format. This includes all accounts,
          balance records, and transaction history.
        </p>
        <button
          onClick={handleExport}
          className="bg-brand-red hover:bg-brand-red-dark text-white px-6 py-3 rounded-md font-medium transition-colors flex items-center space-x-2"
        >
          <span>Export All Data</span>
        </button>
      </div>

      {/* Import Section */}
      <div className="bg-gray-50 dark:bg-neutral-700/50 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-neutral-100 mb-4 uppercase tracking-wider text-brand-red">Import Data</h2>
        <p className="text-gray-600 dark:text-neutral-400 mb-4">
          Import financial data from a previously exported backup file. This will replace all current data on your account.
        </p>

        <div className="space-y-4">
          <div>
            <label htmlFor="import-file" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
              Select backup file:
            </label>
            <input
              id="import-file"
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              className="block w-full text-sm text-gray-500 dark:text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-neutral-50 dark:bg-neutral-800 dark:file:bg-brand-red/30 file:text-brand-red dark:file:text-brand-red hover:file:bg-brand-red dark:hover:file:bg-brand-red/50"
            />
          </div>

          {importFile && (
            <div className="bg-neutral-50 dark:bg-neutral-800 dark:bg-neutral-50 dark:bg-neutral-800 border border-brand-red/20 dark:border-brand-red/20 rounded-md p-3">
              <p className="text-sm text-gray-900 dark:text-white">
                <strong>Selected file:</strong> {importFile.name} ({(importFile.size / 1024).toFixed(1)} KB)
              </p>
            </div>
          )}

          <button
            onClick={handleImport}
            disabled={!importFile}
            className={`px-6 py-3 rounded-md font-medium transition-colors flex items-center space-x-2 ${importFile
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-gray-300 dark:bg-neutral-600 text-gray-500 dark:text-neutral-400 cursor-not-allowed'
              }`}
          >
            <span>Import Data</span>
          </button>
        </div>
      </div>

      <div className="bg-red-50 dark:bg-red-900/10 rounded-lg p-6 border border-red-200 dark:border-red-900/30">
        <h2 className="text-xl font-bold text-red-800 dark:text-red-400 mb-4 uppercase tracking-wider">Danger Zone</h2>
        <p className="text-red-700 dark:text-red-300 mb-6">
          Permanently delete all your financial data. This action cannot be undone.
        </p>

        <button
          onClick={() => setShowConfirmDelete(true)}
          className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-[0.98] flex items-center space-x-2 shadow-xl shadow-red-200 dark:shadow-none"
        >
          <span>Clear All Data</span>
        </button>
      </div>

      <ConfirmationModal
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={handleClearAllData}
        title="Clear All Data"
        message={`This will permanently remove ${dataStats.accountsCount} accounts and ${dataStats.balancesCount} balance records. This action is irreversible.`}
        confirmText="Yes, Delete Everything"
        variant="danger"
        requiresChallenge={true}
        challengeString="Shift N Go"
      />
    </div>
  );
};

export default Settings;



