'use client';

import { useState, useEffect } from 'react';
import ProductList from '@/app/components/marketplace/product-list';
import GoBack from '@/app/components/goback';
import Image from 'next/image';
import { marketplaceApi, transformApiProduct } from '@/lib/marketplaceApi';
import { ProductListingType } from '@/types/marketplace.types';
import EmptyState from '@/app/components/EmptyState';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

interface Supplier {
  id: string;
  name: string;
  profile: string;
  phone: string;
  address: string;
  type: 'supplier' | 'distributor' | 'installer';
  totalProducts: number;
}

export default function StorePage({ params }: PageProps) {
  const [supplierId, setSupplierId] = useState<string>('');
  const [sortBy, setSortBy] = useState('most-popular');
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [products, setProducts] = useState<ProductListingType[]>([]);
  const [loading, setLoading] = useState(true);

  // Extract the id from async params
  useEffect(() => {
    const extractId = async () => {
      const { id } = await params;
      setSupplierId(id);
    };
    extractId();
  }, [params]);

  useEffect(() => {
    if (!supplierId) return;

    const fetchStoreData = async () => {
      try {
        setLoading(true);

        // Fetch products by company
        const response = await marketplaceApi.getProductsByCompany(supplierId);
        const transformedProducts = response.data.map(transformApiProduct);
        setProducts(transformedProducts);

        // Create supplier object from the first product (if available)
        if (response.data.length > 0) {
          const firstProduct = response.data[0];

          // Only create supplier if product_owner exists
          if (firstProduct.product_owner) {
            setSupplier({
              id: firstProduct.product_owner._id,
              name:
                firstProduct.product_owner.business?.business_name ||
                'Unknown Supplier',
              profile: '/product-avatar.png', // Default avatar
              phone: '+234 812 345 6789', // Default phone (API doesn't provide this)
              address: `${
                firstProduct.product_owner.business?.state || 'Lagos'
              }, Nigeria`,
              type: firstProduct.product_owner.nature_of_solar_business,
              totalProducts: response.meta.total_products,
            });
          }
        }
      } catch (error) {
        console.error('Failed to fetch store data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, [supplierId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">Loading store...</div>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Store Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The store you&apos;re looking for doesn&apos;t exist.
            </p>
            <button
              onClick={() => window.history.back()}
              className="bg-mikado-yellow text-white px-6 py-2 rounded-lg hover:bg-mikado-yellow/90"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
    // TODO: Implement actual sorting logic
  };

  return (
    <div className="pb-6">
      <div className="flex justify-between items-center pb-6">
        <GoBack />
        <span className="bg-gray-4 rounded-full w-10 h-10 flex items-center justify-center">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.24 5.58055H18.84L15.46 2.20055C15.19 1.93055 14.75 1.93055 14.47 2.20055C14.2 2.47055 14.2 2.91055 14.47 3.19055L16.86 5.58055H7.14L9.53 3.19055C9.8 2.92055 9.8 2.48055 9.53 2.20055C9.26 1.93055 8.82 1.93055 8.54 2.20055L5.17 5.58055H4.77C3.87 5.58055 2 5.58055 2 8.14055C2 9.11055 2.2 9.75055 2.62 10.1705C2.86 10.4205 3.15 10.5505 3.46 10.6205C3.75 10.6905 4.06 10.7005 4.36 10.7005H19.64C19.95 10.7005 20.24 10.6805 20.52 10.6205C21.36 10.4205 22 9.82055 22 8.14055C22 5.58055 20.13 5.58055 19.24 5.58055Z"
              fill="#1D1C1D"
            />
            <path
              d="M19.0497 12H4.86967C4.24967 12 3.77967 12.55 3.87967 13.16L4.71967 18.3C4.99967 20.02 5.74967 22 9.07967 22H14.6897C18.0597 22 18.6597 20.31 19.0197 18.42L20.0297 13.19C20.1497 12.57 19.6797 12 19.0497 12ZM11.9997 19.5C9.65967 19.5 7.74967 17.59 7.74967 15.25C7.74967 14.84 8.08967 14.5 8.49967 14.5C8.90967 14.5 9.24967 14.84 9.24967 15.25C9.24967 16.77 10.4797 18 11.9997 18C13.5197 18 14.7497 16.77 14.7497 15.25C14.7497 14.84 15.0897 14.5 15.4997 14.5C15.9097 14.5 16.2497 14.84 16.2497 15.25C16.2497 17.59 14.3397 19.5 11.9997 19.5Z"
              fill="#1D1C1D"
            />
          </svg>
        </span>
      </div>

      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Marketplace</h1>

        <div className="flex gap-x-[18px]">
          {/* Supplier Info Sidebar */}
          <div className="self-start items-center justify-center shrink-0 py-8 w-[280px] border border-gray-200 rounded-[6px] px-[10px] bg-white">
            <div className="border-b-2 pb-[29px] border-b-gray-200 mx-auto w-fit space-y-[6px] text-center">
              <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden">
                <Image
                  src={supplier.profile}
                  alt={`${supplier.name} profile`}
                  fill
                  className="object-cover"
                />
              </div>
              <h4 className="text-[18px] font-semibold">{supplier.name}</h4>
            </div>

            <div className="mt-[29px] text-[13px] space-y-[6px] text-gray-600">
              <div className="flex gap-x-[6px] items-center">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.0875 17.0625C12.24 17.0625 11.3475 16.86 10.425 16.47C9.525 16.0875 8.6175 15.5625 7.7325 14.925C6.855 14.28 6.0075 13.56 5.205 12.7725C4.41 11.97 3.69 11.1225 3.0525 10.2525C2.4075 9.3525 1.89 8.4525 1.5225 7.5825C1.1325 6.6525 0.9375 5.7525 0.9375 4.905C0.9375 4.32 1.0425 3.765 1.245 3.2475C1.455 2.715 1.7925 2.22 2.25 1.7925C2.8275 1.2225 3.4875 0.9375 4.1925 0.9375C4.485 0.9375 4.785 1.005 5.04 1.125C5.3325 1.26 5.58 1.4625 5.76 1.7325L7.5 4.185C7.6575 4.4025 7.7775 4.6125 7.86 4.8225C7.9575 5.0475 8.01 5.2725 8.01 5.49C8.01 5.775 7.9275 6.0525 7.77 6.315C7.6575 6.5175 7.485 6.735 7.2675 6.9525L6.7575 7.485C6.765 7.5075 6.7725 7.5225 6.78 7.5375C6.87 7.695 7.05 7.965 7.395 8.37C7.7625 8.79 8.1075 9.1725 8.4525 9.525C8.895 9.96 9.2625 10.305 9.6075 10.59C10.035 10.95 10.3125 11.13 10.4775 11.2125L10.4625 11.25L11.01 10.71C11.2425 10.4775 11.4675 10.305 11.685 10.1925C12.0975 9.9375 12.6225 9.8925 13.1475 10.11C13.3425 10.1925 13.5525 10.305 13.7775 10.4625L16.2675 12.2325C16.545 12.42 16.7475 12.66 16.8675 12.945C16.98 13.23 17.0325 13.4925 17.0325 13.755C17.0325 14.115 16.95 14.475 16.7925 14.8125C16.635 15.15 16.44 15.4425 16.1925 15.7125C15.765 16.185 15.3 16.5225 14.76 16.74C14.2425 16.95 13.68 17.0625 13.0875 17.0625ZM4.1925 2.0625C3.78 2.0625 3.3975 2.2425 3.03 2.6025C2.685 2.925 2.445 3.2775 2.295 3.66C2.1375 4.05 2.0625 4.4625 2.0625 4.905C2.0625 5.6025 2.2275 6.36 2.5575 7.14C2.895 7.935 3.3675 8.76 3.9675 9.585C4.5675 10.41 5.25 11.2125 6 11.97C6.75 12.7125 7.56 13.4025 8.3925 14.01C9.2025 14.6025 10.035 15.0825 10.86 15.4275C12.1425 15.975 13.3425 16.1025 14.3325 15.69C14.715 15.5325 15.0525 15.2925 15.36 14.9475C15.5325 14.76 15.6675 14.5575 15.78 14.3175C15.87 14.13 15.915 13.935 15.915 13.74C15.915 13.62 15.8925 13.5 15.8325 13.365C15.81 13.32 15.765 13.2375 15.6225 13.14L13.1325 11.37C12.9825 11.265 12.8475 11.19 12.72 11.1375C12.555 11.07 12.4875 11.0025 12.2325 11.16C12.0825 11.235 11.9475 11.3475 11.7975 11.4975L11.2275 12.06C10.935 12.345 10.485 12.4125 10.14 12.285L9.9375 12.195C9.63 12.03 9.27 11.775 8.8725 11.4375C8.5125 11.13 8.1225 10.77 7.65 10.305C7.2825 9.93 6.915 9.5325 6.5325 9.09C6.18 8.6775 5.925 8.325 5.7675 8.0325L5.6775 7.8075C5.6325 7.635 5.6175 7.5375 5.6175 7.4325C5.6175 7.1625 5.715 6.9225 5.9025 6.735L6.465 6.15C6.615 6 6.7275 5.8575 6.8025 5.73C6.8625 5.6325 6.885 5.55 6.885 5.475C6.885 5.415 6.8625 5.325 6.825 5.235C6.7725 5.115 6.69 4.98 6.585 4.8375L4.845 2.3775C4.77 2.2725 4.68 2.1975 4.5675 2.145C4.4475 2.0925 4.32 2.0625 4.1925 2.0625ZM10.4625 11.2575L10.3425 11.7675L10.545 11.2425C10.5075 11.235 10.4775 11.2425 10.4625 11.2575Z"
                    fill="#E2A109"
                  />
                </svg>
                <p>{supplier.phone}</p>
              </div>
              <div className="flex gap-x-[6px] items-center">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.99967 10.6276C7.40217 10.6276 6.09717 9.33008 6.09717 7.72508C6.09717 6.12008 7.40217 4.83008 8.99967 4.83008C10.5972 4.83008 11.9022 6.12758 11.9022 7.73258C11.9022 9.33758 10.5972 10.6276 8.99967 10.6276ZM8.99967 5.95508C8.02467 5.95508 7.22217 6.75008 7.22217 7.73258C7.22217 8.71508 8.01717 9.51008 8.99967 9.51008C9.98217 9.51008 10.7772 8.71508 10.7772 7.73258C10.7772 6.75008 9.97467 5.95508 8.99967 5.95508Z"
                    fill="#E2A109"
                  />
                  <path
                    d="M9.00025 17.07C7.89025 17.07 6.77275 16.65 5.90275 15.8175C3.69025 13.6875 1.24525 10.29 2.16775 6.2475C3.00025 2.58 6.20275 0.9375 9.00025 0.9375C9.00025 0.9375 9.00025 0.9375 9.00775 0.9375C11.8053 0.9375 15.0078 2.58 15.8403 6.255C16.7553 10.2975 14.3103 13.6875 12.0978 15.8175C11.2278 16.65 10.1103 17.07 9.00025 17.07ZM9.00025 2.0625C6.81775 2.0625 4.01275 3.225 3.27025 6.495C2.46025 10.0275 4.68025 13.0725 6.69025 15C7.98775 16.2525 10.0203 16.2525 11.3178 15C13.3203 13.0725 15.5403 10.0275 14.7453 6.495C13.9953 3.225 11.1828 2.0625 9.00025 2.0625Z"
                    fill="#E2A109"
                  />
                </svg>
                <p>{supplier.address}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm">
                  <span className="font-medium">{supplier.totalProducts}</span>{' '}
                  Products Available
                </p>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="space-y-[15px] grow">
            <div className="flex justify-between items-center border-y border-y-gray-200 py-3">
              <h4 className="text-[16px]">
                Showing 1-{products.length} of {products.length} results
              </h4>
              <div className="flex gap-x-2 items-center">
                <span className="text-gray-900">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className="border-none focus:outline-none font-semibold text-mikado-yellow bg-transparent"
                >
                  <option value="most-popular">Most popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>

            {products.length === 0 ? (
              <EmptyState
                title="No Products Available"
                description="This store doesn't have any products yet."
                illustration="/no-item.svg"
                className="min-h-[60vh] bg-gray-50 rounded-lg"
              />
            ) : (
              <div className="grid grid-cols-3 gap-[15px]">
                {products.map((product) => (
                  <ProductList key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
