import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format, parseISO } from 'date-fns';
import { Printer, Search, FilterX, Pencil, PlusCircle, Eye, Edit, Trash2 } from 'lucide-react';
import { DatePicker } from '@/components/ui/date-picker';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import AddPurchaseOrderForm from '@/components/forms/AddPurchaseOrderForm';

const VendorProfileLedger = ({ vendorId, vendorName, onClose, onEditVendor }) => {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [vendorDetails, setVendorDetails] = useState(null);
  const [notes, setNotes] = useState([]);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteDescription, setNoteDescription] = useState('');
  const [noteReminderTime, setNoteReminderTime] = useState(null);
  const [vendorPurchaseOrders, setVendorPurchaseOrders] = useState([]);
  const [orderToView, setOrderToView] = useState(null);
  const [orderToEdit, setOrderToEdit] = useState(null);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [isPurchaseOrderModalOpen, setIsPurchaseOrderModalOpen] = useState(false);
  const [isConfirmDeletePurchaseOrderModalOpen, setIsConfirmDeletePurchaseOrderModalOpen] = useState(false);

  useEffect(() => {
    if (noteToEdit) {
      setNoteTitle(noteToEdit.title || '');
      setNoteDescription(noteToEdit.description || '');
      setNoteReminderTime(noteToEdit.reminderTime ? parseISO(noteToEdit.reminderTime) : null);
    } else {
      setNoteTitle('');
      setNoteDescription('');
      const defaultReminderTime = new Date();
      defaultReminderTime.setHours(10, 0, 0, 0); // Set to 10:00 AM
      setNoteReminderTime(defaultReminderTime);
    }
  }, [noteToEdit]);

  useEffect(() => {
    if (vendorId) {
      const storedNotes = JSON.parse(localStorage.getItem(`vendor_${vendorId}_notes`)) || [];
      setNotes(storedNotes);
    }
  }, [vendorId]);

  const handleSaveNote = () => {
    if (!noteTitle || !noteDescription) {
      toast({ title: 'Error', description: 'Title and Description are required for a note.', variant: 'destructive' });
      return;
    }

    const newNote = {
      id: noteToEdit ? noteToEdit.id : `note-${Date.now()}`,
      title: noteTitle,
      description: noteDescription,
      reminderTime: noteReminderTime ? noteReminderTime.toISOString() : null,
      creationDate: noteToEdit ? noteToEdit.creationDate : new Date().toISOString(),
    };

    let updatedNotes;
    if (noteToEdit) {
      updatedNotes = notes.map(note => note.id === newNote.id ? newNote : note);
      toast({ title: 'Success', description: 'Note updated successfully.' });
    } else {
      updatedNotes = [...notes, newNote];
      toast({ title: 'Success', description: 'Note added successfully.' });
    }
    localStorage.setItem(`vendor_${vendorId}_notes`, JSON.stringify(updatedNotes));
    setNotes(updatedNotes);
    setIsAddingNote(false);
    setNoteToEdit(null);
    setNoteTitle('');
    setNoteDescription('');
    setNoteReminderTime(null);
  };

  const handleEditNote = (note) => {
    setNoteToEdit(note);
    setIsAddingNote(true);
  };

  const handleDeleteNote = (noteId) => {
    const updatedNotes = notes.filter(note => note.id !== noteId);
    localStorage.setItem(`vendor_${vendorId}_notes`, JSON.stringify(updatedNotes));
    setNotes(updatedNotes);
    toast({ title: 'Success', description: 'Note deleted successfully.' });
  };

  const handleViewPurchaseOrder = (order) => {
    setOrderToView(order);
    setIsPurchaseOrderModalOpen(true);
  };

  const handleEditPurchaseOrder = (order) => {
    setOrderToEdit(order);
    setIsPurchaseOrderModalOpen(true);
  };

  const handleDeletePurchaseOrder = (order) => {
    setOrderToDelete(order);
    setIsConfirmDeletePurchaseOrderModalOpen(true);
  };

  const confirmDeletePurchaseOrder = () => {
    if (orderToDelete) {
      const allPurchaseOrders = JSON.parse(localStorage.getItem('purchaseOrders') || '[]');
      const updatedOrders = allPurchaseOrders.filter(order => order.orderNumber !== orderToDelete.orderNumber);
      localStorage.setItem('purchaseOrders', JSON.stringify(updatedOrders));
      setVendorPurchaseOrders(updatedOrders.filter(order => order.vendor === vendorId)); // Update vendor-specific list
      toast({ title: "Order Deleted", description: `Purchase Order ${orderToDelete.orderNumber} has been deleted.`, variant: "destructive" });
      setIsConfirmDeletePurchaseOrderModalOpen(false);
      setOrderToDelete(null);
    }
  };

  const handleSavePurchaseOrder = () => {
    const storedPurchaseOrders = JSON.parse(localStorage.getItem('purchaseOrders') || '[]');
    const filteredOrders = storedPurchaseOrders.filter(order => order.vendor === vendorId);
    setVendorPurchaseOrders(filteredOrders);
    setIsPurchaseOrderModalOpen(false);
    setOrderToEdit(null);
    setOrderToView(null);
  };
  

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

  

  useEffect(() => {
    if (vendorId) {
      const storedPurchaseOrders = JSON.parse(localStorage.getItem('purchaseOrders')) || [];
      const filteredOrders = storedPurchaseOrders.filter(order => order.vendor === vendorId);
      setVendorPurchaseOrders(filteredOrders);
    }
  }, [vendorId]);

  return (
    <Card className="shadow-xl border-border dark:border-dark-border">
      <CardContent className="p-4 md:p-6 space-y-4">
        {vendorDetails && (
          <div className="relative p-3 bg-primary/5 dark:bg-dark-primary/10 rounded-md border border-primary/20 dark:border-dark-primary/20 mb-4">
            <h3 className="text-lg font-semibold text-primary dark:text-dark-primary">{vendorDetails.name}</h3>
            <p className="text-sm text-muted-foreground dark:text-dark-muted-foreground">
              Vendor ID: {vendorDetails.vendorNumber || vendorDetails.id}
            </p>
            <p className="text-sm text-muted-foreground dark:text-dark-muted-foreground">
              Address: {vendorDetails.address || 'N/A'}
            </p>
            <p className="text-sm text-muted-foreground dark:text-dark-muted-foreground">
              Phone: {vendorDetails.phoneNumber || 'N/A'} | Email: {vendorDetails.email || 'N/A'}
            </p>
            <p className="text-sm text-muted-foreground dark:text-dark-muted-foreground">
              Credit Limit: {vendorDetails.creditLimit ? parseFloat(vendorDetails.creditLimit).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : 'N/A'}
            </p>
            <p className="text-sm text-muted-foreground dark:text-dark-muted-foreground">
              Bank Details: {vendorDetails.bankDetails || 'N/A'}
            </p>
            <p className="text-sm text-muted-foreground dark:text-dark-muted-foreground mt-2">
              Notes: {vendorDetails.notes || 'N/A'}
            </p>
          </div>
        )}

        <Tabs defaultValue="transactions" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="purchase-orders">Purchase Orders</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="attachments">Attachments</TabsTrigger>
          </TabsList>
          <TabsContent value="transactions" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div className="space-y-1">
                <label htmlFor="startDate" className="text-sm font-medium text-muted-foreground dark:text-dark-muted-foreground">From Date</label>
                <DatePicker date={startDate} setDate={setStartDate} id="startDate" placeholder="Start Date"/>
              </div>
              <div className="space-y-1">
                <label htmlFor="endDate" className="text-sm font-medium text-muted-foreground dark:text-dark-muted-foreground">To Date</label>
                <DatePicker date={endDate} setDate={setEndDate} id="endDate" placeholder="End Date"/>
              </div>
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
          </TabsContent>
          <TabsContent value="purchase-orders" className="space-y-4 pt-4">
            <div className="overflow-x-auto rounded-lg border border-border dark:border-dark-border shadow-md">
              <Table className="min-w-[800px]">
                <TableHeader className="bg-muted/50 dark:bg-dark-muted/50">
                  <TableRow>
                    <TableHead className="px-4 py-3 text-left text-xs font-medium text-muted-foreground dark:text-dark-muted-foreground uppercase tracking-wider">Order No.</TableHead>
                    <TableHead className="px-4 py-3 text-left text-xs font-medium text-muted-foreground dark:text-dark-muted-foreground uppercase tracking-wider">Order Date</TableHead>
                    <TableHead className="px-4 py-3 text-left text-xs font-medium text-muted-foreground dark:text-dark-muted-foreground uppercase tracking-wider">Memo</TableHead>
                    <TableHead className="px-4 py-3 text-right text-xs font-medium text-muted-foreground dark:text-dark-muted-foreground uppercase tracking-wider">Total Amount</TableHead>
                    <TableHead className="px-4 py-3 text-left text-xs font-medium text-muted-foreground dark:text-dark-muted-foreground uppercase tracking-wider">Status</TableHead>
                    <TableHead className="px-4 py-3 text-center text-xs font-medium text-muted-foreground dark:text-dark-muted-foreground uppercase tracking-wider">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-card dark:bg-dark-card divide-y divide-border dark:divide-dark-border">
                  {vendorPurchaseOrders.length > 0 ? (
                    vendorPurchaseOrders.map((order) => {
                      const totalAmount = order.lineItems.reduce((sum, item) => sum + (item.rateForBillingUnit * item.quantityInput), 0);
                      return (
                        <TableRow key={order.orderNumber}>
                          <TableCell className="px-4 py-3 text-muted-foreground dark:text-dark-muted-foreground">{order.orderNumber}</TableCell>
                          <TableCell className="px-4 py-3 text-muted-foreground dark:text-dark-muted-foreground">{format(new Date(order.orderDate), 'dd-MMM-yyyy')}</TableCell>
                          <TableCell className="px-4 py-3 text-muted-foreground dark:text-dark-muted-foreground">{order.memo || '-'}</TableCell>
                          <TableCell className="px-4 py-3 text-right font-semibold text-foreground dark:text-dark-foreground">{totalAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
                          <TableCell className="px-4 py-3">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.isDraft ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                              {order.isDraft ? 'Draft' : 'Finalized'}
                            </span>
                          </TableCell>
                          <TableCell className="px-4 py-3 text-center space-x-2">
                            <Button variant="ghost" size="icon" className="text-blue-600 hover:text-blue-800" onClick={() => handleViewPurchaseOrder(order)}><Eye size={18} /></Button>
                            <Button variant="ghost" size="icon" className="text-green-600 hover:text-green-800" onClick={() => handleEditPurchaseOrder(order)}><Edit size={18} /></Button>
                            <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-800" onClick={() => handleDeletePurchaseOrder(order)}><Trash2 size={18} /></Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-muted-foreground dark:text-dark-muted-foreground">
                        No purchase orders found for this vendor.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <Dialog open={isPurchaseOrderModalOpen || !!orderToView} onOpenChange={(open) => {
              if (!open) {
                setIsPurchaseOrderModalOpen(false);
                setOrderToView(null);
                setOrderToEdit(null);
              }
            }}>
              <DialogContent className="sm:max-w-[1200px] h-[90vh] bg-card dark:bg-dark-card text-foreground dark:text-dark-foreground border-border dark:border-dark-border shadow-2xl rounded-lg">
                <DialogHeader>
                  <DialogTitle className="text-primary dark:text-dark-primary text-2xl font-semibold">
                    {orderToView ? 'Purchase Order Details' : orderToEdit ? 'Edit Purchase Order' : 'Create New Purchase Order'}
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground dark:text-dark-muted-foreground">
                    {orderToView ? 'Details of the selected purchase order.' : orderToEdit ? 'Edit the details of the purchase order.' : 'Fill in the details to create a new purchase order.'}
                  </DialogDescription>
                </DialogHeader>
                {orderToView ? (
                  <div className="space-y-4 py-4">
                    <p><strong>Order Number:</strong> {orderToView.orderNumber}</p>
                    <p><strong>Supplier:</strong> {vendorName || 'N/A'}</p>
                    <p><strong>Order Date:</strong> {format(new Date(orderToView.orderDate), 'dd-MMM-yyyy')}</p>
                    <p><strong>Expected Delivery Date:</strong> {format(new Date(orderToView.expectedDeliveryDate), 'dd-MMM-yyyy')}</p>
                    <p><strong>Memo:</strong> {orderToView.memo || 'N/A'}</p>
                    <p><strong>Shipping Address:</strong> {orderToView.shippingAddress || 'N/A'}</p>
                    <p><strong>Drop Ship To:</strong> {orderToView.dropShipToCustomer ? (vendorName || 'N/A') : 'N/A'}</p>
                    <h4 className="font-semibold mt-4">Line Items:</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Rate</TableHead>
                          <TableHead>Discount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orderToView.lineItems.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.productName}</TableCell>
                            <TableCell>{item.quantityInput} {item.quantityUnitName}</TableCell>
                            <TableCell>{item.rateForBillingUnit} per {item.billingUnitName}</TableCell>
                            <TableCell>{item.discountPercent > 0 ? `${item.discountPercent}%` : item.discountAmount > 0 ? `${item.discountAmount}` : 'N/A'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <p><strong>Notes:</strong> {orderToView.notes || 'N/A'}</p>
                  </div>
                ) : (
                  <AddPurchaseOrderForm
                    onSave={handleSavePurchaseOrder}
                    onCancel={() => {
                      setIsPurchaseOrderModalOpen(false);
                      setOrderToEdit(null);
                    }}
                    initialData={orderToEdit}
                  />
                )}
              </DialogContent>
            </Dialog>

            <AlertDialog open={isConfirmDeletePurchaseOrderModalOpen} onOpenChange={setIsConfirmDeletePurchaseOrderModalOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the purchase order
                    "{orderToDelete?.orderNumber}".
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <Button variant="outline" onClick={() => setIsConfirmDeletePurchaseOrderModalOpen(false)}>Cancel</Button>
                  <Button variant="destructive" onClick={confirmDeletePurchaseOrder}>
                    Yes, delete order
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </TabsContent>
          
            <TabsContent value="notes">
            <div className="p-4 text-muted-foreground dark:text-dark-muted-foreground">
              <div className="flex justify-end mb-4">
                <Button onClick={() => {
                  setIsAddingNote(true);
                  setNoteToEdit(null);
                }}>
                  <PlusCircle size={18} className="mr-2" /> Add New Note
                </Button>
              </div>
              <div className="overflow-x-auto border border-border dark:border-dark-border rounded-lg">
                <Table>
                  <TableHeader className="bg-muted dark:bg-dark-muted">
                    <TableRow>
                      <TableHead className="w-[50px]">Sl No</TableHead>
                      <TableHead>Creation Date</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Reminder Time</TableHead>
                      <TableHead className="text-center w-[120px]">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {notes.length > 0 ? (
                      notes.map((note, index) => (
                        <TableRow key={note.id} className="hover:bg-muted/50 dark:hover:bg-dark-muted/50">
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{note.creationDate ? format(parseISO(note.creationDate), 'dd-MMM-yyyy HH:mm') : 'N/A'}</TableCell>
                          <TableCell>{note.title}</TableCell>
                          <TableCell>{note.description}</TableCell>
                          <TableCell>{note.reminderTime ? format(parseISO(note.reminderTime), 'dd-MMM-yyyy HH:mm') : 'N/A'}</TableCell>
                          <TableCell className="text-center space-x-1">
                            <Button variant="ghost" size="icon" onClick={() => handleEditNote(note)}>
                              <Edit size={16} />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteNote(note.id)}>
                              <Trash2 size={16} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center h-24 text-muted-foreground dark:text-dark-muted-foreground">
                          No notes found for this vendor.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
            <Dialog open={isAddingNote} onOpenChange={setIsAddingNote}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{noteToEdit ? 'Edit Note' : 'Add New Note'}</DialogTitle>
                  <DialogDescription>
                    {noteToEdit ? 'Edit the details of your note.' : 'Add a new note for this vendor.'}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="noteTitle" className="text-right">Title</Label>
                    <Input id="noteTitle" value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="noteDescription" className="text-right">Description</Label>
                    <Textarea id="noteDescription" value={noteDescription} onChange={(e) => setNoteDescription(e.target.value)} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="noteReminderTime" className="text-right">Reminder Time</Label>
                    <DatePicker date={noteReminderTime} setDate={(newDate) => {
                      if (newDate) {
                        newDate.setHours(10, 0, 0, 0); // Always set to 10:00 AM
                      }
                      setNoteReminderTime(newDate);
                    }} id="noteReminderTime" className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddingNote(false)}>Cancel</Button>
                  <Button onClick={handleSaveNote}>{noteToEdit ? 'Save Changes' : 'Add Note'}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>
          <TabsContent value="attachments">
            <div className="p-4 text-muted-foreground dark:text-dark-muted-foreground">
              Attachments content will go here.
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default VendorProfileLedger;