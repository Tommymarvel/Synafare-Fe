'use client';
import CardWrapper from '@/app/components/cardWrapper';
import PageIntro from '@/app/components/page-intro';
import { usePathname } from 'next/navigation';

const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
  const path = usePathname();
  if (path.startsWith('/dashboard/settings/teams/new')) {
    return <>{children}</>;
  }
  const activeClass = 'text-[#E2A109] bg-[#FFF8E2]';
  return (
    <>
      <PageIntro>Settings</PageIntro>
      <CardWrapper className="p-0 flex rounded-lg">
        <ul className="w-[250px] shrink-0 border-r border-r-gray py-[42px] px-[13px]">
          <li>
            <a
              href="/dashboard/settings"
              className={
                'py-3 px-4 block ' +
                (path == '/dashboard/settings' ? activeClass : '')
              }
            >
              Profile
            </a>
          </li>
        </ul>
        <div className="py-[42px] px-[36px] grow">{children}</div>
      </CardWrapper>
    </>
  );
};

export default SettingsLayout;
