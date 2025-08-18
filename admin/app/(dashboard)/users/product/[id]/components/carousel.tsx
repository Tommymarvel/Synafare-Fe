import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const ProductCarousel = ({ urls }: { urls: string[] }) => {
  return (
    <Carousel>
      <CarouselContent className="w-full aspect-[489/353] bg-black">
        {urls.map((src, i) => (
          <CarouselItem className="" key={i}>
            <img
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
