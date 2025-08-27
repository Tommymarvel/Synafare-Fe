import api from '@/lib/axiosInstance';

// Raw API types
export interface RawInventoryItem {
  _id: string;
  product_name: string;
  product_category?: string;
  product_sku?: string | number;
  quantity_in_stock?: number;
  brand?: string;
  model_number?: string;
  unit_price?: number | string;
  status?: string;
  desc?: string;
  order_count?: number;
  product_image?: string[];
  product_owner?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RawCatalogueItem {
  _id: string;
  product_name: string;
  category: string;
  catalogue_owner: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface InventoryAPIResponse {
  data: RawInventoryItem[];
  meta?: unknown;
}

export interface CatalogueAPIResponse {
  data: RawCatalogueItem[];
  meta?: unknown;
}

export class InventoryService {
  static async getInventoryByUser(
    userId: string
  ): Promise<InventoryAPIResponse> {
    const { data } = await api.get(`/inventory/admin/view/${userId}`);
    return data as InventoryAPIResponse;
  }

  static async getCatalogueByUser(
    userId: string
  ): Promise<CatalogueAPIResponse> {
    const { data } = await api.get(`/catalogue/admin/view/${userId}`);
    return data as CatalogueAPIResponse;
  }

  // Get single inventory item detail for a given owner and item id
  static async getInventoryDetail(
    ownerUserId: string,
    itemId: string
  ): Promise<RawInventoryItem | null> {
    const { data } = await api.get(`/inventory/admin/view/${ownerUserId}`, {
      params: { id: itemId },
    });
    // Handle either object or { data: ... } API shapes
    const payload = Array.isArray(data)
      ? (data as RawInventoryItem[])
      : (data?.data as RawInventoryItem[] | RawInventoryItem | undefined);
    if (!payload) return null;
    if (Array.isArray(payload)) {
      if (payload.length === 1) {
        return payload[0] ?? null;
      }
      const found = payload.find((it) => it?._id === itemId);
      return found ?? null;
    }
    return (payload as RawInventoryItem) ?? null;
  }
}
