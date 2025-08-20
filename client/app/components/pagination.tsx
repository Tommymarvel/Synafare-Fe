const Pagination = () => {
  return (
    <div className="flex justify-between w-full">
      <div className="border border-gray-300 py-2 px-4 rounded-lg flex gap-x-2">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15.8332 9.99996H4.1665M4.1665 9.99996L9.99984 15.8333M4.1665 9.99996L9.99984 4.16663"
            stroke="#1D1C1D"
            strokeWidth="1.67"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Previous
      </div>
      <ul className="flex gap-x-[2px]">
        <li>
          <a
            href=""
            className="flex items-center justify-center w-10 h-10 bg-secondary-4 rounded-sm"
          >
            1
          </a>
        </li>
        <li>
          <a href="" className="flex items-center justify-center w-10 h-10">
            2
          </a>
        </li>
        <li>
          <a href="" className="flex items-center justify-center w-10 h-10">
            3
          </a>
        </li>
        <li>
          <span className="flex justify-center items-end w-10 h-10 py-[10px] text-center">
            ...
          </span>
        </li>
        <li>
          <a href="" className="flex items-center justify-center w-10 h-10">
            8
          </a>
        </li>
        <li>
          <a href="" className="flex items-center justify-center w-10 h-10">
            9
          </a>
        </li>
        <li>
          <a href="" className="flex items-center justify-center w-10 h-10">
            10
          </a>
        </li>
      </ul>
      <div className="border border-gray-300 py-2 px-4 rounded-lg flex gap-x-2">
        Next
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.1665 9.99996H15.8332M15.8332 9.99996L9.99984 4.16663M15.8332 9.99996L9.99984 15.8333"
            stroke="#1D1C1D"
            strokeWidth="1.67"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};

export default Pagination;
