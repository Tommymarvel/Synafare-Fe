// app/dashboard/components/Sidebar.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import homeSrc from '@/app/assets/home.svg';
import walletSrc from '@/app/assets/wallet.svg';
import loansSrc from '@/app/assets/loans.svg';
import inventorySrc from '@/app/assets/inventory.svg';
import marketplaceSrc from '@/app/assets/marketplace.svg';
import quoteSrc from '@/app/assets/quote.svg';
import invoiceSrc from '@/app/assets/invoice.svg';
import customerSrc from '@/app/assets/customer.svg';
import {  XIcon } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', src: homeSrc },
  { label: 'Wallet', href: '/dashboard/wallet', src: walletSrc },
  { label: 'Loans', href: '/dashboard/loans', src: loansSrc },
  { label: 'Inventory', href: '/dashboard/inventory', src: inventorySrc },
  { label: 'Marketplace', href: '/dashboard/marketplace', src: marketplaceSrc },
  { label: 'Quote Requests', href: '/dashboard/quote-requests', src: quoteSrc },
  { label: 'Invoices', href: '/dashboard/invoices', src: invoiceSrc },
  { label: 'Customers', href: '/dashboard/customers/', src: customerSrc },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({  onClose }) => {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col p-4 space-y-1 bg-raisin h-full">
      <div className="flex justify-between items-center px-6 py-2">
        <Image
          src="/synafare-yellow.svg"
          alt="Synafare Logo"
          width={77}
          height={48}
          className="mb-4"
        />
        <span onClick={onClose} className='flex md:hidden'>
          <XIcon className='text-mikado'/>
        </span>
      </div>
      <div className="mt-9 flex flex-col space-y-1">
        {navItems.map(({ label, href, src }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-3 rounded-[4px] text-sm font-medium ${
                isActive
                  ? 'bg-[#393939] text-mikado border-l-[6px] border-mikado'
                  : 'text-white hover:bg-peach border-l-[6px] border-transparent'
              }`}
            >
              <div
                className={` w-5 h-5 ${isActive ? 'bg-mikado' : 'bg-white'}`}
                style={{
                  mask: `url(${src.src}) no-repeat center / contain`,
                  WebkitMask: `url(${src.src}) no-repeat center / contain`,
                }}
              />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Sidebar;
