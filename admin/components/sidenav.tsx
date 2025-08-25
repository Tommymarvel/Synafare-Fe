'use client';

import Image from 'next/image';
import SideNavIcons from './sidenavicons';
import NavLink from './navLink';
import { PermissionGuard } from './PermissionGuard';
import { usePermissions } from '@/hooks/usePermissions';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const navs = [
  {
    name: 'Dashboard',
    href: '/',
    icon: SideNavIcons.Dashboard,
    permission: null, // Dashboard accessible to all authenticated users
  },
  {
    name: 'Loans',
    href: '#',
    icon: SideNavIcons.Loan,
    permission: { module: 'loans' as const, action: 'view' as const },
  },
  {
    name: 'Users',
    href: '/users',
    icon: SideNavIcons.Users,
    startsWith: true,
    permission: { module: 'users' as const, action: 'view' as const },
  },
  {
    name: 'Inventory Management',
    href: '/inventory-management',
    icon: SideNavIcons.Inventory,
    permission: { module: 'marketplace' as const, action: 'view' as const },
  },
  {
    name: 'Marketplace',
    href: '/marketplace',
    icon: SideNavIcons.Market,
    startsWith: true,
    permission: { module: 'marketplace' as const, action: 'view' as const },
  },
  {
    name: 'Wallet',
    href: '/wallet',
    icon: SideNavIcons.Wallet,
    permission: { module: 'transactions' as const, action: 'view' as const },
  },
  {
    name: 'Support',
    href: '/support',
    icon: SideNavIcons.Support,
    permission: null, // Support accessible to all
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: SideNavIcons.Settings,
    startsWith: true,
    permission: { module: 'team_members' as const, action: 'view' as const },
  },
];

const loadSubNav = [
  {
    name: 'Loan Requests',
    href: '/loan-requests',
    startsWith: true,
    permission: { module: 'loans' as const, action: 'view' as const },
  },
  {
    name: 'All Loans',
    href: '/loans',
    permission: { module: 'loans' as const, action: 'view' as const },
  },
];
const SideNav = () => {
  const { checkPermission } = usePermissions();

  const renderNavItem = (nav: (typeof navs)[0]) => {
    if (!nav.permission) {
      return <NavLink key={nav.name} nav={nav} />;
    }

    return (
      <PermissionGuard
        key={nav.name}
        module={nav.permission.module}
        action={nav.permission.action}
      >
        <NavLink nav={nav} />
      </PermissionGuard>
    );
  };

  const renderSubNavItem = (
    nav: (typeof loadSubNav)[0],
    className?: string
  ) => {
    if (!nav.permission) {
      return <NavLink key={nav.name} nav={nav} className={className} />;
    }

    return (
      <PermissionGuard
        key={nav.name}
        module={nav.permission.module}
        action={nav.permission.action}
      >
        <NavLink nav={nav} className={className} />
      </PermissionGuard>
    );
  };

  // Check if user has permission to view any loan-related features
  const canViewLoans = checkPermission('loans', 'view');

  return (
    <div className=" h-screen bg-deep-green">
      <div className="bg-deep-green z-10 shrink-0 h-screen fixed top-0 left-0 ">
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
            {renderNavItem(navs[0])}
            {canViewLoans && (
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger className=" w-full rounded-xs py-3 px-4 border-l-8 border-l-transparent fill-white text-white text-sm cursor-pointer">
                    <div className="flex gap-x-3 items-center">
                      {navs[1].icon}
                      {navs[1].name}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {renderSubNavItem(loadSubNav[0], 'ps-[47px]')}
                    {renderSubNavItem(loadSubNav[1], 'ps-[47px]')}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
            {renderNavItem(navs[2])}
            {renderNavItem(navs[3])}
            {renderNavItem(navs[4])}
            {renderNavItem(navs[5])}
          </ul>
          <span className="bg-[#797979]/50 h-px w-full block"></span>
          <ul className="space-y-1">
            {renderNavItem(navs[6])}
            {renderNavItem(navs[7])}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SideNav;
