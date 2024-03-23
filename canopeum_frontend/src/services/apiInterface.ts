import {
  Client
} from './api';

const API_URL = String(import.meta.env.VITE_API_URL);

const api = new Client(API_URL);

export default api;
