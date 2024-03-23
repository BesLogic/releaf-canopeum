from typing import ClassVar
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Contact, Coordinate, Site, Post, Batch, Announcement, Like, Comment, Sitetype, Widget
from .serializers import AuthUserSerializer, BatchAnalyticsSerializer, ContactSerializer, CoordinatesSerializer, SiteMapSerializer, SiteSocialSerializer, SiteSummarySerializer, SiteTypeSerializer, UserSerializer, SiteSerializer, PostSerializer, BatchSerializer, AnnouncementSerializer, LikeSerializer, CommentSerializer, WidgetSerializer
from django.contrib.auth.models import User
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView


from .models import Announcement, Batch, Comment, Like, Post, Site
from .serializers import (
    AnnouncementSerializer,
    AuthUserSerializer,
    BatchSerializer,
    CommentSerializer,
    LikeSerializer,
    PostSerializer,
    SiteSerializer,
    UserSerializer,
)


class LoginAPIView(APIView):
    permission_classes: ClassVar[list[type[AllowAny]]] = [AllowAny]

    @extend_schema(request=AuthUserSerializer, responses=UserSerializer, operation_id="authentication_login")
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)
        if user is not None:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({"token": token.key}, status=status.HTTP_200_OK)
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


class RegisterAPIView(APIView):
    permission_classes: ClassVar[list[type[AllowAny]]] = [AllowAny]

    @extend_schema(request=UserSerializer, responses=AuthUserSerializer, operation_id="authentication_register")
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)
            return Response({"token": token.key}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutAPIView(APIView):
    @extend_schema(responses=status.HTTP_200_OK, operation_id="authentication_logout")
    def post(self, request):
        request.user.auth_token.delete()
        return Response(status=status.HTTP_200_OK)

class SiteListAPIView(APIView):
    @extend_schema(responses=SiteSerializer(many=True), operation_id="site_all")
    def get(self, request):
        sites = Site.objects.all()
        serializer = SiteSerializer(sites, many=True)
        return Response(serializer.data)


    @extend_schema(request=SiteSerializer, responses=SiteSerializer, operation_id="site_create")
    def post(self, request):
        serializer = SiteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SiteDetailAPIView(APIView):
    @extend_schema(request=SiteSerializer, responses=SiteSerializer, operation_id="site_detail")
    def get(self, request, siteId):
        try:
            site = Site.objects.get(pk=siteId)
        except Site.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = SiteSerializer(site)
        return Response(serializer.data)

    @extend_schema(request=SiteSerializer, responses=SiteSerializer, operation_id="site_update")
    def put(self, request, siteId):
        try:
            site = Site.objects.get(pk=siteId)
        except Site.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = SiteSerializer(site, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(responses=status.HTTP_204_NO_CONTENT, operation_id="site_delete")
    def delete(self, request, siteId):
        try:
            site = Site.objects.get(pk=siteId)
        except Site.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        site.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class SiteSummaryListAPIView(APIView):
    @extend_schema(responses=SiteSummarySerializer(many=True), operation_id="site_summary")
    def get(self, request):
        sites = Site.objects.all()
        plant_count = 0
        survived_count = 0
        propagation_count = 0
        progress = 0
        serializer = SiteSummarySerializer(sites, many=True, context={'plant_count': plant_count, 'survived_count': survived_count, 'progress': progress, 'propagation_count': propagation_count})
        return Response(serializer.data)

class SiteSummaryDetailAPIView(APIView):
    @extend_schema(responses=SiteSummarySerializer, operation_id="site_summarydetail")
    def get(self, request, siteId):
        try:
            site = Site.objects.get(pk=siteId)
        except Site.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        plant_count = 0
        survived_count = 0
        propagation_count = 0
        progress = 0
        serializer = SiteSummarySerializer(site, context={'plant_count': plant_count, 'survived_count': survived_count, 'progress': progress, 'propagation_count': propagation_count})
        return Response(serializer.data)

class SiteSocialDetailAPIView(APIView):
    @extend_schema(request=SiteSocialSerializer, responses=SiteSocialSerializer, operation_id="site_social")
    def get(self, request, siteId):
        try:
            site = Site.objects.get(pk=siteId)
        except Site.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        batches = Batch.objects.filter(site=siteId)
        sponsors = [batch.sponsor for batch in batches]

        serializer = SiteSocialSerializer(site, context={'sponsors': sponsors})
        return Response(serializer.data)

class SiteMapListAPIView(APIView):
    @extend_schema(responses=SiteMapSerializer, operation_id="site_map")
    def get_site_map(self):
        sites = Site.objects.all()
        serializer = SiteMapSerializer(sites, many=True)
        return Response(serializer.data)

class PostListAPIView(APIView):
    @extend_schema(responses=PostSerializer(many=True), operation_id="post_all")
    def get(self, request):
        try:
            comment_count = Comment.objects.get(post=request.data.get('id')).count()
        except Comment.DoesNotExist:
            comment_count = 0
        has_liked = 0
        posts = Post.objects.all()
        serializer = PostSerializer(posts, many=True, context={'comment_count': comment_count, 'has_liked': has_liked})
        return Response(serializer.data)

    @extend_schema(request=PostSerializer, responses=PostSerializer, operation_id="post_create")
    def post(self, request):
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CommentListAPIView(APIView):
    @extend_schema(responses=CommentSerializer(many=True), operation_id="comment_all")
    def get(self, request, postId):
        comments = Comment.objects.filter(post=postId)
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    @extend_schema(request=CommentSerializer, responses=CommentSerializer, operation_id="comment_create")
    def post(self, request, postId):
        try:
            post = Post.objects.get(pk=postId)
        except Post.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(post=post)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CommentDetailAPIView(APIView):
    @extend_schema(operation_id="comment_delete")
    def delete(self, request, pk):
        try:
            comment = Comment.objects.get(pk=pk)
        except Comment.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class AnnouncementDetailAPIView(APIView):
    @extend_schema(request=AnnouncementSerializer, responses=AnnouncementSerializer, operation_id="announcement_update")
    def put(self, request, siteId):
        try:
            announcement = Announcement.objects.get(site=siteId)
        except Announcement.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = AnnouncementSerializer(announcement, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ContactDetailAPIView(APIView):
    @extend_schema(request=ContactSerializer, responses=ContactSerializer, operation_id="contact_update")
    def put(self, request, pk):
        try:
            contact = Contact.objects.get(pk=pk)
        except Contact.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = ContactSerializer(contact, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class WidgetListAPIView(APIView):
    @extend_schema(request=WidgetSerializer, responses=WidgetSerializer, operation_id="widget_all")
    def post(self, request):
        serializer = WidgetSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class WidgetDetailAPIView(APIView):
    @extend_schema(request=WidgetSerializer, responses=WidgetSerializer, operation_id="widget_detail")
    def put(self, request, pk):
        try:
            widget = Widget.objects.get(pk=pk)
        except Widget.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = WidgetSerializer(widget, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(operation_id="widget_delete")
    def delete(self, request, pk):
        try:
            widget = Widget.objects.get(pk=pk)
        except Widget.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        widget.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class LikeListAPIView(APIView):
    @extend_schema(request=LikeSerializer, responses=LikeSerializer, operation_id="like_all")
    def post(self, request):
        serializer = LikeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BatchListAPIView(APIView):
    @extend_schema(responses=BatchAnalyticsSerializer(many=True), operation_id="batch_all")
    def get(self, request):
        batches = Batch.objects.all()
        serializer = BatchAnalyticsSerializer(batches, many=True)
        return Response(serializer.data)

    @extend_schema(request=BatchSerializer, responses=BatchSerializer, operation_id="batch_create")
    def post(self, request):
        serializer = BatchSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BatchDetailAPIView(APIView):
    @extend_schema(request=BatchSerializer, responses=BatchSerializer, operation_id="batch_detail")
    def put(self, request, batchId):
        try:
            batch = Batch.objects.get(pk=batchId)
        except Batch.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = BatchSerializer(batch, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(operation_id="batch_delete")
    def delete(self, request, batchId):
        try:
            batch = Batch.objects.get(pk=batchId)
        except Batch.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        batch.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class UserListAPIView(APIView):
    @extend_schema(request=UserSerializer, responses=UserSerializer, operation_id="user_all")
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserDetailAPIView(APIView):
    @extend_schema(request=UserSerializer, responses=UserSerializer, operation_id="user_detail")
    def get(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = UserSerializer(user)
        return Response(serializer.data)

    @extend_schema(request=UserSerializer, responses=UserSerializer, operation_id="user_update")
    def put(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(operation_id="user_delete")
    def delete(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class UserCurrentUserAPIView(APIView):
    @extend_schema(responses=UserSerializer, operation_id="user_current_user")
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
