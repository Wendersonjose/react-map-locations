import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { toast } from 'sonner';

const LocationPopupForm = ({ initialName, onSave }) => {
  const [name, setName] = useState(initialName || '');
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      L.DomEvent.disableClickPropagation(containerRef.current);
      L.DomEvent.disableScrollPropagation(containerRef.current);
    }
  }, []);

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("O nome do local não pode ser vazio.");
      return;
    }
    onSave(name.trim());
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col gap-2 p-1 min-w-[200px]"
    >
      <h3 className="font-semibold text-gray-700">
        Adicionar aos Favoritos
      </h3>

      <input
        className="border p-2 rounded text-sm w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
        placeholder="Nome do local (ex: Casa)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoFocus
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSave();
        }}
      />

      <button
        type="button"
        onClick={handleSave}
        className="bg-green-500 text-white px-3 py-1.5 rounded text-sm hover:bg-green-600 w-full transition-colors font-medium shadow-sm"
      >
        Salvar Local
      </button>
    </div>
  );
};

export default LocationPopupForm;
