'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRFQ } from '@/context/RFQContext';
import { marketplaceApi, transformApiProduct } from '@/lib/marketplaceApi';
import type { ProductListingType } from '@/types/marketplace.types';
import Image from 'next/image';
import { ChevronDown, ChevronUp, Minus, Plus, Trash2 } from 'lucide-react';
import RequestQuoteModalSimple from '../marketplace/modal/RequestQuoteModal';
import EmptyState from '@/app/components/EmptyState';
import EmptyIllustration from '@/app/assets/empty-customers.svg';

export default function RFQPage() {
  const { rfqItems, removeFromRFQ, clearRFQ, updateQuantity, refreshRFQ } = useRFQ();

  const [productDetails, setProductDetails] = useState<
    Record<string, ProductListingType>
  >({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  // Modal
  const [activeSupplier, setActiveSupplier] = useState<{
    id: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    const run = async () => {
      if (!rfqItems.length) return setLoading(false);
      try {
        const details: Record<string, ProductListingType> = {};
        await Promise.all(
          rfqItems.map(async (item) => {
            const apiProduct = await marketplaceApi.getProductById(
              item.productId
            );
            details[item.productId] = transformApiProduct(apiProduct);
          })
        );
        setProductDetails(details);

        // Initialize expanded state for suppliers
        const bySupplier: Record<string, boolean> = {};
        rfqItems.forEach((item) => {
          if (item.supplierId) bySupplier[item.supplierId] = true;
        });
        setExpanded(bySupplier);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [rfqItems]);

  const groups = useMemo(() => {
    const map: Record<
      string,
      { supplierId: string; supplierName: string; items: typeof rfqItems }
    > = {};
    for (const item of rfqItems) {
      const p = productDetails[item.productId];
      if (!item.supplierId) continue; // Use supplierId from RFQ item
      const key = item.supplierId;
      if (!map[key]) {
        map[key] = {
          supplierId: key,
          supplierName:
            item.supplierName || p?.supplier_name || 'Unknown Supplier',
          items: [],
        };
      }
      map[key].items.push(item);
    }
    return Object.values(map);
  }, [rfqItems, productDetails]);

  const handleQuantityChange = async (
    productId: string,
    newQuantity: number
  ) => {
    const qty = Math.max(1, newQuantity);
    await updateQuantity(productId, qty);
  };

  const toggle = (supplierId: string) =>
    setExpanded((e) => ({ ...e, [supplierId]: !e[supplierId] }));

  const removeItem = async (productId: string) => {
    await removeFromRFQ(productId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-2xl font-semibold mb-6">Quote Requests</h1>
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
            Loading RFQ items…
          </div>
        </div>
      </div>
    );
  }

  if (!rfqItems.length) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <EmptyState
          title="No items in RFQ"
          description="Add products to request quotes from suppliers."
          actionLabel="Browse Marketplace"
          actionUrl="/dashboard/marketplace"
          illustration={EmptyIllustration}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Quote Requests</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => clearRFQ()}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm hover:bg-gray-50"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Supplier cards */}
        <div className="space-y-5">
          {groups.map((group) => {
            const count = group.items.length;
            const open = !!expanded[group.supplierId];

            return (
              <div
                key={group.supplierId}
                className="rounded-2xl border border-gray-100 bg-white shadow-sm"
              >
                {/* Header */}
                <button
                  type="button"
                  onClick={() => toggle(group.supplierId)}
                  className="flex w-full items-center justify-between px-5 py-4 text-gray-900"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-gray-100">
                      <span className="h-2.5 w-2.5 rounded-full bg-gray-400" />
                    </span>
                    <span className="text-[15px] font-semibold underline-offset-2 hover:underline">
                      {group.supplierName}
                    </span>
                    <span className="ml-1 rounded-full bg-mikado/10 px-2 py-0.5 text-xs font-semibold text-mikado">
                      {count}
                    </span>
                  </div>
                  <span className="text-gray-400">
                    {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </span>
                </button>

                {/* Items */}
                {open && (
                  <>
                    <div className="divide-y divide-gray-100 px-5">
                      {group.items.map((item) => {
                        const p = productDetails[item.productId];

                        return (
                          <div
                            key={item.id}
                            className="flex items-center gap-4 py-4"
                          >
                            <div className="relative h-14 w-14 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                              {p?.src && (
                                <Image
                                  src={p.src}
                                  alt={p?.title || 'product'}
                                  fill
                                  className="object-cover"
                                />
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="truncate text-sm font-semibold">
                                {p?.title || item.productName}
                              </div>
                              <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                                {p?.sku && <span>SKU-{p.sku}</span>}
                                {p?.category && (
                                  <>
                                    <span className="text-gray-300">|</span>
                                    <span>{p.category}</span>
                                  </>
                                )}
                                {p?.brand && (
                                  <>
                                    <span className="text-gray-300">|</span>
                                    <span>{p.brand}</span>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Quantity stepper */}
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.productId,
                                    item.quantity - 1
                                  )
                                }
                                className="grid h-8 w-8 place-items-center rounded-lg border border-gray-200 hover:bg-gray-50"
                              >
                                <Minus size={14} />
                              </button>
                              <div className="w-9 text-center text-sm font-medium">
                                {item.quantity}
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.productId,
                                    item.quantity + 1
                                  )
                                }
                                className="grid h-8 w-8 place-items-center rounded-lg border border-gray-200 hover:bg-gray-50"
                              >
                                <Plus size={14} />
                              </button>
                            </div>

                            {/* Remove */}
                            <button
                              onClick={() => removeItem(item.productId)}
                              className="grid h-9 w-9 place-items-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                              aria-label="Remove"
                              title="Remove"
                            >
                              <Trash2 size={16} className="text-red-500" />
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end px-5 pb-5 pt-3">
                      <button
                        onClick={() =>
                          setActiveSupplier({
                            id: group.supplierId,
                            name: group.supplierName,
                          })
                        }
                        className="rounded-xl bg-mikado px-5 py-2.5 text-sm font-semibold text-raisin hover:brightness-95"
                      >
                        Request Quote
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* NOTE: Per your request, the page-level “Additional Information” section was removed */}

        {/* Modal */}
        {activeSupplier && (
          <RequestQuoteModalSimple
            supplierId={activeSupplier.id}
            supplierName={activeSupplier.name}
            onClose={() => setActiveSupplier(null)}
            onSuccess={async () => {
              // Server has already cleared the cart for this supplier, so just refresh the UI
              await refreshRFQ();
              setActiveSupplier(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
