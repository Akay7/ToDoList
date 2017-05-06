from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from channels.test import ChannelTestCase, HttpClient

from .models import TodoItem, TodoList

UserModel = get_user_model()


class TodoListTests(TestCase):
    def test_can_have_todo_items_in_todo_list(self):
        todo_list = TodoList.objects.create(title='default')
        TodoItem.objects.create(title='brush teeth', todo_list=todo_list)

    def test_when_add_new_todo_items_it_adding_to_todo_list(self):
        qty_todo_lists_before = TodoList.objects.count()
        payload = {'title': 'Brush teeth'}
        response = self.client.post('/api/web/todo_item/', payload)
        self.assertEqual(response.status_code, 201)

        self.assertTrue(TodoList.objects.filter(id=response.json()['todo_list']).exists())
        self.assertEqual(TodoList.objects.count(), qty_todo_lists_before + 1)

    def test_can_create_many_todo_lists_but_cant_look_at_them_without_direct_link(self):
        qty_todo_items_before = TodoList.objects.count()
        payload = {'title': 'Homework'}
        response = self.client.post('/api/web/todo_list/', payload)
        self.assertEqual(response.status_code, 201)
        payload = {'title': 'Products'}
        response = self.client.post('/api/web/todo_list/', payload)
        self.assertEqual(response.status_code, 201)

        # todo_lists must exists in db
        self.assertEqual(TodoList.objects.count(), qty_todo_items_before + 2)

        response = self.client.get('/api/web/todo_item/')
        self.assertEqual(len(response.json()), 0)

    def test_can_get_access_to_todo_list_by_direct_link(self):
        qty_todo_items_before = TodoList.objects.count()
        payload = {'title': 'Homework'}
        response = self.client.post('/api/web/todo_list/', payload)
        self.assertEqual(response.status_code, 201)

        # todo_list must exists in db
        self.assertEqual(TodoList.objects.count(), qty_todo_items_before + 1)

        todo_list_uid = response.json()['id']
        # unique id of list must be very long
        self.assertTrue(len(todo_list_uid) > 10)

        response = self.client.get('/api/web/todo_list/{}/'.format(todo_list_uid))
        self.assertEqual(response.status_code, 200)

        self.assertEqual(response.json()['title'], 'Homework')

    def test_can_see_all_todo_items_directed_to_special_list(self):
        todo_list1 = TodoList.objects.create(title="Homework")
        todo_list2 = TodoList.objects.create(title="Products")
        todo_item1 = TodoItem.objects.create(todo_list=todo_list1, title="Buy products")
        todo_item2 = TodoItem.objects.create(todo_list=todo_list2, title="Bread")
        todo_item3 = TodoItem.objects.create(todo_list=todo_list2, title="Rice")

        # can't get all todo_items by one request
        response = self.client.get('/api/web/todo_item/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 0)

        # can get filtered todo_items by todo_list
        response = self.client.get('/api/web/todo_item/', {'todo_list': todo_list2.id})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 2)
        self.assertNotContains(response, todo_item1)
        self.assertContains(response, todo_item2)
        self.assertContains(response, todo_item3)


class TodoListPermissionTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.owner = UserModel.objects.create(username='owner')
        self.other_person = UserModel.objects.create(username='other_person')
        self.todo_list = TodoList.objects.create(title='fruits', owner=self.owner)
        self.todo_item1 = TodoItem.objects.create(title='pineapple', todo_list=self.todo_list)

    def test_everyone_have_access_to_todo_list_with_full_access(self):
        self.client.force_login(self.owner)
        # owner can change name of todo_list
        response = self.client.patch(
            '/api/web/todo_list/{}/'.format(self.todo_list.id),
            {'title': 'tropic fruits'}
        )
        self.assertEqual(response.status_code, 200)

        # owner can add new todo_items
        response = self.client.post(
            '/api/web/todo_item/',
            {'title': 'guava', 'todo_list': self.todo_list.id}
        )
        self.assertEqual(response.status_code, 201)

        self.client.force_login(self.other_person)
        # other user can change name of todo_list
        response = self.client.patch(
            '/api/web/todo_list/{}/'.format(self.todo_list.id),
            {'title': 'fruits list'}
        )
        self.assertEqual(response.status_code, 200)

        # other user can add new todo_items
        response = self.client.post(
            '/api/web/todo_item/',
            {'title': 'banana', 'todo_list': self.todo_list.id}
        )
        self.assertEqual(response.status_code, 201)

        self.client.logout()
        # unauth person can change name of todo_list
        response = self.client.patch(
            '/api/web/todo_list/{}/'.format(self.todo_list.id),
            {'title': 'fruits fruits fruits!!!'}
        )
        self.assertEqual(response.status_code, 200)

        # unauth person can add new todo_items
        response = self.client.post(
            '/api/web/todo_item/',
            {'title': 'mango', 'todo_list': self.todo_list.id}
        )
        self.assertEqual(response.status_code, 201)

    def test_other_person_can_read_but_cant_change_read_only_todo_list(self):
        self.todo_list.mode = TodoList.ALLOW_READ
        self.todo_list.save()

        self.client.force_login(self.owner)
        # owner can change name of todo_list
        response = self.client.patch(
            '/api/web/todo_list/{}/'.format(self.todo_list.id),
            {'title': 'tropic fruits'}
        )
        self.assertEqual(response.status_code, 200)

        # owner can add new todo_items
        response = self.client.post(
            '/api/web/todo_item/',
            {'title': 'guava', 'todo_list': self.todo_list.id}
        )
        self.assertEqual(response.status_code, 201)

        self.client.force_login(self.other_person)
        # other user can read todo_list
        response = self.client.get('/api/web/todo_list/{}/'.format(self.todo_list.id))
        self.assertEqual(response.status_code, 200)
        # other user can read todo_items
        response = self.client.get('/api/web/todo_item/', {'todo_list': self.todo_list.id})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 2)

        # other user can't change name of todo_list
        response = self.client.patch(
            '/api/web/todo_list/{}/'.format(self.todo_list.id),
            {'title': 'fruits list'}
        )
        self.assertEqual(response.status_code, 403)

        # other user can't add new todo_items
        response = self.client.post(
            '/api/web/todo_item/',
            {'title': 'banana', 'todo_list': self.todo_list.id}
        )
        self.assertEqual(response.status_code, 400)

        self.client.logout()
        # unauth person can read todo_list
        response = self.client.get('/api/web/todo_list/{}/'.format(self.todo_list.id))
        self.assertEqual(response.status_code, 200)
        # unauth person can read todo_items
        response = self.client.get('/api/web/todo_item/', {'todo_list': self.todo_list.id})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 2)

        # unauth person can't change name of todo_list
        response = self.client.patch(
            '/api/web/todo_list/{}/'.format(self.todo_list.id),
            {'title': 'fruits fruits fruits!!!'}
        )
        self.assertEqual(response.status_code, 403)

        # unauth person can't add new todo_items
        response = self.client.post(
            '/api/web/todo_item/',
            {'title': 'mango', 'todo_list': self.todo_list.id}
        )
        self.assertEqual(response.status_code, 400)

    def test_other_person_cant_change_private_todo_list(self):
        self.todo_list.mode = TodoList.PRIVATE
        self.todo_list.save()

        self.client.force_login(self.owner)
        # owner can change name of todo_list
        response = self.client.patch(
            '/api/web/todo_list/{}/'.format(self.todo_list.id),
            {'title': 'tropic fruits'}
        )
        self.assertEqual(response.status_code, 200)

        # owner can add new todo_items
        response = self.client.post(
            '/api/web/todo_item/',
            {'title': 'guava', 'todo_list': self.todo_list.id}
        )
        self.assertEqual(response.status_code, 201)

        self.client.force_login(self.other_person)
        # other user can't change name of todo_list
        response = self.client.patch(
            '/api/web/todo_list/{}/'.format(self.todo_list.id),
            {'title': 'fruits list'}
        )
        self.assertEqual(response.status_code, 403)

        # other user can't add new todo_items
        response = self.client.post(
            '/api/web/todo_item/',
            {'title': 'banana', 'todo_list': self.todo_list.id}
        )
        self.assertEqual(response.status_code, 400)

        self.client.logout()
        # unauth person can't change name of todo_list
        response = self.client.patch(
            '/api/web/todo_list/{}/'.format(self.todo_list.id),
            {'title': 'fruits fruits fruits!!!'}
        )
        self.assertEqual(response.status_code, 403)

        # unauth person can't add new todo_items
        response = self.client.post(
            '/api/web/todo_item/',
            {'title': 'mango', 'todo_list': self.todo_list.id}
        )
        self.assertEqual(response.status_code, 400)


class WebSocketTests(ChannelTestCase):
    def setUp(self):
        self.client = HttpClient()

    def test_creating_new_todo_items_send_notification(self):
        todo_list = TodoList.objects.create(title="Products")

        self.client.send_and_consume(
            'websocket.connect', path='/api/ws/',
            content={'query_string': 'todo_list={}'.format(str(todo_list.id))},
        )

        TodoItem.objects.create(title="test_item", todo_list=todo_list)

        received = self.client.receive()

        self.assertNotEquals(received, None)

    def test_cant_add_new_todo_item_by_ws(self):
        todo_list = TodoList.objects.create(title="Products")
        self.client.join_group(str(todo_list.id))

        payload = {
            'stream': 'todo_item',
            'payload': {
                'data': {'title': 'test_item', 'todo_list': str(todo_list.id)},
                'action': 'create',
            }
        }

        self.client.send_and_consume('websocket.receive', path='/api/ws/', text=payload)

        self.assertEqual(TodoItem.objects.count(), 0)

    def test_todo_lists_have_separated_notifications(self):
        todo_list1 = TodoList.objects.create(title="Homework")
        todo_list2 = TodoList.objects.create(title="Products")

        # connect to todo_list1
        self.client.join_group(str(todo_list1.id))
        TodoItem.objects.create(title="brush teeth", todo_list=todo_list1)

        # get messages from todo_list1
        received = self.client.receive()
        self.assertNotEquals(received, None)

        # not get messages from todo_list2
        TodoItem.objects.create(title="milk", todo_list=todo_list2)
        received = self.client.receive()
        self.assertEquals(received, None)

    def test_if_not_connected_to_todo_list_not_get_notifications(self):
        todo_list = TodoList.objects.create(title="Products")

        self.client.send_and_consume('websocket.connect', path='/api/ws/')
        TodoItem.objects.create(title="test_item", todo_list=todo_list)

        received = self.client.receive()
        self.assertEquals(received, None)
