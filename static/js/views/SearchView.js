import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        //this.setTitle("Settings");
    }

    async getHtml() {
        let searchArea=document.createElement("div");
        let topArea=document.createElement("div");
        let searchInput=document.createElement("input")
        let searchBt=document.createElement("div");
        let searchButtonDiv=document.createElement("div");
        searchBt.innerHTML='<i class="fa fa-search" aria-hidden="true" id="searchBt" data-search-input></i>';
        searchInput.setAttribute("placeholder","請輸入歌名");
        searchInput.setAttribute("id","searchIndexKey");
        searchBt.setAttribute("id","searchBtDiv");
        topArea.setAttribute("class","searchTop");
        searchButtonDiv.setAttribute("id","searchButtonDiv");
        topArea.appendChild(searchInput);
        topArea.appendChild(searchBt);
        searchArea.appendChild(topArea);
        searchArea.appendChild(searchButtonDiv);


        ////sort list none
        let sortDiv=document.getElementById("sortDiv");
        sortDiv.style.display="none";
        return `
            <h1>搜尋歌曲</h1>
            ${searchArea.outerHTML}
        `;
    }
}