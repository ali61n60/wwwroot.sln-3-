"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PartialViewCategorySpecific_1 = require("../../newAd/src/PartialViewCategorySpecific");
var SearchCriteriaLoader = /** @class */ (function () {
    function SearchCriteriaLoader(parentDivId, indexObject) {
        this._url = "Home/GetSearchCriteriaView";
        this._previousCategoryId = 0;
        this._currentCategoryId = 0;
        this._parentDivId = parentDivId;
        this._indexObject = indexObject;
    }
    SearchCriteriaLoader.prototype.GetSearchCriteriaViewFromServer = function (categoryId) {
        var _this = this;
        //TODO get view from server and add it to page
        this._currentCategoryId = categoryId;
        var callParams = new PartialViewCategorySpecific_1.PartialViewServerCallParameters();
        callParams.CategoryId = categoryId;
        $.ajax({
            type: "GET",
            url: this._url,
            data: callParams,
            //contentType: 'application/json', // content type sent to server
            success: function (msg, textStatus, jqXHR) { return _this.onSuccessGetItemsFromServer(msg, textStatus, jqXHR); },
            error: function (jqXHR, textStatus, errorThrown) { return _this.onErrorGetItemsFromServer(jqXHR, textStatus, errorThrown); } // When Service call fails
        }); //.ajax
    };
    SearchCriteriaLoader.prototype.onSuccessGetItemsFromServer = function (msg, textStatus, jqXHR) {
        this.unBindEvents();
        $("#" + this._parentDivId).children().remove();
        $("#" + this._parentDivId).html(msg);
        this.bindEvents();
    }; //onSuccessGetTimeFromServer
    SearchCriteriaLoader.prototype.onErrorGetItemsFromServer = function (jqXHR, textStatus, errorThrown) {
        alert(errorThrown);
    }; //onErrorGetTimeFromServer
    SearchCriteriaLoader.prototype.bindEvents = function () {
        var _this = this;
        //use currentCategoryId
        switch (this._currentCategoryId) {
            case 100:
                $("#brand").on("change", function (event) {
                    console.log($(event.currentTarget).find("option:selected").text());
                    _this._indexObject.CustomSearchCriteriChanged();
                });
            default:
        }
        console.log("binding " + this._currentCategoryId);
        this._previousCategoryId = this._currentCategoryId;
    };
    SearchCriteriaLoader.prototype.unBindEvents = function () {
        //use previouscategoryId
        switch (this._previousCategoryId) {
            case 100:
                $("#brand").off("change");
            default:
        }
        console.log("UnBinding " + this._previousCategoryId);
    };
    return SearchCriteriaLoader;
}());
exports.SearchCriteriaLoader = SearchCriteriaLoader;
//# sourceMappingURL=SearchCriteriaLoader.js.map