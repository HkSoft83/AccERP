import React, { useState } from 'react';
import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from '@/components/ui/tabs';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';

// ✅ Fetch chart of accounts (with fallback or default)
const getChartOfAccountsFromStorage = () => {
  const storedAccounts = localStorage.getItem('chartOfAccounts');
  if (storedAccounts) {
    try {
      return JSON.parse(storedAccounts);
    } catch (e) {
      console.error("Failed to parse chartOfAccounts from localStorage", e);
      return [];
    }
  }
  return [
    { id: 'acc-1', name: 'Depreciation Expense', type: 'Expense' },
    { id: 'acc-2', name: 'Accumulated Depreciation', type: 'Asset' },
    { id: 'acc-3', name: 'Cash', type: 'Asset' },
    { id: 'acc-4', name: 'Bank', type: 'Asset' },
    { id: 'acc-5', name: 'Sales Revenue', type: 'Revenue' },
    { id: 'acc-6', name: 'Cost of Goods Sold', type: 'Expense' },
  ];
};

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

const AddDepreciationEntryForm = ({ addEntry, assets, chartOfAccounts }) => {
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
        <Select onValueChange={handleAssetSelect} value={formData.assetId} disabled={!assets.length}>
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
      <div><Label htmlFor="method">Method</Label><Input id="method" value={formData.method} onChange={handleChange} /></div>
      <div>
        <Label htmlFor="frequency">Frequency</Label>
        <Select onValueChange={(value) => handleSelectChange('frequency', value)} value={formData.frequency}>
          <SelectTrigger><SelectValue placeholder="Select frequency" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Monthly">Monthly</SelectItem>
            <SelectItem value="Yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div><Label htmlFor="timeOfEntry">Time of Entry</Label><Input id="timeOfEntry" value={formData.timeOfEntry} disabled /></div>
      <div><Label htmlFor="amount">Amount</Label><Input id="amount" type="number" value={formData.amount} onChange={handleChange} /></div>
      <div><Label htmlFor="debitAcc">Debit Account</Label><Input id="debitAcc" value={formData.debitAcc} onChange={handleChange} /></div>
      <div>
        <Label htmlFor="creditAcc">Credit Account</Label>
        <Select onValueChange={(value) => handleSelectChange('creditAcc', value)} value={formData.creditAcc}>
          <SelectTrigger>
            <SelectValue placeholder="Select Credit Account" />
          </SelectTrigger>
          <SelectContent>
            {chartOfAccounts.map(account => (
              <SelectItem key={account.id} value={account.name}>
                {account.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div><Label htmlFor="startDate">Start Date</Label><Input id="startDate" type="date" value={formData.startDate} onChange={handleChange} /></div>
      <div><Label htmlFor="endDate">End Date</Label><Input id="endDate" type="date" value={formData.endDate} onChange={handleChange} /></div>
      <Button type="submit" className="mt-4">Add Entry</Button>
    </form>
  );
};

const AssetDepreciation = ({ assets }) => {
  const [automaticEntries, setAutomaticEntries] = useState(mockAutomaticEntries);
  const [isAddEntryFormOpen, setIsAddEntryFormOpen] = useState(false);

  // ✅ FIX: Get chart of accounts here
  const chartOfAccounts = getChartOfAccountsFromStorage();

  const addAutomaticEntry = (entry) => {
    setAutomaticEntries((prevEntries) => [...prevEntries, { ...entry, id: prevEntries.length + 1 }]);
    setIsAddEntryFormOpen(false);
  };

  const handleEditEntry = (entry) => {
    alert(`Edit feature not implemented yet for: ${entry.assetName}`);
  };

  const handleDeleteEntry = (id) => {
    if (confirm("Are you sure you want to delete this entry?")) {
      setAutomaticEntries(prev => prev.filter(e => e.id !== id));
    }
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
                  <Button size="sm" disabled={!assets.length}>
                    <Plus className="mr-2 h-4 w-4" /> Add Automatic Entry
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add Automatic Depreciation Entry</DialogTitle>
                  </DialogHeader>
                  <AddDepreciationEntryForm
                    addEntry={addAutomaticEntry}
                    assets={assets}
                    chartOfAccounts={chartOfAccounts} // ✅ Pass it here
                  />
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
                  <TableHead>Actions</TableHead>
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
                    <TableCell className="text-center space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditEntry(entry)}><Edit size={16} /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteEntry(entry.id)}><Trash2 size={16} /></Button>
                    </TableCell>
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
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AssetDepreciation;