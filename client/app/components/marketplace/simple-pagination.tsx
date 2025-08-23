interface SimplePaginationProps {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

const SimplePagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}: SimplePaginationProps) => {
  const handlePrevious = () => {
    if (currentPage > 1 && onPageChange) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages && onPageChange) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(
          1,
          '...',
          currentPage - 1,
          currentPage,
          currentPage + 1,
          '...',
          totalPages
        );
      }
    }

    return pages;
  };

  return (
    <div className="flex justify-between w-full">
      <button
        onClick={handlePrevious}
        disabled={currentPage <= 1}
        className="border border-gray-300 py-2 px-4 rounded-lg flex gap-x-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
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
      </button>

      <ul className="flex gap-x-[2px]">
        {getPageNumbers().map((pageNum, index) => (
          <li key={index}>
            {pageNum === '...' ? (
              <span className="flex justify-center items-end w-10 h-10 py-[10px] text-center">
                ...
              </span>
            ) : (
              <button
                onClick={() => handlePageClick(pageNum as number)}
                className={`flex items-center justify-center w-10 h-10 rounded-sm ${
                  currentPage === pageNum
                    ? 'bg-secondary-4 text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                {pageNum}
              </button>
            )}
          </li>
        ))}
      </ul>

      <button
        onClick={handleNext}
        disabled={currentPage >= totalPages}
        className="border border-gray-300 py-2 px-4 rounded-lg flex gap-x-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
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
      </button>
    </div>
  );
};

export default SimplePagination;
