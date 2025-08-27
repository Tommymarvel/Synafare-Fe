'use client';
import GoBack from '@/components/goback';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PermissionsTable from '../components/permissions.table';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  newUserDefaultValues,
  newUserSchema,
} from '../../validations/formvalidations';
import { useForm } from 'react-hook-form';
import z from 'zod';
import UserCreatedModal from '../components/user.created.modal';
import { useEffect, useMemo, useState } from 'react';
import { createAdmin } from '@/lib/services/adminService';
import { toast } from 'sonner';

type FormData = z.infer<typeof newUserSchema>;
const NewTeamMember = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(newUserSchema),
    defaultValues: newUserDefaultValues,
  });

  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  // Track active tab and apply role defaults once per tab (without overriding user changes)
  const [activeTab, setActiveTab] = useState<
    'admin' | 'operations' | 'finance' | 'custom'
  >('admin');
  const [appliedDefaults, setAppliedDefaults] = useState<
    Record<'admin' | 'operations' | 'finance' | 'custom', boolean>
  >({
    admin: false,
    operations: false,
    finance: false,
    custom: false,
  });

  // Default permissions per role. Custom stays empty so users toggle freely.
  const roleDefaults = useMemo(
    () => ({
      admin: {
        loans: { view: true, manage: true },
        users: { view: true, manage: true },
        marketPlace: { view: true, manage: true },
        transactions: { view: true, manage: true },
        teamMembers: { view: true, manage: true },
      },
      operations: {
        loans: { view: true, manage: true },
        users: { view: true, manage: true },
        marketPlace: { view: true, manage: false },
        transactions: { view: true, manage: false },
        teamMembers: { view: true, manage: false },
      },
      finance: {
        loans: { view: true, manage: false },
        users: { view: true, manage: false },
        marketPlace: { view: false, manage: false },
        transactions: { view: true, manage: true },
        teamMembers: { view: false, manage: false },
      },
      custom: {
        loans: { view: false, manage: false },
        users: { view: false, manage: false },
        marketPlace: { view: false, manage: false },
        transactions: { view: false, manage: false },
        teamMembers: { view: false, manage: false },
      },
    }),
    []
  );

  const pTypeByTab = useMemo(
    () =>
      ({
        admin: 'adminPermissions',
        operations: 'operationsPermissions',
        finance: 'financePermissions',
        custom: 'customPermissions',
      } as const),
    []
  );

  useEffect(() => {
    // Apply defaults only once per tab, and never for custom (kept free)
    if (activeTab !== 'custom' && !appliedDefaults[activeTab]) {
      const pType = pTypeByTab[activeTab];
      setValue(pType, roleDefaults[activeTab], {
        shouldDirty: true,
        shouldTouch: false,
      });
      setAppliedDefaults((prev) => ({ ...prev, [activeTab]: true }));
    }
  }, [activeTab, appliedDefaults, pTypeByTab, roleDefaults, setValue]);

  const submitHandler = async function (data: FormData) {
    try {
      // Determine role based on active tab
      const role:
        | 'admin'
        | 'admin_operations'
        | 'admin_finance'
        | 'admin_custom' =
        activeTab === 'admin'
          ? 'admin'
          : activeTab === 'operations'
          ? 'admin_operations'
          : activeTab === 'finance'
          ? 'admin_finance'
          : 'admin_custom';

      // Map form permissions keys to API permission keys
      const mapPerms = (p: FormData['adminPermissions']) => ({
        loans: { view: !!p.loans.view, manage: !!p.loans.manage },
        users: { view: !!p.users.view, manage: !!p.users.manage },
        marketplace: {
          view: !!p.marketPlace.view,
          manage: !!p.marketPlace.manage,
        },
        transactions: {
          view: !!p.transactions.view,
          manage: !!p.transactions.manage,
        },
        team_members: {
          view: !!p.teamMembers.view,
          manage: !!p.teamMembers.manage,
        },
      });

      // Pick the permissions group that matches the active tab
      const selectedPermissionsGroup =
        activeTab === 'admin'
          ? data.adminPermissions
          : activeTab === 'operations'
          ? data.operationsPermissions
          : activeTab === 'finance'
          ? data.financePermissions
          : data.customPermissions;

      const permissions = mapPerms(selectedPermissionsGroup);

      await createAdmin({
        email: data.email,
        role,
        permissions,
        first_name: data.firstName,
        last_name: data.lastName,
        phn_no: data.phone,
      });
      toast.success('Team member created');
      setOpenSuccessModal(true);
    } catch (e: unknown) {
      const err = e as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to create admin';
      toast.error(msg);
    }
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
                    {...register('firstName')}
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
                    {...register('lastName')}
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
                    {...register('email')}
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
                    {...register('phone')}
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
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as typeof activeTab)}
              className="w-full space-y-5 "
            >
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
                <PermissionsTable
                  pType="adminPermissions"
                  control={control}
                  disabled
                />
              </TabsContent>
              <TabsContent value="operations">
                <PermissionsTable
                  pType="operationsPermissions"
                  control={control}
                  disabled
                />
              </TabsContent>
              <TabsContent value="finance">
                <PermissionsTable
                  pType="financePermissions"
                  control={control}
                  disabled
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
