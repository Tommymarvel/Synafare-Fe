import { useEffect, useState } from 'react';
import SearchInput from '@/app/components/search.input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/app/components/ui/accordion';
import { Checkbox } from '@/app/components/ui/checkbox';
import axios from '@/lib/axiosInstance';

// Define category interface
interface Category {
  name: string;
  _id: string;
}

interface FilterState {
  category: string[];
  minPrice: number | undefined;
  maxPrice: number | undefined;
  company: string[];
  search: string;
  brand: string[];
  location: string;
}

interface MarketPlaceFilterProps {
  filters: FilterState;
  onFiltersChange: (filters: Partial<FilterState>) => void;
  onReset: () => void;
}

const MarketPlaceFilter = ({
  filters,
  onFiltersChange,
  onReset,
}: MarketPlaceFilterProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await axios.get('/inventory/list-categories');
        // Access categories from the nested response structure
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const brands = [
    'Bluegate',
    'Luminous',
    'Prag',
    'LONGi',
    'SunPower',
    'Huwaei',
  ];
  const companies = [
    'Blue Camel Energy',
    'Power Solutions Ltd',
    'Green Energy Co',
    'Solar Tech Ltd',
    'Future Energy Systems',
  ];

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.category, categoryId]
      : filters.category.filter((c) => c !== categoryId);
    onFiltersChange({ category: newCategories });
  };

  const handleBrandChange = (brand: string, checked: boolean) => {
    const newBrands = checked
      ? [...filters.brand, brand]
      : filters.brand.filter((b) => b !== brand);
    onFiltersChange({ brand: newBrands });
  };

  const handleCompanyChange = (company: string, checked: boolean) => {
    const newCompanies = checked
      ? [...filters.company, company]
      : filters.company.filter((c) => c !== company);
    onFiltersChange({ company: newCompanies });
  };

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numValue = value === '' ? undefined : parseInt(value);
    onFiltersChange({
      [type === 'min' ? 'minPrice' : 'maxPrice']: numValue,
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ search: e.target.value });
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ location: e.target.value });
  };

  return (
    <div className="shrink-0 space-y-5 w-[250px] border border-gray rounded-[6px] py-5 px-[10px]">
      <div className="flex justify-between">
        <span className="font-semibold">Filter</span>
        <button onClick={onReset} className="font-medium text-[#E2A109]">
          Reset
        </button>
      </div>
      <SearchInput
        className="rounded-md text-sm"
        placeholder="Search products"
        value={filters.search}
        onChange={handleSearchChange}
      />

      <div>
        <Accordion
          type="multiple"
          defaultValue={['category', 'price', 'brand', 'company']}
        >
          <AccordionItem value="category">
            <AccordionTrigger className="hover:no-underline text-[16px] font-semibold">
              Category
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              {loadingCategories ? (
                <div className="text-gray-500 text-sm">
                  Loading categories...
                </div>
              ) : categories.length > 0 ? (
                categories.map((category) => (
                  <div key={category._id} className="flex items-center gap-3">
                    <Checkbox
                      className="border-gray-300 data-[state=checked]:bg-mikado data-[state=checked]:text-white data-[state=checked]:border-mikado"
                      id={category._id}
                      checked={filters.category.includes(category._id)}
                      onCheckedChange={(checked) =>
                        handleCategoryChange(category._id, !!checked)
                      }
                    />
                    <p>{category.name}</p>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-sm">
                  No categories available
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="price" className="w-full">
            <AccordionTrigger className="hover:no-underline text-[16px] font-semibold">
              Price
            </AccordionTrigger>
            <AccordionContent className="space-y-3 w-full ">
              <div className="flex gap-x-1 w-full ">
                <input
                  type="text"
                  name="min"
                  className="border border-[#D0D5DD] rounded-[6px] w-1/2 py-[6px] placeholder:text-gray-2 ps-3"
                  placeholder="min"
                  value={filters.minPrice || ''}
                  onChange={(e) => handlePriceChange('min', e.target.value)}
                />
                <input
                  type="text"
                  name="max"
                  className="border border-[#D0D5DD] rounded-[6px] w-1/2 py-[6px] placeholder:text-gray-2 ps-3"
                  placeholder="max"
                  value={filters.maxPrice || ''}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="brand">
            <AccordionTrigger className="hover:no-underline text-[16px] font-semibold">
              Brand
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              {brands.map((brand) => (
                <div key={brand} className="flex items-center gap-3">
                  <Checkbox
                    className="border-gray-300 data-[state=checked]:bg-mikado data-[state=checked]:text-white data-[state=checked]:border-mikado"
                    id={brand.toLowerCase().replace(/\s+/g, '-')}
                    checked={filters.brand.includes(brand)}
                    onCheckedChange={(checked) =>
                      handleBrandChange(brand, !!checked)
                    }
                  />
                  <p>{brand}</p>
                </div>
              ))}
              <button className="font-medium flex gap-x-1">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 10.625H5C4.65833 10.625 4.375 10.3417 4.375 10C4.375 9.65833 4.65833 9.375 5 9.375H15C15.3417 9.375 15.625 9.65833 15.625 10C15.625 10.3417 15.3417 10.625 15 10.625Z"
                    fill="#1D1C1D"
                  />
                  <path
                    d="M10 15.625C9.65833 15.625 9.375 15.3417 9.375 15V5C9.375 4.65833 9.65833 4.375 10 4.375C10.3417 4.375 10.625 4.65833 10.625 5V15C10.625 15.3417 10.3417 15.625 10 15.625Z"
                    fill="#1D1C1D"
                  />
                </svg>
                View more
              </button>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="company">
            <AccordionTrigger className="hover:no-underline text-[16px] font-semibold">
              Company
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              {companies.map((company) => (
                <div key={company} className="flex items-center gap-3">
                  <Checkbox
                    className="border-gray-300 data-[state=checked]:bg-mikado data-[state=checked]:text-white data-[state=checked]:border-mikado"
                    id={company.toLowerCase().replace(/\s+/g, '-')}
                    checked={filters.company.includes(company)}
                    onCheckedChange={(checked) =>
                      handleCompanyChange(company, !!checked)
                    }
                  />
                  <p>{company}</p>
                </div>
              ))}
              <button className="font-medium flex gap-x-1">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 10.625H5C4.65833 10.625 4.375 10.3417 4.375 10C4.375 9.65833 4.65833 9.375 5 9.375H15C15.3417 9.375 15.625 9.65833 15.625 10C15.625 10.3417 15.3417 10.625 15 10.625Z"
                    fill="#1D1C1D"
                  />
                  <path
                    d="M10 15.625C9.65833 15.625 9.375 15.3417 9.375 15V5C9.375 4.65833 9.65833 4.375 10 4.375C10.3417 4.375 10.625 4.65833 10.625 5V15C10.625 15.3417 10.3417 15.625 10 15.625Z"
                    fill="#1D1C1D"
                  />
                </svg>
                View more
              </button>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="location">
            <AccordionTrigger className="hover:no-underline text-[16px] font-semibold">
              Location
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              <input
                type="text"
                name="location"
                className="border border-[#D0D5DD] rounded-[6px] w-full py-3 px-[14px] placeholder:text-gray-2 ps-3"
                placeholder="Input Location"
                value={filters.location}
                onChange={handleLocationChange}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default MarketPlaceFilter;
