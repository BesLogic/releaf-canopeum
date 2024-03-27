import analyticsJSON from './analytics.json'
import analyticsSiteJSON from './analyticsSite.json'
import homeJSON from './home.json'
import mapSiteJSON from './mapSite.json'

const enJSON = {
  translation: {
    home: { ...homeJSON },
    analytics: { ...analyticsJSON },
    analyticsSite: { ...analyticsSiteJSON },
    mapSite: { ...mapSiteJSON },
  },
}

export default enJSON
