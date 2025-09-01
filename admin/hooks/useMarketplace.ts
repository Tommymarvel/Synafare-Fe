import useSWR from 'swr';
import { useMemo } from 'react';
import {
  MarketplaceService,
  APIProduct,
} from '@/lib/services/marketplaceService';
import { ProductListingType } from '@/types/market.place.types';

function mapProduct(p: APIProduct): ProductListingType {
  const owner =
    typeof p.product_owner === 'string' ? undefined : p.product_owner;

  // Handle category - extract name if it's an object, use as string if it's already a string
  const category =
    typeof p.product_category === 'object' && p.product_category !== null
      ? p.product_category.name
      : typeof p.product_category === 'string'
      ? p.product_category
      : '---';

  return {
    id: p._id,
    src: p.product_image?.[0] || '/product-img.png',
    category: category,
    title: p.product_name || '---',
    url: `/marketplace/product/${p._id}`,
    supplier_name: owner?.business?.business_name || '---',
    supplier_profile: '/product-avatar.png',
    supplier_id: owner?._id || '---',
    // Additional fields
    description: p.desc,
    price:
      typeof p.unit_price === 'number'
        ? p.unit_price
        : typeof p.unit_price === 'string'
        ? parseFloat(p.unit_price)
        : undefined,
    brand: p.brand,
    model_number: p.model_number,
    sku:
      typeof p.product_sku === 'string'
        ? p.product_sku
        : typeof p.product_sku === 'number'
        ? String(p.product_sku)
        : undefined,
    stock_quantity: p.quantity_in_stock,
  };
}

export function useMarketplace(
  query: Parameters<typeof MarketplaceService.list>[0] = { page: 1, limit: 12 }
) {
  const { page = 1, limit = 12 } = query || {};
  const key = ['marketplace', query] as const;
  const { data, error, isLoading, mutate } = useSWR(key, () =>
    MarketplaceService.list(query)
  );

  const products: ProductListingType[] = useMemo(
    () => data?.data?.map(mapProduct) ?? [],
    [data]
  );

  const meta = useMemo(
    () =>
      data?.meta ?? {
        total_products: 0,
        page,
        limit,
        totalPages: 0,
      },
    [data, page, limit]
  );

  return { products, meta, isLoading, error, refresh: mutate };
}

export function useMarketplaceItem(id?: string) {
  const key = id ? ['marketplace-item', id] : null;
  const { data, error, isLoading, mutate } = useSWR(key, () =>
    MarketplaceService.getById(id as string)
  );

  const item = useMemo(() => {
    const p = data?.data?.[0];
    if (!p) return undefined;
    return mapProduct(p);
  }, [data]);

  const related = useMemo(
    () => data?.relatedProducts?.map(mapProduct) ?? [],
    [data]
  );

  const meta = data?.meta;

  return { item, related, meta, isLoading, error, refresh: mutate };
}
