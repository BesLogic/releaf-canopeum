import type Shape from '../en'
import analytics from './analytics'
import analyticsSite from './analyticsSite'
import auth from './auth'
import errors from './errors'
import generic from './generic'
import home from './home'
import navbar from './navbar'
import posts from './posts'
import settings from './settings'
import social from './social'

export default {
  translation: {
    analytics,
    analyticsSite,
    auth,
    errors,
    generic,
    home,
    navbar,
    posts,
    settings,
    social,
  },
} satisfies typeof Shape
