import { AdminsClient, AnnouncementClient, AuthenticationClient, BatchClient, CommentClient, ContactClient, LikeClient, PostClient, SiteClient, SocialClient, SummaryClient, UserClient, WidgetClient } from './api'
import { getApiBaseUrl } from './apiSettings'

const getApiClient = () => ({
  authenticationClient: new AuthenticationClient(getApiBaseUrl()),
  batchClient: new BatchClient(getApiBaseUrl()),
  socialClient: new SocialClient(getApiBaseUrl()),
  postClient: new PostClient(getApiBaseUrl()),
  commentClient: new CommentClient(getApiBaseUrl()),
  likeClient: new LikeClient(getApiBaseUrl()),
  userClient: new UserClient(getApiBaseUrl()),
  siteClient: new SiteClient(getApiBaseUrl()),
  siteAdminsClient: new AdminsClient(getApiBaseUrl()),
  summaryClient: new SummaryClient(getApiBaseUrl()),
  announcementClient: new AnnouncementClient(getApiBaseUrl()),
  contactClient: new ContactClient(getApiBaseUrl()),
  widgetClient: new WidgetClient(getApiBaseUrl()),
})

export default getApiClient
