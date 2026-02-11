import React, { useEffect, useState, useRef } from 'react';
import {
  MapContainer as LeafletMapContainer,
  TileLayer,
  Marker,
  Popup
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import useStore from '../../../store/useStore';
import { toast } from 'sonner';

import MapUpdater from './MapUpdater';
import LocationMarker from './LocationMarker';
import TemporaryMarker from './TemporaryMarker';
import LocationPopupForm from './LocationPopupForm';

/* ================================
   Correção do ícone padrão Leaflet
================================= */
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

/* ================================
   Componente Mapa Principal
================================= */
const MapContainer = () => {
  const {
    favorites,
    selectedLocation,
    addFavorite,
    mapCenter,
    mapZoom,
    removeFavorite,
    setSelectedLocation
  } = useStore();

  const handleSave = (name) => {
    if (!selectedLocation) return;

    addFavorite({ ...selectedLocation, name });

    toast.success("Local salvo com sucesso!");

    // Fecha popup após salvar
    setSelectedLocation(null);
  };

  const handleRemove = (id) => {
    removeFavorite(id);
    toast.success("Local removido dos favoritos.");
  };

  const isSelectedSaved = favorites.some(
    (f) =>
      f.lat === selectedLocation?.lat &&
      f.lng === selectedLocation?.lng
  );

  return (
    <LeafletMapContainer
      center={mapCenter}
      zoom={mapZoom || 13}
      style={{ height: "100%", width: "100%" }}
      className="z-0 outline-none"
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapUpdater />
      <LocationMarker />

      {/* Favoritos */}
      {favorites.map((fav) => (
        <Marker key={fav.id} position={[fav.lat, fav.lng]}>
          <Popup>
            <div className="p-2 min-w-[150px]">
              <h3 className="font-bold text-lg text-gray-800">
                {fav.name}
              </h3>

              <p className="text-xs text-gray-500 mb-2">
                {Number(fav.lat).toFixed(4)},{" "}
                {Number(fav.lng).toFixed(4)}
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
          position={[
            selectedLocation.lat,
            selectedLocation.lng
          ]}
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
