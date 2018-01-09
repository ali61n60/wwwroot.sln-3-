"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//TODO make count optional to user
//TODO instead of adding new ads to the page here call a method on index class to add it by defining an interface in the index class 
var ServerCaller = (function () {
    function ServerCaller() {
        this.StartIndexKey = "StartIndex";
        this._initialStart = 1;
        this._start = 1;
        this.CountKey = "Count";
        this._count = 5;
        this.RequestIndexKey = "RequestIndex";
        this._currentRequestIndex = 0;
        this._initialRequestIndex = 0;
        this.NumberOfItemsKey = "numberOfItems";
        this.CallImageId = "serverCalledImage";
        this._isServerCalled = false;
        this._numberOfStartServerCallNotification = 0;
        this._url = "api/AdApi/GetAdvertisementCommon";
        this._adPlaceHolderDivId = "adPlaceHolder";
    }
    ServerCaller.prototype.GetAdItemsFromServer = function (userInput) {
        var _this = this;
        userInput.ParametersDictionary[this.StartIndexKey] = this._start;
        userInput.ParametersDictionary[this.CountKey] = this._count;
        this._currentRequestIndex++;
        userInput.ParametersDictionary[this.RequestIndexKey] = this._currentRequestIndex;
        $.ajax({
            type: "POST",
            url: this._url,
            data: JSON.stringify(userInput.ParametersDictionary),
            contentType: 'application/json',
            success: function (msg, textStatus, jqXHR) { return _this.onSuccessGetItemsFromServer(msg, textStatus, jqXHR); },
            error: function (jqXHR, textStatus, errorThrown) { return _this.onErrorGetItemsFromServer(jqXHR, textStatus, errorThrown); } // When Service call fails
        }); //.ajax
        this._isServerCalled = true;
        this.notifyUserAjaxCallStarted();
    }; //GetAdItemsFromServer
    ServerCaller.prototype.onSuccessGetItemsFromServer = function (msg, textStatus, jqXHR) {
        //TODO check for undefined or null in msg and msg.customDictionary["RequestIndex"]
        if (this._isServerCalled) {
            if (msg.customDictionary[this.RequestIndexKey] == this._currentRequestIndex) {
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
                            adPrice: msg.responseData[i].advertisementPrice.price,
                            AdvertisementTitle: msg.responseData[i].advertisementTitle,
                            AdvertisementStatus: msg.responseData[i].advertisementStatus
                            //adDate: msg.ResponseData[i].AdTime
                        }; //end data
                        var html = Mustache.to_html(template, data);
                        $("#" + this._adPlaceHolderDivId).append(html);
                    } //end for
                } //if (msg.success == true)
                else {
                    //TODO show error message to user
                    //showErrorMessage(msg.Message + " , " + msg.ErrorCode);
                }
            } //if (msg.customDictionary["RequestIndex"]
        } //if (this._isServerCalled)
    };
    ServerCaller.prototype.onErrorGetItemsFromServer = function (jqXHR, textStatus, errorThrown) {
        this._isServerCalled = false;
        this.notifyUserAjaxCallFinished();
        //showErrorMessage(textStatus + " , " + errorThrown);
    };
    ServerCaller.prototype.ResetSearchParameters = function () {
        this._start = this._initialStart;
    };
    ServerCaller.prototype.notifyUserAjaxCallStarted = function () {
        console.log("Started Ajax Call");
        $("#" + this.CallImageId).show();
    };
    ServerCaller.prototype.notifyUserAjaxCallFinished = function () {
        console.log("Finished Ajax Call");
        $("#" + this.CallImageId).hide();
    };
    return ServerCaller;
}());
exports.ServerCaller = ServerCaller;
//# sourceMappingURL=ServerCaller.js.map