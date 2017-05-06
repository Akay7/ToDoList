from rest_framework import viewsets
import django_filters

from .models import TodoItem, TodoList
from .serializers import TodoItemSerializer, TodoListSerializer
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
            return self.queryset.none()
        return self.queryset.all()
