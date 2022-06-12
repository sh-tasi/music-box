import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        //this.setTitle("Settings");
    }

    async getHtml() {
        let parentDiv=document.createElement("div");
        parentDiv.setAttribute("class","allplaylist");
        if(User===null){
            window.location ="/";
        }
        else{
            let apiUrl="/api/playlist"
            let apiResponse= await fetch(apiUrl)
            let data=await apiResponse.json()
            if(data.error==true){
                

            }
            else{
                //sett parent box
                
                //mydata.data.length==0
            // console.log(mydata.data)
                // user paly list fetch in here
                let allList=await data.data
                if (allList.length==0){
                    let addBoxDiv=document.createElement("div");
                    let addImageDiv=document.createElement("img");
                    let addBoxTextDiv=document.createElement("div");
                    addBoxTextDiv.innerHTML="開始新增撥放清單";
                    addBoxDiv.setAttribute("class","playlsitDiv");
                    addImageDiv.setAttribute("class","addplaylistimg");
                    addImageDiv.setAttribute("data-link-addPlaylist","");
                    addBoxTextDiv.setAttribute("class","addplaylistName");
                    addBoxTextDiv.setAttribute("data-link-addPlaylist","");
                    addImageDiv.setAttribute("src","https://d3q6xrhh7sv0kw.cloudfront.net/musicbox/plus.png")
                    addBoxDiv.appendChild(addImageDiv);
                    addBoxDiv.appendChild(addBoxTextDiv);
                    parentDiv.appendChild(addBoxDiv);
                }
                else{
                    let addBoxDiv=document.createElement("div");
                    let addImageDiv=document.createElement("img");
                    let addBoxTextDiv=document.createElement("div");
                    addBoxTextDiv.innerHTML="新增撥放清單";
                    addBoxDiv.setAttribute("class","playlsitDiv");
                    addImageDiv.setAttribute("class","addplaylistimg");
                    addImageDiv.setAttribute("data-link-addPlaylist","");
                    addBoxTextDiv.setAttribute("class","addplaylistName");
                    addBoxTextDiv.setAttribute("data-link-addPlaylist","");
                    addImageDiv.setAttribute("src","https://d3q6xrhh7sv0kw.cloudfront.net/musicbox/plus.png")
                    addBoxDiv.appendChild(addImageDiv);
                    addBoxDiv.appendChild(addBoxTextDiv);
                    parentDiv.appendChild(addBoxDiv);
                    for(let  i in allList){

                        let playlistkey=allList[i].playlistKey
                        let listName=allList[i].listName
    
                        let listImg=allList[i].listImage
                        let link=document.createElement("a");
                        let playlistDiv=document.createElement("div");
                        let listImageDiv=document.createElement("img");
                        let listNameDiv=document.createElement("div");
                        link.setAttribute("class","palylistlink")
                        link.setAttribute("href","/playlist"+"/"+playlistkey);
                        listImageDiv.setAttribute("src","https://d3q6xrhh7sv0kw.cloudfront.net/musicbox/playlistImg/"+listImg);
                        listImageDiv.setAttribute("class","playlistimg")
                        listImageDiv.setAttribute("data-link-play-list",playlistkey);
                        playlistDiv.setAttribute("class","playlistDiv")
                        listNameDiv.setAttribute("class","playlistName")
                        listNameDiv.setAttribute("data-link-play-list",playlistkey);
                        listNameDiv.innerHTML=listName;
                        playlistDiv.appendChild(listImageDiv);
                        playlistDiv.appendChild(listNameDiv);
                        link.appendChild(playlistDiv);
                        parentDiv.appendChild(link);
                    }
                }
                    //all list data and creat div
                    
                    
                
            }
            
        }
        ////sort list none
        let sortDiv=document.getElementById("sortDiv");
        sortDiv.style.display="none";
        return `
            ${parentDiv.outerHTML}
        `;
    }
}