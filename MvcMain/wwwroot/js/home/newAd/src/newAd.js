"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CategorySelectionNewAd_1 = require("../../../Components/Category/NewAd/CategorySelectionNewAd");
var PartialViewCategorySpecific_1 = require("./PartialViewCategorySpecific");
var NewAd = /** @class */ (function () {
    function NewAd(categorySelectorParentDivId, allCategoriesId, categorySpecificPartialViewId) {
        this._categorySelectorParentDivId = categorySelectorParentDivId;
        this._allCategoriesId = allCategoriesId;
        this._categorySpecificPartialViewId = categorySpecificPartialViewId;
        this.initPage();
        this.initEventHandlers();
    }
    NewAd.prototype.initPage = function () {
        this.initNewAdCategory();
        this._partialView = new PartialViewCategorySpecific_1.PartialViewCategorySpecific(this._categorySpecificPartialViewId);
    };
    NewAd.prototype.initNewAdCategory = function () {
        var allCategoriesString = $("#" + this._allCategoriesId).val().toString();
        var allCategories = $.parseJSON(allCategoriesString);
        this._categorySelectionNewAd = new CategorySelectionNewAd_1.CategorySelectionNewAd(this._categorySelectorParentDivId, allCategories);
        this._categorySelectionNewAd.CreateFirstLevel();
    };
    NewAd.prototype.initEventHandlers = function () {
        var _this = this;
        this._categorySelectionNewAd.SelectedCategoryChangedEvent.Subscribe(function (sender, args) {
            if (!_this._categorySelectionNewAd.SelectedCategoryHasChildren()) {
                //TODO load partial view for that category id from server and notify user 
                _this._partialView.GetPartialViewFromServer(args);
            }
        });
    };
    return NewAd;
}());
$(document).ready(function () {
    $("#submitNewAd").on("click", function (event) {
        var $apiAddress = "getApiAddress()";
        alert($apiAddress);
    });
}); //ready
var categorySelectorParentDivId = "categorySelector";
var allCategoriesId = "allCategories";
var categorySpecificPartialViewId = "NewAdPlaceHolder";
$(document).ready(function () {
    var newAd = new NewAd(categorySelectorParentDivId, allCategoriesId, categorySpecificPartialViewId);
}); //ready
//# sourceMappingURL=newAd.js.map