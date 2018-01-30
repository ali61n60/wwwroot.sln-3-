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
    function AjaxCaller(url, resultHandler) {
        this._numberOfPureServerCalls = 0;
        this._url = url;
        this._resultHandler = resultHandler;
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
        this._resultHandler.AjaxCallStarted();
    };
    AjaxCaller.prototype.onSuccessGetItemsFromServer = function (msg, textStatus, jqXHR) {
        this._numberOfPureServerCalls--;
        if (this._numberOfPureServerCalls === 0) {
            this._resultHandler.AjaxCallFinished();
        }
        this._resultHandler.OnResult(msg);
    };
    AjaxCaller.prototype.onErrorGetItemsFromServer = function (jqXHR, textStatus, errorThrown) {
        this._numberOfPureServerCalls--;
        if (this._numberOfPureServerCalls === 0) {
            this._resultHandler.AjaxCallFinished();
        }
        this._resultHandler.OnError(textStatus + " , " + errorThrown);
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
var NewAdPartialViewLoader_1 = require("../../newAd/src/NewAdPartialViewLoader");
var SearchCriteriaViewLoader = /** @class */ (function () {
    function SearchCriteriaViewLoader(parentDivId, searchCriteriaChange, searchCriteria) {
        this._url = "/Home/GetSearchCriteriaView";
        this._previousCategoryId = 0;
        this._currentCategoryId = 0;
        this._parentDivId = parentDivId;
        this._searchCriteriaChange = searchCriteriaChange;
        this._searchCriteria = searchCriteria;
    }
    SearchCriteriaViewLoader.prototype.GetSearchCriteriaViewFromServer = function (categoryId) {
        var _this = this;
        this._currentCategoryId = categoryId;
        var callParams = new NewAdPartialViewLoader_1.PartialViewServerCallParameters();
        callParams.CategoryId = categoryId;
        $.ajax({
            type: "GET",
            url: this._url,
            data: callParams,
            //contentType: 'application/json', // content type sent to server
            success: function (msg, textStatus, jqXHR) { return _this.onSuccessGetItemsFromServer(msg, textStatus, jqXHR); },
            error: function (jqXHR, textStatus, errorThrown) { return _this.onErrorGetItemsFromServer(jqXHR, textStatus, errorThrown); } // When Service call fails
        }); //.ajax
    };
    SearchCriteriaViewLoader.prototype.onSuccessGetItemsFromServer = function (msg, textStatus, jqXHR) {
        this._searchCriteria.UnBind(this._previousCategoryId);
        $("#" + this._parentDivId).children().remove();
        $("#" + this._parentDivId).html(msg);
        this._searchCriteria.Bind(this._currentCategoryId, this._searchCriteriaChange);
        this._previousCategoryId = this._currentCategoryId;
    }; //onSuccessGetTimeFromServer
    SearchCriteriaViewLoader.prototype.onErrorGetItemsFromServer = function (jqXHR, textStatus, errorThrown) {
        alert(errorThrown);
    }; //onErrorGetTimeFromServer
    return SearchCriteriaViewLoader;
}());
exports.SearchCriteriaViewLoader = SearchCriteriaViewLoader;
},{"../../newAd/src/NewAdPartialViewLoader":15}],11:[function(require,module,exports){
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
    function ServerCaller(resultHandler) {
        this.StartIndexKey = "StartIndex";
        this._initialStart = 1;
        this._start = 1;
        this.CountKey = "Count";
        this._count = 5;
        this.RequestIndexKey = "RequestIndex";
        this._currentRequestIndex = 0;
        this.NumberOfItemsKey = "numberOfItems";
        this._url = "/api/AdApi/GetAdvertisementCommon";
        this._resultHandler = resultHandler;
        this._ajaxCaller = new AjaxCaller_1.AjaxCaller(this._url, this);
    }
    ServerCaller.prototype.GetAdItemsFromServer = function (userInput) {
        this._currentRequestIndex++;
        userInput.ParametersDictionary[this.StartIndexKey] = this._start;
        userInput.ParametersDictionary[this.CountKey] = this._count;
        userInput.ParametersDictionary[this.RequestIndexKey] = this._currentRequestIndex;
        this._ajaxCaller.Call(userInput);
    }; //GetAdItemsFromServer
    ServerCaller.prototype.onErrorGetItemsFromServer = function (jqXHR, textStatus, errorThrown) {
        this._resultHandler.OnError(textStatus + " , " + errorThrown);
    };
    ServerCaller.prototype.ResetSearchParameters = function () {
        this._start = this._initialStart;
    };
    ServerCaller.prototype.OnResult = function (param) {
        //TODO check for undefined or null in msg and msg.customDictionary["RequestIndex"]
        if (param.CustomDictionary[this.RequestIndexKey] == this._currentRequestIndex) {
            if (param.Success == true) {
                this._start += parseInt(param.CustomDictionary[this.NumberOfItemsKey]);
                //TODO create AdvertisementCommon[] object from msg.responseData
                this._resultHandler.OnResult(param.ResponseData);
            } //if (msg.success == true)
            else {
                this._resultHandler.OnError(param.Message + " , " + param.ErrorCode);
            }
        }
    };
    ServerCaller.prototype.OnError = function (message) {
        this._resultHandler.OnError(message);
    };
    ServerCaller.prototype.AjaxCallFinished = function () {
        this._resultHandler.AjaxCallFinished();
    };
    ServerCaller.prototype.AjaxCallStarted = function () {
        this._resultHandler.AjaxCallStarted();
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
        this._categorySelectorParentDivId = categorySelectorParentDivId;
        this._allCategoriesId = allCategoriesId;
        this._serverCaller = new ServerCaller_1.ServerCaller(this);
        this._searchCriteria = new SearchCriteria_1.SearchCriteria();
        this._searchCriteriaViewLoader = new SearchCriteriaViewLoader_1.SearchCriteriaViewLoader("categorySpecificSearchCriteria", this, this._searchCriteria);
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
    Index.prototype.initEventHandlers = function () {
        var _this = this;
        this._categorySelection.SelectedCategoryChangedEvent.Subscribe(function (sender, args) {
            _this.searchCriteriaChanged();
            _this._searchCriteriaViewLoader.GetSearchCriteriaViewFromServer(args.SelectedCategoryId);
        });
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
    Index.prototype.OnResult = function (advertisementCommons) {
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
    Index.prototype.OnError = function (message) {
        this.showErrorMessage(message);
    };
    Index.prototype.AjaxCallStarted = function () {
        $("#" + this.CallImageId).show();
        $("#" + this._getAdFromServerButtonId).attr("disabled", "disabled");
    };
    Index.prototype.AjaxCallFinished = function () {
        $("#" + this.CallImageId).hide();
        $("#" + this._getAdFromServerButtonId).removeAttr("disabled");
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
},{"../../../Components/Category/CategorySelection":1,"../../../Helper/UserInput":8,"./SearchCriteria":9,"./SearchCriteriaViewLoader":10,"./ServerCaller":13}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NewAdPartialViewLoader = /** @class */ (function () {
    function NewAdPartialViewLoader(partialViewDivId, newAdCriteriaChange, newAdCriteria) {
        this._url = "/NewAd/GetNewAdPartialView";
        this._previousCategoryId = 0;
        this._currentCategoryId = 0;
        this._partialViewDivId = partialViewDivId;
        this._newAdCriteriaChange = newAdCriteriaChange;
        this._newAdCriteria = newAdCriteria;
    }
    NewAdPartialViewLoader.prototype.GetPartialViewFromServer = function (categoryId) {
        var _this = this;
        this._currentCategoryId = categoryId;
        var callParams = new PartialViewServerCallParameters();
        callParams.CategoryId = categoryId;
        $.ajax({
            type: "GET",
            url: this._url,
            data: callParams,
            //contentType: 'application/json', // content type sent to server
            success: function (msg, textStatus, jqXHR) { return _this.onSuccessGetItemsFromServer(msg, textStatus, jqXHR); },
            error: function (jqXHR, textStatus, errorThrown) { return _this.onErrorGetItemsFromServer(jqXHR, textStatus, errorThrown); } // When Service call fails
        }); //.ajax
    };
    NewAdPartialViewLoader.prototype.onSuccessGetItemsFromServer = function (msg, textStatus, jqXHR) {
        this._newAdCriteria.UnBind(this._previousCategoryId);
        $("#" + this._partialViewDivId).children().remove();
        $("#" + this._partialViewDivId).html(msg);
        this._newAdCriteria.Bind(this._currentCategoryId, this._newAdCriteriaChange);
        this._previousCategoryId = this._currentCategoryId;
    }; //onSuccessGetTimeFromServer
    NewAdPartialViewLoader.prototype.onErrorGetItemsFromServer = function (jqXHR, textStatus, errorThrown) {
        alert(errorThrown);
    }; //onErrorGetTimeFromServer
    return NewAdPartialViewLoader;
}());
exports.NewAdPartialViewLoader = NewAdPartialViewLoader;
//TODO refactor this
var PartialViewServerCallParameters = /** @class */ (function () {
    function PartialViewServerCallParameters() {
    }
    return PartialViewServerCallParameters;
}());
exports.PartialViewServerCallParameters = PartialViewServerCallParameters;
},{}]},{},[14])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3d3dyb290L2pzL0NvbXBvbmVudHMvQ2F0ZWdvcnkvQ2F0ZWdvcnlTZWxlY3Rpb24udHMiLCJ3d3dyb290L2pzL0NvbXBvbmVudHMvT3JkZXJCeS9EZWZhdWx0T3JkZXJCeS50cyIsInd3d3Jvb3QvanMvQ29tcG9uZW50cy9QcmljZVR5cGUvRGVmYXVsdFByaWNlVHlwZS50cyIsInd3d3Jvb3QvanMvQ29tcG9uZW50cy9UcmFuc2Zvcm1hdGlvbi9DYXJNb2RlbEJyYW5kQ29udHJvbGxlci50cyIsInd3d3Jvb3QvanMvRXZlbnRzL0V2ZW50RGlzcGF0Y2hlci50cyIsInd3d3Jvb3QvanMvSGVscGVyL0FqYXhDYWxsZXIudHMiLCJ3d3dyb290L2pzL0hlbHBlci9Dcml0ZXJpYU51bWVyaWNEaWN0aW9uYXJ5LnRzIiwid3d3cm9vdC9qcy9IZWxwZXIvVXNlcklucHV0LnRzIiwid3d3cm9vdC9qcy9ob21lL2luZGV4L3NyYy9TZWFyY2hDcml0ZXJpYS50cyIsInd3d3Jvb3QvanMvaG9tZS9pbmRleC9zcmMvU2VhcmNoQ3JpdGVyaWFWaWV3TG9hZGVyLnRzIiwid3d3cm9vdC9qcy9ob21lL2luZGV4L3NyYy9TZWFyY2hDcml0ZXJpYS9BZFRyYW5zZm9ybWF0aW9uU2VhcmNoQ3JpdGVyaWEudHMiLCJ3d3dyb290L2pzL2hvbWUvaW5kZXgvc3JjL1NlYXJjaENyaXRlcmlhL0RlZmF1bHRTZWFyY2hDcml0ZXJpYS50cyIsInd3d3Jvb3QvanMvaG9tZS9pbmRleC9zcmMvU2VydmVyQ2FsbGVyLnRzIiwid3d3cm9vdC9qcy9ob21lL2luZGV4L3NyYy9pbmRleC50cyIsInd3d3Jvb3QvanMvaG9tZS9uZXdBZC9zcmMvTmV3QWRQYXJ0aWFsVmlld0xvYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUMsZ0VBQStEO0FBSWhFO0lBMkJJLDJCQUFZLFdBQW1CLEVBQUUsYUFB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SSxDQUFDLGlCQUFpQixDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUM3RSxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDO0lBQ3ZELENBQUMsRUFBQSw0QkFBNEI7SUFFckIsMERBQXlCLEdBQWpDLFVBQWtDLEtBQWdCLEVBQUUsVUFBa0IsRUFBRSxXQUFtQjtRQUN2RixLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDdkIsQ0FBQyxFQUFBLDBCQUEwQjtJQUMvQiw2QkFBQztBQUFELENBdkNBLEFBdUNDLElBQUE7QUF2Q1ksd0RBQXNCO0FBeUNuQyxvQkFBb0I7QUFDcEI7SUFBQTtJQUVBLENBQUM7SUFBRCxzQ0FBQztBQUFELENBRkEsQUFFQyxJQUFBO0FBRlksMEVBQStCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIu+7v2ltcG9ydCB7IEV2ZW50RGlzcGF0Y2hlciB9IGZyb20gXCIuLi8uLi9FdmVudHMvRXZlbnREaXNwYXRjaGVyXCI7XHJcbmltcG9ydCB7IENhdGVnb3J5IH0gZnJvbSBcIi4uLy4uL01vZGVscy9DYXRlZ29yeVwiO1xyXG5pbXBvcnQgeyBVc2VySW5wdXQgfSBmcm9tIFwiLi4vLi4vSGVscGVyL1VzZXJJbnB1dFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIENhdGVnb3J5U2VsZWN0aW9uIHtcclxuXHJcbiAgICBwdWJsaWMgU2VsZWN0ZWRDYXRlZ29yeUNoYW5nZWRFdmVudDogRXZlbnREaXNwYXRjaGVyPENhdGVnb3J5U2VsZWN0aW9uLCBDYXRlZ29yeUNhaG5nZWRFdmVudEFyZz4gPSBuZXcgRXZlbnREaXNwYXRjaGVyPENhdGVnb3J5U2VsZWN0aW9uLCBDYXRlZ29yeUNhaG5nZWRFdmVudEFyZz4oKTtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IENhdGVnb3J5SWRLZXkgPSBcIkNhdGVnb3J5SWRcIjtcclxuXHJcbiAgICBwcml2YXRlIF9wYXJlbnREaXZJZDogc3RyaW5nOy8vZGl2IGVsZW1lbnQgdGhhdCBob2xkcyBhbGwgQ2F0ZWdvcnlTZWxlY3Rpb24gZWxlbWVudHNcclxuICAgIHByaXZhdGUgX2FsbENhdGVnb3JpZXM6IENhdGVnb3J5W107XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfZmlyc3RMZXZlbFRlbXBsYXRlID0gXCJjYXRlZ29yeTFUZW1wbGF0ZVwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfZmlyc3RMZXZlbERpdiA9IFwiY2F0ZWdvcnkxXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9maXJzdExldmVsU2VsZWN0OiBzdHJpbmcgPSBcInNlbGVjdDFcIjtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9zZWNvbmRMZXZlbFRlbXBsYXRlID0gXCJjYXRlZ29yeTJUZW1wbGF0ZVwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfc2Vjb25kTGV2ZWxEaXYgPSBcImNhdGVnb3J5MlwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfc2Vjb25kTGV2ZWxTZWxlY3Q6IHN0cmluZyA9IFwic2VsZWN0MlwiO1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX3RoaXJkTGV2ZWxUZW1wbGF0ZSA9IFwiY2F0ZWdvcnkzVGVtcGxhdGVcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX3RoaXJkTGV2ZWxEaXYgPSBcImNhdGVnb3J5M1wiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfdGhpcmRMZXZlbFNlbGVjdDogc3RyaW5nID0gXCJzZWxlY3QzXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9yb290Q2F0ZWdvcnlJZDogbnVtYmVyID0gMDtcclxuXHJcbiAgICBwcml2YXRlIF9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbE9uZTogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBfc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUd286IG51bWJlcjtcclxuICAgIHByaXZhdGUgX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVGhyZWU6IG51bWJlcjtcclxuXHJcblxyXG4gICAgY29uc3RydWN0b3IocGFyZW50RGl2SWQ6IHN0cmluZywgYWxsQ2F0ZWdvcmllczogQ2F0ZWdvcnlbXSkge1xyXG4gICAgICAgIHRoaXMuX3BhcmVudERpdklkID0gcGFyZW50RGl2SWQ7XHJcbiAgICAgICAgdGhpcy5fYWxsQ2F0ZWdvcmllcyA9IGFsbENhdGVnb3JpZXM7XHJcbiAgICB9XHJcblxyXG4gICAgXHJcblxyXG4gICAgcHVibGljIFNldENhdGVnb3J5SWQoc2VsZWN0ZWRDYXRlZ29yeUlkOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICBsZXQgZmlyc3RMZXZlbElkOiBudW1iZXI7XHJcbiAgICAgICAgbGV0IHNlY29uZExldmVsSWQ6IG51bWJlcjtcclxuICAgICAgICBsZXQgY2F0ZWdvcnlMZXZlbCA9IHRoaXMuZ2V0Q2F0ZWdvcnlMZXZlbChzZWxlY3RlZENhdGVnb3J5SWQpO1xyXG4gICAgICAgIHN3aXRjaCAoY2F0ZWdvcnlMZXZlbCkge1xyXG4gICAgICAgIGNhc2UgQ2F0ZWdvcnlMZXZlbC5Vbmtvd246XHJcbiAgICAgICAgICAgIHRoaXMuQ3JlYXRlRmlyc3RMZXZlbCgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgQ2F0ZWdvcnlMZXZlbC5MZXZlbDE6XHJcbiAgICAgICAgICAgICAgICB0aGlzLkNyZWF0ZUZpcnN0TGV2ZWwoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0Rmlyc3RMZXZlbFRvU3BlY2lmaWNJZChzZWxlY3RlZENhdGVnb3J5SWQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVTZWNvbmRMZXZlbChzZWxlY3RlZENhdGVnb3J5SWQpO1xyXG4gICAgICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuX2ZpcnN0TGV2ZWxTZWxlY3QpLnRyaWdnZXIoXCJjaGFuZ2VcIik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBDYXRlZ29yeUxldmVsLkxldmVsMjpcclxuICAgICAgICAgICAgICAgIHRoaXMuQ3JlYXRlRmlyc3RMZXZlbCgpO1xyXG4gICAgICAgICAgICAgICAgZmlyc3RMZXZlbElkID0gdGhpcy5fYWxsQ2F0ZWdvcmllcy5maWx0ZXIoY2F0ZWdvcnkgPT4gY2F0ZWdvcnkuQ2F0ZWdvcnlJZCA9PT0gc2VsZWN0ZWRDYXRlZ29yeUlkKVswXVxyXG4gICAgICAgICAgICAgICAgICAgIC5DYXRlZ29yeVBhcmVudElkO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRGaXJzdExldmVsVG9TcGVjaWZpY0lkKGZpcnN0TGV2ZWxJZCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVNlY29uZExldmVsKGZpcnN0TGV2ZWxJZCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFNlY29uZExldmVsVG9TcGVjaWZpY0lkKHNlbGVjdGVkQ2F0ZWdvcnlJZCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVRoaXJkTGV2ZWwoc2VsZWN0ZWRDYXRlZ29yeUlkKTtcclxuICAgICAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLl9zZWNvbmRMZXZlbFNlbGVjdCkudHJpZ2dlcihcImNoYW5nZVwiKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgQ2F0ZWdvcnlMZXZlbC5MZXZlbDM6XHJcbiAgICAgICAgICAgIHRoaXMuQ3JlYXRlRmlyc3RMZXZlbCgpO1xyXG4gICAgICAgICAgICBzZWNvbmRMZXZlbElkID0gdGhpcy5fYWxsQ2F0ZWdvcmllcy5maWx0ZXIoY2F0ZWdvcnkgPT4gY2F0ZWdvcnkuQ2F0ZWdvcnlJZCA9PT0gc2VsZWN0ZWRDYXRlZ29yeUlkKVswXVxyXG4gICAgICAgICAgICAgICAgICAgIC5DYXRlZ29yeVBhcmVudElkO1xyXG4gICAgICAgICAgICBmaXJzdExldmVsSWQgPSB0aGlzLl9hbGxDYXRlZ29yaWVzLmZpbHRlcihjYXRlZ29yeSA9PiBjYXRlZ29yeS5DYXRlZ29yeUlkID09PSBzZWNvbmRMZXZlbElkKVswXVxyXG4gICAgICAgICAgICAgICAgLkNhdGVnb3J5UGFyZW50SWQ7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0Rmlyc3RMZXZlbFRvU3BlY2lmaWNJZChmaXJzdExldmVsSWQpO1xyXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVNlY29uZExldmVsKGZpcnN0TGV2ZWxJZCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0U2Vjb25kTGV2ZWxUb1NwZWNpZmljSWQoc2Vjb25kTGV2ZWxJZCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVRoaXJkTGV2ZWwoc2Vjb25kTGV2ZWxJZCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFRoaXJkTGV2ZWxUb1NwZWNpZmljSWQoc2VsZWN0ZWRDYXRlZ29yeUlkKTtcclxuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuX3RoaXJkTGV2ZWxTZWxlY3QpLnRyaWdnZXIoXCJjaGFuZ2VcIik7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldEZpcnN0TGV2ZWxUb1NwZWNpZmljSWQoY2F0ZWdvcnlJZDogbnVtYmVyKSB7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX2ZpcnN0TGV2ZWxTZWxlY3QpLnZhbChjYXRlZ29yeUlkKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgc2V0U2Vjb25kTGV2ZWxUb1NwZWNpZmljSWQoY2F0ZWdvcnlJZDogbnVtYmVyKSB7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX3NlY29uZExldmVsU2VsZWN0KS52YWwoY2F0ZWdvcnlJZCk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHNldFRoaXJkTGV2ZWxUb1NwZWNpZmljSWQoY2F0ZWdvcnlJZDogbnVtYmVyKSB7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX3RoaXJkTGV2ZWxTZWxlY3QpLnZhbChjYXRlZ29yeUlkKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgZ2V0Q2F0ZWdvcnlMZXZlbChjYXRlZ29yeUlkOiBudW1iZXIpOiBDYXRlZ29yeUxldmVsIHtcclxuXHJcbiAgICAgICAgbGV0IHRlbXBDYXRlZ29yeUFycmF5ID0gdGhpcy5fYWxsQ2F0ZWdvcmllcy5maWx0ZXIoY2F0ZWdvcnkgPT4gY2F0ZWdvcnkuQ2F0ZWdvcnlJZCA9PT0gY2F0ZWdvcnlJZCk7XHJcbiAgICAgICAgbGV0IHRlbXBDYXRlZ29yeTtcclxuICAgICAgICBpZiAodGVtcENhdGVnb3J5QXJyYXkubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBDYXRlZ29yeUxldmVsLlVua293bjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGVtcENhdGVnb3J5ID0gdGVtcENhdGVnb3J5QXJyYXlbMF07XHJcbiAgICAgICAgaWYgKHRlbXBDYXRlZ29yeS5QYXJlbnRDYXRlZ29yeUlkID09PSB0aGlzLl9yb290Q2F0ZWdvcnlJZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gQ2F0ZWdvcnlMZXZlbC5MZXZlbDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRlbXBDYXRlZ29yeSA9IHRoaXMuX2FsbENhdGVnb3JpZXMuZmlsdGVyKGNhdGVnb3J5ID0+IGNhdGVnb3J5LkNhdGVnb3J5SWQgPT09IHRlbXBDYXRlZ29yeS5QYXJlbnRDYXRlZ29yeUlkKVswXTtcclxuICAgICAgICBpZiAodGVtcENhdGVnb3J5LlBhcmVudENhdGVnb3J5SWQgPT09IHRoaXMuX3Jvb3RDYXRlZ29yeUlkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBDYXRlZ29yeUxldmVsLkxldmVsMjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIENhdGVnb3J5TGV2ZWwuTGV2ZWwzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBJbnNlcnRDYXRlZ29yeUlkSW5Vc2VySW5wdXREaWN0aW9uYXJ5KHVzZXJJbnB1dDogVXNlcklucHV0KTogdm9pZCB7XHJcbiAgICAgICAgbGV0IGNhdGVnb3J5SWQgPSB0aGlzLkdldFNlbGVjdGVkQ2F0ZWdvcnlJZCgpO1xyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLkNhdGVnb3J5SWRLZXldID0gY2F0ZWdvcnlJZDsvLzEwMCBmb3IgY2Fyc1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBHZXRTZWxlY3RlZENhdGVnb3J5SWQoKTogbnVtYmVyIHtcclxuICAgICAgICBpZiAodGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUaHJlZSAhPT0gdW5kZWZpbmVkICYmXHJcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVGhyZWUgIT09IHRoaXMuX3Jvb3RDYXRlZ29yeUlkKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUaHJlZTtcclxuICAgICAgICBlbHNlIGlmICh0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFR3byAhPT0gdW5kZWZpbmVkICYmXHJcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVHdvICE9PSB0aGlzLl9yb290Q2F0ZWdvcnlJZClcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVHdvO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsT25lO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBDcmVhdGVGaXJzdExldmVsKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMucmVtb3ZlRWxlbWVudCh0aGlzLl9maXJzdExldmVsRGl2KTtcclxuICAgICAgICB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbE9uZSA9IHRoaXMuX3Jvb3RDYXRlZ29yeUlkO1xyXG4gICAgICAgIHRoaXMucmVtb3ZlRWxlbWVudCh0aGlzLl9zZWNvbmRMZXZlbERpdik7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUd28gPSB0aGlzLl9yb290Q2F0ZWdvcnlJZDtcclxuICAgICAgICB0aGlzLnJlbW92ZUVsZW1lbnQodGhpcy5fdGhpcmRMZXZlbERpdik7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUaHJlZSA9IHRoaXMuX3Jvb3RDYXRlZ29yeUlkO1xyXG5cclxuICAgICAgICBsZXQgdGVtcGxhdGUgPSAkKFwiI1wiICsgdGhpcy5fZmlyc3RMZXZlbFRlbXBsYXRlKS5odG1sKCk7XHJcbiAgICAgICAgbGV0IGNhdGVnb3JpZXM6IENhdGVnb3J5W10gPSBuZXcgQXJyYXk8Q2F0ZWdvcnk+KCk7XHJcbiAgICAgICAgbGV0IGRhdGEgPSB7IGNhdGVnb3JpZXM6IGNhdGVnb3JpZXMgfVxyXG4gICAgICAgIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsT25lID0gdGhpcy5fcm9vdENhdGVnb3J5SWQ7Ly9cclxuICAgICAgICB0aGlzLl9hbGxDYXRlZ29yaWVzLmZvckVhY2goY2F0ZWdvcnkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoY2F0ZWdvcnkuQ2F0ZWdvcnlQYXJlbnRJZCA9PT0gdGhpcy5fcm9vdENhdGVnb3J5SWQpIHtcclxuICAgICAgICAgICAgICAgIGNhdGVnb3JpZXMucHVzaChjYXRlZ29yeSk7XHJcbiAgICAgICAgICAgIH0vL2lmXHJcbiAgICAgICAgfSk7Ly9mb3JFYWNoXHJcblxyXG4gICAgICAgIGxldCBodG1sID0gTXVzdGFjaGUudG9faHRtbCh0ZW1wbGF0ZSwgZGF0YSk7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX3BhcmVudERpdklkKS5hcHBlbmQoaHRtbCk7XHJcblxyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9maXJzdExldmVsU2VsZWN0KS5jaGFuZ2UoKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBzZWxlY3RlZElkID0gcGFyc2VJbnQoJChldmVudC5jdXJyZW50VGFyZ2V0KS52YWwoKS50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxPbmUgPSBzZWxlY3RlZElkO1xyXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVNlY29uZExldmVsKHNlbGVjdGVkSWQpO1xyXG4gICAgICAgICAgICBsZXQgZXZlbnRBcmcgPSBuZXcgQ2F0ZWdvcnlDYWhuZ2VkRXZlbnRBcmcoKTtcclxuICAgICAgICAgICAgZXZlbnRBcmcuU2VsZWN0ZWRDYXRlZ29yeUlkID0gdGhpcy5HZXRTZWxlY3RlZENhdGVnb3J5SWQoKTtcclxuICAgICAgICAgICAgZXZlbnRBcmcuU2VsZWN0ZWRDYXRlZ29yeUhhc0NoaWxkID0gdGhpcy5zZWxlY3RlZENhdGVnb3J5SGFzQ2hpbGRyZW4oKTtcclxuICAgICAgICAgICAgdGhpcy5TZWxlY3RlZENhdGVnb3J5Q2hhbmdlZEV2ZW50LkRpc3BhdGNoKHRoaXMsIGV2ZW50QXJnKTtcclxuICAgICAgICB9KTsvL2NoYW5nZVxyXG4gICAgfS8vQ3JlYXRlRmlyc3RMZXZlbFxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlU2Vjb25kTGV2ZWwoZmlyc3RMZXZlbENhdGVnb3J5SWQ6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMucmVtb3ZlRWxlbWVudCh0aGlzLl9zZWNvbmRMZXZlbERpdik7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUd28gPSB0aGlzLl9yb290Q2F0ZWdvcnlJZDtcclxuICAgICAgICB0aGlzLnJlbW92ZUVsZW1lbnQodGhpcy5fdGhpcmRMZXZlbERpdik7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUaHJlZSA9IHRoaXMuX3Jvb3RDYXRlZ29yeUlkO1xyXG4gICAgICAgIGlmIChmaXJzdExldmVsQ2F0ZWdvcnlJZCA9PT0gdGhpcy5fcm9vdENhdGVnb3J5SWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHRlbXBsYXRlID0gJChcIiNcIiArIHRoaXMuX3NlY29uZExldmVsVGVtcGxhdGUpLmh0bWwoKTtcclxuICAgICAgICBsZXQgY2F0ZWdvcmllczogQ2F0ZWdvcnlbXSA9IG5ldyBBcnJheTxDYXRlZ29yeT4oKTtcclxuICAgICAgICBsZXQgZGF0YSA9IHsgY2F0ZWdvcmllczogY2F0ZWdvcmllcyB9XHJcblxyXG4gICAgICAgIHRoaXMuX2FsbENhdGVnb3JpZXMuZm9yRWFjaChjYXRlZ29yeSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChjYXRlZ29yeS5DYXRlZ29yeVBhcmVudElkID09PSBmaXJzdExldmVsQ2F0ZWdvcnlJZCkge1xyXG4gICAgICAgICAgICAgICAgY2F0ZWdvcmllcy5wdXNoKGNhdGVnb3J5KTtcclxuICAgICAgICAgICAgfS8vaWZcclxuICAgICAgICB9KTsvL2ZvckVhY2hcclxuXHJcbiAgICAgICAgbGV0IGh0bWwgPSBNdXN0YWNoZS50b19odG1sKHRlbXBsYXRlLCBkYXRhKTtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fcGFyZW50RGl2SWQpLmFwcGVuZChodG1sKTtcclxuXHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX3NlY29uZExldmVsU2VsZWN0KS5jaGFuZ2UoKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBzZWxlY3RlZElkID0gcGFyc2VJbnQoJChldmVudC5jdXJyZW50VGFyZ2V0KS52YWwoKS50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUd28gPSBzZWxlY3RlZElkO1xyXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVRoaXJkTGV2ZWwoc2VsZWN0ZWRJZCk7XHJcbiAgICAgICAgICAgIGxldCBldmVudEFyZyA9IG5ldyBDYXRlZ29yeUNhaG5nZWRFdmVudEFyZygpO1xyXG4gICAgICAgICAgICBldmVudEFyZy5TZWxlY3RlZENhdGVnb3J5SWQgPSB0aGlzLkdldFNlbGVjdGVkQ2F0ZWdvcnlJZCgpO1xyXG4gICAgICAgICAgICBldmVudEFyZy5TZWxlY3RlZENhdGVnb3J5SGFzQ2hpbGQgPSB0aGlzLnNlbGVjdGVkQ2F0ZWdvcnlIYXNDaGlsZHJlbigpO1xyXG4gICAgICAgICAgICB0aGlzLlNlbGVjdGVkQ2F0ZWdvcnlDaGFuZ2VkRXZlbnQuRGlzcGF0Y2godGhpcywgZXZlbnRBcmcpO1xyXG4gICAgICAgIH0pOy8vY2hhbmdlXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVUaGlyZExldmVsKHNlY29uZExldmVsQ2F0ZWdvcnlJZDogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVFbGVtZW50KHRoaXMuX3RoaXJkTGV2ZWxEaXYpO1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVGhyZWUgPSB0aGlzLl9yb290Q2F0ZWdvcnlJZDtcclxuXHJcbiAgICAgICAgaWYgKHNlY29uZExldmVsQ2F0ZWdvcnlJZCA9PT0gdGhpcy5fcm9vdENhdGVnb3J5SWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHRlbXBsYXRlID0gJChcIiNcIiArIHRoaXMuX3RoaXJkTGV2ZWxUZW1wbGF0ZSkuaHRtbCgpO1xyXG4gICAgICAgIGxldCBjYXRlZ29yaWVzOiBDYXRlZ29yeVtdID0gbmV3IEFycmF5PENhdGVnb3J5PigpO1xyXG4gICAgICAgIGxldCBkYXRhID0geyBjYXRlZ29yaWVzOiBjYXRlZ29yaWVzIH1cclxuXHJcbiAgICAgICAgdGhpcy5fYWxsQ2F0ZWdvcmllcy5mb3JFYWNoKGNhdGVnb3J5ID0+IHtcclxuICAgICAgICAgICAgaWYgKGNhdGVnb3J5LkNhdGVnb3J5UGFyZW50SWQgPT09IHNlY29uZExldmVsQ2F0ZWdvcnlJZCkge1xyXG4gICAgICAgICAgICAgICAgY2F0ZWdvcmllcy5wdXNoKGNhdGVnb3J5KTtcclxuICAgICAgICAgICAgfS8vaWZcclxuICAgICAgICB9KTsvL2ZvckVhY2hcclxuICAgICAgICBpZiAoY2F0ZWdvcmllcy5sZW5ndGggPT09IDApIHsvL05vIEl0ZW0gaW4gdGhpcmQgbGV2ZWwgY2F0ZWdvcnlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgaHRtbCA9IE11c3RhY2hlLnRvX2h0bWwodGVtcGxhdGUsIGRhdGEpO1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9wYXJlbnREaXZJZCkuYXBwZW5kKGh0bWwpO1xyXG5cclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fdGhpcmRMZXZlbFNlbGVjdCkuY2hhbmdlKChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFRocmVlID0gcGFyc2VJbnQoJChldmVudC5jdXJyZW50VGFyZ2V0KS52YWwoKS50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgbGV0IGV2ZW50QXJnID0gbmV3IENhdGVnb3J5Q2FobmdlZEV2ZW50QXJnKCk7XHJcbiAgICAgICAgICAgIGV2ZW50QXJnLlNlbGVjdGVkQ2F0ZWdvcnlJZCA9IHRoaXMuR2V0U2VsZWN0ZWRDYXRlZ29yeUlkKCk7XHJcbiAgICAgICAgICAgIGV2ZW50QXJnLlNlbGVjdGVkQ2F0ZWdvcnlIYXNDaGlsZCA9IHRoaXMuc2VsZWN0ZWRDYXRlZ29yeUhhc0NoaWxkcmVuKCk7XHJcbiAgICAgICAgICAgIHRoaXMuU2VsZWN0ZWRDYXRlZ29yeUNoYW5nZWRFdmVudC5EaXNwYXRjaCh0aGlzLCBldmVudEFyZyk7XHJcbiAgICAgICAgfSk7Ly9jaGFuZ2VcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNlbGVjdGVkQ2F0ZWdvcnlIYXNDaGlsZHJlbigpOiBib29sZWFuIHtcclxuICAgICAgICBsZXQgc2VsZWN0ZWRDYXRlZ29yeUlkID0gdGhpcy5HZXRTZWxlY3RlZENhdGVnb3J5SWQoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fYWxsQ2F0ZWdvcmllcy5maWx0ZXJcclxuICAgICAgICAgICAgKChjYXRlZ29yeSkgPT4geyByZXR1cm4gY2F0ZWdvcnkuQ2F0ZWdvcnlQYXJlbnRJZCA9PT0gc2VsZWN0ZWRDYXRlZ29yeUlkIH0pLmxlbmd0aCA+IDA7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZW1vdmVFbGVtZW50KGlkOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICAkKFwiI1wiICsgaWQpLnJlbW92ZSgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ2F0ZWdvcnlDYWhuZ2VkRXZlbnRBcmcge1xyXG4gICAgcHVibGljIFNlbGVjdGVkQ2F0ZWdvcnlJZDogbnVtYmVyO1xyXG4gICAgcHVibGljIFNlbGVjdGVkQ2F0ZWdvcnlIYXNDaGlsZDogYm9vbGVhbjtcclxufVxyXG5cclxuZW51bSBDYXRlZ29yeUxldmVsIHtcclxuICAgIExldmVsMSA9IDEsXHJcbiAgICBMZXZlbDIgPSAyLFxyXG4gICAgTGV2ZWwzID0gMyxcclxuICAgIFVua293bj00XHJcbn1cclxuXHJcbiIsIu+7v2ltcG9ydCB7SUNyaXRlcmlhLCBDcml0ZXJpYVZhbGlkYXRvciB9IGZyb20gXCIuLi8uLi9IZWxwZXIvSUNyaXRlcmlhXCI7XHJcbmltcG9ydCB7VXNlcklucHV0fSBmcm9tIFwiLi4vLi4vSGVscGVyL1VzZXJJbnB1dFwiO1xyXG5pbXBvcnQge0lDcml0ZXJpYUNoYW5nZX0gZnJvbSBcIi4uLy4uL0hlbHBlci9JQ3JpdGVyaWFDaGFuZ2VcIjtcclxuaW1wb3J0IHtQcmljZVR5cGV9IGZyb20gXCIuLi9QcmljZVR5cGUvRGVmYXVsdFByaWNlVHlwZVwiO1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBEZWZhdWx0T3JkZXJCeSBpbXBsZW1lbnRzIElDcml0ZXJpYSAge1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBPcmRlckJ5S2V5ID0gXCJPcmRlckJ5XCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IE9yZGVyQnlTZWxlY3RJZCA9IFwib3JkZXJCeVwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBPcmRlckJ5RGl2SWQgPSBcIm9yZGVyQnlEaXZcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgT3JkZXJCeUZpeGVkUHJpY2VUZW1wbGF0ZUlkID0gXCJvcmRlckJ5Rml4ZWRQcmljZVRlbXBsYXRlXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IE9yZGVyQnlPZGVyc1RlbXBsYXRlSWQgPSBcIm9yZGVyQnlPZGVyc1RlbXBsYXRlXCI7XHJcbiAgICBcclxuICAgIHByaXZhdGUgX3NlYXJjaENyaXRlcmlhQ2hhbmdlOiBJQ3JpdGVyaWFDaGFuZ2U7XHJcbiAgICBcclxuICAgIEJpbmRFdmVudHMoY3JpdGVyaWFDaGFuZ2U6IElDcml0ZXJpYUNoYW5nZSk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX3NlYXJjaENyaXRlcmlhQ2hhbmdlID0gY3JpdGVyaWFDaGFuZ2U7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuT3JkZXJCeVNlbGVjdElkKS5vbihcImNoYW5nZVwiLFxyXG4gICAgICAgICAgICAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NlYXJjaENyaXRlcmlhQ2hhbmdlLkN1c3RvbUNyaXRlcmlhQ2hhbmdlZCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBVbkJpbmRFdmVudHMoKTogdm9pZCB7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuT3JkZXJCeVNlbGVjdElkKS5vZmYoXCJjaGFuZ2VcIik7XHJcbiAgICB9XHJcblxyXG4gICAgVmFsaWRhdGVDcml0ZXJpYSgpOiBDcml0ZXJpYVZhbGlkYXRvciB7IHRocm93IG5ldyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZFwiKTsgfVxyXG5cclxuICAgIEZpbGxDcml0ZXJpYSh1c2VySW5wdXQ6IFVzZXJJbnB1dCk6IHZvaWQge1xyXG5cclxuICAgICAgICBsZXQgb3JkZXJCeSA9ICQoXCIjXCIgKyB0aGlzLk9yZGVyQnlTZWxlY3RJZCkudmFsKCkudG9TdHJpbmcoKTtcclxuICAgICAgICB1c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnlbdGhpcy5PcmRlckJ5S2V5XSA9IG9yZGVyQnk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIFByaWNlVHlwZUNoYW5nZWQoc2VuZGVyOm9iamVjdCxhcmdzOlByaWNlVHlwZSk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuVW5CaW5kRXZlbnRzKCk7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuT3JkZXJCeURpdklkKS5jaGlsZHJlbigpLnJlbW92ZSgpO1xyXG4gICAgICAgIGlmIChhcmdzID09PSBQcmljZVR5cGUuRml4ZWQpIHtcclxuICAgICAgICAgICAgdmFyIHRlbXBsYXRlID0gJChcIiNcIit0aGlzLk9yZGVyQnlGaXhlZFByaWNlVGVtcGxhdGVJZCkuaHRtbCgpO1xyXG4gICAgICAgICAgICB2YXIgaHRtbCA9IE11c3RhY2hlLnRvX2h0bWwodGVtcGxhdGUsIG51bGwpO1xyXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5PcmRlckJ5RGl2SWQpLmFwcGVuZChodG1sKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgdmFyIHRlbXBsYXRlID0gJChcIiNcIiArIHRoaXMuT3JkZXJCeU9kZXJzVGVtcGxhdGVJZCkuaHRtbCgpO1xyXG4gICAgICAgICAgICB2YXIgaHRtbCA9IE11c3RhY2hlLnRvX2h0bWwodGVtcGxhdGUsIG51bGwpO1xyXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5PcmRlckJ5RGl2SWQpLmFwcGVuZChodG1sKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5CaW5kRXZlbnRzKHRoaXMuX3NlYXJjaENyaXRlcmlhQ2hhbmdlKTtcclxuICAgIH1cclxuXHJcbiAgIFxyXG59Iiwi77u/aW1wb3J0IHsgSUNyaXRlcmlhLCBDcml0ZXJpYVZhbGlkYXRvciB9IGZyb20gXCIuLi8uLi9IZWxwZXIvSUNyaXRlcmlhXCI7XHJcbmltcG9ydCB7IFVzZXJJbnB1dCB9IGZyb20gXCIuLi8uLi9IZWxwZXIvVXNlcklucHV0XCI7XHJcbmltcG9ydCB7IElDcml0ZXJpYUNoYW5nZSB9IGZyb20gXCIuLi8uLi9IZWxwZXIvSUNyaXRlcmlhQ2hhbmdlXCI7XHJcbmltcG9ydCB7RXZlbnREaXNwYXRjaGVyfSBmcm9tIFwiLi4vLi4vRXZlbnRzL0V2ZW50RGlzcGF0Y2hlclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIERlZmF1bHRQcmljZVR5cGUgaW1wbGVtZW50cyBJQ3JpdGVyaWEge1xyXG5cclxuICAgIHB1YmxpYyBTZWxlY3RlZFByaWNlVHlwZUNoYW5nZWRFdmVudDogRXZlbnREaXNwYXRjaGVyPERlZmF1bHRQcmljZVR5cGUsIFByaWNlVHlwZT4gPVxyXG4gICAgICAgIG5ldyBFdmVudERpc3BhdGNoZXI8RGVmYXVsdFByaWNlVHlwZSwgUHJpY2VUeXBlPigpO1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgUHJpY2VUeXBlS2V5ID0gXCJQcmljZVR5cGVcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgUHJpY2VUeXBlU2VsZWN0SWQgPSBcInByaWNlVHlwZVwiO1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgRml4UHJpY2VEaXZJZCA9XCJmaXhlZFByaWNlXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IE1pbmltdW1QcmljZUtleSA9IFwiTWluaW11bVByaWNlXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9taW5QcmljZUlucHV0SWQgPSBcIm1pblByaWNlXCI7XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBNYXhpbXVtUHJpY2VLZXkgPSBcIk1heGltdW1QcmljZVwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfbWF4UHJpY2VJbnB1dElkID0gXCJtYXhQcmljZVwiO1xyXG4gICAgXHJcbiAgICBwcml2YXRlIF9zZWFyY2hDcml0ZXJpYUNoYW5nZTogSUNyaXRlcmlhQ2hhbmdlO1xyXG5cclxuICAgIHB1YmxpYyBCaW5kRXZlbnRzKGNyaXRlcmlhQ2hhbmdlOiBJQ3JpdGVyaWFDaGFuZ2UpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9zZWFyY2hDcml0ZXJpYUNoYW5nZSA9IGNyaXRlcmlhQ2hhbmdlO1xyXG4gICAgICAgIC8veW91IGNhbiBhbHNvIHVzZXIgXCJpbnB1dFwiIGluc3RlYWQgb2YgXCJjaGFuZ2VcIlxyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9taW5QcmljZUlucHV0SWQpLm9uKFwiY2hhbmdlXCIsXHJcbiAgICAgICAgICAgIChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2VhcmNoQ3JpdGVyaWFDaGFuZ2UuQ3VzdG9tQ3JpdGVyaWFDaGFuZ2VkKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9tYXhQcmljZUlucHV0SWQpLm9uKFwiY2hhbmdlXCIsXHJcbiAgICAgICAgICAgIChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2VhcmNoQ3JpdGVyaWFDaGFuZ2UuQ3VzdG9tQ3JpdGVyaWFDaGFuZ2VkKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLlByaWNlVHlwZVNlbGVjdElkKS5vbihcImNoYW5nZVwiLCAoZXZlbnQpPT4ge1xyXG4gICAgICAgICAgICBsZXQgc2VsZWN0ZWRQcmljZVR5cGUgPSB0aGlzLmdldFByaWNlVHlwZSgkKGV2ZW50LmN1cnJlbnRUYXJnZXQpLnZhbCgpLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICBpZiAoc2VsZWN0ZWRQcmljZVR5cGUgPT09IFByaWNlVHlwZS5GaXhlZCkge1xyXG4gICAgICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuRml4UHJpY2VEaXZJZCkuc2hvdygpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuRml4UHJpY2VEaXZJZCkuaGlkZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuU2VsZWN0ZWRQcmljZVR5cGVDaGFuZ2VkRXZlbnQuRGlzcGF0Y2godGhpcywgc2VsZWN0ZWRQcmljZVR5cGUpO1xyXG4gICAgICAgICAgICB0aGlzLl9zZWFyY2hDcml0ZXJpYUNoYW5nZS5DdXN0b21Dcml0ZXJpYUNoYW5nZWQoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldFByaWNlVHlwZShzdHJpbmdQcmljZVR5cGU6IHN0cmluZyk6IFByaWNlVHlwZSB7XHJcbiAgICAgICAgcmV0dXJuIHBhcnNlSW50KHN0cmluZ1ByaWNlVHlwZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIFVuQmluZEV2ZW50cygpOiB2b2lkIHtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fbWluUHJpY2VJbnB1dElkKS5vZmYoXCJjaGFuZ2VcIik7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX21heFByaWNlSW5wdXRJZCkub2ZmKFwiY2hhbmdlXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBWYWxpZGF0ZUNyaXRlcmlhKCk6IENyaXRlcmlhVmFsaWRhdG9yIHsgdGhyb3cgbmV3IEVycm9yKFwiTm90IGltcGxlbWVudGVkXCIpOyB9XHJcblxyXG4gICAgcHVibGljIEZpbGxDcml0ZXJpYSh1c2VySW5wdXQ6IFVzZXJJbnB1dCk6IHZvaWQge1xyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLlByaWNlVHlwZUtleV0gPSAkKFwiI1wiICsgdGhpcy5QcmljZVR5cGVTZWxlY3RJZCkudmFsKCkudG9TdHJpbmcoKTtcclxuXHJcbiAgICAgICAgaWYgKHBhcnNlSW50KCQoXCIjXCIgKyB0aGlzLlByaWNlVHlwZVNlbGVjdElkKS52YWwoKS50b1N0cmluZygpKSA9PT0gUHJpY2VUeXBlLkZpeGVkKSB7XHJcbiAgICAgICAgICAgIGxldCBtaW5QcmljZSA9IHBhcnNlSW50KCQoXCIjXCIgKyB0aGlzLl9taW5QcmljZUlucHV0SWQpLnZhbCgpLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICB1c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnlbdGhpcy5NaW5pbXVtUHJpY2VLZXldID0gbWluUHJpY2U7XHJcblxyXG4gICAgICAgICAgICBsZXQgbWF4UHJpY2UgPSBwYXJzZUludCgkKFwiI1wiICsgdGhpcy5fbWF4UHJpY2VJbnB1dElkKS52YWwoKS50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuTWF4aW11bVByaWNlS2V5XSA9IG1heFByaWNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGVudW0gUHJpY2VUeXBlIHtcclxuICAgIEZpeGVkID0gMSxcclxuICAgIEFncmVlbWVudCA9IDIsXHJcbiAgICBFeGNoYW5nZSA9IDMsXHJcbiAgICBJbnN0YWxsbWVudCA9IDQsXHJcbiAgICBNb3J0Z2FnZUFuZFJlbnQgPSA1XHJcbn0iLCLvu79pbXBvcnQge0Nhck1vZGVsfSBmcm9tIFwiLi4vLi4vTW9kZWxzL0FkVHJhbnNwb3J0YXRpb24vQ2FyTW9kZWxcIjtcclxuaW1wb3J0IHtVc2VySW5wdXR9IGZyb20gXCIuLi8uLi9IZWxwZXIvVXNlcklucHV0XCI7XHJcbmltcG9ydCB7SUNyaXRlcmlhLENyaXRlcmlhVmFsaWRhdG9yfSBmcm9tIFwiLi4vLi4vSGVscGVyL0lDcml0ZXJpYVwiO1xyXG5pbXBvcnQge0lDcml0ZXJpYUNoYW5nZX0gZnJvbSBcIi4uLy4uL0hlbHBlci9JQ3JpdGVyaWFDaGFuZ2VcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDYXJNb2RlbEJyYW5kQ29udHJvbGxlciBpbXBsZW1lbnRzIElDcml0ZXJpYSB7XHJcbiAgICBWYWxpZGF0ZUNyaXRlcmlhKCk6IENyaXRlcmlhVmFsaWRhdG9yIHsgdGhyb3cgbmV3IEVycm9yKFwiTm90IGltcGxlbWVudGVkXCIpOyB9XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBDYXJCcmFuZElkS2V5OiBzdHJpbmcgPSBcIkJyYW5kSWRcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgQnJhbmRTZWxlY3RJZDogc3RyaW5nID0gXCJicmFuZFwiO1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgQ2FyTW9kZWxUZW1wbGF0ZUlkOiBzdHJpbmcgPSBcIm1vZGVsVGVtcGxhdGVcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgQ2FyTW9kZWxEaXZQbGFjZUhvbGRlcklkOiBzdHJpbmcgPSBcIm1vZGVsUGxhY2VIb2xkZXJcIjtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IENhck1vZGVsSWRLZXk6IHN0cmluZyA9IFwiQ2FyTW9kZWxJZFwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBBbGxDYXJNb2RlbHNJbnB1dElkOiBzdHJpbmcgPSBcImFsbENhck1vZGVsc1wiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBNb2RlbFNlbGVjdElkOiBzdHJpbmcgPSBcIm1vZGVsXCI7XHJcbiAgICBwcml2YXRlIF9hbGxDYXJNb2RlbHM6IENhck1vZGVsW107XHJcblxyXG4gICAgcHJpdmF0ZSBfc2VhcmNoQ3JpdGVyaWFDaGFuZ2U6SUNyaXRlcmlhQ2hhbmdlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuaW5pdFZpZXcoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXRWaWV3KCk6IHZvaWQge1xyXG4gICAgICAgIGxldCBhbGxDYXJNb2RlbHNTdHJpbmcgPSAkKFwiI1wiICsgdGhpcy5BbGxDYXJNb2RlbHNJbnB1dElkKS52YWwoKS50b1N0cmluZygpO1xyXG4gICAgICAgIHRoaXMuX2FsbENhck1vZGVscyA9ICQucGFyc2VKU09OKGFsbENhck1vZGVsc1N0cmluZykgYXMgQ2FyTW9kZWxbXTtcclxuICAgICAgICB0aGlzLmluaXRDYXJNb2RlbCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaW5pdENhck1vZGVsKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuY3JlYXRlQ2FyTW9kZWxFbGVtZW50KG5ldyBBcnJheTxDYXJNb2RlbD4oKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVDYXJNb2RlbEVsZW1lbnQoY2FyTW9kZWxzOiBDYXJNb2RlbFtdKSB7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuQ2FyTW9kZWxEaXZQbGFjZUhvbGRlcklkKS5jaGlsZHJlbigpLnJlbW92ZSgpO1xyXG4gICAgICAgIGxldCB0ZW1wbGF0ZSA9ICQoXCIjXCIgKyB0aGlzLkNhck1vZGVsVGVtcGxhdGVJZCkuaHRtbCgpO1xyXG4gICAgICAgIGxldCBkYXRhID0geyBjYXJNb2RlbHM6IGNhck1vZGVscyB9XHJcbiAgICAgICAgbGV0IGh0bWwgPSBNdXN0YWNoZS50b19odG1sKHRlbXBsYXRlLCBkYXRhKTtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5DYXJNb2RlbERpdlBsYWNlSG9sZGVySWQpLmFwcGVuZChodG1sKTtcclxuICAgICAgICB0aGlzLmJpbmRDYXJNb2RlbCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYmluZENhck1vZGVsKCk6IHZvaWQge1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLk1vZGVsU2VsZWN0SWQpLm9uKFwiY2hhbmdlXCIsKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zZWFyY2hDcml0ZXJpYUNoYW5nZS5DdXN0b21Dcml0ZXJpYUNoYW5nZWQoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1cGRhdGVDYXJNb2RlbFNlbGVjdChicmFuZElkOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICBsZXQgY2FyTW9kZWxzID0gbmV3IEFycmF5PENhck1vZGVsPigpO1xyXG4gICAgICAgIGlmIChicmFuZElkICE9PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2FsbENhck1vZGVscy5mb3JFYWNoKChjYXJNb2RlbCwgaW5kZXgsIGFycmF5KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2FyTW9kZWwuQnJhbmRJZCA9PT0gYnJhbmRJZClcclxuICAgICAgICAgICAgICAgICAgICBjYXJNb2RlbHMucHVzaChjYXJNb2RlbCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNyZWF0ZUNhck1vZGVsRWxlbWVudChjYXJNb2RlbHMpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBGaWxsQ3JpdGVyaWEodXNlcklucHV0OlVzZXJJbnB1dCk6dm9pZCB7XHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuQ2FyQnJhbmRJZEtleV0gPVxyXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5CcmFuZFNlbGVjdElkKS5maW5kKFwib3B0aW9uOnNlbGVjdGVkXCIpLnZhbCgpOy8vYnJhbmRJZFxyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLkNhck1vZGVsSWRLZXldID1cclxuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuTW9kZWxTZWxlY3RJZCkuZmluZChcIm9wdGlvbjpzZWxlY3RlZFwiKS52YWwoKTsvL2Nhck1vZGVsSWRcclxuICAgIH1cclxuXHJcbiAgICBCaW5kRXZlbnRzKGNyaXRlcmlhQ2hhbmdlOiBJQ3JpdGVyaWFDaGFuZ2UpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9zZWFyY2hDcml0ZXJpYUNoYW5nZSA9IGNyaXRlcmlhQ2hhbmdlO1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLkJyYW5kU2VsZWN0SWQpLm9uKFwiY2hhbmdlXCIsIChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgc2VsZWN0ZWRCcmFuZElkOiBudW1iZXIgPSBwYXJzZUludCgkKGV2ZW50LmN1cnJlbnRUYXJnZXQpLmZpbmQoXCJvcHRpb246c2VsZWN0ZWRcIikudmFsKCkudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQ2FyTW9kZWxTZWxlY3Qoc2VsZWN0ZWRCcmFuZElkKTtcclxuICAgICAgICAgICAgY3JpdGVyaWFDaGFuZ2UuQ3VzdG9tQ3JpdGVyaWFDaGFuZ2VkKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuYmluZENhck1vZGVsKCk7XHJcbiAgICB9XHJcblxyXG4gICAgVW5CaW5kRXZlbnRzKCk6IHZvaWQge1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLkJyYW5kU2VsZWN0SWQpLm9mZihcImNoYW5nZVwiKTtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5Nb2RlbFNlbGVjdElkKS5vZmYoXCJjaGFuZ2VcIik7XHJcbiAgICB9XHJcbn0iLCLvu79pbXBvcnQge0lFdmVudH0gIGZyb20gXCIuL0lFdmVudFwiO1xyXG5cclxuXHJcbi8qIFRoZSBkaXNwYXRjaGVyIGhhbmRsZXMgdGhlIHN0b3JhZ2Ugb2Ygc3Vic2NpcHRpb25zIGFuZCBmYWNpbGl0YXRlc1xyXG4gIHN1YnNjcmlwdGlvbiwgdW5zdWJzY3JpcHRpb24gYW5kIGRpc3BhdGNoaW5nIG9mIHRoZSBldmVudCAqL1xyXG5leHBvcnQgIGNsYXNzIEV2ZW50RGlzcGF0Y2hlcjxUU2VuZGVyLCBUQXJncz4gaW1wbGVtZW50cyBJRXZlbnQ8VFNlbmRlciwgVEFyZ3M+IHtcclxuXHJcbiAgICBwcml2YXRlIF9zdWJzY3JpcHRpb25zOiBBcnJheTwoc2VuZGVyOiBUU2VuZGVyLCBhcmdzOiBUQXJncykgPT4gdm9pZD4gPSBuZXcgQXJyYXk8KHNlbmRlcjogVFNlbmRlciwgYXJnczogVEFyZ3MpID0+IHZvaWQ+KCk7XHJcblxyXG4gICAgcHVibGljIFN1YnNjcmliZShmbjogKHNlbmRlcjogVFNlbmRlciwgYXJnczogVEFyZ3MpID0+IHZvaWQpOiB2b2lkIHtcclxuICAgICAgICBpZiAoZm4pIHtcclxuICAgICAgICAgICAgdGhpcy5fc3Vic2NyaXB0aW9ucy5wdXNoKGZuKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljICBVbnN1YnNjcmliZShmbjogKHNlbmRlcjogVFNlbmRlciwgYXJnczogVEFyZ3MpID0+IHZvaWQpOiB2b2lkIHtcclxuICAgICAgICBsZXQgaSA9IHRoaXMuX3N1YnNjcmlwdGlvbnMuaW5kZXhPZihmbik7XHJcbiAgICAgICAgaWYgKGkgPiAtMSkge1xyXG4gICAgICAgICAgICB0aGlzLl9zdWJzY3JpcHRpb25zLnNwbGljZShpLCAxKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljICBEaXNwYXRjaChzZW5kZXI6IFRTZW5kZXIsIGFyZ3M6IFRBcmdzKTogdm9pZCB7XHJcbiAgICAgICAgZm9yIChsZXQgaGFuZGxlciBvZiB0aGlzLl9zdWJzY3JpcHRpb25zKSB7XHJcbiAgICAgICAgICAgIGhhbmRsZXIoc2VuZGVyLCBhcmdzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCLvu79pbXBvcnQge1VzZXJJbnB1dH0gZnJvbSBcIi4vVXNlcklucHV0XCI7XHJcbmltcG9ydCB7SVJlc3VsdEhhbmRsZXJ9IGZyb20gXCIuL0lSZXN1bHRIYW5kbGVyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQWpheENhbGxlciB7XHJcblxyXG4gICAgcHJpdmF0ZSBfbnVtYmVyT2ZQdXJlU2VydmVyQ2FsbHM6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF91cmw6IHN0cmluZztcclxuICAgIHByaXZhdGUgX3Jlc3VsdEhhbmRsZXI6IElSZXN1bHRIYW5kbGVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHVybDogc3RyaW5nLCByZXN1bHRIYW5kbGVyOiBJUmVzdWx0SGFuZGxlcikge1xyXG4gICAgICAgIHRoaXMuX3VybCA9IHVybDtcclxuICAgICAgICB0aGlzLl9yZXN1bHRIYW5kbGVyID0gcmVzdWx0SGFuZGxlcjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgQ2FsbCh1c2VySW5wdXQ6IFVzZXJJbnB1dCk6IHZvaWQge1xyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICB1cmw6IHRoaXMuX3VybCxcclxuICAgICAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkodXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5KSwgLy9EYXRhIHNlbnQgdG8gc2VydmVyXHJcbiAgICAgICAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbicsIC8vIGNvbnRlbnQgdHlwZSBzZW50IHRvIHNlcnZlclxyXG4gICAgICAgICAgICBzdWNjZXNzOiAobXNnLCB0ZXh0U3RhdHVzLCBqcVhIUikgPT4gdGhpcy5vblN1Y2Nlc3NHZXRJdGVtc0Zyb21TZXJ2ZXIobXNnLCB0ZXh0U3RhdHVzLCBqcVhIUiksIC8vT24gU3VjY2Vzc2Z1bGwgc2VydmljZSBjYWxsXHJcbiAgICAgICAgICAgIGVycm9yOiAoanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKSA9PiB0aGlzLm9uRXJyb3JHZXRJdGVtc0Zyb21TZXJ2ZXIoanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKSAvLyBXaGVuIFNlcnZpY2UgY2FsbCBmYWlsc1xyXG4gICAgICAgIH0pOyAvLy5hamF4XHJcblxyXG4gICAgICAgIHRoaXMuX251bWJlck9mUHVyZVNlcnZlckNhbGxzKys7XHJcbiAgICAgICAgdGhpcy5fcmVzdWx0SGFuZGxlci5BamF4Q2FsbFN0YXJ0ZWQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9uU3VjY2Vzc0dldEl0ZW1zRnJvbVNlcnZlcihtc2c6IGFueSwgdGV4dFN0YXR1czogc3RyaW5nLCBqcVhIUjogSlF1ZXJ5WEhSKSB7XHJcblxyXG4gICAgICAgIHRoaXMuX251bWJlck9mUHVyZVNlcnZlckNhbGxzLS07XHJcbiAgICAgICAgaWYgKHRoaXMuX251bWJlck9mUHVyZVNlcnZlckNhbGxzID09PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Jlc3VsdEhhbmRsZXIuQWpheENhbGxGaW5pc2hlZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9yZXN1bHRIYW5kbGVyLk9uUmVzdWx0KG1zZyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvbkVycm9yR2V0SXRlbXNGcm9tU2VydmVyKGpxWEhSOiBKUXVlcnlYSFIsIHRleHRTdGF0dXM6IHN0cmluZywgZXJyb3JUaHJvd246IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuX251bWJlck9mUHVyZVNlcnZlckNhbGxzLS07XHJcbiAgICAgICAgaWYgKHRoaXMuX251bWJlck9mUHVyZVNlcnZlckNhbGxzID09PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Jlc3VsdEhhbmRsZXIuQWpheENhbGxGaW5pc2hlZCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fcmVzdWx0SGFuZGxlci5PbkVycm9yKHRleHRTdGF0dXMgKyBcIiAsIFwiICsgZXJyb3JUaHJvd24pO1xyXG4gICAgfVxyXG59Iiwi77u/aW1wb3J0IHsgSUNyaXRlcmlhfSBmcm9tIFwiLi9JQ3JpdGVyaWFcIjtcclxuaW1wb3J0IHsgTnVtZXJpY0RpY3Rpb25hcnkgfSBmcm9tIFwibG9kYXNoL2luZGV4XCI7XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIENyaXRlcmlhTnVtZXJpY0RpY3Rpb25hcnkgaW1wbGVtZW50cyBOdW1lcmljRGljdGlvbmFyeTxJQ3JpdGVyaWE+IHtcclxuICAgIFtpbmRleDogbnVtYmVyXTogSUNyaXRlcmlhO1xyXG59Iiwi77u/aW50ZXJmYWNlIExvb3NlT2JqZWN0IHtcclxuICAgIFtrZXk6IHN0cmluZ106IGFueVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVXNlcklucHV0IHtcclxuICAgIHB1YmxpYyBQYXJhbWV0ZXJzRGljdGlvbmFyeTogTG9vc2VPYmplY3QgPSB7fTtcclxufVxyXG5cclxuXHJcblxyXG4iLCLvu79pbXBvcnQge0FkVHJhbnNmb3JtYXRpb25TZWFyY2hDcml0ZXJpYX0gZnJvbSBcIi4vU2VhcmNoQ3JpdGVyaWEvQWRUcmFuc2Zvcm1hdGlvblNlYXJjaENyaXRlcmlhXCI7XHJcbmltcG9ydCB7RGVmYXVsdFNlYXJjaENyaXRlcmlhfSBmcm9tIFwiLi9TZWFyY2hDcml0ZXJpYS9EZWZhdWx0U2VhcmNoQ3JpdGVyaWFcIjtcclxuaW1wb3J0IHtJQ3JpdGVyaWF9IGZyb20gXCIuLi8uLi8uLi9IZWxwZXIvSUNyaXRlcmlhXCI7XHJcbmltcG9ydCB7VXNlcklucHV0fSBmcm9tIFwiLi4vLi4vLi4vSGVscGVyL1VzZXJJbnB1dFwiO1xyXG5pbXBvcnQge0lDcml0ZXJpYUNoYW5nZX0gZnJvbSBcIi4uLy4uLy4uL0hlbHBlci9JQ3JpdGVyaWFDaGFuZ2VcIjtcclxuaW1wb3J0IHtDcml0ZXJpYU51bWVyaWNEaWN0aW9uYXJ5fSBmcm9tIFwiLi4vLi4vLi4vSGVscGVyL0NyaXRlcmlhTnVtZXJpY0RpY3Rpb25hcnlcIjtcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgU2VhcmNoQ3JpdGVyaWEge1xyXG4gICAgcHJpdmF0ZSBfc2VhcmNoQ3JpdGVyaWFJb2NDb250YWluZXI6IENyaXRlcmlhTnVtZXJpY0RpY3Rpb25hcnkgO1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5fc2VhcmNoQ3JpdGVyaWFJb2NDb250YWluZXIgPSBuZXcgQ3JpdGVyaWFOdW1lcmljRGljdGlvbmFyeSgpO1xyXG4gICAgICAgIHRoaXMuaW5pdFNlYXJjaENyaXRlcmlhSW9jQ29udGFpbmVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbml0U2VhcmNoQ3JpdGVyaWFJb2NDb250YWluZXIoKSB7XHJcbiAgICAgICAgdGhpcy5fc2VhcmNoQ3JpdGVyaWFJb2NDb250YWluZXJbMF0gPSBuZXcgRGVmYXVsdFNlYXJjaENyaXRlcmlhKCk7XHJcbiAgICAgICAgdGhpcy5fc2VhcmNoQ3JpdGVyaWFJb2NDb250YWluZXJbMTAwXSA9IG5ldyBBZFRyYW5zZm9ybWF0aW9uU2VhcmNoQ3JpdGVyaWEoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgRmlsbENhdGVnb3J5U3BlY2lmaWNTZWFyY2hDcml0ZXJpYShjYXRlZ29yeUlkOiBudW1iZXIsIHVzZXJJbnB1dDogVXNlcklucHV0KTogdm9pZCB7XHJcbiAgICAgICAgbGV0IHNlYXJjaENyaXRlcmlhID0gdGhpcy5wb2x5bW9ycGhpY0Rpc3BhdGNoU2VhcmNoQ3JpdGVyaWEoY2F0ZWdvcnlJZCk7XHJcbiAgICAgICAgc2VhcmNoQ3JpdGVyaWEuRmlsbENyaXRlcmlhKHVzZXJJbnB1dCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIEJpbmQoY2F0ZWdvcnlJZDogbnVtYmVyLCBzZWFyY2hDcml0ZXJpYUNoYW5nZTogSUNyaXRlcmlhQ2hhbmdlKSB7XHJcbiAgICAgICAgbGV0IHNlYXJjaENyaXRlcmlhID0gdGhpcy5wb2x5bW9ycGhpY0Rpc3BhdGNoU2VhcmNoQ3JpdGVyaWEoY2F0ZWdvcnlJZCk7XHJcbiAgICAgICAgc2VhcmNoQ3JpdGVyaWEuQmluZEV2ZW50cyhzZWFyY2hDcml0ZXJpYUNoYW5nZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIFVuQmluZChjYXRlZ29yeUlkOm51bWJlcikge1xyXG4gICAgICAgIGxldCBzZWFyY2hDcml0ZXJpYSA9IHRoaXMucG9seW1vcnBoaWNEaXNwYXRjaFNlYXJjaENyaXRlcmlhKGNhdGVnb3J5SWQpO1xyXG4gICAgICAgIHNlYXJjaENyaXRlcmlhLlVuQmluZEV2ZW50cygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcG9seW1vcnBoaWNEaXNwYXRjaFNlYXJjaENyaXRlcmlhKGNhdGVnb3J5SWQ6bnVtYmVyKTogSUNyaXRlcmlhIHtcclxuICAgICAgICBsZXQgcmV0dXJuVmFsdWU6IElDcml0ZXJpYSA9IHRoaXMuX3NlYXJjaENyaXRlcmlhSW9jQ29udGFpbmVyW2NhdGVnb3J5SWRdO1xyXG4gICAgICAgIGlmIChyZXR1cm5WYWx1ZT09PXVuZGVmaW5lZCB8fCByZXR1cm5WYWx1ZT09PW51bGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuVmFsdWUgPSB0aGlzLl9zZWFyY2hDcml0ZXJpYUlvY0NvbnRhaW5lclswXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldHVyblZhbHVlO1xyXG4gICAgfVxyXG59Iiwi77u/aW1wb3J0IHsgUGFydGlhbFZpZXdTZXJ2ZXJDYWxsUGFyYW1ldGVycyB9IGZyb20gXCIuLi8uLi9uZXdBZC9zcmMvTmV3QWRQYXJ0aWFsVmlld0xvYWRlclwiO1xyXG5pbXBvcnQge0lDcml0ZXJpYUNoYW5nZSB9IGZyb20gXCIuLi8uLi8uLi9IZWxwZXIvSUNyaXRlcmlhQ2hhbmdlXCI7XHJcbmltcG9ydCB7U2VhcmNoQ3JpdGVyaWF9IGZyb20gXCIuL1NlYXJjaENyaXRlcmlhXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU2VhcmNoQ3JpdGVyaWFWaWV3TG9hZGVyIHtcclxuICAgIHByaXZhdGUgX3BhcmVudERpdklkOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIF9zZWFyY2hDcml0ZXJpYUNoYW5nZTogSUNyaXRlcmlhQ2hhbmdlO1xyXG4gICAgcHJpdmF0ZSBfdXJsOiBzdHJpbmcgPSBcIi9Ib21lL0dldFNlYXJjaENyaXRlcmlhVmlld1wiO1xyXG4gICAgcHJpdmF0ZSBfcHJldmlvdXNDYXRlZ29yeUlkOm51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIF9jdXJyZW50Q2F0ZWdvcnlJZDogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgX3NlYXJjaENyaXRlcmlhOlNlYXJjaENyaXRlcmlhO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBhcmVudERpdklkOiBzdHJpbmcsIHNlYXJjaENyaXRlcmlhQ2hhbmdlOiBJQ3JpdGVyaWFDaGFuZ2Usc2VhcmNoQ3JpdGVyaWE6U2VhcmNoQ3JpdGVyaWEpIHtcclxuICAgICAgICB0aGlzLl9wYXJlbnREaXZJZCA9IHBhcmVudERpdklkO1xyXG4gICAgICAgIHRoaXMuX3NlYXJjaENyaXRlcmlhQ2hhbmdlID0gc2VhcmNoQ3JpdGVyaWFDaGFuZ2U7XHJcbiAgICAgICAgdGhpcy5fc2VhcmNoQ3JpdGVyaWEgPSBzZWFyY2hDcml0ZXJpYTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgR2V0U2VhcmNoQ3JpdGVyaWFWaWV3RnJvbVNlcnZlcihjYXRlZ29yeUlkOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9jdXJyZW50Q2F0ZWdvcnlJZCA9IGNhdGVnb3J5SWQ7XHJcbiAgICAgICAgbGV0IGNhbGxQYXJhbXMgPSBuZXcgUGFydGlhbFZpZXdTZXJ2ZXJDYWxsUGFyYW1ldGVycygpO1xyXG4gICAgICAgIGNhbGxQYXJhbXMuQ2F0ZWdvcnlJZCA9IGNhdGVnb3J5SWQ7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogXCJHRVRcIiwgLy9HRVQgb3IgUE9TVCBvciBQVVQgb3IgREVMRVRFIHZlcmJcclxuICAgICAgICAgICAgdXJsOiB0aGlzLl91cmwsXHJcbiAgICAgICAgICAgIGRhdGE6IGNhbGxQYXJhbXMsIC8vRGF0YSBzZW50IHRvIHNlcnZlclxyXG4gICAgICAgICAgICAvL2NvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbicsIC8vIGNvbnRlbnQgdHlwZSBzZW50IHRvIHNlcnZlclxyXG4gICAgICAgICAgICBzdWNjZXNzOiAobXNnLCB0ZXh0U3RhdHVzLCBqcVhIUikgPT4gdGhpcy5vblN1Y2Nlc3NHZXRJdGVtc0Zyb21TZXJ2ZXIobXNnLCB0ZXh0U3RhdHVzLCBqcVhIUiksLy9PbiBTdWNjZXNzZnVsbCBzZXJ2aWNlIGNhbGxcclxuICAgICAgICAgICAgZXJyb3I6IChqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pID0+IHRoaXMub25FcnJvckdldEl0ZW1zRnJvbVNlcnZlcihqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pLy8gV2hlbiBTZXJ2aWNlIGNhbGwgZmFpbHNcclxuICAgICAgICB9KTsvLy5hamF4XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICBwcml2YXRlIG9uU3VjY2Vzc0dldEl0ZW1zRnJvbVNlcnZlcihtc2c6IGFueSwgdGV4dFN0YXR1czogc3RyaW5nLCBqcVhIUjogSlF1ZXJ5WEhSKSB7XHJcbiAgICAgICAgdGhpcy5fc2VhcmNoQ3JpdGVyaWEuVW5CaW5kKHRoaXMuX3ByZXZpb3VzQ2F0ZWdvcnlJZCk7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX3BhcmVudERpdklkKS5jaGlsZHJlbigpLnJlbW92ZSgpO1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9wYXJlbnREaXZJZCkuaHRtbChtc2cpO1xyXG4gICAgICAgIHRoaXMuX3NlYXJjaENyaXRlcmlhLkJpbmQodGhpcy5fY3VycmVudENhdGVnb3J5SWQsIHRoaXMuX3NlYXJjaENyaXRlcmlhQ2hhbmdlKTtcclxuICAgICAgICB0aGlzLl9wcmV2aW91c0NhdGVnb3J5SWQgPSB0aGlzLl9jdXJyZW50Q2F0ZWdvcnlJZDtcclxuICAgIH0vL29uU3VjY2Vzc0dldFRpbWVGcm9tU2VydmVyXHJcblxyXG4gICAgcHJpdmF0ZSBvbkVycm9yR2V0SXRlbXNGcm9tU2VydmVyKGpxWEhSOiBKUXVlcnlYSFIsIHRleHRTdGF0dXM6IHN0cmluZywgZXJyb3JUaHJvd246IHN0cmluZykge1xyXG4gICAgICAgIGFsZXJ0KGVycm9yVGhyb3duKTtcclxuICAgIH0vL29uRXJyb3JHZXRUaW1lRnJvbVNlcnZlclxyXG5cclxuICAgIFxyXG4gICAgXHJcbn0iLCLvu79pbXBvcnQgeyBVc2VySW5wdXQgfSBmcm9tIFwiLi4vLi4vLi4vLi4vSGVscGVyL1VzZXJJbnB1dFwiO1xyXG5pbXBvcnQgeyBJQ3JpdGVyaWFDaGFuZ2UgfSBmcm9tIFwiLi4vLi4vLi4vLi4vSGVscGVyL0lDcml0ZXJpYUNoYW5nZVwiO1xyXG5pbXBvcnQgeyBJQ3JpdGVyaWEsIENyaXRlcmlhVmFsaWRhdG9yIH0gZnJvbSBcIi4uLy4uLy4uLy4uL0hlbHBlci9JQ3JpdGVyaWFcIjtcclxuaW1wb3J0IHsgQ2FyTW9kZWxCcmFuZENvbnRyb2xsZXIgfSBmcm9tIFwiLi4vLi4vLi4vLi4vQ29tcG9uZW50cy9UcmFuc2Zvcm1hdGlvbi9DYXJNb2RlbEJyYW5kQ29udHJvbGxlclwiO1xyXG5pbXBvcnQge0RlZmF1bHRPcmRlckJ5fSBmcm9tIFwiLi4vLi4vLi4vLi4vQ29tcG9uZW50cy9PcmRlckJ5L0RlZmF1bHRPcmRlckJ5XCI7XHJcbmltcG9ydCB7RGVmYXVsdFByaWNlVHlwZX0gZnJvbSBcIi4uLy4uLy4uLy4uL0NvbXBvbmVudHMvUHJpY2VUeXBlL0RlZmF1bHRQcmljZVR5cGVcIjtcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgQWRUcmFuc2Zvcm1hdGlvblNlYXJjaENyaXRlcmlhIGltcGxlbWVudHMgSUNyaXRlcmlhIHtcclxuXHJcbiAgICBwcml2YXRlIF9jYXJNb2RlbEJyYW5kQ29udG9sbGVyOiBDYXJNb2RlbEJyYW5kQ29udHJvbGxlcjtcclxuICAgIHByaXZhdGUgX2RlZmF1bHRPcmRlckJ5OiBEZWZhdWx0T3JkZXJCeTtcclxuICAgIHByaXZhdGUgX2RlZmF1bHRQcmljZVR5cGU6IERlZmF1bHRQcmljZVR5cGU7XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBNYWtlWWVhckZyb21LZXk6IHN0cmluZyA9IFwiTWFrZVllYXJGcm9tXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IE1ha2VZZWFyRnJvbUlucHV0SWQ6IHN0cmluZyA9IFwiZnJvbVllYXJcIjtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IE1ha2VZZWFyVG9LZXk6IHN0cmluZyA9IFwiTWFrZVllYXJUb1wiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBNYWtlWWVhclRvSW5wdXRJZDogc3RyaW5nID0gXCJ0b1llYXJcIjtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IEZ1ZWxLZXkgPSBcIkZ1ZWxcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgRnVlbFNlbGVjdElkOiBzdHJpbmcgPSBcImZ1ZWxcIjtcclxuXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgTWlsZWFnZUZyb21LZXk6IHN0cmluZyA9IFwiTWlsZWFnZUZyb21cIjtcclxuICAgIHB1YmxpYyByZWFkb25seSBNaWxlYWdlRnJvbUlucHV0SWQ6IHN0cmluZyA9IFwibWlsZWFnZUZyb21cIjtcclxuXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgTWlsZWFnZVRvS2V5OiBzdHJpbmcgPSBcIk1pbGVhZ2VUb1wiO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IE1pbGVhZ2VUb0lucHV0SWQ6IHN0cmluZyA9IFwibWlsZWFnZVRvXCI7XHJcblxyXG4gICAgcHVibGljIHJlYWRvbmx5IEdlYXJib3hLZXk6IHN0cmluZyA9IFwiR2VhcmJveFwiO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IEdlYXJib3hUeXBlU2VsZWN0SWQ6IHN0cmluZyA9IFwiZ2VhcmJveFR5cGVcIjtcclxuXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgQm9keUNvbG9yS2V5OiBzdHJpbmcgPSBcIkJvZHlDb2xvclwiO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IEJvZHlDb2xvclNlbGVjdElkOiBzdHJpbmcgPSBcImJvZHlDb2xvclwiO1xyXG5cclxuICAgIHB1YmxpYyByZWFkb25seSBJbnRlcm5hbENvbG9yS2V5OiBzdHJpbmcgPSBcIkludGVybmFsQ29sb3JcIjtcclxuICAgIHB1YmxpYyByZWFkb25seSBJbnRlcm5hbENvbG9yU2VsZWN0SWQgPSBcImludGVybmFsQ29sb3JcIjtcclxuXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgQm9keVN0YXR1c0tleTogc3RyaW5nID0gXCJCb2R5U3RhdHVzXCI7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgQm9keVN0YXR1c1NlbGVjdElkOiBzdHJpbmcgPSBcImJvZHlTdGF0dXNcIjtcclxuXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgQ2FyU3RhdHVzS2V5OiBzdHJpbmcgPSBcIkNhclN0YXR1c1wiO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IENhclN0YXR1c1NlbGVjdElkOiBzdHJpbmcgPSBcImNhclN0YXR1c1wiO1xyXG5cclxuICAgIHB1YmxpYyByZWFkb25seSBQbGF0ZVR5cGVLZXk6IHN0cmluZyA9IFwiUGxhdGVUeXBlXCI7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgUGxhdGVUeXBlU2VsZWN0SWQ6IHN0cmluZyA9IFwicGxhdGVUeXBlXCI7XHJcblxyXG4gICAgcHJpdmF0ZSBpbml0VmlldygpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9jYXJNb2RlbEJyYW5kQ29udG9sbGVyID0gbmV3IENhck1vZGVsQnJhbmRDb250cm9sbGVyKCk7XHJcbiAgICAgICAgdGhpcy5fZGVmYXVsdFByaWNlVHlwZSA9IG5ldyBEZWZhdWx0UHJpY2VUeXBlKCk7XHJcbiAgICAgICAgdGhpcy5fZGVmYXVsdE9yZGVyQnkgPSBuZXcgRGVmYXVsdE9yZGVyQnkoKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgcmVnaXN0ZXJFdmVudHMoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fZGVmYXVsdFByaWNlVHlwZS5TZWxlY3RlZFByaWNlVHlwZUNoYW5nZWRFdmVudC5TdWJzY3JpYmUoKHNlbmRlciwgYXJncykgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9kZWZhdWx0T3JkZXJCeS5QcmljZVR5cGVDaGFuZ2VkKHNlbmRlciwgYXJncyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1blJlZ2lzdGVyRXZlbnRzKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX2RlZmF1bHRQcmljZVR5cGUuU2VsZWN0ZWRQcmljZVR5cGVDaGFuZ2VkRXZlbnQuVW5zdWJzY3JpYmUoKHNlbmRlciwgYXJncykgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9kZWZhdWx0T3JkZXJCeS5QcmljZVR5cGVDaGFuZ2VkKHNlbmRlciwgYXJncyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy9UT0RPIGluIG9ydGhlciB0byBtaW5pbWl6ZSBiYW5kd2lkdGggdXNhZ2UgaXQgaXMgZ29vZCBwcmN0aWNlIHRvIG5vdCBzZW5kIGNyaXRlcmlhcyB0aGF0IGhhdmUgZGVmYXVsdCB2YWx1ZVxyXG4gICAgcHVibGljIEZpbGxDcml0ZXJpYSh1c2VySW5wdXQ6IFVzZXJJbnB1dCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX2Nhck1vZGVsQnJhbmRDb250b2xsZXIuRmlsbENyaXRlcmlhKHVzZXJJbnB1dCk7XHJcbiAgICAgICAgdGhpcy5fZGVmYXVsdE9yZGVyQnkuRmlsbENyaXRlcmlhKHVzZXJJbnB1dCk7XHJcbiAgICAgICAgdGhpcy5fZGVmYXVsdFByaWNlVHlwZS5GaWxsQ3JpdGVyaWEodXNlcklucHV0KTtcclxuXHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuTWFrZVllYXJGcm9tS2V5XSA9XHJcbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLk1ha2VZZWFyRnJvbUlucHV0SWQpLnZhbCgpOy8vbWFrZVllYXJGcm9tXHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuTWFrZVllYXJUb0tleV0gPVxyXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5NYWtlWWVhclRvSW5wdXRJZCkudmFsKCk7Ly9tYWtlWWVhclRvXHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuRnVlbEtleV0gPVxyXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5GdWVsU2VsZWN0SWQpLmZpbmQoXCJvcHRpb246c2VsZWN0ZWRcIikudmFsKCk7Ly9mdWVsXHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuTWlsZWFnZUZyb21LZXldID1cclxuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuTWlsZWFnZUZyb21JbnB1dElkKS52YWwoKTsvL21pbGVhZ2VGcm9tXHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuTWlsZWFnZVRvS2V5XSA9XHJcbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLk1pbGVhZ2VUb0lucHV0SWQpLnZhbCgpOy8vbWlsZWFnZVRvXHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuR2VhcmJveEtleV0gPVxyXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5HZWFyYm94VHlwZVNlbGVjdElkKS5maW5kKFwib3B0aW9uOnNlbGVjdGVkXCIpLnZhbCgpOy8vZ2VhcmJveFR5cGUgICAgICAgIFxyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLkJvZHlDb2xvcktleV0gPVxyXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5Cb2R5Q29sb3JTZWxlY3RJZCkuZmluZChcIm9wdGlvbjpzZWxlY3RlZFwiKS52YWwoKTsvL2JvZHlDb2xvclxyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLkludGVybmFsQ29sb3JLZXldID1cclxuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuSW50ZXJuYWxDb2xvclNlbGVjdElkKS5maW5kKFwib3B0aW9uOnNlbGVjdGVkXCIpLnZhbCgpOy8vaW50ZXJuYWxDb2xvciAgICAgICAgXHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuQm9keVN0YXR1c0tleV0gPVxyXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5Cb2R5U3RhdHVzU2VsZWN0SWQpLmZpbmQoXCJvcHRpb246c2VsZWN0ZWRcIikudmFsKCk7Ly9ib2R5U3RhdHVzXHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuQ2FyU3RhdHVzS2V5XSA9XHJcbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLkNhclN0YXR1c1NlbGVjdElkKS5maW5kKFwib3B0aW9uOnNlbGVjdGVkXCIpLnZhbCgpOy8vY2FyU3RhdHVzICAgICAgICBcclxuICAgICAgICB1c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnlbdGhpcy5QbGF0ZVR5cGVLZXldID1cclxuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuUGxhdGVUeXBlU2VsZWN0SWQpLmZpbmQoXCJvcHRpb246c2VsZWN0ZWRcIikudmFsKCk7Ly9wbGF0ZVR5cGVcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgQmluZEV2ZW50cyhjcml0ZXJpYUNoYW5nZTogSUNyaXRlcmlhQ2hhbmdlKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5pbml0VmlldygpO1xyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJFdmVudHMoKTtcclxuXHJcbiAgICAgICAgdGhpcy5fY2FyTW9kZWxCcmFuZENvbnRvbGxlci5CaW5kRXZlbnRzKGNyaXRlcmlhQ2hhbmdlKTtcclxuICAgICAgICB0aGlzLl9kZWZhdWx0T3JkZXJCeS5CaW5kRXZlbnRzKGNyaXRlcmlhQ2hhbmdlKTtcclxuICAgICAgICB0aGlzLl9kZWZhdWx0UHJpY2VUeXBlLkJpbmRFdmVudHMoY3JpdGVyaWFDaGFuZ2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBVbkJpbmRFdmVudHMoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fY2FyTW9kZWxCcmFuZENvbnRvbGxlci5VbkJpbmRFdmVudHMoKTtcclxuICAgICAgICB0aGlzLl9kZWZhdWx0T3JkZXJCeS5VbkJpbmRFdmVudHMoKTtcclxuICAgICAgICB0aGlzLl9kZWZhdWx0UHJpY2VUeXBlLlVuQmluZEV2ZW50cygpO1xyXG4gICAgICAgIHRoaXMudW5SZWdpc3RlckV2ZW50cygpO1xyXG4gICAgfVxyXG5cclxuICAgIFZhbGlkYXRlQ3JpdGVyaWEoKTogQ3JpdGVyaWFWYWxpZGF0b3IgeyB0aHJvdyBuZXcgRXJyb3IoXCJOb3QgaW1wbGVtZW50ZWRcIik7IH1cclxufVxyXG5cclxuXHJcblxyXG4iLCLvu79pbXBvcnQge0lDcml0ZXJpYSxDcml0ZXJpYVZhbGlkYXRvcn0gZnJvbSBcIi4uLy4uLy4uLy4uL0hlbHBlci9JQ3JpdGVyaWFcIjtcclxuaW1wb3J0IHsgVXNlcklucHV0IH0gZnJvbSBcIi4uLy4uLy4uLy4uL0hlbHBlci9Vc2VySW5wdXRcIjtcclxuaW1wb3J0IHsgSUNyaXRlcmlhQ2hhbmdlIH0gZnJvbSBcIi4uLy4uLy4uLy4uL0hlbHBlci9JQ3JpdGVyaWFDaGFuZ2VcIjtcclxuaW1wb3J0IHtEZWZhdWx0T3JkZXJCeX0gZnJvbSBcIi4uLy4uLy4uLy4uL0NvbXBvbmVudHMvT3JkZXJCeS9EZWZhdWx0T3JkZXJCeVwiO1xyXG5pbXBvcnQge0RlZmF1bHRQcmljZVR5cGV9IGZyb20gXCIuLi8uLi8uLi8uLi9Db21wb25lbnRzL1ByaWNlVHlwZS9EZWZhdWx0UHJpY2VUeXBlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgRGVmYXVsdFNlYXJjaENyaXRlcmlhIGltcGxlbWVudHMgSUNyaXRlcmlhe1xyXG5cclxuICAgIHByaXZhdGUgX2RlZmF1bHRPcmRlckJ5OiBEZWZhdWx0T3JkZXJCeTtcclxuICAgIHByaXZhdGUgX2RlZmF1bHRQcmljZVR5cGU6RGVmYXVsdFByaWNlVHlwZTtcclxuXHJcbiAgICBwcml2YXRlIGluaXRWaWV3KCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX2RlZmF1bHRQcmljZVR5cGUgPSBuZXcgRGVmYXVsdFByaWNlVHlwZSgpO1xyXG4gICAgICAgIHRoaXMuX2RlZmF1bHRPcmRlckJ5ID0gbmV3IERlZmF1bHRPcmRlckJ5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZWdpc3RlckV2ZW50cygpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9kZWZhdWx0UHJpY2VUeXBlLlNlbGVjdGVkUHJpY2VUeXBlQ2hhbmdlZEV2ZW50LlN1YnNjcmliZSgoc2VuZGVyLCBhcmdzKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RlZmF1bHRPcmRlckJ5LlByaWNlVHlwZUNoYW5nZWQoc2VuZGVyLCBhcmdzKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVuUmVnaXN0ZXJFdmVudHMoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fZGVmYXVsdFByaWNlVHlwZS5TZWxlY3RlZFByaWNlVHlwZUNoYW5nZWRFdmVudC5VbnN1YnNjcmliZSgoc2VuZGVyLCBhcmdzKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RlZmF1bHRPcmRlckJ5LlByaWNlVHlwZUNoYW5nZWQoc2VuZGVyLCBhcmdzKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgRmlsbENyaXRlcmlhKHVzZXJJbnB1dDogVXNlcklucHV0KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fZGVmYXVsdE9yZGVyQnkuRmlsbENyaXRlcmlhKHVzZXJJbnB1dCk7XHJcbiAgICAgICAgdGhpcy5fZGVmYXVsdFByaWNlVHlwZS5GaWxsQ3JpdGVyaWEodXNlcklucHV0KTtcclxuICAgIH1cclxuXHJcbiAgICBCaW5kRXZlbnRzKGNyaXRlcmlhQ2hhbmdlOiBJQ3JpdGVyaWFDaGFuZ2UpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmluaXRWaWV3KCk7XHJcbiAgICAgICAgdGhpcy5yZWdpc3RlckV2ZW50cygpO1xyXG4gICAgICAgIHRoaXMuX2RlZmF1bHRPcmRlckJ5LkJpbmRFdmVudHMoY3JpdGVyaWFDaGFuZ2UpO1xyXG4gICAgICAgIHRoaXMuX2RlZmF1bHRQcmljZVR5cGUuQmluZEV2ZW50cyhjcml0ZXJpYUNoYW5nZSk7XHJcbiAgICB9XHJcblxyXG4gICAgVW5CaW5kRXZlbnRzKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX2RlZmF1bHRPcmRlckJ5LlVuQmluZEV2ZW50cygpO1xyXG4gICAgICAgIHRoaXMuX2RlZmF1bHRQcmljZVR5cGUuVW5CaW5kRXZlbnRzKCk7XHJcbiAgICAgICAgdGhpcy51blJlZ2lzdGVyRXZlbnRzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgVmFsaWRhdGVDcml0ZXJpYSgpOiBDcml0ZXJpYVZhbGlkYXRvciB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm90IGltcGxlbWVudGVkXCIpO1xyXG4gICAgfVxyXG59Iiwi77u/aW1wb3J0IHsgVXNlcklucHV0IH0gZnJvbSBcIi4uLy4uLy4uL0hlbHBlci9Vc2VySW5wdXRcIjtcclxuaW1wb3J0IHsgSVJlc3VsdEhhbmRsZXIgfSBmcm9tIFwiLi4vLi4vLi4vSGVscGVyL0lSZXN1bHRIYW5kbGVyXCI7XHJcbmltcG9ydCB7QWpheENhbGxlcn0gZnJvbSBcIi4uLy4uLy4uL0hlbHBlci9BamF4Q2FsbGVyXCI7XHJcblxyXG4vL1RPRE8gbWFrZSBjb3VudCBvcHRpb25hbCB0byB1c2VyXHJcbmV4cG9ydCBjbGFzcyBTZXJ2ZXJDYWxsZXIgaW1wbGVtZW50cyBJUmVzdWx0SGFuZGxlciB7XHJcbiAgICBcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgU3RhcnRJbmRleEtleTogc3RyaW5nID0gXCJTdGFydEluZGV4XCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9pbml0aWFsU3RhcnQ6IG51bWJlciA9IDE7XHJcbiAgICBwcml2YXRlIF9zdGFydDogbnVtYmVyID0gMTtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IENvdW50S2V5OiBzdHJpbmcgPSBcIkNvdW50XCI7XHJcbiAgICBwcml2YXRlIF9jb3VudDogbnVtYmVyID0gNTtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IFJlcXVlc3RJbmRleEtleTogc3RyaW5nID0gXCJSZXF1ZXN0SW5kZXhcIjtcclxuICAgIHByaXZhdGUgX2N1cnJlbnRSZXF1ZXN0SW5kZXg6IG51bWJlciA9IDA7XHJcbiAgICBcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgTnVtYmVyT2ZJdGVtc0tleTogc3RyaW5nID0gXCJudW1iZXJPZkl0ZW1zXCI7XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfdXJsOiBzdHJpbmcgPSBcIi9hcGkvQWRBcGkvR2V0QWR2ZXJ0aXNlbWVudENvbW1vblwiO1xyXG5cclxuICAgIHByaXZhdGUgX3Jlc3VsdEhhbmRsZXI6IElSZXN1bHRIYW5kbGVyO1xyXG4gICAgcHJpdmF0ZSBfYWpheENhbGxlcjpBamF4Q2FsbGVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHJlc3VsdEhhbmRsZXI6IElSZXN1bHRIYW5kbGVyKSB7XHJcbiAgICAgICAgdGhpcy5fcmVzdWx0SGFuZGxlciA9IHJlc3VsdEhhbmRsZXI7XHJcbiAgICAgICAgdGhpcy5fYWpheENhbGxlciA9IG5ldyBBamF4Q2FsbGVyKHRoaXMuX3VybCwgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIEdldEFkSXRlbXNGcm9tU2VydmVyKHVzZXJJbnB1dDogVXNlcklucHV0KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fY3VycmVudFJlcXVlc3RJbmRleCsrO1xyXG5cclxuICAgICAgICB1c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnlbdGhpcy5TdGFydEluZGV4S2V5XSA9IHRoaXMuX3N0YXJ0O1xyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLkNvdW50S2V5XSA9IHRoaXMuX2NvdW50O1xyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLlJlcXVlc3RJbmRleEtleV0gPSB0aGlzLl9jdXJyZW50UmVxdWVzdEluZGV4O1xyXG5cclxuICAgICAgICB0aGlzLl9hamF4Q2FsbGVyLkNhbGwodXNlcklucHV0KTtcclxuICAgIH0gLy9HZXRBZEl0ZW1zRnJvbVNlcnZlclxyXG5cclxuICAgIFxyXG5cclxuICAgIHByaXZhdGUgb25FcnJvckdldEl0ZW1zRnJvbVNlcnZlcihqcVhIUjogSlF1ZXJ5WEhSLCB0ZXh0U3RhdHVzOiBzdHJpbmcsIGVycm9yVGhyb3duOiBzdHJpbmcpIHtcclxuICAgICAgIFxyXG4gICAgICAgIHRoaXMuX3Jlc3VsdEhhbmRsZXIuT25FcnJvcih0ZXh0U3RhdHVzICsgXCIgLCBcIiArIGVycm9yVGhyb3duKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgUmVzZXRTZWFyY2hQYXJhbWV0ZXJzKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX3N0YXJ0ID0gdGhpcy5faW5pdGlhbFN0YXJ0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBPblJlc3VsdChwYXJhbSk6IHZvaWQge1xyXG4gICAgICAgIC8vVE9ETyBjaGVjayBmb3IgdW5kZWZpbmVkIG9yIG51bGwgaW4gbXNnIGFuZCBtc2cuY3VzdG9tRGljdGlvbmFyeVtcIlJlcXVlc3RJbmRleFwiXVxyXG5cclxuXHJcbiAgICAgICAgaWYgKHBhcmFtLkN1c3RvbURpY3Rpb25hcnlbdGhpcy5SZXF1ZXN0SW5kZXhLZXldID09IHRoaXMuX2N1cnJlbnRSZXF1ZXN0SW5kZXgpIHsgLy9sYXN0IGNhbGwgcmVzcG9uc2VcclxuICAgICAgICAgICAgaWYgKHBhcmFtLlN1Y2Nlc3MgPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc3RhcnQgKz0gcGFyc2VJbnQocGFyYW0uQ3VzdG9tRGljdGlvbmFyeVt0aGlzLk51bWJlck9mSXRlbXNLZXldKTtcclxuICAgICAgICAgICAgICAgIC8vVE9ETyBjcmVhdGUgQWR2ZXJ0aXNlbWVudENvbW1vbltdIG9iamVjdCBmcm9tIG1zZy5yZXNwb25zZURhdGFcclxuICAgICAgICAgICAgICAgIHRoaXMuX3Jlc3VsdEhhbmRsZXIuT25SZXN1bHQocGFyYW0uUmVzcG9uc2VEYXRhKTtcclxuICAgICAgICAgICAgfSAvL2lmIChtc2cuc3VjY2VzcyA9PSB0cnVlKVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3Jlc3VsdEhhbmRsZXIuT25FcnJvcihwYXJhbS5NZXNzYWdlICsgXCIgLCBcIiArIHBhcmFtLkVycm9yQ29kZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIE9uRXJyb3IobWVzc2FnZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fcmVzdWx0SGFuZGxlci5PbkVycm9yKG1lc3NhZ2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBBamF4Q2FsbEZpbmlzaGVkKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX3Jlc3VsdEhhbmRsZXIuQWpheENhbGxGaW5pc2hlZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBBamF4Q2FsbFN0YXJ0ZWQoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fcmVzdWx0SGFuZGxlci5BamF4Q2FsbFN0YXJ0ZWQoKTtcclxuICAgIH1cclxufVxyXG5cclxuIiwi77u/aW1wb3J0IHsgQ2F0ZWdvcnkgfSBmcm9tIFwiLi4vLi4vLi4vTW9kZWxzL0NhdGVnb3J5XCI7XHJcbmltcG9ydCB7IENhdGVnb3J5U2VsZWN0aW9uIH0gZnJvbSBcIi4uLy4uLy4uL0NvbXBvbmVudHMvQ2F0ZWdvcnkvQ2F0ZWdvcnlTZWxlY3Rpb25cIjtcclxuaW1wb3J0IHsgU2VydmVyQ2FsbGVyIH0gZnJvbSBcIi4vU2VydmVyQ2FsbGVyXCI7XHJcbmltcG9ydCB7IFNlYXJjaENyaXRlcmlhVmlld0xvYWRlcn0gZnJvbSBcIi4vU2VhcmNoQ3JpdGVyaWFWaWV3TG9hZGVyXCI7XHJcbmltcG9ydCB7U2VhcmNoQ3JpdGVyaWF9IGZyb20gXCIuL1NlYXJjaENyaXRlcmlhXCI7XHJcbmltcG9ydCB7SUNyaXRlcmlhQ2hhbmdlfSBmcm9tIFwiLi4vLi4vLi4vSGVscGVyL0lDcml0ZXJpYUNoYW5nZVwiO1xyXG5pbXBvcnQge1VzZXJJbnB1dH0gZnJvbSBcIi4uLy4uLy4uL0hlbHBlci9Vc2VySW5wdXRcIjtcclxuaW1wb3J0IHtJUmVzdWx0SGFuZGxlcn0gZnJvbSBcIi4uLy4uLy4uL0hlbHBlci9JUmVzdWx0SGFuZGxlclwiO1xyXG5pbXBvcnQge0FkdmVydGlzZW1lbnRDb21tb259IGZyb20gXCIuLi8uLi8uLi9Nb2RlbHMvQWR2ZXJ0aXNlbWVudENvbW1vblwiO1xyXG5cclxuXHJcblxyXG4vL1RPRE8gd2hlbiBjYXRlZ29yeSBjaGFuZ2UgYmVmb3JlIHNlYXJjaCBjcml0ZWlhIGlzIGxvYWRlZCBhIHNlYXJjaCBjYWxsIGlzIHNlbnQgdG8gc2VydmVyXHJcbi8vYWRkIGFuIGV2ZW50IGxpa2Ugdmlld0xvYWRTdGFydGVkLCB2aWV3TG9hZEluUHJvZ3Jlc3Msdmlld0xvYWRDb21wbGV0ZWQgYW5kIGRpc2FibGUgc2VhcmNoXHJcbi8vZHVybmcgaW5Qcm9ncmVzcyBlbmQgZW5hYmxlIGl0IGFmdGVyIGNvbXBsZXRlZFxyXG5leHBvcnQgY2xhc3MgSW5kZXggaW1wbGVtZW50cyBJQ3JpdGVyaWFDaGFuZ2UsIElSZXN1bHRIYW5kbGVyIHtcclxuICAgIFxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBDYWxsSW1hZ2VJZDogc3RyaW5nID0gXCJzZXJ2ZXJDYWxsZWRJbWFnZVwiO1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgQWRUeXBlS2V5OiBzdHJpbmcgPSBcIkFkVHlwZVwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBBZFR5cGVQYXJlbnREaXZJZCA9XCJhZFR5cGVcIjtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IFNlYXJjaFRleHRLZXk9XCJTZWFyY2hUZXh0XCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IFNlYXJjaFRleHRJbnB1dElkID1cInNlYXJjaFRleHRcIjtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9hZFBsYWNlSG9sZGVyRGl2SWQ6IHN0cmluZyA9IFwiYWRQbGFjZUhvbGRlclwiO1xyXG5cclxuICAgIHByaXZhdGUgX3NlcnZlckNhbGxlcjpTZXJ2ZXJDYWxsZXI7XHJcbiAgICBwcml2YXRlIF9jYXRlZ29yeVNlbGVjdGlvbjogQ2F0ZWdvcnlTZWxlY3Rpb247XHJcbiAgICBwcml2YXRlIF9zZWFyY2hDcml0ZXJpYTpTZWFyY2hDcml0ZXJpYTtcclxuICAgIHByaXZhdGUgX3NlYXJjaENyaXRlcmlhVmlld0xvYWRlcjpTZWFyY2hDcml0ZXJpYVZpZXdMb2FkZXI7XHJcblxyXG4gICAgcHJpdmF0ZSBfY2F0ZWdvcnlTZWxlY3RvclBhcmVudERpdklkOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIF9hbGxDYXRlZ29yaWVzSWQ6IHN0cmluZztcclxuXHJcbiAgICBwcml2YXRlIF9nZXRBZEZyb21TZXJ2ZXJCdXR0b25JZCA9IFwiZ2V0QWRGcm9tU2VydmVyXCI7XHJcbiAgICBwcml2YXRlIF9tZXNzYWdlRGl2SWQgPVwibWVzc2FnZVwiO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNhdGVnb3J5U2VsZWN0b3JQYXJlbnREaXZJZDogc3RyaW5nLFxyXG4gICAgICAgIGFsbENhdGVnb3JpZXNJZDogc3RyaW5nKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuX2NhdGVnb3J5U2VsZWN0b3JQYXJlbnREaXZJZCA9IGNhdGVnb3J5U2VsZWN0b3JQYXJlbnREaXZJZDtcclxuICAgICAgICB0aGlzLl9hbGxDYXRlZ29yaWVzSWQgPSBhbGxDYXRlZ29yaWVzSWQ7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5fc2VydmVyQ2FsbGVyID0gbmV3IFNlcnZlckNhbGxlcih0aGlzKTtcclxuICAgICAgICB0aGlzLl9zZWFyY2hDcml0ZXJpYSA9IG5ldyBTZWFyY2hDcml0ZXJpYSgpO1xyXG4gICAgICAgIHRoaXMuX3NlYXJjaENyaXRlcmlhVmlld0xvYWRlciA9IG5ldyBTZWFyY2hDcml0ZXJpYVZpZXdMb2FkZXIoXCJjYXRlZ29yeVNwZWNpZmljU2VhcmNoQ3JpdGVyaWFcIiwgdGhpcywgdGhpcy5fc2VhcmNoQ3JpdGVyaWEpO1xyXG5cclxuICAgICAgICB0aGlzLmluaXRQYWdlKCk7XHJcbiAgICAgICAgdGhpcy5pbml0RXZlbnRIYW5kbGVycygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaW5pdFBhZ2UoKTogdm9pZCB7XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdENhdGVnb3J5U2VsZWN0aW9uQ29udHJvbCgpO1xyXG4gICAgICAgIHRoaXMuaW5pdEdldEFkRnJvbVNlcnZlcigpO1xyXG4gICAgICAgIHRoaXMuaW5pdFNpbmdsZUFkSXRlbVN0eWxlKCk7XHJcblxyXG4gICAgfS8vaW5pdFBhZ2VcclxuXHJcbiAgICBwcml2YXRlIGluaXRDYXRlZ29yeVNlbGVjdGlvbkNvbnRyb2woKTogdm9pZCB7XHJcbiAgICAgICAgbGV0IGFsbENhdGVnb3JpZXNTdHJpbmcgPSAkKFwiI1wiICsgdGhpcy5fYWxsQ2F0ZWdvcmllc0lkKS52YWwoKS50b1N0cmluZygpO1xyXG4gICAgICAgIGxldCBhbGxDYXRlZ29yaWVzID0gJC5wYXJzZUpTT04oYWxsQ2F0ZWdvcmllc1N0cmluZykgYXMgQ2F0ZWdvcnlbXTtcclxuICAgICAgICB0aGlzLl9jYXRlZ29yeVNlbGVjdGlvbiA9IG5ldyBDYXRlZ29yeVNlbGVjdGlvbih0aGlzLl9jYXRlZ29yeVNlbGVjdG9yUGFyZW50RGl2SWQsIGFsbENhdGVnb3JpZXMpO1xyXG4gICAgICAgIHRoaXMuX2NhdGVnb3J5U2VsZWN0aW9uLkNyZWF0ZUZpcnN0TGV2ZWwoKTtcclxuXHJcbiAgICB9Ly9pbml0Q2F0ZWdvcnlTZWxlY3Rpb25Db250cm9sXHJcblxyXG4gICAgcHJpdmF0ZSBpbml0RXZlbnRIYW5kbGVycygpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9jYXRlZ29yeVNlbGVjdGlvbi5TZWxlY3RlZENhdGVnb3J5Q2hhbmdlZEV2ZW50LlN1YnNjcmliZSgoc2VuZGVyLCBhcmdzKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VhcmNoQ3JpdGVyaWFDaGFuZ2VkKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3NlYXJjaENyaXRlcmlhVmlld0xvYWRlci5HZXRTZWFyY2hDcml0ZXJpYVZpZXdGcm9tU2VydmVyKGFyZ3MuU2VsZWN0ZWRDYXRlZ29yeUlkKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5fc2VhcmNoQ3JpdGVyaWEuQmluZCh0aGlzLl9jYXRlZ29yeVNlbGVjdGlvbi5HZXRTZWxlY3RlZENhdGVnb3J5SWQoKSx0aGlzKTtcclxuXHJcblxyXG4gICAgICAgXHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuQWRUeXBlUGFyZW50RGl2SWQpLm9uKFwiY2hhbmdlXCIsXHJcbiAgICAgICAgICAgIChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZWFyY2hDcml0ZXJpYUNoYW5nZWQoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLlNlYXJjaFRleHRJbnB1dElkKS5vbihcImlucHV0XCIsICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5zZWFyY2hDcml0ZXJpYUNoYW5nZWQoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICAkKGRvY3VtZW50KS5rZXlwcmVzcygoZSkgPT5cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChlLndoaWNoID09IDEzKSB7XHJcbiAgICAgICAgICAgICAgICAkKFwiI1wiK3RoaXMuX2dldEFkRnJvbVNlcnZlckJ1dHRvbklkKS5jbGljaygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBDdXN0b21Dcml0ZXJpYUNoYW5nZWQoKTp2b2lkIHtcclxuICAgICAgICB0aGlzLnNlYXJjaENyaXRlcmlhQ2hhbmdlZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2VhcmNoQ3JpdGVyaWFDaGFuZ2VkKCk6IHZvaWQge1xyXG4gICAgICAgICQoXCIjYWRQbGFjZUhvbGRlclwiKS5jaGlsZHJlbigpLnJlbW92ZSgpO1xyXG4gICAgICAgIHRoaXMuX3NlcnZlckNhbGxlci5SZXNldFNlYXJjaFBhcmFtZXRlcnMoKTtcclxuICAgICAgIC8vICQoXCIjXCIgKyB0aGlzLl9nZXRBZEZyb21TZXJ2ZXJJZCkudHJpZ2dlcihcImNsaWNrXCIpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXRHZXRBZEZyb21TZXJ2ZXIoKTogdm9pZCB7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX2dldEFkRnJvbVNlcnZlckJ1dHRvbklkKS5vbihcImNsaWNrXCIsIChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBsZXQgdXNlcklucHV0ID0gbmV3IFVzZXJJbnB1dCgpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fY2F0ZWdvcnlTZWxlY3Rpb24uSW5zZXJ0Q2F0ZWdvcnlJZEluVXNlcklucHV0RGljdGlvbmFyeSh1c2VySW5wdXQpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuQWRUeXBlS2V5XSA9ICQoXCIjXCIgKyB0aGlzLkFkVHlwZVBhcmVudERpdklkKS5jaGlsZHJlbihcIjpjaGVja2VkXCIpLnZhbCgpO1xyXG4gICAgICAgICAgICB1c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnlbdGhpcy5TZWFyY2hUZXh0S2V5XSA9ICQoXCIjXCIgKyB0aGlzLlNlYXJjaFRleHRJbnB1dElkKS52YWwoKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuX3NlYXJjaENyaXRlcmlhLkZpbGxDYXRlZ29yeVNwZWNpZmljU2VhcmNoQ3JpdGVyaWEodGhpcy5fY2F0ZWdvcnlTZWxlY3Rpb24uR2V0U2VsZWN0ZWRDYXRlZ29yeUlkKCksIHVzZXJJbnB1dCk7Ly9maWxsIGNhdGVnb3J5IHNwZWNpZmljIHNlYXJjaCBwYXJhbWV0ZXJzXHJcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlRXJyb3JNZXNzYWdlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3NlcnZlckNhbGxlci5HZXRBZEl0ZW1zRnJvbVNlcnZlcih1c2VySW5wdXQpO1xyXG4gICAgICAgIH0pOyAvL2NsaWNrXHJcbiAgICB9Ly9pbml0R2V0QWRGcm9tU2VydmVyXHJcblxyXG4gICAgcHVibGljIE9uUmVzdWx0KGFkdmVydGlzZW1lbnRDb21tb25zOiBBZHZlcnRpc2VtZW50Q29tbW9uW10pOiB2b2lkIHtcclxuICAgICAgICB2YXIgdGVtcGxhdGUgPSAkKCcjc2luZ2xlQWRJdGVtJykuaHRtbCgpO1xyXG4gICAgICAgIHZhciBkYXRhO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWR2ZXJ0aXNlbWVudENvbW1vbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIGFkSW1hZ2UgPSBudWxsO1xyXG4gICAgICAgICAgICBpZiAoYWR2ZXJ0aXNlbWVudENvbW1vbnNbaV0uQWR2ZXJ0aXNlbWVudEltYWdlc1swXSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBhZEltYWdlID0gXCJkYXRhOmltYWdlL2pwZztiYXNlNjQsXCIgKyBhZHZlcnRpc2VtZW50Q29tbW9uc1tpXS5BZHZlcnRpc2VtZW50SW1hZ2VzWzBdO1xyXG4gICAgICAgICAgICB9IC8vZW5kIGlmXHJcbiAgICAgICAgICAgIGRhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICBBZHZlcnRpc2VtZW50SWQ6IGFkdmVydGlzZW1lbnRDb21tb25zW2ldLkFkdmVydGlzZW1lbnRJZCxcclxuICAgICAgICAgICAgICAgIEFkdmVydGlzZW1lbnRDYXRlZ29yeUlkOiBhZHZlcnRpc2VtZW50Q29tbW9uc1tpXS5BZHZlcnRpc2VtZW50Q2F0ZWdvcnlJZCxcclxuICAgICAgICAgICAgICAgIEFkdmVydGlzZW1lbnRDYXRlZ29yeTogYWR2ZXJ0aXNlbWVudENvbW1vbnNbaV0uQWR2ZXJ0aXNlbWVudENhdGVnb3J5LFxyXG4gICAgICAgICAgICAgICAgYWRJbWFnZTogYWRJbWFnZSxcclxuICAgICAgICAgICAgICAgIGFkUHJpY2U6IGFkdmVydGlzZW1lbnRDb21tb25zW2ldLkFkdmVydGlzZW1lbnRQcmljZS5QcmljZVN0cmluZywgLy90b2RvIGNoZWNrIHRoZSBwcmljZSB0eXBlXHJcbiAgICAgICAgICAgICAgICBBZHZlcnRpc2VtZW50VGl0bGU6IGFkdmVydGlzZW1lbnRDb21tb25zW2ldLkFkdmVydGlzZW1lbnRUaXRsZSxcclxuICAgICAgICAgICAgICAgIEFkdmVydGlzZW1lbnRTdGF0dXM6IGFkdmVydGlzZW1lbnRDb21tb25zW2ldLkFkdmVydGlzZW1lbnRTdGF0dXNcclxuICAgICAgICAgICAgICAgIC8vYWREYXRlOiBtc2cuUmVzcG9uc2VEYXRhW2ldLkFkVGltZVxyXG4gICAgICAgICAgICB9IC8vZW5kIGRhdGFcclxuXHJcbiAgICAgICAgICAgIHZhciBodG1sID0gTXVzdGFjaGUudG9faHRtbCh0ZW1wbGF0ZSwgZGF0YSk7XHJcbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLl9hZFBsYWNlSG9sZGVyRGl2SWQpLmFwcGVuZChodG1sKTtcclxuICAgICAgICB9IC8vZW5kIGZvclxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBPbkVycm9yKG1lc3NhZ2U6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuc2hvd0Vycm9yTWVzc2FnZShtZXNzYWdlKTtcclxuICAgIH1cclxuXHJcbiAgICBBamF4Q2FsbFN0YXJ0ZWQoKTogdm9pZCB7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuQ2FsbEltYWdlSWQpLnNob3coKTtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fZ2V0QWRGcm9tU2VydmVyQnV0dG9uSWQpLmF0dHIoXCJkaXNhYmxlZFwiLCBcImRpc2FibGVkXCIpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBBamF4Q2FsbEZpbmlzaGVkKCk6IHZvaWQge1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLkNhbGxJbWFnZUlkKS5oaWRlKCk7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX2dldEFkRnJvbVNlcnZlckJ1dHRvbklkKS5yZW1vdmVBdHRyKFwiZGlzYWJsZWRcIik7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzaG93RXJyb3JNZXNzYWdlKG1lc3NhZ2U6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMucmVtb3ZlRXJyb3JNZXNzYWdlKCk7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX21lc3NhZ2VEaXZJZCkuYXBwZW5kKGA8cD4ke21lc3NhZ2V9PC9wPmApO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVtb3ZlRXJyb3JNZXNzYWdlKCkge1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9tZXNzYWdlRGl2SWQpLmNoaWxkcmVuKCkucmVtb3ZlKCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHByaXZhdGUgaW5pdFNpbmdsZUFkSXRlbVN0eWxlKCk6IHZvaWQge1xyXG4gICAgICAgIC8vc2hvdyBkZXRhaWwgb2Ygc2luZ2xlQWRJdGVtIHdoZW4gbW91c2Ugb3ZlclxyXG4gICAgICAgICQoZG9jdW1lbnQpLm9uKFwibW91c2VlbnRlciBtb3VzZWxlYXZlXCIsIFwiLmJsb2NrRGlzcGxheVwiLCAoZXZlbnQ6IEpRdWVyeS5FdmVudDxIVE1MRWxlbWVudCwgbnVsbD4pID0+IHtcclxuICAgICAgICAgICAgJChldmVudC5jdXJyZW50VGFyZ2V0KS5maW5kKFwiLm1vcmVJbmZvXCIpLmZhZGVUb2dnbGUoMjUwKTtcclxuICAgICAgICAgICAgLy8kKHRoaXMpLmZpbmQoXCIubW9yZUluZm9cIikuZmFkZVRvZ2dsZSgyNTApO1xyXG4gICAgICAgIH0pOy8vZW5kIG9uXHJcbiAgICB9Ly9pbml0U2luZ2xlQWRJdGVtU3R5bGVcclxufVxyXG5cclxubGV0IGNhdGVnb3J5U2VsZWN0b3JQYXJlbnREaXZJZDogc3RyaW5nID0gXCJjYXRlZ29yeVNlbGVjdG9yXCI7XHJcbmxldCBhbGxDYXRlZ29yaWVzSWQgPSBcImFsbENhdGVnb3JpZXNcIjtcclxuXHJcbmRlY2xhcmUgbGV0IHdpbmRvdzogYW55O1xyXG52YXIgaW5kZXg6SW5kZXg7XHJcblxyXG5cclxuJChkb2N1bWVudCkucmVhZHkoKCkgPT4ge1xyXG4gICAgaW5kZXg9IG5ldyBJbmRleChjYXRlZ29yeVNlbGVjdG9yUGFyZW50RGl2SWQsIGFsbENhdGVnb3JpZXNJZCk7XHJcbiAgICBpbmRleC5DdXN0b21Dcml0ZXJpYUNoYW5nZWQoKTsvL3RvIGluaXRpYXRlIGEgc2VydmVyIGNhbGwgb24gcGFnZSBsb2FkIGZvciBmaXJzdCB0aW1lXHJcbiAgICB3aW5kb3cuQWxpSW5kZXggPSBpbmRleDtcclxufSk7Ly9yZWFkeSIsIu+7v2ltcG9ydCB7TmV3QWRDcml0ZXJpYX0gZnJvbSBcIi4vTmV3QWRDcml0ZXJpYVwiO1xyXG5pbXBvcnQge0lDcml0ZXJpYUNoYW5nZX0gZnJvbSBcIi4uLy4uLy4uL0hlbHBlci9JQ3JpdGVyaWFDaGFuZ2VcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBOZXdBZFBhcnRpYWxWaWV3TG9hZGVyIHtcclxuICAgIHByaXZhdGUgX3BhcnRpYWxWaWV3RGl2SWQ6IHN0cmluZztcclxuICAgIHByaXZhdGUgX3VybDogc3RyaW5nID0gXCIvTmV3QWQvR2V0TmV3QWRQYXJ0aWFsVmlld1wiO1xyXG4gICAgcHJpdmF0ZSBfcHJldmlvdXNDYXRlZ29yeUlkOiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBfY3VycmVudENhdGVnb3J5SWQ6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIF9uZXdBZENyaXRlcmlhQ2hhbmdlOiBJQ3JpdGVyaWFDaGFuZ2U7XHJcbiAgICBwcml2YXRlIF9uZXdBZENyaXRlcmlhOiBOZXdBZENyaXRlcmlhO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBhcnRpYWxWaWV3RGl2SWQ6IHN0cmluZywgbmV3QWRDcml0ZXJpYUNoYW5nZTogSUNyaXRlcmlhQ2hhbmdlLCBuZXdBZENyaXRlcmlhOk5ld0FkQ3JpdGVyaWEpIHtcclxuICAgICAgICB0aGlzLl9wYXJ0aWFsVmlld0RpdklkID0gcGFydGlhbFZpZXdEaXZJZDtcclxuICAgICAgICB0aGlzLl9uZXdBZENyaXRlcmlhQ2hhbmdlID0gbmV3QWRDcml0ZXJpYUNoYW5nZTtcclxuICAgICAgICB0aGlzLl9uZXdBZENyaXRlcmlhID0gbmV3QWRDcml0ZXJpYTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgR2V0UGFydGlhbFZpZXdGcm9tU2VydmVyKGNhdGVnb3J5SWQ6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX2N1cnJlbnRDYXRlZ29yeUlkID0gY2F0ZWdvcnlJZDtcclxuICAgICAgICBsZXQgY2FsbFBhcmFtcyA9IG5ldyBQYXJ0aWFsVmlld1NlcnZlckNhbGxQYXJhbWV0ZXJzKCk7XHJcbiAgICAgICAgY2FsbFBhcmFtcy5DYXRlZ29yeUlkID0gY2F0ZWdvcnlJZDtcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0eXBlOiBcIkdFVFwiLCAvL0dFVCBvciBQT1NUIG9yIFBVVCBvciBERUxFVEUgdmVyYlxyXG4gICAgICAgICAgICB1cmw6IHRoaXMuX3VybCxcclxuICAgICAgICAgICAgZGF0YTogY2FsbFBhcmFtcywgLy9EYXRhIHNlbnQgdG8gc2VydmVyXHJcbiAgICAgICAgICAgIC8vY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJywgLy8gY29udGVudCB0eXBlIHNlbnQgdG8gc2VydmVyXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IChtc2csIHRleHRTdGF0dXMsIGpxWEhSKSA9PiB0aGlzLm9uU3VjY2Vzc0dldEl0ZW1zRnJvbVNlcnZlcihtc2csIHRleHRTdGF0dXMsIGpxWEhSKSwvL09uIFN1Y2Nlc3NmdWxsIHNlcnZpY2UgY2FsbFxyXG4gICAgICAgICAgICBlcnJvcjogKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikgPT4gdGhpcy5vbkVycm9yR2V0SXRlbXNGcm9tU2VydmVyKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikvLyBXaGVuIFNlcnZpY2UgY2FsbCBmYWlsc1xyXG4gICAgICAgIH0pOy8vLmFqYXhcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9uU3VjY2Vzc0dldEl0ZW1zRnJvbVNlcnZlcihtc2c6IGFueSwgdGV4dFN0YXR1czogc3RyaW5nLCBqcVhIUjogSlF1ZXJ5WEhSKSB7XHJcbiAgICAgICAgdGhpcy5fbmV3QWRDcml0ZXJpYS5VbkJpbmQodGhpcy5fcHJldmlvdXNDYXRlZ29yeUlkKTtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fcGFydGlhbFZpZXdEaXZJZCkuY2hpbGRyZW4oKS5yZW1vdmUoKTtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fcGFydGlhbFZpZXdEaXZJZCkuaHRtbChtc2cpO1xyXG4gICAgICAgIHRoaXMuX25ld0FkQ3JpdGVyaWEuQmluZCh0aGlzLl9jdXJyZW50Q2F0ZWdvcnlJZCwgdGhpcy5fbmV3QWRDcml0ZXJpYUNoYW5nZSk7XHJcbiAgICAgICAgdGhpcy5fcHJldmlvdXNDYXRlZ29yeUlkID0gdGhpcy5fY3VycmVudENhdGVnb3J5SWQ7XHJcbiAgICB9Ly9vblN1Y2Nlc3NHZXRUaW1lRnJvbVNlcnZlclxyXG5cclxuICAgIHByaXZhdGUgb25FcnJvckdldEl0ZW1zRnJvbVNlcnZlcihqcVhIUjogSlF1ZXJ5WEhSLCB0ZXh0U3RhdHVzOiBzdHJpbmcsIGVycm9yVGhyb3duOiBzdHJpbmcpIHtcclxuICAgICAgICBhbGVydChlcnJvclRocm93bik7XHJcbiAgICB9Ly9vbkVycm9yR2V0VGltZUZyb21TZXJ2ZXJcclxufVxyXG5cclxuLy9UT0RPIHJlZmFjdG9yIHRoaXNcclxuZXhwb3J0IGNsYXNzIFBhcnRpYWxWaWV3U2VydmVyQ2FsbFBhcmFtZXRlcnMge1xyXG4gICAgcHVibGljIENhdGVnb3J5SWQ6bnVtYmVyO1xyXG59Il19
