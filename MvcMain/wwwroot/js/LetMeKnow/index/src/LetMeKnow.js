"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CategorySelection_1 = require("../../../Components/Category/CategorySelection");
var LetMeKnow = (function () {
    function LetMeKnow(categorySelectorParentDivId, allCategoriesId) {
        this.initCategorySelect(categorySelectorParentDivId, allCategoriesId);
    }
    LetMeKnow.prototype.initCategorySelect = function (categorySelectorParentDivId, allCategoriesId) {
        var allCategoriesString = $("#" + allCategoriesId).val().toString();
        var allCategories = $.parseJSON(allCategoriesString);
        this._categorySelection = new CategorySelection_1.CategorySelection(categorySelectorParentDivId, allCategories);
        this._categorySelection.CreateFirstLevel();
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