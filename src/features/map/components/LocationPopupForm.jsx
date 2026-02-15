import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { toast } from 'sonner';
import {
  MapPin,
  Utensils,
  TreePine,
  Briefcase,
  ShoppingBag,
  Home,
} from 'lucide-react';

export const CATEGORIES = [
  { id: 'geral', label: 'Geral', icon: MapPin, bgColor: 'bg-blue-500', textColor: 'text-blue-500', hex: '#3b82f6' },
  { id: 'restaurante', label: 'Restaurante', icon: Utensils, bgColor: 'bg-orange-500', textColor: 'text-orange-500', hex: '#f97316' },
  { id: 'parque', label: 'Parque', icon: TreePine, bgColor: 'bg-green-500', textColor: 'text-green-500', hex: '#22c55e' },
  { id: 'trabalho', label: 'Trabalho', icon: Briefcase, bgColor: 'bg-gray-600', textColor: 'text-gray-600', hex: '#4b5563' },
  { id: 'compras', label: 'Compras', icon: ShoppingBag, bgColor: 'bg-purple-500', textColor: 'text-purple-500', hex: '#a855f7' },
  { id: 'casa', label: 'Casa', icon: Home, bgColor: 'bg-indigo-500', textColor: 'text-indigo-500', hex: '#6366f1' },
];

/**
 * Formulário exibido no Popup ao clicar no mapa.
 * Permite nomear e categorizar o local antes de salvar.
 * @param {string} initialName - Nome inicial (opcional, vindo da busca reversa)
 * @param {function} onSave - Callback ao salvar (name, category)
 */
const LocationPopupForm = ({ initialName, onSave }) => {
  const [name, setName] = useState(initialName || '');
  const [category, setCategory] = useState('geral');
  const containerRef = useRef(null);

  // Atualiza o nome quando a prop initialName muda (ex: carregamento reverso)
  useEffect(() => {
    if (initialName) setName(initialName);
  }, [initialName]);

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
    onSave(name.trim(), category);
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col gap-3 p-1 min-w-[240px]"
    >
      <h3 className="font-semibold text-gray-700">
        Adicionar aos Favoritos
      </h3>

      <div>
        <label className="text-xs text-gray-500 mb-1 block">Nome do Local</label>
        <input
          className="border p-2 rounded text-sm w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
          placeholder="Ex: Minha Casa"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave();
          }}
        />
      </div>

      <div>
        <label className="text-xs text-gray-500 mb-1 block">Categoria</label>
        <div className="grid grid-cols-3 gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={`flex flex-col items-center justify-center p-2 rounded border text-xs transition-colors ${
                category === cat.id
                  ? 'bg-blue-50 border-blue-400 text-blue-700'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <cat.icon 
                size={16} 
                className={`mb-1 ${category === cat.id ? cat.textColor : 'text-gray-400'}`} 
              />
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={handleSave}
        className="bg-green-500 text-white px-3 py-2 rounded text-sm hover:bg-green-600 w-full transition-colors font-medium shadow-sm mt-1"
      >
        Salvar Local
      </button>
    </div>
  );
};

export default LocationPopupForm;
