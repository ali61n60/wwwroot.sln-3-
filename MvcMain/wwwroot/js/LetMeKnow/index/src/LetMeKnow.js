"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CategorySelection_1 = require("../../../Components/Category/CategorySelection");
var UserInput_1 = require("../../../Helper/UserInput");
var LetMeKnowServerCaller_1 = require("./LetMeKnowServerCaller");
var LetMeKnowPartialViewLoader_1 = require("./LetMeKnowPartialViewLoader");
var LetMeKnowCriteria_1 = require("./LetMeKnowCriteria");
var LetMeKnow = /** @class */ (function () {
    function LetMeKnow(categorySelectorParentDivId, allCategoriesId) {
        this.EmailOrSmsKey = "EmailOrSms";
        this.EmailOrSmsParentDivId = "emailOrSms";
        this._registerLetMeKnowInputId = "registerLetMeKnow";
        this._categorySpecificCriteriaDivId = "CategorySpecificCriteria";
        this.initCategorySelect(categorySelectorParentDivId, allCategoriesId);
        this._letMeKnowServerCaller = new LetMeKnowServerCaller_1.LetMeKnowServerCaller();
        this._letMeKnowCriteria = new LetMeKnowCriteria_1.LetMeKnowCriteria();
        this._letMeKnowPartialViewLoader =
            new LetMeKnowPartialViewLoader_1.LetMeKnowPartialViewLoader(this._categorySpecificCriteriaDivId, this, this._letMeKnowCriteria);
        this.initEventHandlers();
    }
    LetMeKnow.prototype.CustomCriteriaChanged = function () {
    };
    LetMeKnow.prototype.initCategorySelect = function (categorySelectorParentDivId, allCategoriesId) {
        var allCategoriesString = $("#" + allCategoriesId).val().toString();
        var allCategories = $.parseJSON(allCategoriesString);
        this._categorySelection = new CategorySelection_1.CategorySelection(categorySelectorParentDivId, allCategories);
        this._categorySelection.CreateFirstLevel();
    };
    LetMeKnow.prototype.initEventHandlers = function () {
        var _this = this;
        this._categorySelection.SelectedCategoryChangedEvent.Subscribe(function (sender, args) {
            _this._letMeKnowPartialViewLoader.GetPartialViewFromServer(args.SelectedCategoryId);
        });
        $("#" + this._registerLetMeKnowInputId).on("click", function (event) {
            event.preventDefault();
            _this.registerLetMeKnow();
        });
    };
    LetMeKnow.prototype.registerLetMeKnow = function () {
        //TODO disable submitAd Button until current submission is ok or errornous 
        var userInput = new UserInput_1.UserInput();
        this._categorySelection.InsertCategoryIdInUserInputDictionary(userInput);
        userInput.ParametersDictionary[this.EmailOrSmsKey] = $("#" + this.EmailOrSmsParentDivId).children(":checked").val();
        ; //TODO make a ui view (radio button)
        this._letMeKnowCriteria.FillCategorySpecificLetMeKnowCriteria(this._categorySelection.GetSelectedCategoryId(), userInput);
        this._letMeKnowServerCaller.SaveAd(userInput);
    };
    return LetMeKnow;
}());
exports.LetMeKnow = LetMeKnow;
var categorySelectorParentDivId = "categorySelector";
var allCategoriesId = "allCategories";
$(document).ready(function () {
    var letMeKnow = new LetMeKnow(categorySelectorParentDivId, allCategoriesId);
});
//# sourceMappingURL=LetMeKnow.js.map