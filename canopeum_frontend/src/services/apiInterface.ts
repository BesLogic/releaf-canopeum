import type { AuthUser, Batch, Comment, PatchedAnnouncement, PatchedBatch, PatchedContact, PatchedSite, PatchedUser, PatchedWidget, Post, Site, User, Widget } from './api'
import { Client } from './api'
import { getApiBaseUrl } from './apiSettings'

const api = () => {
  const client = new Client(getApiBaseUrl())

  return {
    auth: {
      login: (body: AuthUser) => client.authenticationLogin(body),
      logout: () => client.authenticationLogout(),
      register: (body: User) => client.authenticationRegister(body),
      currentUser: () => client.userCurrentUser(),
    },
    social: {
      posts: () => client.postAll(),
      postCreate: (body: Post) => client.postCreate(body),
      comments: (postId: number) => client.commentAll(postId),
      commentCreate: (postId: number, body: Comment) => client.commentCreate(postId, body),
      commentDelete: (commentId: number, postId: number) => client.commentDelete(commentId, postId),
      site: (siteId: number) => client.siteSocial(siteId),
      announcementUpdate: (siteId: number, body: PatchedAnnouncement) => client.announcementUpdate(siteId, body),
      contactUpdate: (contactId: number, siteId: number, body: PatchedContact) =>
        client.contactUpdate(contactId, siteId, body),
      widgetCreate: (siteId: number, body: Widget) => client.widgetCreate(siteId, body),
      widgetDelete: (siteId: number, widgetId: number) => client.widgetDelete(siteId, widgetId),
      widgetUpdate: (siteId: number, widgetId: number, body: PatchedWidget) =>
        client.widgetUpdate(siteId, widgetId, body),
    },
    analytics: {
      siteCreate: (body: Site) => client.siteCreate(body),
      siteSummaries: () => client.siteSummaryAll(),
      site: (siteId: number) => client.siteDetail(siteId),
      siteUpdate: (siteId: number, body: PatchedSite) => client.siteUpdate(siteId, body),
      siteDelete: (siteId: number) => client.siteDelete(siteId),
      siteSummary: (siteId: number) => client.siteSummary(siteId),
      batches: () => client.batchAll(),
      batchCreate: (body: Batch) => client.batchCreate(body),
      batchDelete: (batchId: number) => client.batchDelete(batchId),
      batchUpdate: (batchId: number, body: PatchedBatch) => client.batchUpdate(batchId, body),
    },
    map: {
      sites: () => client.siteMap(),
    },
    users: {
      all: () => client.userAll(),
      create: (body: User) => client.userCreate(body),
      update: (userId: number, body: PatchedUser) => client.userUpdate(userId, body),
    },
  }
}

export default api
