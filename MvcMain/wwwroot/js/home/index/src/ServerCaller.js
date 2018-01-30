"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//TODO make count optional to user
//TODO instead of adding new ads to the page here call a method on index class to add it by defining an interface in the index class 
var ServerCaller = (function () {
    function ServerCaller(resultHandler) {
        this.StartIndexKey = "StartIndex";
        this._initialStart = 1;
        this._start = 1;
        this.CountKey = "Count";
        this._count = 5;
        this.RequestIndexKey = "RequestIndex";
        this._currentRequestIndex = 0;
        this._numberOfPureServerCalls = 0;
        this.NumberOfItemsKey = "numberOfItems";
        this._url = "/api/AdApi/GetAdvertisementCommon";
        this._resultHandler = resultHandler;
    }
    ServerCaller.prototype.GetAdItemsFromServer = function (userInput) {
        var _this = this;
        this._currentRequestIndex++;
        userInput.ParametersDictionary[this.StartIndexKey] = this._start;
        userInput.ParametersDictionary[this.CountKey] = this._count;
        userInput.ParametersDictionary[this.RequestIndexKey] = this._currentRequestIndex;
        $.ajax({
            type: "POST",
            url: this._url,
            data: JSON.stringify(userInput.ParametersDictionary),
            contentType: 'application/json',
            success: function (msg, textStatus, jqXHR) { return _this.onSuccessGetItemsFromServer(msg, textStatus, jqXHR); },
            error: function (jqXHR, textStatus, errorThrown) { return _this.onErrorGetItemsFromServer(jqXHR, textStatus, errorThrown); } // When Service call fails
        }); //.ajax
        this._numberOfPureServerCalls++;
        this._resultHandler.AjaxCallStarted();
    }; //GetAdItemsFromServer
    ServerCaller.prototype.onSuccessGetItemsFromServer = function (msg, textStatus, jqXHR) {
        //TODO check for undefined or null in msg and msg.customDictionary["RequestIndex"]
        this._numberOfPureServerCalls--;
        if (this._numberOfPureServerCalls === 0) {
            this._resultHandler.AjaxCallFinished();
        }
        if (msg.CustomDictionary[this.RequestIndexKey] == this._currentRequestIndex) {
            if (msg.Success == true) {
                this._start += parseInt(msg.CustomDictionary[this.NumberOfItemsKey]);
                //TODO create AdvertisementCommon[] object from msg.responseData
                this._resultHandler.OnResultOk(msg.ResponseData);
            } //if (msg.success == true)
            else {
                this._resultHandler.OnResultError(msg.Message + " , " + msg.ErrorCode);
            }
        }
    };
    ServerCaller.prototype.onErrorGetItemsFromServer = function (jqXHR, textStatus, errorThrown) {
        this._numberOfPureServerCalls--;
        if (this._numberOfPureServerCalls === 0) {
            this._resultHandler.AjaxCallFinished();
        }
        this._resultHandler.OnResultError(textStatus + " , " + errorThrown);
    };
    ServerCaller.prototype.ResetSearchParameters = function () {
        this._start = this._initialStart;
    };
    return ServerCaller;
}());
exports.ServerCaller = ServerCaller;
//# sourceMappingURL=ServerCaller.js.map