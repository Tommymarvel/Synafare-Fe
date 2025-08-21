// app/dashboard/loans/request/components/DropAreas.tsx
'use client';

import { useDropzone } from 'react-dropzone';
import { useFormikContext } from 'formik';
import { UploadCloud, CheckCircle, Trash2 } from 'lucide-react';


export const MB_5 = 5 * 1024 * 1024;
import { ErrorMessage } from 'formik';

export default function Error({ name }: { name: string }) {
  return (
    <ErrorMessage
      name={name}
      component="p"
      className="mt-1 text-xs text-red-600"
    />
  );
}

type FormValuesBase = {
  bankStatement: File | null;
  invoice: File | null;
};

export function BankDropzone() {
  const { values, setFieldValue, setFieldError } =
    useFormikContext<FormValuesBase>();

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'application/pdf': [], 'image/jpeg': [], 'image/png': [] },
    maxSize: MB_5,
    multiple: false,
    onDrop: (files) => {
      const f = files[0];
      if (!f) return;
      setFieldError('bankStatement', undefined);
      setFieldValue('bankStatement', f);
    },
    onDropRejected: (rejections) => {
      const r = rejections[0];
      const tooBig = r?.errors?.some((e) => e.code === 'file-too-large');
      const wrongType = r?.errors?.some((e) => e.code === 'file-invalid-type');
      if (tooBig) setFieldError('bankStatement', 'File must be 5MB or smaller');
      else if (wrongType)
        setFieldError('bankStatement', 'Only PDF/JPEG/PNG are allowed');
      else setFieldError('bankStatement', 'Unable to accept this file');
    },
  });

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Upload your Business Bank Statement (last 6 months){' '}
        <span className="text-red-500">*</span>
      </label>

      {values.bankStatement ? (
        <UploadedFileRow
          name={values.bankStatement.name}
          size={values.bankStatement.size}
          lastModified={values.bankStatement.lastModified}
          onRemove={() => setFieldValue('bankStatement', null)}
        />
      ) : (
        <DropArea getRootProps={getRootProps} getInputProps={getInputProps} />
      )}

      <Error name="bankStatement" />
    </div>
  );
}

export function TransactionDropzone() {
  const { values, setFieldValue, setFieldError } =
    useFormikContext<FormValuesBase>();

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'application/pdf': [], 'image/jpeg': [], 'image/png': [] },
    maxSize: MB_5,
    multiple: false,
    onDrop: (files) => {
      const f = files[0];
      if (!f) return;
      setFieldError('invoice', undefined);
      setFieldValue('invoice', f);
    },
    onDropRejected: (rejections) => {
      const r = rejections[0];
      const tooBig = r?.errors?.some((e) => e.code === 'file-too-large');
      const wrongType = r?.errors?.some((e) => e.code === 'file-invalid-type');
      if (tooBig) setFieldError('invoice', 'File must be 5MB or smaller');
      else if (wrongType)
        setFieldError('invoice', 'Only PDF/JPEG/PNG are allowed');
      else setFieldError('invoice', 'Unable to accept this file');
    },
  });

  return (
    <div>
      <label>
        <p className="text-sm font-medium text-raisin">Transaction Invoice *</p>
        <p className="text-sm text-[#645D5D] -mt-1 mb-2">
          <button
            type="button"
            className="text-mikado underline"
            onClick={() => alert('Open invoice creator')}
          >
            Click here
          </button>{' '}
          to instantly create an invoice
        </p>
      </label>

      {values.invoice ? (
        <UploadedFileRow
          name={values.invoice.name}
          size={values.invoice.size}
          lastModified={values.invoice.lastModified}
          onRemove={() => setFieldValue('invoice', null)}
        />
      ) : (
        <DropArea getRootProps={getRootProps} getInputProps={getInputProps} />
      )}

      <Error name="invoice" />
    </div>
  );
}

function UploadedFileRow({
  name,
  size,
  lastModified,
  onRemove,
}: {
  name: string;
  size: number;
  lastModified: number;
  onRemove: () => void;
}) {
  return (
    <div className="mt-1 border border-dashed border-[#DCDCDC] rounded-md p-4 flex items-center justify-between">
      <div className="flex items-center">
        <span className="bg-[#E7F6EC] p-3 rounded-full">
          <CheckCircle className="text-green-500" size={24} />
        </span>
        <div className="ml-2">
          <p className="font-medium text-black break-all">{name}</p>
          <p className="text-sm text-gray-500">
            {new Date(lastModified).toLocaleDateString()} •{' '}
            {(size / (1024 * 1024)).toFixed(1)} MB
          </p>
        </div>
      </div>
      <button type="button" onClick={onRemove} aria-label="Remove file">
        <Trash2 className="text-red-500" size={24} />
      </button>
    </div>
  );
}

function DropArea({
  getRootProps,
  getInputProps,
}: {
  getRootProps: ReturnType<typeof useDropzone>['getRootProps'];
  getInputProps: ReturnType<typeof useDropzone>['getInputProps'];
}) {
  return (
    <div
      {...getRootProps()}
      className="mt-1 border-dashed border-[1.5px] border-[#DCDCDC] rounded-md p-6 flex gap-4 items-center justify-start cursor-pointer"
    >
      <input {...getInputProps()} />
      <span className="bg-[#F0F2F5] p-3 rounded-full">
        <UploadCloud className="text-[#797979]" size={32} />
      </span>
      <span className="flex flex-col items-start">
        <span className="mt-2 text-[#E2A109] underline font-medium">
          Upload
        </span>
        <span className="text-sm text-gray-500 mt-1">
          .pdf, .jpeg, .png • Max. 5MB
        </span>
      </span>
    </div>
  );
}
