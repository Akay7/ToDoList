from django.contrib.staticfiles.testing import StaticLiveServerTestCase

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


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

        input_box.send_keys(todo_title)
        create_button.click()

        # waiting when loaded second page with table of todos
        WebDriverWait(self.browser, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "table"))
        )


        # test new todo_must be created
        self.assertIn(
            todo_title,
            self.browser.find_element_by_tag_name("body").text
        )

    def test_can_see_todo_item_created_in_different_window_of_browser(self):
        # ToDo: ask about StaticLiveServerTestCase for channel
        # FixMe: update that test case for server with channels
        todo_title = "Brush teeth"

        # connect to server from two browser instances
        self.browser.get(self.live_server_url)
        browser2 = webdriver.Chrome()
        browser2.get(self.live_server_url)

        # add new todo_item in first browser instance
        input_box = self.browser.find_element_by_id('new-item-title')
        create_button = self.browser.find_element_by_id('new-item-create')

        input_box.send_keys(todo_title)
        create_button.click()

        # try to look at that text in second browser instance
        self.assertIn(
            todo_title,
            browser2.find_element_by_tag_name("body").text
        )
