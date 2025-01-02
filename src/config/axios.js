import axios from 'axios';
import { baseUrl, loadConfig } from './config';

const baseApi = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

// A function to update the base URL of the axios instance
export const updateBaseUrl = (newBaseUrl) => {
  baseApi.defaults.baseURL = newBaseUrl;
};

// Use these functions after your config has been loaded
loadConfig().then(() => {
    updateBaseUrl(baseUrl);
});

export {baseApi};
