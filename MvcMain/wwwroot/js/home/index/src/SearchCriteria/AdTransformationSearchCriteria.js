"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AdTransformationSearchCriteria = /** @class */ (function () {
    function AdTransformationSearchCriteria() {
        this.BrandParameter = "BrandId";
        this.BrandSelectId = "brand";
        this.AllCarModelsInputId = "allCarModels";
        this.ModelSelectId = "model";
        var allCarModelssString = $("#" + this.AllCarModelsInputId).val().toString();
        this._allCarModels = $.parseJSON(allCarModelssString);
        this.initView();
    }
    AdTransformationSearchCriteria.prototype.initView = function () {
        var _this = this;
        this._allCarModels.forEach(function (carModel, index, array) {
            $("#" + _this.ModelSelectId).append("<option value=\"" + carModel.modelId + "\">" + carModel.modelName + "</option>");
        });
    };
    AdTransformationSearchCriteria.prototype.FillSearchCriteria = function (searchAdUserInput) {
        searchAdUserInput.SearchParameters[this.BrandParameter] =
            $("#" + this.BrandSelectId).find("option:selected").val();
    };
    AdTransformationSearchCriteria.prototype.BindEvents = function (searchCriteriaChange) {
        $("#brand").on("change", function (event) {
            console.log($(event.currentTarget).find("option:selected").text());
            searchCriteriaChange.CustomSearchCriteriChanged();
        });
    };
    AdTransformationSearchCriteria.prototype.UnBindEvents = function () {
        $("#brand").off("change");
    };
    return AdTransformationSearchCriteria;
}());
exports.AdTransformationSearchCriteria = AdTransformationSearchCriteria;
var Brand = /** @class */ (function () {
    function Brand() {
    }
    return Brand;
}());
var CarModel = /** @class */ (function () {
    function CarModel() {
    }
    return CarModel;
}());
//# sourceMappingURL=AdTransformationSearchCriteria.js.map