import {UserInput} from "./UserInput";
import {IResultHandler} from "./IResultHandler";

export class AjaxCaller<T> {

    private _numberOfPureServerCalls: number = 0;
    private readonly _url: string;
    private _resultHandler: IResultHandler<T>;

    constructor(url: string, resultHandler: IResultHandler<T>) {
        this._url = url;
        this._resultHandler = resultHandler;
    }

    public Call(userInput: UserInput): void {
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
    }

    private onSuccessGetItemsFromServer(msg: any, textStatus: string, jqXHR: JQueryXHR) {
        
        this._numberOfPureServerCalls--;
        if (this._numberOfPureServerCalls === 0) {
            this._resultHandler.AjaxCallFinished();
        }

        if (msg.CustomDictionary[this.RequestIndexKey] == this._currentRequestIndex) { //last call response
            if (msg.Success == true) {
                this._start += parseInt(msg.CustomDictionary[this.NumberOfItemsKey]);
                //TODO create AdvertisementCommon[] object from msg.responseData
                this._resultHandler.OnResult(msg.ResponseData);
            } //if (msg.success == true)
            else {
                this._resultHandler.OnError(msg.Message + " , " + msg.ErrorCode);
            }
        }
    }

    private onErrorGetItemsFromServer(jqXHR: JQueryXHR, textStatus: string, errorThrown: string) {
        this._numberOfPureServerCalls--;
        if (this._numberOfPureServerCalls === 0) {
            this._resultHandler.AjaxCallFinished();
        }

        this._resultHandler.OnError(textStatus + " , " + errorThrown);
    }


}