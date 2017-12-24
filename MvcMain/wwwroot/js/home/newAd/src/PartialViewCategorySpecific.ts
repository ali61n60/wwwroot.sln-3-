
export class PartialViewCategorySpecific {
    private _partialViewDivId: string;
    private _url: string = "/Home/GetNewAdPartialView";

    constructor(partialViewDivId: string) {
        this._partialViewDivId = partialViewDivId;
    }

    public GetPartialViewFromServer(categoryId: number) {
        let callParams = new PartialViewServerCallParameters();
        callParams.CategoryId = categoryId;
        $.ajax({
            type: "GET", //GET or POST or PUT or DELETE verb
            url: this._url,
            data: callParams, //Data sent to server
            //contentType: 'application/json', // content type sent to server
            success: (msg, textStatus, jqXHR) => this.onSuccessGetItemsFromServer(msg, textStatus, jqXHR),//On Successfull service call
            error: (jqXHR, textStatus, errorThrown) => this.onErrorGetItemsFromServer(jqXHR, textStatus, errorThrown)// When Service call fails
        });//.ajax
    }

    private onSuccessGetItemsFromServer(msg: any, textStatus: string, jqXHR: JQueryXHR) {

        $("#"+this._partialViewDivId).html(msg);
        //  $("#adPlaceHolder").append(html);
    }//onSuccessGetTimeFromServer

    private onErrorGetItemsFromServer(jqXHR: JQueryXHR, textStatus: string, errorThrown: string) {
        alert(errorThrown);
    }//onErrorGetTimeFromServer
}

class PartialViewServerCallParameters {
    public CategoryId:number;
}