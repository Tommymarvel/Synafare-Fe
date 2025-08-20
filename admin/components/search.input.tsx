import { cn } from "@/lib/utils";
import Image from "next/image";
import { InputHTMLAttributes } from "react";

interface SearchInputType extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}
const SearchInput = ({ className, ...props }: SearchInputType) => {
  return (
    <div className="relative w-full">
      <input
        type="search"
        placeholder="Search"
        className={cn(
          "w-full ps-4 peer border border-border-gray rounded-[16px] text-[16px]/[24px] placeholder:ps-[26px] py-2  focus:placeholder-transparent ",
          className
        )}
        name=""
        {...props}
      />
      <Image
        className="absolute peer-focus:hidden transition-all left-[14px] top-1/2 -translate-y-1/2"
        src="/search-icon.svg"
        alt="search icon"
        width={20}
        height={20}
      />
    </div>
  );
};

export default SearchInput;
