import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.postId = params.id;
        //this.setTitle("Settings");
    }
    async getHtml() {
        let allArea=document.createElement("div");
        allArea.setAttribute("class","allAreaFORplaylist");
        let thisPageKey=this.postId
        function addelementForPlaylistSong(number,name,img,albumKey,time,albumName,thisSrc,albumArtis){
            let song=document.createElement("div");
            let nubmerBox=document.createElement("div");
            let nameBox=document.createElement("div");
            let timeBox=document.createElement("div");
            let imgBox=document.createElement("img");
            let albumNameBox=document.createElement("div");
            let deletbt=document.createElement("div");

            imgBox.setAttribute("src",img)
            nubmerBox.setAttribute("class","nubmerBox")
            deletbt.setAttribute("class","playlistDelet");
            song.setAttribute("class","playlistAllSongForKey")
            nameBox.setAttribute("class","playlistSongTitle")
            nameBox.setAttribute("data-src-playlist",thisSrc+"*"+name+"*"+img+"*"+albumArtis+"*"+albumName+"*"+albumKey+"*"+time)
            timeBox.setAttribute("class","playlistTimeBox")
            albumNameBox.setAttribute("class","playlsitAlbumNameBox")
            albumNameBox.setAttribute("data-search-to-album",albumKey);
            nubmerBox.innerHTML=Number(number);
            nameBox.innerHTML=name;
            timeBox.innerHTML=time;
            albumNameBox.innerHTML=albumName;
            deletbt.innerHTML='<i class="fa fa-trash-o" aria-hidden="true" data-playlist-song-delet='+number+"*"+thisPageKey+'></i>';
            song.appendChild(nubmerBox);
            song.appendChild(imgBox);
            song.appendChild(nameBox);
            song.appendChild(albumNameBox);
            song.appendChild(timeBox);
            song.appendChild(deletbt);
            allArea.appendChild(song);
        }
        let apiUrl="/api/playlist"+"/"+this.postId;
        let apiResponse= await fetch(apiUrl);
        let rep=await apiResponse.json();
        let playlistSong=rep.data.songlist
        let listimg=rep.data.listImage;
        // top list's img and list name 
        let topDiv=document.createElement("div");
        let playlistImgDiv=document.createElement("img");
        let playlistNameDiv=document.createElement("div");
        let player=document.createElement("img");
        let rightDiv=document.createElement("div");
        let changePlaylistNameBt=document.createElement("div");
        changePlaylistNameBt.innerHTML='<i class="fa fa-pencil" aria-hidden="true" data-change-list-name></i>'
        playlistNameDiv.innerHTML=rep.data.listName;
        changePlaylistNameBt.setAttribute("id","changePlaylistNameBt")
        topDiv.setAttribute("class","playlistTopArea");
        playlistNameDiv.setAttribute("class","listName");
        rightDiv.setAttribute("class","rightDiv");
        player.setAttribute("class","playlistpic");
        player.setAttribute("data-play-this-playlist",thisPageKey);
        player.setAttribute("src","https://d3q6xrhh7sv0kw.cloudfront.net/musicbox/play-button.png");
        playlistImgDiv.setAttribute("src","https://d3q6xrhh7sv0kw.cloudfront.net/musicbox/playlistImg/"+listimg);
        playlistImgDiv.setAttribute("data-playlist-change-bt","")
        topDiv.appendChild(playlistImgDiv);
        playlistNameDiv.appendChild(changePlaylistNameBt);
        rightDiv.appendChild(playlistNameDiv);
        rightDiv.appendChild(player);
        topDiv.appendChild(rightDiv);
        allArea.appendChild(topDiv);

        //title
        let titleDiv=document.createElement("div");
        let SongTitleNumberDiv=document.createElement("div");
        let SongTitleName=document.createElement("div");
        let SongTitleTime=document.createElement("div");
        let albumNameDiv=document.createElement("div");
        titleDiv.setAttribute("class","playlistTitle");
        SongTitleName.setAttribute("class","PlaylistSongTitleName");
        SongTitleTime.setAttribute("class","PlaylistSongTitleTime");
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
        allArea.appendChild(titleDiv);

        for(let i in playlistSong ){
            let thisName=playlistSong[i].name
            let thisImg=playlistSong[i].img
            let thisAlbumKey=playlistSong[i].thisAlbumKey
            let thisTime=playlistSong[i].songTime
            let albumName=playlistSong[i].thisAlbum
            let path=playlistSong[i].path
            let albumArtis=playlistSong[i].albumArtis
            addelementForPlaylistSong(i,thisName,thisImg,thisAlbumKey,thisTime,albumName,path,albumArtis)

        }
        ////sort list none
        let sortDiv=document.getElementById("sortDiv");
        sortDiv.style.display="none";


        return `
            ${allArea.outerHTML}
        `;
    }
}