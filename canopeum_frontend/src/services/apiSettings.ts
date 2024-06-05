let apiBaseUrl: string = import.meta.env.API_BASE_URL

export type ApiSettings = {
  apiBaseUrl: string,
}

export const setApiSetting = (apiSettings: ApiSettings) => ({ apiBaseUrl } = apiSettings)

export const getApiBaseUrl = () => apiBaseUrl
