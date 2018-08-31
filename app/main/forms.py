from flask_wtf import FlaskForm 
from wtforms import StringField, SubmitField, SelectField, SelectMultipleField
from wtforms.widgets import ListWidget, CheckboxInput
from wtforms.validators import DataRequired, Required

#Here we import the fields we need from wtforms, a Flask extension.
#Each field that is imported basically does what it sounds like it
#does. One thing of note that wtforms.validators are attributes
#that you can attach to fields, such as requiring the user to actually
#enter something into the field before submitting.

class MultiCheckboxField(SelectMultipleField):
        widget = ListWidget(prefix_label=False)
        option_widget = CheckboxInput()

class NameForm(FlaskForm):
    name = StringField('What is your username?', validators=[DataRequired()])
    submit = SubmitField('Log In')

#If you want to add a checkbox or a field that the user types into to enter
#some data, you would establish that form here.

#Although the name form is not used on live surrently, it is completely setup to
# have the user enter their name and add them into the database.


