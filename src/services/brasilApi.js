import axios from 'axios';

/**
 * Busca dados de endereço pelo CEP usando BrasilAPI.
 * @param {string} cep - O CEP a ser buscado.
 * @returns {Promise<Object>} - Retorna street, neighborhood, city, state.
 */
export const getAddressByCep = async (cep) => {
  const cleanCep = cep.replace(/\D/g, "");

  if (cleanCep.length !== 8) {
     throw new Error('CEP inválido');
  }

  const { data } = await axios.get(`https://brasilapi.com.br/api/cep/v2/${cleanCep}`);
  
  return {
    street: data.street,
    neighborhood: data.neighborhood,
    city: data.city,
    state: data.state
  };
};
