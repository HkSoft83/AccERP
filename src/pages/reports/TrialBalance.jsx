import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx";
import mockAccounts from '@/data/mockAccounts';

const TrialBalance = () => {
  const calculateTrialBalance = () => {
    const trialBalanceData = {};

    mockAccounts.forEach(account => {
      const { name, type, balance } = account;
      let debit = 0;
      let credit = 0;

      // Determine if the balance is a debit or credit based on account type
      if (['Asset', 'Expense'].includes(type)) {
        debit = balance >= 0 ? balance : 0;
        credit = balance < 0 ? Math.abs(balance) : 0;
      } else if (['Liability', 'Equity', 'Income'].includes(type)) {
        credit = balance >= 0 ? balance : 0;
        debit = balance < 0 ? Math.abs(balance) : 0;
      } else if (type === 'Contra Asset') { // e.g., Accumulated Depreciation
        credit = balance >= 0 ? balance : 0;
        debit = balance < 0 ? Math.abs(balance) : 0;
      } else if (type === 'Contra Income') { // e.g., Sales Returns & Allowances
        debit = balance >= 0 ? balance : 0;
        credit = balance < 0 ? Math.abs(balance) : 0;
      } else if (type === 'Contra Expense') { // e.g., Purchase Discounts
        credit = balance >= 0 ? balance : 0;
        debit = balance < 0 ? Math.abs(balance) : 0;
      }

      trialBalanceData[name] = {
        name,
        type,
        debit: (trialBalanceData[name]?.debit || 0) + debit,
        credit: (trialBalanceData[name]?.credit || 0) + credit,
      };
    });

    return Object.values(trialBalanceData);
  };

  const trialBalanceAccounts = calculateTrialBalance();

  const totalDebit = trialBalanceAccounts.reduce((sum, account) => sum + account.debit, 0);
  const totalCredit = trialBalanceAccounts.reduce((sum, account) => sum + account.credit, 0);

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="bg-ecb-primary rounded-t-lg text-center">
          <CardTitle className="text-2xl font-bold text-ecb-primary-foreground">[Your Enterprise Name]</CardTitle>
          <CardTitle className="text-xl font-bold text-ecb-primary-foreground">Trial Balance</CardTitle>
          <CardTitle className="text-lg font-bold text-ecb-primary-foreground">As of {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Account Name</TableHead>
                <TableHead className="w-[20%]">Account Type</TableHead>
                <TableHead className="text-right w-[20%]">Debit</TableHead>
                <TableHead className="text-right w-[20%]">Credit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trialBalanceAccounts.map((account) => (
                <TableRow key={account.name}>
                  <TableCell className="font-medium">{account.name}</TableCell>
                  <TableCell>{account.type}</TableCell>
                  <TableCell className="text-right">{account.debit.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{account.credit.toFixed(2)}</TableCell>
                </TableRow>
              ))}
              <TableRow className="font-bold bg-gray-100">
                <TableCell colSpan={2}>Total</TableCell>
                <TableCell className="text-right">{totalDebit.toFixed(2)}</TableCell>
                <TableCell className="text-right">{totalCredit.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          {totalDebit !== totalCredit && (
            <p className="text-red-500 mt-4">
              Warning: Debits and Credits do not balance! Difference: {(totalDebit - totalCredit).toFixed(2)}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TrialBalance;