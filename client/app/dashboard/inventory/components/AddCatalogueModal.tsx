'use client';

import { useState, useEffect } from 'react';
import { addCatalogueItem, editCatalogueItem } from '../hooks/useCatalogue';
import { X } from 'lucide-react';
import { CatelogueType } from './catalogue';

interface AddCatalogueModalProps {
  onClose: () => void;
  onSuccess: () => void;
  initialData?: CatelogueType | null;
}

const CATEGORIES = [
  { value: 'inverter', label: 'Inverter' },
  { value: 'battery', label: 'Battery' },
  { value: 'panel', label: 'Panel' },
  { value: 'accessory', label: 'Accessory' },
];

export default function AddCatalogueModal({
  onClose,
  onSuccess,
  initialData,
}: AddCatalogueModalProps) {
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!initialData;

  // Initialize form with existing data when editing
  useEffect(() => {
    if (initialData) {
      setProductName(initialData.product);
      setCategory(initialData.category.toLowerCase());
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productName.trim() || !category) {
      return;
    }

    try {
      setIsSubmitting(true);

      if (isEditing && initialData) {
        await editCatalogueItem(initialData.id, {
          product_name: productName.trim(),
          category: category,
        });
      } else {
        await addCatalogueItem({
          product_name: productName.trim(),
          category: category,
        });
      }

      onSuccess();
    } catch {
      // Error is handled in the hook
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Edit Product' : 'Add to Product Catalogue'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="productName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="productName"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g 1.5kVA Inverter"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mikado focus:border-transparent"
              required
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mikado focus:border-transparent appearance-none bg-white"
                required
              >
                <option value="">Select category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !productName.trim() || !category}
              className="flex-1 px-4 py-2 bg-mikado text-raisin rounded-md hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? isEditing
                  ? 'Updating...'
                  : 'Saving...'
                : isEditing
                ? 'Update'
                : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
