import { Button } from '@/app/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogClose,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { useFormik } from 'formik';
import * as Yup from 'yup';

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
  nature_of_solar_business?: string;
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
  const formik = useFormik({
    initialValues: {
      firstName: user?.first_name || '',
      lastName: user?.last_name || '',
      email: user?.email || '',
      phone: user?.phn_no || '',
      businessType: user?.nature_of_solar_business || '',
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log('Profile update values:', values);
      // TODO: Implement API call to update profile
      onOpenChange(false);
    },
  });
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="px-[27px] bg-white no-x py-0 max-w-[555px] pb-[17px] border-0 rounded-xl">
        <DialogHeader className="hidden">
          <DialogTitle>Accept Request</DialogTitle>
        </DialogHeader>
        <div className="border-b border-b-gray-4 pt-[33px] pb-1 flex justify-between itesm-center">
          <h1 className="text-xl font-medium">Edit Profile Information</h1>
          <DialogClose asChild>
            <span className="block cursor-pointer">
              <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
                <path
                  d="M10.9969 28.5077C10.3473 29.1572 10.3163 30.317 11.0124 30.982C11.6775 31.6778 12.8531 31.6469 13.5028 30.9974L21.0048 23.4974L28.5069 30.9974C29.172 31.6624 30.3167 31.6778 30.9818 30.982C31.6779 30.317 31.6624 29.1572 30.9973 28.4923L23.4952 20.9923L30.9973 13.5077C31.6624 12.8273 31.6779 11.683 30.9818 11.018C30.3167 10.3222 29.172 10.3376 28.5069 11.0026L21.0048 18.5026L13.5028 11.0026C12.8531 10.3531 11.6775 10.3222 11.0124 11.018C10.3163 11.683 10.3473 12.8428 10.9969 13.4923L18.499 20.9923L10.9969 28.5077Z"
                  fill="#344054"
                />
              </svg>
            </span>
          </DialogClose>
        </div>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="flex gap-x-4">
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
          </div>
          <div>
            <label className="font-medium block">Business Type</label>
            <input
              type="text"
              name="businessType"
              className="border border-gray-300 p-4 rounded-md w-full"
              value={formik.values.businessType}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
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
              >
                Cancel
              </Button>
            </DialogClose>

            <Button className="px-[64px] py-4" type="submit">
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileMdoal;
