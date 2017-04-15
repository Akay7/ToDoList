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

