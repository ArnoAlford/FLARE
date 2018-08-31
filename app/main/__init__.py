from flask import Blueprint

main = Blueprint('main', __name__)

from . import views, errors

#This file creates the main blueprint that the whole application uses.

#You will absolutly never need to touch this file unless you're completely
#rewriting the application from the ground up.
