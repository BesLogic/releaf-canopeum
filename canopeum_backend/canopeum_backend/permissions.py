# More precise request param
# pyright: reportIncompatibleMethodOverride=false
# mypy: disable_error_code=override

from typing import override

from rest_framework import permissions

from .models import Comment, Request, RoleName, Site, Siteadmin


class DeleteCommentPermission(permissions.BasePermission):
    """Deleting a comment is only allowed for admins or the comment's author."""

    @override
    def has_object_permission(self, request: Request, view, obj: Comment):
        if request.user.role.name == RoleName.MegaAdmin:
            return True
        is_admin_for_this_post = obj.post.site.siteadmin_set.filter(
            user__id__exact=request.user.id
        ).exists()
        return is_admin_for_this_post or obj.user == request.user


class PublicSiteReadPermission(permissions.BasePermission):
    """Site methods only allowed if they are public, or the user is a site admin."""

    @override
    def has_object_permission(self, request: Request, view, obj: Site) -> bool:
        if obj.is_public or (request.user.role.name == RoleName.MegaAdmin):
            return True
        if request.user.role.name != RoleName.ForestSteward:
            return False

        return (
            Siteadmin.objects.filter(user__id__exact=request.user.pk).filter(site=obj.pk).exists()
        )


class SiteAdminPermission(permissions.BasePermission):
    """Allows mega admins and a specific site's admin to perform site actions."""

    @override
    def has_object_permission(self, request: Request, view, obj: Site) -> bool:
        if request.user.role.name == RoleName.MegaAdmin:
            return True
        return (
            Siteadmin.objects.filter(user__id__exact=request.user.id).filter(site=obj.pk).exists()
        )


class MegaAdminOrForestStewardPermission(permissions.BasePermission):
    """Global permission for actions only allowed to MegaAdmin or ForestSteward users."""

    # About the type ignore: Base permission return type is Literal True but should be bool
    @override
    def has_permission(self, request: Request, view):
        return request.user.role.name in {RoleName.MegaAdmin, RoleName.ForestSteward}


class MegaAdminPermission(permissions.BasePermission):
    """Global permission for actions only allowed to MegaAdmin users."""

    @override
    def has_permission(self, request: Request, view):
        return request.user.role.name == RoleName.MegaAdmin


READONLY_METHODS = {"GET", "HEAD", "OPTIONS"}


class MegaAdminPermissionReadOnly(permissions.BasePermission):
    """
    Global permission for actions only allowed to MegaAdmin users.
    This one will allow GET requests for any user, though.
    """

    @override
    def has_permission(self, request: Request, view):
        if request.method in READONLY_METHODS:
            return True
        return request.user.role.name == RoleName.MegaAdmin


class CurrentUserPermission(permissions.BasePermission):
    """Permission specific to a user, only allowed for this authenticated user."""

    @override
    def has_object_permission(self, request: Request, view, obj):
        return obj == request.user
