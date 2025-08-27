import useSWR from 'swr';
import {
  InventoryService,
  RawCatalogueItem,
  RawInventoryItem,
} from '@/lib/services/inventoryService';
import {
  CatelogueType,
  DInventoryDataType,
  DInventoryStatus,
} from '@/types/usertypes';

function formatDate(iso?: string): string {
  if (!iso) return '---';
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return '---';
  }
}

export function useUserInventory(userId?: string) {
  const {
    data: invRes,
    error: invError,
    isLoading: invLoading,
  } = useSWR(userId ? ['/inventory', userId] : null, () =>
    InventoryService.getInventoryByUser(userId as string)
  );

  const {
    data: catRes,
    error: catError,
    isLoading: catLoading,
  } = useSWR(userId ? ['/catalogue', userId] : null, () =>
    InventoryService.getCatalogueByUser(userId as string)
  );

  const inventory: DInventoryDataType[] = (invRes?.data || []).map(
    (it: RawInventoryItem): DInventoryDataType => ({
      id: it._id,
      productName: it.product_name,
      url: it.product_image?.[0] || '/product-img.png',
      sku:
        it.product_sku !== undefined && it.product_sku !== null
          ? String(it.product_sku)
          : null,
      category: it.product_category || '---',
      price:
        typeof it.unit_price === 'string'
          ? parseFloat(it.unit_price)
          : it.unit_price || 0,
      inStock: it.quantity_in_stock || 0,
      lastUpdated: formatDate(it.updatedAt || it.createdAt),
      status: ((): DInventoryStatus => {
        const s = (it.status || '').toString().toUpperCase();
        switch (s) {
          case 'DRAFT':
            return 'Draft' as DInventoryStatus;
          case 'UNPUBLISHED':
            return 'Unpublished' as DInventoryStatus;
          case 'OUTOFSTOCK':
          case 'OUT_OF_STOCK':
            return 'Out of Stock' as DInventoryStatus;
          case 'PUBLISHED':
          default:
            return 'Published' as DInventoryStatus;
        }
      })(),
    })
  );

  const catalogue: CatelogueType[] = (catRes?.data || []).map(
    (it: RawCatalogueItem): CatelogueType => ({
      id: it._id,
      product: it.product_name,
      category: it.category,
      dateCreated: formatDate(it.createdAt || it.updatedAt),
    })
  );

  return {
    inventory,
    catalogue,
    loading: invLoading || catLoading,
    error: invError || catError,
  };
}
