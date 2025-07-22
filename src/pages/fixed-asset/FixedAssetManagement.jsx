import React, { useState } from 'react';
import FixedAssetMasterRegister from './FixedAssetMasterRegister';
import AddAssetForm from './AddAssetForm';
import AssetDepreciation from './AssetDepreciation';
import AssetDisposal from './AssetDisposal';
import AssetReports from './AssetReports';

const mockAssets = [
  {
    id: 1,
    name: 'Dell Laptop',
    category: 'Computer',
    purchaseDate: '2023-01-15',
    amount: 1500.00,
    status: 'Active',
  },
  {
    id: 2,
    name: 'Office Chair',
    category: 'Furniture',
    purchaseDate: '2023-02-20',
    amount: 250.00,
    status: 'Active',
  },
  {
    id: 3,
    name: 'Toyota Corolla',
    category: 'Vehicle',
    purchaseDate: '2022-11-10',
    amount: 25000.00,
    status: 'Sold',
  },
];

const FixedAssetManagement = () => {
  const [assets, setAssets] = useState(mockAssets);

  const addAsset = (asset) => {
    setAssets((prevAssets) => [...prevAssets, { ...asset, id: prevAssets.length + 1 }]);
  };

  const disposeAsset = (assetId, disposalType) => {
    setAssets((prevAssets) =>
      prevAssets.map((asset) =>
        asset.id === parseInt(assetId)
          ? { ...asset, status: disposalType } 
          : asset
      )
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Fixed Asset Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <AddAssetForm addAsset={addAsset} />
        </div>
        <div className="md:col-span-2">
          <FixedAssetMasterRegister assets={assets} />
        </div>
        <div>
          <AssetDepreciation assets={assets} />
        </div>
        <div>
          <AssetDisposal assets={assets} disposeAsset={disposeAsset} />
        </div>
        <div className="md:col-span-2">
          <AssetReports assets={assets} />
        </div>
      </div>
    </div>
  );
};

export default FixedAssetManagement;
