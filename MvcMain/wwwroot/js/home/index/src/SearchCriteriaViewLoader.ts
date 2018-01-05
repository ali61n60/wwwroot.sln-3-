import { PartialViewServerCallParameters } from "../../newAd/src/NewAdPartialViewLoader";
import {ICriteriaChange } from "../../../Helper/ICriteriaChange";
import {SearchCriteria} from "./SearchCriteria";

export class SearchCriteriaViewLoader {
    private _parentDivId: string;
    private _searchCriteriaChange: ICriteriaChange;
    private _url: string = "Home/GetSearchCriteriaView";
    private _previousCategoryId:number = 0;
    private _currentCategoryId: number = 0;
    private _searchCriteria:SearchCriteria;

    constructor(parentDivId: string, searchCriteriaChange: ICriteriaChange,searchCriteria:SearchCriteria) {
        this._parentDivId = parentDivId;
        this._searchCriteriaChange = searchCriteriaChange;
        this._searchCriteria = searchCriteria;
    }

    public GetSearchCriteriaViewFromServer(categoryId: number) {
        //TODO get view from server and add it to page
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
        this._searchCriteria.UnBind(this._previousCategoryId);
        $("#" + this._parentDivId).children().remove();
        $("#" + this._parentDivId).html(msg);
        this._searchCriteria.Bind(this._currentCategoryId, this._searchCriteriaChange);
        this._previousCategoryId = this._currentCategoryId;
    }//onSuccessGetTimeFromServer

    private onErrorGetItemsFromServer(jqXHR: JQueryXHR, textStatus: string, errorThrown: string) {
        alert(errorThrown);
    }//onErrorGetTimeFromServer

    
    
}