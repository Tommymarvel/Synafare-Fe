import NoInventory from '@/app/assets/no-inventory.png';
import CardWrapper from '@/app/components/cardWrapper';
import Pagination from '@/app/components/pagination';
import SearchInput from '@/app/components/search.input';
import StatusChip, { StatusType } from '@/app/components/statusChip';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';

import Image from 'next/image';
import { useState } from 'react';
import { useInventory } from '../hooks/useInventory';
import {
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Upload,
  Download,
} from 'lucide-react';
import {
  updateProductStatus,
  deleteProduct,
  updateMultipleProductsStatus,
  deleteMultipleProducts,
} from '../api/inventoryActions';
import { toast } from 'react-toastify';
import ConfirmationModal from '@/app/components/confirmationModal';
import { fmtDate, fmtNaira } from '@/lib/format';

interface ModalState {
  isOpen: boolean;
  type: 'publish' | 'delete' | 'unpublish';
  title: string;
  message: string;
  action: () => void;
}

const Inventory = () => {
  const [statusFilter, setStatusFilter] = useState<StatusType | undefined>();
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingActions, setLoadingActions] = useState<Record<string, boolean>>(
    {}
  );
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    type: 'delete',
    title: '',
    message: '',
    action: () => {},
  });

  const {
    data,
    meta,
    isLoading,
    error,
    mutate: refreshInventory,
  } = useInventory({
    status: statusFilter,
    category: categoryFilter,
    page: currentPage,
    limit: pageLimit,
    search: searchQuery,
  });

  // Helper function to check status regardless of case
  const isStatus = (currentStatus: string, targetStatus: string) => {
    return currentStatus?.toLowerCase() === targetStatus.toLowerCase();
  };

  // Helper functions for bulk action validation
  const getSelectedProductsStatuses = () => {
    return selectedItems
      .map((itemId) => {
        const product = data.find((item) => item._id === itemId);
        return product?.status.toLowerCase();
      })
      .filter(Boolean);
  };

  const getValidationState = () => {
    const statuses = getSelectedProductsStatuses();
    const hasPublished = statuses.some((status) => status === 'published');
    const hasUnpublished = statuses.some((status) => status === 'unpublished');
    const hasDraft = statuses.some((status) => status === 'draft');

    return {
      canPublish: !hasPublished, // Can only publish if no published items selected
      canUnpublish: !hasUnpublished && !hasDraft, // Can only unpublish if no unpublished or draft items selected
      canDelete: true, // Delete is always available
      mixedStatuses:
        (hasPublished && (hasUnpublished || hasDraft)) ||
        (hasUnpublished && hasDraft),
    };
  };

  // Bulk action handlers
  const handleSelectItem = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === data.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(data.map((item) => item._id));
    }
  };

  const handleBulkStatusUpdate = async (newStatus: string) => {
    if (selectedItems.length === 0) return;

    const statusText = newStatus === 'published' ? 'publish' : 'unpublish';
    const action = async () => {
      setBulkLoading(true);
      try {
        await updateMultipleProductsStatus(selectedItems, newStatus);
        toast.success(
          `${selectedItems.length} products updated to ${newStatus} successfully!`
        );
        setSelectedItems([]);
        refreshInventory();
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Failed to update products status';
        toast.error(message);
      } finally {
        setBulkLoading(false);
        setModal({ ...modal, isOpen: false });
      }
    };

    setModal({
      isOpen: true,
      type: newStatus === 'published' ? 'publish' : 'unpublish',
      title: `${statusText.charAt(0).toUpperCase() + statusText.slice(1)} Item${
        selectedItems.length > 1 ? 's' : ''
      }`,
      message: `Are you sure you want to ${statusText} ${
        selectedItems.length > 1 ? 'these items' : 'this item'
      } ${
        newStatus === 'published'
          ? 'to the marketplace'
          : 'from the marketplace'
      }?`,
      action,
    });
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return;

    const action = async () => {
      setBulkLoading(true);
      try {
        await deleteMultipleProducts(selectedItems);
        toast.success(`${selectedItems.length} products deleted successfully!`);
        setSelectedItems([]);
        refreshInventory();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to delete products';
        toast.error(message);
      } finally {
        setBulkLoading(false);
        setModal({ ...modal, isOpen: false });
      }
    };

    setModal({
      isOpen: true,
      type: 'delete',
      title: `Delete Item${selectedItems.length > 1 ? 's' : ''}`,
      message: `Are you sure you want to delete ${
        selectedItems.length > 1 ? 'these items' : 'this item'
      } from your inventory?`,
      action,
    });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleStatusUpdate = async (productId: string, newStatus: string) => {
    const statusText = newStatus === 'published' ? 'publish' : 'unpublish';
    const action = async () => {
      setLoadingActions((prev) => ({ ...prev, [productId]: true }));
      try {
        await updateProductStatus(productId, newStatus);
        toast.success(`Product status updated to ${newStatus} successfully!`);
        refreshInventory();
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Failed to update product status';
        toast.error(message);
      } finally {
        setLoadingActions((prev) => ({ ...prev, [productId]: false }));
        setModal({ ...modal, isOpen: false });
      }
    };

    setModal({
      isOpen: true,
      type: newStatus === 'published' ? 'publish' : 'unpublish',
      title: `${statusText.charAt(0).toUpperCase() + statusText.slice(1)} Item`,
      message: `Are you sure you want to ${statusText} this item ${
        newStatus === 'published'
          ? 'to the marketplace'
          : 'from the marketplace'
      }?`,
      action,
    });
  };

  const handleDeleteProduct = async (productId: string) => {
    const action = async () => {
      setLoadingActions((prev) => ({ ...prev, [productId]: true }));
      try {
        await deleteProduct(productId);
        toast.success('Product deleted successfully!');
        refreshInventory();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to delete product';
        toast.error(message);
      } finally {
        setLoadingActions((prev) => ({ ...prev, [productId]: false }));
        setModal({ ...modal, isOpen: false });
      }
    };

    setModal({
      isOpen: true,
      type: 'delete',
      title: 'Delete Item',
      message: 'Are you sure you want to delete this item from your inventory?',
      action,
    });
  };

  const handleEditProduct = (productId: string) => {
    // Navigate to edit page
    window.location.href = `/dashboard/inventory/edit/${productId}`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[70dvh]">
        <div className="text-lg">Loading inventory...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[70dvh]">
        <div className="text-lg text-red-600">
          Failed to load inventory data
        </div>
      </div>
    );
  }

  if (!data || data.length < 1)
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
          className="px-6 py-3 bg-mikado text-white rounded-md hover:bg-mikado
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                   focus-visible:ring-mikado"
        >
          Request Loan
        </button> */}
      </div>
    );
  return (
    <CardWrapper className="p-0 rounded-lg">
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center py-3 px-6">
        {/* Conditional rendering: show filters or bulk actions */}
        {selectedItems.length > 0 ? (
          // Bulk action buttons
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              {selectedItems.length} items selected
            </span>
            {(() => {
              const validation = getValidationState();
              return (
                <>
                  {validation.mixedStatuses && (
                    <div className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-200">
                      Mixed statuses selected - some actions unavailable
                    </div>
                  )}
                  <button
                    onClick={() => handleBulkStatusUpdate('published')}
                    disabled={bulkLoading || !validation.canPublish}
                    className={`px-3 py-2 text-white rounded-md text-sm transition-colors ${
                      validation.canPublish && !bulkLoading
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                    title={
                      !validation.canPublish
                        ? 'Cannot publish - published products are selected'
                        : ''
                    }
                  >
                    {bulkLoading ? 'Processing...' : 'Publish'}
                  </button>
                  <button
                    onClick={() => handleBulkStatusUpdate('unpublished')}
                    disabled={bulkLoading || !validation.canUnpublish}
                    className={`px-3 py-2 text-white rounded-md text-sm transition-colors ${
                      validation.canUnpublish && !bulkLoading
                        ? 'bg-mikado hover:bg-yellow-700'
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                    title={
                      !validation.canUnpublish
                        ? 'Cannot unpublish - unpublished or draft products are selected'
                        : ''
                    }
                  >
                    {bulkLoading ? 'Processing...' : 'Unpublish'}
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    disabled={bulkLoading}
                    className={`px-3 py-2 text-white rounded-md text-sm transition-colors ${
                      !bulkLoading
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {bulkLoading ? 'Processing...' : 'Delete'}
                  </button>
                </>
              );
            })()}
            <button
              onClick={() => setSelectedItems([])}
              disabled={bulkLoading}
              className={`px-3 py-2 border border-gray-300 text-gray-700 rounded-md text-sm transition-colors ${
                !bulkLoading
                  ? 'hover:bg-gray-50'
                  : 'cursor-not-allowed opacity-50'
              }`}
            >
              Cancel
            </button>
          </div>
        ) : (
          // Original filters
          <div className="flex gap-x-[10px]">
            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(
                  value === 'all' ? undefined : (value as StatusType)
                )
              }
            >
              <SelectTrigger className="border p-3 border-border-gray rounded-md w-[157px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="unpublished">Unpublished</SelectItem>
                <SelectItem value="outofstock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={categoryFilter}
              onValueChange={(value) =>
                setCategoryFilter(value === 'all' ? undefined : value)
              }
            >
              <SelectTrigger className="border p-3 border-border-gray rounded-md w-[157px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Inverter">Inverter</SelectItem>
                <SelectItem value="Battery">Battery</SelectItem>
                <SelectItem value="Panel">Panel</SelectItem>
                <SelectItem value="Accessory">Accessory</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Right: search + export */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-x-[10px] w-full sm:w-auto">
          <div className="w-full sm:max-w-[334px]">
            <SearchInput
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search products..."
            />
          </div>
          <button className="border rounded-lg border-border-gray font-medium flex gap-x-2 py-2 px-[22.3px] shrink-0">
            <svg width="21" height="20" viewBox="0 0 21 20" fill="none">
              <path
                d="M13.2164 18.5412H7.78307C3.69141 18.5412 1.94141 16.7912 1.94141 12.6996V12.5912C1.94141 8.89124 3.39974 7.10791 6.66641 6.79957C6.99974 6.77457 7.31641 7.02457 7.34974 7.36624C7.38307 7.70791 7.13307 8.01624 6.78307 8.04957C4.16641 8.29124 3.19141 9.52457 3.19141 12.5996V12.7079C3.19141 16.0996 4.39141 17.2996 7.78307 17.2996H13.2164C16.6081 17.2996 17.8081 16.0996 17.8081 12.7079V12.5996C17.8081 9.50791 16.8164 8.27457 14.1497 8.04957C13.8081 8.01624 13.5497 7.71624 13.5831 7.37457C13.6164 7.03291 13.9081 6.77457 14.2581 6.80791C17.5747 7.09124 19.0581 8.88291 19.0581 12.6079V12.7162C19.0581 16.7912 17.3081 18.5412 13.2164 18.5412Z"
                fill="#1D1C1D"
              />
              <path
                d="M10.5 13.0253C10.1583 13.0253 9.875 12.742 9.875 12.4003V1.66699C9.875 1.32533 10.1583 1.04199 10.5 1.04199C10.8417 1.04199 11.125 1.32533 11.125 1.66699V12.4003C11.125 12.7503 10.8417 13.0253 10.5 13.0253Z"
                fill="#1D1C1D"
              />
              <path
                d="M10.4995 13.9585C10.3412 13.9585 10.1829 13.9002 10.0579 13.7752L7.26621 10.9835C7.02454 10.7419 7.02454 10.3419 7.26621 10.1002C7.50788 9.85853 7.90788 9.85853 8.14954 10.1002L10.4995 12.4502L12.8495 10.1002C13.0912 9.85853 13.4912 9.85853 13.7329 10.1002C13.9745 10.3419 13.9745 10.7419 13.7329 10.9835L10.9412 13.7752C10.8162 13.9002 10.6579 13.9585 10.4995 13.9585Z"
                fill="#1D1C1D"
              />
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-gray-200 py-3 px-6 border-none">
            <TableHead className="py-[13px] ps-6 w-12">
              <input
                type="checkbox"
                checked={
                  selectedItems.length === data.length && data.length > 0
                }
                onChange={handleSelectAll}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
            </TableHead>
            <TableHead className="py-[13px] ps-6">Product</TableHead>
            <TableHead className="py-[13px] ps-6">Category</TableHead>
            <TableHead className="py-[13px] ps-6">Price</TableHead>
            <TableHead className="py-[13px] ps-6">In stock</TableHead>
            <TableHead className="py-[13px] ps-6">Last Updated</TableHead>
            <TableHead className="py-[13px] ps-6">Status</TableHead>
            <TableHead className="py-[13px] ps-6">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((request) => {
           
            return (
              <TableRow
                className="border-b border-b-gray-200 text-resin-black"
                key={request._id}
              >
                <TableCell className="p-6">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(request._id)}
                    onChange={() => handleSelectItem(request._id)}
                    className="w-5 h-5 text-mikado bg-gray-100 border-gray-300 rounded focus:ring-mikado"
                  />
                </TableCell>
                <TableCell className="p-6">
                  <div className="flex gap-x-3 items-center">
                    <Image
                      src={request.product_image[0] || '/product-img.png'}
                      alt={request.product_name}
                      width={40}
                      height={40}
                      className="w-8 h-8"
                    />
                    <div>
                      <p className="font-medium">
                        SKU-{request.product_sku || 'N/A'}
                      </p>
                      <p className="font-medium">{request.product_name}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="p-6">
                  {request.product_category}
                </TableCell>
                <TableCell className="p-6">
                  {request.unit_price
                    ? fmtNaira(parseFloat(request.unit_price))
                    : 'N/A'}
                </TableCell>
                <TableCell className="p-6">
                  {request.quantity_in_stock || 0}
                </TableCell>
                <TableCell className="p-6">
                  {fmtDate(request.updatedAt)}
                </TableCell>
                <TableCell className="p-6">
                  <StatusChip status={request.status} />
                </TableCell>
                <TableCell className="p-6">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center justify-center p-2 hover:bg-gray-100 rounded-md">
                      <MoreVertical className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 z-20 bg-white">
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/dashboard/inventory/${request._id}`}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <Eye className="h-4 w-4" />
                          View Details
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => handleEditProduct(request._id)}
                        disabled={loadingActions[request._id]}
                      >
                        <Edit className="h-4 w-4" />
                        Edit Product
                      </DropdownMenuItem>

                      {isStatus(request.status, 'draft') && (
                        <DropdownMenuItem
                          className="flex items-center gap-2 cursor-pointer"
                          onClick={() =>
                            handleStatusUpdate(request._id, 'published')
                          }
                          disabled={loadingActions[request._id]}
                        >
                          <Upload className="h-4 w-4" />
                          {loadingActions[request._id]
                            ? 'Publishing...'
                            : 'Publish'}
                        </DropdownMenuItem>
                      )}

                      {isStatus(request.status, 'published') && (
                        <DropdownMenuItem
                          className="flex items-center gap-2 cursor-pointer"
                          onClick={() =>
                            handleStatusUpdate(request._id, 'unpublished')
                          }
                          disabled={loadingActions[request._id]}
                        >
                          <Download className="h-4 w-4" />
                          {loadingActions[request._id]
                            ? 'Unpublishing...'
                            : 'Unpublish'}
                        </DropdownMenuItem>
                      )}

                      {isStatus(request.status, 'unpublished') && (
                        <DropdownMenuItem
                          className="flex items-center gap-2 cursor-pointer"
                          onClick={() =>
                            handleStatusUpdate(request._id, 'published')
                          }
                          disabled={loadingActions[request._id]}
                        >
                          <Upload className="h-4 w-4" />
                          {loadingActions[request._id]
                            ? 'Publishing...'
                            : 'Publish'}
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        variant="destructive"
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => handleDeleteProduct(request._id)}
                        disabled={loadingActions[request._id]}
                      >
                        <Trash2 className="h-4 w-4" />
                        {loadingActions[request._id]
                          ? 'Deleting...'
                          : 'Delete Product'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter className="border-t border-t-gray-200">
          <TableRow>
            <TableCell colSpan={9} className="p-6">
              <div className="flex items-center justify-between">
                <Pagination
                  currentPage={currentPage}
                  totalPages={meta?.totalPages || 1}
                  onPageChange={setCurrentPage}
                />
                {meta && (
                  <div className="text-sm text-gray-600">
                    Page {meta.page} of {meta.totalPages}({meta.total_products}{' '}
                    total items)
                  </div>
                )}
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        onConfirm={modal.action}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        confirmText={
          modal.type === 'delete'
            ? 'Delete'
            : modal.type === 'publish'
            ? 'Publish'
            : 'Unpublish'
        }
        isLoading={bulkLoading || Object.values(loadingActions).some(Boolean)}
      />
    </CardWrapper>
  );
};

export default Inventory;
