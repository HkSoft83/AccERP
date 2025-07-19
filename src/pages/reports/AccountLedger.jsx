import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const mockTransactions = [
	{ date: '2023-01-01', description: 'Opening Balance', debit: 5000.0, credit: 0, balance: 5000.0 },
	{ date: '2023-01-05', description: 'Sales Revenue', debit: 0, credit: 2000.0, balance: 7000.0 },
	{ date: '2023-01-10', description: 'Office Supplies', debit: 500.0, credit: 0, balance: 6500.0 },
	{ date: '2023-01-15', description: 'Customer Payment', debit: 0, credit: 1000.0, balance: 7500.0 },
	{ date: '2023-01-20', description: 'Utility Bill', debit: 200.0, credit: 0, balance: 7300.0 },
];

const AccountLedger = ({ account, onBack }) => {
        const [showReconcile, setShowReconcile] = useState(false);
        const [endingBalance, setEndingBalance] = useState('');
        const [statementEndingDate, setStatementEndingDate] = useState('');
        const [showReconcilePage, setShowReconcilePage] = useState(false);
        const [selectedTx, setSelectedTx] = useState([]);
        const [startDate, setStartDate] = useState('');
        const [endDate, setEndDate] = useState('');

        // Filter mock transactions for the selected account (for demonstration purposes)
        // In a real application, you would fetch transactions specific to the account.
        const transactions = account
                ? mockTransactions.filter(tx => 
                        (tx.description.includes(account.accName) || tx.description.includes('Balance')) &&
                        (!startDate || new Date(tx.date) >= new Date(startDate)) &&
                        (!endDate || new Date(tx.date) <= new Date(endDate))
                )
                : [];

		// Get beginning balance from first transaction
		const beginningBalance = transactions.length > 0 ? transactions[0].balance : 0;

		// Calculate cleared payments and deposits
		const clearedPayments = transactions
				.filter((tx, idx) => idx !== 0 && selectedTx.includes(idx))
				.reduce((sum, tx) => sum + tx.debit, 0);

		const clearedDeposits = transactions
				.filter((tx, idx) => idx !== 0 && selectedTx.includes(idx))
				.reduce((sum, tx) => sum + tx.credit, 0);

		const clearedBalance = beginningBalance - clearedPayments + clearedDeposits;
		const difference = Number(endingBalance) - clearedBalance;

		if (!account) {
				return <div className="p-4 text-center text-muted-foreground">Select an account to view its ledger.</div>;
		}

		// Reconciliation page UI
		if (showReconcilePage) {
				return (
						<div className="space-y-4 p-2">
								<div className="flex items-center justify-between mb-2">
										<Button variant="outline" onClick={() => setShowReconcilePage(false)}>
												<ArrowLeft className="mr-2 h-4 w-4" /> Back
										</Button>
										<h2 className="text-xl font-bold">Reconcile {account.accName}</h2>
								</div>
								{/* Top Section */}
								<div className="grid grid-cols-8 gap-[2px] mb-2 items-center">
										{/* Up-Left-most Section */}
										<div className="col-span-2 bg-muted/30 dark:bg-dark-muted/30 p-2 rounded h-[90px] min-h-[90px] flex flex-col justify-center border border-blue-500 shadow-md shadow-blue-300/50">
												<h3 className="text-base font-semibold mb-1">Ending Balance</h3>
												<p className="font-bold text-base">
														{Number(endingBalance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
												</p>
										</div>
										{/* Subtract sign */}
										<div className="col-span-1 flex items-center justify-center text-2xl font-bold h-[90px] min-h-[90px]">-</div>
										{/* Up-Middle Section */}
										<div className="col-span-2 bg-muted/30 dark:bg-dark-muted/30 p-2 rounded h-[90px] min-h-[90px] flex flex-col justify-center border border-blue-500 shadow-md shadow-blue-300/50">
											<h3 className="text-base font-semibold mb-1">Cleared Balance</h3>
											<p className="font-bold text-base">
												{clearedBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
											</p>
											<p className="text-xs italic">
												Begin. Balance ({beginningBalance}) - Payments ({clearedPayments}) + Deposits ({clearedDeposits})
											</p>
										</div>
										{/* Equal sign */}
										<div className="col-span-1 flex items-center justify-center text-2xl font-bold h-[90px] min-h-[90px]">=</div>
										{/* Up-Right Section */}
										<div
                                            className="col-span-2 bg-muted/30 dark:bg-dark-muted/30 p-2 rounded h-[90px] min-h-[90px] flex flex-col justify-center border border-blue-500 shadow-md shadow-blue-300/50"
                                            title="There is a difference. Please select transactions to reconcile."
										>
												<h3 className="text-base font-semibold mb-1">Difference</h3>
												<p className="font-bold text-base">
														{difference.toLocaleString('en-US', { minimumFractionDigits: 2 })}
												</p>
												{difference === 0 ? (
														<p className="text-green-600 font-semibold mt-1 text-xs">Account reconciled!</p>
												) : (
														<p className="text-red-600 font-semibold mt-1 text-xs"></p>
												)}
										</div>
								</div>
								{/* Down Section */}
								<div className="bg-card dark:bg-dark-card p-2 rounded shadow-sm">
										<h3 className="text-base font-semibold mb-2">Unreconciled Transactions</h3>
										<table className="w-full min-w-[600px] text-xs text-left text-foreground dark:text-dark-foreground border">
												<thead className="bg-muted/50 dark:bg-dark-muted/50">
														<tr>
																<th className="px-2 py-1">Select</th>
																<th className="px-2 py-1">Date</th>
																<th className="px-2 py-1">Description</th>
																<th className="px-2 py-1 text-right">Debit</th>
																<th className="px-2 py-1 text-right">Credit</th>
																<th className="px-2 py-1 text-right">Balance</th>
														</tr>
												</thead>
												<tbody>
														{transactions.map((tx, idx) =>
																idx === 0 ? null : (
																		<tr key={idx} className="border-b">
																				<td className="px-2 py-1 text-center">
																						<input
																								type="checkbox"
																								checked={selectedTx.includes(idx)}
																								onChange={e => {
																										if (e.target.checked) {
																												setSelectedTx([...selectedTx, idx]);
																										} else {
																												setSelectedTx(selectedTx.filter(i => i !== idx));
																										}
																								}}
																						/>
																				</td>
																				<td className="px-2 py-1">{tx.date}</td>
																				<td className="px-2 py-1">{tx.description}</td>
																				<td className="px-2 py-1 text-right">{tx.debit.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
																				<td className="px-2 py-1 text-right">{tx.credit.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
																				<td className="px-2 py-1 text-right">{tx.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
																		</tr>
																)
														)}
												</tbody>
										</table>
										<Button
												variant="primary"
												className="mt-2"
												disabled={difference !== 0}
												onClick={() => setShowReconcilePage(false)}
										>
												Finish Reconciliation
										</Button>
								</div>
						</div>
				);
		}

		return (
                <div className="space-y-6 p-4">
                        <div className="flex items-center justify-between mb-4">
                                <Button variant="outline" onClick={onBack} className="bg-white text-blue-700 border border-blue-500 hover:bg-blue-50">
                                        <ArrowLeft className="mr-2 h-4 w-4" /> Chart of Accounts
                                </Button>
                                <h2 className="text-2xl font-bold">
                                        Ledger: {account.accName} ({account.accNum})
                                </h2>
                        </div>

                        {/* Ledger Info Section */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 bg-muted/50 dark:bg-dark-muted/50 p-2 rounded-md mb-2 items-center">
                                <div>
                                        <p className="text-sm text-muted-foreground">Account Type:</p>
                                        <p className="font-medium">{account.accType}</p>
                                </div>
                                <div>
                                        <p className="text-sm text-muted-foreground">Account Sub-Type:</p>
                                        <p className="font-medium">{account.accSubtype}</p>
                                </div>
                                <div className="flex items-center justify-between">
                                        <div>
                                                <p className="text-sm text-muted-foreground">Current Balance:</p>
                                                <p className="font-bold text-lg">{account.balanceFormatted}</p>
                                        </div>
                                        <Button
                                                variant="primary"
                                                className="bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold px-5 py-1 rounded shadow hover:from-blue-600 hover:to-blue-800 transition ml-4"
                                                onClick={() => setShowReconcile(true)}
                                        >
                                                Reconcile
                                        </Button>
                                </div>
                        </div>

                        {/* Date Range Selection - UI Enhanced */}
                        <div className="flex flex-wrap gap-2 mb-2 items-center bg-muted/30 dark:bg-dark-muted/30 p-2 rounded shadow-sm">
                                <div className="flex flex-col min-w-[120px]">
                                        <label className="block text-xs text-muted-foreground mb-1">Start Date</label>
                                        <input
                                                type="date"
                                                value={startDate}
                                                onChange={e => setStartDate(e.target.value)}
                                                className="px-2 py-1 border rounded text-xs"
                                        />
                                </div>
                                <div className="flex flex-col min-w-[120px]">
                                        <label className="block text-xs text-muted-foreground mb-1">End Date</label>
                                        <input
                                                type="date"
                                                value={endDate}
                                                onChange={e => setEndDate(e.target.value)}
                                                className="px-2 py-1 border rounded text-xs"
                                        />
                                </div>
                        </div>

                        {/* Reconcile Feature */}
                        {showReconcile ? (
                                <div className="mb-4 p-2 border rounded-md bg-muted/30 dark:bg-dark-muted/30 shadow">
                                        <h3 className="text-lg font-semibold mb-4">Reconcile Account</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                                <div>
                                                        <label className="block text-sm text-muted-foreground mb-1">Account Name</label>
                                                        <input
                                                                type="text"
                                                                value={account.accName}
                                                                disabled
                                                                className="w-full px-3 py-2 border rounded bg-muted/50 dark:bg-dark-muted/50"
                                                        />
                                                </div>
                                                <div>
                                                        <label className="block text-sm text-muted-foreground mb-1">Beginning Balance</label>
                                                        <input
                                                                type="text"
                                                                value={beginningBalance.toLocaleString('en-US', {
                                                                        style: 'decimal',
                                                                        minimumFractionDigits: 2,
                                                                })}
                                                                disabled
                                                                className="w-full px-3 py-2 border rounded bg-muted/50 dark:bg-dark-muted/50"
                                                        />
                                                </div>
                                                <div>
                                                        <label className="block text-sm text-muted-foreground mb-1">Statement Ending Balance</label>
                                                        <input
                                                                type="number"
                                                                value={endingBalance}
                                                                onChange={e => setEndingBalance(e.target.value)}
                                                                placeholder="Enter ending balance"
                                                                className="w-full px-3 py-2 border rounded"
                                                        />
                                                </div>
                                                <div>
                                                        <label className="block text-sm text-muted-foreground mb-1">Statement Ending Date</label>
                                                        <input
                                                                type="date"
                                                                value={statementEndingDate}
                                                                onChange={e => setStatementEndingDate(e.target.value)}
                                                                className="w-full px-3 py-2 border rounded"
                                                        />
                                                </div>
                                        </div>
                                        <Button
                                                variant="primary"
                                                className="bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold px-6 py-2 rounded shadow hover:from-green-600 hover:to-green-800 transition"
                                                onClick={() => {
                                                        setShowReconcile(false);
                                                        setShowReconcilePage(true);
                                                }}
                                        >
                                                Start Reconciliation
                                        </Button>
                                        <Button
                                                variant="outline"
                                                className="ml-2"
                                                onClick={() => {
                                                        setShowReconcile(false);
                                                        setEndingBalance('');
                                                        setStatementEndingDate('');
                                                }}
                                        >
                                                Cancel
                                        </Button>
                                </div>
                        ) : (
                                <>
                                        <div className="mt-2 overflow-x-auto rounded-lg border border-border dark:border-dark-border shadow-md" style={{ minHeight: '70vh', maxHeight: '80vh', overflowY: 'auto' }}>
                                                <h3 className="text-xl font-semibold p-2 bg-card dark:bg-dark-card border-b border-border dark:border-dark-border">
                                                        Transactions
                                                </h3>
                                                <table className="w-full min-w-[700px] text-sm text-left text-foreground dark:text-dark-foreground">
                                                        <thead className="text-xs text-primary dark:text-dark-primary uppercase bg-muted/50 dark:bg-dark-muted/50">
                                                                <tr>
                                                                        <th scope="col" className="px-2 py-1">
                                                                                Date
                                                                        </th>
                                                                        <th scope="col" className="px-2 py-1">
                                                                                Description
                                                                        </th>
                                                                        <th scope="col" className="px-2 py-1">
                                                                                Transaction Type
                                                                        </th>
                                                                        <th scope="col" className="px-2 py-1 text-right">
                                                                                Debit
                                                                        </th>
                                                                        <th scope="col" className="px-2 py-1 text-right">
                                                                                Credit
                                                                        </th>
                                                                        <th scope="col" className="px-2 py-1 text-right">
                                                                                Balance
                                                                        </th>
                                                                </tr>
                                                        </thead>
                                                        <tbody>
                                                                {transactions.length > 0 ? (
                                                                        transactions.map((tx, index) => (
                                                                                <tr
                                                                                        key={index}
                                                                                        className="bg-card dark:bg-dark-card border-b border-border dark:border-dark-border last:border-b-0 hover:bg-muted/30 dark:hover:bg-dark-muted/30 transition-colors duration-150"
                                                                                >
                                                                                        <td className="px-2 py-1">{tx.date}</td>
                                                                                        <td className="px-2 py-1">{tx.description}</td>
                                                                                        <td className="px-2 py-1">
                                                                                                {/* Simple logic for transaction type */}
                                                                                                {tx.debit > 0 && tx.credit === 0
                                                                                                        ? 'Payment'
                                                                                                        : tx.credit > 0 && tx.debit === 0
                                                                                                        ? 'Deposit'
                                                                                                        : 'Other'}
                                                                                        </td>
                                                                                        <td className="px-2 py-1 text-right">
                                                                                                {tx.debit.toLocaleString('en-US', {
                                                                                                        style: 'decimal',
                                                                                                        minimumFractionDigits: 2,
                                                                                                        maximumFractionDigits: 2,
                                                                                                })}
                                                                                        </td>
                                                                                        <td className="px-2 py-1 text-right">
                                                                                                {tx.credit.toLocaleString('en-US', {
                                                                                                        style: 'decimal',
                                                                                                        minimumFractionDigits: 2,
                                                                                                        maximumFractionDigits: 2,
                                                                                                })}
                                                                                        </td>
                                                                                        <td className="px-2 py-1 text-right font-semibold">
                                                                                                {tx.balance.toLocaleString('en-US', {
                                                                                                        style: 'decimal',
                                                                                                        minimumFractionDigits: 2,
                                                                                                        maximumFractionDigits: 2,
                                                                                                })}
                                                                                        </td>
                                                                                </tr>
                                                                        ))
                                                                ) : (
                                                                        <tr>
                                                                                <td colSpan="6" className="text-center py-4 text-muted-foreground">
                                                                                        No transactions found for this account.
                                                                                </td>
                                                                        </tr>
                                                                )}
                                                        </tbody>
                                                </table>
                                        </div>
                                </>
                        )}
                </div>
		);
};

export default AccountLedger;
