'use client';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselApi,
} from "@/components/ui/carousel";
import Image from "next/image";
import { useEffect, useState } from "react";

interface ProductCarouselProps {
  urls: string[];
  activeIndex?: number;
  onSlideChange?: (index: number) => void;
}

const ProductCarousel = ({
  urls,
  activeIndex = 0,
  onSlideChange,
}: ProductCarouselProps) => {
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (api && activeIndex !== undefined) {
      api.scrollTo(activeIndex);
    }
  }, [api, activeIndex]);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      const currentIndex = api.selectedScrollSnap();
      onSlideChange?.(currentIndex);
    };

    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api, onSlideChange]);

  return (
    <Carousel setApi={setApi}>
      <CarouselContent className="w-full aspect-489/353 bg-black">
        {urls.map((src, i) => (
          <CarouselItem className="" key={i}>
            <Image
              src={src}
              className="w-full h-full object-cover object-center"
              alt="Product image"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="border-none" />
      <CarouselNext className="border-none" />
    </Carousel>
  );
};

export default ProductCarousel;
