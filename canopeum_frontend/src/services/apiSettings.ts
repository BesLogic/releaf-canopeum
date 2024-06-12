// let apiBaseUrl = 'http://api.canopeum.releaftrees.life'

export type ApiSettings = {
  apiBaseUrl: string,
}

// export const setApiSetting = (apiSettings: ApiSettings) => ({ apiBaseUrl } = apiSettings)

export const getApiBaseUrl = () => {
  // console.log('apiBaseUrl', apiBaseUrl)
  return 'http://localhost:5001'
}
