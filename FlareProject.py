import os
from flask_migrate import Migrate
from app import create_app, db
from app.models import User, Bookmark

#All Flask applications must create an application instance. The application
#instance is an object of class Flask. This is where the application instance
#is defined.

app = create_app(os.getenv('FLASK_CONFIG') or 'default')
migrate = Migrate(app, db)

#The script begins by creating an application. The configuration is taken from the
#environmental variable FLASK_CONFIG if its defined, or else the default config is
#used.

@app.shell_context_processor 
def make_shell_context():
    return dict(db=db, User=User, Bookmark=Bookmark)

#Adds context to the shell for the database tables User and Bookmark

@app.cli.command() 
def test():
    """Run the unit tests."""
    import unittest
    tests = unittest.TestLoader().discover('tests')
    unittest.TextTestRunner(verbosity=2).run(tests)
#This section allows you to do tests to see if the app exists and if it is testing.
#To use: while on the (venv) type 'flask test' to run the tests
