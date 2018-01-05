"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CategorySelectionNewAd_1 = require("../../../Components/Category/NewAd/CategorySelectionNewAd");
var NewAdPartialViewLoader_1 = require("./NewAdPartialViewLoader");
var NewAdCriteria_1 = require("./NewAdCriteria");
var ImageUploader_1 = require("./ImageUploader");
var NewAd = /** @class */ (function () {
    function NewAd(allCategoriesDiv, allCategoriesInputId, categorySpecificPartialViewId) {
        this._allCategoriesDivId = allCategoriesDiv;
        this._allCategoriesInputId = allCategoriesInputId;
        this._categorySpecificPartialViewId = categorySpecificPartialViewId;
        this._newAdCriteria = new NewAdCriteria_1.NewAdCriteria();
        this._imageUploader = new ImageUploader_1.ImageUploader();
        this.initPage();
        this.initEventHandlers();
    }
    NewAd.prototype.CustomCriteriaChanged = function () {
    };
    NewAd.prototype.initPage = function () {
        this.initNewAdCategory();
        this._partialViewLoader = new NewAdPartialViewLoader_1.NewAdPartialViewLoader(this._categorySpecificPartialViewId, this, this._newAdCriteria);
    };
    NewAd.prototype.initNewAdCategory = function () {
        var allCategoriesString = $("#" + this._allCategoriesInputId).val().toString();
        var allCategories = $.parseJSON(allCategoriesString);
        this._categorySelectionNewAd = new CategorySelectionNewAd_1.CategorySelectionNewAd(this._allCategoriesDivId, allCategories);
        this._categorySelectionNewAd.CreateFirstLevel();
    };
    NewAd.prototype.initEventHandlers = function () {
        var _this = this;
        this._categorySelectionNewAd.SelectedCategoryChangedEvent.Subscribe(function (sender, args) {
            if (!_this._categorySelectionNewAd.SelectedCategoryHasChildren()) {
                _this._partialViewLoader.GetPartialViewFromServer(args);
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
var allCategoriesDivId = "allCategoriesDiv";
var allCategoriesInputId = "allCategoriesInput";
var categorySpecificPartialViewId = "CategorySpecificCriteria";
$(document).ready(function () {
    var newAd = new NewAd(allCategoriesDivId, allCategoriesInputId, categorySpecificPartialViewId);
}); //ready
//# sourceMappingURL=newAd.js.map