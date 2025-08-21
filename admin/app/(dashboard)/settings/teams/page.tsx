import CardWrapper from "@/components/cardWrapper";
import Status from "@/components/status";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TeamMembersData } from "@/data/users.table";
import { format } from "date-fns";
import Link from "next/link";

const TeamMembers = () => {
  const data = TeamMembersData;
  return (
    <>
      <h1 className="text-lg font-medium ">Profile</h1>
      <div className="flex items-baseline justify-between">
        <p className="text-gray-3">
          Invite your colleagues to work faster and collaborate together.
        </p>
        <Link
          href="/settings/teams/new"
          className="flex gap-x-2 px-5 py-2 bg-mikado-yellow rounded-lg font-medium"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M15 10.625H5C4.65833 10.625 4.375 10.3417 4.375 10C4.375 9.65833 4.65833 9.375 5 9.375H15C15.3417 9.375 15.625 9.65833 15.625 10C15.625 10.3417 15.3417 10.625 15 10.625Z"
              fill="#1D1C1D"
            />
            <path
              d="M10 15.625C9.65833 15.625 9.375 15.3417 9.375 15V5C9.375 4.65833 9.65833 4.375 10 4.375C10.3417 4.375 10.625 4.65833 10.625 5V15C10.625 15.3417 10.3417 15.625 10 15.625Z"
              fill="#1D1C1D"
            />
          </svg>
          New Member
        </Link>
      </div>

      <CardWrapper className="mt-10 p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-200 py-3 px-6 border-none">
              <TableHead className="py-[13px] ps-6">Name</TableHead>
              <TableHead className="py-[13px] ps-6">Role</TableHead>
              <TableHead className="py-[13px] ps-6">Date Added</TableHead>
              <TableHead className="py-[13px] ps-6">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((request) => (
              <TableRow
                className="border-b border-b-gray-200 text-resin-black"
                key={request.id}
              >
                <TableCell className="p-6 font-medium">
                  <p className="text-gray-900 font-medium">{request.name}</p>
                  <p className="text-gray-500">{request.id}</p>
                </TableCell>
                <TableCell className="p-6 font-medium">
                  <span className="bg-[#F2F4F7] text-[#344054] text-xs py-[2px] px-2 rounded-full">
                    {request.role}
                  </span>
                </TableCell>
                <TableCell className="p-6 font-medium">
                  {format(new Date(request.dateAdded), "MMM dd, yyyy")}
                </TableCell>
                <TableCell className="p-6 font-medium">
                  <svg width="5" height="16" viewBox="0 0 5 16" fill="none">
                    <path
                      d="M2.49984 8.83398C2.96007 8.83398 3.33317 8.46089 3.33317 8.00065C3.33317 7.54041 2.96007 7.16732 2.49984 7.16732C2.0396 7.16732 1.6665 7.54041 1.6665 8.00065C1.6665 8.46089 2.0396 8.83398 2.49984 8.83398Z"
                      stroke="#98A2B3"
                      strokeWidth="1.66667"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2.49984 3.00065C2.96007 3.00065 3.33317 2.62755 3.33317 2.16732C3.33317 1.70708 2.96007 1.33398 2.49984 1.33398C2.0396 1.33398 1.6665 1.70708 1.6665 2.16732C1.6665 2.62755 2.0396 3.00065 2.49984 3.00065Z"
                      stroke="#98A2B3"
                      strokeWidth="1.66667"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2.49984 14.6673C2.96007 14.6673 3.33317 14.2942 3.33317 13.834C3.33317 13.3737 2.96007 13.0006 2.49984 13.0006C2.0396 13.0006 1.6665 13.3737 1.6665 13.834C1.6665 14.2942 2.0396 14.6673 2.49984 14.6673Z"
                      stroke="#98A2B3"
                      strokeWidth="1.66667"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardWrapper>
    </>
  );
};

export default TeamMembers;
