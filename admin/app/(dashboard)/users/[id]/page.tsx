'use client';
import CardWrapper from '@/components/cardWrapper';
import GoBack from '@/components/goback';
import Status from '@/components/status';
import { STATUSCONST } from '@/lib/constants';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OverviewComponents from './components/overview..comp';
import UserTableWrapper from '../components/user.table.wrapper';
import UserLoanRequests from './components/user.loan.requests';
import UserCustomer from './components/user.customer';
import UserQuote from './components/user.quote';
import ChooseAction from './components/choose.action';
// import { QuotesData } from '@/data/users.table';
import InstallerInventory from './components/inventory/installer.inventory';
import DistributorInventory from './components/inventory/distributor.inventory';
import { useUser } from '@/hooks/useUsers';
import { useUserLoans } from '@/hooks/useUserLoans';
import { useUserInventory } from '@/hooks/useUserInventory';
import { useUserCustomers } from '@/hooks/useUserCustomers';
import { useUserQuotes } from '@/hooks/useUserQuotes';
import { useParams } from 'next/navigation';
import UserInvoice from './components/user.invoices';
import { useUserInvoices } from '@/hooks/useUserInvoices';

const UserDetail = () => {
  const params = useParams();
  const userId = params?.id as string;
  const { user } = useUser(userId);
  const { loans } = useUserLoans(userId);
  const { inventory, catalogue } = useUserInventory(userId);
  const { customers } = useUserCustomers(userId);
  const { quotes } = useUserQuotes(userId);
  const { invoices } = useUserInvoices(userId);

  const safe = (val?: unknown) =>
    val === undefined || val === null || val === '' ? '---' : String(val);

  return (
    <div>
      <GoBack className="mt-5 mb-3" />

      <ChooseAction
        status={
          user
            ? user.account_status === 'active' ||
              user.account_status === 'verified'
              ? STATUSCONST.VERIFIED
              : STATUSCONST.PENDINGVERIFICATION
            : STATUSCONST.PENDINGVERIFICATION
        }
        userId={userId}
        firebaseUid={user?.firebaseUid}
      />

      <CardWrapper className="p-[26px] flex items-center my-5">
        <div className="gap-x-4 flex shrink-0">
          <div className="text-[30px] font-medium text-gray-3 w-[72px] h-[72px] rounded-full bg-gray-4 flex items-center justify-center">
            {safe(user?.first_name?.charAt(0) ?? user?.email?.charAt(0))}
          </div>
          <div>
            <div className="flex gap-x-3 items-center">
              <h2 className="font-medium text-xl">
                {safe(`${user?.first_name || ''} ${user?.last_name || ''}`) ===
                '---'
                  ? safe(user?.email)
                  : `${safe(user?.first_name)} ${safe(user?.last_name)}`}
              </h2>
              <Status
                status={
                  user
                    ? user.account_status === 'active' ||
                      user.account_status === 'verified'
                      ? STATUSCONST.VERIFIED
                      : STATUSCONST.PENDINGVERIFICATION
                    : STATUSCONST.PENDINGVERIFICATION
                }
              />
            </div>
            <div>
              <p className="text-[#E2A109] font-medium">{safe(user?.role)}</p>
              <p className="text-gray-3">
                Customer since:{' '}
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : '---'}
              </p>
            </div>
          </div>
        </div>
        <div className="grow flex justify-around">
          <div className="space-y-[11px]">
            <p className="text-xs text-gray-3">Email Address</p>
            <p className="text-[16px]">{safe(user?.email)}</p>
          </div>
          <div className="space-y-[11px]">
            <p className="text-xs text-gray-3">Phone Number</p>
            <p className="text-[16px]">{safe(user?.phn_no)}</p>
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
          <TabsTrigger className="p-4 cursor-pointer" value="invoices">
            Invoices
          </TabsTrigger>

          <TabsTrigger className="p-4 cursor-pointer" value="quotes">
            Quotes
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <OverviewComponents user={user} />
        </TabsContent>
        <TabsContent value="requests">
          <UserTableWrapper>
            <UserLoanRequests data={loans} />
          </UserTableWrapper>
        </TabsContent>
        <TabsContent value="inventory">
          {/* condition check if the user is an installer else render distributor (same for supplier) */}
          {user?.role?.toLowerCase() === 'installer' ? (
            <InstallerInventory data={catalogue} />
          ) : (
            <DistributorInventory
              catalogueData={catalogue}
              inventoryData={inventory}
              ownerUserId={userId}
            />
          )}
        </TabsContent>
        <TabsContent value="customers">
          <UserCustomer data={customers} ownerUserId={userId} />
        </TabsContent>
        <TabsContent value="invoices">
          <UserTableWrapper>
            {' '}
            <UserInvoice data={invoices} userId={userId} />
          </UserTableWrapper>
        </TabsContent>
        <TabsContent value="quotes">
          <UserQuote data={quotes} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDetail;
