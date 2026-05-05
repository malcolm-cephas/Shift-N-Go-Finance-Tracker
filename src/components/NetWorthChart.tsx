'use client';

import { useMemo, useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { Balance, Account } from '@/types/finance';
import { useCurrency } from '@/context/CurrencyContext';
import { useTheme } from '@/context/ThemeContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler
);

interface NetWorthChartProps {
  accounts: Account[];
  balances: Balance[];
  height?: number;
}

interface NetWorthDataPoint {
  date: Date;
  totalBalance: number;
}

export const NetWorthChart = ({ accounts, balances, height = 400 }: NetWorthChartProps) => {
  const { formatCurrency, selectedCurrency } = useCurrency();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const textColor = isDark ? '#e5e5e5' : '#374151';
  const gridColor = isDark ? 'rgba(163, 163, 163, 0.3)' : 'rgba(0, 0, 0, 0.1)';
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const netWorthData = useMemo(() => {
    // Get all unique dates from balances
    const allDates = [...new Set(balances.map(b => b.date.toISOString().split('T')[0]))]
      .sort()
      .map(dateStr => new Date(dateStr));

    const dataPoints: NetWorthDataPoint[] = [];

    for (const date of allDates) {
      let totalBalance = 0;

      // For each account, get the most recent balance up to this date
      for (const account of accounts) {
        const accountBalances = balances
          .filter(b => b.accountId === account.id && b.date <= date)
          .sort((a, b) => b.date.getTime() - a.date.getTime());

        if (accountBalances.length > 0) {
          totalBalance += accountBalances[0].amount;
        }
      }

      dataPoints.push({
        date,
        totalBalance,
      });
    }

    return dataPoints;
  }, [accounts, balances]);

  if (netWorthData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-neutral-700/50 rounded-lg">
        <p className="text-gray-500 dark:text-neutral-400">No data available for business value tracking</p>
      </div>
    );
  }

  const data = {
    labels: netWorthData.map(point => point.date),
    datasets: [
      {
        label: 'Total Business Value',
        data: netWorthData.map(point => point.totalBalance),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { color: textColor },
      },
      title: {
        display: true,
        text: 'Total Business Value Over Time',
        color: textColor,
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const y = context.parsed.y;
            return y == null ? 'Balance: N/A' : `Balance: ${formatCurrency(y)}`;
          },
        },
      },
    },
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'day' as const,
          displayFormats: {
            day: 'dd/MM/yyyy'
          },
          tooltipFormat: 'dd/MM/yyyy'
        },
        title: {
          display: true,
          text: 'Date',
          color: textColor,
        },
        ticks: { color: textColor },
        grid: { color: gridColor },
      },
      y: {
        title: {
          display: true,
          text: `Amount (${selectedCurrency.symbol})`,
          color: textColor,
        },
        ticks: {
          color: textColor,
          callback: function (value: number | string) {
            return formatCurrency(Number(value));
          },
        },
        grid: { color: gridColor },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };

  // Calculate summary stats with safety guards
  const latestData = netWorthData.length > 0 ? netWorthData[netWorthData.length - 1] : { totalBalance: 0 };
  const firstData = netWorthData.length > 0 ? netWorthData[0] : { totalBalance: 0 };
  const netWorthChange = latestData.totalBalance - firstData.totalBalance;
  const netWorthChangePercent = firstData.totalBalance !== 0
    ? ((latestData.totalBalance - firstData.totalBalance) / Math.abs(firstData.totalBalance)) * 100
    : 0;

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700 shadow-sm">
          <h3 className="text-xs font-bold text-brand-red uppercase tracking-wider mb-2">Current Business Value</h3>
          <div className={`text-2xl font-black truncate ${latestData.totalBalance >= 0 ? 'text-gray-900 dark:text-white' : 'text-red-600 dark:text-red-400'}`}>
            {new Intl.NumberFormat(selectedCurrency.locale, { style: 'currency', currency: selectedCurrency.code, maximumFractionDigits: 0 }).format(latestData.totalBalance)}
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-neutral-700/50 rounded-lg p-6 border border-gray-200 dark:border-neutral-600">
          <h3 className="text-xs font-bold text-gray-800 dark:text-neutral-200 uppercase tracking-wider mb-2">Change</h3>
          <div className={`text-xl font-bold flex items-center gap-2 ${netWorthChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
            <span className="truncate">{new Intl.NumberFormat(selectedCurrency.locale, { style: 'currency', currency: selectedCurrency.code, maximumFractionDigits: 0 }).format(netWorthChange)}</span>
            <span className="text-sm font-medium">
              ({netWorthChange >= 0 ? '+' : ''}{netWorthChangePercent.toFixed(1)}%)
            </span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg border dark:border-neutral-600 p-4">
        <div style={{ height: `${height}px` }} className="w-full">
          <Line data={data} options={options} />
        </div>
      </div>
    </div>
  );
};



