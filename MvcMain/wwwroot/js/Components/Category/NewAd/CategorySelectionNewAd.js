"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventDispatcher_1 = require("../../../Events/EventDispatcher");
var CategorySelectionNewAd = /** @class */ (function () {
    function CategorySelectionNewAd(parentDivId, allCategories) {
        this._firstLevelTemplate = "category1Template";
        this._firstLevelDiv = "category1";
        this._firstLevelSelect = "select1";
        this._secondLevelTemplate = "category2Template";
        this._secondLevelDiv = "category2";
        this._secondLevelSelect = "select2";
        this._thirdLevelTemplate = "category3Template";
        this._thirdLevelDiv = "category3";
        this._thirdLevelSelect = "select3";
        this._rootCategoryId = 0;
        this.SelectedCategoryChangedEvent = new EventDispatcher_1.EventDispatcher();
        this._parentDivId = parentDivId;
        this._allCategories = allCategories;
    }
    CategorySelectionNewAd.prototype.GetSelectedCategoryId = function () {
        if (this._selectedCategoryIdLevelThree !== undefined &&
            this._selectedCategoryIdLevelThree !== this._rootCategoryId)
            return this._selectedCategoryIdLevelThree;
        else if (this._selectedCategoryIdLevelTwo !== undefined &&
            this._selectedCategoryIdLevelTwo !== this._rootCategoryId)
            return this._selectedCategoryIdLevelTwo;
        else
            return this._selectedCategoryIdLevelOne;
    }; //GetSelectedCategoryId
    CategorySelectionNewAd.prototype.SelectedCategoryHasChildren = function () {
        var selectedCategoryId = this.GetSelectedCategoryId();
        return this._allCategories.filter(function (category) { return category.parentCategoryId === selectedCategoryId; }).length > 0;
    };
    CategorySelectionNewAd.prototype.addOptionElementToSelectElement = function (selectElementId, category) {
        $("#" + selectElementId).append($("<option>", {
            value: category.categoryId,
            text: category.categoryName
        }));
    };
    CategorySelectionNewAd.prototype.CreateFirstLevel = function () {
        var _this = this;
        this.removeElement(this._firstLevelDiv);
        this.removeElement(this._secondLevelDiv);
        this.removeElement(this._thirdLevelDiv);
        var template = $("#" + this._firstLevelTemplate).html();
        var categories = new Array();
        var data = { categories: categories };
        this._selectedCategoryIdLevelOne = this._rootCategoryId;
        this._allCategories.forEach(function (category) {
            if (category.parentCategoryId === _this._rootCategoryId) {
                categories.push(category);
            } //if
        }); //forEach
        var html = Mustache.to_html(template, data);
        $("#" + this._parentDivId).append(html);
        $("#" + this._firstLevelSelect).change(function (event) {
            var selectedId = parseInt($(event.currentTarget).val().toString());
            _this._selectedCategoryIdLevelOne = selectedId;
            _this.createSecondLevel(selectedId);
            _this.SelectedCategoryChangedEvent.dispatch(_this, _this.GetSelectedCategoryId());
        }); //change
    }; //CreateFirstLevel
    CategorySelectionNewAd.prototype.createSecondLevel = function (firstLevelCategoryId) {
        var _this = this;
        this.removeElement(this._secondLevelDiv);
        this.removeElement(this._thirdLevelDiv);
        this._selectedCategoryIdLevelTwo = this._rootCategoryId;
        if (firstLevelCategoryId === this._rootCategoryId) {
            return;
        }
        var template = $("#" + this._secondLevelTemplate).html();
        var categories = new Array();
        var data = { categories: categories };
        this._allCategories.forEach(function (category) {
            if (category.parentCategoryId === firstLevelCategoryId) {
                categories.push(category);
            } //if
        }); //forEach
        var html = Mustache.to_html(template, data);
        $("#" + this._parentDivId).append(html);
        $("#" + this._secondLevelSelect).change(function (event) {
            var selectedId = parseInt($(event.currentTarget).val().toString());
            _this._selectedCategoryIdLevelTwo = selectedId;
            _this.createThirdLevel(selectedId);
            _this.SelectedCategoryChangedEvent.dispatch(_this, _this.GetSelectedCategoryId());
        }); //change
    };
    CategorySelectionNewAd.prototype.createThirdLevel = function (secondLevelCategoryId) {
        var _this = this;
        this.removeElement(this._thirdLevelDiv);
        this._selectedCategoryIdLevelThree = this._rootCategoryId;
        if (secondLevelCategoryId === this._rootCategoryId) {
            return;
        }
        var template = $("#" + this._thirdLevelTemplate).html();
        var categories = new Array();
        var data = { categories: categories };
        this._allCategories.forEach(function (category) {
            if (category.parentCategoryId === secondLevelCategoryId) {
                categories.push(category);
            } //if
        }); //forEach
        if (categories.length === 0) {
            return;
        }
        var html = Mustache.to_html(template, data);
        $("#" + this._parentDivId).append(html);
        $("#" + this._thirdLevelSelect).change(function (event) {
            _this._selectedCategoryIdLevelThree = parseInt($(event.currentTarget).val().toString());
            _this.SelectedCategoryChangedEvent.dispatch(_this, _this.GetSelectedCategoryId());
        }); //change
    };
    CategorySelectionNewAd.prototype.removeElement = function (id) {
        $("#" + id).remove();
    };
    return CategorySelectionNewAd;
}());
exports.CategorySelectionNewAd = CategorySelectionNewAd;
//# sourceMappingURL=CategorySelectionNewAd.js.map