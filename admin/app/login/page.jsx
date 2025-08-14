import Image from "next/image";
const Login = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-[#F8F8F8]">
      <div className="shadow-custom py-8 px-16 space-y-[22px] bg-white rounded-xl">
        <Image src="/synafare-yellow.svg" alt="Logo" width={93.63} height={59} className="mx-auto" />
        <form action="" className="space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-[34px] font-medium text-resin-black">Welcome to Synafare-Admin</h1>
            <p className="text-brown-700 text-sm">Provide your information to Login</p>
          </div>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="font-medium block text-sm text-resin-black" htmlFor="">
                Email Address
              </label>
              <input
                type="text"
                className="border-gray-300 block w-full border p-4 rounded-[6px] placeholder:text-gray-400 placeholder:text-[14px] placeholder:font-dm-sans"
                placeholder="you@email.com"
              />
            </div>
            <div className="space-y-1">
              <label className="font-medium block text-sm text-resin-black" htmlFor="">
                Password
              </label>
              <input
                type="password"
                className="border-gray-300 block w-full border p-4 rounded-[6px] placeholder:text-gray-400 placeholder:text-[14px] placeholder:font-dm-sans"
                placeholder="Enter your password"
              />
            </div>
          </div>
          {/* Button */}
          <button className="bg-mikado-yellow rounded-lg block py-4 w-full text-center cursor-pointer text-resin-black font-medium">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
