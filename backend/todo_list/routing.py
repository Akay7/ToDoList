from django.db.models import Q

from channels.routing import route_class
from channels.generic.websockets import WebsocketDemultiplexer

from todo_item.models import TodoList, TodoItemBinding


class Demultiplexer(WebsocketDemultiplexer):
    http_user = True

    consumers = {
        "todo_item": TodoItemBinding.consumer,
    }

    def connection_groups(self, **kwargs):
        query_params = dict([
            i.split("=") for i in
            self.message.content.get('query_string', "").split('&')
            if "=" in i
        ])

        groups = []
        todo_list_id = query_params.get('todo_list')

        query = Q()
        if self.message.user.is_authenticated():
            query &= (
                (Q(owner=self.message.user) | Q(mode=TodoList.ALLOW_FULL_ACCESS) | Q(mode=TodoList.ALLOW_READ)) &
                Q(watch__user=self.message.user)
            )

        if todo_list_id:
            query &= Q(id=todo_list_id) & (Q(mode=TodoList.ALLOW_FULL_ACCESS) | Q(mode=TodoList.ALLOW_READ))

        if query:
            groups.extend(map(str, TodoList.objects.filter(query).values_list('id', flat=True)))
        return groups

channel_routing = [
    route_class(Demultiplexer, path="^/api/ws/$")
]
