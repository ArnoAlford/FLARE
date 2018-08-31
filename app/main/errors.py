from flask import render_template
from . import main

#This tells Flask to render the 404.html or 500.html whenever
#the server returns those respective errors to the user.

@main.app_errorhandler(404) 
def page_not_found(e):
    return render_template('404.html'), 404

@main.app_errorhandler(500) 
def internal_server_error(e):
    return render_template('500.html'), 500

#This would only need to be changed if the error pages
#were not displaying properly.
