import { ICriteriaChange } from "../../../Helper/ICriteriaChange";
import { SearchCriteria } from "./SearchCriteria";
import { IResultHandler } from "../../../Helper/IResultHandler";
import { AjaxCaller } from "../../../Helper/AjaxCaller";
import { UserInput } from "../../../Helper/UserInput";

export class SearchCriteriaViewLoader implements IResultHandler {
    
    private readonly RequestIndexKey: string = "RequestIndex";
    private _currentRequestIndex: number = 0;

    private readonly _url: string = "/Home/GetSearchCriteriaView";

    private _resultHandler: IResultHandler;
    private _ajaxCaller: AjaxCaller;

    private _searchCriteriaChange: ICriteriaChange;
    private _previousCategoryId: number = 0;
    private _currentCategoryId: number = 0;
    private _searchCriteria: SearchCriteria;

    constructor(resultHandler: IResultHandler,
        searchCriteriaChange: ICriteriaChange,
        searchCriteria: SearchCriteria,
        requestCode: number) {
        this._resultHandler = resultHandler;
        this._ajaxCaller = new AjaxCaller(this._url, this, requestCode);
        this._searchCriteriaChange = searchCriteriaChange;
        this._searchCriteria = searchCriteria;
    }

    public GetSearchCriteriaViewFromServer(userInput:UserInput,categoryId: number) {
        this._currentRequestIndex++;
        this._currentCategoryId = categoryId;
        userInput.ParametersDictionary[this.RequestIndexKey] = this._currentRequestIndex;
        this._ajaxCaller.Call(userInput);//GET
    }

    public OnResult(param: any, requestCode: number): void {
        if (param.CustomDictionary[this.RequestIndexKey] == this._currentRequestIndex) { //last call response
            if (param.Success == true) {
                this._searchCriteria.UnBind(this._previousCategoryId);
                this._resultHandler.OnResult(param.ResponseData, requestCode);
                this._searchCriteria.Bind(this._currentCategoryId, this._searchCriteriaChange);
                this._previousCategoryId = this._currentCategoryId;
            } else {
                this._resultHandler.OnError(param.Message + " , " + param.ErrorCode, requestCode);
            }
        }
        
    }

    public OnError(message: string, requestCode: number): void {
        this._resultHandler.OnError(message,requestCode);
    }

    public AjaxCallStarted(requestCode: number): void {
        this._resultHandler.AjaxCallStarted(requestCode);
    }

    public AjaxCallFinished(requestCode: number): void {
        this._resultHandler.AjaxCallFinished(requestCode);
    }
    
}