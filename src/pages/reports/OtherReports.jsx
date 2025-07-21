import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WorkingCapitalReport from './WorkingCapitalReport';
import FinancialRatioReport from './FinancialRatioReport';
import { Button } from '@/components/ui/button';

const OtherReports = () => {
  const [selectedReport, setSelectedReport] = useState(null);

  const reports = {
    "📈 Management/Analytical Reports:": [
      "Working Capital Report",
      "Financial Ratio Report",
      "Expense Analysis",
      "Revenue Trends",
      "Budget vs Actual",
    ],
    "📑 Accounting Operations Reports:": [
      "Journal Report",
      "Day Book / Transaction Report",
      "Voucher Report",
      "Account Statement",
      "Bank Reconciliation Report",
    ],
    "👥 Customer & Vendor Reports:": [
      "Accounts Receivable (A/R) Aging",
      "Accounts Payable (A/P) Aging",
      "Customer Statement",
      "Vendor Statement",
      "Dormant Customers/Vendors",
    ],
    "📦 Inventory Reports:": [
      "Stock Summary",
      "Inventory Valuation",
      "Fast & Slow Moving Items",
      "Stock Aging Report",
    ],
    "🧾 Tax & Compliance Reports:": [
      "VAT Report",
      "TDS Report",
      "Income Tax Projection",
    ],
  };

  const handleReportClick = (reportName) => {
    setSelectedReport(reportName);
  };

  const handleBackClick = () => {
    setSelectedReport(null);
  };

  if (selectedReport === "Working Capital Report") {
    return (
      <div className="space-y-6">
        <Button onClick={handleBackClick} className="mb-4 bg-ecb-primary text-ecb-primary-foreground hover:bg-ecb-primary/90">
          ← Back to Other Reports
        </Button>
        <WorkingCapitalReport />
      </div>
    );
  } else if (selectedReport === "Financial Ratio Report") {
    return (
      <div className="space-y-6">
        <Button onClick={handleBackClick} className="mb-4 bg-ecb-primary text-ecb-primary-foreground hover:bg-ecb-primary/90">
          ← Back to Other Reports
        </Button>
        <FinancialRatioReport />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(reports).map(([category, items]) => (
          <Card key={category} className="shadow-lg">
            <CardHeader className="bg-gray-100 dark:bg-gray-700 rounded-t-lg p-4">
              <CardTitle className="text-lg font-semibold text-ecb-textDark dark:text-ecb-textLight">{category}</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <ul className="space-y-2">
                {items.map((item, index) => (
                  <li
                    key={index}
                    className="text-ecb-textDark dark:text-ecb-textLight text-sm cursor-pointer hover:text-ecb-primary dark:hover:text-ecb-primary-foreground transition-colors"
                    onClick={() => handleReportClick(item)}
                  >
                    <span className="mr-2 text-ecb-primary dark:text-ecb-primary-foreground">•</span>{item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OtherReports;
