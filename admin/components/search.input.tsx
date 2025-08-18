import Image from "next/image";

const SearchInput = () => {
  return (
    <div className="relative w-full">
      <input
        type="search"
        placeholder="Search"
        className="w-full ps-4 peer border border-border-gray rounded-[16px] text-[16px]/[24px] placeholder:ps-[26px] py-2  focus:placeholder-transparent "
        name=""
        id=""
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
