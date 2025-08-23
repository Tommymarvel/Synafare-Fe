'use client';

import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { UploadCloud } from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { editProduct } from '../../api/inventoryActions';
import { useInventoryDetails } from '../../hooks/useInventoryDetails';

// Define the form values type
interface InventoryFormValues {
  status: 'published' | 'unpublished' | 'draft';
  product_name: string;
  product_category: string;
  product_sku: string;
  quantity_in_stock: string;
  brand: string;
  model_number: string;
  unit_price: string;
  desc: string;
}

// ✅ Yup schema
const InventorySchema = Yup.object().shape({
  status: Yup.mixed<'published' | 'unpublished' | 'draft'>()
    .oneOf(['published', 'unpublished', 'draft'])
    .required(),
  product_name: Yup.string().when('status', {
    is: (val: string) => val !== 'draft',
    then: (s) => s.required('Product name is required'),
    otherwise: (s) => s,
  }),
  product_category: Yup.string().when('status', {
    is: (val: string) => val !== 'draft',
    then: (s) => s.required('Category is required'),
    otherwise: (s) => s,
  }),
  product_sku: Yup.string().when('status', {
    is: (val: string) => val !== 'draft',
    then: (s) => s.required('SKU is required'),
    otherwise: (s) => s,
  }),
  quantity_in_stock: Yup.string().when('status', {
    is: (val: string) => val !== 'draft',
    then: (s) => s.required('Quantity is required'),
    otherwise: (s) => s,
  }),
  brand: Yup.string().when('status', {
    is: (val: string) => val !== 'draft',
    then: (s) => s.required('Brand is required'),
    otherwise: (s) => s,
  }),
  model_number: Yup.string().when('status', {
    is: (val: string) => val !== 'draft',
    then: (s) => s.required('Model is required'),
    otherwise: (s) => s,
  }),
  unit_price: Yup.string().when('status', {
    is: (val: string) => val !== 'draft',
    then: (s) => s.required('Price is required'),
    otherwise: (s) => s,
  }),
  desc: Yup.string().when('status', {
    is: (val: string) => val !== 'draft',
    then: (s) => s.required('Description is required'),
    otherwise: (s) => s,
  }),
});

export default function EditInventoryForm() {
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const {
    inventory: productData,
    isLoading: isLoadingProduct,
    error,
  } = useInventoryDetails(productId);

  const [initialValues, setInitialValues] = useState<InventoryFormValues>({
    status: 'draft',
    product_name: '',
    product_category: '',
    product_sku: '',
    quantity_in_stock: '',
    brand: '',
    model_number: '',
    unit_price: '',
    desc: '',
  });

  useEffect(() => {
    if (productData) {
      setInitialValues({
        status:
          productData.status === 'Published'
            ? 'published'
            : productData.status === 'Unpublished'
            ? 'unpublished'
            : 'draft',
        product_name: productData.product_name || '',
        product_category: productData.product_category || '',
        product_sku: productData.product_sku?.toString() || '',
        quantity_in_stock: productData.quantity_in_stock?.toString() || '',
        brand: productData.brand || '',
        model_number: productData.model_number || '',
        unit_price: productData.unit_price || '',
        desc: productData.desc || '',
      });
      setExistingImages(productData.product_image || []);
      setIsLoading(false);
    }
  }, [productData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    if (images.length + files.length + existingImages.length > 5) {
      toast.error('Max 5 images allowed');
      return;
    }
    setImages((prev) => [...prev, ...files]);
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (
    values: InventoryFormValues,
    { setSubmitting }: FormikHelpers<InventoryFormValues>
  ) => {
    try {
      const formData = new FormData();

      // Properly type the entries
      (Object.entries(values) as [keyof InventoryFormValues, string][]).forEach(
        ([key, val]) => {
          formData.append(key, val);
        }
      );

      // Add new images
      images.forEach((file) => formData.append('product_image', file));

      // Add existing images that weren't removed
      existingImages.forEach((imageUrl) =>
        formData.append('existing_images', imageUrl)
      );

      await editProduct(productId, formData);

      toast.success('Product updated successfully ✅');
      router.push('/dashboard/inventory');
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoadingProduct || isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="text-lg">Loading product details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="text-lg text-red-600">
          Failed to load product details
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Top nav/back */}
      <div className="max-w-5xl mx-auto">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          &larr; Go Back
        </button>
      </div>

      <h1 className="page-title">Edit Product</h1>

      <div className="form-card">
        <Formik<InventoryFormValues>
          initialValues={initialValues}
          enableReinitialize={true}
          validationSchema={InventorySchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form className="space-y-8">
              {/* === Product Information === */}
              <div className="section">
                <h2 className="section-title">Product Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                  {/* Product Name */}
                  <div>
                    <label className="label required">Product Name</label>
                    <Field
                      name="product_name"
                      placeholder="1.5kVa 2.4kWh LT"
                      className="input"
                    />
                    <ErrorMessage
                      name="product_name"
                      component="div"
                      className="help !text-red-500 mt-1"
                    />
                  </div>

                  {/* Category */}
                  <div className="relative">
                    <label className="label required">Category</label>
                    <Field
                      as="select"
                      name="product_category"
                      className="select"
                    >
                      <option value="">Select category</option>
                      <option value="Inverter">Inverter</option>
                      <option value="Battery">Battery</option>
                      <option value="Panel">Panel</option>
                      <option value="Accessory">Accessory</option>
                    </Field>
                    {/* faux chevron */}
                    <span className="pointer-events-none absolute right-3.5 top-[42px] text-gray-400">
                      ▾
                    </span>
                    <ErrorMessage
                      name="product_category"
                      component="div"
                      className="help !text-red-500 mt-1"
                    />
                  </div>

                  {/* SKU */}
                  <div>
                    <label className="label">SKU</label>
                    <Field
                      name="product_sku"
                      placeholder="SKU-1234-SL"
                      className="input"
                    />
                    <ErrorMessage
                      name="product_sku"
                      component="div"
                      className="help !text-red-500 mt-1"
                    />
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="label required">Quantity In Stock</label>
                    <Field
                      name="quantity_in_stock"
                      type="number"
                      placeholder="50"
                      className="input"
                    />
                    <ErrorMessage
                      name="quantity_in_stock"
                      component="div"
                      className="help !text-red-500 mt-1"
                    />
                  </div>

                  {/* Brand */}
                  <div>
                    <label className="label required">Brand</label>
                    <Field
                      name="brand"
                      placeholder="Luminous"
                      className="input"
                    />
                    <ErrorMessage
                      name="brand"
                      component="div"
                      className="help !text-red-500 mt-1"
                    />
                  </div>

                  {/* Model */}
                  <div>
                    <label className="label required">Model</label>
                    <Field
                      name="model_number"
                      placeholder="1.5 kVa"
                      className="input"
                    />
                    <ErrorMessage
                      name="model_number"
                      component="div"
                      className="help !text-red-500 mt-1"
                    />
                  </div>

                  {/* Unit Price with ₦ prefix */}
                  <div className="relative">
                    <label className="label required">Unit Price</label>
                    <span className="absolute left-3.5 top-[42px] text-gray-400">
                      ₦
                    </span>
                    <Field
                      name="unit_price"
                      placeholder="980,000"
                      className="input pl-7"
                    />
                    <ErrorMessage
                      name="unit_price"
                      component="div"
                      className="help !text-red-500 mt-1"
                    />
                  </div>

                  {/* Status */}
                  <div className="relative">
                    <label className="label required">Status</label>
                    <Field as="select" name="status" className="select">
                      <option value="published">Published</option>
                      <option value="unpublished">Unpublished</option>
                      <option value="draft">Draft</option>
                    </Field>
                    <span className="pointer-events-none absolute right-3.5 top-[42px] text-gray-400">
                      ▾
                    </span>
                    <ErrorMessage
                      name="status"
                      component="div"
                      className="help !text-red-500 mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="section">
                <label className="label required">Description</label>
                <Field
                  as="textarea"
                  name="desc"
                  rows={4}
                  placeholder="Write a concise, benefits-forward description…"
                  className="textarea"
                />
                <ErrorMessage
                  name="desc"
                  component="div"
                  className="help !text-red-500 mt-1"
                />
              </div>

              {/* Product Images */}
              <div className="section">
                <h3 className="label">Product Images</h3>
                <p className="help mb-3">
                  Recommended dimension: 930px x 1163px, Max file size: 5MB
                </p>

                <input
                  type="file"
                  multiple
                  accept="image/png,image/jpeg"
                  onChange={handleImageChange}
                  className="hidden"
                  id="upload"
                />

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {/* Existing Images */}
                  {existingImages.map((imageUrl, i) => (
                    <div key={`existing-${i}`} className="thumb">
                      <Image
                        src={imageUrl}
                        alt={`existing-${i}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        className="thumb-del"
                        onClick={() => removeExistingImage(i)}
                        aria-label="Remove existing image"
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  {/* New Image Previews */}
                  {images.map((file, i) => (
                    <div key={`new-${i}`} className="thumb">
                      <Image
                        src={URL.createObjectURL(file)}
                        alt={`preview-${i}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        className="thumb-del"
                        onClick={() =>
                          setImages((prev) =>
                            prev.filter((_, idx) => idx !== i)
                          )
                        }
                        aria-label="Remove new image"
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  {/* Uploader tile */}
                  <label
                    htmlFor="upload"
                    className="uploader-tile cursor-pointer"
                  >
                    <UploadCloud className="w-6 h-6 text-gray-400" />
                    <span className="text-xs text-gray-500">Upload Image</span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  onClick={() => setFieldValue('status', 'draft')}
                  disabled={isSubmitting}
                  className="btn-ghost"
                >
                  Save as Draft
                </button>

                <button
                  type="submit"
                  onClick={() => setFieldValue('status', 'published')}
                  disabled={isSubmitting}
                  className="btn-primary"
                >
                  {isSubmitting ? 'Updating...' : 'Update Product'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
