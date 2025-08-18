"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { STATUSCONST } from "@/lib/constants";
import { UserStatus } from "@/types/usertypes";
import ConfirmBlockUser from "../../components/modals/block-user";
import { useState } from "react";
import ConfirmDeclineUser from "../../components/modals/confirm-decline-user";
import ConfirmDeleteUser from "../../components/modals/confirm-delete-user";
import ConfirmVerifyUserModal from "../../components/modals/confirm-verify-user";
import DeclineUserModal from "../../components/modals/decline-user";

const ChooseAction = ({ status }: { status: UserStatus }) => {
  const [showBlockUser, setShowBlockUser] = useState(false);
  const [showDeclineUser, setShowDeclineUser] = useState(false);
  const [showDeleteUser, setShowDeleteUser] = useState(false);
  const [showVerifyUser, setShowVerifyUser] = useState(false);
  const [showDecline, setShowDecline] = useState(false);
  return (
    <>
      <ConfirmBlockUser open={showBlockUser} onOpenChange={setShowBlockUser} />
      <ConfirmDeclineUser
        open={showDeclineUser}
        onOpenChange={setShowDeclineUser}
      />
      <ConfirmDeleteUser
        open={showDeleteUser}
        onOpenChange={setShowDeleteUser}
      />
      <ConfirmVerifyUserModal
        open={showVerifyUser}
        onOpenChange={setShowVerifyUser}
      />
      <DeclineUserModal open={showDecline} onOpenChange={setShowDecline} />

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
          {status == STATUSCONST.PENDINGVERIFICATION && (
            <>
              <DropdownMenuItem
                onClick={() => setShowVerifyUser(true)}
                className="border-b border-b-border-gray py-3 px-5 rounded-none"
              >
                Verify User
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setShowDecline(true)}
                className="border-b border-b-border-gray py-3 px-5 rounded-none"
              >
                Decline
              </DropdownMenuItem>
            </>
          )}
          {status == STATUSCONST.VERIFIED && (
            <>
              <DropdownMenuItem className="border-b border-b-border-gray py-3 px-5 rounded-none">
                Edit User
              </DropdownMenuItem>
              <DropdownMenuItem className="border-b border-b-border-gray py-3 px-5 rounded-none">
                Account Config.
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setShowBlockUser(true)}
                className="border-b border-b-border-gray py-3 px-5 rounded-none"
              >
                Block User
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuItem
            onClick={() => setShowDeleteUser(true)}
            className="border-b border-b-border-gray py-3 px-5 rounded-none"
          >
            Delete User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ChooseAction;
