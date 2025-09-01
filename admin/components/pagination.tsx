interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPrevious: () => void;
  onNext: () => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  onPrevious,
  onNext,
}: PaginationProps) => {
  // Generate page numbers to display
  const getVisiblePages = () => {
    const delta = 2; // Number of pages to show around current page
    const range = [];
    const rangeWithDots = [];

    // Calculate start and end of visible page range
    const start = Math.max(1, currentPage - delta);
    const end = Math.min(totalPages, currentPage + delta);

    // Generate the range
    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    // Add dots and edge pages if necessary
    if (start > 1) {
      rangeWithDots.push(1);
      if (start > 2) {
        rangeWithDots.push('...');
      }
    }

    rangeWithDots.push(...range);

    if (end < totalPages) {
      if (end < totalPages - 1) {
        rangeWithDots.push('...');
      }
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex justify-between w-full items-center">
      <button
        onClick={onPrevious}
        disabled={currentPage === 1}
        className={`border border-gray-300 py-2 px-4 rounded-lg flex gap-x-2 items-center ${
          currentPage === 1
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-gray-50 cursor-pointer'
        }`}
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

      <div className="flex items-center gap-1">
        <span className="text-sm text-gray-600 mr-4">
          Page {currentPage} of {totalPages}
        </span>

        <ul className="flex gap-x-[2px]">
          {visiblePages.map((page, index) => (
            <li key={index}>
              {page === '...' ? (
                <span className="flex justify-center items-center w-10 h-10 py-[10px] text-center">
                  ...
                </span>
              ) : (
                <button
                  onClick={() => onPageChange(page as number)}
                  className={`flex items-center justify-center w-10 h-10 rounded-xs ${
                    page === currentPage
                      ? 'bg-secondary-4 text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={onNext}
        disabled={currentPage === totalPages}
        className={`border border-gray-300 py-2 px-4 rounded-lg flex gap-x-2 items-center ${
          currentPage === totalPages
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-gray-50 cursor-pointer'
        }`}
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
