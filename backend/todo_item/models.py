from django.db import models


class TodoItem(models.Model):
    title = models.CharField(max_length=140, unique=True)
    status = models.BooleanField(default=False)

    def __str__(self):
        return self.title
