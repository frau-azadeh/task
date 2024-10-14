'use client';

import React from 'react';

interface SearchBoxProps {
  onSearch: (query: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSearch }) => {
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
  };

  return (
    <input
      type="text"
      placeholder="Search by title"
      className="border border-gray-300 p-3 rounded-lg mb-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto mr-4"
      onChange={handleSearch}
    />
  );
};

export default SearchBox;