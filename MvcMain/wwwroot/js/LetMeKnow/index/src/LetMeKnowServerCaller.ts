import {UserInput} from "../../../Helper/UserInput";
import {IResultHandler } from "../../../Helper/IResultHandler";
import {AjaxCaller} from "../../../Helper/AjaxCaller";

export class LetMeKnowServerCaller implements IResultHandler{

    private readonly RequestIndexKey: string = "RequestIndex";
    private _currentRequestIndex: number = 0;
    private readonly _url: string = "/api/LetMeKnowApi/AddNewLetMeKnowRecord";

    private _resultHandler: IResultHandler;
    private _ajaxCaller: AjaxCaller;

    constructor(resultHandler:IResultHandler, requestCode:number) {
        this._resultHandler = resultHandler;
        this._ajaxCaller = new AjaxCaller(this._url, this, requestCode);
    }


   


    public SaveAd(userInput: UserInput): void {
        this._currentRequestIndex++;
        userInput.ParametersDictionary[this.RequestIndexKey] = this._currentRequestIndex;

        this._ajaxCaller.Call(userInput);
        
    }

   
    OnResult(param: any, requestCode: number): void {
        if (param.CustomDictionary[this.RequestIndexKey] == this._currentRequestIndex) { //last call response
            if (param.Success == true) {
                this._resultHandler.OnResult(param.ResponseData,requestCode);
            } else {
                this._resultHandler.OnError(param.Message,requestCode);
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