'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/app/components/ui/Button';
import EditBusinessModal, { BusinessFormValues } from './EditBusinessModal';
import { useAuth } from '@/context/AuthContext';

type Business = {
  _id: string;
  logo?: string | null; // URL
  business_name: string;
  reg_number: string;
  business_address: string;
  city: string;
  state: string;
  country: string;
};

export default function BusinessInfoPanel() {
  const { user, loading, refreshUser } = useAuth();
  const [open, setOpen] = useState(false);

  const business: Business | null = useMemo(() => {
    const b = user?.business;
    if (!b) return null;
    return {
      _id: b._id,
      logo: b.business_logo ?? null,
      business_name: b.business_name ?? '',
      reg_number: b.reg_number ?? '',
      business_address: b.business_address ?? '',
      city: b.city ?? '',
      state: b.state ?? '',
      country: b.country ?? '',
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    user?.business?._id,
    user?.business?.business_logo,
    user?.business?.business_name,
    user?.business?.reg_number,
    user?.business?.business_address,
    user?.business?.city,
    user?.business?.state,
    user?.business?.country,
  ]);

  const initialFormValues: BusinessFormValues = {
    businessId: business?._id || '',
    businessName: business?.business_name || '',
    rcNumber: business?.reg_number || '',
    address: business?.business_address || '',
    city: business?.city || '',
    state: business?.state || '',
    country: business?.country || 'Nigeria',
    logoFile: null,
    logoPreview: business?.logo || '',
  };

  return (
    <>
      <section className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-semibold">Business Information</h3>
          </div>
          <Button onClick={() => setOpen(true)} disabled={loading || !business}>
            Edit
          </Button>
        </div>
        <div className="mt-5 grid gap-6">
          {/* Logo dropzone look */}
          <div className="rounded-xl border-2 border-dashed w-fit border-gray-200 p-6 text-center">
            {business?.logo ? (
              <div className="relative mx-auto h-24 w-40">
                <Image
                  src={business.logo}
                  alt="Business logo"
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="text-xs text-gray-500">
                Drag and drop your Logo here or{' '}
                <span className="font-medium text-gray-700">Browse</span> to
                upload
                <div className="mt-1 text-[10px] text-gray-400">
                  Supported file types : .jpg, .png
                </div>
              </div>
            )}
          </div>
          <hr />

          {/* Fields */}
          <div className="space-y-5">
            <TwoCol
              leftLabel="Business Name"
              leftValue={business?.business_name || '—'}
              rightLabel="Registration Number"
              rightValue={business?.reg_number || '—'}
            />

            <div>
              <div className="text-xs text-gray-500">Address</div>
              <div className="mt-1 text-sm font-medium text-gray-900">
                {business?.business_address || '—'}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 max-sm:grid-cols-1">
              <Kv label="City" value={business?.city || '—'} />
              <Kv label="State" value={business?.state || '—'} />
              <Kv label="Country" value={business?.country || '—'} />
            </div>
          </div>
        </div>
      </section>

      {open && business && (
        <EditBusinessModal
          open={open}
          onClose={() => setOpen(false)}
          initialValues={initialFormValues}
          onSuccess={async () => {
            await refreshUser();
            setOpen(false);
          }}
        />
      )}
    </>
  );
}

function TwoCol({
  leftLabel,
  leftValue,
  rightLabel,
  rightValue,
}: {
  leftLabel: string;
  leftValue: string;
  rightLabel: string;
  rightValue: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <Kv label={leftLabel} value={leftValue} />
      <Kv label={rightLabel} value={rightValue} />
    </div>
  );
}

function Kv({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="mt-1 text-sm font-medium text-gray-900">{value}</div>
    </div>
  );
}
