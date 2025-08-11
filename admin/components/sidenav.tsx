import Image from "next/image";
import SideNavIcons from "./sidenavicons";
import NavLink from "./navLink";

const navs = [
  {
    name: "Dashboard",
    href: "/",
    icon: SideNavIcons.Dashboard,
  },
  {
    name: "Loans",
    href: "/loans",
    icon: SideNavIcons.Loan,
  },
  {
    name: "Users",
    href: "/users",
    icon: SideNavIcons.Users,
  },
  {
    name: "Inventory Management",
    href: "/inventory-management",
    icon: SideNavIcons.Inventory,
  },
  {
    name: "Marketplace",
    href: "/marketplace",
    icon: SideNavIcons.Market,
  },
  {
    name: "Wallet",
    href: "/wallet",
    icon: SideNavIcons.Wallet,
  },
];

const bottomNav = [
  {
    name: "Support",
    href: "/support",
    icon: SideNavIcons.Support,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: SideNavIcons.Settings,
  },
];
const SideNav = () => {
  return (
    <div className=" w-[272px] h-screen">
      <div className="bg-deep-green shrink-0 w-[272px] h-screen fixed top-0 left-0 ">
        <div className="ps-6 py-2 mt-[41px] mb-9">
          <Image src="./synafare-yellow.svg" alt="Logo" width={77} height={48.52} className="w-[77px]" />
        </div>
        <div className="space-y-3 px-2">
          <ul className="space-y-1">
            {navs.map((nav) => (
              <NavLink nav={nav} key={nav.name} />
            ))}
          </ul>
          <span className="bg-[#797979]/50 h-[1px] w-full block"></span>
          <ul className="space-y-1">
            {bottomNav.map((nav) => (
              <NavLink nav={nav} key={nav.name} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SideNav;
