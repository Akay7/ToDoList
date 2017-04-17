from django.test import TestCase
from channels.test import ChannelTestCase, HttpClient

from .models import TodoItem


class WebSocketTests(ChannelTestCase):
    def test_creating_new_todo_items_send_notification(self):
        client = HttpClient()
        client.join_group("todo_list")

        TodoItem.objects.create(title="test_item")

        received = client.receive()

        self.assertNotEquals(received, None)

    def test_cant_add_new_todo_item_by_ws(self):
        client = HttpClient()
        client.join_group("todo_list")

        payload = {
            'stream': 'todo_item',
            'payload': {'data': {'title': 'test_item'}, 'action': 'create',}
        }

        client.send_and_consume('websocket.receive', path='/api/ws/', text=payload)

        self.assertEqual(TodoItem.objects.count(), 0)
