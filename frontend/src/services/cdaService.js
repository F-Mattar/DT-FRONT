// src/services/cdaService.js
import apiClient from './api';

export const searchCDAs = (params) => {
  // 'params' será um objeto com os filtros, ex: { ano: 2020, sort_by: 'saldo' }
  // O Axios transforma isso em query parameters na URL, como: /cda/search?ano=2020&sort_by=saldo
  return apiClient.get('/cda/search', { params });
};