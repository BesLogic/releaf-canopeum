import fetchAuth from '@services/fetchAuth'

import { AdminUserSitesClient, AnnouncementClient, AuthenticationClient, BatchClient, CommentClient, ContactClient, LikeClient, NewsClient, PostClient, SiteClient, SocialClient, SummaryClient, UserClient, WidgetClient } from './api'
import { getApiBaseUrl } from './apiSettings'

const getApiClient = () => ({
  authenticationClient: new AuthenticationClient(getApiBaseUrl()),
  batchClient: new BatchClient(getApiBaseUrl(), { fetch: fetchAuth }),
  socialClient: new SocialClient(getApiBaseUrl(), { fetch: fetchAuth }),
  postClient: new PostClient(getApiBaseUrl(), { fetch: fetchAuth }),
  newsClient: new NewsClient(getApiBaseUrl(), { fetch: fetchAuth }),
  commentClient: new CommentClient(getApiBaseUrl(), { fetch: fetchAuth }),
  likeClient: new LikeClient(getApiBaseUrl(), { fetch: fetchAuth }),
  userClient: new UserClient(getApiBaseUrl(), { fetch: fetchAuth }),
  siteClient: new SiteClient(getApiBaseUrl(), { fetch: fetchAuth }),
  adminUserSitesClient: new AdminUserSitesClient(getApiBaseUrl(), { fetch: fetchAuth }),
  summaryClient: new SummaryClient(getApiBaseUrl(), { fetch: fetchAuth }),
  announcementClient: new AnnouncementClient(getApiBaseUrl(), { fetch: fetchAuth }),
  contactClient: new ContactClient(getApiBaseUrl(), { fetch: fetchAuth }),
  widgetClient: new WidgetClient(getApiBaseUrl(), { fetch: fetchAuth }),
  tokenClient: new TokenClient(getApiBaseUrl(), { fetch: fetchAuth }),
  refreshClient: new RefreshClient(getApiBaseUrl(), { fetch: fetchAuth }),
})

export default getApiClient
