// app/auth/layout.tsx

import AuthNav from '../components/shared/AuthNav';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 1. Header */}
      <div className="w-full  mx-auto px-6 py-2 flex justify-between items-center border border-b-[#F0F2F5]">
        <AuthNav />
        <div className="flex">
          <a
            href="/signup"
            className="text-sm underline font-medium text-mikado md:hidden"
          >
            Sign Up
          </a>
          <a
            href="/signup"
            className="text-sm hidden md:block font-medium text-raisin"
          >
            Don’t have an account?{' '}
            <span className="underline text-sm font-medium text-mikado">
              Sign Up
            </span>
          </a>
        </div>
      </div>

      {/* 2. Centered form */}
      <main className="flex-grow flex items-center justify-center ">
        {children}
      </main>
    </div>
  );
}
