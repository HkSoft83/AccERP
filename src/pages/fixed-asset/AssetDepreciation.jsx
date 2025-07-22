import React from 'react';

const AssetDepreciation = ({ assets }) => {
  const totalMonthlyDepreciation = assets.reduce((total, asset) => {
    const originalCost = parseFloat(asset.amount) || 0;
    const salvageValue = parseFloat(asset.salvageValue) || 0;
    const usefulLife = parseInt(asset.usefulLife, 10) || 1;
    const monthlyDepreciation = (originalCost - salvageValue) / (usefulLife * 12);
    return total + monthlyDepreciation;
  }, 0);

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-2">Asset Depreciation</h2>
      <div className="mt-4">
        <p className="text-lg">Total Monthly Depreciation:</p>
        <p className="text-2xl font-bold">${totalMonthlyDepreciation.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default AssetDepreciation;
