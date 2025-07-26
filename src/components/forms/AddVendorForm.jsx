import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription, DialogClose, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Settings } from 'lucide-react';

const AddVendorForm = ({ onSave, onCancel, initialData, isEditMode }) => {
  const { toast } = useToast();
  const [vendorName, setVendorName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [proprietorName, setProprietorName] = useState('');
  const [vendorNumber, setVendorNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [nid, setNid] = useState('');
  const [openingBalance, setOpeningBalance] = useState('');
  const [openingBalanceDate, setOpeningBalanceDate] = useState(undefined);
  const [originalId, setOriginalId] = useState(null);
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [customFields, setCustomFields] = useState([
    { name: 'Custom Field 1', value: '', options: '' },
    { name: 'Custom Field 2', value: '', options: '' },
    { name: 'Custom Field 3', value: '', options: '' },
  ]);

  const handleCustomFieldNameChange = (index, name) => {
    const newCustomFields = [...customFields];
    newCustomFields[index].name = name;
    setCustomFields(newCustomFields);
  };

  const handleCustomFieldOptionsChange = (index, options) => {
    const newCustomFields = [...customFields];
    newCustomFields[index].options = options;
    setCustomFields(newCustomFields);
  };

  const handleCustomFieldValueChange = (index, value) => {
    const newCustomFields = [...customFields];
    newCustomFields[index].value = value;
    setCustomFields(newCustomFields);
  };

  useEffect(() => {
    if (isEditMode && initialData) {
      setVendorName(initialData.name || '');
      setDisplayName(initialData.displayName || '');
      setProprietorName(initialData.proprietorName || '');
      setVendorNumber(initialData.vendorNumber || '');
      setPhoneNumber(initialData.phoneNumber || '');
      setAddress(initialData.address || '');
      setNid(initialData.nid || '');
      setOpeningBalance(initialData.openingBalance?.toString() || '');
      setOpeningBalanceDate(initialData.openingBalanceDate ? new Date(initialData.openingBalanceDate) : undefined);
      setOriginalId(initialData.id || initialData.vendorNumber);
      if (initialData.customFields) {
        setCustomFields(initialData.customFields);
      }
    } else {
      resetForm();
    }
  }, [initialData, isEditMode]);

  const resetForm = () => {
    setVendorName('');
    setDisplayName('');
    setProprietorName('');
    setVendorNumber('');
    setPhoneNumber('');
    setAddress('');
    setNid('');
    setOpeningBalance('');
    setOpeningBalanceDate(undefined);
    setOriginalId(null);
    setCustomFields([
      { name: 'Custom Field 1', value: '', options: '' },
      { name: 'Custom Field 2', value: '', options: '' },
      { name: 'Custom Field 3', value: '', options: '' },
    ]);
  };

  const handleSubmit = (e, closeAfterSave = true) => {
    e.preventDefault();
    if (!vendorName) {
      toast({
        title: "Validation Error",
        description: "Vendor Name is required.",
        variant: "destructive",
      });
      return;
    }

    const vendorData = {
      id: originalId || `vend-${Date.now()}`,
      name: vendorName,
      displayName,
      proprietorName,
      vendorNumber: vendorNumber || (originalId ? originalId.split('-')[1] || String(Date.now()).slice(-4) : `V${String(Date.now()).slice(-4)}`),
      phoneNumber,
      address,
      nid,
      openingBalance: parseFloat(openingBalance) || 0,
      openingBalanceDate: openingBalanceDate ? openingBalanceDate.toISOString().split('T')[0] : null,
      customFields,
    };

    onSave(vendorData, isEditMode);

    toast({
      title: `Vendor ${isEditMode ? 'Updated' : 'Saved'}!`,
      description: `${vendorName} has been successfully ${isEditMode ? 'updated' : 'added'}.`,
    });

    if (closeAfterSave) {
      onCancel();
    } else if (!isEditMode) {
      resetForm();
    }
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, true)} className="space-y-4 py-2">
      <div className="flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Customize Fields</DialogTitle>
              <DialogDescription>
                Define the labels and options for your custom fields.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {customFields.map((field, index) => (
                <div key={index} className="space-y-2">
                  <Label>Field {index + 1} Name</Label>
                  <Input
                    value={field.name}
                    onChange={(e) => handleCustomFieldNameChange(index, e.target.value)}
                  />
                  <Label>Field {index + 1} Options (comma-separated)</Label>
                  <Input
                    value={field.options}
                    onChange={(e) => handleCustomFieldOptionsChange(index, e.target.value)}
                    placeholder="e.g., Option 1, Option 2"
                  />
                </div>
              ))}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button>Done</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div>
        <Label htmlFor="vendorName">Vendor Name <span className="text-red-500">*</span></Label>
        <Input
          id="vendorName"
          value={vendorName}
          onChange={(e) => setVendorName(e.target.value)}
          placeholder="e.g., Supplier Alpha Inc."
          className="mt-1"
          required
        />
      </div>
      <div>
        <Label htmlFor="displayName">Display Name</Label>
        <Input
          id="displayName"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="e.g., Alpha Inc."
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="proprietorName">Proprietor Name</Label>
        <Input
          id="proprietorName"
          value={proprietorName}
          onChange={(e) => setProprietorName(e.target.value)}
          placeholder="e.g., John Doe"
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="vendorNumber">Vendor Number</Label>
        <Input
          id="vendorNumber"
          value={vendorNumber}
          onChange={(e) => setVendorNumber(e.target.value)}
          placeholder="e.g., V001"
          className="mt-1"
          disabled={isEditMode}
        />
        {isEditMode && <p className="text-xs text-muted-foreground">Vendor number cannot be changed after creation.</p>}
      </div>
      <div>
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input
          id="phoneNumber"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="e.g., +1234567890"
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="e.g., 123 Supply Chain Rd"
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="nid">NID</Label>
        <Input
          id="nid"
          value={nid}
          onChange={(e) => setNid(e.target.value)}
          placeholder="e.g., 1234567890123"
          className="mt-1"
        />
      </div>
      {customFields.map((field, index) => (
        <div key={index}>
          <Label htmlFor={`custom-field-${index}`}>{field.name}</Label>
          {field.options ? (
            <Select
              onValueChange={(value) => handleCustomFieldValueChange(index, value)}
              value={field.value}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder={`Select ${field.name}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options.split(',').map((option, optionIndex) => (
                  <SelectItem key={optionIndex} value={option.trim()}>
                    {option.trim()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              id={`custom-field-${index}`}
              value={field.value}
              onChange={(e) => handleCustomFieldValueChange(index, e.target.value)}
              placeholder={`Enter ${field.name}`}
              className="mt-1"
            />
          )}
        </div>
      ))}
      <div>
        <Label htmlFor="openingBalance">Opening Balance</Label>
        <Input
          id="openingBalance"
          type="number"
          value={openingBalance}
          onChange={(e) => setOpeningBalance(e.target.value)}
          placeholder="0.00"
          className="mt-1"
          disabled={isEditMode}
        />
        {isEditMode && <p className="text-xs text-muted-foreground">Opening balance cannot be changed after creation.</p>}
      </div>
      <div>
        <Label htmlFor="openingBalanceDate">Opening Balance As of Date</Label>
        <DatePicker 
            date={openingBalanceDate} 
            setDate={setOpeningBalanceDate} 
            className="mt-1 w-full" 
            disabled={isEditMode}
        />
        {isEditMode && <p className="text-xs text-muted-foreground">Opening balance date cannot be changed after creation.</p>}
      </div>
      <DialogFooter className="pt-6">
        <DialogClose asChild>
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
        </DialogClose>
        {!isEditMode && (
          <Button type="button" onClick={(e) => handleSubmit(e, false)} variant="secondary">
            <Save size={18} className="mr-2" /> Save & New
          </Button>
        )}
        <Button type="submit">
          <Save size={18} className="mr-2" /> {isEditMode ? 'Update Vendor' : 'Save & Close'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default AddVendorForm;
