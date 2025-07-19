import React, { useState } from 'react';
import {
  Line, Bar, Pie
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// --- Section 1: Current Balances ---
const balanceCards = [
  { label: 'Cash Balance', value: 25000.75 },
  { label: 'Bank Balance', value: 120500.50 },
  { label: 'Accounts Receivable', value: 43200.00 },
  { label: 'Accounts Payable', value: 27500.25 },
  { label: 'Stock Value', value: 80500.00 },
  { label: 'Working Capital', value: 60000.50 },
  { label: 'Total Capital', value: 152000.00 },
];

const BalanceCard = ({ label, value }) => (
  <div className="rounded-2xl shadow-md p-2 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 h-28 flex flex-col justify-center">
    <h3 className="text-xs text-gray-500 dark:text-gray-300 mb-1">{label}</h3>
    <p className="text-base font-bold text-blue-700 dark:text-blue-300">
      {value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
    </p>
  </div>
);

const CurrentBalances = () => (
  <section className="grid grid-cols-1 lg:grid-cols-1 gap-4">
    <div className="rounded-2xl shadow-md p-4 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 h-auto flex flex-col justify-center">
      <h2 className="text-base font-bold text-blue-700 dark:text-blue-300 mb-2">Current Balances</h2>
      <ul className="space-y-2">
        {balanceCards.map((item, index) => (
          <li key={index} className="flex justify-between text-xs">
            <span className="text-gray-500 dark:text-gray-300">{item.label}</span>
            <span className="font-bold text-blue-700 dark:text-blue-300">
              {item.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

// --- Section 2: Financial Summary ---
const periods = ['Today', 'Last 7 Days', 'Last 30 Days', 'Last 12 Months', 'Custom Range'];
const financialData = {
  Sales: 125000,
  Purchase: 82000,
  Revenue: 43000,
  Expenses: 21500,
  ProfitLoss: 21500,
};

const FinancialSummary = () => {
  const [selectedPeriod, setSelectedPeriod] = useState(periods[2]);

  return (
    <section className="mt-8">
      <div className="flex flex-wrap gap-3 items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Financial Summary ({selectedPeriod})</h2>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {periods.map(period => <option key={period}>{period}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {Object.entries(financialData).map(([label, value]) => (
          <div key={label} className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 text-center border">
            <h3 className="text-sm text-gray-500 dark:text-gray-300 mb-1">{label}</h3>
            <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
              {value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

// --- Section 3: Charts ---
const SectionCharts = () => {
  const chartOptions = { responsive: true, plugins: { legend: { display: false } } };
  const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];

  return (
    <section className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border">
        <h3 className="mb-2 font-semibold">Sales Overview</h3>
        <Line
          options={chartOptions}
          data={{
            labels,
            datasets: [{ label: 'Sales', data: [5000, 12000, 8000, 15000], borderColor: '#3b82f6', tension: 0.4 }]
          }}
        />
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border">
        <h3 className="mb-2 font-semibold">Profit / Loss Overview</h3>
        <Line
          options={chartOptions}
          data={{
            labels,
            datasets: [{ label: 'Profit', data: [2000, 5000, 4000, 7500], borderColor: '#10b981', tension: 0.4 }]
          }}
        />
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border">
        <h3 className="mb-2 font-semibold">Revenue vs Expense</h3>
        <Bar
          options={chartOptions}
          data={{
            labels,
            datasets: [
              { label: 'Revenue', data: [10000, 12000, 11000, 13000], backgroundColor: '#6366f1' },
              { label: 'Expense', data: [6000, 7000, 6500, 7000], backgroundColor: '#ef4444' },
            ],
          }}
        />
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border">
        <h3 className="mb-2 font-semibold">Major Expenses</h3>
        <Pie
          data={{
            labels: ['Rent', 'Utilities', 'Salaries', 'Others'],
            datasets: [{ data: [4000, 2000, 7000, 1500], backgroundColor: ['#f59e0b', '#3b82f6', '#10b981', '#ef4444'] }]
          }}
        />
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border lg:col-span-2">
        <h3 className="mb-2 font-semibold">A/R vs A/P</h3>
        <Line
          options={chartOptions}
          data={{
            labels,
            datasets: [
              { label: 'A/R', data: [3000, 3500, 4000, 4500], borderColor: '#22c55e' },
              { label: 'A/P', data: [2500, 3000, 2000, 2200], borderColor: '#ef4444' },
            ]
          }}
        />
      </div>
    </section>
  );
};

// --- Add mock data for right section ---
const recentTransactions = [
  { date: '2025-07-18', description: 'Invoice #1234', amount: '$1,200', type: 'Sale' },
  { date: '2025-07-17', description: 'Payment Received', amount: '$800', type: 'Receipt' },
  { date: '2025-07-16', description: 'Purchase Order #567', amount: '$500', type: 'Purchase' },
  { date: '2025-07-15', description: 'Expense - Utilities', amount: '$150', type: 'Expense' },
  { date: '2025-07-14', description: 'Invoice #1233', amount: '$950', type: 'Sale' },
  { date: '2025-07-13', description: 'Payment Received', amount: '$700', type: 'Receipt' },
  { date: '2025-07-12', description: 'Expense - Rent', amount: '$1,000', type: 'Expense' },
  { date: '2025-07-11', description: 'Purchase Order #566', amount: '$400', type: 'Purchase' },
  { date: '2025-07-10', description: 'Invoice #1232', amount: '$1,100', type: 'Sale' },
  { date: '2025-07-09', description: 'Payment Received', amount: '$600', type: 'Receipt' },
];

const dormantCustomers = [
  { name: 'John Doe', balance: '$2,300', lastTx: '5 months 2 days' },
  { name: 'Acme Corp', balance: '$1,800', lastTx: '2 months 10 days' },
  { name: 'Jane Smith', balance: '$950', lastTx: '6 months 1 day' },
  { name: 'Global Inc.', balance: '$3,200', lastTx: '4 months 15 days' },
];

const dormantProducts = [
  { name: 'Product A', qty: 120, lastSold: '5 months' },
  { name: 'Product B', qty: 80, lastSold: '2 months 10 days' },
  { name: 'Product C', qty: 50, lastSold: '6 months 1 day' },
  { name: 'Product D', qty: 200, lastSold: '4 months 15 days' },
];

// --- Final Dashboard Component ---
const Dashboard = () => (
  <main className="p-4 h-full">
    <div className="flex flex-row h-full">
      {/* Left Section: Charts (80%) */}
      <div className="w-full lg:w-4/5 pr-4">
        <FinancialSummary />
        <SectionCharts />
      </div>
      {/* Right Section: Balances List + Info (20%) */}
      <div className="w-1/5 min-w-[220px] flex flex-col gap-4">
        {/* Current Balances */}
        <div className="rounded-2xl shadow-md p-4 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 h-auto flex flex-col justify-center">
          <h2 className="text-base font-bold text-blue-700 dark:text-blue-300 mb-2">Current Balances</h2>
          <ul className="space-y-2">
            {balanceCards.map((item, index) => (
              <li key={index} className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-300">{item.label}</span>
                <span className="font-bold text-blue-700 dark:text-blue-300">
                  {item.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </li>
            ))}
          </ul>
        </div>
        {/* I) Recent Transactions */}
        <div className="rounded-2xl shadow-md p-4 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 h-auto">
          <h2 className="text-base font-bold text-blue-700 dark:text-blue-300 mb-2">Recent Transactions</h2>
          <ul className="space-y-1 text-xs">
            {recentTransactions.map((tx, idx) => (
              <li key={idx} className="flex justify-between border-b last:border-b-0 py-1">
                <span className="text-gray-500 dark:text-gray-300">{tx.date}</span>
                <span className="text-gray-700 dark:text-gray-200">{tx.description}</span>
                <span className="text-blue-700 dark:text-blue-300">{tx.amount}</span>
              </li>
            ))}
          </ul>
        </div>
        {/* II) Dormant Customer List */}
        <div className="rounded-2xl shadow-md p-4 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 h-auto">
          <h2 className="text-base font-bold text-blue-700 dark:text-blue-300 mb-2">Dormant Customers</h2>
          <ul className="space-y-1 text-xs">
            {dormantCustomers.map((c, idx) => (
              <li key={idx} className="flex justify-between items-center border-b last:border-b-0 py-1 animate-moveUp">
                <span className="text-gray-500 dark:text-gray-300">{c.name}</span>
                <span className="text-blue-700 dark:text-blue-300">{c.balance}</span>
                <span className="text-gray-400">{c.lastTx}</span>
              </li>
            ))}
          </ul>
        </div>
        {/* III) Dormant Product List */}
        <div className="rounded-2xl shadow-md p-4 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 h-auto">
          <h2 className="text-base font-bold text-blue-700 dark:text-blue-300 mb-2">Dormant Products</h2>
          <ul className="space-y-1 text-xs">
            {dormantProducts.map((p, idx) => (
              <li key={idx} className="flex justify-between items-center border-b last:border-b-0 py-1 animate-moveUp">
                <span className="text-gray-500 dark:text-gray-300">{p.name}</span>
                <span className="text-blue-700 dark:text-blue-300">{p.qty}</span>
                <span className="text-gray-400">{p.lastSold}</span>
              </li>
            ))}
          </ul>
        </div>
        {/* Animation for moving list effect */}
        <style>
          {`
            @keyframes moveUp {
              0% { transform: translateY(20px); opacity: 0; }
              100% { transform: translateY(0); opacity: 1; }
            }
            .animate-moveUp {
              animation: moveUp 1s ease;
            }
          `}
        </style>
      </div>
    </div>
  </main>
);

export default Dashboard;
