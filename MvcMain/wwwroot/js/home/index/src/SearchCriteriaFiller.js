"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AdTransformationSearchCriteria_1 = require("./SearchCriteria/AdTransformationSearchCriteria");
var SearchCriteriaFiller = (function () {
    function SearchCriteriaFiller() {
    }
    SearchCriteriaFiller.prototype.FillCategorySpecificSearchCriteria = function (categoryId, userInput) {
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
    return SearchCriteriaFiller;
}());
exports.SearchCriteriaFiller = SearchCriteriaFiller;
//# sourceMappingURL=SearchCriteriaFiller.js.map