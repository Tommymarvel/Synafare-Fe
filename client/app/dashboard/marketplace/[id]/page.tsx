'use client';

import CardWrapper from '@/app/components/cardWrapper';
import GoBack from '@/app/components/goback';
import ProductList from '@/app/components/marketplace/product-list';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ProductCarouselThumbNailIncluded from '@/app/components/marketplace/carousel-thumbnails';
import RequestQuoteWithQuantityModal from '../modal/RequestQuoteWithQuantityModal';
import { SuccessModal } from '../modal/SuccessModal';
import { useRFQ } from '@/context/RFQContext';
import { marketplaceApi, transformApiProduct } from '@/lib/marketplaceApi';
import { ProductListingType } from '@/types/marketplace.types';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function DashboardProductDetailPage({ params }: PageProps) {
  const [productId, setProductId] = useState<string>('');
  const [activeCarousel, setActiveCarousel] = useState<number>(0);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [product, setProduct] = useState<ProductListingType | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductListingType[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  const { addToRFQ, isInRFQ } = useRFQ();
  const router = useRouter();

  // Extract the id from async params
  useEffect(() => {
    const extractId = async () => {
      const { id } = await params;
      setProductId(id);
    };
    extractId();
  }, [params]);

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const apiProduct = await marketplaceApi.getProductById(productId);
        const transformedProduct = transformApiProduct(apiProduct);
        setProduct(transformedProduct);

        // Fetch related products from the same category
        const relatedResponse = await marketplaceApi.getProducts({
          category: [
            typeof apiProduct.product_category === 'object'
              ? apiProduct.product_category._id
              : apiProduct.product_category,
          ],
          limit: 4,
        });
        const transformedRelated = relatedResponse.data
          .filter((p) => p._id !== productId) // Exclude current product
          .slice(0, 4)
          .map(transformApiProduct);
        setRelatedProducts(transformedRelated);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg text-red-500">Product not found</div>
      </div>
    );
  }

  const productImages = product.images || [product.src];
  const isProductInRFQ = isInRFQ(product.id);

  const handleThumbnailClick = (index: number) => {
    setActiveCarousel(index);
  };

  const handleCarouselChange = (index: number) => {
    setActiveCarousel(index);
  };

  const handleRequestQuote = () => {
    setShowRequestModal(true);
  };

  const handleAddToRFQ = async () => {
    await addToRFQ(product.id, product.title, product.supplier_id);
  };

  const handleBuyNow = () => {
    // Navigate to the payment page for this product
    router.push(`/dashboard/marketplace/${product.id}/pay`);
  };

  const handleQuoteSuccess = () => {
    setShowSuccessModal(true);
  };

  const renderActionButtons = () => {
    if (product.nature_of_solar_business === 'distributor') {
      return (
        <div className="mt-4">
          <button
            onClick={handleBuyNow}
            className="w-full bg-mikado text-raisin font-medium py-3 px-6 rounded-lg hover:bg-mikado-yellow/90 transition-colors"
          >
            Buy Now
          </button>
        </div>
      );
    } else {
      // Supplier or installer - show vertical buttons
      return (
        <div className="mt-4 flex items-center justify-center gap-2 ">
          <button
            onClick={handleRequestQuote}
            className="w-full bg-mikado flex-1 text-raisin font-medium py-3 px-6 rounded-lg hover:bg-mikado-yellow/90 transition-colors"
          >
            Request Quote
          </button>
          {isProductInRFQ ? (
            <button
              disabled
              className="w-full flex-1 bg-gray-200 border border-raisin text-raisin font-medium py-3 px-6 rounded-lg cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Added to RFQ
            </button>
          ) : (
            <button
              onClick={handleAddToRFQ}
              className="w-full border flex-1 border-raisin bg-transparent hover:text-black  font-medium py-3 px-6 rounded-lg hover:bg-peach transition-colors"
            >
              Add to RFQ
            </button>
          )}
        </div>
      );
    }
  };

  return (
    <div className="pb-6">
      <div className="flex justify-between">
        <GoBack />

        <span
          className="bg-gray-4 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer"
          onClick={() => router.push('/dashboard/rfq')}
        >
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
                  {product.sku} | {product.category} | {product.brand}
                </span>
              </div>
              <div className="flex gap-x-2 items-center">
                <div className="relative w-5 h-5 rounded-full overflow-hidden">
                  <Image
                    src={product.supplier_profile}
                    alt="avatar"
                    fill
                    className="object-cover"
                  />
                </div>
                <a
                  href={`/dashboard/marketplace/store/${product.supplier_id}`}
                  className="text-mikado-yellow underline"
                >
                  {product.supplier_name}
                </a>
                | <span>Lagos</span>
              </div>
            </div>
            <div className="border-t-2 border-t-gray-4 pt-[13px] grow flex flex-col justify-between pb-2">
              <p className="text-xs/[24px]">
                {product.description ||
                  'High-quality solar energy product designed for optimal performance and reliability. Perfect for residential and commercial applications with advanced features and long-lasting durability.'}
              </p>

              <div className="mt-4">
                <h4 className="text-2xl font-semibold">
                  {product.price
                    ? `₦${product.price.toLocaleString()}`
                    : 'Price on Request'}
                </h4>
                {renderActionButtons()}
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-x-3 p-6">
          {productImages.map((imageUrl, i) => (
            <div
              key={i}
              className={`relative w-[57.61px] aspect-square cursor-pointer rounded-[3.39px] overflow-hidden ${
                activeCarousel === i ? 'border border-tertiary-1' : ''
              }`}
              onClick={() => handleThumbnailClick(i)}
            >
              <Image
                src={imageUrl}
                alt={`thumbnail of carousel ${i}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </CardWrapper>

      <div className="space-y-[24px]">
        <h2 className="font-semibold text-xl">Related Products</h2>

        <div className="grid grid-cols-4 gap-x-[15px]">
          {relatedProducts.map((relatedProduct) => (
            <ProductList key={relatedProduct.id} product={relatedProduct} />
          ))}
        </div>
      </div>

      {/* Modals */}
      {showRequestModal && (
        <RequestQuoteWithQuantityModal
          onClose={() => setShowRequestModal(false)}
          onSuccess={handleQuoteSuccess}
          productId={product.id}
          supplierId={product.supplier_id}
          productTitle={product.title}
        />
      )}

      {showSuccessModal && (
        <SuccessModal onClose={() => setShowSuccessModal(false)} />
      )}
    </div>
  );
}
