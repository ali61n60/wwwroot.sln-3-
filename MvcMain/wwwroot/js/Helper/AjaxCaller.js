"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AjaxCaller = /** @class */ (function () {
    function AjaxCaller(url, resultHandler, requestCode) {
        this._numberOfPureServerCalls = 0;
        this._url = url;
        this._resultHandler = resultHandler;
        this._requestCode = requestCode;
    }
    AjaxCaller.prototype.Call = function (userInput) {
        var _this = this;
        $.ajax({
            type: "POST",
            url: this._url,
            data: JSON.stringify(userInput.ParametersDictionary),
            contentType: 'application/json',
            success: function (msg, textStatus, jqXHR) { return _this.onSuccessGetItemsFromServer(msg, textStatus, jqXHR); },
            error: function (jqXHR, textStatus, errorThrown) { return _this.onErrorGetItemsFromServer(jqXHR, textStatus, errorThrown); } // When Service call fails
        }); //.ajax
        this._numberOfPureServerCalls++;
        this._resultHandler.AjaxCallStarted(this._requestCode);
    };
    AjaxCaller.prototype.onSuccessGetItemsFromServer = function (msg, textStatus, jqXHR) {
        this._numberOfPureServerCalls--;
        if (this._numberOfPureServerCalls === 0) {
            this._resultHandler.AjaxCallFinished(this._requestCode);
        }
        this._resultHandler.OnResult(msg, this._requestCode);
    };
    AjaxCaller.prototype.onErrorGetItemsFromServer = function (jqXHR, textStatus, errorThrown) {
        this._numberOfPureServerCalls--;
        if (this._numberOfPureServerCalls === 0) {
            this._resultHandler.AjaxCallFinished(this._requestCode);
        }
        this._resultHandler.OnError(textStatus + " , " + errorThrown, this._requestCode);
    };
    return AjaxCaller;
}());
exports.AjaxCaller = AjaxCaller;
//# sourceMappingURL=AjaxCaller.js.map