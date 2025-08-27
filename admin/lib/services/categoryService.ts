import axiosInstance from '@/lib/axiosInstance';

export interface Category {
  _id?: string;
  id?: string;
  name: string;
  // Optional other fields
}

export async function createCategory(payload: { name: string }) {
  const res = await axiosInstance.post(
    '/inventory/admin/create-category',
    payload
  );
  return res.data as { message?: string; category?: Category };
}

export async function updateCategory(id: string, payload: { name: string }) {
  const res = await axiosInstance.patch(
    `/inventory/admin/update-category/${id}`,
    payload
  );
  return res.data as { message?: string; category?: Category };
}

export async function deleteCategory(id: string) {
  const res = await axiosInstance.delete(
    `/inventory/admin/delete-category/${id}`
  );
  return res.data as { message?: string };
}
