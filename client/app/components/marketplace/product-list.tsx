'use client'

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ProductListingType } from '@/types/marketplace.types';

const ProductList = ({ product }: { product: ProductListingType }) => {
  const router = useRouter();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') router.push(product.url);
  };

  return (
    <div
      className="border-[1.17px] border-gray rounded-md cursor-pointer"
      role="link"
      tabIndex={0}
      onClick={() => router.push(product.url)}
      onKeyDown={handleKeyDown}
    >
      <div className="relative w-full aspect-video">
        <Image src={product.src} alt={product.title} fill className="object-cover" />
      </div>
      <div className="bg-white py-3 px-[18px] space-y-[6px]">
        <span className="text-mikado-yellow text-xs">{product.category}</span>
        <a href={product.url} className="font-semibold block">
          {product.title}
        </a>
        <a
          href={'/dashboard/marketplace/store/' + product.supplier_id}
          className="flex gap-x-[6px] hover:underline items-cent"
          onClick={(e) => e.stopPropagation()} // prevent card click when clicking supplier
        >
          <div className="relative w-5 h-5 rounded-full overflow-hidden">
            <Image
              src={product.supplier_profile}
              alt="avatar"
              fill
              className="object-cover"
            />
          </div>
          <p className="text-gray-3 text-xs">{product.supplier_name}</p>
        </a>
      </div>
    </div>
  );
};

export default ProductList;
