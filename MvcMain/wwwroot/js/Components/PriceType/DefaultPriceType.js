"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventDispatcher_1 = require("../../Events/EventDispatcher");
var DefaultPriceType = /** @class */ (function () {
    function DefaultPriceType() {
        //TODO it raises priceTypeChanged Event, OrderBy component update itself based on price type setting
        this.SelectedPriceTypeChangedEvent = new EventDispatcher_1.EventDispatcher();
        this.PriceTypeSelectId = "priceType";
        this.FixPriceDivId = "fixedPrice";
        this.MinimumPriceKey = "MinimumPrice";
        this._minPriceInputId = "minPrice";
        this.MaximumPriceKey = "MaximumPrice";
        this._maxPriceInputId = "maxPrice";
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
        $("#" + this.PriceTypeSelectId).on("change", function (event) {
            var selectedPriceType = _this.getPriceType($(event.currentTarget).val().toString());
            if (selectedPriceType === PriceType.Fixed) {
                $("#" + _this.FixPriceDivId).show();
            }
            else {
                $("#" + _this.FixPriceDivId).hide();
            }
            //hide min and max prices if type is not fix...
            _this.SelectedPriceTypeChangedEvent.Dispatch(_this, selectedPriceType);
        });
    };
    DefaultPriceType.prototype.getPriceType = function (stringPriceType) {
        return parseInt(stringPriceType);
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
var PriceType;
(function (PriceType) {
    PriceType[PriceType["Fixed"] = 1] = "Fixed";
    PriceType[PriceType["Agreement"] = 2] = "Agreement";
    PriceType[PriceType["Exchange"] = 3] = "Exchange";
    PriceType[PriceType["Installment"] = 4] = "Installment";
    PriceType[PriceType["MortgageAndRent"] = 5] = "MortgageAndRent";
})(PriceType = exports.PriceType || (exports.PriceType = {}));
//# sourceMappingURL=DefaultPriceType.js.map