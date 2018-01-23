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
                    .ParentCategoryId;
                this.setFirstLevelToSpecificId(firstLevelId);
                this.createSecondLevel(firstLevelId);
                this.setSecondLevelToSpecificId(selectedCategoryId);
                this.createThirdLevel(selectedCategoryId);
                $("#" + this._secondLevelSelect).trigger("change");
                break;
            case CategoryLevel.Level3:
                this.CreateFirstLevel();
                secondLevelId = this._allCategories.filter(function (category) { return category.CategoryId === selectedCategoryId; })[0]
                    .ParentCategoryId;
                firstLevelId = this._allCategories.filter(function (category) { return category.CategoryId === secondLevelId; })[0]
                    .ParentCategoryId;
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
            if (category.ParentCategoryId === _this._rootCategoryId) {
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
            if (category.ParentCategoryId === firstLevelCategoryId) {
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
            if (category.ParentCategoryId === secondLevelCategoryId) {
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
        return this._allCategories.filter(function (category) { return category.ParentCategoryId === selectedCategoryId; }).length > 0;
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
},{"../../Events/EventDispatcher":3}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CriteriaNumericDictionary = /** @class */ (function () {
    function CriteriaNumericDictionary() {
    }
    return CriteriaNumericDictionary;
}());
exports.CriteriaNumericDictionary = CriteriaNumericDictionary;
},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UserInput = /** @class */ (function () {
    function UserInput() {
        this.ParametersDictionary = {};
    }
    return UserInput;
}());
exports.UserInput = UserInput;
},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CategorySelection_1 = require("../../../Components/Category/CategorySelection");
var UserInput_1 = require("../../../Helper/UserInput");
var LetMeKnowServerCaller_1 = require("./LetMeKnowServerCaller");
var LetMeKnowPartialViewLoader_1 = require("./LetMeKnowPartialViewLoader");
var LetMeKnowCriteria_1 = require("./LetMeKnowCriteria");
var LetMeKnow = /** @class */ (function () {
    function LetMeKnow(categorySelectorParentDivId, allCategoriesId) {
        this.EmailOrSmsKey = "EmailOrSms";
        this.EmailOrSmsParentDivId = "emailOrSms";
        this._registerLetMeKnowInputId = "registerLetMeKnow";
        this._categorySpecificCriteriaDivId = "CategorySpecificCriteria";
        this.initCategorySelect(categorySelectorParentDivId, allCategoriesId);
        this._letMeKnowServerCaller = new LetMeKnowServerCaller_1.LetMeKnowServerCaller();
        this._letMeKnowCriteria = new LetMeKnowCriteria_1.LetMeKnowCriteria();
        this._letMeKnowPartialViewLoader =
            new LetMeKnowPartialViewLoader_1.LetMeKnowPartialViewLoader(this._categorySpecificCriteriaDivId, this, this._letMeKnowCriteria);
        this.initEventHandlers();
    }
    LetMeKnow.prototype.CustomCriteriaChanged = function () {
    };
    LetMeKnow.prototype.initCategorySelect = function (categorySelectorParentDivId, allCategoriesId) {
        var allCategoriesString = $("#" + allCategoriesId).val().toString();
        var allCategories = $.parseJSON(allCategoriesString);
        this._categorySelection = new CategorySelection_1.CategorySelection(categorySelectorParentDivId, allCategories);
        this._categorySelection.CreateFirstLevel();
    };
    LetMeKnow.prototype.initEventHandlers = function () {
        var _this = this;
        this._categorySelection.SelectedCategoryChangedEvent.Subscribe(function (sender, args) {
            _this._letMeKnowPartialViewLoader.GetPartialViewFromServer(args.SelectedCategoryId);
        });
        $("#" + this._registerLetMeKnowInputId).on("click", function (event) {
            event.preventDefault();
            _this.registerLetMeKnow();
        });
    };
    LetMeKnow.prototype.registerLetMeKnow = function () {
        //TODO disable submitAd Button until current submission is ok or errornous 
        var userInput = new UserInput_1.UserInput();
        this._categorySelection.InsertCategoryIdInUserInputDictionary(userInput);
        userInput.ParametersDictionary[this.EmailOrSmsKey] = $("#" + this.EmailOrSmsParentDivId).children(":checked").val();
        ; //TODO make a ui view (radio button)
        this._letMeKnowCriteria.FillCategorySpecificLetMeKnowCriteria(this._categorySelection.GetSelectedCategoryId(), userInput);
        this._letMeKnowServerCaller.SaveAd(userInput);
    };
    return LetMeKnow;
}());
exports.LetMeKnow = LetMeKnow;
var categorySelectorParentDivId = "categorySelector";
var allCategoriesId = "allCategories";
$(document).ready(function () {
    var letMeKnow = new LetMeKnow(categorySelectorParentDivId, allCategoriesId);
});
},{"../../../Components/Category/CategorySelection":1,"../../../Helper/UserInput":5,"./LetMeKnowCriteria":7,"./LetMeKnowPartialViewLoader":10,"./LetMeKnowServerCaller":11}],7:[function(require,module,exports){
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
},{"../../../Helper/CriteriaNumericDictionary":4,"./LetMeKnowCriteria/AdTransportationLetMeKnowCriteria":8,"./LetMeKnowCriteria/DefaultLetMeKnowCriteria":9}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CarModelBrandController_1 = require("../../../../Components/Transformation/CarModelBrandController");
var AdTransportationLetMeKnowCriteria = /** @class */ (function () {
    function AdTransportationLetMeKnowCriteria() {
        this.MakeYearKey = "MakeYear";
        this.MakeYearInputId = "makeYear";
        this.FuelKey = "Fuel";
        this.FuelSelectId = "fuel";
        this.GearboxKey = "Gearbox";
        this.GearboxTypeParentDivId = "gearboxType";
        this.CarStatusKey = "CarStatus";
        this.CarStatusParentDivId = "carStatus";
        this.MileageKey = "Mileage";
        this.MileageInputId = "mileage";
        this.PlateTypeKey = "PlateType";
        this.PlateTypeParentDivId = "plateType";
        this.BodyStatusKey = "BodyStatus";
        this.BodyStatusSelectId = "bodyStatus";
        this.BodyColorKey = "BodyColor";
        this.BodyColorSelectId = "bodyColor";
        this.InternalColorKey = "InternalColor";
        this.InternalColorSelectId = "internalColor";
    }
    AdTransportationLetMeKnowCriteria.prototype.ValidateCriteria = function () { throw new Error("Not implemented"); };
    AdTransportationLetMeKnowCriteria.prototype.initView = function () {
        this._carModelBrandContoller = new CarModelBrandController_1.CarModelBrandController();
    };
    AdTransportationLetMeKnowCriteria.prototype.FillCriteria = function (userInput) {
        //TODO validate user input then proceed
        this._carModelBrandContoller.FillCriteria(userInput);
        //userInput.ParametersDictionary[this.MakeYearKey] = $("#" + this.MakeYearInputId).val();//MakeYear
        //userInput.ParametersDictionary[this.FuelKey] = $("#" + this.FuelSelectId).find("option:selected").val();//Fuel
        //userInput.ParametersDictionary[this.MileageKey] = $("#" + this.MileageInputId).val();//Mileage
        //userInput.ParametersDictionary[this.GearboxKey] = $("#" + this.GearboxTypeParentDivId).children(":checked").val();
        //userInput.ParametersDictionary[this.BodyColorKey] = $("#" + this.BodyColorSelectId).find("option:selected").val();
        //userInput.ParametersDictionary[this.InternalColorKey] = $("#" + this.InternalColorSelectId).find("option:selected").val();
        //userInput.ParametersDictionary[this.BodyStatusKey] = $("#" + this.BodyStatusSelectId).find("option:selected").val();
        //userInput.ParametersDictionary[this.CarStatusKey] = $("#" + this.CarStatusParentDivId).children(":checked").val();
        //userInput.ParametersDictionary[this.PlateTypeKey] = $("#" + this.PlateTypeParentDivId).children(":checked").val();
    };
    AdTransportationLetMeKnowCriteria.prototype.BindEvents = function (criteriaChange) {
        this.initView();
        this._carModelBrandContoller.BindEvents(criteriaChange);
    };
    AdTransportationLetMeKnowCriteria.prototype.UnBindEvents = function () {
        this._carModelBrandContoller.UnBindEvents();
    };
    return AdTransportationLetMeKnowCriteria;
}());
exports.AdTransportationLetMeKnowCriteria = AdTransportationLetMeKnowCriteria;
},{"../../../../Components/Transformation/CarModelBrandController":2}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DefaultLetMeKnowCriteria = /** @class */ (function () {
    function DefaultLetMeKnowCriteria() {
    }
    DefaultLetMeKnowCriteria.prototype.FillCriteria = function (searchAdUserInput) {
    };
    DefaultLetMeKnowCriteria.prototype.BindEvents = function (criteriaChange) {
    };
    DefaultLetMeKnowCriteria.prototype.UnBindEvents = function () {
    };
    DefaultLetMeKnowCriteria.prototype.ValidateCriteria = function () {
        throw new Error("Not implemented");
    };
    return DefaultLetMeKnowCriteria;
}());
exports.DefaultLetMeKnowCriteria = DefaultLetMeKnowCriteria;
},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NewAdPartialViewLoader_1 = require("../../../home/newAd/src/NewAdPartialViewLoader");
var LetMeKnowPartialViewLoader = /** @class */ (function () {
    function LetMeKnowPartialViewLoader(partialViewDivId, criteriaChange, letMeKnowCriteria) {
        this._url = "/LetMeKnow/GetLetMeKnowPartialView";
        this._previousCategoryId = 0;
        this._currentCategoryId = 0;
        this._partialViewDivId = partialViewDivId;
        this._criteriaChange = criteriaChange;
        this._letMeKnowCriteria = letMeKnowCriteria;
    }
    LetMeKnowPartialViewLoader.prototype.GetPartialViewFromServer = function (categoryId) {
        var _this = this;
        this._currentCategoryId = categoryId;
        var callParams = new NewAdPartialViewLoader_1.PartialViewServerCallParameters();
        callParams.CategoryId = categoryId;
        $.ajax({
            type: "GET",
            url: this._url,
            data: callParams,
            success: function (msg, textStatus, jqXHR) { return _this.onSuccessGetItemsFromServer(msg, textStatus, jqXHR); },
            error: function (jqXHR, textStatus, errorThrown) { return _this.onErrorGetItemsFromServer(jqXHR, textStatus, errorThrown); } // When Service call fails
        }); //.ajax
    };
    LetMeKnowPartialViewLoader.prototype.onSuccessGetItemsFromServer = function (msg, textStatus, jqXHR) {
        this._letMeKnowCriteria.UnBind(this._previousCategoryId);
        $("#" + this._partialViewDivId).children().remove();
        $("#" + this._partialViewDivId).html(msg);
        this._letMeKnowCriteria.Bind(this._currentCategoryId, this._criteriaChange);
        this._previousCategoryId = this._currentCategoryId;
    }; //onSuccessGetTimeFromServer
    LetMeKnowPartialViewLoader.prototype.onErrorGetItemsFromServer = function (jqXHR, textStatus, errorThrown) {
        alert(errorThrown);
    }; //onErrorGetTimeFromServer
    return LetMeKnowPartialViewLoader;
}());
exports.LetMeKnowPartialViewLoader = LetMeKnowPartialViewLoader;
},{"../../../home/newAd/src/NewAdPartialViewLoader":12}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LetMeKnowServerCaller = /** @class */ (function () {
    function LetMeKnowServerCaller() {
        //TODO call server and send userinput fro new ad
        //get result and show to user
        this._url = "/api/LetMeKnowApi/AddNewLetMeKnowRecord";
        this.MessageDivId = "message";
    }
    LetMeKnowServerCaller.prototype.SaveAd = function (userInput) {
        var _this = this;
        $.ajax({
            type: "POST",
            url: this._url,
            data: JSON.stringify(userInput.ParametersDictionary),
            contentType: 'application/json',
            success: function (msg, textStatus, jqXHR) { return _this.onSuccessGetItemsFromServer(msg, textStatus, jqXHR); },
            error: function (jqXHR, textStatus, errorThrown) { return _this.onErrorGetItemsFromServer(jqXHR, textStatus, errorThrown); } // When Service call fails
        }); //.ajax
    };
    LetMeKnowServerCaller.prototype.onSuccessGetItemsFromServer = function (msg, textStatus, jqXHR) {
        //TODO redirect user to a new page
        if (msg.Success == true) {
            document.location.replace("/LetMeKnow/Confirm");
        }
        else {
            //$("#" + this.MessageDivId).children().remove();
            $("#" + this.MessageDivId).html("<p>" + msg.Message + " ," + msg.ErrorCode + "</p>");
        }
    };
    LetMeKnowServerCaller.prototype.onErrorGetItemsFromServer = function (jqXHR, textStatus, errorThrown) {
        //TODO inform error to user
    };
    return LetMeKnowServerCaller;
}());
exports.LetMeKnowServerCaller = LetMeKnowServerCaller;
},{}],12:[function(require,module,exports){
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
},{}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3d3dyb290L2pzL0NvbXBvbmVudHMvQ2F0ZWdvcnkvQ2F0ZWdvcnlTZWxlY3Rpb24udHMiLCJ3d3dyb290L2pzL0NvbXBvbmVudHMvVHJhbnNmb3JtYXRpb24vQ2FyTW9kZWxCcmFuZENvbnRyb2xsZXIudHMiLCJ3d3dyb290L2pzL0V2ZW50cy9FdmVudERpc3BhdGNoZXIudHMiLCJ3d3dyb290L2pzL0hlbHBlci9Dcml0ZXJpYU51bWVyaWNEaWN0aW9uYXJ5LnRzIiwid3d3cm9vdC9qcy9IZWxwZXIvVXNlcklucHV0LnRzIiwid3d3cm9vdC9qcy9MZXRNZUtub3cvaW5kZXgvc3JjL0xldE1lS25vdy50cyIsInd3d3Jvb3QvanMvTGV0TWVLbm93L2luZGV4L3NyYy9MZXRNZUtub3dDcml0ZXJpYS50cyIsInd3d3Jvb3QvanMvTGV0TWVLbm93L2luZGV4L3NyYy9MZXRNZUtub3dDcml0ZXJpYS9BZFRyYW5zcG9ydGF0aW9uTGV0TWVLbm93Q3JpdGVyaWEudHMiLCJ3d3dyb290L2pzL0xldE1lS25vdy9pbmRleC9zcmMvTGV0TWVLbm93Q3JpdGVyaWEvRGVmYXVsdExldE1lS25vd0NyaXRlcmlhLnRzIiwid3d3cm9vdC9qcy9MZXRNZUtub3cvaW5kZXgvc3JjL0xldE1lS25vd1BhcnRpYWxWaWV3TG9hZGVyLnRzIiwid3d3cm9vdC9qcy9MZXRNZUtub3cvaW5kZXgvc3JjL0xldE1lS25vd1NlcnZlckNhbGxlci50cyIsInd3d3Jvb3QvanMvaG9tZS9uZXdBZC9zcmMvTmV3QWRQYXJ0aWFsVmlld0xvYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUMsZ0VBQStEO0FBSWhFO0lBMkJJLDJCQUFZLFdBQW1CLEVBQUUsYUFBeUI7UUF6Qm5ELGlDQUE0QixHQUFnRSxJQUFJLGlDQUFlLEVBQThDLENBQUM7UUFFcEosa0JBQWEsR0FBRyxZQUFZLENBQUM7UUFLN0Is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LDRCQUE0QjtJQUVyQiwwREFBeUIsR0FBakMsVUFBa0MsS0FBZ0IsRUFBRSxVQUFrQixFQUFFLFdBQW1CO1FBQ3ZGLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUN2QixDQUFDLEVBQUEsMEJBQTBCO0lBQy9CLDZCQUFDO0FBQUQsQ0F2Q0EsQUF1Q0MsSUFBQTtBQXZDWSx3REFBc0I7QUF5Q25DLG9CQUFvQjtBQUNwQjtJQUFBO0lBRUEsQ0FBQztJQUFELHNDQUFDO0FBQUQsQ0FGQSxBQUVDLElBQUE7QUFGWSwwRUFBK0IiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwi77u/aW1wb3J0IHsgRXZlbnREaXNwYXRjaGVyIH0gZnJvbSBcIi4uLy4uL0V2ZW50cy9FdmVudERpc3BhdGNoZXJcIjtcclxuaW1wb3J0IHsgQ2F0ZWdvcnkgfSBmcm9tIFwiLi4vLi4vTW9kZWxzL0NhdGVnb3J5XCI7XHJcbmltcG9ydCB7IFVzZXJJbnB1dCB9IGZyb20gXCIuLi8uLi9IZWxwZXIvVXNlcklucHV0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQ2F0ZWdvcnlTZWxlY3Rpb24ge1xyXG5cclxuICAgIHB1YmxpYyBTZWxlY3RlZENhdGVnb3J5Q2hhbmdlZEV2ZW50OiBFdmVudERpc3BhdGNoZXI8Q2F0ZWdvcnlTZWxlY3Rpb24sIENhdGVnb3J5Q2FobmdlZEV2ZW50QXJnPiA9IG5ldyBFdmVudERpc3BhdGNoZXI8Q2F0ZWdvcnlTZWxlY3Rpb24sIENhdGVnb3J5Q2FobmdlZEV2ZW50QXJnPigpO1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgQ2F0ZWdvcnlJZEtleSA9IFwiQ2F0ZWdvcnlJZFwiO1xyXG5cclxuICAgIHByaXZhdGUgX3BhcmVudERpdklkOiBzdHJpbmc7Ly9kaXYgZWxlbWVudCB0aGF0IGhvbGRzIGFsbCBDYXRlZ29yeVNlbGVjdGlvbiBlbGVtZW50c1xyXG4gICAgcHJpdmF0ZSBfYWxsQ2F0ZWdvcmllczogQ2F0ZWdvcnlbXTtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9maXJzdExldmVsVGVtcGxhdGUgPSBcImNhdGVnb3J5MVRlbXBsYXRlXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9maXJzdExldmVsRGl2ID0gXCJjYXRlZ29yeTFcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2ZpcnN0TGV2ZWxTZWxlY3Q6IHN0cmluZyA9IFwic2VsZWN0MVwiO1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX3NlY29uZExldmVsVGVtcGxhdGUgPSBcImNhdGVnb3J5MlRlbXBsYXRlXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9zZWNvbmRMZXZlbERpdiA9IFwiY2F0ZWdvcnkyXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9zZWNvbmRMZXZlbFNlbGVjdDogc3RyaW5nID0gXCJzZWxlY3QyXCI7XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfdGhpcmRMZXZlbFRlbXBsYXRlID0gXCJjYXRlZ29yeTNUZW1wbGF0ZVwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfdGhpcmRMZXZlbERpdiA9IFwiY2F0ZWdvcnkzXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF90aGlyZExldmVsU2VsZWN0OiBzdHJpbmcgPSBcInNlbGVjdDNcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX3Jvb3RDYXRlZ29yeUlkOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIHByaXZhdGUgX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsT25lOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIF9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFR3bzogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBfc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUaHJlZTogbnVtYmVyO1xyXG5cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwYXJlbnREaXZJZDogc3RyaW5nLCBhbGxDYXRlZ29yaWVzOiBDYXRlZ29yeVtdKSB7XHJcbiAgICAgICAgdGhpcy5fcGFyZW50RGl2SWQgPSBwYXJlbnREaXZJZDtcclxuICAgICAgICB0aGlzLl9hbGxDYXRlZ29yaWVzID0gYWxsQ2F0ZWdvcmllcztcclxuICAgIH1cclxuXHJcbiAgICBcclxuXHJcbiAgICBwdWJsaWMgU2V0Q2F0ZWdvcnlJZChzZWxlY3RlZENhdGVnb3J5SWQ6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIGxldCBmaXJzdExldmVsSWQ6IG51bWJlcjtcclxuICAgICAgICBsZXQgc2Vjb25kTGV2ZWxJZDogbnVtYmVyO1xyXG4gICAgICAgIGxldCBjYXRlZ29yeUxldmVsID0gdGhpcy5nZXRDYXRlZ29yeUxldmVsKHNlbGVjdGVkQ2F0ZWdvcnlJZCk7XHJcbiAgICAgICAgc3dpdGNoIChjYXRlZ29yeUxldmVsKSB7XHJcbiAgICAgICAgY2FzZSBDYXRlZ29yeUxldmVsLlVua293bjpcclxuICAgICAgICAgICAgdGhpcy5DcmVhdGVGaXJzdExldmVsKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBDYXRlZ29yeUxldmVsLkxldmVsMTpcclxuICAgICAgICAgICAgICAgIHRoaXMuQ3JlYXRlRmlyc3RMZXZlbCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRGaXJzdExldmVsVG9TcGVjaWZpY0lkKHNlbGVjdGVkQ2F0ZWdvcnlJZCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVNlY29uZExldmVsKHNlbGVjdGVkQ2F0ZWdvcnlJZCk7XHJcbiAgICAgICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5fZmlyc3RMZXZlbFNlbGVjdCkudHJpZ2dlcihcImNoYW5nZVwiKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIENhdGVnb3J5TGV2ZWwuTGV2ZWwyOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5DcmVhdGVGaXJzdExldmVsKCk7XHJcbiAgICAgICAgICAgICAgICBmaXJzdExldmVsSWQgPSB0aGlzLl9hbGxDYXRlZ29yaWVzLmZpbHRlcihjYXRlZ29yeSA9PiBjYXRlZ29yeS5DYXRlZ29yeUlkID09PSBzZWxlY3RlZENhdGVnb3J5SWQpWzBdXHJcbiAgICAgICAgICAgICAgICAgICAgLlBhcmVudENhdGVnb3J5SWQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldEZpcnN0TGV2ZWxUb1NwZWNpZmljSWQoZmlyc3RMZXZlbElkKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlU2Vjb25kTGV2ZWwoZmlyc3RMZXZlbElkKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0U2Vjb25kTGV2ZWxUb1NwZWNpZmljSWQoc2VsZWN0ZWRDYXRlZ29yeUlkKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlVGhpcmRMZXZlbChzZWxlY3RlZENhdGVnb3J5SWQpO1xyXG4gICAgICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuX3NlY29uZExldmVsU2VsZWN0KS50cmlnZ2VyKFwiY2hhbmdlXCIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBDYXRlZ29yeUxldmVsLkxldmVsMzpcclxuICAgICAgICAgICAgdGhpcy5DcmVhdGVGaXJzdExldmVsKCk7XHJcbiAgICAgICAgICAgIHNlY29uZExldmVsSWQgPSB0aGlzLl9hbGxDYXRlZ29yaWVzLmZpbHRlcihjYXRlZ29yeSA9PiBjYXRlZ29yeS5DYXRlZ29yeUlkID09PSBzZWxlY3RlZENhdGVnb3J5SWQpWzBdXHJcbiAgICAgICAgICAgICAgICAgICAgLlBhcmVudENhdGVnb3J5SWQ7XHJcbiAgICAgICAgICAgIGZpcnN0TGV2ZWxJZCA9IHRoaXMuX2FsbENhdGVnb3JpZXMuZmlsdGVyKGNhdGVnb3J5ID0+IGNhdGVnb3J5LkNhdGVnb3J5SWQgPT09IHNlY29uZExldmVsSWQpWzBdXHJcbiAgICAgICAgICAgICAgICAuUGFyZW50Q2F0ZWdvcnlJZDtcclxuICAgICAgICAgICAgdGhpcy5zZXRGaXJzdExldmVsVG9TcGVjaWZpY0lkKGZpcnN0TGV2ZWxJZCk7XHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlU2Vjb25kTGV2ZWwoZmlyc3RMZXZlbElkKTtcclxuICAgICAgICAgICAgdGhpcy5zZXRTZWNvbmRMZXZlbFRvU3BlY2lmaWNJZChzZWNvbmRMZXZlbElkKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlVGhpcmRMZXZlbChzZWNvbmRMZXZlbElkKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0VGhpcmRMZXZlbFRvU3BlY2lmaWNJZChzZWxlY3RlZENhdGVnb3J5SWQpO1xyXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5fdGhpcmRMZXZlbFNlbGVjdCkudHJpZ2dlcihcImNoYW5nZVwiKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0Rmlyc3RMZXZlbFRvU3BlY2lmaWNJZChjYXRlZ29yeUlkOiBudW1iZXIpIHtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fZmlyc3RMZXZlbFNlbGVjdCkudmFsKGNhdGVnb3J5SWQpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBzZXRTZWNvbmRMZXZlbFRvU3BlY2lmaWNJZChjYXRlZ29yeUlkOiBudW1iZXIpIHtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fc2Vjb25kTGV2ZWxTZWxlY3QpLnZhbChjYXRlZ29yeUlkKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgc2V0VGhpcmRMZXZlbFRvU3BlY2lmaWNJZChjYXRlZ29yeUlkOiBudW1iZXIpIHtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fdGhpcmRMZXZlbFNlbGVjdCkudmFsKGNhdGVnb3J5SWQpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBnZXRDYXRlZ29yeUxldmVsKGNhdGVnb3J5SWQ6IG51bWJlcik6IENhdGVnb3J5TGV2ZWwge1xyXG5cclxuICAgICAgICBsZXQgdGVtcENhdGVnb3J5QXJyYXkgPSB0aGlzLl9hbGxDYXRlZ29yaWVzLmZpbHRlcihjYXRlZ29yeSA9PiBjYXRlZ29yeS5DYXRlZ29yeUlkID09PSBjYXRlZ29yeUlkKTtcclxuICAgICAgICBsZXQgdGVtcENhdGVnb3J5O1xyXG4gICAgICAgIGlmICh0ZW1wQ2F0ZWdvcnlBcnJheS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIENhdGVnb3J5TGV2ZWwuVW5rb3duO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0ZW1wQ2F0ZWdvcnkgPSB0ZW1wQ2F0ZWdvcnlBcnJheVswXTtcclxuICAgICAgICBpZiAodGVtcENhdGVnb3J5LlBhcmVudENhdGVnb3J5SWQgPT09IHRoaXMuX3Jvb3RDYXRlZ29yeUlkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBDYXRlZ29yeUxldmVsLkxldmVsMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGVtcENhdGVnb3J5ID0gdGhpcy5fYWxsQ2F0ZWdvcmllcy5maWx0ZXIoY2F0ZWdvcnkgPT4gY2F0ZWdvcnkuQ2F0ZWdvcnlJZCA9PT0gdGVtcENhdGVnb3J5LlBhcmVudENhdGVnb3J5SWQpWzBdO1xyXG4gICAgICAgIGlmICh0ZW1wQ2F0ZWdvcnkuUGFyZW50Q2F0ZWdvcnlJZCA9PT0gdGhpcy5fcm9vdENhdGVnb3J5SWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIENhdGVnb3J5TGV2ZWwuTGV2ZWwyO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gQ2F0ZWdvcnlMZXZlbC5MZXZlbDM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIEluc2VydENhdGVnb3J5SWRJblVzZXJJbnB1dERpY3Rpb25hcnkodXNlcklucHV0OiBVc2VySW5wdXQpOiB2b2lkIHtcclxuICAgICAgICBsZXQgY2F0ZWdvcnlJZCA9IHRoaXMuR2V0U2VsZWN0ZWRDYXRlZ29yeUlkKCk7XHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuQ2F0ZWdvcnlJZEtleV0gPSBjYXRlZ29yeUlkOy8vMTAwIGZvciBjYXJzXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIEdldFNlbGVjdGVkQ2F0ZWdvcnlJZCgpOiBudW1iZXIge1xyXG4gICAgICAgIGlmICh0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFRocmVlICE9PSB1bmRlZmluZWQgJiZcclxuICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUaHJlZSAhPT0gdGhpcy5fcm9vdENhdGVnb3J5SWQpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFRocmVlO1xyXG4gICAgICAgIGVsc2UgaWYgKHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVHdvICE9PSB1bmRlZmluZWQgJiZcclxuICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUd28gIT09IHRoaXMuX3Jvb3RDYXRlZ29yeUlkKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUd287XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxPbmU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIENyZWF0ZUZpcnN0TGV2ZWwoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVFbGVtZW50KHRoaXMuX2ZpcnN0TGV2ZWxEaXYpO1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsT25lID0gdGhpcy5fcm9vdENhdGVnb3J5SWQ7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVFbGVtZW50KHRoaXMuX3NlY29uZExldmVsRGl2KTtcclxuICAgICAgICB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFR3byA9IHRoaXMuX3Jvb3RDYXRlZ29yeUlkO1xyXG4gICAgICAgIHRoaXMucmVtb3ZlRWxlbWVudCh0aGlzLl90aGlyZExldmVsRGl2KTtcclxuICAgICAgICB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFRocmVlID0gdGhpcy5fcm9vdENhdGVnb3J5SWQ7XHJcblxyXG4gICAgICAgIGxldCB0ZW1wbGF0ZSA9ICQoXCIjXCIgKyB0aGlzLl9maXJzdExldmVsVGVtcGxhdGUpLmh0bWwoKTtcclxuICAgICAgICBsZXQgY2F0ZWdvcmllczogQ2F0ZWdvcnlbXSA9IG5ldyBBcnJheTxDYXRlZ29yeT4oKTtcclxuICAgICAgICBsZXQgZGF0YSA9IHsgY2F0ZWdvcmllczogY2F0ZWdvcmllcyB9XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxPbmUgPSB0aGlzLl9yb290Q2F0ZWdvcnlJZDsvL1xyXG4gICAgICAgIHRoaXMuX2FsbENhdGVnb3JpZXMuZm9yRWFjaChjYXRlZ29yeSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChjYXRlZ29yeS5QYXJlbnRDYXRlZ29yeUlkID09PSB0aGlzLl9yb290Q2F0ZWdvcnlJZCkge1xyXG4gICAgICAgICAgICAgICAgY2F0ZWdvcmllcy5wdXNoKGNhdGVnb3J5KTtcclxuICAgICAgICAgICAgfS8vaWZcclxuICAgICAgICB9KTsvL2ZvckVhY2hcclxuXHJcbiAgICAgICAgbGV0IGh0bWwgPSBNdXN0YWNoZS50b19odG1sKHRlbXBsYXRlLCBkYXRhKTtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fcGFyZW50RGl2SWQpLmFwcGVuZChodG1sKTtcclxuXHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX2ZpcnN0TGV2ZWxTZWxlY3QpLmNoYW5nZSgoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgbGV0IHNlbGVjdGVkSWQgPSBwYXJzZUludCgkKGV2ZW50LmN1cnJlbnRUYXJnZXQpLnZhbCgpLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbE9uZSA9IHNlbGVjdGVkSWQ7XHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlU2Vjb25kTGV2ZWwoc2VsZWN0ZWRJZCk7XHJcbiAgICAgICAgICAgIGxldCBldmVudEFyZyA9IG5ldyBDYXRlZ29yeUNhaG5nZWRFdmVudEFyZygpO1xyXG4gICAgICAgICAgICBldmVudEFyZy5TZWxlY3RlZENhdGVnb3J5SWQgPSB0aGlzLkdldFNlbGVjdGVkQ2F0ZWdvcnlJZCgpO1xyXG4gICAgICAgICAgICBldmVudEFyZy5TZWxlY3RlZENhdGVnb3J5SGFzQ2hpbGQgPSB0aGlzLnNlbGVjdGVkQ2F0ZWdvcnlIYXNDaGlsZHJlbigpO1xyXG4gICAgICAgICAgICB0aGlzLlNlbGVjdGVkQ2F0ZWdvcnlDaGFuZ2VkRXZlbnQuRGlzcGF0Y2godGhpcywgZXZlbnRBcmcpO1xyXG4gICAgICAgIH0pOy8vY2hhbmdlXHJcbiAgICB9Ly9DcmVhdGVGaXJzdExldmVsXHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVTZWNvbmRMZXZlbChmaXJzdExldmVsQ2F0ZWdvcnlJZDogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVFbGVtZW50KHRoaXMuX3NlY29uZExldmVsRGl2KTtcclxuICAgICAgICB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFR3byA9IHRoaXMuX3Jvb3RDYXRlZ29yeUlkO1xyXG4gICAgICAgIHRoaXMucmVtb3ZlRWxlbWVudCh0aGlzLl90aGlyZExldmVsRGl2KTtcclxuICAgICAgICB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFRocmVlID0gdGhpcy5fcm9vdENhdGVnb3J5SWQ7XHJcbiAgICAgICAgaWYgKGZpcnN0TGV2ZWxDYXRlZ29yeUlkID09PSB0aGlzLl9yb290Q2F0ZWdvcnlJZCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgdGVtcGxhdGUgPSAkKFwiI1wiICsgdGhpcy5fc2Vjb25kTGV2ZWxUZW1wbGF0ZSkuaHRtbCgpO1xyXG4gICAgICAgIGxldCBjYXRlZ29yaWVzOiBDYXRlZ29yeVtdID0gbmV3IEFycmF5PENhdGVnb3J5PigpO1xyXG4gICAgICAgIGxldCBkYXRhID0geyBjYXRlZ29yaWVzOiBjYXRlZ29yaWVzIH1cclxuXHJcbiAgICAgICAgdGhpcy5fYWxsQ2F0ZWdvcmllcy5mb3JFYWNoKGNhdGVnb3J5ID0+IHtcclxuICAgICAgICAgICAgaWYgKGNhdGVnb3J5LlBhcmVudENhdGVnb3J5SWQgPT09IGZpcnN0TGV2ZWxDYXRlZ29yeUlkKSB7XHJcbiAgICAgICAgICAgICAgICBjYXRlZ29yaWVzLnB1c2goY2F0ZWdvcnkpO1xyXG4gICAgICAgICAgICB9Ly9pZlxyXG4gICAgICAgIH0pOy8vZm9yRWFjaFxyXG5cclxuICAgICAgICBsZXQgaHRtbCA9IE11c3RhY2hlLnRvX2h0bWwodGVtcGxhdGUsIGRhdGEpO1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9wYXJlbnREaXZJZCkuYXBwZW5kKGh0bWwpO1xyXG5cclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fc2Vjb25kTGV2ZWxTZWxlY3QpLmNoYW5nZSgoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgbGV0IHNlbGVjdGVkSWQgPSBwYXJzZUludCgkKGV2ZW50LmN1cnJlbnRUYXJnZXQpLnZhbCgpLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFR3byA9IHNlbGVjdGVkSWQ7XHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlVGhpcmRMZXZlbChzZWxlY3RlZElkKTtcclxuICAgICAgICAgICAgbGV0IGV2ZW50QXJnID0gbmV3IENhdGVnb3J5Q2FobmdlZEV2ZW50QXJnKCk7XHJcbiAgICAgICAgICAgIGV2ZW50QXJnLlNlbGVjdGVkQ2F0ZWdvcnlJZCA9IHRoaXMuR2V0U2VsZWN0ZWRDYXRlZ29yeUlkKCk7XHJcbiAgICAgICAgICAgIGV2ZW50QXJnLlNlbGVjdGVkQ2F0ZWdvcnlIYXNDaGlsZCA9IHRoaXMuc2VsZWN0ZWRDYXRlZ29yeUhhc0NoaWxkcmVuKCk7XHJcbiAgICAgICAgICAgIHRoaXMuU2VsZWN0ZWRDYXRlZ29yeUNoYW5nZWRFdmVudC5EaXNwYXRjaCh0aGlzLCBldmVudEFyZyk7XHJcbiAgICAgICAgfSk7Ly9jaGFuZ2VcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZVRoaXJkTGV2ZWwoc2Vjb25kTGV2ZWxDYXRlZ29yeUlkOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnJlbW92ZUVsZW1lbnQodGhpcy5fdGhpcmRMZXZlbERpdik7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUaHJlZSA9IHRoaXMuX3Jvb3RDYXRlZ29yeUlkO1xyXG5cclxuICAgICAgICBpZiAoc2Vjb25kTGV2ZWxDYXRlZ29yeUlkID09PSB0aGlzLl9yb290Q2F0ZWdvcnlJZCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgdGVtcGxhdGUgPSAkKFwiI1wiICsgdGhpcy5fdGhpcmRMZXZlbFRlbXBsYXRlKS5odG1sKCk7XHJcbiAgICAgICAgbGV0IGNhdGVnb3JpZXM6IENhdGVnb3J5W10gPSBuZXcgQXJyYXk8Q2F0ZWdvcnk+KCk7XHJcbiAgICAgICAgbGV0IGRhdGEgPSB7IGNhdGVnb3JpZXM6IGNhdGVnb3JpZXMgfVxyXG5cclxuICAgICAgICB0aGlzLl9hbGxDYXRlZ29yaWVzLmZvckVhY2goY2F0ZWdvcnkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoY2F0ZWdvcnkuUGFyZW50Q2F0ZWdvcnlJZCA9PT0gc2Vjb25kTGV2ZWxDYXRlZ29yeUlkKSB7XHJcbiAgICAgICAgICAgICAgICBjYXRlZ29yaWVzLnB1c2goY2F0ZWdvcnkpO1xyXG4gICAgICAgICAgICB9Ly9pZlxyXG4gICAgICAgIH0pOy8vZm9yRWFjaFxyXG4gICAgICAgIGlmIChjYXRlZ29yaWVzLmxlbmd0aCA9PT0gMCkgey8vTm8gSXRlbSBpbiB0aGlyZCBsZXZlbCBjYXRlZ29yeVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBodG1sID0gTXVzdGFjaGUudG9faHRtbCh0ZW1wbGF0ZSwgZGF0YSk7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX3BhcmVudERpdklkKS5hcHBlbmQoaHRtbCk7XHJcblxyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl90aGlyZExldmVsU2VsZWN0KS5jaGFuZ2UoKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVGhyZWUgPSBwYXJzZUludCgkKGV2ZW50LmN1cnJlbnRUYXJnZXQpLnZhbCgpLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICBsZXQgZXZlbnRBcmcgPSBuZXcgQ2F0ZWdvcnlDYWhuZ2VkRXZlbnRBcmcoKTtcclxuICAgICAgICAgICAgZXZlbnRBcmcuU2VsZWN0ZWRDYXRlZ29yeUlkID0gdGhpcy5HZXRTZWxlY3RlZENhdGVnb3J5SWQoKTtcclxuICAgICAgICAgICAgZXZlbnRBcmcuU2VsZWN0ZWRDYXRlZ29yeUhhc0NoaWxkID0gdGhpcy5zZWxlY3RlZENhdGVnb3J5SGFzQ2hpbGRyZW4oKTtcclxuICAgICAgICAgICAgdGhpcy5TZWxlY3RlZENhdGVnb3J5Q2hhbmdlZEV2ZW50LkRpc3BhdGNoKHRoaXMsIGV2ZW50QXJnKTtcclxuICAgICAgICB9KTsvL2NoYW5nZVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2VsZWN0ZWRDYXRlZ29yeUhhc0NoaWxkcmVuKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGxldCBzZWxlY3RlZENhdGVnb3J5SWQgPSB0aGlzLkdldFNlbGVjdGVkQ2F0ZWdvcnlJZCgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9hbGxDYXRlZ29yaWVzLmZpbHRlclxyXG4gICAgICAgICAgICAoKGNhdGVnb3J5KSA9PiB7IHJldHVybiBjYXRlZ29yeS5QYXJlbnRDYXRlZ29yeUlkID09PSBzZWxlY3RlZENhdGVnb3J5SWQgfSkubGVuZ3RoID4gMDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlbW92ZUVsZW1lbnQoaWQ6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgICQoXCIjXCIgKyBpZCkucmVtb3ZlKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBDYXRlZ29yeUNhaG5nZWRFdmVudEFyZyB7XHJcbiAgICBwdWJsaWMgU2VsZWN0ZWRDYXRlZ29yeUlkOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgU2VsZWN0ZWRDYXRlZ29yeUhhc0NoaWxkOiBib29sZWFuO1xyXG59XHJcblxyXG5lbnVtIENhdGVnb3J5TGV2ZWwge1xyXG4gICAgTGV2ZWwxID0gMSxcclxuICAgIExldmVsMiA9IDIsXHJcbiAgICBMZXZlbDMgPSAzLFxyXG4gICAgVW5rb3duPTRcclxufVxyXG5cclxuIiwi77u/aW1wb3J0IHtDYXJNb2RlbH0gZnJvbSBcIi4uLy4uL01vZGVscy9BZFRyYW5zcG9ydGF0aW9uL0Nhck1vZGVsXCI7XHJcbmltcG9ydCB7VXNlcklucHV0fSBmcm9tIFwiLi4vLi4vSGVscGVyL1VzZXJJbnB1dFwiO1xyXG5pbXBvcnQge0lDcml0ZXJpYSxDcml0ZXJpYVZhbGlkYXRvcn0gZnJvbSBcIi4uLy4uL0hlbHBlci9JQ3JpdGVyaWFcIjtcclxuXHJcbmltcG9ydCB7SUNyaXRlcmlhQ2hhbmdlfSBmcm9tIFwiLi4vLi4vSGVscGVyL0lDcml0ZXJpYUNoYW5nZVwiO1xyXG5cclxuXHJcblxyXG5leHBvcnQgY2xhc3MgQ2FyTW9kZWxCcmFuZENvbnRyb2xsZXIgaW1wbGVtZW50cyBJQ3JpdGVyaWEge1xyXG4gICAgVmFsaWRhdGVDcml0ZXJpYSgpOiBDcml0ZXJpYVZhbGlkYXRvciB7IHRocm93IG5ldyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZFwiKTsgfVxyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgQ2FyQnJhbmRJZEtleTogc3RyaW5nID0gXCJCcmFuZElkXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IEJyYW5kU2VsZWN0SWQ6IHN0cmluZyA9IFwiYnJhbmRcIjtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IENhck1vZGVsVGVtcGxhdGVJZDogc3RyaW5nID0gXCJtb2RlbFRlbXBsYXRlXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IENhck1vZGVsRGl2UGxhY2VIb2xkZXJJZDogc3RyaW5nID0gXCJtb2RlbFBsYWNlSG9sZGVyXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IENhck1vZGVsSWRLZXk6IHN0cmluZyA9IFwiQ2FyTW9kZWxJZFwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBBbGxDYXJNb2RlbHNJbnB1dElkOiBzdHJpbmcgPSBcImFsbENhck1vZGVsc1wiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBNb2RlbFNlbGVjdElkOiBzdHJpbmcgPSBcIm1vZGVsXCI7XHJcbiAgICBwcml2YXRlIF9hbGxDYXJNb2RlbHM6IENhck1vZGVsW107XHJcblxyXG4gICAgcHJpdmF0ZSBfc2VhcmNoQ3JpdGVyaWFDaGFuZ2U6SUNyaXRlcmlhQ2hhbmdlO1xyXG5cclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmluaXRWaWV3KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbml0VmlldygpOiB2b2lkIHtcclxuICAgICAgICBsZXQgYWxsQ2FyTW9kZWxzU3RyaW5nID0gJChcIiNcIiArIHRoaXMuQWxsQ2FyTW9kZWxzSW5wdXRJZCkudmFsKCkudG9TdHJpbmcoKTtcclxuICAgICAgICB0aGlzLl9hbGxDYXJNb2RlbHMgPSAkLnBhcnNlSlNPTihhbGxDYXJNb2RlbHNTdHJpbmcpIGFzIENhck1vZGVsW107XHJcbiAgICAgICAgdGhpcy5pbml0Q2FyTW9kZWwoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXRDYXJNb2RlbCgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmNyZWF0ZUNhck1vZGVsRWxlbWVudChuZXcgQXJyYXk8Q2FyTW9kZWw+KCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlQ2FyTW9kZWxFbGVtZW50KGNhck1vZGVsczogQ2FyTW9kZWxbXSkge1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLkNhck1vZGVsRGl2UGxhY2VIb2xkZXJJZCkuY2hpbGRyZW4oKS5yZW1vdmUoKTtcclxuICAgICAgICBsZXQgdGVtcGxhdGUgPSAkKFwiI1wiICsgdGhpcy5DYXJNb2RlbFRlbXBsYXRlSWQpLmh0bWwoKTtcclxuICAgICAgICBsZXQgZGF0YSA9IHsgY2FyTW9kZWxzOiBjYXJNb2RlbHMgfVxyXG4gICAgICAgIGxldCBodG1sID0gTXVzdGFjaGUudG9faHRtbCh0ZW1wbGF0ZSwgZGF0YSk7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuQ2FyTW9kZWxEaXZQbGFjZUhvbGRlcklkKS5hcHBlbmQoaHRtbCk7XHJcbiAgICAgICAgdGhpcy5iaW5kQ2FyTW9kZWwoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGJpbmRDYXJNb2RlbCgpOiB2b2lkIHtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5Nb2RlbFNlbGVjdElkKS5vbihcImNoYW5nZVwiLChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2VhcmNoQ3JpdGVyaWFDaGFuZ2UuQ3VzdG9tQ3JpdGVyaWFDaGFuZ2VkKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlQ2FyTW9kZWxTZWxlY3QoYnJhbmRJZDogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgbGV0IGNhck1vZGVscyA9IG5ldyBBcnJheTxDYXJNb2RlbD4oKTtcclxuICAgICAgICBpZiAoYnJhbmRJZCAhPT0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLl9hbGxDYXJNb2RlbHMuZm9yRWFjaCgoY2FyTW9kZWwsIGluZGV4LCBhcnJheSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNhck1vZGVsLkJyYW5kSWQgPT09IGJyYW5kSWQpXHJcbiAgICAgICAgICAgICAgICAgICAgY2FyTW9kZWxzLnB1c2goY2FyTW9kZWwpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jcmVhdGVDYXJNb2RlbEVsZW1lbnQoY2FyTW9kZWxzKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgcHVibGljIEZpbGxDcml0ZXJpYSh1c2VySW5wdXQ6VXNlcklucHV0KTp2b2lkIHtcclxuICAgICAgICB1c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnlbdGhpcy5DYXJCcmFuZElkS2V5XSA9XHJcbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLkJyYW5kU2VsZWN0SWQpLmZpbmQoXCJvcHRpb246c2VsZWN0ZWRcIikudmFsKCk7Ly9icmFuZElkXHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuQ2FyTW9kZWxJZEtleV0gPVxyXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5Nb2RlbFNlbGVjdElkKS5maW5kKFwib3B0aW9uOnNlbGVjdGVkXCIpLnZhbCgpOy8vY2FyTW9kZWxJZFxyXG4gICAgfVxyXG5cclxuICAgIEJpbmRFdmVudHMoY3JpdGVyaWFDaGFuZ2U6IElDcml0ZXJpYUNoYW5nZSk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX3NlYXJjaENyaXRlcmlhQ2hhbmdlID0gY3JpdGVyaWFDaGFuZ2U7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuQnJhbmRTZWxlY3RJZCkub24oXCJjaGFuZ2VcIiwgKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBzZWxlY3RlZEJyYW5kSWQ6IG51bWJlciA9IHBhcnNlSW50KCQoZXZlbnQuY3VycmVudFRhcmdldCkuZmluZChcIm9wdGlvbjpzZWxlY3RlZFwiKS52YWwoKS50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVDYXJNb2RlbFNlbGVjdChzZWxlY3RlZEJyYW5kSWQpO1xyXG4gICAgICAgICAgICBjcml0ZXJpYUNoYW5nZS5DdXN0b21Dcml0ZXJpYUNoYW5nZWQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5iaW5kQ2FyTW9kZWwoKTtcclxuICAgIH1cclxuXHJcbiAgICBVbkJpbmRFdmVudHMoKTogdm9pZCB7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuQnJhbmRTZWxlY3RJZCkub2ZmKFwiY2hhbmdlXCIpO1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLk1vZGVsU2VsZWN0SWQpLm9mZihcImNoYW5nZVwiKTtcclxuICAgIH1cclxufSIsIu+7v2ltcG9ydCB7SUV2ZW50fSAgZnJvbSBcIi4vSUV2ZW50XCI7XHJcblxyXG5cclxuLyogVGhlIGRpc3BhdGNoZXIgaGFuZGxlcyB0aGUgc3RvcmFnZSBvZiBzdWJzY2lwdGlvbnMgYW5kIGZhY2lsaXRhdGVzXHJcbiAgc3Vic2NyaXB0aW9uLCB1bnN1YnNjcmlwdGlvbiBhbmQgZGlzcGF0Y2hpbmcgb2YgdGhlIGV2ZW50ICovXHJcbmV4cG9ydCAgY2xhc3MgRXZlbnREaXNwYXRjaGVyPFRTZW5kZXIsIFRBcmdzPiBpbXBsZW1lbnRzIElFdmVudDxUU2VuZGVyLCBUQXJncz4ge1xyXG5cclxuICAgIHByaXZhdGUgX3N1YnNjcmlwdGlvbnM6IEFycmF5PChzZW5kZXI6IFRTZW5kZXIsIGFyZ3M6IFRBcmdzKSA9PiB2b2lkPiA9IG5ldyBBcnJheTwoc2VuZGVyOiBUU2VuZGVyLCBhcmdzOiBUQXJncykgPT4gdm9pZD4oKTtcclxuXHJcbiAgICBwdWJsaWMgU3Vic2NyaWJlKGZuOiAoc2VuZGVyOiBUU2VuZGVyLCBhcmdzOiBUQXJncykgPT4gdm9pZCk6IHZvaWQge1xyXG4gICAgICAgIGlmIChmbikge1xyXG4gICAgICAgICAgICB0aGlzLl9zdWJzY3JpcHRpb25zLnB1c2goZm4pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgIFVuc3Vic2NyaWJlKGZuOiAoc2VuZGVyOiBUU2VuZGVyLCBhcmdzOiBUQXJncykgPT4gdm9pZCk6IHZvaWQge1xyXG4gICAgICAgIGxldCBpID0gdGhpcy5fc3Vic2NyaXB0aW9ucy5pbmRleE9mKGZuKTtcclxuICAgICAgICBpZiAoaSA+IC0xKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMuc3BsaWNlKGksIDEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgIERpc3BhdGNoKHNlbmRlcjogVFNlbmRlciwgYXJnczogVEFyZ3MpOiB2b2lkIHtcclxuICAgICAgICBmb3IgKGxldCBoYW5kbGVyIG9mIHRoaXMuX3N1YnNjcmlwdGlvbnMpIHtcclxuICAgICAgICAgICAgaGFuZGxlcihzZW5kZXIsIGFyZ3MpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIu+7v2ltcG9ydCB7IElDcml0ZXJpYX0gZnJvbSBcIi4vSUNyaXRlcmlhXCI7XHJcbmltcG9ydCB7IE51bWVyaWNEaWN0aW9uYXJ5IH0gZnJvbSBcImxvZGFzaC9pbmRleFwiO1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBDcml0ZXJpYU51bWVyaWNEaWN0aW9uYXJ5IGltcGxlbWVudHMgTnVtZXJpY0RpY3Rpb25hcnk8SUNyaXRlcmlhPiB7XHJcbiAgICBbaW5kZXg6IG51bWJlcl06IElDcml0ZXJpYTtcclxufSIsIu+7v2ludGVyZmFjZSBMb29zZU9iamVjdCB7XHJcbiAgICBba2V5OiBzdHJpbmddOiBhbnlcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFVzZXJJbnB1dCB7XHJcbiAgICBwdWJsaWMgUGFyYW1ldGVyc0RpY3Rpb25hcnk6IExvb3NlT2JqZWN0ID0ge307XHJcbn1cclxuXHJcblxyXG5cclxuIiwi77u/aW1wb3J0IHsgQ2F0ZWdvcnlTZWxlY3Rpb24gfSBmcm9tIFwiLi4vLi4vLi4vQ29tcG9uZW50cy9DYXRlZ29yeS9DYXRlZ29yeVNlbGVjdGlvblwiO1xyXG5pbXBvcnQgeyBDYXRlZ29yeSB9IGZyb20gXCIuLi8uLi8uLi9Nb2RlbHMvQ2F0ZWdvcnlcIjtcclxuaW1wb3J0IHtVc2VySW5wdXR9IGZyb20gXCIuLi8uLi8uLi9IZWxwZXIvVXNlcklucHV0XCI7XHJcbmltcG9ydCB7TGV0TWVLbm93U2VydmVyQ2FsbGVyfSBmcm9tIFwiLi9MZXRNZUtub3dTZXJ2ZXJDYWxsZXJcIjtcclxuaW1wb3J0IHtMZXRNZUtub3dQYXJ0aWFsVmlld0xvYWRlcn0gZnJvbSBcIi4vTGV0TWVLbm93UGFydGlhbFZpZXdMb2FkZXJcIjtcclxuaW1wb3J0IHtJQ3JpdGVyaWFDaGFuZ2V9IGZyb20gXCIuLi8uLi8uLi9IZWxwZXIvSUNyaXRlcmlhQ2hhbmdlXCI7XHJcbmltcG9ydCB7TGV0TWVLbm93Q3JpdGVyaWF9ICBmcm9tIFwiLi9MZXRNZUtub3dDcml0ZXJpYVwiO1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBMZXRNZUtub3cgaW1wbGVtZW50cyBJQ3JpdGVyaWFDaGFuZ2Uge1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgRW1haWxPclNtc0tleTogc3RyaW5nID0gXCJFbWFpbE9yU21zXCI7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgIEVtYWlsT3JTbXNQYXJlbnREaXZJZDogc3RyaW5nID0gXCJlbWFpbE9yU21zXCI7XHJcbiAgICBcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX3JlZ2lzdGVyTGV0TWVLbm93SW5wdXRJZDogc3RyaW5nID0gXCJyZWdpc3RlckxldE1lS25vd1wiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfY2F0ZWdvcnlTcGVjaWZpY0NyaXRlcmlhRGl2SWQ6IHN0cmluZyA9XCJDYXRlZ29yeVNwZWNpZmljQ3JpdGVyaWFcIjtcclxuXHJcbiAgICBwcml2YXRlIF9jYXRlZ29yeVNlbGVjdGlvbjogQ2F0ZWdvcnlTZWxlY3Rpb247XHJcbiAgICBwcml2YXRlIF9sZXRNZUtub3dDcml0ZXJpYTpMZXRNZUtub3dDcml0ZXJpYTtcclxuICAgIHByaXZhdGUgX2xldE1lS25vd1NlcnZlckNhbGxlcjogTGV0TWVLbm93U2VydmVyQ2FsbGVyO1xyXG4gICAgcHJpdmF0ZSBfbGV0TWVLbm93UGFydGlhbFZpZXdMb2FkZXI6TGV0TWVLbm93UGFydGlhbFZpZXdMb2FkZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IoY2F0ZWdvcnlTZWxlY3RvclBhcmVudERpdklkOiBzdHJpbmcsIGFsbENhdGVnb3JpZXNJZDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5pbml0Q2F0ZWdvcnlTZWxlY3QoY2F0ZWdvcnlTZWxlY3RvclBhcmVudERpdklkLCBhbGxDYXRlZ29yaWVzSWQpO1xyXG4gICAgICAgIHRoaXMuX2xldE1lS25vd1NlcnZlckNhbGxlciA9IG5ldyBMZXRNZUtub3dTZXJ2ZXJDYWxsZXIoKTtcclxuICAgICAgICB0aGlzLl9sZXRNZUtub3dDcml0ZXJpYSA9IG5ldyBMZXRNZUtub3dDcml0ZXJpYSgpO1xyXG4gICAgICAgIHRoaXMuX2xldE1lS25vd1BhcnRpYWxWaWV3TG9hZGVyID1cclxuICAgICAgICAgICAgbmV3IExldE1lS25vd1BhcnRpYWxWaWV3TG9hZGVyKHRoaXMuX2NhdGVnb3J5U3BlY2lmaWNDcml0ZXJpYURpdklkLCB0aGlzLCB0aGlzLl9sZXRNZUtub3dDcml0ZXJpYSk7XHJcbiAgICAgICAgdGhpcy5pbml0RXZlbnRIYW5kbGVycygpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBDdXN0b21Dcml0ZXJpYUNoYW5nZWQoKTogdm9pZCB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaW5pdENhdGVnb3J5U2VsZWN0KGNhdGVnb3J5U2VsZWN0b3JQYXJlbnREaXZJZDogc3RyaW5nLCBhbGxDYXRlZ29yaWVzSWQ6IHN0cmluZyk6dm9pZCB7XHJcbiAgICAgICAgbGV0IGFsbENhdGVnb3JpZXNTdHJpbmcgPSAkKFwiI1wiICsgYWxsQ2F0ZWdvcmllc0lkKS52YWwoKS50b1N0cmluZygpO1xyXG4gICAgICAgIGxldCBhbGxDYXRlZ29yaWVzID0gJC5wYXJzZUpTT04oYWxsQ2F0ZWdvcmllc1N0cmluZykgYXMgQ2F0ZWdvcnlbXTtcclxuICAgICAgICB0aGlzLl9jYXRlZ29yeVNlbGVjdGlvbiA9IG5ldyBDYXRlZ29yeVNlbGVjdGlvbihjYXRlZ29yeVNlbGVjdG9yUGFyZW50RGl2SWQsIGFsbENhdGVnb3JpZXMpO1xyXG4gICAgICAgIHRoaXMuX2NhdGVnb3J5U2VsZWN0aW9uLkNyZWF0ZUZpcnN0TGV2ZWwoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXRFdmVudEhhbmRsZXJzKCk6dm9pZCB7XHJcbiAgICAgICAgdGhpcy5fY2F0ZWdvcnlTZWxlY3Rpb24uU2VsZWN0ZWRDYXRlZ29yeUNoYW5nZWRFdmVudC5TdWJzY3JpYmUoKHNlbmRlciwgYXJncykgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9sZXRNZUtub3dQYXJ0aWFsVmlld0xvYWRlci5HZXRQYXJ0aWFsVmlld0Zyb21TZXJ2ZXIoYXJncy5TZWxlY3RlZENhdGVnb3J5SWQpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fcmVnaXN0ZXJMZXRNZUtub3dJbnB1dElkKS5vbihcImNsaWNrXCIsIChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB0aGlzLnJlZ2lzdGVyTGV0TWVLbm93KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSAgcmVnaXN0ZXJMZXRNZUtub3coKTp2b2lkIHtcclxuICAgICAgICAvL1RPRE8gZGlzYWJsZSBzdWJtaXRBZCBCdXR0b24gdW50aWwgY3VycmVudCBzdWJtaXNzaW9uIGlzIG9rIG9yIGVycm9ybm91cyBcclxuXHJcbiAgICAgICAgbGV0IHVzZXJJbnB1dCA9IG5ldyBVc2VySW5wdXQoKTtcclxuICAgICAgICB0aGlzLl9jYXRlZ29yeVNlbGVjdGlvbi5JbnNlcnRDYXRlZ29yeUlkSW5Vc2VySW5wdXREaWN0aW9uYXJ5KHVzZXJJbnB1dCk7XHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuRW1haWxPclNtc0tleV0gPSAkKFwiI1wiICsgdGhpcy5FbWFpbE9yU21zUGFyZW50RGl2SWQpLmNoaWxkcmVuKFwiOmNoZWNrZWRcIikudmFsKCk7Oy8vVE9ETyBtYWtlIGEgdWkgdmlldyAocmFkaW8gYnV0dG9uKVxyXG4gICAgICAgIHRoaXMuX2xldE1lS25vd0NyaXRlcmlhLkZpbGxDYXRlZ29yeVNwZWNpZmljTGV0TWVLbm93Q3JpdGVyaWEodGhpcy5fY2F0ZWdvcnlTZWxlY3Rpb24uR2V0U2VsZWN0ZWRDYXRlZ29yeUlkKCksdXNlcklucHV0KTtcclxuXHJcbiAgICAgICAgdGhpcy5fbGV0TWVLbm93U2VydmVyQ2FsbGVyLlNhdmVBZCh1c2VySW5wdXQpO1xyXG4gICAgfVxyXG59XHJcblxyXG5sZXQgY2F0ZWdvcnlTZWxlY3RvclBhcmVudERpdklkOiBzdHJpbmcgPSBcImNhdGVnb3J5U2VsZWN0b3JcIjtcclxubGV0IGFsbENhdGVnb3JpZXNJZCA9IFwiYWxsQ2F0ZWdvcmllc1wiO1xyXG5cclxuJChkb2N1bWVudCkucmVhZHkoKCk9PiB7XHJcbiAgICBsZXQgbGV0TWVLbm93ID0gbmV3IExldE1lS25vdyhjYXRlZ29yeVNlbGVjdG9yUGFyZW50RGl2SWQsYWxsQ2F0ZWdvcmllc0lkKTtcclxufSk7Iiwi77u/aW1wb3J0IHsgQ3JpdGVyaWFOdW1lcmljRGljdGlvbmFyeSB9IGZyb20gXCIuLi8uLi8uLi9IZWxwZXIvQ3JpdGVyaWFOdW1lcmljRGljdGlvbmFyeVwiO1xyXG5pbXBvcnQgeyBEZWZhdWx0TGV0TWVLbm93Q3JpdGVyaWEgfSBmcm9tIFwiLi9MZXRNZUtub3dDcml0ZXJpYS9EZWZhdWx0TGV0TWVLbm93Q3JpdGVyaWFcIjtcclxuaW1wb3J0IHsgQWRUcmFuc3BvcnRhdGlvbkxldE1lS25vd0NyaXRlcmlhIH0gZnJvbSBcIi4vTGV0TWVLbm93Q3JpdGVyaWEvQWRUcmFuc3BvcnRhdGlvbkxldE1lS25vd0NyaXRlcmlhXCI7XHJcbmltcG9ydCB7IFVzZXJJbnB1dCB9IGZyb20gXCIuLi8uLi8uLi9IZWxwZXIvVXNlcklucHV0XCI7XHJcbmltcG9ydCB7IElDcml0ZXJpYSB9IGZyb20gXCIuLi8uLi8uLi9IZWxwZXIvSUNyaXRlcmlhXCI7XHJcbmltcG9ydCB7IElDcml0ZXJpYUNoYW5nZSB9IGZyb20gXCIuLi8uLi8uLi9IZWxwZXIvSUNyaXRlcmlhQ2hhbmdlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTGV0TWVLbm93Q3JpdGVyaWEge1xyXG4gICAgcHJpdmF0ZSBfbGV0TWVLbm93Q3JpdGVyaWFJb2NDb250YWluZXI6IENyaXRlcmlhTnVtZXJpY0RpY3Rpb25hcnk7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLl9sZXRNZUtub3dDcml0ZXJpYUlvY0NvbnRhaW5lciA9IG5ldyBDcml0ZXJpYU51bWVyaWNEaWN0aW9uYXJ5KCk7XHJcbiAgICAgICAgdGhpcy5pbml0TGV0TWVLbm93Q3JpdGVyaWFJb2NDb250YWluZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXRMZXRNZUtub3dDcml0ZXJpYUlvY0NvbnRhaW5lcigpIHtcclxuICAgICAgICB0aGlzLl9sZXRNZUtub3dDcml0ZXJpYUlvY0NvbnRhaW5lclswXSA9IG5ldyBEZWZhdWx0TGV0TWVLbm93Q3JpdGVyaWEoKTtcclxuICAgICAgICB0aGlzLl9sZXRNZUtub3dDcml0ZXJpYUlvY0NvbnRhaW5lclsxMDBdID0gbmV3IEFkVHJhbnNwb3J0YXRpb25MZXRNZUtub3dDcml0ZXJpYSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBGaWxsQ2F0ZWdvcnlTcGVjaWZpY0xldE1lS25vd0NyaXRlcmlhKGNhdGVnb3J5SWQ6IG51bWJlciwgdXNlcklucHV0OiBVc2VySW5wdXQpOiB2b2lkIHtcclxuICAgICAgICBsZXQgbGV0TWVLbm93Q3JpdGVyaWEgPSB0aGlzLnBvbHltb3JwaGljRGlzcGF0Y2hMZXRNZUtub3dDcml0ZXJpYShjYXRlZ29yeUlkKTtcclxuICAgICAgICBsZXRNZUtub3dDcml0ZXJpYS5GaWxsQ3JpdGVyaWEodXNlcklucHV0KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgQmluZChjYXRlZ29yeUlkOiBudW1iZXIsIGNyaXRlcmlhQ2hhbmdlOiBJQ3JpdGVyaWFDaGFuZ2UpIHtcclxuICAgICAgICBsZXQgY3JpdGVyaWEgPSB0aGlzLnBvbHltb3JwaGljRGlzcGF0Y2hMZXRNZUtub3dDcml0ZXJpYShjYXRlZ29yeUlkKTtcclxuICAgICAgICBjcml0ZXJpYS5CaW5kRXZlbnRzKGNyaXRlcmlhQ2hhbmdlKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgVW5CaW5kKGNhdGVnb3J5SWQ6IG51bWJlcikge1xyXG4gICAgICAgIGxldCBjcml0ZXJpYSA9IHRoaXMucG9seW1vcnBoaWNEaXNwYXRjaExldE1lS25vd0NyaXRlcmlhKGNhdGVnb3J5SWQpO1xyXG4gICAgICAgIGNyaXRlcmlhLlVuQmluZEV2ZW50cygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcG9seW1vcnBoaWNEaXNwYXRjaExldE1lS25vd0NyaXRlcmlhKGNhdGVnb3J5SWQ6IG51bWJlcik6IElDcml0ZXJpYSB7XHJcbiAgICAgICAgbGV0IHJldHVyblZhbHVlOiBJQ3JpdGVyaWEgPSB0aGlzLl9sZXRNZUtub3dDcml0ZXJpYUlvY0NvbnRhaW5lcltjYXRlZ29yeUlkXTtcclxuICAgICAgICBpZiAocmV0dXJuVmFsdWUgPT09IHVuZGVmaW5lZCB8fCByZXR1cm5WYWx1ZSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm5WYWx1ZSA9IHRoaXMuX2xldE1lS25vd0NyaXRlcmlhSW9jQ29udGFpbmVyWzBdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmV0dXJuVmFsdWU7XHJcbiAgICB9XHJcbn1cclxuXHJcbiIsIu+7v2ltcG9ydCB7IElDcml0ZXJpYSwgQ3JpdGVyaWFWYWxpZGF0b3IgfSBmcm9tIFwiLi4vLi4vLi4vLi4vSGVscGVyL0lDcml0ZXJpYVwiO1xyXG5pbXBvcnQgeyBVc2VySW5wdXQgfSBmcm9tIFwiLi4vLi4vLi4vLi4vSGVscGVyL1VzZXJJbnB1dFwiO1xyXG5pbXBvcnQgeyBJQ3JpdGVyaWFDaGFuZ2UgfSBmcm9tIFwiLi4vLi4vLi4vLi4vSGVscGVyL0lDcml0ZXJpYUNoYW5nZVwiO1xyXG5pbXBvcnQgeyBDYXJNb2RlbEJyYW5kQ29udHJvbGxlciB9IGZyb20gXCIuLi8uLi8uLi8uLi9Db21wb25lbnRzL1RyYW5zZm9ybWF0aW9uL0Nhck1vZGVsQnJhbmRDb250cm9sbGVyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQWRUcmFuc3BvcnRhdGlvbkxldE1lS25vd0NyaXRlcmlhIGltcGxlbWVudHMgSUNyaXRlcmlhIHtcclxuICAgIHByaXZhdGUgX2Nhck1vZGVsQnJhbmRDb250b2xsZXI6IENhck1vZGVsQnJhbmRDb250cm9sbGVyO1xyXG5cclxuICAgIHB1YmxpYyBWYWxpZGF0ZUNyaXRlcmlhKCk6IENyaXRlcmlhVmFsaWRhdG9yIHsgdGhyb3cgbmV3IEVycm9yKFwiTm90IGltcGxlbWVudGVkXCIpOyB9XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBNYWtlWWVhcktleTogc3RyaW5nID0gXCJNYWtlWWVhclwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBNYWtlWWVhcklucHV0SWQ6IHN0cmluZyA9IFwibWFrZVllYXJcIjtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IEZ1ZWxLZXkgPSBcIkZ1ZWxcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgRnVlbFNlbGVjdElkOiBzdHJpbmcgPSBcImZ1ZWxcIjtcclxuXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgR2VhcmJveEtleTogc3RyaW5nID0gXCJHZWFyYm94XCI7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgR2VhcmJveFR5cGVQYXJlbnREaXZJZDogc3RyaW5nID0gXCJnZWFyYm94VHlwZVwiO1xyXG5cclxuICAgIHB1YmxpYyByZWFkb25seSBDYXJTdGF0dXNLZXk6IHN0cmluZyA9IFwiQ2FyU3RhdHVzXCI7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgQ2FyU3RhdHVzUGFyZW50RGl2SWQ6IHN0cmluZyA9IFwiY2FyU3RhdHVzXCI7XHJcblxyXG4gICAgcHVibGljIHJlYWRvbmx5IE1pbGVhZ2VLZXk6IHN0cmluZyA9IFwiTWlsZWFnZVwiO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IE1pbGVhZ2VJbnB1dElkOiBzdHJpbmcgPSBcIm1pbGVhZ2VcIjtcclxuXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgUGxhdGVUeXBlS2V5OiBzdHJpbmcgPSBcIlBsYXRlVHlwZVwiO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IFBsYXRlVHlwZVBhcmVudERpdklkOiBzdHJpbmcgPSBcInBsYXRlVHlwZVwiO1xyXG5cclxuICAgIHB1YmxpYyByZWFkb25seSBCb2R5U3RhdHVzS2V5OiBzdHJpbmcgPSBcIkJvZHlTdGF0dXNcIjtcclxuICAgIHB1YmxpYyByZWFkb25seSBCb2R5U3RhdHVzU2VsZWN0SWQ6IHN0cmluZyA9IFwiYm9keVN0YXR1c1wiO1xyXG5cclxuICAgIHB1YmxpYyByZWFkb25seSBCb2R5Q29sb3JLZXk6IHN0cmluZyA9IFwiQm9keUNvbG9yXCI7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgQm9keUNvbG9yU2VsZWN0SWQ6IHN0cmluZyA9IFwiYm9keUNvbG9yXCI7XHJcblxyXG4gICAgcHVibGljIHJlYWRvbmx5IEludGVybmFsQ29sb3JLZXk6IHN0cmluZyA9IFwiSW50ZXJuYWxDb2xvclwiO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IEludGVybmFsQ29sb3JTZWxlY3RJZCA9IFwiaW50ZXJuYWxDb2xvclwiO1xyXG5cclxuXHJcbiAgICBwcml2YXRlIGluaXRWaWV3KCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX2Nhck1vZGVsQnJhbmRDb250b2xsZXIgPSBuZXcgQ2FyTW9kZWxCcmFuZENvbnRyb2xsZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgRmlsbENyaXRlcmlhKHVzZXJJbnB1dDogVXNlcklucHV0KTogdm9pZCB7XHJcbiAgICAgICAgLy9UT0RPIHZhbGlkYXRlIHVzZXIgaW5wdXQgdGhlbiBwcm9jZWVkXHJcbiAgICAgICAgdGhpcy5fY2FyTW9kZWxCcmFuZENvbnRvbGxlci5GaWxsQ3JpdGVyaWEodXNlcklucHV0KTtcclxuICAgICAgICAvL3VzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLk1ha2VZZWFyS2V5XSA9ICQoXCIjXCIgKyB0aGlzLk1ha2VZZWFySW5wdXRJZCkudmFsKCk7Ly9NYWtlWWVhclxyXG4gICAgICAgIC8vdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuRnVlbEtleV0gPSAkKFwiI1wiICsgdGhpcy5GdWVsU2VsZWN0SWQpLmZpbmQoXCJvcHRpb246c2VsZWN0ZWRcIikudmFsKCk7Ly9GdWVsXHJcbiAgICAgICAgLy91c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnlbdGhpcy5NaWxlYWdlS2V5XSA9ICQoXCIjXCIgKyB0aGlzLk1pbGVhZ2VJbnB1dElkKS52YWwoKTsvL01pbGVhZ2VcclxuICAgICAgICAvL3VzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLkdlYXJib3hLZXldID0gJChcIiNcIiArIHRoaXMuR2VhcmJveFR5cGVQYXJlbnREaXZJZCkuY2hpbGRyZW4oXCI6Y2hlY2tlZFwiKS52YWwoKTtcclxuICAgICAgICAvL3VzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLkJvZHlDb2xvcktleV0gPSAkKFwiI1wiICsgdGhpcy5Cb2R5Q29sb3JTZWxlY3RJZCkuZmluZChcIm9wdGlvbjpzZWxlY3RlZFwiKS52YWwoKTtcclxuICAgICAgICAvL3VzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLkludGVybmFsQ29sb3JLZXldID0gJChcIiNcIiArIHRoaXMuSW50ZXJuYWxDb2xvclNlbGVjdElkKS5maW5kKFwib3B0aW9uOnNlbGVjdGVkXCIpLnZhbCgpO1xyXG4gICAgICAgIC8vdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuQm9keVN0YXR1c0tleV0gPSAkKFwiI1wiICsgdGhpcy5Cb2R5U3RhdHVzU2VsZWN0SWQpLmZpbmQoXCJvcHRpb246c2VsZWN0ZWRcIikudmFsKCk7XHJcbiAgICAgICAgLy91c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnlbdGhpcy5DYXJTdGF0dXNLZXldID0gJChcIiNcIiArIHRoaXMuQ2FyU3RhdHVzUGFyZW50RGl2SWQpLmNoaWxkcmVuKFwiOmNoZWNrZWRcIikudmFsKCk7XHJcbiAgICAgICAgLy91c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnlbdGhpcy5QbGF0ZVR5cGVLZXldID0gJChcIiNcIiArIHRoaXMuUGxhdGVUeXBlUGFyZW50RGl2SWQpLmNoaWxkcmVuKFwiOmNoZWNrZWRcIikudmFsKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIEJpbmRFdmVudHMoY3JpdGVyaWFDaGFuZ2U6IElDcml0ZXJpYUNoYW5nZSk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuaW5pdFZpZXcoKTtcclxuICAgICAgICB0aGlzLl9jYXJNb2RlbEJyYW5kQ29udG9sbGVyLkJpbmRFdmVudHMoY3JpdGVyaWFDaGFuZ2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBVbkJpbmRFdmVudHMoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fY2FyTW9kZWxCcmFuZENvbnRvbGxlci5VbkJpbmRFdmVudHMoKTtcclxuICAgIH1cclxufSIsIu+7v2ltcG9ydCB7IElDcml0ZXJpYSwgQ3JpdGVyaWFWYWxpZGF0b3IgfSBmcm9tIFwiLi4vLi4vLi4vLi4vSGVscGVyL0lDcml0ZXJpYVwiO1xyXG5pbXBvcnQgeyBVc2VySW5wdXQgfSBmcm9tIFwiLi4vLi4vLi4vLi4vSGVscGVyL1VzZXJJbnB1dFwiO1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBEZWZhdWx0TGV0TWVLbm93Q3JpdGVyaWEgaW1wbGVtZW50cyBJQ3JpdGVyaWEge1xyXG4gICAgRmlsbENyaXRlcmlhKHNlYXJjaEFkVXNlcklucHV0OiBVc2VySW5wdXQpOiB2b2lkIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgQmluZEV2ZW50cyhjcml0ZXJpYUNoYW5nZTogT2JqZWN0KTogdm9pZCB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIFVuQmluZEV2ZW50cygpOiB2b2lkIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgVmFsaWRhdGVDcml0ZXJpYSgpOiBDcml0ZXJpYVZhbGlkYXRvciB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm90IGltcGxlbWVudGVkXCIpO1xyXG4gICAgfVxyXG59Iiwi77u/aW1wb3J0IHtJQ3JpdGVyaWFDaGFuZ2V9IGZyb20gXCIuLi8uLi8uLi9IZWxwZXIvSUNyaXRlcmlhQ2hhbmdlXCI7XHJcbmltcG9ydCB7TmV3QWRDcml0ZXJpYX0gZnJvbSBcIi4uLy4uLy4uL2hvbWUvbmV3QWQvc3JjL05ld0FkQ3JpdGVyaWFcIjtcclxuaW1wb3J0IHtQYXJ0aWFsVmlld1NlcnZlckNhbGxQYXJhbWV0ZXJzfSBmcm9tIFwiLi4vLi4vLi4vaG9tZS9uZXdBZC9zcmMvTmV3QWRQYXJ0aWFsVmlld0xvYWRlclwiO1xyXG5pbXBvcnQge0xldE1lS25vd0NyaXRlcmlhfSBmcm9tIFwiLi9MZXRNZUtub3dDcml0ZXJpYVwiO1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBMZXRNZUtub3dQYXJ0aWFsVmlld0xvYWRlciB7XHJcbiAgICBwcml2YXRlIF9wYXJ0aWFsVmlld0RpdklkOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIF91cmw6IHN0cmluZyA9IFwiL0xldE1lS25vdy9HZXRMZXRNZUtub3dQYXJ0aWFsVmlld1wiO1xyXG4gICAgcHJpdmF0ZSBfcHJldmlvdXNDYXRlZ29yeUlkOiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBfY3VycmVudENhdGVnb3J5SWQ6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIF9jcml0ZXJpYUNoYW5nZTogSUNyaXRlcmlhQ2hhbmdlO1xyXG4gICAgcHJpdmF0ZSBfbGV0TWVLbm93Q3JpdGVyaWE6IExldE1lS25vd0NyaXRlcmlhO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBhcnRpYWxWaWV3RGl2SWQ6IHN0cmluZywgY3JpdGVyaWFDaGFuZ2U6IElDcml0ZXJpYUNoYW5nZSwgbGV0TWVLbm93Q3JpdGVyaWE6IExldE1lS25vd0NyaXRlcmlhKSB7XHJcbiAgICAgICAgdGhpcy5fcGFydGlhbFZpZXdEaXZJZCA9IHBhcnRpYWxWaWV3RGl2SWQ7XHJcbiAgICAgICAgdGhpcy5fY3JpdGVyaWFDaGFuZ2UgPSBjcml0ZXJpYUNoYW5nZTtcclxuICAgICAgICB0aGlzLl9sZXRNZUtub3dDcml0ZXJpYSA9IGxldE1lS25vd0NyaXRlcmlhO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBHZXRQYXJ0aWFsVmlld0Zyb21TZXJ2ZXIoY2F0ZWdvcnlJZDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fY3VycmVudENhdGVnb3J5SWQgPSBjYXRlZ29yeUlkO1xyXG4gICAgICAgIGxldCBjYWxsUGFyYW1zID0gbmV3IFBhcnRpYWxWaWV3U2VydmVyQ2FsbFBhcmFtZXRlcnMoKTtcclxuICAgICAgICBjYWxsUGFyYW1zLkNhdGVnb3J5SWQgPSBjYXRlZ29yeUlkO1xyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6IFwiR0VUXCIsIC8vR0VUIG9yIFBPU1Qgb3IgUFVUIG9yIERFTEVURSB2ZXJiXHJcbiAgICAgICAgICAgIHVybDogdGhpcy5fdXJsLFxyXG4gICAgICAgICAgICBkYXRhOiBjYWxsUGFyYW1zLCAvL0RhdGEgc2VudCB0byBzZXJ2ZXJcclxuICAgICAgICAgICAgc3VjY2VzczogKG1zZywgdGV4dFN0YXR1cywganFYSFIpID0+IHRoaXMub25TdWNjZXNzR2V0SXRlbXNGcm9tU2VydmVyKG1zZywgdGV4dFN0YXR1cywganFYSFIpLC8vT24gU3VjY2Vzc2Z1bGwgc2VydmljZSBjYWxsXHJcbiAgICAgICAgICAgIGVycm9yOiAoanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKSA9PiB0aGlzLm9uRXJyb3JHZXRJdGVtc0Zyb21TZXJ2ZXIoanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKS8vIFdoZW4gU2VydmljZSBjYWxsIGZhaWxzXHJcbiAgICAgICAgfSk7Ly8uYWpheFxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25TdWNjZXNzR2V0SXRlbXNGcm9tU2VydmVyKG1zZzogYW55LCB0ZXh0U3RhdHVzOiBzdHJpbmcsIGpxWEhSOiBKUXVlcnlYSFIpIHtcclxuICAgICAgICB0aGlzLl9sZXRNZUtub3dDcml0ZXJpYS5VbkJpbmQodGhpcy5fcHJldmlvdXNDYXRlZ29yeUlkKTtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fcGFydGlhbFZpZXdEaXZJZCkuY2hpbGRyZW4oKS5yZW1vdmUoKTtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fcGFydGlhbFZpZXdEaXZJZCkuaHRtbChtc2cpO1xyXG4gICAgICAgIHRoaXMuX2xldE1lS25vd0NyaXRlcmlhLkJpbmQodGhpcy5fY3VycmVudENhdGVnb3J5SWQsIHRoaXMuX2NyaXRlcmlhQ2hhbmdlKTtcclxuICAgICAgICB0aGlzLl9wcmV2aW91c0NhdGVnb3J5SWQgPSB0aGlzLl9jdXJyZW50Q2F0ZWdvcnlJZDtcclxuICAgIH0vL29uU3VjY2Vzc0dldFRpbWVGcm9tU2VydmVyXHJcblxyXG4gICAgcHJpdmF0ZSBvbkVycm9yR2V0SXRlbXNGcm9tU2VydmVyKGpxWEhSOiBKUXVlcnlYSFIsIHRleHRTdGF0dXM6IHN0cmluZywgZXJyb3JUaHJvd246IHN0cmluZykge1xyXG4gICAgICAgIGFsZXJ0KGVycm9yVGhyb3duKTtcclxuICAgIH0vL29uRXJyb3JHZXRUaW1lRnJvbVNlcnZlclxyXG5cclxufVxyXG4iLCLvu79pbXBvcnQge1VzZXJJbnB1dH0gZnJvbSBcIi4uLy4uLy4uL0hlbHBlci9Vc2VySW5wdXRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBMZXRNZUtub3dTZXJ2ZXJDYWxsZXIge1xyXG4gICAgLy9UT0RPIGNhbGwgc2VydmVyIGFuZCBzZW5kIHVzZXJpbnB1dCBmcm8gbmV3IGFkXHJcbiAgICAvL2dldCByZXN1bHQgYW5kIHNob3cgdG8gdXNlclxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfdXJsOiBzdHJpbmcgPSBcIi9hcGkvTGV0TWVLbm93QXBpL0FkZE5ld0xldE1lS25vd1JlY29yZFwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBNZXNzYWdlRGl2SWQ6IHN0cmluZyA9XCJtZXNzYWdlXCI7XHJcblxyXG5cclxuICAgIHB1YmxpYyBTYXZlQWQodXNlcklucHV0OiBVc2VySW5wdXQpOiB2b2lkIHtcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0eXBlOiBcIlBPU1RcIiwgLy9HRVQgb3IgUE9TVCBvciBQVVQgb3IgREVMRVRFIHZlcmJcclxuICAgICAgICAgICAgdXJsOiB0aGlzLl91cmwsXHJcbiAgICAgICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeSksIC8vRGF0YSBzZW50IHRvIHNlcnZlclxyXG4gICAgICAgICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLCAvLyBjb250ZW50IHR5cGUgc2VudCB0byBzZXJ2ZXJcclxuICAgICAgICAgICAgc3VjY2VzczogKG1zZywgdGV4dFN0YXR1cywganFYSFIpID0+IHRoaXMub25TdWNjZXNzR2V0SXRlbXNGcm9tU2VydmVyKG1zZywgdGV4dFN0YXR1cywganFYSFIpLCAvL09uIFN1Y2Nlc3NmdWxsIHNlcnZpY2UgY2FsbFxyXG4gICAgICAgICAgICBlcnJvcjogKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikgPT4gdGhpcy5vbkVycm9yR2V0SXRlbXNGcm9tU2VydmVyKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikgLy8gV2hlbiBTZXJ2aWNlIGNhbGwgZmFpbHNcclxuICAgICAgICB9KTsgLy8uYWpheFxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25TdWNjZXNzR2V0SXRlbXNGcm9tU2VydmVyKG1zZzogYW55LCB0ZXh0U3RhdHVzOiBzdHJpbmcsIGpxWEhSOiBKUXVlcnlYSFIpIHtcclxuICAgICAgICAvL1RPRE8gcmVkaXJlY3QgdXNlciB0byBhIG5ldyBwYWdlXHJcbiAgICAgICAgaWYgKG1zZy5TdWNjZXNzID09IHRydWUpIHtcclxuICAgICAgICAgICAgZG9jdW1lbnQubG9jYXRpb24ucmVwbGFjZShcIi9MZXRNZUtub3cvQ29uZmlybVwiKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyQoXCIjXCIgKyB0aGlzLk1lc3NhZ2VEaXZJZCkuY2hpbGRyZW4oKS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuTWVzc2FnZURpdklkKS5odG1sKFwiPHA+XCIrbXNnLk1lc3NhZ2UrIFwiICxcIittc2cuRXJyb3JDb2RlK1wiPC9wPlwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHByaXZhdGUgb25FcnJvckdldEl0ZW1zRnJvbVNlcnZlcihqcVhIUjogSlF1ZXJ5WEhSLCB0ZXh0U3RhdHVzOiBzdHJpbmcsIGVycm9yVGhyb3duOiBzdHJpbmcpIHtcclxuICAgICAgICAvL1RPRE8gaW5mb3JtIGVycm9yIHRvIHVzZXJcclxuICAgIH0gXHJcbn0iLCLvu79pbXBvcnQge05ld0FkQ3JpdGVyaWF9IGZyb20gXCIuL05ld0FkQ3JpdGVyaWFcIjtcclxuaW1wb3J0IHtJQ3JpdGVyaWFDaGFuZ2V9IGZyb20gXCIuLi8uLi8uLi9IZWxwZXIvSUNyaXRlcmlhQ2hhbmdlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTmV3QWRQYXJ0aWFsVmlld0xvYWRlciB7XHJcbiAgICBwcml2YXRlIF9wYXJ0aWFsVmlld0RpdklkOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIF91cmw6IHN0cmluZyA9IFwiL05ld0FkL0dldE5ld0FkUGFydGlhbFZpZXdcIjtcclxuICAgIHByaXZhdGUgX3ByZXZpb3VzQ2F0ZWdvcnlJZDogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgX2N1cnJlbnRDYXRlZ29yeUlkOiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBfbmV3QWRDcml0ZXJpYUNoYW5nZTogSUNyaXRlcmlhQ2hhbmdlO1xyXG4gICAgcHJpdmF0ZSBfbmV3QWRDcml0ZXJpYTogTmV3QWRDcml0ZXJpYTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwYXJ0aWFsVmlld0RpdklkOiBzdHJpbmcsIG5ld0FkQ3JpdGVyaWFDaGFuZ2U6IElDcml0ZXJpYUNoYW5nZSwgbmV3QWRDcml0ZXJpYTpOZXdBZENyaXRlcmlhKSB7XHJcbiAgICAgICAgdGhpcy5fcGFydGlhbFZpZXdEaXZJZCA9IHBhcnRpYWxWaWV3RGl2SWQ7XHJcbiAgICAgICAgdGhpcy5fbmV3QWRDcml0ZXJpYUNoYW5nZSA9IG5ld0FkQ3JpdGVyaWFDaGFuZ2U7XHJcbiAgICAgICAgdGhpcy5fbmV3QWRDcml0ZXJpYSA9IG5ld0FkQ3JpdGVyaWE7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIEdldFBhcnRpYWxWaWV3RnJvbVNlcnZlcihjYXRlZ29yeUlkOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9jdXJyZW50Q2F0ZWdvcnlJZCA9IGNhdGVnb3J5SWQ7XHJcbiAgICAgICAgbGV0IGNhbGxQYXJhbXMgPSBuZXcgUGFydGlhbFZpZXdTZXJ2ZXJDYWxsUGFyYW1ldGVycygpO1xyXG4gICAgICAgIGNhbGxQYXJhbXMuQ2F0ZWdvcnlJZCA9IGNhdGVnb3J5SWQ7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogXCJHRVRcIiwgLy9HRVQgb3IgUE9TVCBvciBQVVQgb3IgREVMRVRFIHZlcmJcclxuICAgICAgICAgICAgdXJsOiB0aGlzLl91cmwsXHJcbiAgICAgICAgICAgIGRhdGE6IGNhbGxQYXJhbXMsIC8vRGF0YSBzZW50IHRvIHNlcnZlclxyXG4gICAgICAgICAgICAvL2NvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbicsIC8vIGNvbnRlbnQgdHlwZSBzZW50IHRvIHNlcnZlclxyXG4gICAgICAgICAgICBzdWNjZXNzOiAobXNnLCB0ZXh0U3RhdHVzLCBqcVhIUikgPT4gdGhpcy5vblN1Y2Nlc3NHZXRJdGVtc0Zyb21TZXJ2ZXIobXNnLCB0ZXh0U3RhdHVzLCBqcVhIUiksLy9PbiBTdWNjZXNzZnVsbCBzZXJ2aWNlIGNhbGxcclxuICAgICAgICAgICAgZXJyb3I6IChqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pID0+IHRoaXMub25FcnJvckdldEl0ZW1zRnJvbVNlcnZlcihqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pLy8gV2hlbiBTZXJ2aWNlIGNhbGwgZmFpbHNcclxuICAgICAgICB9KTsvLy5hamF4XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvblN1Y2Nlc3NHZXRJdGVtc0Zyb21TZXJ2ZXIobXNnOiBhbnksIHRleHRTdGF0dXM6IHN0cmluZywganFYSFI6IEpRdWVyeVhIUikge1xyXG4gICAgICAgIHRoaXMuX25ld0FkQ3JpdGVyaWEuVW5CaW5kKHRoaXMuX3ByZXZpb3VzQ2F0ZWdvcnlJZCk7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX3BhcnRpYWxWaWV3RGl2SWQpLmNoaWxkcmVuKCkucmVtb3ZlKCk7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX3BhcnRpYWxWaWV3RGl2SWQpLmh0bWwobXNnKTtcclxuICAgICAgICB0aGlzLl9uZXdBZENyaXRlcmlhLkJpbmQodGhpcy5fY3VycmVudENhdGVnb3J5SWQsIHRoaXMuX25ld0FkQ3JpdGVyaWFDaGFuZ2UpO1xyXG4gICAgICAgIHRoaXMuX3ByZXZpb3VzQ2F0ZWdvcnlJZCA9IHRoaXMuX2N1cnJlbnRDYXRlZ29yeUlkO1xyXG4gICAgfS8vb25TdWNjZXNzR2V0VGltZUZyb21TZXJ2ZXJcclxuXHJcbiAgICBwcml2YXRlIG9uRXJyb3JHZXRJdGVtc0Zyb21TZXJ2ZXIoanFYSFI6IEpRdWVyeVhIUiwgdGV4dFN0YXR1czogc3RyaW5nLCBlcnJvclRocm93bjogc3RyaW5nKSB7XHJcbiAgICAgICAgYWxlcnQoZXJyb3JUaHJvd24pO1xyXG4gICAgfS8vb25FcnJvckdldFRpbWVGcm9tU2VydmVyXHJcbn1cclxuXHJcbi8vVE9ETyByZWZhY3RvciB0aGlzXHJcbmV4cG9ydCBjbGFzcyBQYXJ0aWFsVmlld1NlcnZlckNhbGxQYXJhbWV0ZXJzIHtcclxuICAgIHB1YmxpYyBDYXRlZ29yeUlkOm51bWJlcjtcclxufSJdfQ==
