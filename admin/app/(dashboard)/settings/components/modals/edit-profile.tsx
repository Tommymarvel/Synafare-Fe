import Button from "@/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";
const EditProfileMdoal = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (x: boolean) => void;
}) => {
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
                defaultValue="Davide"
              />
            </div>
            <div className="flex-1">
              <label className="font-medium block">
                Last Name<span className="text-red-700">*</span>
              </label>
              <input
                type="text"
                className="border border-gray-300 p-4 rounded-md w-full"
                defaultValue="Smith"
              />
            </div>
          </div>
          <div>
            <label className="font-medium block">Role </label>
            <div className="relative w-full">
              <input
                type="text"
                className="border border-gray-300 p-4 rounded-md w-full bg-[#F0F2F5]"
                disabled
                defaultValue="₦875,000"
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M10 14.0005C9.41668 14.0005 8.83335 13.7755 8.39168 13.3339L2.95835 7.90052C2.71668 7.65885 2.71668 7.25885 2.95835 7.01719C3.20002 6.77552 3.60002 6.77552 3.84168 7.01719L9.27502 12.4505C9.67502 12.8505 10.325 12.8505 10.725 12.4505L16.1583 7.01719C16.4 6.77552 16.8 6.77552 17.0417 7.01719C17.2833 7.25885 17.2833 7.65885 17.0417 7.90052L11.6083 13.3339C11.1667 13.7755 10.5833 14.0005 10 14.0005Z"
                    fill="#1D1C1D"
                  />
                </svg>
              </span>
            </div>
          </div>
          <div>
            <label className="font-medium block">
              Email Address <span className="text-red-700">*</span>
            </label>
            <input
              type="email"
              className="border border-gray-300 p-4 rounded-md w-full bg-[#F0F2F5]"
              disabled
              defaultValue="something@gmail.com"
            />
          </div>

          <div>
            <label className="font-medium block">
              Phone Number <span className="text-red-700">*</span>
            </label>
            <input
              type="text"
              className="border border-gray-300 p-4 rounded-md w-full "
              defaultValue="+2348108XXXXXXX"
            />
          </div>

          <div className="flex gap-x-4 justify-end mt-5 font-medium">
            <DialogClose asChild>
              <Button variant="Colored" className="px-[64px] py-4">
                Cancel
              </Button>
            </DialogClose>

            <Button className="px-[64px] py-4">Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileMdoal;
