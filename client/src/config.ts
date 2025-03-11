const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  isProduction: import.meta.env.PROD
};

export const BACKEND_URL = config.apiUrl;
export default config;
