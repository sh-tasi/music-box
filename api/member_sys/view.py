from flask import *
import jwt
from ..model.member import *

member_sys = Blueprint('member_sys',__name__,)


@member_sys.route('/users',methods=["POST"])
def singUP():
    userMessage=request.get_json()
    username=userMessage['username']
    email=userMessage['email']
    password=userMessage['password']
    
    checkAccountDataMessage=check_account_data(username,password,email)
    if checkAccountDataMessage  !="ok":
        return(checkAccountDataMessage),500
    checkAccountEmailMessage=sql_check_email(email)
    if checkAccountEmailMessage !="ok":
        return(checkAccountEmailMessage),400
    registerMessage=sql_register(email,username,password)
    return(registerMessage)
@member_sys.route('/users',methods=["PATCH"])
def singIn():
    data=request.get_json()
    email=data['email']
    password=data['password']
    checkAccountDataMessage=check_data_login(email,password)
    if checkAccountDataMessage  !="ok":
        return(checkAccountDataMessage),500
    userID=sql_longin_data_check(email,password)
    if userID=="error":
        resp={"error":True,"message":"帳號或密碼輸入錯誤"}
        resp_js=jsonify(resp)
        return(resp_js)
    return(set_token(userID))
@member_sys.route('/users',methods=["GET"])
def getUser():
    token=get_token()
    if token==None:
        reponse={"error":True,"message":"尚未登入系統"}
    else:
        reponse=get_user(token)
    return(reponse),200
@member_sys.route('/users',methods=["DELETE"])
def signut():
    resp=delet_token()
    return (resp)
@member_sys.route('/users/uploadImg',methods=["POST"])
def userUploadImg():
    token=get_token()
    if token==None:
        response=jsonify({"error":True,"message":"尚未登入系統"})
    else:
        userId=decode_token_user(token)
    file=request.files['imageFile']
    response=upload_img(file,userId)
    
    return(response)
@member_sys.route('/users/changeName',methods=["POST"])
def userChangeName():
    token=get_token()
    if token==None:
        response=jsonify({"error":True,"message":"尚未登入系統"})
    else:
        userId=decode_token_user(token)
        data=request.get_json()
        name=data['name']
        response=jsonify(sql_changeName(userId,name))

    return(response)
@member_sys.route('/users/changePassword',methods=["POST"])
def userChangePassword():
    token=get_token()
    if token==None:
        response=jsonify({"error":True,"message":"尚未登入系統"})
    else:
        userId=decode_token_user(token)
        data=request.get_json()
        oldPassword=data['oldPassword']
        newPassword=data['newPassword']
        check=sql_check_oldpw(userId,oldPassword)
        if check=="ok":
            response=jsonify(sql_changePassword(userId, newPassword))
        else:
            response=jsonify(check)
    return(response)