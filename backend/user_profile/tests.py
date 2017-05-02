from django.test import TestCase
from django.contrib.auth import get_user_model

UserModel = get_user_model()


class UserAuthTest(TestCase):
    def test_login_api_return_user_information(self):
        user = UserModel.objects.create_user(
            username="user", password="pass",
            first_name="Ivan", last_name="Ivanov"
        )

        payload = {
            'username': "user",
            'password': "pass"
        }
        response = self.client.post('/api/web/login/', payload)
        self.assertEqual(response.status_code, 200)

        self.assertEqual(user.username, response.json()['username'])
        self.assertEqual(user.last_name, response.json()['last_name'])
