import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const OtherReports = () => {
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
                  <li key={index} className="text-ecb-textDark dark:text-ecb-textLight text-sm">
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
