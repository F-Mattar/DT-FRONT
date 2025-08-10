// src/services/summaryService.js
import apiClient from './api';

export const getSummaryFile = (fileName) => {
  return apiClient.get(`/resumo/${fileName}`);
};

export const getDashboardByCDA = (cdaNumber) => {
  return apiClient.get(`/cda/${cdaNumber}/dashboard`);
};