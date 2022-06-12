import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.postId = params.id;
        //this.setTitle("Dashboard");
    }

    async getHtml() {
        console.log(this.postId)
        let apiUrl="/api/albums/sort/"+this.postId
        console.log(apiUrl)
        let apiResponse= await fetch(apiUrl)
        let data=await apiResponse.json()
        console.log(data)
        let albumList=await data.data

        let albumArea=document.createElement("div");
        albumArea.setAttribute("class","albumArea");
        function addelement(imgKey,name,albumKey){
            let albumBox=document.createElement("div");
            let albumImg=document.createElement("img");
            let albumName=document.createElement("div");
            let albumHref=document.createElement("a");
            albumHref.setAttribute("href","/Album/"+albumKey);
            albumBox.setAttribute("class","albumBox");
            albumImg.setAttribute("class","albumImg");
            albumImg.setAttribute("data-Album-link","");
            albumName.setAttribute("class","albumName");
            albumName.setAttribute("data-Album-link","");
            albumImg.setAttribute("src","https://d3q6xrhh7sv0kw.cloudfront.net/musicbox/album/"+albumKey+"/"+imgKey);
            albumName.innerHTML=name
            albumHref.appendChild(albumBox);
            albumBox.appendChild(albumImg);
            albumBox.appendChild(albumName);
            albumArea.appendChild(albumHref);
           
        }
        for  (let i in albumList){
            
          let thisName= albumList[i].albumName;
          let thisImg= albumList[i].albumImg;
          let thisKey= albumList[i].albumKey;
          addelement(thisImg,thisName,thisKey); 
        }
        ///
        let sortDiv=document.getElementById("sortDiv");
        sortDiv.style.display="block";
        return `
            <h1>專輯列表</h1> 
            ${albumArea.outerHTML}
        `;
    }
}