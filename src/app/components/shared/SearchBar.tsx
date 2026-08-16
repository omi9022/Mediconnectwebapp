import React from 'react';
import { Search, Filter, Download } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  showFilter?: boolean;
  filterValue?: string;
  onFilterChange?: (value: string) => void;
  filterOptions?: Array<{ value: string; label: string }>;
  showDownload?: boolean;
  onDownload?: () => void;
  className?: string;
}

/**
 * Shared search and filter bar component
 */
export const SearchBar = ({
  searchQuery,
  onSearchChange,
  placeholder = 'Search...',
  showFilter = false,
  filterValue = 'all',
  onFilterChange,
  filterOptions = [],
  showDownload = false,
  onDownload,
  className = ''
}: SearchBarProps) => {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {/* Search Input */}
      <div className="flex-1 min-w-[200px] relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Filter Dropdown */}
      {showFilter && onFilterChange && (
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
          <select
            value={filterValue}
            onChange={(e) => onFilterChange(e.target.value)}
            className="pl-10 pr-8 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
          >
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Download Button */}
      {showDownload && onDownload && (
        <button
          onClick={onDownload}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Download size={18} />
          Export
        </button>
      )}
    </div>
  );
};
