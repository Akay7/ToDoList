from rest_framework import viewsets

from .models import TodoItem, TodoList
from .serializers import TodoItemSerializer, TodoListSerializer


class TodoItemViewSet(viewsets.ModelViewSet):
    queryset = TodoItem.objects.all()
    serializer_class = TodoItemSerializer


class TodoListViewSet(viewsets.ModelViewSet):
    queryset = TodoList.objects.all()
    serializer_class = TodoListSerializer

    def get_queryset(self):
        if self.action == 'list':
            return self.queryset.none()
        return self.queryset.all()
