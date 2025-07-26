import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format, parseISO } from 'date-fns';
import { Printer, Search, FilterX, Pencil, X, Save } from 'lucide-react';
import { DatePicker } from '@/components/ui/date-picker';

const VendorProfileLedger = ({ vendorId, vendorName, onClose }) => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [vendorDetails, setVendorDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDetails, setEditedDetails] = useState({});

  useEffect(() => {
    const storedVendors = JSON.parse(localStorage.getItem('vendors')) || [];
    const currentVendor = storedVendors.find(v => v.id === vendorId);
    setVendorDetails(currentVendor);
  }, [vendorId]);

  useEffect(() => {
    if (!vendorId) return;

    // Mock transaction fetching logic for a vendor.
    const purchaseBills = JSON.parse(localStorage.getItem('purchaseBills')) || [];
    const payments = JSON.parse(localStorage.getItem('payments')) || [];
    const purchaseReturns = JSON.parse(localStorage.getItem('purchaseReturns')) || [];
    const debitNotes = JSON.parse(localStorage.getItem('debitNotes')) || [];

    const vendorTransactions = [];

    purchaseBills
      .filter(bill => bill.vendorId === vendorId)
      .forEach(bill => vendorTransactions.push({
        date: parseISO(bill.billDate),
        type: 'Purchase Bill',
        ref: bill.billNumber,
        narration: `Bill for ${bill.lineItems?.length || 0} items`,
        debit: 0, // Purchase bills increase payable (credit to vendor)
        credit: parseFloat(bill.grandTotal) || 0,
      }));

    payments
      .filter(pay => pay.paidTo === vendorId) // Assuming paidTo holds vendorId for payments
      .forEach(pay => vendorTransactions.push({
        date: parseISO(pay.date),
        type: 'Payment',
        ref: pay.paymentNumber,
        narration: pay.narration || 'Payment made',
        debit: parseFloat(pay.amount) || 0, // Payments decrease payable (debit to vendor)
        credit: 0,
      }));
    
    purchaseReturns
      .filter(ret => ret.vendorId === vendorId)
      .forEach(ret => vendorTransactions.push({
          date: parseISO(ret.returnDate),
          type: 'Purchase Return',
          ref: ret.returnNumber,
          narration: `Return of ${ret.lineItems?.length || 0} items`,
          debit: parseFloat(ret.grandTotal) || 0, // Purchase returns decrease payable (debit to vendor)
          credit: 0,
      }));

    debitNotes
      .filter(dn => dn.creditAccount === vendorId) // Assuming creditAccount is vendor for DN
      .forEach(dn => vendorTransactions.push({
          date: parseISO(dn.date),
          type: 'Debit Note',
          ref: dn.debitNoteNumber,
          narration: dn.narration || 'Debit issued',
          debit: parseFloat(dn.amount) || 0, // Debit notes decrease payable (debit to vendor)
          credit: 0,
      }));

    setTransactions(vendorTransactions);
  }, [vendorId]);

  useEffect(() => {
    if (vendorDetails) {
      setEditedDetails(vendorDetails);
    }
  }, [vendorDetails]);

  const processedTransactions = useMemo(() => {
    if (!vendorDetails) return [];

    let runningBalance = vendorDetails.openingBalance; // Vendor balance: Credit is positive (payable)
    const openingBalanceDate = vendorDetails.openingBalanceDate ? parseISO(vendorDetails.openingBalanceDate) : new Date(new Date().getFullYear(), 0, 1);

    const ledgerEntries = [];
    ledgerEntries.push({
      date: openingBalanceDate,
      type: 'Opening Balance',
      ref: '-',
      narration: 'Opening Balance',
      debit: vendorDetails.openingBalance < 0 ? Math.abs(vendorDetails.openingBalance) : 0, // If opening balance is debit (negative payable)
      credit: vendorDetails.openingBalance >= 0 ? vendorDetails.openingBalance : 0, // If opening balance is credit (positive payable)
      balance: runningBalance,
    });

    const sortedTransactions = [...transactions]
      .sort((a, b) => a.date - b.date);

    sortedTransactions.forEach(tx => {
      runningBalance += (tx.credit || 0) - (tx.debit || 0); // For vendors, credit increases balance, debit decreases
      ledgerEntries.push({ ...tx, balance: runningBalance });
    });

    return ledgerEntries;
  }, [transactions, vendorDetails]);

  useEffect(() => {
    let filtered = processedTransactions;
    if (startDate) filtered = filtered.filter(tx => tx.date >= startDate);
    if (endDate) filtered = filtered.filter(tx => tx.date <= endDate);
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(tx =>
        tx.type.toLowerCase().includes(lowerSearchTerm) ||
        tx.ref.toLowerCase().includes(lowerSearchTerm) ||
        tx.narration.toLowerCase().includes(lowerSearchTerm)
      );
    }
    setFilteredTransactions(filtered);
  }, [processedTransactions, startDate, endDate, searchTerm]);

  const handlePrint = () => window.print();
  const clearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setSearchTerm('');
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedDetails(vendorDetails);
  };

  const handleSave = () => {
    setVendorDetails(editedDetails);
    setIsEditing(false);
    // Here you would typically call an API to save the changes
  };

  const handleViewAttachments = () => {
    console.log('View Attachments clicked for vendor:', vendorId);
    // Placeholder for attachment viewing logic
  };

  const handleViewPurchaseOrders = () => {
    console.log('View Purchase Orders clicked for vendor:', vendorId);
    // Placeholder for purchase order viewing logic
  };

  return (
    <Card className="shadow-xl border-border dark:border-dark-border">
      
      <CardContent className="p-4 md:p-6 space-y-4">
        {vendorDetails && (
          <div className="relative p-3 bg-primary/5 dark:bg-dark-primary/10 rounded-md border border-primary/20 dark:border-dark-primary/20 mb-4">
            {isEditing ? (
              <div className="absolute top-2 right-2 flex space-x-2">
                <Button variant="outline" size="icon" onClick={handleSave}><Save className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon" onClick={handleCancel}><X className="h-4 w-4" /></Button>
              </div>
            ) : (
              <Button variant="outline" size="icon" className="absolute top-2 right-2" onClick={handleEdit}><Pencil className="h-4 w-4" /></Button>
            )}
            <h3 className="text-lg font-semibold text-primary dark:text-dark-primary">{isEditing ? <Input value={editedDetails.name} onChange={(e) => setEditedDetails({...editedDetails, name: e.target.value})} /> : vendorDetails.name}</h3>
            <p className="text-sm text-muted-foreground dark:text-dark-muted-foreground">
              Vendor ID: {vendorDetails.vendorNumber || vendorDetails.id}
            </p>
            <p className="text-sm text-muted-foreground dark:text-dark-muted-foreground">
              Address: {isEditing ? <Input value={editedDetails.address} onChange={(e) => setEditedDetails({...editedDetails, address: e.target.value})} /> : vendorDetails.address || 'N/A'}
            </p>
            <p className="text-sm text-muted-foreground dark:text-dark-muted-foreground">
              Phone: {isEditing ? <Input value={editedDetails.phoneNumber} onChange={(e) => setEditedDetails({...editedDetails, phoneNumber: e.target.value})} /> : vendorDetails.phoneNumber || 'N/A'} | Email: {isEditing ? <Input value={editedDetails.email} onChange={(e) => setEditedDetails({...editedDetails, email: e.target.value})} /> : vendorDetails.email || 'N/A'}
            </p>
            <p className="text-sm text-muted-foreground dark:text-dark-muted-foreground">
              Credit Limit: {isEditing ? <Input type="number" value={editedDetails.creditLimit} onChange={(e) => setEditedDetails({...editedDetails, creditLimit: e.target.value})} /> : vendorDetails.creditLimit ? parseFloat(vendorDetails.creditLimit).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : 'N/A'}
            </p>
            <p className="text-sm text-muted-foreground dark:text-dark-muted-foreground">
              Bank Account: {isEditing ? <Input value={editedDetails.bankAccountNo} onChange={(e) => setEditedDetails({...editedDetails, bankAccountNo: e.target.value})} /> : vendorDetails.bankAccountNo || 'N/A'}
            </p>
            <p className="text-sm text-muted-foreground dark:text-dark-muted-foreground mt-2">
              Notes: {isEditing ? <Input value={editedDetails.notes} onChange={(e) => setEditedDetails({...editedDetails, notes: e.target.value})} /> : vendorDetails.notes || 'N/A'}
            </p>
            <p className="text-sm text-muted-foreground dark:text-dark-muted-foreground">
              Opening Balance: {isEditing ? <Input type="number" value={editedDetails.openingBalance} onChange={(e) => setEditedDetails({...editedDetails, openingBalance: e.target.value})} /> : parseFloat(vendorDetails.openingBalance || 0).toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })} as of {isEditing ? <DatePicker date={editedDetails.openingBalanceDate ? parseISO(editedDetails.openingBalanceDate) : null} setDate={(date) => setEditedDetails({...editedDetails, openingBalanceDate: date.toISOString()})} /> : vendorDetails.openingBalanceDate ? format(parseISO(vendorDetails.openingBalanceDate), 'dd-MMM-yyyy') : 'N/A'}
            </p>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
          <div className="space-y-1">
            <label htmlFor="startDate" className="text-sm font-medium text-muted-foreground dark:text-dark-muted-foreground">From Date</label>
            <DatePicker date={startDate} setDate={setStartDate} id="startDate" placeholder="Start Date"/>
          </div>
          <div className="space-y-1">
            <label htmlFor="endDate" className="text-sm font-medium text-muted-foreground dark:text-dark-muted-foreground">To Date</label>
            <DatePicker date={endDate} setDate={setEndDate} id="endDate" placeholder="End Date"/>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 items-center pt-2">
          <div className="relative flex-grow w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground dark:text-dark-muted-foreground" />
            <Input
              type="search"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-full"
            />
          </div>
          <Button onClick={clearFilters} variant="outline" size="sm" className="w-full sm:w-auto">
            <FilterX size={16} className="mr-2"/> Clear Filters
          </Button>
        </div>

        <div className="overflow-x-auto border border-border dark:border-dark-border rounded-lg">
          <Table>
            <TableHeader className="bg-muted dark:bg-dark-muted">
              <TableRow>
                <TableHead className="w-[50px]">Sl No</TableHead>
                <TableHead className="w-[100px]">Date</TableHead>
                <TableHead>Type / Ref#</TableHead>
                <TableHead>Narration</TableHead>
                <TableHead className="text-right">Debit</TableHead>
                <TableHead className="text-right">Credit</TableHead>
                <TableHead className="text-right">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx, index) => (
                  <TableRow key={index} className="hover:bg-muted/50 dark:hover:bg-dark-muted/50">
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{format(tx.date, 'dd-MMM-yy')}</TableCell>
                    <TableCell>
                      <div className="font-medium">{tx.type}</div>
                      <div className="text-xs text-muted-foreground dark:text-dark-muted-foreground">{tx.ref}</div>
                    </TableCell>
                    <TableCell>{tx.narration}</TableCell>
                    <TableCell className="text-right">{(tx.debit || 0) > 0 ? (tx.debit || 0).toFixed(2) : '-'}</TableCell>
                    <TableCell className="text-right">{(tx.credit || 0) > 0 ? (tx.credit || 0).toFixed(2) : '-'}</TableCell>
                    <TableCell className="text-right font-semibold">{tx.balance.toFixed(2)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24 text-muted-foreground dark:text-dark-muted-foreground">
                    No transactions found for this vendor.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
         {filteredTransactions.length > 0 && (
          <div className="flex justify-end pt-2 text-sm font-semibold text-primary dark:text-dark-primary">
            Final Balance: {filteredTransactions[filteredTransactions.length -1].balance.toFixed(2)}
             { filteredTransactions[filteredTransactions.length -1].balance >= 0 ? " (Payable)" : " (Receivable)"}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VendorProfileLedger;