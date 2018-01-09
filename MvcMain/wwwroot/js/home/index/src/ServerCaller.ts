import { UserInput  } from "../../../Helper/UserInput";
import {IResultHandler} from "../../../Helper/IResultHandler";
import {AdvertisementCommon} from "../../../Models/AdvertisementCommon";


//TODO make count optional to user
//TODO instead of adding new ads to the page here call a method on index class to add it by defining an interface in the index class 
export class ServerCaller {
    private readonly StartIndexKey: string ="StartIndex";
    private readonly _initialStart: number = 1;
    private _start: number = 1;

    private readonly CountKey: string ="Count";
    private _count: number = 5;

    private readonly RequestIndexKey: string ="RequestIndex";
    private _currentRequestIndex: number = 0;
    private readonly _initialRequestIndex: number = 0;

    private readonly NumberOfItemsKey: string ="numberOfItems";

    private readonly CallImageId: string ="serverCalledImage";
    private _isServerCalled: boolean = false;
    private _numberOfStartServerCallNotification: number = 0;
    private readonly _url: string = "api/AdApi/GetAdvertisementCommon";

    private _resultHandler: IResultHandler<AdvertisementCommon[]>;
    

    public GetAdItemsFromServer(userInput: UserInput, resultHandler: IResultHandler<AdvertisementCommon[]>): void {
        this._resultHandler = resultHandler;
        userInput.ParametersDictionary[this.StartIndexKey] = this._start;
        userInput.ParametersDictionary[this.CountKey] = this._count;
        this._currentRequestIndex++;
        userInput.ParametersDictionary[this.RequestIndexKey] = this._currentRequestIndex;
        
        $.ajax({
            type: "POST", //GET or POST or PUT or DELETE verb
            url: this._url,
            data:JSON.stringify(userInput.ParametersDictionary), //Data sent to server
            contentType: 'application/json', // content type sent to server
            success: (msg,textStatus,jqXHR)=> this.onSuccessGetItemsFromServer(msg,textStatus,jqXHR), //On Successfull service call
            error: (jqXHR, textStatus, errorThrown) => this.onErrorGetItemsFromServer(jqXHR, textStatus, errorThrown) // When Service call fails
        }); //.ajax
        this._isServerCalled = true;
        this.notifyUserAjaxCallStarted();
    } //GetAdItemsFromServer

     
    private onSuccessGetItemsFromServer(msg:any,textStatus:string, jqXHR:JQueryXHR) {
        //TODO check for undefined or null in msg and msg.customDictionary["RequestIndex"]
        if (this._isServerCalled) {
            if (msg.customDictionary[this.RequestIndexKey] == this._currentRequestIndex) { //last call response
                this._isServerCalled = false;
                this.notifyUserAjaxCallFinished();
                if (msg.success == true) {
                    this._start += parseInt(msg.customDictionary[this.NumberOfItemsKey]);
                    //TODO create AdvertisementCommon[] object from msg.responseData
                    this._resultHandler.OnResultOk(msg.responseData);
                } //if (msg.success == true)
                else {
                    this._resultHandler.OnResultError(msg.Message + " , " + msg.ErrorCode);
                }
            } 
        }
    } 
    
    private onErrorGetItemsFromServer(jqXHR:JQueryXHR, textStatus:string, errorThrown:string) {
        this._isServerCalled = false;
        this.notifyUserAjaxCallFinished();
        this._resultHandler.OnResultError(textStatus + " , " + errorThrown);
        //showErrorMessage(textStatus + " , " + errorThrown);
    } 

    public ResetSearchParameters(): void {
        this._start = this._initialStart;
    }

    private notifyUserAjaxCallStarted() {
        $("#"+this.CallImageId).show();
    }

    notifyUserAjaxCallFinished() {
        $("#" + this.CallImageId).hide();
    }
}

