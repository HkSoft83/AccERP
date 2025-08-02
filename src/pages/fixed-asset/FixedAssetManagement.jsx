import React, { useState } from 'react';
import FixedAssetMasterRegister from './FixedAssetMasterRegister';
import AddAssetForm from './AddAssetForm';
import AssetDepreciation from './AssetDepreciation';
import AssetDisposal from './AssetDisposal';

import AssetReports from './AssetReports';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const mockAssets = [
  {
    id: 1,
    name: 'Dell Laptop',
    tagNo: 'LT001',
    category: 'Computer',
    purchaseDate: '2023-01-15',
    amount: 1500.00,
    status: 'Active',
    salvageValue: 150,
    usefulLife: 5,
    depreciationMethod: 'Straight Line',
  },
  {
    id: 2,
    name: 'Office Chair',
    tagNo: 'OC002',
    category: 'Furniture',
    purchaseDate: '2023-02-20',
    amount: 250.00,
    status: 'Active',
    salvageValue: 25,
    usefulLife: 10,
    depreciationMethod: 'Straight Line',
  },
  {
    id: 3,
    name: 'Toyota Corolla',
    tagNo: 'VC003',
    category: 'Vehicle',
    purchaseDate: '2022-11-10',
    amount: 25000.00,
    status: 'Sold',
    salvageValue: 2500,
    usefulLife: 7,
    depreciationMethod: 'Straight Line',
  },
];

const FixedAssetManagement = () => {
  const [assets, setAssets] = useState(mockAssets);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);

  const addAsset = (asset) => {
    setAssets((prevAssets) => [...prevAssets, { ...asset, id: prevAssets.length + 1 }]);
    setIsAddFormOpen(false); // Close the dialog after adding asset
  };

  const handleEditAsset = (asset) => {
    setEditingAsset(asset);
    setIsAddFormOpen(true);
  };

  const saveAsset = (asset) => {
    if (editingAsset) {
      setAssets((prevAssets) =>
        prevAssets.map((a) => (a.id === asset.id ? asset : a))
      );
    } else {
      setAssets((prevAssets) => [...prevAssets, { ...asset, id: prevAssets.length + 1 }]);
    }
    setIsAddFormOpen(false);
    setEditingAsset(null);
  };

  const disposeAsset = (assetId, disposalType, disposalValue, tagNo) => {
    setAssets((prevAssets) =>
      prevAssets.map((asset) =>
        asset.id === parseInt(assetId)
          ? { ...asset, status: disposalType, disposalValue: parseFloat(disposalValue), tagNo: tagNo } 
          : asset
      )
    );
  };

  const handleDeleteAsset = (assetId) => {
    setAssets((prevAssets) => prevAssets.filter((asset) => asset.id !== assetId));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Fixed Asset Management</h1>
      <Tabs defaultValue="register" className="w-full">
        <TabsList>
          <TabsTrigger value="register">Register</TabsTrigger>
          <TabsTrigger value="depreciation">Depreciation</TabsTrigger>
          <TabsTrigger value="disposal">Disposal</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="register">
          <div className="flex justify-end mb-4">
            <Dialog open={isAddFormOpen} onOpenChange={setIsAddFormOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add New Asset
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>{editingAsset ? 'Edit Asset' : 'Add New Asset'}</DialogTitle>
                </DialogHeader>
                <AddAssetForm asset={editingAsset} onSave={saveAsset} />
              </DialogContent>
            </Dialog>
          </div>
          <FixedAssetMasterRegister assets={assets} onEdit={handleEditAsset} onDelete={handleDeleteAsset} />
        </TabsContent>
        <TabsContent value="depreciation">
          <AssetDepreciation assets={assets} />
        </TabsContent>
        <TabsContent value="disposal">
          <AssetDisposal assets={assets} disposeAsset={disposeAsset} />
        </TabsContent>
        
        <TabsContent value="reports">
          <AssetReports assets={assets} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FixedAssetManagement;
