import CardWrapper from "@/components/cardWrapper";
import PageIntro from "@/components/page-intro";

const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <PageIntro>Settings</PageIntro>
      <CardWrapper className="p-0 flex rounded-lg">
        <ul className="w-[250px] shrink-0 border-r border-r-gray py-[42px] px-[13px]">
          <li>
            <a href="/settings" className="py-3 px-4 block">
              Profile
            </a>
          </li>
          <li>
            <a href="/settings/teams" className="py-3 px-4 block">
              Team Members
            </a>
          </li>
          <li>
            <a href="/settings/categories" className="py-3 px-4 block">
              Categories
            </a>
          </li>
        </ul>
        <div className="py-[42px] px-[36px] grow">{children}</div>
      </CardWrapper>
    </>
  );
};

export default SettingsLayout;
