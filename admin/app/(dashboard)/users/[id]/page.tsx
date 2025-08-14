import CardWrapper from "@/components/cardWrapper";
import GoBack from "@/components/goback";
import Status from "@/components/status";
import { STATUSCONST } from "@/lib/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import OverviewComponents from "./components/overview..comp";
import UserTableWrapper from "../components/user.table.wrapper";
import UserLoanRequests from "./components/user.loan.requests";
import UserInventory from "./components/user.inventory";
import UserCustomer from "./components/user.customer";
import UserQuote from "./components/user.quote";

const UserDetail = () => {
  return (
    <div>
      <GoBack href="/loans" className="mt-5 mb-3" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="ms-auto font-medium w-fit px-6 cursor-pointer py-2 bg-mikado-yellow rounded-lg flex items-center gap-x-2">
            Chose Action
            <svg width="21" height="20" viewBox="0 0 21 20" fill="none">
              <path
                d="M10.5 14C9.91668 14 9.33335 13.775 8.89168 13.3334L3.45835 7.90003C3.21668 7.65837 3.21668 7.25837 3.45835 7.0167C3.70002 6.77503 4.10002 6.77503 4.34168 7.0167L9.77502 12.45C10.175 12.85 10.825 12.85 11.225 12.45L16.6583 7.0167C16.9 6.77503 17.3 6.77503 17.5417 7.0167C17.7833 7.25837 17.7833 7.65837 17.5417 7.90003L12.1083 13.3334C11.6667 13.775 11.0833 14 10.5 14Z"
                fill="#1D1C1D"
              />
            </svg>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white py-0 border-none w-[172px] px-0">
          <DropdownMenuItem className="border-b border-b-border-gray py-3 px-5 rounded-none">
            Verify User
          </DropdownMenuItem>
          <DropdownMenuItem className="border-b border-b-border-gray py-3 px-5 rounded-none">
            Decline
          </DropdownMenuItem>
          <DropdownMenuItem className="border-b border-b-border-gray py-3 px-5 rounded-none">
            Delete User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
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
            <UserLoanRequests data={[]} />
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
