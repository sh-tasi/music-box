function message(thisMessage){
    let message=document.getElementById("regmessage")
    message.innerHTML=thisMessage
}

// for signup member
function signup(){
    let regUsername=document.getElementById("regusername").value
    let regEmail=document.getElementById("regemail").value
    let regPassword=document.getElementById("regpassword").value
    if ((regusername.value.length<1)||(regemail.value.length<1)||(regpassword.value.length<1)){
        message("請輸入正確資料")
    }
    else{
        let reqData={
            "username":regUsername,
            "email":regEmail,
            "password":regPassword
        }
        let data_js=JSON.stringify(reqData);
                        
        let req=new XMLHttpRequest();
       
        req.open("POST","/api/users");
        req.setRequestHeader("Content-type","application/json");
        req.onload=function(){
            let mydata= JSON.parse(req.response)
            if(mydata.error==true){
                message(mydata.message)
                
            }
            else{
                message("註冊成功")
                //thisbook=mydata.data
               // number=thisbook.number
                //window.location = "/thankyou?number="+number;
            }
        }
        req.send(data_js);
    }
}

// for signin member
function signin(){
    let regEmail=document.getElementById("regemail").value
    let regPassword=document.getElementById("regpassword").value
    if ((regemail.value.length<1)||(regpassword.value.length<1)){
        message("請輸入正確資料")
    }
    else{
        let reqData={
            "email":regEmail,
            "password":regPassword
        }
        let data_js=JSON.stringify(reqData);
                        
        let req=new XMLHttpRequest();
       
        req.open("PATCH","/api/users");
        req.setRequestHeader("Content-type","application/json");
        req.onload=function(){
            let mydata= JSON.parse(req.response)
            if(mydata.error==true){
                message(mydata.message)
                
            }
            else{
                //message("登入成功")
                //thisbook=mydata.data
               // number=thisbook.number
                window.location = "/";
            }
        }
        req.send(data_js);
    }
} 

// for check user
function getUserForSignPageAndSignUp(){
    let req=new XMLHttpRequest();
       
    req.open("GET","/api/users");
    req.onload=function(){
        let mydata= JSON.parse(req.response)
        if(mydata.error==true){
            // mydata.message
            User="none"
            
        }
        else{
            console.log(mydata.data)
            User=mydata.data
            window.location ="/";
            //thisbook=mydata.data
            // number=thisbook.number
            //window.location = "/thankyou?number="+number;
        }
    }
    req.send();
}
// member page change pw
async function changePassword(newpassword,oldpassword){
    return new Promise((resolve,reject)=>{
        let req=new XMLHttpRequest();
        let reqest={"newPassword":newpassword,"oldPassword":oldpassword};
        let reqest_js=JSON.stringify(reqest);
        req.open("POST","/api/users/changePassword");
        req.setRequestHeader("Content-type","application/json");
        req.onload=function(){
            if (req.status == 200){
                let mydata= JSON.parse(req.response)
                resolve(mydata.message)
            }
            else{
                reject(new Error(req))
            }

    
        }
        req.send(reqest_js);

    })

}
// member page change name 
async function changeUserName(newName){
    return new Promise((resolve,reject)=>{
        let req=new XMLHttpRequest();
        let reqest={"name":newName};
        let reqest_js=JSON.stringify(reqest);
        req.open("POST","/api/users/changeName");
        req.setRequestHeader("Content-type","application/json");
        req.onload=function(){
            if (req.status == 200){
                let mydata= JSON.parse(req.response)
                resolve(mydata.name)
            }
            else{
                reject(new Error(req))
            }

    
        }
        req.send(reqest_js);

    })

}
//member page get user 
async function getUserForMemberPage(){
    return new Promise ((resolve,reject)=>{
        let req=new XMLHttpRequest();
        req.open("GET","/api/users");
        req.onload=function(){
        let mydata= JSON.parse(req.response)
        if(mydata.error==true){
            // mydata.message
            reject(mydata.message)
            
        }
        else{
            resolve(mydata.data)
            //thisbook=mydata.data
            // number=thisbook.number
            //window.location = "/thankyou?number="+number;
        }
    }
    req.send();
    })
}
function addElementForMemberPage(data){
    let userPageArea=document.getElementById("userPageArea")
    let name=data.name;
    let img=data.userImg;
    let topArea=document.createElement("div");
    let nameDiv=document.createElement("div");
    let imgDiv=document.createElement("div");
    let imgSrc=document.createElement("img");
    let imgBt=document.createElement("div");
    let changeNamebt=document.createElement("div");
    nameDiv.innerHTML=name
    changeNamebt.innerHTML='<i class="fa fa-pencil" aria-hidden="true" data-change-name-bt></i>';
    imgBt.innerHTML='<i class="fa fa-pencil" aria-hidden="true"></i>';
    imgSrc.setAttribute("src","https://d3q6xrhh7sv0kw.cloudfront.net/musicbox/member/"+img);
    imgSrc.setAttribute("id","memberimg")
    changeNamebt.setAttribute("id","memberNamebt")
    changeNamebt.setAttribute("data-change-name-bt","");
    imgDiv.setAttribute('class',"memberimgDiv")
    imgBt.setAttribute("class","memberimgBt")
    topArea.setAttribute("class","memberTopArea");
    nameDiv.setAttribute("class","memberNameDiv");
    nameDiv.setAttribute("id","memberName");
    imgDiv.appendChild(imgSrc);
    imgDiv.appendChild(imgBt);
    topArea.appendChild(imgDiv);
    topArea.appendChild(nameDiv);
    topArea.appendChild(changeNamebt);
    userPageArea.appendChild(topArea);
    ////// change pw
    let changePw=document.createElement("div");
    let changePwTitle=document.createElement("div");
    let changePwOld=document.createElement("div")
    let changePwNew=document.createElement("div");
    let changePwNewCheck=document.createElement("div");
    let Pwoldinput=document.createElement("input");
    let Pwnewinput=document.createElement("input");
    let Pwcheckinput=document.createElement("input");
    let checkbtDiv=document.createElement("div");
    let checkPwbt=document.createElement("button");
    let pwMessageDiv=document.createElement("div");
    let pwMessage=document.createElement("label");
    let seePd=document.createElement("label");
    Pwoldinput.setAttribute("type","password");
    Pwnewinput.setAttribute("type","password");
    Pwcheckinput.setAttribute("type","password");
    seePd.setAttribute("id","seePd")
    checkPwbt.setAttribute("id","checkPwbt");
    changePw.setAttribute("id","changePw");
    checkbtDiv.setAttribute("id","checkbtDiv")
    changePwTitle.setAttribute("id","changePwTitle");
    changePwOld.setAttribute("id","changePwOld");
    changePwNew.setAttribute("id","changePwNew");
    pwMessageDiv.setAttribute("id","pwMessage")
    pwMessageDiv.setAttribute("id","pwMessageDiv");
    changePwNewCheck.setAttribute("id","changePwNewCheck");
    changePwTitle.innerHTML="修改密碼";
    changePwOld.innerHTML="舊密碼";
    changePwNew.innerHTML="新密碼";
    changePwNewCheck.innerHTML="確認密碼";
    seePd.innerHTML="(密碼最少4個字)"
    //pwMessage.innerHTML="密碼不同"
    checkPwbt.innerHTML="確認";
    ///div input append 
    changePwOld.appendChild(Pwoldinput);
    changePwNew.appendChild(Pwnewinput);
    changePwNewCheck.appendChild( Pwcheckinput);
    // bt appen
    pwMessageDiv.appendChild(pwMessage);
    checkbtDiv.appendChild(pwMessageDiv);
    checkbtDiv.appendChild(checkPwbt);

    ////////append div
    changePwTitle.appendChild(seePd);
    changePw.appendChild(changePwTitle);
    changePw.appendChild(changePwOld);
    changePw.appendChild(changePwNew);
    changePw.appendChild(changePwNewCheck);
    changePw.appendChild(checkbtDiv);
    userPageArea.appendChild(changePw);
    checkPwbt.setAttribute("disabled", "disabled");
    /////on input 監聽input
    Pwoldinput.addEventListener('input',function(){
        if(Pwoldinput.value=="" || Pwnewinput.value=="" || Pwnewinput.value=="" ){
            checkPwbt.setAttribute("disabled", "disabled");
        }
        if(Pwnewinput.value.length<4 &&Pwcheckinput.value.length<4){
            checkPwbt.setAttribute("disabled", "disabled");
            
        }
        else if(Pwnewinput.value!=Pwcheckinput.value){
            checkPwbt.setAttribute("disabled", "disabled");
            pwMessage.innerHTML="";
            pwMessage.innerHTML="新密碼與確認密碼不同"
        }
        else{
            checkPwbt.removeAttribute('disabled');
            pwMessage.innerHTML="";
        }
    })
    Pwnewinput.addEventListener('input',function(){
        if(Pwoldinput.value=="" || Pwnewinput.value=="" ||Pwcheckinput.value==""){
            checkPwbt.setAttribute("disabled", "disabled");
        }
        if(Pwnewinput.value.length<4 &&Pwcheckinput.value.length<4){
            checkPwbt.setAttribute("disabled", "disabled");
            pwMessage.innerHTML="";
            pwMessage.innerHTML="密碼最少4個字"
        }
        else if(Pwnewinput.value!=Pwcheckinput.value){
            checkPwbt.setAttribute("disabled", "disabled");
            pwMessage.innerHTML="";
            pwMessage.innerHTML="新密碼與確認密碼不同"
        }
        else{
            checkPwbt.removeAttribute('disabled');
            pwMessage.innerHTML="";
        }      
    })
    Pwcheckinput.addEventListener('input',function(){
        if(Pwoldinput.value=="" ||Pwnewinput.value=="" || Pwcheckinput.value==""){
            checkPwbt.setAttribute("disabled", "disabled");
        }
        if(Pwnewinput.value.length<4 &&Pwcheckinput.value.length<4){
            checkPwbt.setAttribute("disabled", "disabled");
            pwMessage.innerHTML="";
            pwMessage.innerHTML="密碼最少4個字"
        }
        else if(Pwnewinput.value!=Pwcheckinput.value){
            checkPwbt.setAttribute("disabled", "disabled");
            pwMessage.innerHTML="";
            pwMessage.innerHTML="新密碼與確認密碼不同";
        }
        else{
            checkPwbt.removeAttribute('disabled');
            pwMessage.innerHTML="";
        }
        
    })

    //bt 
    imgBt.onclick=function(e){
        let mean=document.getElementById("meanForUserimg");
        mean.style.display="block";
        let bg=document.getElementById("bg");
        bg.style.display="block";
    }
    checkPwbt.onclick=function(){
        if(Pwoldinput.value=="" &&Pwnewinput.value=="" && Pwcheckinput.value==""){
            pwMessage.innerHTML="請輸入密碼"
        }
        else if( Pwnewinput.value!=Pwcheckinput.value){
            pwMessage.innerHTML="新密碼與確認密碼不同"
        }
        else{

            changePassword(Pwnewinput.value,Pwoldinput.value).then(res=>{
                pwMessage.innerHTML=res
            })
        }
     //   Pwnewinput.value
      //  Pwcheckinput.value
        
    }

}

