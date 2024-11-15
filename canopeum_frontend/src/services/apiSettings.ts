const apiBaseUrl = import.meta.env.VITE_API_URL as string | undefined

export type ApiSettings = {
  apiBaseUrl: string,
}

export const getApiBaseUrl = () => apiBaseUrl ?? ''
