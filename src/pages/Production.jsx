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
    const [finishedGoodsQty, setFinishedGoodsQty] = React.useState(1);

    const [productToProduce, setProductToProduce] = React.useState('');
    const [productToProduceQty, setProductToProduceQty] = React.useState(1);
    const [salesPrice, setSalesPrice] = React.useState(0);
    const [byProducts, setByProducts] = React.useState([]);
    const [selectedByProduct, setSelectedByProduct] = React.useState('');
    const [byProductQty, setByProductQty] = React.useState(1);
    const [byProductCost, setByProductCost] = React.useState(0);

    const handleSelectProductToProduce = (value) => {
        const selectedProduct = products.find(p => p.name === value);
        if (selectedProduct) {
            setProductToProduce(selectedProduct.name);
            setSalesPrice(selectedProduct.salesPrice);
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