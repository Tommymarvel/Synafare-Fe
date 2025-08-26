import { Button } from '@/app/components/ui/Button';
import { Dialog, DialogContent, DialogClose } from '@/app/components/ui/dialog';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axiosInstance from '@/lib/axiosInstance';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { useAuth } from '@/context/AuthContext';

const validationSchema = Yup.object({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  phone: Yup.string().required('Phone number is required'),
});

interface User {
  first_name?: string;
  last_name?: string;
  email?: string;
  phn_no?: string;
  account_status?: string;
}

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (x: boolean) => void;
  user?: User;
}

const EditProfileMdoal = ({
  open,
  onOpenChange,
  user,
}: EditProfileModalProps) => {
  const { refreshUser } = useAuth();

  const formik = useFormik({
    initialValues: {
      firstName: user?.first_name || '',
      lastName: user?.last_name || '',
      email: user?.email || '',
      phone: user?.phn_no || '',
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const payload: Record<string, unknown> = {
          first_name: values.firstName?.trim(),
          last_name: values.lastName?.trim(),
          phn_no: values.phone?.trim(),
        };
        
        const { data } = await axiosInstance.patch('/auth/setup', payload);
        toast.success(
          (data as { message?: string })?.message ||
            'Profile updated successfully'
        );
        if (typeof refreshUser === 'function') await refreshUser();
        onOpenChange(false);
      } catch (error) {
        const axiosError = error as AxiosError<{ message?: string } | string>;
        const respData = axiosError.response?.data;
        const msg =
          (typeof respData === 'string' ? respData : respData?.message) ||
          axiosError.message ||
          'Failed to update profile';
        toast.error(msg);
      } finally {
        setSubmitting(false);
      }
    },
  });
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="px-[27px] bg-white no-x py-0 max-w-[555px] pb-[17px] border-0 rounded-xl">
        <div className="border-b border-b-gray-4 pt-[33px] pb-1 flex justify-between itesm-center">
          <h1 className="text-xl font-medium">Edit Profile Information</h1>
        </div>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="flex-1">
            <label className="font-medium block">
              First Name
              <span className="text-red-700">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              className="border border-gray-300 p-4 rounded-md w-full"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.firstName && formik.errors.firstName && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.firstName}
              </div>
            )}
          </div>
          <div className="flex-1">
            <label className="font-medium block">
              Last Name<span className="text-red-700">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              className="border border-gray-300 p-4 rounded-md w-full"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.lastName && formik.errors.lastName && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.lastName}
              </div>
            )}
          </div>

          <div>
            <label className="font-medium block">
              Email Address <span className="text-red-700">*</span>
            </label>
            <input
              type="email"
              name="email"
              className="border border-gray-300 p-4 rounded-md w-full bg-[#F0F2F5]"
              disabled
              value={formik.values.email}
            />
          </div>

          <div>
            <label className="font-medium block">
              Phone Number <span className="text-red-700">*</span>
            </label>
            <input
              type="text"
              name="phone"
              className="border border-gray-300 p-4 rounded-md w-full"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.phone && formik.errors.phone && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.phone}
              </div>
            )}
          </div>

          <div className="flex gap-x-4 justify-end mt-5 font-medium">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="px-[64px] py-4"
                type="button"
                disabled={formik.isSubmitting}
              >
                Cancel
              </Button>
            </DialogClose>

            <Button
              className="px-[64px] py-4"
              type="submit"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileMdoal;
