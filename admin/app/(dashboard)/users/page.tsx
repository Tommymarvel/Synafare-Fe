'use client';
import PageIntro from '@/components/page-intro';
import TopCards from '@/components/top-cards';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AllUsers from './components/allusers';
import VerificationRequests from './components/verification-requests';
import UserTableWrapper from './components/user.table.wrapper';
import { useState } from 'react';
import ConfirmVerifyUserModal from './components/modals/confirm-verify-user';
import ConfirmDeleteUser from './components/modals/confirm-delete-user';
import VerifiedUsersTable from './components/verified-users';
import { useUsers } from '@/hooks/useUsers';
import { ViewGuard } from '@/components/PermissionGuard';
const money = (
  <svg
    width="21"
    height="21"
    viewBox="0 0 21 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.58398 3.3H12.9082C13.9806 3.3 14.8139 3.55661 15.415 4.00215C16.0105 4.44359 16.4225 5.10291 16.6016 5.99825L16.6025 6.0002C16.6693 6.32666 16.7002 6.68411 16.7002 7.092V11.383C16.7002 12.6605 16.3388 13.5941 15.7256 14.2082C15.1125 14.8221 14.1811 15.1838 12.9082 15.1838H5.58398C5.18168 15.1838 4.81092 15.1443 4.48633 15.0705L4.46289 15.0656L4.44043 15.0627L4.32617 15.0422C4.20313 15.0158 4.05259 14.9707 3.88574 14.9074H3.88477C3.39559 14.7235 2.88061 14.412 2.48633 13.8811C2.09466 13.3536 1.79199 12.5686 1.79199 11.383V7.092C1.79199 5.82432 2.15473 4.89235 2.76953 4.27754C3.38434 3.66274 4.3163 3.3 5.58398 3.3ZM5.5918 3.5666C4.49414 3.56663 3.58224 3.83221 2.94922 4.46504C2.31615 5.0981 2.05078 6.0107 2.05078 7.1086V11.3996C2.05078 12.1997 2.19053 12.8961 2.5127 13.4621C2.84072 14.0383 3.3364 14.4421 3.97266 14.6838L3.98535 14.6887C4.16759 14.7524 4.34694 14.7997 4.52246 14.8303V14.8313C4.52927 14.8327 4.53616 14.8338 4.54297 14.8352V14.8342C4.88608 14.9051 5.22262 14.9416 5.5918 14.9416H12.917C14.0149 14.9416 14.9275 14.6762 15.5605 14.0432C16.1935 13.4101 16.459 12.4974 16.459 11.3996V7.1086C16.459 6.7356 16.4313 6.39131 16.3643 6.06563C16.2028 5.2613 15.8345 4.61393 15.2197 4.17793C14.6151 3.74917 13.8315 3.56661 12.917 3.5666H5.5918Z"
      fill="#FEBE04"
      stroke="#FEBE04"
    />
    <path
      d="M16.4834 5.91148L16.4912 5.91344L16.5 5.91441C17.3962 6.09739 18.0561 6.51244 18.498 7.10777C18.9437 7.70827 19.2002 8.53683 19.2002 9.59996V13.892C19.2001 15.1647 18.8387 16.0962 18.2256 16.7093C17.6124 17.3224 16.681 17.683 15.4082 17.683H8.08301C7.42002 17.6829 6.85061 17.5895 6.37988 17.4086L6.375 17.4066C5.32421 17.0134 4.63442 16.1954 4.39062 14.9691V14.9681C4.38158 14.9222 4.39827 14.8824 4.41797 14.8636L4.42383 14.8587L4.42871 14.8539C4.45152 14.8311 4.48824 14.8167 4.5332 14.8275V14.8285L4.5459 14.8304C4.85764 14.8966 5.2011 14.933 5.58301 14.933H12.9082C14.0061 14.933 14.9187 14.6676 15.5518 14.0345C16.1845 13.4015 16.4501 12.4895 16.4502 11.392V7.09996C16.4502 6.82011 16.4352 6.55667 16.3994 6.30504L16.3564 6.05699C16.3501 6.02035 16.3592 5.97904 16.3896 5.94273C16.4077 5.92541 16.4249 5.91662 16.4385 5.91246C16.452 5.9084 16.4667 5.90748 16.4834 5.91148ZM16.708 11.392C16.708 12.6594 16.3452 13.5907 15.7305 14.2054C15.1157 14.8202 14.1845 15.1829 12.917 15.183H4.58594L4.99512 15.9252C5.32222 16.518 5.81983 16.9382 6.47949 17.1781V17.1771C6.94923 17.3524 7.49347 17.433 8.0918 17.433H15.417C16.5147 17.4329 17.4266 17.1675 18.0596 16.5345C18.6925 15.9015 18.958 14.9897 18.958 13.892V9.59996C18.958 8.18086 18.5099 7.08977 17.4473 6.51109L16.708 6.10875V11.392Z"
      fill="#FEBE04"
      stroke="#FEBE04"
    />
    <path
      d="M9.25 6.92499C10.5321 6.92509 11.5752 7.96805 11.5752 9.25018C11.5751 10.5322 10.532 11.5753 9.25 11.5754C7.96787 11.5754 6.9249 10.5323 6.9248 9.25018C6.9248 7.96799 7.96781 6.92499 9.25 6.92499ZM9.25 7.17499C8.10719 7.17499 7.1748 8.10737 7.1748 9.25018C7.1749 10.3929 8.10725 11.3254 9.25 11.3254C10.3927 11.3253 11.3251 10.3928 11.3252 9.25018C11.3252 8.10744 10.3927 7.17509 9.25 7.17499Z"
      fill="#FEBE04"
      stroke="#FEBE04"
    />
    <path
      d="M4.4834 7.2917C4.51355 7.2917 4.54467 7.30414 4.57031 7.32979C4.59596 7.35543 4.6084 7.38655 4.6084 7.4167V11.0837C4.60824 11.1534 4.55282 11.2087 4.4834 11.2087C4.45331 11.2087 4.4221 11.1961 4.39648 11.1706C4.37093 11.1451 4.35848 11.1137 4.3584 11.0837V7.4167C4.3584 7.38655 4.37084 7.35543 4.39648 7.32979C4.42213 7.30414 4.45325 7.2917 4.4834 7.2917Z"
      fill="#FEBE04"
      stroke="#FEBE04"
    />
    <path
      d="M14.0083 11.7084C13.6666 11.7084 13.3833 11.4251 13.3833 11.0834V7.4167C13.3833 7.07504 13.6666 6.7917 14.0083 6.7917C14.35 6.7917 14.6333 7.07504 14.6333 7.4167V11.0834C14.6333 11.4251 14.3583 11.7084 14.0083 11.7084Z"
      fill="#FEBE04"
    />
  </svg>
);

const UsersPage = () => {
  const [showVerifyModal, setShowVerifyModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  // Fetch users data
  const {
    users,
    verificationRequests,
    verifiedUsers,
    totalUsers,
    verificationRequestsCount,
    verifiedUsersCount,
    loading,
    error,
    refresh,
  } = useUsers({
    limit: 20, // Adjust as needed
    revalidateOnFocus: false,
  });

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading users: {error.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <ViewGuard module="users">
      <ConfirmVerifyUserModal
        open={showVerifyModal}
        onOpenChange={setShowVerifyModal}
      />

      <ConfirmDeleteUser
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
      />

      <div className="space-y-5">
        <PageIntro>User Management</PageIntro>
        <div className="flex gap-x-[13px]">
          <TopCards
            iconbg="bg-[#FFF8E2]"
            title="Total Users"
            value={totalUsers || 0}
          >
            {money}
          </TopCards>

          <TopCards
            iconbg="bg-[#FFF8E2]"
            title="Verification Requests"
            value={verificationRequestsCount || 0}
          >
            {money}
          </TopCards>

          <TopCards
            iconbg="bg-[#FFF8E2]"
            title="Verified Users"
            value={verifiedUsersCount || 0}
          >
            {money}
          </TopCards>
          <div className="flex-1" />
        </div>
        <Tabs defaultValue="users" className="w-full space-y-5">
          <TabsList className="border-b border-b-gray-200 w-full rounded-none">
            <TabsTrigger className="p-4 cursor-pointer" value="users">
              All Users ({totalUsers || 0})
            </TabsTrigger>
            <TabsTrigger className="p-4 cursor-pointer" value="requests">
              Verification Requests ({verificationRequestsCount || 0})
            </TabsTrigger>
            <TabsTrigger className="p-4 cursor-pointer" value="verified">
              Verified Users ({verifiedUsersCount || 0})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="users">
            <UserTableWrapper>
              <AllUsers
                data={users}
                loading={loading}
                onUserUpdated={refresh}
              />
            </UserTableWrapper>
          </TabsContent>
          <TabsContent value="requests">
            <UserTableWrapper
              verify={true}
              openVerifyModalfunc={setShowVerifyModal}
              openDeleteModalfunc={setShowDeleteModal}
            >
              <VerificationRequests
                data={verificationRequests}
                loading={loading}
                onUserUpdated={refresh}
              />
            </UserTableWrapper>
          </TabsContent>
          <TabsContent value="verified">
            <UserTableWrapper>
              <VerifiedUsersTable
                data={verifiedUsers}
                loading={loading}
                onUserUpdated={refresh}
              />
            </UserTableWrapper>
          </TabsContent>
        </Tabs>
      </div>
    </ViewGuard>
  );
};

export default UsersPage;
