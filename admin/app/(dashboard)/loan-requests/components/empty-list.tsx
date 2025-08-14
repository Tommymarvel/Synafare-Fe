import Image from "next/image";

const EmptyList = ({
  title,
  message,
  src,
}: {
  title: string;
  message: string;
  src: string;
}) => {
  return (
    <div className="flex items-center justify-center h-[50vh]">
      <div className="space-y-5">
        <Image
          src={src}
          alt={title}
          width={162}
          height={180}
          className="w-[161px] block mx-auto"
        />
        <div className="text-center space-y-2">
          <h1 className="text-lg font-medium text-resin-black">{title}</h1>
          <p className="text-gray-3">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default EmptyList;
