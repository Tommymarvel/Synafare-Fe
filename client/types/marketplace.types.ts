// API Response types (what we get from the server)
export type ApiProduct = {
  _id: string;
  product_name: string;
  product_category: {
    _id: string;
    name: string;
    isActive: boolean;
    tags: string[];
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  product_sku: number;
  quantity_in_stock: number;
  brand: string;
  model?: string;
  model_number?: string; // API uses this field name
  unit_price: string | number; // API can send as string or number
  status: 'published' | 'draft' | 'unpublished' | 'out_of_stock';
  desc: string;
  order_count: number;
  product_image: string[];
  product_owner: {
    _id: string;
    nature_of_solar_business: 'supplier' | 'distributor' | 'installer';
    business: {
      _id: string;
      business_name: string;
      state: string;
    };
  } | null; // Can be null
  createdAt: string;
  updatedAt: string;
};

export type ApiResponse = {
  data: ApiProduct[];
  meta: {
    total_products: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

// Transformed types (what we use in the frontend components)
// These use more intuitive field names for the frontend
export type ProductListingType = {
  id: string; // from _id
  title: string; // from product_name
  category: string; // from product_category
  sku: number; // from product_sku
  quantity_in_stock: number; // matches API
  brand: string; // matches API
  model: string; // matches API
  price: number; // parsed from unit_price (string -> number)
  status: 'published' | 'draft' | 'unpublished' | 'out_of_stock'; // matches API
  description: string; // from desc
  order_count: number; // matches API
  images: string[]; // from product_image
  src: string; // primary image (first from product_image)
  supplier_name: string; // from product_owner.business.business_name
  supplier_id: string; // from product_owner._id
  supplier_profile: string; // default avatar (not from API)
  nature_of_solar_business: 'supplier' | 'distributor' | 'installer'; // from product_owner.nature_of_solar_business
  url: string; // computed navigation URL
  createdAt: string; // matches API
  updatedAt: string; // matches API
  specifications?: string[]; // additional frontend field
};

export type RFQItem = {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  supplierId?: string;
  supplierName?: string;
  specifications?: string;
  dateAdded: string;
};

// API response types for RFQ Cart
export type ApiRFQCartItem = {
  product: {
    _id: string;
    name: string;
    price: number;
  };
  quantity: number;
};

export type ApiRFQCart = {
  _id: string;
  user: string;
  supplier: {
    _id: string;
    name: string;
  };
  items: ApiRFQCartItem[];
};

export type ApiRFQCartResponse = {
  message: string;
  rfqCart: ApiRFQCart[];
};

export type QuoteRequest = {
  id: string;
  productId: string;
  productName: string;
  supplierId: string;
  supplierName: string;
  quantity: number;
  message?: string;
  dateRequested: string;
  status: 'pending' | 'responded' | 'declined';
};
