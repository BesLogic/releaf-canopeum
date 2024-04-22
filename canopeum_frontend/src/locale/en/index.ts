import analyticsJSON from './analytics.json'
import analyticsSiteJSON from './analyticsSite.json'
import authJSON from './auth.json'
import genericJSON from './generic.json'
import homeJSON from './home.json'
import postsJSON from './posts.json'
import settingsJSON from './settings.json'
import socialJSON from './social.json'

const enJSON = {
  translation: {
    analytics: { ...analyticsJSON },
    analyticsSite: { ...analyticsSiteJSON },
    auth: { ...authJSON },
    generic: { ...genericJSON },
    home: { ...homeJSON },
    posts: { ...postsJSON },
    settings: { ...settingsJSON },
    social: { ...socialJSON },
  },
}

export default enJSON
