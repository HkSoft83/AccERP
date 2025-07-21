import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table.jsx";

const FinancialRatioReport = () => {
  const financialRatios = {
    "📈 Liquidity Ratios:": [
      "Current Ratio: Current Assets / Current Liabilities",
      "Quick Ratio (Acid-Test Ratio): (Current Assets - Inventory) / Current Liabilities",
      "Cash Ratio: Cash and Cash Equivalents / Current Liabilities",
    ],
    "📊 Solvency Ratios:": [
      "Debt-to-Equity Ratio: Total Debt / Shareholder's Equity",
      "Debt-to-Asset Ratio: Total Debt / Total Assets",
      "Interest Coverage Ratio: EBIT / Interest Expense",
    ],
    "🚀 Profitability Ratios:": [
      "Gross Profit Margin: (Revenue - Cost of Goods Sold) / Revenue",
      "Net Profit Margin: Net Income / Revenue",
      "Return on Assets (ROA): Net Income / Total Assets",
      "Return on Equity (ROE): Net Income / Shareholder's Equity",
    ],
    "🔄 Efficiency Ratios:": [
      "Inventory Turnover: Cost of Goods Sold / Average Inventory",
      "Accounts Receivable Turnover: Net Credit Sales / Average Accounts Receivable",
      "Accounts Payable Turnover: Purchases / Average Accounts Payable",
      "Asset Turnover: Net Sales / Average Total Assets",
    ],
    "💰 Market Value Ratios:": [
      "Earnings Per Share (EPS): (Net Income - Preferred Dividends) / Average Outstanding Shares",
      "Price-to-Earnings (P/E) Ratio: Share Price / Earnings Per Share",
      "Dividend Yield: Annual Dividends Per Share / Share Price",
    ],
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="bg-ecb-primary rounded-t-lg text-center">
          <CardTitle className="text-2xl font-bold text-ecb-primary-foreground">[Your Enterprise Name]</CardTitle>
          <CardTitle className="text-xl font-bold text-ecb-primary-foreground">Financial Ratio Report</CardTitle>
          <CardTitle className="text-lg font-bold text-ecb-primary-foreground">As of {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {Object.entries(financialRatios).map(([category, ratios]) => (
            <div key={category} className="mb-6">
              <h3 className="text-lg font-semibold text-ecb-textDark mb-3">{category}</h3>
              <Table className="mb-4">
                <TableBody>
                  {ratios.map((ratio, index) => (
                    <TableRow key={index}>
                      <TableCell className="w-full text-ecb-textDark">{ratio}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ))}
          <p className="text-ecb-textDark mt-4 text-sm">
            *Note: This report provides definitions of key financial ratios. Actual calculation requires comprehensive financial data.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialRatioReport;
