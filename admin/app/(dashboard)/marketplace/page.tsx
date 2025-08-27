'use client';
import PageIntro from '@/components/page-intro';
import MarketPlaceFilter from './components/filter';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProductListingData } from '@/data/marketplace';
import ProductsListings from './components/products-listings';
import { useMarketplace } from '@/hooks/useMarketplace';
import { useMemo, useState, useCallback } from 'react';

const MarketPlace = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);

  const { products } = useMarketplace({
    page: 1,
    limit: 12,
    status: 'published',
    sort: 'newest',
    category: categories.length ? categories : undefined,
    brand: brands.length ? brands : undefined,
  });

  const toggleFrom = useCallback(
    (arr: string[], value: string, checked: boolean) => {
      if (checked) return Array.from(new Set([...arr, value]));
      return arr.filter((v) => v !== value);
    },
    []
  );

  const onToggleCategory = useCallback(
    (value: string, checked: boolean) => {
      setCategories((prev) => toggleFrom(prev, value, checked));
    },
    [toggleFrom]
  );

  const onToggleBrand = useCallback(
    (value: string, checked: boolean) => {
      setBrands((prev) => toggleFrom(prev, value, checked));
    },
    [toggleFrom]
  );
  const items = useMemo(
    () => (products.length ? products : ProductListingData),
    [products]
  );
  return (
    <div>
      <PageIntro>Market Place</PageIntro>

      <div className="flex gap-x-[18px] ">
        <MarketPlaceFilter
          selectedCategories={categories}
          selectedBrands={brands}
          onToggleCategory={onToggleCategory}
          onToggleBrand={onToggleBrand}
        />

        <div className="space-y-[15px] grow">
          <div className="flex justify-between items-center border-y border-y-gray-4 py-3">
            <h4 className="text-[16px]">Showing 1- 12 of 200 results</h4>
            <div className="flex gap-x-2 items-center">
              <span className="text-gray-900">Sort by:</span>
              <Select>
                <SelectTrigger className="focus-visible:border-none border-none shadow-none font-semibold text-mikado-yellow">
                  <SelectValue placeholder="Most popular" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <ProductsListings products={items} />
        </div>
      </div>
    </div>
  );
};

export default MarketPlace;
