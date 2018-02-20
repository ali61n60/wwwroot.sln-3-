"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AjaxCaller_1 = require("../../../Helper/AjaxCaller");
var LetMeKnowServerCaller = /** @class */ (function () {
    function LetMeKnowServerCaller(resultHandler, requestCode) {
        this.RequestIndexKey = "RequestIndex";
        this._currentRequestIndex = 0;
        this._url = "/api/LetMeKnowApi/AddNewLetMeKnowRecord";
        this._resultHandler = resultHandler;
        this._ajaxCaller = new AjaxCaller_1.AjaxCaller(this._url, this, requestCode);
    }
    LetMeKnowServerCaller.prototype.SaveAd = function (userInput) {
        this._currentRequestIndex++;
        userInput.ParametersDictionary[this.RequestIndexKey] = this._currentRequestIndex;
        this._ajaxCaller.Call(userInput);
    };
    LetMeKnowServerCaller.prototype.OnResult = function (param, requestCode) {
        if (param.CustomDictionary[this.RequestIndexKey] == this._currentRequestIndex) {
            if (param.Success == true) {
                this._resultHandler.OnResult(param.ResponseData, requestCode);
            }
            else {
                this._resultHandler.OnError(param.Message, requestCode);
            }
        }
    };
    LetMeKnowServerCaller.prototype.OnError = function (message, requestCode) {
        this._resultHandler.OnError(message, requestCode);
    };
    LetMeKnowServerCaller.prototype.AjaxCallFinished = function (requestCode) {
        this._resultHandler.AjaxCallFinished(requestCode);
    };
    LetMeKnowServerCaller.prototype.AjaxCallStarted = function (requestCode) {
        this._resultHandler.AjaxCallStarted(requestCode);
    };
    return LetMeKnowServerCaller;
}());
exports.LetMeKnowServerCaller = LetMeKnowServerCaller;
//# sourceMappingURL=LetMeKnowServerCaller.js.map