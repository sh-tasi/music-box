from flask import *

from ..model.album import *
album_sys = Blueprint('album_sys',__name__,)
@album_sys.route('/albums',methods=["GET"])
def attractions_search():
  redis_response=redis_get_all_album()
  if redis_response==None:
    response=sql_get_all_albums()
    redis_set_all_album(response)
  else:
    response=redis_response
  return jsonify(response)
@album_sys.route('/album/<albumKey>')
def attraction_id_search(albumKey):
  redis_response=redis_get_album_albumkey(albumKey)
  if redis_response==None:
    response=sql_get_album(albumKey)
    redis_set_album_albumkey(albumKey,response)
  else:
    response=redis_response
  return jsonify(response)
@album_sys.route('/album/song/<keyword>',methods=["GET"])
def albumSearchSong(keyword):
  response=sql_search_song(keyword)
  return(response)

@album_sys.route('/albums/sort/<sort>',methods=["GET"])
def getAlbumSortlist(sort):
  redis_response=redis_get_sort_album(sort)
  if redis_response==None:
    response=sql_sort_album(sort)
    redis_set_sort_album(sort,response)
  else:
    response=redis_response
  return jsonify(response)
      
  
