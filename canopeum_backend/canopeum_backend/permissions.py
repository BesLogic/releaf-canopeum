from rest_framework import permissions


class MegaAdminPermission(permissions.BasePermission):
    """Global permission for actions only allowed to MegaAdmin users."""

    def has_permission(self, request, view):
        current_user_role = request.user.role.name
        return current_user_role == "MegaAdmin"
