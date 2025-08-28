'use client';

import { useState, useEffect } from 'react';
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  FormikHelpers,
  FieldProps,
} from 'formik';
import * as Yup from 'yup';
import axios from '@/lib/axiosInstance';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { UploadCloud } from 'lucide-react';
import Image from 'next/image';
import GoBack from '@/app/components/goback';
import { Button } from '@/app/components/ui/Button';

// Utility functions for price formatting
const formatNairaInput = (value: string): string => {
  // Remove all non-numeric characters except decimal point
  const numericValue = value.replace(/[^\d.]/g, '');

  // Handle decimal points - only allow one
  const parts = numericValue.split('.');
  if (parts.length > 2) {
    return parts[0] + '.' + parts.slice(1).join('');
  }

  // Format with commas for thousands
  if (parts[0]) {
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts[1] !== undefined ? `${integerPart}.${parts[1]}` : integerPart;
  }

  return numericValue;
};

const parseNairaInput = (formattedValue: string): string => {
  // Remove commas to get the raw numeric value for form submission
  return formattedValue.replace(/,/g, '');
};

// Define category interface
interface Category {
  name: string;
  _id: string;
}

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
    then: (s) => s.required('Model number is required'),
    otherwise: (s) => s,
  }),
  unit_price: Yup.string().when('status', {
    is: (val: string) => val !== 'draft',
    then: (s) =>
      s
        .required('Price is required')
        .test('is-valid-price', 'Please enter a valid price', (value) => {
          if (!value) return false;
          const numericValue = parseFloat(parseNairaInput(value));
          return !isNaN(numericValue) && numericValue > 0;
        }),
    otherwise: (s) => s,
  }),
  desc: Yup.string().when('status', {
    is: (val: string) => val !== 'draft',
    then: (s) => s.required('Description is required'),
    otherwise: (s) => s,
  }),
});

export default function AddInventoryForm() {
  const [images, setImages] = useState<File[]>([]);
  const [displayPrice, setDisplayPrice] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await axios.get('/inventory/list-categories');
        setCategories(response.data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories');
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      toast.error('Max 5 images allowed');
      return;
    }
    setImages((prev) => [...prev, ...files]);
  };

  const handleSubmit = async (
    values: InventoryFormValues,
    { setSubmitting, resetForm }: FormikHelpers<InventoryFormValues>
  ) => {
    try {
      const formData = new FormData();

      // Convert formatted price back to numeric string for API
      const processedValues = {
        ...values,
        unit_price: parseNairaInput(values.unit_price),
      };

      // Properly type the entries
      (
        Object.entries(processedValues) as [keyof InventoryFormValues, string][]
      ).forEach(([key, val]) => {
        formData.append(key, val);
      });

      images.forEach((file) => formData.append('product_image', file));

      await axios.post('/inventory/add', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Product added successfully ✅');
      resetForm();
      setImages([]);
      setDisplayPrice('');
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Top nav/back (optional) */}
      <div className="max-w-5xl mx-auto">
        <GoBack />
      </div>

      <h1 className="page-title">Add to Inventory</h1>

      <div className="form-card">
        <Formik<InventoryFormValues>
          initialValues={{
            status: 'draft',
            product_name: '',
            product_category: '',
            product_sku: '',
            quantity_in_stock: '',
            brand: '',
            model_number: '',
            unit_price: '',
            desc: '',
          }}
          validationSchema={InventorySchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue }) => {
            const handleSaveAsDraft = () => {
              setFieldValue('status', 'draft');
            };

            const handlePublish = () => {
              setFieldValue('status', 'published');
            };

            return (
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
                        disabled={loadingCategories}
                      >
                        <option value="">
                          {loadingCategories
                            ? 'Loading categories...'
                            : 'Select category'}
                        </option>
                        {categories.map((category) => (
                          <option key={category._id} value={category._id}>
                            {category.name}
                          </option>
                        ))}
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
                      <label className="label required">
                        Quantity In Stock
                      </label>
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

                      <Field name="unit_price">
                        {({ field, form }: FieldProps<string>) => (
                          <input
                            {...field}
                            type="text"
                            placeholder="980,000"
                            className="input pl-7"
                            value={displayPrice || field.value}
                            onChange={(e) => {
                              const rawValue = e.target.value;
                              const formattedValue = formatNairaInput(rawValue);
                              setDisplayPrice(`₦${formattedValue}`);

                              // Set the actual numeric value for form validation
                              form.setFieldValue(field.name, formattedValue);
                            }}
                            onBlur={field.onBlur}
                          />
                        )}
                      </Field>
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
                    {/* Previews */}
                    {images.map((file, i) => (
                      <div key={i} className="thumb">
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
                          aria-label="Remove image"
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
                      <span className="text-xs text-gray-500">
                        Upload Image
                      </span>
                    </label>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <button
                    type="submit"
                    onClick={handleSaveAsDraft}
                    disabled={isSubmitting}
                    className="btn-ghost"
                  >
                    Save as Draft
                  </button>

                  <Button
                    type="submit"
                    onClick={handlePublish}
                    disabled={isSubmitting}
                    className="text-raisin "
                  >
                    {isSubmitting ? 'Adding...' : 'Add Product'}
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
}
