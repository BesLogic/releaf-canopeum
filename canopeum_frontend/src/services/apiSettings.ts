const apiBaseUrl = import.meta.env.VITE_API_URL

export type ApiSettings = {
  apiBaseUrl: string,
}

// export const setApiSetting = (apiSettings: ApiSettings) => ({ apiBaseUrl } = apiSettings)

export const getApiBaseUrl = () => apiBaseUrl
