"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AjaxCaller_1 = require("../../../Helper/AjaxCaller");
var NewAdServerCaller = /** @class */ (function () {
    function NewAdServerCaller(resultHandler, requestCode) {
        this.RequestIndexKey = "RequestIndex";
        this._currentRequestIndex = 0;
        this._url = "/api/AdApi/AddAdvertisement";
        this._resultHandler = resultHandler;
        this._ajaxCaller = new AjaxCaller_1.AjaxCaller(this._url, this, requestCode);
    }
    NewAdServerCaller.prototype.SaveAd = function (userInput) {
        this._currentRequestIndex++;
        userInput.ParametersDictionary[this.RequestIndexKey] = this._currentRequestIndex;
        this._ajaxCaller.Call(userInput);
    };
    NewAdServerCaller.prototype.onSuccessGetItemsFromServer = function (msg, textStatus, jqXHR) {
    };
    NewAdServerCaller.prototype.OnResult = function (param, requestCode) {
        if (param.Success == true) {
            this._resultHandler.OnResult(param, requestCode);
        }
        else {
            this._resultHandler.OnError(param.Message + " , " + param.ErrorCode, requestCode);
        }
    };
    NewAdServerCaller.prototype.OnError = function (message, requestCode) {
        this._resultHandler.OnError(message, requestCode);
    };
    NewAdServerCaller.prototype.AjaxCallFinished = function (requestCode) {
        this._resultHandler.AjaxCallFinished(requestCode);
    };
    NewAdServerCaller.prototype.AjaxCallStarted = function (requestCode) {
        this._resultHandler.AjaxCallStarted(requestCode);
    };
    return NewAdServerCaller;
}());
exports.NewAdServerCaller = NewAdServerCaller;
//# sourceMappingURL=NewAdServerCaller.js.map