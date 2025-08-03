import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table.jsx";
import { Button } from '@/components/ui/button'; // Assuming you have a Button component
import { ChevronDown, ChevronRight } from 'lucide-react';
import mockAccounts from '@/data/mockAccounts';

const formatCurrency = (value) => value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

const CollapsibleSection = ({ title, accounts, totalLabel, totalAmount, isInitiallyOpen = true }) => {
  const [isOpen, setIsOpen] = useState(isInitiallyOpen);

  return (
    <>
      <TableRow className="bg-gray-100 hover:bg-gray-200">
        <TableCell className="font-bold w-[70%]">
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="mr-2">
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            {title}
          </Button>
        </TableCell>
        <TableCell className="text-right font-bold w-[30%]"></TableCell>
      </TableRow>
      {isOpen && accounts.map(account => (
        <TableRow key={account.id}>
          <TableCell className="pl-12 w-[70%] text-gray-700">{account.name}</TableCell>
          <TableCell className="text-right w-[30%]">{formatCurrency(account.balance)}</TableCell>
        </TableRow>
      ))}
      <TableRow className="bg-gray-100 hover:bg-gray-200">
        <TableCell className="font-bold pl-12 w-[70%]">{totalLabel}</TableCell>
        <TableCell className="text-right font-bold w-[30%]">{formatCurrency(totalAmount)}</TableCell>
      </TableRow>
    </>
  );
};

const IncomeStatement = () => {
  const calculateIncomeStatement = () => {
    const revenues = mockAccounts.filter(a => a.type === 'Income' && a.category === 'Income');
    const contraRevenues = mockAccounts.filter(a => a.category === 'Contra Income');
    const cogs = mockAccounts.filter(a => a.category === 'COGS');
    const operatingExpenses = mockAccounts.filter(a => a.type === 'Expense' && a.category === 'Expense');
    const otherIncome = mockAccounts.filter(a => a.name === 'Interest Income');
    const otherExpenses = mockAccounts.filter(a => a.name === 'Bank Charges');

    const totalRevenue = revenues.reduce((sum, acc) => sum + acc.balance, 0);
    const totalContraRevenue = contraRevenues.reduce((sum, acc) => sum + acc.balance, 0);
    const netSales = totalRevenue + totalContraRevenue;

    const totalCogs = cogs.reduce((sum, acc) => sum + acc.balance, 0);
    const grossProfit = netSales - totalCogs;

    const totalOperatingExpenses = operatingExpenses.reduce((sum, acc) => sum + acc.balance, 0);
    const operatingIncome = grossProfit - totalOperatingExpenses;

    const totalOtherIncome = otherIncome.reduce((sum, acc) => sum + acc.balance, 0);
    const totalOtherExpenses = otherExpenses.reduce((sum, acc) => sum + acc.balance, 0);
    
    const netIncome = operatingIncome + totalOtherIncome - totalOtherExpenses;

    return {
      revenues,
      contraRevenues,
      totalRevenue,
      cogs,
      totalCogs,
      grossProfit,
      operatingExpenses,
      totalOperatingExpenses,
      operatingIncome,
      otherIncome,
      totalOtherIncome,
      otherExpenses,
      totalOtherExpenses,
      netIncome,
    };
  };

  const data = calculateIncomeStatement();

  return (
    <div className="p-4 md:p-8 bg-gray-50">
      <Card className="shadow-lg">
        <CardHeader className="text-center bg-white border-b p-4">
          <CardTitle className="text-2xl font-bold">[Your Enterprise Name]</CardTitle>
          <p className="text-lg">Income Statement</p>
          <p className="text-sm text-gray-500">As of {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableBody>
              <CollapsibleSection 
                title="Revenue"
                accounts={data.revenues}
                totalLabel="Total Revenue"
                totalAmount={data.totalRevenue}
              />
              <CollapsibleSection 
                title="Cost of Goods Sold"
                accounts={data.cogs}
                totalLabel="Total COGS"
                totalAmount={data.totalCogs}
              />
              <TableRow className="bg-white">
                <TableCell className="font-bold text-lg pl-4">Gross Profit</TableCell>
                <TableCell className="text-right font-bold text-lg">{formatCurrency(data.grossProfit)}</TableCell>
              </TableRow>
              <CollapsibleSection 
                title="Expenses"
                accounts={data.operatingExpenses}
                totalLabel="Total Expenses"
                totalAmount={data.totalOperatingExpenses}
              />
              <TableRow className="bg-white">
                <TableCell className="font-bold text-lg pl-4">Net Operating Income</TableCell>
                <TableCell className="text-right font-bold text-lg">{formatCurrency(data.operatingIncome)}</TableCell>
              </TableRow>
              
              {/* Other Income and Expenses */}
              <TableRow>
                  <TableCell className="pl-12 pt-4">Other Income</TableCell>
                  <TableCell></TableCell>
              </TableRow>
              {data.otherIncome.map(acc => (
                  <TableRow key={acc.id}>
                      <TableCell className="pl-16 text-gray-700">{acc.name}</TableCell>
                      <TableCell className="text-right">{formatCurrency(acc.balance)}</TableCell>
                  </TableRow>
              ))}
              <TableRow>
                  <TableCell className="pl-16 font-bold">Total Other Income</TableCell>
                  <TableCell className="text-right font-bold">{formatCurrency(data.totalOtherIncome)}</TableCell>
              </TableRow>

              <TableRow>
                  <TableCell className="pl-12 pt-4">Other Expenses</TableCell>
                  <TableCell></TableCell>
              </TableRow>
              {data.otherExpenses.map(acc => (
                  <TableRow key={acc.id}>
                      <TableCell className="pl-16 text-gray-700">{acc.name}</TableCell>
                      <TableCell className="text-right">{`(${formatCurrency(acc.balance)})`}</TableCell>
                  </TableRow>
              ))}
               <TableRow>
                  <TableCell className="pl-16 font-bold">Total Other Expenses</TableCell>
                  <TableCell className="text-right font-bold">{`(${formatCurrency(data.totalOtherExpenses)})`}</TableCell>
              </TableRow>

              <TableRow className="bg-gray-200">
                <TableCell className="font-extrabold text-xl pl-4">Net Income</TableCell>
                <TableCell className="text-right font-extrabold text-xl">{formatCurrency(data.netIncome)}</TableCell>
              </TableRow>

            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default IncomeStatement;
 