import { ProductListingType } from '@/types/marketplace.types';
import ProductListing from './product-list';
import SimplePagination from './simple-pagination';

interface ProductsListingsProps {
  products: ProductListingType[];
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

const ProductsListings = ({
  products,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}: ProductsListingsProps) => {
  console.log('ProductsListings received products:', products); // Debug log

  return (
    <>
      {!products.length && (
        <div className="flex items-center justify-center h-full min-h-[60vh] bg-gray-50 rounded-lg">
          <div className="space-y-[18px] text-center">
            <div className="w-[117px] h-[117px] mx-auto bg-gray-200 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <h1 className="text-gray-500 text-[18px]">
              Sorry, item unavailable
            </h1>
          </div>
        </div>
      )}
      {products.length > 0 && (
        <div className="grid grid-cols-3 gap-[15px]">
          {products.map((product) => (
            <ProductListing key={product.id} product={product} />
          ))}
        </div>
      )}
      <SimplePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </>
  );
};

export default ProductsListings;
