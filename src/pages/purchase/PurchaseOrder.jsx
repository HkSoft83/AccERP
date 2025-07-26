import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, ShoppingCart, Eye, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import AddPurchaseOrderForm from '@/components/forms/AddPurchaseOrderForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';

const PurchaseOrder = () => {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [orderToView, setOrderToView] = useState(null);
  const [orderToEdit, setOrderToEdit] = useState(null);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem('purchaseOrders') || '[]');
    setPurchaseOrders(storedOrders);
    const storedVendors = JSON.parse(localStorage.getItem('vendors') || '[]');
    setVendors(storedVendors);
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveOrder = () => {
    const updatedOrders = JSON.parse(localStorage.getItem('purchaseOrders') || '[]');
    setPurchaseOrders(updatedOrders);
    handleCloseModal();
  };

  const handleViewOrder = (order) => {
    setOrderToView(order);
  };

  const handleEditOrder = (order) => {
    setOrderToEdit(order);
    setIsModalOpen(true);
  };

  const handleDeleteOrder = (order) => {
    setOrderToDelete(order);
    setIsConfirmDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (orderToDelete) {
      const updatedOrders = purchaseOrders.filter(order => order.orderNumber !== orderToDelete.orderNumber);
      localStorage.setItem('purchaseOrders', JSON.stringify(updatedOrders));
      setPurchaseOrders(updatedOrders);
      toast({ title: "Order Deleted", description: `Purchase Order ${orderToDelete.orderNumber} has been deleted.`, variant: "destructive" });
      setIsConfirmDeleteModalOpen(false);
      setOrderToDelete(null);
    }
  };
  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-border dark:border-dark-border">
        <CardHeader className="bg-card dark:bg-dark-card rounded-t-lg p-4 md:p-6 border-b border-border dark:border-dark-border">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <CardTitle className="text-2xl md:text-3xl font-bold text-primary dark:text-dark-primary flex items-center">
              <ShoppingCart size={28} className="mr-3 text-accent dark:text-dark-accent" /> Purchase Orders
            </CardTitle>
            <Button 
              className="bg-primary text-primary-foreground hover:bg-primary-hover dark:bg-dark-primary dark:text-dark-primary-foreground dark:hover:bg-dark-primary-hover shadow-sm"
              onClick={handleOpenModal}
            >
              <PlusCircle size={20} className="mr-2" /> Create Purchase Order
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <Dialog open={isModalOpen || !!orderToView} onOpenChange={(open) => {
            if (!open) {
              handleCloseModal();
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
                  <p><strong>Supplier:</strong> {vendors.find(v => v.id === orderToView.vendor)?.name || 'N/A'}</p>
                  <p><strong>Order Date:</strong> {format(new Date(orderToView.orderDate), 'dd-MMM-yyyy')}</p>
                  <p><strong>Expected Delivery Date:</strong> {format(new Date(orderToView.expectedDeliveryDate), 'dd-MMM-yyyy')}</p>
                  <p><strong>Memo:</strong> {orderToView.memo || 'N/A'}</p>
                  <p><strong>Shipping Address:</strong> {orderToView.shippingAddress || 'N/A'}</p>
                  <p><strong>Drop Ship To:</strong> {orderToView.dropShipToCustomer ? (vendors.find(c => c.id === orderToView.dropShipToCustomer)?.name || 'N/A') : 'N/A'}</p>
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
                  onSave={handleSaveOrder} 
                  onCancel={handleCloseModal} 
                  initialData={orderToEdit}
                />
              )}
            </DialogContent>
          </Dialog>

          <AlertDialog open={isConfirmDeleteModalOpen} onOpenChange={setIsConfirmDeleteModalOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the purchase order
                  "{orderToDelete?.orderNumber}".
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <Button variant="outline" onClick={() => setIsConfirmDeleteModalOpen(false)}>Cancel</Button>
                <Button variant="destructive" onClick={confirmDelete}>
                  Yes, delete order
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <div className="overflow-x-auto rounded-lg border border-border dark:border-dark-border shadow-md">
            <Table className="min-w-[800px]">
              <TableHeader className="bg-muted/50 dark:bg-dark-muted/50">
                <TableRow>
                  <TableHead className="px-4 py-3 text-left text-xs font-medium text-muted-foreground dark:text-dark-muted-foreground uppercase tracking-wider">Supplier</TableHead>
                  <TableHead className="px-4 py-3 text-left text-xs font-medium text-muted-foreground dark:text-dark-muted-foreground uppercase tracking-wider">Order No.</TableHead>
                  <TableHead className="px-4 py-3 text-left text-xs font-medium text-muted-foreground dark:text-dark-muted-foreground uppercase tracking-wider">Order Date</TableHead>
                  <TableHead className="px-4 py-3 text-left text-xs font-medium text-muted-foreground dark:text-dark-muted-foreground uppercase tracking-wider">Memo</TableHead>
                  <TableHead className="px-4 py-3 text-right text-xs font-medium text-muted-foreground dark:text-dark-muted-foreground uppercase tracking-wider">Total Amount</TableHead>
                  <TableHead className="px-4 py-3 text-left text-xs font-medium text-muted-foreground dark:text-dark-muted-foreground uppercase tracking-wider">Status</TableHead>
                  <TableHead className="px-4 py-3 text-center text-xs font-medium text-muted-foreground dark:text-dark-muted-foreground uppercase tracking-wider">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-card dark:bg-dark-card divide-y divide-border dark:divide-dark-border">
                {purchaseOrders.length > 0 ? (
                  purchaseOrders.map((order) => {
                    const supplier = vendors.find(v => v.id === order.vendor);
                    const totalAmount = order.lineItems.reduce((sum, item) => sum + (item.rateForBillingUnit * item.quantityInput), 0);
                    return (
                      <TableRow key={order.orderNumber}>
                        <TableCell className="px-4 py-3 font-medium text-foreground dark:text-dark-foreground">{supplier ? supplier.name : 'N/A'}</TableCell>
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
                          <Button variant="ghost" size="icon" className="text-blue-600 hover:text-blue-800" onClick={() => handleViewOrder(order)}><Eye size={18} /></Button>
                          <Button variant="ghost" size="icon" className="text-green-600 hover:text-green-800" onClick={() => handleEditOrder(order)}><Edit size={18} /></Button>
                          <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-800" onClick={() => handleDeleteOrder(order)}><Trash2 size={18} /></Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground dark:text-dark-muted-foreground">
                      No purchase orders found. Click "Create Purchase Order" to add one.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default PurchaseOrder;