"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AdTransformationSearchCriteria_1 = require("./SearchCriteria/AdTransformationSearchCriteria");
var DefaultSearchCriteria_1 = require("./SearchCriteria/DefaultSearchCriteria");
var CriteriaNumericDictionary_1 = require("../../../Helper/CriteriaNumericDictionary");
var SearchCriteria = (function () {
    function SearchCriteria() {
        this._searchCriteriaIocContainer = new CriteriaNumericDictionary_1.CriteriaNumericDictionary();
        this.initSearchCriteriaIocContainer();
    }
    SearchCriteria.prototype.initSearchCriteriaIocContainer = function () {
        this._searchCriteriaIocContainer[0] = new DefaultSearchCriteria_1.DefaultSearchCriteria();
        this._searchCriteriaIocContainer[100] = new AdTransformationSearchCriteria_1.AdTransformationSearchCriteria();
    };
    SearchCriteria.prototype.FillCategorySpecificSearchCriteria = function (categoryId, userInput) {
        var searchCriteria = this.polymorphicDispatchSearchCriteria(categoryId);
        searchCriteria.FillCriteria(userInput);
    };
    SearchCriteria.prototype.Bind = function (categoryId, searchCriteriaChange) {
        var searchCriteria = this.polymorphicDispatchSearchCriteria(categoryId);
        searchCriteria.BindEvents(searchCriteriaChange);
    };
    SearchCriteria.prototype.UnBind = function (categoryId) {
        var searchCriteria = this.polymorphicDispatchSearchCriteria(categoryId);
        searchCriteria.UnBindEvents();
    };
    SearchCriteria.prototype.polymorphicDispatchSearchCriteria = function (categoryId) {
        var returnValue = this._searchCriteriaIocContainer[categoryId];
        if (returnValue === undefined || returnValue === null) {
            returnValue = this._searchCriteriaIocContainer[0];
        }
        return returnValue;
    };
    return SearchCriteria;
}());
exports.SearchCriteria = SearchCriteria;
//# sourceMappingURL=SearchCriteria.js.map