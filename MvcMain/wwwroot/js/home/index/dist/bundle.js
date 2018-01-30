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
var CriteriaNumericDictionary = /** @class */ (function () {
    function CriteriaNumericDictionary() {
    }
    return CriteriaNumericDictionary;
}());
exports.CriteriaNumericDictionary = CriteriaNumericDictionary;
},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UserInput = /** @class */ (function () {
    function UserInput() {
        this.ParametersDictionary = {};
    }
    return UserInput;
}());
exports.UserInput = UserInput;
},{}],8:[function(require,module,exports){
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
},{"../../../Helper/CriteriaNumericDictionary":6,"./SearchCriteria/AdTransformationSearchCriteria":10,"./SearchCriteria/DefaultSearchCriteria":11}],9:[function(require,module,exports){
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
},{"../../newAd/src/NewAdPartialViewLoader":14}],10:[function(require,module,exports){
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
},{"../../../../Components/OrderBy/DefaultOrderBy":2,"../../../../Components/PriceType/DefaultPriceType":3,"../../../../Components/Transformation/CarModelBrandController":4}],11:[function(require,module,exports){
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
},{"../../../../Components/OrderBy/DefaultOrderBy":2,"../../../../Components/PriceType/DefaultPriceType":3}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//TODO make count optional to user
//TODO instead of adding new ads to the page here call a method on index class to add it by defining an interface in the index class 
var ServerCaller = /** @class */ (function () {
    function ServerCaller(resultHandler) {
        this.StartIndexKey = "StartIndex";
        this._initialStart = 1;
        this._start = 1;
        this.CountKey = "Count";
        this._count = 5;
        this.RequestIndexKey = "RequestIndex";
        this._currentRequestIndex = 0;
        this._numberOfPureServerCalls = 0;
        this.NumberOfItemsKey = "numberOfItems";
        this._url = "/api/AdApi/GetAdvertisementCommon";
        this._resultHandler = resultHandler;
    }
    ServerCaller.prototype.GetAdItemsFromServer = function (userInput) {
        var _this = this;
        this._currentRequestIndex++;
        userInput.ParametersDictionary[this.StartIndexKey] = this._start;
        userInput.ParametersDictionary[this.CountKey] = this._count;
        userInput.ParametersDictionary[this.RequestIndexKey] = this._currentRequestIndex;
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
    }; //GetAdItemsFromServer
    ServerCaller.prototype.onSuccessGetItemsFromServer = function (msg, textStatus, jqXHR) {
        //TODO check for undefined or null in msg and msg.customDictionary["RequestIndex"]
        this._numberOfPureServerCalls--;
        if (this._numberOfPureServerCalls === 0) {
            this._resultHandler.AjaxCallFinished();
        }
        if (msg.CustomDictionary[this.RequestIndexKey] == this._currentRequestIndex) {
            if (msg.Success == true) {
                this._start += parseInt(msg.CustomDictionary[this.NumberOfItemsKey]);
                //TODO create AdvertisementCommon[] object from msg.responseData
                this._resultHandler.OnResultOk(msg.ResponseData);
            } //if (msg.success == true)
            else {
                this._resultHandler.OnResultError(msg.Message + " , " + msg.ErrorCode);
            }
        }
    };
    ServerCaller.prototype.onErrorGetItemsFromServer = function (jqXHR, textStatus, errorThrown) {
        this._numberOfPureServerCalls--;
        if (this._numberOfPureServerCalls === 0) {
            this._resultHandler.AjaxCallFinished();
        }
        this._resultHandler.OnResultError(textStatus + " , " + errorThrown);
    };
    ServerCaller.prototype.ResetSearchParameters = function () {
        this._start = this._initialStart;
    };
    return ServerCaller;
}());
exports.ServerCaller = ServerCaller;
},{}],13:[function(require,module,exports){
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
        this._getAdFromServerId = "getAdFromServer";
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
                $("#" + _this._getAdFromServerId).click();
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
        $("#" + this._getAdFromServerId).on("click", function (event) {
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
    Index.prototype.OnResultOk = function (advertisementCommons) {
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
    Index.prototype.OnResultError = function (message) {
        this.showErrorMessage(message);
    };
    Index.prototype.AjaxCallStarted = function () {
        $("#" + this.CallImageId).show();
    };
    Index.prototype.AjaxCallFinished = function () {
        $("#" + this.CallImageId).hide();
    };
    Index.prototype.showErrorMessage = function (message) {
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
},{"../../../Components/Category/CategorySelection":1,"../../../Helper/UserInput":7,"./SearchCriteria":8,"./SearchCriteriaViewLoader":9,"./ServerCaller":12}],14:[function(require,module,exports){
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
},{}]},{},[13])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3d3dyb290L2pzL0NvbXBvbmVudHMvQ2F0ZWdvcnkvQ2F0ZWdvcnlTZWxlY3Rpb24udHMiLCJ3d3dyb290L2pzL0NvbXBvbmVudHMvT3JkZXJCeS9EZWZhdWx0T3JkZXJCeS50cyIsInd3d3Jvb3QvanMvQ29tcG9uZW50cy9QcmljZVR5cGUvRGVmYXVsdFByaWNlVHlwZS50cyIsInd3d3Jvb3QvanMvQ29tcG9uZW50cy9UcmFuc2Zvcm1hdGlvbi9DYXJNb2RlbEJyYW5kQ29udHJvbGxlci50cyIsInd3d3Jvb3QvanMvRXZlbnRzL0V2ZW50RGlzcGF0Y2hlci50cyIsInd3d3Jvb3QvanMvSGVscGVyL0NyaXRlcmlhTnVtZXJpY0RpY3Rpb25hcnkudHMiLCJ3d3dyb290L2pzL0hlbHBlci9Vc2VySW5wdXQudHMiLCJ3d3dyb290L2pzL2hvbWUvaW5kZXgvc3JjL1NlYXJjaENyaXRlcmlhLnRzIiwid3d3cm9vdC9qcy9ob21lL2luZGV4L3NyYy9TZWFyY2hDcml0ZXJpYVZpZXdMb2FkZXIudHMiLCJ3d3dyb290L2pzL2hvbWUvaW5kZXgvc3JjL1NlYXJjaENyaXRlcmlhL0FkVHJhbnNmb3JtYXRpb25TZWFyY2hDcml0ZXJpYS50cyIsInd3d3Jvb3QvanMvaG9tZS9pbmRleC9zcmMvU2VhcmNoQ3JpdGVyaWEvRGVmYXVsdFNlYXJjaENyaXRlcmlhLnRzIiwid3d3cm9vdC9qcy9ob21lL2luZGV4L3NyYy9TZXJ2ZXJDYWxsZXIudHMiLCJ3d3dyb290L2pzL2hvbWUvaW5kZXgvc3JjL2luZGV4LnRzIiwid3d3cm9vdC9qcy9ob21lL25ld0FkL3NyYy9OZXdBZFBhcnRpYWxWaWV3TG9hZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQyxnRUFBK0Q7QUFJaEU7SUEyQkksMkJBQVksV0FBbUIsRUFBRSxhQUF5QjtRQXpCbkQsaUNBQTRCLEdBQWdFLElBQUksaUNBQWUs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QUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUM3RSxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDO0lBQ3ZELENBQUMsRUFBQSw0QkFBNEI7SUFFckIsMERBQXlCLEdBQWpDLFVBQWtDLEtBQWdCLEVBQUUsVUFBa0IsRUFBRSxXQUFtQjtRQUN2RixLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDdkIsQ0FBQyxFQUFBLDBCQUEwQjtJQUMvQiw2QkFBQztBQUFELENBdkNBLEFBdUNDLElBQUE7QUF2Q1ksd0RBQXNCO0FBeUNuQyxvQkFBb0I7QUFDcEI7SUFBQTtJQUVBLENBQUM7SUFBRCxzQ0FBQztBQUFELENBRkEsQUFFQyxJQUFBO0FBRlksMEVBQStCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIu+7v2ltcG9ydCB7IEV2ZW50RGlzcGF0Y2hlciB9IGZyb20gXCIuLi8uLi9FdmVudHMvRXZlbnREaXNwYXRjaGVyXCI7XHJcbmltcG9ydCB7IENhdGVnb3J5IH0gZnJvbSBcIi4uLy4uL01vZGVscy9DYXRlZ29yeVwiO1xyXG5pbXBvcnQgeyBVc2VySW5wdXQgfSBmcm9tIFwiLi4vLi4vSGVscGVyL1VzZXJJbnB1dFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIENhdGVnb3J5U2VsZWN0aW9uIHtcclxuXHJcbiAgICBwdWJsaWMgU2VsZWN0ZWRDYXRlZ29yeUNoYW5nZWRFdmVudDogRXZlbnREaXNwYXRjaGVyPENhdGVnb3J5U2VsZWN0aW9uLCBDYXRlZ29yeUNhaG5nZWRFdmVudEFyZz4gPSBuZXcgRXZlbnREaXNwYXRjaGVyPENhdGVnb3J5U2VsZWN0aW9uLCBDYXRlZ29yeUNhaG5nZWRFdmVudEFyZz4oKTtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IENhdGVnb3J5SWRLZXkgPSBcIkNhdGVnb3J5SWRcIjtcclxuXHJcbiAgICBwcml2YXRlIF9wYXJlbnREaXZJZDogc3RyaW5nOy8vZGl2IGVsZW1lbnQgdGhhdCBob2xkcyBhbGwgQ2F0ZWdvcnlTZWxlY3Rpb24gZWxlbWVudHNcclxuICAgIHByaXZhdGUgX2FsbENhdGVnb3JpZXM6IENhdGVnb3J5W107XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfZmlyc3RMZXZlbFRlbXBsYXRlID0gXCJjYXRlZ29yeTFUZW1wbGF0ZVwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfZmlyc3RMZXZlbERpdiA9IFwiY2F0ZWdvcnkxXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9maXJzdExldmVsU2VsZWN0OiBzdHJpbmcgPSBcInNlbGVjdDFcIjtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9zZWNvbmRMZXZlbFRlbXBsYXRlID0gXCJjYXRlZ29yeTJUZW1wbGF0ZVwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfc2Vjb25kTGV2ZWxEaXYgPSBcImNhdGVnb3J5MlwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfc2Vjb25kTGV2ZWxTZWxlY3Q6IHN0cmluZyA9IFwic2VsZWN0MlwiO1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX3RoaXJkTGV2ZWxUZW1wbGF0ZSA9IFwiY2F0ZWdvcnkzVGVtcGxhdGVcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX3RoaXJkTGV2ZWxEaXYgPSBcImNhdGVnb3J5M1wiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfdGhpcmRMZXZlbFNlbGVjdDogc3RyaW5nID0gXCJzZWxlY3QzXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9yb290Q2F0ZWdvcnlJZDogbnVtYmVyID0gMDtcclxuXHJcbiAgICBwcml2YXRlIF9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbE9uZTogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBfc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUd286IG51bWJlcjtcclxuICAgIHByaXZhdGUgX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVGhyZWU6IG51bWJlcjtcclxuXHJcblxyXG4gICAgY29uc3RydWN0b3IocGFyZW50RGl2SWQ6IHN0cmluZywgYWxsQ2F0ZWdvcmllczogQ2F0ZWdvcnlbXSkge1xyXG4gICAgICAgIHRoaXMuX3BhcmVudERpdklkID0gcGFyZW50RGl2SWQ7XHJcbiAgICAgICAgdGhpcy5fYWxsQ2F0ZWdvcmllcyA9IGFsbENhdGVnb3JpZXM7XHJcbiAgICB9XHJcblxyXG4gICAgXHJcblxyXG4gICAgcHVibGljIFNldENhdGVnb3J5SWQoc2VsZWN0ZWRDYXRlZ29yeUlkOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICBsZXQgZmlyc3RMZXZlbElkOiBudW1iZXI7XHJcbiAgICAgICAgbGV0IHNlY29uZExldmVsSWQ6IG51bWJlcjtcclxuICAgICAgICBsZXQgY2F0ZWdvcnlMZXZlbCA9IHRoaXMuZ2V0Q2F0ZWdvcnlMZXZlbChzZWxlY3RlZENhdGVnb3J5SWQpO1xyXG4gICAgICAgIHN3aXRjaCAoY2F0ZWdvcnlMZXZlbCkge1xyXG4gICAgICAgIGNhc2UgQ2F0ZWdvcnlMZXZlbC5Vbmtvd246XHJcbiAgICAgICAgICAgIHRoaXMuQ3JlYXRlRmlyc3RMZXZlbCgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgQ2F0ZWdvcnlMZXZlbC5MZXZlbDE6XHJcbiAgICAgICAgICAgICAgICB0aGlzLkNyZWF0ZUZpcnN0TGV2ZWwoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0Rmlyc3RMZXZlbFRvU3BlY2lmaWNJZChzZWxlY3RlZENhdGVnb3J5SWQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVTZWNvbmRMZXZlbChzZWxlY3RlZENhdGVnb3J5SWQpO1xyXG4gICAgICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuX2ZpcnN0TGV2ZWxTZWxlY3QpLnRyaWdnZXIoXCJjaGFuZ2VcIik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBDYXRlZ29yeUxldmVsLkxldmVsMjpcclxuICAgICAgICAgICAgICAgIHRoaXMuQ3JlYXRlRmlyc3RMZXZlbCgpO1xyXG4gICAgICAgICAgICAgICAgZmlyc3RMZXZlbElkID0gdGhpcy5fYWxsQ2F0ZWdvcmllcy5maWx0ZXIoY2F0ZWdvcnkgPT4gY2F0ZWdvcnkuQ2F0ZWdvcnlJZCA9PT0gc2VsZWN0ZWRDYXRlZ29yeUlkKVswXVxyXG4gICAgICAgICAgICAgICAgICAgIC5DYXRlZ29yeVBhcmVudElkO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRGaXJzdExldmVsVG9TcGVjaWZpY0lkKGZpcnN0TGV2ZWxJZCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVNlY29uZExldmVsKGZpcnN0TGV2ZWxJZCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFNlY29uZExldmVsVG9TcGVjaWZpY0lkKHNlbGVjdGVkQ2F0ZWdvcnlJZCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVRoaXJkTGV2ZWwoc2VsZWN0ZWRDYXRlZ29yeUlkKTtcclxuICAgICAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLl9zZWNvbmRMZXZlbFNlbGVjdCkudHJpZ2dlcihcImNoYW5nZVwiKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgQ2F0ZWdvcnlMZXZlbC5MZXZlbDM6XHJcbiAgICAgICAgICAgIHRoaXMuQ3JlYXRlRmlyc3RMZXZlbCgpO1xyXG4gICAgICAgICAgICBzZWNvbmRMZXZlbElkID0gdGhpcy5fYWxsQ2F0ZWdvcmllcy5maWx0ZXIoY2F0ZWdvcnkgPT4gY2F0ZWdvcnkuQ2F0ZWdvcnlJZCA9PT0gc2VsZWN0ZWRDYXRlZ29yeUlkKVswXVxyXG4gICAgICAgICAgICAgICAgICAgIC5DYXRlZ29yeVBhcmVudElkO1xyXG4gICAgICAgICAgICBmaXJzdExldmVsSWQgPSB0aGlzLl9hbGxDYXRlZ29yaWVzLmZpbHRlcihjYXRlZ29yeSA9PiBjYXRlZ29yeS5DYXRlZ29yeUlkID09PSBzZWNvbmRMZXZlbElkKVswXVxyXG4gICAgICAgICAgICAgICAgLkNhdGVnb3J5UGFyZW50SWQ7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0Rmlyc3RMZXZlbFRvU3BlY2lmaWNJZChmaXJzdExldmVsSWQpO1xyXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVNlY29uZExldmVsKGZpcnN0TGV2ZWxJZCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0U2Vjb25kTGV2ZWxUb1NwZWNpZmljSWQoc2Vjb25kTGV2ZWxJZCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVRoaXJkTGV2ZWwoc2Vjb25kTGV2ZWxJZCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFRoaXJkTGV2ZWxUb1NwZWNpZmljSWQoc2VsZWN0ZWRDYXRlZ29yeUlkKTtcclxuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuX3RoaXJkTGV2ZWxTZWxlY3QpLnRyaWdnZXIoXCJjaGFuZ2VcIik7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldEZpcnN0TGV2ZWxUb1NwZWNpZmljSWQoY2F0ZWdvcnlJZDogbnVtYmVyKSB7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX2ZpcnN0TGV2ZWxTZWxlY3QpLnZhbChjYXRlZ29yeUlkKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgc2V0U2Vjb25kTGV2ZWxUb1NwZWNpZmljSWQoY2F0ZWdvcnlJZDogbnVtYmVyKSB7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX3NlY29uZExldmVsU2VsZWN0KS52YWwoY2F0ZWdvcnlJZCk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHNldFRoaXJkTGV2ZWxUb1NwZWNpZmljSWQoY2F0ZWdvcnlJZDogbnVtYmVyKSB7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX3RoaXJkTGV2ZWxTZWxlY3QpLnZhbChjYXRlZ29yeUlkKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgZ2V0Q2F0ZWdvcnlMZXZlbChjYXRlZ29yeUlkOiBudW1iZXIpOiBDYXRlZ29yeUxldmVsIHtcclxuXHJcbiAgICAgICAgbGV0IHRlbXBDYXRlZ29yeUFycmF5ID0gdGhpcy5fYWxsQ2F0ZWdvcmllcy5maWx0ZXIoY2F0ZWdvcnkgPT4gY2F0ZWdvcnkuQ2F0ZWdvcnlJZCA9PT0gY2F0ZWdvcnlJZCk7XHJcbiAgICAgICAgbGV0IHRlbXBDYXRlZ29yeTtcclxuICAgICAgICBpZiAodGVtcENhdGVnb3J5QXJyYXkubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBDYXRlZ29yeUxldmVsLlVua293bjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGVtcENhdGVnb3J5ID0gdGVtcENhdGVnb3J5QXJyYXlbMF07XHJcbiAgICAgICAgaWYgKHRlbXBDYXRlZ29yeS5QYXJlbnRDYXRlZ29yeUlkID09PSB0aGlzLl9yb290Q2F0ZWdvcnlJZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gQ2F0ZWdvcnlMZXZlbC5MZXZlbDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRlbXBDYXRlZ29yeSA9IHRoaXMuX2FsbENhdGVnb3JpZXMuZmlsdGVyKGNhdGVnb3J5ID0+IGNhdGVnb3J5LkNhdGVnb3J5SWQgPT09IHRlbXBDYXRlZ29yeS5QYXJlbnRDYXRlZ29yeUlkKVswXTtcclxuICAgICAgICBpZiAodGVtcENhdGVnb3J5LlBhcmVudENhdGVnb3J5SWQgPT09IHRoaXMuX3Jvb3RDYXRlZ29yeUlkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBDYXRlZ29yeUxldmVsLkxldmVsMjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIENhdGVnb3J5TGV2ZWwuTGV2ZWwzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBJbnNlcnRDYXRlZ29yeUlkSW5Vc2VySW5wdXREaWN0aW9uYXJ5KHVzZXJJbnB1dDogVXNlcklucHV0KTogdm9pZCB7XHJcbiAgICAgICAgbGV0IGNhdGVnb3J5SWQgPSB0aGlzLkdldFNlbGVjdGVkQ2F0ZWdvcnlJZCgpO1xyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLkNhdGVnb3J5SWRLZXldID0gY2F0ZWdvcnlJZDsvLzEwMCBmb3IgY2Fyc1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBHZXRTZWxlY3RlZENhdGVnb3J5SWQoKTogbnVtYmVyIHtcclxuICAgICAgICBpZiAodGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUaHJlZSAhPT0gdW5kZWZpbmVkICYmXHJcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVGhyZWUgIT09IHRoaXMuX3Jvb3RDYXRlZ29yeUlkKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUaHJlZTtcclxuICAgICAgICBlbHNlIGlmICh0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFR3byAhPT0gdW5kZWZpbmVkICYmXHJcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVHdvICE9PSB0aGlzLl9yb290Q2F0ZWdvcnlJZClcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVHdvO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsT25lO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBDcmVhdGVGaXJzdExldmVsKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMucmVtb3ZlRWxlbWVudCh0aGlzLl9maXJzdExldmVsRGl2KTtcclxuICAgICAgICB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbE9uZSA9IHRoaXMuX3Jvb3RDYXRlZ29yeUlkO1xyXG4gICAgICAgIHRoaXMucmVtb3ZlRWxlbWVudCh0aGlzLl9zZWNvbmRMZXZlbERpdik7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUd28gPSB0aGlzLl9yb290Q2F0ZWdvcnlJZDtcclxuICAgICAgICB0aGlzLnJlbW92ZUVsZW1lbnQodGhpcy5fdGhpcmRMZXZlbERpdik7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUaHJlZSA9IHRoaXMuX3Jvb3RDYXRlZ29yeUlkO1xyXG5cclxuICAgICAgICBsZXQgdGVtcGxhdGUgPSAkKFwiI1wiICsgdGhpcy5fZmlyc3RMZXZlbFRlbXBsYXRlKS5odG1sKCk7XHJcbiAgICAgICAgbGV0IGNhdGVnb3JpZXM6IENhdGVnb3J5W10gPSBuZXcgQXJyYXk8Q2F0ZWdvcnk+KCk7XHJcbiAgICAgICAgbGV0IGRhdGEgPSB7IGNhdGVnb3JpZXM6IGNhdGVnb3JpZXMgfVxyXG4gICAgICAgIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsT25lID0gdGhpcy5fcm9vdENhdGVnb3J5SWQ7Ly9cclxuICAgICAgICB0aGlzLl9hbGxDYXRlZ29yaWVzLmZvckVhY2goY2F0ZWdvcnkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoY2F0ZWdvcnkuQ2F0ZWdvcnlQYXJlbnRJZCA9PT0gdGhpcy5fcm9vdENhdGVnb3J5SWQpIHtcclxuICAgICAgICAgICAgICAgIGNhdGVnb3JpZXMucHVzaChjYXRlZ29yeSk7XHJcbiAgICAgICAgICAgIH0vL2lmXHJcbiAgICAgICAgfSk7Ly9mb3JFYWNoXHJcblxyXG4gICAgICAgIGxldCBodG1sID0gTXVzdGFjaGUudG9faHRtbCh0ZW1wbGF0ZSwgZGF0YSk7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX3BhcmVudERpdklkKS5hcHBlbmQoaHRtbCk7XHJcblxyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9maXJzdExldmVsU2VsZWN0KS5jaGFuZ2UoKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBzZWxlY3RlZElkID0gcGFyc2VJbnQoJChldmVudC5jdXJyZW50VGFyZ2V0KS52YWwoKS50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxPbmUgPSBzZWxlY3RlZElkO1xyXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVNlY29uZExldmVsKHNlbGVjdGVkSWQpO1xyXG4gICAgICAgICAgICBsZXQgZXZlbnRBcmcgPSBuZXcgQ2F0ZWdvcnlDYWhuZ2VkRXZlbnRBcmcoKTtcclxuICAgICAgICAgICAgZXZlbnRBcmcuU2VsZWN0ZWRDYXRlZ29yeUlkID0gdGhpcy5HZXRTZWxlY3RlZENhdGVnb3J5SWQoKTtcclxuICAgICAgICAgICAgZXZlbnRBcmcuU2VsZWN0ZWRDYXRlZ29yeUhhc0NoaWxkID0gdGhpcy5zZWxlY3RlZENhdGVnb3J5SGFzQ2hpbGRyZW4oKTtcclxuICAgICAgICAgICAgdGhpcy5TZWxlY3RlZENhdGVnb3J5Q2hhbmdlZEV2ZW50LkRpc3BhdGNoKHRoaXMsIGV2ZW50QXJnKTtcclxuICAgICAgICB9KTsvL2NoYW5nZVxyXG4gICAgfS8vQ3JlYXRlRmlyc3RMZXZlbFxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlU2Vjb25kTGV2ZWwoZmlyc3RMZXZlbENhdGVnb3J5SWQ6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMucmVtb3ZlRWxlbWVudCh0aGlzLl9zZWNvbmRMZXZlbERpdik7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUd28gPSB0aGlzLl9yb290Q2F0ZWdvcnlJZDtcclxuICAgICAgICB0aGlzLnJlbW92ZUVsZW1lbnQodGhpcy5fdGhpcmRMZXZlbERpdik7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUaHJlZSA9IHRoaXMuX3Jvb3RDYXRlZ29yeUlkO1xyXG4gICAgICAgIGlmIChmaXJzdExldmVsQ2F0ZWdvcnlJZCA9PT0gdGhpcy5fcm9vdENhdGVnb3J5SWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHRlbXBsYXRlID0gJChcIiNcIiArIHRoaXMuX3NlY29uZExldmVsVGVtcGxhdGUpLmh0bWwoKTtcclxuICAgICAgICBsZXQgY2F0ZWdvcmllczogQ2F0ZWdvcnlbXSA9IG5ldyBBcnJheTxDYXRlZ29yeT4oKTtcclxuICAgICAgICBsZXQgZGF0YSA9IHsgY2F0ZWdvcmllczogY2F0ZWdvcmllcyB9XHJcblxyXG4gICAgICAgIHRoaXMuX2FsbENhdGVnb3JpZXMuZm9yRWFjaChjYXRlZ29yeSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChjYXRlZ29yeS5DYXRlZ29yeVBhcmVudElkID09PSBmaXJzdExldmVsQ2F0ZWdvcnlJZCkge1xyXG4gICAgICAgICAgICAgICAgY2F0ZWdvcmllcy5wdXNoKGNhdGVnb3J5KTtcclxuICAgICAgICAgICAgfS8vaWZcclxuICAgICAgICB9KTsvL2ZvckVhY2hcclxuXHJcbiAgICAgICAgbGV0IGh0bWwgPSBNdXN0YWNoZS50b19odG1sKHRlbXBsYXRlLCBkYXRhKTtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fcGFyZW50RGl2SWQpLmFwcGVuZChodG1sKTtcclxuXHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX3NlY29uZExldmVsU2VsZWN0KS5jaGFuZ2UoKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBzZWxlY3RlZElkID0gcGFyc2VJbnQoJChldmVudC5jdXJyZW50VGFyZ2V0KS52YWwoKS50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUd28gPSBzZWxlY3RlZElkO1xyXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVRoaXJkTGV2ZWwoc2VsZWN0ZWRJZCk7XHJcbiAgICAgICAgICAgIGxldCBldmVudEFyZyA9IG5ldyBDYXRlZ29yeUNhaG5nZWRFdmVudEFyZygpO1xyXG4gICAgICAgICAgICBldmVudEFyZy5TZWxlY3RlZENhdGVnb3J5SWQgPSB0aGlzLkdldFNlbGVjdGVkQ2F0ZWdvcnlJZCgpO1xyXG4gICAgICAgICAgICBldmVudEFyZy5TZWxlY3RlZENhdGVnb3J5SGFzQ2hpbGQgPSB0aGlzLnNlbGVjdGVkQ2F0ZWdvcnlIYXNDaGlsZHJlbigpO1xyXG4gICAgICAgICAgICB0aGlzLlNlbGVjdGVkQ2F0ZWdvcnlDaGFuZ2VkRXZlbnQuRGlzcGF0Y2godGhpcywgZXZlbnRBcmcpO1xyXG4gICAgICAgIH0pOy8vY2hhbmdlXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVUaGlyZExldmVsKHNlY29uZExldmVsQ2F0ZWdvcnlJZDogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVFbGVtZW50KHRoaXMuX3RoaXJkTGV2ZWxEaXYpO1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVGhyZWUgPSB0aGlzLl9yb290Q2F0ZWdvcnlJZDtcclxuXHJcbiAgICAgICAgaWYgKHNlY29uZExldmVsQ2F0ZWdvcnlJZCA9PT0gdGhpcy5fcm9vdENhdGVnb3J5SWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHRlbXBsYXRlID0gJChcIiNcIiArIHRoaXMuX3RoaXJkTGV2ZWxUZW1wbGF0ZSkuaHRtbCgpO1xyXG4gICAgICAgIGxldCBjYXRlZ29yaWVzOiBDYXRlZ29yeVtdID0gbmV3IEFycmF5PENhdGVnb3J5PigpO1xyXG4gICAgICAgIGxldCBkYXRhID0geyBjYXRlZ29yaWVzOiBjYXRlZ29yaWVzIH1cclxuXHJcbiAgICAgICAgdGhpcy5fYWxsQ2F0ZWdvcmllcy5mb3JFYWNoKGNhdGVnb3J5ID0+IHtcclxuICAgICAgICAgICAgaWYgKGNhdGVnb3J5LkNhdGVnb3J5UGFyZW50SWQgPT09IHNlY29uZExldmVsQ2F0ZWdvcnlJZCkge1xyXG4gICAgICAgICAgICAgICAgY2F0ZWdvcmllcy5wdXNoKGNhdGVnb3J5KTtcclxuICAgICAgICAgICAgfS8vaWZcclxuICAgICAgICB9KTsvL2ZvckVhY2hcclxuICAgICAgICBpZiAoY2F0ZWdvcmllcy5sZW5ndGggPT09IDApIHsvL05vIEl0ZW0gaW4gdGhpcmQgbGV2ZWwgY2F0ZWdvcnlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgaHRtbCA9IE11c3RhY2hlLnRvX2h0bWwodGVtcGxhdGUsIGRhdGEpO1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9wYXJlbnREaXZJZCkuYXBwZW5kKGh0bWwpO1xyXG5cclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fdGhpcmRMZXZlbFNlbGVjdCkuY2hhbmdlKChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFRocmVlID0gcGFyc2VJbnQoJChldmVudC5jdXJyZW50VGFyZ2V0KS52YWwoKS50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgbGV0IGV2ZW50QXJnID0gbmV3IENhdGVnb3J5Q2FobmdlZEV2ZW50QXJnKCk7XHJcbiAgICAgICAgICAgIGV2ZW50QXJnLlNlbGVjdGVkQ2F0ZWdvcnlJZCA9IHRoaXMuR2V0U2VsZWN0ZWRDYXRlZ29yeUlkKCk7XHJcbiAgICAgICAgICAgIGV2ZW50QXJnLlNlbGVjdGVkQ2F0ZWdvcnlIYXNDaGlsZCA9IHRoaXMuc2VsZWN0ZWRDYXRlZ29yeUhhc0NoaWxkcmVuKCk7XHJcbiAgICAgICAgICAgIHRoaXMuU2VsZWN0ZWRDYXRlZ29yeUNoYW5nZWRFdmVudC5EaXNwYXRjaCh0aGlzLCBldmVudEFyZyk7XHJcbiAgICAgICAgfSk7Ly9jaGFuZ2VcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNlbGVjdGVkQ2F0ZWdvcnlIYXNDaGlsZHJlbigpOiBib29sZWFuIHtcclxuICAgICAgICBsZXQgc2VsZWN0ZWRDYXRlZ29yeUlkID0gdGhpcy5HZXRTZWxlY3RlZENhdGVnb3J5SWQoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fYWxsQ2F0ZWdvcmllcy5maWx0ZXJcclxuICAgICAgICAgICAgKChjYXRlZ29yeSkgPT4geyByZXR1cm4gY2F0ZWdvcnkuQ2F0ZWdvcnlQYXJlbnRJZCA9PT0gc2VsZWN0ZWRDYXRlZ29yeUlkIH0pLmxlbmd0aCA+IDA7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZW1vdmVFbGVtZW50KGlkOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICAkKFwiI1wiICsgaWQpLnJlbW92ZSgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ2F0ZWdvcnlDYWhuZ2VkRXZlbnRBcmcge1xyXG4gICAgcHVibGljIFNlbGVjdGVkQ2F0ZWdvcnlJZDogbnVtYmVyO1xyXG4gICAgcHVibGljIFNlbGVjdGVkQ2F0ZWdvcnlIYXNDaGlsZDogYm9vbGVhbjtcclxufVxyXG5cclxuZW51bSBDYXRlZ29yeUxldmVsIHtcclxuICAgIExldmVsMSA9IDEsXHJcbiAgICBMZXZlbDIgPSAyLFxyXG4gICAgTGV2ZWwzID0gMyxcclxuICAgIFVua293bj00XHJcbn1cclxuXHJcbiIsIu+7v2ltcG9ydCB7SUNyaXRlcmlhLCBDcml0ZXJpYVZhbGlkYXRvciB9IGZyb20gXCIuLi8uLi9IZWxwZXIvSUNyaXRlcmlhXCI7XHJcbmltcG9ydCB7VXNlcklucHV0fSBmcm9tIFwiLi4vLi4vSGVscGVyL1VzZXJJbnB1dFwiO1xyXG5pbXBvcnQge0lDcml0ZXJpYUNoYW5nZX0gZnJvbSBcIi4uLy4uL0hlbHBlci9JQ3JpdGVyaWFDaGFuZ2VcIjtcclxuaW1wb3J0IHtQcmljZVR5cGV9IGZyb20gXCIuLi9QcmljZVR5cGUvRGVmYXVsdFByaWNlVHlwZVwiO1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBEZWZhdWx0T3JkZXJCeSBpbXBsZW1lbnRzIElDcml0ZXJpYSAge1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBPcmRlckJ5S2V5ID0gXCJPcmRlckJ5XCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IE9yZGVyQnlTZWxlY3RJZCA9IFwib3JkZXJCeVwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBPcmRlckJ5RGl2SWQgPSBcIm9yZGVyQnlEaXZcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgT3JkZXJCeUZpeGVkUHJpY2VUZW1wbGF0ZUlkID0gXCJvcmRlckJ5Rml4ZWRQcmljZVRlbXBsYXRlXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IE9yZGVyQnlPZGVyc1RlbXBsYXRlSWQgPSBcIm9yZGVyQnlPZGVyc1RlbXBsYXRlXCI7XHJcbiAgICBcclxuICAgIHByaXZhdGUgX3NlYXJjaENyaXRlcmlhQ2hhbmdlOiBJQ3JpdGVyaWFDaGFuZ2U7XHJcbiAgICBcclxuICAgIEJpbmRFdmVudHMoY3JpdGVyaWFDaGFuZ2U6IElDcml0ZXJpYUNoYW5nZSk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX3NlYXJjaENyaXRlcmlhQ2hhbmdlID0gY3JpdGVyaWFDaGFuZ2U7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuT3JkZXJCeVNlbGVjdElkKS5vbihcImNoYW5nZVwiLFxyXG4gICAgICAgICAgICAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NlYXJjaENyaXRlcmlhQ2hhbmdlLkN1c3RvbUNyaXRlcmlhQ2hhbmdlZCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBVbkJpbmRFdmVudHMoKTogdm9pZCB7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuT3JkZXJCeVNlbGVjdElkKS5vZmYoXCJjaGFuZ2VcIik7XHJcbiAgICB9XHJcblxyXG4gICAgVmFsaWRhdGVDcml0ZXJpYSgpOiBDcml0ZXJpYVZhbGlkYXRvciB7IHRocm93IG5ldyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZFwiKTsgfVxyXG5cclxuICAgIEZpbGxDcml0ZXJpYSh1c2VySW5wdXQ6IFVzZXJJbnB1dCk6IHZvaWQge1xyXG5cclxuICAgICAgICBsZXQgb3JkZXJCeSA9ICQoXCIjXCIgKyB0aGlzLk9yZGVyQnlTZWxlY3RJZCkudmFsKCkudG9TdHJpbmcoKTtcclxuICAgICAgICB1c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnlbdGhpcy5PcmRlckJ5S2V5XSA9IG9yZGVyQnk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIFByaWNlVHlwZUNoYW5nZWQoc2VuZGVyOm9iamVjdCxhcmdzOlByaWNlVHlwZSk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuVW5CaW5kRXZlbnRzKCk7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuT3JkZXJCeURpdklkKS5jaGlsZHJlbigpLnJlbW92ZSgpO1xyXG4gICAgICAgIGlmIChhcmdzID09PSBQcmljZVR5cGUuRml4ZWQpIHtcclxuICAgICAgICAgICAgdmFyIHRlbXBsYXRlID0gJChcIiNcIit0aGlzLk9yZGVyQnlGaXhlZFByaWNlVGVtcGxhdGVJZCkuaHRtbCgpO1xyXG4gICAgICAgICAgICB2YXIgaHRtbCA9IE11c3RhY2hlLnRvX2h0bWwodGVtcGxhdGUsIG51bGwpO1xyXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5PcmRlckJ5RGl2SWQpLmFwcGVuZChodG1sKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgdmFyIHRlbXBsYXRlID0gJChcIiNcIiArIHRoaXMuT3JkZXJCeU9kZXJzVGVtcGxhdGVJZCkuaHRtbCgpO1xyXG4gICAgICAgICAgICB2YXIgaHRtbCA9IE11c3RhY2hlLnRvX2h0bWwodGVtcGxhdGUsIG51bGwpO1xyXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5PcmRlckJ5RGl2SWQpLmFwcGVuZChodG1sKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5CaW5kRXZlbnRzKHRoaXMuX3NlYXJjaENyaXRlcmlhQ2hhbmdlKTtcclxuICAgIH1cclxuXHJcbiAgIFxyXG59Iiwi77u/aW1wb3J0IHsgSUNyaXRlcmlhLCBDcml0ZXJpYVZhbGlkYXRvciB9IGZyb20gXCIuLi8uLi9IZWxwZXIvSUNyaXRlcmlhXCI7XHJcbmltcG9ydCB7IFVzZXJJbnB1dCB9IGZyb20gXCIuLi8uLi9IZWxwZXIvVXNlcklucHV0XCI7XHJcbmltcG9ydCB7IElDcml0ZXJpYUNoYW5nZSB9IGZyb20gXCIuLi8uLi9IZWxwZXIvSUNyaXRlcmlhQ2hhbmdlXCI7XHJcbmltcG9ydCB7RXZlbnREaXNwYXRjaGVyfSBmcm9tIFwiLi4vLi4vRXZlbnRzL0V2ZW50RGlzcGF0Y2hlclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIERlZmF1bHRQcmljZVR5cGUgaW1wbGVtZW50cyBJQ3JpdGVyaWEge1xyXG5cclxuICAgIHB1YmxpYyBTZWxlY3RlZFByaWNlVHlwZUNoYW5nZWRFdmVudDogRXZlbnREaXNwYXRjaGVyPERlZmF1bHRQcmljZVR5cGUsIFByaWNlVHlwZT4gPVxyXG4gICAgICAgIG5ldyBFdmVudERpc3BhdGNoZXI8RGVmYXVsdFByaWNlVHlwZSwgUHJpY2VUeXBlPigpO1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgUHJpY2VUeXBlS2V5ID0gXCJQcmljZVR5cGVcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgUHJpY2VUeXBlU2VsZWN0SWQgPSBcInByaWNlVHlwZVwiO1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgRml4UHJpY2VEaXZJZCA9XCJmaXhlZFByaWNlXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IE1pbmltdW1QcmljZUtleSA9IFwiTWluaW11bVByaWNlXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9taW5QcmljZUlucHV0SWQgPSBcIm1pblByaWNlXCI7XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBNYXhpbXVtUHJpY2VLZXkgPSBcIk1heGltdW1QcmljZVwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfbWF4UHJpY2VJbnB1dElkID0gXCJtYXhQcmljZVwiO1xyXG4gICAgXHJcbiAgICBwcml2YXRlIF9zZWFyY2hDcml0ZXJpYUNoYW5nZTogSUNyaXRlcmlhQ2hhbmdlO1xyXG5cclxuICAgIHB1YmxpYyBCaW5kRXZlbnRzKGNyaXRlcmlhQ2hhbmdlOiBJQ3JpdGVyaWFDaGFuZ2UpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9zZWFyY2hDcml0ZXJpYUNoYW5nZSA9IGNyaXRlcmlhQ2hhbmdlO1xyXG4gICAgICAgIC8veW91IGNhbiBhbHNvIHVzZXIgXCJpbnB1dFwiIGluc3RlYWQgb2YgXCJjaGFuZ2VcIlxyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9taW5QcmljZUlucHV0SWQpLm9uKFwiY2hhbmdlXCIsXHJcbiAgICAgICAgICAgIChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2VhcmNoQ3JpdGVyaWFDaGFuZ2UuQ3VzdG9tQ3JpdGVyaWFDaGFuZ2VkKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9tYXhQcmljZUlucHV0SWQpLm9uKFwiY2hhbmdlXCIsXHJcbiAgICAgICAgICAgIChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2VhcmNoQ3JpdGVyaWFDaGFuZ2UuQ3VzdG9tQ3JpdGVyaWFDaGFuZ2VkKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLlByaWNlVHlwZVNlbGVjdElkKS5vbihcImNoYW5nZVwiLCAoZXZlbnQpPT4ge1xyXG4gICAgICAgICAgICBsZXQgc2VsZWN0ZWRQcmljZVR5cGUgPSB0aGlzLmdldFByaWNlVHlwZSgkKGV2ZW50LmN1cnJlbnRUYXJnZXQpLnZhbCgpLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICBpZiAoc2VsZWN0ZWRQcmljZVR5cGUgPT09IFByaWNlVHlwZS5GaXhlZCkge1xyXG4gICAgICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuRml4UHJpY2VEaXZJZCkuc2hvdygpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuRml4UHJpY2VEaXZJZCkuaGlkZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuU2VsZWN0ZWRQcmljZVR5cGVDaGFuZ2VkRXZlbnQuRGlzcGF0Y2godGhpcywgc2VsZWN0ZWRQcmljZVR5cGUpO1xyXG4gICAgICAgICAgICB0aGlzLl9zZWFyY2hDcml0ZXJpYUNoYW5nZS5DdXN0b21Dcml0ZXJpYUNoYW5nZWQoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldFByaWNlVHlwZShzdHJpbmdQcmljZVR5cGU6IHN0cmluZyk6IFByaWNlVHlwZSB7XHJcbiAgICAgICAgcmV0dXJuIHBhcnNlSW50KHN0cmluZ1ByaWNlVHlwZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIFVuQmluZEV2ZW50cygpOiB2b2lkIHtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fbWluUHJpY2VJbnB1dElkKS5vZmYoXCJjaGFuZ2VcIik7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX21heFByaWNlSW5wdXRJZCkub2ZmKFwiY2hhbmdlXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBWYWxpZGF0ZUNyaXRlcmlhKCk6IENyaXRlcmlhVmFsaWRhdG9yIHsgdGhyb3cgbmV3IEVycm9yKFwiTm90IGltcGxlbWVudGVkXCIpOyB9XHJcblxyXG4gICAgcHVibGljIEZpbGxDcml0ZXJpYSh1c2VySW5wdXQ6IFVzZXJJbnB1dCk6IHZvaWQge1xyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLlByaWNlVHlwZUtleV0gPSAkKFwiI1wiICsgdGhpcy5QcmljZVR5cGVTZWxlY3RJZCkudmFsKCkudG9TdHJpbmcoKTtcclxuXHJcbiAgICAgICAgaWYgKHBhcnNlSW50KCQoXCIjXCIgKyB0aGlzLlByaWNlVHlwZVNlbGVjdElkKS52YWwoKS50b1N0cmluZygpKSA9PT0gUHJpY2VUeXBlLkZpeGVkKSB7XHJcbiAgICAgICAgICAgIGxldCBtaW5QcmljZSA9IHBhcnNlSW50KCQoXCIjXCIgKyB0aGlzLl9taW5QcmljZUlucHV0SWQpLnZhbCgpLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICB1c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnlbdGhpcy5NaW5pbXVtUHJpY2VLZXldID0gbWluUHJpY2U7XHJcblxyXG4gICAgICAgICAgICBsZXQgbWF4UHJpY2UgPSBwYXJzZUludCgkKFwiI1wiICsgdGhpcy5fbWF4UHJpY2VJbnB1dElkKS52YWwoKS50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuTWF4aW11bVByaWNlS2V5XSA9IG1heFByaWNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGVudW0gUHJpY2VUeXBlIHtcclxuICAgIEZpeGVkID0gMSxcclxuICAgIEFncmVlbWVudCA9IDIsXHJcbiAgICBFeGNoYW5nZSA9IDMsXHJcbiAgICBJbnN0YWxsbWVudCA9IDQsXHJcbiAgICBNb3J0Z2FnZUFuZFJlbnQgPSA1XHJcbn0iLCLvu79pbXBvcnQge0Nhck1vZGVsfSBmcm9tIFwiLi4vLi4vTW9kZWxzL0FkVHJhbnNwb3J0YXRpb24vQ2FyTW9kZWxcIjtcclxuaW1wb3J0IHtVc2VySW5wdXR9IGZyb20gXCIuLi8uLi9IZWxwZXIvVXNlcklucHV0XCI7XHJcbmltcG9ydCB7SUNyaXRlcmlhLENyaXRlcmlhVmFsaWRhdG9yfSBmcm9tIFwiLi4vLi4vSGVscGVyL0lDcml0ZXJpYVwiO1xyXG5pbXBvcnQge0lDcml0ZXJpYUNoYW5nZX0gZnJvbSBcIi4uLy4uL0hlbHBlci9JQ3JpdGVyaWFDaGFuZ2VcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDYXJNb2RlbEJyYW5kQ29udHJvbGxlciBpbXBsZW1lbnRzIElDcml0ZXJpYSB7XHJcbiAgICBWYWxpZGF0ZUNyaXRlcmlhKCk6IENyaXRlcmlhVmFsaWRhdG9yIHsgdGhyb3cgbmV3IEVycm9yKFwiTm90IGltcGxlbWVudGVkXCIpOyB9XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBDYXJCcmFuZElkS2V5OiBzdHJpbmcgPSBcIkJyYW5kSWRcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgQnJhbmRTZWxlY3RJZDogc3RyaW5nID0gXCJicmFuZFwiO1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgQ2FyTW9kZWxUZW1wbGF0ZUlkOiBzdHJpbmcgPSBcIm1vZGVsVGVtcGxhdGVcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgQ2FyTW9kZWxEaXZQbGFjZUhvbGRlcklkOiBzdHJpbmcgPSBcIm1vZGVsUGxhY2VIb2xkZXJcIjtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IENhck1vZGVsSWRLZXk6IHN0cmluZyA9IFwiQ2FyTW9kZWxJZFwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBBbGxDYXJNb2RlbHNJbnB1dElkOiBzdHJpbmcgPSBcImFsbENhck1vZGVsc1wiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBNb2RlbFNlbGVjdElkOiBzdHJpbmcgPSBcIm1vZGVsXCI7XHJcbiAgICBwcml2YXRlIF9hbGxDYXJNb2RlbHM6IENhck1vZGVsW107XHJcblxyXG4gICAgcHJpdmF0ZSBfc2VhcmNoQ3JpdGVyaWFDaGFuZ2U6SUNyaXRlcmlhQ2hhbmdlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuaW5pdFZpZXcoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXRWaWV3KCk6IHZvaWQge1xyXG4gICAgICAgIGxldCBhbGxDYXJNb2RlbHNTdHJpbmcgPSAkKFwiI1wiICsgdGhpcy5BbGxDYXJNb2RlbHNJbnB1dElkKS52YWwoKS50b1N0cmluZygpO1xyXG4gICAgICAgIHRoaXMuX2FsbENhck1vZGVscyA9ICQucGFyc2VKU09OKGFsbENhck1vZGVsc1N0cmluZykgYXMgQ2FyTW9kZWxbXTtcclxuICAgICAgICB0aGlzLmluaXRDYXJNb2RlbCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaW5pdENhck1vZGVsKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuY3JlYXRlQ2FyTW9kZWxFbGVtZW50KG5ldyBBcnJheTxDYXJNb2RlbD4oKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVDYXJNb2RlbEVsZW1lbnQoY2FyTW9kZWxzOiBDYXJNb2RlbFtdKSB7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuQ2FyTW9kZWxEaXZQbGFjZUhvbGRlcklkKS5jaGlsZHJlbigpLnJlbW92ZSgpO1xyXG4gICAgICAgIGxldCB0ZW1wbGF0ZSA9ICQoXCIjXCIgKyB0aGlzLkNhck1vZGVsVGVtcGxhdGVJZCkuaHRtbCgpO1xyXG4gICAgICAgIGxldCBkYXRhID0geyBjYXJNb2RlbHM6IGNhck1vZGVscyB9XHJcbiAgICAgICAgbGV0IGh0bWwgPSBNdXN0YWNoZS50b19odG1sKHRlbXBsYXRlLCBkYXRhKTtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5DYXJNb2RlbERpdlBsYWNlSG9sZGVySWQpLmFwcGVuZChodG1sKTtcclxuICAgICAgICB0aGlzLmJpbmRDYXJNb2RlbCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYmluZENhck1vZGVsKCk6IHZvaWQge1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLk1vZGVsU2VsZWN0SWQpLm9uKFwiY2hhbmdlXCIsKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zZWFyY2hDcml0ZXJpYUNoYW5nZS5DdXN0b21Dcml0ZXJpYUNoYW5nZWQoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1cGRhdGVDYXJNb2RlbFNlbGVjdChicmFuZElkOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICBsZXQgY2FyTW9kZWxzID0gbmV3IEFycmF5PENhck1vZGVsPigpO1xyXG4gICAgICAgIGlmIChicmFuZElkICE9PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2FsbENhck1vZGVscy5mb3JFYWNoKChjYXJNb2RlbCwgaW5kZXgsIGFycmF5KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2FyTW9kZWwuQnJhbmRJZCA9PT0gYnJhbmRJZClcclxuICAgICAgICAgICAgICAgICAgICBjYXJNb2RlbHMucHVzaChjYXJNb2RlbCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNyZWF0ZUNhck1vZGVsRWxlbWVudChjYXJNb2RlbHMpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBGaWxsQ3JpdGVyaWEodXNlcklucHV0OlVzZXJJbnB1dCk6dm9pZCB7XHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuQ2FyQnJhbmRJZEtleV0gPVxyXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5CcmFuZFNlbGVjdElkKS5maW5kKFwib3B0aW9uOnNlbGVjdGVkXCIpLnZhbCgpOy8vYnJhbmRJZFxyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLkNhck1vZGVsSWRLZXldID1cclxuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuTW9kZWxTZWxlY3RJZCkuZmluZChcIm9wdGlvbjpzZWxlY3RlZFwiKS52YWwoKTsvL2Nhck1vZGVsSWRcclxuICAgIH1cclxuXHJcbiAgICBCaW5kRXZlbnRzKGNyaXRlcmlhQ2hhbmdlOiBJQ3JpdGVyaWFDaGFuZ2UpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9zZWFyY2hDcml0ZXJpYUNoYW5nZSA9IGNyaXRlcmlhQ2hhbmdlO1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLkJyYW5kU2VsZWN0SWQpLm9uKFwiY2hhbmdlXCIsIChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgc2VsZWN0ZWRCcmFuZElkOiBudW1iZXIgPSBwYXJzZUludCgkKGV2ZW50LmN1cnJlbnRUYXJnZXQpLmZpbmQoXCJvcHRpb246c2VsZWN0ZWRcIikudmFsKCkudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQ2FyTW9kZWxTZWxlY3Qoc2VsZWN0ZWRCcmFuZElkKTtcclxuICAgICAgICAgICAgY3JpdGVyaWFDaGFuZ2UuQ3VzdG9tQ3JpdGVyaWFDaGFuZ2VkKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuYmluZENhck1vZGVsKCk7XHJcbiAgICB9XHJcblxyXG4gICAgVW5CaW5kRXZlbnRzKCk6IHZvaWQge1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLkJyYW5kU2VsZWN0SWQpLm9mZihcImNoYW5nZVwiKTtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5Nb2RlbFNlbGVjdElkKS5vZmYoXCJjaGFuZ2VcIik7XHJcbiAgICB9XHJcbn0iLCLvu79pbXBvcnQge0lFdmVudH0gIGZyb20gXCIuL0lFdmVudFwiO1xyXG5cclxuXHJcbi8qIFRoZSBkaXNwYXRjaGVyIGhhbmRsZXMgdGhlIHN0b3JhZ2Ugb2Ygc3Vic2NpcHRpb25zIGFuZCBmYWNpbGl0YXRlc1xyXG4gIHN1YnNjcmlwdGlvbiwgdW5zdWJzY3JpcHRpb24gYW5kIGRpc3BhdGNoaW5nIG9mIHRoZSBldmVudCAqL1xyXG5leHBvcnQgIGNsYXNzIEV2ZW50RGlzcGF0Y2hlcjxUU2VuZGVyLCBUQXJncz4gaW1wbGVtZW50cyBJRXZlbnQ8VFNlbmRlciwgVEFyZ3M+IHtcclxuXHJcbiAgICBwcml2YXRlIF9zdWJzY3JpcHRpb25zOiBBcnJheTwoc2VuZGVyOiBUU2VuZGVyLCBhcmdzOiBUQXJncykgPT4gdm9pZD4gPSBuZXcgQXJyYXk8KHNlbmRlcjogVFNlbmRlciwgYXJnczogVEFyZ3MpID0+IHZvaWQ+KCk7XHJcblxyXG4gICAgcHVibGljIFN1YnNjcmliZShmbjogKHNlbmRlcjogVFNlbmRlciwgYXJnczogVEFyZ3MpID0+IHZvaWQpOiB2b2lkIHtcclxuICAgICAgICBpZiAoZm4pIHtcclxuICAgICAgICAgICAgdGhpcy5fc3Vic2NyaXB0aW9ucy5wdXNoKGZuKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljICBVbnN1YnNjcmliZShmbjogKHNlbmRlcjogVFNlbmRlciwgYXJnczogVEFyZ3MpID0+IHZvaWQpOiB2b2lkIHtcclxuICAgICAgICBsZXQgaSA9IHRoaXMuX3N1YnNjcmlwdGlvbnMuaW5kZXhPZihmbik7XHJcbiAgICAgICAgaWYgKGkgPiAtMSkge1xyXG4gICAgICAgICAgICB0aGlzLl9zdWJzY3JpcHRpb25zLnNwbGljZShpLCAxKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljICBEaXNwYXRjaChzZW5kZXI6IFRTZW5kZXIsIGFyZ3M6IFRBcmdzKTogdm9pZCB7XHJcbiAgICAgICAgZm9yIChsZXQgaGFuZGxlciBvZiB0aGlzLl9zdWJzY3JpcHRpb25zKSB7XHJcbiAgICAgICAgICAgIGhhbmRsZXIoc2VuZGVyLCBhcmdzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCLvu79pbXBvcnQgeyBJQ3JpdGVyaWF9IGZyb20gXCIuL0lDcml0ZXJpYVwiO1xyXG5pbXBvcnQgeyBOdW1lcmljRGljdGlvbmFyeSB9IGZyb20gXCJsb2Rhc2gvaW5kZXhcIjtcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgQ3JpdGVyaWFOdW1lcmljRGljdGlvbmFyeSBpbXBsZW1lbnRzIE51bWVyaWNEaWN0aW9uYXJ5PElDcml0ZXJpYT4ge1xyXG4gICAgW2luZGV4OiBudW1iZXJdOiBJQ3JpdGVyaWE7XHJcbn0iLCLvu79pbnRlcmZhY2UgTG9vc2VPYmplY3Qge1xyXG4gICAgW2tleTogc3RyaW5nXTogYW55XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBVc2VySW5wdXQge1xyXG4gICAgcHVibGljIFBhcmFtZXRlcnNEaWN0aW9uYXJ5OiBMb29zZU9iamVjdCA9IHt9O1xyXG59XHJcblxyXG5cclxuXHJcbiIsIu+7v2ltcG9ydCB7QWRUcmFuc2Zvcm1hdGlvblNlYXJjaENyaXRlcmlhfSBmcm9tIFwiLi9TZWFyY2hDcml0ZXJpYS9BZFRyYW5zZm9ybWF0aW9uU2VhcmNoQ3JpdGVyaWFcIjtcclxuaW1wb3J0IHtEZWZhdWx0U2VhcmNoQ3JpdGVyaWF9IGZyb20gXCIuL1NlYXJjaENyaXRlcmlhL0RlZmF1bHRTZWFyY2hDcml0ZXJpYVwiO1xyXG5pbXBvcnQge0lDcml0ZXJpYX0gZnJvbSBcIi4uLy4uLy4uL0hlbHBlci9JQ3JpdGVyaWFcIjtcclxuaW1wb3J0IHtVc2VySW5wdXR9IGZyb20gXCIuLi8uLi8uLi9IZWxwZXIvVXNlcklucHV0XCI7XHJcbmltcG9ydCB7SUNyaXRlcmlhQ2hhbmdlfSBmcm9tIFwiLi4vLi4vLi4vSGVscGVyL0lDcml0ZXJpYUNoYW5nZVwiO1xyXG5pbXBvcnQge0NyaXRlcmlhTnVtZXJpY0RpY3Rpb25hcnl9IGZyb20gXCIuLi8uLi8uLi9IZWxwZXIvQ3JpdGVyaWFOdW1lcmljRGljdGlvbmFyeVwiO1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBTZWFyY2hDcml0ZXJpYSB7XHJcbiAgICBwcml2YXRlIF9zZWFyY2hDcml0ZXJpYUlvY0NvbnRhaW5lcjogQ3JpdGVyaWFOdW1lcmljRGljdGlvbmFyeSA7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLl9zZWFyY2hDcml0ZXJpYUlvY0NvbnRhaW5lciA9IG5ldyBDcml0ZXJpYU51bWVyaWNEaWN0aW9uYXJ5KCk7XHJcbiAgICAgICAgdGhpcy5pbml0U2VhcmNoQ3JpdGVyaWFJb2NDb250YWluZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXRTZWFyY2hDcml0ZXJpYUlvY0NvbnRhaW5lcigpIHtcclxuICAgICAgICB0aGlzLl9zZWFyY2hDcml0ZXJpYUlvY0NvbnRhaW5lclswXSA9IG5ldyBEZWZhdWx0U2VhcmNoQ3JpdGVyaWEoKTtcclxuICAgICAgICB0aGlzLl9zZWFyY2hDcml0ZXJpYUlvY0NvbnRhaW5lclsxMDBdID0gbmV3IEFkVHJhbnNmb3JtYXRpb25TZWFyY2hDcml0ZXJpYSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBGaWxsQ2F0ZWdvcnlTcGVjaWZpY1NlYXJjaENyaXRlcmlhKGNhdGVnb3J5SWQ6IG51bWJlciwgdXNlcklucHV0OiBVc2VySW5wdXQpOiB2b2lkIHtcclxuICAgICAgICBsZXQgc2VhcmNoQ3JpdGVyaWEgPSB0aGlzLnBvbHltb3JwaGljRGlzcGF0Y2hTZWFyY2hDcml0ZXJpYShjYXRlZ29yeUlkKTtcclxuICAgICAgICBzZWFyY2hDcml0ZXJpYS5GaWxsQ3JpdGVyaWEodXNlcklucHV0KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgQmluZChjYXRlZ29yeUlkOiBudW1iZXIsIHNlYXJjaENyaXRlcmlhQ2hhbmdlOiBJQ3JpdGVyaWFDaGFuZ2UpIHtcclxuICAgICAgICBsZXQgc2VhcmNoQ3JpdGVyaWEgPSB0aGlzLnBvbHltb3JwaGljRGlzcGF0Y2hTZWFyY2hDcml0ZXJpYShjYXRlZ29yeUlkKTtcclxuICAgICAgICBzZWFyY2hDcml0ZXJpYS5CaW5kRXZlbnRzKHNlYXJjaENyaXRlcmlhQ2hhbmdlKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgVW5CaW5kKGNhdGVnb3J5SWQ6bnVtYmVyKSB7XHJcbiAgICAgICAgbGV0IHNlYXJjaENyaXRlcmlhID0gdGhpcy5wb2x5bW9ycGhpY0Rpc3BhdGNoU2VhcmNoQ3JpdGVyaWEoY2F0ZWdvcnlJZCk7XHJcbiAgICAgICAgc2VhcmNoQ3JpdGVyaWEuVW5CaW5kRXZlbnRzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBwb2x5bW9ycGhpY0Rpc3BhdGNoU2VhcmNoQ3JpdGVyaWEoY2F0ZWdvcnlJZDpudW1iZXIpOiBJQ3JpdGVyaWEge1xyXG4gICAgICAgIGxldCByZXR1cm5WYWx1ZTogSUNyaXRlcmlhID0gdGhpcy5fc2VhcmNoQ3JpdGVyaWFJb2NDb250YWluZXJbY2F0ZWdvcnlJZF07XHJcbiAgICAgICAgaWYgKHJldHVyblZhbHVlPT09dW5kZWZpbmVkIHx8IHJldHVyblZhbHVlPT09bnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm5WYWx1ZSA9IHRoaXMuX3NlYXJjaENyaXRlcmlhSW9jQ29udGFpbmVyWzBdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmV0dXJuVmFsdWU7XHJcbiAgICB9XHJcbn0iLCLvu79pbXBvcnQgeyBQYXJ0aWFsVmlld1NlcnZlckNhbGxQYXJhbWV0ZXJzIH0gZnJvbSBcIi4uLy4uL25ld0FkL3NyYy9OZXdBZFBhcnRpYWxWaWV3TG9hZGVyXCI7XHJcbmltcG9ydCB7SUNyaXRlcmlhQ2hhbmdlIH0gZnJvbSBcIi4uLy4uLy4uL0hlbHBlci9JQ3JpdGVyaWFDaGFuZ2VcIjtcclxuaW1wb3J0IHtTZWFyY2hDcml0ZXJpYX0gZnJvbSBcIi4vU2VhcmNoQ3JpdGVyaWFcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTZWFyY2hDcml0ZXJpYVZpZXdMb2FkZXIge1xyXG4gICAgcHJpdmF0ZSBfcGFyZW50RGl2SWQ6IHN0cmluZztcclxuICAgIHByaXZhdGUgX3NlYXJjaENyaXRlcmlhQ2hhbmdlOiBJQ3JpdGVyaWFDaGFuZ2U7XHJcbiAgICBwcml2YXRlIF91cmw6IHN0cmluZyA9IFwiL0hvbWUvR2V0U2VhcmNoQ3JpdGVyaWFWaWV3XCI7XHJcbiAgICBwcml2YXRlIF9wcmV2aW91c0NhdGVnb3J5SWQ6bnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgX2N1cnJlbnRDYXRlZ29yeUlkOiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBfc2VhcmNoQ3JpdGVyaWE6U2VhcmNoQ3JpdGVyaWE7XHJcblxyXG4gICAgY29uc3RydWN0b3IocGFyZW50RGl2SWQ6IHN0cmluZywgc2VhcmNoQ3JpdGVyaWFDaGFuZ2U6IElDcml0ZXJpYUNoYW5nZSxzZWFyY2hDcml0ZXJpYTpTZWFyY2hDcml0ZXJpYSkge1xyXG4gICAgICAgIHRoaXMuX3BhcmVudERpdklkID0gcGFyZW50RGl2SWQ7XHJcbiAgICAgICAgdGhpcy5fc2VhcmNoQ3JpdGVyaWFDaGFuZ2UgPSBzZWFyY2hDcml0ZXJpYUNoYW5nZTtcclxuICAgICAgICB0aGlzLl9zZWFyY2hDcml0ZXJpYSA9IHNlYXJjaENyaXRlcmlhO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBHZXRTZWFyY2hDcml0ZXJpYVZpZXdGcm9tU2VydmVyKGNhdGVnb3J5SWQ6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX2N1cnJlbnRDYXRlZ29yeUlkID0gY2F0ZWdvcnlJZDtcclxuICAgICAgICBsZXQgY2FsbFBhcmFtcyA9IG5ldyBQYXJ0aWFsVmlld1NlcnZlckNhbGxQYXJhbWV0ZXJzKCk7XHJcbiAgICAgICAgY2FsbFBhcmFtcy5DYXRlZ29yeUlkID0gY2F0ZWdvcnlJZDtcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0eXBlOiBcIkdFVFwiLCAvL0dFVCBvciBQT1NUIG9yIFBVVCBvciBERUxFVEUgdmVyYlxyXG4gICAgICAgICAgICB1cmw6IHRoaXMuX3VybCxcclxuICAgICAgICAgICAgZGF0YTogY2FsbFBhcmFtcywgLy9EYXRhIHNlbnQgdG8gc2VydmVyXHJcbiAgICAgICAgICAgIC8vY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJywgLy8gY29udGVudCB0eXBlIHNlbnQgdG8gc2VydmVyXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IChtc2csIHRleHRTdGF0dXMsIGpxWEhSKSA9PiB0aGlzLm9uU3VjY2Vzc0dldEl0ZW1zRnJvbVNlcnZlcihtc2csIHRleHRTdGF0dXMsIGpxWEhSKSwvL09uIFN1Y2Nlc3NmdWxsIHNlcnZpY2UgY2FsbFxyXG4gICAgICAgICAgICBlcnJvcjogKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikgPT4gdGhpcy5vbkVycm9yR2V0SXRlbXNGcm9tU2VydmVyKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikvLyBXaGVuIFNlcnZpY2UgY2FsbCBmYWlsc1xyXG4gICAgICAgIH0pOy8vLmFqYXhcclxuICAgIH1cclxuXHJcbiAgICBcclxuICAgIHByaXZhdGUgb25TdWNjZXNzR2V0SXRlbXNGcm9tU2VydmVyKG1zZzogYW55LCB0ZXh0U3RhdHVzOiBzdHJpbmcsIGpxWEhSOiBKUXVlcnlYSFIpIHtcclxuICAgICAgICB0aGlzLl9zZWFyY2hDcml0ZXJpYS5VbkJpbmQodGhpcy5fcHJldmlvdXNDYXRlZ29yeUlkKTtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fcGFyZW50RGl2SWQpLmNoaWxkcmVuKCkucmVtb3ZlKCk7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX3BhcmVudERpdklkKS5odG1sKG1zZyk7XHJcbiAgICAgICAgdGhpcy5fc2VhcmNoQ3JpdGVyaWEuQmluZCh0aGlzLl9jdXJyZW50Q2F0ZWdvcnlJZCwgdGhpcy5fc2VhcmNoQ3JpdGVyaWFDaGFuZ2UpO1xyXG4gICAgICAgIHRoaXMuX3ByZXZpb3VzQ2F0ZWdvcnlJZCA9IHRoaXMuX2N1cnJlbnRDYXRlZ29yeUlkO1xyXG4gICAgfS8vb25TdWNjZXNzR2V0VGltZUZyb21TZXJ2ZXJcclxuXHJcbiAgICBwcml2YXRlIG9uRXJyb3JHZXRJdGVtc0Zyb21TZXJ2ZXIoanFYSFI6IEpRdWVyeVhIUiwgdGV4dFN0YXR1czogc3RyaW5nLCBlcnJvclRocm93bjogc3RyaW5nKSB7XHJcbiAgICAgICAgYWxlcnQoZXJyb3JUaHJvd24pO1xyXG4gICAgfS8vb25FcnJvckdldFRpbWVGcm9tU2VydmVyXHJcblxyXG4gICAgXHJcbiAgICBcclxufSIsIu+7v2ltcG9ydCB7IFVzZXJJbnB1dCB9IGZyb20gXCIuLi8uLi8uLi8uLi9IZWxwZXIvVXNlcklucHV0XCI7XHJcbmltcG9ydCB7IElDcml0ZXJpYUNoYW5nZSB9IGZyb20gXCIuLi8uLi8uLi8uLi9IZWxwZXIvSUNyaXRlcmlhQ2hhbmdlXCI7XHJcbmltcG9ydCB7IElDcml0ZXJpYSwgQ3JpdGVyaWFWYWxpZGF0b3IgfSBmcm9tIFwiLi4vLi4vLi4vLi4vSGVscGVyL0lDcml0ZXJpYVwiO1xyXG5pbXBvcnQgeyBDYXJNb2RlbEJyYW5kQ29udHJvbGxlciB9IGZyb20gXCIuLi8uLi8uLi8uLi9Db21wb25lbnRzL1RyYW5zZm9ybWF0aW9uL0Nhck1vZGVsQnJhbmRDb250cm9sbGVyXCI7XHJcbmltcG9ydCB7RGVmYXVsdE9yZGVyQnl9IGZyb20gXCIuLi8uLi8uLi8uLi9Db21wb25lbnRzL09yZGVyQnkvRGVmYXVsdE9yZGVyQnlcIjtcclxuaW1wb3J0IHtEZWZhdWx0UHJpY2VUeXBlfSBmcm9tIFwiLi4vLi4vLi4vLi4vQ29tcG9uZW50cy9QcmljZVR5cGUvRGVmYXVsdFByaWNlVHlwZVwiO1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBBZFRyYW5zZm9ybWF0aW9uU2VhcmNoQ3JpdGVyaWEgaW1wbGVtZW50cyBJQ3JpdGVyaWEge1xyXG5cclxuICAgIHByaXZhdGUgX2Nhck1vZGVsQnJhbmRDb250b2xsZXI6IENhck1vZGVsQnJhbmRDb250cm9sbGVyO1xyXG4gICAgcHJpdmF0ZSBfZGVmYXVsdE9yZGVyQnk6IERlZmF1bHRPcmRlckJ5O1xyXG4gICAgcHJpdmF0ZSBfZGVmYXVsdFByaWNlVHlwZTogRGVmYXVsdFByaWNlVHlwZTtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IE1ha2VZZWFyRnJvbUtleTogc3RyaW5nID0gXCJNYWtlWWVhckZyb21cIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgTWFrZVllYXJGcm9tSW5wdXRJZDogc3RyaW5nID0gXCJmcm9tWWVhclwiO1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgTWFrZVllYXJUb0tleTogc3RyaW5nID0gXCJNYWtlWWVhclRvXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IE1ha2VZZWFyVG9JbnB1dElkOiBzdHJpbmcgPSBcInRvWWVhclwiO1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgRnVlbEtleSA9IFwiRnVlbFwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBGdWVsU2VsZWN0SWQ6IHN0cmluZyA9IFwiZnVlbFwiO1xyXG5cclxuICAgIHB1YmxpYyByZWFkb25seSBNaWxlYWdlRnJvbUtleTogc3RyaW5nID0gXCJNaWxlYWdlRnJvbVwiO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IE1pbGVhZ2VGcm9tSW5wdXRJZDogc3RyaW5nID0gXCJtaWxlYWdlRnJvbVwiO1xyXG5cclxuICAgIHB1YmxpYyByZWFkb25seSBNaWxlYWdlVG9LZXk6IHN0cmluZyA9IFwiTWlsZWFnZVRvXCI7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgTWlsZWFnZVRvSW5wdXRJZDogc3RyaW5nID0gXCJtaWxlYWdlVG9cIjtcclxuXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgR2VhcmJveEtleTogc3RyaW5nID0gXCJHZWFyYm94XCI7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgR2VhcmJveFR5cGVTZWxlY3RJZDogc3RyaW5nID0gXCJnZWFyYm94VHlwZVwiO1xyXG5cclxuICAgIHB1YmxpYyByZWFkb25seSBCb2R5Q29sb3JLZXk6IHN0cmluZyA9IFwiQm9keUNvbG9yXCI7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgQm9keUNvbG9yU2VsZWN0SWQ6IHN0cmluZyA9IFwiYm9keUNvbG9yXCI7XHJcblxyXG4gICAgcHVibGljIHJlYWRvbmx5IEludGVybmFsQ29sb3JLZXk6IHN0cmluZyA9IFwiSW50ZXJuYWxDb2xvclwiO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IEludGVybmFsQ29sb3JTZWxlY3RJZCA9IFwiaW50ZXJuYWxDb2xvclwiO1xyXG5cclxuICAgIHB1YmxpYyByZWFkb25seSBCb2R5U3RhdHVzS2V5OiBzdHJpbmcgPSBcIkJvZHlTdGF0dXNcIjtcclxuICAgIHB1YmxpYyByZWFkb25seSBCb2R5U3RhdHVzU2VsZWN0SWQ6IHN0cmluZyA9IFwiYm9keVN0YXR1c1wiO1xyXG5cclxuICAgIHB1YmxpYyByZWFkb25seSBDYXJTdGF0dXNLZXk6IHN0cmluZyA9IFwiQ2FyU3RhdHVzXCI7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgQ2FyU3RhdHVzU2VsZWN0SWQ6IHN0cmluZyA9IFwiY2FyU3RhdHVzXCI7XHJcblxyXG4gICAgcHVibGljIHJlYWRvbmx5IFBsYXRlVHlwZUtleTogc3RyaW5nID0gXCJQbGF0ZVR5cGVcIjtcclxuICAgIHB1YmxpYyByZWFkb25seSBQbGF0ZVR5cGVTZWxlY3RJZDogc3RyaW5nID0gXCJwbGF0ZVR5cGVcIjtcclxuXHJcbiAgICBwcml2YXRlIGluaXRWaWV3KCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX2Nhck1vZGVsQnJhbmRDb250b2xsZXIgPSBuZXcgQ2FyTW9kZWxCcmFuZENvbnRyb2xsZXIoKTtcclxuICAgICAgICB0aGlzLl9kZWZhdWx0UHJpY2VUeXBlID0gbmV3IERlZmF1bHRQcmljZVR5cGUoKTtcclxuICAgICAgICB0aGlzLl9kZWZhdWx0T3JkZXJCeSA9IG5ldyBEZWZhdWx0T3JkZXJCeSgpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSByZWdpc3RlckV2ZW50cygpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9kZWZhdWx0UHJpY2VUeXBlLlNlbGVjdGVkUHJpY2VUeXBlQ2hhbmdlZEV2ZW50LlN1YnNjcmliZSgoc2VuZGVyLCBhcmdzKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RlZmF1bHRPcmRlckJ5LlByaWNlVHlwZUNoYW5nZWQoc2VuZGVyLCBhcmdzKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVuUmVnaXN0ZXJFdmVudHMoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fZGVmYXVsdFByaWNlVHlwZS5TZWxlY3RlZFByaWNlVHlwZUNoYW5nZWRFdmVudC5VbnN1YnNjcmliZSgoc2VuZGVyLCBhcmdzKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RlZmF1bHRPcmRlckJ5LlByaWNlVHlwZUNoYW5nZWQoc2VuZGVyLCBhcmdzKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvL1RPRE8gaW4gb3J0aGVyIHRvIG1pbmltaXplIGJhbmR3aWR0aCB1c2FnZSBpdCBpcyBnb29kIHByY3RpY2UgdG8gbm90IHNlbmQgY3JpdGVyaWFzIHRoYXQgaGF2ZSBkZWZhdWx0IHZhbHVlXHJcbiAgICBwdWJsaWMgRmlsbENyaXRlcmlhKHVzZXJJbnB1dDogVXNlcklucHV0KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fY2FyTW9kZWxCcmFuZENvbnRvbGxlci5GaWxsQ3JpdGVyaWEodXNlcklucHV0KTtcclxuICAgICAgICB0aGlzLl9kZWZhdWx0T3JkZXJCeS5GaWxsQ3JpdGVyaWEodXNlcklucHV0KTtcclxuICAgICAgICB0aGlzLl9kZWZhdWx0UHJpY2VUeXBlLkZpbGxDcml0ZXJpYSh1c2VySW5wdXQpO1xyXG5cclxuICAgICAgICB1c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnlbdGhpcy5NYWtlWWVhckZyb21LZXldID1cclxuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuTWFrZVllYXJGcm9tSW5wdXRJZCkudmFsKCk7Ly9tYWtlWWVhckZyb21cclxuICAgICAgICB1c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnlbdGhpcy5NYWtlWWVhclRvS2V5XSA9XHJcbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLk1ha2VZZWFyVG9JbnB1dElkKS52YWwoKTsvL21ha2VZZWFyVG9cclxuICAgICAgICB1c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnlbdGhpcy5GdWVsS2V5XSA9XHJcbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLkZ1ZWxTZWxlY3RJZCkuZmluZChcIm9wdGlvbjpzZWxlY3RlZFwiKS52YWwoKTsvL2Z1ZWxcclxuICAgICAgICB1c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnlbdGhpcy5NaWxlYWdlRnJvbUtleV0gPVxyXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5NaWxlYWdlRnJvbUlucHV0SWQpLnZhbCgpOy8vbWlsZWFnZUZyb21cclxuICAgICAgICB1c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnlbdGhpcy5NaWxlYWdlVG9LZXldID1cclxuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuTWlsZWFnZVRvSW5wdXRJZCkudmFsKCk7Ly9taWxlYWdlVG9cclxuICAgICAgICB1c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnlbdGhpcy5HZWFyYm94S2V5XSA9XHJcbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLkdlYXJib3hUeXBlU2VsZWN0SWQpLmZpbmQoXCJvcHRpb246c2VsZWN0ZWRcIikudmFsKCk7Ly9nZWFyYm94VHlwZSAgICAgICAgXHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuQm9keUNvbG9yS2V5XSA9XHJcbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLkJvZHlDb2xvclNlbGVjdElkKS5maW5kKFwib3B0aW9uOnNlbGVjdGVkXCIpLnZhbCgpOy8vYm9keUNvbG9yXHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuSW50ZXJuYWxDb2xvcktleV0gPVxyXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5JbnRlcm5hbENvbG9yU2VsZWN0SWQpLmZpbmQoXCJvcHRpb246c2VsZWN0ZWRcIikudmFsKCk7Ly9pbnRlcm5hbENvbG9yICAgICAgICBcclxuICAgICAgICB1c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnlbdGhpcy5Cb2R5U3RhdHVzS2V5XSA9XHJcbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLkJvZHlTdGF0dXNTZWxlY3RJZCkuZmluZChcIm9wdGlvbjpzZWxlY3RlZFwiKS52YWwoKTsvL2JvZHlTdGF0dXNcclxuICAgICAgICB1c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnlbdGhpcy5DYXJTdGF0dXNLZXldID1cclxuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuQ2FyU3RhdHVzU2VsZWN0SWQpLmZpbmQoXCJvcHRpb246c2VsZWN0ZWRcIikudmFsKCk7Ly9jYXJTdGF0dXMgICAgICAgIFxyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLlBsYXRlVHlwZUtleV0gPVxyXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5QbGF0ZVR5cGVTZWxlY3RJZCkuZmluZChcIm9wdGlvbjpzZWxlY3RlZFwiKS52YWwoKTsvL3BsYXRlVHlwZVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBCaW5kRXZlbnRzKGNyaXRlcmlhQ2hhbmdlOiBJQ3JpdGVyaWFDaGFuZ2UpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmluaXRWaWV3KCk7XHJcbiAgICAgICAgdGhpcy5yZWdpc3RlckV2ZW50cygpO1xyXG5cclxuICAgICAgICB0aGlzLl9jYXJNb2RlbEJyYW5kQ29udG9sbGVyLkJpbmRFdmVudHMoY3JpdGVyaWFDaGFuZ2UpO1xyXG4gICAgICAgIHRoaXMuX2RlZmF1bHRPcmRlckJ5LkJpbmRFdmVudHMoY3JpdGVyaWFDaGFuZ2UpO1xyXG4gICAgICAgIHRoaXMuX2RlZmF1bHRQcmljZVR5cGUuQmluZEV2ZW50cyhjcml0ZXJpYUNoYW5nZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIFVuQmluZEV2ZW50cygpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9jYXJNb2RlbEJyYW5kQ29udG9sbGVyLlVuQmluZEV2ZW50cygpO1xyXG4gICAgICAgIHRoaXMuX2RlZmF1bHRPcmRlckJ5LlVuQmluZEV2ZW50cygpO1xyXG4gICAgICAgIHRoaXMuX2RlZmF1bHRQcmljZVR5cGUuVW5CaW5kRXZlbnRzKCk7XHJcbiAgICAgICAgdGhpcy51blJlZ2lzdGVyRXZlbnRzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgVmFsaWRhdGVDcml0ZXJpYSgpOiBDcml0ZXJpYVZhbGlkYXRvciB7IHRocm93IG5ldyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZFwiKTsgfVxyXG59XHJcblxyXG5cclxuXHJcbiIsIu+7v2ltcG9ydCB7SUNyaXRlcmlhLENyaXRlcmlhVmFsaWRhdG9yfSBmcm9tIFwiLi4vLi4vLi4vLi4vSGVscGVyL0lDcml0ZXJpYVwiO1xyXG5pbXBvcnQgeyBVc2VySW5wdXQgfSBmcm9tIFwiLi4vLi4vLi4vLi4vSGVscGVyL1VzZXJJbnB1dFwiO1xyXG5pbXBvcnQgeyBJQ3JpdGVyaWFDaGFuZ2UgfSBmcm9tIFwiLi4vLi4vLi4vLi4vSGVscGVyL0lDcml0ZXJpYUNoYW5nZVwiO1xyXG5pbXBvcnQge0RlZmF1bHRPcmRlckJ5fSBmcm9tIFwiLi4vLi4vLi4vLi4vQ29tcG9uZW50cy9PcmRlckJ5L0RlZmF1bHRPcmRlckJ5XCI7XHJcbmltcG9ydCB7RGVmYXVsdFByaWNlVHlwZX0gZnJvbSBcIi4uLy4uLy4uLy4uL0NvbXBvbmVudHMvUHJpY2VUeXBlL0RlZmF1bHRQcmljZVR5cGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBEZWZhdWx0U2VhcmNoQ3JpdGVyaWEgaW1wbGVtZW50cyBJQ3JpdGVyaWF7XHJcblxyXG4gICAgcHJpdmF0ZSBfZGVmYXVsdE9yZGVyQnk6IERlZmF1bHRPcmRlckJ5O1xyXG4gICAgcHJpdmF0ZSBfZGVmYXVsdFByaWNlVHlwZTpEZWZhdWx0UHJpY2VUeXBlO1xyXG5cclxuICAgIHByaXZhdGUgaW5pdFZpZXcoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fZGVmYXVsdFByaWNlVHlwZSA9IG5ldyBEZWZhdWx0UHJpY2VUeXBlKCk7XHJcbiAgICAgICAgdGhpcy5fZGVmYXVsdE9yZGVyQnkgPSBuZXcgRGVmYXVsdE9yZGVyQnkoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlZ2lzdGVyRXZlbnRzKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX2RlZmF1bHRQcmljZVR5cGUuU2VsZWN0ZWRQcmljZVR5cGVDaGFuZ2VkRXZlbnQuU3Vic2NyaWJlKChzZW5kZXIsIGFyZ3MpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fZGVmYXVsdE9yZGVyQnkuUHJpY2VUeXBlQ2hhbmdlZChzZW5kZXIsIGFyZ3MpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdW5SZWdpc3RlckV2ZW50cygpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9kZWZhdWx0UHJpY2VUeXBlLlNlbGVjdGVkUHJpY2VUeXBlQ2hhbmdlZEV2ZW50LlVuc3Vic2NyaWJlKChzZW5kZXIsIGFyZ3MpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fZGVmYXVsdE9yZGVyQnkuUHJpY2VUeXBlQ2hhbmdlZChzZW5kZXIsIGFyZ3MpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBGaWxsQ3JpdGVyaWEodXNlcklucHV0OiBVc2VySW5wdXQpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9kZWZhdWx0T3JkZXJCeS5GaWxsQ3JpdGVyaWEodXNlcklucHV0KTtcclxuICAgICAgICB0aGlzLl9kZWZhdWx0UHJpY2VUeXBlLkZpbGxDcml0ZXJpYSh1c2VySW5wdXQpO1xyXG4gICAgfVxyXG5cclxuICAgIEJpbmRFdmVudHMoY3JpdGVyaWFDaGFuZ2U6IElDcml0ZXJpYUNoYW5nZSk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuaW5pdFZpZXcoKTtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyRXZlbnRzKCk7XHJcbiAgICAgICAgdGhpcy5fZGVmYXVsdE9yZGVyQnkuQmluZEV2ZW50cyhjcml0ZXJpYUNoYW5nZSk7XHJcbiAgICAgICAgdGhpcy5fZGVmYXVsdFByaWNlVHlwZS5CaW5kRXZlbnRzKGNyaXRlcmlhQ2hhbmdlKTtcclxuICAgIH1cclxuXHJcbiAgICBVbkJpbmRFdmVudHMoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fZGVmYXVsdE9yZGVyQnkuVW5CaW5kRXZlbnRzKCk7XHJcbiAgICAgICAgdGhpcy5fZGVmYXVsdFByaWNlVHlwZS5VbkJpbmRFdmVudHMoKTtcclxuICAgICAgICB0aGlzLnVuUmVnaXN0ZXJFdmVudHMoKTtcclxuICAgIH1cclxuXHJcbiAgICBWYWxpZGF0ZUNyaXRlcmlhKCk6IENyaXRlcmlhVmFsaWRhdG9yIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJOb3QgaW1wbGVtZW50ZWRcIik7XHJcbiAgICB9XHJcbn0iLCLvu79pbXBvcnQgeyBVc2VySW5wdXQgfSBmcm9tIFwiLi4vLi4vLi4vSGVscGVyL1VzZXJJbnB1dFwiO1xyXG5pbXBvcnQgeyBJUmVzdWx0SGFuZGxlciB9IGZyb20gXCIuLi8uLi8uLi9IZWxwZXIvSVJlc3VsdEhhbmRsZXJcIjtcclxuaW1wb3J0IHsgQWR2ZXJ0aXNlbWVudENvbW1vbiB9IGZyb20gXCIuLi8uLi8uLi9Nb2RlbHMvQWR2ZXJ0aXNlbWVudENvbW1vblwiO1xyXG5cclxuXHJcbi8vVE9ETyBtYWtlIGNvdW50IG9wdGlvbmFsIHRvIHVzZXJcclxuLy9UT0RPIGluc3RlYWQgb2YgYWRkaW5nIG5ldyBhZHMgdG8gdGhlIHBhZ2UgaGVyZSBjYWxsIGEgbWV0aG9kIG9uIGluZGV4IGNsYXNzIHRvIGFkZCBpdCBieSBkZWZpbmluZyBhbiBpbnRlcmZhY2UgaW4gdGhlIGluZGV4IGNsYXNzIFxyXG5leHBvcnQgY2xhc3MgU2VydmVyQ2FsbGVyIHtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgU3RhcnRJbmRleEtleTogc3RyaW5nID0gXCJTdGFydEluZGV4XCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9pbml0aWFsU3RhcnQ6IG51bWJlciA9IDE7XHJcbiAgICBwcml2YXRlIF9zdGFydDogbnVtYmVyID0gMTtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IENvdW50S2V5OiBzdHJpbmcgPSBcIkNvdW50XCI7XHJcbiAgICBwcml2YXRlIF9jb3VudDogbnVtYmVyID0gNTtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IFJlcXVlc3RJbmRleEtleTogc3RyaW5nID0gXCJSZXF1ZXN0SW5kZXhcIjtcclxuICAgIHByaXZhdGUgX2N1cnJlbnRSZXF1ZXN0SW5kZXg6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIF9udW1iZXJPZlB1cmVTZXJ2ZXJDYWxsczogbnVtYmVyID0gMDtcclxuXHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBOdW1iZXJPZkl0ZW1zS2V5OiBzdHJpbmcgPSBcIm51bWJlck9mSXRlbXNcIjtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF91cmw6IHN0cmluZyA9IFwiL2FwaS9BZEFwaS9HZXRBZHZlcnRpc2VtZW50Q29tbW9uXCI7XHJcblxyXG4gICAgcHJpdmF0ZSBfcmVzdWx0SGFuZGxlcjogSVJlc3VsdEhhbmRsZXI8QWR2ZXJ0aXNlbWVudENvbW1vbltdPjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihyZXN1bHRIYW5kbGVyOiBJUmVzdWx0SGFuZGxlcjxBZHZlcnRpc2VtZW50Q29tbW9uW10+KSB7XHJcbiAgICAgICAgdGhpcy5fcmVzdWx0SGFuZGxlciA9IHJlc3VsdEhhbmRsZXI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIEdldEFkSXRlbXNGcm9tU2VydmVyKHVzZXJJbnB1dDogVXNlcklucHV0KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fY3VycmVudFJlcXVlc3RJbmRleCsrO1xyXG5cclxuICAgICAgICB1c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnlbdGhpcy5TdGFydEluZGV4S2V5XSA9IHRoaXMuX3N0YXJ0O1xyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLkNvdW50S2V5XSA9IHRoaXMuX2NvdW50O1xyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLlJlcXVlc3RJbmRleEtleV0gPSB0aGlzLl9jdXJyZW50UmVxdWVzdEluZGV4O1xyXG5cclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0eXBlOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgdXJsOiB0aGlzLl91cmwsXHJcbiAgICAgICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeSksIC8vRGF0YSBzZW50IHRvIHNlcnZlclxyXG4gICAgICAgICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLCAvLyBjb250ZW50IHR5cGUgc2VudCB0byBzZXJ2ZXJcclxuICAgICAgICAgICAgc3VjY2VzczogKG1zZywgdGV4dFN0YXR1cywganFYSFIpID0+IHRoaXMub25TdWNjZXNzR2V0SXRlbXNGcm9tU2VydmVyKG1zZywgdGV4dFN0YXR1cywganFYSFIpLCAvL09uIFN1Y2Nlc3NmdWxsIHNlcnZpY2UgY2FsbFxyXG4gICAgICAgICAgICBlcnJvcjogKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikgPT4gdGhpcy5vbkVycm9yR2V0SXRlbXNGcm9tU2VydmVyKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikgLy8gV2hlbiBTZXJ2aWNlIGNhbGwgZmFpbHNcclxuICAgICAgICB9KTsgLy8uYWpheFxyXG5cclxuICAgICAgICB0aGlzLl9udW1iZXJPZlB1cmVTZXJ2ZXJDYWxscysrO1xyXG4gICAgICAgIHRoaXMuX3Jlc3VsdEhhbmRsZXIuQWpheENhbGxTdGFydGVkKCk7XHJcbiAgICB9IC8vR2V0QWRJdGVtc0Zyb21TZXJ2ZXJcclxuXHJcbiAgICBwcml2YXRlIG9uU3VjY2Vzc0dldEl0ZW1zRnJvbVNlcnZlcihtc2c6IGFueSwgdGV4dFN0YXR1czogc3RyaW5nLCBqcVhIUjogSlF1ZXJ5WEhSKSB7XHJcbiAgICAgICAgLy9UT0RPIGNoZWNrIGZvciB1bmRlZmluZWQgb3IgbnVsbCBpbiBtc2cgYW5kIG1zZy5jdXN0b21EaWN0aW9uYXJ5W1wiUmVxdWVzdEluZGV4XCJdXHJcbiAgICAgICAgdGhpcy5fbnVtYmVyT2ZQdXJlU2VydmVyQ2FsbHMtLTtcclxuICAgICAgICBpZiAodGhpcy5fbnVtYmVyT2ZQdXJlU2VydmVyQ2FsbHMgPT09IDApIHtcclxuICAgICAgICAgICAgdGhpcy5fcmVzdWx0SGFuZGxlci5BamF4Q2FsbEZpbmlzaGVkKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAobXNnLkN1c3RvbURpY3Rpb25hcnlbdGhpcy5SZXF1ZXN0SW5kZXhLZXldID09IHRoaXMuX2N1cnJlbnRSZXF1ZXN0SW5kZXgpIHsgLy9sYXN0IGNhbGwgcmVzcG9uc2VcclxuICAgICAgICAgICAgaWYgKG1zZy5TdWNjZXNzID09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3N0YXJ0ICs9IHBhcnNlSW50KG1zZy5DdXN0b21EaWN0aW9uYXJ5W3RoaXMuTnVtYmVyT2ZJdGVtc0tleV0pO1xyXG4gICAgICAgICAgICAgICAgLy9UT0RPIGNyZWF0ZSBBZHZlcnRpc2VtZW50Q29tbW9uW10gb2JqZWN0IGZyb20gbXNnLnJlc3BvbnNlRGF0YVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVzdWx0SGFuZGxlci5PblJlc3VsdE9rKG1zZy5SZXNwb25zZURhdGEpO1xyXG4gICAgICAgICAgICB9IC8vaWYgKG1zZy5zdWNjZXNzID09IHRydWUpXHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVzdWx0SGFuZGxlci5PblJlc3VsdEVycm9yKG1zZy5NZXNzYWdlICsgXCIgLCBcIiArIG1zZy5FcnJvckNvZGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25FcnJvckdldEl0ZW1zRnJvbVNlcnZlcihqcVhIUjogSlF1ZXJ5WEhSLCB0ZXh0U3RhdHVzOiBzdHJpbmcsIGVycm9yVGhyb3duOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLl9udW1iZXJPZlB1cmVTZXJ2ZXJDYWxscy0tO1xyXG4gICAgICAgIGlmICh0aGlzLl9udW1iZXJPZlB1cmVTZXJ2ZXJDYWxscyA9PT0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLl9yZXN1bHRIYW5kbGVyLkFqYXhDYWxsRmluaXNoZWQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX3Jlc3VsdEhhbmRsZXIuT25SZXN1bHRFcnJvcih0ZXh0U3RhdHVzICsgXCIgLCBcIiArIGVycm9yVGhyb3duKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgUmVzZXRTZWFyY2hQYXJhbWV0ZXJzKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX3N0YXJ0ID0gdGhpcy5faW5pdGlhbFN0YXJ0O1xyXG4gICAgfVxyXG5cclxuICAgIC8vcHJpdmF0ZSBub3RpZnlVc2VyQWpheENhbGxTdGFydGVkKCkge1xyXG4gICAgLy8gICAgJChcIiNcIiArIHRoaXMuQ2FsbEltYWdlSWQpLnNob3coKTtcclxuICAgIC8vfVxyXG5cclxuICAgIC8vbm90aWZ5VXNlckFqYXhDYWxsRmluaXNoZWQoKSB7XHJcbiAgICAvLyAgICAkKFwiI1wiICsgdGhpcy5DYWxsSW1hZ2VJZCkuaGlkZSgpO1xyXG4gICAgLy99XHJcbn1cclxuXHJcbiIsIu+7v2ltcG9ydCB7IENhdGVnb3J5IH0gZnJvbSBcIi4uLy4uLy4uL01vZGVscy9DYXRlZ29yeVwiO1xyXG5pbXBvcnQgeyBDYXRlZ29yeVNlbGVjdGlvbiB9IGZyb20gXCIuLi8uLi8uLi9Db21wb25lbnRzL0NhdGVnb3J5L0NhdGVnb3J5U2VsZWN0aW9uXCI7XHJcbmltcG9ydCB7IFNlcnZlckNhbGxlciB9IGZyb20gXCIuL1NlcnZlckNhbGxlclwiO1xyXG5pbXBvcnQgeyBTZWFyY2hDcml0ZXJpYVZpZXdMb2FkZXJ9IGZyb20gXCIuL1NlYXJjaENyaXRlcmlhVmlld0xvYWRlclwiO1xyXG5pbXBvcnQge1NlYXJjaENyaXRlcmlhfSBmcm9tIFwiLi9TZWFyY2hDcml0ZXJpYVwiO1xyXG5pbXBvcnQge0lDcml0ZXJpYUNoYW5nZX0gZnJvbSBcIi4uLy4uLy4uL0hlbHBlci9JQ3JpdGVyaWFDaGFuZ2VcIjtcclxuaW1wb3J0IHtVc2VySW5wdXR9IGZyb20gXCIuLi8uLi8uLi9IZWxwZXIvVXNlcklucHV0XCI7XHJcbmltcG9ydCB7SVJlc3VsdEhhbmRsZXJ9IGZyb20gXCIuLi8uLi8uLi9IZWxwZXIvSVJlc3VsdEhhbmRsZXJcIjtcclxuaW1wb3J0IHtBZHZlcnRpc2VtZW50Q29tbW9ufSBmcm9tIFwiLi4vLi4vLi4vTW9kZWxzL0FkdmVydGlzZW1lbnRDb21tb25cIjtcclxuXHJcblxyXG5cclxuLy9UT0RPIHdoZW4gY2F0ZWdvcnkgY2hhbmdlIGJlZm9yZSBzZWFyY2ggY3JpdGVpYSBpcyBsb2FkZWQgYSBzZWFyY2ggY2FsbCBpcyBzZW50IHRvIHNlcnZlclxyXG4vL2FkZCBhbiBldmVudCBsaWtlIHZpZXdMb2FkU3RhcnRlZCwgdmlld0xvYWRJblByb2dyZXNzLHZpZXdMb2FkQ29tcGxldGVkIGFuZCBkaXNhYmxlIHNlYXJjaFxyXG4vL2R1cm5nIGluUHJvZ3Jlc3MgZW5kIGVuYWJsZSBpdCBhZnRlciBjb21wbGV0ZWRcclxuZXhwb3J0IGNsYXNzIEluZGV4IGltcGxlbWVudHMgSUNyaXRlcmlhQ2hhbmdlLCBJUmVzdWx0SGFuZGxlcjxBZHZlcnRpc2VtZW50Q29tbW9uW10+IHtcclxuICAgIFxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBDYWxsSW1hZ2VJZDogc3RyaW5nID0gXCJzZXJ2ZXJDYWxsZWRJbWFnZVwiO1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgQWRUeXBlS2V5OiBzdHJpbmcgPSBcIkFkVHlwZVwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBBZFR5cGVQYXJlbnREaXZJZCA9XCJhZFR5cGVcIjtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IFNlYXJjaFRleHRLZXk9XCJTZWFyY2hUZXh0XCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IFNlYXJjaFRleHRJbnB1dElkID1cInNlYXJjaFRleHRcIjtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9hZFBsYWNlSG9sZGVyRGl2SWQ6IHN0cmluZyA9IFwiYWRQbGFjZUhvbGRlclwiO1xyXG5cclxuICAgIHByaXZhdGUgX3NlcnZlckNhbGxlcjpTZXJ2ZXJDYWxsZXI7XHJcbiAgICBwcml2YXRlIF9jYXRlZ29yeVNlbGVjdGlvbjogQ2F0ZWdvcnlTZWxlY3Rpb247XHJcbiAgICBwcml2YXRlIF9zZWFyY2hDcml0ZXJpYTpTZWFyY2hDcml0ZXJpYTtcclxuICAgIHByaXZhdGUgX3NlYXJjaENyaXRlcmlhVmlld0xvYWRlcjpTZWFyY2hDcml0ZXJpYVZpZXdMb2FkZXI7XHJcblxyXG4gICAgcHJpdmF0ZSBfY2F0ZWdvcnlTZWxlY3RvclBhcmVudERpdklkOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIF9hbGxDYXRlZ29yaWVzSWQ6IHN0cmluZztcclxuXHJcbiAgICBwcml2YXRlIF9nZXRBZEZyb21TZXJ2ZXJJZCA9IFwiZ2V0QWRGcm9tU2VydmVyXCI7XHJcbiAgICBwcml2YXRlIF9tZXNzYWdlRGl2SWQgPVwibWVzc2FnZVwiO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNhdGVnb3J5U2VsZWN0b3JQYXJlbnREaXZJZDogc3RyaW5nLFxyXG4gICAgICAgIGFsbENhdGVnb3JpZXNJZDogc3RyaW5nKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuX2NhdGVnb3J5U2VsZWN0b3JQYXJlbnREaXZJZCA9IGNhdGVnb3J5U2VsZWN0b3JQYXJlbnREaXZJZDtcclxuICAgICAgICB0aGlzLl9hbGxDYXRlZ29yaWVzSWQgPSBhbGxDYXRlZ29yaWVzSWQ7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5fc2VydmVyQ2FsbGVyID0gbmV3IFNlcnZlckNhbGxlcih0aGlzKTtcclxuICAgICAgICB0aGlzLl9zZWFyY2hDcml0ZXJpYSA9IG5ldyBTZWFyY2hDcml0ZXJpYSgpO1xyXG4gICAgICAgIHRoaXMuX3NlYXJjaENyaXRlcmlhVmlld0xvYWRlciA9IG5ldyBTZWFyY2hDcml0ZXJpYVZpZXdMb2FkZXIoXCJjYXRlZ29yeVNwZWNpZmljU2VhcmNoQ3JpdGVyaWFcIiwgdGhpcywgdGhpcy5fc2VhcmNoQ3JpdGVyaWEpO1xyXG5cclxuICAgICAgICB0aGlzLmluaXRQYWdlKCk7XHJcbiAgICAgICAgdGhpcy5pbml0RXZlbnRIYW5kbGVycygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaW5pdFBhZ2UoKTogdm9pZCB7XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdENhdGVnb3J5U2VsZWN0aW9uQ29udHJvbCgpO1xyXG4gICAgICAgIHRoaXMuaW5pdEdldEFkRnJvbVNlcnZlcigpO1xyXG4gICAgICAgIHRoaXMuaW5pdFNpbmdsZUFkSXRlbVN0eWxlKCk7XHJcblxyXG4gICAgfS8vaW5pdFBhZ2VcclxuXHJcbiAgICBwcml2YXRlIGluaXRDYXRlZ29yeVNlbGVjdGlvbkNvbnRyb2woKTogdm9pZCB7XHJcbiAgICAgICAgbGV0IGFsbENhdGVnb3JpZXNTdHJpbmcgPSAkKFwiI1wiICsgdGhpcy5fYWxsQ2F0ZWdvcmllc0lkKS52YWwoKS50b1N0cmluZygpO1xyXG4gICAgICAgIGxldCBhbGxDYXRlZ29yaWVzID0gJC5wYXJzZUpTT04oYWxsQ2F0ZWdvcmllc1N0cmluZykgYXMgQ2F0ZWdvcnlbXTtcclxuICAgICAgICB0aGlzLl9jYXRlZ29yeVNlbGVjdGlvbiA9IG5ldyBDYXRlZ29yeVNlbGVjdGlvbih0aGlzLl9jYXRlZ29yeVNlbGVjdG9yUGFyZW50RGl2SWQsIGFsbENhdGVnb3JpZXMpO1xyXG4gICAgICAgIHRoaXMuX2NhdGVnb3J5U2VsZWN0aW9uLkNyZWF0ZUZpcnN0TGV2ZWwoKTtcclxuXHJcbiAgICB9Ly9pbml0Q2F0ZWdvcnlTZWxlY3Rpb25Db250cm9sXHJcblxyXG4gICAgcHJpdmF0ZSBpbml0RXZlbnRIYW5kbGVycygpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9jYXRlZ29yeVNlbGVjdGlvbi5TZWxlY3RlZENhdGVnb3J5Q2hhbmdlZEV2ZW50LlN1YnNjcmliZSgoc2VuZGVyLCBhcmdzKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VhcmNoQ3JpdGVyaWFDaGFuZ2VkKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3NlYXJjaENyaXRlcmlhVmlld0xvYWRlci5HZXRTZWFyY2hDcml0ZXJpYVZpZXdGcm9tU2VydmVyKGFyZ3MuU2VsZWN0ZWRDYXRlZ29yeUlkKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5fc2VhcmNoQ3JpdGVyaWEuQmluZCh0aGlzLl9jYXRlZ29yeVNlbGVjdGlvbi5HZXRTZWxlY3RlZENhdGVnb3J5SWQoKSx0aGlzKTtcclxuXHJcblxyXG4gICAgICAgXHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuQWRUeXBlUGFyZW50RGl2SWQpLm9uKFwiY2hhbmdlXCIsXHJcbiAgICAgICAgICAgIChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZWFyY2hDcml0ZXJpYUNoYW5nZWQoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLlNlYXJjaFRleHRJbnB1dElkKS5vbihcImlucHV0XCIsICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5zZWFyY2hDcml0ZXJpYUNoYW5nZWQoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICAkKGRvY3VtZW50KS5rZXlwcmVzcygoZSkgPT5cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChlLndoaWNoID09IDEzKSB7XHJcbiAgICAgICAgICAgICAgICAkKFwiI1wiK3RoaXMuX2dldEFkRnJvbVNlcnZlcklkKS5jbGljaygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBDdXN0b21Dcml0ZXJpYUNoYW5nZWQoKTp2b2lkIHtcclxuICAgICAgICB0aGlzLnNlYXJjaENyaXRlcmlhQ2hhbmdlZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2VhcmNoQ3JpdGVyaWFDaGFuZ2VkKCk6IHZvaWQge1xyXG4gICAgICAgICQoXCIjYWRQbGFjZUhvbGRlclwiKS5jaGlsZHJlbigpLnJlbW92ZSgpO1xyXG4gICAgICAgIHRoaXMuX3NlcnZlckNhbGxlci5SZXNldFNlYXJjaFBhcmFtZXRlcnMoKTtcclxuICAgICAgIC8vICQoXCIjXCIgKyB0aGlzLl9nZXRBZEZyb21TZXJ2ZXJJZCkudHJpZ2dlcihcImNsaWNrXCIpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXRHZXRBZEZyb21TZXJ2ZXIoKTogdm9pZCB7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX2dldEFkRnJvbVNlcnZlcklkKS5vbihcImNsaWNrXCIsIChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBsZXQgdXNlcklucHV0ID0gbmV3IFVzZXJJbnB1dCgpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fY2F0ZWdvcnlTZWxlY3Rpb24uSW5zZXJ0Q2F0ZWdvcnlJZEluVXNlcklucHV0RGljdGlvbmFyeSh1c2VySW5wdXQpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuQWRUeXBlS2V5XSA9ICQoXCIjXCIgKyB0aGlzLkFkVHlwZVBhcmVudERpdklkKS5jaGlsZHJlbihcIjpjaGVja2VkXCIpLnZhbCgpO1xyXG4gICAgICAgICAgICB1c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnlbdGhpcy5TZWFyY2hUZXh0S2V5XSA9ICQoXCIjXCIgKyB0aGlzLlNlYXJjaFRleHRJbnB1dElkKS52YWwoKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuX3NlYXJjaENyaXRlcmlhLkZpbGxDYXRlZ29yeVNwZWNpZmljU2VhcmNoQ3JpdGVyaWEodGhpcy5fY2F0ZWdvcnlTZWxlY3Rpb24uR2V0U2VsZWN0ZWRDYXRlZ29yeUlkKCksIHVzZXJJbnB1dCk7Ly9maWxsIGNhdGVnb3J5IHNwZWNpZmljIHNlYXJjaCBwYXJhbWV0ZXJzXHJcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlRXJyb3JNZXNzYWdlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3NlcnZlckNhbGxlci5HZXRBZEl0ZW1zRnJvbVNlcnZlcih1c2VySW5wdXQpO1xyXG4gICAgICAgIH0pOyAvL2NsaWNrXHJcbiAgICB9Ly9pbml0R2V0QWRGcm9tU2VydmVyXHJcblxyXG4gICAgcHVibGljIE9uUmVzdWx0T2soYWR2ZXJ0aXNlbWVudENvbW1vbnM6IEFkdmVydGlzZW1lbnRDb21tb25bXSk6IHZvaWQge1xyXG4gICAgICAgIHZhciB0ZW1wbGF0ZSA9ICQoJyNzaW5nbGVBZEl0ZW0nKS5odG1sKCk7XHJcbiAgICAgICAgdmFyIGRhdGE7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhZHZlcnRpc2VtZW50Q29tbW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgYWRJbWFnZSA9IG51bGw7XHJcbiAgICAgICAgICAgIGlmIChhZHZlcnRpc2VtZW50Q29tbW9uc1tpXS5BZHZlcnRpc2VtZW50SW1hZ2VzWzBdICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGFkSW1hZ2UgPSBcImRhdGE6aW1hZ2UvanBnO2Jhc2U2NCxcIiArIGFkdmVydGlzZW1lbnRDb21tb25zW2ldLkFkdmVydGlzZW1lbnRJbWFnZXNbMF07XHJcbiAgICAgICAgICAgIH0gLy9lbmQgaWZcclxuICAgICAgICAgICAgZGF0YSA9IHtcclxuICAgICAgICAgICAgICAgIEFkdmVydGlzZW1lbnRJZDogYWR2ZXJ0aXNlbWVudENvbW1vbnNbaV0uQWR2ZXJ0aXNlbWVudElkLFxyXG4gICAgICAgICAgICAgICAgQWR2ZXJ0aXNlbWVudENhdGVnb3J5SWQ6IGFkdmVydGlzZW1lbnRDb21tb25zW2ldLkFkdmVydGlzZW1lbnRDYXRlZ29yeUlkLFxyXG4gICAgICAgICAgICAgICAgQWR2ZXJ0aXNlbWVudENhdGVnb3J5OiBhZHZlcnRpc2VtZW50Q29tbW9uc1tpXS5BZHZlcnRpc2VtZW50Q2F0ZWdvcnksXHJcbiAgICAgICAgICAgICAgICBhZEltYWdlOiBhZEltYWdlLFxyXG4gICAgICAgICAgICAgICAgYWRQcmljZTogYWR2ZXJ0aXNlbWVudENvbW1vbnNbaV0uQWR2ZXJ0aXNlbWVudFByaWNlLlByaWNlU3RyaW5nLCAvL3RvZG8gY2hlY2sgdGhlIHByaWNlIHR5cGVcclxuICAgICAgICAgICAgICAgIEFkdmVydGlzZW1lbnRUaXRsZTogYWR2ZXJ0aXNlbWVudENvbW1vbnNbaV0uQWR2ZXJ0aXNlbWVudFRpdGxlLFxyXG4gICAgICAgICAgICAgICAgQWR2ZXJ0aXNlbWVudFN0YXR1czogYWR2ZXJ0aXNlbWVudENvbW1vbnNbaV0uQWR2ZXJ0aXNlbWVudFN0YXR1c1xyXG4gICAgICAgICAgICAgICAgLy9hZERhdGU6IG1zZy5SZXNwb25zZURhdGFbaV0uQWRUaW1lXHJcbiAgICAgICAgICAgIH0gLy9lbmQgZGF0YVxyXG5cclxuICAgICAgICAgICAgdmFyIGh0bWwgPSBNdXN0YWNoZS50b19odG1sKHRlbXBsYXRlLCBkYXRhKTtcclxuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuX2FkUGxhY2VIb2xkZXJEaXZJZCkuYXBwZW5kKGh0bWwpO1xyXG4gICAgICAgIH0gLy9lbmQgZm9yXHJcbiAgICB9XHJcbiAgICBwdWJsaWMgT25SZXN1bHRFcnJvcihtZXNzYWdlOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnNob3dFcnJvck1lc3NhZ2UobWVzc2FnZSk7XHJcbiAgICB9XHJcblxyXG4gICAgQWpheENhbGxTdGFydGVkKCk6IHZvaWQge1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLkNhbGxJbWFnZUlkKS5zaG93KCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIEFqYXhDYWxsRmluaXNoZWQoKTogdm9pZCB7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuQ2FsbEltYWdlSWQpLmhpZGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNob3dFcnJvck1lc3NhZ2UobWVzc2FnZTogc3RyaW5nKSB7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX21lc3NhZ2VEaXZJZCkuYXBwZW5kKGA8cD4ke21lc3NhZ2V9PC9wPmApO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVtb3ZlRXJyb3JNZXNzYWdlKCkge1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9tZXNzYWdlRGl2SWQpLmNoaWxkcmVuKCkucmVtb3ZlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICBwcml2YXRlIGluaXRTaW5nbGVBZEl0ZW1TdHlsZSgpOiB2b2lkIHtcclxuICAgICAgICAvL3Nob3cgZGV0YWlsIG9mIHNpbmdsZUFkSXRlbSB3aGVuIG1vdXNlIG92ZXJcclxuICAgICAgICAkKGRvY3VtZW50KS5vbihcIm1vdXNlZW50ZXIgbW91c2VsZWF2ZVwiLCBcIi5ibG9ja0Rpc3BsYXlcIiwgKGV2ZW50OiBKUXVlcnkuRXZlbnQ8SFRNTEVsZW1lbnQsIG51bGw+KSA9PiB7XHJcbiAgICAgICAgICAgICQoZXZlbnQuY3VycmVudFRhcmdldCkuZmluZChcIi5tb3JlSW5mb1wiKS5mYWRlVG9nZ2xlKDI1MCk7XHJcbiAgICAgICAgICAgIC8vJCh0aGlzKS5maW5kKFwiLm1vcmVJbmZvXCIpLmZhZGVUb2dnbGUoMjUwKTtcclxuICAgICAgICB9KTsvL2VuZCBvblxyXG4gICAgfS8vaW5pdFNpbmdsZUFkSXRlbVN0eWxlXHJcbn1cclxuXHJcbmxldCBjYXRlZ29yeVNlbGVjdG9yUGFyZW50RGl2SWQ6IHN0cmluZyA9IFwiY2F0ZWdvcnlTZWxlY3RvclwiO1xyXG5sZXQgYWxsQ2F0ZWdvcmllc0lkID0gXCJhbGxDYXRlZ29yaWVzXCI7XHJcblxyXG5kZWNsYXJlIGxldCB3aW5kb3c6IGFueTtcclxudmFyIGluZGV4OkluZGV4O1xyXG5cclxuXHJcbiQoZG9jdW1lbnQpLnJlYWR5KCgpID0+IHtcclxuICAgIGluZGV4PSBuZXcgSW5kZXgoY2F0ZWdvcnlTZWxlY3RvclBhcmVudERpdklkLCBhbGxDYXRlZ29yaWVzSWQpO1xyXG4gICAgaW5kZXguQ3VzdG9tQ3JpdGVyaWFDaGFuZ2VkKCk7Ly90byBpbml0aWF0ZSBhIHNlcnZlciBjYWxsIG9uIHBhZ2UgbG9hZCBmb3IgZmlyc3QgdGltZVxyXG4gICAgd2luZG93LkFsaUluZGV4ID0gaW5kZXg7XHJcbn0pOy8vcmVhZHkiLCLvu79pbXBvcnQge05ld0FkQ3JpdGVyaWF9IGZyb20gXCIuL05ld0FkQ3JpdGVyaWFcIjtcclxuaW1wb3J0IHtJQ3JpdGVyaWFDaGFuZ2V9IGZyb20gXCIuLi8uLi8uLi9IZWxwZXIvSUNyaXRlcmlhQ2hhbmdlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTmV3QWRQYXJ0aWFsVmlld0xvYWRlciB7XHJcbiAgICBwcml2YXRlIF9wYXJ0aWFsVmlld0RpdklkOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIF91cmw6IHN0cmluZyA9IFwiL05ld0FkL0dldE5ld0FkUGFydGlhbFZpZXdcIjtcclxuICAgIHByaXZhdGUgX3ByZXZpb3VzQ2F0ZWdvcnlJZDogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgX2N1cnJlbnRDYXRlZ29yeUlkOiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBfbmV3QWRDcml0ZXJpYUNoYW5nZTogSUNyaXRlcmlhQ2hhbmdlO1xyXG4gICAgcHJpdmF0ZSBfbmV3QWRDcml0ZXJpYTogTmV3QWRDcml0ZXJpYTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwYXJ0aWFsVmlld0RpdklkOiBzdHJpbmcsIG5ld0FkQ3JpdGVyaWFDaGFuZ2U6IElDcml0ZXJpYUNoYW5nZSwgbmV3QWRDcml0ZXJpYTpOZXdBZENyaXRlcmlhKSB7XHJcbiAgICAgICAgdGhpcy5fcGFydGlhbFZpZXdEaXZJZCA9IHBhcnRpYWxWaWV3RGl2SWQ7XHJcbiAgICAgICAgdGhpcy5fbmV3QWRDcml0ZXJpYUNoYW5nZSA9IG5ld0FkQ3JpdGVyaWFDaGFuZ2U7XHJcbiAgICAgICAgdGhpcy5fbmV3QWRDcml0ZXJpYSA9IG5ld0FkQ3JpdGVyaWE7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIEdldFBhcnRpYWxWaWV3RnJvbVNlcnZlcihjYXRlZ29yeUlkOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9jdXJyZW50Q2F0ZWdvcnlJZCA9IGNhdGVnb3J5SWQ7XHJcbiAgICAgICAgbGV0IGNhbGxQYXJhbXMgPSBuZXcgUGFydGlhbFZpZXdTZXJ2ZXJDYWxsUGFyYW1ldGVycygpO1xyXG4gICAgICAgIGNhbGxQYXJhbXMuQ2F0ZWdvcnlJZCA9IGNhdGVnb3J5SWQ7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogXCJHRVRcIiwgLy9HRVQgb3IgUE9TVCBvciBQVVQgb3IgREVMRVRFIHZlcmJcclxuICAgICAgICAgICAgdXJsOiB0aGlzLl91cmwsXHJcbiAgICAgICAgICAgIGRhdGE6IGNhbGxQYXJhbXMsIC8vRGF0YSBzZW50IHRvIHNlcnZlclxyXG4gICAgICAgICAgICAvL2NvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbicsIC8vIGNvbnRlbnQgdHlwZSBzZW50IHRvIHNlcnZlclxyXG4gICAgICAgICAgICBzdWNjZXNzOiAobXNnLCB0ZXh0U3RhdHVzLCBqcVhIUikgPT4gdGhpcy5vblN1Y2Nlc3NHZXRJdGVtc0Zyb21TZXJ2ZXIobXNnLCB0ZXh0U3RhdHVzLCBqcVhIUiksLy9PbiBTdWNjZXNzZnVsbCBzZXJ2aWNlIGNhbGxcclxuICAgICAgICAgICAgZXJyb3I6IChqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pID0+IHRoaXMub25FcnJvckdldEl0ZW1zRnJvbVNlcnZlcihqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pLy8gV2hlbiBTZXJ2aWNlIGNhbGwgZmFpbHNcclxuICAgICAgICB9KTsvLy5hamF4XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvblN1Y2Nlc3NHZXRJdGVtc0Zyb21TZXJ2ZXIobXNnOiBhbnksIHRleHRTdGF0dXM6IHN0cmluZywganFYSFI6IEpRdWVyeVhIUikge1xyXG4gICAgICAgIHRoaXMuX25ld0FkQ3JpdGVyaWEuVW5CaW5kKHRoaXMuX3ByZXZpb3VzQ2F0ZWdvcnlJZCk7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX3BhcnRpYWxWaWV3RGl2SWQpLmNoaWxkcmVuKCkucmVtb3ZlKCk7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX3BhcnRpYWxWaWV3RGl2SWQpLmh0bWwobXNnKTtcclxuICAgICAgICB0aGlzLl9uZXdBZENyaXRlcmlhLkJpbmQodGhpcy5fY3VycmVudENhdGVnb3J5SWQsIHRoaXMuX25ld0FkQ3JpdGVyaWFDaGFuZ2UpO1xyXG4gICAgICAgIHRoaXMuX3ByZXZpb3VzQ2F0ZWdvcnlJZCA9IHRoaXMuX2N1cnJlbnRDYXRlZ29yeUlkO1xyXG4gICAgfS8vb25TdWNjZXNzR2V0VGltZUZyb21TZXJ2ZXJcclxuXHJcbiAgICBwcml2YXRlIG9uRXJyb3JHZXRJdGVtc0Zyb21TZXJ2ZXIoanFYSFI6IEpRdWVyeVhIUiwgdGV4dFN0YXR1czogc3RyaW5nLCBlcnJvclRocm93bjogc3RyaW5nKSB7XHJcbiAgICAgICAgYWxlcnQoZXJyb3JUaHJvd24pO1xyXG4gICAgfS8vb25FcnJvckdldFRpbWVGcm9tU2VydmVyXHJcbn1cclxuXHJcbi8vVE9ETyByZWZhY3RvciB0aGlzXHJcbmV4cG9ydCBjbGFzcyBQYXJ0aWFsVmlld1NlcnZlckNhbGxQYXJhbWV0ZXJzIHtcclxuICAgIHB1YmxpYyBDYXRlZ29yeUlkOm51bWJlcjtcclxufSJdfQ==
