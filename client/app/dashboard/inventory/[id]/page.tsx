'use client';

import { useParams } from 'next/navigation';
import { useInventoryDetails } from '../hooks';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import StatusChip from '@/app/components/statusChip';
import { fmtDate, fmtNaira } from '@/lib/format';
import ProductCarousel from './components/ProductCarousel';
import OrderHistory from './components/OrderHistory';
import ProductActivity from './components/ProductActivity';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/app/components/ui/tabs';

export default function InventoryDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const { inventory, isLoading, error } = useInventoryDetails(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mikado mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500">
            Loading product details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !inventory) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Product Not Found
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            The product you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Link
            href="/dashboard/inventory"
            className="inline-flex items-center px-4 py-2 bg-mikado text-raisin rounded-lg hover:bg-yellow-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Inventory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/inventory"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Inventory
        </Link>

        <div className="flex items-center gap-2">
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </button>
          <button className="inline-flex items-center px-3 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-700 bg-white hover:bg-red-50">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      {/* Product Information Card */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Product Information
          </h2>
          <StatusChip status={inventory.status} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          {/* Left Column - Product Details */}
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h1 className="text-xl font-semibold text-gray-900 mb-1">
                {inventory.product_name}
              </h1>
              <p className="text-sm text-gray-500">
                SKU: {inventory.product_sku}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Category
                  </span>
                  <p className="mt-1 text-sm text-gray-900">
                    {inventory.product_category}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    In Stock
                  </span>
                  <p className="mt-1 text-sm text-gray-900">
                    {inventory.quantity_in_stock}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Brand
                  </span>
                  <p className="mt-1 text-sm text-gray-900">
                    {inventory.brand || 'N/A'}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Model
                  </span>
                  <p className="mt-1 text-sm text-gray-900">
                    {inventory.model_number || 'N/A'}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Last Updated
                  </span>
                  <p className="mt-1 text-sm text-gray-900">
                    {fmtDate(inventory.updatedAt)}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Date Added
                  </span>
                  <p className="mt-1 text-sm text-gray-900">
                    {fmtDate(inventory.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            {inventory.desc && (
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Description
                </span>
                <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                  {inventory.desc}
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Image and Price */}
          <div className="space-y-6">
            <ProductCarousel
              images={inventory.product_image || []}
              productName={inventory.product_name}
            />

            <div className="flex items-center justify-between">
              <span className="text-base font-medium text-gray-900">
                Unit Price
              </span>
              <span className="text-2xl font-bold text-gray-900">
                {fmtNaira(parseInt(inventory.unit_price))}
              </span>
            </div>

            {/* Remove wholesale price section since it's not in the API response */}
          </div>
        </div>
      </div>

      {/* Tabs for Order History and Product Activity */}
      <Tabs defaultValue="orders" className="w-full space-y-5">
        <TabsList className="w-full">
          <TabsTrigger value="orders">Order History</TabsTrigger>
          <TabsTrigger value="activity">Product Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <OrderHistory inventoryId={id} />
        </TabsContent>

        <TabsContent value="activity">
          <ProductActivity inventoryId={id} />
        </TabsContent>
      </Tabs>

      {/* Additional Information */}
    </div>
  );
}
