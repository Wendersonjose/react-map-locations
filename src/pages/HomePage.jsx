// src/pages/HomePage.jsx
import React, { useState } from "react";
import useStore from "../store/useStore";
import useSearchLocation from "../hooks/useSearchLocation";
import MapView from "../features/map/components/MapView";
import SearchBar from "../features/locations/components/SearchBar";
import LocationList from "../features/locations/components/LocationList";
import MobileBottomSheet from "../features/locations/components/MobileBottomSheet";
import { Menu, Map as MapIcon, Compass } from "lucide-react";

export default function HomePage() {
  const {
    favorites,
    removeFavorite,
    setMapCenter,
    setSelectedLocation,
    setMapZoom,
  } = useStore();

  const { onSearch, isLoading } = useSearchLocation();

  // Desktop sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLocationSelect = (fav) => {
    setMapCenter([fav.lat, fav.lng]);
    setSelectedLocation(fav);
    setMapZoom(16);
  };

  const handleLocationRemove = (id, name) => {
    removeFavorite(id);
    // Reseta o mapa para o centro de Uberlândia ao excluir
    setMapCenter([-18.9186, -48.2772]);
    setMapZoom(13);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-100 flex flex-col md:flex-row">
      {/* --- DESKTOP SIDEBAR --- */}
      <div
        className={`hidden md:flex flex-col h-full bg-white shadow-xl z-20 transition-all duration-300 ${isSidebarOpen ? "w-96" : "w-0 overflow-hidden"}`}
      >
        <div className="p-4 bg-blue-600 text-white shadow-md flex justify-between items-center">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <MapIcon /> Meus Locais
          </h1>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden">
            {/* Close button internal? */}
          </button>
        </div>

        <LocationList
          items={favorites}
          onSelect={handleLocationSelect}
          onRemove={handleLocationRemove}
        />
      </div>

      {/* --- MAIN CONTENT (MAP + OVERLAYS) --- */}
      <div className="flex-1 relative h-full w-full">
        {/* Desktop Controls (Toggle + Search) */}
        {/* Desktop Controls (Toggle + Search) */}
        <div className="hidden md:flex absolute top-4 left-4 z-[1000] gap-4 items-start pointer-events-none">
          {/* Toggle Button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="relative z-[1100] bg-white p-2.5 rounded shadow-md hover:bg-gray-50 text-gray-600 pointer-events-auto transition-colors"
            title={isSidebarOpen ? "Fechar menu" : "Abrir menu"}
          >
            <Menu size={24} />
          </button>

          {/* Search Bar */}
          <div className="relative z-[1000] w-80 pointer-events-auto">
            <SearchBar onSearch={onSearch} isLoading={isLoading} />
          </div>
        </div>

        {/* Search Bar Overlay (Mobile ONLY) */}
        {/* Adicionei z-index alto para ficar acima do mapa */}
        <div
          className={`md:hidden absolute top-0 left-0 right-0 z-[1000] p-4 pointer-events-none flex justify-center`}
        >
          <div className="pointer-events-auto w-full max-w-md">
            <SearchBar onSearch={onSearch} isLoading={isLoading} />
          </div>
        </div>

        {/* Map View */}
        <div className="w-full h-full z-0">
          <MapView />
        </div>

        {/* --- MOBILE BOTTOM SHEET --- */}
        <MobileBottomSheet
          favorites={favorites}
          onSelect={handleLocationSelect}
          onRemove={handleLocationRemove}
        />

        {/* --- OPTIONAL: BOTTOM NAV (As requested "BottomNav") --- */}
        {/* Simple visual nav for mobile */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 z-[1001] pb-safe">
          <button className="flex flex-col items-center text-blue-600">
            <MapIcon size={24} />
            <span className="text-[10px] font-medium mt-1">Explorar</span>
          </button>
          <button
            className="flex flex-col items-center text-gray-400"
            onClick={() => {
              // Could toggle sheet
              document
                .querySelector('[aria-label="Expandir lista de locais"]')
                ?.click();
            }}
          >
            <Compass size={24} />
            <span className="text-[10px] font-medium mt-1">Salvos</span>
          </button>
        </div>
      </div>
    </div>
  );
}
