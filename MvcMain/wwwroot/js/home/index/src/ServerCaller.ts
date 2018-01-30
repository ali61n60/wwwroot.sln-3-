import { UserInput } from "../../../Helper/UserInput";
import { IResultHandler } from "../../../Helper/IResultHandler";
import { AdvertisementCommon } from "../../../Models/AdvertisementCommon";
import {AjaxCaller} from "../../../Helper/AjaxCaller";

//TODO make count optional to user
//TODO instead of adding new ads to the page here call a method on index class to add it by defining an interface in the index class 
export class ServerCaller implements IResultHandler {
    
    private readonly StartIndexKey: string = "StartIndex";
    private readonly _initialStart: number = 1;
    private _start: number = 1;

    private readonly CountKey: string = "Count";
    private _count: number = 5;

    private readonly RequestIndexKey: string = "RequestIndex";
    private _currentRequestIndex: number = 0;
    
    private readonly NumberOfItemsKey: string = "numberOfItems";

    private readonly _url: string = "/api/AdApi/GetAdvertisementCommon";

    private _resultHandler: IResultHandler;
    private _ajaxCaller:AjaxCaller;

    constructor(resultHandler: IResultHandler) {
        this._resultHandler = resultHandler;
        this._ajaxCaller = new AjaxCaller(this._url, this);
    }

    public GetAdItemsFromServer(userInput: UserInput): void {
        this._currentRequestIndex++;

        userInput.ParametersDictionary[this.StartIndexKey] = this._start;
        userInput.ParametersDictionary[this.CountKey] = this._count;
        userInput.ParametersDictionary[this.RequestIndexKey] = this._currentRequestIndex;

        this._ajaxCaller.Call(userInput);
    } //GetAdItemsFromServer

    

    private onErrorGetItemsFromServer(jqXHR: JQueryXHR, textStatus: string, errorThrown: string) {
       
        this._resultHandler.OnError(textStatus + " , " + errorThrown);
    }

    public ResetSearchParameters(): void {
        this._start = this._initialStart;
    }

    public OnResult(param): void {
        //TODO check for undefined or null in msg and msg.customDictionary["RequestIndex"]


        if (param.CustomDictionary[this.RequestIndexKey] == this._currentRequestIndex) { //last call response
            if (param.Success == true) {
                this._start += parseInt(param.CustomDictionary[this.NumberOfItemsKey]);
                //TODO create AdvertisementCommon[] object from msg.responseData
                this._resultHandler.OnResult(param.ResponseData);
            } //if (msg.success == true)
            else {
                this._resultHandler.OnError(param.Message + " , " + param.ErrorCode);
            }
        }
    }

    public OnError(message: string): void {
        this._resultHandler.OnError(message);
    }

    public AjaxCallFinished(): void {
        this._resultHandler.AjaxCallFinished();
    }

    public AjaxCallStarted(): void {
        this._resultHandler.AjaxCallStarted();
    }
}

