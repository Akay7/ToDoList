from django.contrib.staticfiles.testing import StaticLiveServerTestCase
from selenium import webdriver


class FunctionalTest(StaticLiveServerTestCase):
    def setUp(self):
        self.browser = webdriver.Chrome()

    def tearDown(self):
        self.browser.close()

    def test_can_create_new_todo_item(self):
        todo_title = "Brush teeth"

        # connect to server
        self.browser.get(self.live_server_url)

        # test body not contain text
        self.assertNotIn(
            todo_title,
            self.browser.find_element_by_tag_name("body").text
        )

        # add new todo_item
        input_box = self.browser.find_element_by_id('new-item-title')
        create_button = self.browser.find_element_by_id('new-item-create')

        input_box.send_keys("Brush teeth")
        create_button.click()

        # test new todo_must be created
        self.assertIn(
            todo_title,
            self.browser.find_element_by_tag_name("body").text
        )
