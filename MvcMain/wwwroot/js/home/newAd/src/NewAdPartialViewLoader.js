"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AjaxCaller_1 = require("../../../Helper/AjaxCaller");
var NewAdPartialViewLoader = (function () {
    // partialViewDivId: string, newAdCriteriaChange: ICriteriaChange, newAdCriteria: NewAdCriteria)
    //this._partialViewDivId = partialViewDivId;
    function NewAdPartialViewLoader(resultHandler, newAdCriteriaChange, newAdCriteria, requestCode) {
        this.RequestIndexKey = "RequestIndex";
        this._currentRequestIndex = 0;
        this._url = "/NewAd/GetNewAdPartialView";
        this._previousCategoryId = 0;
        this._currentCategoryId = 0;
        this._resultHandler = resultHandler;
        this._newAdCriteriaChange = newAdCriteriaChange;
        this._newAdCriteria = newAdCriteria;
        this._ajaxCaller = new AjaxCaller_1.AjaxCaller(this._url, this, requestCode);
    }
    NewAdPartialViewLoader.prototype.GetPartialViewFromServer = function (userInput, categoryId) {
        this._currentCategoryId = categoryId;
        this._ajaxCaller.Call(userInput);
    };
    NewAdPartialViewLoader.prototype.onSuccessGetItemsFromServer = function (msg, textStatus, jqXHR) {
    }; //onSuccessGetTimeFromServer
    NewAdPartialViewLoader.prototype.onErrorGetItemsFromServer = function (jqXHR, textStatus, errorThrown) {
    }; //onErrorGetTimeFromServer
    NewAdPartialViewLoader.prototype.OnResult = function (param, requestCode) {
        if (param.CustomDictionary[this.RequestIndexKey] == this._currentRequestIndex) {
            if (param.Success == true) {
                this._newAdCriteria.UnBind(this._previousCategoryId);
                this._resultHandler.OnResult(param.ResponseData, requestCode);
                this._newAdCriteria.Bind(this._currentCategoryId, this._newAdCriteriaChange);
                this._previousCategoryId = this._currentCategoryId;
            }
            else {
                this._resultHandler.OnError(param.Message + " , " + param.ErrorCode, requestCode);
            }
        }
    };
    NewAdPartialViewLoader.prototype.OnError = function (message, requestCode) {
        this._resultHandler.OnError(message, requestCode);
    };
    NewAdPartialViewLoader.prototype.AjaxCallFinished = function (requestCode) {
        this._resultHandler.AjaxCallFinished(requestCode);
    };
    NewAdPartialViewLoader.prototype.AjaxCallStarted = function (requestCode) {
        this._resultHandler.AjaxCallStarted(requestCode);
    };
    return NewAdPartialViewLoader;
}());
exports.NewAdPartialViewLoader = NewAdPartialViewLoader;
//TODO refactor this
var PartialViewServerCallParameters = (function () {
    function PartialViewServerCallParameters() {
    }
    return PartialViewServerCallParameters;
}());
exports.PartialViewServerCallParameters = PartialViewServerCallParameters;
//# sourceMappingURL=NewAdPartialViewLoader.js.map