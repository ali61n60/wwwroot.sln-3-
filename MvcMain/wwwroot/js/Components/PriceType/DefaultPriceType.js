"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DefaultPriceType = /** @class */ (function () {
    function DefaultPriceType() {
        //TODO it raises priceTypeChanged Event, OrderBy component update itself based on price type setting
        this.MinimumPriceKey = "MinimumPrice";
        this._minPriceInputId = "minPrice";
        this.MaximumPriceKey = "MaximumPrice";
        this._maxPriceInputId = "maxPrice";
        alert("DefaultPriceType");
    }
    DefaultPriceType.prototype.BindEvents = function (criteriaChange) {
        var _this = this;
        this._searchCriteriaChange = criteriaChange;
        //you can also user "input" instead of "change"
        $("#" + this._minPriceInputId).on("change", function (event) {
            _this._searchCriteriaChange.CustomCriteriaChanged();
        });
        $("#" + this._maxPriceInputId).on("change", function (event) {
            _this._searchCriteriaChange.CustomCriteriaChanged();
        });
    };
    DefaultPriceType.prototype.UnBindEvents = function () {
        $("#" + this._minPriceInputId).off("change");
        $("#" + this._maxPriceInputId).off("change");
    };
    DefaultPriceType.prototype.ValidateCriteria = function () { throw new Error("Not implemented"); };
    DefaultPriceType.prototype.FillCriteria = function (userInput) {
        var minPrice = parseInt($("#" + this._minPriceInputId).val().toString());
        userInput.ParametersDictionary[this.MinimumPriceKey] = minPrice;
        var maxPrice = parseInt($("#" + this._maxPriceInputId).val().toString());
        userInput.ParametersDictionary[this.MaximumPriceKey] = maxPrice;
    };
    return DefaultPriceType;
}());
exports.DefaultPriceType = DefaultPriceType;
//# sourceMappingURL=DefaultPriceType.js.map