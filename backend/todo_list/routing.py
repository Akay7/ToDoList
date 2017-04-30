from channels.routing import route_class
from channels.generic.websockets import WebsocketDemultiplexer

from todo_item.models import TodoItemBinding


class Demultiplexer(WebsocketDemultiplexer):
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
        if todo_list_id:
            groups.append(todo_list_id)
        return groups

channel_routing = [
    route_class(Demultiplexer, path="^/api/ws/$")
]
