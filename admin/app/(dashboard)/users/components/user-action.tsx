"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { STATUSCONST } from "@/lib/constants";
import { UserStatus } from "@/types/usertypes";

type booleanSetFunc = (x: boolean) => void;
const nullfunc = () => null;

const UserActionButton = ({
  id,
  status,
  openDeclineModal = nullfunc,
  openVerifyModal = nullfunc,
  openDeleteModal = nullfunc,
}: {
  id: string;
  status: UserStatus;
  openDeclineModal?: booleanSetFunc;
  openVerifyModal?: booleanSetFunc;
  openDeleteModal?: booleanSetFunc;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="cursor-pointer">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M9.99984 10.8333C10.4601 10.8333 10.8332 10.4602 10.8332 10C10.8332 9.53977 10.4601 9.16668 9.99984 9.16668C9.5396 9.16668 9.1665 9.53977 9.1665 10C9.1665 10.4602 9.5396 10.8333 9.99984 10.8333Z"
              stroke="#98A2B3"
              strokeWidth="1.66667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9.99984 5.00001C10.4601 5.00001 10.8332 4.62691 10.8332 4.16668C10.8332 3.70644 10.4601 3.33334 9.99984 3.33334C9.5396 3.33334 9.1665 3.70644 9.1665 4.16668C9.1665 4.62691 9.5396 5.00001 9.99984 5.00001Z"
              stroke="#98A2B3"
              strokeWidth="1.66667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9.99984 16.6667C10.4601 16.6667 10.8332 16.2936 10.8332 15.8333C10.8332 15.3731 10.4601 15 9.99984 15C9.5396 15 9.1665 15.3731 9.1665 15.8333C9.1665 16.2936 9.5396 16.6667 9.99984 16.6667Z"
              stroke="#98A2B3"
              strokeWidth="1.66667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white py-0 border-none px-0">
        <DropdownMenuItem className="border-b border-b-border-gray py-3 px-5 rounded-none">
          <a href={"/users/" + id}>View User</a>
        </DropdownMenuItem>
        {status == STATUSCONST.PENDINGVERIFICATION && (
          <>
            <DropdownMenuItem
              onClick={() => openVerifyModal(true)}
              className="border-b border-b-border-gray py-3 px-5 rounded-none"
            >
              Verify User
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => openDeclineModal(true)}
              className="border-b border-b-border-gray py-3 px-5 rounded-none"
            >
              Decline
            </DropdownMenuItem>
          </>
        )}
        {status == STATUSCONST.VERIFIED && (
          <>
            <DropdownMenuItem className="border-b border-b-border-gray py-3 px-5 rounded-none">
              Login as User
            </DropdownMenuItem>
            <DropdownMenuItem className="border-b border-b-border-gray py-3 px-5 rounded-none">
              Account Config.
            </DropdownMenuItem>
            <DropdownMenuItem className="border-b border-b-border-gray py-3 px-5 rounded-none">
              Block User
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuItem
          onClick={() => openDeleteModal(true)}
          className="border-b border-b-border-gray py-3 px-5 rounded-none"
        >
          Delete User
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserActionButton;
