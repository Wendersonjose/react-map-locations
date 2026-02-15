import React, { useState } from "react";
import useStore from "../../../store/useStore";
import { Trash2, MapPin, Search as SearchIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { getAddressByCep } from "../../../services/brasilApi";
import { getCoordinates } from "../../../services/nominatim";
import { CATEGORIES } from "../../map/components/LocationPopupForm";

/**
 * Componente PlacesSidebar (Barra Lateral de Locais).
 * Responsável por buscar, listar e gerenciar favoritos.
 */
const PlacesSidebar = () => {
  const { favorites, removeFavorite, setMapCenter, setSelectedLocation, setMapZoom } =
    useStore();

  const [query, setQuery] = useState("");
  const [searchTrigger, setSearchTrigger] = useState("");

  const handleSearchLogic = async (text) => {
    const clean = text.replace(/\D/g, "");
    const isCep = /^\d{8}$/.test(clean);

    if (isCep) {
      try {
        const addressData = await getAddressByCep(clean);
        const addressString = `${addressData.street}, ${addressData.neighborhood}, ${addressData.city} - ${addressData.state}`;
        return await getCoordinates(addressString);
      } catch (error) {
        throw new Error("CEP não encontrado ou inválido.");
      }
    } else {
      return await getCoordinates(text);
    }
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["search", searchTrigger],
    queryFn: () => handleSearchLogic(searchTrigger),
    enabled: !!searchTrigger,
    retry: 1,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) {
      toast.warning("Digite um endereço para buscar.");
      return;
    }
    setSearchTrigger(query);
  };

  const handleRemove = (e, id, name) => {
    e.stopPropagation();
    removeFavorite(id);
    toast.success(`Local "${name}" removido!`);
  };

  React.useEffect(() => {
    if (isLoading) {
      toast.info("Buscando local...", { id: "search-toast" });
    }
  }, [isLoading]);

  React.useEffect(() => {
    if (isError) {
      toast.error("Erro ao buscar o local. Tente novamente.", {
        id: "search-toast",
      });
    }
  }, [isError]);

  React.useEffect(() => {
    if (data) {
      if (data.length > 0) {
        toast.success("Local encontrado!", { id: "search-toast" });
        const place = data[0];
        const lat = parseFloat(place.lat);
        const lng = parseFloat(place.lon);

        setMapCenter([lat, lng]);
        setSelectedLocation({ lat, lng, name: place.display_name });
      } else {
        toast.warning("Local não encontrado.", { id: "search-toast" });
      }
    }
  }, [data, setMapCenter, setSelectedLocation]);

  return (
    <div className="w-full md:w-80 bg-white shadow-xl z-20 flex flex-col h-1/2 md:h-full border-r border-gray-200">
      <div className="p-4 bg-blue-600 text-white shadow-md">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <MapPin /> Meus Locais
        </h1>
      </div>

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
            {isLoading ? "..." : <SearchIcon size={20} />}
          </button>
        </form>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-60">
            <MapPin size={48} className="mb-2" />
            <p>Nenhum local salvo.</p>
          </div>
        ) : (
          favorites.map((fav) => {
            const catConfig = CATEGORIES.find(c => c.id === fav.category) || CATEGORIES[0];
            const IconComponent = catConfig.icon;
            
            return (
              <div
                key={fav.id}
                className="p-4 border border-black rounded-lg bg-white shadow-sm hover:shadow-md hover:border-blue-500 transition-all cursor-pointer group flex justify-between items-center mb-3"
                onClick={() => {
                  setMapCenter([fav.lat, fav.lng]);
                  setSelectedLocation(fav);
                  setMapZoom(16);
                }}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0 pr-2">
                  <div className={`w-12 h-12 rounded-full ${catConfig.bgColor} flex items-center justify-center text-white shrink-0`}>
                     <IconComponent size={24} strokeWidth={2} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-gray-900 truncate text-base mb-1">
                      {fav.name}
                    </h3>
                    <p className="text-sm text-gray-500 truncate font-medium">
                       {catConfig.label} • {fav.lat.toFixed(4)}, {fav.lng.toFixed(4)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => handleRemove(e, fav.id, fav.name)}
                  className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors ml-2"
                  title="Remover"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default PlacesSidebar;
