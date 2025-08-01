import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { DialogFooter, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Save } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

const accountTypes = {
  "Current Asset": ["Cash", "Bank A/C-Current", "Bank A/C-Saving", "Account Receivable", "Inventory", "Short-Term Investments","Prepaid Expenses","Loans & Advances (Short-Term)", "Other Current Assets"],
  "Non-Current Asset": ["Fixed/Tangible Assets", "Intangible Assets", "Long-term Investments","Other Non-Current Assets"],
  "Current Liability": ["A/C Payable", "Short-term Loan", "Accrued Expenses","Credit Card", "Unearned Revenue","Provisions", "Current Portion of Long-term Debt", "Other Current Liabilities"],
  "Non-Current Liability": ["Long-term Loans","Bonds Payable", "Provisions", "Deferred Tax Liabilities", "Other Non-Current Liabilities"],
  "Equity": ["Owner's Capital", "Owner's Drawings", "Retained Earnings", "Share Capital", "Reserves & Surplus","Others Equity"],
  "Income": ["Operating Income", "Non-operating Income", "Other Income"],
  "Expense": ["Operating Expenses","Non-Operating Expenses", "Others Expenses", "Cost of Goods Sold"],
};

const accountTypeOptions = Object.keys(accountTypes);
const NO_PARENT_ACCOUNT_VALUE = "__none__";

const AddAccountForm = ({ existingAccounts = [], onSave, onCancel, initialData, isEditMode, initialSubAccountData }) => {
  const { toast } = useToast();
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountType, setAccountType] = useState('');
  const [accountSubtype, setAccountSubtype] = useState('');
  const [subAccountOf, setSubAccountOf] = useState(NO_PARENT_ACCOUNT_VALUE);
  const [openingBalance, setOpeningBalance] = useState('');
  const [openingBalanceDate, setOpeningBalanceDate] = useState(undefined);
  const [originalId, setOriginalId] = useState(null);

  useEffect(() => {
    console.log("AddAccountForm useEffect - initialData:", initialData);
    console.log("AddAccountForm useEffect - isEditMode:", isEditMode);
    if (isEditMode && initialData) {
      setAccountName(initialData.accName || '');
      setAccountNumber(initialData.accNum || '');
      setAccountType(initialData.accType || '');
      setAccountSubtype(initialData.isHeader ? '' : (initialData.accSubtype || ''));
      setSubAccountOf(initialData.subAccountOf || NO_PARENT_ACCOUNT_VALUE);
      setOpeningBalance(initialData.openingBalance?.toString() || '');
      setOpeningBalanceDate(initialData.openingBalanceDate ? new Date(initialData.openingBalanceDate) : undefined);
      setOriginalId(initialData.id || initialData.accNum);
    } else if (initialSubAccountData) {
      setSubAccountOf(initialSubAccountData.accNum || NO_PARENT_ACCOUNT_VALUE);
      setAccountType(initialSubAccountData.accType || '');
      setAccountSubtype(initialSubAccountData.accSubtype || '');
      // Reset other fields for a new sub-account
      setAccountName('');
      setAccountNumber('');
      setOpeningBalance('');
      setOpeningBalanceDate(undefined);
      setOriginalId(null);
    } else { // 'add_new'
      resetForm();
    }
  }, [initialData, isEditMode, initialSubAccountData, existingAccounts]);

  const resetForm = () => {
    setAccountName('');
    setAccountNumber('');
    setAccountType('');
    setAccountSubtype('');
    setSubAccountOf(NO_PARENT_ACCOUNT_VALUE);
    setOpeningBalance('');
    setOpeningBalanceDate(undefined);
    setOriginalId(null);
  };

  const handleSubmit = (e, closeAfterSave = true) => {
    e.preventDefault();

    if (!accountName || !accountType) {
      toast({
        title: "Validation Error",
        description: "Account Name and Account Type are required.",
        variant: "destructive",
      });
      return;
    }

    const accountData = {
      id: originalId || `acc-${Date.now()}`,
      accName: accountName,
      accNum: accountNumber || (originalId ? originalId.split('-')[1] || String(Date.now()).slice(-4) : String(Date.now()).slice(-4)),
      accType: accountType,
      accSubtype: accountSubtype,
      subAccountOf: subAccountOf === NO_PARENT_ACCOUNT_VALUE ? null : subAccountOf,
      openingBalance: parseFloat(openingBalance) || 0,
      openingBalanceDate: openingBalanceDate ? openingBalanceDate.toISOString().split('T')[0] : null,
      isHeader: false,
    };
    
    onSave(accountData, isEditMode);

    toast({
      title: `Account ${isEditMode ? 'Updated' : 'Saved'}!`,
      description: `${accountName} has been successfully ${isEditMode ? 'updated' : 'added'}.`,
    });

    if (closeAfterSave) {
      onCancel();
    } else if (!isEditMode) {
      resetForm();
    }
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, true)} className="space-y-4 py-2">
       {console.log("Rendering AddAccountForm with:", { accountType, accountSubtype, subAccountOf })}
       <DialogHeader>
        <div className="flex justify-between items-center">
          <DialogTitle>{isEditMode ? 'Edit Account' : 'Add New Account'}</DialogTitle>
        </div>
        <DialogDescription className="hidden">
          {isEditMode ? 'Update the details of the existing account.' : 'Fill in the details to create a new account.'}
        </DialogDescription>
      </DialogHeader>
      <div>
        <Label htmlFor="accountName">Account Name <span className="text-red-500">*</span></Label>
        <Input
          id="accountName"
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
          placeholder="e.g., Main Bank Account"
          className="mt-1"
          required
        />
      </div>
      <div>
        <Label htmlFor="accountNumber">Account Number</Label>
        <Input
          id="accountNumber"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          placeholder="e.g., 1010"
          className="mt-1"
          disabled={isEditMode}
        />
         {isEditMode && <p className="text-xs text-muted-foreground">Account number cannot be changed after creation.</p>}
      </div>
      <div>
        <Label htmlFor="accountType">Account Type <span className="text-red-500">*</span></Label>
        <Select
  onValueChange={(value) => {
    if (value !== accountType) {
      setAccountType(value);
      setAccountSubtype('');
    }
  }}
  value={accountType}
  required
>
          <SelectTrigger id="accountType" className="w-full mt-1">
            <SelectValue placeholder="Select account type" value={accountType} />
          </SelectTrigger>
          <SelectContent>
            {accountTypeOptions.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="accountSubtype">Account Sub-Type <span className="text-red-500">*</span></Label>
        <Select onValueChange={(value) => {
          if (value !== accountType) {
            setAccountType(value);
            if (!initialRender.current) {
              console.log("onValueChange: Resetting accountSubtype (not initial render)");
              setAccountSubtype('');
            }
          }
        }} value={accountType} required>
          <SelectTrigger id="accountSubtype" className="w-full mt-1">
            <SelectValue placeholder="Select account sub-type" value={accountSubtype} />
          </SelectTrigger>
          <SelectContent>
            {accountTypes[accountType]?.map(subtype => {
              console.log("Account Subtype Select Item:", { accountType, subtype, currentAccountSubtype: accountSubtype });
              return (
                <SelectItem key={subtype} value={subtype}>{subtype}</SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="subAccountOf">Sub-Account of</Label>
        <Select onValueChange={setSubAccountOf} value={subAccountOf} key={accountType}>
          <SelectTrigger id="subAccountOf" className="w-full mt-1">
            <SelectValue placeholder="Select parent account">
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NO_PARENT_ACCOUNT_VALUE}>None</SelectItem>
            {existingAccounts.filter(acc => acc.accNum !== originalId && acc.accType === accountType).map(acc => (
              <SelectItem key={acc.accNum} value={acc.accNum}>{acc.accName} ({acc.accNum})</SelectItem>
            ))}
          </SelectContent>
        </Select>
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
        <div>
          <DatePicker
            date={openingBalanceDate}
            setDate={setOpeningBalanceDate}
            className="mt-1 w-full"
            disabled={isEditMode}
          />
        </div>
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
          <Save size={18} className="mr-2" /> {isEditMode ? 'Update Account' : 'Save & Close'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default AddAccountForm;