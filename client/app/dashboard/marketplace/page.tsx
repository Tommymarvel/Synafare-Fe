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

const MarketPlace = () => {
  const [products, setProducts] = useState<ProductListingType[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<
    'popular' | 'newest' | 'price_asc' | 'price_desc'
  >('popular');
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
      <PageIntro>Market Place</PageIntro>

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
