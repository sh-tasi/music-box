import Dashboard from "./views/Dashboard.js";
import Queue from "./views/queueView.js";
import AlbumView from "./views/AlbumView.js";
import Member from "./views/MemberView.js";
import AllplaylistpageView from "./views/AllplaylistpageView.js";
import PlaylistpageView from "./views/PlaylistpageView.js";
import SearchView from "./views/SearchView.js";
import SearchKeywordView from "./views/SearchKeywordView.js";
import SortView from "./views/SortView.js";
const pathToRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const getParams = match => {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);

    return Object.fromEntries(keys.map((key, i) => {
        return [key, values[i]];
    }));
};

const navigateTo = url => {
    history.pushState(null, null, url);
    router();
};

const router = async () => {
    const routes = [
        { path: "/", view: Dashboard },
        { path: "/sort/:id", view:  SortView },
        { path: "/Queue", view: Queue },
        { path: "/Album/:id", view: AlbumView },
        { path: "/member", view: Member },
        { path: "/collection", view: AllplaylistpageView},
        { path: "/playlist/:id", view: PlaylistpageView},
        { path: "/search", view: SearchView },
        { path: "/search/:id", view: SearchKeywordView },
    ];

    // Test each route for potential match
    const potentialMatches = routes.map(route => {
        return {
            route: route,
            result: location.pathname.match(pathToRegex(route.path))
        };
    });

    let match = potentialMatches.find(potentialMatch => potentialMatch.result !== null);

    if (!match) {
        match = {
            route: routes[0],
            result: [location.pathname]
        };
    }

    const view = new match.route.view(getParams(match));

    document.querySelector("#app").innerHTML = await view.getHtml();
};
//網址改動時 router，更改頁面內容
window.addEventListener("popstate", router);

document.body.addEventListener("load",init(),false);
//點選元素時，確認對應元素為連結，導向該網址，而不啟動刷新頁面

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", e => {
        let mean=document.getElementById("meanForSong")
        let meanforplaylistDiv=document.getElementById("meanForPlaylist")
        let messageTologin=document.getElementById("messageTologin");
        let tellmessage=document.getElementById("tellmessage");
        mean.style.display="none";
        messageTologin.style.display="none";
        meanforplaylistDiv.style.display="none";
        if (e.target.matches("[data-link]")) {
            e.preventDefault();
            navigateTo(e.target.href);
        }
        if (e.target.matches("[data-link-member]")) {
            if (User==null){
                e.preventDefault();
                let messageTologin=document.getElementById("messageTologin");
                let messageTitle=document.getElementById("messageTitle");
                let messageText=document.getElementById("messageText");
                let messageTologinClose=document.getElementById("messageTologinClose");
                messageTologin.style.left=200+"px";
                messageTologin.style.top=130+"px";
                messageTologin.style.display="block";
                messageTitle.innerHTML="享受你的音樂庫";
                messageText.innerHTML="登入查看已建立的播放清單";
                messageTologinClose.onclick=function(){
                    messageTologin.style.display="none";
                }
            }
            else{
                e.preventDefault();
                navigateTo(e.target.href);
            }
        }
        else if (e.target.matches("[data-Album-link]")){
            e.preventDefault();
            navigateTo(e.target.parentNode.parentNode.href);
        }
        else if(e.target.matches("[data-link-addPlaylist]")){
            if (User==null){
                e.preventDefault();
                let messageTologin=document.getElementById("messageTologin");
                let messageTitle=document.getElementById("messageTitle");
                let messageText=document.getElementById("messageText");
                let messageTologinClose=document.getElementById("messageTologinClose");
                messageTologin.style.left=200+"px";
                messageTologin.style.top=200+"px";
                messageTologin.style.display="block";
                messageTitle.innerHTML="建立播放清單";
                messageText.innerHTML="登入以建立播放清單";
                messageTologinClose.onclick=function(){
                    messageTologin.style.display="none";
                }
            }
            else{
                e.preventDefault();
                let now=Object.keys(userData).length+1
                let newlistName="播放清單#"+now
                addPlaylist(newlistName).then((res) =>{
                    //let playlistKey_list = Object.keys(userData);
                    //let tihskey=playlistKey_list[playlistKey_list.length-1];
                    navigateTo("/playlist/"+res);
                    
                });
            }
        }
        else if (e.target.matches("[data-src]")){
            let data=e.target.dataset.src.split('*');
            let name=data[1]
            let path=data[0]
            let img=data[2] 
            let singer=data[3]
            let albumName=data[4]
            let albumKey=data[5]
            playThisSong(path,name,img,singer,albumName,albumKey);
            
            
        }
        else if (e.target.matches("[data-src-playlist]")){
            let playlistdata=e.target.dataset.srcPlaylist.split('*');
            console.log(playlistdata)
            let name=playlistdata[1]
            let path=playlistdata[0]
            let img=playlistdata[2] 
            let singer=playlistdata[3]
            let albumName=playlistdata[4]
            let albumKey=playlistdata[5]
            playThisSong(path,name,img,singer,albumName,albumKey);
        }
        else if (e.target.matches("[data-queue]")){
            e.preventDefault();
            navigateTo(e.target.parentNode.href);
            
        }
        else if (e.target.matches("[data-nextsong]")){
            next_song();
            router();

        }
        else if (e.target.matches("[data-presong]")){
            previous_song();
            router();
        }
        else if (e.target.matches("[data-delet-song]")){
            let id=e.target.dataset.deletSong;
            deletThisSong(id);
            if (id==0){
                if (All_song.length === 0){
                    resetPlayer();
                }
                else{
                    load_track(index_no);
                    playsong();
                }
            }
            router();
        }
        else if (e.target.matches("[data-playlist-song-delet]")){
            let thisid=e.target.dataset.playlistSongDelet;
            let mydeletdata=thisid.split('*');
            let mydeletId=mydeletdata[0];
            let mydeletKey=mydeletdata[1];
            let nowlist=userData[mydeletKey][0];
            nowlist.splice(mydeletId,1);
            userData[mydeletKey][0]=nowlist;
            deletThisSongInPlaylist(mydeletKey,nowlist).then(res=>{router();});

        }
        else if (e.target.matches("[data-memberItem]")){
            let memberItem=document.getElementById("memberItem")
            if(memberItem.style.display==="block"){
                memberItem.style.display="none";
            }
            else{
                memberItem.style.display="block";
            }
        }
        else if (e.target.matches("[data-memberPage]")){
            let memberItem=document.getElementById("memberItem");
            memberItem.style.display="none";
            e.preventDefault();
            navigateTo("/member");
        }
        else if (e.target.matches("[data-memeberSignOut]")){
            signout();
        }
        else if (e.target.matches("[data-link-play-list]")){
            e.preventDefault();
            navigateTo(e.target.parentNode.parentNode.href);
        }
        else if(e.target.matches("[data-addplaylist]")){
            e.preventDefault();
            //router();
        }
        else if(e.target.matches("[data-play-this-playlist]")){
            let playsong=e.target.dataset.playThisPlaylist;
            if(userData[playsong][0].length==0){
                console.log("will not play")
            }
            else{
                let paste=userData[playsong][0].slice()
                All_song=paste;
                index_no=0;
                load_track(index_no);
                track.play();
                Playing_song = true;
                play.innerHTML = '<i class="fa fa-pause" aria-hidden="true"></i>';
                router();
            }

        }
        else if (e.target.matches("[data-search-input]")){
            e.preventDefault();
            let searchIndexKey=document.getElementById("searchIndexKey").value
            if (searchIndexKey===""){
                
            }
            else{
                navigateTo("/search/"+searchIndexKey);
                //searchSong(input).then((res)=>{addsearchElemnt(res)}).catch((reason)=>{addsearchMessage(reason)})
            }
            
        }
        else if (e.target.matches("[data-search-input2]")){
            e.preventDefault();
            let searchKey=document.getElementById("searchKey").value
            if (searchKey===""){
                
            }
            else{
                navigateTo("/search/"+searchKey);
                //searchSong(input).then((res)=>{addsearchElemnt(res)}).catch((reason)=>{addsearchMessage(reason)})
            }
        }
        else if (e.target.matches("[data-search-to-album]")){
            e.preventDefault();
            let searchToAlbum=e.target.dataset.searchToAlbum;
            navigateTo("/Album/"+searchToAlbum);
        }
        else if (e.target.matches("[data-go-pre]")){
            e.preventDefault();
            if (history.state=="first"){
            }
            else{
                window.history.back();
            }
        }
        else if (e.target.matches("[data-right-list]")){
            e.preventDefault();
            if (User==null){
                e.preventDefault();
                let messageTologin=document.getElementById("messageTologin");
                let messageTitle=document.getElementById("messageTitle");
                let messageText=document.getElementById("messageText");
                let messageTologinClose=document.getElementById("messageTologinClose");
                messageTologin.style.left=-250+e.pageX+"px";
                messageTologin.style.top=e.pageY+"px";
                messageTologin.style.display="block";
                messageTitle.innerHTML="享受你的音樂庫";
                messageText.innerHTML="登入查看已建立的播放清單";
                messageTologinClose.onclick=function(){
                    messageTologin.style.display="none";
                }
            }
            else{
                let meanForSongPlaylist=document.getElementById("meanForSongPlaylist");
                meanForSongPlaylist.style.left="-250px";

              //  meanForSongPlaylistText.style.right="400px";
                let mean=document.getElementById("meanForSong");
                let addforque=document.getElementById("addforque");
                let addforplaylsit=document.getElementById("addforplaylsit");
                let rightListSong=e.target.parentNode.parentNode.childNodes[1].dataset.src.split('*');
                let name=rightListSong[1]
                let path=rightListSong[0]
                let img=rightListSong[2] 
                let singer=rightListSong[3]
                let albumName=rightListSong[4]
                let albumKey=rightListSong[5]
                let songTime=rightListSong[6]
                mean.style.left=-120+e.pageX+"px";
                mean.style.top=e.pageY+"px";
                mean.style.display="block";
                addforque.onclick=function () {                
                    addThisSong(path,name,img,singer,albumName,albumKey);
                }
                let SelecSong={
                    "name":name,
                    "path":path,
                    "img":img,
                    "singer":singer,
                    "thisAlbum":albumName,
                    "thisAlbumKey":albumKey,
                    "songTime":songTime,
                    "albumArtis":singer
                }
                console.log(SelecSong)
                addSong=SelecSong
            }

        }
        else if (e.target.matches("[data-search-right-list]")){
            e.preventDefault();
            if (User==null){
                e.preventDefault();
                let messageTologin=document.getElementById("messageTologin");
                let messageTitle=document.getElementById("messageTitle");
                let messageText=document.getElementById("messageText");
                let messageTologinClose=document.getElementById("messageTologinClose");
                messageTologin.style.left=-250+e.pageX+"px";
                messageTologin.style.top=e.pageY+"px";
                messageTologin.style.display="block";
                messageTitle.innerHTML="享受你的音樂庫";
                messageText.innerHTML="登入查看已建立的播放清單";
                messageTologinClose.onclick=function(){
                    messageTologin.style.display="none";
                }
            }
            else{
                let meanForSongPlaylist=document.getElementById("meanForSongPlaylist");
                meanForSongPlaylist.style.left="-250px";

              //  meanForSongPlaylistText.style.right="400px";
                let mean=document.getElementById("meanForSong");
                let addforque=document.getElementById("addforque");
                let addforplaylsit=document.getElementById("addforplaylsit");
                let searchRightListSong=e.target.parentNode.parentNode.childNodes[2].dataset.src.split('*')
                let name=searchRightListSong[1]
                let path=searchRightListSong[0]
                let img=searchRightListSong[2] 
                let singer=searchRightListSong[3]
                let albumName=searchRightListSong[4]
                let albumKey=searchRightListSong[5]
                let songTime=searchRightListSong[6]
                mean.style.left=-120+e.pageX+"px";
                mean.style.top=e.pageY+"px";
                mean.style.display="block";
                addforque.onclick=function () {                
                    addThisSong(path,name,img,singer,albumName,albumKey);
                }
                let SelecSong={
                    "name":name,
                    "path":path,
                    "img":img,
                    "singer":singer,
                    "thisAlbum":albumName,
                    "thisAlbumKey":albumKey,
                    "songTime":songTime,
                    "albumArtis":singer
                }
                
                addSong=SelecSong
            }
        }
        else if (e.target.matches("[data-change-list-name]")){
            //let mybg=document.getElementById("bg");
            bg.style.display="block";
            let meanForChangePlaylistName=document.getElementById("meanForChangePlaylistName");
            meanForChangePlaylistName.style.left=e.pageX+"px";
            meanForChangePlaylistName.style.top=e.pageY+"px";
            meanForChangePlaylistName.style.display="block";

        }
        else if(e.target.matches("[data-change-name-bt]")){
            let meanForChangeUserName=document.getElementById("meanForChangeUserName");
            meanForChangeUserName.style.left=e.pageX+"px";
            meanForChangeUserName.style.top=e.pageY+"px";
            meanForChangeUserName.style.display="block";
            bg.style.display="block";
        }
        else if (e.target.matches("[data-img-link-album]")){
            let imgLinkKey=e.target.src.split("/")[5]
            navigateTo("/Album/"+imgLinkKey);
        }
        else if (e.target.matches("[data-playlist-change-bt]")){
            let meanForPlaylistimg=document.getElementById("meanForPlaylistimg");
            bg.style.display="block";
            meanForPlaylistimg.style.left=e.pageX+"px";
            meanForPlaylistimg.style.top=e.pageY+"px";
            meanForPlaylistimg.style.display="block";
        }
        else if (e.target.matches("[data-play-this-album]")){
            All_song=thisAlbum;
            index_no=0;
            load_track(index_no);
            track.play();
            Playing_song = true;
            play.innerHTML = '<i class="fa fa-pause" aria-hidden="true"></i>';
        }
        else if (e.target.matches("[data-queue-insert]")){ 
            console.log("ok")
            console.log(e.target.dataset.queueInsert)
            In_stream_song(e.target.dataset.queueInsert)
            router();
        }
       


       
        //router();
    });
    document.body.addEventListener("contextmenu",e=>{
            e.preventDefault();
        if (e.target.matches("[data-src]")) {
            if (User==null){
                e.preventDefault();
                let messageTologin=document.getElementById("messageTologin");
                let messageTitle=document.getElementById("messageTitle");
                let messageText=document.getElementById("messageText");
                let messageTologinClose=document.getElementById("messageTologinClose");
                messageTologin.style.left=e.pageX+"px";
                messageTologin.style.top=e.pageY+"px";
                messageTologin.style.display="block";
                messageTitle.innerHTML="享受你的音樂庫";
                messageText.innerHTML="登入查看已建立的播放清單";
                messageTologinClose.onclick=function(){
                    messageTologin.style.display="none";
                }
            }
            else{
                let meanForSongPlaylist=document.getElementById("meanForSongPlaylist");
                meanForSongPlaylist.style.left="160px";
                let mean=document.getElementById("meanForSong");
                let addforque=document.getElementById("addforque");
                let addforplaylsit=document.getElementById("addforplaylsit");
                let data=e.target.dataset.src.split('*');
                let name=data[1]
                let path=data[0]
                let img=data[2] 
                let singer=data[3]
                let albumName=data[4]
                let albumKey=data[5]
                let songTime=data[6]
                mean.style.left=e.pageX+"px";
                mean.style.top=e.pageY+"px";
                mean.style.display="block";
                addforque.onclick=function () {                
                    addThisSong(path,name,img,singer,albumName,albumKey);
                }
                let SelecSong={
                    "name":name,
                    "path":path,
                    "img":img,
                    "singer":singer,
                    "thisAlbum":albumName,
                    "thisAlbumKey":albumKey,
                    "songTime":songTime,
                    "albumArtis":singer
                }
                
                addSong=SelecSong
            }
            


        }
        if (e.target.matches("[data-link-play-list]")){
            let linkplayLIST=e.target.dataset.linkPlayList
            let mean=document.getElementById("meanForPlaylist");
            let delet=document.getElementById("meanForPlaylistDelet");
            let meanForPlaylistPlay=document.getElementById("meanForPlaylistPlay");
            let playlistKey=e.target.dataset.linkPlayList;
            mean.style.left=e.pageX+"px";
            mean.style.top=e.pageY+"px";
            mean.style.display="block";
            
            delet.onclick=function(){
                deletPlaylist(playlistKey).then((res)=>{addSongPlaylistMean();router();});
                mean.style.display="none";
                

                
            }
            meanForPlaylistPlay.onclick=function(){
                if(userData[linkplayLIST][0].length==0){
                }
                else{
                    All_song=userData[linkplayLIST][0];
                    index_no=0;
                    load_track(index_no);
                    track.play();
                    Playing_song = true;
                    play.innerHTML = '<i class="fa fa-pause" aria-hidden="true"></i>';
                }
            }
    
        }
        else if (e.target.matches("[data-src-playlist]")){
            
        }
        
    });

    router();

});
//track.addEventListener('ended',console.log("true"));
document.body.onunload=function(){
   let setLocal=JSON.stringify({"data":All_song});
   localStorage.setItem('queue', setLocal);
   let lastDuration=track.duration * (slider.value / 100);
   localStorage.setItem('duration', lastDuration);
   
}



//img upload ara ----------------------------------------------
let myimg = new Image();
let newimg= new Image();
let apiFinsh=0;
let isUpload=0;
let meanForUserimgCheck=document.getElementById("meanForUserimgCheck");
// canvas height ratio for fix
let userNewImgWidth=250;
let compressRaito=0.8;
let canvas=document.createElement("canvas");
let canvasContext = canvas.getContext("2d");


function getFileInfo(evt) {
    let dataUrl = evt.target.result;
    // 取得圖片
    myimg.src=dataUrl;
}
let uploadimg=document.getElementById("uploadimg");
uploadimg.addEventListener('change',(event)=>{
    isUpload=1;
    let file = uploadimg.files[0];
    if (file && file.type.indexOf("image") == 0) {
        let fileReader = new FileReader();
        fileReader.onload = getFileInfo;
        fileReader.readAsDataURL(file);
    }
})
myimg.onload=function(){
    let width = this.width
    let height= this.height
    let newHeight=userNewImgWidth * height/width;
    canvas.width=userNewImgWidth;
    canvas.height=newHeight;
    canvasContext.clearRect(0,0,userNewImgWidth,newHeight);
    canvasContext.drawImage(myimg, 0, 0, userNewImgWidth, newHeight);
    newimg = canvas.toDataURL("image/jpeg", compressRaito);
    let meanForUserimg=document.getElementById("meanForUserImgDemo");
    meanForUserimg.setAttribute("src",newimg);
}
meanForUserimgCheck.onclick=function(element){
    let tellmessage=document.getElementById("tellmessage");
    tellmessage.style.left=-100+element.clientX+"px";
    tellmessage.style.top=-50+element.clientY+"px";
    if (apiFinsh===0 && isUpload===1){
        apiFinsh=1;
        tellmessage.style.display="block";
        canvas.toBlob(function(test){
            let formdata=new FormData(); 
            formdata.append("imageFile" , test);
            fetch('/api/users/uploadImg', {
                method: 'POST',
                body: formdata,
            }).then(response=>{
                
                response.json().then(json=>{let img=json.img ;User.userImg=img;let NavmemberImage=document.getElementById("NavmemberImage");NavmemberImage.setAttribute("src","https://d3q6xrhh7sv0kw.cloudfront.net/musicbox/member/"+img)})

                apiFinsh=0 ;isUpload=0;router();
                let NavmemberImage=document.getElementById("NavmemberImage");
                let meanForUserImgDemo=document.getElementById("meanForUserImgDemo");
                meanForUserImgDemo.setAttribute("src","https://d3q6xrhh7sv0kw.cloudfront.net/musicbox/member/guest.png");
                let meanForUserimg=document.getElementById("meanForUserimg");
                let bg=document.getElementById("bg");
                tellmessage.style.display="none";
                meanForUserimg.style.display="none";
                bg.style.display="none";


            })
        },"image/jpeg",compressRaito);

    }

}
//for mean user img 
let meanForUserimg=document.getElementById("meanForUserimg")
meanForUserimg.style.left=(window.screen.width / 2) - 200+"px";
meanForUserimg.style.top=(window.screen.height / 2) - 400+"px";
let meanUserImgClosebt=document.getElementById("meanUserImgClosebt");
meanUserImgClosebt.onclick=function(){
    meanForUserimg.style.display="none";
    let bg =document.getElementById("bg");
    bg.style.display="none";
}
//(window.screen.width / 2) - 400
//for mean change playlist name
let bg=document.getElementById("bg"); //this is bg
let meanForChangePlaylistName=document.getElementById("meanForChangePlaylistName");
let meanForChangePlaylistNameClosebt=document.getElementById("meanForChangePlaylistNameClosebt");
meanForChangePlaylistNameClosebt.onclick=function(){
    meanForChangePlaylistName.style.display="none";
    bg.style.display="none";
}
//playlsit name check funtion 
let meanForChangePlaylistNameCheck=document.getElementById("meanForChangePlaylistNameCheck");
meanForChangePlaylistNameCheck.onclick=function(){
    let playlistID = window.location.pathname.split("/")[2];
    let newlistName=document.getElementById("meanForChangePlaylistNameValue").value;
    changeThisPlaylistName(playlistID,newlistName).then(res=>{userData[playlistID][1]=newlistName;addSongPlaylistMean();router()})
    bg.style.display="none";
    meanForChangePlaylistName.style.display="none";


}
// user name check funtion;
let meanForChangeUserNameClosebt=document.getElementById("meanForChangeUserNameClosebt");
meanForChangeUserNameClosebt.onclick=function(){
    let meanForChangeUserName=document.getElementById("meanForChangeUserName");
    let bg=document.getElementById("bg");
    meanForChangeUserName.style.display="none";
    bg.style.display="none";
}
let meanForChangeUserNameCheck=document.getElementById("meanForChangeUserNameCheck");
meanForChangeUserNameCheck.onclick=function(){
    let meanForChangeUserName=document.getElementById("meanForChangeUserName");
    let topmemberName=document.getElementById("topmemberName")
    let nowName=document.getElementById("memberName");
    let newName=document.getElementById("meanForChangeUserNameInput").value
    let bg=document.getElementById("bg");
    changeUserName(newName).then(res=>{User.name=res;nowName.innerHTML=res; topmemberName.innerHTML=res;});
    bg.style.display="none";
    meanForChangeUserName.style.display="none";
}
//listen new name ca't space
let newName=document.getElementById("meanForChangeUserNameInput")
newName.addEventListener('input',function(){
    let meanForChangeUserNameCheck=document.getElementById("meanForChangeUserNameCheck");
    if(newName.value==""){
        meanForChangeUserNameCheck.setAttribute('disabled', '');
    }
    else if(newName.value.length>10){
        meanForChangeUserNameCheck.setAttribute('disabled', '');
    }
    else{
        meanForChangeUserNameCheck.removeAttribute('disabled');
    }
})

//bg for mean
bg.addEventListener("click",function(){
    let meanForChangePlaylistName=document.getElementById("meanForChangePlaylistName");
    let meanForPlaylistimg=document.getElementById("meanForPlaylistimg");
    let meanForUserimg=document.getElementById("meanForUserimg");
    let meanForChangeUserName=document.getElementById("meanForChangeUserName");
    meanForUserimg.style.display="none";
    bg.style.display="none";
    meanForChangePlaylistName.style.display="none";
    meanForPlaylistimg.style.display="none";
    meanForChangeUserName.style.display="none";
})


// tack loading finished
track.addEventListener("canplaythrough",function(){
    let totalM=Math.floor(track.duration/60);
    let totalS=Math.round(((track.duration/60)-totalM)*60) 
    let totalS_str="";
    if(totalS<10){
        totalS_str="0"+totalS.toString()
    }
    else{
        totalS_str=totalS.toString()
    }
    totalPlayTime.innerHTML=totalM.toString()+":"+totalS_str;
})



// playList IMG UPLOAD
let mylistimg= new Image();
let newlistimg=new Image();
let playlistApiFinish=0;
let playlistIsupload=0;
let meanForPlaylistimgCheck=document.getElementById("meanForPlaylistimgCheck");
// canvas height ratio for fix
let playlistNewImgWidth = 300;
let playlistcompressRatio = 0.8;
let playlistCanvas = document.createElement("canvas");
let playlistCanvasText = playlistCanvas.getContext("2d");

function playlistGetinfo(evt){
    let dataUrl = evt.target.result;
    mylistimg.src=dataUrl;
}
let meanForPlaylistimgUploadimg=document.getElementById("meanForPlaylistimgUploadimg");
meanForPlaylistimgUploadimg.addEventListener('change',(event)=>{
    playlistIsupload=1;
    let file = meanForPlaylistimgUploadimg.files[0];
    if (file && file.type.indexOf('image')==0){
        let fileReader = new FileReader();
        fileReader.onload = playlistGetinfo;
        fileReader.readAsDataURL(file);
    }
})
mylistimg.onload=function(){
    let width = this.width
    let height= this.height
    let newHeight=playlistNewImgWidth * height/width;
    playlistCanvas.width=playlistNewImgWidth;
    playlistCanvas.height=newHeight;
    playlistCanvasText.clearRect(0,0,playlistNewImgWidth,newHeight);
    playlistCanvasText.drawImage(mylistimg,0,0,playlistNewImgWidth,newHeight);
    newlistimg=playlistCanvas.toDataURL("image/jpeg",playlistcompressRatio);
    let meanForPlaylistimgDemo=document.getElementById("meanForPlaylistimgDemo");
    meanForPlaylistimgDemo.setAttribute("src",newlistimg);
}
meanForPlaylistimgCheck.onclick=function(element){
    let tellmessage=document.getElementById("tellmessage");
    tellmessage.style.left=-100+element.clientX+"px";
    tellmessage.style.top=-50+element.clientY+"px";
    if(playlistApiFinish===0 && playlistIsupload===1){
        playlistApiFinish=1;
        tellmessage.style.display="block";
        playlistCanvas.toBlob(function(test){
            let formdata=new FormData(); 
            let playlistID = window.location.pathname.split("/")[2];
            formdata.append("imageFile" , test);
            formdata.append("playlistKey",playlistID);
            fetch('/api/playlist/changeImg', {
                method: 'POST',
                body: formdata,
            }).then(response=>{
                
                response.json().then(json=>{
                    let img=json.image ;
                    let playlistKey=json.playlistKey;
                    userData[playlistKey][2]=img;
                })

                playlistApiFinish=0 ;playlistIsupload=0;router();
                let meanForPlaylistimgDemo=document.getElementById("meanForPlaylistimgDemo");
                meanForPlaylistimgDemo.setAttribute("src","https://d3q6xrhh7sv0kw.cloudfront.net/musicbox/playlistImg/channels4_profile.jpg");
                        let meanForPlaylistimg=document.getElementById("meanForPlaylistimg");
                let bg=document.getElementById("bg");
                meanForPlaylistimg.style.display="none";
                bg.style.display="none";
                tellmessage.style.display="none";
            })
        },"image/jpeg",compressRaito);
    }
}
//mean palylsit chang  img closebt
let meanForPlaylistimgClosebt=document.getElementById("meanForPlaylistimgClosebt");
meanForPlaylistimgClosebt.onclick=function(){
    let meanForPlaylistimg=document.getElementById("meanForPlaylistimg");
    let bg=document.getElementById("bg");
    meanForPlaylistimg.style.display="none";
    bg.style.display="none";

}

/////sort table listen
let sort=document.querySelector('#sort');
sort.addEventListener('change',function(){
    let linkto=sort.value
    let myLookPage=document.getElementById("myLookPage")
    if (linkto==="All"){
        navigateTo("/");
        myLookPage.setAttribute("href","/")
    }
    else{
        navigateTo("/sort/"+linkto);
        myLookPage.setAttribute("href","/sort/"+linkto);
    }
})