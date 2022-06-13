from flask import *
from ..model.playlist import *
from ..model.member import *

playlist_sys = Blueprint('playlist_sys',__name__,)


@playlist_sys.route('/playlist',methods=["POST"])
def addPlayListROUTER():
    token=get_token()
    if token==None:
        response={"error":True,"message":"尚未登入系統"}
    else:
        data=request.get_json()
        playlistName=data['playlistName']
        userId=decode_token_user(token)
        playlistKey=addPlaylist(userId,playlistName)
        response={"ok":True,"playlistKey":playlistKey}
    repsone_js=jsonify(response)
    return(repsone_js)
@playlist_sys.route('/playlist',methods=["DELETE"])
def deletPlayListROUTER():
    token=get_token()
    if token==None:
        response={"error":True,"message":"尚未登入系統"}
    else:
        data=request.get_json()
        playlistKey=data['playlistKey']
        userId=decode_token_user(token)
        rep=deletPlaylist(userId,playlistKey)
        if rep=="ok":
            response={"ok":True,"playlistKey":playlistKey}
        else:
            response={"error":True,"message":"資料庫連線失敗"}
    repsone_js=jsonify(response)
    return(repsone_js)
@playlist_sys.route('/playlist/song',methods=["POST"])
def addSongInPlayListROUTER():
    token=get_token()
    if token==None:
        response={"error":True,"message":"尚未登入系統"}
    else:
        userId=decode_token_user(token)
        data=request.get_json()
        playlistKey=data['playlistKey']
        songlist=data['songlist']
        message=addSongInPlaylist(userId,playlistKey,songlist)
        if message!="ok":
            response={"error":True,"message":"連線失敗"}
        else:
            response={"ok":True,"playlistKey":playlistKey}
    repsone_js=jsonify(response)
    return(repsone_js)
@playlist_sys.route('/playlist',methods=["GET"])
def getUserplaylistROUTE():
    token=get_token()
    if token==None:
        response={"error":True,"message":"尚未登入系統"}
    else:
        userId=decode_token_user(token)
        userplaylist=getUserplaylist(userId)
        if userplaylist=="error":
            response={"error":True,"message":"錯誤的資料"}
        else:    
            response={"data":userplaylist}
    return jsonify(response)
@playlist_sys.route('/playlist/<playlistID>',methods=["GET"])
def getUserPlaylistKeyROUTE(playlistID):
    token=get_token()
    if token==None:
        response={"error":True,"message":"尚未登入系統"}
    else:
        userId=decode_token_user(token)
        item=getUserPlaylistSong(userId,playlistID)
        if item=="error":
            response={"error":True,"message":"錯誤的參數"}
        else:
            response={
                "data":{
                    "listName":item['listName'],
                    "listImage":item['listImage'],
                    "songlist":item['songlist']
                }
            }
        repsone_js=jsonify(response)
    return(repsone_js)
@playlist_sys.route('/playlist/userData',methods=["GET"])
def getUserDataForUser():
    token=get_token()
    if token==None:
        response={"error":True,"message":"尚未登入系統"}
    else:
        data={}
        userId=decode_token_user(token)
        userplaylist=getUserplaylist(userId)
        if userplaylist=="error":
            response={"error":True,"message":"錯誤的資料"}
        else:
            if userplaylist==[]:
                response={"error":True,"message":"目前沒有播放列表"}
            else:    
                for i in  userplaylist:
                    data[i["playlistKey"]]=[i["songlist"],i["listName"],i["listImage"]]
                    response={"data":data}
    repsone_js=jsonify(response)
    return(repsone_js)
@playlist_sys.route('/playlist/changeName',methods=["POST"])
def changePlaylistnameROUTER():
    token=get_token()
    if token==None:
        response={"error":True,"message":"尚未登入系統"}
    else:
        userId=decode_token_user(token)
        data=request.get_json()
        playlistKey=data['playlistKey']
        newName=data['newName']
        changePlaylistName(userId,playlistKey,newName)
        response={"ok":True,"playlistKey":playlistKey}
    repsone_js=jsonify(response)    
    return(repsone_js)
@playlist_sys.route('/playlist/changeImg',methods=["POST"])
def changePlaylistImgROUTER():
    token=get_token()
    if token==None:
        response={"error":True,"message":"尚未登入系統"}
    else:
        userId=decode_token_user(token)
        file=request.files['imageFile']
        playlistKey= request.form.get('playlistKey')
        response=changePlaylistIMG(userId,playlistKey,file)
    repsone_js=jsonify(response)
    return(repsone_js)