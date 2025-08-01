import React from 'react';
import { Factory, PackagePlus, ClipboardList, Hourglass, PackageCheck, Trash2, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

const BOM = ({ products }) => {
    const [boms, setBoms] = React.useState(() => {
        const savedBoms = localStorage.getItem('boms');
        return savedBoms ? JSON.parse(savedBoms) : [];
    });
    const [isBomFormOpen, setIsBomFormOpen] = React.useState(false);
    const [editingBom, setEditingBom] = React.useState(null);

    React.useEffect(() => {
        localStorage.setItem('boms', JSON.stringify(boms));
    }, [boms]);

    // State for the form
    const [inputItems, setInputItems] = React.useState([]);
    const [itemName, setItemName] = React.useState('');
    const [quantity, setQuantity] = React.useState(1);
    const [cost, setCost] = React.useState(0);

    const [productToProduce, setProductToProduce] = React.useState('');
    const [productToProduceQty, setProductToProduceQty] = React.useState(1);
    const [salesPrice, setSalesPrice] = React.useState(0);
    const [editableSalesPrice, setEditableSalesPrice] = React.useState(0);
    const [byProducts, setByProducts] = React.useState([]);
    const [selectedByProduct, setSelectedByProduct] = React.useState('');
    const [byProductQty, setByProductQty] = React.useState(1);
    const [byProductEditableSalesPrice, setByProductEditableSalesPrice] = React.useState(0);

    const [overheadItems, setOverheadItems] = React.useState([]);
    const [overheadName, setOverheadName] = React.useState('');
    const [overheadAmount, setOverheadAmount] = React.useState(0);

    const resetForm = () => {
        setInputItems([]);
        setItemName('');
        setQuantity(1);
        setCost(0);
        setProductToProduce('');
        setProductToProduceQty(1);
        setSalesPrice(0);
        setEditableSalesPrice(0);
        setByProducts([]);
        setSelectedByProduct('');
        setByProductQty(1);
        setByProductEditableSalesPrice(0);
        setOverheadItems([]);
        setOverheadName('');
        setOverheadAmount(0);
    };

    React.useEffect(() => {
        if (editingBom) {
            setProductToProduce(editingBom.productToProduce);
            setProductToProduceQty(editingBom.productToProduceQty);
            setInputItems(editingBom.inputItems);
            setOverheadItems(editingBom.overheadItems);
            setByProducts(editingBom.byProducts);
            const product = products.find(p => p.name === editingBom.productToProduce);
            if (product) {
                setSalesPrice(product.salesPrice);
                setEditableSalesPrice(product.salesPrice);
            }
        } else {
            resetForm();
        }
    }, [editingBom, products]);

    const handleSaveBom = () => {
        const totalInputCost = inputItems.reduce((total, item) => total + item.quantity * item.cost, 0) + overheadItems.reduce((total, item) => total + item.amount, 0);
        const mainProductSalesValue = productToProduceQty * editableSalesPrice;
        const byProductsSalesValue = byProducts.reduce((total, item) => total + (item.quantity * item.editableSalesPrice), 0);
        const totalSalesValue = mainProductSalesValue + byProductsSalesValue;
        const mainProductAllocatedCost = totalSalesValue > 0 ? (mainProductSalesValue / totalSalesValue) * totalInputCost : 0;
        const perUnitCost = mainProductAllocatedCost / (productToProduceQty || 1);

        if (editingBom) {
            const updatedBom = {
                ...editingBom,
                productToProduce,
                productToProduceQty,
                inputItems,
                overheadItems,
                byProducts,
                totalInputCost,
                perUnitCost,
            };
            setBoms(boms.map(bom => bom.id === editingBom.id ? updatedBom : bom));
            setEditingBom(null);
        } else {
            const newBom = {
                id: boms.length > 0 ? Math.max(...boms.map(b => b.id)) + 1 : 1,
                productToProduce,
                productToProduceQty,
                inputItems,
                overheadItems,
                byProducts,
                totalInputCost,
                perUnitCost,
            };
            setBoms([...boms, newBom]);
        }
        resetForm();
        setIsBomFormOpen(false);
    };

    const handleCancel = () => {
        resetForm();
        setEditingBom(null);
        setIsBomFormOpen(false);
    };

    const handleEditBom = (bom) => {
        setEditingBom(bom);
        setIsBomFormOpen(true);
    };

    const handleDeleteBom = (id) => {
        setBoms(boms.filter(bom => bom.id !== id));
    };

    const handleSelectProductToProduce = (value) => {
        const selectedProduct = products.find(p => p.name === value);
        if (selectedProduct) {
            setProductToProduce(selectedProduct.name);
            setSalesPrice(selectedProduct.salesPrice);
            setEditableSalesPrice(selectedProduct.salesPrice);
        }
    };

    const handleSelectMaterial = (value) => {
        const selectedProduct = products.find(p => p.name === value);
        if (selectedProduct) {
            setItemName(selectedProduct.name);
            setCost(selectedProduct.costingPrice);
        }
    };

    const handleAddItem = () => {
        if (itemName && quantity > 0 && cost >= 0) {
            setInputItems([...inputItems, { name: itemName, quantity, cost }]);
            setItemName('');
            setQuantity(1);
            setCost(0);
        }
    };

    const handleAddByProduct = () => {
        if (selectedByProduct && byProductQty > 0) {
            const product = products.find(p => p.name === selectedByProduct);
            if (product) {
                setByProducts([...byProducts, { name: product.name, quantity: byProductQty, salesPrice: product.salesPrice, costingPrice: product.costingPrice || 0, editableSalesPrice: byProductEditableSalesPrice }]);
                setSelectedByProduct('');
                setByProductQty(1);
                setByProductEditableSalesPrice(0);
            }
        }
    };

    const handleSelectByProduct = (value) => {
        const selectedProduct = products.find(p => p.name === value);
        if (selectedProduct) {
            setSelectedByProduct(selectedProduct.name);
            setByProductEditableSalesPrice(selectedProduct.salesPrice);
        }
    };

    const handleDeleteOverhead = (index) => {
        setOverheadItems(overheadItems.filter((_, i) => i !== index));
    };

    const handleDeleteByProduct = (index) => {
        setByProducts(byProducts.filter((_, i) => i !== index));
    };

    const handleAddOverhead = () => {
        if (overheadName && overheadAmount >= 0) {
            setOverheadItems([...overheadItems, { name: overheadName, amount: overheadAmount }]);
            setOverheadName('');
            setOverheadAmount(0);
        }
    };

    const totalInputCost = inputItems.reduce((total, item) => total + item.quantity * item.cost, 0) + overheadItems.reduce((total, item) => total + item.amount, 0);

    // Calculate sales values
    const mainProductSalesValue = productToProduceQty * editableSalesPrice;
    const byProductsSalesValue = byProducts.reduce((total, item) => total + (item.quantity * item.editableSalesPrice), 0);
    const totalSalesValue = mainProductSalesValue + byProductsSalesValue;

    // Calculate allocated costs
    const mainProductAllocatedCost = totalSalesValue > 0 ? (mainProductSalesValue / totalSalesValue) * totalInputCost : 0;
    const allocatedByProducts = byProducts.map(item => ({
        ...item,
        allocatedCost: totalSalesValue > 0 ? (item.quantity * item.editableSalesPrice / totalSalesValue) * totalInputCost : 0
    }));

    const perUnitCost = mainProductAllocatedCost / (productToProduceQty || 1);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>Bill of Materials (BOM)</span>
                    <Dialog open={isBomFormOpen} onOpenChange={setIsBomFormOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => { setEditingBom(null); setIsBomFormOpen(true); }}>
                                <PackagePlus className="mr-2 h-4 w-4" /> Create New BOM
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-6xl h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>{editingBom ? 'Edit' : 'Create'} Bill of Materials</DialogTitle>
                            </DialogHeader>
                            {/* Form content */}
                            <div className="flex items-center gap-4 mb-4">
                                <h3 className="text-lg font-semibold">Want to produce</h3>
                                <Select onValueChange={handleSelectProductToProduce} value={productToProduce}>
                                    <SelectTrigger className="w-[300px]">
                                        <SelectValue placeholder="Select Product to Produce" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {products.map((product) => (
                                            <SelectItem key={product.id} value={product.name}>
                                                {product.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Input type="number" placeholder="Quantity" value={productToProduceQty} onChange={(e) => setProductToProduceQty(parseInt(e.target.value, 10) || 0)} className="w-[150px]" />
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Input (Raw Materials)</h3>
                                    <div className="grid grid-cols-4 gap-4 mb-4">
                                        <Select onValueChange={handleSelectMaterial}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Raw Material" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {products.map((product) => (
                                                    <SelectItem key={product.id} value={product.name}>
                                                        {product.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Input type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 0)} />
                                        <Input type="number" placeholder="Cost per Unit" value={cost} readOnly />
                                        <Button onClick={handleAddItem}>Add</Button>
                                    </div>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Item Name</TableHead>
                                                <TableHead>Quantity</TableHead>
                                                <TableHead>Cost per Unit</TableHead>
                                                <TableHead>Total Cost</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {inputItems.map((item, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{item.name}</TableCell>
                                                    <TableCell>{item.quantity}</TableCell>
                                                    <TableCell>${item.cost.toFixed(2)}</TableCell>
                                                    <TableCell>${(item.quantity * item.cost).toFixed(2)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    <div className="text-right mt-4 font-bold">
                                        Total Raw Material Cost: ${inputItems.reduce((total, item) => total + item.quantity * item.cost, 0).toFixed(2)}
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">Overhead Cost</h3>
                                    <div className="grid grid-cols-3 gap-4 mb-4">
                                        <Input placeholder="Overhead Name" value={overheadName} onChange={(e) => setOverheadName(e.target.value)} />
                                        <Input type="number" placeholder="Amount" value={overheadAmount} onChange={(e) => setOverheadAmount(parseFloat(e.target.value) || 0)} />
                                        <Button onClick={handleAddOverhead}>Add Overhead</Button>
                                    </div>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                    <TableHead>Overhead Name</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {overheadItems.map((item, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{item.name}</TableCell>
                                                    <TableCell>${item.amount.toFixed(2)}</TableCell>
                                                    <TableCell>
                                                        <Button variant="ghost" size="icon" onClick={() => handleDeleteOverhead(index)}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    <div className="text-right mt-4 font-bold">
                                        Total Overhead Cost: ${overheadItems.reduce((total, item) => total + item.amount, 0).toFixed(2)}
                                    </div>
                                    <div className="text-right mt-4 font-bold text-xl">
                                        Total Input Cost: ${totalInputCost.toFixed(2)}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Main Product Output</h3>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Product Name</TableHead>
                                                <TableHead>Qty</TableHead>
                                                <TableHead>Sales Price</TableHead>
                                                <TableHead>Per Unit Cost</TableHead>
                                                <TableHead>Total Cost</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>{productToProduce || 'Finished Product'}</TableCell>
                                                <TableCell>{productToProduceQty}</TableCell>
                                                <TableCell><Input type="number" value={editableSalesPrice} onChange={(e) => setEditableSalesPrice(parseFloat(e.target.value) || 0)} className="w-24 text-right" /></TableCell>
                                                <TableCell>${perUnitCost.toFixed(2)}</TableCell>
                                                <TableCell>${mainProductAllocatedCost.toFixed(2)}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                    <h3 className="text-lg font-semibold mb-2">By-Product/Co-product/Scrap</h3>
                                    <div className="grid grid-cols-3 gap-4 mb-4">
                                        <Select onValueChange={handleSelectByProduct}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select By-Product" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {products.map((product) => (
                                                    <SelectItem key={product.id} value={product.name}>
                                                        {product.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Input type="number" placeholder="Quantity" value={byProductQty} onChange={(e) => setByProductQty(parseInt(e.target.value, 10) || 0)} />
                                        <Input type="number" placeholder="Sales Price" value={byProductEditableSalesPrice} onChange={(e) => setByProductEditableSalesPrice(parseFloat(e.target.value) || 0)} />
                                        <Button onClick={handleAddByProduct}>Add By-Product</Button>
                                    </div>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                    <TableHead>By-Product Name</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Sales Price</TableHead>
                                    <TableHead>Per Unit Cost</TableHead>
                                    <TableHead>Total Cost</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {allocatedByProducts.map((item, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{item.name}</TableCell>
                                                    <TableCell>{item.quantity}</TableCell>
                                                    <TableCell><Input type="number" value={item.editableSalesPrice} onChange={(e) => {
                                                    const updatedByProducts = [...byProducts];
                                                    updatedByProducts[index].editableSalesPrice = parseFloat(e.target.value) || 0;
                                                    setByProducts(updatedByProducts);
                                                }} className="w-24 text-right" /></TableCell>
                                                    <TableCell>${(item.allocatedCost / item.quantity).toFixed(2)}</TableCell>
                                                    <TableCell>${item.allocatedCost.toFixed(2)}</TableCell>
                                                    <TableCell>
                                                        <Button variant="ghost" size="icon" onClick={() => handleDeleteByProduct(index)}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    <div className="text-right mt-4 font-bold text-xl">
                                        Total Allocated Cost: ${(mainProductAllocatedCost + allocatedByProducts.reduce((total, item) => total + item.allocatedCost, 0)).toFixed(2)}
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                                <Button onClick={handleSaveBom}>Save BOM</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>BOM ID</TableHead>
                            <TableHead>Product to Produce</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Total Cost</TableHead>
                            <TableHead>Per Unit Cost</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {boms.map((bom) => (
                            <TableRow key={bom.id}>
                                <TableCell>{bom.id}</TableCell>
                                <TableCell>{bom.productToProduce}</TableCell>
                                <TableCell>{bom.productToProduceQty}</TableCell>
                                <TableCell>${bom.totalInputCost.toFixed(2)}</TableCell>
                                <TableCell>${bom.perUnitCost.toFixed(2)}</TableCell>
                                <TableCell>
                                    <Button variant="ghost" size="icon" onClick={() => handleEditBom(bom)}>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteBom(bom.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

const ProductionOrder = () => {
    const [boms, setBoms] = React.useState([]);
    const [selectedBomId, setSelectedBomId] = React.useState('');
    const [productionQty, setProductionQty] = React.useState(1);

    React.useEffect(() => {
        const savedBoms = localStorage.getItem('boms');
        if (savedBoms) {
            setBoms(JSON.parse(savedBoms));
        }
    }, []);

    const selectedBom = boms.find(bom => bom.id.toString() === selectedBomId);

    const scalingFactor = selectedBom && selectedBom.productToProduceQty > 0 && productionQty > 0
        ? productionQty / selectedBom.productToProduceQty
        : 1;

    const totalInputsCost = selectedBom ? 
        (selectedBom.inputItems.reduce((total, item) => total + (item.quantity * item.cost), 0) + 
        selectedBom.overheadItems.reduce((total, item) => total + item.amount, 0)) * scalingFactor
        : 0;

    const totalMainProductCost = selectedBom ? productionQty * selectedBom.perUnitCost : 0;
    
    const totalByProductCost = selectedBom ? 
        selectedBom.byProducts.reduce((total, item) => total + ((item.costingPrice || 0) * item.quantity * scalingFactor), 0)
        : 0;

    const totalOutputsCost = totalMainProductCost + totalByProductCost;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">Production Order</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1">
                        <label htmlFor="bom-select" className="text-sm font-medium">Select BOM to start production</label>
                        <Select onValueChange={setSelectedBomId} value={selectedBomId}>
                            <SelectTrigger id="bom-select">
                                <SelectValue placeholder="Select a Bill of Materials" />
                            </SelectTrigger>
                            <SelectContent>
                                {boms.map((bom) => (
                                    <SelectItem key={bom.id} value={bom.id.toString()}>
                                        {bom.id}: {bom.productToProduce} (Qty: {bom.productToProduceQty})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex-1">
                        <label htmlFor="production-qty" className="text-sm font-medium">Quantity to Produce</label>
                        <Input
                            id="production-qty"
                            type="number"
                            placeholder="Enter quantity"
                            value={productionQty}
                            onChange={(e) => setProductionQty(parseInt(e.target.value, 10) || 1)}
                            disabled={!selectedBomId}
                        />
                    </div>
                </div>

                {selectedBom && (
                    <div className="grid grid-cols-2 gap-8">
                        {/* Input Side */}
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Inputs (Scaled)</h3>
                            <h4 className="font-semibold mb-2">Raw Materials</h4>
                            <Table>
                                <TableHeader><TableRow><TableHead>Item</TableHead><TableHead>Quantity</TableHead><TableHead>Per Unit Cost</TableHead><TableHead>Total Cost</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    {selectedBom.inputItems.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell>{(item.quantity * scalingFactor).toFixed(2)}</TableCell>
                                            <TableCell>${item.cost.toFixed(2)}</TableCell>
                                            <TableCell>${(item.quantity * scalingFactor * item.cost).toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            <h4 className="font-semibold mt-4 mb-2">Overhead Costs</h4>
                            <Table>
                                <TableHeader><TableRow><TableHead>Overhead</TableHead><TableHead>Total Cost</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    {selectedBom.overheadItems.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell>${(item.amount * scalingFactor).toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <div className="text-right mt-4 font-bold text-xl">
                                Total Input Cost: ${totalInputsCost.toFixed(2)}
                            </div>
                        </div>

                        {/* Output Side */}
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Outputs (Scaled)</h3>
                            <h4 className="font-semibold mb-2">Main Product</h4>
                            <Table>
                                <TableHeader><TableRow><TableHead>Product</TableHead><TableHead>Quantity</TableHead><TableHead>Per Unit Cost</TableHead><TableHead>Total Cost</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>{selectedBom.productToProduce}</TableCell>
                                        <TableCell>{productionQty}</TableCell>
                                        <TableCell>${selectedBom.perUnitCost.toFixed(2)}</TableCell>
                                        <TableCell>${totalMainProductCost.toFixed(2)}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>

                            {selectedBom.byProducts.length > 0 && (
                                <>
                                    <h4 className="font-semibold mt-4 mb-2">By-Products</h4>
                                    <Table>
                                        <TableHeader><TableRow><TableHead>By-Product</TableHead><TableHead>Quantity</TableHead><TableHead>Per Unit Cost</TableHead><TableHead>Total Cost</TableHead></TableRow></TableHeader>
                                        <TableBody>
                                            {selectedBom.byProducts.map((item, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{item.name}</TableCell>
                                                    <TableCell>{(item.quantity * scalingFactor).toFixed(2)}</TableCell>
                                                    <TableCell>${(item.costingPrice || 0).toFixed(2)}</TableCell>
                                                    <TableCell>${((item.costingPrice || 0) * item.quantity * scalingFactor).toFixed(2)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </>
                            )}
                            <div className="text-right mt-4 font-bold text-xl">
                                Total Output Cost: ${totalOutputsCost.toFixed(2)}
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

const WIPTracking = () => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center">
                <Hourglass className="mr-2" /> WIP Tracking
            </CardTitle>
        </CardHeader>
        <CardContent>
            <p>Track Work in Progress for your production orders.</p>
        </CardContent>
    </Card>
);

const FinishedGoods = () => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center">
                <PackageCheck className="mr-2" /> Finished Goods
            </CardTitle>
        </CardHeader>
        <CardContent>
            <p>Manage your inventory of finished goods.</p>
        </CardContent>
    </Card>
);


const Production = ({ products }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-ecb-primary flex items-center">
          <Factory size={32} className="mr-3 text-ecb-accent" /> Production Management
        </h1>
        <Button className="bg-ecb-accent text-ecb-primary hover:bg-ecb-accent/90">
          <PackagePlus size={20} className="mr-2" /> Start New Production Order
        </Button>
      </div>

      <Tabs defaultValue="bom" className="space-y-4">
        <TabsList>
          <TabsTrigger value="bom">
            <ClipboardList className="mr-2 h-4 w-4" /> BOM
          </TabsTrigger>
          <TabsTrigger value="order">
            <Factory className="mr-2 h-4 w-4" /> Production Order
          </TabsTrigger>
          <TabsTrigger value="wip">
            <Hourglass className="mr-2 h-4 w-4" /> WIP Tracking
          </TabsTrigger>
          <TabsTrigger value="finished">
            <PackageCheck className="mr-2 h-4 w-4" /> Finished Goods
          </TabsTrigger>
        </TabsList>
        <TabsContent value="bom">
          <BOM products={products} />
        </TabsContent>
        <TabsContent value="order">
          <ProductionOrder />
        </TabsContent>
        <TabsContent value="wip">
          <WIPTracking />
        </TabsContent>
        <TabsContent value="finished">
          <FinishedGoods />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Production;
