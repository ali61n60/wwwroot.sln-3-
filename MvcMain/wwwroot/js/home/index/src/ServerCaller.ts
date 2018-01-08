import { UserInput  } from "../../../Helper/UserInput";
//TODO make count optional to user
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
    private readonly  _url: string = "api/AdApi/GetAdvertisementCommon";
    private readonly  _adPlaceHolderDivId: string ="adPlaceHolder";

    public GetAdItemsFromServer(userInput: UserInput): void {
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
                    var template = $('#singleAdItem').html();
                    var data;
                    for (var i = 0; i < msg.responseData.length; i++) {
                        var adImage = null;
                        if (msg.responseData[i].advertisementImages[0] != null) {
                            adImage = "data:image/jpg;base64," + msg.responseData[i].advertisementImages[0];
                        } //end if
                        data = {
                            AdvertisementId: msg.responseData[i].advertisementId,
                            AdvertisementCategoryId: msg.responseData[i].advertisementCategoryId,
                            AdvertisementCategory: msg.responseData[i].advertisementCategory,
                            adImage: adImage,
                            adPrice: msg.responseData[i].advertisementPrice.price, //todo check the price type
                            AdvertisementTitle: msg.responseData[i].advertisementTitle,
                            AdvertisementStatus: msg.responseData[i].advertisementStatus
                            //adDate: msg.ResponseData[i].AdTime
                        } //end data

                        var html = Mustache.to_html(template, data);
                        $("#" +this._adPlaceHolderDivId).append(html);
                    } //end for
                } //if (msg.success == true)
                else {
                    //TODO show error message to user
                    //showErrorMessage(msg.Message + " , " + msg.ErrorCode);
                }
            } //if (msg.customDictionary["RequestIndex"]
        } //if (this._isServerCalled)
    } 

    
    private onErrorGetItemsFromServer(jqXHR:JQueryXHR, textStatus:string, errorThrown:string) {
        this._isServerCalled = false;
        this.notifyUserAjaxCallFinished();
        //showErrorMessage(textStatus + " , " + errorThrown);
    } 

    public ResetSearchParameters(): void {
        this._start = this._initialStart;
    }

    private notifyUserAjaxCallStarted() {
        console.log("Started Ajax Call");
        $("#"+this.CallImageId).show();
    }

    notifyUserAjaxCallFinished() {
        console.log("Finished Ajax Call");
        $("#" + this.CallImageId).hide();
    }
}

