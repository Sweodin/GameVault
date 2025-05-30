import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = 'Search...' 
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md">
      <input
        type="text"
        placeholder={placeholder}
        className="bg-gray-800 border border-gray-700 focus:border-cyan-500 text-white rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className="absolute left-3 top-2.5 text-gray-400">
        <i className="fas fa-search"></i>
      </div>
      <button 
        type="submit" 
        className="absolute right-2 top-1.5 text-gray-400 hover:text-cyan-400 transition-colors"
      >
        <i className="fas fa-arrow-right"></i>
      </button>
    </form>
  );
};

export default SearchBar;