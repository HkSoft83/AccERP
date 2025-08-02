import React, { useState } from 'react';
import { ArrowUpDown, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const FixedAssetMasterRegister = ({ assets, onEdit, onDelete }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [filters, setFilters] = useState({});
  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (key, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [key]: value }));
  };

  const calculateBookValue = (asset) => {
    const originalCost = parseFloat(asset.amount) || 0;
    const salvageValue = parseFloat(asset.salvageValue) || 0;
    const usefulLife = parseInt(asset.usefulLife, 10) || 1;
    const purchaseDate = new Date(asset.purchaseDate);
    const currentDate = new Date();
    const monthsPassed = (currentDate.getFullYear() - purchaseDate.getFullYear()) * 12 + (currentDate.getMonth() - purchaseDate.getMonth());
    const monthlyDepreciation = (originalCost - salvageValue) / (usefulLife * 12);
    const accumulatedDepreciation = monthlyDepreciation * monthsPassed;
    const bookValue = originalCost - accumulatedDepreciation;
    return bookValue > salvageValue ? bookValue.toFixed(2) : salvageValue.toFixed(2);
  };

  const filteredAndSortedAssets = React.useMemo(() => {
    let sortableItems = [...assets];

    // Apply filters
    Object.keys(filters).forEach((key) => {
      const filterValue = filters[key].toLowerCase();
      if (filterValue) {
        const filterTerms = filterValue.split(',').map(term => term.trim()).filter(term => term.length > 0);
        if (filterTerms.length > 0) {
          sortableItems = sortableItems.filter((item) => {
            const itemValue = String(item[key]).toLowerCase();
            return filterTerms.some(term => itemValue.includes(term));
          });
        }
      }
    });

    // Apply sorting
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle numerical comparisons for specific keys
        if (['amount', 'usefulLife', 'salvageValue'].includes(sortConfig.key)) {
          aValue = parseFloat(aValue) || 0;
          bValue = parseFloat(bValue) || 0;
        } else if (['purchaseDate'].includes(sortConfig.key)) {
          aValue = new Date(aValue).getTime();
          bValue = new Date(bValue).getTime();
        } else if (sortConfig.key === 'depreciationRate') {
          aValue = parseFloat(a.usefulLife) || 0;
          bValue = parseFloat(b.usefulLife) || 0;
          // For depreciation rate, lower useful life means higher rate, so reverse comparison
          if (sortConfig.direction === 'ascending') {
            return aValue - bValue;
          } else {
            return bValue - aValue;
          }
        } else if (sortConfig.key === 'netBookValue') {
          aValue = parseFloat(calculateBookValue(a)) || 0;
          bValue = parseFloat(calculateBookValue(b)) || 0;
        } else if (sortConfig.key === 'accumulatedDepreciation') {
          const calculateAccumulatedDepreciation = (asset) => {
            const originalCost = parseFloat(asset.amount) || 0;
            const salvageValue = parseFloat(asset.salvageValue) || 0;
            const usefulLife = parseInt(asset.usefulLife, 10) || 1;
            const purchaseDate = new Date(asset.purchaseDate);
            const currentDate = new Date();
            const monthsPassed = (currentDate.getFullYear() - purchaseDate.getFullYear()) * 12 + (currentDate.getMonth() - purchaseDate.getMonth());
            const monthlyDepreciation = (originalCost - salvageValue) / (usefulLife * 12);
            return (monthlyDepreciation * monthsPassed);
          };
          aValue = calculateAccumulatedDepreciation(a) || 0;
          bValue = calculateAccumulatedDepreciation(b) || 0;
        }


        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [assets, sortConfig, filters]);

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">Fixed Asset Master Register</h2>
      <Table className="border border-collapse">
        <TableHeader>
          <TableRow>
            <TableHead className="border text-center">
              <div className="flex items-center justify-center">
                Asset Name
                <ArrowUpDown className="ml-2 h-4 w-4 cursor-pointer" onClick={() => handleSort('name')} />
                <Popover>
                  <PopoverTrigger asChild>
                    <Filter className="ml-2 h-4 w-4 cursor-pointer" />
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-2">
                    <Input
                      placeholder="Filter name..."
                      value={filters.name || ''}
                      onChange={(e) => handleFilterChange('name', e.target.value)}
                      className="mt-1"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </TableHead>
            <TableHead className="border text-center">
              <div className="flex items-center justify-center">
                Tag No
                <ArrowUpDown className="ml-2 h-4 w-4 cursor-pointer" onClick={() => handleSort('tagSerialNumber')} />
                <Popover>
                  <PopoverTrigger asChild>
                    <Filter className="ml-2 h-4 w-4 cursor-pointer" />
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-2">
                    <Input
                      placeholder="Filter tag no..."
                      value={filters.tagSerialNumber || ''}
                      onChange={(e) => handleFilterChange('tagSerialNumber', e.target.value)}
                      className="mt-1"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </TableHead>
            <TableHead className="border text-center">
              <div className="flex items-center justify-center">
                Category
                <ArrowUpDown className="ml-2 h-4 w-4 cursor-pointer" onClick={() => handleSort('category')} />
                <Popover>
                  <PopoverTrigger asChild>
                    <Filter className="ml-2 h-4 w-4 cursor-pointer" />
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-2">
                    <Input
                      placeholder="Filter category..."
                      value={filters.category || ''}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="mt-1"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </TableHead>
            <TableHead className="border text-center">
              <div className="flex items-center justify-center">
                Location
                <ArrowUpDown className="ml-2 h-4 w-4 cursor-pointer" onClick={() => handleSort('assetLocation')} />
                <Popover>
                  <PopoverTrigger asChild>
                    <Filter className="ml-2 h-4 w-4 cursor-pointer" />
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-2">
                    <Input
                      placeholder="Filter location..."
                      value={filters.assetLocation || ''}
                      onChange={(e) => handleFilterChange('assetLocation', e.target.value)}
                      className="mt-1"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </TableHead>
            <TableHead className="border text-center">
              <div className="flex items-center justify-center">
                Purchase Date
                <ArrowUpDown className="ml-2 h-4 w-4 cursor-pointer" onClick={() => handleSort('purchaseDate')} />
                <Popover>
                  <PopoverTrigger asChild>
                    <Filter className="ml-2 h-4 w-4 cursor-pointer" />
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-2">
                    <Input
                      placeholder="Filter date..."
                      value={filters.purchaseDate || ''}
                      onChange={(e) => handleFilterChange('purchaseDate', e.target.value)}
                      className="mt-1"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </TableHead>
            
            <TableHead className="border text-center">
              <div className="flex items-center justify-center">
                Purchase Price
                <ArrowUpDown className="ml-2 h-4 w-4 cursor-pointer" onClick={() => handleSort('amount')} />
                <Popover>
                  <PopoverTrigger asChild>
                    <Filter className="ml-2 h-4 w-4 cursor-pointer" />
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-2">
                    <Input
                      placeholder="Filter price..."
                      value={filters.amount || ''}
                      onChange={(e) => handleFilterChange('amount', e.target.value)}
                      className="mt-1"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </TableHead>
            <TableHead className="border text-center">
              <div className="flex items-center justify-center">
                Useful Life
                <ArrowUpDown className="ml-2 h-4 w-4 cursor-pointer" onClick={() => handleSort('usefulLife')} />
                <Popover>
                  <PopoverTrigger asChild>
                    <Filter className="ml-2 h-4 w-4 cursor-pointer" />
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-2">
                    <Input
                      placeholder="Filter life..."
                      value={filters.usefulLife || ''}
                      onChange={(e) => handleFilterChange('usefulLife', e.target.value)}
                      className="mt-1"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </TableHead>
            <TableHead className="border text-center">
              <div className="flex items-center justify-center">
                Salvage Value
                <ArrowUpDown className="ml-2 h-4 w-4 cursor-pointer" onClick={() => handleSort('salvageValue')} />
                <Popover>
                  <PopoverTrigger asChild>
                    <Filter className="ml-2 h-4 w-4 cursor-pointer" />
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-2">
                    <Input
                      placeholder="Filter value..."
                      value={filters.salvageValue || ''}
                      onChange={(e) => handleFilterChange('salvageValue', e.target.value)}
                      className="mt-1"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </TableHead>
            <TableHead className="border text-center">
              <div className="flex items-center justify-center">
                Depreciation Method
                <ArrowUpDown className="ml-2 h-4 w-4 cursor-pointer" onClick={() => handleSort('depreciationMethod')} />
                <Popover>
                  <PopoverTrigger asChild>
                    <Filter className="ml-2 h-4 w-4 cursor-pointer" />
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-2">
                    <Input
                      placeholder="Filter method..."
                      value={filters.depreciationMethod || ''}
                      onChange={(e) => handleFilterChange('depreciationMethod', e.target.value)}
                      className="mt-1"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </TableHead>
            <TableHead className="border text-center">
              <div className="flex items-center justify-center">
                Depreciation Rate
                <ArrowUpDown className="ml-2 h-4 w-4 cursor-pointer" onClick={() => handleSort('depreciationRate')} />
                <Popover>
                  <PopoverTrigger asChild>
                    <Filter className="ml-2 h-4 w-4 cursor-pointer" />
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-2">
                    <Input
                      placeholder="Filter rate..."
                      value={filters.depreciationRate || ''}
                      onChange={(e) => handleFilterChange('depreciationRate', e.target.value)}
                      className="mt-1"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </TableHead>
            <TableHead className="border text-center">
              <div className="flex items-center justify-center">
                Accumulated Depreciation
                <ArrowUpDown className="ml-2 h-4 w-4 cursor-pointer" onClick={() => handleSort('accumulatedDepreciation')} />
                <Popover>
                  <PopoverTrigger asChild>
                    <Filter className="ml-2 h-4 w-4 cursor-pointer" />
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-2">
                    <Input
                      placeholder="Filter..."
                      value={filters.accumulatedDepreciation || ''}
                      onChange={(e) => handleFilterChange('accumulatedDepreciation', e.target.value)}
                      className="mt-1"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </TableHead>
            <TableHead className="border text-center">
              <div className="flex items-center justify-center">
                Net Book Value
                <ArrowUpDown className="ml-2 h-4 w-4 cursor-pointer" onClick={() => handleSort('netBookValue')} />
                <Popover>
                  <PopoverTrigger asChild>
                    <Filter className="ml-2 h-4 w-4 cursor-pointer" />
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-2">
                    <Input
                      placeholder="Filter..."
                      value={filters.netBookValue || ''}
                      onChange={(e) => handleFilterChange('netBookValue', e.target.value)}
                      className="mt-1"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </TableHead>
            <TableHead className="border text-center">
              <div className="flex items-center justify-center">
                Status
                <ArrowUpDown className="ml-2 h-4 w-4 cursor-pointer" onClick={() => handleSort('status')} />
                <Popover>
                  <PopoverTrigger asChild>
                    <Filter className="ml-2 h-4 w-4 cursor-pointer" />
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-2">
                    <Input
                      placeholder="Filter status..."
                      value={filters.status || ''}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      className="mt-1"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </TableHead>
            <TableHead className="border text-center">
              <div className="flex items-center justify-center">
                Disposal Date
                <ArrowUpDown className="ml-2 h-4 w-4 cursor-pointer" onClick={() => handleSort('disposalDate')} />
                <Popover>
                  <PopoverTrigger asChild>
                    <Filter className="ml-2 h-4 w-4 cursor-pointer" />
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-2">
                    <Input
                      placeholder="Filter date..."
                      value={filters.disposalDate || ''}
                      onChange={(e) => handleFilterChange('disposalDate', e.target.value)}
                      className="mt-1"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </TableHead>
            <TableHead className="border text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedAssets.map((asset) => (
            <TableRow key={asset.id}>
              <TableCell className="border text-center">{asset.name}</TableCell>
              <TableCell className="border text-center">{asset.tagSerialNumber}</TableCell>
              <TableCell className="border text-center">{asset.category}</TableCell>
              <TableCell className="border text-center">{asset.assetLocation}</TableCell>
              <TableCell className="border text-center">{asset.purchaseDate}</TableCell>
              <TableCell className="border text-center">{asset.amount}</TableCell>
              <TableCell className="border text-center">{asset.usefulLife}</TableCell>
              <TableCell className="border text-center">{asset.salvageValue}</TableCell>
              <TableCell className="border text-center">{asset.depreciationMethod}</TableCell>
              <TableCell className="border text-center">{((1 / (parseFloat(asset.usefulLife) || 1)) * 100).toFixed(2)}%</TableCell>
              <TableCell className="border text-center">{(() => {
                const originalCost = parseFloat(asset.amount) || 0;
                const salvageValue = parseFloat(asset.salvageValue) || 0;
                const usefulLife = parseInt(asset.usefulLife, 10) || 1;
                const purchaseDate = new Date(asset.purchaseDate);
                const currentDate = new Date();
                const monthsPassed = (currentDate.getFullYear() - purchaseDate.getFullYear()) * 12 + (currentDate.getMonth() - purchaseDate.getMonth());
                const monthlyDepreciation = (originalCost - salvageValue) / (usefulLife * 12);
                return (monthlyDepreciation * monthsPassed).toFixed(2);
              })()}</TableCell>
              <TableCell className="border text-center">{calculateBookValue(asset)}</TableCell>
              <TableCell className="border text-center">{asset.status}</TableCell>
              <TableCell className="border text-center">{asset.disposalDate}</TableCell>
              <TableCell className="border text-center">
                <Button variant="outline" size="sm" onClick={() => onEdit(asset)}>Edit</Button>
                <Button variant="destructive" size="sm" className="ml-2" onClick={() => onDelete(asset.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default FixedAssetMasterRegister;
