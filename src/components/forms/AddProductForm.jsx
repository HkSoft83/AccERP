import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch'; 
import { useToast } from '@/components/ui/use-toast';
import { PlusCircle, Trash2, Star, Save } from 'lucide-react';
import { DialogFooter, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const productTypes = [
  { value: 'Stock', label: 'Stock', description: 'Products you buy and/or sell and that you track quantities of.' },
  { value: 'Non-stock', label: 'Non-stock', description: 'Products you buy and/or sell but don’t need to (or can’t) track quantities of, for example, nuts and bolts used in an installation.' },
  { value: 'Service', label: 'Service', description: 'Services that you provide to customers.' },
  { value: 'Combo', label: 'Combo', description: 'A collection of products and/or services that you sell together, for example, a gift basket of fruit, cheese, and wine.' },
];

const AddProductForm = ({ onSave, onCancel, initialData, isEditMode, allProducts }) => {
  const { toast } = useToast();
  const [productType, setProductType] = useState('Stock'); // Default to Stock
  const [productName, setProductName] = useState('');
  const [productCode, setProductCode] = useState('');
  const [description, setDescription] = useState('');
  const [batchNo, setBatchNo] = useState('');
  const [manufacturingDate, setManufacturingDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [extraField1Name, setExtraField1Name] = useState('Extra Field 1');
  const [extraField1Value, setExtraField1Value] = useState('');
  const [extraField2Name, setExtraField2Name] = useState('Extra Field 2');
  const [extraField2Value, setExtraField2Value] = useState('');
  const [category, setCategory] = useState('');
  const [costingPrice, setCostingPrice] = useState('');
  const [salesPrice, setSalesPrice] = useState('');
  const [openingQuantity, setOpeningQuantity] = useState('');
  const [hasWarranty, setHasWarranty] = useState(false);
  const [warrantyDays, setWarrantyDays] = useState('');
  const [comboItems, setComboItems] = useState([]);
  const [selectedComboProduct, setSelectedComboProduct] = useState('');
  const [selectedComboQuantity, setSelectedComboQuantity] = useState(1);
  
  const [units, setUnits] = useState([{ id: Date.now(), name: 'pcs', factor: 1, isBase: true }]);
  const [newUnitName, setNewUnitName] = useState('');
  const [newUnitFactor, setNewUnitFactor] = useState(1);
  const [originalId, setOriginalId] = useState(null);

  useEffect(() => {
    if (isEditMode && initialData) {
      setProductType(initialData.productType || 'Stock');
      setProductName(initialData.name || '');
      setProductCode(initialData.code || initialData.id || '');
      setDescription(initialData.description || '');
      setBatchNo(initialData.batchNo || '');
      setManufacturingDate(initialData.manufacturingDate || '');
      setExpiryDate(initialData.expiryDate || '');
      setExtraField1Name(initialData.extraField1Name || 'Extra Field 1');
      setExtraField1Value(initialData.extraField1Value || '');
      setExtraField2Name(initialData.extraField2Name || 'Extra Field 2');
      setExtraField2Value(initialData.extraField2Value || '');
      setCategory(initialData.category || '');
      setCostingPrice(initialData.costingPrice?.toString() || '');
      setSalesPrice(initialData.salesPrice?.toString() || '');
      setOpeningQuantity(initialData.openingQuantity?.toString() || '');
      setHasWarranty(initialData.hasWarranty || false);
      setWarrantyDays(initialData.warrantyDays?.toString() || '');
      setUnits(initialData.units && initialData.units.length > 0 ? initialData.units : [{ id: Date.now(), name: 'pcs', factor: 1, isBase: true }]);
      setOriginalId(initialData.id || initialData.code);
      setComboItems(initialData.comboItems || []);
    } else {
      resetForm();
    }
  }, [initialData, isEditMode]);

  const resetForm = () => {
    setProductType('Stock');
    setProductName('');
    setProductCode('');
    setDescription('');
    setBatchNo('');
    setManufacturingDate('');
    setExpiryDate('');
    setExtraField1Name('Extra Field 1');
    setExtraField1Value('');
    setExtraField2Name('Extra Field 2');
    setExtraField2Value('');
    setCategory('');
    setCostingPrice('');
    setSalesPrice('');
    setOpeningQuantity('');
    setHasWarranty(false);
    setWarrantyDays('');
    setUnits([{ id: Date.now(), name: 'pcs', factor: 1, isBase: true }]);
    setNewUnitName('');
    setNewUnitFactor(1);
    setOriginalId(null);
    setComboItems([]);
    setSelectedComboProduct('');
    setSelectedComboQuantity(1);
  };

  const handleAddUnit = () => {
    if (!newUnitName.trim() || newUnitFactor <= 0) {
      toast({ title: "Invalid Unit", description: "Please provide a valid unit name and factor.", variant: "destructive" });
      return;
    }
    if (units.find(u => u.name.toLowerCase() === newUnitName.trim().toLowerCase())) {
      toast({ title: "Duplicate Unit", description: "This unit name already exists.", variant: "destructive" });
      return;
    }
    setUnits([...units, { id: Date.now(), name: newUnitName.trim(), factor: parseFloat(newUnitFactor), isBase: units.length === 0 }]);
    setNewUnitName('');
    setNewUnitFactor(1);
  };

  const handleRemoveUnit = (idToRemove) => {
    if (units.length === 1) {
      toast({ title: "Cannot Remove", description: "At least one unit must be defined.", variant: "destructive" });
      return;
    }
    const unitToRemove = units.find(u => u.id === idToRemove);
    if (unitToRemove && unitToRemove.isBase && units.length > 1) {
      toast({ title: "Cannot Remove Base Unit", description: "Please set another unit as base before removing.", variant: "destructive" });
      return;
    }
    setUnits(units.filter(unit => unit.id !== idToRemove));
  };

  const handleSetBaseUnit = (idToSetAsBase) => {
    setUnits(units.map(unit => ({ ...unit, isBase: unit.id === idToSetAsBase })));
  };

  const getBaseUnitName = () => {
    const baseUnit = units.find(u => u.isBase);
    return baseUnit ? baseUnit.name : 'N/A';
  };

  const handleAddComboItem = () => {
    if (!selectedComboProduct) {
      toast({ title: "Validation Error", description: "Please select a product/service to add to the combo.", variant: "destructive" });
      return;
    }
    if (selectedComboQuantity <= 0) {
      toast({ title: "Validation Error", description: "Quantity must be a positive number.", variant: "destructive" });
      return;
    }
    const productToAdd = allProducts.find(p => p.id === selectedComboProduct);
    if (productToAdd) {
      setComboItems(prev => [...prev, { ...productToAdd, comboQuantity: selectedComboQuantity }]);
      setSelectedComboProduct('');
      setSelectedComboQuantity(1);
    }
  };

  const handleRemoveComboItem = (idToRemove) => {
    setComboItems(prev => prev.filter(item => item.id !== idToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!productName.trim()) {
      toast({ title: "Validation Error", description: "Product name is required.", variant: "destructive" });
      return;
    }
    if (productType !== 'Service' && productType !== 'Combo' && units.filter(u => u.isBase).length !== 1) {
      toast({ title: "Validation Error", description: "Exactly one unit must be set as the base unit.", variant: "destructive" });
      return;
    }
    if (hasWarranty && (!warrantyDays || parseInt(warrantyDays) <= 0)) {
      toast({ title: "Validation Error", description: "Warranty days must be a positive number.", variant: "destructive" });
      return;
    }
    if (productType === 'Combo' && comboItems.length === 0) {
      toast({ title: "Validation Error", description: "Combo products must contain at least one item.", variant: "destructive" });
      return;
    }

    const baseUnit = units.find(u => u.isBase);

    const productData = {
      id: originalId || `prod-${Date.now()}`,
      productType,
      name: productName,
      code: productCode || (originalId ? originalId.split('-')[1] || String(Date.now()).slice(-4) : `P${String(Date.now()).slice(-4)}`),
      description,
      batchNo: productType !== 'Combo' ? batchNo : '',
      manufacturingDate: productType !== 'Combo' ? manufacturingDate : '',
      expiryDate: productType !== 'Combo' ? expiryDate : '',
      extraField1Name: productType !== 'Combo' ? extraField1Name : '',
      extraField1Value: productType !== 'Combo' ? extraField1Value : '',
      extraField2Name: productType !== 'Combo' ? extraField2Name : '',
      extraField2Value: productType !== 'Combo' ? extraField2Value : '',
      batchNo,
      manufacturingDate,
      expiryDate,
      extraField1Name,
      extraField1Value,
      extraField2Name,
      extraField2Value,
      category: productType === 'Combo' ? 'Combo' : category,
      costingPrice: productType === 'Combo' ? 0 : (parseFloat(costingPrice) || 0),
      salesPrice: productType === 'Combo' ? 0 : (parseFloat(salesPrice) || 0),
      openingQuantity: (productType === 'Service' || productType === 'Combo') ? Infinity : (parseFloat(openingQuantity) || 0),
      hasWarranty,
      warrantyDays: hasWarranty ? parseInt(warrantyDays) : 0,
      units: (productType === 'Service' || productType === 'Combo') ? [] : units.map(u => ({...u, factor: parseFloat(u.factor)})),
      baseUnitName: (productType === 'Service' || productType === 'Combo') ? 'N/A' : (baseUnit ? baseUnit.name : 'N/A'),
      comboItems: productType === 'Combo' ? comboItems.map(item => ({ id: item.id, name: item.name, comboQuantity: item.comboQuantity })) : [],
      // Preserve sl if editing
      sl: isEditMode && initialData ? initialData.sl : undefined,
      location: isEditMode && initialData ? initialData.location : 'Warehouse A', // Default or preserve
    };

    onSave(productData, isEditMode);
    
    toast({ 
        title: `Product ${isEditMode ? 'Updated' : 'Added'}`, 
        description: `${productName} has been successfully ${isEditMode ? 'updated' : 'added'}.`, 
        className: "bg-green-500 text-white dark:bg-green-600 dark:text-white" 
    });
    onCancel(); // Close dialog after save
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-1">
      <DialogHeader className="hidden">
        <DialogTitle>{isEditMode ? 'Edit Product/Service' : 'Add New Product/Service'}</DialogTitle>
        <DialogDescription>
          {isEditMode ? 'Update the details of the existing product or service.' : 'Fill in the details to add a new product or service to your inventory.'}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-2">
        <Label htmlFor="productType" className="font-semibold">Product/Service Type <span className="text-destructive">*</span></Label>
        <Select onValueChange={setProductType} value={productType} disabled={isEditMode}>
          <SelectTrigger id="productType">
            <SelectValue placeholder="Select a product type">
              {productType ? productTypes.find((type) => type.value === productType)?.label : ""}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {productTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                <span className="font-medium">{type.label}</span>
                <p className="text-xs text-muted-foreground">{type.description}</p>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="productName" className="font-semibold">Product/Service Name <span className="text-destructive">*</span></Label>
          <Input id="productName" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="e.g., Premium Widget, Hourly Consulting" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="productCode" className="font-semibold">Product Code/SKU</Label>
          <Input 
            id="productCode" 
            value={productCode} 
            onChange={(e) => setProductCode(e.target.value)} 
            placeholder="Auto-generated if blank" 
            disabled={isEditMode}
          />
          {isEditMode && <p className="text-xs text-muted-foreground">Product code cannot be changed after creation.</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="font-semibold">Description</Label>
        <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description of the product/service" />
      </div>

      {productType !== 'Combo' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="batchNo" className="font-semibold">Batch No</Label>
              <Input id="batchNo" value={batchNo} onChange={(e) => setBatchNo(e.target.value)} placeholder="e.g., BATCH-2023-001" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="manufacturingDate" className="font-semibold">Manufacturing Date</Label>
              <Input id="manufacturingDate" type="date" value={manufacturingDate} onChange={(e) => setManufacturingDate(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="expiryDate" className="font-semibold">Expiry Date</Label>
              <Input id="expiryDate" type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="extraField1Name" className="font-semibold">Extra Field 1 Name</Label>
              <Input id="extraField1Name" value={extraField1Name} onChange={(e) => setExtraField1Name(e.target.value)} placeholder="e.g., Color" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="extraField1Value" className="font-semibold">{extraField1Name}</Label>
              <Input id="extraField1Value" value={extraField1Value} onChange={(e) => setExtraField1Value(e.target.value)} placeholder="Value for Extra Field 1" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="extraField2Name" className="font-semibold">Extra Field 2 Name</Label>
              <Input id="extraField2Name" value={extraField2Name} onChange={(e) => setExtraField2Name(e.target.value)} placeholder="e.g., Size" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="extraField2Value" className="font-semibold">{extraField2Name}</Label>
            <Input id="extraField2Value" value={extraField2Value} onChange={(e) => setExtraField22Value(e.target.value)} placeholder="Value for Extra Field 2" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="font-semibold">Category</Label>
            <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g., Electronics, Services, Materials" />
          </div>
        </>
      )}

      {productType !== 'Combo' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="costingPrice" className="font-semibold">
              Costing Price (per <span className="text-accent dark:text-dark-accent">{getBaseUnitName()}</span>)
            </Label>
            <Input 
              id="costingPrice" 
              type="number" 
              value={costingPrice} 
              onChange={(e) => setCostingPrice(e.target.value)} 
              placeholder="0.00" 
              min="0" 
              step="0.01"
              disabled={isEditMode} 
              className={isEditMode ? 'disabled:opacity-70 disabled:cursor-not-allowed' : ''}
            />
            {isEditMode && <p className="text-xs text-muted-foreground">Costing price cannot be changed after creation.</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="salesPrice" className="font-semibold">
              Default Sales Price (per <span className="text-accent dark:text-dark-accent">{getBaseUnitName()}</span>)
            </Label>
            <Input id="salesPrice" type="number" value={salesPrice} onChange={(e) => setSalesPrice(e.target.value)} placeholder="0.00" min="0" step="0.01" />
          </div>
        </div>
      )}
      
      <div className="flex items-center space-x-3 pt-2">
        <Switch id="hasWarranty" checked={hasWarranty} onCheckedChange={setHasWarranty} />
        <Label htmlFor="hasWarranty" className="font-semibold">Has Warranty</Label>
      </div>

      {hasWarranty && (
        <div className="space-y-2 pt-2">
          <Label htmlFor="warrantyDays" className="font-semibold">Warranty Days</Label>
          <Input 
            id="warrantyDays" 
            type="number" 
            value={warrantyDays} 
            onChange={(e) => setWarrantyDays(e.target.value)} 
            placeholder="e.g., 365" 
          />
        </div>
      )}

      {productType === 'Stock' && (
        <div className="space-y-2 pt-2">
          <Label htmlFor="openingQuantity" className="font-semibold">
            Opening Quantity (in <span className="text-accent dark:text-dark-accent">{getBaseUnitName()}</span>)
          </Label>
          <Input 
            id="openingQuantity" 
            type="number" 
            value={openingQuantity} 
            onChange={(e) => setOpeningQuantity(e.target.value)} 
            placeholder="0" 
            min="0"
            disabled={isEditMode}
            className={isEditMode ? 'disabled:opacity-70 disabled:cursor-not-allowed' : ''}
          />
          {isEditMode && <p className="text-xs text-muted-foreground">Opening quantity cannot be changed after creation.</p>}
        </div>
      )}

      {(productType === 'Stock' || productType === 'Non-stock') && (
        <div className="space-y-4 pt-4 border-t border-border dark:border-dark-border mt-6">
          <h3 className="text-lg font-semibold text-primary dark:text-dark-primary">Manage Units of Measure</h3>
          <div className="p-4 bg-muted/50 dark:bg-dark-muted/50 rounded-md space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
              <div className="space-y-1">
                <Label htmlFor="newUnitName">New Unit Name</Label>
                <Input id="newUnitName" value={newUnitName} onChange={(e) => setNewUnitName(e.target.value)} placeholder="e.g., Dozen, Box" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="newUnitFactor">Factor (to Base Unit)</Label>
                <Input id="newUnitFactor" type="number" value={newUnitFactor} onChange={(e) => setNewUnitFactor(e.target.value)} placeholder="e.g., 12" min="0.001" step="any"/>
              </div>
              <Button type="button" onClick={handleAddUnit} className="sm:self-end bg-secondary hover:bg-secondary-hover dark:bg-dark-secondary dark:hover:bg-dark-secondary-hover text-secondary-foreground dark:text-dark-secondary-foreground">
                <PlusCircle size={18} className="mr-2"/> Add Unit
              </Button>
            </div>
            
            <AnimatePresence>
              {units.length > 0 && (
                <motion.ul 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-2 pt-2"
                >
                  {units.map(unit => (
                    <motion.li 
                      key={unit.id}
                      layout
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      className="flex items-center justify-between p-2.5 bg-background dark:bg-dark-background rounded-md shadow-sm border border-border dark:border-dark-border"
                    >
                      <div className="flex items-center">
                        <Button variant="ghost" size="icon" onClick={() => handleSetBaseUnit(unit.id)} className={`mr-2 h-7 w-7 ${unit.isBase ? 'text-yellow-500 dark:text-yellow-400' : 'text-muted-foreground dark:text-dark-muted-foreground'}`}>
                          <Star size={18} fill={unit.isBase ? "currentColor" : "none"}/>
                        </Button>
                        <span className="font-medium text-foreground dark:text-dark-foreground">{unit.name}</span>
                        <span className="text-sm text-muted-foreground dark:text-dark-muted-foreground ml-2">({unit.factor} to Base)</span>
                      </div>
                      <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveUnit(unit.id)} className="text-destructive dark:text-red-400 hover:text-destructive/80 h-7 w-7">
                        <Trash2 size={16} />
                      </Button>
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
            <p className="text-xs text-muted-foreground dark:text-dark-muted-foreground pt-1">
              Click the star <Star size={12} className="inline text-yellow-500"/> to set a unit as the base unit. All other unit factors are relative to this base unit.
            </p>
          </div>
        </div>
      )}

      {productType === 'Combo' && (
        <div className="space-y-4 pt-4 border-t border-border dark:border-dark-border mt-6">
          <h3 className="text-lg font-semibold text-primary dark:text-dark-primary">Combo Items</h3>
          <div className="p-4 bg-muted/50 dark:bg-dark-muted/50 rounded-md space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
              <div className="space-y-1 sm:col-span-2">
                <Label htmlFor="comboProduct">Select Product/Service</Label>
                <Select onValueChange={setSelectedComboProduct} value={selectedComboProduct}>
                  <SelectTrigger id="comboProduct">
                    <SelectValue placeholder="Select a product/service" />
                  </SelectTrigger>
                  <SelectContent>
                    {allProducts.filter(p => p.productType !== 'Combo').map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} ({product.productType})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="comboQuantity">Quantity</Label>
                <Input 
                  id="comboQuantity" 
                  type="number" 
                  value={selectedComboQuantity} 
                  onChange={(e) => setSelectedComboQuantity(parseInt(e.target.value) || 1)} 
                  min="1" 
                />
              </div>
              <Button type="button" onClick={handleAddComboItem} className="sm:self-end bg-secondary hover:bg-secondary-hover dark:bg-dark-secondary dark:hover:bg-dark-secondary-hover text-secondary-foreground dark:text-dark-secondary-foreground">
                <PlusCircle size={18} className="mr-2"/> Add Item
              </Button>
            </div>

            {comboItems.length > 0 && (
              <div className="overflow-x-auto rounded-md border border-border dark:border-dark-border mt-4">
                <table className="w-full text-sm text-left text-foreground dark:text-dark-foreground">
                  <thead className="text-xs text-primary dark:text-dark-primary uppercase bg-muted/50 dark:bg-dark-muted/50">
                    <tr>
                      <th scope="col" className="px-4 py-2">Product/Service Name</th>
                      <th scope="col" className="px-4 py-2 text-right">Quantity</th>
                      <th scope="col" className="px-4 py-2 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comboItems.map((item) => (
                      <tr key={item.id} className="bg-card dark:bg-dark-card border-b border-border dark:border-dark-border last:border-b-0">
                        <td className="px-4 py-2">{item.name}</td>
                        <td className="px-4 py-2 text-right">{item.comboQuantity}</td>
                        <td className="px-4 py-2 text-center">
                          <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveComboItem(item.id)} className="text-destructive dark:text-red-400 hover:text-destructive/80 h-7 w-7">
                            <Trash2 size={16} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      <DialogFooter className="pt-8">
        <DialogClose asChild>
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        </DialogClose>
        <Button type="submit" className="bg-primary hover:bg-primary-hover dark:bg-dark-primary dark:hover:bg-dark-primary-hover text-primary-foreground dark:text-dark-primary-foreground">
          <Save size={18} className="mr-2"/> {isEditMode ? 'Update Product' : 'Save Product'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default AddProductForm;
