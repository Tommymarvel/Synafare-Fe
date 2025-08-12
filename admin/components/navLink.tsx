"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLinkType = {
  name: string;
  href: string;
  icon?: React.ReactNode;
};
const NavLink = ({
  nav,
  className,
}: {
  nav: NavLinkType;
  className?: string;
}) => {
  const pathname = usePathname();

  return (
    <li>
      <Link
        href={nav.href}
        className={cn(
          `flex gap-x-3 items-center w-full rounded-sm py-3 px-4 border-l-[8px] text-sm cursor-pointer ${
            pathname == nav.href
              ? "bg-[#25433E] border-l-mikado-yellow text-mikado-yellow fill-mikado-yellow"
              : "text-white fill-white border-l-transparent hover:bg-[#25433E]/40"
          } `,
          className
        )}
      >
        {nav.icon}
        {nav.name}
      </Link>
    </li>
  );
};

export default NavLink;
