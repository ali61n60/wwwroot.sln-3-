"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AdTransformationSearchCriteria = (function () {
    function AdTransformationSearchCriteria() {
        this.BrandParameter = "BrandId";
        this.BrandSelectId = "brand";
    }
    AdTransformationSearchCriteria.prototype.FillSearchCriteria = function (searchAdUserInput) {
        searchAdUserInput.SearchParameters[this.BrandParameter] =
            $("#" + this.BrandSelectId).find("option:selected").val();
    };
    AdTransformationSearchCriteria.prototype.BindEvents = function () {
    };
    AdTransformationSearchCriteria.prototype.UnBindEvents = function () {
    };
    return AdTransformationSearchCriteria;
}());
exports.AdTransformationSearchCriteria = AdTransformationSearchCriteria;
//# sourceMappingURL=AdTransformationSearchCriteria.js.map