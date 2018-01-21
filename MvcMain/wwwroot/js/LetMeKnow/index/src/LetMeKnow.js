"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CategorySelection_1 = require("../../../Components/Category/CategorySelection");
var LetMeKnow = (function () {
    function LetMeKnow(categorySelectorParentDivId, allCategoriesId) {
        this.initCategorySelect(categorySelectorParentDivId, allCategoriesId);
        this.initEventHandlers();
    }
    LetMeKnow.prototype.initCategorySelect = function (categorySelectorParentDivId, allCategoriesId) {
        var allCategoriesString = $("#" + allCategoriesId).val().toString();
        var allCategories = $.parseJSON(allCategoriesString);
        this._categorySelection = new CategorySelection_1.CategorySelection(categorySelectorParentDivId, allCategories);
        this._categorySelection.CreateFirstLevel();
    };
    LetMeKnow.prototype.initEventHandlers = function () {
        this._categorySelection.SelectedCategoryChangedEvent.Subscribe(function (sender, args) {
            //TODO load specific LetMeKnow View based on category id
        });
    };
    return LetMeKnow;
}());
exports.LetMeKnow = LetMeKnow;
var categorySelectorParentDivId = "categorySelector";
var allCategoriesId = "allCategories";
$(document).ready(function () {
    var letMeKnow = new LetMeKnow(categorySelectorParentDivId, allCategoriesId);
});
//# sourceMappingURL=letMeKnow.js.map