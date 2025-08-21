import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import Publish from '@/app/assets/publish.png';
import Unpublish from '@/app/assets/unpublish.png';
import Delete from '@/app/assets/delete.png';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type: 'publish' | 'delete' | 'unpublish';
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
}) => {
  if (!isOpen) return null;
  const getIcon = () => {
    switch (type) {
      case 'publish':
        return (
          <Image
            src={Publish}
            alt="Publish"
            width={48}
            height={48}
            className='w-12 h-12'
          />
        );
      case 'delete':
        return (
          <Image
            src={Delete}
            alt="Delete"
            width={48}
            height={48}
            className="w-12 h-12"
          />
        );
      case 'unpublish':
        return (
          <Image
            src={Unpublish}
            alt="Unpublish"
            width={48}
            height={48}
            className="w-12 h-12"
          />
        );
      default:
        return <AlertTriangle className=" text-gray-500" />;
    }
  };

  const getConfirmButtonStyle = () => {
    switch (type) {
      case 'publish':
        return 'bg-green-600 hover:bg-green-700';
      case 'delete':
        return 'bg-red-600 hover:bg-red-700';
      case 'unpublish':
        return 'bg-yellow-600 hover:bg-yellow-700';
      default:
        return 'bg-blue-600 hover:bg-blue-700';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon and content */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="flex items-center justify-center rounded-full ">
            {getIcon()}
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{message}</p>
          </div>

          {/* Action buttons */}
          <div className="flex space-x-3 w-full pt-4">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 px-4 py-2 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${getConfirmButtonStyle()}`}
            >
              {isLoading ? 'Processing...' : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
