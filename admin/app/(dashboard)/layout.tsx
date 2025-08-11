import Notification from "@/components/notification";
import SideNav from "@/components/sidenav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div className="flex ">
        <SideNav />
        <div className="grow">
          <Notification />
          <div className="content-container pt-[37px]">{children}</div>
        </div>
      </div>
    </div>
  );
}
