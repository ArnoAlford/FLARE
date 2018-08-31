#This is where the database tables and their columns are established
from . import db
#This is the User table. The widget rows were built-in as a development option to put the iframe
#window html into. We ended up using javascript to allow the changing of the iframe windows, and took
#out the user section on the page. So this table is completely not used at this point in the live site.
class User(db.Model):
    __tablename__ = 'users'
    username = db.Column(db.String(64), unique=True, primary_key=True, index=True)
    widget_a = db.Column(db.String(150), nullable=True)
    widget_b = db.Column(db.String(150), nullable=True)
    widget_c = db.Column(db.String(150), nullable=True)
    widget_d = db.Column(db.String(150), nullable=True)
    widget_e = db.Column(db.String(150), nullable=True)
    widget_f = db.Column(db.String(150), nullable=True)
    widget_g = db.Column(db.String(150), nullable=True)
    widget_h = db.Column(db.String(150), nullable=True)

    def __repr__(self):
        return '<User %r>' % self.username
#This is the bookmark table, and this one is actually used. This translates to the bookmark
#values you see from the bookmark dropdown. 
class Bookmark(db.Model):
    __tablename__ = 'bookmarks'
    bookmarkname = db.Column(db.String(64), unique=True, primary_key=True)
    url = db.Column(db.String(150), unique=True)

    def __repr__(self):
        return '<Bookmark %r>' % self.bookmarkname

#If you wanted to change the layout of the database or add a table, this is where you would do it.
