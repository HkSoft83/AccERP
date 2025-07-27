import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const SalesOrder = () => {
  const [salesOrders, setSalesOrders] = useState([]);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadSalesOrders();
  }, []);

  const loadSalesOrders = () => {
    const storedSalesOrders = JSON.parse(localStorage.getItem('salesOrders') || '[]');
    setSalesOrders(storedSalesOrders);
  };

  const handleDeleteOrder = (orderId) => {
    const order = salesOrders.find(so => so.id === orderId);
    if (order) {
      setOrderToDelete(order);
      setIsConfirmDeleteModalOpen(true);
    }
  };

  const confirmDelete = () => {
    if (orderToDelete) {
      const updatedSalesOrders = salesOrders.filter(so => so.id !== orderToDelete.id);
      localStorage.setItem('salesOrders', JSON.stringify(updatedSalesOrders));
      setSalesOrders(updatedSalesOrders);
      toast({ title: "Sales Order Deleted", description: `Sales Order ${orderToDelete.id} has been deleted.`, variant: "destructive" });
      setIsConfirmDeleteModalOpen(false);
      setOrderToDelete(null);
    }
  };

  return (
    <div className="space-y-6 p-1">
      <Card className="shadow-lg border-border dark:border-dark-border">
        <CardHeader className="bg-card dark:bg-dark-card rounded-t-lg p-4 md:p-6 border-b border-border dark:border-dark-border">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <CardTitle className="text-2xl md:text-3xl font-bold text-primary dark:text-dark-primary">
              Sales Orders
            </CardTitle>
            <Button onClick={() => navigate('/sales/sales-order/new')} className="bg-primary text-primary-foreground hover:bg-primary-hover dark:bg-dark-primary dark:text-dark-primary-foreground dark:hover:bg-dark-primary-hover">
              <PlusCircle size={20} className="mr-2" /> Create New Sales Order
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="overflow-x-auto rounded-lg border border-border dark:border-dark-border shadow-md">
            <Table>
              <TableHeader className="bg-muted/50 dark:bg-dark-muted/50">
                <TableRow>
                  <TableHead className="w-[150px]">Sales Order No.</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="w-[120px]">Order Date</TableHead>
                  <TableHead className="w-[120px] text-right">Grand Total</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[120px] text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salesOrders.length > 0 ? (
                  salesOrders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-muted/50 dark:hover:bg-dark-muted/50">
                      <TableCell className="font-medium">{order.salesOrderDetails.salesOrderNumber}</TableCell>
                      <TableCell>{order.customer.name}</TableCell>
                      <TableCell>{format(new Date(order.salesOrderDetails.salesOrderDate), 'dd-MMM-yyyy')}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {(order.overallTotal || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.isDraft ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {order.isDraft ? 'Draft' : 'Finalized'}
                        </span>
                      </TableCell>
                      <TableCell className="text-center space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => navigate(`/sales/sales-order/${order.id}`)} title="View/Edit">
                          <Edit size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteOrder(order.id)} title="Delete">
                          <Trash2 size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground dark:text-dark-muted-foreground">
                      No sales orders found. Click "Create New Sales Order" to get started!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={isConfirmDeleteModalOpen} onOpenChange={setIsConfirmDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete sales order
              "{orderToDelete?.id}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsConfirmDeleteModalOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              Yes, delete sales order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SalesOrder;