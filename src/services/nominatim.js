import axios from 'axios';

/**
 * Busca coordenadas para um endereço usando OpenStreetMap Nominatim.
 * @param {string} address - O endereço completo para busca.
 * @returns {Promise<Array>} - Retorna array com resultados (lat/lon).
 */
export const getCoordinates = async (address) => {
  if (!address) return [];
  
  try {
    const { data } = await axios.get(`https://nominatim.openstreetmap.org/search`, {
      params: {
        q: address,
        format: 'json',
        limit: 1
      }
    });
    return data || [];
  } catch (error) {
    console.error("Erro ao buscar coordenadas:", error);
    return [];
  }
};

/**
 * Busca endereço reverso a partir de coordenadas (lat/lon).
 * @param {number} lat - Latitude.
 * @param {number} lon - Longitude.
 * @returns {Promise<Object>} - Retorna objeto com endereço formatado.
 */
export const getReverseAddress = async (lat, lon) => {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: {
        lat,
        lon,
        format: 'jsonv2'
      }
    });

    if (response.data && response.data.display_name) {
      return {
        name: response.data.display_name,
        address: response.data.address
      };
    }
    return null;
  } catch (error) {
    console.error("Erro na busca reversa:", error);
    return null;
  }
};
