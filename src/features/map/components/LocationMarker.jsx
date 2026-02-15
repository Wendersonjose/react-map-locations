import { useMapEvents } from 'react-leaflet';
import useStore from '../../../store/useStore';
import { getReverseAddress } from '../../../services/nominatim';
import { toast } from 'sonner';

const LocationMarker = () => {
  const { setSelectedLocation } = useStore();

  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;
      
      // Feedback visual enquanto busca
      toast.info("Buscando endereço...", { id: "loading-address" });
      
      // Define localização inicial sem nome
      setSelectedLocation({
        lat,
        lng,
        name: "Carregando..."
      });
      
      try {
        const addressData = await getReverseAddress(lat, lng);
        
        if (addressData && addressData.name) {
          // Atualiza com o nome encontrado
          setSelectedLocation({
            lat,
            lng,
            name: addressData.name
          });
          toast.success("Local encontrado!", { id: "loading-address" });
        } else {
          // Fallback se não encontrar nome
          setSelectedLocation({
             lat,
             lng,
             name: "Local desconhecido" 
          });
          toast.warning("Endereço não encontrado.", { id: "loading-address" });
        }
      } catch (error) {
        console.error(error);
        toast.error("Erro ao buscar local.", { id: "loading-address" });
        setSelectedLocation({
          lat,
          lng,
          name: "Erro ao carregar endereço"
        });
      }
    }
  });

  return null;
};

export default LocationMarker;
