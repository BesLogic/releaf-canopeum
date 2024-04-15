from rest_framework import permissions


class MegaAdminPermission(permissions.BasePermission):
    """Global permission for actions only allowed to MegaAdmin users."""

    def has_permission(self, request, view):
        current_user_role = request.user.role.name
        return current_user_role == "MegaAdmin"


SAFE_METHODS = ["GET", "HEAD", "OPTIONS"]


class MegaAdminPermissionReadOnly(permissions.BasePermission):
    """Global permission for actions only allowed to MegaAdmin users. This one will allow GET requests only."""

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        current_user_role = request.user.role.name
        return current_user_role == "MegaAdmin"


class CurrentUserPermission(permissions.BasePermission):
    """Permission specific to a user, only allowed for this authenticated user."""

    def has_object_permission(self, request, view, obj):
        return obj == request.user
