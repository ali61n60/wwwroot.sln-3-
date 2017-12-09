"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SearchAdUserInput_1 = require("./SearchAdUserInput");
var ServerCaller = /** @class */ (function () {
    function ServerCaller() {
        this._initialStart = 1;
        this._start = 1;
        this._count = 5;
        this._requestIndex = 0;
        this._previousRequestIndex = -1;
        this._isServerCalled = false;
        this._numberOfStartServerCallNotification = 0;
    }
    ServerCaller.prototype.GetAdItemsFromServer = function (categoryId, minPrice, maxPrice, orderBy) {
        var userInput = new SearchAdUserInput_1.SearchAdUserInput();
        if (this._isServerCalled && (this._previousRequestIndex === this._requestIndex)) {
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
        var self = this;
        $.ajax({
            type: "POST",
            url: "api/AdApi/GetAdvertisementCommon",
            data: JSON.stringify(userInput),
            contentType: 'application/json',
            success: function (arg) {
                self.onSuccessGetItemsFromServer(arg);
            },
            error: self.onErrorGetItemsFromServer // When Service call fails
            // When Service call fails
        }); //.ajax
    }; //GetAdItemsFromServer
    ServerCaller.prototype.onSuccessGetItemsFromServer = function (msg) {
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
                        adPrice: msg.responseData[i].advertisementPrice.price,
                        AdvertisementTitle: msg.responseData[i].advertisementTitle,
                        AdvertisementStatus: msg.responseData[i].advertisementStatus
                        //adDate: msg.ResponseData[i].AdTime
                    }; //end data
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
    }; //end OnSuccessGetTimeFromServer
    ServerCaller.prototype.onErrorGetItemsFromServer = function (XMLHttpRequest, textStatus, errorThrown) {
        this._isServerCalled = false;
        this._requestIndex++;
        //notifyUserAjaxCallFinished();
        //showErrorMessage(textStatus + " , " + errorThrown);
    }; //end OnErrorGetTimeFromServer
    return ServerCaller;
}());
exports.ServerCaller = ServerCaller;
//# sourceMappingURL=ServerCaller.js.map