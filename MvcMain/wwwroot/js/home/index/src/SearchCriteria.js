"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AdTransformationSearchCriteria_1 = require("./SearchCriteria/AdTransformationSearchCriteria");
var SearchCriteria = (function () {
    function SearchCriteria() {
    }
    SearchCriteria.prototype.FillCategorySpecificSearchCriteria = function (categoryId, userInput) {
        switch (categoryId) {
            case 100:
                var adTransSerachCriteris = new AdTransformationSearchCriteria_1.AdTransformationSearchCriteria();
                adTransSerachCriteris.FillSearchCriteria(userInput);
                break;
            default:
                userInput.SearchParameters.defaultParameter = 1234;
                break;
        }
    };
    SearchCriteria.prototype.Bind = function () {
    };
    SearchCriteria.prototype.UnBind = function () {
    };
    return SearchCriteria;
}());
exports.SearchCriteria = SearchCriteria;
//# sourceMappingURL=SearchCriteria.js.map