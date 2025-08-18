"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Pagination from "@/components/pagination";
import EmptyList from "../../loan-requests/components/empty-list";
import Status from "@/components/status";
import UserActionButton from "./user-action";
import { STATUSCONST } from "@/lib/constants";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import DeclineUserModal from "./modals/decline-user";
import ConfirmDeleteUser from "./modals/confirm-delete-user";
import ConfirmVerifyUserModal from "./modals/confirm-verify-user";
import { AllUsers } from "@/types/usertypes";

const VerifiedUsersTable = ({ data }: { data: AllUsers[] }) => {
  if (!data || data.length < 1) {
    return (
      <EmptyList
        title="No Requests"
        message="You do not have any verification requests"
        src="/no-user.svg"
      />
    );
  }
  const [showDeclineModal, setshowDeclineModal] = useState(false);
  const [showDeleteModal, setshowDeleteModal] = useState(false);
  const [showVerifyModal, setshowVerifyModal] = useState(false);

  const filteredData = data.filter((x) => x.status == STATUSCONST.VERIFIED);

  return (
    <>
      <DeclineUserModal
        open={showDeclineModal}
        onOpenChange={setshowDeclineModal}
      />
      <ConfirmDeleteUser
        open={showDeleteModal}
        onOpenChange={setshowDeleteModal}
      />
      <ConfirmVerifyUserModal
        open={showVerifyModal}
        onOpenChange={setshowVerifyModal}
      />

      <Table>
        <TableHeader>
          <TableRow className="bg-gray-200 py-3 px-6 border-none">
            <TableHead className="py-[13px] ps-6">
              <Checkbox />
            </TableHead>
            <TableHead className="py-[13px] ps-6">Name</TableHead>
            <TableHead className="py-[13px] ps-6">Email Address</TableHead>
            <TableHead className="py-[13px] ps-6">User Type</TableHead>
            <TableHead className="py-[13px] ps-6">Date Added</TableHead>
            <TableHead className="py-[13px] ps-6">Status</TableHead>
            <TableHead className="py-[13px] ps-6">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((request) => (
            <TableRow
              className="border-b border-b-gray-200 text-resin-black"
              key={request.email}
            >
              <TableCell className="p-6">
                <Checkbox />
              </TableCell>
              <TableCell className="p-6">
                <p className="text-gray-900 font-medium">{request.name}</p>
              </TableCell>
              <TableCell className="p-6">{request.email}</TableCell>
              <TableCell className="p-6">{request.userType}</TableCell>
              <TableCell className="p-6">{request.dateAdded}</TableCell>
              <TableCell className="p-6">
                <Status status={request.status} />
              </TableCell>
              <TableCell className="p-6">
                <UserActionButton
                  id={request.id}
                  status={request.status}
                  openDeclineModal={setshowDeclineModal}
                  openDeleteModal={setshowDeleteModal}
                  openVerifyModal={setshowVerifyModal}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter className="border-t border-t-gray-200">
          <TableRow>
            <TableCell colSpan={7} className="px-6 py-6">
              <Pagination />
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </>
  );
};

export default VerifiedUsersTable;
