/**
 * Store global da aplicação usando Zustand.
 * Responsável por gerenciar o estado dos locais favoritos, seleção no mapa e configuração de visualização.
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useStore = create(
  persist(
    (set) => ({
      // Lista de locais salvos pelo usuário
      favorites: [],
      
      // Local temporariamente selecionado no mapa (click ou busca)
      // Formato: { lat: number, lng: number, name?: string }
      selectedLocation: null, 
      
      // Centro atual do mapa (padrão: Uberlândia)
      mapCenter: [-18.9186, -48.2772], 
      
      // Ação: Adiciona um novo favorito à lista
      // Gera um ID único baseado no timestamp atual
      addFavorite: (favorite) => set((state) => ({ 
        favorites: [...state.favorites, { ...favorite, id: Date.now() }] 
      })),
      
      // Ação: Remove um favorito pelo ID
      removeFavorite: (id) => set((state) => ({ 
        favorites: state.favorites.filter((f) => f.id !== id) 
      })),
      
      // Ação: Define o local selecionado atual (para exibir popup ou marcador temporário)
      setSelectedLocation: (location) => set({ selectedLocation: location }),
      
      // Ação: Atualiza o centro do mapa (usado ao clicar na sidebar ou buscar)
      setMapCenter: (center) => set({ mapCenter: center }),
    }),
    {
      // Configuração do middleware de persistência
      name: 'favorites-storage', // Nome da chave no localStorage
    }
  )
)

export default useStore
