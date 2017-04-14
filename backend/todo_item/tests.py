from django.test import TestCase
from channels.test import ChannelTestCase, HttpClient
from channels.signals import consumer_finished

from .models import TodoItem


class WebSocketTests(ChannelTestCase):
    def test_creating_new_todo_items_send_notification(self):
        client = HttpClient()
        client.join_group("todo_list")

        TodoItem.objects.create(title="test_item")

        # ToDo: To know why next statement is necessary
        # https://github.com/django/channels/issues/607
        # consumer_finished.send(sender=None)

        received = client.receive()

        self.assertNotEquals(received, None)
