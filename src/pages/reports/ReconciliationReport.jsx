import React from 'react';
import { Button } from '@/components/ui/button';

const ReconciliationReport = ({ result, onBack }) => {
    if (!result) {
        return null;
    }

    const {
        accountName,
        statementEndingDate,
        endingBalance,
        clearedBalance,
        clearedPayments,
        clearedDeposits,
        beginningBalance,
        reconciledTransactions,
    } = result;

    const difference = endingBalance - clearedBalance;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4 print:hidden">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Reconciliation Report</h2>
                <div>
                    <Button onClick={onBack} variant="outline" className="mr-2">Back</Button>
                    <Button onClick={handlePrint} variant="outline">Print</Button>
                </div>
            </div>
            
            <div className="text-center mb-4 hidden print:block">
                 <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Reconciliation Report</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Account</p>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">{accountName}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Statement Ending Date</p>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">{statementEndingDate}</p>
                </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Summary</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <p>Beginning Balance</p>
                    <p className="text-right">{beginningBalance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                    
                    <p>Cleared Deposits and Other Credits</p>
                    <p className="text-right">{clearedDeposits.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>

                    <p>Cleared Payments and Other Debits</p>
                    <p className="text-right">{clearedPayments.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>

                    <p className="font-bold">Cleared Balance</p>
                    <p className="text-right font-bold">{clearedBalance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>

                    <p>Statement Ending Balance</p>
                    <p className="text-right">{endingBalance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>

                    <p className="font-bold text-lg">Difference</p>
                    <p className={`text-right font-bold text-lg ${difference === 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {difference.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </p>
                </div>
            </div>

            <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Cleared Transactions</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Date</th>
                                <th scope="col" className="px-6 py-3">Description</th>
                                <th scope="col" className="px-6 py-3 text-right">Debit</th>
                                <th scope="col" className="px-6 py-3 text-right">Credit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reconciledTransactions.map((tx, index) => (
                                <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <td className="px-6 py-4">{tx.date}</td>
                                    <td className="px-6 py-4">{tx.description}</td>
                                    <td className="px-6 py-4 text-right">{tx.debit > 0 ? tx.debit.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : ''}</td>
                                    <td className="px-6 py-4 text-right">{tx.credit > 0 ? tx.credit.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : ''}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ReconciliationReport;
