export const fmtNaira = (n: number) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(
    n ?? 0
  );

export const fmtDate = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleString('en-NG', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
    : '---';

export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, ''); // Remove non-numeric characters
  if (cleaned.length === 11 && cleaned.startsWith('0')) {
    return `+234 ${cleaned.slice(1, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(
      7
    )}`;
  } else if (cleaned.length === 13 && cleaned.startsWith('234')) {
    return `+234 ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(
      9
    )}`;
  }
  return phone; // Return as-is if it doesn't match expected formats
};
