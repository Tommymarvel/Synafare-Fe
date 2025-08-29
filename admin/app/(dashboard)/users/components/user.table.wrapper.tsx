'use client';

import CardWrapper from '@/components/cardWrapper';
// import { ManageGuard } from '@/components/PermissionGuard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import SearchInput from '@/components/search.input';

const UserTableWrapper = ({
  children,
  // verify = false,
  // openVerifyModalfunc = () => null,
  // openDeleteModalfunc = () => null,
}: {
  children: React.ReactNode;
  verify?: boolean;
  openVerifyModalfunc?: (x: boolean) => void;
  openDeleteModalfunc?: (x: boolean) => void;
}) => {
  return (
    <CardWrapper className="px-0 py-0 rounded-lg">
      <div className="flex justify-between px-6 py-3">
        <div className="flex gap-x-[10px] grow">
        {/* TODO: Ask dimeji if verify can handle multiple users at once */}
          {/* {verify && (
            <ManageGuard module="users">
              <button
                onClick={() => openVerifyModalfunc(true)}
                className="flex gap-x-2 px-3 py-[10px] font-medium bg-gray-4 rounded-md"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M9.99984 18.9582C5.05817 18.9582 1.0415 14.9415 1.0415 9.99984C1.0415 5.05817 5.05817 1.0415 9.99984 1.0415C14.9415 1.0415 18.9582 5.05817 18.9582 9.99984C18.9582 14.9415 14.9415 18.9582 9.99984 18.9582ZM9.99984 2.2915C5.74984 2.2915 2.2915 5.74984 2.2915 9.99984C2.2915 14.2498 5.74984 17.7082 9.99984 17.7082C14.2498 17.7082 17.7082 14.2498 17.7082 9.99984C17.7082 5.74984 14.2498 2.2915 9.99984 2.2915Z"
                    fill="#1D1C1D"
                  />
                  <path
                    d="M8.8167 12.9837C8.65003 12.9837 8.4917 12.917 8.37503 12.8003L6.0167 10.442C5.77503 10.2003 5.77503 9.80033 6.0167 9.55866C6.25837 9.31699 6.65837 9.31699 6.90003 9.55866L8.8167 11.4753L13.1 7.19199C13.3417 6.95033 13.7417 6.95033 13.9834 7.19199C14.225 7.43366 14.225 7.83366 13.9834 8.07533L9.25837 12.8003C9.1417 12.917 8.98337 12.9837 8.8167 12.9837Z"
                    fill="#1D1C1D"
                  />
                </svg>
                Verify
              </button>
              <button
                onClick={() => openDeleteModalfunc(true)}
                className="flex gap-x-2 px-3 py-[10px] font-medium bg-gray-4 rounded-md"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.5001 5.60839C17.4834 5.60839 17.4584 5.60839 17.4334 5.60839C13.0251 5.16673 8.62505 5.00006 4.26672 5.44173L2.56672 5.60839C2.21672 5.64173 1.90839 5.39173 1.87505 5.04173C1.84172 4.69173 2.09172 4.39173 2.43339 4.35839L4.13338 4.19173C8.56672 3.74173 13.0584 3.91673 17.5584 4.35839C17.9001 4.39173 18.1501 4.70006 18.1167 5.04173C18.0917 5.36673 17.8167 5.60839 17.5001 5.60839Z"
                    fill="#1D1C1D"
                  />
                  <path
                    d="M7.08314 4.7665C7.0498 4.7665 7.01647 4.7665 6.9748 4.75817C6.64147 4.69984 6.40814 4.37484 6.46647 4.0415L6.6498 2.94984C6.78314 2.14984 6.96647 1.0415 8.90814 1.0415H11.0915C13.0415 1.0415 13.2248 2.1915 13.3498 2.95817L13.5331 4.0415C13.5915 4.38317 13.3581 4.70817 13.0248 4.75817C12.6831 4.8165 12.3581 4.58317 12.3081 4.24984L12.1248 3.1665C12.0081 2.4415 11.9831 2.29984 11.0998 2.29984H8.91647C8.03314 2.29984 8.01647 2.4165 7.89147 3.15817L7.6998 4.2415C7.6498 4.54984 7.38314 4.7665 7.08314 4.7665Z"
                    fill="#1D1C1D"
                  />
                  <path
                    d="M12.675 18.9586H7.325C4.41666 18.9586 4.3 17.3503 4.20833 16.0503L3.66666 7.65864C3.64166 7.31697 3.90833 7.01697 4.25 6.99197C4.6 6.97531 4.89166 7.23364 4.91666 7.57531L5.45833 15.967C5.55 17.2336 5.58333 17.7086 7.325 17.7086H12.675C14.425 17.7086 14.4583 17.2336 14.5417 15.967L15.0833 7.57531C15.1083 7.23364 15.4083 6.97531 15.75 6.99197C16.0917 7.01697 16.3583 7.30864 16.3333 7.65864L15.7917 16.0503C15.7 17.3503 15.5833 18.9586 12.675 18.9586Z"
                    fill="#1D1C1D"
                  />
                  <path
                    d="M11.3834 14.375H8.6084C8.26673 14.375 7.9834 14.0917 7.9834 13.75C7.9834 13.4083 8.26673 13.125 8.6084 13.125H11.3834C11.7251 13.125 12.0084 13.4083 12.0084 13.75C12.0084 14.0917 11.7251 14.375 11.3834 14.375Z"
                    fill="#1D1C1D"
                  />
                  <path
                    d="M12.0832 11.0415H7.9165C7.57484 11.0415 7.2915 10.7582 7.2915 10.4165C7.2915 10.0748 7.57484 9.7915 7.9165 9.7915H12.0832C12.4248 9.7915 12.7082 10.0748 12.7082 10.4165C12.7082 10.7582 12.4248 11.0415 12.0832 11.0415Z"
                    fill="#1D1C1D"
                  />
                </svg>
                Delete
              </button>
            </ManageGuard>
          )} */}
          <div className="max-w-[334px] w-full">
            <SearchInput />
          </div>
        </div>

        <div className="gap-x-[10px] flex">
          <Select>
            <SelectTrigger className="border p-3 border-border-gray rounded-md ">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dark">Pending</SelectItem>
              <SelectItem value="system">Successful</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="border p-3 border-border-gray rounded-md ">
              <SelectValue placeholder="Select Date Range" />
            </SelectTrigger>
            <SelectContent></SelectContent>
          </Select>
        </div>
      </div>
      {children}
    </CardWrapper>
  );
};

export default UserTableWrapper;
