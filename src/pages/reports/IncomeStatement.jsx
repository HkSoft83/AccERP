import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx";
import mockAccounts from '@/data/mockAccounts';

const IncomeStatement = () => {
  const calculateIncomeStatement = () => {
    let totalRevenue = 0;
    let totalExpenses = 0;

    const revenueAccounts = mockAccounts.filter(account => account.type === 'Income');
    const expenseAccounts = mockAccounts.filter(account => account.type === 'Expense');

    revenueAccounts.forEach(account => {
      totalRevenue += account.balance;
    });

    expenseAccounts.forEach(account => {
      totalExpenses += account.balance;
    });

    const netIncome = totalRevenue - totalExpenses;

    return {
      revenueAccounts,
      expenseAccounts,
      totalRevenue,
      totalExpenses,
      netIncome,
    };
  };

  const incomeStatementData = calculateIncomeStatement();

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="bg-ecb-primary rounded-t-lg text-center">
          <CardTitle className="text-2xl font-bold text-ecb-primary-foreground">[Your Enterprise Name]</CardTitle>
          <CardTitle className="text-xl font-bold text-ecb-primary-foreground">Income Statement</CardTitle>
          <CardTitle className="text-lg font-bold text-ecb-primary-foreground">For the Period Ended {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-ecb-textDark mb-2">Revenue</h3>
          <Table className="mb-4">
            <TableBody>
              {incomeStatementData.revenueAccounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell className="w-[70%]">{account.name}</TableCell>
                  <TableCell className="text-right w-[30%]">{account.balance.toFixed(2)}</TableCell>
                </TableRow>
              ))}
              <TableRow className="font-bold bg-gray-100">
                <TableCell>Total Revenue</TableCell>
                <TableCell className="text-right">{incomeStatementData.totalRevenue.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <h3 className="text-lg font-semibold text-ecb-textDark mb-2 mt-6">Expenses</h3>
          <Table className="mb-4">
            <TableBody>
              {incomeStatementData.expenseAccounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell className="w-[70%]">{account.name}</TableCell>
                  <TableCell className="text-right w-[30%]">{account.balance.toFixed(2)}</TableCell>
                </TableRow>
              ))}
              <TableRow className="font-bold bg-gray-100">
                <TableCell>Total Expenses</TableCell>
                <TableCell className="text-right">{incomeStatementData.totalExpenses.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <div className="flex justify-between items-center p-3 bg-blue-50 rounded border-t-2 border-blue-200 mt-6">
            <span className="text-lg font-semibold text-ecb-textDark">Net Income</span>
            <span className="text-lg font-bold text-blue-600">{incomeStatementData.netIncome.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IncomeStatement; 