from flask import *
import mysql.connector
import time
import jwt
import boto3
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
# for singup model
def check_account_data(username,password,email):
    for ch in password:
        if '\u4e00' <= ch <= '\u9fa5':
            resp={"error":True,"message":"請勿輸入中文"}
            resp_js=jsonify(resp)
            return(resp_js)
    for ch in email:
        if '\u4e00' <= ch <= '\u9fa5':
            resp={"error":True,"message":"請勿輸入中文"}
            resp_js=jsonify(resp)
            return(resp_js)
    if username==None or password==None or email==None:
        resp={"error":True,"message":"資料格式不符合"}
        resp_js=jsonify(resp)
        return(resp_js)
    elif len(username)==0 or len(password)==0 or len(email)==0 or username.isspace()==True or password.isspace()==True or email.isspace() or "@"  not in email :
        resp={"error":True,"message":"資料格式不符合"}
        resp_js=jsonify(resp)
        return(resp_js)
    elif len(username)>25 or len(password)>25 or len(email)>60:
        resp={"error":True,"message":"資料格式不符合"}
        resp_js=jsonify(resp)
        return(resp_js)
    else:
        return("ok")
def sql_check_email(email):
    cnx = mysql.connector.connect(pool_name = "mypool")
    mycursor = cnx.cursor()
    sql = "SELECT `email` FROM `MEMBER` WHERE `email` = %s"
    email_sql = (email, )
    mycursor.execute(sql, email_sql)
    myresult = mycursor.fetchall()
    mycursor.close()    
    cnx.close()
    if email_sql in myresult:
        resp={"error":True,"message":"信箱已被註冊"}
        resp_js=jsonify(resp)
        return (resp_js)
    else :
        return("ok")  
def sql_register(email,username,password):
    cnx = mysql.connector.connect(pool_name = "mypool")
    mycursor = cnx.cursor()
    sql="INSERT INTO `MEMBER` (username,email,password) VALUES(%s,%s,%s)"
    val=(username,email,password)
    mycursor.execute(sql, val)
    cnx.commit()
    mycursor.close()  
    cnx.close() 
    resp={"ok":True}
    resp_js=jsonify(resp)
    return (resp_js)

# for singin model

def check_data_login(email,password):
    for ch in password:
        if '\u4e00' <= ch <= '\u9fa5':
            resp={"error":True,"message":"請勿輸入中文"}
            resp_js=jsonify(resp)
            return(resp_js)
    for ch in email:
        if '\u4e00' <= ch <= '\u9fa5':
            resp={"error":True,"message":"請勿輸入中文"}
            resp_js=jsonify(resp)
            return(resp_js)
    if email==None or password==None:
        resp={"error":True,"message":"資料格式不符合"}
        resp_js=jsonify(resp)
        return(resp_js)
    elif len(password)==0 or len(email)==0 or password.isspace()==True or email.isspace()==True or "@" not in email:
        resp={"error":True,"message":"資料格式不符合"}
        resp_js=jsonify(resp)
        return(resp_js)
    elif len(password)>25 or len(email)>60:
        resp={"error":True,"message":"資料格式不符合"}
        resp_js=jsonify(resp)
        return(resp_js)
    else:
        return("ok")
def sql_longin_data_check(email,password):
    cnx = mysql.connector.connect(pool_name = "mypool")
    mycursor = cnx.cursor()
    sql="SELECT `email`,`password`,`id` FROM `MEMBER` WHERE `email` = %s "
    val=(email,)
    mycursor.execute(sql,val)
    myresult=mycursor.fetchone()
    mycursor.close()  
    cnx.close() 
    if myresult==None:
        return("error")
    else:
        check_email=myresult[0]
        check_passwrod=myresult[1]
        userID=myresult[2]
        if password==check_passwrod and email==check_email:
            return (userID)
        else:
            return("error")
def set_token(userID):
    encoded_jwt = jwt.encode({"username": userID}, "secret", algorithm="HS256")
    response_js=jsonify({"ok":True})
    resp = make_response (response_js)
    resp.set_cookie(key='JWT', value=encoded_jwt,expires=time.time()+60*60*24*15,httponly=True)
    return resp


# for get user
def get_token():
    JWT = request.cookies.get('JWT')
    if JWT==None :
        return (None)
    else:
        return(JWT)
def sql_get_user_data(userID):
    cnx = mysql.connector.connect(pool_name = "mypool")
    mycursor = cnx.cursor()
    sql="SELECT `username`,`email`,`memberimage` FROM `MEMBER` WHERE `id` = %s "
    val=(userID,)
    mycursor.execute(sql,val)
    myresult=mycursor.fetchone()
    mycursor.close()  
    cnx.close() 
    return(myresult)
def get_user(token):
    token_decode=jwt.decode(token, "secret", algorithms=["HS256"])   
    username=token_decode["username"]
    userData=sql_get_user_data(username)
    data={"id":username,"name":userData[0],"email":userData[1],"userImg":userData[2]}
    response={"data":data}  
    return jsonify(response)
def decode_token_user(token):
    token_decode=jwt.decode(token, "secret", algorithms=["HS256"])   
    userID=token_decode["username"]
    userID_str=str(userID)
    return(userID_str)
# for sign out
def delet_token():
    response_js=jsonify({"ok":True})
    resp = make_response(response_js)
    resp.set_cookie(key='JWT', value='', expires=0)
    return resp
    
    
# for upload member img
def upload_img(file,id):
    nowTime = int(time.time())
    struct_time = time.localtime(nowTime)
    number = time.strftime("%Y%m%d%H%M%S", struct_time)
    if file:
        
        myFilename= "member.jpg"
        
        s3Filename= number+id+".jpg"
        
        file.save(os.path.join("tempfile/"+myFilename))
        
        s3.upload_file(
            Bucket="shenghao",
            Filename="tempfile/"+myFilename,
            Key= "musicbox/member/"+s3Filename,
            
        )
    cnx = mysql.connector.connect(pool_name = "mypool")
    mycursor = cnx.cursor()
    sql = "UPDATE `MEMBER` SET `memberimage` = %s WHERE `id` = %s"
    val = (s3Filename,id)
    mycursor.execute(sql,val)
    cnx.commit()
    mycursor.close()
    cnx.close()
    rep={"ok":True,"img":s3Filename}
    
    return jsonify(rep)
# change name
def sql_changeName(id,newname):
    cnx = mysql.connector.connect(pool_name = "mypool")
    mycursor = cnx.cursor()
    sql = "UPDATE `MEMBER` SET `username` = %s WHERE `id` = %s"
    val = (newname,id)
    mycursor.execute(sql,val)
    cnx.commit()
    mycursor.close()
    cnx.close()
    rep={"ok":True,"name":newname}
    return (rep)
# change password
def sql_changePassword(id,newpassword):
    cnx = mysql.connector.connect(pool_name = "mypool")
    mycursor = cnx.cursor()
    sql = "UPDATE `MEMBER` SET `password` = %s WHERE `id` = %s"
    val = (newpassword,id)
    mycursor.execute(sql,val)
    cnx.commit()
    mycursor.close()
    cnx.close()
    rep={"ok":True,"message":"資料更新成功"}
    return (rep)
def sql_check_oldpw(id,oldpw):
    cnx = mysql.connector.connect(pool_name = "mypool")
    mycursor = cnx.cursor()
    sql="SELECT `password` FROM `MEMBER` WHERE `id` = %s "
    val=(id,)
    mycursor.execute(sql,val)
    myresult=mycursor.fetchone()
    mycursor.close()  
    cnx.close() 
    if myresult[0]==oldpw:
        reponse="ok"
    else:
        reponse={"error":True,"message":"舊密碼錯誤"}
    return(reponse)
    
    