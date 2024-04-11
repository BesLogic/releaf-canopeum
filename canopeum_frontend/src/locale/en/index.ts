import analyticsJSON from './analytics.json'
import analyticsSiteJSON from './analyticsSite.json'
import authJSON from './auth.json'
import homeJSON from './home.json'
import mapSiteJSON from './mapSite.json'
import settingsJSON from './settings.json'

const enJSON = {
  translation: {
    auth: { ...authJSON },
    home: { ...homeJSON },
    analytics: { ...analyticsJSON },
    analyticsSite: { ...analyticsSiteJSON },
    mapSite: { ...mapSiteJSON },
    settings: { ...settingsJSON },
  },
}

export default enJSON
