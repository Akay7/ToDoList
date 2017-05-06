from rest_framework.permissions import BasePermission, SAFE_METHODS

from .models import TodoList


class IsHaveAccessToTodoList(BasePermission):
    def has_object_permission(self, request, view, obj):
        if (
            obj.mode == TodoList.ALLOW_FULL_ACCESS or
            obj.owner == request.user or
            (obj.mode == TodoList.ALLOW_READ and request.method in SAFE_METHODS)
        ):
            return True
        return False
