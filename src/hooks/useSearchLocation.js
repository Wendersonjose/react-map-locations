import React, { useState, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { getAddressByCep } from "../services/brasilApi";
import { getCoordinates } from "../services/nominatim";
import useStore from "../store/useStore";

export default function useSearchLocation() {
  const { setMapCenter, setSelectedLocation } = useStore();
  const [searchTrigger, setSearchTrigger] = useState("");

  const handleSearchLogic = async (text) => {
    const clean = text.replace(/\D/g, "");
    const isCep = /^\d{8}$/.test(clean);

    if (isCep) {
      try {
        const addressData = await getAddressByCep(clean);
        const addressString = `${addressData.street}, ${addressData.neighborhood}, ${addressData.city} - ${addressData.state}`;
        const coords = await getCoordinates(addressString);
        return coords;
      } catch (error) {
        throw new Error("CEP não encontrado ou inválido.");
      }
    } else {
      return await getCoordinates(text);
    }
  };

  const { isLoading, isError, data } = useQuery({
    queryKey: ["search", searchTrigger],
    queryFn: () => handleSearchLogic(searchTrigger),
    enabled: !!searchTrigger,
    retry: 1,
  });

  // Efeito colateral de sucesso: atualizar o mapa
  React.useEffect(() => {
    if (data) {
      if (data.length > 0) {
        toast.success("Local encontrado!", { id: "search-toast" }); // Unique ID prevents stacking
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

  // Efeito colateral de erro
  React.useEffect(() => {
    if (isError) {
      toast.error("Erro ao buscar o local.", { id: "search-toast" });
    }
  }, [isError]);

  // Efeito colateral de loading
  React.useEffect(() => {
    if(isLoading) {
        toast.info("Buscando...", { id: "search-toast" });
    }
  }, [isLoading]);

  const onSearch = useCallback((term) => {
    setSearchTrigger(term);
  }, []);

  return { onSearch, isLoading };
}
