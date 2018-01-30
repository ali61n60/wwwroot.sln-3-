"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AjaxCaller_1 = require("../../../Helper/AjaxCaller");
//TODO make count optional to user
var ServerCaller = /** @class */ (function () {
    function ServerCaller(resultHandler) {
        this.StartIndexKey = "StartIndex";
        this._initialStart = 1;
        this._start = 1;
        this.CountKey = "Count";
        this._count = 5;
        this.RequestIndexKey = "RequestIndex";
        this._currentRequestIndex = 0;
        this.NumberOfItemsKey = "numberOfItems";
        this._url = "/api/AdApi/GetAdvertisementCommon";
        this._resultHandler = resultHandler;
        this._ajaxCaller = new AjaxCaller_1.AjaxCaller(this._url, this);
    }
    ServerCaller.prototype.GetAdItemsFromServer = function (userInput) {
        this._currentRequestIndex++;
        userInput.ParametersDictionary[this.StartIndexKey] = this._start;
        userInput.ParametersDictionary[this.CountKey] = this._count;
        userInput.ParametersDictionary[this.RequestIndexKey] = this._currentRequestIndex;
        this._ajaxCaller.Call(userInput);
    }; //GetAdItemsFromServer
    ServerCaller.prototype.onErrorGetItemsFromServer = function (jqXHR, textStatus, errorThrown) {
        this._resultHandler.OnError(textStatus + " , " + errorThrown);
    };
    ServerCaller.prototype.ResetSearchParameters = function () {
        this._start = this._initialStart;
    };
    ServerCaller.prototype.OnResult = function (param) {
        //TODO check for undefined or null in msg and msg.customDictionary["RequestIndex"]
        if (param.CustomDictionary[this.RequestIndexKey] == this._currentRequestIndex) {
            if (param.Success == true) {
                this._start += parseInt(param.CustomDictionary[this.NumberOfItemsKey]);
                //TODO create AdvertisementCommon[] object from msg.responseData
                this._resultHandler.OnResult(param.ResponseData);
            } //if (msg.success == true)
            else {
                this._resultHandler.OnError(param.Message + " , " + param.ErrorCode);
            }
        }
    };
    ServerCaller.prototype.OnError = function (message) {
        this._resultHandler.OnError(message);
    };
    ServerCaller.prototype.AjaxCallFinished = function () {
        this._resultHandler.AjaxCallFinished();
    };
    ServerCaller.prototype.AjaxCallStarted = function () {
        this._resultHandler.AjaxCallStarted();
    };
    return ServerCaller;
}());
exports.ServerCaller = ServerCaller;
//# sourceMappingURL=ServerCaller.js.map