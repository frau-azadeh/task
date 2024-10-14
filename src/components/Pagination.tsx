'use client';

import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="flex justify-center my-4">
      <button className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-blue-600" onClick={handlePrev} disabled={currentPage === 1}>
        Previous
      </button>
      <span className="px-4 py-2">{`Page ${currentPage} of ${totalPages}`}</span>
      <button className="bg-blue-500 text-white px-4 py-2 rounded-lg ml-2 hover:bg-blue-600" onClick={handleNext} disabled={currentPage === totalPages}>
        Next
      </button>
    </div>
  );
};

export default Pagination;