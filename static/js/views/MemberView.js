import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        //this.setTitle("Settings");
    }

    async getHtml() {
        let userPageArea=document.createElement("div");
        userPageArea.setAttribute("id","userPageArea");
        getUserForMemberPage().then((res)=>{addElementForMemberPage(res)})
        ////sort list none
        let sortDiv=document.getElementById("sortDiv");
        sortDiv.style.display="none";
        
        return `
            ${userPageArea.outerHTML}
        `;
    }
}