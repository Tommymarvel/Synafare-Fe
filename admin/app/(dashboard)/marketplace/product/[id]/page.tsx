'use client';
import CardWrapper from '@/components/cardWrapper';
import GoBack from '@/components/goback';
import ProductList from '../../components/product-list';
import { useState } from 'react';
import ProductCarouselThumbNailIncluded from '../../components/carousel-thumbnails';
import Image from 'next/image';
import { useMarketplaceItem } from '@/hooks/useMarketplace';
import { useParams } from 'next/navigation';

const MPProductDetails = () => {
  const [activeCarousel, setActiveCarousel] = useState<number>(0);
  const { id } = useParams<{ id: string }>();
  const { item, related, isLoading } = useMarketplaceItem(id);

  // Show loading or empty state if no product
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Product not found
      </div>
    );
  }

  const product = item;

  // Use product images from API or fallback to default
  const productImages: string[] = product.src
    ? [product.src]
    : ['/carousel-1.png', '/carousel-2.png'];

  const handleThumbnailClick = (index: number) => {
    setActiveCarousel(index);
  };

  const handleCarouselChange = (index: number) => {
    setActiveCarousel(index);
  };
  return (
    <div className="pb-6 ">
      <div className="flex justify-between">
        <GoBack />

        <span className="bg-gray-4 rounded-full w-10 h-10 flex items-center justify-center">
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
      <CardWrapper className="p-0 mt-[10px] mb-6">
        <div className="grid grid-cols-2 px-4 gap-x-4">
          <div className="py-4 space-y-6">
            <ProductCarouselThumbNailIncluded
              urls={productImages}
              activeIndex={activeCarousel}
              onSlideChange={handleCarouselChange}
            />
          </div>

          <div className="border-l border-l-gray-100 p-4 flex flex-col">
            <div className="space-y-6 pb-[6px]">
              <div>
                <h1 className="text-[28px] font-semibold">{product.title}</h1>
                <span className="text-gray-3 text-xs">
                  {product.id} | {product.category} | {product.supplier_name}
                </span>
              </div>
              <div className="flex gap-x-2 items-center">
                <Image
                  src={product.supplier_profile}
                  className="w-5 h-5 rounded-full inline-block "
                  alt="avatar"
                  width={20}
                  height={20}
                />
                <a
                  href={`/marketplace/store/${product.supplier_id}`}
                  className="text-mikado-yellow underline"
                >
                  {product.supplier_name}
                </a>
                | <span>Lagos</span>
              </div>
            </div>
            <div className="border-t-2 border-t-gray-4 pt-[13px] grow  flex flex-col justify-between pb-2">
              <p className="text-xs/[24px]">
                {product.description || 'No description available'}
              </p>

              <h4 className="text-2xl font-semibold">
                {product.price
                  ? `₦${product.price.toLocaleString()}`
                  : 'Price not available'}
              </h4>
            </div>
          </div>
        </div>
        <div className="flex gap-x-3 p-6">
          {productImages.map((p, i) => (
            <Image
              src={p}
              key={i}
              className={`w-[57.61px] aspect-square cursor-pointer object-cover block rounded-[3.39px] ${
                activeCarousel == i ? 'border border-tertiary-1' : ''
              }`}
              alt={'thumb nail of carousel ' + i}
              width={58}
              height={58}
              onClick={() => handleThumbnailClick(i)}
            />
          ))}
        </div>
      </CardWrapper>

      <div className="space-y-[24px]">
        <h2 className="font-semibold text-xl">Related Products</h2>

        <div className="grid grid-cols-4 gap-x-[15px]">
          {related.map((relatedProduct) => (
            <ProductList key={relatedProduct.id} product={relatedProduct} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MPProductDetails;
