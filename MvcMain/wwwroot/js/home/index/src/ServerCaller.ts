import { UserInput } from "../../../Helper/UserInput";
import { IResultHandler } from "../../../Helper/IResultHandler";
import { AdvertisementCommon } from "../../../Models/AdvertisementCommon";


//TODO make count optional to user
//TODO instead of adding new ads to the page here call a method on index class to add it by defining an interface in the index class 
export class ServerCaller {
    private readonly StartIndexKey: string = "StartIndex";
    private readonly _initialStart: number = 1;
    private _start: number = 1;

    private readonly CountKey: string = "Count";
    private _count: number = 5;

    private readonly RequestIndexKey: string = "RequestIndex";
    private _currentRequestIndex: number = 0;
    private _numberOfPureServerCalls: number = 0;


    private readonly NumberOfItemsKey: string = "numberOfItems";

    private readonly _url: string = "/api/AdApi/GetAdvertisementCommon";

    private _resultHandler: IResultHandler<AdvertisementCommon[]>;

    constructor(resultHandler: IResultHandler<AdvertisementCommon[]>) {
        this._resultHandler = resultHandler;
    }

    public GetAdItemsFromServer(userInput: UserInput): void {
        this._currentRequestIndex++;

        userInput.ParametersDictionary[this.StartIndexKey] = this._start;
        userInput.ParametersDictionary[this.CountKey] = this._count;
        userInput.ParametersDictionary[this.RequestIndexKey] = this._currentRequestIndex;

        $.ajax({
            type: "POST",
            url: this._url,
            data: JSON.stringify(userInput.ParametersDictionary), //Data sent to server
            contentType: 'application/json', // content type sent to server
            success: (msg, textStatus, jqXHR) => this.onSuccessGetItemsFromServer(msg, textStatus, jqXHR), //On Successfull service call
            error: (jqXHR, textStatus, errorThrown) => this.onErrorGetItemsFromServer(jqXHR, textStatus, errorThrown) // When Service call fails
        }); //.ajax

        this._numberOfPureServerCalls++;
        this._resultHandler.AjaxCallStarted();
    } //GetAdItemsFromServer

    private onSuccessGetItemsFromServer(msg: any, textStatus: string, jqXHR: JQueryXHR) {
        //TODO check for undefined or null in msg and msg.customDictionary["RequestIndex"]
        this._numberOfPureServerCalls--;
        if (this._numberOfPureServerCalls === 0) {
            this._resultHandler.AjaxCallFinished();
        }

        if (msg.CustomDictionary[this.RequestIndexKey] == this._currentRequestIndex) { //last call response
            if (msg.Success == true) {
                this._start += parseInt(msg.CustomDictionary[this.NumberOfItemsKey]);
                //TODO create AdvertisementCommon[] object from msg.responseData
                this._resultHandler.OnResultOk(msg.ResponseData);
            } //if (msg.success == true)
            else {
                this._resultHandler.OnResultError(msg.Message + " , " + msg.ErrorCode);
            }
        }
    }

    private onErrorGetItemsFromServer(jqXHR: JQueryXHR, textStatus: string, errorThrown: string) {
        this._numberOfPureServerCalls--;
        if (this._numberOfPureServerCalls === 0) {
            this._resultHandler.AjaxCallFinished();
        }

        this._resultHandler.OnResultError(textStatus + " , " + errorThrown);
    }

    public ResetSearchParameters(): void {
        this._start = this._initialStart;
    }

    //private notifyUserAjaxCallStarted() {
    //    $("#" + this.CallImageId).show();
    //}

    //notifyUserAjaxCallFinished() {
    //    $("#" + this.CallImageId).hide();
    //}
}

