import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        //this.setTitle("Posts");
    }

    async getHtml() {
        let queueBox=document.createElement("div");
        let isPlaying=document.createElement("div");
        let queueTitle=document.createElement("div");
        queueTitle.innerHTML="佇列";
        isPlaying.innerHTML="正在播放";
        queueTitle.setAttribute("class","queueTitle")
        queueBox.appendChild(queueTitle);
        queueBox.appendChild(isPlaying);
        for (let i in All_song){
            let queueSong=document.createElement("div");
            let queueNumber=document.createElement("div");
            let queueImg=document.createElement("img");
            let queueName=document.createElement("div");
            let queueAlbum=document.createElement("div");
            let queueTime=document.createElement("div");
            let queueDelet=document.createElement("div");
            let albumkey=All_song[i].thisAlbumKey
            queueBox.setAttribute("class","queueBox")
            queueDelet.setAttribute("class","queueDelet");
            queueSong.setAttribute("class","queueSong");
            queueName.setAttribute("class","queueSongName");
            queueAlbum.setAttribute("class","queueSongAlbum");
            queueAlbum.setAttribute("data-search-to-album",albumkey);
            queueImg.setAttribute("src",All_song[i].img)
            queueName.innerHTML=All_song[i].name;
            queueNumber.innerHTML=Number(i)+1;
            queueAlbum.innerHTML=All_song[i].thisAlbum;

            queueDelet.innerHTML='<i class="fa fa-trash-o" aria-hidden="true" data-delet-song='+i+'></i>';
            if (i==1){
                let waitSong=document.createElement("div");
                waitSong.innerHTML="待播放清單"
                queueBox.appendChild(waitSong);
            }
            queueSong.appendChild(queueNumber);
            queueSong.appendChild(queueImg);
            queueSong.appendChild(queueName);
            queueSong.appendChild(queueAlbum);
            queueSong.appendChild(queueDelet);
            queueBox.appendChild(queueSong);
            
        }
        ////sort list none
        let sortDiv=document.getElementById("sortDiv");
        sortDiv.style.display="none";
        return `
            ${queueBox.outerHTML}
        `;
    }
}