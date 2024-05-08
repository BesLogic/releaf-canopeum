# More precise request param
# pyright: reportIncompatibleMethodOverride=false
# mypy: disable_error_code=override

from rest_framework import permissions

from .models import Comment, Request, Site, Siteadmin, User


class DeleteCommentPermission(permissions.BasePermission):
    """Deleting a comment is only allowed for admins or the comment's author."""

    def has_object_permission(self, request: Request, view, obj: Comment):
        current_user_role = request.user.role.name
        if current_user_role == "MegaAdmin":
            return True
        is_admin_for_this_post = obj.post.site.siteadmin_set.filter(
            user__id__exact=request.user.id
        ).exists()
        return is_admin_for_this_post or obj.user == request.user


class PublicSiteReadPermission(permissions.BasePermission):
    """Site methods only allowed if they are public, or the user is a site admin."""

    def has_object_permission(self, request: Request, view, obj: Site) -> bool:
        if obj.is_public or (
            isinstance(request.user, User) and request.user.role.name == "MegaAdmin"
        ):
            return True
        if not isinstance(request.user, User) or request.user.role.name != "SiteManager":
            return False

        return (
            Siteadmin.objects.filter(user__id__exact=request.user.pk).filter(site=obj.pk).exists()
        )


class SiteAdminPermission(permissions.BasePermission):
    """Allows mega admins and a specific site's admin to perform site actions."""

    def has_object_permission(self, request: Request, view, obj: Site) -> bool:
        current_user_role = request.user.role.name
        if current_user_role == "MegaAdmin":
            return True
        return (
            Siteadmin.objects.filter(user__id__exact=request.user.id).filter(site=obj.pk).exists()
        )


class MegaAdminPermission(permissions.BasePermission):
    """Global permission for actions only allowed to MegaAdmin users."""

    def has_permission(self, request: Request, view):
        current_user_role = request.user.role.name
        return current_user_role == "MegaAdmin"


READONLY_METHODS = ["GET", "HEAD", "OPTIONS"]


class MegaAdminPermissionReadOnly(permissions.BasePermission):
    """
    Global permission for actions only allowed to MegaAdmin users.
    This one will allow GET requests for any user, though.
    """

    def has_permission(self, request: Request, view):
        if request.method in READONLY_METHODS:
            return True
        current_user_role = request.user.role.name
        return current_user_role == "MegaAdmin"


class CurrentUserPermission(permissions.BasePermission):
    """Permission specific to a user, only allowed for this authenticated user."""

    def has_object_permission(self, request: Request, view, obj):
        return obj == request.user
