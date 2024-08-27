const apiBaseUrl: string | undefined = import.meta.env.VITE_API_URL

export type ApiSettings = {
  apiBaseUrl: string,
}

export const getApiBaseUrl = () => apiBaseUrl
