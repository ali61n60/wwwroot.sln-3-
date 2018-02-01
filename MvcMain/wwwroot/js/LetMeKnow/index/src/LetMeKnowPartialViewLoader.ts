import {ICriteriaChange} from "../../../Helper/ICriteriaChange";
import {NewAdCriteria} from "../../../home/newAd/src/NewAdCriteria";

import {LetMeKnowCriteria} from "./LetMeKnowCriteria";
import {IResultHandler} from "../../../Helper/IResultHandler";
import {AjaxCaller} from "../../../Helper/AjaxCaller";
import {UserInput} from "../../../Helper/UserInput";


export class LetMeKnowPartialViewLoader  implements IResultHandler {
    private readonly RequestIndexKey: string = "RequestIndex";
    private _currentRequestIndex: number = 0;
    private _url: string = "/LetMeKnow/GetLetMeKnowPartialView";

    private _resultHandler: IResultHandler;
    private _ajaxCaller: AjaxCaller;

    private _partialViewDivId: string;
    
    private _previousCategoryId: number = 0;
    private _currentCategoryId: number = 0;
    private _criteriaChange: ICriteriaChange;
    private _letMeKnowCriteria: LetMeKnowCriteria;

    constructor(resultHandler: IResultHandler, criteriaChange: ICriteriaChange, letMeKnowCriteria: LetMeKnowCriteria, requestCode: number) {
        this._resultHandler = resultHandler;
        this._ajaxCaller = new AjaxCaller(this._url, this, requestCode);
        this._criteriaChange = criteriaChange;
        this._letMeKnowCriteria = letMeKnowCriteria;

    }

    public GetPartialViewFromServer(userInput: UserInput, categoryId: number) {
        this._currentCategoryId = categoryId;

        this._currentRequestIndex++;
        userInput.ParametersDictionary[this.RequestIndexKey] = this._currentRequestIndex;

        this._ajaxCaller.Call(userInput);
        
    }

    private onSuccessGetItemsFromServer(msg: any, textStatus: string, jqXHR: JQueryXHR) {
       
    }//onSuccessGetTimeFromServer

    private onErrorGetItemsFromServer(jqXHR: JQueryXHR, textStatus: string, errorThrown: string) {
       
    }//onErrorGetTimeFromServer

    OnResult(param, requestCode: number): void {
        if (param.CustomDictionary[this.RequestIndexKey] == this._currentRequestIndex) { //last call response
            if (param.Success == true) {
                this._letMeKnowCriteria.UnBind(this._previousCategoryId);
                this._resultHandler.OnResult(param.ResponseData, requestCode);
                this._letMeKnowCriteria.Bind(this._currentCategoryId, this._criteriaChange);
                this._previousCategoryId = this._currentCategoryId;
            } else {
                this._resultHandler.OnError(param.Message + " , " + param.ErrorCode, requestCode);
            }
        }


        
        
        
        
    }

    
    OnError(message: string, requestCode: number): void {
        this._resultHandler.OnError(message, requestCode);
    }
    AjaxCallFinished(requestCode: number): void {
        this._resultHandler.AjaxCallFinished(requestCode);
    }
    AjaxCallStarted(requestCode: number): void {
        this._resultHandler.AjaxCallStarted(requestCode);
    }

    
}
