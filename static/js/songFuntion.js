
function playThisSong(key,songName,img,artist,album,albumkey){
    thisSong={
        name:songName,
        path:key,
        img:img,
        singer:artist,
        thisAlbum:album,
        thisAlbumKey:albumkey
    }
    All_song.shift();
    All_song.unshift(thisSong);
    index_no = 0;
    load_track(index_no);
    playsong();
}
function addThisSong(key,songName,img,artist,album,albumkey){
    thisSong={
        name:songName,
        path:key,
        img:img,
        singer:artist,
        thisAlbum:album,
        thisAlbumKey:albumkey
    }
    All_song.push(thisSong);
    console.log(All_song.length);
    if (All_song.length===1){
        load_track(index_no);
        playsong();
    }

}
async function addThisSongInPlaylist(playlistkey,thisSong){
    return new Promise((resolve,reject)=>{
        let nowlist=userData[playlistkey][0];
        nowlist.push(thisSong);
        userData[playlistkey][0]=nowlist;
        let reqest={"playlistKey":playlistkey,"songlist":nowlist};
        let reqest_js=JSON.stringify(reqest);
        let req=new XMLHttpRequest();
        req.open("POST","/api/playlist/song");
        req.setRequestHeader("Content-type","application/json");
        req.onload=function(){
            if(req.status==200){
                resolve(playlistkey)
                
            }
            else{   
                reject("連線錯誤")
                
            }
                
        }
        req.send(reqest_js);
    })
}

// next song
function next_song(){
    if(index_no < All_song.length - 1){
        All_song.push(All_song[0]);
        All_song.shift();
        index_no=0;
        load_track(index_no);
        playsong();
    }else{
        index_no = 0;
        load_track(index_no);
        playsong();

        }
    }
// previous song
function previous_song(){
    if(All_song.length > 1){
        All_song.unshift(All_song[All_song.length-1]);
        All_song.pop();
        index_no=0;
        load_track(index_no);
        playsong();
    }else{
        index_no = 0;
        load_track(index_no);
        playsong();
        }
    }
// In-stream
function In_stream_song(id){
    //All_song.unshift(All_song[id]);
    let past=All_song[id]
    All_song.splice(id,1);
    All_song.unshift(past);
    index_no=0;
    load_track(index_no);
    playsong();

}
// delet this song
function deletThisSong(id){
    if (id==0){
        All_song.shift()
    }
    else{
        All_song.splice(id, 1);
    }
}
async function deletThisSongInPlaylist(playlistKey,nowlist){
    return new Promise((resolve,reject)=>{

        
        let reqest={"playlistKey":playlistKey,"songlist":nowlist};
        let reqest_js=JSON.stringify(reqest);
        let req=new XMLHttpRequest();
        req.open("POST","/api/playlist/song");
        req.setRequestHeader("Content-type","application/json");
        req.onload=function(){
            if(req.status==200){
                resolve(playlistKey)
                
            }
            else{   
                reject("連線錯誤")
                
            }
                
        }
        req.send(reqest_js);
    })
}
// songlist clear reset data()
function resetPlayer(){
    track.currentTime=0;
    track.src="null";
    title.innerHTML ="暫時無曲目";
    artist.innerHTML=" ";
    track_image.src ="https://d3q6xrhh7sv0kw.cloudfront.net/musicbox/musical-note.png";
    nowPlayTime.innerHTML="0:00";
    clearInterval(timer);
    reset_slider();
    pausesong();
}
// for check user
async function getUser(){
    return new Promise((resolve,reject)=>{
        let req=new XMLHttpRequest();
        
        req.open("GET","/api/users");
        req.onload=function(){
            let mydata= JSON.parse(req.response)
            if(mydata.error==true){
                
                reject(mydata.message)
                
            }
            else{
                User=mydata.data;
                resolve(User)
                    //thisbook=mydata.data
                // number=thisbook.number
                    //window.location = "/thankyou?number="+number;
            }
        }
        req.send();
    })
}
function addUserDiv(){
    let signArea=document.getElementById("signArea");
    let memberArea=document.getElementById("memberArea");
    //https://d3q6xrhh7sv0kw.cloudfront.net/musicbox/member/
    let memberImage=document.createElement("img");
    let memberName=document.createElement("div");
    let memberItem=document.createElement("div");
    let memberPage=document.createElement("div");
    let memeberSignOut=document.createElement("div");
    memberPage.innerHTML="會員頁面";
    memeberSignOut.innerHTML="登出";
    memberItem.setAttribute("class","memberItem");
    signArea.style.display="none";
    let Userimg=User.userImg;
    memberName.innerHTML=User.name;
    memberImage.setAttribute("src","https://d3q6xrhh7sv0kw.cloudfront.net/musicbox/member/"+Userimg);
    memberImage.setAttribute("id","NavmemberImage")
    memberName.setAttribute("data-memberItem","");
    memberPage.setAttribute("data-memberPage","");
    memberName.setAttribute("class","memberName");
    memberName.setAttribute("id","topmemberName")
    memberPage.setAttribute("class","memberItemText");
    memeberSignOut.setAttribute("class","memberItemText");
    memeberSignOut.setAttribute("data-memeberSignOut","");
    memberItem.setAttribute("id","memberItem");
    memberArea.appendChild(memberImage);
    memberArea.appendChild(memberName);
    memberArea.appendChild(memberItem);
    memberItem.appendChild(memberPage);
    memberItem.appendChild(memeberSignOut);
}
async function getuserData(){
    return new Promise((resolve,reject)=>{
        let req=new XMLHttpRequest();
        
        req.open("GET","/api/playlist/userData");
        req.onload=function(){
            let mydata= JSON.parse(req.response)
            if(mydata.error==true){
                reject(mydata.message)
                
            }
            else{
                userData=mydata.data
                resolve(userData)
                
            }
                
        }
        req.send();
    })
}
function signout(){
    let req=new XMLHttpRequest();
       
    req.open("DELETE","/api/users");

    req.onload=function(){
        let mydata= JSON.parse(req.response)
        console.log(mydata)
        window.location="/";
    }
    req.send();

}
//init
async function init(){
    getUser().then((res)=>{addUserDiv();});
    getuserData().then((res)=>{addSongPlaylistMean()});
    let localAllSong=localStorage.getItem('queue');  
    let lastDuration=localStorage.getItem('duration');  
    if (localAllSong==null){
        resetPlayer();
    }
    else{
        All_song=JSON.parse(localAllSong).data;
        if (All_song.length === 0){
            resetPlayer();
        }
        else{
            load_track(index_no);
        }
        if (lastDuration==='NaN'){
            track.currentTime=0;
        }
        else{
            track.currentTime=lastDuration;
        }
        pausesong();

    }
    
}

function range_slider(){
    let position = 0;
        
        // update slider position
        if(!isNaN(track.duration)){
        position = track.currentTime * (100 / track.duration);
        //Math.floor(track.currentTime * (100 / track.duration)/60);
        let m=Math.floor(track.currentTime/60);
        let s=Math.round(((track.currentTime/60)-m)*60) 
        if (s<10){
            s_str="0"+s.toString()
        }
        else{
            s_str=s.toString()
        }
        nowPlayTime.innerHTML= m.toString()+":"+s_str
        slider.value =  position;
        }

    
    // function will run when the song is over
    if(track.ended){
        play.innerHTML = '<i class="fa fa-play" aria-hidden="true"></i>';
        if(autoplay==1){
            next_song();
           document.getElementById("refresh").click();
            
        }
        }
}
// function load the track
function load_track(index_no){
    clearInterval(timer);
    reset_slider();
    track.src = All_song[index_no].path;
    title.innerHTML = All_song[index_no].name;	
    track_image.src = All_song[index_no].img;
    artist.innerHTML = All_song[index_no].singer;
    track.load();
    timer = setInterval(range_slider ,1000);
    // total.innerHTML = All_song.length;
    //present.innerHTML = index_no + 1;
}


// add playlist
async function addPlaylist(name){
    return new Promise((resolve,reject)=>{
        let req=new XMLHttpRequest();
        let reqest={"playlistName":name};
        let reqest_js=JSON.stringify(reqest);
        req.open("POST","/api/playlist");
        req.setRequestHeader("Content-type","application/json");
        req.onload=function(){
            if (req.status == 200){
                let mydata= JSON.parse(req.response)
                playlistKey=mydata.playlistKey
                userData[playlistKey]=[];
                userData[playlistKey][0]=[];
                userData[playlistKey][1]=name;
                userData[playlistKey][2]="channels4_profile.jpg";
                addSongPlaylistMean();
                resolve(playlistKey)
                
            }
            else{
                reject(new Error(req))
            }

    
        }
        req.send(reqest_js);

    })


}
// delet playlist
async function deletPlaylist(playlistKey){
    return new Promise((resolve,reject)=>{
        let req=new XMLHttpRequest();
        let reqest={"playlistKey":playlistKey};
        let reqest_js=JSON.stringify(reqest);
        req.open("DELETE","/api/playlist");
        req.setRequestHeader("Content-type","application/json");
        req.onload=function(){
            if (req.status == 200){
                let mydata= JSON.parse(req.response)
                playlistKey=mydata.playlistKey
                delete userData[playlistKey]
                resolve(playlistKey)
            }
            else{
                reject(new Error(req))
            }

    
        }
        req.send(reqest_js);

    })

}
// add meanfor songplay list 
function addSongPlaylistMean(){
    let mean=document.getElementById("meanForSongPlaylist")
        while(mean.firstChild){
            mean.removeChild(mean.firstChild)
        }
        for(let i in userData){
            let meanText=document.createElement("div");
            meanText.innerHTML=userData[i][1];
            meanText.setAttribute("data-addplaylist",i)
            meanText.setAttribute("class","meanForSongPlaylistText")
            meanText.onclick=function(){
                if (addSong==null){
                    console.log("isnull")
                }
                else{

                    addThisSongInPlaylist(i,addSong)
                }
            }
            mean.appendChild(meanText);
        }
}


// change list name
async function changeThisPlaylistName(playlistID,nowlist){
    return new Promise((resolve,reject)=>{
        let reqest={"playlistKey":playlistID,"newName":nowlist};
        let reqest_js=JSON.stringify(reqest);
        let req=new XMLHttpRequest();
        req.open("POST","/api/playlist/changeName");
        req.setRequestHeader("Content-type","application/json");
        req.onload=function(){
            if(req.status==200){
                resolve(playlistID)
                
            }
            else{   
                reject("連線錯誤")
                
            }
                
        }
        req.send(reqest_js);
    })
}