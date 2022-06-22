import boto3
from boto3.dynamodb.conditions import Key, Attr
import time
import configparser
import os
config = configparser.ConfigParser()
config.read('config.ini')
s3 = boto3.client(
    "s3",
    region_name=config['datakey']['region_s3_name'],
    aws_access_key_id=config['datakey']['aws_access_key_id'],
    aws_secret_access_key=config['datakey']['aws_secret_access_key'] 
)

dynamodb = boto3.resource(
    'dynamodb',
    region_name=config['datakey']['region_dynamodb_name'],
    aws_access_key_id=config['datakey']['aws_access_key_id'],
    aws_secret_access_key=config['datakey']['aws_secret_access_key'] 
)
userPlaylist= dynamodb.Table('userPlaylist')
def addPlaylist(userId,listName):
    #radom Time For Key
    nowTime = int(time.time())
    struct_time = time.localtime(nowTime)
    number = time.strftime("%Y%m%d%H%M%S", struct_time)
    playlistKey=number+userId
    # add playlsit item
    songlist=[]
    userPlaylist.put_item(
       Item={
            'UserID': userId,
            'playlistKey': playlistKey,
            'listName': listName,
            'listImage': 'channels4_profile.jpg',
            'songlist':songlist,
        }
    )
    return(playlistKey)
def deletPlaylist(userId,playlistKey):
    try:
        userPlaylist.delete_item(
        Key={
            'UserID': userId,
            'playlistKey': playlistKey
        }
        )
        rep="ok"
    except:
        rep="error"
    return(rep)
def addSongInPlaylist(userId,playlistKey,songlist):
    try:
        userPlaylist.update_item(
            Key={
                'UserID': userId,
                'playlistKey': playlistKey,
            },
            UpdateExpression='SET songlist = :val1',
            ExpressionAttributeValues={
                ':val1': songlist
            }
        )
        items="ok"
    except:
        items="error"
    return(items)
def getUserplaylist(UserID):
    try:
        response = userPlaylist.query(
        KeyConditionExpression= Key('UserID').eq(UserID)
        )
        items = response['Items']
    except:
        items="error"
    return(items)
def getUserPlaylistSong(userID,playlistkey):
    try:
        response = userPlaylist.get_item(
            Key={
                'UserID': userID,
                'playlistKey': playlistkey
            }
        )
        item = response['Item']
    except:
        item="error"
    return(item)
def changePlaylistName(userId,playlistKey,newName):
    try:
        userPlaylist.update_item(
            Key={
                'UserID': userId,
                'playlistKey': playlistKey,
            },
            UpdateExpression='SET listName = :val1',
            ExpressionAttributeValues={
                ':val1': newName
            }
        )
        reps="ok"
    except:
        reps="error"
    return(reps)
def changePlaylistIMG(userId,playlistKey,file):
    try:
        nowTime = int(time.time())
        struct_time = time.localtime(nowTime)
        number = time.strftime("%Y%m%d%H%M%S", struct_time)
        if file:
            
            myFilename= "playlist.jpg"
            
            s3Filename= number+userId+".jpg"
            
            file.save(os.path.join("tempfile/"+myFilename))
            
            s3.upload_file(
                Bucket="shenghao",
                Filename="tempfile/"+myFilename,
                Key= "musicbox/playlistImg/"+s3Filename,
                
            )
        userPlaylist.update_item(
            Key={
                'UserID': userId,
                'playlistKey': playlistKey,
            },
            UpdateExpression='SET listImage = :val1',
            ExpressionAttributeValues={
                ':val1': s3Filename
            }
        )
        reps={"ok":True,"image":s3Filename,"playlistKey":playlistKey}
    except:
        reps={"error":True,"message":"連線錯誤"}
    return(reps)
        