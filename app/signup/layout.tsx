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
      <div className="w-full  mx-auto px-[22px] py-4 flex justify-between items-center border border-b-[#F0F2F5]">
        <AuthNav />
        <div className="flex">
          <a
            href="/login"
            className="text-sm font-medium underline text-mikado md:hidden"
          >
            Login
          </a>
          <a
            href="/login"
            className="text-sm hidden md:block font-medium text-raisin"
          >
            Already have an account? {' '}
            <span className="underline text-sm font-medium text-mikado">
              Login
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
