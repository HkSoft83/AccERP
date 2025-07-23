import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import mockAccounts from '@/data/mockAccounts';

const AddAssetForm = ({ addAsset }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    purchaseDate: '',
    amount: '',
    vendorName: '',
    purchaseMode: '',
    paymentMode: '',
    usefulLife: '',
    salvageValue: '',
    depreciationMethod: 'Straight Line',
    frequency: '',
    depreciationRate: '',
    assetLocation: '',
    tagSerialNumber: '',
  });

  const [paymentOptions, setPaymentOptions] = useState([]);

  useEffect(() => {
    let filteredAccounts = [];
    let defaultPayment = '';

    if (formData.purchaseMode === 'Cash Purchase') {
      filteredAccounts = mockAccounts.filter(account => account.category === 'Cash');
      if (filteredAccounts.length > 0) {
        defaultPayment = filteredAccounts[0].name; // Default to the first cash account
      }
    } else if (formData.purchaseMode === 'Bank Purchase') {
      filteredAccounts = mockAccounts.filter(account => account.category === 'Bank');
      // No default for bank purchase, user selects
    }

    setPaymentOptions(filteredAccounts);
    setFormData(prevData => ({
      ...prevData,
      paymentMode: defaultPayment,
    }));
  }, [formData.purchaseMode]);

  useEffect(() => {
    const { amount, usefulLife, salvageValue, depreciationMethod } = formData;

    console.log('Depreciation useEffect triggered:');
    console.log('Amount:', amount);
    console.log('Useful Life:', usefulLife);
    console.log('Salvage Value:', salvageValue);
    console.log('Depreciation Method:', depreciationMethod);

    if (depreciationMethod === 'Straight Line') {
      const purchaseAmount = parseFloat(amount);
      const life = parseFloat(usefulLife);
      const sValue = parseFloat(salvageValue);

      console.log('Parsed Purchase Amount:', purchaseAmount);
      console.log('Parsed Useful Life:', life);
      console.log('Parsed Salvage Value:', sValue);

      if (!isNaN(purchaseAmount) && !isNaN(life) && !isNaN(sValue) && life > 0 && purchaseAmount > 0) {
        const annualDepreciation = (purchaseAmount - sValue) / life;
        const calculatedRate = (annualDepreciation / purchaseAmount) * 100;
        console.log('Annual Depreciation:', annualDepreciation);
        console.log('Calculated Rate:', calculatedRate);
        setFormData(prevData => ({
          ...prevData,
          depreciationRate: calculatedRate.toFixed(2),
        }));
      } else {
        console.log('Invalid input for calculation. Clearing depreciation rate.');
        setFormData(prevData => ({
          ...prevData,
          depreciationRate: '',
        }));
      }
    } else {
      console.log('Depreciation method is not Straight Line. Clearing depreciation rate.');
      // Clear depreciation rate if method is not Straight Line
      setFormData(prevData => ({
        ...prevData,
        depreciationRate: '',
      }));
    }
  }, [formData.amount, formData.usefulLife, formData.salvageValue, formData.depreciationMethod]);

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
      purchaseMode: '',
      paymentMode: formData.purchaseMode === 'On Credit' ? 'On Credit' : '',
      usefulLife: '',
      salvageValue: '',
      depreciationMethod: 'Straight Line',
      frequency: '',
      depreciationRate: '',
      assetLocation: '',
      tagSerialNumber: '',
    });
  };

  return (
    <div className="p-4 border rounded-lg">
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Asset Name</Label>
            <Input id="name" placeholder="e.g., Laptop, Office Desk" value={formData.name} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="tagSerialNumber">Tag/Serial Number</Label>
            <Input id="tagSerialNumber" placeholder="e.g., SN123456" value={formData.tagSerialNumber} onChange={handleChange} />
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
            <Label htmlFor="purchaseMode">Purchase Mode</Label>
            <Select onValueChange={(value) => setFormData((prevData) => ({ ...prevData, purchaseMode: value }))} value={formData.purchaseMode}>
              <SelectTrigger id="purchaseMode">
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cash Purchase">Cash Purchase</SelectItem>
                <SelectItem value="Bank Purchase">Bank Purchase</SelectItem>
                <SelectItem value="On Credit">On Credit</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {formData.purchaseMode !== 'On Credit' && (
            <div>
              <Label htmlFor="paymentMode">Payment from</Label>
              <Select onValueChange={(value) => setFormData((prevData) => ({ ...prevData, paymentMode: value }))} value={formData.paymentMode}>
                <SelectTrigger id="paymentMode">
                  <SelectValue placeholder="Select payment source" />
                </SelectTrigger>
                <SelectContent>
                  {paymentOptions.map((account) => (
                    <SelectItem key={account.id} value={account.name}>
                      {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
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
            <Label htmlFor="frequency">Frequency</Label>
            <Select onValueChange={(value) => setFormData((prevData) => ({ ...prevData, frequency: value }))} value={formData.frequency}>
              <SelectTrigger id="frequency">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Monthly">Monthly</SelectItem>
                <SelectItem value="Yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="depreciationRate">Depreciation Rate(%)</Label>
            <Input
              id="depreciationRate"
              type="number"
              placeholder="e.g., 10"
              value={formData.depreciationRate}
              onChange={handleChange}
              readOnly={formData.depreciationMethod === 'Straight Line'}
            />
            
          </div>
          <div>
            <Label htmlFor="assetLocation">Asset Location</Label>
            <Input id="assetLocation" placeholder="e.g., Head Office" value={formData.assetLocation} onChange={handleChange} />
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
