from django.contrib import admin

from .models import TodoItem, TodoList


class TodoItemStacked(admin.TabularInline):
    model = TodoItem
    extra = 0


class TodoListAdmin(admin.ModelAdmin):
    list_display = ('id', 'title',)
    inlines = (TodoItemStacked,)
admin.site.register(TodoList, TodoListAdmin)
