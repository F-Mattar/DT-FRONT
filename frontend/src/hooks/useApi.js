// src/hooks/useApi.js
import { useState, useEffect, useCallback } from 'react';

export const useApi = (apiFunc) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const request = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiFunc(...args);
      setData(response.data);
      return response;
    } catch (err) {
      setError(err.response ? err.response.data : { message: err.message });
      return Promise.reject(err);
    } finally {
      setLoading(false);
    }
  }, [apiFunc]);

  useEffect(() => {
    // Para chamadas que devem ocorrer na montagem do componente sem argumentos
    if (typeof apiFunc === 'function' && apiFunc.length === 0) {
      request();
    } else {
      setLoading(false); // Não inicia o carregamento se a função espera argumentos
    }
  }, [apiFunc, request]);

  return { data, loading, error, request };
};