"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CriteriaNumericDictionary_1 = require("../../../Helper/CriteriaNumericDictionary");
var DefaultLetMeKnowCriteria_1 = require("./LetMeKnowCriteria/DefaultLetMeKnowCriteria");
var AdTransportationLetMeKnowCriteria_1 = require("./LetMeKnowCriteria/AdTransportationLetMeKnowCriteria");
var LetMeKnowCriteria = /** @class */ (function () {
    function LetMeKnowCriteria() {
        this._letMeKnowCriteriaIocContainer = new CriteriaNumericDictionary_1.CriteriaNumericDictionary();
        this.initLetMeKnowCriteriaIocContainer();
    }
    LetMeKnowCriteria.prototype.initLetMeKnowCriteriaIocContainer = function () {
        this._letMeKnowCriteriaIocContainer[0] = new DefaultLetMeKnowCriteria_1.DefaultLetMeKnowCriteria();
        this._letMeKnowCriteriaIocContainer[100] = new AdTransportationLetMeKnowCriteria_1.AdTransportationLetMeKnowCriteria();
    };
    LetMeKnowCriteria.prototype.FillCategorySpecificLetMeKnowCriteria = function (categoryId, userInput) {
        var letMeKnowCriteria = this.polymorphicDispatchLetMeKnowCriteria(categoryId);
        letMeKnowCriteria.FillCriteria(userInput);
    };
    LetMeKnowCriteria.prototype.Bind = function (categoryId, criteriaChange) {
        var criteria = this.polymorphicDispatchLetMeKnowCriteria(categoryId);
        criteria.BindEvents(criteriaChange);
    };
    LetMeKnowCriteria.prototype.UnBind = function (categoryId) {
        var criteria = this.polymorphicDispatchLetMeKnowCriteria(categoryId);
        criteria.UnBindEvents();
    };
    LetMeKnowCriteria.prototype.polymorphicDispatchLetMeKnowCriteria = function (categoryId) {
        var returnValue = this._letMeKnowCriteriaIocContainer[categoryId];
        if (returnValue === undefined || returnValue === null) {
            returnValue = this._letMeKnowCriteriaIocContainer[0];
        }
        return returnValue;
    };
    return LetMeKnowCriteria;
}());
exports.LetMeKnowCriteria = LetMeKnowCriteria;
//# sourceMappingURL=LetMeKnowCriteria.js.map