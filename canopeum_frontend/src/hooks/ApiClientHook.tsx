import { AdminUserSitesClient, AnnouncementClient, AuthenticationClient, BatchClient, CommentClient, ContactClient, LikeClient, PostClient, RefreshClient, SiteClient, SocialClient, SummaryClient, TokenClient, UserClient, UserInvitationClient, WidgetClient } from '@services/api'
import { getApiBaseUrl } from '@services/apiSettings'

import useHttp from './HttpHook'

const useApiClient = () => {
  const { fetchWithAuth } = useHttp()

  return {
    authenticationClient: new AuthenticationClient(getApiBaseUrl()),
    batchClient: new BatchClient(getApiBaseUrl(), { fetch: fetchWithAuth }),
    socialClient: new SocialClient(getApiBaseUrl(), { fetch: fetchWithAuth }),
    postClient: new PostClient(getApiBaseUrl(), { fetch: fetchWithAuth }),
    commentClient: new CommentClient(getApiBaseUrl(), { fetch: fetchWithAuth }),
    likeClient: new LikeClient(getApiBaseUrl(), { fetch: fetchWithAuth }),
    userClient: new UserClient(getApiBaseUrl(), { fetch: fetchWithAuth }),
    siteClient: new SiteClient(getApiBaseUrl(), { fetch: fetchWithAuth }),
    userInvitationClient: new UserInvitationClient(getApiBaseUrl(), { fetch: fetchWithAuth }),
    adminUserSitesClient: new AdminUserSitesClient(getApiBaseUrl(), { fetch: fetchWithAuth }),
    summaryClient: new SummaryClient(getApiBaseUrl(), { fetch: fetchWithAuth }),
    announcementClient: new AnnouncementClient(getApiBaseUrl(), { fetch: fetchWithAuth }),
    contactClient: new ContactClient(getApiBaseUrl(), { fetch: fetchWithAuth }),
    widgetClient: new WidgetClient(getApiBaseUrl(), { fetch: fetchWithAuth }),
    tokenClient: new TokenClient(getApiBaseUrl(), { fetch: fetchWithAuth }),
    refreshClient: new RefreshClient(getApiBaseUrl(), { fetch: fetchWithAuth }),
  }
}

export default useApiClient
