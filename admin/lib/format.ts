export const fmtNaira = (n: number) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(
    n ?? 0
  );

export const fmtDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString('en-NG') : '—';