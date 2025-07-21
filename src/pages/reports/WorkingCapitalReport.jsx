import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx";
import mockAccounts from '@/data/mockAccounts';

const WorkingCapitalReport = () => {
  const calculateWorkingCapital = () => {
    let totalCurrentAssets = 0;
    let totalCurrentLiabilities = 0;

    const currentAssets = [];
    const currentLiabilities = [];

    mockAccounts.forEach(account => {
      // Simplified classification for current assets and liabilities
      // In a real scenario, this would be more detailed based on account categories and sub-types
      if (['Cash', 'Bank', 'Receivable'].includes(account.category) || (account.type === 'Asset' && !['Fixed Asset', 'Contra Asset'].includes(account.category))) {
        totalCurrentAssets += account.balance;
        currentAssets.push(account);
      } else if (['Payable'].includes(account.category) || (account.type === 'Liability' && !['Long-Term Liability'].includes(account.category))) {
        totalCurrentLiabilities += account.balance;
        currentLiabilities.push(account);
      }
    });

    const workingCapital = totalCurrentAssets - totalCurrentLiabilities;

    return {
      currentAssets,
      currentLiabilities,
      totalCurrentAssets,
      totalCurrentLiabilities,
      workingCapital,
    };
  };

  const reportData = calculateWorkingCapital();

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="bg-ecb-primary rounded-t-lg text-center">
          <CardTitle className="text-2xl font-bold text-ecb-primary-foreground">[Your Enterprise Name]</CardTitle>
          <CardTitle className="text-xl font-bold text-ecb-primary-foreground">Working Capital Report</CardTitle>
          <CardTitle className="text-lg font-bold text-ecb-primary-foreground">As of {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-ecb-textDark mb-2">Current Assets</h3>
          <Table className="mb-4">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[70%]">Account Name</TableHead>
                <TableHead className="text-right w-[30%]">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportData.currentAssets.map((account) => (
                <TableRow key={account.id}>
                  <TableCell className="w-[70%]">{account.name}</TableCell>
                  <TableCell className="text-right w-[30%]">{account.balance.toFixed(2)}</TableCell>
                </TableRow>
              ))}
              <TableRow className="font-bold bg-gray-100">
                <TableCell>Total Current Assets</TableCell>
                <TableCell className="text-right">{reportData.totalCurrentAssets.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <h3 className="text-lg font-semibold text-ecb-textDark mb-2 mt-6">Current Liabilities</h3>
          <Table className="mb-4">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[70%]">Account Name</TableHead>
                <TableHead className="text-right w-[30%]">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportData.currentLiabilities.map((account) => (
                <TableRow key={account.id}>
                  <TableCell className="w-[70%]">{account.name}</TableCell>
                  <TableCell className="text-right w-[30%]">{account.balance.toFixed(2)}</TableCell>
                </TableRow>
              ))}
              <TableRow className="font-bold bg-gray-100">
                <TableCell>Total Current Liabilities</TableCell>
                <TableCell className="text-right">{reportData.totalCurrentLiabilities.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <div className="flex justify-between items-center p-3 bg-blue-50 rounded border-t-2 border-blue-200 mt-6">
            <span className="text-lg font-semibold text-ecb-textDark">Working Capital</span>
            <span className="text-lg font-bold text-blue-600">{reportData.workingCapital.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkingCapitalReport;
