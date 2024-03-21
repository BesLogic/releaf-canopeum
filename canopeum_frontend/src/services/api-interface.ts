import {
    AnnouncementsClient,
    CommentsClient,
    LikesClient,
    UsersClient,
    PostsClient,
    SitesClient,
    LoginClient,
    LogoutClient,
    RegisterClient,
    BatchesClient,
} from './api'

const baseUrl = "http://localhost:8000";

const api = {
    announcementsClient: new AnnouncementsClient(baseUrl),
    commentsClient: new CommentsClient(baseUrl),
    likesClient: new LikesClient(baseUrl),
    usersClient: new UsersClient(baseUrl),
    postsClient: new PostsClient(baseUrl),
    sitesClient: new SitesClient(baseUrl),
    loginClient: new LoginClient(baseUrl),
    logoutClient: new LogoutClient(baseUrl),
    registerClient: new RegisterClient(baseUrl),
    batchesClient: new BatchesClient(baseUrl),
};

export default api;