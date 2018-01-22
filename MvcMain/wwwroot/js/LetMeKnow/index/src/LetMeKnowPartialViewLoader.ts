import {ICriteriaChange} from "../../../Helper/ICriteriaChange";
import {NewAdCriteria} from "../../../home/newAd/src/NewAdCriteria";
import {PartialViewServerCallParameters} from "../../../home/newAd/src/NewAdPartialViewLoader";
import {LetMeKnowCriteria} from "./LetMeKnowCriteria";


export class LetMeKnowPartialViewLoader {
    private _partialViewDivId: string;
    private _url: string = "/LetMeKnow/GetLetMeKnowPartialView";
    private _previousCategoryId: number = 0;
    private _currentCategoryId: number = 0;
    private _criteriaChange: ICriteriaChange;
    private _letMeKnowCriteria: LetMeKnowCriteria;

    constructor(partialViewDivId: string, criteriaChange: ICriteriaChange, letMeKnowCriteria: LetMeKnowCriteria) {
        this._partialViewDivId = partialViewDivId;
        this._criteriaChange = criteriaChange;
        this._letMeKnowCriteria = letMeKnowCriteria;
    }

    public GetPartialViewFromServer(categoryId: number) {
        this._currentCategoryId = categoryId;
        let callParams = new PartialViewServerCallParameters();
        callParams.CategoryId = categoryId;
        $.ajax({
            type: "GET", //GET or POST or PUT or DELETE verb
            url: this._url,
            data: callParams, //Data sent to server
            success: (msg, textStatus, jqXHR) => this.onSuccessGetItemsFromServer(msg, textStatus, jqXHR),//On Successfull service call
            error: (jqXHR, textStatus, errorThrown) => this.onErrorGetItemsFromServer(jqXHR, textStatus, errorThrown)// When Service call fails
        });//.ajax
    }

    private onSuccessGetItemsFromServer(msg: any, textStatus: string, jqXHR: JQueryXHR) {
        this._letMeKnowCriteria.UnBind(this._previousCategoryId);
        $("#" + this._partialViewDivId).children().remove();
        $("#" + this._partialViewDivId).html(msg);
        this._letMeKnowCriteria.Bind(this._currentCategoryId, this._criteriaChange);
        this._previousCategoryId = this._currentCategoryId;
    }//onSuccessGetTimeFromServer

    private onErrorGetItemsFromServer(jqXHR: JQueryXHR, textStatus: string, errorThrown: string) {
        alert(errorThrown);
    }//onErrorGetTimeFromServer

}
