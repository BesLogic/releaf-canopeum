import { AnnouncementsClient, BatchesClient, CommentsClient, LikesClient, LoginClient, LogoutClient, PostsClient, RegisterClient, SitesClient, UsersClient } from './api'

const API_URL = String(import.meta.env.VITE_API_URL)

const api = {
  announcementsClient: new AnnouncementsClient(API_URL),
  commentsClient: new CommentsClient(API_URL),
  likesClient: new LikesClient(API_URL),
  usersClient: new UsersClient(API_URL),
  postsClient: new PostsClient(API_URL),
  sitesClient: new SitesClient(API_URL),
  loginClient: new LoginClient(API_URL),
  logoutClient: new LogoutClient(API_URL),
  registerClient: new RegisterClient(API_URL),
  batchesClient: new BatchesClient(API_URL),
}

export default api
