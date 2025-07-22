import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';

const AddAssetForm = ({ addAsset }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    purchaseDate: '',
    amount: '',
    vendorName: '',
    paymentMode: '',
    usefulLife: '',
    salvageValue: '',
    depreciationMethod: 'Straight Line',
    assetLocation: '',
    tagSerialNumber: '',
    status: 'Active',
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addAsset(formData);
    setFormData({
      name: '',
      category: '',
      purchaseDate: '',
      amount: '',
      vendorName: '',
      paymentMode: '',
      usefulLife: '',
      salvageValue: '',
      depreciationMethod: 'Straight Line',
      assetLocation: '',
      tagSerialNumber: '',
      status: 'Active',
    });
  };

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">Add/Edit Asset</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Asset Name</Label>
            <Input id="name" placeholder="e.g., Laptop, Office Desk" value={formData.name} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="category">Asset Category</Label>
            <Input id="category" placeholder="e.g., Computer, Furniture" value={formData.category} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="purchaseDate">Purchase Date</Label>
            <Input id="purchaseDate" type="date" value={formData.purchaseDate} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="amount">Purchase Amount</Label>
            <Input id="amount" type="number" placeholder="e.g., 1200.00" value={formData.amount} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="vendorName">Vendor Name</Label>
            <Input id="vendorName" placeholder="e.g., Tech Solutions Ltd." value={formData.vendorName} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="paymentMode">Payment Mode</Label>
            <Input id="paymentMode" placeholder="e.g., Cash, Bank, Credit" value={formData.paymentMode} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="usefulLife">Useful Life (Years)</Label>
            <Input id="usefulLife" type="number" placeholder="e.g., 5" value={formData.usefulLife} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="salvageValue">Salvage Value</Label>
            <Input id="salvageValue" type="number" placeholder="e.g., 100.00" value={formData.salvageValue} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="depreciationMethod">Depreciation Method</Label>
            <Select onValueChange={(value) => setFormData((prevData) => ({ ...prevData, depreciationMethod: value }))} value={formData.depreciationMethod}>
              <SelectTrigger id="depreciationMethod">
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Straight Line">Straight Line</SelectItem>
                <SelectItem value="Reducing Balance">Reducing Balance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="assetLocation">Asset Location</Label>
            <Input id="assetLocation" placeholder="e.g., Head Office" value={formData.assetLocation} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="tagSerialNumber">Tag/Serial Number</Label>
            <Input id="tagSerialNumber" placeholder="e.g., SN123456" value={formData.tagSerialNumber} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Input id="status" placeholder="e.g., Active, Sold, Scrapped" value={formData.status} onChange={handleChange} />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button type="submit">Save Asset</Button>
        </div>
      </form>
    </div>
  );
};

export default AddAssetForm;
