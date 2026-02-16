// src/features/locations/components/LocationList.jsx
import React from 'react';
import { Trash2, MapPin } from 'lucide-react';
import { CATEGORIES } from './LocationForm';

export default function LocationList({ 
  items, 
  onSelect, 
  onRemove, 
  title = "Favoritos" 
}) {
  if (!items.length) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-gray-400">
        <MapPin size={48} className="mb-3 opacity-30" />
        <p>Nenhum local salvo.</p>
      </div>
    );
  }

  return (
    <div 
      className="flex-1 overflow-y-auto max-h-[40vh] md:max-h-full pb-20 md:pb-4 px-4 bg-white"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      <style>
        {`
          div::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
      <h2 className="text-lg font-bold mb-3 md:hidden sticky top-0 bg-white pt-4 pb-2 text-gray-800">
        {title}
      </h2>
      <ul className="space-y-3">
        {items.map((fav) => {
          const catConfig = CATEGORIES.find(c => c.id === fav.category) || CATEGORIES[0];
          const Icon = catConfig.icon;
          
          return (
            <li
              key={fav.id}
              className="group flex items-center justify-between p-3 md:p-2 border border-gray-200 rounded-xl md:rounded-lg hover:shadow-md hover:border-blue-400 cursor-pointer bg-white transition-all active:scale-[0.98]"
              onClick={() => onSelect(fav)}
            >
              <div className="flex items-center gap-3 md:gap-2 overflow-hidden flex-1">
                <div className={`p-2.5 md:p-2 rounded-full ${catConfig.bgColor} text-white shrink-0`}>
                  <Icon size={20} className="md:w-4 md:h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 truncate md:text-sm">
                    {fav.name}
                  </h3>
                  <p className="text-xs text-gray-500 truncate flex items-center gap-1">
                    <span className="font-medium shrink-0">{catConfig.label}</span>
                    <span className="opacity-50">•</span>
                    <span className="truncate block flex-1">{fav.lat.toFixed(4)}, {fav.lng.toFixed(4)}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(fav.id, fav.name);
                }}
                className="p-2 md:p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-100 shrink-0 ml-2"
                title="Remover"
              >
                <Trash2 size={18} className="md:w-4 md:h-4" />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
