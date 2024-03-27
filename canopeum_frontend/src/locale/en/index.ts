import analyticsJSON from './analytics.json'
import homeJSON from './home.json'
import mapSiteJSON from './mapSite.json'

const enJSON = {
  translation: {
    home: { ...homeJSON },
    analytics: { ...analyticsJSON },
    mapSite: { ...mapSiteJSON },
  },
}

export default enJSON
