"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ServerCaller = (function () {
    function ServerCaller() {
        this._initialStart = 1;
        this._start = 1;
        this._count = 5;
        this._currentRequestIndex = 0;
        this._initialRequestIndex = 0;
        this._isServerCalled = false;
        this._numberOfStartServerCallNotification = 0;
        this._url = "api/AdApi/GetAdvertisementCommon";
    }
    ServerCaller.prototype.GetAdItemsFromServer = function (userInput) {
        var _this = this;
        userInput.SearchParameters.StartIndex = this._start;
        userInput.SearchParameters.Count = this._count;
        this._currentRequestIndex++;
        userInput.SearchParameters.RequestIndex = this._currentRequestIndex;
        $.ajax({
            type: "POST",
            url: this._url,
            data: JSON.stringify(userInput.SearchParameters),
            contentType: 'application/json',
            success: function (msg, textStatus, jqXHR) { return _this.onSuccessGetItemsFromServer(msg, textStatus, jqXHR); },
            error: function (jqXHR, textStatus, errorThrown) { return _this.onErrorGetItemsFromServer(jqXHR, textStatus, errorThrown); } // When Service call fails
        }); //.ajax
        this._isServerCalled = true;
        this.notifyUserAjaxCallStarted();
    }; //GetAdItemsFromServer
    ServerCaller.prototype.onSuccessGetItemsFromServer = function (msg, textStatus, jqXHR) {
        //notifyUserAjaxCallFinished();
        //TODO check for undefined or null in msg and msg.customDictionary["RequestIndex"]
        console.log("server response request index:" +
            msg.customDictionary["RequestIndex"] +
            ", client current request index:" + this._currentRequestIndex);
        if (this._isServerCalled) {
            if (msg.customDictionary["RequestIndex"] == this._currentRequestIndex) {
                this._isServerCalled = false;
                this.notifyUserAjaxCallFinished();
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
                            adPrice: msg.responseData[i].advertisementPrice.price,
                            AdvertisementTitle: msg.responseData[i].advertisementTitle,
                            AdvertisementStatus: msg.responseData[i].advertisementStatus
                            //adDate: msg.ResponseData[i].AdTime
                        }; //end data
                        var html = Mustache.to_html(template, data);
                        $("#adPlaceHolder").append(html);
                    } //end for
                } //if (msg.success == true)
                else {
                    //TODO show error message to user
                    //showErrorMessage(msg.Message + " , " + msg.ErrorCode);
                }
            } //if (msg.customDictionary["RequestIndex"]
        } //if (this._isServerCalled)
    }; //end OnSuccessGetTimeFromServer
    ServerCaller.prototype.onErrorGetItemsFromServer = function (jqXHR, textStatus, errorThrown) {
        this._isServerCalled = false;
        this.notifyUserAjaxCallFinished();
        //showErrorMessage(textStatus + " , " + errorThrown);
    }; //end OnErrorGetTimeFromServer
    ServerCaller.prototype.ResetSearchParameters = function () {
        this._start = this._initialStart;
    };
    ServerCaller.prototype.notifyUserAjaxCallStarted = function () {
        console.log("Started Ajax Call");
        $("#serverCalledImage").show();
    };
    ServerCaller.prototype.notifyUserAjaxCallFinished = function () {
        console.log("Finished Ajax Call");
        $("#serverCalledImage").hide();
    };
    return ServerCaller;
}());
exports.ServerCaller = ServerCaller;
//# sourceMappingURL=ServerCaller.js.map