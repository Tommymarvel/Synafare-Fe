// app/components/wallet/Panel.tsx
export default function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 rounded-xl border border-yellow-100 bg-yellow-50 p-4 text-sm text-neutral-800">
      {children}
    </div>
  );
}
