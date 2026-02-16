// src/features/locations/components/MobileBottomSheet.jsx
import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import LocationList from './LocationList';

export default function MobileBottomSheet({ 
  favorites, 
  onSelect, 
  onRemove, 
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Calcula a altura do bottom sheet based on open/closed state
  const heightStyle = isOpen ? 'h-[60vh] md:h-auto' : 'h-[100px] md:h-auto';

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-[1000] bg-white rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)] transition-all duration-300 md:hidden flex flex-col`}
      style={{ height: isOpen ? '60%' : '140px' }}
    >
      {/* Handle / Pull Tab */}
      <div 
        className="flex items-center justify-center p-3 cursor-pointer select-none active:text-blue-600"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Minimizar lista de locais" : "Expandir lista de locais"}
      >
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mb-1"></div>
      </div>
      
      <div className="flex justify-between items-center px-6 pb-2 border-b border-gray-100">
        <h3 className="font-bold text-gray-800 text-lg">Meus Locais ({favorites.length})</h3>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-400 p-2 hover:bg-gray-50 rounded-full"
        >
          {isOpen ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden pt-2">
        <LocationList 
          items={favorites} 
          onSelect={(fav) => {
            onSelect(fav);
            setIsOpen(false); // fecha ao selecionar
          }} 
          onRemove={onRemove} 
          title=""
        />
      </div>
    </div>
  );
}
