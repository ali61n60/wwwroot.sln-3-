"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LetMeKnowServerCaller = (function () {
    function LetMeKnowServerCaller() {
        //TODO call server and send userinput fro new ad
        //get result and show to user
        this._url = "/api/LetMeKnowApi/AddNewLetMeKnowRecord";
    }
    LetMeKnowServerCaller.prototype.SaveAd = function (userInput) {
        var _this = this;
        $.ajax({
            type: "POST",
            url: this._url,
            data: JSON.stringify(userInput.ParametersDictionary),
            contentType: 'application/json',
            success: function (msg, textStatus, jqXHR) { return _this.onSuccessGetItemsFromServer(msg, textStatus, jqXHR); },
            error: function (jqXHR, textStatus, errorThrown) { return _this.onErrorGetItemsFromServer(jqXHR, textStatus, errorThrown); } // When Service call fails
        }); //.ajax
    };
    LetMeKnowServerCaller.prototype.onSuccessGetItemsFromServer = function (msg, textStatus, jqXHR) {
        //TODO redirect user to a new page
        if (msg.Success == true) {
            document.location.replace("/NewAd/Confirm");
        }
    };
    LetMeKnowServerCaller.prototype.onErrorGetItemsFromServer = function (jqXHR, textStatus, errorThrown) {
        //TODO inform error to user
    };
    return LetMeKnowServerCaller;
}());
exports.LetMeKnowServerCaller = LetMeKnowServerCaller;
//# sourceMappingURL=LetMeKnowServerCaller.js.map