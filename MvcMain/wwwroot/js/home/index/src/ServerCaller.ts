import { SearchAdUserInput } from "./SearchAdUserInput";
export class ServerCaller {
    private _initialStart: number = 1;
    private _start: number = 1;
    private _count: number = 5;
    private _requestIndex: number = 0;
    private _previousRequestIndex: number = -1;
    private _isServerCalled: boolean = false;
    private _numberOfStartServerCallNotification: number = 0;

    public GetAdItemsFromServer(categoryId: number,
        minPrice: number,
        maxPrice: number,
        orderBy: string): void {
        let userInput = new SearchAdUserInput();
        if (this._isServerCalled && (this._previousRequestIndex === this._requestIndex)
        ) { //a call is sent but no answer yet
            return;
        } //if
        else {
            this._previousRequestIndex = this._requestIndex;
            this._isServerCalled = true;
        } //else

        userInput.StartIndex = this._start;
        userInput.Count = this._count;
        //TODO pass the object to the category selector element and let it fill the categoryId
        //OR call a method on category selector element to get categoryId
        userInput.CategoryId = categoryId; //100 for cars
        userInput.MinimumPrice = minPrice;
        userInput.MaximumPrice = maxPrice;
        userInput.OrderBy = orderBy;
        userInput.RequestIndex = this._requestIndex;

        //notifyUserAjaxCallStarted();
        let self = this;
        $.ajax({
            type: "POST", //GET or POST or PUT or DELETE verb
            url: "api/AdApi/GetAdvertisementCommon",
            data: JSON.stringify(userInput), //Data sent to server
            contentType: 'application/json', // content type sent to server
            success: function (arg) {
                self.onSuccessGetItemsFromServer(arg)
            }, //On Successfull service call
            error: self.onErrorGetItemsFromServer // When Service call fails
            // When Service call fails
        }); //.ajax
    } //GetAdItemsFromServer

    private onSuccessGetItemsFromServer(msg) {
        //notifyUserAjaxCallFinished();
        if (msg.success == true) {
            if (msg.customDictionary["RequestIndex"] == this._requestIndex) {
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
            } //end if
        } //end if
        else {
            //showErrorMessage(msg.Message + " , " + msg.ErrorCode);
        }
        this._isServerCalled = false;
        this._requestIndex++;
    } //end OnSuccessGetTimeFromServer

    private onErrorGetItemsFromServer(XMLHttpRequest, textStatus, errorThrown) {
        this._isServerCalled = false;
        this._requestIndex++;
        //notifyUserAjaxCallFinished();
        //showErrorMessage(textStatus + " , " + errorThrown);
    } //end OnErrorGetTimeFromServer

    public ResetSearchParameters(): void {
        this._start = this._initialStart;
    }
}

