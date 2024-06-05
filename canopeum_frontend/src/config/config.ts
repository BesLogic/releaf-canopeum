// Set the base url dynamically once new environments are created (QA, PROD)
export const APP_CONFIG = {
  appBaseUrl: import.meta.env.VITE_API_URL,
}
