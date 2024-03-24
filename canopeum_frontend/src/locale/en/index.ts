import analyticsJSON from './analytics.json'
import homeJSON from './home.json'
import newsJSON from './news.json'

const enJSON = {
  translation: {
    home: { ...homeJSON },
    analytics: { ...analyticsJSON },
    news: { ...newsJSON },
  },
}

export default enJSON
