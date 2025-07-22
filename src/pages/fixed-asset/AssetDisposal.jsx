import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AssetDisposal = ({ assets, disposeAsset }) => {
  const [selectedAsset, setSelectedAsset] = useState('');
  const [disposalType, setDisposalType] = useState('Sold');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedAsset) {
      disposeAsset(selectedAsset, disposalType);
      setSelectedAsset('');
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">Asset Disposal</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="asset">Select Asset</Label>
            <Select onValueChange={setSelectedAsset} value={selectedAsset}>
              <SelectTrigger>
                <SelectValue placeholder="Select an asset to dispose" />
              </SelectTrigger>
              <SelectContent>
                {assets.map((asset) => (
                  <SelectItem key={asset.id} value={asset.id.toString()}>
                    {asset.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="disposalType">Disposal Type</Label>
            <Select onValueChange={setDisposalType} value={disposalType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sold">Sold</SelectItem>
                <SelectItem value="Scrapped">Scrapped</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button type="submit">Dispose Asset</Button>
        </div>
      </form>
    </div>
  );
};

export default AssetDisposal;
