export const appRoutes = {
  login: '/login',
  register: '/register',
  home: '/home',
  postDetail: (postId: number) => `/posts/${postId}`,
  sites: '/sites',
  site: (siteId: number) => `/sites/${siteId}`,
  siteSocial: (siteId: number) => `/sites/${siteId}/social`,
  termsAndPolicies: '/terms-and-policies',
  userManagment: {
    '': '/user-management',
    myProfile: '/user-management/my-profile',
    manageAdmins: '/user-management/manage-admins',
    termsAndPolicies: '/user-management/terms-and-policies',
  },
  // utilities: '/utilities',  // For development purposes
  map: '/map',
} as const
