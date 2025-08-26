'use client';
import CardWrapper from '@/app/components/cardWrapper';
import PageIntro from '@/app/components/page-intro';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
  const path = usePathname();
  if (path.startsWith('/dashboard/settings/teams/new')) {
    return <>{children}</>;
  }
  const activeClass = 'text-[#E2A109] bg-[#FFF8E2]';
  const isActive = (href: string) =>
    href === '/dashboard/settings'
      ? path === '/dashboard/settings'
      : path.startsWith(href);

  return (
    <>
      <PageIntro>Settings</PageIntro>
      <CardWrapper className="p-0 flex rounded-lg">
        <ul className="w-[250px] shrink-0 border-r border-r-gray py-[42px] px-[13px]">
          <li>
            <Link
              href="/dashboard/settings"
              className={`py-3 px-4 block rounded-md hover:bg-gray-50 ${
                isActive('/dashboard/settings') ? activeClass : ''
              }`}
            >
              My Profile
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/settings/business"
              className={`py-3 px-4 block rounded-md hover:bg-gray-50 ${
                isActive('/dashboard/settings/business') ? activeClass : ''
              }`}
            >
              Business Information
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/settings/bank"
              className={`py-3 px-4 block rounded-md hover:bg-gray-50 ${
                isActive('/dashboard/settings/bank') ? activeClass : ''
              }`}
            >
              Bank Information
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/settings/referrals"
              className={`py-3 px-4 block rounded-md hover:bg-gray-50 ${
                isActive('/dashboard/settings/referrals') ? activeClass : ''
              }`}
            >
              Referrals
            </Link>
          </li>
        </ul>
        <div className="py-[42px] px-[36px] grow">{children}</div>
      </CardWrapper>
    </>
  );
};

export default SettingsLayout;
