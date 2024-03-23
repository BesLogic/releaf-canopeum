from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Contact, Coordinate, Site, Post, Batch, Announcement, Like, Comment, Sitetype
from .serializers import AuthUserSerializer, BatchAnalyticsSerializer, ContactSerializer, CoordinatesSerializer, SiteMapSerializer, SiteSocialSerializer, SiteSummarySerializer, SiteTypeSerializer, UserSerializer, SiteSerializer, PostSerializer, BatchSerializer, AnnouncementSerializer, LikeSerializer, CommentSerializer, WidgetSerializer
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny
from drf_spectacular.utils import extend_schema
from django.contrib.auth import authenticate

class LoginAPIView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(request=AuthUserSerializer, responses=UserSerializer)
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)
        if user is not None:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class RegisterAPIView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(request=UserSerializer, responses=AuthUserSerializer)
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutAPIView(APIView):
    @extend_schema(responses=status.HTTP_200_OK)
    def post(self, request):
        request.user.auth_token.delete()
        return Response(status=status.HTTP_200_OK)

class SiteListAPIView(APIView):
    @extend_schema(responses=SiteSerializer(many=True), operation_id="sites_all")
    def get(self, request):
        sites = Site.objects.all()
        serializer = SiteSerializer(sites, many=True)
        return Response(serializer.data)

    
    @extend_schema(request=SiteSerializer, responses=SiteSerializer)
    def post(self, request):
        serializer = SiteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class SiteDetailAPIView(APIView):
    @extend_schema(request=SiteSerializer, responses=SiteSerializer)
    def get(self, request, siteId):
        try:
            site = Site.objects.get(pk=siteId)
        except Site.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = SiteSerializer(site)
        return Response(serializer.data)
    
    @extend_schema(request=SiteSocialSerializer, responses=SiteSocialSerializer, operation_id="site_social")
    def get_social_site(self, request, siteId):
        try:
            site = Site.objects.get(pk=siteId)
        except Site.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = SiteSocialSerializer(site)
        return Response(serializer.data)
    

    @extend_schema(request=SiteSerializer, responses=SiteSerializer)
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

    def delete(self, request, pk):
        try:
            site = Site.objects.get(pk=pk)
        except Site.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        site.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
class SiteSummaryListAPIView(APIView): 
    @extend_schema(responses=SiteSummarySerializer(many=True), operation_id="sites_all_summary")
    def get(self, request):
        sites = Site.objects.all()
        plant_count = 0
        survived_count = 0
        propagation_count = 0
        progress = 0
        serializer = SiteSummarySerializer(sites, many=True, context={'plant_count': plant_count, 'survived_count': survived_count, 'progress': progress, 'propagation_count': propagation_count})
        return Response(serializer.data)
    
class SiteSummaryDetailAPIView(APIView): 
    @extend_schema(responses=SiteSummarySerializer)
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
    @extend_schema(request=SiteSocialSerializer, responses=SiteSocialSerializer)
    def get(self, request, siteId):
        try:
            site = Site.objects.get(pk=siteId)
        except Site.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        batches = Batch.objects.filter(site=siteId)
        sponsors = [batch.sponsor for batch in batches]

        serializer = SiteSocialSerializer(site, context={'sponsors': sponsors})
        return Response(serializer.data)
    
class MapSiteListAPIView(APIView):
    @extend_schema(responses=SiteMapSerializer)
    def get(self):
        sites = Site.objects.all()
        serializer = SiteMapSerializer(sites, many=True)
        return Response(serializer.data)

class PostListAPIView(APIView):
    @extend_schema(responses=PostSerializer(many=True), operation_id="posts_all")
    def get(self, request):
        try:
            comment_count = Comment.objects.get(post=request.data.get('id')).count()
        except Comment.DoesNotExist:
            comment_count = 0
        has_liked = 0
        posts = Post.objects.all()
        serializer = PostSerializer(posts, many=True, context={'comment_count': comment_count, 'has_liked': has_liked})
        return Response(serializer.data)

    @extend_schema(request=PostSerializer, responses=PostSerializer)
    def post(self, request):
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class CommentListAPIView(APIView):
    @extend_schema(responses=CommentSerializer(many=True), operation_id="comments_all")
    def get(self, request, postId):
        comments = Comment.objects.filter(post=postId)
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    @extend_schema(request=CommentSerializer, responses=CommentSerializer)
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
    def delete(self, request, pk):
        try:
            comment = Comment.objects.get(pk=pk)
        except Comment.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class AnnouncementDetailAPIView(APIView):
    @extend_schema(request=AnnouncementSerializer, responses=AnnouncementSerializer)
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
    @extend_schema(request=ContactSerializer, responses=ContactSerializer)
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
    @extend_schema(request=WidgetSerializer, responses=WidgetSerializer)
    def post(self, request):
        serializer = WidgetSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class WidgetDetailAPIView(APIView):
    @extend_schema(request=WidgetSerializer, responses=WidgetSerializer)
    def put(self, request, pk):
        try:
            site = Site.objects.get(pk=pk)
        except Site.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = WidgetSerializer(site, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            site = Site.objects.get(pk=pk)
        except Site.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        site.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class LikeListAPIView(APIView):
    @extend_schema(request=LikeSerializer, responses=LikeSerializer)
    def post(self, request):
        serializer = LikeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class BatchListAPIView(APIView):
    @extend_schema(responses=BatchAnalyticsSerializer(many=True), operation_id="batches_all")
    def get(self, request):
        batches = Batch.objects.all()
        serializer = BatchAnalyticsSerializer(batches, many=True)
        return Response(serializer.data)

    @extend_schema(request=BatchSerializer, responses=BatchSerializer)
    def post(self, request):
        serializer = BatchSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class BatchDetailAPIView(APIView):
    @extend_schema(request=BatchSerializer, responses=BatchSerializer)
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

    def delete(self, request, batchId):
        try:
            batch = Batch.objects.get(pk=batchId)
        except Batch.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        batch.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class UserListAPIView(APIView):
    @extend_schema(request=UserSerializer, responses=UserSerializer)
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UserDetailAPIView(APIView):
    @extend_schema(request=UserSerializer, responses=UserSerializer)
    def get(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = UserSerializer(user)
        return Response(serializer.data)

    @extend_schema(request=UserSerializer, responses=UserSerializer)
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

    def delete(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class CurrentUserAPIView(APIView):
    @extend_schema(responses=UserSerializer, operation_id="current_user")
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)



















# class PostDetailAPIView(APIView):
#     @extend_schema(request=PostSerializer, responses=PostSerializer)
#     def get(self, request, pk):
#         try:
#             post = Post.objects.get(pk=pk)
#         except Post.DoesNotExist:
#             return Response(status=status.HTTP_404_NOT_FOUND)

#         serializer = PostSerializer(post)
#         return Response(serializer.data)
    
#     @extend_schema(request=PostSerializer, responses=PostSerializer)
#     def put(self, request, pk):
#         try:
#             post = Post.objects.get(pk=pk)
#         except Post.DoesNotExist:
#             return Response(status=status.HTTP_404_NOT_FOUND)

#         serializer = PostSerializer(post, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     def delete(self, request, pk):
#         try:
#             post = Post.objects.get(pk=pk)
#         except Post.DoesNotExist:
#             return Response(status=status.HTTP_404_NOT_FOUND)

#         post.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)












# # ------------------------------------------------------------


    

#     def delete(self, request, pk):
#         try:
#             announcement = Announcement.objects.get(pk=pk)
#         except Announcement.DoesNotExist:
#             return Response(status=status.HTTP_404_NOT_FOUND)

#         announcement.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)

# class PostListAPIView(APIView):
#     @extend_schema(responses=PostSerializer(many=True), operation_id="posts_all")
#     def get(self, request):
#         posts = Post.objects.all()
#         serializer = PostSerializer(posts, many=True)
#         return Response(serializer.data)

#     @extend_schema(request=PostSerializer, responses=PostSerializer)
#     def post(self, request):
#         serializer = PostSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# class BatchListAPIView(APIView):
#     @extend_schema(responses=BatchSerializer(many=True), operation_id="batches_all")
#     def get(self, request):
#         batches = Batch.objects.all()
#         serializer = BatchSerializer(batches, many=True)
#         return Response(serializer.data)

#     @extend_schema(request=BatchSerializer, responses=BatchSerializer)
#     def post(self, request):
#         serializer = BatchSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class BatchDetailAPIView(APIView):
#     @extend_schema(request=BatchSerializer, responses=BatchSerializer)
#     def get(self, request, pk):
#         try:
#             batch = Batch.objects.get(pk=pk)
#         except Batch.DoesNotExist:
#             return Response(status=status.HTTP_404_NOT_FOUND)

#         serializer = BatchSerializer(batch)
#         return Response(serializer.data)
    
#     @extend_schema(request=BatchSerializer, responses=BatchSerializer)
#     def put(self, request, pk):
#         try:
#             batch = Batch.objects.get(pk=pk)
#         except Batch.DoesNotExist:
#             return Response(status=status.HTTP_404_NOT_FOUND)

#         serializer = BatchSerializer(batch, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     def delete(self, request, pk):
#         try:
#             batch = Batch.objects.get(pk=pk)
#         except Batch.DoesNotExist:
#             return Response(status=status.HTTP_404_NOT_FOUND)

#         batch.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)
    


# class LikeDetailAPIView(APIView):
#     @extend_schema(request=LikeSerializer, responses=LikeSerializer)
#     def get(self, request, pk):
#         try:
#             like = Like.objects.get(pk=pk)
#         except Like.DoesNotExist:
#             return Response(status=status.HTTP_404_NOT_FOUND)

#         serializer = LikeSerializer(like)
#         return Response(serializer.data)
    
#     @extend_schema(request=LikeSerializer, responses=LikeSerializer)
#     def put(self, request, pk):
#         try:
#             like = Like.objects.get(pk=pk)
#         except Like.DoesNotExist:
#             return Response(status=status.HTTP_404_NOT_FOUND)

#         serializer = LikeSerializer(like, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     def delete(self, request, pk):
#         try:
#             like = Like.objects.get(pk=pk)
#         except Like.DoesNotExist:
#             return Response(status=status.HTTP_404_NOT_FOUND)

#         like.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)
    
# class CommentListAPIView(APIView):
#     @extend_schema(responses=CommentSerializer(many=True), operation_id="comments_all")
#     def get(self, request, postId):
#         comments = Comment.objects.get(post=postId)
#         serializer = CommentSerializer(comments, many=True)
#         return Response(serializer.data)

#     @extend_schema(request=CommentSerializer, responses=CommentSerializer)
#     def post(self, request, postId):
#         try:
#             post = Post.objects.get(pk=postId)
#         except Post.DoesNotExist:
#             return Response(status=status.HTTP_404_NOT_FOUND)

#         serializer = CommentSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save(post=post)
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# class CommentDetailAPIView(APIView):
#     @extend_schema(request=CommentSerializer, responses=CommentSerializer)
#     def get(self, request, pk):
#         try:
#             comment = Comment.objects.get(pk=pk)
#         except Comment.DoesNotExist:
#             return Response(status=status.HTTP_404_NOT_FOUND)

#         serializer = CommentSerializer(comment)
#         return Response(serializer.data)

#     @extend_schema(request=CommentSerializer, responses=CommentSerializer)
#     def put(self, request, pk):
#         try:
#             comment = Comment.objects.get(pk=pk)
#         except Comment.DoesNotExist:
#             return Response(status=status.HTTP_404_NOT_FOUND)

#         serializer = CommentSerializer(comment, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     def delete(self, request, pk):
#         try:
#             comment = Comment.objects.get(pk=pk)
#         except Comment.DoesNotExist:
#             return Response(status=status.HTTP_404_NOT_FOUND)

#         comment.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)
    
# class ContactListAPIView(APIView):
#     @extend_schema(responses=ContactSerializer(many=True), operation_id="contacts_all")
#     def get(self, request):
#         contacts = Contact.objects.all()
#         serializer = ContactSerializer(contacts, many=True)
#         return Response(serializer.data)

#     @extend_schema(request=ContactSerializer, responses=ContactSerializer)
#     def post(self, request):
#         serializer = ContactSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

#     def delete(self, request, pk):
#         try:
#             contact = Contact.objects.get(pk=pk)
#         except Contact.DoesNotExist:
#             return Response(status=status.HTTP_404_NOT_FOUND)

#         contact.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)
    
# class WidgetListAPIView(APIView):
#     @extend_schema(responses=SiteSerializer(many=True), operation_id="widgets_all")
#     def get(self, request):
#         sites = Site.objects.all()
#         serializer = SiteSerializer(sites, many=True)
#         return Response(serializer.data)

#     @extend_schema(request=SiteSerializer, responses=SiteSerializer)
#     def post(self, request):
#         serializer = SiteSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
# class CoordinateListAPIView(APIView):
#     @extend_schema(responses=CoordinatesSerializer(many=True), operation_id="coordinates_all")
#     def get(self, request):
#         coordinates = Coordinate.objects.all()
#         serializer = CoordinatesSerializer(coordinates, many=True)
#         return Response(serializer.data)

#     @extend_schema(request=CoordinatesSerializer, responses=CoordinatesSerializer)
#     def post(self, request):
#         serializer = CoordinatesSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class CoordinateDetailAPIView(APIView):
#     @extend_schema(request=CoordinatesSerializer, responses=CoordinatesSerializer)
#     def get(self, request, pk):
#         try:
#             coordinate = Coordinate.objects.get(pk=pk)
#         except Coordinate.DoesNotExist:
#             return Response(status=status.HTTP_404_NOT_FOUND)

#         serializer = CoordinatesSerializer(coordinate)
#         return Response(serializer.data)

#     @extend_schema(request=CoordinatesSerializer, responses=CoordinatesSerializer)
#     def put(self, request, pk):
#         try:
#             coordinate = Coordinate.objects.get(pk=pk)
#         except Coordinate.DoesNotExist:
#             return Response(status=status.HTTP_404_NOT_FOUND)

#         serializer = CoordinatesSerializer(coordinate, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     def delete(self, request, pk):
#         try:
#             coordinate = Coordinate.objects.get(pk=pk)
#         except Coordinate.DoesNotExist:
#             return Response(status=status.HTTP_404_NOT_FOUND)

#         coordinate.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)
    