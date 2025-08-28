import CardWrapper from '@/app/components/cardWrapper';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { Checkbox } from '@/app/components/ui/checkbox';
import NoInventory from '@/app/assets/no-inventory.png';

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { deleteCatalogueItems } from '../hooks/useCatalogue';
import { MoreVertical } from 'lucide-react';

export type CatelogueType = {
  id: string;
  product: string;
  category: string;
  dateCreated: string;
};

interface CatalogueProps {
  data: CatelogueType[];
  onEdit?: (item: CatelogueType) => void;
  onRefresh?: () => void;
}

const Catalogue = ({ data, onEdit, onRefresh }: CatalogueProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Filter data based on selected category and search term
  const filteredData = data.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      item.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch =
      searchTerm === '' ||
      item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Handle select all functionality
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(filteredData.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  // Handle individual item selection
  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, itemId]);
    } else {
      setSelectedItems((prev) => prev.filter((id) => id !== itemId));
    }
  };

  // Handle delete selected items
  const handleDeleteSelected = async (itemIds?: string[]) => {
    const idsToDelete = itemIds || selectedItems;
    if (idsToDelete.length === 0) return;

    try {
      setIsDeleting(true);
      await deleteCatalogueItems(idsToDelete);
      // Only clear selected items if deleting from selection
      if (!itemIds) {
        setSelectedItems([]);
      }
      onRefresh?.();
    } catch {
      // Error handled in hook
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle edit item
  const handleEditItem = (item: CatelogueType) => {
    onEdit?.(item);
  };

  const isAllSelected =
    filteredData.length > 0 && selectedItems.length === filteredData.length;
  const isIndeterminate =
    selectedItems.length > 0 && selectedItems.length < filteredData.length;

  // Clear selections when filters change
  useEffect(() => {
    setSelectedItems([]);
  }, [selectedCategory, searchTerm]);
  if (!data || data.length < 1) {
    return (
      <div className="flex flex-col items-center justify-center h-[70dvh] space-y-6 border rounded-lg">
        <Image
          src={NoInventory}
          alt="No inventory illustration"
          width={180}
          height={180}
        />
        <h2 className="text-lg font-semibold text-neutral-900">
          No Item in Inventory{' '}
        </h2>
        <p className="text-sm text-neutral-500 max-w-xs text-center">
          You do not have any item in your inventory. click “Add to Inventory”
          to add a product
        </p>
        {/* <button
          // onClick={() => router.push('/dashboard/loans/request')}
          className="px-6 py-3 bg-mikado text-white rounded-md hover:bg-yellow-600
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                   focus-visible:ring-mikado"
        >
          Request Loan
        </button> */}
      </div>
    );
  }
  return (
    <CardWrapper className="px-0 py-0 rounded-lg">
      <div className="py-3 px-6 w-full">
        <CatalogueHeader
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedItems={selectedItems}
          isDeleting={isDeleting}
          onDeleteSelected={handleDeleteSelected}
          onEditItem={handleEditItem}
          filteredData={filteredData}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-gray-200 py-3 px-6 border-none">
            <TableHead className="py-[13px] ps-6 w-16">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={handleSelectAll}
                aria-label="Select all items"
                {...(isIndeterminate && { 'data-state': 'indeterminate' })}
                className="w-4 h-4 text-mikado border-raisin rounded focus:ring-mikado"
              />
            </TableHead>
            <TableHead className="py-[13px] ps-6">Product</TableHead>
            <TableHead className="py-[13px] ps-6">Category</TableHead>
            <TableHead className="py-[13px] ps-6">Date Created</TableHead>
            <TableHead className="py-[13px] ps-6 w-32">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((request) => (
            <TableRow
              className="border-b border-b-gray-200 text-resin-black"
              key={request.id}
            >
              <TableCell className="p-6">
                <Checkbox
                  checked={selectedItems.includes(request.id)}
                  onCheckedChange={(checked) =>
                    handleSelectItem(request.id, checked as boolean)
                  }
                  aria-label={`Select ${request.product}`}
                  className="w-5 h-5 text-mikado border-raisin rounded focus:ring-mikado"
                />
              </TableCell>
              <TableCell className="p-6">{request.product}</TableCell>
              <TableCell className="p-6 capitalize">
                {request.category}
              </TableCell>
              <TableCell className="p-6">{request.dateCreated}</TableCell>
              <TableCell className="p-6">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <DropdownMenuTrigger className="flex items-center justify-center p-2 hover:bg-gray-100 rounded-md">
                      <MoreVertical className="h-4 w-4" />
                    </DropdownMenuTrigger>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-48 z-20 bg-white"
                  >
                    <DropdownMenuItem onClick={() => handleEditItem(request)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleDeleteSelected([request.id])}
                      className="text-red-600"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter className="border-t border-t-gray-200">
          <TableRow>
            <TableCell colSpan={5} className="p-6">
              <div className="text-sm text-gray-600">
                Showing {filteredData.length} of {data.length} items
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </CardWrapper>
  );
};
const CatalogueHeader = function ({
  selectedCategory,
  onCategoryChange,
  selectedItems,
  isDeleting,
  onDeleteSelected,
  onEditItem,
  filteredData,
  searchTerm,
  onSearchChange,
}: {
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedItems: string[];
  isDeleting: boolean;
  onDeleteSelected: (itemIds?: string[]) => Promise<void>;
  onEditItem: (item: CatelogueType) => void;
  filteredData: CatelogueType[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
}) {
  const hasSelectedItems = selectedItems.length > 0;

  return (
    <div className="flex justify-between">
      {hasSelectedItems ? (
        // Show bulk actions when items are selected
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''}{' '}
            selected
          </span>
          <div className="flex items-center gap-2 ">
            <button
              onClick={() => onDeleteSelected()}
              className="text-raisin p-2 text-sm bg-gray-100 border rounded-lg border-gray-400"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
            <button
              onClick={() => {
                if (selectedItems.length === 1) {
                  const item = filteredData.find(
                    (item) => item.id === selectedItems[0]
                  );
                  if (item) onEditItem(item);
                }
              }}
              disabled={selectedItems.length !== 1}
              className="text-raisin p-2 text-sm bg-gray-100 border rounded-lg border-gray-400"
            >
              Edit
            </button>
          </div>
        </div>
      ) : (
        // Show category filter when no items are selected
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="border p-3 border-border-gray rounded-md w-[157px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="inverter">Inverter</SelectItem>
            <SelectItem value="battery">Battery</SelectItem>
            <SelectItem value="panel">Panel</SelectItem>
            <SelectItem value="accessory">Accessory</SelectItem>
          </SelectContent>
        </Select>
      )}
      <div className="max-w-[334px] w-full">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-3 py-2 pl-10 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mikado focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default Catalogue;
