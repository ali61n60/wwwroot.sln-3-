import { PartialViewServerCallParameters } from "../../newAd/src/NewAdPartialViewLoader";
import { ICriteriaChange } from "../../../Helper/ICriteriaChange";
import { SearchCriteria } from "./SearchCriteria";
import { IResultHandler } from "../../../Helper/IResultHandler";
import { AjaxCaller } from "../../../Helper/AjaxCaller";
import { UserInput } from "../../../Helper/UserInput";

export class SearchCriteriaViewLoader implements IResultHandler {
    //private readonly RequestIndexKey: string = "RequestIndex";
    //private _currentRequestIndex: number = 0;

    private readonly _url: string = "/Home/GetSearchCriteriaView";

    private _resultHandler: IResultHandler;
    private _ajaxCaller: AjaxCaller;



    private _parentDivId: string;
    private _searchCriteriaChange: ICriteriaChange;

    private _previousCategoryId: number = 0;
    private _currentCategoryId: number = 0;
    private _searchCriteria: SearchCriteria;

    //constructor(parentDivId: string, searchCriteriaChange: ICriteriaChange, searchCriteria: SearchCriteria) {
    constructor(resultHandler: IResultHandler, requestCode: number) {
        this._ajaxCaller = new AjaxCaller(this._url, this, requestCode);
        this._parentDivId = parentDivId;
        this._searchCriteriaChange = searchCriteriaChange;
        this._searchCriteria = searchCriteria;
    }

    public GetSearchCriteriaViewFromServer(categoryId: number) {
        let userInput = new UserInput();
        userInput.ParametersDictionary["CategoryId"] = categoryId;
        this._currentCategoryId = categoryId;
        this._ajaxCaller.Call(userInput);//GET
    }

    public OnResult(param: any, requestCode: number): void {
        this._resultHandler.OnResult(param,requestCode);
    }
    public OnError(message: string, requestCode: number): void {
        this._resultHandler.OnError(message,requestCode);
    }
    public AjaxCallFinished(requestCode: number): void {
        throw new Error("Method not implemented.");
    }
    public AjaxCallStarted(requestCode: number): void {
        throw new Error("Method not implemented.");
    }
}