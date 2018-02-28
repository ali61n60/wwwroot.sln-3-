"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DefaultPriceType_1 = require("../PriceType/DefaultPriceType");
var DefaultOrderBy = (function () {
    function DefaultOrderBy() {
        this.OrderByKey = "OrderBy";
        this.OrderBySelectId = "orderBy";
        this.OrderByDivId = "orderByDiv";
        this.OrderByFixedPriceTemplateId = "orderByFixedPriceTemplate";
        this.OrderByOdersTemplateId = "orderByOthersTemplate";
    }
    DefaultOrderBy.prototype.BindEvents = function (criteriaChange) {
        var _this = this;
        this._searchCriteriaChange = criteriaChange;
        $("#" + this.OrderBySelectId).on("change", function (event) {
            _this._searchCriteriaChange.CustomCriteriaChanged();
        });
    };
    DefaultOrderBy.prototype.UnBindEvents = function () {
        $("#" + this.OrderBySelectId).off("change");
    };
    DefaultOrderBy.prototype.ValidateCriteria = function () { throw new Error("Not implemented"); };
    DefaultOrderBy.prototype.FillCriteria = function (userInput) {
        var orderBy = $("#" + this.OrderBySelectId).val().toString();
        userInput.ParametersDictionary[this.OrderByKey] = orderBy;
    };
    DefaultOrderBy.prototype.PriceTypeChanged = function (sender, args) {
        this.UnBindEvents();
        $("#" + this.OrderByDivId).children().remove();
        if (args === DefaultPriceType_1.PriceType.Fixed) {
            var template = $("#" + this.OrderByFixedPriceTemplateId).html();
            var html = Mustache.to_html(template, null);
            $("#" + this.OrderByDivId).append(html);
        }
        else {
            var template = $("#" + this.OrderByOdersTemplateId).html();
            var html = Mustache.to_html(template, null);
            $("#" + this.OrderByDivId).append(html);
        }
        this.BindEvents(this._searchCriteriaChange);
    };
    return DefaultOrderBy;
}());
exports.DefaultOrderBy = DefaultOrderBy;
//# sourceMappingURL=DefaultOrderBy.js.map