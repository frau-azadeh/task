import React from 'react';

interface FilterProps {
  onFilterChange: (status: string) => void;
}

const StatusFilter: React.FC<FilterProps> = ({ onFilterChange }) => {
  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange(event.target.value);
  };

  return (
    <select
      className="border border-gray-300 p-3 rounded-lg mb-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
      onChange={handleFilterChange}
    >
      <option value="">All Statuses</option>
      <option value="To Do">To Do</option>
      <option value="In Progress">In Progress</option>
      <option value="Done">Done</option>
    </select>
  );
};

export default StatusFilter;