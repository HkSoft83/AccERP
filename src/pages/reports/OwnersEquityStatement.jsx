import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx";
import mockAccounts from '@/data/mockAccounts';

const OwnersEquityStatement = () => {
  const calculateOwnersEquity = () => {
    let ownersCapital = 0;
    let ownersDrawings = 0;
    let totalIncome = 0;
    let totalExpenses = 0;

    mockAccounts.forEach(account => {
      if (account.name === "Owner's Capital") {
        ownersCapital = account.balance;
      } else if (account.name === "Owner's Drawings") {
        ownersDrawings = account.balance;
      } else if (account.type === "Income") {
        totalIncome += account.balance;
      } else if (account.type === "Expense") {
        totalExpenses += account.balance;
      }
    });

    const netIncome = totalIncome - totalExpenses;
    // For demonstration, assuming current Owner's Capital is the ending balance.
    // Beginning Capital = Ending Capital - Net Income + Drawings
    const beginningOwnersCapital = ownersCapital - netIncome + ownersDrawings;

    return {
      beginningOwnersCapital,
      netIncome,
      ownersDrawings,
      endingOwnersCapital: ownersCapital,
    };
  };

  const equityData = calculateOwnersEquity();

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="bg-ecb-primary rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-ecb-primary-foreground text-center">[Your Enterprise Name]</CardTitle>
          <CardTitle className="text-xl font-bold text-ecb-primary-foreground text-center">Statement of Owner's Equity</CardTitle>
          <CardTitle className="text-lg font-bold text-ecb-primary-foreground text-center">For the Year Ended December 31, 2024</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[70%]">Description</TableHead>
                <TableHead className="text-right w-[30%]">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Owner's Capital, Beginning</TableCell>
                <TableCell className="text-right">{equityData.beginningOwnersCapital.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Add: Net Income</TableCell>
                <TableCell className="text-right">{equityData.netIncome.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Less: Owner's Drawings</TableCell>
                <TableCell className="text-right">({equityData.ownersDrawings.toFixed(2)})</TableCell>
              </TableRow>
              <TableRow className="font-bold bg-gray-100">
                <TableCell>Owner's Capital, Ending</TableCell>
                <TableCell className="text-right">{equityData.endingOwnersCapital.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <p className="text-ecb-textDark mt-4 text-sm">
            *Note: Beginning Owner's Capital is derived for demonstration purposes based on current mock data.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OwnersEquityStatement;