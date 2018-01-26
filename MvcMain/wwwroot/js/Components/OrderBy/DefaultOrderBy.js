"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DefaultOrderBy = /** @class */ (function () {
    function DefaultOrderBy() {
        this.OrderByKey = "OrderBy";
        this._orderBySelectIdDiv = "orderBy";
        alert("default order by");
    }
    DefaultOrderBy.prototype.BindEvents = function (criteriaChange) {
        var _this = this;
        this._searchCriteriaChange = criteriaChange;
        $("#" + this._orderBySelectIdDiv).on("change", function (event) {
            _this._searchCriteriaChange.CustomCriteriaChanged();
        });
    };
    DefaultOrderBy.prototype.UnBindEvents = function () {
        $("#" + this._orderBySelectIdDiv).off("change");
    };
    DefaultOrderBy.prototype.ValidateCriteria = function () { throw new Error("Not implemented"); };
    DefaultOrderBy.prototype.FillCriteria = function (userInput) {
        var orderBy = $("#" + this._orderBySelectIdDiv).val().toString();
        userInput.ParametersDictionary[this.OrderByKey] = orderBy;
    };
    return DefaultOrderBy;
}());
exports.DefaultOrderBy = DefaultOrderBy;
//# sourceMappingURL=DefaultOrderBy.js.map