import axios from 'axios';

/**
 * Função de busca assíncrona.
 * Chama a API do OpenStreetMap (Nominatim).
 * @param {string} query - O termo de busca.
 * @returns {Promise<Array>} - Retorna lista de locais encontrados.
 */
export const searchPlaces = async (query) => {
  if (!query) return null;
  try {
    const { data } = await axios.get(`https://nominatim.openstreetmap.org/search`, {
      params: {
        q: query,
        format: 'json',
        limit: 1 // Limita a 1 resultado para simplicidade
      }
    });
    return data;
  } catch (error) {
    throw new Error('Falha na conexão com o serviço de busca');
  }
};
