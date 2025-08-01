import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { useToast } from '@/components/ui/use-toast';
import { DialogFooter, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Save } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const AddCustomerForm = ({ onSave, onCancel, initialData, isEditMode }) => {
  const { toast } = useToast();
  const [customerName, setCustomerName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [proprietorName, setProprietorName] = useState('');
  const [customerNumber, setCustomerNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [nid, setNid] = useState('');
  const [bankDetails, setBankDetails] = useState('');
  const [notes, setNotes] = useState('');
  const [creditLimit, setCreditLimit] = useState('');
  const [openingBalance, setOpeningBalance] = useState('');
  const [openingBalanceDate, setOpeningBalanceDate] = useState(undefined);
  const [originalId, setOriginalId] = useState(null);

  useEffect(() => {
    if (isEditMode && initialData) {
      setCustomerName(initialData.name || '');
      setDisplayName(initialData.displayName || '');
      setProprietorName(initialData.proprietorName || '');
      setCustomerNumber(initialData.customerNumber || '');
      setPhoneNumber(initialData.phoneNumber || '');
      setEmail(initialData.email || '');
      setAddress(initialData.address || '');
      setNid(initialData.nid || '');
      setBankDetails(initialData.bankDetails || '');
      setNotes(initialData.notes || '');
      setCreditLimit(initialData.creditLimit?.toString() || '');
      setOpeningBalance(initialData.openingBalance?.toString() || '');
      setOpeningBalanceDate(initialData.openingBalanceDate ? new Date(initialData.openingBalanceDate) : undefined);
      setOriginalId(initialData.id || initialData.customerNumber);
    } else {
      resetForm();
    }
  }, [initialData, isEditMode]);

  const resetForm = () => {
    setCustomerName('');
    setDisplayName('');
    setProprietorName('');
    setCustomerNumber('');
    setPhoneNumber('');
    setEmail('');
    setAddress('');
    setNid('');
    setBankDetails('');
    setNotes('');
    setCreditLimit('');
    setOpeningBalance('');
    setOpeningBalanceDate(undefined);
    setOriginalId(null);
  };

  const handleSubmit = (e, closeAfterSave = true) => {
    e.preventDefault();
    if (!customerName) {
      toast({
        title: "Validation Error",
        description: "Customer Name is required.",
        variant: "destructive",
      });
      return;
    }

    const customerData = {
      id: originalId || `cust-${Date.now()}`,
      name: customerName,
      displayName,
      proprietorName,
      customerNumber: customerNumber || (originalId ? originalId.split('-')[1] || String(Date.now()).slice(-4) : `C${String(Date.now()).slice(-4)}`),
      phoneNumber,
      email,
      address,
      nid,
      bankDetails,
      notes,
      creditLimit: parseFloat(creditLimit) || 0,
      openingBalance: parseFloat(openingBalance) || 0,
      openingBalanceDate: openingBalanceDate ? openingBalanceDate.toISOString().split('T')[0] : null,
    };

    onSave(customerData, isEditMode);

    toast({
      title: `Customer ${isEditMode ? 'Updated' : 'Saved'}!`,
      description: `${customerName} has been successfully ${isEditMode ? 'updated' : 'added'}.`,
    });

    if (closeAfterSave) {
      onCancel();
    } else if (!isEditMode) {
      resetForm();
    }
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, true)} className="space-y-4 py-2">
      <DialogHeader className="hidden">
        <DialogTitle>{isEditMode ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
        <DialogDescription>
          {isEditMode ? 'Update customer details.' : 'Fill in the details to add a new customer.'}
        </DialogDescription>
      </DialogHeader>
      <div>
        <Label htmlFor="customerName">Customer Name <span className="text-red-500">*</span></Label>
        <Input
          id="customerName"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="e.g., Client Omega Corp."
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
          placeholder="e.g., Omega Corp."
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="proprietorName">Proprietor Name</Label>
        <Input
          id="proprietorName"
          value={proprietorName}
          onChange={(e) => setProprietorName(e.target.value)}
          placeholder="e.g., Jane Smith"
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="customerNumber">Customer Number</Label>
        <Input
          id="customerNumber"
          value={customerNumber}
          onChange={(e) => setCustomerNumber(e.target.value)}
          placeholder="e.g., C001"
          className="mt-1"
          disabled={isEditMode}
        />
        {isEditMode && <p className="text-xs text-muted-foreground">Customer number cannot be changed after creation.</p>}
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
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="e.g., contact@example.com"
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="e.g., 456 Client Ave"
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="nid">NID</Label>
        <Input
          id="nid"
          value={nid}
          onChange={(e) => setNid(e.target.value)}
          placeholder="e.g., 1234567890"
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="creditLimit">Credit Limit</Label>
        <Input
          id="creditLimit"
          type="number"
          value={creditLimit}
          onChange={(e) => setCreditLimit(e.target.value)}
          placeholder="e.g., 5000.00"
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="bankDetails">Bank Details</Label>
        <Textarea
          id="bankDetails"
          value={bankDetails}
          onChange={(e) => setBankDetails(e.target.value)}
          placeholder="e.g., Bank Name, Account Number, etc."
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g., Any special instructions or notes about the customer."
          className="mt-1"
        />
      </div>
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
          <Save size={18} className="mr-2" /> {isEditMode ? 'Update Customer' : 'Save & Close'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default AddCustomerForm;
