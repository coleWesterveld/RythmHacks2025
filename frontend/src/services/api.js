// API service functions
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Datasets
export const getDatasets = async () => {
  const response = await api.get('/datasets');
  return response.data;
};

export const getDatasetById = async (id) => {
  const response = await api.get(`/datasets/${id}`);
  return response.data;
};

export const createDataset = async (data) => {
  const response = await api.post('/datasets', data);
  return response.data;
};

// Researchers
export const getResearchers = async () => {
  const response = await api.get('/researchers');
  return response.data;
};

export const inviteResearcher = async (data) => {
  const response = await api.post('/researchers/invite', data);
  return response.data;
};

export const updateResearcher = async (id, data) => {
  const response = await api.put(`/researchers/${id}`, data);
  return response.data;
};

// Queries
export const executeQuery = async (queryData) => {
  const response = await api.post('/queries/execute', queryData);
  return response.data;
};

export const getQueryHistory = async (userId) => {
  const response = await api.get(`/queries/history/${userId}`);
  return response.data;
};

// Activity Log
export const getActivityLog = async (filters = {}) => {
  const response = await api.get('/activity', { params: filters });
  return response.data;
};

export default {
  getDatasets,
  getDatasetById,
  createDataset,
  getResearchers,
  inviteResearcher,
  updateResearcher,
  executeQuery,
  getQueryHistory,
  getActivityLog,
};

