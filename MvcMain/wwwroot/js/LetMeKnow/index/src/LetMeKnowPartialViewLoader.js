"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AjaxCaller_1 = require("../../../Helper/AjaxCaller");
var LetMeKnowPartialViewLoader = (function () {
    function LetMeKnowPartialViewLoader(resultHandler, criteriaChange, letMeKnowCriteria, requestCode) {
        this.RequestIndexKey = "RequestIndex";
        this._currentRequestIndex = 0;
        this._url = "/LetMeKnow/GetLetMeKnowPartialView";
        this._previousCategoryId = 0;
        this._currentCategoryId = 0;
        this._resultHandler = resultHandler;
        this._ajaxCaller = new AjaxCaller_1.AjaxCaller(this._url, this, requestCode);
        this._criteriaChange = criteriaChange;
        this._letMeKnowCriteria = letMeKnowCriteria;
    }
    LetMeKnowPartialViewLoader.prototype.GetPartialViewFromServer = function (userInput, categoryId) {
        this._currentCategoryId = categoryId;
        this._currentRequestIndex++;
        userInput.ParametersDictionary[this.RequestIndexKey] = this._currentRequestIndex;
        this._ajaxCaller.Call(userInput);
    };
    LetMeKnowPartialViewLoader.prototype.OnResult = function (param, requestCode) {
        if (param.CustomDictionary[this.RequestIndexKey] == this._currentRequestIndex) {
            if (param.Success == true) {
                this._letMeKnowCriteria.UnBind(this._previousCategoryId);
                this._resultHandler.OnResult(param.ResponseData, requestCode);
                this._letMeKnowCriteria.Bind(this._currentCategoryId, this._criteriaChange);
                this._previousCategoryId = this._currentCategoryId;
            }
            else {
                this._resultHandler.OnError(param.Message + " , " + param.ErrorCode, requestCode);
            }
        }
    };
    LetMeKnowPartialViewLoader.prototype.OnError = function (message, requestCode) {
        this._resultHandler.OnError(message, requestCode);
    };
    LetMeKnowPartialViewLoader.prototype.AjaxCallFinished = function (requestCode) {
        this._resultHandler.AjaxCallFinished(requestCode);
    };
    LetMeKnowPartialViewLoader.prototype.AjaxCallStarted = function (requestCode) {
        this._resultHandler.AjaxCallStarted(requestCode);
    };
    return LetMeKnowPartialViewLoader;
}());
exports.LetMeKnowPartialViewLoader = LetMeKnowPartialViewLoader;
//# sourceMappingURL=LetMeKnowPartialViewLoader.js.map