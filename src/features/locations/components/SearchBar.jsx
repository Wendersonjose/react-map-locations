// src/features/locations/components/SearchBar.jsx
import React, { useState } from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ onSearch, isLoading, className = "" }) {
  const [term, setTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (!term.trim()) return;
    onSearch(term);
    setTerm(''); // Limpa o campo após a pesquisa
    // Remove o foco do input para esconder o teclado em mobile
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  return (
    <form 
      onSubmit={handleSearch}
      className={`relative w-full shadow-lg rounded-lg ${className}`}
    >
      <div className="relative group">
        <button
          type="submit"
          className="absolute inset-y-0 left-0 pl-3 flex items-center cursor-pointer hover:text-blue-600 transition-colors z-10"
          title="Buscar"
        >
          <Search size={20} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
        </button>
        <input
          type="search"
          className="block w-full pl-10 pr-4 py-3 bg-white border-0 rounded-lg text-gray-900 placeholder-gray-500 ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm transition-all text-base"
          placeholder="Buscar local ou endereço..."
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          disabled={isLoading}
        />
        {isLoading && (
          <div className="absolute right-3 top-3.5">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </form>
  );
}
