"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DefaultSearchCriteria = /** @class */ (function () {
    function DefaultSearchCriteria() {
    }
    DefaultSearchCriteria.prototype.FillCriteria = function (userInput) {
        userInput.ParametersDictionary.defaultParameter = 1234;
    };
    DefaultSearchCriteria.prototype.BindEvents = function (criteriaChange) {
    };
    DefaultSearchCriteria.prototype.UnBindEvents = function () {
    };
    DefaultSearchCriteria.prototype.ValidateCriteria = function () {
        throw new Error("Not implemented");
    };
    return DefaultSearchCriteria;
}());
exports.DefaultSearchCriteria = DefaultSearchCriteria;
//# sourceMappingURL=DefaultSearchCriteria.js.map