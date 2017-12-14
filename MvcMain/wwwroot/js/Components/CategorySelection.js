"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventDispatcher_1 = require("../Events/EventDispatcher");
var CategorySelection = /** @class */ (function () {
    function CategorySelection(parentDivId, allCategories) {
        this._firstLevelSelectId = "category1";
        this._secondLevelSelectId = "category2";
        this._thirdLevelSelectId = "category3";
        this._rootCategoryId = 0;
        this.SelectedCategoryChanged = new EventDispatcher_1.EventDispatcher();
        this._parentDivId = parentDivId;
        this._allCategories = allCategories;
    }
    //TODO chech for undefined
    CategorySelection.prototype.GetSelectedCategoryId = function () {
        if (this._selectedCategoryIdLevelThree !== this._rootCategoryId)
            return this._selectedCategoryIdLevelThree;
        else if (this._selectedCategoryIdLevelTwo !== this._rootCategoryId)
            return this._selectedCategoryIdLevelTwo;
        else
            return this._selectedCategoryIdLevelOne;
    }; //GetSelectedCategoryId
    CategorySelection.prototype.CreateFirstLevel = function () {
        var _this = this;
        this._selectedCategoryIdLevelOne = this._rootCategoryId;
        this._allCategories.forEach(function (category) {
            if (category.parentCategoryId === _this._rootCategoryId) {
                $("#" + _this._firstLevelSelectId).append($("<option>", {
                    value: category.categoryId,
                    text: category.categoryName
                }));
            } //if
        }); //forEach
        $("#" + this._firstLevelSelectId).change(function (event) {
            var selectedId = parseInt($(event.currentTarget).val().toString());
            _this._selectedCategoryIdLevelOne = selectedId;
            _this.createSecondLevel(selectedId);
            _this.SelectedCategoryChanged.dispatch(_this, _this.GetSelectedCategoryId());
        }); //change
    }; //CreateFirstLevel
    CategorySelection.prototype.createSecondLevel = function (firstLevelCategoryId) {
        var _this = this;
        this._selectedCategoryIdLevelTwo = this._rootCategoryId;
        $("#" + this._secondLevelSelectId).remove();
        $("#" + this._thirdLevelSelectId).remove();
        if (firstLevelCategoryId === this._rootCategoryId) {
            return;
        }
        var $select = $("<select id=\"" + this._secondLevelSelectId + "\" class=\"form-control\"></select>")
            .append("<option value=\"" + this._rootCategoryId + "\">\u062A\u0645\u0627\u0645 \u0622\u06AF\u0647\u06CC \u0647\u0627</option>");
        this._allCategories.forEach(function (category) {
            if (category.parentCategoryId === firstLevelCategoryId) {
                $select.append($("<option>", {
                    value: category.categoryId,
                    text: category.categoryName
                }));
            }
        }); //forEach
        $("#" + this._parentDivId).append($select);
        $("#" + this._secondLevelSelectId).change(function (event) {
            var selectedId = parseInt($(event.currentTarget).val().toString());
            _this._selectedCategoryIdLevelTwo = selectedId;
            _this.CreateThirdLevel(selectedId);
            _this.SelectedCategoryChanged.dispatch(_this, _this.GetSelectedCategoryId());
        }); //change
    };
    CategorySelection.prototype.CreateThirdLevel = function (secondLevelCategoryId) {
        var _this = this;
        this._selectedCategoryIdLevelThree = this._rootCategoryId;
        $("#" + this._thirdLevelSelectId).remove();
        if (secondLevelCategoryId === this._rootCategoryId) {
            return;
        }
        var $select = $("<select id=\"" + this._thirdLevelSelectId + "\" class=\"form-control\"></select>")
            .append("<option value=\"" + this._rootCategoryId + "\">\u062A\u0645\u0627\u0645 \u0622\u06AF\u0647\u06CC \u0647\u0627</option>");
        this._allCategories.forEach(function (category) {
            if (category.parentCategoryId === secondLevelCategoryId) {
                $select.append($("<option>", {
                    value: category.categoryId,
                    text: category.categoryName
                }));
            }
        }); //forEach
        $("#" + this._parentDivId).append($select);
        $("#" + this._thirdLevelSelectId).change(function (event) {
            var selectedId = parseInt($(event.currentTarget).val().toString());
            _this._selectedCategoryIdLevelThree = selectedId;
            _this.SelectedCategoryChanged.dispatch(_this, _this.GetSelectedCategoryId());
        }); //change
    };
    return CategorySelection;
}());
exports.CategorySelection = CategorySelection;
//# sourceMappingURL=CategorySelection.js.map