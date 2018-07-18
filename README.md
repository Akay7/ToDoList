# ToDo List

###### ToDo list based on latest technologies

## What is that

I'm start that project because would like to try how work together latest Angular and Django.

***%%% Work in progress %%%***


## How to start that project in local environment?

### Database

You must install PostgreSQL(>=9.4). You must create database 'todo_list',
then add and user 'todo_list' with password 'todo_list' and make him owner of created database.

### Backend

all commands run inside backend folder

1. Install python(>=3.4).

2. Install virtuaenv tools and make virtual environment for project(optional).

    a) Install virtualenv tools `pip install virtualenv`.

    b) Create virtual environment call command `virtualenv .venv`.

    c) Activate environment `source .venv/bin/activate`(on Linux).

3. Install requirements `pip install -r requirements/base.txt`.

4. Run migrations `python manage.py migrate`

5. Start dev-server `python manage.py runserver`

### Frontend

all commands run inside frontend folder

1. You must have installed npm package manager

2. Run `npm install` for install dependencies

3. Run `npm run start` for start dev server(
for correct works requests to api,
you must start backend dev server, step 5 in Backend section).

### Deploy tools

I'm thinking long time about public deploy tools(with config from server) or keep in secret.
And for now I'm make choice publish systemd circus service and fabfile wich I'm use for upgrade server.
So I will keep in secret nGinx config file and version of django settings which used on server.
I'm also hopeful if anyone find vulnerable in those configs or in the project, they will send direct email to [me](mailto:egor@crazyrussian.pro).

### Credits

1. I'm to know about TDD from [book Percival Test-Driven Development with Python of Harry J.W.](http://www.obeythetestinggoat.com/pages/book.html)(I'm read first edition, soon will released 2 edition, but some aspects from first book is still actual)
2. Łukasz Wojciechowski [article about angular2 and web-sockets](https://medium.com/@lwojciechowski/websockets-with-angular2-and-rxjs-8b6c5be02fac).
3. I'm take implementation of web-sockets for angular2 by Peter Kassenaar from his github [repo](https://github.com/PeterKassenaar/ng2-websockets)

### History log

0.1.0 - Django 1.11, Channels 1.x, Angular 4
