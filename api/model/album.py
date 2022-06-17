import mysql.connector
from flask import jsonify
import json
import redis 
import configparser
config = configparser.ConfigParser()
config.read('config.ini')
redis_pool=redis.ConnectionPool(host=config['datakey']['redisPoint'], port=6379, decode_responses=True)
r = redis.Redis(connection_pool=redis_pool)
def sql_get_all_albums():
    cnx = mysql.connector.connect(pool_name = "mypool")
    mycursor = cnx.cursor()
    sql="SELECT `id`,`album_name`,`artis`,`albumkey`,`imgkey` FROM `ALBUM` ORDER BY `id`"
    mycursor.execute(sql)
    myresult=mycursor.fetchall()
    albumlist=[]
    for album in myresult:
            albumData={
            "id":album[0],
            "albumName":album[1],
            "albumArtis":album[2],
            "albumKey":album[3],
            "albumImg":album[4]
            }
            albumlist.append(albumData)
    response={"data":albumlist}
    mycursor.close()
    cnx.close()
    return(response)
def sql_get_album(albumkey):
    cnx = mysql.connector.connect(pool_name = "mypool")
    mycursor = cnx.cursor()
    sql="SELECT `song_id`,`song_name`,`songtime`,`datakey`,`album_name`,`artis`,`imgkey` FROM `ALBUM`  JOIN `SONG_LIST` ON `id`=`album_id`WHERE `albumkey`=%s"
    albumkey_sql=(albumkey,)
    mycursor.execute(sql,albumkey_sql)
    myresult=mycursor.fetchall()
    if myresult==[]:
        response_body={
            "error":"true",
            "message":"查無此專輯"
        }
    else:
        songList=[]
        for song in myresult:
            songData={
                "id":song[0],
                "name":song[1],
                "time":song[2],
                "key":song[3]
            }
            songList.append(songData)
        response_body={"data":{
            "albumName":myresult[0][4],
            "albumID":albumkey,
            "albumImg":myresult[0][6],
            "albumArtis":myresult[0][5],
            "songList":songList
        }
    }
    mycursor.close()
    cnx.close()

    return(response_body)
def sql_search_song(keyword):
    cnx = mysql.connector.connect(pool_name = "mypool")
    mycursor = cnx.cursor()
    sql="SELECT `song_name`,`album_name`,`albumkey`,`datakey`,`songtime`,`imgkey`,`artis` FROM `SONG_LIST`JOIN `ALBUM` ON `id`=`album_id` WHERE `song_name` like %s "
    keyword_sql=["%"+keyword+"%"]
    mycursor.execute(sql,keyword_sql)
    myresult_key=mycursor.fetchall()
    if myresult_key==[]:
        response_body={
            "error":"true",
            "message":"查無此歌曲"
        }
    else:
        songlist=[]
        for song in myresult_key:
            songData={
                "name":song[0],
                "album":song[1],
                "albumkey":song[2],
                "datakey":song[3],
                "songtime":song[4],
                "imgkey":song[5],
                "artis":song[6]  
            }
            songlist.append(songData)
        response_body={
            "data":songlist
        }
    response_body_js=jsonify(response_body)
    mycursor.close()
    cnx.close()
    return(response_body_js)
def sql_sort_album(sort):
    cnx = mysql.connector.connect(pool_name = "mypool")
    mycursor = cnx.cursor()
    sql="SELECT `id`,`album_name`,`artis`,`albumkey`,`imgkey` FROM `ALBUM` WHERE `sort` like"
    sort_list="'"+sort+"%"+"'"
    sql_go=sql+sort_list
    mycursor.execute(sql_go)
    myresult=mycursor.fetchall()

    albumlist=[]
    for album in myresult:
            albumData={
            "id":album[0],
            "albumName":album[1],
            "albumArtis":album[2],
            "albumKey":album[3],
            "albumImg":album[4]
            }
            albumlist.append(albumData)
    response={"data":albumlist}
    mycursor.close()
    cnx.close()
    return(response)

def redis_set_all_album(response): 
    response_js=json.dumps(response)
    r.set('all_album', response_js,ex=3600*6)
def redis_get_all_album():
    response=r.get('all_album')
    if response==None:
        return(response)
    else:
        reponse_dict=json.loads(response)
        return(reponse_dict)
def redis_set_sort_album(sort,response):
    response_js=json.dumps(response)
    r.set(sort, response_js,ex=3600*6)
def redis_get_sort_album(sort):
    response=r.get(sort)
    if response==None:
        return(response)
    else:
        reponse_dict=json.loads(response)
        return(reponse_dict)
def redis_set_album_albumkey(albumKey,response):
    response_js=json.dumps(response)
    r.set(albumKey, response_js,ex=600)
def redis_get_album_albumkey(albumKey):
    response=r.get(albumKey)
    if response==None:
        return(response)
    else:
        reponse_dict=json.loads(response)
        return(reponse_dict)
