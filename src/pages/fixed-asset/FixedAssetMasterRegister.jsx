import React, { useState } from 'react';
import { ArrowUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const FixedAssetMasterRegister = ({ assets }) => {
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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <div className="flex items-center">
                Asset Name
                <ArrowUpDown className="ml-2 h-4 w-4 cursor-pointer" onClick={() => handleSort('name')} />
              </div>
              <Input
                placeholder="Filter name..."
                value={filters.name || ''}
                onChange={(e) => handleFilterChange('name', e.target.value)}
                className="mt-1"
              />
            </TableHead>
            <TableHead>
              <div className="flex items-center">
                Tag No
                <ArrowUpDown className="ml-2 h-4 w-4 cursor-pointer" onClick={() => handleSort('tagSerialNumber')} />
              </div>
              <Input
                placeholder="Filter tag no..."
                value={filters.tagSerialNumber || ''}
                onChange={(e) => handleFilterChange('tagSerialNumber', e.target.value)}
                className="mt-1"
              />
            </TableHead>
            <TableHead>
              <div className="flex items-center">
                Category
                <ArrowUpDown className="ml-2 h-4 w-4 cursor-pointer" onClick={() => handleSort('category')} />
              </div>
              <Input
                placeholder="Filter category..."
                value={filters.category || ''}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="mt-1"
              />
            </TableHead>
            <TableHead>
              <div className="flex items-center">
                Location
                <ArrowUpDown className="ml-2 h-4 w-4 cursor-pointer" onClick={() => handleSort('assetLocation')} />
              </div>
              <Input
                placeholder="Filter location..."
                value={filters.assetLocation || ''}
                onChange={(e) => handleFilterChange('assetLocation', e.target.value)}
                className="mt-1"
              />
            </TableHead>
            <TableHead>
              <div className="flex items-center">
                Purchase Date
                <ArrowUpDown className="ml-2 h-4 w-4 cursor-pointer" onClick={() => handleSort('purchaseDate')} />
              </div>
              <Input
                placeholder="Filter date..."
                value={filters.purchaseDate || ''}
                onChange={(e) => handleFilterChange('purchaseDate', e.target.value)}
                className="mt-1"
              />
            </TableHead>
            <TableHead>
              <div className="flex items-center">
                Capitalization Date
                <ArrowUpDown className="ml-2 h-4 w-4 cursor-pointer" onClick={() => handleSort('purchaseDate')} />
              </div>
              <Input
                placeholder="Filter date..."
                value={filters.capitalizationDate || ''}
                onChange={(e) => handleFilterChange('capitalizationDate', e.target.value)}
                className="mt-1"
              />
            </TableHead>
            <TableHead>
              <div className="flex items-center">
                Purchase Price
                <ArrowUpDown className="ml-2 h-4 w-4 cursor-pointer" onClick={() => handleSort('amount')} />
              </div>
              <Input
                placeholder="Filter price..."
                value={filters.amount || ''}
                onChange={(e) => handleFilterChange('amount', e.target.value)}
                className="mt-1"
              />
            </TableHead>
            <TableHead>
              <div className="flex items-center">
                Useful Life
                <ArrowUpDown className="ml-2 h-4 w-4 cursor-pointer" onClick={() => handleSort('usefulLife')} />
              </div>
              <Input
                placeholder="Filter life..."
                value={filters.usefulLife || ''}
                onChange={(e) => handleFilterChange('usefulLife', e.target.value)}
                className="mt-1"
              />
            </TableHead>
            <TableHead>
              <div className="flex items-center">
                Salvage Value
                <ArrowUpDown className="ml-2 h-4 w-4 cursor-pointer" onClick={() => handleSort('salvageValue')} />
              </div>
              <Input
                placeholder="Filter value..."
                value={filters.salvageValue || ''}
                onChange={(e) => handleFilterChange('salvageValue', e.target.value)}
                className="mt-1"
              />
            </TableHead>
            <TableHead>
              <div className="flex items-center">
                Depreciation Method
                <ArrowUpDown className="ml-2 h-4 w-4 cursor-pointer" onClick={() => handleSort('depreciationMethod')} />
              </div>
              <Input
                placeholder="Filter method..."
                value={filters.depreciationMethod || ''}
                onChange={(e) => handleFilterChange('depreciationMethod', e.target.value)}
                className="mt-1"
              />
            </TableHead>
            <TableHead>
              <div className="flex items-center">
                Depreciation Rate
                <ArrowUpDown className="ml-2 h-4 w-4 cursor-pointer" onClick={() => handleSort('depreciationRate')} />
              </div>
              <Input
                placeholder="Filter rate..."
                value={filters.depreciationRate || ''}
                onChange={(e) => handleFilterChange('depreciationRate', e.target.value)}
                className="mt-1"
              />
            </TableHead>
            <TableHead>
              <div className="flex items-center">
                Accumulated Depreciation
                <ArrowUpDown className="ml-2 h-4 w-4 cursor-pointer" onClick={() => handleSort('accumulatedDepreciation')} />
              </div>
              <Input
                placeholder="Filter..."
                value={filters.accumulatedDepreciation || ''}
                onChange={(e) => handleFilterChange('accumulatedDepreciation', e.target.value)}
                className="mt-1"
              />
            </TableHead>
            <TableHead>
              <div className="flex items-center">
                Net Book Value
                <ArrowUpDown className="ml-2 h-4 w-4 cursor-pointer" onClick={() => handleSort('netBookValue')} />
              </div>
              <Input
                placeholder="Filter..."
                value={filters.netBookValue || ''}
                onChange={(e) => handleFilterChange('netBookValue', e.target.value)}
                className="mt-1"
              />
            </TableHead>
            <TableHead>
              <div className="flex items-center">
                Status
                <ArrowUpDown className="ml-2 h-4 w-4 cursor-pointer" onClick={() => handleSort('status')} />
              </div>
              <Input
                placeholder="Filter status..."
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="mt-1"
              />
            </TableHead>
            <TableHead>
              <div className="flex items-center">
                Disposal Date
                <ArrowUpDown className="ml-2 h-4 w-4 cursor-pointer" onClick={() => handleSort('disposalDate')} />
              </div>
              <Input
                placeholder="Filter date..."
                value={filters.disposalDate || ''}
                onChange={(e) => handleFilterChange('disposalDate', e.target.value)}
                className="mt-1"
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedAssets.map((asset) => (
            <TableRow key={asset.id}>
              <TableCell>{asset.name}</TableCell>
              <TableCell>{asset.tagSerialNumber}</TableCell>
              <TableCell>{asset.category}</TableCell>
              <TableCell>{asset.assetLocation}</TableCell>
              <TableCell>{asset.purchaseDate}</TableCell>
              <TableCell>{asset.purchaseDate}</TableCell>
              <TableCell>{asset.amount}</TableCell>
              <TableCell>{asset.usefulLife}</TableCell>
              <TableCell>{asset.salvageValue}</TableCell>
              <TableCell>{asset.depreciationMethod}</TableCell>
              <TableCell>{((1 / (parseFloat(asset.usefulLife) || 1)) * 100).toFixed(2)}%</TableCell>
              <TableCell>{(() => {
                const originalCost = parseFloat(asset.amount) || 0;
                const salvageValue = parseFloat(asset.salvageValue) || 0;
                const usefulLife = parseInt(asset.usefulLife, 10) || 1;
                const purchaseDate = new Date(asset.purchaseDate);
                const currentDate = new Date();
                const monthsPassed = (currentDate.getFullYear() - purchaseDate.getFullYear()) * 12 + (currentDate.getMonth() - purchaseDate.getMonth());
                const monthlyDepreciation = (originalCost - salvageValue) / (usefulLife * 12);
                return (monthlyDepreciation * monthsPassed).toFixed(2);
              })()}</TableCell>
              <TableCell>{calculateBookValue(asset)}</TableCell>
              <TableCell>{asset.status}</TableCell>
              <TableCell>{asset.disposalDate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default FixedAssetMasterRegister;
