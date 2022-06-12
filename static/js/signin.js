
let signbutton=document.getElementById("signbutton")
//regusername.addEventListener('keyup', function(){
//    if ((regusername.value.length<1)||(regemail.value.length<1)||(regpassword.value.length<1)){
//        console.log(regusername.value.length)
//        regbutton.setAttribute("disabled","true")
//    }
//    else{
//        regbutton.removeAttribute('disabled')
//    }
//});
signbutton.addEventListener("click",function(){
    signin();
})
getUserForSignPageAndSignUp();
