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
