import { SearchAdUserInput } from "./SearchAdUserInput";
export class ServerCaller {
    private readonly  _initialStart: number = 1;
    private _start: number = 1;
    private _count: number = 5;
    private _currentRequestIndex: number = 0;
    private readonly  _initialRequestIndex: number = 0;
    private _isServerCalled: boolean = false;
    private _numberOfStartServerCallNotification: number = 0;
    private _url: string = "api/AdApi/GetAdvertisementCommon";

    public GetAdItemsFromServer(userInput: SearchAdUserInput): void {
        userInput.SearchParameters.StartIndex = this._start;
        userInput.SearchParameters.Count = this._count;
        this._currentRequestIndex++;
        userInput.SearchParameters.RequestIndex = this._currentRequestIndex;

        
        
        //if (this._isServerCalled && (this._previousRequestIndex === this._requestIndex)
        //) { //a call is sent but no answer yet
          //  return;
        //} //if
        //else {
          //  this._previousRequestIndex = this._requestIndex;
           // this._isServerCalled = true;
        //} //else
        
        //notifyUserAjaxCallStarted();
       
        $.ajax({
            type: "POST", //GET or POST or PUT or DELETE verb
            url: this._url,
            data:JSON.stringify(userInput.SearchParameters), //Data sent to server
            contentType: 'application/json', // content type sent to server
            success: (msg,textStatus,jqXHR)=> this.onSuccessGetItemsFromServer(msg,textStatus,jqXHR), //On Successfull service call
            error: (jqXHR, textStatus, errorThrown) => this.onErrorGetItemsFromServer(jqXHR, textStatus, errorThrown) // When Service call fails
        }); //.ajax
        this._isServerCalled = true;
    } //GetAdItemsFromServer

     
    private onSuccessGetItemsFromServer(msg:any,textStatus:string, jqXHR:JQueryXHR) {
        //notifyUserAjaxCallFinished();
        //TODO check for undefined or null in msg and msg.customDictionary["RequestIndex"]
        if (msg.customDictionary["RequestIndex"] == this._currentRequestIndex) { //last call response
            this._isServerCalled = false;
            console.log("server response request index:" +
                msg.customDictionary["RequestIndex"] +
                ", client current request index:" + this._currentRequestIndex);
            if (msg.success == true) {
                console.log("processing request index:" + this._currentRequestIndex);
                this._start += parseInt(msg.customDictionary["numberOfItems"]);
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
                    $("#adPlaceHolder").append(html);
                } //end for
            } //if (msg.success == true)
            else {
                //showErrorMessage(msg.Message + " , " + msg.ErrorCode);
            }
        }//if (msg.customDictionary["RequestIndex"]
    } //end OnSuccessGetTimeFromServer

    
    private onErrorGetItemsFromServer(jqXHR:JQueryXHR, textStatus:string, errorThrown:string) {
        this._isServerCalled = false;
        this._currentRequestIndex++;
        //notifyUserAjaxCallFinished();
        //showErrorMessage(textStatus + " , " + errorThrown);
    } //end OnErrorGetTimeFromServer

    public ResetSearchParameters(): void {
        this._start = this._initialStart;
    }
}

