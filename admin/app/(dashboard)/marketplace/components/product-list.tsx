import { ProductListingType } from "@/types/market.place.types";

const ProductList = ({ product }: { product: ProductListingType }) => {
  return (
    <div className="border-[1.17px] border-gray rounded-md">
      <img
        src={product.src}
        alt=""
        className="w-full aspect-video object-cover"
      />
      <div className="bg-white py-3 px-[18px] space-y-[6px]">
        <span className="text-mikado-yellow text-xs">{product.category}</span>
        <a href="/marketplace/product/1" className="font-semibold block">
          {product.title}
        </a>
        <a
          href={"/marketplace/store/" + product.supplier_id}
          className="flex gap-x-[6px] hover:underline items-cent"
        >
          <img
            src={product.supplier_profile}
            className="w-5 h-5 rounded-full"
            alt="avatar"
          />
          <p className="text-gray-3 text-xs">{product.supplier_name}</p>
        </a>
      </div>
    </div>
  );
};

export default ProductList;
