'use client';
import CardWrapper from '@/app/components/cardWrapper';
import PageIntro from '@/app/components/page-intro';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
  const path = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (path.startsWith('/dashboard/settings/teams/new')) {
    return <>{children}</>;
  }

  const activeClass = 'text-[#E2A109] bg-[#FFF8E2]';
  const isActive = (href: string) =>
    href === '/dashboard/settings'
      ? path === '/dashboard/settings'
      : path.startsWith(href);

  const settingsItems = [
    { href: '/dashboard/settings', label: 'My Profile' },
    { href: '/dashboard/settings/business', label: 'Business Information' },
    { href: '/dashboard/settings/bank', label: 'Bank Information' },
    { href: '/dashboard/settings/referrals', label: 'Referrals' },
  ];

  const currentPage = settingsItems.find((item) => isActive(item.href));

  return (
    <>
      <PageIntro>Settings</PageIntro>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Mobile Settings Navigation */}
        <div className="mb-4">
          <div className="relative">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
              <span className="font-medium text-gray-900">
                {currentPage?.label || 'Settings'}
              </span>
              <ChevronDown
                className={`h-5 w-5 text-gray-400 transition-transform ${
                  mobileMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {mobileMenuOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                {settingsItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between p-4 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                      isActive(item.href)
                        ? 'bg-orange-50 text-orange-600'
                        : 'text-gray-900'
                    }`}
                  >
                    <span className="font-medium">{item.label}</span>
                    {isActive(item.href) && (
                      <div className="w-2 h-2 bg-orange-600 rounded-full" />
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <CardWrapper className="p-6">{children}</CardWrapper>
      </div>

      {/* Desktop Layout */}
      <CardWrapper className="hidden lg:flex p-0 rounded-lg">
        <ul className="w-[250px] shrink-0 border-r border-r-gray py-[42px] px-[13px]">
          {settingsItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`py-3 px-4 block rounded-md hover:bg-gray-50 ${
                  isActive(item.href) ? activeClass : ''
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="py-[42px] px-[36px] grow">{children}</div>
      </CardWrapper>
    </>
  );
};

export default SettingsLayout;
