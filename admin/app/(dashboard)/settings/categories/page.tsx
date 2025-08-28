'use client';
import CardWrapper from '@/components/cardWrapper';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { useState } from 'react';
import AddNewCategory from '../components/modals/new-category';
import UpdateCatgory from '../components/modals/edit-category';
import { deleteCategory } from '@/lib/services/categoryService';
import { toast } from 'sonner';
import ToastDivComponent from '@/components/toast.component';
import useSWR, { mutate } from 'swr';
import axiosInstance from '@/lib/axiosInstance';

// SWR fetcher function
const fetcher = async (url: string) => {
  const response = await axiosInstance.get(url);
  return response.data.categories || [];
};

// Update the category interface to match API response
interface Category {
  _id: string;
  name: string;
  isActive: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

type categoryType = { name: string; id: string };
const SettingsCategory = () => {
  const [OpenNewCatModal, setOpenNewCatModal] = useState(false);
  const [EditCatModal, setEditCatModal] = useState(false);
  const [selectedCat, setSelectedCat] = useState<categoryType | null>(null);

  // Use SWR for data fetching with automatic caching and deduplication
  const {
    data: categories = [],
    error,
    isLoading,
  } = useSWR<Category[]>('/inventory/list-categories', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 5000, // Prevent duplicate requests within 5 seconds
  });

  // Handle SWR errors
  if (error) {
    console.error('Error fetching categories:', error);
    toast.error('Failed to fetch categories');
  }

  const AddCategory = function () {
    setOpenNewCatModal(true);
  };

  const handleUpdatedCat = function (cat: categoryType) {
    console.log('this is the data to be updated ', cat);
    setSelectedCat(cat);
    setEditCatModal(true);
  };

  const handleDeleteCat = async function (cat: categoryType) {
    try {
      await deleteCategory(cat.id);
      toast.custom(
        (id) => (
          <ToastDivComponent
            title="Category Deleted"
            sub="The category has been removed from the inventory"
            id={id}
          />
        ),
        { position: 'top-right', unstyled: true }
      );
      // Revalidate SWR cache
      mutate('/inventory/list-categories');
    } catch (error) {
      console.error('Error in handleDeleteCat:', error);
    }
  };

  const handleModalClose = (isOpen: boolean) => {
    setOpenNewCatModal(isOpen);
    if (!isOpen) {
      // Revalidate SWR cache when modal closes
      mutate('/inventory/list-categories');
    }
  };

  const handleEditModalClose = (isOpen: boolean) => {
    setEditCatModal(isOpen);
    if (!isOpen) {
      // Revalidate SWR cache when edit modal closes
      mutate('/inventory/list-categories');
    }
  };
  return (
    <>
      <AddNewCategory open={OpenNewCatModal} onOpenChange={handleModalClose} />
      <UpdateCatgory
        data={selectedCat}
        open={EditCatModal}
        onOpenChange={handleEditModalClose}
      />
      <h1 className="text-lg font-medium ">Categories</h1>
      <div className="flex items-baseline justify-between">
        <p className="text-gray-3">
          Create inventory & product catalog categories
        </p>
        <button
          onClick={AddCategory}
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
          New Category
        </button>
      </div>

      <CardWrapper className="mt-10 p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-200 py-3 px-6 border-none">
              <TableHead className="py-[13px] ps-6 w-1/3">Name</TableHead>
              <TableHead className="py-[13px] ps-6 w-1/6">Status</TableHead>
              <TableHead className="py-[13px] ps-6 w-1/6">Date Added</TableHead>
              <TableHead className="py-[13px] ps-6 w-1/6">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center p-6">
                  Loading categories...
                </TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center p-6">
                  No categories found
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category: Category) => (
                <TableRow
                  className="border-b border-b-gray-200 text-resin-black"
                  key={category._id}
                >
                  <TableCell className="p-6 font-medium">
                    <span className="bg-[#F2F4F7] text-[#344054] text-xs py-[2px] px-2 rounded-full">
                      {category.name}
                    </span>
                  </TableCell>

                  <TableCell className="p-6 font-medium">
                    <span
                      className={`text-xs py-[2px] px-2 rounded-full ${
                        category.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {category.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell className="p-6 font-medium">
                    <span className="bg-[#F2F4F7] text-[#344054] text-xs py-[2px] px-2 rounded-full">
                      {format(new Date(category.createdAt), 'MMM dd, yyyy')}
                    </span>
                  </TableCell>
                  <TableCell className="p-6 font-medium">
                    <div className="flex gap-x-1">
                      <button
                        onClick={() =>
                          handleUpdatedCat({
                            name: category.name,
                            id: category._id,
                          })
                        }
                        className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-4"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <path
                            d="M4.61763 16.2676C4.1093 16.2676 3.6343 16.0926 3.29263 15.7676C2.8593 15.3593 2.65097 14.7426 2.72597 14.0759L3.0343 11.3759C3.09263 10.8676 3.40097 10.1926 3.7593 9.82594L10.601 2.58427C12.3093 0.775936 14.0926 0.725936 15.901 2.43427C17.7093 4.1426 17.7593 5.92594 16.051 7.73427L9.2093 14.9759C8.8593 15.3509 8.2093 15.7009 7.70096 15.7843L5.01763 16.2426C4.87597 16.2509 4.75097 16.2676 4.61763 16.2676ZM13.276 2.42594C12.6343 2.42594 12.076 2.82594 11.5093 3.42594L4.66763 10.6759C4.50097 10.8509 4.3093 11.2676 4.27597 11.5093L3.96763 14.2093C3.9343 14.4843 4.00097 14.7093 4.15097 14.8509C4.30097 14.9926 4.52597 15.0426 4.80097 15.0009L7.4843 14.5426C7.72597 14.5009 8.12597 14.2843 8.29263 14.1093L15.1343 6.8676C16.1676 5.7676 16.5426 4.75094 15.0343 3.33427C14.3676 2.6926 13.7926 2.42594 13.276 2.42594Z"
                            fill="#1D1C1D"
                          />
                          <path
                            d="M14.4497 9.12406C14.433 9.12406 14.408 9.12406 14.3914 9.12406C11.7914 8.86573 9.69971 6.89073 9.29971 4.30739C9.24971 3.96573 9.48305 3.64906 9.82471 3.59073C10.1664 3.54073 10.483 3.77406 10.5414 4.11573C10.858 6.13239 12.4914 7.68239 14.5247 7.88239C14.8664 7.91573 15.1164 8.22406 15.083 8.56573C15.0414 8.88239 14.7664 9.12406 14.4497 9.12406Z"
                            fill="#1D1C1D"
                          />
                          <path
                            d="M17.5 18.959H2.5C2.15833 18.959 1.875 18.6757 1.875 18.334C1.875 17.9923 2.15833 17.709 2.5 17.709H17.5C17.8417 17.709 18.125 17.9923 18.125 18.334C18.125 18.6757 17.8417 18.959 17.5 18.959Z"
                            fill="#1D1C1D"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteCat({
                            name: category.name,
                            id: category._id,
                          })
                        }
                        className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-4"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <path
                            d="M17.4991 5.60742C17.4824 5.60742 17.4574 5.60742 17.4324 5.60742C13.0241 5.16575 8.62408 4.99909 4.26574 5.44075L2.56574 5.60742C2.21574 5.64075 1.90741 5.39075 1.87408 5.04075C1.84074 4.69075 2.09074 4.39075 2.43241 4.35742L4.13241 4.19075C8.56574 3.74075 13.0574 3.91575 17.5574 4.35742C17.8991 4.39075 18.1491 4.69909 18.1157 5.04075C18.0907 5.36575 17.8157 5.60742 17.4991 5.60742Z"
                            fill="#1D1C1D"
                          />
                          <path
                            d="M7.08265 4.76602C7.04932 4.76602 7.01598 4.76602 6.97432 4.75768C6.64098 4.69935 6.40765 4.37435 6.46598 4.04102L6.64932 2.94935C6.78265 2.14935 6.96598 1.04102 8.90765 1.04102H11.091C13.041 1.04102 13.2243 2.19102 13.3493 2.95768L13.5326 4.04102C13.591 4.38268 13.3576 4.70768 13.0243 4.75768C12.6826 4.81602 12.3576 4.58268 12.3076 4.24935L12.1243 3.16602C12.0076 2.44102 11.9826 2.29935 11.0993 2.29935H8.91598C8.03265 2.29935 8.01598 2.41602 7.89098 3.15768L7.69932 4.24102C7.64932 4.54935 7.38265 4.76602 7.08265 4.76602Z"
                            fill="#1D1C1D"
                          />
                          <path
                            d="M12.676 18.9577H7.32597C4.41764 18.9577 4.30097 17.3493 4.20931 16.0493L3.66764 7.65766C3.64264 7.316 3.90931 7.016 4.25097 6.991C4.60097 6.97433 4.89264 7.23266 4.91764 7.57433L5.45931 15.966C5.55097 17.2327 5.58431 17.7077 7.32597 17.7077H12.676C14.426 17.7077 14.4593 17.2327 14.5426 15.966L15.0843 7.57433C15.1093 7.23266 15.4093 6.97433 15.751 6.991C16.0926 7.016 16.3593 7.30766 16.3343 7.65766L15.7926 16.0493C15.701 17.3493 15.5843 18.9577 12.676 18.9577Z"
                            fill="#1D1C1D"
                          />
                          <path
                            d="M11.3824 14.375H8.60742C8.26576 14.375 7.98242 14.0917 7.98242 13.75C7.98242 13.4083 8.26576 13.125 8.60742 13.125H11.3824C11.7241 13.125 12.0074 13.4083 12.0074 13.75C12.0074 14.0917 11.7241 14.375 11.3824 14.375Z"
                            fill="#1D1C1D"
                          />
                          <path
                            d="M12.0827 11.041H7.91602C7.57435 11.041 7.29102 10.7577 7.29102 10.416C7.29102 10.0743 7.57435 9.79102 7.91602 9.79102H12.0827C12.4243 9.79102 12.7077 10.0743 12.7077 10.416C12.7077 10.7577 12.4243 11.041 12.0827 11.041Z"
                            fill="#1D1C1D"
                          />
                        </svg>
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardWrapper>
    </>
  );
};

export default SettingsCategory;
