from flask import *

from ..model.album import *
album_sys = Blueprint('album_sys',__name__,)
@album_sys.route('/albums',methods=["GET"])
def attractions_search():
  response=sql_get_all_albums()
  return(response)
@album_sys.route('/album/<albumKey>')
def attraction_id_search(albumKey):

  response_body=sql_get_album(albumKey)
  
  return(response_body)
@album_sys.route('/album/song/<keyword>',methods=["GET"])
def albumSearchSong(keyword):
  response=sql_search_song(keyword)
  return(response)

@album_sys.route('/albums/sort/<sort>',methods=["GET"])
def getAlbumSortlist(sort):
  response=sql_sort_album(sort)
  return(response)
      
  
