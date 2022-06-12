from flask import *
from api.album_sys.view import album_sys
from api.member_sys.view import member_sys
from api.playlist_sys.view import playlist_sys
from router.memberPage.view import memberPage
import mysql.connector
import configparser
config = configparser.ConfigParser()
config.read('config.ini')

app=Flask(__name__)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
app.register_blueprint(album_sys, url_prefix='/api')
app.register_blueprint(member_sys, url_prefix='/api')
app.register_blueprint(memberPage, url_prefix='/member')
app.register_blueprint(playlist_sys, url_prefix='/api')

dbconfig = {
    "host":config['datakey']['host'],
    "port":"3306",
    "user":config['datakey']['user'],
    "password":config['datakey']['password'],
    "database":"music_box"
}
cnx = mysql.connector.connect(pool_name = "mypool",
                              pool_size = 25,
                              pool_reset_session=True,
                              **dbconfig)

# Pages
@app.route('/', defaults={'path': ''})

@app.route('/<path:path>')
def catch_all(path):
	#return send_file("./templates/index.html")
	return render_template("index.html")




app.run(host='0.0.0.0', port=3000)