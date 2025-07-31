import React from 'react';
import { Factory, PackagePlus, ClipboardList, Hourglass, PackageCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const BOM = ({ products }) => {
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
                setByProducts([...byProducts, { name: product.name, quantity: byProductQty, salesPrice: product.salesPrice, costingPrice: product.costingPrice, editableSalesPrice: product.salesPrice }]);
                setSelectedByProduct('');
                setByProductQty(1);
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
                <CardTitle className="flex items-center">Bill of Materials (BOM)</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-4 mb-4">
                    <h3 className="text-lg font-semibold">Want to produce</h3>
                    <Select onValueChange={handleSelectProductToProduce}>
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
                    <Input type="number" placeholder="Quantity" value={productToProduceQty} onChange={(e) => setProductToProduceQty(parseInt(e.target.value, 10))} className="w-[150px]" />
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
                            <Input type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value, 10))} />
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
                            <Input type="number" placeholder="Amount" value={overheadAmount} onChange={(e) => setOverheadAmount(parseFloat(e.target.value))} />
                            <Button onClick={handleAddOverhead}>Add Overhead</Button>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Overhead Name</TableHead>
                                    <TableHead>Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {overheadItems.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>${item.amount.toFixed(2)}</TableCell>
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
                                    <TableCell><Input type="number" value={editableSalesPrice} onChange={(e) => setEditableSalesPrice(parseFloat(e.target.value))} className="w-24 text-right" /></TableCell>
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
                            <Input type="number" placeholder="Quantity" value={byProductQty} onChange={(e) => setByProductQty(parseInt(e.target.value, 10))} />
                            <Input type="number" placeholder="Sales Price" value={byProductEditableSalesPrice} onChange={(e) => setByProductEditableSalesPrice(parseFloat(e.target.value))} />
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
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {byProducts.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                        <TableCell><Input type="number" value={item.editableSalesPrice} onChange={(e) => {
                                        const updatedByProducts = [...byProducts];
                                        updatedByProducts[index].editableSalesPrice = parseFloat(e.target.value);
                                        setByProducts(updatedByProducts);
                                    }} className="w-24 text-right" /></TableCell>
                                        <TableCell>${item.costingPrice.toFixed(2)}</TableCell>
                                        <TableCell>${item.allocatedCost.toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className="text-right mt-4 font-bold text-xl">
                            Total Allocated Cost: ${(mainProductAllocatedCost + allocatedByProducts.reduce((total, item) => total + item.allocatedCost, 0)).toFixed(2)}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const ProductionOrder = () => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center">
                <Factory className="mr-2" /> Production Order
            </CardTitle>
        </CardHeader>
        <CardContent>
            <p>Create and track production orders.</p>
        </CardContent>
    </Card>
);

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