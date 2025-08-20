import Pagination from "@/components/pagination";
import ProductListing from "./product-list";
import { ProductListingType } from "@/types/market.place.types";

const ProductsListings = ({ products }: { products: ProductListingType[] }) => {
  return (
    <>
      {!products.length && (
        <div className="flex items-center justify-center h-full min-h-[60vh] bg-black">
          <div className="space-y-[18px]">
            <img src="/no-item.svg" className="w-[117px]" />
            <h1 className="text-gray-3 text-[18px]">Sorry, item unavailable</h1>
          </div>
        </div>
      )}
      <div className="grid grid-cols-3 gap-[15px]">
        {products.map((product) => (
          <ProductListing key={product.id} product={product} />
        ))}
      </div>
      <Pagination />
    </>
  );
};

export default ProductsListings;
