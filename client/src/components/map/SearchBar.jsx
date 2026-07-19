import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ onSelect }) => {
  return (
    <div className="relative w-full shadow-md rounded-lg overflow-hidden bg-white">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-gray-400" />
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-3 py-2.5 border-transparent focus:border-blue-500 focus:ring-blue-500 text-sm placeholder-gray-400 outline-none"
        placeholder="Search gates, parking, medical..."
        onChange={(e) => {
          // Future AI search integration here
        }}
      />
    </div>
  );
};

export default SearchBar;
