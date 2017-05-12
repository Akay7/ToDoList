from django.contrib.auth import get_user_model
from django.db.models import Q

from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator

from .models import TodoItem, TodoList, Watch, Favorite


UserModel = get_user_model()


class UserChoices(serializers.PrimaryKeyRelatedField):
    queryset = UserModel

    def get_queryset(self):
        user = self.context['request'].user
        if not user.is_authenticated():
            return self.queryset.objects.none()
        return self.queryset.objects.filter(id=user.id)


class TodoListSerializer(serializers.ModelSerializer):
    owner = UserChoices(allow_null=True, required=False)

    class Meta:
        model = TodoList
        fields = ('id', 'title', 'owner', 'mode',)


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
    user = serializers.PrimaryKeyRelatedField(
        default=serializers.CurrentUserDefault(), read_only=True
    )

    class Meta:
        model = Watch
        fields = ('user', 'todo_list',)
        validators = [
            UniqueTogetherValidator(queryset=model.objects.all(), fields=('user', 'todo_list',))
        ]


class FavoriteSerializer(serializers.ModelSerializer):
    todo_list = TodoListChoices()
    user = serializers.PrimaryKeyRelatedField(
        default=serializers.CurrentUserDefault(), read_only=True
    )

    class Meta:
        model = Favorite
        fields = ('user', 'todo_list',)
        validators = [
            UniqueTogetherValidator(queryset=model.objects.all(), fields=('user', 'todo_list',))
        ]
