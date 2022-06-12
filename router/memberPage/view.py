from flask import *

memberPage = Blueprint('memberPage',__name__,static_folder='static',template_folder='templates')

@memberPage.route('/signup')
def memberSignup():
	return render_template("signup.html")
@memberPage.route('/signin')
def memberSignin():
    return render_template("signin.html")