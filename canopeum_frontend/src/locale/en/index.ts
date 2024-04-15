import analyticsJSON from './analytics.json'
import analyticsSiteJSON from './analyticsSite.json'
import authJSON from './auth.json'
import genericJSON from './generic.json'
import homeJSON from './home.json'
import settingsJSON from './settings.json'
import socialJSON from './social.json'

const enJSON = {
  translation: {
    auth: { ...authJSON },
    generic: { ...genericJSON },
    home: { ...homeJSON },
    analytics: { ...analyticsJSON },
    analyticsSite: { ...analyticsSiteJSON },
    social: { ...socialJSON },
    settings: { ...settingsJSON },
  },
}

export default enJSON
