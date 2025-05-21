import { useCallback } from 'react'

import useHttp from './HttpHook'
import { AnnouncementClient, AuthenticationClient, BatchClient, CommentClient, ContactClient, FertilizerClient, LikeClient, MulchLayerClient, PostClient, RefreshClient, SiteAdminsClient, SiteClient, SocialClient, SummaryClient, TokenClient, TreeClient, UserClient, UserInvitationClient, WidgetClient } from '@services/api'

const useApiClient = () => {
  const { fetchWithAuth } = useHttp()

  const getApiClient = useCallback(() => ({
    authenticationClient: new AuthenticationClient(import.meta.env.VITE_API_URL),
    batchClient: new BatchClient(import.meta.env.VITE_API_URL, { fetch: fetchWithAuth }),
    socialClient: new SocialClient(import.meta.env.VITE_API_URL, { fetch: fetchWithAuth }),
    postClient: new PostClient(import.meta.env.VITE_API_URL, { fetch: fetchWithAuth }),
    commentClient: new CommentClient(import.meta.env.VITE_API_URL, { fetch: fetchWithAuth }),
    fertilizerClient: new FertilizerClient(import.meta.env.VITE_API_URL, { fetch: fetchWithAuth }),
    mulchLayerClient: new MulchLayerClient(import.meta.env.VITE_API_URL, { fetch: fetchWithAuth }),
    likeClient: new LikeClient(import.meta.env.VITE_API_URL, { fetch: fetchWithAuth }),
    userClient: new UserClient(import.meta.env.VITE_API_URL, { fetch: fetchWithAuth }),
    siteClient: new SiteClient(import.meta.env.VITE_API_URL, { fetch: fetchWithAuth }),
    userInvitationClient: new UserInvitationClient(import.meta.env.VITE_API_URL, {
      fetch: fetchWithAuth,
    }),
    adminUserSitesClient: new SiteAdminsClient(import.meta.env.VITE_API_URL, {
      fetch: fetchWithAuth,
    }),
    summaryClient: new SummaryClient(import.meta.env.VITE_API_URL, { fetch: fetchWithAuth }),
    announcementClient: new AnnouncementClient(import.meta.env.VITE_API_URL, {
      fetch: fetchWithAuth,
    }),
    contactClient: new ContactClient(import.meta.env.VITE_API_URL, { fetch: fetchWithAuth }),
    widgetClient: new WidgetClient(import.meta.env.VITE_API_URL, { fetch: fetchWithAuth }),
    tokenClient: new TokenClient(import.meta.env.VITE_API_URL, { fetch: fetchWithAuth }),
    treeClient: new TreeClient(import.meta.env.VITE_API_URL, { fetch: fetchWithAuth }),
    refreshClient: new RefreshClient(import.meta.env.VITE_API_URL, { fetch: fetchWithAuth }),
  }), [fetchWithAuth])

  return {
    getApiClient,
  }
}

export default useApiClient
