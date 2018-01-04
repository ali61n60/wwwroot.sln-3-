"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CriteriaNumericDictionary_1 = require("../../../Helper/CriteriaNumericDictionary");
var DefaultNewAdCriteria_1 = require("./NewAdCriteria/DefaultNewAdCriteria");
var AdTransformationNewAdCriteria_1 = require("./NewAdCriteria/AdTransformationNewAdCriteria");
var NewAdCriteria = /** @class */ (function () {
    function NewAdCriteria() {
        this._newAdCriteriaIocContainer = new CriteriaNumericDictionary_1.CriteriaNumericDictionary();
        this.initNewAdCriteriaIocContainer();
    }
    NewAdCriteria.prototype.initNewAdCriteriaIocContainer = function () {
        this._newAdCriteriaIocContainer[0] = new DefaultNewAdCriteria_1.DefaultNewAdCriteria();
        this._newAdCriteriaIocContainer[100] = new AdTransformationNewAdCriteria_1.AdTransformationNewAdCriteria();
    };
    NewAdCriteria.prototype.FillCategorySpecificNewAdCriteria = function (categoryId, userInput) {
        var newAdCriteria = this.polymorphicDispatchNeaAdCriteria(categoryId);
        newAdCriteria.FillCriteria(userInput);
    };
    NewAdCriteria.prototype.Bind = function (categoryId, searchCriteriaChange) {
        var searchCriteria = this.polymorphicDispatchNeaAdCriteria(categoryId);
        searchCriteria.BindEvents(searchCriteriaChange);
    };
    NewAdCriteria.prototype.UnBind = function (categoryId) {
        var searchCriteria = this.polymorphicDispatchNeaAdCriteria(categoryId);
        searchCriteria.UnBindEvents();
    };
    NewAdCriteria.prototype.polymorphicDispatchNeaAdCriteria = function (categoryId) {
        var returnValue = this._newAdCriteriaIocContainer[categoryId];
        if (returnValue === undefined || returnValue === null) {
            returnValue = this._newAdCriteriaIocContainer[0];
        }
        return returnValue;
    };
    return NewAdCriteria;
}());
exports.NewAdCriteria = NewAdCriteria;
//# sourceMappingURL=NewAdCriteria.js.map