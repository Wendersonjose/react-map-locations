import React, { useState } from 'react';
import useStore from '../store/useStore';
import { Trash2, MapPin, Search as SearchIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

/**
 * Componente Sidebar (Barra Lateral).
 * Responsável por:
 * 1. Buscar novos locais via API Nominatim.
 * 2. Listar locais salvos (favoritos).
 * 3. Permitir navegação (centralizar mapa) e exclusão de favoritos.
 */
const Sidebar = () => {
  const { favorites, removeFavorite, setMapCenter, setSelectedLocation } = useStore();
  
  // Estado local para o input de busca
  const [query, setQuery] = useState('');
  // Estado que dispara a busca (apenas quando o usuário submete o form)
  const [searchTrigger, setSearchTrigger] = useState('');

  /**
   * Função de busca assíncrona.
   * Chama a API do OpenStreetMap (Nominatim).
   */
  const searchPlaces = async () => {
    if (!searchTrigger) return null;
    try {
      const { data } = await axios.get(`https://nominatim.openstreetmap.org/search`, {
        params: {
          q: searchTrigger,
          format: 'json',
          limit: 1 // Limita a 1 resultado para simplicidade
        }
      });
      return data;
    } catch (error) {
      throw new Error('Falha na conexão com o serviço de busca');
    }
  };

  /**
   * React Query Hook.
   * Gerencia cache, estados de loading e erro da busca.
   * A busca só é executada (enabled) quando 'searchTrigger' tem valor.
   */
  const { data, isLoading, isError } = useQuery({
    queryKey: ['search', searchTrigger],
    queryFn: searchPlaces,
    enabled: !!searchTrigger,
    retry: 1,
  });

  // Handler para submissão do formulário de busca
  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) {
      toast.warning('Digite um endereço para buscar.');
      return;
    }
    setSearchTrigger(query);
  };

  // Handler para remover favorito (com stopPropagation para não ativar o clique do card)
  const handleRemove = (e, id, name) => {
    e.stopPropagation();
    removeFavorite(id);
    toast.success(`Local "${name}" removido!`);
  };

  // Efeitos colaterais para feedback visual (Toasts) baseados no estado da query
  React.useEffect(() => {
    if (isLoading) {
      toast.info('Buscando local...', { id: 'search-toast' });
    }
  }, [isLoading]);

  React.useEffect(() => {
    if (isError) {
      toast.error('Erro ao buscar o local. Tente novamente.', { id: 'search-toast' });
    }
  }, [isError]);

  // Efeito para processar o resultado da busca
  React.useEffect(() => {
    if (data) {
      if (data.length > 0) {
        toast.success('Local encontrado!', { id: 'search-toast' });
        const place = data[0];
        const lat = parseFloat(place.lat);
        const lng = parseFloat(place.lon);
        
        // Atualiza o mapa globalmente para o local encontrado
        setMapCenter([lat, lng]);
        setSelectedLocation({ lat, lng, name: place.display_name });
      } else {
        toast.warning('Local não encontrado.', { id: 'search-toast' });
      }
    }
  }, [data, setMapCenter, setSelectedLocation]);

  return (
    <div className="w-full md:w-80 bg-white shadow-xl z-20 flex flex-col h-1/2 md:h-full border-r border-gray-200">
      {/* Cabeçalho da Sidebar */}
      <div className="p-4 bg-blue-600 text-white shadow-md">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <MapPin /> Meus Locais
        </h1>
      </div>

      {/* Área de Busca */}
      <div className="p-4 border-b bg-gray-50">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Buscar endereço..."
            className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            type="submit" 
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? '...' : <SearchIcon size={20} />}
          </button>
        </form>
      </div>

      {/* Lista de Favoritos */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-60">
            <MapPin size={48} className="mb-2" />
            <p>Nenhum local salvo.</p>
          </div>
        ) : (
          favorites.map((fav) => (
            <div 
              key={fav.id} 
              className="p-3 border rounded-lg bg-white shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group flex justify-between items-center"
              // Ao clicar no card, centraliza o mapa e seleciona o local
              onClick={() => {
                setMapCenter([fav.lat, fav.lng]);
                setSelectedLocation(fav);
              }}
            >
              <div className="flex-1 min-w-0 pr-2">
                <h3 className="font-semibold text-gray-800 truncate">{fav.name}</h3>
                <p className="text-xs text-gray-500 truncate">
                  {fav.lat.toFixed(4)}, {fav.lng.toFixed(4)}
                </p>
              </div>
              <button 
                onClick={(e) => handleRemove(e, fav.id, fav.name)}
                className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                title="Remover"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;
