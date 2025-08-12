import Image from "next/image";
import SideNavIcons from "./sidenavicons";
import NavLink from "./navLink";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const navs = [
  {
    name: "Dashboard",
    href: "/",
    icon: SideNavIcons.Dashboard,
  },
  {
    name: "Loans",
    href: "#",
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

const loadSubNav = [
  {
    name: "Loan Requests",
    href: "/loan-requests",
  },
  {
    name: "All Loans",
    href: "/loans",
  },
];
const SideNav = () => {
  return (
    <div className=" w-[272px] h-screen">
      <div className="bg-deep-green shrink-0 w-[272px] h-screen fixed top-0 left-0 ">
        <div className="ps-6 py-2 mt-[41px] mb-9">
          <Image
            src="/synafare-yellow.svg"
            alt="Logo"
            width={77}
            height={48.52}
            className="w-[77px]"
          />
        </div>
        <div className="space-y-3 px-2">
          <ul className="space-y-1">
            <NavLink nav={navs[0]} />
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger className=" w-full rounded-sm py-3 px-4 border-l-[8px] border-l-transparent fill-white text-white text-sm cursor-pointer">
                  <div className="flex gap-x-3 items-center">
                    {navs[1].icon}
                    {navs[1].name}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <NavLink nav={loadSubNav[0]} className="ps-[47px]" />
                  <NavLink nav={loadSubNav[1]} className="ps-[47px]" />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <NavLink nav={navs[2]} />
            <NavLink nav={navs[3]} />
            <NavLink nav={navs[4]} />
            <NavLink nav={navs[5]} />
          </ul>
          <span className="bg-[#797979]/50 h-[1px] w-full block"></span>
          <ul className="space-y-1">
            <NavLink nav={navs[6]} />
            <NavLink nav={navs[7]} />
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SideNav;
