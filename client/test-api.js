// Test API response transformation
const testApiResponse = {
  _id: '689cd9245e601f73cca5c2e3',
  product_name: 'inverter123',
  status: 'published',
  product_image: [
    'https://res.cloudinary.com/oladee/image/upload/v1755109661/prod_images/bp0fayesvzzjx2s9q7li.png',
    'https://res.cloudinary.com/oladee/image/upload/v1755109668/prod_images/tjczxm3s6fv9hjbtpyse.png',
  ],
  product_owner: {
    _id: '688fe6cc5cb0234034033863',
    nature_of_solar_business: 'distributor',
  },
  createdAt: '2025-08-13T18:27:48.917Z',
  updatedAt: '2025-08-21T10:46:44.591Z',
  __v: 0,
  brand: 'Lumiious',
  desc: 'best',
  model: '1.5kVa',
  product_category: 'Battery',
  product_sku: 479,
  quantity_in_stock: 10,
  unit_price: '5000',
};

// Mock transform function (copy from marketplaceApi.ts)
const transformApiProduct = (apiProduct) => {
  return {
    id: apiProduct._id,
    src: apiProduct.product_image[0] || '/solar-battery.png',
    category: apiProduct.product_category,
    title: apiProduct.product_name,
    supplier_name:
      apiProduct.product_owner.business?.business_name || 'Unknown Supplier',
    supplier_profile: '/product-avatar.png',
    supplier_id: apiProduct.product_owner._id,
    nature_of_solar_business: apiProduct.product_owner.nature_of_solar_business,
    url: `/dashboard/marketplace/${apiProduct._id}`,
    price: parseInt(apiProduct.unit_price),
    description: apiProduct.desc,
    specifications: [],
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

const transformed = transformApiProduct(testApiResponse);
console.log('Transformed product:', JSON.stringify(transformed, null, 2));
