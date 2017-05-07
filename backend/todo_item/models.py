from uuid import uuid4
from django.db import models
from django.conf import settings
from channels.binding.websockets import WebsocketBinding

UserModel = settings.AUTH_USER_MODEL


class TodoList(models.Model):
    PRIVATE = 'private'
    ALLOW_READ = 'read'
    ALLOW_FULL_ACCESS = 'full_access'

    MODES = (
        (PRIVATE, 'Private'),
        (ALLOW_READ, 'Allow read to everyone'),
        (ALLOW_FULL_ACCESS, 'Allow full access to everyone'),
    )

    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    title = models.CharField(max_length=140)
    owner = models.ForeignKey(UserModel, related_name='todo_lists', null=True, blank=True)
    mode = models.CharField(max_length=20, choices=MODES, default=ALLOW_FULL_ACCESS)

    def __str__(self):
        return self.title


class TodoItem(models.Model):
    todo_list = models.ForeignKey(TodoList, related_name="todo_items", null=True)
    title = models.CharField(max_length=140, unique=True)
    status = models.BooleanField(default=False)

    def __str__(self):
        return self.title


class TodoItemBinding(WebsocketBinding):
    model = TodoItem
    stream = "todo_item"
    fields = ("title", "status", "todo_list",)

    @classmethod
    def group_names(cls, instance):
        list_id = str(instance.todo_list.id)
        return (list_id,)

    @classmethod
    def has_permission(self, user, action, pk):
        # CRUD just trough REST API
        return False


class Watch(models.Model):
    user = models.ForeignKey(UserModel)
    todo_list = models.ForeignKey(TodoList)


class Favorite(models.Model):
    user = models.ForeignKey(UserModel)
    todo_list = models.ForeignKey(TodoList)
