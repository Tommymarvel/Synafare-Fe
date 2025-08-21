"use client";
import GoBack from "@/components/goback";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PermissionsTable from "../components/permissions.table";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  newUserDefaultValues,
  newUserSchema,
} from "../../validations/formvalidations";
import { useForm } from "react-hook-form";
import z from "zod";
import UserCreatedModal from "../components/user.created.modal";
import { useState } from "react";

type FormData = z.infer<typeof newUserSchema>;
const NewTeamMember = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(newUserSchema),
    defaultValues: newUserDefaultValues,
  });

  const [openSuccessModal, setOpenSuccessModal] = useState(true);
  const submitHandler = function (data: FormData) {
    console.log(data);

    setOpenSuccessModal(true);
  };

  return (
    <>
      <UserCreatedModal
        open={openSuccessModal}
        onOpenChange={setOpenSuccessModal}
      />
      <form className="flex" onSubmit={handleSubmit(submitHandler)}>
        <div className="w-[250px] ps-[50px] shrink-0  py-[21px] ">
          <GoBack />
        </div>
        <div className="grow max-w-[627px] space-y-8">
          <div className="space-y-2">
            <h1 className="font-medium text-2xl">Add Team Member</h1>
            <p className="text-[#645D5D]">
              Tell us about your business to complete your account set up
            </p>
          </div>

          <div className="">
            <div className="space-y-4">
              <div className="flex gap-x-4">
                <div className="flex-1">
                  <label className="font-medium block">
                    First Name
                    <span className="text-red-700">*</span>
                  </label>
                  <input
                    type="text"
                    className="border border-gray-300 p-4 rounded-md w-full"
                    {...register("firstName")}
                  />
                  {errors.firstName && (
                    <p className="text-red-600 text-sm">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div className="flex-1">
                  <label className="font-medium block">
                    Last Name<span className="text-red-700">*</span>
                  </label>
                  <input
                    type="text"
                    className="border border-gray-300 p-4 rounded-md w-full"
                    {...register("lastName")}
                  />
                  {errors.lastName && (
                    <p className="text-red-600 text-sm">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-x-4">
                <div className="flex-1">
                  <label className="font-medium block">
                    Email Address
                    <span className="text-red-700">*</span>
                  </label>
                  <input
                    type="email"
                    className="border border-gray-300 p-4 rounded-md w-full"
                    defaultValue=""
                    placeholder="Enter email address"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-red-600 text-sm">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="flex-1">
                  <label className="font-medium block">
                    Phone Number<span className="text-red-700">*</span>
                  </label>
                  <input
                    type="text"
                    className="border border-gray-300 p-4 rounded-md w-full"
                    defaultValue=""
                    placeholder="+23458035803509"
                    {...register("phone")}
                  />
                  {errors.phone && (
                    <p className="text-red-600 text-sm">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="h-[3px] w-full bg-gray-4" />
          <div className="space-y-2">
            <h4 className="text-lg font-medium">Roles & Permission</h4>
            <p>Select the role and permissions that apply</p>
            <Tabs defaultValue="admin" className="w-full space-y-5 ">
              <TabsList className="mb-8 w-full rounded-none gap-x-[10px]">
                <TabsTrigger
                  className="py-[10px] px-3 cursor-pointer border border-gray font-medium rounded-lg  data-[state=active]:border-mikado-yellow  data-[state=active]:text-mikado-yellow "
                  value="admin"
                >
                  admin
                </TabsTrigger>
                <TabsTrigger
                  className="py-[10px] px-3 cursor-pointer border border-gray font-medium rounded-lg  data-[state=active]:border-mikado-yellow  data-[state=active]:text-mikado-yellow "
                  value="operations"
                >
                  Operations
                </TabsTrigger>
                <TabsTrigger
                  className="py-[10px] px-3 cursor-pointer border border-gray font-medium rounded-lg  data-[state=active]:border-mikado-yellow  data-[state=active]:text-mikado-yellow "
                  value="finance"
                >
                  Finance
                </TabsTrigger>
                <TabsTrigger
                  className="py-[10px] px-3 cursor-pointer border border-gray font-medium rounded-lg  data-[state=active]:border-mikado-yellow  data-[state=active]:text-mikado-yellow "
                  value="custom"
                >
                  Custom
                </TabsTrigger>
              </TabsList>
              <TabsContent value="admin">
                <PermissionsTable pType="adminPermissions" control={control} />
              </TabsContent>
              <TabsContent value="operations">
                <PermissionsTable
                  pType="operationsPermissions"
                  control={control}
                />
              </TabsContent>
              <TabsContent value="finance">
                <PermissionsTable
                  pType="financePermissions"
                  control={control}
                />
              </TabsContent>
              <TabsContent value="custom">
                <PermissionsTable pType="customPermissions" control={control} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </form>
    </>
  );
};

export default NewTeamMember;
