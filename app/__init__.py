#This file exists because we delay the creation of the application by moving
#it into a factory function that can be explicitly invoked from the script.
#This is the application package constructor

from flask import Flask, render_template
from flask_bootstrap import Bootstrap
from flask_sqlalchemy import SQLAlchemy
from config import config

#The constructor imports most of the Flask extensions currently in use, but
#because there is no application instance to initialize them with, it creates
#them uninitialized by passing no arguments into their constructors.

bootstrap = Bootstrap()
db = SQLAlchemy()

def create_app(config_name):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    config[config_name].init_app(app)

    bootstrap.init_app(app)
    db.init_app(app)

    from .main import main as main_blueprint
    app.register_blueprint(main_blueprint)

    return app

#All in all, you probably don't need to touch this unless you're trying to add an extention to Flask
