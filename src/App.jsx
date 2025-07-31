import React, { Suspense, lazy, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';
import { ThemeProvider } from '@/contexts/ThemeContext';

// Lazy loaded components
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const ChartOfAccounts = lazy(() => import('@/pages/ChartOfAccounts'));
const ProductsServices = lazy(() => import('@/pages/ProductsServices'));
const Vendor = lazy(() => import('@/pages/Vendor'));
const CustomerCenter = lazy(() => import('@/pages/CustomerCenter'));
const SalesInvoice = lazy(() => import('@/pages/sales/SalesInvoice'));
const SalesReturn = lazy(() => import('@/pages/sales/SalesReturn'));
const SalesOrder = lazy(() => import('@/pages/sales/SalesOrder'));
const AddSalesOrder = lazy(() => import('@/pages/sales/AddSalesOrder'));
const EstimateList = lazy(() => import('@/pages/sales/EstimateList'));
const AddEditEstimate = lazy(() => import('@/pages/sales/AddEditEstimate'));
const PurchaseBill = lazy(() => import('@/pages/purchase/PurchaseBill'));
const PurchaseOrder = lazy(() => import('@/pages/purchase/PurchaseOrder'));
const PurchaseReturn = lazy(() => import('@/pages/purchase/PurchaseReturn'));
const Receipt = lazy(() => import('@/pages/transactions/Receipt'));
const Payment = lazy(() => import('@/pages/transactions/Payment'));
const Contra = lazy(() => import('@/pages/transactions/Contra'));
const DebitNote = lazy(() => import('@/pages/transactions/DebitNote'));
const CreditNote = lazy(() => import('@/pages/transactions/CreditNote'));
const ManualJournal = lazy(() => import('@/pages/transactions/ManualJournal'));
const RecurringAdjustments = lazy(() => import('@/pages/transactions/RecurringAdjustments'));
const SalarySetup = lazy(() => import('@/pages/employee/SalarySetup'));
const PayrollRun = lazy(() => import('@/pages/employee/PayrollRun'));
const SalaryReport = lazy(() => import('@/pages/employee/SalaryReport'));
const Payslip = lazy(() => import('@/pages/employee/Payslip'));
const EmployeeDatabase = lazy(() => import('@/pages/employee/EmployeeDatabase'));
const AddEmployee = lazy(() => import('@/pages/employee/AddEmployee'));
const Production = lazy(() => import('@/pages/Production'));
const IncomeStatement = lazy(() => import('@/pages/reports/IncomeStatement'));
const BalanceSheet = lazy(() => import('@/pages/reports/BalanceSheet'));
const TrialBalance = lazy(() => import('@/pages/reports/TrialBalance.jsx'));
const OwnersEquityStatement = lazy(() => import('@/pages/reports/OwnersEquityStatement'));
const StockReport = lazy(() => import('@/pages/reports/StockReport'));
const CashFlowStatement = lazy(() => import('@/pages/reports/CashFlowStatement'));
const VendorLedger = lazy(() => import('@/pages/reports/VendorLedger'));
const OtherReports = lazy(() => import('@/pages/reports/OtherReports'));
const FixedAssetManagement = lazy(() => import('@/pages/fixed-asset/FixedAssetManagement'));

const AddAssetForm = lazy(() => import('@/pages/fixed-asset/AddAssetForm'));
const AssetDepreciation = lazy(() => import('@/pages/fixed-asset/AssetDepreciation'));
const AssetDisposal = lazy(() => import('@/pages/fixed-asset/AssetDisposal'));
const AssetReports = lazy(() => import('@/pages/fixed-asset/AssetReports'));
const FixedAssetMasterRegister = lazy(() => import('@/pages/fixed-asset/FixedAssetMasterRegister'));

// Loading Fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen w-screen fixed inset-0 bg-gray-100 dark:bg-gray-900 z-50">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
    <p className="ml-6 text-xl text-blue-600 font-semibold">Loading Easy CloudBook...</p>
  </div>
);

// Initial product data
const initialProductsData = [
  { sl: 1, id: 'PROD001', productType: 'Stock', name: 'Standard Widget', code: 'PROD001', location: 'Warehouse A', costingPrice: 15.50, salesPrice: 25.00, openingQuantity: 150, units: [{ id: 1, name: 'pcs', factor: 1, isBase: true }], baseUnitName: 'pcs', openingQuantityDate: '2023-01-01', hasWarranty: false, warrantyDays: 0, category: 'Widgets', description: 'A standard quality widget.' },
  { sl: 2, id: 'PROD002', productType: 'Stock', name: 'Premium Gadget', code: 'PROD002', location: 'Warehouse B', costingPrice: 49.99, salesPrice: 89.99, openingQuantity: 75, units: [{ id: 1, name: 'pcs', factor: 1, isBase: true }, {id: 2, name: 'box', factor: 5, isBase: false}], baseUnitName: 'pcs', openingQuantityDate: '2023-01-15', hasWarranty: true, warrantyDays: 365, category: 'Gadgets', description: 'A premium quality gadget with extra features.' },
  { sl: 3, id: 'SERV001', productType: 'Service', name: 'Consulting Hour', code: 'SERV001', location: 'N/A', costingPrice: 0, salesPrice: 100.00, openingQuantity: Infinity, units: [], baseUnitName: 'N/A', openingQuantityDate: null, hasWarranty: false, warrantyDays: 0, category: 'Services', description: 'One hour of expert consulting.' },
];

function App() {
  const [products, setProducts] = useState(initialProductsData);

  return (
    <ThemeProvider>
      <Router>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="chart-of-accounts" element={<ChartOfAccounts />} />
              <Route path="products-services" element={<ProductsServices products={products} setProducts={setProducts} />} />
              <Route path="vendor" element={<Vendor />} />
              <Route path="customer-center" element={<CustomerCenter />} />
              
              <Route path="sales">
                <Route index element={<Navigate to="invoice" replace />} />
                <Route path="invoice" element={<SalesInvoice />} />
                <Route path="return" element={<SalesReturn />} />
                <Route path="sales-orders" element={<SalesOrder />} />
                <Route path="sales-order/new" element={<AddSalesOrder />} />
                <Route path="sales-order/:id" element={<AddSalesOrder />} />
                <Route path="estimate">
                  <Route index element={<EstimateList />} />
                  <Route path="new" element={<AddEditEstimate />} />
                  <Route path=":id" element={<AddEditEstimate />} />
                </Route>
              </Route>

              <Route path="purchase">
                <Route index element={<Navigate to="bill" replace />} />
                <Route path="bill" element={<PurchaseBill />} />
                <Route path="order" element={<PurchaseOrder />} />
                <Route path="return" element={<PurchaseReturn />} />
              </Route>

              <Route path="transactions">
                <Route index element={<Navigate to="receipt" replace />} />
                <Route path="receipt" element={<Receipt />} />
                <Route path="payment" element={<Payment />} />
                <Route path="contra" element={<Contra />} />
                <Route path="debit-note" element={<DebitNote />} />
                <Route path="credit-note" element={<CreditNote />} />
                <Route path="manual-journal" element={<ManualJournal />} />
                <Route path="recurring-adjustments" element={<RecurringAdjustments />} />
              </Route>

              <Route path="employee">
                <Route index element={<Navigate to="database" replace />} />
                <Route path="database" element={<EmployeeDatabase />} />
                <Route path="salary-setup" element={<SalarySetup />} />
                <Route path="payroll-run" element={<PayrollRun />} />
                <Route path="salary-report" element={<SalaryReport />} />
                <Route path="payslip" element={<Payslip />} />
                <Route path="add" element={<AddEmployee />} />
                <Route path="payslip" element={<Payslip />} />
              </Route>
              
              <Route path="production" element={<Production products={products} />} />

              <Route path="reports">
                <Route index element={<Navigate to="income-statement" replace />} />
                <Route path="income-statement" element={<IncomeStatement />} />
                <Route path="balance-sheet" element={<BalanceSheet />} />
                <Route path="trial-balance" element={<TrialBalance />} />
                <Route path="owners-equity" element={<OwnersEquityStatement />} />
                <Route path="stock-report" element={<StockReport />} />
                <Route path="cash-flow-statement" element={<CashFlowStatement />} />
                <Route path="other" element={<OtherReports />} />
                <Route path="vendor-ledger" element={<VendorLedger />} />
              </Route>
              <Route path="fixed-asset">
                <Route index element={<Navigate to="add-asset" replace />} />
                <Route path="add-asset" element={<AddAssetForm />} />
                <Route path="asset-depreciation" element={<AssetDepreciation />} />
                <Route path="asset-disposal" element={<AssetDisposal />} />
                <Route path="asset-reports" element={<AssetReports />} />
                <Route path="fixed-asset-master-register" element={<FixedAssetMasterRegister />} />
              </Route>
              <Route path="fixed-asset-management" element={<FixedAssetManagement />} />
              
              <Route path="*" element={<div className="p-6 text-center"><h2 className="text-2xl font-semibold text-blue-600">404 - Page Not Found</h2><p className="text-gray-600 mt-2">Oops! The page you&apos;re looking for doesn&apos;t exist.</p><Button onClick={() => window.history.back()} className="mt-4 bg-blue-600 text-white hover:bg-blue-700">Go Back</Button></div>} />
            </Route>
          </Routes>
        </Suspense>
        <Toaster />
      </Router>
    </ThemeProvider>
  );
}

export default App;
