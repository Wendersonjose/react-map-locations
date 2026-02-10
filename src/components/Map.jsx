import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import useStore from '../store/useStore';
import { toast } from 'sonner';

/**
 * Correção para o ícone padrão do Leaflet que não carrega corretamente no Webpack/Vite.
 * Redefine os caminhos dos ícones manualmente.
 */
const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

/**
 * Subcomponente para capturar cliques no mapa.
 * Utiliza o hook useMapEvents do React Leaflet.
 * Quando o usuário clica, atualiza o 'selectedLocation' na store global.
 */
const LocationMarker = () => {
    const { setSelectedLocation } = useStore();
    useMapEvents({
        click(e) {
            setSelectedLocation({ 
                lat: e.latlng.lat, 
                lng: e.latlng.lng,
                name: '' 
            });
        },
    });
    return null;
};

/**
 * Subcomponente para controlar o movimento do mapa via código.
 * O MapContainer do Leaflet é imutável em 'center' após a renderização inicial.
 * Este componente observa 'mapCenter' na store e move a câmera (flyTo) quando ele muda.
 */
const MapUpdater = () => {
    const map = useMap();
    const { mapCenter } = useStore();

    useEffect(() => {
        if (mapCenter) {
            map.flyTo(mapCenter, 13);
        }
    }, [mapCenter, map]);

    return null;
};

/**
 * Componente Helper para marcador temporário que abre o popup automaticamente.
 * O React-Leaflet não abre popups automaticamente ao montar um Marker, por isso precisamos forçar via ref.
 */
const TemporaryMarker = ({ position, children }) => {
    const markerRef = useRef(null);

    useEffect(() => {
        if (markerRef.current) {
            markerRef.current.openPopup();
        }
    }, [position]); // Reabre se a posição mudar

    return (
        <Marker ref={markerRef} position={position} opacity={0.8}>
            {children}
        </Marker>
    );
};

/**
 * Componente do formulário dentro do Popup.
 * Permite que o usuário digite um nome para o local selecionado e o salve.
 */
const LocationPopupForm = ({ initialName, onSave }) => {
    const [name, setName] = useState(initialName || '');

    const handleSave = () => {
        if (!name.trim()) {
            toast.error("O nome do local não pode ser vazio.");
            return;
        }
        onSave(name);
    };

    return (
        <div className="flex flex-col gap-2 p-1 min-w-[200px]">
            <h3 className="font-semibold text-gray-700">Adicionar aos Favoritos</h3>
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
                onClick={handleSave}
                className="bg-green-500 text-white px-3 py-1.5 rounded text-sm hover:bg-green-600 w-full transition-colors font-medium shadow-sm"
            >
                Salvar Local
            </button>
        </div>
    );
};

/**
 * Componente Principal do Mapa.
 * Renderiza o mapa, os marcadores de favoritos e o marcador de seleção temporária.
 */
const MapComponent = () => {
    const { 
        favorites, 
        selectedLocation, 
        addFavorite, 
        mapCenter,
        removeFavorite,
        setSelectedLocation
    } = useStore();

    // Salva o local selecionado atualmente como favorito
    const handleSave = (name) => {
        if (!selectedLocation) return;
        const nameToSave = name.trim();
        addFavorite({ ...selectedLocation, name: nameToSave });
        toast.success("Local salvo com sucesso!");
        // Close popup by deselecting or explicitly updating state if needed, 
        // though usually we want to keep showing the marker as saved.
        // For now, let's keep it selected but it will re-render as a "Saved Favorite" marker.
    };

    // Remove um favorito da lista
    const handleRemove = (id) => {
        removeFavorite(id);
        toast.success("Local removido dos favoritos.");
    };

    // Verifica se o local selecionado já está salvo nos favoritos
    // (para evitar mostrar dois marcadores no mesmo lugar)
    const isSelectedSaved = favorites.some(
        f => f.lat === selectedLocation?.lat && f.lng === selectedLocation?.lng
    );

    // Chave única para forçar remontagem do popup quando a localização muda
    const popupKey = selectedLocation 
        ? `${selectedLocation.lat}-${selectedLocation.lng}`
        : 'default-popup';

    return (
        <MapContainer 
            center={mapCenter} 
            zoom={13} 
            style={{ height: "100%", width: "100%" }}
            className="z-0 outline-none"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Componentes lógicos (sem UI visual direta) */}
            <MapUpdater />
            <LocationMarker />

            {/* Renderiza marcadores para todos os Favoritos salvos */}
            {favorites.map((fav) => (
                <Marker key={fav.id} position={[fav.lat, fav.lng]}>
                    <Popup>
                        <div className="p-2 min-w-[150px]">
                            <h3 className="font-bold text-lg text-gray-800">{fav.name}</h3>
                            <p className="text-xs text-gray-500 mb-2">
                                {fav.lat.toFixed(4)}, {fav.lng.toFixed(4)}
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

            {/* Renderiza marcador temporário para seleção atual (se não for já um favorito) */}
            {selectedLocation && !isSelectedSaved && (
                <TemporaryMarker position={[selectedLocation.lat, selectedLocation.lng]}>
                    {/* autoPan garante que o popup fique visível ao abrir */}
                    <Popup offset={[0, -32]} autoPan={true}>
                        <LocationPopupForm 
                             initialName={selectedLocation.name}
                             onSave={handleSave}
                             key={popupKey}
                        />
                    </Popup>
                </TemporaryMarker>
            )}
        </MapContainer>
    );
};

export default MapComponent;
