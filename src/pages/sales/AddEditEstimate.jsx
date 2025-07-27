import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';

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
  const { id } = useParams(); // Get ID from URL for editing
  const navigate = useNavigate();
  const [estimateDetails, setEstimateDetails] = useState(() => {
    const today = new Date();
    const expiry = new Date();
    expiry.setDate(today.getDate() + 7);
    return {
      estimateNumber: `EST-${String(Date.now()).slice(-6)}`,
      estimateDate: today,
      expiryDate: expiry,
    };
  });

  const [myCompany, setMyCompany] = useState({
    name: 'My Company Name',
    address: '123 Business Rd, City, Country',
    logo: '', // Placeholder
  });

  const [customer, setCustomer] = useState({
    id: '',
    name: '',
    address: '',
  });

  const [availableCustomers, setAvailableCustomers] = useState([]);

  const [availableProducts, setAvailableProducts] = useState([]);

  useEffect(() => {
    setAvailableProducts(getProductsFromStorage());
    const storedCustomers = JSON.parse(localStorage.getItem('customers') || '[]');
    setAvailableCustomers(storedCustomers);

    if (id) {
      const storedEstimates = JSON.parse(localStorage.getItem('estimates') || '[]');
      const existingEstimate = storedEstimates.find(est => est.id === id);
      if (existingEstimate) {
        setEstimateDetails({
          estimateNumber: existingEstimate.estimateDetails.estimateNumber,
          estimateDate: new Date(existingEstimate.estimateDetails.estimateDate),
          expiryDate: new Date(existingEstimate.estimateDetails.expiryDate),
        });
        setMyCompany(existingEstimate.myCompany);
        setCustomer(existingEstimate.customer);
        setLineItems(existingEstimate.lineItems.map(item => ({
          ...item,
          productDetails: getProductsFromStorage().find(p => p.id === item.productId) || null,
        })));
        setDescription(existingEstimate.description || '');
      } else {
        toast({ title: "Estimate Not Found", description: "The estimate you are trying to edit does not exist.", variant: "destructive" });
        navigate('/sales/estimate'); // Redirect to list if not found
      }
    } else {
      // Reset form for new estimate
      setEstimateDetails(() => {
        const today = new Date();
        const expiry = new Date();
        expiry.setDate(today.getDate() + 7);
        return {
          estimateNumber: `EST-${String(Date.now()).slice(-6)}`,
          estimateDate: today,
          expiryDate: expiry,
        };
      });
      setMyCompany({
        name: 'My Company Name',
        address: '123 Business Rd, City, Country',
        logo: '',
      });
      setCustomer({ id: '', name: '', address: '' });
      setLineItems([
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
      setDescription('');
    }
  }, [id, navigate]);

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

  const [description, setDescription] = useState('');

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

  const handleSaveEstimate = (isDraft) => {
    if (!estimateDetails.estimateNumber || !estimateDetails.estimateDate || !estimateDetails.expiryDate) {
      toast({ title: "Validation Error", description: "Estimate Number, Date, and Expiry Date are required.", variant: "destructive" });
      return;
    }
    if (!customer.id) {
      toast({ title: "Validation Error", description: "Please select a customer.", variant: "destructive" });
      return;
    }
    if (lineItems.some(item => !item.productId || item.quantityInput === 0)) {
      toast({ title: "Validation Error", description: "Please ensure all line items have a product and valid quantity.", variant: "destructive" });
      return;
    }
    if (lineItems.length === 0 || lineItems.every(item => item.quantityInput === 0)) {
      toast({ title: "Validation Error", description: "Cannot save an empty estimate or an estimate with all zero quantities.", variant: "destructive" });
      return;
    }

    const finalLineItems = lineItems.filter(li => li.quantityInput > 0);

    const estimateData = {
      id: estimateDetails.estimateNumber, // Using estimate number as ID for simplicity
      estimateDetails: {
        ...estimateDetails,
        estimateDate: estimateDetails.estimateDate?.toISOString(),
        expiryDate: estimateDetails.expiryDate?.toISOString(),
      },
      myCompany,
      customer,
      lineItems: finalLineItems.map(li => ({
        productId: li.productId, productName: li.productDetails?.name,
        quantityInput: li.quantityInput, quantityUnitId: li.quantityUnitId,
        quantityUnitName: li.productDetails?.units.find(u => u.id === li.quantityUnitId)?.name,
        quantityUnitFactor: li.productDetails?.units.find(u => u.id === li.quantityUnitId)?.factor,
        billingUnitId: li.billingUnitId,
        billingUnitName: li.productDetails?.units.find(u => u.id === li.billingUnitId)?.name,
        billingUnitFactor: li.productDetails?.units.find(u => u.id === li.billingUnitId)?.factor,
        rateForBillingUnit: li.rateForBillingUnit,
        totalPrice: li.totalPrice,
      })),
      overallTotal,
      isDraft,
      description,
      createdAt: new Date().toISOString(),
    };

    const existingEstimates = JSON.parse(localStorage.getItem('estimates') || '[]');
    const updatedEstimates = [...existingEstimates.filter(est => est.id !== estimateData.id), estimateData];
    localStorage.setItem('estimates', JSON.stringify(updatedEstimates));

    toast({ title: "Estimate Saved", description: `Estimate ${estimateData.id} has been ${isDraft ? 'saved as draft' : 'finalized'}.`, className: 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 border-green-300 dark:border-green-600' });

    if (!isDraft) {
      window.print();
    }
    navigate('/sales/estimate'); // Navigate back to list after save/finalize
  };

  return (
    <div className="space-y-6 p-1">
      <Card className="shadow-lg border-border dark:border-dark-border">
        <CardHeader className="bg-card dark:bg-dark-card rounded-t-lg p-4 md:p-6 border-b border-border dark:border-dark-border">
          <CardTitle className="text-2xl md:text-3xl font-bold text-primary dark:text-dark-primary">
            {id ? 'Edit Estimate' : 'Create Estimate'}
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
                <Label htmlFor="customerSelect">Customer:</Label>
                <Select
                  value={customer.id || ''}
                  onValueChange={(value) => {
                    if (value === 'placeholder') {
                      setCustomer({ id: '', name: '', address: '' });
                    } else {
                      const selectedCustomer = availableCustomers.find(c => c.id === value);
                      if (selectedCustomer) {
                        setCustomer({
                          id: selectedCustomer.id,
                          name: selectedCustomer.name,
                          address: selectedCustomer.address || '',
                        });
                      } else {
                        setCustomer({ id: '', name: '', address: '' });
                      }
                    }
                  }}
                >
                  <SelectTrigger id="customerSelect" className="mt-1">
                    <SelectValue placeholder="Select a customer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="placeholder">Select a customer</SelectItem>
                    {availableCustomers.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {customer.name && (
                <div className="mt-2 p-3 border rounded-md bg-muted/50 dark:bg-dark-muted/50">
                  <p className="font-semibold">{customer.name}</p>
                  <p className="text-sm text-muted-foreground">{customer.address}</p>
                </div>
              )}
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

          <div className="grid md:grid-cols-2 gap-6 items-start">
            {/* Description Box */}
            <div>
              <Label htmlFor="description" className="font-semibold">Description / Notes</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add any additional notes or descriptions here..."
                className="mt-1 min-h-[100px]"
              />
            </div>
            {/* Overall Total */}
            <div className="flex justify-end md:justify-start md:col-start-2">
              <div className="w-full md:w-1/2 border-t border-border dark:border-dark-border pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Overall Total:</span>
                  <span>{(overallTotal || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Save/Print Buttons */}
          <div className="flex justify-end space-x-2 mt-8">
            <Button variant="outline" onClick={() => handleSaveEstimate(true)}>Save Draft</Button>
            <Button onClick={() => handleSaveEstimate(false)}>Finalize & Print</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Estimate;