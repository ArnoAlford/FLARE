from flask import render_template, session, redirect, url_for, current_app, send_file
from .. import db
from ..models import User
from ..models import Bookmark
from . import main
from .forms import NameForm
#Here we import important functions from Flask such as render_template, url_for, send_file ect.
#We use these functions to give the program its actual logic. In addition to this we import the
#database, the User and Bookmark table from models.py, and the NameForm from forms.py.

@main.route('/', methods=['GET', 'POST'])
#Here we establish the route. So all the logic and variables in this @main.route
# pertain only to flare.battle.net/. If you wanted to make say a login page, you
# would make a route for '/login' to get flare.battle.net/login. Also note that
# this route is registered as a handler for 'GET' and 'POST' requests.
def index():
    emptystring = ''
    emptystring2 = ''
    for bm in Bookmark.query.all():
        emptystring += '<a class="dropdown-item" target="_blank" href="' +  bm.url + '">' + bm.bookmarkname + '</a>'
        emptystring2 += '<div id="' + bm.bookmarkname + 'Modal"></div>'
#So to make the bookmarks appear in the drop down, we query the database for bookmarks, and then
#add the necesary html around them to make it a dropdown item. These html  strings are all appended
#and stored into emptystring as one giant string, which is then passed to base.html through
#return render_template.
#emptystring2 is not used at the moment of writing this, but it was meant to be the same idea,
#but with the capacity for each bookmark to expand out as a modal instead of a new tab.
    form = NameForm()
    if form.validate_on_submit() and form.submit.data:
        user = User.query.filter_by(username=form.name.data).first()
        if user is None:
            user = User(username=form.name.data)
            db.session.add(user)
            db.session.commit()
            session['known'] = False
        else:
            session['known'] = True
        session['name'] = form.name.data
#This is not used in the current version of the app; however, it is important because it adds the
#functionality to have a user register/login, and for that username  to be entered into the database and
# to be remembered across sessions.  
	emptystring = ''
	emptystring2 = ''
        return redirect(url_for('.index'))
    return render_template('index.html', form=form, name=session.get('name'),
                           known=session.get('known', False), emptystring=emptystring, emptystring2=emptystring2)

#This returns the values we established in emptystring and returns them into the form when index.html is rendered.
#So basically this takes the giant emptystring we stuck all the bookmark html into, and throws that data to the 
#template. This is the only way we can pass variables, and thus dynamic data, into the templates.
