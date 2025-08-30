import axiosInstance from '@/lib/axiosInstance';

export interface UpdateStatusRequest {
  status: 'draft' | 'published' | 'unpublished';
}

export interface UpdateStatusResponse {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
}

export interface DeleteProductResponse {
  success: boolean;
  message: string;
}

export interface EditProductResponse {
  _id: string;
  status: string;
  product_name: string;
  product_category: string | { _id: string; name: string };
  product_image: string[];
  [key: string]: unknown;
}

// Edit product
export const editProduct = async (
  productId: string,
  formData: FormData
): Promise<EditProductResponse> => {
  try {
    const response = await axiosInstance.patch(
      `/inventory/edit/${productId}`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : error && typeof error === 'object' && 'response' in error
        ? (error.response as { data?: { message?: string } })?.data?.message ||
          'Failed to edit product'
        : 'Failed to edit product';
    throw new Error(message);
  }
};

// Update product status
export const updateProductStatus = async (
  productId: string,
  status: string
): Promise<UpdateStatusResponse> => {
  try {
    const response = await axiosInstance.patch('/inventory/updateStatus', {
      inventIds: [productId],
      status,
    });
    return response.data;
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : error && typeof error === 'object' && 'response' in error
        ? (error.response as { data?: { message?: string } })?.data?.message ||
          'Failed to update product status'
        : 'Failed to update product status';
    throw new Error(message);
  }
};

// Update multiple products status
export const updateMultipleProductsStatus = async (
  productIds: string[],
  status: string
): Promise<UpdateStatusResponse> => {
  try {
    const response = await axiosInstance.patch('/inventory/updateStatus', {
      inventIds: productIds,
      status,
    });
    return response.data;
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : error && typeof error === 'object' && 'response' in error
        ? (error.response as { data?: { message?: string } })?.data?.message ||
          'Failed to update products status'
        : 'Failed to update products status';
    throw new Error(message);
  }
};

// Delete product
export const deleteProduct = async (
  productId: string
): Promise<DeleteProductResponse> => {
  try {
    const response = await axiosInstance.delete('/inventory/delete', {
      data: { inventIds: [productId] },
    });
    return response.data;
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : error && typeof error === 'object' && 'response' in error
        ? (error.response as { data?: { message?: string } })?.data?.message ||
          'Failed to delete product'
        : 'Failed to delete product';
    throw new Error(message);
  }
};

// Delete multiple products
export const deleteMultipleProducts = async (
  productIds: string[]
): Promise<DeleteProductResponse> => {
  try {
    const response = await axiosInstance.delete('/inventory/delete', {
      data: { inventIds: productIds },
    });
    return response.data;
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : error && typeof error === 'object' && 'response' in error
        ? (error.response as { data?: { message?: string } })?.data?.message ||
          'Failed to delete products'
        : 'Failed to delete products';
    throw new Error(message);
  }
};
