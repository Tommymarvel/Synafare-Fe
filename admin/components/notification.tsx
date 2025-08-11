import Image from "next/image";

const Notification = () => {
  return (
    <nav className="border-b border-b-[#E4E7EC] py-[14px] flex justify-end ">
      <div className="flex gap-x-7 content-container">
        <div className="rounded-full bg-[#F6F6F6] h-10 w-10 flex items-center justify-center">
          <div className="relative">
            <span className="absolute top-0 right-0 bg-mikado-yellow text-[10px] flex items-center justify-center w-[14px] h-[14px] rounded-full font-semibold text-resin-black">
              15
            </span>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M15.1669 3.49984C15.1669 2.8555 14.6446 2.33317 14.0002 2.33317C13.3559 2.33317 12.8336 2.8555 12.8336 3.49984V5.24984C12.8336 5.28219 12.8349 5.31424 12.8375 5.34593C9.52488 5.89954 7.00023 8.7787 7.00023 12.2486V16.9165C7.00023 17.5 6.52177 18.512 5.99817 19.4448C5.26139 20.7572 5.39633 22.3396 6.80295 22.8752C8.21768 23.4139 10.4807 23.9165 14.0002 23.9165C17.5198 23.9165 19.7828 23.4139 21.1975 22.8752C22.6041 22.3396 22.7391 20.7572 22.0023 19.4448C21.4787 18.512 21.0002 17.5 21.0002 16.9165V12.2491C21.0002 8.77926 18.4756 5.89964 15.163 5.34595C15.1656 5.31425 15.1669 5.2822 15.1669 5.24984V3.49984Z"
                fill="#1D1C1D"
              />
              <path
                d="M10.407 24.8785C10.4506 24.9165 10.5032 24.9609 10.5644 25.0099C10.7397 25.1501 10.9903 25.3319 11.3068 25.5128C11.9352 25.8719 12.8642 26.2499 14.0003 26.2499C15.1363 26.2499 16.0653 25.8719 16.6937 25.5128C17.0103 25.3319 17.2608 25.1501 17.4361 25.0099C17.4973 24.9609 17.5499 24.9165 17.5935 24.8785C16.5734 25.0055 15.3839 25.0832 14.0003 25.0832C12.6166 25.0832 11.4271 25.0055 10.407 24.8785Z"
                fill="#1D1C1D"
              />
            </svg>
          </div>
        </div>
        <span className="breaker h-[full] w-[1px] bg-gray-200 block"></span>
        <div className="flex gap-x-[9px] items-center cursor-pointer">
          <div className="flex gap-x-1 items-center">
            <Image src="/avatar.jpg" alt="Avatar" width={36} height={36} className="rounded-full w-9 h-9" />
            <p className="text-sm font-medium ">David Smith</p>
          </div>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 16.8C11.3 16.8 10.6 16.53 10.07 16L3.55002 9.48C3.26002 9.19 3.26002 8.71 3.55002 8.42C3.84002 8.13 4.32002 8.13 4.61002 8.42L11.13 14.94C11.61 15.42 12.39 15.42 12.87 14.94L19.39 8.42C19.68 8.13 20.16 8.13 20.45 8.42C20.74 8.71 20.74 9.19 20.45 9.48L13.93 16C13.4 16.53 12.7 16.8 12 16.8Z"
              fill="#1D1C1D"
            />
          </svg>
        </div>
      </div>
    </nav>
  );
};

export default Notification;
