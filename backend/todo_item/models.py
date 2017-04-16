from django.db import models
from channels.binding.websockets import WebsocketBinding


class TodoItem(models.Model):
    title = models.CharField(max_length=140, unique=True)
    status = models.BooleanField(default=False)

    def __str__(self):
        return self.title


class TodoItemBinding(WebsocketBinding):
    model = TodoItem
    stream = "todo_item"
    fields = ("title", "status",)

    @classmethod
    def group_names(cls, instance):
        return ("todo_list",)

    @classmethod
    def has_permission(self, user, action, pk):
        return True
