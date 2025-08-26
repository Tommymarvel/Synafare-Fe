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

      console.log('Fetching products with filters:', cleanFilters); // Debug log

      const response = await marketplaceApi.getProducts(cleanFilters);
      console.log('API response:', response); // Debug log

      // Transform API products to our component format
      const transformedProducts = response.data.map(transformApiProduct);
      console.log('Transformed products:', transformedProducts); // Debug log

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
      <div className='flex justify-between'>
        <PageIntro>Market Place</PageIntro>
        <span
          className="bg-gray-4 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer"
          onClick={() => router.push('/dashboard/rfq')}
          title='Go to Request for Quote (RFQ)'
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
      <div className="flex gap-x-[18px] ">
        <MarketPlaceFilter
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onReset={handleResetFilters}
        />

        <div className="space-y-[15px] grow">
          <div className="flex justify-between items-center border-y border-y-gray-4 py-3">
            <h4 className="text-[16px]">
              {loading
                ? 'Loading...'
                : `Showing ${
                    totalResults > 0 ? `${startResult}-${endResult}` : '0'
                  } of ${totalResults} results`}
            </h4>
            <div className="flex gap-x-2 items-center">
              <span className="text-gray-900">Sort by:</span>
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="focus-visible:border-none border-none shadow-none font-semibold text-mikado-yellow">
                  <SelectValue placeholder="Most popular" />
                </SelectTrigger>
                <SelectContent>
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
    </div>
  );
};

export default MarketPlace;
