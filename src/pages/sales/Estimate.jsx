import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Trash2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

const getProductsFromStorage = () => {
  const storedProducts = localStorage.getItem('products');
  if (storedProducts) {
    try {
      const parsed = JSON.parse(storedProducts);
      return parsed.map(p => ({
        ...p,
        units: p.units?.map(u => ({ ...u, id: u.id || `${p.id}-${u.name}-${Date.now()}`, factor: parseFloat(u.factor) || 1 })) || [], // Ensure factor is a number
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

const Estimate = () => {
  const { toast } = useToast();
  const [estimateDetails, setEstimateDetails] = useState({
    estimateNumber: '',
    estimateDate: null,
    expiryDate: null,
  });

  const [myCompany, setMyCompany] = useState({
    name: 'My Company Name',
    address: '123 Business Rd, City, Country',
    logo: '/images/company-logo.png', // Placeholder
  });

  const [customer, setCustomer] = useState({
    name: '',
    address: '',
  });

  const [availableProducts, setAvailableProducts] = useState([]);

  useEffect(() => {
    setAvailableProducts(getProductsFromStorage());
  }, []);

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
      if (selectedBillingUnit && selectedBillingUnit.factor > 0) { // Add check for factor > 0
        const ratePerBaseUnit = (parseFloat(item.rateForBillingUnit) || 0) / selectedBillingUnit.factor;
        itemRawTotal = calculatedQuantityInBase * ratePerBaseUnit;
      }
    }
    
    const totalPrice = parseFloat(itemRawTotal.toFixed(2));
    return { ...item, totalPrice, itemRawTotal };
  }, []);

  const handleEstimateDetailsChange = (field, value) => {
    setEstimateDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleCustomerChange = (field, value) => {
    setCustomer(prev => ({ ...prev, [field]: value }));
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

  const addLineItem = () => {
    setLineItems(prev => [...prev, { 
      id: Date.now(), productId: '', productDetails: null, 
      quantityInput: 1, quantityUnitId: '', 
      billingUnitId: '', rateForBillingUnit: 0, totalPrice: 0
    }]);
  };

  const removeLineItem = (idToRemove) => {
    setLineItems(lineItems.filter((item) => item.id !== idToRemove));
  };

  const overallTotal = lineItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);

  return (
    <div className="space-y-6 p-1">
      <Card className="shadow-lg border-border dark:border-dark-border">
        <CardHeader className="bg-card dark:bg-dark-card rounded-t-lg p-4 md:p-6 border-b border-border dark:border-dark-border">
          <CardTitle className="text-2xl md:text-3xl font-bold text-primary dark:text-dark-primary">
            Create Estimate
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          {/* Company and Estimate Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              {myCompany.logo && <img src={myCompany.logo} alt="Company Logo" className="h-16 mb-4" />}
              <p className="font-semibold text-lg">{myCompany.name}</p>
              <p className="text-sm text-muted-foreground">{myCompany.address}</p>
            </div>
            <div className="space-y-2 md:text-right">
              <div>
                <Label htmlFor="estimateNumber" className="text-right md:text-left">Estimate Number:</Label>
                <Input
                  id="estimateNumber"
                  value={estimateDetails.estimateNumber}
                  onChange={(e) => handleEstimateDetailsChange('estimateNumber', e.target.value)}
                  className="md:text-right mt-1"
                />
              </div>
              <div>
                <Label htmlFor="estimateDate" className="text-right md:text-left">Estimate Date:</Label>
                <DatePicker
                  date={estimateDetails.estimateDate}
                  setDate={(date) => handleEstimateDetailsChange('estimateDate', date)}
                  id="estimateDate"
                  placeholder="Select date"
                  className="w-full mt-1"
                />
              </div>
              <div>
                <Label htmlFor="expiryDate" className="text-right md:text-left">Expiry Date:</Label>
                <DatePicker
                  date={estimateDetails.expiryDate}
                  setDate={(date) => handleEstimateDetailsChange('expiryDate', date)}
                  id="expiryDate"
                  placeholder="Select date"
                  className="w-full mt-1"
                />
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="mb-8">
            <h3 className="font-semibold text-lg mb-2">Bill To:</h3>
            <div className="space-y-2">
              <div>
                <Label htmlFor="customerName">Customer Name:</Label>
                <Input
                  id="customerName"
                  value={customer.name}
                  onChange={(e) => handleCustomerChange('name', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="customerAddress">Customer Address:</Label>
                <Input
                  id="customerAddress"
                  value={customer.address}
                  onChange={(e) => handleCustomerChange('address', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="overflow-x-auto rounded-lg border border-border dark:border-dark-border shadow-md mb-8">
            <Table>
              <TableHeader className="bg-muted/50 dark:bg-dark-muted/50">
                <TableRow>
                  <TableHead className="w-[40px]">#</TableHead>
                  <TableHead className="min-w-[200px]">Product/Service</TableHead>
                  <TableHead className="w-[100px]">Quantity</TableHead>
                  <TableHead className="w-[100px]">Qty Unit</TableHead>
                  <TableHead className="w-[120px] text-right">Rate (Billing Unit)</TableHead>
                  <TableHead className="w-[100px]">Billing Unit</TableHead>
                  <TableHead className="w-[120px] text-right">Total</TableHead>
                  <TableHead className="w-[60px] text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lineItems.map((item, index) => {
                  console.log('Item:', item);
                  console.log('item.totalPrice:', item.totalPrice);
                  return (
                    <TableRow key={item.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Select value={item.productId} onValueChange={(value) => handleLineItemChange(item.id, 'productId', value)}>
                          <SelectTrigger className="text-sm"><SelectValue placeholder="Select product" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value={null}>Select product</SelectItem>
                            {availableProducts.map(p => (<SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input type="number" value={item.quantityInput} onChange={(e) => handleLineItemChange(item.id, 'quantityInput', e.target.value)} placeholder="1" className="w-full text-sm" min="0" step="any"/>
                      </TableCell>
                      <TableCell>
                         <Select value={item.quantityUnitId} onValueChange={(value) => handleLineItemChange(item.id, 'quantityUnitId', value)} disabled={!item.productDetails}>
                           <SelectTrigger className="text-sm"><SelectValue placeholder="Unit" /></SelectTrigger>
                           <SelectContent>{item.productDetails?.units && item.productDetails.units.map(u => (<SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>))}</SelectContent>
                         </Select>
                      </TableCell>
                      <TableCell>
                        <Input type="number" value={item.rateForBillingUnit} onChange={(e) => handleLineItemChange(item.id, 'rateForBillingUnit', e.target.value)} placeholder="0.00" className="w-full text-sm" min="0" step="0.01"/>
                      </TableCell>
                       <TableCell>
                         <Select value={item.billingUnitId} onValueChange={(value) => handleLineItemChange(item.id, 'billingUnitId', value)} disabled={!item.productDetails}>
                           <SelectTrigger className="text-sm"><SelectValue placeholder="Unit" /></SelectTrigger>
                           <SelectContent>{item.productDetails?.units?.map(u => (<SelectItem key={u.id} value={u.id}>{u.name} ({u.factor} {item.productDetails?.baseUnitName})</SelectItem>))}</SelectContent>
                         </Select>
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {(item.totalPrice || 0).toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button variant="ghost" size="icon" onClick={() => removeLineItem(item.id)}>
                          <Trash2 size={16} className="text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <Button onClick={addLineItem} variant="outline" className="mb-8">
            <PlusCircle size={18} className="mr-2" /> Add Line Item
          </Button>

          {/* Overall Total */}
          <div className="flex justify-end">
            <div className="w-full md:w-1/3 border-t border-border dark:border-dark-border pt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Overall Total:</span>
                <span>{(overallTotal || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
              </div>
            </div>
          </div>

          {/* Save/Print Buttons */}
          <div className="flex justify-end space-x-2 mt-8">
            <Button variant="outline">Save Draft</Button>
            <Button>Finalize & Print</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Estimate;