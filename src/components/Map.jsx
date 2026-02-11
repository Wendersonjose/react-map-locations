import React, { useEffect, useState, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import useStore from '../store/useStore';
import { toast } from 'sonner';

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
   Captura clique no mapa
================================= */
const LocationMarker = () => {
  const { setSelectedLocation } = useStore();

  useMapEvents({
    click(e) {
      setSelectedLocation({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        name: ''
      });
    }
  });

  return null;
};

/* ================================
   Atualiza posição do mapa (flyTo)
================================= */
const MapUpdater = () => {
  const map = useMap();
  const { mapCenter, mapZoom } = useStore();

  useEffect(() => {
    if (mapCenter) {
      map.flyTo(mapCenter, mapZoom || 13, {
        duration: 1.2
      });
    }
  }, [mapCenter, mapZoom, map]);

  return null;
};

/* ================================
   Marcador temporário com popup auto
================================= */
const TemporaryMarker = ({ position, children }) => {
  const markerRef = useRef(null);

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.openPopup();
    }
  }, [position]);

  return (
    <Marker ref={markerRef} position={position} opacity={0.8}>
      {children}
    </Marker>
  );
};

/* ================================
   Formulário dentro do Popup
   (CORREÇÃO DO DUPLO CLICK AQUI)
================================= */
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

/* ================================
   Componente Principal do Mapa
================================= */
const MapComponent = () => {
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

    // Fecha popup após salvar (evita clique acidental)
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
    <MapContainer
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
    </MapContainer>
  );
};

export default MapComponent;
