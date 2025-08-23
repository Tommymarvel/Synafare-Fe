import axiosInstance from './axiosInstance';
import {
  ApiProduct,
  ApiResponse,
  ProductListingType,
} from '@/types/marketplace.types';

export interface MarketplaceFilters {
  id?: string;
  status?: string;
  category?: string[];
  brand?: string[];
  company?: string[];
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  sort?: 'popular' | 'newest' | 'price_asc' | 'price_desc';
  page?: number;
  limit?: number;
}

export const marketplaceApi = {
  // Get marketplace products
  getProducts: async (
    filters: MarketplaceFilters = {}
  ): Promise<ApiResponse> => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, v.toString()));
        } else {
          params.append(key, value.toString());
        }
      }
    });

    const response = await axiosInstance.get(
      `/inventory/marketplace?${params.toString()}`
    );
    return response.data;
  },

  // Get single product by ID
  getProductById: async (id: string): Promise<ApiProduct> => {
    const response = await axiosInstance.get(`/inventory/marketplace?id=${id}`);
    return response.data.data[0];
  },

  // Get products by supplier/company
  getProductsByCompany: async (
    companyId: string,
    filters: Omit<MarketplaceFilters, 'company'> = {}
  ): Promise<ApiResponse> => {
    return marketplaceApi.getProducts({ ...filters, company: [companyId] });
  },

  // Search products
  searchProducts: async (
    query: string,
    filters: Omit<MarketplaceFilters, 'search'> = {}
  ): Promise<ApiResponse> => {
    return marketplaceApi.getProducts({ ...filters, search: query });
  },

  // Get products by category
  getProductsByCategory: async (
    categories: string[],
    filters: Omit<MarketplaceFilters, 'category'> = {}
  ): Promise<ApiResponse> => {
    return marketplaceApi.getProducts({ ...filters, category: categories });
  },
};

// Helper function to transform API product to our component format
export const transformApiProduct = (
  apiProduct: ApiProduct
): ProductListingType => {
  return {
    id: apiProduct._id,
    src: apiProduct.product_image[0] || '/solar-battery.png',
    category: apiProduct.product_category,
    title: apiProduct.product_name,
    supplier_name:
      apiProduct.product_owner.business?.business_name || 'Unknown Supplier',
    supplier_profile: '/product-avatar.png', // Default avatar since API doesn't provide this
    supplier_id: apiProduct.product_owner._id,
    nature_of_solar_business: apiProduct.product_owner.nature_of_solar_business,
    url: `/dashboard/marketplace/${apiProduct._id}`,
    price: parseInt(apiProduct.unit_price),
    description: apiProduct.desc,
    specifications: [], // API doesn't provide this, could be added later
    images:
      apiProduct.product_image.length > 0
        ? apiProduct.product_image
        : ['/solar-battery.png'],
    brand: apiProduct.brand,
    model: apiProduct.model,
    sku: apiProduct.product_sku,
    quantity_in_stock: apiProduct.quantity_in_stock,
    order_count: apiProduct.order_count || 0,
    status: apiProduct.status,
    createdAt: apiProduct.createdAt,
    updatedAt: apiProduct.updatedAt,
  };
};
