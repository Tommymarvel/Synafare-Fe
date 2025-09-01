import Pagination from '@/components/pagination';
import ProductListing from './product-list';
import { ProductListingType } from '@/types/market.place.types';
import Image from 'next/image';

const ProductsListings = ({
  products,
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
  onPrevious = () => {},
  onNext = () => {},
}: {
  products: ProductListingType[];
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onPrevious?: () => void;
  onNext?: () => void;
}) => {
  return (
    <>
      {!products.length && (
        <div className="flex items-center justify-center h-full min-h-[60vh] bg-black">
          <div className="space-y-[18px]">
            <Image alt="" src="/no-item.svg" className="w-[117px]" />
            <h1 className="text-gray-3 text-[18px]">Sorry, item unavailable</h1>
          </div>
        </div>
      )}
      <div className="grid grid-cols-3 gap-[15px]">
        {products.map((product) => (
          <ProductListing key={product.id} product={product} />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        onPrevious={onPrevious}
        onNext={onNext}
      />
    </>
  );
};

export default ProductsListings;
