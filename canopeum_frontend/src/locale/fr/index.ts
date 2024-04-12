import analyticsJSON from './analytics.json'
import analyticsSiteJSON from './analyticsSite.json'
import homeJSON from './home.json'
import settingsJSON from './settings.json'
import socialJSON from './social.json'

const frJSON = {
  translation: {
    home: { ...homeJSON },
    analytics: { ...analyticsJSON },
    analyticsSite: { ...analyticsSiteJSON },
    social: { ...socialJSON },
    settings: { ...settingsJSON },
  },
}

export default frJSON
