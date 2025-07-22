import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const mockAutomaticEntries = [
  {
    id: 1,
    assetName: 'Dell Laptop',
    tagNo: 'DL-001',
    method: 'Straight Line',
    frequency: 'Monthly',
    amount: 25.00,
    debitAcc: 'Depreciation Expense',
    creditAcc: 'Accumulated Depreciation',
    startDate: '2023-01-01',
    endDate: '2028-01-01',
  },
  {
    id: 2,
    assetName: 'Office Chair',
    tagNo: 'OC-001',
    method: 'Straight Line',
    frequency: 'Monthly',
    amount: 2.08,
    debitAcc: 'Depreciation Expense',
    creditAcc: 'Accumulated Depreciation',
    startDate: '2023-02-01',
    endDate: '2033-02-01',
  },
];

const AddDepreciationEntryForm = ({ addEntry, assets }) => {
  const [formData, setFormData] = useState({
    assetId: '',
    assetName: '',
    tagNo: '',
    method: 'Straight Line',
    frequency: 'Monthly',
    timeOfEntry: 'Last day of the period',
    amount: '',
    debitAcc: 'Depreciation Expense',
    creditAcc: 'Accumulated Depreciation',
    startDate: '',
    endDate: '',
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAssetSelect = (value) => {
    const selectedAsset = assets.find(asset => asset.id.toString() === value);
    if (selectedAsset) {
      const originalCost = parseFloat(selectedAsset.amount) || 0;
      const salvageValue = parseFloat(selectedAsset.salvageValue) || 0;
      const usefulLife = parseInt(selectedAsset.usefulLife, 10) || 1;
      const monthlyDepreciation = (originalCost - salvageValue) / (usefulLife * 12);
      setFormData(prevData => ({
        ...prevData,
        assetId: value,
        amount: monthlyDepreciation.toFixed(2),
        assetName: selectedAsset.name,
        tagNo: selectedAsset.tagSerialNumber,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addEntry(formData);
    setFormData({
      assetId: '',
      assetName: '',
      tagNo: '',
      method: 'Straight Line',
      frequency: 'Monthly',
      timeOfEntry: 'Last day of the period',
      amount: '',
      debitAcc: 'Depreciation Expense',
      creditAcc: 'Accumulated Depreciation',
      startDate: '',
      endDate: '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 py-4">
      <div>
        <Label htmlFor="assetId">Select Asset</Label>
        <Select onValueChange={handleAssetSelect} value={formData.assetId}>
          <SelectTrigger>
            <SelectValue placeholder="Select an asset" />
          </SelectTrigger>
          <SelectContent>
            {assets.map(asset => (
              <SelectItem key={asset.id} value={asset.id.toString()}>
                {asset.name} ({asset.tagSerialNumber})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="method">Method</Label>
        <Input id="method" value={formData.method} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="frequency">Frequency</Label>
        <Select onValueChange={(value) => handleSelectChange('frequency', value)} value={formData.frequency}>
          <SelectTrigger>
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Monthly">Monthly</SelectItem>
            <SelectItem value="Yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="timeOfEntry">Time of Entry</Label>
        <Input id="timeOfEntry" value={formData.timeOfEntry} disabled />
      </div>
      <div>
        <Label htmlFor="amount">Amount</Label>
        <Input id="amount" type="number" value={formData.amount} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="debitAcc">Debit Account</Label>
        <Input id="debitAcc" value={formData.debitAcc} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="creditAcc">Credit Account</Label>
        <Input id="creditAcc" value={formData.creditAcc} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="startDate">Start Date</Label>
        <Input id="startDate" type="date" value={formData.startDate} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="endDate">End Date</Label>
        <Input id="endDate" type="date" value={formData.endDate} onChange={handleChange} />
      </div>
      <Button type="submit" className="mt-4">Add Entry</Button>
    </form>
  );
};

const AssetDepreciation = ({ assets }) => {
  const [automaticEntries, setAutomaticEntries] = useState(mockAutomaticEntries);
  const [isAddEntryFormOpen, setIsAddEntryFormOpen] = useState(false);

  const addAutomaticEntry = (entry) => {
    setAutomaticEntries((prevEntries) => [...prevEntries, { ...entry, id: prevEntries.length + 1 }]);
    setIsAddEntryFormOpen(false);
  };

  const totalMonthlyDepreciation = assets.reduce((total, asset) => {
    const originalCost = parseFloat(asset.amount) || 0;
    const salvageValue = parseFloat(asset.salvageValue) || 0;
    const usefulLife = parseInt(asset.usefulLife, 10) || 1;
    const monthlyDepreciation = (originalCost - salvageValue) / (usefulLife * 12);
    return total + monthlyDepreciation;
  }, 0);

  return (
    <div className="p-4 border rounded-lg">
      <Tabs defaultValue="automatic-entry" className="w-full mt-4">
        <TabsList>
          <TabsTrigger value="automatic-entry">Automatic Entry</TabsTrigger>
          <TabsTrigger value="depreciation-schedule">Depreciation Schedule</TabsTrigger>
        </TabsList>
        <TabsContent value="automatic-entry">
          <div className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Automatic Depreciation Entries</h3>
              <Dialog open={isAddEntryFormOpen} onOpenChange={setIsAddEntryFormOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" /> Add Automatic Entry
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add Automatic Depreciation Entry</DialogTitle>
                  </DialogHeader>
                  <AddDepreciationEntryForm addEntry={addAutomaticEntry} assets={assets} />
                </DialogContent>
              </Dialog>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SL No</TableHead>
                  <TableHead>Asset Name</TableHead>
                  <TableHead>Tag No</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Debit Acc</TableHead>
                  <TableHead>Credit Acc</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {automaticEntries.map((entry, index) => (
                  <TableRow key={entry.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{entry.assetName}</TableCell>
                    <TableCell>{entry.tagNo}</TableCell>
                    <TableCell>{entry.method}</TableCell>
                    <TableCell>{entry.frequency}</TableCell>
                    <TableCell>{entry.amount}</TableCell>
                    <TableCell>{entry.debitAcc}</TableCell>
                    <TableCell>{entry.creditAcc}</TableCell>
                    <TableCell>{entry.startDate}</TableCell>
                    <TableCell>{entry.endDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 text-right">
              <p className="text-lg">Total Monthly Depreciation: <span className="font-bold">${totalMonthlyDepreciation.toFixed(2)}</span></p>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="depreciation-schedule">
          <div className="mt-4">
            <p className="text-lg">Depreciation Schedule details will be displayed here.</p>
            {/* You can add a table or more detailed view here */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AssetDepreciation;
