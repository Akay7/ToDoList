# from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient, APITestCase
from channels.test import ChannelTestCase, HttpClient

from .models import TodoItem, TodoList, Watch, Favorite

UserModel = get_user_model()


class TodoListTests(APITestCase):
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

        response = self.client.get('/api/web/todo_list/')
        self.assertEqual(len(response.json()), 0)

    def test_logged_user_can_create_many_todo_lists_can_look_at_them_without_direct_link(self):
        user = UserModel.objects.create(username='user')
        self.client.force_login(user)
        qty_todo_items_before = TodoList.objects.count()
        payload = {'title': 'Homework', 'owner': user.id}
        response = self.client.post('/api/web/todo_list/', payload)
        self.assertEqual(response.status_code, 201)
        payload = {'title': 'Products', 'owner': user.id}
        response = self.client.post('/api/web/todo_list/', payload)
        self.assertEqual(response.status_code, 201)

        # todo_lists must exists in db
        self.assertEqual(TodoList.objects.count(), qty_todo_items_before + 2)
        self.assertEqual(TodoList.objects.filter(owner=user).count(), qty_todo_items_before + 2)

        response = self.client.get('/api/web/todo_list/')
        self.assertEqual(len(response.json()), 2)

    def test_can_look_at_own_todo_lists(self):
        user = UserModel.objects.create(username='user')
        self.client.force_login(user)
        todo_list_private_own = TodoList.objects.create(title="Private own", mode=TodoList.PRIVATE, owner=user)
        todo_list_private = TodoList.objects.create(title="Private", mode=TodoList.PRIVATE)
        todo_list_read_only = TodoList.objects.create(title="Read only", mode=TodoList.ALLOW_READ)
        todo_list_public = TodoList.objects.create(title="Public", mode=TodoList.ALLOW_FULL_ACCESS)

        response = self.client.get('/api/web/todo_list/')
        self.assertEqual(len(response.json()), 1)

    def test_can_see_list_of_favorite_todo_lists(self):
        user = UserModel.objects.create(username='user')
        self.client.force_login(user)
        todo_list_private_own = TodoList.objects.create(title="Private own", mode=TodoList.PRIVATE, owner=user)
        todo_list_private = TodoList.objects.create(title="Private", mode=TodoList.PRIVATE)
        todo_list_read_only = TodoList.objects.create(title="Read only", mode=TodoList.ALLOW_READ)
        todo_list_public = TodoList.objects.create(title="Public", mode=TodoList.ALLOW_FULL_ACCESS)

        [Favorite.objects.create(user=user, todo_list=todo_list) for todo_list in TodoList.objects.all()]
        response = self.client.get('/api/web/todo_list/')
        self.assertEqual(len(response.json()), 3)

    def test_can_see_list_of_wathed_todo_lists(self):
        user = UserModel.objects.create(username='user')
        self.client.force_login(user)
        todo_list_private_own = TodoList.objects.create(title="Private own", mode=TodoList.PRIVATE, owner=user)
        todo_list_private = TodoList.objects.create(title="Private", mode=TodoList.PRIVATE)
        todo_list_read_only = TodoList.objects.create(title="Read only", mode=TodoList.ALLOW_READ)
        todo_list_public = TodoList.objects.create(title="Public", mode=TodoList.ALLOW_FULL_ACCESS)

        [Watch.objects.create(user=user, todo_list=todo_list) for todo_list  in TodoList.objects.all()]
        response = self.client.get('/api/web/todo_list/')
        self.assertEqual(len(response.json()), 3)

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

    def test_cant_watch_at_same_todo_list_twice(self):
        user = UserModel.objects.create(username='user')
        self.client.force_login(user)
        todo_list = TodoList.objects.create(title="Fruits")

        response = self.client.post('/api/web/watch/', {'todo_list': todo_list.id})
        self.assertEqual(response.status_code, 201)

        # can't watch second time
        response = self.client.post('/api/web/watch/', {'todo_list': todo_list.id})
        self.assertEqual(response.status_code, 400)

    def test_cant_make_favorite_same_todo_list_twice(self):
        user = UserModel.objects.create(username='user')
        self.client.force_login(user)
        todo_list = TodoList.objects.create(title="Fruits")

        response = self.client.post('/api/web/favorite/', {'todo_list': todo_list.id})
        self.assertEqual(response.status_code, 201)

        # can't make favorite second time
        response = self.client.post('/api/web/favorite/', {'todo_list': todo_list.id})
        self.assertEqual(response.status_code, 400)

    def test_cant_add_to_favorite_from_other_user(self):
        user1 = UserModel.objects.create(username='user')
        user2 = UserModel.objects.create(username='user2')
        self.client.force_login(user1)
        todo_list = TodoList.objects.create(title="Fruits")

        response = self.client.post('/api/web/favorite/', {'todo_list': todo_list.id, 'user': user2.id})
        self.assertEqual(response.status_code, 201)

        self.assertTrue(Favorite.objects.filter(user=user1, todo_list=todo_list).exists())
        self.assertFalse(Favorite.objects.filter(user=user2, todo_list=todo_list).exists())

    def test_cant_create_private_todo_list_without_owner(self):
        user = UserModel.objects.create(username='user')
        self.client.force_login(user)

        payload = {'title': 'Products', 'mode': TodoList.PRIVATE, 'owner': ''}
        response = self.client.post('/api/web/todo_list/', payload)
        self.assertEqual(response.status_code, 400)

    def test_cant_path_mode_of_todo_list_for_be_without_owner_and_private(self):
        todo_list = TodoList.objects.create(title='Products')

        user = UserModel.objects.create(username='user')
        self.client.force_login(user)

        payload = {'mode': TodoList.PRIVATE}
        response = self.client.patch(
            '/api/web/todo_list/{}/'.format(todo_list.id), payload, format='json'
        )
        self.assertEqual(response.status_code, 400)

        todo_list.owner = user
        todo_list.save()
        response = self.client.patch(
            '/api/web/todo_list/{}/'.format(todo_list.id), payload, format='json'
        )
        self.assertEqual(response.status_code, 200)

    def test_cant_path_owner_of_todo_list_for_be_without_owner_and_private(self):
        todo_list = TodoList.objects.create(title='Products', mode=TodoList.PRIVATE)

        user = UserModel.objects.create(username='user')
        self.client.force_login(user)

        payload = {'owner': user.id}
        response = self.client.patch(
            '/api/web/todo_list/{}/'.format(todo_list.id), payload, format='json'
        )
        self.assertEqual(response.status_code, 403)

        todo_list.mode = TodoList.ALLOW_FULL_ACCESS
        todo_list.save()
        response = self.client.patch(
            '/api/web/todo_list/{}/'.format(todo_list.id), payload, format='json'
        )
        self.assertEqual(response.status_code, 200)


class TodoListPermissionTest(APITestCase):
    def setUp(self):
        self.owner = UserModel.objects.create(username='owner')
        self.other_person = UserModel.objects.create(username='other_person')
        self.todo_list = TodoList.objects.create(title='fruits', owner=self.owner)
        self.todo_item1 = TodoItem.objects.create(title='pineapple', todo_list=self.todo_list)

    def test_everyone_have_access_to_todo_list_with_full_access_and_without_owner(self):
        self.todo_list.owner = None
        self.todo_list.save()
        self.client.force_login(self.owner)

        self.client.force_login(self.other_person)
        # user can change name of todo_list
        response = self.client.patch(
            '/api/web/todo_list/{}/'.format(self.todo_list.id),
            {'title': 'fruits list'}
        )
        self.assertEqual(response.status_code, 200)

        # user can add new todo_items
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

        # other user can't add new todo_items and delete
        response = self.client.post(
            '/api/web/todo_item/',
            {'title': 'banana', 'todo_list': self.todo_list.id}
        )
        self.assertEqual(response.status_code, 400)

        response = self.client.delete('/api/web/todo_item/{}/?todo_list={}'.format(
            self.todo_item1.id, self.todo_list.id))
        self.assertEqual(response.status_code, 403)

        # but can get todo_item
        response = self.client.get('/api/web/todo_item/{}/?todo_list={}'.format(
            self.todo_item1.id, self.todo_list.id))
        self.assertEqual(response.status_code, 200)

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

    def test_other_person_cant_change_public_list_with_owner(self):
        self.todo_list.mode = TodoList.ALLOW_FULL_ACCESS
        self.todo_list.save()

        self.client.force_login(self.owner)
        # owner can change name of todo_list
        response = self.client.patch(
            '/api/web/todo_list/{}/'.format(self.todo_list.id),
            {'title': 'tropic fruits'}
        )
        self.assertEqual(response.status_code, 200)

        self.client.force_login(self.other_person)
        # other user can't change name of todo_list
        response = self.client.patch(
            '/api/web/todo_list/{}/'.format(self.todo_list.id),
            {'title': 'fruits list'}
        )
        self.assertEqual(response.status_code, 403)
        # but can get info
        response = self.client.get('/api/web/todo_list/{}/'.format(self.todo_list.id))
        self.assertEqual(response.status_code, 200)

        self.client.logout()
        # unauth person can't change name of todo_list
        response = self.client.patch(
            '/api/web/todo_list/{}/'.format(self.todo_list.id),
            {'title': 'fruits fruits fruits!!!'}
        )
        self.assertEqual(response.status_code, 403)

    def test_can_watch_read_only_todo_list(self):
        self.todo_list.mode = TodoList.ALLOW_READ
        self.todo_list.save()

        self.client.force_login(self.other_person)
        response = self.client.post('/api/web/watch/', {'todo_list': self.todo_list.id})
        self.assertEqual(response.status_code, 201)


class WebSocketTests(ChannelTestCase):
    def setUp(self):
        self.client = HttpClient()

    def test_creating_new_todo_items_in_public_todo_list_send_notification(self):
        todo_list = TodoList.objects.create(title="Products")

        self.client.send_and_consume(
            'websocket.connect', path='/api/ws/',
            content={'query_string': 'todo_list={}'.format(str(todo_list.id))},
        )

        TodoItem.objects.create(title="test_item", todo_list=todo_list)

        received = self.client.receive()

        self.assertNotEquals(received, None)

    def test_can_subscribe_to_read_only_todo_list(self):
        todo_list = TodoList.objects.create(title="Products", mode=TodoList.ALLOW_READ)

        self.client.send_and_consume(
            'websocket.connect', path='/api/ws/',
            content={'query_string': 'todo_list={}'.format(str(todo_list.id))},
        )

        TodoItem.objects.create(title="test_item", todo_list=todo_list)

        received = self.client.receive()
        self.assertNotEquals(received, None)

    def test_cant_subscribe_to_private_todo_list(self):
        todo_list = TodoList.objects.create(title="Products", mode=TodoList.PRIVATE)

        self.client.send_and_consume(
            'websocket.connect', path='/api/ws/',
            content={'query_string': 'todo_list={}'.format(str(todo_list.id))},
        )

        TodoItem.objects.create(title="test_item", todo_list=todo_list)

        received = self.client.receive()
        self.assertEquals(received, None)

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

    def test_get_notification_from_watched_not_private_todo_lists_and_own_private(self):
        user = UserModel.objects.create(username='user')
        todo_list_private_own = TodoList.objects.create(title="Private own", mode=TodoList.PRIVATE, owner=user)
        todo_list_private = TodoList.objects.create(title="Private", mode=TodoList.PRIVATE)
        todo_list_read_only = TodoList.objects.create(title="Read only", mode=TodoList.ALLOW_READ)
        todo_list_public = TodoList.objects.create(title="Public", mode=TodoList.ALLOW_FULL_ACCESS)

        [Watch.objects.create(user=user, todo_list=todo_list) for todo_list  in TodoList.objects.all()]

        self.client.force_login(user)
        self.client.send_and_consume('websocket.connect', path='/api/ws/')

        TodoItem.objects.create(title="test_item1", todo_list=todo_list_private_own)
        received = self.client.receive()
        self.assertNotEquals(received, None)

        TodoItem.objects.create(title="test_item2", todo_list=todo_list_private)
        received = self.client.receive()
        self.assertEquals(received, None)

        TodoItem.objects.create(title="test_item3", todo_list=todo_list_read_only)
        received = self.client.receive()
        self.assertNotEquals(received, None)

        TodoItem.objects.create(title="test_item4", todo_list=todo_list_public)
        received = self.client.receive()
        self.assertNotEquals(received, None)
