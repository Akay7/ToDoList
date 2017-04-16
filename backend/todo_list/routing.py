from channels.routing import route_class
from channels.generic.websockets import WebsocketDemultiplexer

from todo_item.models import TodoItemBinding


class Demultiplexer(WebsocketDemultiplexer):
    consumers = {
        "todo_item": TodoItemBinding.consumer,
    }

    def connection_groups(self, **kwargs):
        return ("todo_list",)

channel_routing = [
    route_class(Demultiplexer, path="^/api/ws/")
]
