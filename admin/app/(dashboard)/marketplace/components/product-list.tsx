import { ProductListingType } from '@/types/market.place.types';
import Image from 'next/image';
import Link from 'next/link';

const ProductList = ({ product }: { product: ProductListingType }) => {
  return (
    <div className="border-[1.17px] border-gray rounded-md">
      <Image
        src={product.src}
        width={400}
        height={400}
        alt=""
        className="w-full aspect-video object-cover"
      />
      <div className="bg-white py-3 px-[18px] space-y-[6px]">
        <Link href={product.url} className="font-semibold block">
          {product.title}
        </Link>
        <a
          href={'/marketplace/store/' + product.supplier_id}
          className="flex gap-x-[6px] hover:underline items-cent"
        >
          <Image
            width={32}
            height={32}
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
