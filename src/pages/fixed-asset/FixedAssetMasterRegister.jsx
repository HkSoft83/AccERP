import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const FixedAssetMasterRegister = ({ assets }) => {
  const calculateBookValue = (asset) => {
    const originalCost = parseFloat(asset.amount) || 0;
    const salvageValue = parseFloat(asset.salvageValue) || 0;
    const usefulLife = parseInt(asset.usefulLife, 10) || 1;
    const purchaseDate = new Date(asset.purchaseDate);
    const currentDate = new Date();
    const monthsPassed = (currentDate.getFullYear() - purchaseDate.getFullYear()) * 12 + (currentDate.getMonth() - purchaseDate.getMonth());
    const monthlyDepreciation = (originalCost - salvageValue) / (usefulLife * 12);
    const accumulatedDepreciation = monthlyDepreciation * monthsPassed;
    const bookValue = originalCost - accumulatedDepreciation;
    return bookValue > salvageValue ? bookValue.toFixed(2) : salvageValue.toFixed(2);
  };

  const calculateMonthlyDepreciation = (asset) => {
    const originalCost = parseFloat(asset.amount) || 0;
    const salvageValue = parseFloat(asset.salvageValue) || 0;
    const usefulLife = parseInt(asset.usefulLife, 10) || 1;
    const monthlyDepreciation = (originalCost - salvageValue) / (usefulLife * 12);
    return monthlyDepreciation.toFixed(2);
  };

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">Fixed Asset Master Register</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Asset Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Purchase Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Book Value</TableHead>
            <TableHead>Monthly Depreciation</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assets.map((asset) => (
            <TableRow key={asset.id}>
              <TableCell>{asset.name}</TableCell>
              <TableCell>{asset.category}</TableCell>
              <TableCell>{asset.purchaseDate}</TableCell>
              <TableCell>{asset.amount}</TableCell>
              <TableCell>{calculateBookValue(asset)}</TableCell>
              <TableCell>{calculateMonthlyDepreciation(asset)}</TableCell>
              <TableCell>{asset.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default FixedAssetMasterRegister;
