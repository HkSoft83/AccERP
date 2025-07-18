import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const mockTransactions = [
  { date: '2023-01-01', description: 'Opening Balance', debit: 5000.00, credit: 0, balance: 5000.00 },
  { date: '2023-01-05', description: 'Sales Revenue', debit: 0, credit: 2000.00, balance: 7000.00 },
  { date: '2023-01-10', description: 'Office Supplies', debit: 500.00, credit: 0, balance: 6500.00 },
  { date: '2023-01-15', description: 'Customer Payment', debit: 0, credit: 1000.00, balance: 7500.00 },
  { date: '2023-01-20', description: 'Utility Bill', debit: 200.00, credit: 0, balance: 7300.00 },
];

const AccountLedger = ({ account, onBack }) => {
  if (!account) {
    return <div className="p-4 text-center text-muted-foreground">Select an account to view its ledger.</div>;
  }

  // Filter mock transactions for the selected account (for demonstration purposes)
  // In a real application, you would fetch transactions specific to the account. 
  const transactions = mockTransactions.filter(tx => tx.description.includes(account.accName) || tx.description.includes('Balance'));

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Chart of Accounts
        </Button>
        <h2 className="text-2xl font-bold">Ledger for {account.accName} ({account.accNum})</h2>
        <div></div> {/* Spacer to balance header */}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-muted/50 dark:bg-dark-muted/50 p-4 rounded-md">
        <div>
          <p className="text-sm text-muted-foreground">Account Type:</p>
          <p className="font-medium">{account.accType}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Account Sub-Type:</p>
          <p className="font-medium">{account.accSubtype}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Current Balance:</p>
          <p className="font-bold text-lg">{account.balanceFormatted}</p>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto rounded-lg border border-border dark:border-dark-border shadow-md">
        <h3 className="text-xl font-semibold p-4 bg-card dark:bg-dark-card border-b border-border dark:border-dark-border">Transactions</h3>
        <table className="w-full min-w-[600px] text-sm text-left text-foreground dark:text-dark-foreground">
          <thead className="text-xs text-primary dark:text-dark-primary uppercase bg-muted/50 dark:bg-dark-muted/50">
            <tr>
              <th scope="col" className="px-4 py-2">Date</th>
              <th scope="col" className="px-4 py-2">Description</th>
              <th scope="col" className="px-4 py-2 text-right">Debit</th>
              <th scope="col" className="px-4 py-2 text-right">Credit</th>
              <th scope="col" className="px-4 py-2 text-right">Balance</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((tx, index) => (
                <tr key={index} className="bg-card dark:bg-dark-card border-b border-border dark:border-dark-border last:border-b-0 hover:bg-muted/30 dark:hover:bg-dark-muted/30 transition-colors duration-150">
                  <td className="px-4 py-2">{tx.date}</td>
                  <td className="px-4 py-2">{tx.description}</td>
                  <td className="px-4 py-2 text-right">{tx.debit.toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="px-4 py-2 text-right">{tx.credit.toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="px-4 py-2 text-right font-semibold">{tx.balance.toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-muted-foreground">No transactions found for this account.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccountLedger;
