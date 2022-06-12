import AbstractView from "./AbstractView.js";


export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.postId = params.id;
        //this.setTitle("Viewing Post");
    }
    async getHtml() {
        //set album song list and infornation
        let api_url="/api/album/"+this.postId
        let api_response= await fetch(api_url)
        let data=await api_response.json()
        //album data
        let album=await data.data
        let albumArtis=album.albumArtis
        let imgKey=album.albumImg
        let albumName=album.albumName
        let albumKey=album.albumID
        let imgSrc="https://d3q6xrhh7sv0kw.cloudfront.net/musicbox/album/"+this.postId+"/"+imgKey;

        // songlist data in here
        let songList=album.songList
        //app area div
        let albumInformationArea=document.createElement("div");
        albumInformationArea.setAttribute("class","albumIfornation")
        //song list div
        let songListbox=document.createElement("div"); 
        songListbox.setAttribute("class","songListbox");
        function addelementForAlbumSong(number,name,time,thisSrc){
            let song=document.createElement("div");
            let nubmerBox=document.createElement("div");
            let nameBox=document.createElement("div");
            let timeBox=document.createElement("div");
            let meanRightClick=document.createElement("div");
    

            nubmerBox.innerHTML=number;
            nameBox.innerHTML=name;
            timeBox.innerHTML=time;
            meanRightClick.innerHTML='<i class="fa fa-bars" aria-hidden="true" data-right-list></i>';


            nubmerBox.setAttribute("data-src",thisSrc+"*"+name+"*"+imgSrc+"*"+albumArtis+"*"+albumName+"*"+albumKey+"*"+time);
            nameBox.setAttribute("data-src",thisSrc+"*"+name+"*"+imgSrc+"*"+albumArtis+"*"+albumName+"*"+albumKey+"*"+time);
            song.setAttribute("class","song");
            nameBox.setAttribute("class","songName");
            timeBox.setAttribute("class","songTimeForList");
            song.appendChild(nubmerBox);
            song.appendChild(nameBox);
            song.appendChild(timeBox);
            song.appendChild(meanRightClick);
            songListbox.appendChild(song);
        }
        thisAlbum=[];
        for (let i in songList){
            let thisName=songList[i].name
            let thisTime=songList[i].time
            let thisNumber=i
            let tihsSongSrc="https://d3q6xrhh7sv0kw.cloudfront.net/musicbox/album/"+this.postId+"/"+songList[i].key;
            let thisSongData={
                "img": imgSrc,
                "name": thisName,
                "path": tihsSongSrc,
                "singer": albumArtis,
                "songTime": thisTime,
                "thisAlbum": albumName,
                "thisAlbumKey": albumKey
            }
            thisAlbum.push(thisSongData);
            addelementForAlbumSong(thisNumber,thisName,thisTime,tihsSongSrc);
        }
        let albumBox=document.createElement("div");
        let albumImg=document.createElement("img");
        let albumRightSide=document.createElement("div");
        let albumArtisBox=document.createElement("div")
        let albumNameBox=document.createElement("div");

        ///This title for song list
        let albumSongTitle=document.createElement("div");
        let albumSongTitleNumber=document.createElement("div");
        let albumSongTitleName=document.createElement("div");
        let albumSongTitleTime=document.createElement("div");
        let albumPlay=document.createElement("img");
        albumSongTitleNumber.innerHTML="#";
        albumSongTitleName.innerHTML="標題";
        albumSongTitleTime.innerHTML="時間";
        albumSongTitle.setAttribute("class","songTitle");
        albumSongTitleName.setAttribute("class","songName");
        albumSongTitleTime.setAttribute("class","songTime");
        albumSongTitle.appendChild(albumSongTitleNumber);
        albumSongTitle.appendChild(albumSongTitleName);
        albumSongTitle.appendChild(albumSongTitleTime); 



        albumImg.setAttribute("src","https://d3q6xrhh7sv0kw.cloudfront.net/musicbox/album/"+this.postId+"/"+imgKey);
        albumNameBox.innerHTML=albumName
        albumArtisBox.innerHTML=albumArtis
        albumPlay.setAttribute("data-play-this-album",songList)
        albumPlay.setAttribute("id","albumPlay")        
        albumPlay.setAttribute("src","https://d3q6xrhh7sv0kw.cloudfront.net/musicbox/play-button.png");
        albumBox.setAttribute("class","albumBoxForSongList");
        albumRightSide.setAttribute("class","albumRightSide");
        albumNameBox.setAttribute("class","albumPageName");
        albumArtisBox.setAttribute("class","albumPageArtis");

        albumBox.appendChild(albumImg);
        albumRightSide.appendChild(albumNameBox);
        albumRightSide.appendChild(albumArtisBox);
        albumRightSide.appendChild(albumPlay);
        albumBox.appendChild(albumRightSide);
        albumInformationArea.appendChild(albumBox);
        albumInformationArea.appendChild(albumSongTitle);
        albumInformationArea.appendChild(songListbox);
        ////sort list none
        let sortDiv=document.getElementById("sortDiv");
        sortDiv.style.display="none";
        return `
            ${albumInformationArea.outerHTML}
        `;
    }
}
