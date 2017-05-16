import os
from fabric.api import env, run, put


REPO_URL = "git@github.com:Akay7/ToDoList.git"

env.user = 'todo_list'
env.hosts = ['todo.crazyrussian.pro']


def update(branch="master"):
    source_folder = "/home/todo_list/sites/ToDoList/"
    # latest source
    _get_latest_source(source_folder, branch)
    # backend requirements
    _update_virtualenv(source_folder)
    # frontend requirements and collect
    _npm_install(source_folder)
    _ng_build(source_folder)
    _update_static_files(source_folder)
    # update database
    _update_database(source_folder)

    _put_settings(source_folder)
    _reload_circus(source_folder)


def _get_latest_source(source_folder, branch):
    run('cd {} && git pull origin {}'.format(source_folder, branch))


def _update_virtualenv(source_folder):
    virtualenv_folder = source_folder + 'backend/.venv'
    run('{venv}/bin/pip install -r {source}/backend/requirements/prod.txt'.format(
        venv=virtualenv_folder, source=source_folder
    ))


def _update_static_files(source_folder):
    run('cd {source} && backend/.venv/bin/python backend/manage.py collectstatic --noinput'.format(
        source=source_folder
    ))


def _update_database(source_folder):
    run('cd {source} && backend/.venv/bin/python backend/manage.py migrate --noinput'.format(
        source=source_folder
    ))


def _npm_install(source_folder):
    run('cd {source}frontend/ && npm install'.format(source=source_folder))


def _ng_build(source_folder):
    run('cd {source}frontend && ng build -prod'.format(source=source_folder))


def _reload_circus(source_folder):
    run('cd {source}backend/ && .venv/bin/circusctl reload'.format(source=source_folder))


def _put_settings(source_folder):
    source = os.path.join('..', 'backend', 'todo_list', 'settings', 'prod.py')
    target = source_folder + 'backend/todo_list/settings/prod.py'
    put(source, target)
