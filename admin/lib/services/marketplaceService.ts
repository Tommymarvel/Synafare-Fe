import axiosInstance from '@/lib/axiosInstance';

export type APIProductOwner = {
  _id: string;
  nature_of_solar_business?: string;
  business?: {
    _id: string;
    business_name: string;
  };
};

export type APIProduct = {
  _id: string;
  product_name?: string;
  product_category?: string;
  product_sku?: number | string;
  quantity_in_stock?: number;
  brand?: string;
  model_number?: string;
  unit_price?: number | string;
  status?: string;
  desc?: string;
  order_count?: number;
  product_image?: string[];
  product_owner?: APIProductOwner | string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
};

export type MarketplaceListResponse = {
  data: APIProduct[];
  relatedProducts?: APIProduct[];
  meta: {
    total_products: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type MarketplaceQuery = {
  id?: string;
  status?: string; // 'published' | 'draft' | 'unpublished' | 'out_of_stock'
  category?: string[];
  brand?: string[];
  company?: string[]; // product_owner ids
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  sort?: 'popular' | 'newest' | 'price_asc' | 'price_desc';
  page?: number;
  limit?: number;
};

export class MarketplaceService {
  static async list(params?: MarketplaceQuery) {
    const search = new URLSearchParams();
    if (params?.id) search.set('id', params.id);
    if (params?.status) search.set('status', params.status);
    params?.category?.forEach((c) => search.append('category', c));
    params?.brand?.forEach((b) => search.append('brand', b));
    params?.company?.forEach((c) => search.append('company', c));
    if (params?.search) search.set('search', params.search);
    if (typeof params?.minPrice === 'number')
      search.set('minPrice', String(params.minPrice));
    if (typeof params?.maxPrice === 'number')
      search.set('maxPrice', String(params.maxPrice));
    if (params?.location) search.set('location', params.location);
    if (params?.sort) search.set('sort', params.sort);
    if (params?.page) search.set('page', String(params.page));
    if (params?.limit) search.set('limit', String(params.limit));
    const url = `/inventory/admin/marketplace${
      search.toString() ? `?${search.toString()}` : ''
    }`;
    const res = await axiosInstance.get<MarketplaceListResponse>(url);
    return res.data;
  }

  static async getById(id: string) {
    const url = `/inventory/admin/marketplace?id=${encodeURIComponent(id)}`;
    const res = await axiosInstance.get<MarketplaceListResponse>(url);
    return res.data;
  }
}
