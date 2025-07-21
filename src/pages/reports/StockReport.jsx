import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx";

// Assuming initialProductsData is available or can be imported from ProductsServices.jsx
// For now, I'll define a mock one here, but ideally, it should come from a shared data source.
const initialProductsData = [
  { sl: 1, id: 'PROD001', productType: 'Stock', name: 'Standard Widget', code: 'PROD001', location: 'Warehouse A', costingPrice: 15.50, salesPrice: 25.00, openingQuantity: 150, units: [{ id: 1, name: 'pcs', factor: 1, isBase: true }], baseUnitName: 'pcs', openingQuantityDate: '2023-01-01', hasWarranty: false, warrantyDays: 0, category: 'Widgets', description: 'A standard quality widget.' },
  { sl: 2, id: 'PROD002', productType: 'Stock', name: 'Premium Gadget', code: 'PROD002', location: 'Warehouse B', costingPrice: 49.99, salesPrice: 89.99, openingQuantity: 75, units: [{ id: 1, name: 'pcs', factor: 1, isBase: true }, {id: 2, name: 'box', factor: 5, isBase: false}], baseUnitName: 'pcs', openingQuantityDate: '2023-01-15', hasWarranty: true, warrantyDays: 365, category: 'Gadgets', description: 'A premium quality gadget with extra features.' },
  { sl: 3, id: 'SERV001', productType: 'Service', name: 'Consulting Hour', code: 'SERV001', location: 'N/A', costingPrice: 0, salesPrice: 100.00, openingQuantity: Infinity, units: [], baseUnitName: 'N/A', openingQuantityDate: null, hasWarranty: false, warrantyDays: 0, category: 'Services', description: 'One hour of expert consulting.' },
];

const formatProductForDisplay = (product) => {
  const baseUnit = product.units?.find(u => u.isBase) || { name: 'N/A', factor: 1 };
  const qty = product.productType === 'Service' ? 0 : (product.openingQuantity || 0); // Set qty to 0 for services
  const cost = product.costingPrice || 0;
  const value = qty * cost;

  return {
    ...product,
    avgCost: cost,
    qty: qty,
    value: value,
    avgCostFormatted: cost.toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    qtyFormatted: product.productType === 'Service' ? 'N/A' : `${qty.toLocaleString('en-US')} ${baseUnit.name}`,
    valueFormatted: product.productType === 'Service' ? 'N/A' : value.toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    baseUnitName: baseUnit.name,
  };
};

const StockReport = () => {
  const stockProducts = initialProductsData
    .filter(product => product.productType === 'Stock')
    .map(formatProductForDisplay);

  const totalStockQuantity = stockProducts.reduce((sum, product) => sum + product.qty, 0);
  const totalStockValue = stockProducts.reduce((sum, product) => sum + product.value, 0);

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="bg-ecb-primary rounded-t-lg text-center">
          <CardTitle className="text-2xl font-bold text-ecb-primary-foreground">[Your Enterprise Name]</CardTitle>
          <CardTitle className="text-xl font-bold text-ecb-primary-foreground">Stock Report</CardTitle>
          <CardTitle className="text-lg font-bold text-ecb-primary-foreground">As of {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[10%]">ID</TableHead>
                <TableHead className="w-[30%]">Product Name</TableHead>
                <TableHead className="w-[15%]">Base Unit</TableHead>
                <TableHead className="text-right w-[15%]">Quantity</TableHead>
                <TableHead className="text-right w-[15%]">Costing Price</TableHead>
                <TableHead className="text-right w-[15%]">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.baseUnitName}</TableCell>
                  <TableCell className="text-right">{product.qtyFormatted}</TableCell>
                  <TableCell className="text-right">{product.avgCostFormatted}</TableCell>
                  <TableCell className="text-right">{product.valueFormatted}</TableCell>
                </TableRow>
              ))}
              <TableRow className="font-bold bg-gray-100">
                <TableCell colSpan={3}>Total Stock</TableCell>
                <TableCell className="text-right">{totalStockQuantity.toLocaleString('en-US')}</TableCell>
                <TableCell></TableCell>
                <TableCell className="text-right">{totalStockValue.toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          {stockProducts.length === 0 && (
            <p className="text-ecb-textDark mt-4 text-center">No stock products found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StockReport;