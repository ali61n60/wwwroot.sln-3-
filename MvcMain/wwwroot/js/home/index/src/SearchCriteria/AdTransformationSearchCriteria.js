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
//# sourceMappingURL=AdTransformationSearchCriteria.js.map