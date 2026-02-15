import React from 'react';
import {
  MapContainer as LeafletMapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import useStore from "../../../store/useStore";
import { toast } from "sonner";

import MapUpdater from "./MapUpdater";
import LocationMarker from "./LocationMarker";
import TemporaryMarker from "./TemporaryMarker";
import LocationPopupForm, { CATEGORIES } from "./LocationPopupForm";

/* ================================
   Correção do ícone padrão Leaflet
================================= */
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
}); 

L.Marker.prototype.options.icon = DefaultIcon;

/* ================================
   Função para gerar ícone SVG customizado
   ================================ */
const createCustomIcon = (category) => {
  const catConfig = CATEGORIES.find((c) => c.id === category) || CATEGORIES[0];
  const IconComponent = catConfig.icon;
  const color = catConfig.hex;

  const iconHtml = renderToStaticMarkup(
    <div className="relative flex items-center justify-center w-8 h-8">
      <div
        style={{ backgroundColor: color }}
        className="w-8 h-8 rounded-full border-2 border-white shadow-md flex items-center justify-center"
      >
        <IconComponent size={16} color="white" />
      </div>
      <div
        style={{ borderTopColor: color }}
        className="absolute -bottom-1.5 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px]"
      ></div>
    </div>
  );

  return L.divIcon({
    html: iconHtml,
    className: "custom-leaflet-icon", // Classe vazia para remover estilos padrão se necessário
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -42],
  });
};

/* ================================
   Componente Mapa Principal
   Responsável por renderizar o mapa, marcadores e gerenciar interações.
================================= */
const MapContainer = () => {
  const {
    favorites,
    selectedLocation,
    addFavorite,
    mapCenter,
    mapZoom,
    removeFavorite,
    setSelectedLocation,
  } = useStore();

  /**
   * Salva o local selecionado (temporário) como favorito.
   * Fecha o popup após o sucesso.
   */
  const handleSave = (name, category) => {
    if (!selectedLocation) return;
    addFavorite({ ...selectedLocation, name, category: category });
    toast.success("Local salvo com sucesso!");
    setSelectedLocation(null);
  };

  /**
   * Remove um local dos favoritos pelo ID.
   */
  const handleRemove = (id) => {
    removeFavorite(id);
    toast.success("Local removido dos favoritos.");
  };

  // Verifica se o local selecionado (busca/clique) já está salvo para não duplicar marcadores
  const isSelectedSaved = favorites.some(
    (f) => f.lat === selectedLocation?.lat && f.lng === selectedLocation?.lng,
  );

  return (
    <LeafletMapContainer
      center={mapCenter}
      zoom={mapZoom || 13}
      style={{ height: "100%", width: "100%" }}
      className="z-0 outline-none"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapUpdater />
      <LocationMarker />

      {/* Favoritos */}
      {favorites.map((fav) => (
        <Marker 
          key={fav.id} 
          position={[fav.lat, fav.lng]}
          icon={createCustomIcon(fav.category)}
        >
          <Popup>
            <div className="p-2 min-w-[150px]">
              <div className="flex items-center gap-2 mb-2">
                {(() => {
                  const catConfig = CATEGORIES.find(c => c.id === fav.category) || CATEGORIES[0];
                  const CatIcon = catConfig.icon;
                  return <CatIcon size={16} className={catConfig.textColor} />;
                })()}
                <h3 className="font-bold text-lg text-gray-800 leading-none">{fav.name}</h3>
              </div>

              <p className="text-xs text-gray-500 mb-2">
                {Number(fav.lat).toFixed(4)}, {Number(fav.lng).toFixed(4)}
              </p>

              <button
                onClick={() => handleRemove(fav.id)}
                className="text-red-500 text-sm hover:text-red-700 hover:bg-red-50 w-full py-1 rounded transition-colors border border-red-200"
              >
                Remover
              </button>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Marcador Temporário */}
      {selectedLocation && !isSelectedSaved && (
        <TemporaryMarker
          position={[selectedLocation.lat, selectedLocation.lng]}
        >
          <Popup offset={[0, -32]} autoPan>
            <LocationPopupForm
              initialName={selectedLocation.name}
              onSave={handleSave}
            />
          </Popup>
        </TemporaryMarker>
      )}
    </LeafletMapContainer>
  );
};

export default MapContainer;
