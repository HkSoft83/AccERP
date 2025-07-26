import React, { useState, useEffect, useCallback } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { PlusCircle, Trash2, Save, FileText, PackagePlus as PackageIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

const getVendorsFromStorage = () => {
  const storedVendors = localStorage.getItem('vendors');
  return storedVendors ? JSON.parse(storedVendors) : [];
};

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
      id: 'PROD001', name: 'Standard Widget', costingPrice: 15.50, openingQuantity: 100, isService: false,
      units: [
        { id: `PROD001-pcs-${Date.now()}`, name: 'pcs', factor: 1, isBase: true },
        { id: `PROD001-dozen-${Date.now()}`, name: 'dozen', factor: 12, isBase: false },
      ], baseUnitName: 'pcs'
    },
  ];
};

const AddPurchaseOrderForm = ({ onSave, onCancel }) => {
  const { toast } = useToast();
  const [vendor, setVendor] = useState('');
  const [availableVendors, setAvailableVendors] = useState([]);
  const [orderDate, setOrderDate] = useState(new Date());
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState(new Date(new Date().setDate(new Date().getDate() + 7)));
  const [orderNumber, setOrderNumber] = useState(`PO-${String(Date.now()).slice(-6)}`);
  const [memo, setMemo] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [dropShipToCustomer, setDropShipToCustomer] = useState(null);
  const [notes, setNotes] = useState('');
  const [availableProducts, setAvailableProducts] = useState([]);
  const [availableCustomers, setAvailableCustomers] = useState([]);

  const defaultOwnAddress = "Your Company Address, City, State, Zip"; // Placeholder for own address

  useEffect(() => {
    setAvailableProducts(getProductsFromStorage());
    const storedCustomers = JSON.parse(localStorage.getItem('customers') || '[]');
    setAvailableCustomers(storedCustomers);
    setAvailableVendors(getVendorsFromStorage());
  }, []);

  useEffect(() => {
    if (dropShipToCustomer) {
      const customer = availableCustomers.find(c => c.id === dropShipToCustomer);
      if (customer) {
        setShippingAddress(customer.address || '');
      }
    } else {
      setShippingAddress(defaultOwnAddress);
    }
  }, [dropShipToCustomer, availableCustomers, defaultOwnAddress]);
  
  const [lineItems, setLineItems] = useState([
    { 
      id: Date.now(), 
      productId: '', 
      productDetails: null,
      quantityInput: 1,
      quantityUnitId: '',
      billingUnitId: '', 
      rateForBillingUnit: 0, 
      totalPrice: 0
    },
  ]);

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
    
    const totalPrice = parseFloat(itemRawTotal.toFixed(2));
    return { ...item, totalPrice, itemRawTotal };
  }, []);

  const handleAddLineItem = () => {
    setLineItems([...lineItems, { 
      id: Date.now(), productId: '', productDetails: null, 
      quantityInput: 1, quantityUnitId: '', 
      billingUnitId: '', rateForBillingUnit: 0, totalPrice: 0
    }]);
  };

  const handleRemoveLineItem = (idToRemove) => {
    setLineItems(lineItems.filter((item) => item.id !== idToRemove));
  };

  const handleLineItemChange = (itemId, field, value) => {
    setLineItems(prevLineItems => 
      prevLineItems.map(item => {
        if (item.id !== itemId) return item;
        let updatedItemState = { ...item };

        if (field === 'productId') {
          const selectedProduct = availableProducts.find(p => p.id === value);
          if (selectedProduct) {
            updatedItemState.productId = value;
            updatedItemState.productDetails = selectedProduct;
            const baseUnit = selectedProduct.units?.find(u => u.isBase);
            updatedItemState.quantityUnitId = baseUnit ? baseUnit.id : (selectedProduct.units?.[0]?.id || '');
            updatedItemState.billingUnitId = baseUnit ? baseUnit.id : (selectedProduct.units?.[0]?.id || '');
            if (baseUnit && selectedProduct.costingPrice) {
                 const billingUnitForRate = selectedProduct.units.find(u=>u.id === updatedItemState.billingUnitId);
                 updatedItemState.rateForBillingUnit = (selectedProduct.costingPrice || 0) * (billingUnitForRate?.factor || 1);
            } else {
                 updatedItemState.rateForBillingUnit = 0;
            }
            updatedItemState.quantityInput = 1; 
          } else {
            updatedItemState = { ...updatedItemState, productId: '', productDetails: null, quantityUnitId: '', billingUnitId: '', rateForBillingUnit: 0, quantityInput: 1 };
          }
        } else if (field === 'quantityUnitId' || field === 'billingUnitId') {
            updatedItemState[field] = value;
        } else if (field === 'quantityInput') {
          updatedItemState.quantityInput = parseFloat(value) >= 0 ? parseFloat(value) : 0;
        } else if (field === 'rateForBillingUnit') {
          updatedItemState[field] = parseFloat(value) || 0;
        } else {
          updatedItemState[field] = value;
        }
        return calculateLineItemTotal(updatedItemState);
      })
    );
  };
  
  const handleSaveOrder = (isDraft = false) => {
    if (!vendor) {
      toast({ title: "Validation Error", description: "Please select a vendor.", variant: "destructive" });
      return;
    }
    if (lineItems.some(item => !item.productId || item.quantityInput === 0)) { 
       toast({ title: "Validation Error", description: "Please ensure all line items have a product and valid quantity.", variant: "destructive" });
       return;
    }
     if (lineItems.length === 0 || lineItems.every(item => item.quantityInput === 0)) {
        toast({ title: "Validation Error", description: "Cannot save an empty order or an order with all zero quantities.", variant: "destructive" });
        return;
    }
    
    const finalLineItems = lineItems.filter(li => li.quantityInput > 0);

    if (finalLineItems.length === 0) {
        toast({ title: "Validation Error", description: "Cannot save an order with no valid line items.", variant: "destructive" });
        return;
    }

    const orderData = {
      vendor, orderNumber, orderDate, expectedDeliveryDate, memo, shippingAddress, dropShipToCustomer,
      lineItems: finalLineItems.map(li => ({
            productId: li.productId, productName: li.productDetails?.name,
            quantityInput: li.quantityInput, quantityUnitId: li.quantityUnitId,
            quantityUnitName: li.productDetails?.units.find(u=>u.id === li.quantityUnitId)?.name,
            quantityUnitFactor: li.productDetails?.units.find(u=>u.id === li.quantityUnitId)?.factor,
            billingUnitId: li.billingUnitId,
            billingUnitName: li.productDetails?.units.find(u=>u.id === li.billingUnitId)?.name,
            billingUnitFactor: li.productDetails?.units.find(u=>u.id === li.billingUnitId)?.factor,
            rateForBillingUnit: li.rateForBillingUnit,
            totalPrice: li.totalPrice,
      })), 
      notes, isDraft
    };
    console.log("Purchase Order Data: ", JSON.stringify(orderData, null, 2));

    const existingOrders = JSON.parse(localStorage.getItem('purchaseOrders') || '[]');
    localStorage.setItem('purchaseOrders', JSON.stringify([...existingOrders, orderData]));

    toast({ title: "Purchase Order Saved", description: `Order ${orderNumber} has been ${isDraft ? 'saved as draft' : 'saved'}.`, className: 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 border-green-300 dark:border-green-600'});
    onCancel(); // Close form after saving
  };

  return (
    <div className="space-y-6 p-1 md:p-2">
      <Card className="shadow-xl border-border dark:border-dark-border bg-card dark:bg-dark-card">
        <CardHeader className="p-6 border-b border-border dark:border-dark-border">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                 <CardTitle className="text-3xl font-bold text-primary dark:text-dark-primary flex items-center">
                    <PackageIcon size={32} className="mr-3 text-accent dark:text-dark-accent" /> New Purchase Order
                </CardTitle>
                <div className="text-muted-foreground dark:text-dark-muted-foreground font-mono text-sm bg-muted dark:bg-dark-muted px-2 py-1 rounded self-start sm:self-center">
                    {orderNumber}
                </div>
            </div>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="vendor" className="font-semibold">Vendor <span className="text-destructive dark:text-red-400">*</span></Label>
              <Select onValueChange={setVendor} value={vendor}>
                <SelectTrigger id="vendor"><SelectValue placeholder="Select vendor" /></SelectTrigger>
                <SelectContent>{availableVendors.map(v => (<SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>))}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="orderDate" className="font-semibold">Order Date</Label>
              <DatePicker date={orderDate} setDate={setOrderDate}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="expectedDeliveryDate" className="font-semibold">Expected Delivery Date</Label>
              <DatePicker date={expectedDeliveryDate} setDate={setExpectedDeliveryDate}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="memo" className="font-semibold">Memo</Label>
              <Input id="memo" value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="e.g., For Q3 Marketing Campaign" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dropShipTo">Drop Ship To (Customer)</Label>
              <Select onValueChange={setDropShipToCustomer} value={dropShipToCustomer}>
                <SelectTrigger id="dropShipTo"><SelectValue placeholder="Select customer (optional)" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={null}>None</SelectItem>
                  {availableCustomers.map(c => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="shippingAddress" className="font-semibold">Shipping Address</Label>
              <Textarea id="shippingAddress" value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} placeholder="Enter shipping address" className="min-h-[100px]" />
            </div>
          </div>

          <div className="overflow-x-auto bg-background dark:bg-dark-background p-4 rounded-lg border border-border dark:border-dark-border shadow-inner">
            <table className="w-full min-w-[1000px]">
              <thead className="border-b-2 border-primary dark:border-dark-primary">
                <tr>
                  <th className="p-3 text-left text-sm font-semibold text-primary dark:text-dark-primary w-[20%]">Product/Service</th>
                  <th className="p-3 text-left text-sm font-semibold text-primary dark:text-dark-primary w-[10%]">Quantity</th>
                  <th className="p-3 text-left text-sm font-semibold text-primary dark:text-dark-primary w-[10%]">Qty Unit</th>
                  <th className="p-3 text-left text-sm font-semibold text-primary dark:text-dark-primary w-[15%]">Rate (Billing Unit)</th>
                  <th className="p-3 text-left text-sm font-semibold text-primary dark:text-dark-primary w-[15%]">Billing Unit</th>
                  <th className="p-3 text-right text-sm font-semibold text-primary dark:text-dark-primary w-[15%]">Total</th>
                  <th className="p-3 text-center text-sm font-semibold text-primary dark:text-dark-primary w-[5%"></th>
                </tr>
              </thead>
              <tbody>
                {lineItems.map((item) => (
                  <tr key={item.id} className="border-b border-border dark:border-dark-border last:border-b-0 hover:bg-muted/50 dark:hover:bg-dark-muted/50 transition-colors">
                    <td className="p-2">
                      <Select value={item.productId} onValueChange={(value) => handleLineItemChange(item.id, 'productId', value)}>
                        <SelectTrigger className="text-sm"><SelectValue placeholder="Select product" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value={null}>Select product</SelectItem>
                          {availableProducts.map(p => (<SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-2">
                      <Input type="number" value={item.quantityInput} onChange={(e) => handleLineItemChange(item.id, 'quantityInput', e.target.value)} placeholder="1" className="w-full text-sm" min="0" step="any"/>
                    </td>
                    <td className="p-2">
                       <Select value={item.quantityUnitId} onValueChange={(value) => handleLineItemChange(item.id, 'quantityUnitId', value)} disabled={!item.productDetails}>
                         <SelectTrigger className="text-sm"><SelectValue placeholder="Unit" /></SelectTrigger>
                         <SelectContent>{item.productDetails?.units?.map(u => (<SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>))}</SelectContent>
                       </Select>
                    </td>
                    <td className="p-2">
                      <Input type="number" value={item.rateForBillingUnit} onChange={(e) => handleLineItemChange(item.id, 'rateForBillingUnit', e.target.value)} placeholder="0.00" className="w-full text-sm" min="0" step="0.01"/>
                    </td>
                     <td className="p-2">
                       <Select value={item.billingUnitId} onValueChange={(value) => handleLineItemChange(item.id, 'billingUnitId', value)} disabled={!item.productDetails}>
                         <SelectTrigger className="text-sm"><SelectValue placeholder="Unit" /></SelectTrigger>
                         <SelectContent>{item.productDetails?.units?.map(u => (<SelectItem key={u.id} value={u.id}>{u.name} ({u.factor} {item.productDetails?.baseUnitName})</SelectItem>))}</SelectContent>
                       </Select>
                    </td>
                    <td className="p-2 text-right text-sm font-medium">
                      {(item.totalPrice || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </td>
                    <td className="p-2 text-center">
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveLineItem(item.id)} className="text-destructive dark:text-red-400 hover:text-destructive/80 h-8 w-8">
                        <Trash2 size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Button onClick={handleAddLineItem} variant="outline" className="mt-4 text-accent dark:text-dark-accent border-accent dark:border-dark-accent hover:bg-accent/10 dark:hover:bg-dark-accent/10 shadow-sm">
              <PlusCircle size={18} className="mr-2" /> Add Line Item
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6 items-start">
             <div>
                <Label htmlFor="notes" className="font-semibold">Notes/Remarks</Label>
                <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Enter any notes or remarks for this bill..." className="mt-1 min-h-[100px]" />
              </div>
            
          </div>
        </CardContent>
        <CardFooter className="bg-muted/30 dark:bg-dark-muted/30 rounded-b-lg p-6 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 border-t border-border dark:border-dark-border">
          <Button variant="outline" className="w-full sm:w-auto" onClick={onCancel}>
            Cancel
          </Button>
          <Button className="w-full sm:w-auto bg-secondary text-secondary-foreground hover:bg-secondary-hover dark:bg-dark-secondary dark:text-dark-secondary-foreground dark:hover:bg-dark-secondary-hover flex items-center shadow hover:shadow-md" onClick={() => handleSaveOrder(true)}>
            <Save size={18} className="mr-2" /> Save as Draft
          </Button>
          <Button className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary-hover dark:bg-dark-primary dark:text-dark-primary-foreground dark:hover:bg-dark-primary-hover flex items-center shadow hover:shadow-md" onClick={() => handleSaveOrder(false)}>
            <Save size={18} className="mr-2" /> Save Order
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
export default AddPurchaseOrderForm;