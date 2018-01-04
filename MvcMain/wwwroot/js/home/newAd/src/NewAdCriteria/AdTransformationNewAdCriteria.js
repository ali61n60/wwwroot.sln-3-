"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AdTransformationNewAdCriteria = /** @class */ (function () {
    function AdTransformationNewAdCriteria() {
        this.CarBrandIdKey = "BrandId";
        this.BrandSelectId = "brand";
        this.CarModelTemplateId = "modelTemplate";
        this.CarModelDivPlaceHolderId = "modelPlaceHolder";
        this.CarModelIdKey = "CarModelId";
        this.AllCarModelsInputId = "allCarModels";
        this.ModelSelectId = "model";
    }
    AdTransformationNewAdCriteria.prototype.initView = function () {
        var allCarModelssString = $("#" + this.AllCarModelsInputId).val().toString();
        this._allCarModels = $.parseJSON(allCarModelssString);
        this.initCarModel();
    };
    AdTransformationNewAdCriteria.prototype.initCarModel = function () {
        this.createCarModelElement(new Array());
    };
    AdTransformationNewAdCriteria.prototype.updateCarModelSelect = function (brandId) {
        var carModels = new Array();
        this._allCarModels.forEach(function (carModel, index, array) {
            if (carModel.brandId === brandId)
                carModels.push(carModel);
        });
        this.createCarModelElement(carModels);
    };
    AdTransformationNewAdCriteria.prototype.createCarModelElement = function (carModels) {
        $("#" + this.CarModelDivPlaceHolderId).children().remove();
        var template = $("#" + this.CarModelTemplateId).html();
        var data = { carModels: carModels };
        var html = Mustache.to_html(template, data);
        $("#" + this.CarModelDivPlaceHolderId).append(html);
        this.bindCarModel();
    };
    AdTransformationNewAdCriteria.prototype.FillCriteria = function (userInput) { };
    AdTransformationNewAdCriteria.prototype.BindEvents = function (criteriaChange) {
        var _this = this;
        this.initView();
        $("#" + this.BrandSelectId).on("change", function (event) {
            var selectedBrandId = parseInt($(event.currentTarget).find("option:selected").val().toString());
            _this.updateCarModelSelect(selectedBrandId);
            // searchCriteriaChange.CustomSearchCriteriChanged();
        });
        this.bindCarModel();
    };
    AdTransformationNewAdCriteria.prototype.bindCarModel = function () {
        $("#" + this.ModelSelectId).on("change", function (event) {
            //this._searchCriteriaChange.CustomSearchCriteriChanged();
        });
    };
    AdTransformationNewAdCriteria.prototype.UnBindEvents = function () {
        $("#" + this.BrandSelectId).off("change");
        this.unBindCarModel();
    };
    AdTransformationNewAdCriteria.prototype.unBindCarModel = function () {
        $("#" + this.ModelSelectId).off("change");
    };
    return AdTransformationNewAdCriteria;
}());
exports.AdTransformationNewAdCriteria = AdTransformationNewAdCriteria;
//# sourceMappingURL=AdTransformationNewAdCriteria.js.map