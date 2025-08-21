interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
}: PaginationProps) => {
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      if (totalPages > 1) {
        rangeWithDots.push(totalPages);
      }
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  const handlePrevious = () => {
    if (currentPage > 1 && !disabled) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages && !disabled) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number | string) => {
    if (typeof page === 'number' && page !== currentPage && !disabled) {
      onPageChange(page);
    }
  };

  if (totalPages <= 1) {
    return null; // Don't show pagination if there's only one page
  }

  return (
    <div className="flex justify-between w-full">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1 || disabled}
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
        {visiblePages.map((page, index) => (
          <li key={index}>
            {typeof page === 'number' ? (
              <button
                onClick={() => handlePageClick(page)}
                disabled={disabled}
                className={`flex items-center justify-center w-10 h-10 rounded-sm transition-colors ${
                  page === currentPage
                    ? 'bg-secondary-4 text-white'
                    : 'hover:bg-gray-100 disabled:cursor-not-allowed'
                }`}
              >
                {page}
              </button>
            ) : (
              <span className="flex justify-center items-end w-10 h-10 py-[10px] text-center">
                {page}
              </span>
            )}
          </li>
        ))}
      </ul>

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages || disabled}
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

export default Pagination;
