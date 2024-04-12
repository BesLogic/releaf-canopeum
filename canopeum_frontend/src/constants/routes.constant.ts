export const appRoutes = {
  login: '/login',
  register: '/register',
  home: '/home',
  sites: '/sites',
  site: (siteId: number) => `/sites/${siteId}`,
  siteSocial: (siteId: number) => `/sites/${siteId}/social`,
  userManagment: '/user-management',
  utilities: '/utilities',
  map: '/map',
}
