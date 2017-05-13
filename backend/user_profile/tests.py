from django.test import TestCase
from django.contrib.auth import get_user_model

UserModel = get_user_model()


class UserAuthTest(TestCase):
    USERNAME = "user"
    EMAIL = "user@example.org"
    PASSWORD = "boomdoom"
    FIRST_NAME="Ivan"
    LAST_NAME="Ivanov"

    def test_login_api_return_user_information(self):
        UserModel.objects.create_user(
            username=self.USERNAME, password=self.PASSWORD,
            first_name=self.FIRST_NAME, last_name=self.LAST_NAME
        )

        payload = {
            'username': self.USERNAME,
            'password': self.PASSWORD
        }
        response = self.client.post('/api/web/login/', payload)
        self.assertEqual(response.status_code, 200)

        self.assertEqual(response.json()['username'], self.USERNAME)
        self.assertEqual(response.json()['last_name'], self.LAST_NAME)

    def test_registration_api_return_user_information(self):
        users_qty = UserModel.objects.count()

        payload = {
            'username': self.USERNAME,
            'email': self.EMAIL,
            'password1': self.PASSWORD,
            'password2': self.PASSWORD,
        }
        response = self.client.post('/api/web/registration/', payload)

        self.assertEqual(response.status_code, 201)
        self.assertEqual(UserModel.objects.count(), users_qty + 1)

        self.assertEqual(response.json()['username'], self.USERNAME)
        self.assertEqual(response.json()['email'], self.EMAIL)

    def test_registration_api_return_user_information_with_empty_email(self):
        users_qty = UserModel.objects.count()

        payload = {
            'username': self.USERNAME,
            'email': " ",
            'password1': self.PASSWORD,
            'password2': self.PASSWORD,
        }
        response = self.client.post('/api/web/registration/', payload)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(UserModel.objects.count(), users_qty + 1)

        self.assertEqual(response.json()['username'], self.USERNAME)
