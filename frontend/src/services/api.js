// API service functions
import axios from 'axios';

// Backend exposes endpoints at root (no "/api" prefix)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Upload CSV -> returns database_name
export const uploadDataset = async (file) => {
  const form = new FormData();
  form.append('file', file);
  const response = await api.post('/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// Meta endpoints
export const listDatabases = async () => {
  const response = await api.get('/databases');
  return response.data; // { databases: [{ id, name }] }
};

export const listTables = async (databaseName) => {
  const response = await api.get('/tables', { params: { database: databaseName } });
  return response.data; // { tables: [...] }
};

export const listColumns = async (databaseName, table) => {
  const response = await api.get('/columns', { params: { database: databaseName, table } });
  return response.data; // { columns: [{ name, type }] }
};

// Execute DP query
export const executeDPQuery = async ({ operation, column, table, epsilon, filters, database_name, epsilon_budget }) => {
  const payload = { operation, column, table, epsilon, filters, database_name, epsilon_budget };
  const response = await api.post('/query', payload);
  return response.data; // { result, operation, column, table, epsilon, noise_added, message }
};

export default {
  uploadDataset,
  listDatabases,
  listTables,
  listColumns,
  executeDPQuery,
};

