"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLinkType = {
  name: string;
  href: string;
  icon: React.ReactNode;
};
const NavLink = ({ nav }: { nav: NavLinkType }) => {
  const pathname = usePathname();

  return (
    <li>
      <Link
        href={nav.href}
        className={`flex gap-x-3 items-center w-full rounded-sm py-3 px-4 border-l-[8px] text-sm cursor-pointer ${
          pathname == nav.href
            ? "bg-[#25433E] border-l-mikado-yellow text-mikado-yellow fill-mikado-yellow"
            : "text-white fill-white border-l-transparent hover:bg-[#25433E]/40"
        } `}
      >
        {nav.icon}
        {nav.name}
      </Link>
    </li>
  );
};

export default NavLink;
