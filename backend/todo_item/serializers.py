from rest_framework import serializers
from .models import TodoItem, TodoList


class TodoListSerializer(serializers.ModelSerializer):
    class Meta:
        model = TodoList
        fields = ('id', 'title',)


class TodoItemSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        if 'todo_list' not in validated_data:
            validated_data['todo_list'] = TodoList.objects.create()
        return super(TodoItemSerializer, self).create(validated_data)
    
    class Meta:
        model = TodoItem
        fields = ('id', 'title', 'status', 'todo_list',)
