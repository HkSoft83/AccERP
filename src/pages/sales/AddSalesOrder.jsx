import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { PlusCircle, Trash2, Save } from 'lucide-react';

const AddSalesOrder = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const fromEstimateId = searchParams.get('from_estimate');
  const { toast } = useToast();

  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [customerDetails, setCustomerDetails] = useState(null);
  const [salesOrderDetails, setSalesOrderDetails] = useState({
    salesOrderNumber: `SO-${Date.now()}`,
    salesOrderDate: new Date(),
    reference: ''
  });
  const [lineItems, setLineItems] = useState([
    {
      id: Date.now(),
      productId: '',
      productDetails: null,
      quantityInput: 1,
      quantityUnitId: '',
      quantityInBase: 1,
      billingUnitId: '',
      rateForBillingUnit: 0,
      discountPercent: 0,
      discountAmount: 0,
      totalPrice: 0
    },
  ]);
  const [notes, setNotes] = useState('');
  const [isDraft, setIsDraft] = useState(true);
  const [subtotal, setSubtotal] = useState(0);
  const [totalDiscountDisplay, setTotalDiscountDisplay] = useState('$0.00');
  const [taxAmount, setTaxAmount] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);

  const isEditMode = !!id;

  useEffect(() => {
    const storedCustomers = JSON.parse(localStorage.getItem('customers') || '[]');
    const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    setCustomers(storedCustomers);
    setProducts(storedProducts);

    if (isEditMode) {
      const storedSalesOrders = JSON.parse(localStorage.getItem('salesOrders') || '[]');
      const orderToEdit = storedSalesOrders.find(order => order.id === id);
      if (orderToEdit) {
        setSelectedCustomer(orderToEdit.customer.id);
        setCustomerDetails(orderToEdit.customer);
        setSalesOrderDetails(orderToEdit.salesOrderDetails);
        setLineItems(orderToEdit.lineItems);
        setNotes(orderToEdit.notes || '');
        setIsDraft(orderToEdit.isDraft);
      }
    } else if (fromEstimateId) {
        const storedEstimates = JSON.parse(localStorage.getItem('estimates') || '[]');
        const estimateToConvert = storedEstimates.find(est => est.id === fromEstimateId);
        if (estimateToConvert) {
            setSelectedCustomer(estimateToConvert.customer.id);
            setCustomerDetails(estimateToConvert.customer);
            setLineItems(estimateToConvert.lineItems);
            setNotes(estimateToConvert.notes || '');
        }
    }
  }, [id, isEditMode, fromEstimateId]);

  const calculateLineItemTotal = useCallback((item) => {
    let calculatedQuantityInBase = parseFloat(item.quantityInput) || 0;
    if (item.productDetails && item.quantityUnitId && item.productDetails.units) {
      const selectedQuantityUnit = item.productDetails.units.find(u => u.id === item.quantityUnitId);
      if (selectedQuantityUnit && selectedQuantityUnit.factor > 0) {
        calculatedQuantityInBase = (parseFloat(item.quantityInput) || 0) * selectedQuantityUnit.factor;
      }
    }
  
    let itemRawTotal = 0;
    if (item.productDetails && item.billingUnitId && item.productDetails.units) {
      const selectedBillingUnit = item.productDetails.units.find(u => u.id === item.billingUnitId);
      if (selectedBillingUnit && selectedBillingUnit.factor > 0) {
        const ratePerBaseUnit = (parseFloat(item.rateForBillingUnit) || 0) / selectedBillingUnit.factor;
        itemRawTotal = calculatedQuantityInBase * ratePerBaseUnit;
      }
    }
  
    let itemDiscountAmountValue = 0;
    if (parseFloat(item.discountAmount) > 0) {
      itemDiscountAmountValue = parseFloat(item.discountAmount);
    } else if (parseFloat(item.discountPercent) > 0) {
      itemDiscountAmountValue = itemRawTotal * (parseFloat(item.discountPercent) / 100);
    }
    
    const totalPrice = parseFloat((itemRawTotal - itemDiscountAmountValue).toFixed(2));
    return { ...item, quantityInBase: calculatedQuantityInBase, totalPrice, itemRawTotal };
  }, []);

  useEffect(() => {
    let currentSubtotal = 0;
    let currentTotalDiscountValue = 0;

    const calculatedItems = lineItems.map(item => calculateLineItemTotal(item));

    calculatedItems.forEach(item => {
      currentSubtotal += item.itemRawTotal || 0;

      if (item.discountAmount > 0) {
        currentTotalDiscountValue += item.discountAmount;
      } else if (item.discountPercent > 0) {
        currentTotalDiscountValue += (item.itemRawTotal || 0) * (item.discountPercent / 100);
      }
    });
    
    setSubtotal(parseFloat(currentSubtotal.toFixed(2)));
    setTotalDiscountDisplay(`-${currentTotalDiscountValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`);
  }, [lineItems, calculateLineItemTotal]);


  useEffect(() => {
    const currentTotalDiscountValue = lineItems.reduce((acc, item) => {
        const calculatedItem = calculateLineItemTotal(item);
        let itemDiscountValue = 0;
        if (calculatedItem.discountAmount > 0) {
            itemDiscountValue = calculatedItem.discountAmount;
        } else if (calculatedItem.discountPercent > 0) {
            itemDiscountValue = (calculatedItem.itemRawTotal || 0) * (calculatedItem.discountPercent / 100);
        }
        return acc + itemDiscountValue;
    },0);

    const calculatedGrandTotal = subtotal - currentTotalDiscountValue + taxAmount;
    setGrandTotal(parseFloat(calculatedGrandTotal.toFixed(2)));
  }, [subtotal, taxAmount, lineItems, calculateLineItemTotal]);

  const handleCustomerChange = (customerId) => {
    const customer = customers.find(c => c.id === customerId);
    setSelectedCustomer(customerId);
    setCustomerDetails(customer);
  };

  const handleDetailChange = (e) => {
    const { name, value } = e.target;
    setSalesOrderDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setSalesOrderDetails(prev => ({ ...prev, salesOrderDate: date }));
  };

  const handleLineItemChange = (itemId, field, value) => {
    setLineItems(prevLineItems => 
      prevLineItems.map(item => {
        if (item.id !== itemId) return item;

        let updatedItemState = { ...item };

        if (field === 'productId') {
          const selectedProduct = products.find(p => p.id === value);
          if (selectedProduct) {
            updatedItemState.productId = value;
            updatedItemState.productDetails = selectedProduct;
            const baseUnit = selectedProduct.units?.find(u => u.isBase);
            updatedItemState.quantityUnitId = baseUnit ? baseUnit.id : (selectedProduct.units?.[0]?.id || '');
            updatedItemState.billingUnitId = baseUnit ? baseUnit.id : (selectedProduct.units?.[0]?.id || '');
            if (baseUnit && selectedProduct.costingPrice) { // Assuming salesPrice is used here, not costing. Changed to salesPrice
                 const billingUnitForRate = selectedProduct.units.find(u=>u.id === updatedItemState.billingUnitId);
                 updatedItemState.rateForBillingUnit = (selectedProduct.salesPrice || selectedProduct.costingPrice || 0) * (billingUnitForRate?.factor || 1);
            } else {
                 updatedItemState.rateForBillingUnit = 0;
            }
            updatedItemState.quantityInput = 1; // Reset quantity on product change
          } else {
            updatedItemState = { ...updatedItemState, productId: '', productDetails: null, quantityUnitId: '', billingUnitId: '', rateForBillingUnit: 0, quantityInput: 1 };
          }
        } else if (field === 'quantityUnitId' || field === 'billingUnitId') {
            updatedItemState[field] = value;
        } else if (field === 'quantityInput') {
          updatedItemState.quantityInput = parseFloat(value) >= 0 ? parseFloat(value) : 0;
        } else if (field === 'rateForBillingUnit') {
          updatedItemState[field] = parseFloat(value) || 0;
        } else if (field === 'discountPercent') {
          const percent = parseFloat(value) || 0;
          updatedItemState.discountPercent = percent;
          if (percent > 0) updatedItemState.discountAmount = 0; 
        } else if (field === 'discountAmount') {
          const amount = parseFloat(value) || 0;
          updatedItemState.discountAmount = amount;
          if (amount > 0) updatedItemState.discountPercent = 0; 
        } else {
          updatedItemState[field] = value;
        }
        
        let tempQuantityInBase = parseFloat(updatedItemState.quantityInput) || 0;
        if (updatedItemState.productDetails && updatedItemState.quantityUnitId && updatedItemState.productDetails.units) {
            const selectedQuantityUnit = updatedItemState.productDetails.units.find(u => u.id === updatedItemState.quantityUnitId);
            if (selectedQuantityUnit && selectedQuantityUnit.factor > 0) {
                tempQuantityInBase = (parseFloat(updatedItemState.quantityInput) || 0) * selectedQuantityUnit.factor;
            }
        }
        updatedItemState.quantityInBase = tempQuantityInBase;
            
        if (updatedItemState.productDetails && updatedItemState.productDetails.openingQuantity !== Infinity) {
             const stockAvailable = updatedItemState.productDetails.openingQuantity || 0;
             if (tempQuantityInBase > stockAvailable) {
                toast({
                    title: "Stock Alert",
                    description: `Selected quantity (${tempQuantityInBase} ${updatedItemState.productDetails.baseUnitName || 'base units'}) exceeds available stock (${stockAvailable}) for ${updatedItemState.productDetails.name}. Quantity reset.`,
                    variant: "destructive"
                });
                updatedItemState.quantityInput = 0; // Reset quantityInput
                updatedItemState.quantityInBase = 0; // Also reset calculated base quantity
             }
        }
        return calculateLineItemTotal(updatedItemState);
      })
    );
  };

  const addNewLineItem = () => {
    setLineItems([...lineItems, { 
      id: Date.now(), productId: '', productDetails: null, 
      quantityInput: 1, quantityUnitId: '', quantityInBase: 1, 
      billingUnitId: '', rateForBillingUnit: 0, 
      discountPercent: 0, discountAmount: 0, totalPrice: 0 
    }]);
  };

  const removeLineItem = (idToRemove) => {
    setLineItems(lineItems.filter((item) => item.id !== idToRemove));
  };

  const handleSubmit = (e, draft = true) => {
    e.preventDefault();
    if (!selectedCustomer) {
        toast({ title: "Error", description: "Please select a customer.", variant: "destructive" });
        return;
    }

    const salesOrderData = {
      id: isEditMode ? id : `so-${Date.now()}`,
      customer: customerDetails,
      salesOrderDetails,
      lineItems,
      notes,
      subtotal,
      totalDiscount: lineItems.reduce((acc, item) => acc + item.discountAmount, 0),
      taxAmount,
      grandTotal,
      isDraft: draft,
      status: draft ? 'Draft' : 'Confirmed',
    };

    const storedSalesOrders = JSON.parse(localStorage.getItem('salesOrders') || '[]');
    let updatedSalesOrders;

    if (isEditMode) {
        updatedSalesOrders = storedSalesOrders.map(order => order.id === id ? salesOrderData : order);
    } else {
        updatedSalesOrders = [...storedSalesOrders, salesOrderData];
    }

    localStorage.setItem('salesOrders', JSON.stringify(updatedSalesOrders));
    toast({ title: `Sales Order ${isEditMode ? 'Updated' : 'Created'}` });
    navigate('/sales/sales-orders');
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? 'Edit Sales Order' : 'Create Sales Order'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={(e) => handleSubmit(e, false)}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>Customer</Label>
                <Select onValueChange={handleCustomerChange} value={selectedCustomer}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="salesOrderNumber">Sales Order Number</Label>
                <Input id="salesOrderNumber" name="salesOrderNumber" value={salesOrderDetails.salesOrderNumber} onChange={handleDetailChange} disabled />
              </div>
              <div className="space-y-2">
                <Label>Sales Order Date</Label>
                <DatePicker date={salesOrderDetails.salesOrderDate} setDate={handleDateChange} />
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Items</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product/Service</TableHead>
                      <TableHead className="w-[100px]">Qty</TableHead>
                      <TableHead className="w-[120px]">Qty Unit</TableHead>
                      <TableHead className="w-[150px]">Rate</TableHead>
                      <TableHead className="w-[120px]">Billing Unit</TableHead>
                      <TableHead className="w-[150px] text-right">Amount</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lineItems.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Select value={item.productId} onValueChange={(value) => handleLineItemChange(item.id, 'productId', value)}>
                              <SelectTrigger><SelectValue placeholder="Select Product" /></SelectTrigger>
                              <SelectContent>
                                  {products.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                              </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input type="number" value={item.quantityInput} onChange={(e) => handleLineItemChange(item.id, 'quantityInput', e.target.value)} />
                        </TableCell>
                        <TableCell>
                            <Select value={item.quantityUnitId} onValueChange={(value) => handleLineItemChange(item.id, 'quantityUnitId', value)} disabled={!item.productDetails}>
                                <SelectTrigger><SelectValue placeholder="Unit" /></SelectTrigger>
                                <SelectContent>
                                    {item.productDetails?.units?.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </TableCell>
                        <TableCell>
                          <Input type="number" value={item.rateForBillingUnit} onChange={(e) => handleLineItemChange(item.id, 'rateForBillingUnit', e.target.value)} />
                        </TableCell>
                        <TableCell>
                            <Select value={item.billingUnitId} onValueChange={(value) => handleLineItemChange(item.id, 'billingUnitId', value)} disabled={!item.productDetails}>
                                <SelectTrigger><SelectValue placeholder="Unit" /></SelectTrigger>
                                <SelectContent>
                                    {item.productDetails?.units?.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </TableCell>
                        <TableCell className="text-right">{item.totalPrice.toFixed(2)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => removeLineItem(item.id)}><Trash2 className="h-4 w-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Button type="button" variant="outline" size="sm" className="mt-4" onClick={addNewLineItem}><PlusCircle className="mr-2 h-4 w-4" />Add Line</Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-6">
                <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes or terms and conditions" />
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>{subtotal.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Discount</span>
                        <span>{totalDiscountDisplay}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Tax</span>
                        <Input type="number" value={taxAmount} onChange={(e) => setTaxAmount(parseFloat(e.target.value) || 0)} className="w-24 h-8" />
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>{grandTotal.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                    </div>
                </div>
            </div>

            <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={(e) => handleSubmit(e, true)}><Save className="mr-2 h-4 w-4" /> Save as Draft</Button>
                <Button type="submit"><Save className="mr-2 h-4 w-4" /> Save and Finalize</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddSalesOrder;