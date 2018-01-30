import {UserInput} from "./UserInput";
import {IResultHandler} from "./IResultHandler";

export class AjaxCaller {

    private _numberOfPureServerCalls: number = 0;
    private readonly _url: string;
    private readonly  _resultHandler: IResultHandler;
    private readonly _requestCode:number;

    constructor(url: string, resultHandler: IResultHandler,requestCode:number) {
        this._url = url;
        this._resultHandler = resultHandler;
        this._requestCode = requestCode;
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
        this._resultHandler.AjaxCallStarted(this._requestCode);
    }

    private onSuccessGetItemsFromServer(msg: any, textStatus: string, jqXHR: JQueryXHR) {

        this._numberOfPureServerCalls--;
        if (this._numberOfPureServerCalls === 0) {
            this._resultHandler.AjaxCallFinished(this._requestCode);
        }
        this._resultHandler.OnResult(msg, this._requestCode);
    }

    private onErrorGetItemsFromServer(jqXHR: JQueryXHR, textStatus: string, errorThrown: string) {
        this._numberOfPureServerCalls--;
        if (this._numberOfPureServerCalls === 0) {
            this._resultHandler.AjaxCallFinished(this._requestCode);
        }

        this._resultHandler.OnError(textStatus + " , " + errorThrown, this._requestCode);
    }
}