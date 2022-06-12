let regbutton=document.getElementById("regbutton")
regbutton.addEventListener("click", function() {
    signup();
})
//regusername.addEventListener('keyup', function(){
//    if ((regusername.value.length<1)||(regemail.value.length<1)||(regpassword.value.length<1)){
//        console.log(regusername.value.length)
//        regbutton.setAttribute("disabled","true")
//    }
//    else{
//        regbutton.removeAttribute('disabled')
//    }
//});
getUserForSignPageAndSignUp();