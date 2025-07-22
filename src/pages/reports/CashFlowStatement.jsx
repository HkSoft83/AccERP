import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx";
import mockAccounts from '@/data/mockAccounts';

const CashFlowStatement = () => {
  const calculateCashFlow = () => {
    // --- Operating Activities (Simplified) ---
    // This is a highly simplified approach as a true cash flow statement requires transactional data.
    // We'll use changes in current assets and liabilities, and net income from mock data.

    let netIncome = 0;
    let cashFromOperations = 0;

    // Calculate Net Income (from Income and Expense accounts)
    mockAccounts.forEach(account => {
      if (account.type === 'Income') {
        netIncome += account.balance;
      } else if (account.type === 'Expense') {
        netIncome -= account.balance;
      }
    });

    // For simplification, let's assume some changes in current assets/liabilities
    // This part is highly speculative without actual period-over-period data.
    // Example: Increase in Accounts Receivable (Asset) decreases cash
    // Example: Increase in Accounts Payable (Liability) increases cash
    // For mock data, we'll just use net income as the primary operating cash flow.
    cashFromOperations = netIncome; // Very simplified direct method proxy

    // --- Investing Activities (Simplified) ---
    let cashFromInvesting = 0;
    // Assuming positive balance means acquisition (cash outflow), negative means sale (cash inflow)
    // This is a simplification as we only have current balances.
    mockAccounts.forEach(account => {
      if (account.category === 'Fixed Asset') {
        // Assuming an increase in fixed assets means cash outflow for purchase
        // and a decrease means cash inflow from sale.
        // For mock data, we'll just use the current balance as a proxy for investment.
        // This is not accurate for a real CFS, but demonstrates the category.
        cashFromInvesting -= account.balance; // Treat as outflow for simplicity
      } else if (account.category === 'Contra Asset' && account.name.includes('Depreciation')) {
        // Accumulated Depreciation increases net income, so it's added back
        cashFromInvesting += Math.abs(account.balance); // Add back depreciation
      }
    });


    // --- Financing Activities (Simplified) ---
    let cashFromFinancing = 0;
    // Changes in long-term debt and equity
    mockAccounts.forEach(account => {
      if (account.type === 'Liability' && account.category === 'Payable' && account.name.includes('Loan')) {
        // Assuming increase in loans is inflow, decrease is outflow
        cashFromFinancing += account.balance; // Treat as inflow for simplicity
      } else if (account.type === 'Equity' && account.name === 'Owner,s Capital') {
        cashFromFinancing += account.balance; // Owner contributions
      } else if (account.type === 'Equity' && account.name === 'Owner,s Drawings') {
        cashFromFinancing -= account.balance; // Owner withdrawals
      }
    });

    // Net Increase/Decrease in Cash
    const netChangeInCash = cashFromOperations + cashFromInvesting + cashFromFinancing;

    // Beginning Cash Balance (from Cash accounts)
    let beginningCashBalance = 0;
    mockAccounts.forEach(account => {
      if (account.category === 'Cash' || account.category === 'Bank') {
        beginningCashBalance += account.balance; // Using current balance as proxy for beginning
      }
    });

    const endingCashBalance = beginningCashBalance + netChangeInCash;


    return {
      netIncome,
      cashFromOperations,
      cashFromInvesting,
      cashFromFinancing,
      netChangeInCash,
      beginningCashBalance,
      endingCashBalance,
    };
  };

  const cashFlowData = calculateCashFlow();

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="bg-ecb-primary rounded-t-lg text-center">
          <CardTitle className="text-2xl font-bold text-ecb-primary-foreground">[Your Enterprise Name]</CardTitle>
          <CardTitle className="text-xl font-bold text-ecb-primary-foreground">Cash Flow Statement</CardTitle>
          <CardTitle className="text-lg font-bold text-ecb-primary-foreground">For the Period Ended {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-ecb-textDark mb-2">Cash Flow from Operating Activities</h3>
          <Table className="mb-4">
            <TableBody>
              <TableRow>
                <TableCell className="w-[70%]">Net Income</TableCell>
                <TableCell className="text-right w-[30%]">{cashFlowData.netIncome.toFixed(2)}</TableCell>
              </TableRow>
              {/* Add adjustments for non-cash items and changes in working capital here */}
              <TableRow className="font-bold bg-gray-100">
                <TableCell>Net Cash from Operating Activities</TableCell>
                <TableCell className="text-right">{cashFlowData.cashFromOperations.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <h3 className="text-lg font-semibold text-ecb-textDark mb-2 mt-6">Cash Flow from Investing Activities</h3>
          <Table className="mb-4">
            <TableBody>
              <TableRow key="fixed-assets-purchase">
                <TableCell className="w-[70%]">Purchase of Fixed Assets</TableCell>
                <TableCell className="text-right w-[30%]">{cashFlowData.cashFromInvesting < 0 ? `(${Math.abs(cashFlowData.cashFromInvesting).toFixed(2)})` : cashFlowData.cashFromInvesting.toFixed(2)}</TableCell>
              </TableRow>
              {/* Add other investing activities here */}
              <TableRow className="font-bold bg-gray-100">
                <TableCell>Net Cash from Investing Activities</TableCell>
                <TableCell className="text-right">{cashFlowData.cashFromInvesting.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <h3 className="text-lg font-semibold text-ecb-textDark mb-2 mt-6">Cash Flow from Financing Activities</h3>
          <Table className="mb-4">
            <TableBody>
              <TableRow key="proceeds-from-loans">
                <TableCell className="w-[70%]">Proceeds from Loans</TableCell>
                <TableCell className="text-right w-[30%]">{cashFlowData.cashFromFinancing.toFixed(2)}</TableCell>
              </TableRow>
              {/* Add other financing activities here */}
              <TableRow className="font-bold bg-gray-100">
                <TableCell>Net Cash from Financing Activities</TableCell>
                <TableCell className="text-right">{cashFlowData.cashFromFinancing.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <div className="flex justify-between items-center p-3 bg-blue-50 rounded border-t-2 border-blue-200 mt-6">
            <span className="text-lg font-semibold text-ecb-textDark">Net Increase (Decrease) in Cash</span>
            <span className="text-lg font-bold text-blue-600">{cashFlowData.netChangeInCash.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-blue-50 rounded border-t-2 border-blue-200 mt-2">
            <span className="text-lg font-semibold text-ecb-textDark">Beginning Cash Balance</span>
            <span className="text-lg font-bold text-blue-600">{cashFlowData.beginningCashBalance.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-blue-50 rounded border-t-2 border-blue-200 mt-2">
            <span className="text-lg font-semibold text-ecb-textDark">Ending Cash Balance</span>
            <span className="text-lg font-bold text-blue-600">{cashFlowData.endingCashBalance.toFixed(2)}</span>
          </div>

          <p className="text-ecb-textDark mt-4 text-sm">
            *Note: This Cash Flow Statement is highly simplified and based on current balances in mockAccounts.js.
            A true Cash Flow Statement requires detailed transactional data over a period.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CashFlowStatement;
