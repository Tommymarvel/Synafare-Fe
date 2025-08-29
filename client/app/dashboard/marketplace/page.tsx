'use client';

import { useState, useEffect, useCallback } from 'react';
import PageIntro from '@/app/components/page-intro';
import MarketPlaceFilter from '@/app/components/marketplace/filter';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import ProductsListings from '@/app/components/marketplace/products-listings';
import { marketplaceApi, transformApiProduct } from '@/lib/marketplaceApi';
import { ProductListingType } from '@/types/marketplace.types';
import { useRouter } from 'next/navigation';

const MarketPlace = () => {
  const [products, setProducts] = useState<ProductListingType[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<
    'popular' | 'newest' | 'price_asc' | 'price_desc'
  >('popular');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const router = useRouter();

  const [filters, setFilters] = useState({
    category: [] as string[],
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
    company: [] as string[],
    search: '',
    brand: [] as string[],
    location: '',
  });

  const pageSize = 12;

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const apiFilters = {
        page: currentPage,
        limit: pageSize,
        sort: sortBy,
        category: filters.category.length > 0 ? filters.category : undefined,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        company: filters.company.length > 0 ? filters.company : undefined,
        brand: filters.brand.length > 0 ? filters.brand : undefined,
        location: filters.location || undefined,
        search: filters.search || undefined,
      };

      // Remove undefined values
      const cleanFilters = Object.fromEntries(
        Object.entries(apiFilters).filter(([, value]) => value !== undefined)
      );

      const response = await marketplaceApi.getProducts(cleanFilters);
      console.log('API Response:', response); // Debug log

      // Transform API products to our component format
      const transformedProducts = response.data.map(transformApiProduct);
      console.log('Transformed Products:', transformedProducts); // Debug log

      setProducts(transformedProducts);
      setTotalResults(response.meta.total_products);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      // Fallback to empty array
      setProducts([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, sortBy, filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSortChange = (value: string) => {
    setSortBy(value as 'popular' | 'newest' | 'price_asc' | 'price_desc');
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  const handleFiltersChange = (newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleResetFilters = () => {
    setFilters({
      category: [],
      minPrice: undefined,
      maxPrice: undefined,
      company: [],
      search: '',
      brand: [],
      location: '',
    });
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(totalResults / pageSize);
  const startResult = (currentPage - 1) * pageSize + 1;
  const endResult = Math.min(currentPage * pageSize, totalResults);

  return (
    <div>
      <div className="flex justify-between">
        <PageIntro>Market Place</PageIntro>
        <span
          className="bg-gray-4 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer"
          onClick={() => router.push('/dashboard/rfq')}
          title="Go to Request for Quote (RFQ)"
        >
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

      {/* Mobile: filter button */}
      <div className="mt-4 md:hidden px-2">
        <button
          aria-label="Open filters"
          className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm bg-white"
          onClick={() => setShowMobileFilters(true)}
        >
          Filters
        </button>
      </div>

      <div className="flex gap-x-[18px] ">
        {/* Desktop filter */}
        <div className="hidden md:block">
          <MarketPlaceFilter
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onReset={handleResetFilters}
          />
        </div>

        <div className="space-y-[15px] mt-4 grow">
          <div className="flex justify-between items-center border-y border-y-gray-4 py-3">
            <h4 className="text-xs lg:text-base">
              {loading
                ? 'Loading...'
                : `Showing ${
                    totalResults > 0 ? `${startResult}-${endResult}` : '0'
                  } of ${totalResults} results`}
            </h4>
            <div className="flex gap-x-2 items-center">
              <span className="text-gray-900 text-xs lg:text-base">
                Sort by:
              </span>
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="focus-visible:border-none border-none shadow-none font-semibold text-mikado-yellow">
                  <SelectValue
                    placeholder="Most popular"
                    className="text-xs lg:text-base"
                  />
                </SelectTrigger>
                <SelectContent className="text-xs lg:text-base">
                  <SelectItem value="popular">Most popular</SelectItem>
                  <SelectItem value="price_asc">Price: Low to High</SelectItem>
                  <SelectItem value="price_desc">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <ProductsListings
            products={products}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {/* Mobile sliding panel for filters */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowMobileFilters(false)}
          />

          <aside className="absolute left-0 top-0 bottom-0 w-[86%] max-w-xs bg-white p-4 shadow-xl transform transition-transform duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Filters</h3>
              <button
                onClick={() => setShowMobileFilters(false)}
                aria-label="Close filters"
                className="text-gray-600"
              >
                ✕
              </button>
            </div>
            <MarketPlaceFilter
              filters={filters}
              onFiltersChange={(f) => {
                handleFiltersChange(f);
                // keep panel open to allow more adjustments
              }}
              onReset={() => {
                handleResetFilters();
              }}
            />
          </aside>
        </div>
      )}
    </div>
  );
};

export default MarketPlace;
