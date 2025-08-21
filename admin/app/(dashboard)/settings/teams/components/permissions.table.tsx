import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Control, Controller } from "react-hook-form";
import { NewUserFormTypes } from "../../validations/formvalidations";

type PermissionType =
  | "adminPermissions"
  | "customPermissions"
  | "financePermissions"
  | "operationsPermissions";
const PermissionsTable = ({
  pType,
  control,
}: {
  pType: PermissionType;
  control: Control<NewUserFormTypes>;
}) => {
  return (
    <div className="space-y-8 mb-8">
      <Table className="px-0 ">
        <TableHeader>
          <TableRow className="py-3 border-none">
            <TableHead className="py-[13px]">Permissions</TableHead>
            <TableHead className="py-[13px]">View</TableHead>
            <TableHead className="py-[13px]">Manage</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="space-y-6 px-0">
          <TableRow className="border-none">
            <TableCell className="py-6">
              <p className="text-gray-900 font-medium">Loans</p>
              <p className="text-gray-500">Staff can view and manage loans</p>
            </TableCell>
            <TableCell className="py-6">
              <Controller
                name={`${pType}.loans.view`}
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </TableCell>
            <TableCell className="py-6">
              <Controller
                name={`${pType}.loans.manage`}
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </TableCell>
          </TableRow>
          <TableRow className="border-none">
            <TableCell className="py-6">
              <p className="text-gray-900 font-medium">Users</p>
              <p className="text-gray-500">Staff can view and manage users</p>
            </TableCell>
            <TableCell className="py-6">
              <Controller
                name={`${pType}.users.view`}
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </TableCell>
            <TableCell className="py-6">
              <Controller
                name={`${pType}.users.manage`}
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </TableCell>
          </TableRow>
          <TableRow className="border-none">
            <TableCell className="py-6">
              <p className="text-gray-900 font-medium">MarketPlace</p>
              <p className="text-gray-500">Staff can view marketplace</p>
            </TableCell>
            <TableCell className="py-6">
              <Controller
                name={`${pType}.marketPlace.view`}
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </TableCell>
            <TableCell className="py-6">
              <Controller
                name={`${pType}.marketPlace.manage`}
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </TableCell>
          </TableRow>
          <TableRow className="border-none">
            <TableCell className="py-6">
              <p className="text-gray-900 font-medium">Transactions</p>
              <p className="text-gray-500">
                Staff can view and manage transactions
              </p>
            </TableCell>
            <TableCell className="py-6">
              <Controller
                name={`${pType}.transactions.view`}
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </TableCell>
            <TableCell className="py-6">
              <Controller
                name={`${pType}.transactions.manage`}
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </TableCell>
          </TableRow>
          <TableRow className="border-none">
            <TableCell className="py-6">
              <p className="text-gray-900 font-medium">Team Members</p>
              <p className="text-gray-500">
                Staff can view and manage team members
              </p>
            </TableCell>
            <TableCell className="py-6">
              <Controller
                name={`${pType}.teamMembers.view`}
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </TableCell>
            <TableCell className="py-6">
              <Controller
                name={`${pType}.teamMembers.manage`}
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <button className="bg-mikado-yellow hover:bg-mikado-yellow/70 py-4 px-6 rounded-lg text-center w-full">
        Create User
      </button>
    </div>
  );
};

export default PermissionsTable;
