import useSWR from 'swr';
import { InventoryService } from '@/lib/services/inventoryService';

export interface InventoryDetail {
  id: string;
  name: string;
  sku: string | null;
  category: string;
  brand: string | null;
  model: string | null;
  price: number;
  inStock: number;
  orderCount: number;
  status: string;
  desc: string | null;
  images: string[];
  lastUpdated: string;
}

function formatDate(iso?: string): string {
  if (!iso) return '---';
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return '---';
  }
}

export function useInventoryItem(ownerUserId?: string, itemId?: string) {
  const { data, error, isLoading } = useSWR(
    ownerUserId && itemId ? ['inventory-item', ownerUserId, itemId] : null,
    () =>
      InventoryService.getInventoryDetail(
        ownerUserId as string,
        itemId as string
      )
  );

  const detail: InventoryDetail | null = data
    ? {
        id: data._id,
        name: data.product_name,
        sku:
          data.product_sku !== undefined && data.product_sku !== null
            ? String(data.product_sku)
            : null,
        category: data.product_category || '---',
        brand: data.brand || null,
        model: data.model_number || null,
        price:
          typeof data.unit_price === 'string'
            ? parseFloat(data.unit_price)
            : data.unit_price || 0,
        inStock: data.quantity_in_stock || 0,
        orderCount: data.order_count || 0,
        status: (data.status || 'Published').toString(),
        desc: data.desc || null,
        images:
          data.product_image && data.product_image.length > 0
            ? data.product_image
            : ['/product-img.png'],
        lastUpdated: formatDate(data.updatedAt || data.createdAt),
      }
    : null;

  return { detail, loading: isLoading, error };
}
