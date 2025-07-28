import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { PlusCircle, Trash2, Save } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const getProductsFromStorage = () => {
  const storedProducts = localStorage.getItem('products');
  if (storedProducts) {
    try {
      const parsed = JSON.parse(storedProducts);
      return parsed.map(p => ({
        ...p,
        units: p.units?.map(u => ({ ...u, id: u.id || `${p.id}-${u.name}-${Date.now()}` })) || [],
        openingQuantity: p.isService ? Infinity : (p.openingQuantity || 0), 
      }));
    } catch (e) {
      console.error("Failed to parse products from localStorage", e);
      return []; 
    }
  }
  return [ 
    { 
      id: 'PROD001', name: 'Standard Widget', costingPrice: 15.50, salesPrice: 20.00, openingQuantity: 100, isService: false,
      units: [
        { id: `PROD001-pcs-${Date.now()}`, name: 'pcs', factor: 1, isBase: true },
        { id: `PROD001-dozen-${Date.now()}`, name: 'dozen', factor: 12, isBase: false },
      ], baseUnitName: 'pcs'
    },
    { 
      id: 'PROD002', name: 'Premium Gadget', costingPrice: 49.99, salesPrice: 60.00, openingQuantity: 50, isService: false,
      units: [
        { id: `PROD002-unit-${Date.now()}`, name: 'unit', factor: 1, isBase: true },
        { id: `PROD002-pack-${Date.now()}`, name: 'pack', factor: 10, isBase: false },
      ], baseUnitName: 'unit'
    },
    { 
      id: 'SERV001', name: 'Consulting Hour', costingPrice: 100.00, salesPrice: 120.00, openingQuantity: Infinity, isService: true,
      units: [{ id: `SERV001-hour-${Date.now()}`, name: 'hour', factor: 1, isBase: true }], baseUnitName: 'hour'
    },
  ];
};

const getCustomersFromStorage = () => {
  const storedCustomers = localStorage.getItem('customers');
  if (storedCustomers) {
    try {
      return JSON.parse(storedCustomers);
    } catch (e) {
      console.error("Failed to parse customers from localStorage", e);
      return []; 
    }
  }
  return [
    { id: 'cust001', name: 'Client Omega Corp.', address: '123 Main St', billingAddress: '123 Main St' },
    { id: 'cust002', name: 'Customer Zeta Ltd.', address: '456 Oak Ave', billingAddress: '456 Oak Ave' },
    { id: 'cust003', name: 'Patron Gamma Solutions', address: '789 Pine Ln', billingAddress: '789 Pine Ln' },
  ];
};

const AddSalesOrder = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [salesOrderDate, setSalesOrderDate] = useState(new Date());
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState(null);
  const [salesOrderNumber, setSalesOrderNumber] = useState(`SO-${String(Date.now()).slice(-6)}`);
  const [notes, setNotes] = useState('');
  const [terms, setTerms] = useState('');

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

  const [subtotal, setSubtotal] = useState(0);
  const [totalDiscountDisplay, setTotalDiscountDisplay] = useState('$0.00');
  const [taxAmount, setTaxAmount] = useState(0); 
  const [grandTotal, setGrandTotal] = useState(0);

  const isEditMode = !!id;

  useEffect(() => {
    setCustomers(getCustomersFromStorage());
    setProducts(getProductsFromStorage());
  }, []);

  useEffect(() => {
    if (selectedCustomer) {
      const customer = customers.find(c => c.id === selectedCustomer);
      if (customer) {
        setCustomerAddress(customer.address || '');
        setBillingAddress(customer.billingAddress || customer.address || '');
      }
    } else {
      setCustomerAddress('');
      setBillingAddress('');
    }
  }, [selectedCustomer, customers]);

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
    setSelectedCustomer(customerId);
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
            if (baseUnit && selectedProduct.salesPrice) {
                 const billingUnitForRate = selectedProduct.units.find(u=>u.id === updatedItemState.billingUnitId);
                 updatedItemState.rateForBillingUnit = (selectedProduct.salesPrice || 0) * (billingUnitForRate?.factor || 1);
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

  const handleSubmit = (send = false) => {
    if (!selectedCustomer) {
      toast({ title: "Validation Error", description: "Please select a customer.", variant: "destructive" });
      return;
    }
    if (lineItems.some(item => !item.productId || item.totalPrice === 0 && item.quantityInput > 0)) { 
       toast({ title: "Validation Error", description: "Please ensure all line items have a product, valid quantity, units, and rate leading to a price.", variant: "destructive" });
       return;
    }
    if (lineItems.length === 0 || lineItems.every(item => item.quantityInput === 0)) {
        toast({ title: "Validation Error", description: "Cannot save an empty sales order or a sales order with all zero quantities.", variant: "destructive" });
        return;
    }
    
    const finalLineItems = lineItems.filter(li => li.quantityInput > 0).map(li => calculateLineItemTotal(li));

    if (finalLineItems.length === 0) {
        toast({ title: "Validation Error", description: "Cannot save a sales order with no valid line items.", variant: "destructive" });
        return;
    }

    const calculatedSubtotal = finalLineItems.reduce((acc, item) => acc + (item.itemRawTotal || 0), 0);
    const calculatedTotalDiscount = finalLineItems.reduce((acc, item) => {
      let itemDiscount = 0;
      if(item.discountAmount > 0) {
        itemDiscount = item.discountAmount;
      } else if (item.discountPercent > 0) {
        itemDiscount = (item.itemRawTotal || 0) * (item.discountPercent / 100);
      }
      return acc + itemDiscount;
    }, 0);


    const salesOrderData = {
      id: isEditMode ? id : `so-${Date.now()}`, // Use existing ID if in edit mode, otherwise generate new
      customer: customers.find(c => c.id === selectedCustomer), // Use the selected customer object
      salesOrderDetails: { salesOrderNumber, salesOrderDate: salesOrderDate.toISOString().split('T')[0], expectedDeliveryDate: expectedDeliveryDate?.toISOString().split('T')[0] || null, reference: '' }, // Use salesOrderNumber and salesOrderDate
      lineItems: finalLineItems.map(li => {
          const quantityUnitDetails = li.productDetails?.units.find(u=>u.id === li.quantityUnitId);
          const billingUnitDetails = li.productDetails?.units.find(u=>u.id === li.billingUnitId);
          return {
            productId: li.productId, productName: li.productDetails?.name,
            quantityInput: li.quantityInput, quantityUnitId: li.quantityUnitId,
            quantityUnitName: quantityUnitDetails?.name, quantityUnitFactor: quantityUnitDetails?.factor,
            calculatedQuantityInBase: li.quantityInBase, baseUnitName: li.productDetails?.baseUnitName,
            billingUnitId: li.billingUnitId, billingUnitName: billingUnitDetails?.name,
            billingUnitFactor: billingUnitDetails?.factor, rateForBillingUnit: li.rateForBillingUnit,
            discountPercent: li.discountPercent, discountAmount: li.discountAmount,
            itemRawTotal: li.itemRawTotal,
            calculatedPrice: li.totalPrice,
          };
      }), 
      subtotal: calculatedSubtotal, 
      totalDiscount: calculatedTotalDiscount, 
      taxAmount, 
      grandTotal: calculatedSubtotal - calculatedTotalDiscount + taxAmount, 
      notes, 
      terms,
      isDraft: !send, // Set draft status based on 'send' parameter
      status: send ? 'Confirmed' : 'Draft',
    };
    console.log("Sales Order Data: ", JSON.stringify(salesOrderData, null, 2));
    
    const existingSalesOrders = JSON.parse(localStorage.getItem('salesOrders') || '[]');
    let updatedSalesOrders;

    if (isEditMode) {
        updatedSalesOrders = existingSalesOrders.map(order => order.id === id ? salesOrderData : order);
    } else {
        updatedSalesOrders = [...existingSalesOrders, salesOrderData];
    }

    localStorage.setItem('salesOrders', JSON.stringify(updatedSalesOrders));

    toast({ title: "Sales Order Saved!", description: `Sales Order ${salesOrderNumber} ${send ? 'finalized and' : ''} saved successfully.`, className: 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 border-green-300 dark:border-green-600' });
    navigate('/sales/sales-orders');
  } // <-- Add this closing brace to end handleSubmit

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? 'Edit Sales Order' : 'Create Sales Order'}</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="salesOrderNumber">Sales Order Number</Label>
              <Input id="salesOrderNumber" value={salesOrderNumber} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salesOrderDate">Order Date</Label>
              <DatePicker date={salesOrderDate} setDate={setSalesOrderDate} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expectedDeliveryDate">Expected Delivery Date</Label>
              <DatePicker date={expectedDeliveryDate} setDate={setExpectedDeliveryDate} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer">Customer</Label>
              <Select onValueChange={handleCustomerChange} value={selectedCustomer}>
                <SelectTrigger id="customer">
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map(c => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerAddress">Customer Address</Label>
              <Textarea id="customerAddress" value={customerAddress} readOnly className="resize-none" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="billingAddress">Billing Address</Label>
              <Textarea id="billingAddress" value={billingAddress} onChange={(e) => setBillingAddress(e.target.value)} className="resize-none" />
            </div>
          </div>

          {/* Line Items Section */}
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
                  {lineItems.map((item) => (
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

          {/* Totals Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          {/* Footer Buttons */}
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => handleSubmit(true)}><Save className="mr-2 h-4 w-4" /> Save as Draft</Button>
            <Button type="button" onClick={() => handleSubmit(false)}><Save className="mr-2 h-4 w-4" /> Save and Finalize</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddSalesOrder;