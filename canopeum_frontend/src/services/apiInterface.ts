import {
  AnnouncementClient,
  BatchClient,
  CommentClient,
  ContactClient,
  LikeClient,
  PostClient,
  SiteClient,
  UserClient,
  WidgetClient,
  AuthenticationClient,
} from "./api";

const API_URL = String(import.meta.env.VITE_API_URL);

const api = {
  batches: new BatchClient(API_URL),
  sites: new SiteClient(API_URL),
  authentication: new AuthenticationClient(API_URL),
  posts: new PostClient(API_URL),
  comments: new CommentClient(API_URL),
  likes: new LikeClient(API_URL),
  announcements: new AnnouncementClient(API_URL),
  contacts: new ContactClient(API_URL),
  widgets: new WidgetClient(API_URL),
  users: new UserClient(API_URL),
};

export default api;
