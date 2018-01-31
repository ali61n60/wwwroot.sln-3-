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
        this.CallImageId = "serverCalledImage";
        this.AdTypeKey = "AdType";
        this.AdTypeParentDivId = "adType";
        this.SearchTextKey = "SearchText";
        this.SearchTextInputId = "searchText";
        this._adPlaceHolderDivId = "adPlaceHolder";
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
            var adImage = null;
            if (advertisementCommons[i].AdvertisementImages[0] != null) {
                adImage = "data:image/jpg;base64," + advertisementCommons[i].AdvertisementImages[0];
            } //end if
            data = {
                AdvertisementId: advertisementCommons[i].AdvertisementId,
                AdvertisementCategoryId: advertisementCommons[i].AdvertisementCategoryId,
                AdvertisementCategory: advertisementCommons[i].AdvertisementCategory,
                adImage: adImage,
                adPrice: advertisementCommons[i].AdvertisementPrice.PriceString,
                AdvertisementTitle: advertisementCommons[i].AdvertisementTitle,
                AdvertisementStatus: advertisementCommons[i].AdvertisementStatus
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
        $("#" + this.CallImageId).show();
        $("#" + this._getAdFromServerButtonId).attr("disabled", "disabled");
    };
    Index.prototype.ajaxCallStartedLoadSearchPartialView = function () {
        $("#" + this.CallImageId).show(); //TODO show another image may conflict with ad
    };
    Index.prototype.ajaxCallFinishedGetAdFromServer = function () {
        $("#" + this.CallImageId).hide();
        $("#" + this._getAdFromServerButtonId).removeAttr("disabled");
    };
    Index.prototype.ajaxCallFinishedLoadSearchPartialView = function () {
        $("#" + this.CallImageId).hide(); //TODO show another image may conflict with ad
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3d3dyb290L2pzL0NvbXBvbmVudHMvQ2F0ZWdvcnkvQ2F0ZWdvcnlTZWxlY3Rpb24udHMiLCJ3d3dyb290L2pzL0NvbXBvbmVudHMvT3JkZXJCeS9EZWZhdWx0T3JkZXJCeS50cyIsInd3d3Jvb3QvanMvQ29tcG9uZW50cy9QcmljZVR5cGUvRGVmYXVsdFByaWNlVHlwZS50cyIsInd3d3Jvb3QvanMvQ29tcG9uZW50cy9UcmFuc2Zvcm1hdGlvbi9DYXJNb2RlbEJyYW5kQ29udHJvbGxlci50cyIsInd3d3Jvb3QvanMvRXZlbnRzL0V2ZW50RGlzcGF0Y2hlci50cyIsInd3d3Jvb3QvanMvSGVscGVyL0FqYXhDYWxsZXIudHMiLCJ3d3dyb290L2pzL0hlbHBlci9Dcml0ZXJpYU51bWVyaWNEaWN0aW9uYXJ5LnRzIiwid3d3cm9vdC9qcy9IZWxwZXIvVXNlcklucHV0LnRzIiwid3d3cm9vdC9qcy9ob21lL2luZGV4L3NyYy9TZWFyY2hDcml0ZXJpYS50cyIsInd3d3Jvb3QvanMvaG9tZS9pbmRleC9zcmMvU2VhcmNoQ3JpdGVyaWFWaWV3TG9hZGVyLnRzIiwid3d3cm9vdC9qcy9ob21lL2luZGV4L3NyYy9TZWFyY2hDcml0ZXJpYS9BZFRyYW5zZm9ybWF0aW9uU2VhcmNoQ3JpdGVyaWEudHMiLCJ3d3dyb290L2pzL2hvbWUvaW5kZXgvc3JjL1NlYXJjaENyaXRlcmlhL0RlZmF1bHRTZWFyY2hDcml0ZXJpYS50cyIsInd3d3Jvb3QvanMvaG9tZS9pbmRleC9zcmMvU2VydmVyQ2FsbGVyLnRzIiwid3d3cm9vdC9qcy9ob21lL2luZGV4L3NyYy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUMsZ0VBQStEO0FBSWhFO0lBMkJJLDJCQUFZLFdBQW1CLEVBQUUsYUFBeUI7UUF6Qm5ELGlDQUE0QixHQUFnRSxJQUFJLGlDQUFlLEVBQThDLENBQUM7UUFFcEosa0JB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QUFBLFFBQVE7SUFDZixDQUFDLEVBQUEsdUJBQXVCO0lBQzVCLFlBQUM7QUFBRCxDQWxPQSxBQWtPQyxJQUFBO0FBbE9ZLHNCQUFLO0FBb09sQixJQUFJLDJCQUEyQixHQUFXLGtCQUFrQixDQUFDO0FBQzdELElBQUksZUFBZSxHQUFHLGVBQWUsQ0FBQztBQUd0QyxJQUFJLEtBQVksQ0FBQztBQUdqQixDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDO0lBQ2QsS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLDJCQUEyQixFQUFFLGVBQWUsQ0FBQyxDQUFDO0lBQ2hFLEtBQUssQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLENBQUEsdURBQXVEO0lBQ3JGLE1BQU0sQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO0FBQzVCLENBQUMsQ0FBQyxDQUFDLENBQUEsT0FBTyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCLvu79pbXBvcnQgeyBFdmVudERpc3BhdGNoZXIgfSBmcm9tIFwiLi4vLi4vRXZlbnRzL0V2ZW50RGlzcGF0Y2hlclwiO1xyXG5pbXBvcnQgeyBDYXRlZ29yeSB9IGZyb20gXCIuLi8uLi9Nb2RlbHMvQ2F0ZWdvcnlcIjtcclxuaW1wb3J0IHsgVXNlcklucHV0IH0gZnJvbSBcIi4uLy4uL0hlbHBlci9Vc2VySW5wdXRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDYXRlZ29yeVNlbGVjdGlvbiB7XHJcblxyXG4gICAgcHVibGljIFNlbGVjdGVkQ2F0ZWdvcnlDaGFuZ2VkRXZlbnQ6IEV2ZW50RGlzcGF0Y2hlcjxDYXRlZ29yeVNlbGVjdGlvbiwgQ2F0ZWdvcnlDYWhuZ2VkRXZlbnRBcmc+ID0gbmV3IEV2ZW50RGlzcGF0Y2hlcjxDYXRlZ29yeVNlbGVjdGlvbiwgQ2F0ZWdvcnlDYWhuZ2VkRXZlbnRBcmc+KCk7XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBDYXRlZ29yeUlkS2V5ID0gXCJDYXRlZ29yeUlkXCI7XHJcblxyXG4gICAgcHJpdmF0ZSBfcGFyZW50RGl2SWQ6IHN0cmluZzsvL2RpdiBlbGVtZW50IHRoYXQgaG9sZHMgYWxsIENhdGVnb3J5U2VsZWN0aW9uIGVsZW1lbnRzXHJcbiAgICBwcml2YXRlIF9hbGxDYXRlZ29yaWVzOiBDYXRlZ29yeVtdO1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2ZpcnN0TGV2ZWxUZW1wbGF0ZSA9IFwiY2F0ZWdvcnkxVGVtcGxhdGVcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2ZpcnN0TGV2ZWxEaXYgPSBcImNhdGVnb3J5MVwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfZmlyc3RMZXZlbFNlbGVjdDogc3RyaW5nID0gXCJzZWxlY3QxXCI7XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfc2Vjb25kTGV2ZWxUZW1wbGF0ZSA9IFwiY2F0ZWdvcnkyVGVtcGxhdGVcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX3NlY29uZExldmVsRGl2ID0gXCJjYXRlZ29yeTJcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX3NlY29uZExldmVsU2VsZWN0OiBzdHJpbmcgPSBcInNlbGVjdDJcIjtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF90aGlyZExldmVsVGVtcGxhdGUgPSBcImNhdGVnb3J5M1RlbXBsYXRlXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF90aGlyZExldmVsRGl2ID0gXCJjYXRlZ29yeTNcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX3RoaXJkTGV2ZWxTZWxlY3Q6IHN0cmluZyA9IFwic2VsZWN0M1wiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfcm9vdENhdGVnb3J5SWQ6IG51bWJlciA9IDA7XHJcblxyXG4gICAgcHJpdmF0ZSBfc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxPbmU6IG51bWJlcjtcclxuICAgIHByaXZhdGUgX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVHdvOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIF9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFRocmVlOiBudW1iZXI7XHJcblxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBhcmVudERpdklkOiBzdHJpbmcsIGFsbENhdGVnb3JpZXM6IENhdGVnb3J5W10pIHtcclxuICAgICAgICB0aGlzLl9wYXJlbnREaXZJZCA9IHBhcmVudERpdklkO1xyXG4gICAgICAgIHRoaXMuX2FsbENhdGVnb3JpZXMgPSBhbGxDYXRlZ29yaWVzO1xyXG4gICAgfVxyXG5cclxuICAgIFxyXG5cclxuICAgIHB1YmxpYyBTZXRDYXRlZ29yeUlkKHNlbGVjdGVkQ2F0ZWdvcnlJZDogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgbGV0IGZpcnN0TGV2ZWxJZDogbnVtYmVyO1xyXG4gICAgICAgIGxldCBzZWNvbmRMZXZlbElkOiBudW1iZXI7XHJcbiAgICAgICAgbGV0IGNhdGVnb3J5TGV2ZWwgPSB0aGlzLmdldENhdGVnb3J5TGV2ZWwoc2VsZWN0ZWRDYXRlZ29yeUlkKTtcclxuICAgICAgICBzd2l0Y2ggKGNhdGVnb3J5TGV2ZWwpIHtcclxuICAgICAgICBjYXNlIENhdGVnb3J5TGV2ZWwuVW5rb3duOlxyXG4gICAgICAgICAgICB0aGlzLkNyZWF0ZUZpcnN0TGV2ZWwoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIENhdGVnb3J5TGV2ZWwuTGV2ZWwxOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5DcmVhdGVGaXJzdExldmVsKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldEZpcnN0TGV2ZWxUb1NwZWNpZmljSWQoc2VsZWN0ZWRDYXRlZ29yeUlkKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlU2Vjb25kTGV2ZWwoc2VsZWN0ZWRDYXRlZ29yeUlkKTtcclxuICAgICAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLl9maXJzdExldmVsU2VsZWN0KS50cmlnZ2VyKFwiY2hhbmdlXCIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgQ2F0ZWdvcnlMZXZlbC5MZXZlbDI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLkNyZWF0ZUZpcnN0TGV2ZWwoKTtcclxuICAgICAgICAgICAgICAgIGZpcnN0TGV2ZWxJZCA9IHRoaXMuX2FsbENhdGVnb3JpZXMuZmlsdGVyKGNhdGVnb3J5ID0+IGNhdGVnb3J5LkNhdGVnb3J5SWQgPT09IHNlbGVjdGVkQ2F0ZWdvcnlJZClbMF1cclxuICAgICAgICAgICAgICAgICAgICAuQ2F0ZWdvcnlQYXJlbnRJZDtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0Rmlyc3RMZXZlbFRvU3BlY2lmaWNJZChmaXJzdExldmVsSWQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVTZWNvbmRMZXZlbChmaXJzdExldmVsSWQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTZWNvbmRMZXZlbFRvU3BlY2lmaWNJZChzZWxlY3RlZENhdGVnb3J5SWQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVUaGlyZExldmVsKHNlbGVjdGVkQ2F0ZWdvcnlJZCk7XHJcbiAgICAgICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5fc2Vjb25kTGV2ZWxTZWxlY3QpLnRyaWdnZXIoXCJjaGFuZ2VcIik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIENhdGVnb3J5TGV2ZWwuTGV2ZWwzOlxyXG4gICAgICAgICAgICB0aGlzLkNyZWF0ZUZpcnN0TGV2ZWwoKTtcclxuICAgICAgICAgICAgc2Vjb25kTGV2ZWxJZCA9IHRoaXMuX2FsbENhdGVnb3JpZXMuZmlsdGVyKGNhdGVnb3J5ID0+IGNhdGVnb3J5LkNhdGVnb3J5SWQgPT09IHNlbGVjdGVkQ2F0ZWdvcnlJZClbMF1cclxuICAgICAgICAgICAgICAgICAgICAuQ2F0ZWdvcnlQYXJlbnRJZDtcclxuICAgICAgICAgICAgZmlyc3RMZXZlbElkID0gdGhpcy5fYWxsQ2F0ZWdvcmllcy5maWx0ZXIoY2F0ZWdvcnkgPT4gY2F0ZWdvcnkuQ2F0ZWdvcnlJZCA9PT0gc2Vjb25kTGV2ZWxJZClbMF1cclxuICAgICAgICAgICAgICAgIC5DYXRlZ29yeVBhcmVudElkO1xyXG4gICAgICAgICAgICB0aGlzLnNldEZpcnN0TGV2ZWxUb1NwZWNpZmljSWQoZmlyc3RMZXZlbElkKTtcclxuICAgICAgICAgICAgdGhpcy5jcmVhdGVTZWNvbmRMZXZlbChmaXJzdExldmVsSWQpO1xyXG4gICAgICAgICAgICB0aGlzLnNldFNlY29uZExldmVsVG9TcGVjaWZpY0lkKHNlY29uZExldmVsSWQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVUaGlyZExldmVsKHNlY29uZExldmVsSWQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRUaGlyZExldmVsVG9TcGVjaWZpY0lkKHNlbGVjdGVkQ2F0ZWdvcnlJZCk7XHJcbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLl90aGlyZExldmVsU2VsZWN0KS50cmlnZ2VyKFwiY2hhbmdlXCIpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXRGaXJzdExldmVsVG9TcGVjaWZpY0lkKGNhdGVnb3J5SWQ6IG51bWJlcikge1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9maXJzdExldmVsU2VsZWN0KS52YWwoY2F0ZWdvcnlJZCk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHNldFNlY29uZExldmVsVG9TcGVjaWZpY0lkKGNhdGVnb3J5SWQ6IG51bWJlcikge1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9zZWNvbmRMZXZlbFNlbGVjdCkudmFsKGNhdGVnb3J5SWQpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBzZXRUaGlyZExldmVsVG9TcGVjaWZpY0lkKGNhdGVnb3J5SWQ6IG51bWJlcikge1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl90aGlyZExldmVsU2VsZWN0KS52YWwoY2F0ZWdvcnlJZCk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGdldENhdGVnb3J5TGV2ZWwoY2F0ZWdvcnlJZDogbnVtYmVyKTogQ2F0ZWdvcnlMZXZlbCB7XHJcblxyXG4gICAgICAgIGxldCB0ZW1wQ2F0ZWdvcnlBcnJheSA9IHRoaXMuX2FsbENhdGVnb3JpZXMuZmlsdGVyKGNhdGVnb3J5ID0+IGNhdGVnb3J5LkNhdGVnb3J5SWQgPT09IGNhdGVnb3J5SWQpO1xyXG4gICAgICAgIGxldCB0ZW1wQ2F0ZWdvcnk7XHJcbiAgICAgICAgaWYgKHRlbXBDYXRlZ29yeUFycmF5Lmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gQ2F0ZWdvcnlMZXZlbC5Vbmtvd247XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRlbXBDYXRlZ29yeSA9IHRlbXBDYXRlZ29yeUFycmF5WzBdO1xyXG4gICAgICAgIGlmICh0ZW1wQ2F0ZWdvcnkuUGFyZW50Q2F0ZWdvcnlJZCA9PT0gdGhpcy5fcm9vdENhdGVnb3J5SWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIENhdGVnb3J5TGV2ZWwuTGV2ZWwxO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0ZW1wQ2F0ZWdvcnkgPSB0aGlzLl9hbGxDYXRlZ29yaWVzLmZpbHRlcihjYXRlZ29yeSA9PiBjYXRlZ29yeS5DYXRlZ29yeUlkID09PSB0ZW1wQ2F0ZWdvcnkuUGFyZW50Q2F0ZWdvcnlJZClbMF07XHJcbiAgICAgICAgaWYgKHRlbXBDYXRlZ29yeS5QYXJlbnRDYXRlZ29yeUlkID09PSB0aGlzLl9yb290Q2F0ZWdvcnlJZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gQ2F0ZWdvcnlMZXZlbC5MZXZlbDI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBDYXRlZ29yeUxldmVsLkxldmVsMztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgSW5zZXJ0Q2F0ZWdvcnlJZEluVXNlcklucHV0RGljdGlvbmFyeSh1c2VySW5wdXQ6IFVzZXJJbnB1dCk6IHZvaWQge1xyXG4gICAgICAgIGxldCBjYXRlZ29yeUlkID0gdGhpcy5HZXRTZWxlY3RlZENhdGVnb3J5SWQoKTtcclxuICAgICAgICB1c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnlbdGhpcy5DYXRlZ29yeUlkS2V5XSA9IGNhdGVnb3J5SWQ7Ly8xMDAgZm9yIGNhcnNcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgR2V0U2VsZWN0ZWRDYXRlZ29yeUlkKCk6IG51bWJlciB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVGhyZWUgIT09IHVuZGVmaW5lZCAmJlxyXG4gICAgICAgICAgICB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFRocmVlICE9PSB0aGlzLl9yb290Q2F0ZWdvcnlJZClcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVGhyZWU7XHJcbiAgICAgICAgZWxzZSBpZiAodGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUd28gIT09IHVuZGVmaW5lZCAmJlxyXG4gICAgICAgICAgICB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFR3byAhPT0gdGhpcy5fcm9vdENhdGVnb3J5SWQpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFR3bztcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbE9uZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgQ3JlYXRlRmlyc3RMZXZlbCgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnJlbW92ZUVsZW1lbnQodGhpcy5fZmlyc3RMZXZlbERpdik7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxPbmUgPSB0aGlzLl9yb290Q2F0ZWdvcnlJZDtcclxuICAgICAgICB0aGlzLnJlbW92ZUVsZW1lbnQodGhpcy5fc2Vjb25kTGV2ZWxEaXYpO1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVHdvID0gdGhpcy5fcm9vdENhdGVnb3J5SWQ7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVFbGVtZW50KHRoaXMuX3RoaXJkTGV2ZWxEaXYpO1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVGhyZWUgPSB0aGlzLl9yb290Q2F0ZWdvcnlJZDtcclxuXHJcbiAgICAgICAgbGV0IHRlbXBsYXRlID0gJChcIiNcIiArIHRoaXMuX2ZpcnN0TGV2ZWxUZW1wbGF0ZSkuaHRtbCgpO1xyXG4gICAgICAgIGxldCBjYXRlZ29yaWVzOiBDYXRlZ29yeVtdID0gbmV3IEFycmF5PENhdGVnb3J5PigpO1xyXG4gICAgICAgIGxldCBkYXRhID0geyBjYXRlZ29yaWVzOiBjYXRlZ29yaWVzIH1cclxuICAgICAgICB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbE9uZSA9IHRoaXMuX3Jvb3RDYXRlZ29yeUlkOy8vXHJcbiAgICAgICAgdGhpcy5fYWxsQ2F0ZWdvcmllcy5mb3JFYWNoKGNhdGVnb3J5ID0+IHtcclxuICAgICAgICAgICAgaWYgKGNhdGVnb3J5LkNhdGVnb3J5UGFyZW50SWQgPT09IHRoaXMuX3Jvb3RDYXRlZ29yeUlkKSB7XHJcbiAgICAgICAgICAgICAgICBjYXRlZ29yaWVzLnB1c2goY2F0ZWdvcnkpO1xyXG4gICAgICAgICAgICB9Ly9pZlxyXG4gICAgICAgIH0pOy8vZm9yRWFjaFxyXG5cclxuICAgICAgICBsZXQgaHRtbCA9IE11c3RhY2hlLnRvX2h0bWwodGVtcGxhdGUsIGRhdGEpO1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9wYXJlbnREaXZJZCkuYXBwZW5kKGh0bWwpO1xyXG5cclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fZmlyc3RMZXZlbFNlbGVjdCkuY2hhbmdlKChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgc2VsZWN0ZWRJZCA9IHBhcnNlSW50KCQoZXZlbnQuY3VycmVudFRhcmdldCkudmFsKCkudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsT25lID0gc2VsZWN0ZWRJZDtcclxuICAgICAgICAgICAgdGhpcy5jcmVhdGVTZWNvbmRMZXZlbChzZWxlY3RlZElkKTtcclxuICAgICAgICAgICAgbGV0IGV2ZW50QXJnID0gbmV3IENhdGVnb3J5Q2FobmdlZEV2ZW50QXJnKCk7XHJcbiAgICAgICAgICAgIGV2ZW50QXJnLlNlbGVjdGVkQ2F0ZWdvcnlJZCA9IHRoaXMuR2V0U2VsZWN0ZWRDYXRlZ29yeUlkKCk7XHJcbiAgICAgICAgICAgIGV2ZW50QXJnLlNlbGVjdGVkQ2F0ZWdvcnlIYXNDaGlsZCA9IHRoaXMuc2VsZWN0ZWRDYXRlZ29yeUhhc0NoaWxkcmVuKCk7XHJcbiAgICAgICAgICAgIHRoaXMuU2VsZWN0ZWRDYXRlZ29yeUNoYW5nZWRFdmVudC5EaXNwYXRjaCh0aGlzLCBldmVudEFyZyk7XHJcbiAgICAgICAgfSk7Ly9jaGFuZ2VcclxuICAgIH0vL0NyZWF0ZUZpcnN0TGV2ZWxcclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZVNlY29uZExldmVsKGZpcnN0TGV2ZWxDYXRlZ29yeUlkOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnJlbW92ZUVsZW1lbnQodGhpcy5fc2Vjb25kTGV2ZWxEaXYpO1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVHdvID0gdGhpcy5fcm9vdENhdGVnb3J5SWQ7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVFbGVtZW50KHRoaXMuX3RoaXJkTGV2ZWxEaXYpO1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVGhyZWUgPSB0aGlzLl9yb290Q2F0ZWdvcnlJZDtcclxuICAgICAgICBpZiAoZmlyc3RMZXZlbENhdGVnb3J5SWQgPT09IHRoaXMuX3Jvb3RDYXRlZ29yeUlkKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCB0ZW1wbGF0ZSA9ICQoXCIjXCIgKyB0aGlzLl9zZWNvbmRMZXZlbFRlbXBsYXRlKS5odG1sKCk7XHJcbiAgICAgICAgbGV0IGNhdGVnb3JpZXM6IENhdGVnb3J5W10gPSBuZXcgQXJyYXk8Q2F0ZWdvcnk+KCk7XHJcbiAgICAgICAgbGV0IGRhdGEgPSB7IGNhdGVnb3JpZXM6IGNhdGVnb3JpZXMgfVxyXG5cclxuICAgICAgICB0aGlzLl9hbGxDYXRlZ29yaWVzLmZvckVhY2goY2F0ZWdvcnkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoY2F0ZWdvcnkuQ2F0ZWdvcnlQYXJlbnRJZCA9PT0gZmlyc3RMZXZlbENhdGVnb3J5SWQpIHtcclxuICAgICAgICAgICAgICAgIGNhdGVnb3JpZXMucHVzaChjYXRlZ29yeSk7XHJcbiAgICAgICAgICAgIH0vL2lmXHJcbiAgICAgICAgfSk7Ly9mb3JFYWNoXHJcblxyXG4gICAgICAgIGxldCBodG1sID0gTXVzdGFjaGUudG9faHRtbCh0ZW1wbGF0ZSwgZGF0YSk7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX3BhcmVudERpdklkKS5hcHBlbmQoaHRtbCk7XHJcblxyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9zZWNvbmRMZXZlbFNlbGVjdCkuY2hhbmdlKChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgc2VsZWN0ZWRJZCA9IHBhcnNlSW50KCQoZXZlbnQuY3VycmVudFRhcmdldCkudmFsKCkudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVHdvID0gc2VsZWN0ZWRJZDtcclxuICAgICAgICAgICAgdGhpcy5jcmVhdGVUaGlyZExldmVsKHNlbGVjdGVkSWQpO1xyXG4gICAgICAgICAgICBsZXQgZXZlbnRBcmcgPSBuZXcgQ2F0ZWdvcnlDYWhuZ2VkRXZlbnRBcmcoKTtcclxuICAgICAgICAgICAgZXZlbnRBcmcuU2VsZWN0ZWRDYXRlZ29yeUlkID0gdGhpcy5HZXRTZWxlY3RlZENhdGVnb3J5SWQoKTtcclxuICAgICAgICAgICAgZXZlbnRBcmcuU2VsZWN0ZWRDYXRlZ29yeUhhc0NoaWxkID0gdGhpcy5zZWxlY3RlZENhdGVnb3J5SGFzQ2hpbGRyZW4oKTtcclxuICAgICAgICAgICAgdGhpcy5TZWxlY3RlZENhdGVnb3J5Q2hhbmdlZEV2ZW50LkRpc3BhdGNoKHRoaXMsIGV2ZW50QXJnKTtcclxuICAgICAgICB9KTsvL2NoYW5nZVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlVGhpcmRMZXZlbChzZWNvbmRMZXZlbENhdGVnb3J5SWQ6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMucmVtb3ZlRWxlbWVudCh0aGlzLl90aGlyZExldmVsRGl2KTtcclxuICAgICAgICB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFRocmVlID0gdGhpcy5fcm9vdENhdGVnb3J5SWQ7XHJcblxyXG4gICAgICAgIGlmIChzZWNvbmRMZXZlbENhdGVnb3J5SWQgPT09IHRoaXMuX3Jvb3RDYXRlZ29yeUlkKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCB0ZW1wbGF0ZSA9ICQoXCIjXCIgKyB0aGlzLl90aGlyZExldmVsVGVtcGxhdGUpLmh0bWwoKTtcclxuICAgICAgICBsZXQgY2F0ZWdvcmllczogQ2F0ZWdvcnlbXSA9IG5ldyBBcnJheTxDYXRlZ29yeT4oKTtcclxuICAgICAgICBsZXQgZGF0YSA9IHsgY2F0ZWdvcmllczogY2F0ZWdvcmllcyB9XHJcblxyXG4gICAgICAgIHRoaXMuX2FsbENhdGVnb3JpZXMuZm9yRWFjaChjYXRlZ29yeSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChjYXRlZ29yeS5DYXRlZ29yeVBhcmVudElkID09PSBzZWNvbmRMZXZlbENhdGVnb3J5SWQpIHtcclxuICAgICAgICAgICAgICAgIGNhdGVnb3JpZXMucHVzaChjYXRlZ29yeSk7XHJcbiAgICAgICAgICAgIH0vL2lmXHJcbiAgICAgICAgfSk7Ly9mb3JFYWNoXHJcbiAgICAgICAgaWYgKGNhdGVnb3JpZXMubGVuZ3RoID09PSAwKSB7Ly9ObyBJdGVtIGluIHRoaXJkIGxldmVsIGNhdGVnb3J5XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGh0bWwgPSBNdXN0YWNoZS50b19odG1sKHRlbXBsYXRlLCBkYXRhKTtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fcGFyZW50RGl2SWQpLmFwcGVuZChodG1sKTtcclxuXHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX3RoaXJkTGV2ZWxTZWxlY3QpLmNoYW5nZSgoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUaHJlZSA9IHBhcnNlSW50KCQoZXZlbnQuY3VycmVudFRhcmdldCkudmFsKCkudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgIGxldCBldmVudEFyZyA9IG5ldyBDYXRlZ29yeUNhaG5nZWRFdmVudEFyZygpO1xyXG4gICAgICAgICAgICBldmVudEFyZy5TZWxlY3RlZENhdGVnb3J5SWQgPSB0aGlzLkdldFNlbGVjdGVkQ2F0ZWdvcnlJZCgpO1xyXG4gICAgICAgICAgICBldmVudEFyZy5TZWxlY3RlZENhdGVnb3J5SGFzQ2hpbGQgPSB0aGlzLnNlbGVjdGVkQ2F0ZWdvcnlIYXNDaGlsZHJlbigpO1xyXG4gICAgICAgICAgICB0aGlzLlNlbGVjdGVkQ2F0ZWdvcnlDaGFuZ2VkRXZlbnQuRGlzcGF0Y2godGhpcywgZXZlbnRBcmcpO1xyXG4gICAgICAgIH0pOy8vY2hhbmdlXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZWxlY3RlZENhdGVnb3J5SGFzQ2hpbGRyZW4oKTogYm9vbGVhbiB7XHJcbiAgICAgICAgbGV0IHNlbGVjdGVkQ2F0ZWdvcnlJZCA9IHRoaXMuR2V0U2VsZWN0ZWRDYXRlZ29yeUlkKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FsbENhdGVnb3JpZXMuZmlsdGVyXHJcbiAgICAgICAgICAgICgoY2F0ZWdvcnkpID0+IHsgcmV0dXJuIGNhdGVnb3J5LkNhdGVnb3J5UGFyZW50SWQgPT09IHNlbGVjdGVkQ2F0ZWdvcnlJZCB9KS5sZW5ndGggPiAwO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVtb3ZlRWxlbWVudChpZDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgJChcIiNcIiArIGlkKS5yZW1vdmUoKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIENhdGVnb3J5Q2FobmdlZEV2ZW50QXJnIHtcclxuICAgIHB1YmxpYyBTZWxlY3RlZENhdGVnb3J5SWQ6IG51bWJlcjtcclxuICAgIHB1YmxpYyBTZWxlY3RlZENhdGVnb3J5SGFzQ2hpbGQ6IGJvb2xlYW47XHJcbn1cclxuXHJcbmVudW0gQ2F0ZWdvcnlMZXZlbCB7XHJcbiAgICBMZXZlbDEgPSAxLFxyXG4gICAgTGV2ZWwyID0gMixcclxuICAgIExldmVsMyA9IDMsXHJcbiAgICBVbmtvd249NFxyXG59XHJcblxyXG4iLCLvu79pbXBvcnQge0lDcml0ZXJpYSwgQ3JpdGVyaWFWYWxpZGF0b3IgfSBmcm9tIFwiLi4vLi4vSGVscGVyL0lDcml0ZXJpYVwiO1xyXG5pbXBvcnQge1VzZXJJbnB1dH0gZnJvbSBcIi4uLy4uL0hlbHBlci9Vc2VySW5wdXRcIjtcclxuaW1wb3J0IHtJQ3JpdGVyaWFDaGFuZ2V9IGZyb20gXCIuLi8uLi9IZWxwZXIvSUNyaXRlcmlhQ2hhbmdlXCI7XHJcbmltcG9ydCB7UHJpY2VUeXBlfSBmcm9tIFwiLi4vUHJpY2VUeXBlL0RlZmF1bHRQcmljZVR5cGVcIjtcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgRGVmYXVsdE9yZGVyQnkgaW1wbGVtZW50cyBJQ3JpdGVyaWEgIHtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgT3JkZXJCeUtleSA9IFwiT3JkZXJCeVwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBPcmRlckJ5U2VsZWN0SWQgPSBcIm9yZGVyQnlcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgT3JkZXJCeURpdklkID0gXCJvcmRlckJ5RGl2XCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IE9yZGVyQnlGaXhlZFByaWNlVGVtcGxhdGVJZCA9IFwib3JkZXJCeUZpeGVkUHJpY2VUZW1wbGF0ZVwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBPcmRlckJ5T2RlcnNUZW1wbGF0ZUlkID0gXCJvcmRlckJ5T2RlcnNUZW1wbGF0ZVwiO1xyXG4gICAgXHJcbiAgICBwcml2YXRlIF9zZWFyY2hDcml0ZXJpYUNoYW5nZTogSUNyaXRlcmlhQ2hhbmdlO1xyXG4gICAgXHJcbiAgICBCaW5kRXZlbnRzKGNyaXRlcmlhQ2hhbmdlOiBJQ3JpdGVyaWFDaGFuZ2UpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9zZWFyY2hDcml0ZXJpYUNoYW5nZSA9IGNyaXRlcmlhQ2hhbmdlO1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLk9yZGVyQnlTZWxlY3RJZCkub24oXCJjaGFuZ2VcIixcclxuICAgICAgICAgICAgKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zZWFyY2hDcml0ZXJpYUNoYW5nZS5DdXN0b21Dcml0ZXJpYUNoYW5nZWQoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgVW5CaW5kRXZlbnRzKCk6IHZvaWQge1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLk9yZGVyQnlTZWxlY3RJZCkub2ZmKFwiY2hhbmdlXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIFZhbGlkYXRlQ3JpdGVyaWEoKTogQ3JpdGVyaWFWYWxpZGF0b3IgeyB0aHJvdyBuZXcgRXJyb3IoXCJOb3QgaW1wbGVtZW50ZWRcIik7IH1cclxuXHJcbiAgICBGaWxsQ3JpdGVyaWEodXNlcklucHV0OiBVc2VySW5wdXQpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgbGV0IG9yZGVyQnkgPSAkKFwiI1wiICsgdGhpcy5PcmRlckJ5U2VsZWN0SWQpLnZhbCgpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuT3JkZXJCeUtleV0gPSBvcmRlckJ5O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBQcmljZVR5cGVDaGFuZ2VkKHNlbmRlcjpvYmplY3QsYXJnczpQcmljZVR5cGUpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLlVuQmluZEV2ZW50cygpO1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLk9yZGVyQnlEaXZJZCkuY2hpbGRyZW4oKS5yZW1vdmUoKTtcclxuICAgICAgICBpZiAoYXJncyA9PT0gUHJpY2VUeXBlLkZpeGVkKSB7XHJcbiAgICAgICAgICAgIHZhciB0ZW1wbGF0ZSA9ICQoXCIjXCIrdGhpcy5PcmRlckJ5Rml4ZWRQcmljZVRlbXBsYXRlSWQpLmh0bWwoKTtcclxuICAgICAgICAgICAgdmFyIGh0bWwgPSBNdXN0YWNoZS50b19odG1sKHRlbXBsYXRlLCBudWxsKTtcclxuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuT3JkZXJCeURpdklkKS5hcHBlbmQoaHRtbCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgIHZhciB0ZW1wbGF0ZSA9ICQoXCIjXCIgKyB0aGlzLk9yZGVyQnlPZGVyc1RlbXBsYXRlSWQpLmh0bWwoKTtcclxuICAgICAgICAgICAgdmFyIGh0bWwgPSBNdXN0YWNoZS50b19odG1sKHRlbXBsYXRlLCBudWxsKTtcclxuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuT3JkZXJCeURpdklkKS5hcHBlbmQoaHRtbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuQmluZEV2ZW50cyh0aGlzLl9zZWFyY2hDcml0ZXJpYUNoYW5nZSk7XHJcbiAgICB9XHJcblxyXG4gICBcclxufSIsIu+7v2ltcG9ydCB7IElDcml0ZXJpYSwgQ3JpdGVyaWFWYWxpZGF0b3IgfSBmcm9tIFwiLi4vLi4vSGVscGVyL0lDcml0ZXJpYVwiO1xyXG5pbXBvcnQgeyBVc2VySW5wdXQgfSBmcm9tIFwiLi4vLi4vSGVscGVyL1VzZXJJbnB1dFwiO1xyXG5pbXBvcnQgeyBJQ3JpdGVyaWFDaGFuZ2UgfSBmcm9tIFwiLi4vLi4vSGVscGVyL0lDcml0ZXJpYUNoYW5nZVwiO1xyXG5pbXBvcnQge0V2ZW50RGlzcGF0Y2hlcn0gZnJvbSBcIi4uLy4uL0V2ZW50cy9FdmVudERpc3BhdGNoZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBEZWZhdWx0UHJpY2VUeXBlIGltcGxlbWVudHMgSUNyaXRlcmlhIHtcclxuXHJcbiAgICBwdWJsaWMgU2VsZWN0ZWRQcmljZVR5cGVDaGFuZ2VkRXZlbnQ6IEV2ZW50RGlzcGF0Y2hlcjxEZWZhdWx0UHJpY2VUeXBlLCBQcmljZVR5cGU+ID1cclxuICAgICAgICBuZXcgRXZlbnREaXNwYXRjaGVyPERlZmF1bHRQcmljZVR5cGUsIFByaWNlVHlwZT4oKTtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IFByaWNlVHlwZUtleSA9IFwiUHJpY2VUeXBlXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IFByaWNlVHlwZVNlbGVjdElkID0gXCJwcmljZVR5cGVcIjtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IEZpeFByaWNlRGl2SWQgPVwiZml4ZWRQcmljZVwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBNaW5pbXVtUHJpY2VLZXkgPSBcIk1pbmltdW1QcmljZVwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfbWluUHJpY2VJbnB1dElkID0gXCJtaW5QcmljZVwiO1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgTWF4aW11bVByaWNlS2V5ID0gXCJNYXhpbXVtUHJpY2VcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX21heFByaWNlSW5wdXRJZCA9IFwibWF4UHJpY2VcIjtcclxuICAgIFxyXG4gICAgcHJpdmF0ZSBfc2VhcmNoQ3JpdGVyaWFDaGFuZ2U6IElDcml0ZXJpYUNoYW5nZTtcclxuXHJcbiAgICBwdWJsaWMgQmluZEV2ZW50cyhjcml0ZXJpYUNoYW5nZTogSUNyaXRlcmlhQ2hhbmdlKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fc2VhcmNoQ3JpdGVyaWFDaGFuZ2UgPSBjcml0ZXJpYUNoYW5nZTtcclxuICAgICAgICAvL3lvdSBjYW4gYWxzbyB1c2VyIFwiaW5wdXRcIiBpbnN0ZWFkIG9mIFwiY2hhbmdlXCJcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fbWluUHJpY2VJbnB1dElkKS5vbihcImNoYW5nZVwiLFxyXG4gICAgICAgICAgICAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NlYXJjaENyaXRlcmlhQ2hhbmdlLkN1c3RvbUNyaXRlcmlhQ2hhbmdlZCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fbWF4UHJpY2VJbnB1dElkKS5vbihcImNoYW5nZVwiLFxyXG4gICAgICAgICAgICAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NlYXJjaENyaXRlcmlhQ2hhbmdlLkN1c3RvbUNyaXRlcmlhQ2hhbmdlZCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5QcmljZVR5cGVTZWxlY3RJZCkub24oXCJjaGFuZ2VcIiwgKGV2ZW50KT0+IHtcclxuICAgICAgICAgICAgbGV0IHNlbGVjdGVkUHJpY2VUeXBlID0gdGhpcy5nZXRQcmljZVR5cGUoJChldmVudC5jdXJyZW50VGFyZ2V0KS52YWwoKS50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgaWYgKHNlbGVjdGVkUHJpY2VUeXBlID09PSBQcmljZVR5cGUuRml4ZWQpIHtcclxuICAgICAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLkZpeFByaWNlRGl2SWQpLnNob3coKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLkZpeFByaWNlRGl2SWQpLmhpZGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLlNlbGVjdGVkUHJpY2VUeXBlQ2hhbmdlZEV2ZW50LkRpc3BhdGNoKHRoaXMsIHNlbGVjdGVkUHJpY2VUeXBlKTtcclxuICAgICAgICAgICAgdGhpcy5fc2VhcmNoQ3JpdGVyaWFDaGFuZ2UuQ3VzdG9tQ3JpdGVyaWFDaGFuZ2VkKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRQcmljZVR5cGUoc3RyaW5nUHJpY2VUeXBlOiBzdHJpbmcpOiBQcmljZVR5cGUge1xyXG4gICAgICAgIHJldHVybiBwYXJzZUludChzdHJpbmdQcmljZVR5cGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBVbkJpbmRFdmVudHMoKTogdm9pZCB7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX21pblByaWNlSW5wdXRJZCkub2ZmKFwiY2hhbmdlXCIpO1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9tYXhQcmljZUlucHV0SWQpLm9mZihcImNoYW5nZVwiKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgVmFsaWRhdGVDcml0ZXJpYSgpOiBDcml0ZXJpYVZhbGlkYXRvciB7IHRocm93IG5ldyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZFwiKTsgfVxyXG5cclxuICAgIHB1YmxpYyBGaWxsQ3JpdGVyaWEodXNlcklucHV0OiBVc2VySW5wdXQpOiB2b2lkIHtcclxuICAgICAgICB1c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnlbdGhpcy5QcmljZVR5cGVLZXldID0gJChcIiNcIiArIHRoaXMuUHJpY2VUeXBlU2VsZWN0SWQpLnZhbCgpLnRvU3RyaW5nKCk7XHJcblxyXG4gICAgICAgIGlmIChwYXJzZUludCgkKFwiI1wiICsgdGhpcy5QcmljZVR5cGVTZWxlY3RJZCkudmFsKCkudG9TdHJpbmcoKSkgPT09IFByaWNlVHlwZS5GaXhlZCkge1xyXG4gICAgICAgICAgICBsZXQgbWluUHJpY2UgPSBwYXJzZUludCgkKFwiI1wiICsgdGhpcy5fbWluUHJpY2VJbnB1dElkKS52YWwoKS50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuTWluaW11bVByaWNlS2V5XSA9IG1pblByaWNlO1xyXG5cclxuICAgICAgICAgICAgbGV0IG1heFByaWNlID0gcGFyc2VJbnQoJChcIiNcIiArIHRoaXMuX21heFByaWNlSW5wdXRJZCkudmFsKCkudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLk1heGltdW1QcmljZUtleV0gPSBtYXhQcmljZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBlbnVtIFByaWNlVHlwZSB7XHJcbiAgICBGaXhlZCA9IDEsXHJcbiAgICBBZ3JlZW1lbnQgPSAyLFxyXG4gICAgRXhjaGFuZ2UgPSAzLFxyXG4gICAgSW5zdGFsbG1lbnQgPSA0LFxyXG4gICAgTW9ydGdhZ2VBbmRSZW50ID0gNVxyXG59Iiwi77u/aW1wb3J0IHtDYXJNb2RlbH0gZnJvbSBcIi4uLy4uL01vZGVscy9BZFRyYW5zcG9ydGF0aW9uL0Nhck1vZGVsXCI7XHJcbmltcG9ydCB7VXNlcklucHV0fSBmcm9tIFwiLi4vLi4vSGVscGVyL1VzZXJJbnB1dFwiO1xyXG5pbXBvcnQge0lDcml0ZXJpYSxDcml0ZXJpYVZhbGlkYXRvcn0gZnJvbSBcIi4uLy4uL0hlbHBlci9JQ3JpdGVyaWFcIjtcclxuaW1wb3J0IHtJQ3JpdGVyaWFDaGFuZ2V9IGZyb20gXCIuLi8uLi9IZWxwZXIvSUNyaXRlcmlhQ2hhbmdlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQ2FyTW9kZWxCcmFuZENvbnRyb2xsZXIgaW1wbGVtZW50cyBJQ3JpdGVyaWEge1xyXG4gICAgVmFsaWRhdGVDcml0ZXJpYSgpOiBDcml0ZXJpYVZhbGlkYXRvciB7IHRocm93IG5ldyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZFwiKTsgfVxyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgQ2FyQnJhbmRJZEtleTogc3RyaW5nID0gXCJCcmFuZElkXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IEJyYW5kU2VsZWN0SWQ6IHN0cmluZyA9IFwiYnJhbmRcIjtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IENhck1vZGVsVGVtcGxhdGVJZDogc3RyaW5nID0gXCJtb2RlbFRlbXBsYXRlXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IENhck1vZGVsRGl2UGxhY2VIb2xkZXJJZDogc3RyaW5nID0gXCJtb2RlbFBsYWNlSG9sZGVyXCI7XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBDYXJNb2RlbElkS2V5OiBzdHJpbmcgPSBcIkNhck1vZGVsSWRcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgQWxsQ2FyTW9kZWxzSW5wdXRJZDogc3RyaW5nID0gXCJhbGxDYXJNb2RlbHNcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgTW9kZWxTZWxlY3RJZDogc3RyaW5nID0gXCJtb2RlbFwiO1xyXG4gICAgcHJpdmF0ZSBfYWxsQ2FyTW9kZWxzOiBDYXJNb2RlbFtdO1xyXG5cclxuICAgIHByaXZhdGUgX3NlYXJjaENyaXRlcmlhQ2hhbmdlOklDcml0ZXJpYUNoYW5nZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmluaXRWaWV3KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbml0VmlldygpOiB2b2lkIHtcclxuICAgICAgICBsZXQgYWxsQ2FyTW9kZWxzU3RyaW5nID0gJChcIiNcIiArIHRoaXMuQWxsQ2FyTW9kZWxzSW5wdXRJZCkudmFsKCkudG9TdHJpbmcoKTtcclxuICAgICAgICB0aGlzLl9hbGxDYXJNb2RlbHMgPSAkLnBhcnNlSlNPTihhbGxDYXJNb2RlbHNTdHJpbmcpIGFzIENhck1vZGVsW107XHJcbiAgICAgICAgdGhpcy5pbml0Q2FyTW9kZWwoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXRDYXJNb2RlbCgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmNyZWF0ZUNhck1vZGVsRWxlbWVudChuZXcgQXJyYXk8Q2FyTW9kZWw+KCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlQ2FyTW9kZWxFbGVtZW50KGNhck1vZGVsczogQ2FyTW9kZWxbXSkge1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLkNhck1vZGVsRGl2UGxhY2VIb2xkZXJJZCkuY2hpbGRyZW4oKS5yZW1vdmUoKTtcclxuICAgICAgICBsZXQgdGVtcGxhdGUgPSAkKFwiI1wiICsgdGhpcy5DYXJNb2RlbFRlbXBsYXRlSWQpLmh0bWwoKTtcclxuICAgICAgICBsZXQgZGF0YSA9IHsgY2FyTW9kZWxzOiBjYXJNb2RlbHMgfVxyXG4gICAgICAgIGxldCBodG1sID0gTXVzdGFjaGUudG9faHRtbCh0ZW1wbGF0ZSwgZGF0YSk7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuQ2FyTW9kZWxEaXZQbGFjZUhvbGRlcklkKS5hcHBlbmQoaHRtbCk7XHJcbiAgICAgICAgdGhpcy5iaW5kQ2FyTW9kZWwoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGJpbmRDYXJNb2RlbCgpOiB2b2lkIHtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5Nb2RlbFNlbGVjdElkKS5vbihcImNoYW5nZVwiLChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2VhcmNoQ3JpdGVyaWFDaGFuZ2UuQ3VzdG9tQ3JpdGVyaWFDaGFuZ2VkKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlQ2FyTW9kZWxTZWxlY3QoYnJhbmRJZDogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgbGV0IGNhck1vZGVscyA9IG5ldyBBcnJheTxDYXJNb2RlbD4oKTtcclxuICAgICAgICBpZiAoYnJhbmRJZCAhPT0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLl9hbGxDYXJNb2RlbHMuZm9yRWFjaCgoY2FyTW9kZWwsIGluZGV4LCBhcnJheSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNhck1vZGVsLkJyYW5kSWQgPT09IGJyYW5kSWQpXHJcbiAgICAgICAgICAgICAgICAgICAgY2FyTW9kZWxzLnB1c2goY2FyTW9kZWwpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jcmVhdGVDYXJNb2RlbEVsZW1lbnQoY2FyTW9kZWxzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgRmlsbENyaXRlcmlhKHVzZXJJbnB1dDpVc2VySW5wdXQpOnZvaWQge1xyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLkNhckJyYW5kSWRLZXldID1cclxuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuQnJhbmRTZWxlY3RJZCkuZmluZChcIm9wdGlvbjpzZWxlY3RlZFwiKS52YWwoKTsvL2JyYW5kSWRcclxuICAgICAgICB1c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnlbdGhpcy5DYXJNb2RlbElkS2V5XSA9XHJcbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLk1vZGVsU2VsZWN0SWQpLmZpbmQoXCJvcHRpb246c2VsZWN0ZWRcIikudmFsKCk7Ly9jYXJNb2RlbElkXHJcbiAgICB9XHJcblxyXG4gICAgQmluZEV2ZW50cyhjcml0ZXJpYUNoYW5nZTogSUNyaXRlcmlhQ2hhbmdlKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fc2VhcmNoQ3JpdGVyaWFDaGFuZ2UgPSBjcml0ZXJpYUNoYW5nZTtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5CcmFuZFNlbGVjdElkKS5vbihcImNoYW5nZVwiLCAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgbGV0IHNlbGVjdGVkQnJhbmRJZDogbnVtYmVyID0gcGFyc2VJbnQoJChldmVudC5jdXJyZW50VGFyZ2V0KS5maW5kKFwib3B0aW9uOnNlbGVjdGVkXCIpLnZhbCgpLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUNhck1vZGVsU2VsZWN0KHNlbGVjdGVkQnJhbmRJZCk7XHJcbiAgICAgICAgICAgIGNyaXRlcmlhQ2hhbmdlLkN1c3RvbUNyaXRlcmlhQ2hhbmdlZCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmJpbmRDYXJNb2RlbCgpO1xyXG4gICAgfVxyXG5cclxuICAgIFVuQmluZEV2ZW50cygpOiB2b2lkIHtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5CcmFuZFNlbGVjdElkKS5vZmYoXCJjaGFuZ2VcIik7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuTW9kZWxTZWxlY3RJZCkub2ZmKFwiY2hhbmdlXCIpO1xyXG4gICAgfVxyXG59Iiwi77u/aW1wb3J0IHtJRXZlbnR9ICBmcm9tIFwiLi9JRXZlbnRcIjtcclxuXHJcblxyXG4vKiBUaGUgZGlzcGF0Y2hlciBoYW5kbGVzIHRoZSBzdG9yYWdlIG9mIHN1YnNjaXB0aW9ucyBhbmQgZmFjaWxpdGF0ZXNcclxuICBzdWJzY3JpcHRpb24sIHVuc3Vic2NyaXB0aW9uIGFuZCBkaXNwYXRjaGluZyBvZiB0aGUgZXZlbnQgKi9cclxuZXhwb3J0ICBjbGFzcyBFdmVudERpc3BhdGNoZXI8VFNlbmRlciwgVEFyZ3M+IGltcGxlbWVudHMgSUV2ZW50PFRTZW5kZXIsIFRBcmdzPiB7XHJcblxyXG4gICAgcHJpdmF0ZSBfc3Vic2NyaXB0aW9uczogQXJyYXk8KHNlbmRlcjogVFNlbmRlciwgYXJnczogVEFyZ3MpID0+IHZvaWQ+ID0gbmV3IEFycmF5PChzZW5kZXI6IFRTZW5kZXIsIGFyZ3M6IFRBcmdzKSA9PiB2b2lkPigpO1xyXG5cclxuICAgIHB1YmxpYyBTdWJzY3JpYmUoZm46IChzZW5kZXI6IFRTZW5kZXIsIGFyZ3M6IFRBcmdzKSA9PiB2b2lkKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKGZuKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMucHVzaChmbik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyAgVW5zdWJzY3JpYmUoZm46IChzZW5kZXI6IFRTZW5kZXIsIGFyZ3M6IFRBcmdzKSA9PiB2b2lkKTogdm9pZCB7XHJcbiAgICAgICAgbGV0IGkgPSB0aGlzLl9zdWJzY3JpcHRpb25zLmluZGV4T2YoZm4pO1xyXG4gICAgICAgIGlmIChpID4gLTEpIHtcclxuICAgICAgICAgICAgdGhpcy5fc3Vic2NyaXB0aW9ucy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyAgRGlzcGF0Y2goc2VuZGVyOiBUU2VuZGVyLCBhcmdzOiBUQXJncyk6IHZvaWQge1xyXG4gICAgICAgIGZvciAobGV0IGhhbmRsZXIgb2YgdGhpcy5fc3Vic2NyaXB0aW9ucykge1xyXG4gICAgICAgICAgICBoYW5kbGVyKHNlbmRlciwgYXJncyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59Iiwi77u/aW1wb3J0IHtVc2VySW5wdXR9IGZyb20gXCIuL1VzZXJJbnB1dFwiO1xyXG5pbXBvcnQge0lSZXN1bHRIYW5kbGVyfSBmcm9tIFwiLi9JUmVzdWx0SGFuZGxlclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEFqYXhDYWxsZXIge1xyXG5cclxuICAgIHByaXZhdGUgX251bWJlck9mUHVyZVNlcnZlckNhbGxzOiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfdXJsOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5ICBfcmVzdWx0SGFuZGxlcjogSVJlc3VsdEhhbmRsZXI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9yZXF1ZXN0Q29kZTpudW1iZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IodXJsOiBzdHJpbmcsIHJlc3VsdEhhbmRsZXI6IElSZXN1bHRIYW5kbGVyLHJlcXVlc3RDb2RlOm51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX3VybCA9IHVybDtcclxuICAgICAgICB0aGlzLl9yZXN1bHRIYW5kbGVyID0gcmVzdWx0SGFuZGxlcjtcclxuICAgICAgICB0aGlzLl9yZXF1ZXN0Q29kZSA9IHJlcXVlc3RDb2RlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBDYWxsKHVzZXJJbnB1dDogVXNlcklucHV0KTogdm9pZCB7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgIHVybDogdGhpcy5fdXJsLFxyXG4gICAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeSh1c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnkpLCAvL0RhdGEgc2VudCB0byBzZXJ2ZXJcclxuICAgICAgICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJywgLy8gY29udGVudCB0eXBlIHNlbnQgdG8gc2VydmVyXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IChtc2csIHRleHRTdGF0dXMsIGpxWEhSKSA9PiB0aGlzLm9uU3VjY2Vzc0dldEl0ZW1zRnJvbVNlcnZlcihtc2csIHRleHRTdGF0dXMsIGpxWEhSKSwgLy9PbiBTdWNjZXNzZnVsbCBzZXJ2aWNlIGNhbGxcclxuICAgICAgICAgICAgZXJyb3I6IChqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pID0+IHRoaXMub25FcnJvckdldEl0ZW1zRnJvbVNlcnZlcihqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pIC8vIFdoZW4gU2VydmljZSBjYWxsIGZhaWxzXHJcbiAgICAgICAgfSk7IC8vLmFqYXhcclxuXHJcbiAgICAgICAgdGhpcy5fbnVtYmVyT2ZQdXJlU2VydmVyQ2FsbHMrKztcclxuICAgICAgICB0aGlzLl9yZXN1bHRIYW5kbGVyLkFqYXhDYWxsU3RhcnRlZCh0aGlzLl9yZXF1ZXN0Q29kZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvblN1Y2Nlc3NHZXRJdGVtc0Zyb21TZXJ2ZXIobXNnOiBhbnksIHRleHRTdGF0dXM6IHN0cmluZywganFYSFI6IEpRdWVyeVhIUikge1xyXG5cclxuICAgICAgICB0aGlzLl9udW1iZXJPZlB1cmVTZXJ2ZXJDYWxscy0tO1xyXG4gICAgICAgIGlmICh0aGlzLl9udW1iZXJPZlB1cmVTZXJ2ZXJDYWxscyA9PT0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLl9yZXN1bHRIYW5kbGVyLkFqYXhDYWxsRmluaXNoZWQodGhpcy5fcmVxdWVzdENvZGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9yZXN1bHRIYW5kbGVyLk9uUmVzdWx0KG1zZywgdGhpcy5fcmVxdWVzdENvZGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25FcnJvckdldEl0ZW1zRnJvbVNlcnZlcihqcVhIUjogSlF1ZXJ5WEhSLCB0ZXh0U3RhdHVzOiBzdHJpbmcsIGVycm9yVGhyb3duOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLl9udW1iZXJPZlB1cmVTZXJ2ZXJDYWxscy0tO1xyXG4gICAgICAgIGlmICh0aGlzLl9udW1iZXJPZlB1cmVTZXJ2ZXJDYWxscyA9PT0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLl9yZXN1bHRIYW5kbGVyLkFqYXhDYWxsRmluaXNoZWQodGhpcy5fcmVxdWVzdENvZGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fcmVzdWx0SGFuZGxlci5PbkVycm9yKHRleHRTdGF0dXMgKyBcIiAsIFwiICsgZXJyb3JUaHJvd24sIHRoaXMuX3JlcXVlc3RDb2RlKTtcclxuICAgIH1cclxufSIsIu+7v2ltcG9ydCB7IElDcml0ZXJpYX0gZnJvbSBcIi4vSUNyaXRlcmlhXCI7XHJcbmltcG9ydCB7IE51bWVyaWNEaWN0aW9uYXJ5IH0gZnJvbSBcImxvZGFzaC9pbmRleFwiO1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBDcml0ZXJpYU51bWVyaWNEaWN0aW9uYXJ5IGltcGxlbWVudHMgTnVtZXJpY0RpY3Rpb25hcnk8SUNyaXRlcmlhPiB7XHJcbiAgICBbaW5kZXg6IG51bWJlcl06IElDcml0ZXJpYTtcclxufSIsIu+7v2ludGVyZmFjZSBMb29zZU9iamVjdCB7XHJcbiAgICBba2V5OiBzdHJpbmddOiBhbnlcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFVzZXJJbnB1dCB7XHJcbiAgICBwdWJsaWMgUGFyYW1ldGVyc0RpY3Rpb25hcnk6IExvb3NlT2JqZWN0ID0ge307XHJcbn1cclxuXHJcblxyXG5cclxuIiwi77u/aW1wb3J0IHtBZFRyYW5zZm9ybWF0aW9uU2VhcmNoQ3JpdGVyaWF9IGZyb20gXCIuL1NlYXJjaENyaXRlcmlhL0FkVHJhbnNmb3JtYXRpb25TZWFyY2hDcml0ZXJpYVwiO1xyXG5pbXBvcnQge0RlZmF1bHRTZWFyY2hDcml0ZXJpYX0gZnJvbSBcIi4vU2VhcmNoQ3JpdGVyaWEvRGVmYXVsdFNlYXJjaENyaXRlcmlhXCI7XHJcbmltcG9ydCB7SUNyaXRlcmlhfSBmcm9tIFwiLi4vLi4vLi4vSGVscGVyL0lDcml0ZXJpYVwiO1xyXG5pbXBvcnQge1VzZXJJbnB1dH0gZnJvbSBcIi4uLy4uLy4uL0hlbHBlci9Vc2VySW5wdXRcIjtcclxuaW1wb3J0IHtJQ3JpdGVyaWFDaGFuZ2V9IGZyb20gXCIuLi8uLi8uLi9IZWxwZXIvSUNyaXRlcmlhQ2hhbmdlXCI7XHJcbmltcG9ydCB7Q3JpdGVyaWFOdW1lcmljRGljdGlvbmFyeX0gZnJvbSBcIi4uLy4uLy4uL0hlbHBlci9Dcml0ZXJpYU51bWVyaWNEaWN0aW9uYXJ5XCI7XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIFNlYXJjaENyaXRlcmlhIHtcclxuICAgIHByaXZhdGUgX3NlYXJjaENyaXRlcmlhSW9jQ29udGFpbmVyOiBDcml0ZXJpYU51bWVyaWNEaWN0aW9uYXJ5IDtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuX3NlYXJjaENyaXRlcmlhSW9jQ29udGFpbmVyID0gbmV3IENyaXRlcmlhTnVtZXJpY0RpY3Rpb25hcnkoKTtcclxuICAgICAgICB0aGlzLmluaXRTZWFyY2hDcml0ZXJpYUlvY0NvbnRhaW5lcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaW5pdFNlYXJjaENyaXRlcmlhSW9jQ29udGFpbmVyKCkge1xyXG4gICAgICAgIHRoaXMuX3NlYXJjaENyaXRlcmlhSW9jQ29udGFpbmVyWzBdID0gbmV3IERlZmF1bHRTZWFyY2hDcml0ZXJpYSgpO1xyXG4gICAgICAgIHRoaXMuX3NlYXJjaENyaXRlcmlhSW9jQ29udGFpbmVyWzEwMF0gPSBuZXcgQWRUcmFuc2Zvcm1hdGlvblNlYXJjaENyaXRlcmlhKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIEZpbGxDYXRlZ29yeVNwZWNpZmljU2VhcmNoQ3JpdGVyaWEoY2F0ZWdvcnlJZDogbnVtYmVyLCB1c2VySW5wdXQ6IFVzZXJJbnB1dCk6IHZvaWQge1xyXG4gICAgICAgIGxldCBzZWFyY2hDcml0ZXJpYSA9IHRoaXMucG9seW1vcnBoaWNEaXNwYXRjaFNlYXJjaENyaXRlcmlhKGNhdGVnb3J5SWQpO1xyXG4gICAgICAgIHNlYXJjaENyaXRlcmlhLkZpbGxDcml0ZXJpYSh1c2VySW5wdXQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBCaW5kKGNhdGVnb3J5SWQ6IG51bWJlciwgc2VhcmNoQ3JpdGVyaWFDaGFuZ2U6IElDcml0ZXJpYUNoYW5nZSkge1xyXG4gICAgICAgIGxldCBzZWFyY2hDcml0ZXJpYSA9IHRoaXMucG9seW1vcnBoaWNEaXNwYXRjaFNlYXJjaENyaXRlcmlhKGNhdGVnb3J5SWQpO1xyXG4gICAgICAgIHNlYXJjaENyaXRlcmlhLkJpbmRFdmVudHMoc2VhcmNoQ3JpdGVyaWFDaGFuZ2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBVbkJpbmQoY2F0ZWdvcnlJZDpudW1iZXIpIHtcclxuICAgICAgICBsZXQgc2VhcmNoQ3JpdGVyaWEgPSB0aGlzLnBvbHltb3JwaGljRGlzcGF0Y2hTZWFyY2hDcml0ZXJpYShjYXRlZ29yeUlkKTtcclxuICAgICAgICBzZWFyY2hDcml0ZXJpYS5VbkJpbmRFdmVudHMoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHBvbHltb3JwaGljRGlzcGF0Y2hTZWFyY2hDcml0ZXJpYShjYXRlZ29yeUlkOm51bWJlcik6IElDcml0ZXJpYSB7XHJcbiAgICAgICAgbGV0IHJldHVyblZhbHVlOiBJQ3JpdGVyaWEgPSB0aGlzLl9zZWFyY2hDcml0ZXJpYUlvY0NvbnRhaW5lcltjYXRlZ29yeUlkXTtcclxuICAgICAgICBpZiAocmV0dXJuVmFsdWU9PT11bmRlZmluZWQgfHwgcmV0dXJuVmFsdWU9PT1udWxsKSB7XHJcbiAgICAgICAgICAgIHJldHVyblZhbHVlID0gdGhpcy5fc2VhcmNoQ3JpdGVyaWFJb2NDb250YWluZXJbMF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXR1cm5WYWx1ZTtcclxuICAgIH1cclxufSIsIu+7v2ltcG9ydCB7IElDcml0ZXJpYUNoYW5nZSB9IGZyb20gXCIuLi8uLi8uLi9IZWxwZXIvSUNyaXRlcmlhQ2hhbmdlXCI7XHJcbmltcG9ydCB7IFNlYXJjaENyaXRlcmlhIH0gZnJvbSBcIi4vU2VhcmNoQ3JpdGVyaWFcIjtcclxuaW1wb3J0IHsgSVJlc3VsdEhhbmRsZXIgfSBmcm9tIFwiLi4vLi4vLi4vSGVscGVyL0lSZXN1bHRIYW5kbGVyXCI7XHJcbmltcG9ydCB7IEFqYXhDYWxsZXIgfSBmcm9tIFwiLi4vLi4vLi4vSGVscGVyL0FqYXhDYWxsZXJcIjtcclxuaW1wb3J0IHsgVXNlcklucHV0IH0gZnJvbSBcIi4uLy4uLy4uL0hlbHBlci9Vc2VySW5wdXRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTZWFyY2hDcml0ZXJpYVZpZXdMb2FkZXIgaW1wbGVtZW50cyBJUmVzdWx0SGFuZGxlciB7XHJcbiAgICBcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgUmVxdWVzdEluZGV4S2V5OiBzdHJpbmcgPSBcIlJlcXVlc3RJbmRleFwiO1xyXG4gICAgcHJpdmF0ZSBfY3VycmVudFJlcXVlc3RJbmRleDogbnVtYmVyID0gMDtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF91cmw6IHN0cmluZyA9IFwiL0hvbWUvR2V0U2VhcmNoQ3JpdGVyaWFWaWV3XCI7XHJcblxyXG4gICAgcHJpdmF0ZSBfcmVzdWx0SGFuZGxlcjogSVJlc3VsdEhhbmRsZXI7XHJcbiAgICBwcml2YXRlIF9hamF4Q2FsbGVyOiBBamF4Q2FsbGVyO1xyXG5cclxuICAgIHByaXZhdGUgX3NlYXJjaENyaXRlcmlhQ2hhbmdlOiBJQ3JpdGVyaWFDaGFuZ2U7XHJcbiAgICBwcml2YXRlIF9wcmV2aW91c0NhdGVnb3J5SWQ6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIF9jdXJyZW50Q2F0ZWdvcnlJZDogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgX3NlYXJjaENyaXRlcmlhOiBTZWFyY2hDcml0ZXJpYTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihyZXN1bHRIYW5kbGVyOiBJUmVzdWx0SGFuZGxlcixcclxuICAgICAgICBzZWFyY2hDcml0ZXJpYUNoYW5nZTogSUNyaXRlcmlhQ2hhbmdlLFxyXG4gICAgICAgIHNlYXJjaENyaXRlcmlhOiBTZWFyY2hDcml0ZXJpYSxcclxuICAgICAgICByZXF1ZXN0Q29kZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fcmVzdWx0SGFuZGxlciA9IHJlc3VsdEhhbmRsZXI7XHJcbiAgICAgICAgdGhpcy5fYWpheENhbGxlciA9IG5ldyBBamF4Q2FsbGVyKHRoaXMuX3VybCwgdGhpcywgcmVxdWVzdENvZGUpO1xyXG4gICAgICAgIHRoaXMuX3NlYXJjaENyaXRlcmlhQ2hhbmdlID0gc2VhcmNoQ3JpdGVyaWFDaGFuZ2U7XHJcbiAgICAgICAgdGhpcy5fc2VhcmNoQ3JpdGVyaWEgPSBzZWFyY2hDcml0ZXJpYTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgR2V0U2VhcmNoQ3JpdGVyaWFWaWV3RnJvbVNlcnZlcih1c2VySW5wdXQ6VXNlcklucHV0LGNhdGVnb3J5SWQ6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX2N1cnJlbnRSZXF1ZXN0SW5kZXgrKztcclxuICAgICAgICB0aGlzLl9jdXJyZW50Q2F0ZWdvcnlJZCA9IGNhdGVnb3J5SWQ7XHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuUmVxdWVzdEluZGV4S2V5XSA9IHRoaXMuX2N1cnJlbnRSZXF1ZXN0SW5kZXg7XHJcbiAgICAgICAgdGhpcy5fYWpheENhbGxlci5DYWxsKHVzZXJJbnB1dCk7Ly9HRVRcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgT25SZXN1bHQocGFyYW06IGFueSwgcmVxdWVzdENvZGU6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIGlmIChwYXJhbS5DdXN0b21EaWN0aW9uYXJ5W3RoaXMuUmVxdWVzdEluZGV4S2V5XSA9PSB0aGlzLl9jdXJyZW50UmVxdWVzdEluZGV4KSB7IC8vbGFzdCBjYWxsIHJlc3BvbnNlXHJcbiAgICAgICAgICAgIGlmIChwYXJhbS5TdWNjZXNzID09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NlYXJjaENyaXRlcmlhLlVuQmluZCh0aGlzLl9wcmV2aW91c0NhdGVnb3J5SWQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVzdWx0SGFuZGxlci5PblJlc3VsdChwYXJhbS5SZXNwb25zZURhdGEsIHJlcXVlc3RDb2RlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NlYXJjaENyaXRlcmlhLkJpbmQodGhpcy5fY3VycmVudENhdGVnb3J5SWQsIHRoaXMuX3NlYXJjaENyaXRlcmlhQ2hhbmdlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3ByZXZpb3VzQ2F0ZWdvcnlJZCA9IHRoaXMuX2N1cnJlbnRDYXRlZ29yeUlkO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVzdWx0SGFuZGxlci5PbkVycm9yKHBhcmFtLk1lc3NhZ2UgKyBcIiAsIFwiICsgcGFyYW0uRXJyb3JDb2RlLCByZXF1ZXN0Q29kZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIE9uRXJyb3IobWVzc2FnZTogc3RyaW5nLCByZXF1ZXN0Q29kZTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fcmVzdWx0SGFuZGxlci5PbkVycm9yKG1lc3NhZ2UscmVxdWVzdENvZGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBBamF4Q2FsbFN0YXJ0ZWQocmVxdWVzdENvZGU6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX3Jlc3VsdEhhbmRsZXIuQWpheENhbGxTdGFydGVkKHJlcXVlc3RDb2RlKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgQWpheENhbGxGaW5pc2hlZChyZXF1ZXN0Q29kZTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fcmVzdWx0SGFuZGxlci5BamF4Q2FsbEZpbmlzaGVkKHJlcXVlc3RDb2RlKTtcclxuICAgIH1cclxuICAgIFxyXG59Iiwi77u/aW1wb3J0IHsgVXNlcklucHV0IH0gZnJvbSBcIi4uLy4uLy4uLy4uL0hlbHBlci9Vc2VySW5wdXRcIjtcclxuaW1wb3J0IHsgSUNyaXRlcmlhQ2hhbmdlIH0gZnJvbSBcIi4uLy4uLy4uLy4uL0hlbHBlci9JQ3JpdGVyaWFDaGFuZ2VcIjtcclxuaW1wb3J0IHsgSUNyaXRlcmlhLCBDcml0ZXJpYVZhbGlkYXRvciB9IGZyb20gXCIuLi8uLi8uLi8uLi9IZWxwZXIvSUNyaXRlcmlhXCI7XHJcbmltcG9ydCB7IENhck1vZGVsQnJhbmRDb250cm9sbGVyIH0gZnJvbSBcIi4uLy4uLy4uLy4uL0NvbXBvbmVudHMvVHJhbnNmb3JtYXRpb24vQ2FyTW9kZWxCcmFuZENvbnRyb2xsZXJcIjtcclxuaW1wb3J0IHtEZWZhdWx0T3JkZXJCeX0gZnJvbSBcIi4uLy4uLy4uLy4uL0NvbXBvbmVudHMvT3JkZXJCeS9EZWZhdWx0T3JkZXJCeVwiO1xyXG5pbXBvcnQge0RlZmF1bHRQcmljZVR5cGV9IGZyb20gXCIuLi8uLi8uLi8uLi9Db21wb25lbnRzL1ByaWNlVHlwZS9EZWZhdWx0UHJpY2VUeXBlXCI7XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIEFkVHJhbnNmb3JtYXRpb25TZWFyY2hDcml0ZXJpYSBpbXBsZW1lbnRzIElDcml0ZXJpYSB7XHJcblxyXG4gICAgcHJpdmF0ZSBfY2FyTW9kZWxCcmFuZENvbnRvbGxlcjogQ2FyTW9kZWxCcmFuZENvbnRyb2xsZXI7XHJcbiAgICBwcml2YXRlIF9kZWZhdWx0T3JkZXJCeTogRGVmYXVsdE9yZGVyQnk7XHJcbiAgICBwcml2YXRlIF9kZWZhdWx0UHJpY2VUeXBlOiBEZWZhdWx0UHJpY2VUeXBlO1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgTWFrZVllYXJGcm9tS2V5OiBzdHJpbmcgPSBcIk1ha2VZZWFyRnJvbVwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBNYWtlWWVhckZyb21JbnB1dElkOiBzdHJpbmcgPSBcImZyb21ZZWFyXCI7XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBNYWtlWWVhclRvS2V5OiBzdHJpbmcgPSBcIk1ha2VZZWFyVG9cIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgTWFrZVllYXJUb0lucHV0SWQ6IHN0cmluZyA9IFwidG9ZZWFyXCI7XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBGdWVsS2V5ID0gXCJGdWVsXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IEZ1ZWxTZWxlY3RJZDogc3RyaW5nID0gXCJmdWVsXCI7XHJcblxyXG4gICAgcHVibGljIHJlYWRvbmx5IE1pbGVhZ2VGcm9tS2V5OiBzdHJpbmcgPSBcIk1pbGVhZ2VGcm9tXCI7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgTWlsZWFnZUZyb21JbnB1dElkOiBzdHJpbmcgPSBcIm1pbGVhZ2VGcm9tXCI7XHJcblxyXG4gICAgcHVibGljIHJlYWRvbmx5IE1pbGVhZ2VUb0tleTogc3RyaW5nID0gXCJNaWxlYWdlVG9cIjtcclxuICAgIHB1YmxpYyByZWFkb25seSBNaWxlYWdlVG9JbnB1dElkOiBzdHJpbmcgPSBcIm1pbGVhZ2VUb1wiO1xyXG5cclxuICAgIHB1YmxpYyByZWFkb25seSBHZWFyYm94S2V5OiBzdHJpbmcgPSBcIkdlYXJib3hcIjtcclxuICAgIHB1YmxpYyByZWFkb25seSBHZWFyYm94VHlwZVNlbGVjdElkOiBzdHJpbmcgPSBcImdlYXJib3hUeXBlXCI7XHJcblxyXG4gICAgcHVibGljIHJlYWRvbmx5IEJvZHlDb2xvcktleTogc3RyaW5nID0gXCJCb2R5Q29sb3JcIjtcclxuICAgIHB1YmxpYyByZWFkb25seSBCb2R5Q29sb3JTZWxlY3RJZDogc3RyaW5nID0gXCJib2R5Q29sb3JcIjtcclxuXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgSW50ZXJuYWxDb2xvcktleTogc3RyaW5nID0gXCJJbnRlcm5hbENvbG9yXCI7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgSW50ZXJuYWxDb2xvclNlbGVjdElkID0gXCJpbnRlcm5hbENvbG9yXCI7XHJcblxyXG4gICAgcHVibGljIHJlYWRvbmx5IEJvZHlTdGF0dXNLZXk6IHN0cmluZyA9IFwiQm9keVN0YXR1c1wiO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IEJvZHlTdGF0dXNTZWxlY3RJZDogc3RyaW5nID0gXCJib2R5U3RhdHVzXCI7XHJcblxyXG4gICAgcHVibGljIHJlYWRvbmx5IENhclN0YXR1c0tleTogc3RyaW5nID0gXCJDYXJTdGF0dXNcIjtcclxuICAgIHB1YmxpYyByZWFkb25seSBDYXJTdGF0dXNTZWxlY3RJZDogc3RyaW5nID0gXCJjYXJTdGF0dXNcIjtcclxuXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgUGxhdGVUeXBlS2V5OiBzdHJpbmcgPSBcIlBsYXRlVHlwZVwiO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IFBsYXRlVHlwZVNlbGVjdElkOiBzdHJpbmcgPSBcInBsYXRlVHlwZVwiO1xyXG5cclxuICAgIHByaXZhdGUgaW5pdFZpZXcoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fY2FyTW9kZWxCcmFuZENvbnRvbGxlciA9IG5ldyBDYXJNb2RlbEJyYW5kQ29udHJvbGxlcigpO1xyXG4gICAgICAgIHRoaXMuX2RlZmF1bHRQcmljZVR5cGUgPSBuZXcgRGVmYXVsdFByaWNlVHlwZSgpO1xyXG4gICAgICAgIHRoaXMuX2RlZmF1bHRPcmRlckJ5ID0gbmV3IERlZmF1bHRPcmRlckJ5KCk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHJlZ2lzdGVyRXZlbnRzKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX2RlZmF1bHRQcmljZVR5cGUuU2VsZWN0ZWRQcmljZVR5cGVDaGFuZ2VkRXZlbnQuU3Vic2NyaWJlKChzZW5kZXIsIGFyZ3MpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fZGVmYXVsdE9yZGVyQnkuUHJpY2VUeXBlQ2hhbmdlZChzZW5kZXIsIGFyZ3MpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdW5SZWdpc3RlckV2ZW50cygpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9kZWZhdWx0UHJpY2VUeXBlLlNlbGVjdGVkUHJpY2VUeXBlQ2hhbmdlZEV2ZW50LlVuc3Vic2NyaWJlKChzZW5kZXIsIGFyZ3MpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fZGVmYXVsdE9yZGVyQnkuUHJpY2VUeXBlQ2hhbmdlZChzZW5kZXIsIGFyZ3MpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vVE9ETyBpbiBvcnRoZXIgdG8gbWluaW1pemUgYmFuZHdpZHRoIHVzYWdlIGl0IGlzIGdvb2QgcHJjdGljZSB0byBub3Qgc2VuZCBjcml0ZXJpYXMgdGhhdCBoYXZlIGRlZmF1bHQgdmFsdWVcclxuICAgIHB1YmxpYyBGaWxsQ3JpdGVyaWEodXNlcklucHV0OiBVc2VySW5wdXQpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9jYXJNb2RlbEJyYW5kQ29udG9sbGVyLkZpbGxDcml0ZXJpYSh1c2VySW5wdXQpO1xyXG4gICAgICAgIHRoaXMuX2RlZmF1bHRPcmRlckJ5LkZpbGxDcml0ZXJpYSh1c2VySW5wdXQpO1xyXG4gICAgICAgIHRoaXMuX2RlZmF1bHRQcmljZVR5cGUuRmlsbENyaXRlcmlhKHVzZXJJbnB1dCk7XHJcblxyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLk1ha2VZZWFyRnJvbUtleV0gPVxyXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5NYWtlWWVhckZyb21JbnB1dElkKS52YWwoKTsvL21ha2VZZWFyRnJvbVxyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLk1ha2VZZWFyVG9LZXldID1cclxuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuTWFrZVllYXJUb0lucHV0SWQpLnZhbCgpOy8vbWFrZVllYXJUb1xyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLkZ1ZWxLZXldID1cclxuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuRnVlbFNlbGVjdElkKS5maW5kKFwib3B0aW9uOnNlbGVjdGVkXCIpLnZhbCgpOy8vZnVlbFxyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLk1pbGVhZ2VGcm9tS2V5XSA9XHJcbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLk1pbGVhZ2VGcm9tSW5wdXRJZCkudmFsKCk7Ly9taWxlYWdlRnJvbVxyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLk1pbGVhZ2VUb0tleV0gPVxyXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5NaWxlYWdlVG9JbnB1dElkKS52YWwoKTsvL21pbGVhZ2VUb1xyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLkdlYXJib3hLZXldID1cclxuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuR2VhcmJveFR5cGVTZWxlY3RJZCkuZmluZChcIm9wdGlvbjpzZWxlY3RlZFwiKS52YWwoKTsvL2dlYXJib3hUeXBlICAgICAgICBcclxuICAgICAgICB1c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnlbdGhpcy5Cb2R5Q29sb3JLZXldID1cclxuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuQm9keUNvbG9yU2VsZWN0SWQpLmZpbmQoXCJvcHRpb246c2VsZWN0ZWRcIikudmFsKCk7Ly9ib2R5Q29sb3JcclxuICAgICAgICB1c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnlbdGhpcy5JbnRlcm5hbENvbG9yS2V5XSA9XHJcbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLkludGVybmFsQ29sb3JTZWxlY3RJZCkuZmluZChcIm9wdGlvbjpzZWxlY3RlZFwiKS52YWwoKTsvL2ludGVybmFsQ29sb3IgICAgICAgIFxyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLkJvZHlTdGF0dXNLZXldID1cclxuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuQm9keVN0YXR1c1NlbGVjdElkKS5maW5kKFwib3B0aW9uOnNlbGVjdGVkXCIpLnZhbCgpOy8vYm9keVN0YXR1c1xyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLkNhclN0YXR1c0tleV0gPVxyXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5DYXJTdGF0dXNTZWxlY3RJZCkuZmluZChcIm9wdGlvbjpzZWxlY3RlZFwiKS52YWwoKTsvL2NhclN0YXR1cyAgICAgICAgXHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuUGxhdGVUeXBlS2V5XSA9XHJcbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLlBsYXRlVHlwZVNlbGVjdElkKS5maW5kKFwib3B0aW9uOnNlbGVjdGVkXCIpLnZhbCgpOy8vcGxhdGVUeXBlXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIEJpbmRFdmVudHMoY3JpdGVyaWFDaGFuZ2U6IElDcml0ZXJpYUNoYW5nZSk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuaW5pdFZpZXcoKTtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyRXZlbnRzKCk7XHJcblxyXG4gICAgICAgIHRoaXMuX2Nhck1vZGVsQnJhbmRDb250b2xsZXIuQmluZEV2ZW50cyhjcml0ZXJpYUNoYW5nZSk7XHJcbiAgICAgICAgdGhpcy5fZGVmYXVsdE9yZGVyQnkuQmluZEV2ZW50cyhjcml0ZXJpYUNoYW5nZSk7XHJcbiAgICAgICAgdGhpcy5fZGVmYXVsdFByaWNlVHlwZS5CaW5kRXZlbnRzKGNyaXRlcmlhQ2hhbmdlKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgVW5CaW5kRXZlbnRzKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX2Nhck1vZGVsQnJhbmRDb250b2xsZXIuVW5CaW5kRXZlbnRzKCk7XHJcbiAgICAgICAgdGhpcy5fZGVmYXVsdE9yZGVyQnkuVW5CaW5kRXZlbnRzKCk7XHJcbiAgICAgICAgdGhpcy5fZGVmYXVsdFByaWNlVHlwZS5VbkJpbmRFdmVudHMoKTtcclxuICAgICAgICB0aGlzLnVuUmVnaXN0ZXJFdmVudHMoKTtcclxuICAgIH1cclxuXHJcbiAgICBWYWxpZGF0ZUNyaXRlcmlhKCk6IENyaXRlcmlhVmFsaWRhdG9yIHsgdGhyb3cgbmV3IEVycm9yKFwiTm90IGltcGxlbWVudGVkXCIpOyB9XHJcbn1cclxuXHJcblxyXG5cclxuIiwi77u/aW1wb3J0IHtJQ3JpdGVyaWEsQ3JpdGVyaWFWYWxpZGF0b3J9IGZyb20gXCIuLi8uLi8uLi8uLi9IZWxwZXIvSUNyaXRlcmlhXCI7XHJcbmltcG9ydCB7IFVzZXJJbnB1dCB9IGZyb20gXCIuLi8uLi8uLi8uLi9IZWxwZXIvVXNlcklucHV0XCI7XHJcbmltcG9ydCB7IElDcml0ZXJpYUNoYW5nZSB9IGZyb20gXCIuLi8uLi8uLi8uLi9IZWxwZXIvSUNyaXRlcmlhQ2hhbmdlXCI7XHJcbmltcG9ydCB7RGVmYXVsdE9yZGVyQnl9IGZyb20gXCIuLi8uLi8uLi8uLi9Db21wb25lbnRzL09yZGVyQnkvRGVmYXVsdE9yZGVyQnlcIjtcclxuaW1wb3J0IHtEZWZhdWx0UHJpY2VUeXBlfSBmcm9tIFwiLi4vLi4vLi4vLi4vQ29tcG9uZW50cy9QcmljZVR5cGUvRGVmYXVsdFByaWNlVHlwZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIERlZmF1bHRTZWFyY2hDcml0ZXJpYSBpbXBsZW1lbnRzIElDcml0ZXJpYXtcclxuXHJcbiAgICBwcml2YXRlIF9kZWZhdWx0T3JkZXJCeTogRGVmYXVsdE9yZGVyQnk7XHJcbiAgICBwcml2YXRlIF9kZWZhdWx0UHJpY2VUeXBlOkRlZmF1bHRQcmljZVR5cGU7XHJcblxyXG4gICAgcHJpdmF0ZSBpbml0VmlldygpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9kZWZhdWx0UHJpY2VUeXBlID0gbmV3IERlZmF1bHRQcmljZVR5cGUoKTtcclxuICAgICAgICB0aGlzLl9kZWZhdWx0T3JkZXJCeSA9IG5ldyBEZWZhdWx0T3JkZXJCeSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVnaXN0ZXJFdmVudHMoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fZGVmYXVsdFByaWNlVHlwZS5TZWxlY3RlZFByaWNlVHlwZUNoYW5nZWRFdmVudC5TdWJzY3JpYmUoKHNlbmRlciwgYXJncykgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9kZWZhdWx0T3JkZXJCeS5QcmljZVR5cGVDaGFuZ2VkKHNlbmRlciwgYXJncyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1blJlZ2lzdGVyRXZlbnRzKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX2RlZmF1bHRQcmljZVR5cGUuU2VsZWN0ZWRQcmljZVR5cGVDaGFuZ2VkRXZlbnQuVW5zdWJzY3JpYmUoKHNlbmRlciwgYXJncykgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9kZWZhdWx0T3JkZXJCeS5QcmljZVR5cGVDaGFuZ2VkKHNlbmRlciwgYXJncyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIEZpbGxDcml0ZXJpYSh1c2VySW5wdXQ6IFVzZXJJbnB1dCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX2RlZmF1bHRPcmRlckJ5LkZpbGxDcml0ZXJpYSh1c2VySW5wdXQpO1xyXG4gICAgICAgIHRoaXMuX2RlZmF1bHRQcmljZVR5cGUuRmlsbENyaXRlcmlhKHVzZXJJbnB1dCk7XHJcbiAgICB9XHJcblxyXG4gICAgQmluZEV2ZW50cyhjcml0ZXJpYUNoYW5nZTogSUNyaXRlcmlhQ2hhbmdlKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5pbml0VmlldygpO1xyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJFdmVudHMoKTtcclxuICAgICAgICB0aGlzLl9kZWZhdWx0T3JkZXJCeS5CaW5kRXZlbnRzKGNyaXRlcmlhQ2hhbmdlKTtcclxuICAgICAgICB0aGlzLl9kZWZhdWx0UHJpY2VUeXBlLkJpbmRFdmVudHMoY3JpdGVyaWFDaGFuZ2UpO1xyXG4gICAgfVxyXG5cclxuICAgIFVuQmluZEV2ZW50cygpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9kZWZhdWx0T3JkZXJCeS5VbkJpbmRFdmVudHMoKTtcclxuICAgICAgICB0aGlzLl9kZWZhdWx0UHJpY2VUeXBlLlVuQmluZEV2ZW50cygpO1xyXG4gICAgICAgIHRoaXMudW5SZWdpc3RlckV2ZW50cygpO1xyXG4gICAgfVxyXG5cclxuICAgIFZhbGlkYXRlQ3JpdGVyaWEoKTogQ3JpdGVyaWFWYWxpZGF0b3Ige1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZFwiKTtcclxuICAgIH1cclxufSIsIu+7v2ltcG9ydCB7IFVzZXJJbnB1dCB9IGZyb20gXCIuLi8uLi8uLi9IZWxwZXIvVXNlcklucHV0XCI7XHJcbmltcG9ydCB7IElSZXN1bHRIYW5kbGVyIH0gZnJvbSBcIi4uLy4uLy4uL0hlbHBlci9JUmVzdWx0SGFuZGxlclwiO1xyXG5pbXBvcnQge0FqYXhDYWxsZXJ9IGZyb20gXCIuLi8uLi8uLi9IZWxwZXIvQWpheENhbGxlclwiO1xyXG5cclxuLy9UT0RPIG1ha2UgY291bnQgb3B0aW9uYWwgdG8gdXNlclxyXG5leHBvcnQgY2xhc3MgU2VydmVyQ2FsbGVyIGltcGxlbWVudHMgSVJlc3VsdEhhbmRsZXIge1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgUmVxdWVzdEluZGV4S2V5OiBzdHJpbmcgPSBcIlJlcXVlc3RJbmRleFwiO1xyXG4gICAgcHJpdmF0ZSBfY3VycmVudFJlcXVlc3RJbmRleDogbnVtYmVyID0gMDtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF91cmw6IHN0cmluZyA9IFwiL2FwaS9BZEFwaS9HZXRBZHZlcnRpc2VtZW50Q29tbW9uXCI7XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSAgX3Jlc3VsdEhhbmRsZXI6IElSZXN1bHRIYW5kbGVyO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSAgX2FqYXhDYWxsZXI6IEFqYXhDYWxsZXI7XHJcbiAgICBcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgU3RhcnRJbmRleEtleTogc3RyaW5nID0gXCJTdGFydEluZGV4XCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9pbml0aWFsU3RhcnQ6IG51bWJlciA9IDE7XHJcbiAgICBwcml2YXRlIF9zdGFydDogbnVtYmVyID0gMTtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IENvdW50S2V5OiBzdHJpbmcgPSBcIkNvdW50XCI7XHJcbiAgICBwcml2YXRlIF9jb3VudDogbnVtYmVyID0gNTtcclxuICAgIFxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBOdW1iZXJPZkl0ZW1zS2V5OiBzdHJpbmcgPSBcIm51bWJlck9mSXRlbXNcIjtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IocmVzdWx0SGFuZGxlcjogSVJlc3VsdEhhbmRsZXIscmVxdWVzdENvZGU6bnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fcmVzdWx0SGFuZGxlciA9IHJlc3VsdEhhbmRsZXI7XHJcbiAgICAgICAgdGhpcy5fYWpheENhbGxlciA9IG5ldyBBamF4Q2FsbGVyKHRoaXMuX3VybCwgdGhpcyxyZXF1ZXN0Q29kZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIEdldEFkSXRlbXNGcm9tU2VydmVyKHVzZXJJbnB1dDogVXNlcklucHV0KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fY3VycmVudFJlcXVlc3RJbmRleCsrO1xyXG5cclxuICAgICAgICB1c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnlbdGhpcy5TdGFydEluZGV4S2V5XSA9IHRoaXMuX3N0YXJ0O1xyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLkNvdW50S2V5XSA9IHRoaXMuX2NvdW50O1xyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLlJlcXVlc3RJbmRleEtleV0gPSB0aGlzLl9jdXJyZW50UmVxdWVzdEluZGV4O1xyXG5cclxuICAgICAgICB0aGlzLl9hamF4Q2FsbGVyLkNhbGwodXNlcklucHV0KTtcclxuICAgIH0gLy9HZXRBZEl0ZW1zRnJvbVNlcnZlclxyXG5cclxuICAgcHVibGljIE9uUmVzdWx0KHBhcmFtOmFueSxyZXF1ZXN0Q29kZTpudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICAvL1RPRE8gY2hlY2sgZm9yIHVuZGVmaW5lZCBvciBudWxsIGluIG1zZyBhbmQgbXNnLmN1c3RvbURpY3Rpb25hcnlbXCJSZXF1ZXN0SW5kZXhcIl1cclxuICAgICAgICBpZiAocGFyYW0uQ3VzdG9tRGljdGlvbmFyeVt0aGlzLlJlcXVlc3RJbmRleEtleV0gPT0gdGhpcy5fY3VycmVudFJlcXVlc3RJbmRleCkgeyAvL2xhc3QgY2FsbCByZXNwb25zZVxyXG4gICAgICAgICAgICBpZiAocGFyYW0uU3VjY2VzcyA9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zdGFydCArPSBwYXJzZUludChwYXJhbS5DdXN0b21EaWN0aW9uYXJ5W3RoaXMuTnVtYmVyT2ZJdGVtc0tleV0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVzdWx0SGFuZGxlci5PblJlc3VsdChwYXJhbS5SZXNwb25zZURhdGEsIHJlcXVlc3RDb2RlKTtcclxuICAgICAgICAgICAgfSAvL2lmIChtc2cuc3VjY2VzcyA9PSB0cnVlKVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3Jlc3VsdEhhbmRsZXIuT25FcnJvcihwYXJhbS5NZXNzYWdlICsgXCIgLCBcIiArIHBhcmFtLkVycm9yQ29kZSwgcmVxdWVzdENvZGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBPbkVycm9yKG1lc3NhZ2U6IHN0cmluZyxyZXF1ZXN0Q29kZTpudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9yZXN1bHRIYW5kbGVyLk9uRXJyb3IobWVzc2FnZSwgcmVxdWVzdENvZGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBBamF4Q2FsbEZpbmlzaGVkKHJlcXVlc3RDb2RlOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9yZXN1bHRIYW5kbGVyLkFqYXhDYWxsRmluaXNoZWQocmVxdWVzdENvZGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBBamF4Q2FsbFN0YXJ0ZWQocmVxdWVzdENvZGU6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX3Jlc3VsdEhhbmRsZXIuQWpheENhbGxTdGFydGVkKHJlcXVlc3RDb2RlKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgUmVzZXRTZWFyY2hQYXJhbWV0ZXJzKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX3N0YXJ0ID0gdGhpcy5faW5pdGlhbFN0YXJ0O1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuIiwi77u/aW1wb3J0IHsgQ2F0ZWdvcnkgfSBmcm9tIFwiLi4vLi4vLi4vTW9kZWxzL0NhdGVnb3J5XCI7XHJcbmltcG9ydCB7IENhdGVnb3J5U2VsZWN0aW9uIH0gZnJvbSBcIi4uLy4uLy4uL0NvbXBvbmVudHMvQ2F0ZWdvcnkvQ2F0ZWdvcnlTZWxlY3Rpb25cIjtcclxuaW1wb3J0IHsgU2VydmVyQ2FsbGVyIH0gZnJvbSBcIi4vU2VydmVyQ2FsbGVyXCI7XHJcbmltcG9ydCB7IFNlYXJjaENyaXRlcmlhVmlld0xvYWRlciB9IGZyb20gXCIuL1NlYXJjaENyaXRlcmlhVmlld0xvYWRlclwiO1xyXG5pbXBvcnQgeyBTZWFyY2hDcml0ZXJpYSB9IGZyb20gXCIuL1NlYXJjaENyaXRlcmlhXCI7XHJcbmltcG9ydCB7IElDcml0ZXJpYUNoYW5nZSB9IGZyb20gXCIuLi8uLi8uLi9IZWxwZXIvSUNyaXRlcmlhQ2hhbmdlXCI7XHJcbmltcG9ydCB7IFVzZXJJbnB1dCB9IGZyb20gXCIuLi8uLi8uLi9IZWxwZXIvVXNlcklucHV0XCI7XHJcbmltcG9ydCB7IElSZXN1bHRIYW5kbGVyIH0gZnJvbSBcIi4uLy4uLy4uL0hlbHBlci9JUmVzdWx0SGFuZGxlclwiO1xyXG5pbXBvcnQgeyBBZHZlcnRpc2VtZW50Q29tbW9uIH0gZnJvbSBcIi4uLy4uLy4uL01vZGVscy9BZHZlcnRpc2VtZW50Q29tbW9uXCI7XHJcblxyXG5cclxuXHJcbi8vVE9ETyB3aGVuIGNhdGVnb3J5IGNoYW5nZSBiZWZvcmUgc2VhcmNoIGNyaXRlaWEgaXMgbG9hZGVkIGEgc2VhcmNoIGNhbGwgaXMgc2VudCB0byBzZXJ2ZXJcclxuLy9hZGQgYW4gZXZlbnQgbGlrZSB2aWV3TG9hZFN0YXJ0ZWQsIHZpZXdMb2FkSW5Qcm9ncmVzcyx2aWV3TG9hZENvbXBsZXRlZCBhbmQgZGlzYWJsZSBzZWFyY2hcclxuLy9kdXJuZyBpblByb2dyZXNzIGVuZCBlbmFibGUgaXQgYWZ0ZXIgY29tcGxldGVkXHJcbmV4cG9ydCBjbGFzcyBJbmRleCBpbXBsZW1lbnRzIElDcml0ZXJpYUNoYW5nZSwgSVJlc3VsdEhhbmRsZXIge1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgQ2FsbEltYWdlSWQ6IHN0cmluZyA9IFwic2VydmVyQ2FsbGVkSW1hZ2VcIjtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IEFkVHlwZUtleTogc3RyaW5nID0gXCJBZFR5cGVcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgQWRUeXBlUGFyZW50RGl2SWQgPSBcImFkVHlwZVwiO1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgU2VhcmNoVGV4dEtleSA9IFwiU2VhcmNoVGV4dFwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBTZWFyY2hUZXh0SW5wdXRJZCA9IFwic2VhcmNoVGV4dFwiO1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2FkUGxhY2VIb2xkZXJEaXZJZDogc3RyaW5nID0gXCJhZFBsYWNlSG9sZGVyXCI7XHJcblxyXG4gICAgcHJpdmF0ZSBfc2VydmVyQ2FsbGVyOiBTZXJ2ZXJDYWxsZXI7XHJcbiAgICBwcml2YXRlIF9jYXRlZ29yeVNlbGVjdGlvbjogQ2F0ZWdvcnlTZWxlY3Rpb247XHJcbiAgICBwcml2YXRlIF9zZWFyY2hDcml0ZXJpYTogU2VhcmNoQ3JpdGVyaWE7XHJcbiAgICBwcml2YXRlIF9zZWFyY2hDcml0ZXJpYVZpZXdMb2FkZXI6IFNlYXJjaENyaXRlcmlhVmlld0xvYWRlcjtcclxuXHJcbiAgICBwcml2YXRlIF9jYXRlZ29yeVNlbGVjdG9yUGFyZW50RGl2SWQ6IHN0cmluZztcclxuICAgIHByaXZhdGUgX2FsbENhdGVnb3JpZXNJZDogc3RyaW5nO1xyXG5cclxuICAgIHByaXZhdGUgX2dldEFkRnJvbVNlcnZlckJ1dHRvbklkID0gXCJnZXRBZEZyb21TZXJ2ZXJcIjtcclxuICAgIHByaXZhdGUgX21lc3NhZ2VEaXZJZCA9IFwibWVzc2FnZVwiO1xyXG4gICAgcHJpdmF0ZSBfY2F0ZWdvcnlTcGVjaWZpY1NlYXJjaENyaXRlcmlhUGFyZW50RGl2SWQ9IFwiY2F0ZWdvcnlTcGVjaWZpY1NlYXJjaENyaXRlcmlhXCI7XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBHZXRBZEZyb21TZXJ2ZXJSZXF1ZXN0Q29kZSA9IDE7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IExvYWRTZWFyY2hQYXJ0aWFsVmlld1JlcXVlc3RDb2RlID0gMjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihjYXRlZ29yeVNlbGVjdG9yUGFyZW50RGl2SWQ6IHN0cmluZyxcclxuICAgICAgICBhbGxDYXRlZ29yaWVzSWQ6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuX2NhdGVnb3J5U2VsZWN0b3JQYXJlbnREaXZJZCA9IGNhdGVnb3J5U2VsZWN0b3JQYXJlbnREaXZJZDtcclxuICAgICAgICB0aGlzLl9hbGxDYXRlZ29yaWVzSWQgPSBhbGxDYXRlZ29yaWVzSWQ7XHJcblxyXG4gICAgICAgIHRoaXMuX3NlcnZlckNhbGxlciA9IG5ldyBTZXJ2ZXJDYWxsZXIodGhpcywgdGhpcy5HZXRBZEZyb21TZXJ2ZXJSZXF1ZXN0Q29kZSk7XHJcbiAgICAgICAgdGhpcy5fc2VhcmNoQ3JpdGVyaWEgPSBuZXcgU2VhcmNoQ3JpdGVyaWEoKTtcclxuICAgICAgICB0aGlzLl9zZWFyY2hDcml0ZXJpYVZpZXdMb2FkZXIgPSBuZXcgU2VhcmNoQ3JpdGVyaWFWaWV3TG9hZGVyXHJcbiAgICAgICAgICAgICh0aGlzLCB0aGlzLCB0aGlzLl9zZWFyY2hDcml0ZXJpYSwgdGhpcy5Mb2FkU2VhcmNoUGFydGlhbFZpZXdSZXF1ZXN0Q29kZSk7XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdFBhZ2UoKTtcclxuICAgICAgICB0aGlzLmluaXRFdmVudEhhbmRsZXJzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbml0UGFnZSgpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgdGhpcy5pbml0Q2F0ZWdvcnlTZWxlY3Rpb25Db250cm9sKCk7XHJcbiAgICAgICAgdGhpcy5pbml0R2V0QWRGcm9tU2VydmVyKCk7XHJcbiAgICAgICAgdGhpcy5pbml0U2luZ2xlQWRJdGVtU3R5bGUoKTtcclxuXHJcbiAgICB9Ly9pbml0UGFnZVxyXG5cclxuICAgIHByaXZhdGUgaW5pdENhdGVnb3J5U2VsZWN0aW9uQ29udHJvbCgpOiB2b2lkIHtcclxuICAgICAgICBsZXQgYWxsQ2F0ZWdvcmllc1N0cmluZyA9ICQoXCIjXCIgKyB0aGlzLl9hbGxDYXRlZ29yaWVzSWQpLnZhbCgpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgbGV0IGFsbENhdGVnb3JpZXMgPSAkLnBhcnNlSlNPTihhbGxDYXRlZ29yaWVzU3RyaW5nKSBhcyBDYXRlZ29yeVtdO1xyXG4gICAgICAgIHRoaXMuX2NhdGVnb3J5U2VsZWN0aW9uID0gbmV3IENhdGVnb3J5U2VsZWN0aW9uKHRoaXMuX2NhdGVnb3J5U2VsZWN0b3JQYXJlbnREaXZJZCwgYWxsQ2F0ZWdvcmllcyk7XHJcbiAgICAgICAgdGhpcy5fY2F0ZWdvcnlTZWxlY3Rpb24uQ3JlYXRlRmlyc3RMZXZlbCgpO1xyXG5cclxuICAgIH0vL2luaXRDYXRlZ29yeVNlbGVjdGlvbkNvbnRyb2xcclxuXHJcbiAgICBwcml2YXRlIGdldFNlYXJjaENyaXRlcmlhUGFydGlhbFZpZXcoY2F0ZWdvcnlJZDogbnVtYmVyKSB7XHJcbiAgICAgICAgbGV0IHVzZXJJbnB1dCA9IG5ldyBVc2VySW5wdXQoKTtcclxuICAgICAgICB0aGlzLl9jYXRlZ29yeVNlbGVjdGlvbi5JbnNlcnRDYXRlZ29yeUlkSW5Vc2VySW5wdXREaWN0aW9uYXJ5KHVzZXJJbnB1dCk7XHJcbiAgICAgICAgdGhpcy5fc2VhcmNoQ3JpdGVyaWFWaWV3TG9hZGVyLkdldFNlYXJjaENyaXRlcmlhVmlld0Zyb21TZXJ2ZXIodXNlcklucHV0LGNhdGVnb3J5SWQpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBpbml0RXZlbnRIYW5kbGVycygpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9jYXRlZ29yeVNlbGVjdGlvbi5TZWxlY3RlZENhdGVnb3J5Q2hhbmdlZEV2ZW50LlN1YnNjcmliZSgoc2VuZGVyLCBhcmdzKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VhcmNoQ3JpdGVyaWFDaGFuZ2VkKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZ2V0U2VhcmNoQ3JpdGVyaWFQYXJ0aWFsVmlldyhhcmdzLlNlbGVjdGVkQ2F0ZWdvcnlJZCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuZ2V0U2VhcmNoQ3JpdGVyaWFQYXJ0aWFsVmlldyh0aGlzLl9jYXRlZ29yeVNlbGVjdGlvbi5HZXRTZWxlY3RlZENhdGVnb3J5SWQoKSk7XHJcblxyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuX3NlYXJjaENyaXRlcmlhLkJpbmQodGhpcy5fY2F0ZWdvcnlTZWxlY3Rpb24uR2V0U2VsZWN0ZWRDYXRlZ29yeUlkKCksIHRoaXMpO1xyXG4gICAgICAgIFxyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLkFkVHlwZVBhcmVudERpdklkKS5vbihcImNoYW5nZVwiLFxyXG4gICAgICAgICAgICAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2VhcmNoQ3JpdGVyaWFDaGFuZ2VkKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5TZWFyY2hUZXh0SW5wdXRJZCkub24oXCJpbnB1dFwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VhcmNoQ3JpdGVyaWFDaGFuZ2VkKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJChkb2N1bWVudCkua2V5cHJlc3MoKGUpID0+IHtcclxuICAgICAgICAgICAgaWYgKGUud2hpY2ggPT0gMTMpIHtcclxuICAgICAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLl9nZXRBZEZyb21TZXJ2ZXJCdXR0b25JZCkuY2xpY2soKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgQ3VzdG9tQ3JpdGVyaWFDaGFuZ2VkKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuc2VhcmNoQ3JpdGVyaWFDaGFuZ2VkKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZWFyY2hDcml0ZXJpYUNoYW5nZWQoKTogdm9pZCB7XHJcbiAgICAgICAgJChcIiNhZFBsYWNlSG9sZGVyXCIpLmNoaWxkcmVuKCkucmVtb3ZlKCk7XHJcbiAgICAgICAgdGhpcy5fc2VydmVyQ2FsbGVyLlJlc2V0U2VhcmNoUGFyYW1ldGVycygpO1xyXG4gICAgICAgIC8vICQoXCIjXCIgKyB0aGlzLl9nZXRBZEZyb21TZXJ2ZXJJZCkudHJpZ2dlcihcImNsaWNrXCIpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXRHZXRBZEZyb21TZXJ2ZXIoKTogdm9pZCB7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX2dldEFkRnJvbVNlcnZlckJ1dHRvbklkKS5vbihcImNsaWNrXCIsIChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBsZXQgdXNlcklucHV0ID0gbmV3IFVzZXJJbnB1dCgpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fY2F0ZWdvcnlTZWxlY3Rpb24uSW5zZXJ0Q2F0ZWdvcnlJZEluVXNlcklucHV0RGljdGlvbmFyeSh1c2VySW5wdXQpO1xyXG5cclxuICAgICAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuQWRUeXBlS2V5XSA9ICQoXCIjXCIgKyB0aGlzLkFkVHlwZVBhcmVudERpdklkKS5jaGlsZHJlbihcIjpjaGVja2VkXCIpLnZhbCgpO1xyXG4gICAgICAgICAgICB1c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnlbdGhpcy5TZWFyY2hUZXh0S2V5XSA9ICQoXCIjXCIgKyB0aGlzLlNlYXJjaFRleHRJbnB1dElkKS52YWwoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX3NlYXJjaENyaXRlcmlhLkZpbGxDYXRlZ29yeVNwZWNpZmljU2VhcmNoQ3JpdGVyaWEodGhpcy5fY2F0ZWdvcnlTZWxlY3Rpb24uR2V0U2VsZWN0ZWRDYXRlZ29yeUlkKCksIHVzZXJJbnB1dCk7Ly9maWxsIGNhdGVnb3J5IHNwZWNpZmljIHNlYXJjaCBwYXJhbWV0ZXJzXHJcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlRXJyb3JNZXNzYWdlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3NlcnZlckNhbGxlci5HZXRBZEl0ZW1zRnJvbVNlcnZlcih1c2VySW5wdXQpO1xyXG4gICAgICAgIH0pOyAvL2NsaWNrXHJcbiAgICB9Ly9pbml0R2V0QWRGcm9tU2VydmVyXHJcblxyXG5cclxuICAgIHB1YmxpYyBPblJlc3VsdChtc2c6IGFueSwgcmVxdWVzdENvZGU6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIGlmIChyZXF1ZXN0Q29kZSA9PT0gdGhpcy5HZXRBZEZyb21TZXJ2ZXJSZXF1ZXN0Q29kZSkge1xyXG4gICAgICAgICAgICB0aGlzLm9uUmVzdWx0R2V0QWRGcm9tU2VydmVyKG1zZyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHJlcXVlc3RDb2RlID09PSB0aGlzLkxvYWRTZWFyY2hQYXJ0aWFsVmlld1JlcXVlc3RDb2RlKSB7XHJcbiAgICAgICAgICAgIHRoaXMub25SZXN1bHRMb2FkU2VhcmNoUGFydGlhbFZpZXcobXNnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBPbkVycm9yKG1lc3NhZ2U6IHN0cmluZywgcmVxdWVzdENvZGU6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIGlmIChyZXF1ZXN0Q29kZSA9PT0gdGhpcy5HZXRBZEZyb21TZXJ2ZXJSZXF1ZXN0Q29kZSkge1xyXG4gICAgICAgICAgICB0aGlzLm9uRXJyb3JHZXRBZEZyb21TZXJ2ZXIobWVzc2FnZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHJlcXVlc3RDb2RlID09PSB0aGlzLkxvYWRTZWFyY2hQYXJ0aWFsVmlld1JlcXVlc3RDb2RlKSB7XHJcbiAgICAgICAgICAgIHRoaXMub25FcnJvckxvYWRTZWFyY2hQYXJ0aWFsVmlldyhtZXNzYWdlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIEFqYXhDYWxsRmluaXNoZWQocmVxdWVzdENvZGU6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIGlmIChyZXF1ZXN0Q29kZSA9PT0gdGhpcy5HZXRBZEZyb21TZXJ2ZXJSZXF1ZXN0Q29kZSkge1xyXG4gICAgICAgICAgICB0aGlzLmFqYXhDYWxsRmluaXNoZWRHZXRBZEZyb21TZXJ2ZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAocmVxdWVzdENvZGUgPT09IHRoaXMuTG9hZFNlYXJjaFBhcnRpYWxWaWV3UmVxdWVzdENvZGUpIHtcclxuICAgICAgICAgICAgdGhpcy5hamF4Q2FsbEZpbmlzaGVkTG9hZFNlYXJjaFBhcnRpYWxWaWV3KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEFqYXhDYWxsU3RhcnRlZChyZXF1ZXN0Q29kZTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHJlcXVlc3RDb2RlID09PSB0aGlzLkdldEFkRnJvbVNlcnZlclJlcXVlc3RDb2RlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWpheENhbGxTdGFydGVkR2V0QWRGcm9tU2VydmVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHJlcXVlc3RDb2RlID09PSB0aGlzLkxvYWRTZWFyY2hQYXJ0aWFsVmlld1JlcXVlc3RDb2RlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWpheENhbGxTdGFydGVkTG9hZFNlYXJjaFBhcnRpYWxWaWV3KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25SZXN1bHRHZXRBZEZyb21TZXJ2ZXIoYWR2ZXJ0aXNlbWVudENvbW1vbnM6IEFkdmVydGlzZW1lbnRDb21tb25bXSk6IHZvaWQge1xyXG4gICAgICAgIHZhciB0ZW1wbGF0ZSA9ICQoJyNzaW5nbGVBZEl0ZW0nKS5odG1sKCk7XHJcbiAgICAgICAgdmFyIGRhdGE7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhZHZlcnRpc2VtZW50Q29tbW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgYWRJbWFnZSA9IG51bGw7XHJcbiAgICAgICAgICAgIGlmIChhZHZlcnRpc2VtZW50Q29tbW9uc1tpXS5BZHZlcnRpc2VtZW50SW1hZ2VzWzBdICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGFkSW1hZ2UgPSBcImRhdGE6aW1hZ2UvanBnO2Jhc2U2NCxcIiArIGFkdmVydGlzZW1lbnRDb21tb25zW2ldLkFkdmVydGlzZW1lbnRJbWFnZXNbMF07XHJcbiAgICAgICAgICAgIH0gLy9lbmQgaWZcclxuICAgICAgICAgICAgZGF0YSA9IHtcclxuICAgICAgICAgICAgICAgIEFkdmVydGlzZW1lbnRJZDogYWR2ZXJ0aXNlbWVudENvbW1vbnNbaV0uQWR2ZXJ0aXNlbWVudElkLFxyXG4gICAgICAgICAgICAgICAgQWR2ZXJ0aXNlbWVudENhdGVnb3J5SWQ6IGFkdmVydGlzZW1lbnRDb21tb25zW2ldLkFkdmVydGlzZW1lbnRDYXRlZ29yeUlkLFxyXG4gICAgICAgICAgICAgICAgQWR2ZXJ0aXNlbWVudENhdGVnb3J5OiBhZHZlcnRpc2VtZW50Q29tbW9uc1tpXS5BZHZlcnRpc2VtZW50Q2F0ZWdvcnksXHJcbiAgICAgICAgICAgICAgICBhZEltYWdlOiBhZEltYWdlLFxyXG4gICAgICAgICAgICAgICAgYWRQcmljZTogYWR2ZXJ0aXNlbWVudENvbW1vbnNbaV0uQWR2ZXJ0aXNlbWVudFByaWNlLlByaWNlU3RyaW5nLCAvL3RvZG8gY2hlY2sgdGhlIHByaWNlIHR5cGVcclxuICAgICAgICAgICAgICAgIEFkdmVydGlzZW1lbnRUaXRsZTogYWR2ZXJ0aXNlbWVudENvbW1vbnNbaV0uQWR2ZXJ0aXNlbWVudFRpdGxlLFxyXG4gICAgICAgICAgICAgICAgQWR2ZXJ0aXNlbWVudFN0YXR1czogYWR2ZXJ0aXNlbWVudENvbW1vbnNbaV0uQWR2ZXJ0aXNlbWVudFN0YXR1c1xyXG4gICAgICAgICAgICAgICAgLy9hZERhdGU6IG1zZy5SZXNwb25zZURhdGFbaV0uQWRUaW1lXHJcbiAgICAgICAgICAgIH0gLy9lbmQgZGF0YVxyXG5cclxuICAgICAgICAgICAgdmFyIGh0bWwgPSBNdXN0YWNoZS50b19odG1sKHRlbXBsYXRlLCBkYXRhKTtcclxuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuX2FkUGxhY2VIb2xkZXJEaXZJZCkuYXBwZW5kKGh0bWwpO1xyXG4gICAgICAgIH0gLy9lbmQgZm9yXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvblJlc3VsdExvYWRTZWFyY2hQYXJ0aWFsVmlldyhtc2c6IGFueSkge1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9jYXRlZ29yeVNwZWNpZmljU2VhcmNoQ3JpdGVyaWFQYXJlbnREaXZJZCkuY2hpbGRyZW4oKS5yZW1vdmUoKTtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fY2F0ZWdvcnlTcGVjaWZpY1NlYXJjaENyaXRlcmlhUGFyZW50RGl2SWQpLmh0bWwobXNnKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgcHJpdmF0ZSBvbkVycm9yR2V0QWRGcm9tU2VydmVyKG1lc3NhZ2U6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuc2hvd0Vycm9yTWVzc2FnZShtZXNzYWdlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9uRXJyb3JMb2FkU2VhcmNoUGFydGlhbFZpZXcobWVzc2FnZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5zaG93RXJyb3JNZXNzYWdlKG1lc3NhZ2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYWpheENhbGxTdGFydGVkR2V0QWRGcm9tU2VydmVyKCkge1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLkNhbGxJbWFnZUlkKS5zaG93KCk7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX2dldEFkRnJvbVNlcnZlckJ1dHRvbklkKS5hdHRyKFwiZGlzYWJsZWRcIiwgXCJkaXNhYmxlZFwiKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGFqYXhDYWxsU3RhcnRlZExvYWRTZWFyY2hQYXJ0aWFsVmlldygpIHtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5DYWxsSW1hZ2VJZCkuc2hvdygpOy8vVE9ETyBzaG93IGFub3RoZXIgaW1hZ2UgbWF5IGNvbmZsaWN0IHdpdGggYWRcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGFqYXhDYWxsRmluaXNoZWRHZXRBZEZyb21TZXJ2ZXIoKSB7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuQ2FsbEltYWdlSWQpLmhpZGUoKTtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fZ2V0QWRGcm9tU2VydmVyQnV0dG9uSWQpLnJlbW92ZUF0dHIoXCJkaXNhYmxlZFwiKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgYWpheENhbGxGaW5pc2hlZExvYWRTZWFyY2hQYXJ0aWFsVmlldygpIHtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5DYWxsSW1hZ2VJZCkuaGlkZSgpOy8vVE9ETyBzaG93IGFub3RoZXIgaW1hZ2UgbWF5IGNvbmZsaWN0IHdpdGggYWRcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNob3dFcnJvck1lc3NhZ2UobWVzc2FnZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVFcnJvck1lc3NhZ2UoKTtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fbWVzc2FnZURpdklkKS5hcHBlbmQoYDxwPiR7bWVzc2FnZX08L3A+YCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZW1vdmVFcnJvck1lc3NhZ2UoKSB7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX21lc3NhZ2VEaXZJZCkuY2hpbGRyZW4oKS5yZW1vdmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXRTaW5nbGVBZEl0ZW1TdHlsZSgpOiB2b2lkIHtcclxuICAgICAgICAvL3Nob3cgZGV0YWlsIG9mIHNpbmdsZUFkSXRlbSB3aGVuIG1vdXNlIG92ZXJcclxuICAgICAgICAkKGRvY3VtZW50KS5vbihcIm1vdXNlZW50ZXIgbW91c2VsZWF2ZVwiLCBcIi5ibG9ja0Rpc3BsYXlcIiwgKGV2ZW50OiBKUXVlcnkuRXZlbnQ8SFRNTEVsZW1lbnQsIG51bGw+KSA9PiB7XHJcbiAgICAgICAgICAgICQoZXZlbnQuY3VycmVudFRhcmdldCkuZmluZChcIi5tb3JlSW5mb1wiKS5mYWRlVG9nZ2xlKDI1MCk7XHJcbiAgICAgICAgICAgIC8vJCh0aGlzKS5maW5kKFwiLm1vcmVJbmZvXCIpLmZhZGVUb2dnbGUoMjUwKTtcclxuICAgICAgICB9KTsvL2VuZCBvblxyXG4gICAgfS8vaW5pdFNpbmdsZUFkSXRlbVN0eWxlXHJcbn1cclxuXHJcbmxldCBjYXRlZ29yeVNlbGVjdG9yUGFyZW50RGl2SWQ6IHN0cmluZyA9IFwiY2F0ZWdvcnlTZWxlY3RvclwiO1xyXG5sZXQgYWxsQ2F0ZWdvcmllc0lkID0gXCJhbGxDYXRlZ29yaWVzXCI7XHJcblxyXG5kZWNsYXJlIGxldCB3aW5kb3c6IGFueTtcclxudmFyIGluZGV4OiBJbmRleDtcclxuXHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeSgoKSA9PiB7XHJcbiAgICBpbmRleCA9IG5ldyBJbmRleChjYXRlZ29yeVNlbGVjdG9yUGFyZW50RGl2SWQsIGFsbENhdGVnb3JpZXNJZCk7XHJcbiAgICBpbmRleC5DdXN0b21Dcml0ZXJpYUNoYW5nZWQoKTsvL3RvIGluaXRpYXRlIGEgc2VydmVyIGNhbGwgb24gcGFnZSBsb2FkIGZvciBmaXJzdCB0aW1lXHJcbiAgICB3aW5kb3cuQWxpSW5kZXggPSBpbmRleDtcclxufSk7Ly9yZWFkeSJdfQ==
