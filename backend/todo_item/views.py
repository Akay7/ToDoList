from django.db.models import Q
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
import django_filters

from .models import TodoItem, TodoList, Watch, Favorite
from .serializers import (
    TodoItemSerializer, TodoListSerializer,
    WatchSerializer, FavoriteSerializer,
)
from .permissions import IsHaveAccessToTodoList


class TodoItemFilter(django_filters.FilterSet):
    todo_list = django_filters.rest_framework.ModelChoiceFilter(
        queryset=TodoList.objects.all(), required=True
    )

    class Meta:
        model = TodoItem
        fields = ('todo_list',)


class TodoItemViewSet(viewsets.ModelViewSet):
    queryset = TodoItem.objects.all()
    serializer_class = TodoItemSerializer
    filter_class = TodoItemFilter


class TodoListViewSet(viewsets.ModelViewSet):
    queryset = TodoList.objects.all()
    serializer_class = TodoListSerializer
    permission_classes = (IsHaveAccessToTodoList,)

    def get_queryset(self):
        if self.action == 'list':
            user = self.request.user

            if not user.is_authenticated():
                return self.queryset.none()

            return self.queryset.filter(Q(owner=user) | (
                (Q(favorite__user=user) | Q(watch__user=user)) &
                Q(mode__in=[TodoList.ALLOW_READ, TodoList.ALLOW_FULL_ACCESS])
            ))

        return self.queryset.all()


class WatchViewSet(viewsets.ModelViewSet):
    queryset = Watch.objects.all()
    serializer_class = WatchSerializer
    permission_classes = (IsAuthenticated,)
    lookup_field = 'todo_list'

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)


class FavoriteViewSet(viewsets.ModelViewSet):
    queryset = Favorite.objects.all()
    serializer_class = FavoriteSerializer
    permission_classes = (IsAuthenticated,)
    lookup_field = 'todo_list'

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)
