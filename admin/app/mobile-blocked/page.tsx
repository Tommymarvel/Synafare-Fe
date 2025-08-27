export default function MobileBlocked() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">
          Mobile Access Blocked
        </h1>
        <p className="mt-3 text-gray-600">
          This admin portal is only accessible from a desktop browser. Please
          switch to a desktop device to continue.
        </p>
      </div>
    </main>
  );
}
