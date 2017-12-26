import { PartialViewServerCallParameters} from "../../newAd/src/PartialViewCategorySpecific";
import {Index} from "./index";



export class SearchCriteriaViewLoader {
    private _parentDivId: string;
    private _indexObject:Index;
    private _url: string = "Home/GetSearchCriteriaView";
    private _previousCategoryId:number = 0;
    private _currentCategoryId: number = 0;

    constructor(parentDivId: string, indexObject: Index) {
        this._parentDivId = parentDivId;
        this._indexObject = indexObject;
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
        this.unBindEvents();
        $("#" + this._parentDivId).children().remove();
        $("#" + this._parentDivId).html(msg);
        this.bindEvents();
    }//onSuccessGetTimeFromServer

    private onErrorGetItemsFromServer(jqXHR: JQueryXHR, textStatus: string, errorThrown: string) {
        alert(errorThrown);
    }//onErrorGetTimeFromServer

    private bindEvents(): void {
        //use currentCategoryId
        switch (this._currentCategoryId) {
        case 100:
            $("#brand").on("change",(event) => {
                console.log($(event.currentTarget).find("option:selected").text());
                this._indexObject.CustomSearchCriteriChanged();
            });
        default:
        }
        console.log("binding " + this._currentCategoryId);
        this._previousCategoryId = this._currentCategoryId;
    }

    private unBindEvents(): void {
        //use previouscategoryId
        switch (this._previousCategoryId) {
        case 100:
            $("#brand").off("change");
        default:
        }
        console.log("UnBinding " + this._previousCategoryId);
    }
    
}