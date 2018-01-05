import {NewAdCriteria} from "./NewAdCriteria";
import {ICriteriaChange} from "../../../Helper/ICriteriaChange";

export class NewAdPartialViewLoader {
    private _partialViewDivId: string;
    private _url: string = "/Home/GetNewAdPartialView";
    private _previousCategoryId: number = 0;
    private _currentCategoryId: number = 0;
    private _newAdCriteriaChange: ICriteriaChange;
    private _newAdCriteria: NewAdCriteria;

    constructor(partialViewDivId: string, newAdCriteriaChange: ICriteriaChange, newAdCriteria:NewAdCriteria) {
        this._partialViewDivId = partialViewDivId;
        this._newAdCriteriaChange = newAdCriteriaChange;
        this._newAdCriteria = newAdCriteria;
    }

    public GetPartialViewFromServer(categoryId: number) {
        this._currentCategoryId = categoryId;
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
        this._newAdCriteria.UnBind(this._previousCategoryId);
        $("#" + this._partialViewDivId).children().remove();
        $("#" + this._partialViewDivId).html(msg);
        this._newAdCriteria.Bind(this._currentCategoryId, this._newAdCriteriaChange);
        this._previousCategoryId = this._currentCategoryId;
    }//onSuccessGetTimeFromServer

    private onErrorGetItemsFromServer(jqXHR: JQueryXHR, textStatus: string, errorThrown: string) {
        alert(errorThrown);
    }//onErrorGetTimeFromServer
}

//TODO refactor this
export class PartialViewServerCallParameters {
    public CategoryId:number;
}