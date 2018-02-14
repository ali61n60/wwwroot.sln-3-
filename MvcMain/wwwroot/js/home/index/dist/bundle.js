(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventDispatcher_1 = require("../../Events/EventDispatcher");
var CategorySelection = /** @class */ (function () {
    function CategorySelection(parentDivId, allCategories) {
        this.SelectedCategoryChangedEvent = new EventDispatcher_1.EventDispatcher();
        this.CategoryIdKey = "CategoryId";
        this._firstLevelTemplate = "category1Template";
        this._firstLevelDiv = "category1";
        this._firstLevelSelect = "select1";
        this._secondLevelTemplate = "category2Template";
        this._secondLevelDiv = "category2";
        this._secondLevelSelect = "select2";
        this._thirdLevelTemplate = "category3Template";
        this._thirdLevelDiv = "category3";
        this._thirdLevelSelect = "select3";
        this._rootCategoryId = 0;
        this._parentDivId = parentDivId;
        this._allCategories = allCategories;
    }
    CategorySelection.prototype.SetCategoryId = function (selectedCategoryId) {
        var firstLevelId;
        var secondLevelId;
        var categoryLevel = this.getCategoryLevel(selectedCategoryId);
        switch (categoryLevel) {
            case CategoryLevel.Unkown:
                this.CreateFirstLevel();
                break;
            case CategoryLevel.Level1:
                this.CreateFirstLevel();
                this.setFirstLevelToSpecificId(selectedCategoryId);
                this.createSecondLevel(selectedCategoryId);
                $("#" + this._firstLevelSelect).trigger("change");
                break;
            case CategoryLevel.Level2:
                this.CreateFirstLevel();
                firstLevelId = this._allCategories.filter(function (category) { return category.CategoryId === selectedCategoryId; })[0]
                    .CategoryParentId;
                this.setFirstLevelToSpecificId(firstLevelId);
                this.createSecondLevel(firstLevelId);
                this.setSecondLevelToSpecificId(selectedCategoryId);
                this.createThirdLevel(selectedCategoryId);
                $("#" + this._secondLevelSelect).trigger("change");
                break;
            case CategoryLevel.Level3:
                this.CreateFirstLevel();
                secondLevelId = this._allCategories.filter(function (category) { return category.CategoryId === selectedCategoryId; })[0]
                    .CategoryParentId;
                firstLevelId = this._allCategories.filter(function (category) { return category.CategoryId === secondLevelId; })[0]
                    .CategoryParentId;
                this.setFirstLevelToSpecificId(firstLevelId);
                this.createSecondLevel(firstLevelId);
                this.setSecondLevelToSpecificId(secondLevelId);
                this.createThirdLevel(secondLevelId);
                this.setThirdLevelToSpecificId(selectedCategoryId);
                $("#" + this._thirdLevelSelect).trigger("change");
                break;
        }
    };
    CategorySelection.prototype.setFirstLevelToSpecificId = function (categoryId) {
        $("#" + this._firstLevelSelect).val(categoryId);
    };
    CategorySelection.prototype.setSecondLevelToSpecificId = function (categoryId) {
        $("#" + this._secondLevelSelect).val(categoryId);
    };
    CategorySelection.prototype.setThirdLevelToSpecificId = function (categoryId) {
        $("#" + this._thirdLevelSelect).val(categoryId);
    };
    CategorySelection.prototype.getCategoryLevel = function (categoryId) {
        var tempCategoryArray = this._allCategories.filter(function (category) { return category.CategoryId === categoryId; });
        var tempCategory;
        if (tempCategoryArray.length === 0) {
            return CategoryLevel.Unkown;
        }
        tempCategory = tempCategoryArray[0];
        if (tempCategory.ParentCategoryId === this._rootCategoryId) {
            return CategoryLevel.Level1;
        }
        tempCategory = this._allCategories.filter(function (category) { return category.CategoryId === tempCategory.ParentCategoryId; })[0];
        if (tempCategory.ParentCategoryId === this._rootCategoryId) {
            return CategoryLevel.Level2;
        }
        return CategoryLevel.Level3;
    };
    CategorySelection.prototype.InsertCategoryIdInUserInputDictionary = function (userInput) {
        var categoryId = this.GetSelectedCategoryId();
        userInput.ParametersDictionary[this.CategoryIdKey] = categoryId; //100 for cars
    };
    CategorySelection.prototype.GetSelectedCategoryId = function () {
        if (this._selectedCategoryIdLevelThree !== undefined &&
            this._selectedCategoryIdLevelThree !== this._rootCategoryId)
            return this._selectedCategoryIdLevelThree;
        else if (this._selectedCategoryIdLevelTwo !== undefined &&
            this._selectedCategoryIdLevelTwo !== this._rootCategoryId)
            return this._selectedCategoryIdLevelTwo;
        else
            return this._selectedCategoryIdLevelOne;
    };
    CategorySelection.prototype.CreateFirstLevel = function () {
        var _this = this;
        this.removeElement(this._firstLevelDiv);
        this._selectedCategoryIdLevelOne = this._rootCategoryId;
        this.removeElement(this._secondLevelDiv);
        this._selectedCategoryIdLevelTwo = this._rootCategoryId;
        this.removeElement(this._thirdLevelDiv);
        this._selectedCategoryIdLevelThree = this._rootCategoryId;
        var template = $("#" + this._firstLevelTemplate).html();
        var categories = new Array();
        var data = { categories: categories };
        this._selectedCategoryIdLevelOne = this._rootCategoryId; //
        this._allCategories.forEach(function (category) {
            if (category.CategoryParentId === _this._rootCategoryId) {
                categories.push(category);
            } //if
        }); //forEach
        var html = Mustache.to_html(template, data);
        $("#" + this._parentDivId).append(html);
        $("#" + this._firstLevelSelect).change(function (event) {
            var selectedId = parseInt($(event.currentTarget).val().toString());
            _this._selectedCategoryIdLevelOne = selectedId;
            _this.createSecondLevel(selectedId);
            var eventArg = new CategoryCahngedEventArg();
            eventArg.SelectedCategoryId = _this.GetSelectedCategoryId();
            eventArg.SelectedCategoryHasChild = _this.selectedCategoryHasChildren();
            _this.SelectedCategoryChangedEvent.Dispatch(_this, eventArg);
        }); //change
    }; //CreateFirstLevel
    CategorySelection.prototype.createSecondLevel = function (firstLevelCategoryId) {
        var _this = this;
        this.removeElement(this._secondLevelDiv);
        this._selectedCategoryIdLevelTwo = this._rootCategoryId;
        this.removeElement(this._thirdLevelDiv);
        this._selectedCategoryIdLevelThree = this._rootCategoryId;
        if (firstLevelCategoryId === this._rootCategoryId) {
            return;
        }
        var template = $("#" + this._secondLevelTemplate).html();
        var categories = new Array();
        var data = { categories: categories };
        this._allCategories.forEach(function (category) {
            if (category.CategoryParentId === firstLevelCategoryId) {
                categories.push(category);
            } //if
        }); //forEach
        var html = Mustache.to_html(template, data);
        $("#" + this._parentDivId).append(html);
        $("#" + this._secondLevelSelect).change(function (event) {
            var selectedId = parseInt($(event.currentTarget).val().toString());
            _this._selectedCategoryIdLevelTwo = selectedId;
            _this.createThirdLevel(selectedId);
            var eventArg = new CategoryCahngedEventArg();
            eventArg.SelectedCategoryId = _this.GetSelectedCategoryId();
            eventArg.SelectedCategoryHasChild = _this.selectedCategoryHasChildren();
            _this.SelectedCategoryChangedEvent.Dispatch(_this, eventArg);
        }); //change
    };
    CategorySelection.prototype.createThirdLevel = function (secondLevelCategoryId) {
        var _this = this;
        this.removeElement(this._thirdLevelDiv);
        this._selectedCategoryIdLevelThree = this._rootCategoryId;
        if (secondLevelCategoryId === this._rootCategoryId) {
            return;
        }
        var template = $("#" + this._thirdLevelTemplate).html();
        var categories = new Array();
        var data = { categories: categories };
        this._allCategories.forEach(function (category) {
            if (category.CategoryParentId === secondLevelCategoryId) {
                categories.push(category);
            } //if
        }); //forEach
        if (categories.length === 0) {
            return;
        }
        var html = Mustache.to_html(template, data);
        $("#" + this._parentDivId).append(html);
        $("#" + this._thirdLevelSelect).change(function (event) {
            _this._selectedCategoryIdLevelThree = parseInt($(event.currentTarget).val().toString());
            var eventArg = new CategoryCahngedEventArg();
            eventArg.SelectedCategoryId = _this.GetSelectedCategoryId();
            eventArg.SelectedCategoryHasChild = _this.selectedCategoryHasChildren();
            _this.SelectedCategoryChangedEvent.Dispatch(_this, eventArg);
        }); //change
    };
    CategorySelection.prototype.selectedCategoryHasChildren = function () {
        var selectedCategoryId = this.GetSelectedCategoryId();
        return this._allCategories.filter(function (category) { return category.CategoryParentId === selectedCategoryId; }).length > 0;
    };
    CategorySelection.prototype.removeElement = function (id) {
        $("#" + id).remove();
    };
    return CategorySelection;
}());
exports.CategorySelection = CategorySelection;
var CategoryCahngedEventArg = /** @class */ (function () {
    function CategoryCahngedEventArg() {
    }
    return CategoryCahngedEventArg;
}());
exports.CategoryCahngedEventArg = CategoryCahngedEventArg;
var CategoryLevel;
(function (CategoryLevel) {
    CategoryLevel[CategoryLevel["Level1"] = 1] = "Level1";
    CategoryLevel[CategoryLevel["Level2"] = 2] = "Level2";
    CategoryLevel[CategoryLevel["Level3"] = 3] = "Level3";
    CategoryLevel[CategoryLevel["Unkown"] = 4] = "Unkown";
})(CategoryLevel || (CategoryLevel = {}));
},{"../../Events/EventDispatcher":5}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DefaultPriceType_1 = require("../PriceType/DefaultPriceType");
var DefaultOrderBy = /** @class */ (function () {
    function DefaultOrderBy() {
        this.OrderByKey = "OrderBy";
        this.OrderBySelectId = "orderBy";
        this.OrderByDivId = "orderByDiv";
        this.OrderByFixedPriceTemplateId = "orderByFixedPriceTemplate";
        this.OrderByOdersTemplateId = "orderByOdersTemplate";
    }
    DefaultOrderBy.prototype.BindEvents = function (criteriaChange) {
        var _this = this;
        this._searchCriteriaChange = criteriaChange;
        $("#" + this.OrderBySelectId).on("change", function (event) {
            _this._searchCriteriaChange.CustomCriteriaChanged();
        });
    };
    DefaultOrderBy.prototype.UnBindEvents = function () {
        $("#" + this.OrderBySelectId).off("change");
    };
    DefaultOrderBy.prototype.ValidateCriteria = function () { throw new Error("Not implemented"); };
    DefaultOrderBy.prototype.FillCriteria = function (userInput) {
        var orderBy = $("#" + this.OrderBySelectId).val().toString();
        userInput.ParametersDictionary[this.OrderByKey] = orderBy;
    };
    DefaultOrderBy.prototype.PriceTypeChanged = function (sender, args) {
        this.UnBindEvents();
        $("#" + this.OrderByDivId).children().remove();
        if (args === DefaultPriceType_1.PriceType.Fixed) {
            var template = $("#" + this.OrderByFixedPriceTemplateId).html();
            var html = Mustache.to_html(template, null);
            $("#" + this.OrderByDivId).append(html);
        }
        else {
            var template = $("#" + this.OrderByOdersTemplateId).html();
            var html = Mustache.to_html(template, null);
            $("#" + this.OrderByDivId).append(html);
        }
        this.BindEvents(this._searchCriteriaChange);
    };
    return DefaultOrderBy;
}());
exports.DefaultOrderBy = DefaultOrderBy;
},{"../PriceType/DefaultPriceType":3}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventDispatcher_1 = require("../../Events/EventDispatcher");
var DefaultPriceType = /** @class */ (function () {
    function DefaultPriceType() {
        this.SelectedPriceTypeChangedEvent = new EventDispatcher_1.EventDispatcher();
        this.PriceTypeKey = "PriceType";
        this.PriceTypeSelectId = "priceType";
        this.FixPriceDivId = "fixedPrice";
        this.MinimumPriceKey = "MinimumPrice";
        this._minPriceInputId = "minPrice";
        this.MaximumPriceKey = "MaximumPrice";
        this._maxPriceInputId = "maxPrice";
    }
    DefaultPriceType.prototype.BindEvents = function (criteriaChange) {
        var _this = this;
        this._searchCriteriaChange = criteriaChange;
        //you can also user "input" instead of "change"
        $("#" + this._minPriceInputId).on("change", function (event) {
            _this._searchCriteriaChange.CustomCriteriaChanged();
        });
        $("#" + this._maxPriceInputId).on("change", function (event) {
            _this._searchCriteriaChange.CustomCriteriaChanged();
        });
        $("#" + this.PriceTypeSelectId).on("change", function (event) {
            var selectedPriceType = _this.getPriceType($(event.currentTarget).val().toString());
            if (selectedPriceType === PriceType.Fixed) {
                $("#" + _this.FixPriceDivId).show();
            }
            else {
                $("#" + _this.FixPriceDivId).hide();
            }
            _this.SelectedPriceTypeChangedEvent.Dispatch(_this, selectedPriceType);
            _this._searchCriteriaChange.CustomCriteriaChanged();
        });
    };
    DefaultPriceType.prototype.getPriceType = function (stringPriceType) {
        return parseInt(stringPriceType);
    };
    DefaultPriceType.prototype.UnBindEvents = function () {
        $("#" + this._minPriceInputId).off("change");
        $("#" + this._maxPriceInputId).off("change");
    };
    DefaultPriceType.prototype.ValidateCriteria = function () { throw new Error("Not implemented"); };
    DefaultPriceType.prototype.FillCriteria = function (userInput) {
        userInput.ParametersDictionary[this.PriceTypeKey] = $("#" + this.PriceTypeSelectId).val().toString();
        if (parseInt($("#" + this.PriceTypeSelectId).val().toString()) === PriceType.Fixed) {
            var minPrice = parseInt($("#" + this._minPriceInputId).val().toString());
            userInput.ParametersDictionary[this.MinimumPriceKey] = minPrice;
            var maxPrice = parseInt($("#" + this._maxPriceInputId).val().toString());
            userInput.ParametersDictionary[this.MaximumPriceKey] = maxPrice;
        }
    };
    return DefaultPriceType;
}());
exports.DefaultPriceType = DefaultPriceType;
var PriceType;
(function (PriceType) {
    PriceType[PriceType["Fixed"] = 1] = "Fixed";
    PriceType[PriceType["Agreement"] = 2] = "Agreement";
    PriceType[PriceType["Exchange"] = 3] = "Exchange";
    PriceType[PriceType["Installment"] = 4] = "Installment";
    PriceType[PriceType["MortgageAndRent"] = 5] = "MortgageAndRent";
})(PriceType = exports.PriceType || (exports.PriceType = {}));
},{"../../Events/EventDispatcher":5}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CarModelBrandController = /** @class */ (function () {
    function CarModelBrandController() {
        this.CarBrandIdKey = "BrandId";
        this.BrandSelectId = "brand";
        this.CarModelTemplateId = "modelTemplate";
        this.CarModelDivPlaceHolderId = "modelPlaceHolder";
        this.CarModelIdKey = "CarModelId";
        this.AllCarModelsInputId = "allCarModels";
        this.ModelSelectId = "model";
        this.initView();
    }
    CarModelBrandController.prototype.ValidateCriteria = function () { throw new Error("Not implemented"); };
    CarModelBrandController.prototype.initView = function () {
        var allCarModelsString = $("#" + this.AllCarModelsInputId).val().toString();
        this._allCarModels = $.parseJSON(allCarModelsString);
        this.initCarModel();
    };
    CarModelBrandController.prototype.initCarModel = function () {
        this.createCarModelElement(new Array());
    };
    CarModelBrandController.prototype.createCarModelElement = function (carModels) {
        $("#" + this.CarModelDivPlaceHolderId).children().remove();
        var template = $("#" + this.CarModelTemplateId).html();
        var data = { carModels: carModels };
        var html = Mustache.to_html(template, data);
        $("#" + this.CarModelDivPlaceHolderId).append(html);
        this.bindCarModel();
    };
    CarModelBrandController.prototype.bindCarModel = function () {
        var _this = this;
        $("#" + this.ModelSelectId).on("change", function (event) {
            _this._searchCriteriaChange.CustomCriteriaChanged();
        });
    };
    CarModelBrandController.prototype.updateCarModelSelect = function (brandId) {
        var carModels = new Array();
        if (brandId !== 0) {
            this._allCarModels.forEach(function (carModel, index, array) {
                if (carModel.BrandId === brandId)
                    carModels.push(carModel);
            });
        }
        this.createCarModelElement(carModels);
    };
    CarModelBrandController.prototype.FillCriteria = function (userInput) {
        userInput.ParametersDictionary[this.CarBrandIdKey] =
            $("#" + this.BrandSelectId).find("option:selected").val(); //brandId
        userInput.ParametersDictionary[this.CarModelIdKey] =
            $("#" + this.ModelSelectId).find("option:selected").val(); //carModelId
    };
    CarModelBrandController.prototype.BindEvents = function (criteriaChange) {
        var _this = this;
        this._searchCriteriaChange = criteriaChange;
        $("#" + this.BrandSelectId).on("change", function (event) {
            var selectedBrandId = parseInt($(event.currentTarget).find("option:selected").val().toString());
            _this.updateCarModelSelect(selectedBrandId);
            criteriaChange.CustomCriteriaChanged();
        });
        this.bindCarModel();
    };
    CarModelBrandController.prototype.UnBindEvents = function () {
        $("#" + this.BrandSelectId).off("change");
        $("#" + this.ModelSelectId).off("change");
    };
    return CarModelBrandController;
}());
exports.CarModelBrandController = CarModelBrandController;
},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* The dispatcher handles the storage of subsciptions and facilitates
  subscription, unsubscription and dispatching of the event */
var EventDispatcher = /** @class */ (function () {
    function EventDispatcher() {
        this._subscriptions = new Array();
    }
    EventDispatcher.prototype.Subscribe = function (fn) {
        if (fn) {
            this._subscriptions.push(fn);
        }
    };
    EventDispatcher.prototype.Unsubscribe = function (fn) {
        var i = this._subscriptions.indexOf(fn);
        if (i > -1) {
            this._subscriptions.splice(i, 1);
        }
    };
    EventDispatcher.prototype.Dispatch = function (sender, args) {
        for (var _i = 0, _a = this._subscriptions; _i < _a.length; _i++) {
            var handler = _a[_i];
            handler(sender, args);
        }
    };
    return EventDispatcher;
}());
exports.EventDispatcher = EventDispatcher;
},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AjaxCaller = /** @class */ (function () {
    function AjaxCaller(url, resultHandler, requestCode) {
        this._numberOfPureServerCalls = 0;
        this._url = url;
        this._resultHandler = resultHandler;
        this._requestCode = requestCode;
    }
    AjaxCaller.prototype.Call = function (userInput) {
        var _this = this;
        $.ajax({
            type: "POST",
            url: this._url,
            data: JSON.stringify(userInput.ParametersDictionary),
            contentType: 'application/json',
            success: function (msg, textStatus, jqXHR) { return _this.onSuccessGetItemsFromServer(msg, textStatus, jqXHR); },
            error: function (jqXHR, textStatus, errorThrown) { return _this.onErrorGetItemsFromServer(jqXHR, textStatus, errorThrown); } // When Service call fails
        }); //.ajax
        this._numberOfPureServerCalls++;
        this._resultHandler.AjaxCallStarted(this._requestCode);
    };
    AjaxCaller.prototype.onSuccessGetItemsFromServer = function (msg, textStatus, jqXHR) {
        this._numberOfPureServerCalls--;
        if (this._numberOfPureServerCalls === 0) {
            this._resultHandler.AjaxCallFinished(this._requestCode);
        }
        this._resultHandler.OnResult(msg, this._requestCode);
    };
    AjaxCaller.prototype.onErrorGetItemsFromServer = function (jqXHR, textStatus, errorThrown) {
        this._numberOfPureServerCalls--;
        if (this._numberOfPureServerCalls === 0) {
            this._resultHandler.AjaxCallFinished(this._requestCode);
        }
        this._resultHandler.OnError(textStatus + " , " + errorThrown, this._requestCode);
    };
    return AjaxCaller;
}());
exports.AjaxCaller = AjaxCaller;
},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CriteriaNumericDictionary = /** @class */ (function () {
    function CriteriaNumericDictionary() {
    }
    return CriteriaNumericDictionary;
}());
exports.CriteriaNumericDictionary = CriteriaNumericDictionary;
},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UserInput = /** @class */ (function () {
    function UserInput() {
        this.ParametersDictionary = {};
    }
    return UserInput;
}());
exports.UserInput = UserInput;
},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AdTransformationSearchCriteria_1 = require("./SearchCriteria/AdTransformationSearchCriteria");
var DefaultSearchCriteria_1 = require("./SearchCriteria/DefaultSearchCriteria");
var CriteriaNumericDictionary_1 = require("../../../Helper/CriteriaNumericDictionary");
var SearchCriteria = /** @class */ (function () {
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
},{"../../../Helper/CriteriaNumericDictionary":7,"./SearchCriteria/AdTransformationSearchCriteria":11,"./SearchCriteria/DefaultSearchCriteria":12}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AjaxCaller_1 = require("../../../Helper/AjaxCaller");
var SearchCriteriaViewLoader = /** @class */ (function () {
    function SearchCriteriaViewLoader(resultHandler, searchCriteriaChange, searchCriteria, requestCode) {
        this.RequestIndexKey = "RequestIndex";
        this._currentRequestIndex = 0;
        this._url = "/Home/GetSearchCriteriaView";
        this._previousCategoryId = 0;
        this._currentCategoryId = 0;
        this._resultHandler = resultHandler;
        this._ajaxCaller = new AjaxCaller_1.AjaxCaller(this._url, this, requestCode);
        this._searchCriteriaChange = searchCriteriaChange;
        this._searchCriteria = searchCriteria;
    }
    SearchCriteriaViewLoader.prototype.GetSearchCriteriaViewFromServer = function (userInput, categoryId) {
        this._currentRequestIndex++;
        this._currentCategoryId = categoryId;
        userInput.ParametersDictionary[this.RequestIndexKey] = this._currentRequestIndex;
        this._ajaxCaller.Call(userInput); //GET
    };
    SearchCriteriaViewLoader.prototype.OnResult = function (param, requestCode) {
        if (param.CustomDictionary[this.RequestIndexKey] == this._currentRequestIndex) {
            if (param.Success == true) {
                this._searchCriteria.UnBind(this._previousCategoryId);
                this._resultHandler.OnResult(param.ResponseData, requestCode);
                this._searchCriteria.Bind(this._currentCategoryId, this._searchCriteriaChange);
                this._previousCategoryId = this._currentCategoryId;
            }
            else {
                this._resultHandler.OnError(param.Message + " , " + param.ErrorCode, requestCode);
            }
        }
    };
    SearchCriteriaViewLoader.prototype.OnError = function (message, requestCode) {
        this._resultHandler.OnError(message, requestCode);
    };
    SearchCriteriaViewLoader.prototype.AjaxCallStarted = function (requestCode) {
        this._resultHandler.AjaxCallStarted(requestCode);
    };
    SearchCriteriaViewLoader.prototype.AjaxCallFinished = function (requestCode) {
        this._resultHandler.AjaxCallFinished(requestCode);
    };
    return SearchCriteriaViewLoader;
}());
exports.SearchCriteriaViewLoader = SearchCriteriaViewLoader;
},{"../../../Helper/AjaxCaller":6}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CarModelBrandController_1 = require("../../../../Components/Transformation/CarModelBrandController");
var DefaultOrderBy_1 = require("../../../../Components/OrderBy/DefaultOrderBy");
var DefaultPriceType_1 = require("../../../../Components/PriceType/DefaultPriceType");
var AdTransformationSearchCriteria = /** @class */ (function () {
    function AdTransformationSearchCriteria() {
        this.MakeYearFromKey = "MakeYearFrom";
        this.MakeYearFromInputId = "fromYear";
        this.MakeYearToKey = "MakeYearTo";
        this.MakeYearToInputId = "toYear";
        this.FuelKey = "Fuel";
        this.FuelSelectId = "fuel";
        this.MileageFromKey = "MileageFrom";
        this.MileageFromInputId = "mileageFrom";
        this.MileageToKey = "MileageTo";
        this.MileageToInputId = "mileageTo";
        this.GearboxKey = "Gearbox";
        this.GearboxTypeSelectId = "gearboxType";
        this.BodyColorKey = "BodyColor";
        this.BodyColorSelectId = "bodyColor";
        this.InternalColorKey = "InternalColor";
        this.InternalColorSelectId = "internalColor";
        this.BodyStatusKey = "BodyStatus";
        this.BodyStatusSelectId = "bodyStatus";
        this.CarStatusKey = "CarStatus";
        this.CarStatusSelectId = "carStatus";
        this.PlateTypeKey = "PlateType";
        this.PlateTypeSelectId = "plateType";
    }
    AdTransformationSearchCriteria.prototype.initView = function () {
        this._carModelBrandContoller = new CarModelBrandController_1.CarModelBrandController();
        this._defaultPriceType = new DefaultPriceType_1.DefaultPriceType();
        this._defaultOrderBy = new DefaultOrderBy_1.DefaultOrderBy();
    };
    AdTransformationSearchCriteria.prototype.registerEvents = function () {
        var _this = this;
        this._defaultPriceType.SelectedPriceTypeChangedEvent.Subscribe(function (sender, args) {
            _this._defaultOrderBy.PriceTypeChanged(sender, args);
        });
    };
    AdTransformationSearchCriteria.prototype.unRegisterEvents = function () {
        var _this = this;
        this._defaultPriceType.SelectedPriceTypeChangedEvent.Unsubscribe(function (sender, args) {
            _this._defaultOrderBy.PriceTypeChanged(sender, args);
        });
    };
    //TODO in orther to minimize bandwidth usage it is good prctice to not send criterias that have default value
    AdTransformationSearchCriteria.prototype.FillCriteria = function (userInput) {
        this._carModelBrandContoller.FillCriteria(userInput);
        this._defaultOrderBy.FillCriteria(userInput);
        this._defaultPriceType.FillCriteria(userInput);
        userInput.ParametersDictionary[this.MakeYearFromKey] =
            $("#" + this.MakeYearFromInputId).val(); //makeYearFrom
        userInput.ParametersDictionary[this.MakeYearToKey] =
            $("#" + this.MakeYearToInputId).val(); //makeYearTo
        userInput.ParametersDictionary[this.FuelKey] =
            $("#" + this.FuelSelectId).find("option:selected").val(); //fuel
        userInput.ParametersDictionary[this.MileageFromKey] =
            $("#" + this.MileageFromInputId).val(); //mileageFrom
        userInput.ParametersDictionary[this.MileageToKey] =
            $("#" + this.MileageToInputId).val(); //mileageTo
        userInput.ParametersDictionary[this.GearboxKey] =
            $("#" + this.GearboxTypeSelectId).find("option:selected").val(); //gearboxType        
        userInput.ParametersDictionary[this.BodyColorKey] =
            $("#" + this.BodyColorSelectId).find("option:selected").val(); //bodyColor
        userInput.ParametersDictionary[this.InternalColorKey] =
            $("#" + this.InternalColorSelectId).find("option:selected").val(); //internalColor        
        userInput.ParametersDictionary[this.BodyStatusKey] =
            $("#" + this.BodyStatusSelectId).find("option:selected").val(); //bodyStatus
        userInput.ParametersDictionary[this.CarStatusKey] =
            $("#" + this.CarStatusSelectId).find("option:selected").val(); //carStatus        
        userInput.ParametersDictionary[this.PlateTypeKey] =
            $("#" + this.PlateTypeSelectId).find("option:selected").val(); //plateType
    };
    AdTransformationSearchCriteria.prototype.BindEvents = function (criteriaChange) {
        this.initView();
        this.registerEvents();
        this._carModelBrandContoller.BindEvents(criteriaChange);
        this._defaultOrderBy.BindEvents(criteriaChange);
        this._defaultPriceType.BindEvents(criteriaChange);
    };
    AdTransformationSearchCriteria.prototype.UnBindEvents = function () {
        this._carModelBrandContoller.UnBindEvents();
        this._defaultOrderBy.UnBindEvents();
        this._defaultPriceType.UnBindEvents();
        this.unRegisterEvents();
    };
    AdTransformationSearchCriteria.prototype.ValidateCriteria = function () { throw new Error("Not implemented"); };
    return AdTransformationSearchCriteria;
}());
exports.AdTransformationSearchCriteria = AdTransformationSearchCriteria;
},{"../../../../Components/OrderBy/DefaultOrderBy":2,"../../../../Components/PriceType/DefaultPriceType":3,"../../../../Components/Transformation/CarModelBrandController":4}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DefaultOrderBy_1 = require("../../../../Components/OrderBy/DefaultOrderBy");
var DefaultPriceType_1 = require("../../../../Components/PriceType/DefaultPriceType");
var DefaultSearchCriteria = /** @class */ (function () {
    function DefaultSearchCriteria() {
    }
    DefaultSearchCriteria.prototype.initView = function () {
        this._defaultPriceType = new DefaultPriceType_1.DefaultPriceType();
        this._defaultOrderBy = new DefaultOrderBy_1.DefaultOrderBy();
    };
    DefaultSearchCriteria.prototype.registerEvents = function () {
        var _this = this;
        this._defaultPriceType.SelectedPriceTypeChangedEvent.Subscribe(function (sender, args) {
            _this._defaultOrderBy.PriceTypeChanged(sender, args);
        });
    };
    DefaultSearchCriteria.prototype.unRegisterEvents = function () {
        var _this = this;
        this._defaultPriceType.SelectedPriceTypeChangedEvent.Unsubscribe(function (sender, args) {
            _this._defaultOrderBy.PriceTypeChanged(sender, args);
        });
    };
    DefaultSearchCriteria.prototype.FillCriteria = function (userInput) {
        this._defaultOrderBy.FillCriteria(userInput);
        this._defaultPriceType.FillCriteria(userInput);
    };
    DefaultSearchCriteria.prototype.BindEvents = function (criteriaChange) {
        this.initView();
        this.registerEvents();
        this._defaultOrderBy.BindEvents(criteriaChange);
        this._defaultPriceType.BindEvents(criteriaChange);
    };
    DefaultSearchCriteria.prototype.UnBindEvents = function () {
        this._defaultOrderBy.UnBindEvents();
        this._defaultPriceType.UnBindEvents();
        this.unRegisterEvents();
    };
    DefaultSearchCriteria.prototype.ValidateCriteria = function () {
        throw new Error("Not implemented");
    };
    return DefaultSearchCriteria;
}());
exports.DefaultSearchCriteria = DefaultSearchCriteria;
},{"../../../../Components/OrderBy/DefaultOrderBy":2,"../../../../Components/PriceType/DefaultPriceType":3}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AjaxCaller_1 = require("../../../Helper/AjaxCaller");
//TODO make count optional to user
var ServerCaller = /** @class */ (function () {
    function ServerCaller(resultHandler, requestCode) {
        this.RequestIndexKey = "RequestIndex";
        this._currentRequestIndex = 0;
        this._url = "/api/AdApi/GetAdvertisementCommon";
        this.StartIndexKey = "StartIndex";
        this._initialStart = 1;
        this._start = 1;
        this.CountKey = "Count";
        this._count = 5;
        this.NumberOfItemsKey = "numberOfItems";
        this._resultHandler = resultHandler;
        this._ajaxCaller = new AjaxCaller_1.AjaxCaller(this._url, this, requestCode);
    }
    ServerCaller.prototype.GetAdItemsFromServer = function (userInput) {
        this._currentRequestIndex++;
        userInput.ParametersDictionary[this.StartIndexKey] = this._start;
        userInput.ParametersDictionary[this.CountKey] = this._count;
        userInput.ParametersDictionary[this.RequestIndexKey] = this._currentRequestIndex;
        this._ajaxCaller.Call(userInput);
    }; //GetAdItemsFromServer
    ServerCaller.prototype.OnResult = function (param, requestCode) {
        //TODO check for undefined or null in msg and msg.customDictionary["RequestIndex"]
        if (param.CustomDictionary[this.RequestIndexKey] == this._currentRequestIndex) {
            if (param.Success == true) {
                this._start += parseInt(param.CustomDictionary[this.NumberOfItemsKey]);
                this._resultHandler.OnResult(param.ResponseData, requestCode);
            } //if (msg.success == true)
            else {
                this._resultHandler.OnError(param.Message + " , " + param.ErrorCode, requestCode);
            }
        }
    };
    ServerCaller.prototype.OnError = function (message, requestCode) {
        this._resultHandler.OnError(message, requestCode);
    };
    ServerCaller.prototype.AjaxCallFinished = function (requestCode) {
        this._resultHandler.AjaxCallFinished(requestCode);
    };
    ServerCaller.prototype.AjaxCallStarted = function (requestCode) {
        this._resultHandler.AjaxCallStarted(requestCode);
    };
    ServerCaller.prototype.ResetSearchParameters = function () {
        this._start = this._initialStart;
    };
    return ServerCaller;
}());
exports.ServerCaller = ServerCaller;
},{"../../../Helper/AjaxCaller":6}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CategorySelection_1 = require("../../../Components/Category/CategorySelection");
var ServerCaller_1 = require("./ServerCaller");
var SearchCriteriaViewLoader_1 = require("./SearchCriteriaViewLoader");
var SearchCriteria_1 = require("./SearchCriteria");
var UserInput_1 = require("../../../Helper/UserInput");
//TODO when category change before search criteia is loaded a search call is sent to server
//add an event like viewLoadStarted, viewLoadInProgress,viewLoadCompleted and disable search
//durng inProgress end enable it after completed
var Index = /** @class */ (function () {
    function Index(categorySelectorParentDivId, allCategoriesId) {
        this.LoadAdImageId = "loadAds";
        this.LoadViewImageId = "loadView";
        this.AdTypeKey = "AdType";
        this.AdTypeParentDivId = "adType";
        this.SearchTextKey = "SearchText";
        this.SearchTextInputId = "searchText";
        this._adPlaceHolderDivId = "adPlaceHolder";
        this._defaultImageInputId = "defaultImage";
        this._getAdFromServerButtonId = "getAdFromServer";
        this._messageDivId = "message";
        this._categorySpecificSearchCriteriaParentDivId = "categorySpecificSearchCriteria";
        this.GetAdFromServerRequestCode = 1;
        this.LoadSearchPartialViewRequestCode = 2;
        this._categorySelectorParentDivId = categorySelectorParentDivId;
        this._allCategoriesId = allCategoriesId;
        this._serverCaller = new ServerCaller_1.ServerCaller(this, this.GetAdFromServerRequestCode);
        this._searchCriteria = new SearchCriteria_1.SearchCriteria();
        this._searchCriteriaViewLoader = new SearchCriteriaViewLoader_1.SearchCriteriaViewLoader(this, this, this._searchCriteria, this.LoadSearchPartialViewRequestCode);
        this.initPage();
        this.initEventHandlers();
    }
    Index.prototype.initPage = function () {
        this.initCategorySelectionControl();
        this.initGetAdFromServer();
        this.initSingleAdItemStyle();
    }; //initPage
    Index.prototype.initCategorySelectionControl = function () {
        var allCategoriesString = $("#" + this._allCategoriesId).val().toString();
        var allCategories = $.parseJSON(allCategoriesString);
        this._categorySelection = new CategorySelection_1.CategorySelection(this._categorySelectorParentDivId, allCategories);
        this._categorySelection.CreateFirstLevel();
    }; //initCategorySelectionControl
    Index.prototype.getSearchCriteriaPartialView = function (categoryId) {
        var userInput = new UserInput_1.UserInput();
        this._categorySelection.InsertCategoryIdInUserInputDictionary(userInput);
        this._searchCriteriaViewLoader.GetSearchCriteriaViewFromServer(userInput, categoryId);
    };
    Index.prototype.initEventHandlers = function () {
        var _this = this;
        this._categorySelection.SelectedCategoryChangedEvent.Subscribe(function (sender, args) {
            _this.searchCriteriaChanged();
            _this.getSearchCriteriaPartialView(args.SelectedCategoryId);
        });
        this.getSearchCriteriaPartialView(this._categorySelection.GetSelectedCategoryId());
        this._searchCriteria.Bind(this._categorySelection.GetSelectedCategoryId(), this);
        $("#" + this.AdTypeParentDivId).on("change", function (event) {
            _this.searchCriteriaChanged();
        });
        $("#" + this.SearchTextInputId).on("input", function () {
            _this.searchCriteriaChanged();
        });
        $(document).keypress(function (e) {
            if (e.which == 13) {
                $("#" + _this._getAdFromServerButtonId).click();
            }
        });
    };
    Index.prototype.CustomCriteriaChanged = function () {
        this.searchCriteriaChanged();
    };
    Index.prototype.searchCriteriaChanged = function () {
        $("#adPlaceHolder").children().remove();
        this._serverCaller.ResetSearchParameters();
        // $("#" + this._getAdFromServerId).trigger("click");
    };
    Index.prototype.initGetAdFromServer = function () {
        var _this = this;
        $("#" + this._getAdFromServerButtonId).on("click", function (event) {
            event.preventDefault();
            var userInput = new UserInput_1.UserInput();
            _this._categorySelection.InsertCategoryIdInUserInputDictionary(userInput);
            userInput.ParametersDictionary[_this.AdTypeKey] = $("#" + _this.AdTypeParentDivId).children(":checked").val();
            userInput.ParametersDictionary[_this.SearchTextKey] = $("#" + _this.SearchTextInputId).val();
            _this._searchCriteria.FillCategorySpecificSearchCriteria(_this._categorySelection.GetSelectedCategoryId(), userInput); //fill category specific search parameters
            _this.removeErrorMessage();
            _this._serverCaller.GetAdItemsFromServer(userInput);
        }); //click
    }; //initGetAdFromServer
    Index.prototype.OnResult = function (msg, requestCode) {
        if (requestCode === this.GetAdFromServerRequestCode) {
            this.onResultGetAdFromServer(msg);
        }
        else if (requestCode === this.LoadSearchPartialViewRequestCode) {
            this.onResultLoadSearchPartialView(msg);
        }
    };
    Index.prototype.OnError = function (message, requestCode) {
        if (requestCode === this.GetAdFromServerRequestCode) {
            this.onErrorGetAdFromServer(message);
        }
        else if (requestCode === this.LoadSearchPartialViewRequestCode) {
            this.onErrorLoadSearchPartialView(message);
        }
    };
    Index.prototype.AjaxCallFinished = function (requestCode) {
        if (requestCode === this.GetAdFromServerRequestCode) {
            this.ajaxCallFinishedGetAdFromServer();
        }
        else if (requestCode === this.LoadSearchPartialViewRequestCode) {
            this.ajaxCallFinishedLoadSearchPartialView();
        }
    };
    Index.prototype.AjaxCallStarted = function (requestCode) {
        if (requestCode === this.GetAdFromServerRequestCode) {
            this.ajaxCallStartedGetAdFromServer();
        }
        else if (requestCode === this.LoadSearchPartialViewRequestCode) {
            this.ajaxCallStartedLoadSearchPartialView();
        }
    };
    Index.prototype.onResultGetAdFromServer = function (advertisementCommons) {
        var template = $('#singleAdItem').html();
        var data;
        for (var i = 0; i < advertisementCommons.length; i++) {
            var adImage;
            if (advertisementCommons[i].AdImages[0] != null) {
                adImage = "data:image/jpg;base64," + advertisementCommons[i].AdImages[0];
            } //end if
            else {
                adImage = "data:image/jpg;base64," + $("#" + this._defaultImageInputId).val();
            }
            data = {
                AdvertisementId: advertisementCommons[i].AdId,
                AdvertisementCategoryId: advertisementCommons[i].CategoryId,
                AdvertisementCategory: advertisementCommons[i].CategoryName,
                adImage: adImage,
                adPrice: advertisementCommons[i].AdPrice.PriceString,
                AdvertisementTitle: advertisementCommons[i].AdTitle,
                AdvertisementStatus: advertisementCommons[i].AdStatus
                //adDate: msg.ResponseData[i].AdTime
            }; //end data
            var html = Mustache.to_html(template, data);
            $("#" + this._adPlaceHolderDivId).append(html);
        } //end for
    };
    Index.prototype.onResultLoadSearchPartialView = function (msg) {
        $("#" + this._categorySpecificSearchCriteriaParentDivId).children().remove();
        $("#" + this._categorySpecificSearchCriteriaParentDivId).html(msg);
    };
    Index.prototype.onErrorGetAdFromServer = function (message) {
        this.showErrorMessage(message);
    };
    Index.prototype.onErrorLoadSearchPartialView = function (message) {
        this.showErrorMessage(message);
    };
    Index.prototype.ajaxCallStartedGetAdFromServer = function () {
        $("#" + this.LoadAdImageId).show();
        $("#" + this._getAdFromServerButtonId).attr("disabled", "disabled");
    };
    Index.prototype.ajaxCallStartedLoadSearchPartialView = function () {
        $("#" + this.LoadViewImageId).show();
    };
    Index.prototype.ajaxCallFinishedGetAdFromServer = function () {
        $("#" + this.LoadAdImageId).hide();
        $("#" + this._getAdFromServerButtonId).removeAttr("disabled");
    };
    Index.prototype.ajaxCallFinishedLoadSearchPartialView = function () {
        $("#" + this.LoadViewImageId).hide();
    };
    Index.prototype.showErrorMessage = function (message) {
        this.removeErrorMessage();
        $("#" + this._messageDivId).append("<p>" + message + "</p>");
    };
    Index.prototype.removeErrorMessage = function () {
        $("#" + this._messageDivId).children().remove();
    };
    Index.prototype.initSingleAdItemStyle = function () {
        //show detail of singleAdItem when mouse over
        $(document).on("mouseenter mouseleave", ".blockDisplay", function (event) {
            $(event.currentTarget).find(".moreInfo").fadeToggle(250);
            //$(this).find(".moreInfo").fadeToggle(250);
        }); //end on
    }; //initSingleAdItemStyle
    return Index;
}());
exports.Index = Index;
var categorySelectorParentDivId = "categorySelector";
var allCategoriesId = "allCategories";
var index;
$(document).ready(function () {
    index = new Index(categorySelectorParentDivId, allCategoriesId);
    index.CustomCriteriaChanged(); //to initiate a server call on page load for first time
    window.AliIndex = index;
}); //ready
},{"../../../Components/Category/CategorySelection":1,"../../../Helper/UserInput":8,"./SearchCriteria":9,"./SearchCriteriaViewLoader":10,"./ServerCaller":13}]},{},[14])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3d3dyb290L2pzL0NvbXBvbmVudHMvQ2F0ZWdvcnkvQ2F0ZWdvcnlTZWxlY3Rpb24udHMiLCJ3d3dyb290L2pzL0NvbXBvbmVudHMvT3JkZXJCeS9EZWZhdWx0T3JkZXJCeS50cyIsInd3d3Jvb3QvanMvQ29tcG9uZW50cy9QcmljZVR5cGUvRGVmYXVsdFByaWNlVHlwZS50cyIsInd3d3Jvb3QvanMvQ29tcG9uZW50cy9UcmFuc2Zvcm1hdGlvbi9DYXJNb2RlbEJyYW5kQ29udHJvbGxlci50cyIsInd3d3Jvb3QvanMvRXZlbnRzL0V2ZW50RGlzcGF0Y2hlci50cyIsInd3d3Jvb3QvanMvSGVscGVyL0FqYXhDYWxsZXIudHMiLCJ3d3dyb290L2pzL0hlbHBlci9Dcml0ZXJpYU51bWVyaWNEaWN0aW9uYXJ5LnRzIiwid3d3cm9vdC9qcy9IZWxwZXIvVXNlcklucHV0LnRzIiwid3d3cm9vdC9qcy9ob21lL2luZGV4L3NyYy9TZWFyY2hDcml0ZXJpYS50cyIsInd3d3Jvb3QvanMvaG9tZS9pbmRleC9zcmMvU2VhcmNoQ3JpdGVyaWFWaWV3TG9hZGVyLnRzIiwid3d3cm9vdC9qcy9ob21lL2luZGV4L3NyYy9TZWFyY2hDcml0ZXJpYS9BZFRyYW5zZm9ybWF0aW9uU2VhcmNoQ3JpdGVyaWEudHMiLCJ3d3dyb290L2pzL2hvbWUvaW5kZXgvc3JjL1NlYXJjaENyaXRlcmlhL0RlZmF1bHRTZWFyY2hDcml0ZXJpYS50cyIsInd3d3Jvb3QvanMvaG9tZS9pbmRleC9zcmMvU2VydmVyQ2FsbGVyLnRzIiwid3d3cm9vdC9qcy9ob21lL2luZGV4L3NyYy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUMsZ0VBQStEO0FBSWhFO0lBMkJJLDJCQUFZLFdBQW1CLEVBQUUsYUFBeUI7UUF6Qm5ELGlDQUE0QixHQUFnRSxJQUFJLGlDQUFlLEVBQThDLENBQUM7UUFFcEosa0JB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RixDQUFDLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDekQsNENBQTRDO1FBQ2hELENBQUMsQ0FBQyxDQUFDLENBQUEsUUFBUTtJQUNmLENBQUMsRUFBQSx1QkFBdUI7SUFDNUIsWUFBQztBQUFELENBdk9BLEFBdU9DLElBQUE7QUF2T1ksc0JBQUs7QUF5T2xCLElBQUksMkJBQTJCLEdBQVcsa0JBQWtCLENBQUM7QUFDN0QsSUFBSSxlQUFlLEdBQUcsZUFBZSxDQUFDO0FBR3RDLElBQUksS0FBWSxDQUFDO0FBR2pCLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLENBQUM7SUFDZCxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsMkJBQTJCLEVBQUUsZUFBZSxDQUFDLENBQUM7SUFDaEUsS0FBSyxDQUFDLHFCQUFxQixFQUFFLENBQUMsQ0FBQSx1REFBdUQ7SUFDckYsTUFBTSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7QUFDNUIsQ0FBQyxDQUFDLENBQUMsQ0FBQSxPQUFPIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIu+7v2ltcG9ydCB7IEV2ZW50RGlzcGF0Y2hlciB9IGZyb20gXCIuLi8uLi9FdmVudHMvRXZlbnREaXNwYXRjaGVyXCI7XHJcbmltcG9ydCB7IENhdGVnb3J5IH0gZnJvbSBcIi4uLy4uL01vZGVscy9DYXRlZ29yeVwiO1xyXG5pbXBvcnQgeyBVc2VySW5wdXQgfSBmcm9tIFwiLi4vLi4vSGVscGVyL1VzZXJJbnB1dFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIENhdGVnb3J5U2VsZWN0aW9uIHtcclxuXHJcbiAgICBwdWJsaWMgU2VsZWN0ZWRDYXRlZ29yeUNoYW5nZWRFdmVudDogRXZlbnREaXNwYXRjaGVyPENhdGVnb3J5U2VsZWN0aW9uLCBDYXRlZ29yeUNhaG5nZWRFdmVudEFyZz4gPSBuZXcgRXZlbnREaXNwYXRjaGVyPENhdGVnb3J5U2VsZWN0aW9uLCBDYXRlZ29yeUNhaG5nZWRFdmVudEFyZz4oKTtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IENhdGVnb3J5SWRLZXkgPSBcIkNhdGVnb3J5SWRcIjtcclxuXHJcbiAgICBwcml2YXRlIF9wYXJlbnREaXZJZDogc3RyaW5nOy8vZGl2IGVsZW1lbnQgdGhhdCBob2xkcyBhbGwgQ2F0ZWdvcnlTZWxlY3Rpb24gZWxlbWVudHNcclxuICAgIHByaXZhdGUgX2FsbENhdGVnb3JpZXM6IENhdGVnb3J5W107XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfZmlyc3RMZXZlbFRlbXBsYXRlID0gXCJjYXRlZ29yeTFUZW1wbGF0ZVwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfZmlyc3RMZXZlbERpdiA9IFwiY2F0ZWdvcnkxXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9maXJzdExldmVsU2VsZWN0OiBzdHJpbmcgPSBcInNlbGVjdDFcIjtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9zZWNvbmRMZXZlbFRlbXBsYXRlID0gXCJjYXRlZ29yeTJUZW1wbGF0ZVwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfc2Vjb25kTGV2ZWxEaXYgPSBcImNhdGVnb3J5MlwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfc2Vjb25kTGV2ZWxTZWxlY3Q6IHN0cmluZyA9IFwic2VsZWN0MlwiO1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX3RoaXJkTGV2ZWxUZW1wbGF0ZSA9IFwiY2F0ZWdvcnkzVGVtcGxhdGVcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX3RoaXJkTGV2ZWxEaXYgPSBcImNhdGVnb3J5M1wiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfdGhpcmRMZXZlbFNlbGVjdDogc3RyaW5nID0gXCJzZWxlY3QzXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9yb290Q2F0ZWdvcnlJZDogbnVtYmVyID0gMDtcclxuXHJcbiAgICBwcml2YXRlIF9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbE9uZTogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBfc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUd286IG51bWJlcjtcclxuICAgIHByaXZhdGUgX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVGhyZWU6IG51bWJlcjtcclxuXHJcblxyXG4gICAgY29uc3RydWN0b3IocGFyZW50RGl2SWQ6IHN0cmluZywgYWxsQ2F0ZWdvcmllczogQ2F0ZWdvcnlbXSkge1xyXG4gICAgICAgIHRoaXMuX3BhcmVudERpdklkID0gcGFyZW50RGl2SWQ7XHJcbiAgICAgICAgdGhpcy5fYWxsQ2F0ZWdvcmllcyA9IGFsbENhdGVnb3JpZXM7XHJcbiAgICB9XHJcblxyXG4gICAgXHJcblxyXG4gICAgcHVibGljIFNldENhdGVnb3J5SWQoc2VsZWN0ZWRDYXRlZ29yeUlkOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICBsZXQgZmlyc3RMZXZlbElkOiBudW1iZXI7XHJcbiAgICAgICAgbGV0IHNlY29uZExldmVsSWQ6IG51bWJlcjtcclxuICAgICAgICBsZXQgY2F0ZWdvcnlMZXZlbCA9IHRoaXMuZ2V0Q2F0ZWdvcnlMZXZlbChzZWxlY3RlZENhdGVnb3J5SWQpO1xyXG4gICAgICAgIHN3aXRjaCAoY2F0ZWdvcnlMZXZlbCkge1xyXG4gICAgICAgIGNhc2UgQ2F0ZWdvcnlMZXZlbC5Vbmtvd246XHJcbiAgICAgICAgICAgIHRoaXMuQ3JlYXRlRmlyc3RMZXZlbCgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgQ2F0ZWdvcnlMZXZlbC5MZXZlbDE6XHJcbiAgICAgICAgICAgICAgICB0aGlzLkNyZWF0ZUZpcnN0TGV2ZWwoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0Rmlyc3RMZXZlbFRvU3BlY2lmaWNJZChzZWxlY3RlZENhdGVnb3J5SWQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVTZWNvbmRMZXZlbChzZWxlY3RlZENhdGVnb3J5SWQpO1xyXG4gICAgICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuX2ZpcnN0TGV2ZWxTZWxlY3QpLnRyaWdnZXIoXCJjaGFuZ2VcIik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBDYXRlZ29yeUxldmVsLkxldmVsMjpcclxuICAgICAgICAgICAgICAgIHRoaXMuQ3JlYXRlRmlyc3RMZXZlbCgpO1xyXG4gICAgICAgICAgICAgICAgZmlyc3RMZXZlbElkID0gdGhpcy5fYWxsQ2F0ZWdvcmllcy5maWx0ZXIoY2F0ZWdvcnkgPT4gY2F0ZWdvcnkuQ2F0ZWdvcnlJZCA9PT0gc2VsZWN0ZWRDYXRlZ29yeUlkKVswXVxyXG4gICAgICAgICAgICAgICAgICAgIC5DYXRlZ29yeVBhcmVudElkO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRGaXJzdExldmVsVG9TcGVjaWZpY0lkKGZpcnN0TGV2ZWxJZCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVNlY29uZExldmVsKGZpcnN0TGV2ZWxJZCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFNlY29uZExldmVsVG9TcGVjaWZpY0lkKHNlbGVjdGVkQ2F0ZWdvcnlJZCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVRoaXJkTGV2ZWwoc2VsZWN0ZWRDYXRlZ29yeUlkKTtcclxuICAgICAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLl9zZWNvbmRMZXZlbFNlbGVjdCkudHJpZ2dlcihcImNoYW5nZVwiKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgQ2F0ZWdvcnlMZXZlbC5MZXZlbDM6XHJcbiAgICAgICAgICAgIHRoaXMuQ3JlYXRlRmlyc3RMZXZlbCgpO1xyXG4gICAgICAgICAgICBzZWNvbmRMZXZlbElkID0gdGhpcy5fYWxsQ2F0ZWdvcmllcy5maWx0ZXIoY2F0ZWdvcnkgPT4gY2F0ZWdvcnkuQ2F0ZWdvcnlJZCA9PT0gc2VsZWN0ZWRDYXRlZ29yeUlkKVswXVxyXG4gICAgICAgICAgICAgICAgICAgIC5DYXRlZ29yeVBhcmVudElkO1xyXG4gICAgICAgICAgICBmaXJzdExldmVsSWQgPSB0aGlzLl9hbGxDYXRlZ29yaWVzLmZpbHRlcihjYXRlZ29yeSA9PiBjYXRlZ29yeS5DYXRlZ29yeUlkID09PSBzZWNvbmRMZXZlbElkKVswXVxyXG4gICAgICAgICAgICAgICAgLkNhdGVnb3J5UGFyZW50SWQ7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0Rmlyc3RMZXZlbFRvU3BlY2lmaWNJZChmaXJzdExldmVsSWQpO1xyXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVNlY29uZExldmVsKGZpcnN0TGV2ZWxJZCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0U2Vjb25kTGV2ZWxUb1NwZWNpZmljSWQoc2Vjb25kTGV2ZWxJZCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVRoaXJkTGV2ZWwoc2Vjb25kTGV2ZWxJZCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFRoaXJkTGV2ZWxUb1NwZWNpZmljSWQoc2VsZWN0ZWRDYXRlZ29yeUlkKTtcclxuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuX3RoaXJkTGV2ZWxTZWxlY3QpLnRyaWdnZXIoXCJjaGFuZ2VcIik7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldEZpcnN0TGV2ZWxUb1NwZWNpZmljSWQoY2F0ZWdvcnlJZDogbnVtYmVyKSB7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX2ZpcnN0TGV2ZWxTZWxlY3QpLnZhbChjYXRlZ29yeUlkKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgc2V0U2Vjb25kTGV2ZWxUb1NwZWNpZmljSWQoY2F0ZWdvcnlJZDogbnVtYmVyKSB7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX3NlY29uZExldmVsU2VsZWN0KS52YWwoY2F0ZWdvcnlJZCk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHNldFRoaXJkTGV2ZWxUb1NwZWNpZmljSWQoY2F0ZWdvcnlJZDogbnVtYmVyKSB7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX3RoaXJkTGV2ZWxTZWxlY3QpLnZhbChjYXRlZ29yeUlkKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgZ2V0Q2F0ZWdvcnlMZXZlbChjYXRlZ29yeUlkOiBudW1iZXIpOiBDYXRlZ29yeUxldmVsIHtcclxuXHJcbiAgICAgICAgbGV0IHRlbXBDYXRlZ29yeUFycmF5ID0gdGhpcy5fYWxsQ2F0ZWdvcmllcy5maWx0ZXIoY2F0ZWdvcnkgPT4gY2F0ZWdvcnkuQ2F0ZWdvcnlJZCA9PT0gY2F0ZWdvcnlJZCk7XHJcbiAgICAgICAgbGV0IHRlbXBDYXRlZ29yeTtcclxuICAgICAgICBpZiAodGVtcENhdGVnb3J5QXJyYXkubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBDYXRlZ29yeUxldmVsLlVua293bjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGVtcENhdGVnb3J5ID0gdGVtcENhdGVnb3J5QXJyYXlbMF07XHJcbiAgICAgICAgaWYgKHRlbXBDYXRlZ29yeS5QYXJlbnRDYXRlZ29yeUlkID09PSB0aGlzLl9yb290Q2F0ZWdvcnlJZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gQ2F0ZWdvcnlMZXZlbC5MZXZlbDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRlbXBDYXRlZ29yeSA9IHRoaXMuX2FsbENhdGVnb3JpZXMuZmlsdGVyKGNhdGVnb3J5ID0+IGNhdGVnb3J5LkNhdGVnb3J5SWQgPT09IHRlbXBDYXRlZ29yeS5QYXJlbnRDYXRlZ29yeUlkKVswXTtcclxuICAgICAgICBpZiAodGVtcENhdGVnb3J5LlBhcmVudENhdGVnb3J5SWQgPT09IHRoaXMuX3Jvb3RDYXRlZ29yeUlkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBDYXRlZ29yeUxldmVsLkxldmVsMjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIENhdGVnb3J5TGV2ZWwuTGV2ZWwzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBJbnNlcnRDYXRlZ29yeUlkSW5Vc2VySW5wdXREaWN0aW9uYXJ5KHVzZXJJbnB1dDogVXNlcklucHV0KTogdm9pZCB7XHJcbiAgICAgICAgbGV0IGNhdGVnb3J5SWQgPSB0aGlzLkdldFNlbGVjdGVkQ2F0ZWdvcnlJZCgpO1xyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLkNhdGVnb3J5SWRLZXldID0gY2F0ZWdvcnlJZDsvLzEwMCBmb3IgY2Fyc1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBHZXRTZWxlY3RlZENhdGVnb3J5SWQoKTogbnVtYmVyIHtcclxuICAgICAgICBpZiAodGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUaHJlZSAhPT0gdW5kZWZpbmVkICYmXHJcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVGhyZWUgIT09IHRoaXMuX3Jvb3RDYXRlZ29yeUlkKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUaHJlZTtcclxuICAgICAgICBlbHNlIGlmICh0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFR3byAhPT0gdW5kZWZpbmVkICYmXHJcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVHdvICE9PSB0aGlzLl9yb290Q2F0ZWdvcnlJZClcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVHdvO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsT25lO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBDcmVhdGVGaXJzdExldmVsKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMucmVtb3ZlRWxlbWVudCh0aGlzLl9maXJzdExldmVsRGl2KTtcclxuICAgICAgICB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbE9uZSA9IHRoaXMuX3Jvb3RDYXRlZ29yeUlkO1xyXG4gICAgICAgIHRoaXMucmVtb3ZlRWxlbWVudCh0aGlzLl9zZWNvbmRMZXZlbERpdik7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUd28gPSB0aGlzLl9yb290Q2F0ZWdvcnlJZDtcclxuICAgICAgICB0aGlzLnJlbW92ZUVsZW1lbnQodGhpcy5fdGhpcmRMZXZlbERpdik7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUaHJlZSA9IHRoaXMuX3Jvb3RDYXRlZ29yeUlkO1xyXG5cclxuICAgICAgICBsZXQgdGVtcGxhdGUgPSAkKFwiI1wiICsgdGhpcy5fZmlyc3RMZXZlbFRlbXBsYXRlKS5odG1sKCk7XHJcbiAgICAgICAgbGV0IGNhdGVnb3JpZXM6IENhdGVnb3J5W10gPSBuZXcgQXJyYXk8Q2F0ZWdvcnk+KCk7XHJcbiAgICAgICAgbGV0IGRhdGEgPSB7IGNhdGVnb3JpZXM6IGNhdGVnb3JpZXMgfVxyXG4gICAgICAgIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsT25lID0gdGhpcy5fcm9vdENhdGVnb3J5SWQ7Ly9cclxuICAgICAgICB0aGlzLl9hbGxDYXRlZ29yaWVzLmZvckVhY2goY2F0ZWdvcnkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoY2F0ZWdvcnkuQ2F0ZWdvcnlQYXJlbnRJZCA9PT0gdGhpcy5fcm9vdENhdGVnb3J5SWQpIHtcclxuICAgICAgICAgICAgICAgIGNhdGVnb3JpZXMucHVzaChjYXRlZ29yeSk7XHJcbiAgICAgICAgICAgIH0vL2lmXHJcbiAgICAgICAgfSk7Ly9mb3JFYWNoXHJcblxyXG4gICAgICAgIGxldCBodG1sID0gTXVzdGFjaGUudG9faHRtbCh0ZW1wbGF0ZSwgZGF0YSk7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX3BhcmVudERpdklkKS5hcHBlbmQoaHRtbCk7XHJcblxyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9maXJzdExldmVsU2VsZWN0KS5jaGFuZ2UoKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBzZWxlY3RlZElkID0gcGFyc2VJbnQoJChldmVudC5jdXJyZW50VGFyZ2V0KS52YWwoKS50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxPbmUgPSBzZWxlY3RlZElkO1xyXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVNlY29uZExldmVsKHNlbGVjdGVkSWQpO1xyXG4gICAgICAgICAgICBsZXQgZXZlbnRBcmcgPSBuZXcgQ2F0ZWdvcnlDYWhuZ2VkRXZlbnRBcmcoKTtcclxuICAgICAgICAgICAgZXZlbnRBcmcuU2VsZWN0ZWRDYXRlZ29yeUlkID0gdGhpcy5HZXRTZWxlY3RlZENhdGVnb3J5SWQoKTtcclxuICAgICAgICAgICAgZXZlbnRBcmcuU2VsZWN0ZWRDYXRlZ29yeUhhc0NoaWxkID0gdGhpcy5zZWxlY3RlZENhdGVnb3J5SGFzQ2hpbGRyZW4oKTtcclxuICAgICAgICAgICAgdGhpcy5TZWxlY3RlZENhdGVnb3J5Q2hhbmdlZEV2ZW50LkRpc3BhdGNoKHRoaXMsIGV2ZW50QXJnKTtcclxuICAgICAgICB9KTsvL2NoYW5nZVxyXG4gICAgfS8vQ3JlYXRlRmlyc3RMZXZlbFxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlU2Vjb25kTGV2ZWwoZmlyc3RMZXZlbENhdGVnb3J5SWQ6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMucmVtb3ZlRWxlbWVudCh0aGlzLl9zZWNvbmRMZXZlbERpdik7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUd28gPSB0aGlzLl9yb290Q2F0ZWdvcnlJZDtcclxuICAgICAgICB0aGlzLnJlbW92ZUVsZW1lbnQodGhpcy5fdGhpcmRMZXZlbERpdik7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUaHJlZSA9IHRoaXMuX3Jvb3RDYXRlZ29yeUlkO1xyXG4gICAgICAgIGlmIChmaXJzdExldmVsQ2F0ZWdvcnlJZCA9PT0gdGhpcy5fcm9vdENhdGVnb3J5SWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHRlbXBsYXRlID0gJChcIiNcIiArIHRoaXMuX3NlY29uZExldmVsVGVtcGxhdGUpLmh0bWwoKTtcclxuICAgICAgICBsZXQgY2F0ZWdvcmllczogQ2F0ZWdvcnlbXSA9IG5ldyBBcnJheTxDYXRlZ29yeT4oKTtcclxuICAgICAgICBsZXQgZGF0YSA9IHsgY2F0ZWdvcmllczogY2F0ZWdvcmllcyB9XHJcblxyXG4gICAgICAgIHRoaXMuX2FsbENhdGVnb3JpZXMuZm9yRWFjaChjYXRlZ29yeSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChjYXRlZ29yeS5DYXRlZ29yeVBhcmVudElkID09PSBmaXJzdExldmVsQ2F0ZWdvcnlJZCkge1xyXG4gICAgICAgICAgICAgICAgY2F0ZWdvcmllcy5wdXNoKGNhdGVnb3J5KTtcclxuICAgICAgICAgICAgfS8vaWZcclxuICAgICAgICB9KTsvL2ZvckVhY2hcclxuXHJcbiAgICAgICAgbGV0IGh0bWwgPSBNdXN0YWNoZS50b19odG1sKHRlbXBsYXRlLCBkYXRhKTtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fcGFyZW50RGl2SWQpLmFwcGVuZChodG1sKTtcclxuXHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX3NlY29uZExldmVsU2VsZWN0KS5jaGFuZ2UoKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBzZWxlY3RlZElkID0gcGFyc2VJbnQoJChldmVudC5jdXJyZW50VGFyZ2V0KS52YWwoKS50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUd28gPSBzZWxlY3RlZElkO1xyXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVRoaXJkTGV2ZWwoc2VsZWN0ZWRJZCk7XHJcbiAgICAgICAgICAgIGxldCBldmVudEFyZyA9IG5ldyBDYXRlZ29yeUNhaG5nZWRFdmVudEFyZygpO1xyXG4gICAgICAgICAgICBldmVudEFyZy5TZWxlY3RlZENhdGVnb3J5SWQgPSB0aGlzLkdldFNlbGVjdGVkQ2F0ZWdvcnlJZCgpO1xyXG4gICAgICAgICAgICBldmVudEFyZy5TZWxlY3RlZENhdGVnb3J5SGFzQ2hpbGQgPSB0aGlzLnNlbGVjdGVkQ2F0ZWdvcnlIYXNDaGlsZHJlbigpO1xyXG4gICAgICAgICAgICB0aGlzLlNlbGVjdGVkQ2F0ZWdvcnlDaGFuZ2VkRXZlbnQuRGlzcGF0Y2godGhpcywgZXZlbnRBcmcpO1xyXG4gICAgICAgIH0pOy8vY2hhbmdlXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVUaGlyZExldmVsKHNlY29uZExldmVsQ2F0ZWdvcnlJZDogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVFbGVtZW50KHRoaXMuX3RoaXJkTGV2ZWxEaXYpO1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVGhyZWUgPSB0aGlzLl9yb290Q2F0ZWdvcnlJZDtcclxuXHJcbiAgICAgICAgaWYgKHNlY29uZExldmVsQ2F0ZWdvcnlJZCA9PT0gdGhpcy5fcm9vdENhdGVnb3J5SWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHRlbXBsYXRlID0gJChcIiNcIiArIHRoaXMuX3RoaXJkTGV2ZWxUZW1wbGF0ZSkuaHRtbCgpO1xyXG4gICAgICAgIGxldCBjYXRlZ29yaWVzOiBDYXRlZ29yeVtdID0gbmV3IEFycmF5PENhdGVnb3J5PigpO1xyXG4gICAgICAgIGxldCBkYXRhID0geyBjYXRlZ29yaWVzOiBjYXRlZ29yaWVzIH1cclxuXHJcbiAgICAgICAgdGhpcy5fYWxsQ2F0ZWdvcmllcy5mb3JFYWNoKGNhdGVnb3J5ID0+IHtcclxuICAgICAgICAgICAgaWYgKGNhdGVnb3J5LkNhdGVnb3J5UGFyZW50SWQgPT09IHNlY29uZExldmVsQ2F0ZWdvcnlJZCkge1xyXG4gICAgICAgICAgICAgICAgY2F0ZWdvcmllcy5wdXNoKGNhdGVnb3J5KTtcclxuICAgICAgICAgICAgfS8vaWZcclxuICAgICAgICB9KTsvL2ZvckVhY2hcclxuICAgICAgICBpZiAoY2F0ZWdvcmllcy5sZW5ndGggPT09IDApIHsvL05vIEl0ZW0gaW4gdGhpcmQgbGV2ZWwgY2F0ZWdvcnlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgaHRtbCA9IE11c3RhY2hlLnRvX2h0bWwodGVtcGxhdGUsIGRhdGEpO1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9wYXJlbnREaXZJZCkuYXBwZW5kKGh0bWwpO1xyXG5cclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fdGhpcmRMZXZlbFNlbGVjdCkuY2hhbmdlKChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFRocmVlID0gcGFyc2VJbnQoJChldmVudC5jdXJyZW50VGFyZ2V0KS52YWwoKS50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgbGV0IGV2ZW50QXJnID0gbmV3IENhdGVnb3J5Q2FobmdlZEV2ZW50QXJnKCk7XHJcbiAgICAgICAgICAgIGV2ZW50QXJnLlNlbGVjdGVkQ2F0ZWdvcnlJZCA9IHRoaXMuR2V0U2VsZWN0ZWRDYXRlZ29yeUlkKCk7XHJcbiAgICAgICAgICAgIGV2ZW50QXJnLlNlbGVjdGVkQ2F0ZWdvcnlIYXNDaGlsZCA9IHRoaXMuc2VsZWN0ZWRDYXRlZ29yeUhhc0NoaWxkcmVuKCk7XHJcbiAgICAgICAgICAgIHRoaXMuU2VsZWN0ZWRDYXRlZ29yeUNoYW5nZWRFdmVudC5EaXNwYXRjaCh0aGlzLCBldmVudEFyZyk7XHJcbiAgICAgICAgfSk7Ly9jaGFuZ2VcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNlbGVjdGVkQ2F0ZWdvcnlIYXNDaGlsZHJlbigpOiBib29sZWFuIHtcclxuICAgICAgICBsZXQgc2VsZWN0ZWRDYXRlZ29yeUlkID0gdGhpcy5HZXRTZWxlY3RlZENhdGVnb3J5SWQoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fYWxsQ2F0ZWdvcmllcy5maWx0ZXJcclxuICAgICAgICAgICAgKChjYXRlZ29yeSkgPT4geyByZXR1cm4gY2F0ZWdvcnkuQ2F0ZWdvcnlQYXJlbnRJZCA9PT0gc2VsZWN0ZWRDYXRlZ29yeUlkIH0pLmxlbmd0aCA+IDA7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZW1vdmVFbGVtZW50KGlkOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICAkKFwiI1wiICsgaWQpLnJlbW92ZSgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ2F0ZWdvcnlDYWhuZ2VkRXZlbnRBcmcge1xyXG4gICAgcHVibGljIFNlbGVjdGVkQ2F0ZWdvcnlJZDogbnVtYmVyO1xyXG4gICAgcHVibGljIFNlbGVjdGVkQ2F0ZWdvcnlIYXNDaGlsZDogYm9vbGVhbjtcclxufVxyXG5cclxuZW51bSBDYXRlZ29yeUxldmVsIHtcclxuICAgIExldmVsMSA9IDEsXHJcbiAgICBMZXZlbDIgPSAyLFxyXG4gICAgTGV2ZWwzID0gMyxcclxuICAgIFVua293bj00XHJcbn1cclxuXHJcbiIsIu+7v2ltcG9ydCB7SUNyaXRlcmlhLCBDcml0ZXJpYVZhbGlkYXRvciB9IGZyb20gXCIuLi8uLi9IZWxwZXIvSUNyaXRlcmlhXCI7XHJcbmltcG9ydCB7VXNlcklucHV0fSBmcm9tIFwiLi4vLi4vSGVscGVyL1VzZXJJbnB1dFwiO1xyXG5pbXBvcnQge0lDcml0ZXJpYUNoYW5nZX0gZnJvbSBcIi4uLy4uL0hlbHBlci9JQ3JpdGVyaWFDaGFuZ2VcIjtcclxuaW1wb3J0IHtQcmljZVR5cGV9IGZyb20gXCIuLi9QcmljZVR5cGUvRGVmYXVsdFByaWNlVHlwZVwiO1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBEZWZhdWx0T3JkZXJCeSBpbXBsZW1lbnRzIElDcml0ZXJpYSAge1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBPcmRlckJ5S2V5ID0gXCJPcmRlckJ5XCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IE9yZGVyQnlTZWxlY3RJZCA9IFwib3JkZXJCeVwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBPcmRlckJ5RGl2SWQgPSBcIm9yZGVyQnlEaXZcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgT3JkZXJCeUZpeGVkUHJpY2VUZW1wbGF0ZUlkID0gXCJvcmRlckJ5Rml4ZWRQcmljZVRlbXBsYXRlXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IE9yZGVyQnlPZGVyc1RlbXBsYXRlSWQgPSBcIm9yZGVyQnlPZGVyc1RlbXBsYXRlXCI7XHJcbiAgICBcclxuICAgIHByaXZhdGUgX3NlYXJjaENyaXRlcmlhQ2hhbmdlOiBJQ3JpdGVyaWFDaGFuZ2U7XHJcbiAgICBcclxuICAgIEJpbmRFdmVudHMoY3JpdGVyaWFDaGFuZ2U6IElDcml0ZXJpYUNoYW5nZSk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX3NlYXJjaENyaXRlcmlhQ2hhbmdlID0gY3JpdGVyaWFDaGFuZ2U7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuT3JkZXJCeVNlbGVjdElkKS5vbihcImNoYW5nZVwiLFxyXG4gICAgICAgICAgICAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NlYXJjaENyaXRlcmlhQ2hhbmdlLkN1c3RvbUNyaXRlcmlhQ2hhbmdlZCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBVbkJpbmRFdmVudHMoKTogdm9pZCB7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuT3JkZXJCeVNlbGVjdElkKS5vZmYoXCJjaGFuZ2VcIik7XHJcbiAgICB9XHJcblxyXG4gICAgVmFsaWRhdGVDcml0ZXJpYSgpOiBDcml0ZXJpYVZhbGlkYXRvciB7IHRocm93IG5ldyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZFwiKTsgfVxyXG5cclxuICAgIEZpbGxDcml0ZXJpYSh1c2VySW5wdXQ6IFVzZXJJbnB1dCk6IHZvaWQge1xyXG5cclxuICAgICAgICBsZXQgb3JkZXJCeSA9ICQoXCIjXCIgKyB0aGlzLk9yZGVyQnlTZWxlY3RJZCkudmFsKCkudG9TdHJpbmcoKTtcclxuICAgICAgICB1c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnlbdGhpcy5PcmRlckJ5S2V5XSA9IG9yZGVyQnk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIFByaWNlVHlwZUNoYW5nZWQoc2VuZGVyOm9iamVjdCxhcmdzOlByaWNlVHlwZSk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuVW5CaW5kRXZlbnRzKCk7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuT3JkZXJCeURpdklkKS5jaGlsZHJlbigpLnJlbW92ZSgpO1xyXG4gICAgICAgIGlmIChhcmdzID09PSBQcmljZVR5cGUuRml4ZWQpIHtcclxuICAgICAgICAgICAgdmFyIHRlbXBsYXRlID0gJChcIiNcIit0aGlzLk9yZGVyQnlGaXhlZFByaWNlVGVtcGxhdGVJZCkuaHRtbCgpO1xyXG4gICAgICAgICAgICB2YXIgaHRtbCA9IE11c3RhY2hlLnRvX2h0bWwodGVtcGxhdGUsIG51bGwpO1xyXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5PcmRlckJ5RGl2SWQpLmFwcGVuZChodG1sKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgdmFyIHRlbXBsYXRlID0gJChcIiNcIiArIHRoaXMuT3JkZXJCeU9kZXJzVGVtcGxhdGVJZCkuaHRtbCgpO1xyXG4gICAgICAgICAgICB2YXIgaHRtbCA9IE11c3RhY2hlLnRvX2h0bWwodGVtcGxhdGUsIG51bGwpO1xyXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5PcmRlckJ5RGl2SWQpLmFwcGVuZChodG1sKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5CaW5kRXZlbnRzKHRoaXMuX3NlYXJjaENyaXRlcmlhQ2hhbmdlKTtcclxuICAgIH1cclxuXHJcbiAgIFxyXG59Iiwi77u/aW1wb3J0IHsgSUNyaXRlcmlhLCBDcml0ZXJpYVZhbGlkYXRvciB9IGZyb20gXCIuLi8uLi9IZWxwZXIvSUNyaXRlcmlhXCI7XHJcbmltcG9ydCB7IFVzZXJJbnB1dCB9IGZyb20gXCIuLi8uLi9IZWxwZXIvVXNlcklucHV0XCI7XHJcbmltcG9ydCB7IElDcml0ZXJpYUNoYW5nZSB9IGZyb20gXCIuLi8uLi9IZWxwZXIvSUNyaXRlcmlhQ2hhbmdlXCI7XHJcbmltcG9ydCB7RXZlbnREaXNwYXRjaGVyfSBmcm9tIFwiLi4vLi4vRXZlbnRzL0V2ZW50RGlzcGF0Y2hlclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIERlZmF1bHRQcmljZVR5cGUgaW1wbGVtZW50cyBJQ3JpdGVyaWEge1xyXG5cclxuICAgIHB1YmxpYyBTZWxlY3RlZFByaWNlVHlwZUNoYW5nZWRFdmVudDogRXZlbnREaXNwYXRjaGVyPERlZmF1bHRQcmljZVR5cGUsIFByaWNlVHlwZT4gPVxyXG4gICAgICAgIG5ldyBFdmVudERpc3BhdGNoZXI8RGVmYXVsdFByaWNlVHlwZSwgUHJpY2VUeXBlPigpO1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgUHJpY2VUeXBlS2V5ID0gXCJQcmljZVR5cGVcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgUHJpY2VUeXBlU2VsZWN0SWQgPSBcInByaWNlVHlwZVwiO1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgRml4UHJpY2VEaXZJZCA9XCJmaXhlZFByaWNlXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IE1pbmltdW1QcmljZUtleSA9IFwiTWluaW11bVByaWNlXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9taW5QcmljZUlucHV0SWQgPSBcIm1pblByaWNlXCI7XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBNYXhpbXVtUHJpY2VLZXkgPSBcIk1heGltdW1QcmljZVwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfbWF4UHJpY2VJbnB1dElkID0gXCJtYXhQcmljZVwiO1xyXG4gICAgXHJcbiAgICBwcml2YXRlIF9zZWFyY2hDcml0ZXJpYUNoYW5nZTogSUNyaXRlcmlhQ2hhbmdlO1xyXG5cclxuICAgIHB1YmxpYyBCaW5kRXZlbnRzKGNyaXRlcmlhQ2hhbmdlOiBJQ3JpdGVyaWFDaGFuZ2UpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9zZWFyY2hDcml0ZXJpYUNoYW5nZSA9IGNyaXRlcmlhQ2hhbmdlO1xyXG4gICAgICAgIC8veW91IGNhbiBhbHNvIHVzZXIgXCJpbnB1dFwiIGluc3RlYWQgb2YgXCJjaGFuZ2VcIlxyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9taW5QcmljZUlucHV0SWQpLm9uKFwiY2hhbmdlXCIsXHJcbiAgICAgICAgICAgIChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2VhcmNoQ3JpdGVyaWFDaGFuZ2UuQ3VzdG9tQ3JpdGVyaWFDaGFuZ2VkKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9tYXhQcmljZUlucHV0SWQpLm9uKFwiY2hhbmdlXCIsXHJcbiAgICAgICAgICAgIChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2VhcmNoQ3JpdGVyaWFDaGFuZ2UuQ3VzdG9tQ3JpdGVyaWFDaGFuZ2VkKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLlByaWNlVHlwZVNlbGVjdElkKS5vbihcImNoYW5nZVwiLCAoZXZlbnQpPT4ge1xyXG4gICAgICAgICAgICBsZXQgc2VsZWN0ZWRQcmljZVR5cGUgPSB0aGlzLmdldFByaWNlVHlwZSgkKGV2ZW50LmN1cnJlbnRUYXJnZXQpLnZhbCgpLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICBpZiAoc2VsZWN0ZWRQcmljZVR5cGUgPT09IFByaWNlVHlwZS5GaXhlZCkge1xyXG4gICAgICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuRml4UHJpY2VEaXZJZCkuc2hvdygpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuRml4UHJpY2VEaXZJZCkuaGlkZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuU2VsZWN0ZWRQcmljZVR5cGVDaGFuZ2VkRXZlbnQuRGlzcGF0Y2godGhpcywgc2VsZWN0ZWRQcmljZVR5cGUpO1xyXG4gICAgICAgICAgICB0aGlzLl9zZWFyY2hDcml0ZXJpYUNoYW5nZS5DdXN0b21Dcml0ZXJpYUNoYW5nZWQoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldFByaWNlVHlwZShzdHJpbmdQcmljZVR5cGU6IHN0cmluZyk6IFByaWNlVHlwZSB7XHJcbiAgICAgICAgcmV0dXJuIHBhcnNlSW50KHN0cmluZ1ByaWNlVHlwZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIFVuQmluZEV2ZW50cygpOiB2b2lkIHtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fbWluUHJpY2VJbnB1dElkKS5vZmYoXCJjaGFuZ2VcIik7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX21heFByaWNlSW5wdXRJZCkub2ZmKFwiY2hhbmdlXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBWYWxpZGF0ZUNyaXRlcmlhKCk6IENyaXRlcmlhVmFsaWRhdG9yIHsgdGhyb3cgbmV3IEVycm9yKFwiTm90IGltcGxlbWVudGVkXCIpOyB9XHJcblxyXG4gICAgcHVibGljIEZpbGxDcml0ZXJpYSh1c2VySW5wdXQ6IFVzZXJJbnB1dCk6IHZvaWQge1xyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLlByaWNlVHlwZUtleV0gPSAkKFwiI1wiICsgdGhpcy5QcmljZVR5cGVTZWxlY3RJZCkudmFsKCkudG9TdHJpbmcoKTtcclxuXHJcbiAgICAgICAgaWYgKHBhcnNlSW50KCQoXCIjXCIgKyB0aGlzLlByaWNlVHlwZVNlbGVjdElkKS52YWwoKS50b1N0cmluZygpKSA9PT0gUHJpY2VUeXBlLkZpeGVkKSB7XHJcbiAgICAgICAgICAgIGxldCBtaW5QcmljZSA9IHBhcnNlSW50KCQoXCIjXCIgKyB0aGlzLl9taW5QcmljZUlucHV0SWQpLnZhbCgpLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICB1c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnlbdGhpcy5NaW5pbXVtUHJpY2VLZXldID0gbWluUHJpY2U7XHJcblxyXG4gICAgICAgICAgICBsZXQgbWF4UHJpY2UgPSBwYXJzZUludCgkKFwiI1wiICsgdGhpcy5fbWF4UHJpY2VJbnB1dElkKS52YWwoKS50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuTWF4aW11bVByaWNlS2V5XSA9IG1heFByaWNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGVudW0gUHJpY2VUeXBlIHtcclxuICAgIEZpeGVkID0gMSxcclxuICAgIEFncmVlbWVudCA9IDIsXHJcbiAgICBFeGNoYW5nZSA9IDMsXHJcbiAgICBJbnN0YWxsbWVudCA9IDQsXHJcbiAgICBNb3J0Z2FnZUFuZFJlbnQgPSA1XHJcbn0iLCLvu79pbXBvcnQge0Nhck1vZGVsfSBmcm9tIFwiLi4vLi4vTW9kZWxzL0FkVHJhbnNwb3J0YXRpb24vQ2FyTW9kZWxcIjtcclxuaW1wb3J0IHtVc2VySW5wdXR9IGZyb20gXCIuLi8uLi9IZWxwZXIvVXNlcklucHV0XCI7XHJcbmltcG9ydCB7SUNyaXRlcmlhLENyaXRlcmlhVmFsaWRhdG9yfSBmcm9tIFwiLi4vLi4vSGVscGVyL0lDcml0ZXJpYVwiO1xyXG5pbXBvcnQge0lDcml0ZXJpYUNoYW5nZX0gZnJvbSBcIi4uLy4uL0hlbHBlci9JQ3JpdGVyaWFDaGFuZ2VcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDYXJNb2RlbEJyYW5kQ29udHJvbGxlciBpbXBsZW1lbnRzIElDcml0ZXJpYSB7XHJcbiAgICBWYWxpZGF0ZUNyaXRlcmlhKCk6IENyaXRlcmlhVmFsaWRhdG9yIHsgdGhyb3cgbmV3IEVycm9yKFwiTm90IGltcGxlbWVudGVkXCIpOyB9XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBDYXJCcmFuZElkS2V5OiBzdHJpbmcgPSBcIkJyYW5kSWRcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgQnJhbmRTZWxlY3RJZDogc3RyaW5nID0gXCJicmFuZFwiO1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgQ2FyTW9kZWxUZW1wbGF0ZUlkOiBzdHJpbmcgPSBcIm1vZGVsVGVtcGxhdGVcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgQ2FyTW9kZWxEaXZQbGFjZUhvbGRlcklkOiBzdHJpbmcgPSBcIm1vZGVsUGxhY2VIb2xkZXJcIjtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IENhck1vZGVsSWRLZXk6IHN0cmluZyA9IFwiQ2FyTW9kZWxJZFwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBBbGxDYXJNb2RlbHNJbnB1dElkOiBzdHJpbmcgPSBcImFsbENhck1vZGVsc1wiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBNb2RlbFNlbGVjdElkOiBzdHJpbmcgPSBcIm1vZGVsXCI7XHJcbiAgICBwcml2YXRlIF9hbGxDYXJNb2RlbHM6IENhck1vZGVsW107XHJcblxyXG4gICAgcHJpdmF0ZSBfc2VhcmNoQ3JpdGVyaWFDaGFuZ2U6SUNyaXRlcmlhQ2hhbmdlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuaW5pdFZpZXcoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXRWaWV3KCk6IHZvaWQge1xyXG4gICAgICAgIGxldCBhbGxDYXJNb2RlbHNTdHJpbmcgPSAkKFwiI1wiICsgdGhpcy5BbGxDYXJNb2RlbHNJbnB1dElkKS52YWwoKS50b1N0cmluZygpO1xyXG4gICAgICAgIHRoaXMuX2FsbENhck1vZGVscyA9ICQucGFyc2VKU09OKGFsbENhck1vZGVsc1N0cmluZykgYXMgQ2FyTW9kZWxbXTtcclxuICAgICAgICB0aGlzLmluaXRDYXJNb2RlbCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaW5pdENhck1vZGVsKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuY3JlYXRlQ2FyTW9kZWxFbGVtZW50KG5ldyBBcnJheTxDYXJNb2RlbD4oKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVDYXJNb2RlbEVsZW1lbnQoY2FyTW9kZWxzOiBDYXJNb2RlbFtdKSB7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuQ2FyTW9kZWxEaXZQbGFjZUhvbGRlcklkKS5jaGlsZHJlbigpLnJlbW92ZSgpO1xyXG4gICAgICAgIGxldCB0ZW1wbGF0ZSA9ICQoXCIjXCIgKyB0aGlzLkNhck1vZGVsVGVtcGxhdGVJZCkuaHRtbCgpO1xyXG4gICAgICAgIGxldCBkYXRhID0geyBjYXJNb2RlbHM6IGNhck1vZGVscyB9XHJcbiAgICAgICAgbGV0IGh0bWwgPSBNdXN0YWNoZS50b19odG1sKHRlbXBsYXRlLCBkYXRhKTtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5DYXJNb2RlbERpdlBsYWNlSG9sZGVySWQpLmFwcGVuZChodG1sKTtcclxuICAgICAgICB0aGlzLmJpbmRDYXJNb2RlbCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYmluZENhck1vZGVsKCk6IHZvaWQge1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLk1vZGVsU2VsZWN0SWQpLm9uKFwiY2hhbmdlXCIsKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zZWFyY2hDcml0ZXJpYUNoYW5nZS5DdXN0b21Dcml0ZXJpYUNoYW5nZWQoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1cGRhdGVDYXJNb2RlbFNlbGVjdChicmFuZElkOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICBsZXQgY2FyTW9kZWxzID0gbmV3IEFycmF5PENhck1vZGVsPigpO1xyXG4gICAgICAgIGlmIChicmFuZElkICE9PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2FsbENhck1vZGVscy5mb3JFYWNoKChjYXJNb2RlbCwgaW5kZXgsIGFycmF5KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2FyTW9kZWwuQnJhbmRJZCA9PT0gYnJhbmRJZClcclxuICAgICAgICAgICAgICAgICAgICBjYXJNb2RlbHMucHVzaChjYXJNb2RlbCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNyZWF0ZUNhck1vZGVsRWxlbWVudChjYXJNb2RlbHMpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBGaWxsQ3JpdGVyaWEodXNlcklucHV0OlVzZXJJbnB1dCk6dm9pZCB7XHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuQ2FyQnJhbmRJZEtleV0gPVxyXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5CcmFuZFNlbGVjdElkKS5maW5kKFwib3B0aW9uOnNlbGVjdGVkXCIpLnZhbCgpOy8vYnJhbmRJZFxyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLkNhck1vZGVsSWRLZXldID1cclxuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuTW9kZWxTZWxlY3RJZCkuZmluZChcIm9wdGlvbjpzZWxlY3RlZFwiKS52YWwoKTsvL2Nhck1vZGVsSWRcclxuICAgIH1cclxuXHJcbiAgICBCaW5kRXZlbnRzKGNyaXRlcmlhQ2hhbmdlOiBJQ3JpdGVyaWFDaGFuZ2UpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9zZWFyY2hDcml0ZXJpYUNoYW5nZSA9IGNyaXRlcmlhQ2hhbmdlO1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLkJyYW5kU2VsZWN0SWQpLm9uKFwiY2hhbmdlXCIsIChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgc2VsZWN0ZWRCcmFuZElkOiBudW1iZXIgPSBwYXJzZUludCgkKGV2ZW50LmN1cnJlbnRUYXJnZXQpLmZpbmQoXCJvcHRpb246c2VsZWN0ZWRcIikudmFsKCkudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQ2FyTW9kZWxTZWxlY3Qoc2VsZWN0ZWRCcmFuZElkKTtcclxuICAgICAgICAgICAgY3JpdGVyaWFDaGFuZ2UuQ3VzdG9tQ3JpdGVyaWFDaGFuZ2VkKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuYmluZENhck1vZGVsKCk7XHJcbiAgICB9XHJcblxyXG4gICAgVW5CaW5kRXZlbnRzKCk6IHZvaWQge1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLkJyYW5kU2VsZWN0SWQpLm9mZihcImNoYW5nZVwiKTtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5Nb2RlbFNlbGVjdElkKS5vZmYoXCJjaGFuZ2VcIik7XHJcbiAgICB9XHJcbn0iLCLvu79pbXBvcnQge0lFdmVudH0gIGZyb20gXCIuL0lFdmVudFwiO1xyXG5cclxuXHJcbi8qIFRoZSBkaXNwYXRjaGVyIGhhbmRsZXMgdGhlIHN0b3JhZ2Ugb2Ygc3Vic2NpcHRpb25zIGFuZCBmYWNpbGl0YXRlc1xyXG4gIHN1YnNjcmlwdGlvbiwgdW5zdWJzY3JpcHRpb24gYW5kIGRpc3BhdGNoaW5nIG9mIHRoZSBldmVudCAqL1xyXG5leHBvcnQgIGNsYXNzIEV2ZW50RGlzcGF0Y2hlcjxUU2VuZGVyLCBUQXJncz4gaW1wbGVtZW50cyBJRXZlbnQ8VFNlbmRlciwgVEFyZ3M+IHtcclxuXHJcbiAgICBwcml2YXRlIF9zdWJzY3JpcHRpb25zOiBBcnJheTwoc2VuZGVyOiBUU2VuZGVyLCBhcmdzOiBUQXJncykgPT4gdm9pZD4gPSBuZXcgQXJyYXk8KHNlbmRlcjogVFNlbmRlciwgYXJnczogVEFyZ3MpID0+IHZvaWQ+KCk7XHJcblxyXG4gICAgcHVibGljIFN1YnNjcmliZShmbjogKHNlbmRlcjogVFNlbmRlciwgYXJnczogVEFyZ3MpID0+IHZvaWQpOiB2b2lkIHtcclxuICAgICAgICBpZiAoZm4pIHtcclxuICAgICAgICAgICAgdGhpcy5fc3Vic2NyaXB0aW9ucy5wdXNoKGZuKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljICBVbnN1YnNjcmliZShmbjogKHNlbmRlcjogVFNlbmRlciwgYXJnczogVEFyZ3MpID0+IHZvaWQpOiB2b2lkIHtcclxuICAgICAgICBsZXQgaSA9IHRoaXMuX3N1YnNjcmlwdGlvbnMuaW5kZXhPZihmbik7XHJcbiAgICAgICAgaWYgKGkgPiAtMSkge1xyXG4gICAgICAgICAgICB0aGlzLl9zdWJzY3JpcHRpb25zLnNwbGljZShpLCAxKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljICBEaXNwYXRjaChzZW5kZXI6IFRTZW5kZXIsIGFyZ3M6IFRBcmdzKTogdm9pZCB7XHJcbiAgICAgICAgZm9yIChsZXQgaGFuZGxlciBvZiB0aGlzLl9zdWJzY3JpcHRpb25zKSB7XHJcbiAgICAgICAgICAgIGhhbmRsZXIoc2VuZGVyLCBhcmdzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCLvu79pbXBvcnQge1VzZXJJbnB1dH0gZnJvbSBcIi4vVXNlcklucHV0XCI7XHJcbmltcG9ydCB7SVJlc3VsdEhhbmRsZXJ9IGZyb20gXCIuL0lSZXN1bHRIYW5kbGVyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQWpheENhbGxlciB7XHJcblxyXG4gICAgcHJpdmF0ZSBfbnVtYmVyT2ZQdXJlU2VydmVyQ2FsbHM6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF91cmw6IHN0cmluZztcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgIF9yZXN1bHRIYW5kbGVyOiBJUmVzdWx0SGFuZGxlcjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX3JlcXVlc3RDb2RlOm51bWJlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih1cmw6IHN0cmluZywgcmVzdWx0SGFuZGxlcjogSVJlc3VsdEhhbmRsZXIscmVxdWVzdENvZGU6bnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fdXJsID0gdXJsO1xyXG4gICAgICAgIHRoaXMuX3Jlc3VsdEhhbmRsZXIgPSByZXN1bHRIYW5kbGVyO1xyXG4gICAgICAgIHRoaXMuX3JlcXVlc3RDb2RlID0gcmVxdWVzdENvZGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIENhbGwodXNlcklucHV0OiBVc2VySW5wdXQpOiB2b2lkIHtcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0eXBlOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgdXJsOiB0aGlzLl91cmwsXHJcbiAgICAgICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeSksIC8vRGF0YSBzZW50IHRvIHNlcnZlclxyXG4gICAgICAgICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLCAvLyBjb250ZW50IHR5cGUgc2VudCB0byBzZXJ2ZXJcclxuICAgICAgICAgICAgc3VjY2VzczogKG1zZywgdGV4dFN0YXR1cywganFYSFIpID0+IHRoaXMub25TdWNjZXNzR2V0SXRlbXNGcm9tU2VydmVyKG1zZywgdGV4dFN0YXR1cywganFYSFIpLCAvL09uIFN1Y2Nlc3NmdWxsIHNlcnZpY2UgY2FsbFxyXG4gICAgICAgICAgICBlcnJvcjogKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikgPT4gdGhpcy5vbkVycm9yR2V0SXRlbXNGcm9tU2VydmVyKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikgLy8gV2hlbiBTZXJ2aWNlIGNhbGwgZmFpbHNcclxuICAgICAgICB9KTsgLy8uYWpheFxyXG5cclxuICAgICAgICB0aGlzLl9udW1iZXJPZlB1cmVTZXJ2ZXJDYWxscysrO1xyXG4gICAgICAgIHRoaXMuX3Jlc3VsdEhhbmRsZXIuQWpheENhbGxTdGFydGVkKHRoaXMuX3JlcXVlc3RDb2RlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9uU3VjY2Vzc0dldEl0ZW1zRnJvbVNlcnZlcihtc2c6IGFueSwgdGV4dFN0YXR1czogc3RyaW5nLCBqcVhIUjogSlF1ZXJ5WEhSKSB7XHJcblxyXG4gICAgICAgIHRoaXMuX251bWJlck9mUHVyZVNlcnZlckNhbGxzLS07XHJcbiAgICAgICAgaWYgKHRoaXMuX251bWJlck9mUHVyZVNlcnZlckNhbGxzID09PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Jlc3VsdEhhbmRsZXIuQWpheENhbGxGaW5pc2hlZCh0aGlzLl9yZXF1ZXN0Q29kZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3Jlc3VsdEhhbmRsZXIuT25SZXN1bHQobXNnLCB0aGlzLl9yZXF1ZXN0Q29kZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvbkVycm9yR2V0SXRlbXNGcm9tU2VydmVyKGpxWEhSOiBKUXVlcnlYSFIsIHRleHRTdGF0dXM6IHN0cmluZywgZXJyb3JUaHJvd246IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuX251bWJlck9mUHVyZVNlcnZlckNhbGxzLS07XHJcbiAgICAgICAgaWYgKHRoaXMuX251bWJlck9mUHVyZVNlcnZlckNhbGxzID09PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Jlc3VsdEhhbmRsZXIuQWpheENhbGxGaW5pc2hlZCh0aGlzLl9yZXF1ZXN0Q29kZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9yZXN1bHRIYW5kbGVyLk9uRXJyb3IodGV4dFN0YXR1cyArIFwiICwgXCIgKyBlcnJvclRocm93biwgdGhpcy5fcmVxdWVzdENvZGUpO1xyXG4gICAgfVxyXG59Iiwi77u/aW1wb3J0IHsgSUNyaXRlcmlhfSBmcm9tIFwiLi9JQ3JpdGVyaWFcIjtcclxuaW1wb3J0IHsgTnVtZXJpY0RpY3Rpb25hcnkgfSBmcm9tIFwibG9kYXNoL2luZGV4XCI7XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIENyaXRlcmlhTnVtZXJpY0RpY3Rpb25hcnkgaW1wbGVtZW50cyBOdW1lcmljRGljdGlvbmFyeTxJQ3JpdGVyaWE+IHtcclxuICAgIFtpbmRleDogbnVtYmVyXTogSUNyaXRlcmlhO1xyXG59Iiwi77u/aW50ZXJmYWNlIExvb3NlT2JqZWN0IHtcclxuICAgIFtrZXk6IHN0cmluZ106IGFueVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVXNlcklucHV0IHtcclxuICAgIHB1YmxpYyBQYXJhbWV0ZXJzRGljdGlvbmFyeTogTG9vc2VPYmplY3QgPSB7fTtcclxufVxyXG5cclxuXHJcblxyXG4iLCLvu79pbXBvcnQge0FkVHJhbnNmb3JtYXRpb25TZWFyY2hDcml0ZXJpYX0gZnJvbSBcIi4vU2VhcmNoQ3JpdGVyaWEvQWRUcmFuc2Zvcm1hdGlvblNlYXJjaENyaXRlcmlhXCI7XHJcbmltcG9ydCB7RGVmYXVsdFNlYXJjaENyaXRlcmlhfSBmcm9tIFwiLi9TZWFyY2hDcml0ZXJpYS9EZWZhdWx0U2VhcmNoQ3JpdGVyaWFcIjtcclxuaW1wb3J0IHtJQ3JpdGVyaWF9IGZyb20gXCIuLi8uLi8uLi9IZWxwZXIvSUNyaXRlcmlhXCI7XHJcbmltcG9ydCB7VXNlcklucHV0fSBmcm9tIFwiLi4vLi4vLi4vSGVscGVyL1VzZXJJbnB1dFwiO1xyXG5pbXBvcnQge0lDcml0ZXJpYUNoYW5nZX0gZnJvbSBcIi4uLy4uLy4uL0hlbHBlci9JQ3JpdGVyaWFDaGFuZ2VcIjtcclxuaW1wb3J0IHtDcml0ZXJpYU51bWVyaWNEaWN0aW9uYXJ5fSBmcm9tIFwiLi4vLi4vLi4vSGVscGVyL0NyaXRlcmlhTnVtZXJpY0RpY3Rpb25hcnlcIjtcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgU2VhcmNoQ3JpdGVyaWEge1xyXG4gICAgcHJpdmF0ZSBfc2VhcmNoQ3JpdGVyaWFJb2NDb250YWluZXI6IENyaXRlcmlhTnVtZXJpY0RpY3Rpb25hcnkgO1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5fc2VhcmNoQ3JpdGVyaWFJb2NDb250YWluZXIgPSBuZXcgQ3JpdGVyaWFOdW1lcmljRGljdGlvbmFyeSgpO1xyXG4gICAgICAgIHRoaXMuaW5pdFNlYXJjaENyaXRlcmlhSW9jQ29udGFpbmVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbml0U2VhcmNoQ3JpdGVyaWFJb2NDb250YWluZXIoKSB7XHJcbiAgICAgICAgdGhpcy5fc2VhcmNoQ3JpdGVyaWFJb2NDb250YWluZXJbMF0gPSBuZXcgRGVmYXVsdFNlYXJjaENyaXRlcmlhKCk7XHJcbiAgICAgICAgdGhpcy5fc2VhcmNoQ3JpdGVyaWFJb2NDb250YWluZXJbMTAwXSA9IG5ldyBBZFRyYW5zZm9ybWF0aW9uU2VhcmNoQ3JpdGVyaWEoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgRmlsbENhdGVnb3J5U3BlY2lmaWNTZWFyY2hDcml0ZXJpYShjYXRlZ29yeUlkOiBudW1iZXIsIHVzZXJJbnB1dDogVXNlcklucHV0KTogdm9pZCB7XHJcbiAgICAgICAgbGV0IHNlYXJjaENyaXRlcmlhID0gdGhpcy5wb2x5bW9ycGhpY0Rpc3BhdGNoU2VhcmNoQ3JpdGVyaWEoY2F0ZWdvcnlJZCk7XHJcbiAgICAgICAgc2VhcmNoQ3JpdGVyaWEuRmlsbENyaXRlcmlhKHVzZXJJbnB1dCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIEJpbmQoY2F0ZWdvcnlJZDogbnVtYmVyLCBzZWFyY2hDcml0ZXJpYUNoYW5nZTogSUNyaXRlcmlhQ2hhbmdlKSB7XHJcbiAgICAgICAgbGV0IHNlYXJjaENyaXRlcmlhID0gdGhpcy5wb2x5bW9ycGhpY0Rpc3BhdGNoU2VhcmNoQ3JpdGVyaWEoY2F0ZWdvcnlJZCk7XHJcbiAgICAgICAgc2VhcmNoQ3JpdGVyaWEuQmluZEV2ZW50cyhzZWFyY2hDcml0ZXJpYUNoYW5nZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIFVuQmluZChjYXRlZ29yeUlkOm51bWJlcikge1xyXG4gICAgICAgIGxldCBzZWFyY2hDcml0ZXJpYSA9IHRoaXMucG9seW1vcnBoaWNEaXNwYXRjaFNlYXJjaENyaXRlcmlhKGNhdGVnb3J5SWQpO1xyXG4gICAgICAgIHNlYXJjaENyaXRlcmlhLlVuQmluZEV2ZW50cygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcG9seW1vcnBoaWNEaXNwYXRjaFNlYXJjaENyaXRlcmlhKGNhdGVnb3J5SWQ6bnVtYmVyKTogSUNyaXRlcmlhIHtcclxuICAgICAgICBsZXQgcmV0dXJuVmFsdWU6IElDcml0ZXJpYSA9IHRoaXMuX3NlYXJjaENyaXRlcmlhSW9jQ29udGFpbmVyW2NhdGVnb3J5SWRdO1xyXG4gICAgICAgIGlmIChyZXR1cm5WYWx1ZT09PXVuZGVmaW5lZCB8fCByZXR1cm5WYWx1ZT09PW51bGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuVmFsdWUgPSB0aGlzLl9zZWFyY2hDcml0ZXJpYUlvY0NvbnRhaW5lclswXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldHVyblZhbHVlO1xyXG4gICAgfVxyXG59Iiwi77u/aW1wb3J0IHsgSUNyaXRlcmlhQ2hhbmdlIH0gZnJvbSBcIi4uLy4uLy4uL0hlbHBlci9JQ3JpdGVyaWFDaGFuZ2VcIjtcclxuaW1wb3J0IHsgU2VhcmNoQ3JpdGVyaWEgfSBmcm9tIFwiLi9TZWFyY2hDcml0ZXJpYVwiO1xyXG5pbXBvcnQgeyBJUmVzdWx0SGFuZGxlciB9IGZyb20gXCIuLi8uLi8uLi9IZWxwZXIvSVJlc3VsdEhhbmRsZXJcIjtcclxuaW1wb3J0IHsgQWpheENhbGxlciB9IGZyb20gXCIuLi8uLi8uLi9IZWxwZXIvQWpheENhbGxlclwiO1xyXG5pbXBvcnQgeyBVc2VySW5wdXQgfSBmcm9tIFwiLi4vLi4vLi4vSGVscGVyL1VzZXJJbnB1dFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNlYXJjaENyaXRlcmlhVmlld0xvYWRlciBpbXBsZW1lbnRzIElSZXN1bHRIYW5kbGVyIHtcclxuICAgIFxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBSZXF1ZXN0SW5kZXhLZXk6IHN0cmluZyA9IFwiUmVxdWVzdEluZGV4XCI7XHJcbiAgICBwcml2YXRlIF9jdXJyZW50UmVxdWVzdEluZGV4OiBudW1iZXIgPSAwO1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX3VybDogc3RyaW5nID0gXCIvSG9tZS9HZXRTZWFyY2hDcml0ZXJpYVZpZXdcIjtcclxuXHJcbiAgICBwcml2YXRlIF9yZXN1bHRIYW5kbGVyOiBJUmVzdWx0SGFuZGxlcjtcclxuICAgIHByaXZhdGUgX2FqYXhDYWxsZXI6IEFqYXhDYWxsZXI7XHJcblxyXG4gICAgcHJpdmF0ZSBfc2VhcmNoQ3JpdGVyaWFDaGFuZ2U6IElDcml0ZXJpYUNoYW5nZTtcclxuICAgIHByaXZhdGUgX3ByZXZpb3VzQ2F0ZWdvcnlJZDogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgX2N1cnJlbnRDYXRlZ29yeUlkOiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBfc2VhcmNoQ3JpdGVyaWE6IFNlYXJjaENyaXRlcmlhO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHJlc3VsdEhhbmRsZXI6IElSZXN1bHRIYW5kbGVyLHNlYXJjaENyaXRlcmlhQ2hhbmdlOiBJQ3JpdGVyaWFDaGFuZ2Usc2VhcmNoQ3JpdGVyaWE6IFNlYXJjaENyaXRlcmlhLHJlcXVlc3RDb2RlOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9yZXN1bHRIYW5kbGVyID0gcmVzdWx0SGFuZGxlcjtcclxuICAgICAgICB0aGlzLl9hamF4Q2FsbGVyID0gbmV3IEFqYXhDYWxsZXIodGhpcy5fdXJsLCB0aGlzLCByZXF1ZXN0Q29kZSk7XHJcbiAgICAgICAgdGhpcy5fc2VhcmNoQ3JpdGVyaWFDaGFuZ2UgPSBzZWFyY2hDcml0ZXJpYUNoYW5nZTtcclxuICAgICAgICB0aGlzLl9zZWFyY2hDcml0ZXJpYSA9IHNlYXJjaENyaXRlcmlhO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBHZXRTZWFyY2hDcml0ZXJpYVZpZXdGcm9tU2VydmVyKHVzZXJJbnB1dDpVc2VySW5wdXQsY2F0ZWdvcnlJZDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fY3VycmVudFJlcXVlc3RJbmRleCsrO1xyXG4gICAgICAgIHRoaXMuX2N1cnJlbnRDYXRlZ29yeUlkID0gY2F0ZWdvcnlJZDtcclxuICAgICAgICB1c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnlbdGhpcy5SZXF1ZXN0SW5kZXhLZXldID0gdGhpcy5fY3VycmVudFJlcXVlc3RJbmRleDtcclxuICAgICAgICB0aGlzLl9hamF4Q2FsbGVyLkNhbGwodXNlcklucHV0KTsvL0dFVFxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBPblJlc3VsdChwYXJhbTogYW55LCByZXF1ZXN0Q29kZTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHBhcmFtLkN1c3RvbURpY3Rpb25hcnlbdGhpcy5SZXF1ZXN0SW5kZXhLZXldID09IHRoaXMuX2N1cnJlbnRSZXF1ZXN0SW5kZXgpIHsgLy9sYXN0IGNhbGwgcmVzcG9uc2VcclxuICAgICAgICAgICAgaWYgKHBhcmFtLlN1Y2Nlc3MgPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2VhcmNoQ3JpdGVyaWEuVW5CaW5kKHRoaXMuX3ByZXZpb3VzQ2F0ZWdvcnlJZCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZXN1bHRIYW5kbGVyLk9uUmVzdWx0KHBhcmFtLlJlc3BvbnNlRGF0YSwgcmVxdWVzdENvZGUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2VhcmNoQ3JpdGVyaWEuQmluZCh0aGlzLl9jdXJyZW50Q2F0ZWdvcnlJZCwgdGhpcy5fc2VhcmNoQ3JpdGVyaWFDaGFuZ2UpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcHJldmlvdXNDYXRlZ29yeUlkID0gdGhpcy5fY3VycmVudENhdGVnb3J5SWQ7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZXN1bHRIYW5kbGVyLk9uRXJyb3IocGFyYW0uTWVzc2FnZSArIFwiICwgXCIgKyBwYXJhbS5FcnJvckNvZGUsIHJlcXVlc3RDb2RlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgT25FcnJvcihtZXNzYWdlOiBzdHJpbmcsIHJlcXVlc3RDb2RlOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9yZXN1bHRIYW5kbGVyLk9uRXJyb3IobWVzc2FnZSxyZXF1ZXN0Q29kZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIEFqYXhDYWxsU3RhcnRlZChyZXF1ZXN0Q29kZTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fcmVzdWx0SGFuZGxlci5BamF4Q2FsbFN0YXJ0ZWQocmVxdWVzdENvZGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBBamF4Q2FsbEZpbmlzaGVkKHJlcXVlc3RDb2RlOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9yZXN1bHRIYW5kbGVyLkFqYXhDYWxsRmluaXNoZWQocmVxdWVzdENvZGUpO1xyXG4gICAgfVxyXG4gICAgXHJcbn0iLCLvu79pbXBvcnQgeyBVc2VySW5wdXQgfSBmcm9tIFwiLi4vLi4vLi4vLi4vSGVscGVyL1VzZXJJbnB1dFwiO1xyXG5pbXBvcnQgeyBJQ3JpdGVyaWFDaGFuZ2UgfSBmcm9tIFwiLi4vLi4vLi4vLi4vSGVscGVyL0lDcml0ZXJpYUNoYW5nZVwiO1xyXG5pbXBvcnQgeyBJQ3JpdGVyaWEsIENyaXRlcmlhVmFsaWRhdG9yIH0gZnJvbSBcIi4uLy4uLy4uLy4uL0hlbHBlci9JQ3JpdGVyaWFcIjtcclxuaW1wb3J0IHsgQ2FyTW9kZWxCcmFuZENvbnRyb2xsZXIgfSBmcm9tIFwiLi4vLi4vLi4vLi4vQ29tcG9uZW50cy9UcmFuc2Zvcm1hdGlvbi9DYXJNb2RlbEJyYW5kQ29udHJvbGxlclwiO1xyXG5pbXBvcnQge0RlZmF1bHRPcmRlckJ5fSBmcm9tIFwiLi4vLi4vLi4vLi4vQ29tcG9uZW50cy9PcmRlckJ5L0RlZmF1bHRPcmRlckJ5XCI7XHJcbmltcG9ydCB7RGVmYXVsdFByaWNlVHlwZX0gZnJvbSBcIi4uLy4uLy4uLy4uL0NvbXBvbmVudHMvUHJpY2VUeXBlL0RlZmF1bHRQcmljZVR5cGVcIjtcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgQWRUcmFuc2Zvcm1hdGlvblNlYXJjaENyaXRlcmlhIGltcGxlbWVudHMgSUNyaXRlcmlhIHtcclxuXHJcbiAgICBwcml2YXRlIF9jYXJNb2RlbEJyYW5kQ29udG9sbGVyOiBDYXJNb2RlbEJyYW5kQ29udHJvbGxlcjtcclxuICAgIHByaXZhdGUgX2RlZmF1bHRPcmRlckJ5OiBEZWZhdWx0T3JkZXJCeTtcclxuICAgIHByaXZhdGUgX2RlZmF1bHRQcmljZVR5cGU6IERlZmF1bHRQcmljZVR5cGU7XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBNYWtlWWVhckZyb21LZXk6IHN0cmluZyA9IFwiTWFrZVllYXJGcm9tXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IE1ha2VZZWFyRnJvbUlucHV0SWQ6IHN0cmluZyA9IFwiZnJvbVllYXJcIjtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IE1ha2VZZWFyVG9LZXk6IHN0cmluZyA9IFwiTWFrZVllYXJUb1wiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBNYWtlWWVhclRvSW5wdXRJZDogc3RyaW5nID0gXCJ0b1llYXJcIjtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IEZ1ZWxLZXkgPSBcIkZ1ZWxcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgRnVlbFNlbGVjdElkOiBzdHJpbmcgPSBcImZ1ZWxcIjtcclxuXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgTWlsZWFnZUZyb21LZXk6IHN0cmluZyA9IFwiTWlsZWFnZUZyb21cIjtcclxuICAgIHB1YmxpYyByZWFkb25seSBNaWxlYWdlRnJvbUlucHV0SWQ6IHN0cmluZyA9IFwibWlsZWFnZUZyb21cIjtcclxuXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgTWlsZWFnZVRvS2V5OiBzdHJpbmcgPSBcIk1pbGVhZ2VUb1wiO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IE1pbGVhZ2VUb0lucHV0SWQ6IHN0cmluZyA9IFwibWlsZWFnZVRvXCI7XHJcblxyXG4gICAgcHVibGljIHJlYWRvbmx5IEdlYXJib3hLZXk6IHN0cmluZyA9IFwiR2VhcmJveFwiO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IEdlYXJib3hUeXBlU2VsZWN0SWQ6IHN0cmluZyA9IFwiZ2VhcmJveFR5cGVcIjtcclxuXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgQm9keUNvbG9yS2V5OiBzdHJpbmcgPSBcIkJvZHlDb2xvclwiO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IEJvZHlDb2xvclNlbGVjdElkOiBzdHJpbmcgPSBcImJvZHlDb2xvclwiO1xyXG5cclxuICAgIHB1YmxpYyByZWFkb25seSBJbnRlcm5hbENvbG9yS2V5OiBzdHJpbmcgPSBcIkludGVybmFsQ29sb3JcIjtcclxuICAgIHB1YmxpYyByZWFkb25seSBJbnRlcm5hbENvbG9yU2VsZWN0SWQgPSBcImludGVybmFsQ29sb3JcIjtcclxuXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgQm9keVN0YXR1c0tleTogc3RyaW5nID0gXCJCb2R5U3RhdHVzXCI7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgQm9keVN0YXR1c1NlbGVjdElkOiBzdHJpbmcgPSBcImJvZHlTdGF0dXNcIjtcclxuXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgQ2FyU3RhdHVzS2V5OiBzdHJpbmcgPSBcIkNhclN0YXR1c1wiO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IENhclN0YXR1c1NlbGVjdElkOiBzdHJpbmcgPSBcImNhclN0YXR1c1wiO1xyXG5cclxuICAgIHB1YmxpYyByZWFkb25seSBQbGF0ZVR5cGVLZXk6IHN0cmluZyA9IFwiUGxhdGVUeXBlXCI7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgUGxhdGVUeXBlU2VsZWN0SWQ6IHN0cmluZyA9IFwicGxhdGVUeXBlXCI7XHJcblxyXG4gICAgcHJpdmF0ZSBpbml0VmlldygpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9jYXJNb2RlbEJyYW5kQ29udG9sbGVyID0gbmV3IENhck1vZGVsQnJhbmRDb250cm9sbGVyKCk7XHJcbiAgICAgICAgdGhpcy5fZGVmYXVsdFByaWNlVHlwZSA9IG5ldyBEZWZhdWx0UHJpY2VUeXBlKCk7XHJcbiAgICAgICAgdGhpcy5fZGVmYXVsdE9yZGVyQnkgPSBuZXcgRGVmYXVsdE9yZGVyQnkoKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgcmVnaXN0ZXJFdmVudHMoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fZGVmYXVsdFByaWNlVHlwZS5TZWxlY3RlZFByaWNlVHlwZUNoYW5nZWRFdmVudC5TdWJzY3JpYmUoKHNlbmRlciwgYXJncykgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9kZWZhdWx0T3JkZXJCeS5QcmljZVR5cGVDaGFuZ2VkKHNlbmRlciwgYXJncyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1blJlZ2lzdGVyRXZlbnRzKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX2RlZmF1bHRQcmljZVR5cGUuU2VsZWN0ZWRQcmljZVR5cGVDaGFuZ2VkRXZlbnQuVW5zdWJzY3JpYmUoKHNlbmRlciwgYXJncykgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9kZWZhdWx0T3JkZXJCeS5QcmljZVR5cGVDaGFuZ2VkKHNlbmRlciwgYXJncyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy9UT0RPIGluIG9ydGhlciB0byBtaW5pbWl6ZSBiYW5kd2lkdGggdXNhZ2UgaXQgaXMgZ29vZCBwcmN0aWNlIHRvIG5vdCBzZW5kIGNyaXRlcmlhcyB0aGF0IGhhdmUgZGVmYXVsdCB2YWx1ZVxyXG4gICAgcHVibGljIEZpbGxDcml0ZXJpYSh1c2VySW5wdXQ6IFVzZXJJbnB1dCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX2Nhck1vZGVsQnJhbmRDb250b2xsZXIuRmlsbENyaXRlcmlhKHVzZXJJbnB1dCk7XHJcbiAgICAgICAgdGhpcy5fZGVmYXVsdE9yZGVyQnkuRmlsbENyaXRlcmlhKHVzZXJJbnB1dCk7XHJcbiAgICAgICAgdGhpcy5fZGVmYXVsdFByaWNlVHlwZS5GaWxsQ3JpdGVyaWEodXNlcklucHV0KTtcclxuXHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuTWFrZVllYXJGcm9tS2V5XSA9XHJcbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLk1ha2VZZWFyRnJvbUlucHV0SWQpLnZhbCgpOy8vbWFrZVllYXJGcm9tXHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuTWFrZVllYXJUb0tleV0gPVxyXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5NYWtlWWVhclRvSW5wdXRJZCkudmFsKCk7Ly9tYWtlWWVhclRvXHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuRnVlbEtleV0gPVxyXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5GdWVsU2VsZWN0SWQpLmZpbmQoXCJvcHRpb246c2VsZWN0ZWRcIikudmFsKCk7Ly9mdWVsXHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuTWlsZWFnZUZyb21LZXldID1cclxuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuTWlsZWFnZUZyb21JbnB1dElkKS52YWwoKTsvL21pbGVhZ2VGcm9tXHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuTWlsZWFnZVRvS2V5XSA9XHJcbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLk1pbGVhZ2VUb0lucHV0SWQpLnZhbCgpOy8vbWlsZWFnZVRvXHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuR2VhcmJveEtleV0gPVxyXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5HZWFyYm94VHlwZVNlbGVjdElkKS5maW5kKFwib3B0aW9uOnNlbGVjdGVkXCIpLnZhbCgpOy8vZ2VhcmJveFR5cGUgICAgICAgIFxyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLkJvZHlDb2xvcktleV0gPVxyXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5Cb2R5Q29sb3JTZWxlY3RJZCkuZmluZChcIm9wdGlvbjpzZWxlY3RlZFwiKS52YWwoKTsvL2JvZHlDb2xvclxyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLkludGVybmFsQ29sb3JLZXldID1cclxuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuSW50ZXJuYWxDb2xvclNlbGVjdElkKS5maW5kKFwib3B0aW9uOnNlbGVjdGVkXCIpLnZhbCgpOy8vaW50ZXJuYWxDb2xvciAgICAgICAgXHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuQm9keVN0YXR1c0tleV0gPVxyXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5Cb2R5U3RhdHVzU2VsZWN0SWQpLmZpbmQoXCJvcHRpb246c2VsZWN0ZWRcIikudmFsKCk7Ly9ib2R5U3RhdHVzXHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuQ2FyU3RhdHVzS2V5XSA9XHJcbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLkNhclN0YXR1c1NlbGVjdElkKS5maW5kKFwib3B0aW9uOnNlbGVjdGVkXCIpLnZhbCgpOy8vY2FyU3RhdHVzICAgICAgICBcclxuICAgICAgICB1c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnlbdGhpcy5QbGF0ZVR5cGVLZXldID1cclxuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuUGxhdGVUeXBlU2VsZWN0SWQpLmZpbmQoXCJvcHRpb246c2VsZWN0ZWRcIikudmFsKCk7Ly9wbGF0ZVR5cGVcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgQmluZEV2ZW50cyhjcml0ZXJpYUNoYW5nZTogSUNyaXRlcmlhQ2hhbmdlKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5pbml0VmlldygpO1xyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJFdmVudHMoKTtcclxuXHJcbiAgICAgICAgdGhpcy5fY2FyTW9kZWxCcmFuZENvbnRvbGxlci5CaW5kRXZlbnRzKGNyaXRlcmlhQ2hhbmdlKTtcclxuICAgICAgICB0aGlzLl9kZWZhdWx0T3JkZXJCeS5CaW5kRXZlbnRzKGNyaXRlcmlhQ2hhbmdlKTtcclxuICAgICAgICB0aGlzLl9kZWZhdWx0UHJpY2VUeXBlLkJpbmRFdmVudHMoY3JpdGVyaWFDaGFuZ2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBVbkJpbmRFdmVudHMoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fY2FyTW9kZWxCcmFuZENvbnRvbGxlci5VbkJpbmRFdmVudHMoKTtcclxuICAgICAgICB0aGlzLl9kZWZhdWx0T3JkZXJCeS5VbkJpbmRFdmVudHMoKTtcclxuICAgICAgICB0aGlzLl9kZWZhdWx0UHJpY2VUeXBlLlVuQmluZEV2ZW50cygpO1xyXG4gICAgICAgIHRoaXMudW5SZWdpc3RlckV2ZW50cygpO1xyXG4gICAgfVxyXG5cclxuICAgIFZhbGlkYXRlQ3JpdGVyaWEoKTogQ3JpdGVyaWFWYWxpZGF0b3IgeyB0aHJvdyBuZXcgRXJyb3IoXCJOb3QgaW1wbGVtZW50ZWRcIik7IH1cclxufVxyXG5cclxuXHJcblxyXG4iLCLvu79pbXBvcnQge0lDcml0ZXJpYSxDcml0ZXJpYVZhbGlkYXRvcn0gZnJvbSBcIi4uLy4uLy4uLy4uL0hlbHBlci9JQ3JpdGVyaWFcIjtcclxuaW1wb3J0IHsgVXNlcklucHV0IH0gZnJvbSBcIi4uLy4uLy4uLy4uL0hlbHBlci9Vc2VySW5wdXRcIjtcclxuaW1wb3J0IHsgSUNyaXRlcmlhQ2hhbmdlIH0gZnJvbSBcIi4uLy4uLy4uLy4uL0hlbHBlci9JQ3JpdGVyaWFDaGFuZ2VcIjtcclxuaW1wb3J0IHtEZWZhdWx0T3JkZXJCeX0gZnJvbSBcIi4uLy4uLy4uLy4uL0NvbXBvbmVudHMvT3JkZXJCeS9EZWZhdWx0T3JkZXJCeVwiO1xyXG5pbXBvcnQge0RlZmF1bHRQcmljZVR5cGV9IGZyb20gXCIuLi8uLi8uLi8uLi9Db21wb25lbnRzL1ByaWNlVHlwZS9EZWZhdWx0UHJpY2VUeXBlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgRGVmYXVsdFNlYXJjaENyaXRlcmlhIGltcGxlbWVudHMgSUNyaXRlcmlhe1xyXG5cclxuICAgIHByaXZhdGUgX2RlZmF1bHRPcmRlckJ5OiBEZWZhdWx0T3JkZXJCeTtcclxuICAgIHByaXZhdGUgX2RlZmF1bHRQcmljZVR5cGU6RGVmYXVsdFByaWNlVHlwZTtcclxuXHJcbiAgICBwcml2YXRlIGluaXRWaWV3KCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX2RlZmF1bHRQcmljZVR5cGUgPSBuZXcgRGVmYXVsdFByaWNlVHlwZSgpO1xyXG4gICAgICAgIHRoaXMuX2RlZmF1bHRPcmRlckJ5ID0gbmV3IERlZmF1bHRPcmRlckJ5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZWdpc3RlckV2ZW50cygpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9kZWZhdWx0UHJpY2VUeXBlLlNlbGVjdGVkUHJpY2VUeXBlQ2hhbmdlZEV2ZW50LlN1YnNjcmliZSgoc2VuZGVyLCBhcmdzKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RlZmF1bHRPcmRlckJ5LlByaWNlVHlwZUNoYW5nZWQoc2VuZGVyLCBhcmdzKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVuUmVnaXN0ZXJFdmVudHMoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fZGVmYXVsdFByaWNlVHlwZS5TZWxlY3RlZFByaWNlVHlwZUNoYW5nZWRFdmVudC5VbnN1YnNjcmliZSgoc2VuZGVyLCBhcmdzKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RlZmF1bHRPcmRlckJ5LlByaWNlVHlwZUNoYW5nZWQoc2VuZGVyLCBhcmdzKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgRmlsbENyaXRlcmlhKHVzZXJJbnB1dDogVXNlcklucHV0KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fZGVmYXVsdE9yZGVyQnkuRmlsbENyaXRlcmlhKHVzZXJJbnB1dCk7XHJcbiAgICAgICAgdGhpcy5fZGVmYXVsdFByaWNlVHlwZS5GaWxsQ3JpdGVyaWEodXNlcklucHV0KTtcclxuICAgIH1cclxuXHJcbiAgICBCaW5kRXZlbnRzKGNyaXRlcmlhQ2hhbmdlOiBJQ3JpdGVyaWFDaGFuZ2UpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmluaXRWaWV3KCk7XHJcbiAgICAgICAgdGhpcy5yZWdpc3RlckV2ZW50cygpO1xyXG4gICAgICAgIHRoaXMuX2RlZmF1bHRPcmRlckJ5LkJpbmRFdmVudHMoY3JpdGVyaWFDaGFuZ2UpO1xyXG4gICAgICAgIHRoaXMuX2RlZmF1bHRQcmljZVR5cGUuQmluZEV2ZW50cyhjcml0ZXJpYUNoYW5nZSk7XHJcbiAgICB9XHJcblxyXG4gICAgVW5CaW5kRXZlbnRzKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX2RlZmF1bHRPcmRlckJ5LlVuQmluZEV2ZW50cygpO1xyXG4gICAgICAgIHRoaXMuX2RlZmF1bHRQcmljZVR5cGUuVW5CaW5kRXZlbnRzKCk7XHJcbiAgICAgICAgdGhpcy51blJlZ2lzdGVyRXZlbnRzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgVmFsaWRhdGVDcml0ZXJpYSgpOiBDcml0ZXJpYVZhbGlkYXRvciB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm90IGltcGxlbWVudGVkXCIpO1xyXG4gICAgfVxyXG59Iiwi77u/aW1wb3J0IHsgVXNlcklucHV0IH0gZnJvbSBcIi4uLy4uLy4uL0hlbHBlci9Vc2VySW5wdXRcIjtcclxuaW1wb3J0IHsgSVJlc3VsdEhhbmRsZXIgfSBmcm9tIFwiLi4vLi4vLi4vSGVscGVyL0lSZXN1bHRIYW5kbGVyXCI7XHJcbmltcG9ydCB7QWpheENhbGxlcn0gZnJvbSBcIi4uLy4uLy4uL0hlbHBlci9BamF4Q2FsbGVyXCI7XHJcblxyXG4vL1RPRE8gbWFrZSBjb3VudCBvcHRpb25hbCB0byB1c2VyXHJcbmV4cG9ydCBjbGFzcyBTZXJ2ZXJDYWxsZXIgaW1wbGVtZW50cyBJUmVzdWx0SGFuZGxlciB7XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBSZXF1ZXN0SW5kZXhLZXk6IHN0cmluZyA9IFwiUmVxdWVzdEluZGV4XCI7XHJcbiAgICBwcml2YXRlIF9jdXJyZW50UmVxdWVzdEluZGV4OiBudW1iZXIgPSAwO1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX3VybDogc3RyaW5nID0gXCIvYXBpL0FkQXBpL0dldEFkdmVydGlzZW1lbnRDb21tb25cIjtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5ICBfcmVzdWx0SGFuZGxlcjogSVJlc3VsdEhhbmRsZXI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5ICBfYWpheENhbGxlcjogQWpheENhbGxlcjtcclxuICAgIFxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBTdGFydEluZGV4S2V5OiBzdHJpbmcgPSBcIlN0YXJ0SW5kZXhcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2luaXRpYWxTdGFydDogbnVtYmVyID0gMTtcclxuICAgIHByaXZhdGUgX3N0YXJ0OiBudW1iZXIgPSAxO1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgQ291bnRLZXk6IHN0cmluZyA9IFwiQ291bnRcIjtcclxuICAgIHByaXZhdGUgX2NvdW50OiBudW1iZXIgPSA1O1xyXG4gICAgXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IE51bWJlck9mSXRlbXNLZXk6IHN0cmluZyA9IFwibnVtYmVyT2ZJdGVtc1wiO1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcihyZXN1bHRIYW5kbGVyOiBJUmVzdWx0SGFuZGxlcixyZXF1ZXN0Q29kZTpudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9yZXN1bHRIYW5kbGVyID0gcmVzdWx0SGFuZGxlcjtcclxuICAgICAgICB0aGlzLl9hamF4Q2FsbGVyID0gbmV3IEFqYXhDYWxsZXIodGhpcy5fdXJsLCB0aGlzLHJlcXVlc3RDb2RlKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgR2V0QWRJdGVtc0Zyb21TZXJ2ZXIodXNlcklucHV0OiBVc2VySW5wdXQpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9jdXJyZW50UmVxdWVzdEluZGV4Kys7XHJcblxyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLlN0YXJ0SW5kZXhLZXldID0gdGhpcy5fc3RhcnQ7XHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuQ291bnRLZXldID0gdGhpcy5fY291bnQ7XHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuUmVxdWVzdEluZGV4S2V5XSA9IHRoaXMuX2N1cnJlbnRSZXF1ZXN0SW5kZXg7XHJcblxyXG4gICAgICAgIHRoaXMuX2FqYXhDYWxsZXIuQ2FsbCh1c2VySW5wdXQpO1xyXG4gICAgfSAvL0dldEFkSXRlbXNGcm9tU2VydmVyXHJcblxyXG4gICBwdWJsaWMgT25SZXN1bHQocGFyYW06YW55LHJlcXVlc3RDb2RlOm51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIC8vVE9ETyBjaGVjayBmb3IgdW5kZWZpbmVkIG9yIG51bGwgaW4gbXNnIGFuZCBtc2cuY3VzdG9tRGljdGlvbmFyeVtcIlJlcXVlc3RJbmRleFwiXVxyXG4gICAgICAgIGlmIChwYXJhbS5DdXN0b21EaWN0aW9uYXJ5W3RoaXMuUmVxdWVzdEluZGV4S2V5XSA9PSB0aGlzLl9jdXJyZW50UmVxdWVzdEluZGV4KSB7IC8vbGFzdCBjYWxsIHJlc3BvbnNlXHJcbiAgICAgICAgICAgIGlmIChwYXJhbS5TdWNjZXNzID09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3N0YXJ0ICs9IHBhcnNlSW50KHBhcmFtLkN1c3RvbURpY3Rpb25hcnlbdGhpcy5OdW1iZXJPZkl0ZW1zS2V5XSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZXN1bHRIYW5kbGVyLk9uUmVzdWx0KHBhcmFtLlJlc3BvbnNlRGF0YSwgcmVxdWVzdENvZGUpO1xyXG4gICAgICAgICAgICB9IC8vaWYgKG1zZy5zdWNjZXNzID09IHRydWUpXHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVzdWx0SGFuZGxlci5PbkVycm9yKHBhcmFtLk1lc3NhZ2UgKyBcIiAsIFwiICsgcGFyYW0uRXJyb3JDb2RlLCByZXF1ZXN0Q29kZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIE9uRXJyb3IobWVzc2FnZTogc3RyaW5nLHJlcXVlc3RDb2RlOm51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX3Jlc3VsdEhhbmRsZXIuT25FcnJvcihtZXNzYWdlLCByZXF1ZXN0Q29kZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIEFqYXhDYWxsRmluaXNoZWQocmVxdWVzdENvZGU6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX3Jlc3VsdEhhbmRsZXIuQWpheENhbGxGaW5pc2hlZChyZXF1ZXN0Q29kZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIEFqYXhDYWxsU3RhcnRlZChyZXF1ZXN0Q29kZTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fcmVzdWx0SGFuZGxlci5BamF4Q2FsbFN0YXJ0ZWQocmVxdWVzdENvZGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBSZXNldFNlYXJjaFBhcmFtZXRlcnMoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fc3RhcnQgPSB0aGlzLl9pbml0aWFsU3RhcnQ7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG4iLCLvu79pbXBvcnQgeyBDYXRlZ29yeSB9IGZyb20gXCIuLi8uLi8uLi9Nb2RlbHMvQ2F0ZWdvcnlcIjtcclxuaW1wb3J0IHsgQ2F0ZWdvcnlTZWxlY3Rpb24gfSBmcm9tIFwiLi4vLi4vLi4vQ29tcG9uZW50cy9DYXRlZ29yeS9DYXRlZ29yeVNlbGVjdGlvblwiO1xyXG5pbXBvcnQgeyBTZXJ2ZXJDYWxsZXIgfSBmcm9tIFwiLi9TZXJ2ZXJDYWxsZXJcIjtcclxuaW1wb3J0IHsgU2VhcmNoQ3JpdGVyaWFWaWV3TG9hZGVyIH0gZnJvbSBcIi4vU2VhcmNoQ3JpdGVyaWFWaWV3TG9hZGVyXCI7XHJcbmltcG9ydCB7IFNlYXJjaENyaXRlcmlhIH0gZnJvbSBcIi4vU2VhcmNoQ3JpdGVyaWFcIjtcclxuaW1wb3J0IHsgSUNyaXRlcmlhQ2hhbmdlIH0gZnJvbSBcIi4uLy4uLy4uL0hlbHBlci9JQ3JpdGVyaWFDaGFuZ2VcIjtcclxuaW1wb3J0IHsgVXNlcklucHV0IH0gZnJvbSBcIi4uLy4uLy4uL0hlbHBlci9Vc2VySW5wdXRcIjtcclxuaW1wb3J0IHsgSVJlc3VsdEhhbmRsZXIgfSBmcm9tIFwiLi4vLi4vLi4vSGVscGVyL0lSZXN1bHRIYW5kbGVyXCI7XHJcbmltcG9ydCB7IEFkdmVydGlzZW1lbnRDb21tb24gfSBmcm9tIFwiLi4vLi4vLi4vTW9kZWxzL0FkdmVydGlzZW1lbnRDb21tb25cIjtcclxuXHJcblxyXG5cclxuLy9UT0RPIHdoZW4gY2F0ZWdvcnkgY2hhbmdlIGJlZm9yZSBzZWFyY2ggY3JpdGVpYSBpcyBsb2FkZWQgYSBzZWFyY2ggY2FsbCBpcyBzZW50IHRvIHNlcnZlclxyXG4vL2FkZCBhbiBldmVudCBsaWtlIHZpZXdMb2FkU3RhcnRlZCwgdmlld0xvYWRJblByb2dyZXNzLHZpZXdMb2FkQ29tcGxldGVkIGFuZCBkaXNhYmxlIHNlYXJjaFxyXG4vL2R1cm5nIGluUHJvZ3Jlc3MgZW5kIGVuYWJsZSBpdCBhZnRlciBjb21wbGV0ZWRcclxuZXhwb3J0IGNsYXNzIEluZGV4IGltcGxlbWVudHMgSUNyaXRlcmlhQ2hhbmdlLCBJUmVzdWx0SGFuZGxlciB7XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBMb2FkQWRJbWFnZUlkOiBzdHJpbmcgPSBcImxvYWRBZHNcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgTG9hZFZpZXdJbWFnZUlkOiBzdHJpbmcgPSBcImxvYWRWaWV3XCI7XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBBZFR5cGVLZXk6IHN0cmluZyA9IFwiQWRUeXBlXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IEFkVHlwZVBhcmVudERpdklkID0gXCJhZFR5cGVcIjtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IFNlYXJjaFRleHRLZXkgPSBcIlNlYXJjaFRleHRcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgU2VhcmNoVGV4dElucHV0SWQgPSBcInNlYXJjaFRleHRcIjtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9hZFBsYWNlSG9sZGVyRGl2SWQ6IHN0cmluZyA9IFwiYWRQbGFjZUhvbGRlclwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfZGVmYXVsdEltYWdlSW5wdXRJZDogc3RyaW5nID1cImRlZmF1bHRJbWFnZVwiO1xyXG5cclxuICAgIHByaXZhdGUgX3NlcnZlckNhbGxlcjogU2VydmVyQ2FsbGVyO1xyXG4gICAgcHJpdmF0ZSBfY2F0ZWdvcnlTZWxlY3Rpb246IENhdGVnb3J5U2VsZWN0aW9uO1xyXG4gICAgcHJpdmF0ZSBfc2VhcmNoQ3JpdGVyaWE6IFNlYXJjaENyaXRlcmlhO1xyXG4gICAgcHJpdmF0ZSBfc2VhcmNoQ3JpdGVyaWFWaWV3TG9hZGVyOiBTZWFyY2hDcml0ZXJpYVZpZXdMb2FkZXI7XHJcblxyXG4gICAgcHJpdmF0ZSBfY2F0ZWdvcnlTZWxlY3RvclBhcmVudERpdklkOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIF9hbGxDYXRlZ29yaWVzSWQ6IHN0cmluZztcclxuXHJcbiAgICBwcml2YXRlIF9nZXRBZEZyb21TZXJ2ZXJCdXR0b25JZCA9IFwiZ2V0QWRGcm9tU2VydmVyXCI7XHJcbiAgICBwcml2YXRlIF9tZXNzYWdlRGl2SWQgPSBcIm1lc3NhZ2VcIjtcclxuICAgIHByaXZhdGUgX2NhdGVnb3J5U3BlY2lmaWNTZWFyY2hDcml0ZXJpYVBhcmVudERpdklkPSBcImNhdGVnb3J5U3BlY2lmaWNTZWFyY2hDcml0ZXJpYVwiO1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgR2V0QWRGcm9tU2VydmVyUmVxdWVzdENvZGUgPSAxO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBMb2FkU2VhcmNoUGFydGlhbFZpZXdSZXF1ZXN0Q29kZSA9IDI7XHJcblxyXG4gICAgY29uc3RydWN0b3IoY2F0ZWdvcnlTZWxlY3RvclBhcmVudERpdklkOiBzdHJpbmcsXHJcbiAgICAgICAgYWxsQ2F0ZWdvcmllc0lkOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLl9jYXRlZ29yeVNlbGVjdG9yUGFyZW50RGl2SWQgPSBjYXRlZ29yeVNlbGVjdG9yUGFyZW50RGl2SWQ7XHJcbiAgICAgICAgdGhpcy5fYWxsQ2F0ZWdvcmllc0lkID0gYWxsQ2F0ZWdvcmllc0lkO1xyXG5cclxuICAgICAgICB0aGlzLl9zZXJ2ZXJDYWxsZXIgPSBuZXcgU2VydmVyQ2FsbGVyKHRoaXMsIHRoaXMuR2V0QWRGcm9tU2VydmVyUmVxdWVzdENvZGUpO1xyXG4gICAgICAgIHRoaXMuX3NlYXJjaENyaXRlcmlhID0gbmV3IFNlYXJjaENyaXRlcmlhKCk7XHJcbiAgICAgICAgdGhpcy5fc2VhcmNoQ3JpdGVyaWFWaWV3TG9hZGVyID0gbmV3IFNlYXJjaENyaXRlcmlhVmlld0xvYWRlclxyXG4gICAgICAgICAgICAodGhpcywgdGhpcywgdGhpcy5fc2VhcmNoQ3JpdGVyaWEsIHRoaXMuTG9hZFNlYXJjaFBhcnRpYWxWaWV3UmVxdWVzdENvZGUpO1xyXG5cclxuICAgICAgICB0aGlzLmluaXRQYWdlKCk7XHJcbiAgICAgICAgdGhpcy5pbml0RXZlbnRIYW5kbGVycygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaW5pdFBhZ2UoKTogdm9pZCB7XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdENhdGVnb3J5U2VsZWN0aW9uQ29udHJvbCgpO1xyXG4gICAgICAgIHRoaXMuaW5pdEdldEFkRnJvbVNlcnZlcigpO1xyXG4gICAgICAgIHRoaXMuaW5pdFNpbmdsZUFkSXRlbVN0eWxlKCk7XHJcblxyXG4gICAgfS8vaW5pdFBhZ2VcclxuXHJcbiAgICBwcml2YXRlIGluaXRDYXRlZ29yeVNlbGVjdGlvbkNvbnRyb2woKTogdm9pZCB7XHJcbiAgICAgICAgbGV0IGFsbENhdGVnb3JpZXNTdHJpbmcgPSAkKFwiI1wiICsgdGhpcy5fYWxsQ2F0ZWdvcmllc0lkKS52YWwoKS50b1N0cmluZygpO1xyXG4gICAgICAgIGxldCBhbGxDYXRlZ29yaWVzID0gJC5wYXJzZUpTT04oYWxsQ2F0ZWdvcmllc1N0cmluZykgYXMgQ2F0ZWdvcnlbXTtcclxuICAgICAgICB0aGlzLl9jYXRlZ29yeVNlbGVjdGlvbiA9IG5ldyBDYXRlZ29yeVNlbGVjdGlvbih0aGlzLl9jYXRlZ29yeVNlbGVjdG9yUGFyZW50RGl2SWQsIGFsbENhdGVnb3JpZXMpO1xyXG4gICAgICAgIHRoaXMuX2NhdGVnb3J5U2VsZWN0aW9uLkNyZWF0ZUZpcnN0TGV2ZWwoKTtcclxuXHJcbiAgICB9Ly9pbml0Q2F0ZWdvcnlTZWxlY3Rpb25Db250cm9sXHJcblxyXG4gICAgcHJpdmF0ZSBnZXRTZWFyY2hDcml0ZXJpYVBhcnRpYWxWaWV3KGNhdGVnb3J5SWQ6IG51bWJlcikge1xyXG4gICAgICAgIGxldCB1c2VySW5wdXQgPSBuZXcgVXNlcklucHV0KCk7XHJcbiAgICAgICAgdGhpcy5fY2F0ZWdvcnlTZWxlY3Rpb24uSW5zZXJ0Q2F0ZWdvcnlJZEluVXNlcklucHV0RGljdGlvbmFyeSh1c2VySW5wdXQpO1xyXG4gICAgICAgIHRoaXMuX3NlYXJjaENyaXRlcmlhVmlld0xvYWRlci5HZXRTZWFyY2hDcml0ZXJpYVZpZXdGcm9tU2VydmVyKHVzZXJJbnB1dCxjYXRlZ29yeUlkKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgaW5pdEV2ZW50SGFuZGxlcnMoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fY2F0ZWdvcnlTZWxlY3Rpb24uU2VsZWN0ZWRDYXRlZ29yeUNoYW5nZWRFdmVudC5TdWJzY3JpYmUoKHNlbmRlciwgYXJncykgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnNlYXJjaENyaXRlcmlhQ2hhbmdlZCgpO1xyXG4gICAgICAgICAgICB0aGlzLmdldFNlYXJjaENyaXRlcmlhUGFydGlhbFZpZXcoYXJncy5TZWxlY3RlZENhdGVnb3J5SWQpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmdldFNlYXJjaENyaXRlcmlhUGFydGlhbFZpZXcodGhpcy5fY2F0ZWdvcnlTZWxlY3Rpb24uR2V0U2VsZWN0ZWRDYXRlZ29yeUlkKCkpO1xyXG5cclxuICAgICAgICBcclxuICAgICAgICB0aGlzLl9zZWFyY2hDcml0ZXJpYS5CaW5kKHRoaXMuX2NhdGVnb3J5U2VsZWN0aW9uLkdldFNlbGVjdGVkQ2F0ZWdvcnlJZCgpLCB0aGlzKTtcclxuICAgICAgICBcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5BZFR5cGVQYXJlbnREaXZJZCkub24oXCJjaGFuZ2VcIixcclxuICAgICAgICAgICAgKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNlYXJjaENyaXRlcmlhQ2hhbmdlZCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuU2VhcmNoVGV4dElucHV0SWQpLm9uKFwiaW5wdXRcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnNlYXJjaENyaXRlcmlhQ2hhbmdlZCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICQoZG9jdW1lbnQpLmtleXByZXNzKChlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlLndoaWNoID09IDEzKSB7XHJcbiAgICAgICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5fZ2V0QWRGcm9tU2VydmVyQnV0dG9uSWQpLmNsaWNrKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIEN1c3RvbUNyaXRlcmlhQ2hhbmdlZCgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnNlYXJjaENyaXRlcmlhQ2hhbmdlZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2VhcmNoQ3JpdGVyaWFDaGFuZ2VkKCk6IHZvaWQge1xyXG4gICAgICAgICQoXCIjYWRQbGFjZUhvbGRlclwiKS5jaGlsZHJlbigpLnJlbW92ZSgpO1xyXG4gICAgICAgIHRoaXMuX3NlcnZlckNhbGxlci5SZXNldFNlYXJjaFBhcmFtZXRlcnMoKTtcclxuICAgICAgICAvLyAkKFwiI1wiICsgdGhpcy5fZ2V0QWRGcm9tU2VydmVySWQpLnRyaWdnZXIoXCJjbGlja1wiKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbml0R2V0QWRGcm9tU2VydmVyKCk6IHZvaWQge1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9nZXRBZEZyb21TZXJ2ZXJCdXR0b25JZCkub24oXCJjbGlja1wiLCAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgbGV0IHVzZXJJbnB1dCA9IG5ldyBVc2VySW5wdXQoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2NhdGVnb3J5U2VsZWN0aW9uLkluc2VydENhdGVnb3J5SWRJblVzZXJJbnB1dERpY3Rpb25hcnkodXNlcklucHV0KTtcclxuXHJcbiAgICAgICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLkFkVHlwZUtleV0gPSAkKFwiI1wiICsgdGhpcy5BZFR5cGVQYXJlbnREaXZJZCkuY2hpbGRyZW4oXCI6Y2hlY2tlZFwiKS52YWwoKTtcclxuICAgICAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuU2VhcmNoVGV4dEtleV0gPSAkKFwiI1wiICsgdGhpcy5TZWFyY2hUZXh0SW5wdXRJZCkudmFsKCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9zZWFyY2hDcml0ZXJpYS5GaWxsQ2F0ZWdvcnlTcGVjaWZpY1NlYXJjaENyaXRlcmlhKHRoaXMuX2NhdGVnb3J5U2VsZWN0aW9uLkdldFNlbGVjdGVkQ2F0ZWdvcnlJZCgpLCB1c2VySW5wdXQpOy8vZmlsbCBjYXRlZ29yeSBzcGVjaWZpYyBzZWFyY2ggcGFyYW1ldGVyc1xyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZUVycm9yTWVzc2FnZSgpO1xyXG4gICAgICAgICAgICB0aGlzLl9zZXJ2ZXJDYWxsZXIuR2V0QWRJdGVtc0Zyb21TZXJ2ZXIodXNlcklucHV0KTtcclxuICAgICAgICB9KTsgLy9jbGlja1xyXG4gICAgfS8vaW5pdEdldEFkRnJvbVNlcnZlclxyXG5cclxuXHJcbiAgICBwdWJsaWMgT25SZXN1bHQobXNnOiBhbnksIHJlcXVlc3RDb2RlOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICBpZiAocmVxdWVzdENvZGUgPT09IHRoaXMuR2V0QWRGcm9tU2VydmVyUmVxdWVzdENvZGUpIHtcclxuICAgICAgICAgICAgdGhpcy5vblJlc3VsdEdldEFkRnJvbVNlcnZlcihtc2cpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChyZXF1ZXN0Q29kZSA9PT0gdGhpcy5Mb2FkU2VhcmNoUGFydGlhbFZpZXdSZXF1ZXN0Q29kZSkge1xyXG4gICAgICAgICAgICB0aGlzLm9uUmVzdWx0TG9hZFNlYXJjaFBhcnRpYWxWaWV3KG1zZyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgT25FcnJvcihtZXNzYWdlOiBzdHJpbmcsIHJlcXVlc3RDb2RlOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICBpZiAocmVxdWVzdENvZGUgPT09IHRoaXMuR2V0QWRGcm9tU2VydmVyUmVxdWVzdENvZGUpIHtcclxuICAgICAgICAgICAgdGhpcy5vbkVycm9yR2V0QWRGcm9tU2VydmVyKG1lc3NhZ2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChyZXF1ZXN0Q29kZSA9PT0gdGhpcy5Mb2FkU2VhcmNoUGFydGlhbFZpZXdSZXF1ZXN0Q29kZSkge1xyXG4gICAgICAgICAgICB0aGlzLm9uRXJyb3JMb2FkU2VhcmNoUGFydGlhbFZpZXcobWVzc2FnZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBBamF4Q2FsbEZpbmlzaGVkKHJlcXVlc3RDb2RlOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICBpZiAocmVxdWVzdENvZGUgPT09IHRoaXMuR2V0QWRGcm9tU2VydmVyUmVxdWVzdENvZGUpIHtcclxuICAgICAgICAgICAgdGhpcy5hamF4Q2FsbEZpbmlzaGVkR2V0QWRGcm9tU2VydmVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHJlcXVlc3RDb2RlID09PSB0aGlzLkxvYWRTZWFyY2hQYXJ0aWFsVmlld1JlcXVlc3RDb2RlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWpheENhbGxGaW5pc2hlZExvYWRTZWFyY2hQYXJ0aWFsVmlldygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBBamF4Q2FsbFN0YXJ0ZWQocmVxdWVzdENvZGU6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIGlmIChyZXF1ZXN0Q29kZSA9PT0gdGhpcy5HZXRBZEZyb21TZXJ2ZXJSZXF1ZXN0Q29kZSkge1xyXG4gICAgICAgICAgICB0aGlzLmFqYXhDYWxsU3RhcnRlZEdldEFkRnJvbVNlcnZlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChyZXF1ZXN0Q29kZSA9PT0gdGhpcy5Mb2FkU2VhcmNoUGFydGlhbFZpZXdSZXF1ZXN0Q29kZSkge1xyXG4gICAgICAgICAgICB0aGlzLmFqYXhDYWxsU3RhcnRlZExvYWRTZWFyY2hQYXJ0aWFsVmlldygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9uUmVzdWx0R2V0QWRGcm9tU2VydmVyKGFkdmVydGlzZW1lbnRDb21tb25zOiBBZHZlcnRpc2VtZW50Q29tbW9uW10pOiB2b2lkIHtcclxuICAgICAgICB2YXIgdGVtcGxhdGUgPSAkKCcjc2luZ2xlQWRJdGVtJykuaHRtbCgpO1xyXG4gICAgICAgIHZhciBkYXRhO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWR2ZXJ0aXNlbWVudENvbW1vbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIGFkSW1hZ2U7XHJcbiAgICAgICAgICAgIGlmIChhZHZlcnRpc2VtZW50Q29tbW9uc1tpXS5BZEltYWdlc1swXSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBhZEltYWdlID0gXCJkYXRhOmltYWdlL2pwZztiYXNlNjQsXCIgKyBhZHZlcnRpc2VtZW50Q29tbW9uc1tpXS5BZEltYWdlc1swXTtcclxuICAgICAgICAgICAgfSAvL2VuZCBpZlxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGFkSW1hZ2UgPSBcImRhdGE6aW1hZ2UvanBnO2Jhc2U2NCxcIiArICQoXCIjXCIgKyB0aGlzLl9kZWZhdWx0SW1hZ2VJbnB1dElkKS52YWwoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBkYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgQWR2ZXJ0aXNlbWVudElkOiBhZHZlcnRpc2VtZW50Q29tbW9uc1tpXS5BZElkLFxyXG4gICAgICAgICAgICAgICAgQWR2ZXJ0aXNlbWVudENhdGVnb3J5SWQ6IGFkdmVydGlzZW1lbnRDb21tb25zW2ldLkNhdGVnb3J5SWQsXHJcbiAgICAgICAgICAgICAgICBBZHZlcnRpc2VtZW50Q2F0ZWdvcnk6IGFkdmVydGlzZW1lbnRDb21tb25zW2ldLkNhdGVnb3J5TmFtZSxcclxuICAgICAgICAgICAgICAgIGFkSW1hZ2U6IGFkSW1hZ2UsXHJcbiAgICAgICAgICAgICAgICBhZFByaWNlOiBhZHZlcnRpc2VtZW50Q29tbW9uc1tpXS5BZFByaWNlLlByaWNlU3RyaW5nLCAvL3RvZG8gY2hlY2sgdGhlIHByaWNlIHR5cGVcclxuICAgICAgICAgICAgICAgIEFkdmVydGlzZW1lbnRUaXRsZTogYWR2ZXJ0aXNlbWVudENvbW1vbnNbaV0uQWRUaXRsZSxcclxuICAgICAgICAgICAgICAgIEFkdmVydGlzZW1lbnRTdGF0dXM6IGFkdmVydGlzZW1lbnRDb21tb25zW2ldLkFkU3RhdHVzXHJcbiAgICAgICAgICAgICAgICAvL2FkRGF0ZTogbXNnLlJlc3BvbnNlRGF0YVtpXS5BZFRpbWVcclxuICAgICAgICAgICAgfSAvL2VuZCBkYXRhXHJcblxyXG4gICAgICAgICAgICB2YXIgaHRtbCA9IE11c3RhY2hlLnRvX2h0bWwodGVtcGxhdGUsIGRhdGEpO1xyXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5fYWRQbGFjZUhvbGRlckRpdklkKS5hcHBlbmQoaHRtbCk7XHJcbiAgICAgICAgfSAvL2VuZCBmb3JcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9uUmVzdWx0TG9hZFNlYXJjaFBhcnRpYWxWaWV3KG1zZzogYW55KSB7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX2NhdGVnb3J5U3BlY2lmaWNTZWFyY2hDcml0ZXJpYVBhcmVudERpdklkKS5jaGlsZHJlbigpLnJlbW92ZSgpO1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9jYXRlZ29yeVNwZWNpZmljU2VhcmNoQ3JpdGVyaWFQYXJlbnREaXZJZCkuaHRtbChtc2cpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBwcml2YXRlIG9uRXJyb3JHZXRBZEZyb21TZXJ2ZXIobWVzc2FnZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5zaG93RXJyb3JNZXNzYWdlKG1lc3NhZ2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25FcnJvckxvYWRTZWFyY2hQYXJ0aWFsVmlldyhtZXNzYWdlOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLnNob3dFcnJvck1lc3NhZ2UobWVzc2FnZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhamF4Q2FsbFN0YXJ0ZWRHZXRBZEZyb21TZXJ2ZXIoKSB7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuTG9hZEFkSW1hZ2VJZCkuc2hvdygpO1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9nZXRBZEZyb21TZXJ2ZXJCdXR0b25JZCkuYXR0cihcImRpc2FibGVkXCIsIFwiZGlzYWJsZWRcIik7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhamF4Q2FsbFN0YXJ0ZWRMb2FkU2VhcmNoUGFydGlhbFZpZXcoKSB7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuTG9hZFZpZXdJbWFnZUlkKS5zaG93KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhamF4Q2FsbEZpbmlzaGVkR2V0QWRGcm9tU2VydmVyKCkge1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLkxvYWRBZEltYWdlSWQpLmhpZGUoKTtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fZ2V0QWRGcm9tU2VydmVyQnV0dG9uSWQpLnJlbW92ZUF0dHIoXCJkaXNhYmxlZFwiKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgYWpheENhbGxGaW5pc2hlZExvYWRTZWFyY2hQYXJ0aWFsVmlldygpIHtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5Mb2FkVmlld0ltYWdlSWQpLmhpZGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNob3dFcnJvck1lc3NhZ2UobWVzc2FnZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVFcnJvck1lc3NhZ2UoKTtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fbWVzc2FnZURpdklkKS5hcHBlbmQoYDxwPiR7bWVzc2FnZX08L3A+YCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZW1vdmVFcnJvck1lc3NhZ2UoKSB7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX21lc3NhZ2VEaXZJZCkuY2hpbGRyZW4oKS5yZW1vdmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXRTaW5nbGVBZEl0ZW1TdHlsZSgpOiB2b2lkIHtcclxuICAgICAgICAvL3Nob3cgZGV0YWlsIG9mIHNpbmdsZUFkSXRlbSB3aGVuIG1vdXNlIG92ZXJcclxuICAgICAgICAkKGRvY3VtZW50KS5vbihcIm1vdXNlZW50ZXIgbW91c2VsZWF2ZVwiLCBcIi5ibG9ja0Rpc3BsYXlcIiwgKGV2ZW50OiBKUXVlcnkuRXZlbnQ8SFRNTEVsZW1lbnQsIG51bGw+KSA9PiB7XHJcbiAgICAgICAgICAgICQoZXZlbnQuY3VycmVudFRhcmdldCkuZmluZChcIi5tb3JlSW5mb1wiKS5mYWRlVG9nZ2xlKDI1MCk7XHJcbiAgICAgICAgICAgIC8vJCh0aGlzKS5maW5kKFwiLm1vcmVJbmZvXCIpLmZhZGVUb2dnbGUoMjUwKTtcclxuICAgICAgICB9KTsvL2VuZCBvblxyXG4gICAgfS8vaW5pdFNpbmdsZUFkSXRlbVN0eWxlXHJcbn1cclxuXHJcbmxldCBjYXRlZ29yeVNlbGVjdG9yUGFyZW50RGl2SWQ6IHN0cmluZyA9IFwiY2F0ZWdvcnlTZWxlY3RvclwiO1xyXG5sZXQgYWxsQ2F0ZWdvcmllc0lkID0gXCJhbGxDYXRlZ29yaWVzXCI7XHJcblxyXG5kZWNsYXJlIGxldCB3aW5kb3c6IGFueTtcclxudmFyIGluZGV4OiBJbmRleDtcclxuXHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeSgoKSA9PiB7XHJcbiAgICBpbmRleCA9IG5ldyBJbmRleChjYXRlZ29yeVNlbGVjdG9yUGFyZW50RGl2SWQsIGFsbENhdGVnb3JpZXNJZCk7XHJcbiAgICBpbmRleC5DdXN0b21Dcml0ZXJpYUNoYW5nZWQoKTsvL3RvIGluaXRpYXRlIGEgc2VydmVyIGNhbGwgb24gcGFnZSBsb2FkIGZvciBmaXJzdCB0aW1lXHJcbiAgICB3aW5kb3cuQWxpSW5kZXggPSBpbmRleDtcclxufSk7Ly9yZWFkeSJdfQ==
