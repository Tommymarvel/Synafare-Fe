import CardWrapper from "@/components/cardWrapper";
import GoBack from "@/components/goback";
import Status from "@/components/status";
import { STATUSCONST } from "@/lib/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OverviewComponents from "./components/overview..comp";
import UserTableWrapper from "../components/user.table.wrapper";
import UserLoanRequests from "./components/user.loan.requests";
import UserInventory from "./components/user.inventory";
import UserCustomer from "./components/user.customer";
import UserQuote from "./components/user.quote";
import ChooseAction from "./components/choose.action";
import { UserLoanRecordsData } from "@/data/users.table";

const UserDetail = () => {
  return (
    <div>
      <GoBack href="/loans" className="mt-5 mb-3" />

      <ChooseAction status="Pending Verification" />

      <CardWrapper className="p-[26px] flex items-center my-5">
        <div className="gap-x-4 flex shrink-0">
          <div className="text-[30px] font-medium text-gray-3 w-[72px] h-[72px] rounded-full bg-gray-4 flex items-center justify-center">
            M
          </div>
          <div>
            <div className="flex gap-x-3 items-center">
              <h2 className="font-medium text-xl">David Smith</h2>
              <Status status={STATUSCONST.PENDINGVERIFICATION} />
            </div>
            <div>
              <p className="text-[#E2A109] font-medium">Installer</p>
              <p className="text-gray-3">Customer since: January 06, 2025</p>
            </div>
          </div>
        </div>
        <div className="grow flex justify-around">
          <div className="space-y-[11px]">
            <p className="text-xs text-gray-3">Email Address</p>
            <p className="text-[16px]">jon_doe2345@gmail.com</p>
          </div>
          <div className="space-y-[11px]">
            <p className="text-xs text-gray-3">Phone Number</p>
            <p className="text-[16px]">+2348123456789</p>
          </div>
        </div>
      </CardWrapper>
      <Tabs defaultValue="overview" className="w-full space-y-5">
        <TabsList className="border-b border-b-gray-200 w-full rounded-none">
          <TabsTrigger className="p-4 cursor-pointer" value="overview">
            Overview
          </TabsTrigger>
          <TabsTrigger className="p-4 cursor-pointer" value="requests">
            Loan Requests
          </TabsTrigger>
          <TabsTrigger className="p-4 cursor-pointer" value="inventory">
            Inventory
          </TabsTrigger>
          <TabsTrigger className="p-4 cursor-pointer" value="customers">
            Customers
          </TabsTrigger>
          <TabsTrigger className="p-4 cursor-pointer" value="quotes">
            Quotes
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <OverviewComponents />
        </TabsContent>
        <TabsContent value="requests">
          <UserTableWrapper>
            <UserLoanRequests data={UserLoanRecordsData} />
          </UserTableWrapper>
        </TabsContent>
        <TabsContent value="inventory">
          <UserInventory data={[]} />
        </TabsContent>
        <TabsContent value="customers">
          <UserCustomer data={[]} />
        </TabsContent>
        <TabsContent value="quotes">
          <UserQuote data={[]} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDetail;
