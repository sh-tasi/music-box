async function searchSong(keyword){
    return new Promise((resolve,reject)=>{
        let req=new XMLHttpRequest();
        let url="/api/album/song/"+keyword
        req.open("GET",url);
        req.onload=function(){
            let mydata= JSON.parse(req.response)
            if(mydata.error!=null){
                let mesage=mydata.message
                reject(mesage)
                
            }
            else{
                let thisdata=mydata.data
                resolve(thisdata)
                
            }
                
        }
        req.send();
    
    })
}

function addsearchElemnt(rep){
    let searchDiv=document.getElementById("searchButtonDiv")
    searchDiv.setAttribute("class","allAreaFORplaylist")
    ///This title for song list
    let titleDiv=document.createElement("div");
    let SongTitleNumberDiv=document.createElement("div");
    let SongTitleName=document.createElement("div");
    let SongTitleTime=document.createElement("div");
    let albumNameDiv=document.createElement("div");

    
    titleDiv.setAttribute("class","playlistTitle");
    SongTitleName.setAttribute("class","PlaylistSongTitleName");
    SongTitleTime.setAttribute("class","PlaylistSongTitleTime2");
    albumNameDiv.setAttribute("class","albumNameDiv")
    SongTitleNumberDiv.setAttribute("class","SongTitleNumberDiv")
    SongTitleNumberDiv.innerHTML="#";
    SongTitleName.innerHTML="標題";
    SongTitleTime.innerHTML="時間";
    albumNameDiv.innerHTML="專輯";
    titleDiv.appendChild(SongTitleNumberDiv);
    titleDiv.appendChild(SongTitleName);
    titleDiv.appendChild(albumNameDiv);
    titleDiv.appendChild(SongTitleTime);
    searchDiv.appendChild(titleDiv);

    for(let i in rep){
        let rightMean=document.createElement("div");
        rightMean.innerHTML='<i class="fa fa-bars" aria-hidden="true" data-search-right-list></i>';
        rightMean.setAttribute("class","rightMean");
        let thisAlbum=rep[i].album;
        let thisAlbumKey=rep[i].albumkey;
        let imgkey=rep[i].imgkey
        let artis=rep[i].artis;
        let datakey=rep[i].datakey;
        let name=rep[i].name;
        let time=rep[i].songtime;
        let thisSrc="https://d3q6xrhh7sv0kw.cloudfront.net/musicbox/album/"+thisAlbumKey+"/"+datakey;
        let thisImgSrc="https://d3q6xrhh7sv0kw.cloudfront.net/musicbox/album/"+thisAlbumKey+"/"+imgkey;
        let song=document.createElement("div");
        let nubmerBox=document.createElement("div");
        let nameBox=document.createElement("div");
        let timeBox=document.createElement("div");
        let imgBox=document.createElement("img");
        let albumNameBox=document.createElement("div");
        nameBox.setAttribute("data-src",thisSrc+"*"+name+"*"+thisImgSrc+"*"+artis+"*"+thisAlbum+"*"+thisAlbumKey+"*"+time)
        nubmerBox.innerHTML=i;
        nameBox.innerHTML=name;
        timeBox.innerHTML=time;
        albumNameBox.innerHTML=thisAlbum;
        imgBox.setAttribute("src",thisImgSrc);
        song.setAttribute("class","playlistAllSongForKey");
        nameBox.setAttribute("class","playlistSongTitle");
        timeBox.setAttribute("class","playlistTimeBox");
        albumNameBox.setAttribute("class","playlsitAlbumNameBox");
        albumNameBox.setAttribute("data-search-to-album",thisAlbumKey)
        nubmerBox.setAttribute("class","nubmerBox")
        song.appendChild(nubmerBox);
        song.appendChild(imgBox);
        song.appendChild(nameBox);
        song.appendChild(albumNameBox);
        song.appendChild(timeBox);
        song.appendChild(rightMean);
        searchDiv.appendChild(song);
    }
}
function addsearchMessage(rep){
    let searchDiv=document.getElementById("searchButtonDiv")
    searchDiv.setAttribute("class","allAreaFORplaylist")
    searchDiv.innerHTML=rep
}