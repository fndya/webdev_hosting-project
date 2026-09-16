from rest_framework.permissions import BasePermission

from hosting.models import User


class IsAdminByRole(BasePermission):
    """
    Разрешает изменение тарифов только авторизованному
    пользователю с ролью admin.

    GET-запросы доступны всем пользователям.
    """

    message = "Для выполнения операции необходимы права администратора."

    def has_permission(self, request, view):
        if request.method in ("GET", "HEAD", "OPTIONS"):
            return True

        user_id = request.session.get("user_id")

        if not user_id:
            return False

        try:
            user = (
                User.objects
                .select_related("role")
                .get(id=user_id)
            )
        except User.DoesNotExist:
            return False

        return bool(
            user.role
            and user.role.name == "admin"
        )

class IsAdminByRoleOnly(BasePermission):
    message = "Для выполнения операции необходимы права администратора."

    def has_permission(self, request, view):
        user_id = request.session.get("user_id")

        if not user_id:
            return False

        try:
            user = (
                User.objects
                .select_related("role")
                .get(id=user_id)
            )
        except User.DoesNotExist:
            return False

        return bool(
            user.role
            and user.role.name == "admin"
        )