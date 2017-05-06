from django.db.models import Q
from rest_framework import serializers
from .models import TodoItem, TodoList, Watch, Favorite


class TodoListSerializer(serializers.ModelSerializer):
    class Meta:
        model = TodoList
        fields = ('id', 'title',)


class TodoListChoices(serializers.PrimaryKeyRelatedField):
    def get_queryset(self):
        user = self.context['request'].user
        query = Q()
        if user.is_authenticated():
            query |= Q(owner=user)
        query |= Q(mode=TodoList.ALLOW_FULL_ACCESS)
        return TodoList.objects.filter(query)


class TodoItemSerializer(serializers.ModelSerializer):
    todo_list = TodoListChoices(required=False)

    def create(self, validated_data):
        if 'todo_list' not in validated_data:
            validated_data['todo_list'] = TodoList.objects.create()
        return super(TodoItemSerializer, self).create(validated_data)
    
    class Meta:
        model = TodoItem
        fields = ('id', 'title', 'status', 'todo_list',)


class WatchSerializer(serializers.ModelSerializer):
    todo_list = TodoListChoices()

    class Meta:
        model = Watch
        fields = ('id', 'user', 'todo_list',)
        read_only_fields = ('user',)


class FavoriteSerializer(serializers.ModelSerializer):
    todo_list = TodoListChoices()

    class Meta:
        model = Favorite
        fields = ('id', 'user', 'todo_list',)
        read_only_fields = ('user',)
