import { UserInput } from "../../../Helper/UserInput";
import { IResultHandler } from "../../../Helper/IResultHandler";
import {AjaxCaller} from "../../../Helper/AjaxCaller";

//TODO make count optional to user
export class ServerCaller implements IResultHandler {

    private readonly RequestIndexKey: string = "RequestIndex";
    private _currentRequestIndex: number = 0;

    private readonly _url: string = "/api/AdApi/GetAdvertisementCommon";

    private readonly  _resultHandler: IResultHandler;
    private readonly  _ajaxCaller: AjaxCaller;
    
    private readonly StartIndexKey: string = "StartIndex";
    private readonly _initialStart: number = 1;
    private _start: number = 1;

    private readonly CountKey: string = "Count";
    private _count: number = 5;
    
    private readonly NumberOfItemsKey: string = "numberOfItems";
    
    constructor(resultHandler: IResultHandler,requestCode:number) {
        this._resultHandler = resultHandler;
        this._ajaxCaller = new AjaxCaller(this._url, this,requestCode);
    }

    public GetAdItemsFromServer(userInput: UserInput): void {
        this._currentRequestIndex++;

        userInput.ParametersDictionary[this.StartIndexKey] = this._start;//TODO fill it from index.ts maybe it will be a user asked input
        userInput.ParametersDictionary[this.CountKey] = this._count;////TODO fill it from index.ts
        userInput.ParametersDictionary[this.RequestIndexKey] = this._currentRequestIndex;

        this._ajaxCaller.Call(userInput);
    } //GetAdItemsFromServer

   public OnResult(param:any,requestCode:number): void {
        //TODO check for undefined or null in msg and msg.customDictionary["RequestIndex"]
        if (param.CustomDictionary[this.RequestIndexKey] == this._currentRequestIndex) { //last call response
            if (param.Success == true) {
                this._start += parseInt(param.CustomDictionary[this.NumberOfItemsKey]);
                this._resultHandler.OnResult(param.ResponseData, requestCode);
            } //if (msg.success == true)
            else {
                this._resultHandler.OnError(param.Message + " , " + param.ErrorCode, requestCode);
            }
        }
    }

    public OnError(message: string,requestCode:number): void {
        this._resultHandler.OnError(message, requestCode);
    }

    public AjaxCallFinished(requestCode: number): void {
        this._resultHandler.AjaxCallFinished(requestCode);
    }

    public AjaxCallStarted(requestCode: number): void {
        this._resultHandler.AjaxCallStarted(requestCode);
    }

    public ResetSearchParameters(): void {
        this._start = this._initialStart;
    }

}

