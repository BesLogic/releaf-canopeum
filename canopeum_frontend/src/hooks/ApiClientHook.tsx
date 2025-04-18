import { useCallback } from 'react'

import useHttp from './HttpHook'
import { AnnouncementClient, AuthenticationClient, BatchClient, CommentClient, ContactClient, FertilizerClient, LikeClient, MulchLayerClient, PostClient, RefreshClient, SiteAdminsClient, SiteClient, SocialClient, SummaryClient, TokenClient, TreeClient, UserClient, UserInvitationClient, WidgetClient } from '@services/api'
import { getApiBaseUrl } from '@services/apiSettings'

const useApiClient = () => {
  const { fetchWithAuth } = useHttp()

  const getApiClient = useCallback(() => ({
    authenticationClient: new AuthenticationClient(getApiBaseUrl()),
    batchClient: new BatchClient(getApiBaseUrl(), { fetch: fetchWithAuth }),
    socialClient: new SocialClient(getApiBaseUrl(), { fetch: fetchWithAuth }),
    postClient: new PostClient(getApiBaseUrl(), { fetch: fetchWithAuth }),
    commentClient: new CommentClient(getApiBaseUrl(), { fetch: fetchWithAuth }),
    fertilizerClient: new FertilizerClient(getApiBaseUrl(), { fetch: fetchWithAuth }),
    mulchLayerClient: new MulchLayerClient(getApiBaseUrl(), { fetch: fetchWithAuth }),
    likeClient: new LikeClient(getApiBaseUrl(), { fetch: fetchWithAuth }),
    userClient: new UserClient(getApiBaseUrl(), { fetch: fetchWithAuth }),
    siteClient: new SiteClient(getApiBaseUrl(), { fetch: fetchWithAuth }),
    userInvitationClient: new UserInvitationClient(getApiBaseUrl(), { fetch: fetchWithAuth }),
    adminUserSitesClient: new SiteAdminsClient(getApiBaseUrl(), { fetch: fetchWithAuth }),
    summaryClient: new SummaryClient(getApiBaseUrl(), { fetch: fetchWithAuth }),
    announcementClient: new AnnouncementClient(getApiBaseUrl(), { fetch: fetchWithAuth }),
    contactClient: new ContactClient(getApiBaseUrl(), { fetch: fetchWithAuth }),
    widgetClient: new WidgetClient(getApiBaseUrl(), { fetch: fetchWithAuth }),
    tokenClient: new TokenClient(getApiBaseUrl(), { fetch: fetchWithAuth }),
    treeClient: new TreeClient(getApiBaseUrl(), { fetch: fetchWithAuth }),
    refreshClient: new RefreshClient(getApiBaseUrl(), { fetch: fetchWithAuth }),
  }), [fetchWithAuth])

  return {
    getApiClient,
  }
}

export default useApiClient
