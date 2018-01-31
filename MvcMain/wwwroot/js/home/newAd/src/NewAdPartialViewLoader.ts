import { NewAdCriteria } from "./NewAdCriteria";
import { ICriteriaChange } from "../../../Helper/ICriteriaChange";
import { IResultHandler } from "../../../Helper/IResultHandler";
import { AjaxCaller } from "../../../Helper/AjaxCaller";
import {UserInput} from "../../../Helper/UserInput";


export class NewAdPartialViewLoader implements IResultHandler {

    private readonly RequestIndexKey: string = "RequestIndex";
    private _currentRequestIndex: number = 0;

    private _url: string = "/NewAd/GetNewAdPartialView";

    private _resultHandler: IResultHandler;
    private _ajaxCaller: AjaxCaller;

    private _newAdCriteriaChange: ICriteriaChange;
    private _previousCategoryId: number = 0;
    private _currentCategoryId: number = 0;
    private _newAdCriteria: NewAdCriteria;



    private _partialViewDivId: string;
    // partialViewDivId: string, newAdCriteriaChange: ICriteriaChange, newAdCriteria: NewAdCriteria)
    //this._partialViewDivId = partialViewDivId;
    constructor(resultHandler: IResultHandler, newAdCriteriaChange: ICriteriaChange, newAdCriteria: NewAdCriteria, requestCode: number) {
        this._resultHandler = resultHandler;
        this._newAdCriteriaChange = newAdCriteriaChange;
        this._newAdCriteria = newAdCriteria;
        this._ajaxCaller = new AjaxCaller(this._url, this, requestCode);
    }

    public GetPartialViewFromServer(userInput: UserInput, categoryId: number) {
        this._currentCategoryId = categoryId;
        this._ajaxCaller.Call(userInput);
        
    }

    private onSuccessGetItemsFromServer(msg: any, textStatus: string, jqXHR: JQueryXHR) {
        
    }//onSuccessGetTimeFromServer

    private onErrorGetItemsFromServer(jqXHR: JQueryXHR, textStatus: string, errorThrown: string) {
       
    }//onErrorGetTimeFromServer

    OnResult(param: any, requestCode: number): void {
        if (param.CustomDictionary[this.RequestIndexKey] == this._currentRequestIndex) { //last call response
            if (param.Success == true) {
                this._newAdCriteria.UnBind(this._previousCategoryId);
                this._resultHandler.OnResult(param.ResponseData, requestCode);
                this._newAdCriteria.Bind(this._currentCategoryId, this._newAdCriteriaChange);
                this._previousCategoryId = this._currentCategoryId;
            } else {
                this._resultHandler.OnError(param.Message + " , " + param.ErrorCode, requestCode);
            }
        }
    }
    OnError(message: string, requestCode: number): void {
        this._resultHandler.OnError(message,requestCode);
    }
    AjaxCallFinished(requestCode: number): void {
        this._resultHandler.AjaxCallFinished(requestCode);
    }
    AjaxCallStarted(requestCode: number): void {
        this._resultHandler.AjaxCallStarted(requestCode);
    }
}

//TODO refactor this
export class PartialViewServerCallParameters {
    public CategoryId: number;
}