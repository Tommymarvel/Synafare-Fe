import axiosInstance from '@/lib/axiosInstance';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

export interface Category {
  _id?: string;
  id?: string;
  name: string;
  // Optional other fields
}

export async function createCategory(payload: { name: string }) {
  try {
    const res = await axiosInstance.post(
      '/inventory/admin/create-category',
      payload
    );
    return res.data as { message?: string; category?: Category };
  } catch (error) {
    console.error('Error creating category:', error);

    if (error instanceof AxiosError) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to create category';
      toast.error(errorMessage);
    } else {
      toast.error('An unexpected error occurred while creating category');
    }

    throw error;
  }
}

export async function updateCategory(id: string, payload: { name: string }) {
  try {
    const res = await axiosInstance.put(
      `/inventory/admin/update-category/${id}`,
      payload
    );
    toast.success('Category updated successfully');
    return res.data as { message?: string; category?: Category };
  } catch (error) {
    console.error('Error updating category:', error);

    if (error instanceof AxiosError) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to update category';
      toast.error(errorMessage);
    } else {
      toast.error('An unexpected error occurred while updating category');
    }

    throw error;
  }
}

export async function deleteCategory(id: string) {
  try {
    const res = await axiosInstance.delete(
      `/inventory/admin/delete-category/${id}`
    );

    return res.data as { message?: string };
  } catch (error) {
    console.error('Error deleting category:', error);

    if (error instanceof AxiosError) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to delete category';
      toast.error(errorMessage);
    } else {
      toast.error('An unexpected error occurred while deleting category');
    }

    throw error;
  }
}
