'use client';

export const MB_5 = 5 * 1024 * 1024;
export const ALLOWED_MIMES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
] as const;

export function computeDownpayment(costStr: string, pctStr: string | '') {
  const cost = Number(costStr || 0);
  const pct = Number(pctStr || 0);
  if (!cost || !pct) return 0;
  return Math.round(cost * (pct / 100));
}

export function isAllowedType(f?: File | null) {
  return (
    !!f && ALLOWED_MIMES.includes(f.type as (typeof ALLOWED_MIMES)[number])
  );
}
