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
  const [isHeaderAccount, setIsHeaderAccount] = useState(false);
  const [originalId, setOriginalId] = useState(null);
  const [displaySubAccountOf, setDisplaySubAccountOf] = useState("Select parent account (optional)");

  useEffect(() => {
    if (isEditMode && initialData) {
      setAccountName(initialData.accName || '');
      setAccountNumber(initialData.accNum || '');
      setAccountType(initialData.accType || '');
      setAccountSubtype(initialData.accSubtype || '');
      setSubAccountOf(initialData.subAccountOf || NO_PARENT_ACCOUNT_VALUE);
      setOpeningBalance(initialData.openingBalance?.toString() || '');
      setOpeningBalanceDate(initialData.openingBalanceDate ? new Date(initialData.openingBalanceDate) : undefined);
      setIsHeaderAccount(initialData.isHeader || false);
      setOriginalId(initialData.id || initialData.accNum);
      // For edit mode, also set the display string if a subAccountOf exists
      const parentAccount = existingAccounts.find(acc => acc.accNum === initialData.subAccountOf);
      if (parentAccount) {
        setDisplaySubAccountOf(`${parentAccount.accName} (${parentAccount.accNum})`);
      } else {
        setDisplaySubAccountOf("Select parent account (optional)");
      }
    } else if (initialSubAccountData) {
      setSubAccountOf(initialSubAccountData.subAccountOf || NO_PARENT_ACCOUNT_VALUE);
      setAccountType(initialSubAccountData.accType || '');
      setAccountSubtype(initialSubAccountData.accSubtype || '');
      // Find the parent account and set the display string
      const parentAccount = existingAccounts.find(acc => acc.accNum === initialSubAccountData.subAccountOf);
      if (parentAccount) {
        setDisplaySubAccountOf(`${parentAccount.accName} (${parentAccount.accNum})`);
      } else {
        setDisplaySubAccountOf("Select parent account (optional)");
      }
      // Reset other fields for a new sub-account
      setAccountName('');
      setAccountNumber('');
      setOpeningBalance('');
      setOpeningBalanceDate(undefined);
      setIsHeaderAccount(false);
      setOriginalId(null);
    } else {
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
    setIsHeaderAccount(false);
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
      openingBalance: !isHeaderAccount ? parseFloat(openingBalance) || 0 : 0,
      openingBalanceDate: !isHeaderAccount && openingBalanceDate ? openingBalanceDate.toISOString().split('T')[0] : null,
      isHeader: isHeaderAccount,
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
       <DialogHeader>
        <div className="flex justify-between items-center">
          <DialogTitle>{isEditMode ? 'Edit Account' : 'Add New Account'}</DialogTitle>
          <div className="flex items-center space-x-2">
            <Checkbox id="isHeader" checked={isHeaderAccount} onCheckedChange={setIsHeaderAccount} />
            <Label htmlFor="isHeader">This is a Header Account</Label>
          </div>
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
        <Select onValueChange={(value) => { setAccountType(value); setAccountSubtype(''); }} value={accountType} required>
          <SelectTrigger id="accountType" className="w-full mt-1">
            <SelectValue placeholder="Select account type" />
          </SelectTrigger>
          <SelectContent>
            {accountTypeOptions.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {accountType && (
        <div>
          <Label htmlFor="accountSubtype">Account Sub-Type <span className="text-red-500">*</span></Label>
          <Select onValueChange={setAccountSubtype} value={accountSubtype} required>
            <SelectTrigger id="accountSubtype" className="w-full mt-1">
              <SelectValue placeholder="Select account sub-type" />
            </SelectTrigger>
            <SelectContent>
              {accountTypes[accountType]?.map(subtype => (
                <SelectItem key={subtype} value={subtype}>{subtype}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <div>
        <Label htmlFor="subAccountOf">Sub-Account of</Label>
        <Select onValueChange={setSubAccountOf} value={subAccountOf}>
          <SelectTrigger id="subAccountOf" className="w-full mt-1">
            <SelectValue>{displaySubAccountOf}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NO_PARENT_ACCOUNT_VALUE}>None</SelectItem>
            {existingAccounts.filter(acc => acc.accNum !== originalId && acc.isHeader && acc.accType === accountType && acc.accSubtype === accountSubtype).map(acc => (
              <SelectItem key={acc.accNum} value={acc.accNum}>{acc.accName} ({acc.accNum})</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {!isHeaderAccount && (
        <div>
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
        </div>
      )}
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