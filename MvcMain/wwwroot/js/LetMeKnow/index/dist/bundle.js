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
},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CriteriaNumericDictionary = /** @class */ (function () {
    function CriteriaNumericDictionary() {
    }
    return CriteriaNumericDictionary;
}());
exports.CriteriaNumericDictionary = CriteriaNumericDictionary;
},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UserInput = /** @class */ (function () {
    function UserInput() {
        this.ParametersDictionary = {};
    }
    return UserInput;
}());
exports.UserInput = UserInput;
},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CategorySelection_1 = require("../../../Components/Category/CategorySelection");
var UserInput_1 = require("../../../Helper/UserInput");
var LetMeKnowServerCaller_1 = require("./LetMeKnowServerCaller");
var LetMeKnowPartialViewLoader_1 = require("./LetMeKnowPartialViewLoader");
var LetMeKnowCriteria_1 = require("./LetMeKnowCriteria");
var LetMeKnow = /** @class */ (function () {
    function LetMeKnow(categorySelectorParentDivId, allCategoriesId) {
        this.InsertLetMeKnowImageId = "insertLetMeKnow";
        this.LoadViewImageId = "loadView";
        this.EmailOrSmsKey = "EmailOrSms";
        this.EmailOrSmsParentDivId = "emailOrSms";
        this._registerLetMeKnowInputId = "registerLetMeKnow";
        this._categorySpecificCriteriaDivId = "CategorySpecificCriteria";
        this._partialViewDivId = "CategorySpecificCriteria";
        this.MessageDivId = "message";
        this.AddLetMeKnowRequestCode = 1; //
        this.LoadLetMeKnowPartialViewRequestCode = 2;
        this.initCategorySelect(categorySelectorParentDivId, allCategoriesId);
        this._letMeKnowServerCaller = new LetMeKnowServerCaller_1.LetMeKnowServerCaller(this, this.AddLetMeKnowRequestCode);
        this._letMeKnowCriteria = new LetMeKnowCriteria_1.LetMeKnowCriteria();
        this._letMeKnowPartialViewLoader =
            new LetMeKnowPartialViewLoader_1.LetMeKnowPartialViewLoader(this, this, this._letMeKnowCriteria, this.LoadLetMeKnowPartialViewRequestCode);
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
            var userInput = new UserInput_1.UserInput();
            _this._categorySelection.InsertCategoryIdInUserInputDictionary(userInput);
            _this._letMeKnowPartialViewLoader.GetPartialViewFromServer(userInput, args.SelectedCategoryId);
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
    LetMeKnow.prototype.OnResult = function (param, requestCode) {
        if (requestCode === this.LoadLetMeKnowPartialViewRequestCode) {
            $("#" + this._partialViewDivId).children().remove();
            $("#" + this._partialViewDivId).html(param);
        }
        if (requestCode === this.AddLetMeKnowRequestCode) {
            document.location.replace("/LetMeKnow/Confirm");
        }
    };
    LetMeKnow.prototype.OnError = function (message, requestCode) {
        if (requestCode === this.LoadLetMeKnowPartialViewRequestCode) {
            $("#" + this.MessageDivId).children().remove();
            $("#" + this.MessageDivId).html("<p>" + message + "</p>");
        }
        if (requestCode === this.AddLetMeKnowRequestCode) {
            $("#" + this.MessageDivId).children().remove();
            $("#" + this.MessageDivId).html("<p>" + message + "</p>");
        }
    };
    LetMeKnow.prototype.AjaxCallFinished = function (requestCode) {
        if (requestCode === this.LoadLetMeKnowPartialViewRequestCode) {
            $("#" + this.LoadViewImageId).hide();
        }
        if (requestCode === this.AddLetMeKnowRequestCode) {
            $("#" + this.InsertLetMeKnowImageId).hide();
            $("#" + this._registerLetMeKnowInputId).removeAttr("disabled");
        }
    };
    LetMeKnow.prototype.AjaxCallStarted = function (requestCode) {
        if (requestCode === this.LoadLetMeKnowPartialViewRequestCode) {
            $("#" + this.LoadViewImageId).show();
        }
        if (requestCode === this.AddLetMeKnowRequestCode) {
            $("#" + this.InsertLetMeKnowImageId).show();
            $("#" + this._registerLetMeKnowInputId).attr("disabled", "disabled");
        }
    };
    return LetMeKnow;
}());
exports.LetMeKnow = LetMeKnow;
var categorySelectorParentDivId = "categorySelector";
var allCategoriesId = "allCategories";
$(document).ready(function () {
    var letMeKnow = new LetMeKnow(categorySelectorParentDivId, allCategoriesId);
});
},{"../../../Components/Category/CategorySelection":1,"../../../Helper/UserInput":6,"./LetMeKnowCriteria":8,"./LetMeKnowPartialViewLoader":11,"./LetMeKnowServerCaller":12}],8:[function(require,module,exports){
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
},{"../../../Helper/CriteriaNumericDictionary":5,"./LetMeKnowCriteria/AdTransportationLetMeKnowCriteria":9,"./LetMeKnowCriteria/DefaultLetMeKnowCriteria":10}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CarModelBrandController_1 = require("../../../../Components/Transformation/CarModelBrandController");
var AdTransportationLetMeKnowCriteria = /** @class */ (function () {
    function AdTransportationLetMeKnowCriteria() {
        this.MakeYearFromKey = "MakeYearFrom";
        this.MakeYearFromInputId = "fromYear";
        this.MakeYearToKey = "MakeYearTo";
        this.MakeYearToInputId = "toYear";
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
        userInput.ParametersDictionary[this.MakeYearFromKey] = $("#" + this.MakeYearFromInputId).val(); //MakeYearFrom
        userInput.ParametersDictionary[this.MakeYearToKey] = $("#" + this.MakeYearToInputId).val(); //MakeYearTo
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
},{"../../../../Components/Transformation/CarModelBrandController":2}],10:[function(require,module,exports){
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
},{}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AjaxCaller_1 = require("../../../Helper/AjaxCaller");
var LetMeKnowPartialViewLoader = /** @class */ (function () {
    function LetMeKnowPartialViewLoader(resultHandler, criteriaChange, letMeKnowCriteria, requestCode) {
        this.RequestIndexKey = "RequestIndex";
        this._currentRequestIndex = 0;
        this._url = "/LetMeKnow/GetLetMeKnowPartialView";
        this._previousCategoryId = 0;
        this._currentCategoryId = 0;
        this._resultHandler = resultHandler;
        this._ajaxCaller = new AjaxCaller_1.AjaxCaller(this._url, this, requestCode);
        this._criteriaChange = criteriaChange;
        this._letMeKnowCriteria = letMeKnowCriteria;
    }
    LetMeKnowPartialViewLoader.prototype.GetPartialViewFromServer = function (userInput, categoryId) {
        this._currentCategoryId = categoryId;
        this._currentRequestIndex++;
        userInput.ParametersDictionary[this.RequestIndexKey] = this._currentRequestIndex;
        this._ajaxCaller.Call(userInput);
    };
    LetMeKnowPartialViewLoader.prototype.OnResult = function (param, requestCode) {
        if (param.CustomDictionary[this.RequestIndexKey] == this._currentRequestIndex) {
            if (param.Success == true) {
                this._letMeKnowCriteria.UnBind(this._previousCategoryId);
                this._resultHandler.OnResult(param.ResponseData, requestCode);
                this._letMeKnowCriteria.Bind(this._currentCategoryId, this._criteriaChange);
                this._previousCategoryId = this._currentCategoryId;
            }
            else {
                this._resultHandler.OnError(param.Message + " , " + param.ErrorCode, requestCode);
            }
        }
    };
    LetMeKnowPartialViewLoader.prototype.OnError = function (message, requestCode) {
        this._resultHandler.OnError(message, requestCode);
    };
    LetMeKnowPartialViewLoader.prototype.AjaxCallFinished = function (requestCode) {
        this._resultHandler.AjaxCallFinished(requestCode);
    };
    LetMeKnowPartialViewLoader.prototype.AjaxCallStarted = function (requestCode) {
        this._resultHandler.AjaxCallStarted(requestCode);
    };
    return LetMeKnowPartialViewLoader;
}());
exports.LetMeKnowPartialViewLoader = LetMeKnowPartialViewLoader;
},{"../../../Helper/AjaxCaller":4}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AjaxCaller_1 = require("../../../Helper/AjaxCaller");
var LetMeKnowServerCaller = /** @class */ (function () {
    function LetMeKnowServerCaller(resultHandler, requestCode) {
        this.RequestIndexKey = "RequestIndex";
        this._currentRequestIndex = 0;
        this._url = "/api/LetMeKnowApi/AddNewLetMeKnowRecord";
        this._resultHandler = resultHandler;
        this._ajaxCaller = new AjaxCaller_1.AjaxCaller(this._url, this, requestCode);
    }
    LetMeKnowServerCaller.prototype.SaveAd = function (userInput) {
        this._currentRequestIndex++;
        userInput.ParametersDictionary[this.RequestIndexKey] = this._currentRequestIndex;
        this._ajaxCaller.Call(userInput);
    };
    LetMeKnowServerCaller.prototype.OnResult = function (param, requestCode) {
        if (param.CustomDictionary[this.RequestIndexKey] == this._currentRequestIndex) {
            if (param.Success == true) {
                this._resultHandler.OnResult(param.ResponseData, requestCode);
            }
            else {
                this._resultHandler.OnError(param.Message, requestCode);
            }
        }
    };
    LetMeKnowServerCaller.prototype.OnError = function (message, requestCode) {
        this._resultHandler.OnError(message, requestCode);
    };
    LetMeKnowServerCaller.prototype.AjaxCallFinished = function (requestCode) {
        this._resultHandler.AjaxCallFinished(requestCode);
    };
    LetMeKnowServerCaller.prototype.AjaxCallStarted = function (requestCode) {
        this._resultHandler.AjaxCallStarted(requestCode);
    };
    return LetMeKnowServerCaller;
}());
exports.LetMeKnowServerCaller = LetMeKnowServerCaller;
},{"../../../Helper/AjaxCaller":4}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3d3dyb290L2pzL0NvbXBvbmVudHMvQ2F0ZWdvcnkvQ2F0ZWdvcnlTZWxlY3Rpb24udHMiLCJ3d3dyb290L2pzL0NvbXBvbmVudHMvVHJhbnNmb3JtYXRpb24vQ2FyTW9kZWxCcmFuZENvbnRyb2xsZXIudHMiLCJ3d3dyb290L2pzL0V2ZW50cy9FdmVudERpc3BhdGNoZXIudHMiLCJ3d3dyb290L2pzL0hlbHBlci9BamF4Q2FsbGVyLnRzIiwid3d3cm9vdC9qcy9IZWxwZXIvQ3JpdGVyaWFOdW1lcmljRGljdGlvbmFyeS50cyIsInd3d3Jvb3QvanMvSGVscGVyL1VzZXJJbnB1dC50cyIsInd3d3Jvb3QvanMvTGV0TWVLbm93L2luZGV4L3NyYy9MZXRNZUtub3cudHMiLCJ3d3dyb290L2pzL0xldE1lS25vdy9pbmRleC9zcmMvTGV0TWVLbm93Q3JpdGVyaWEudHMiLCJ3d3dyb290L2pzL0xldE1lS25vdy9pbmRleC9zcmMvTGV0TWVLbm93Q3JpdGVyaWEvQWRUcmFuc3BvcnRhdGlvbkxldE1lS25vd0NyaXRlcmlhLnRzIiwid3d3cm9vdC9qcy9MZXRNZUtub3cvaW5kZXgvc3JjL0xldE1lS25vd0NyaXRlcmlhL0RlZmF1bHRMZXRNZUtub3dDcml0ZXJpYS50cyIsInd3d3Jvb3QvanMvTGV0TWVLbm93L2luZGV4L3NyYy9MZXRNZUtub3dQYXJ0aWFsVmlld0xvYWRlci50cyIsInd3d3Jvb3QvanMvTGV0TWVLbm93L2luZGV4L3NyYy9MZXRNZUtub3dTZXJ2ZXJDYWxsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FDLGdFQUErRDtBQUloRTtJQTJCSSwyQkFBWSxXQUFtQixFQUFFLGFBQXlCO1FBekJuRCxpQ0FBNEIsR0FBZ0UsSUFBSSxpQ0FBZSxFQUE4QyxDQUFDO1FBRXBKLGtCQUFhLEdBQUcsWUFBWSxDQUFDO1FBSzdCLHdCQUFtQixHQUFHLG1CQUFtQixD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REFBZ0IsR0FBaEIsVUFBaUIsV0FBbUI7UUFDaEMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBQ0QsK0NBQWUsR0FBZixVQUFnQixXQUFtQjtRQUMvQixJQUFJLENBQUMsY0FBYyxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBQ0wsNEJBQUM7QUFBRCxDQS9DQSxBQStDQyxJQUFBO0FBL0NZLHNEQUFxQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCLvu79pbXBvcnQgeyBFdmVudERpc3BhdGNoZXIgfSBmcm9tIFwiLi4vLi4vRXZlbnRzL0V2ZW50RGlzcGF0Y2hlclwiO1xyXG5pbXBvcnQgeyBDYXRlZ29yeSB9IGZyb20gXCIuLi8uLi9Nb2RlbHMvQ2F0ZWdvcnlcIjtcclxuaW1wb3J0IHsgVXNlcklucHV0IH0gZnJvbSBcIi4uLy4uL0hlbHBlci9Vc2VySW5wdXRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDYXRlZ29yeVNlbGVjdGlvbiB7XHJcblxyXG4gICAgcHVibGljIFNlbGVjdGVkQ2F0ZWdvcnlDaGFuZ2VkRXZlbnQ6IEV2ZW50RGlzcGF0Y2hlcjxDYXRlZ29yeVNlbGVjdGlvbiwgQ2F0ZWdvcnlDYWhuZ2VkRXZlbnRBcmc+ID0gbmV3IEV2ZW50RGlzcGF0Y2hlcjxDYXRlZ29yeVNlbGVjdGlvbiwgQ2F0ZWdvcnlDYWhuZ2VkRXZlbnRBcmc+KCk7XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBDYXRlZ29yeUlkS2V5ID0gXCJDYXRlZ29yeUlkXCI7XHJcblxyXG4gICAgcHJpdmF0ZSBfcGFyZW50RGl2SWQ6IHN0cmluZzsvL2RpdiBlbGVtZW50IHRoYXQgaG9sZHMgYWxsIENhdGVnb3J5U2VsZWN0aW9uIGVsZW1lbnRzXHJcbiAgICBwcml2YXRlIF9hbGxDYXRlZ29yaWVzOiBDYXRlZ29yeVtdO1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2ZpcnN0TGV2ZWxUZW1wbGF0ZSA9IFwiY2F0ZWdvcnkxVGVtcGxhdGVcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2ZpcnN0TGV2ZWxEaXYgPSBcImNhdGVnb3J5MVwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfZmlyc3RMZXZlbFNlbGVjdDogc3RyaW5nID0gXCJzZWxlY3QxXCI7XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfc2Vjb25kTGV2ZWxUZW1wbGF0ZSA9IFwiY2F0ZWdvcnkyVGVtcGxhdGVcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX3NlY29uZExldmVsRGl2ID0gXCJjYXRlZ29yeTJcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX3NlY29uZExldmVsU2VsZWN0OiBzdHJpbmcgPSBcInNlbGVjdDJcIjtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF90aGlyZExldmVsVGVtcGxhdGUgPSBcImNhdGVnb3J5M1RlbXBsYXRlXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF90aGlyZExldmVsRGl2ID0gXCJjYXRlZ29yeTNcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX3RoaXJkTGV2ZWxTZWxlY3Q6IHN0cmluZyA9IFwic2VsZWN0M1wiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfcm9vdENhdGVnb3J5SWQ6IG51bWJlciA9IDA7XHJcblxyXG4gICAgcHJpdmF0ZSBfc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxPbmU6IG51bWJlcjtcclxuICAgIHByaXZhdGUgX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVHdvOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIF9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFRocmVlOiBudW1iZXI7XHJcblxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBhcmVudERpdklkOiBzdHJpbmcsIGFsbENhdGVnb3JpZXM6IENhdGVnb3J5W10pIHtcclxuICAgICAgICB0aGlzLl9wYXJlbnREaXZJZCA9IHBhcmVudERpdklkO1xyXG4gICAgICAgIHRoaXMuX2FsbENhdGVnb3JpZXMgPSBhbGxDYXRlZ29yaWVzO1xyXG4gICAgfVxyXG5cclxuICAgIFxyXG5cclxuICAgIHB1YmxpYyBTZXRDYXRlZ29yeUlkKHNlbGVjdGVkQ2F0ZWdvcnlJZDogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgbGV0IGZpcnN0TGV2ZWxJZDogbnVtYmVyO1xyXG4gICAgICAgIGxldCBzZWNvbmRMZXZlbElkOiBudW1iZXI7XHJcbiAgICAgICAgbGV0IGNhdGVnb3J5TGV2ZWwgPSB0aGlzLmdldENhdGVnb3J5TGV2ZWwoc2VsZWN0ZWRDYXRlZ29yeUlkKTtcclxuICAgICAgICBzd2l0Y2ggKGNhdGVnb3J5TGV2ZWwpIHtcclxuICAgICAgICBjYXNlIENhdGVnb3J5TGV2ZWwuVW5rb3duOlxyXG4gICAgICAgICAgICB0aGlzLkNyZWF0ZUZpcnN0TGV2ZWwoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIENhdGVnb3J5TGV2ZWwuTGV2ZWwxOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5DcmVhdGVGaXJzdExldmVsKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldEZpcnN0TGV2ZWxUb1NwZWNpZmljSWQoc2VsZWN0ZWRDYXRlZ29yeUlkKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlU2Vjb25kTGV2ZWwoc2VsZWN0ZWRDYXRlZ29yeUlkKTtcclxuICAgICAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLl9maXJzdExldmVsU2VsZWN0KS50cmlnZ2VyKFwiY2hhbmdlXCIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgQ2F0ZWdvcnlMZXZlbC5MZXZlbDI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLkNyZWF0ZUZpcnN0TGV2ZWwoKTtcclxuICAgICAgICAgICAgICAgIGZpcnN0TGV2ZWxJZCA9IHRoaXMuX2FsbENhdGVnb3JpZXMuZmlsdGVyKGNhdGVnb3J5ID0+IGNhdGVnb3J5LkNhdGVnb3J5SWQgPT09IHNlbGVjdGVkQ2F0ZWdvcnlJZClbMF1cclxuICAgICAgICAgICAgICAgICAgICAuQ2F0ZWdvcnlQYXJlbnRJZDtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0Rmlyc3RMZXZlbFRvU3BlY2lmaWNJZChmaXJzdExldmVsSWQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVTZWNvbmRMZXZlbChmaXJzdExldmVsSWQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTZWNvbmRMZXZlbFRvU3BlY2lmaWNJZChzZWxlY3RlZENhdGVnb3J5SWQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVUaGlyZExldmVsKHNlbGVjdGVkQ2F0ZWdvcnlJZCk7XHJcbiAgICAgICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5fc2Vjb25kTGV2ZWxTZWxlY3QpLnRyaWdnZXIoXCJjaGFuZ2VcIik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIENhdGVnb3J5TGV2ZWwuTGV2ZWwzOlxyXG4gICAgICAgICAgICB0aGlzLkNyZWF0ZUZpcnN0TGV2ZWwoKTtcclxuICAgICAgICAgICAgc2Vjb25kTGV2ZWxJZCA9IHRoaXMuX2FsbENhdGVnb3JpZXMuZmlsdGVyKGNhdGVnb3J5ID0+IGNhdGVnb3J5LkNhdGVnb3J5SWQgPT09IHNlbGVjdGVkQ2F0ZWdvcnlJZClbMF1cclxuICAgICAgICAgICAgICAgICAgICAuQ2F0ZWdvcnlQYXJlbnRJZDtcclxuICAgICAgICAgICAgZmlyc3RMZXZlbElkID0gdGhpcy5fYWxsQ2F0ZWdvcmllcy5maWx0ZXIoY2F0ZWdvcnkgPT4gY2F0ZWdvcnkuQ2F0ZWdvcnlJZCA9PT0gc2Vjb25kTGV2ZWxJZClbMF1cclxuICAgICAgICAgICAgICAgIC5DYXRlZ29yeVBhcmVudElkO1xyXG4gICAgICAgICAgICB0aGlzLnNldEZpcnN0TGV2ZWxUb1NwZWNpZmljSWQoZmlyc3RMZXZlbElkKTtcclxuICAgICAgICAgICAgdGhpcy5jcmVhdGVTZWNvbmRMZXZlbChmaXJzdExldmVsSWQpO1xyXG4gICAgICAgICAgICB0aGlzLnNldFNlY29uZExldmVsVG9TcGVjaWZpY0lkKHNlY29uZExldmVsSWQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVUaGlyZExldmVsKHNlY29uZExldmVsSWQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRUaGlyZExldmVsVG9TcGVjaWZpY0lkKHNlbGVjdGVkQ2F0ZWdvcnlJZCk7XHJcbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLl90aGlyZExldmVsU2VsZWN0KS50cmlnZ2VyKFwiY2hhbmdlXCIpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXRGaXJzdExldmVsVG9TcGVjaWZpY0lkKGNhdGVnb3J5SWQ6IG51bWJlcikge1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9maXJzdExldmVsU2VsZWN0KS52YWwoY2F0ZWdvcnlJZCk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHNldFNlY29uZExldmVsVG9TcGVjaWZpY0lkKGNhdGVnb3J5SWQ6IG51bWJlcikge1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9zZWNvbmRMZXZlbFNlbGVjdCkudmFsKGNhdGVnb3J5SWQpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBzZXRUaGlyZExldmVsVG9TcGVjaWZpY0lkKGNhdGVnb3J5SWQ6IG51bWJlcikge1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl90aGlyZExldmVsU2VsZWN0KS52YWwoY2F0ZWdvcnlJZCk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGdldENhdGVnb3J5TGV2ZWwoY2F0ZWdvcnlJZDogbnVtYmVyKTogQ2F0ZWdvcnlMZXZlbCB7XHJcblxyXG4gICAgICAgIGxldCB0ZW1wQ2F0ZWdvcnlBcnJheSA9IHRoaXMuX2FsbENhdGVnb3JpZXMuZmlsdGVyKGNhdGVnb3J5ID0+IGNhdGVnb3J5LkNhdGVnb3J5SWQgPT09IGNhdGVnb3J5SWQpO1xyXG4gICAgICAgIGxldCB0ZW1wQ2F0ZWdvcnk7XHJcbiAgICAgICAgaWYgKHRlbXBDYXRlZ29yeUFycmF5Lmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gQ2F0ZWdvcnlMZXZlbC5Vbmtvd247XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRlbXBDYXRlZ29yeSA9IHRlbXBDYXRlZ29yeUFycmF5WzBdO1xyXG4gICAgICAgIGlmICh0ZW1wQ2F0ZWdvcnkuUGFyZW50Q2F0ZWdvcnlJZCA9PT0gdGhpcy5fcm9vdENhdGVnb3J5SWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIENhdGVnb3J5TGV2ZWwuTGV2ZWwxO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0ZW1wQ2F0ZWdvcnkgPSB0aGlzLl9hbGxDYXRlZ29yaWVzLmZpbHRlcihjYXRlZ29yeSA9PiBjYXRlZ29yeS5DYXRlZ29yeUlkID09PSB0ZW1wQ2F0ZWdvcnkuUGFyZW50Q2F0ZWdvcnlJZClbMF07XHJcbiAgICAgICAgaWYgKHRlbXBDYXRlZ29yeS5QYXJlbnRDYXRlZ29yeUlkID09PSB0aGlzLl9yb290Q2F0ZWdvcnlJZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gQ2F0ZWdvcnlMZXZlbC5MZXZlbDI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBDYXRlZ29yeUxldmVsLkxldmVsMztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgSW5zZXJ0Q2F0ZWdvcnlJZEluVXNlcklucHV0RGljdGlvbmFyeSh1c2VySW5wdXQ6IFVzZXJJbnB1dCk6IHZvaWQge1xyXG4gICAgICAgIGxldCBjYXRlZ29yeUlkID0gdGhpcy5HZXRTZWxlY3RlZENhdGVnb3J5SWQoKTtcclxuICAgICAgICB1c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnlbdGhpcy5DYXRlZ29yeUlkS2V5XSA9IGNhdGVnb3J5SWQ7Ly8xMDAgZm9yIGNhcnNcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgR2V0U2VsZWN0ZWRDYXRlZ29yeUlkKCk6IG51bWJlciB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVGhyZWUgIT09IHVuZGVmaW5lZCAmJlxyXG4gICAgICAgICAgICB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFRocmVlICE9PSB0aGlzLl9yb290Q2F0ZWdvcnlJZClcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVGhyZWU7XHJcbiAgICAgICAgZWxzZSBpZiAodGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUd28gIT09IHVuZGVmaW5lZCAmJlxyXG4gICAgICAgICAgICB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFR3byAhPT0gdGhpcy5fcm9vdENhdGVnb3J5SWQpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFR3bztcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbE9uZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgQ3JlYXRlRmlyc3RMZXZlbCgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnJlbW92ZUVsZW1lbnQodGhpcy5fZmlyc3RMZXZlbERpdik7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxPbmUgPSB0aGlzLl9yb290Q2F0ZWdvcnlJZDtcclxuICAgICAgICB0aGlzLnJlbW92ZUVsZW1lbnQodGhpcy5fc2Vjb25kTGV2ZWxEaXYpO1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVHdvID0gdGhpcy5fcm9vdENhdGVnb3J5SWQ7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVFbGVtZW50KHRoaXMuX3RoaXJkTGV2ZWxEaXYpO1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVGhyZWUgPSB0aGlzLl9yb290Q2F0ZWdvcnlJZDtcclxuXHJcbiAgICAgICAgbGV0IHRlbXBsYXRlID0gJChcIiNcIiArIHRoaXMuX2ZpcnN0TGV2ZWxUZW1wbGF0ZSkuaHRtbCgpO1xyXG4gICAgICAgIGxldCBjYXRlZ29yaWVzOiBDYXRlZ29yeVtdID0gbmV3IEFycmF5PENhdGVnb3J5PigpO1xyXG4gICAgICAgIGxldCBkYXRhID0geyBjYXRlZ29yaWVzOiBjYXRlZ29yaWVzIH1cclxuICAgICAgICB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbE9uZSA9IHRoaXMuX3Jvb3RDYXRlZ29yeUlkOy8vXHJcbiAgICAgICAgdGhpcy5fYWxsQ2F0ZWdvcmllcy5mb3JFYWNoKGNhdGVnb3J5ID0+IHtcclxuICAgICAgICAgICAgaWYgKGNhdGVnb3J5LkNhdGVnb3J5UGFyZW50SWQgPT09IHRoaXMuX3Jvb3RDYXRlZ29yeUlkKSB7XHJcbiAgICAgICAgICAgICAgICBjYXRlZ29yaWVzLnB1c2goY2F0ZWdvcnkpO1xyXG4gICAgICAgICAgICB9Ly9pZlxyXG4gICAgICAgIH0pOy8vZm9yRWFjaFxyXG5cclxuICAgICAgICBsZXQgaHRtbCA9IE11c3RhY2hlLnRvX2h0bWwodGVtcGxhdGUsIGRhdGEpO1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9wYXJlbnREaXZJZCkuYXBwZW5kKGh0bWwpO1xyXG5cclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fZmlyc3RMZXZlbFNlbGVjdCkuY2hhbmdlKChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgc2VsZWN0ZWRJZCA9IHBhcnNlSW50KCQoZXZlbnQuY3VycmVudFRhcmdldCkudmFsKCkudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsT25lID0gc2VsZWN0ZWRJZDtcclxuICAgICAgICAgICAgdGhpcy5jcmVhdGVTZWNvbmRMZXZlbChzZWxlY3RlZElkKTtcclxuICAgICAgICAgICAgbGV0IGV2ZW50QXJnID0gbmV3IENhdGVnb3J5Q2FobmdlZEV2ZW50QXJnKCk7XHJcbiAgICAgICAgICAgIGV2ZW50QXJnLlNlbGVjdGVkQ2F0ZWdvcnlJZCA9IHRoaXMuR2V0U2VsZWN0ZWRDYXRlZ29yeUlkKCk7XHJcbiAgICAgICAgICAgIGV2ZW50QXJnLlNlbGVjdGVkQ2F0ZWdvcnlIYXNDaGlsZCA9IHRoaXMuc2VsZWN0ZWRDYXRlZ29yeUhhc0NoaWxkcmVuKCk7XHJcbiAgICAgICAgICAgIHRoaXMuU2VsZWN0ZWRDYXRlZ29yeUNoYW5nZWRFdmVudC5EaXNwYXRjaCh0aGlzLCBldmVudEFyZyk7XHJcbiAgICAgICAgfSk7Ly9jaGFuZ2VcclxuICAgIH0vL0NyZWF0ZUZpcnN0TGV2ZWxcclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZVNlY29uZExldmVsKGZpcnN0TGV2ZWxDYXRlZ29yeUlkOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnJlbW92ZUVsZW1lbnQodGhpcy5fc2Vjb25kTGV2ZWxEaXYpO1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVHdvID0gdGhpcy5fcm9vdENhdGVnb3J5SWQ7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVFbGVtZW50KHRoaXMuX3RoaXJkTGV2ZWxEaXYpO1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVGhyZWUgPSB0aGlzLl9yb290Q2F0ZWdvcnlJZDtcclxuICAgICAgICBpZiAoZmlyc3RMZXZlbENhdGVnb3J5SWQgPT09IHRoaXMuX3Jvb3RDYXRlZ29yeUlkKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCB0ZW1wbGF0ZSA9ICQoXCIjXCIgKyB0aGlzLl9zZWNvbmRMZXZlbFRlbXBsYXRlKS5odG1sKCk7XHJcbiAgICAgICAgbGV0IGNhdGVnb3JpZXM6IENhdGVnb3J5W10gPSBuZXcgQXJyYXk8Q2F0ZWdvcnk+KCk7XHJcbiAgICAgICAgbGV0IGRhdGEgPSB7IGNhdGVnb3JpZXM6IGNhdGVnb3JpZXMgfVxyXG5cclxuICAgICAgICB0aGlzLl9hbGxDYXRlZ29yaWVzLmZvckVhY2goY2F0ZWdvcnkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoY2F0ZWdvcnkuQ2F0ZWdvcnlQYXJlbnRJZCA9PT0gZmlyc3RMZXZlbENhdGVnb3J5SWQpIHtcclxuICAgICAgICAgICAgICAgIGNhdGVnb3JpZXMucHVzaChjYXRlZ29yeSk7XHJcbiAgICAgICAgICAgIH0vL2lmXHJcbiAgICAgICAgfSk7Ly9mb3JFYWNoXHJcblxyXG4gICAgICAgIGxldCBodG1sID0gTXVzdGFjaGUudG9faHRtbCh0ZW1wbGF0ZSwgZGF0YSk7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX3BhcmVudERpdklkKS5hcHBlbmQoaHRtbCk7XHJcblxyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9zZWNvbmRMZXZlbFNlbGVjdCkuY2hhbmdlKChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgc2VsZWN0ZWRJZCA9IHBhcnNlSW50KCQoZXZlbnQuY3VycmVudFRhcmdldCkudmFsKCkudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVHdvID0gc2VsZWN0ZWRJZDtcclxuICAgICAgICAgICAgdGhpcy5jcmVhdGVUaGlyZExldmVsKHNlbGVjdGVkSWQpO1xyXG4gICAgICAgICAgICBsZXQgZXZlbnRBcmcgPSBuZXcgQ2F0ZWdvcnlDYWhuZ2VkRXZlbnRBcmcoKTtcclxuICAgICAgICAgICAgZXZlbnRBcmcuU2VsZWN0ZWRDYXRlZ29yeUlkID0gdGhpcy5HZXRTZWxlY3RlZENhdGVnb3J5SWQoKTtcclxuICAgICAgICAgICAgZXZlbnRBcmcuU2VsZWN0ZWRDYXRlZ29yeUhhc0NoaWxkID0gdGhpcy5zZWxlY3RlZENhdGVnb3J5SGFzQ2hpbGRyZW4oKTtcclxuICAgICAgICAgICAgdGhpcy5TZWxlY3RlZENhdGVnb3J5Q2hhbmdlZEV2ZW50LkRpc3BhdGNoKHRoaXMsIGV2ZW50QXJnKTtcclxuICAgICAgICB9KTsvL2NoYW5nZVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlVGhpcmRMZXZlbChzZWNvbmRMZXZlbENhdGVnb3J5SWQ6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMucmVtb3ZlRWxlbWVudCh0aGlzLl90aGlyZExldmVsRGl2KTtcclxuICAgICAgICB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFRocmVlID0gdGhpcy5fcm9vdENhdGVnb3J5SWQ7XHJcblxyXG4gICAgICAgIGlmIChzZWNvbmRMZXZlbENhdGVnb3J5SWQgPT09IHRoaXMuX3Jvb3RDYXRlZ29yeUlkKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCB0ZW1wbGF0ZSA9ICQoXCIjXCIgKyB0aGlzLl90aGlyZExldmVsVGVtcGxhdGUpLmh0bWwoKTtcclxuICAgICAgICBsZXQgY2F0ZWdvcmllczogQ2F0ZWdvcnlbXSA9IG5ldyBBcnJheTxDYXRlZ29yeT4oKTtcclxuICAgICAgICBsZXQgZGF0YSA9IHsgY2F0ZWdvcmllczogY2F0ZWdvcmllcyB9XHJcblxyXG4gICAgICAgIHRoaXMuX2FsbENhdGVnb3JpZXMuZm9yRWFjaChjYXRlZ29yeSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChjYXRlZ29yeS5DYXRlZ29yeVBhcmVudElkID09PSBzZWNvbmRMZXZlbENhdGVnb3J5SWQpIHtcclxuICAgICAgICAgICAgICAgIGNhdGVnb3JpZXMucHVzaChjYXRlZ29yeSk7XHJcbiAgICAgICAgICAgIH0vL2lmXHJcbiAgICAgICAgfSk7Ly9mb3JFYWNoXHJcbiAgICAgICAgaWYgKGNhdGVnb3JpZXMubGVuZ3RoID09PSAwKSB7Ly9ObyBJdGVtIGluIHRoaXJkIGxldmVsIGNhdGVnb3J5XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGh0bWwgPSBNdXN0YWNoZS50b19odG1sKHRlbXBsYXRlLCBkYXRhKTtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fcGFyZW50RGl2SWQpLmFwcGVuZChodG1sKTtcclxuXHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX3RoaXJkTGV2ZWxTZWxlY3QpLmNoYW5nZSgoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUaHJlZSA9IHBhcnNlSW50KCQoZXZlbnQuY3VycmVudFRhcmdldCkudmFsKCkudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgIGxldCBldmVudEFyZyA9IG5ldyBDYXRlZ29yeUNhaG5nZWRFdmVudEFyZygpO1xyXG4gICAgICAgICAgICBldmVudEFyZy5TZWxlY3RlZENhdGVnb3J5SWQgPSB0aGlzLkdldFNlbGVjdGVkQ2F0ZWdvcnlJZCgpO1xyXG4gICAgICAgICAgICBldmVudEFyZy5TZWxlY3RlZENhdGVnb3J5SGFzQ2hpbGQgPSB0aGlzLnNlbGVjdGVkQ2F0ZWdvcnlIYXNDaGlsZHJlbigpO1xyXG4gICAgICAgICAgICB0aGlzLlNlbGVjdGVkQ2F0ZWdvcnlDaGFuZ2VkRXZlbnQuRGlzcGF0Y2godGhpcywgZXZlbnRBcmcpO1xyXG4gICAgICAgIH0pOy8vY2hhbmdlXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZWxlY3RlZENhdGVnb3J5SGFzQ2hpbGRyZW4oKTogYm9vbGVhbiB7XHJcbiAgICAgICAgbGV0IHNlbGVjdGVkQ2F0ZWdvcnlJZCA9IHRoaXMuR2V0U2VsZWN0ZWRDYXRlZ29yeUlkKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FsbENhdGVnb3JpZXMuZmlsdGVyXHJcbiAgICAgICAgICAgICgoY2F0ZWdvcnkpID0+IHsgcmV0dXJuIGNhdGVnb3J5LkNhdGVnb3J5UGFyZW50SWQgPT09IHNlbGVjdGVkQ2F0ZWdvcnlJZCB9KS5sZW5ndGggPiAwO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVtb3ZlRWxlbWVudChpZDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgJChcIiNcIiArIGlkKS5yZW1vdmUoKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIENhdGVnb3J5Q2FobmdlZEV2ZW50QXJnIHtcclxuICAgIHB1YmxpYyBTZWxlY3RlZENhdGVnb3J5SWQ6IG51bWJlcjtcclxuICAgIHB1YmxpYyBTZWxlY3RlZENhdGVnb3J5SGFzQ2hpbGQ6IGJvb2xlYW47XHJcbn1cclxuXHJcbmVudW0gQ2F0ZWdvcnlMZXZlbCB7XHJcbiAgICBMZXZlbDEgPSAxLFxyXG4gICAgTGV2ZWwyID0gMixcclxuICAgIExldmVsMyA9IDMsXHJcbiAgICBVbmtvd249NFxyXG59XHJcblxyXG4iLCLvu79pbXBvcnQge0Nhck1vZGVsfSBmcm9tIFwiLi4vLi4vTW9kZWxzL0FkVHJhbnNwb3J0YXRpb24vQ2FyTW9kZWxcIjtcclxuaW1wb3J0IHtVc2VySW5wdXR9IGZyb20gXCIuLi8uLi9IZWxwZXIvVXNlcklucHV0XCI7XHJcbmltcG9ydCB7SUNyaXRlcmlhLENyaXRlcmlhVmFsaWRhdG9yfSBmcm9tIFwiLi4vLi4vSGVscGVyL0lDcml0ZXJpYVwiO1xyXG5pbXBvcnQge0lDcml0ZXJpYUNoYW5nZX0gZnJvbSBcIi4uLy4uL0hlbHBlci9JQ3JpdGVyaWFDaGFuZ2VcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDYXJNb2RlbEJyYW5kQ29udHJvbGxlciBpbXBsZW1lbnRzIElDcml0ZXJpYSB7XHJcbiAgICBWYWxpZGF0ZUNyaXRlcmlhKCk6IENyaXRlcmlhVmFsaWRhdG9yIHsgdGhyb3cgbmV3IEVycm9yKFwiTm90IGltcGxlbWVudGVkXCIpOyB9XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBDYXJCcmFuZElkS2V5OiBzdHJpbmcgPSBcIkJyYW5kSWRcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgQnJhbmRTZWxlY3RJZDogc3RyaW5nID0gXCJicmFuZFwiO1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgQ2FyTW9kZWxUZW1wbGF0ZUlkOiBzdHJpbmcgPSBcIm1vZGVsVGVtcGxhdGVcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgQ2FyTW9kZWxEaXZQbGFjZUhvbGRlcklkOiBzdHJpbmcgPSBcIm1vZGVsUGxhY2VIb2xkZXJcIjtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IENhck1vZGVsSWRLZXk6IHN0cmluZyA9IFwiQ2FyTW9kZWxJZFwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBBbGxDYXJNb2RlbHNJbnB1dElkOiBzdHJpbmcgPSBcImFsbENhck1vZGVsc1wiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBNb2RlbFNlbGVjdElkOiBzdHJpbmcgPSBcIm1vZGVsXCI7XHJcbiAgICBwcml2YXRlIF9hbGxDYXJNb2RlbHM6IENhck1vZGVsW107XHJcblxyXG4gICAgcHJpdmF0ZSBfc2VhcmNoQ3JpdGVyaWFDaGFuZ2U6SUNyaXRlcmlhQ2hhbmdlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuaW5pdFZpZXcoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXRWaWV3KCk6IHZvaWQge1xyXG4gICAgICAgIGxldCBhbGxDYXJNb2RlbHNTdHJpbmcgPSAkKFwiI1wiICsgdGhpcy5BbGxDYXJNb2RlbHNJbnB1dElkKS52YWwoKS50b1N0cmluZygpO1xyXG4gICAgICAgIHRoaXMuX2FsbENhck1vZGVscyA9ICQucGFyc2VKU09OKGFsbENhck1vZGVsc1N0cmluZykgYXMgQ2FyTW9kZWxbXTtcclxuICAgICAgICB0aGlzLmluaXRDYXJNb2RlbCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaW5pdENhck1vZGVsKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuY3JlYXRlQ2FyTW9kZWxFbGVtZW50KG5ldyBBcnJheTxDYXJNb2RlbD4oKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVDYXJNb2RlbEVsZW1lbnQoY2FyTW9kZWxzOiBDYXJNb2RlbFtdKSB7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuQ2FyTW9kZWxEaXZQbGFjZUhvbGRlcklkKS5jaGlsZHJlbigpLnJlbW92ZSgpO1xyXG4gICAgICAgIGxldCB0ZW1wbGF0ZSA9ICQoXCIjXCIgKyB0aGlzLkNhck1vZGVsVGVtcGxhdGVJZCkuaHRtbCgpO1xyXG4gICAgICAgIGxldCBkYXRhID0geyBjYXJNb2RlbHM6IGNhck1vZGVscyB9XHJcbiAgICAgICAgbGV0IGh0bWwgPSBNdXN0YWNoZS50b19odG1sKHRlbXBsYXRlLCBkYXRhKTtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5DYXJNb2RlbERpdlBsYWNlSG9sZGVySWQpLmFwcGVuZChodG1sKTtcclxuICAgICAgICB0aGlzLmJpbmRDYXJNb2RlbCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYmluZENhck1vZGVsKCk6IHZvaWQge1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLk1vZGVsU2VsZWN0SWQpLm9uKFwiY2hhbmdlXCIsKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zZWFyY2hDcml0ZXJpYUNoYW5nZS5DdXN0b21Dcml0ZXJpYUNoYW5nZWQoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1cGRhdGVDYXJNb2RlbFNlbGVjdChicmFuZElkOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICBsZXQgY2FyTW9kZWxzID0gbmV3IEFycmF5PENhck1vZGVsPigpO1xyXG4gICAgICAgIGlmIChicmFuZElkICE9PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2FsbENhck1vZGVscy5mb3JFYWNoKChjYXJNb2RlbCwgaW5kZXgsIGFycmF5KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2FyTW9kZWwuQnJhbmRJZCA9PT0gYnJhbmRJZClcclxuICAgICAgICAgICAgICAgICAgICBjYXJNb2RlbHMucHVzaChjYXJNb2RlbCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNyZWF0ZUNhck1vZGVsRWxlbWVudChjYXJNb2RlbHMpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBGaWxsQ3JpdGVyaWEodXNlcklucHV0OlVzZXJJbnB1dCk6dm9pZCB7XHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuQ2FyQnJhbmRJZEtleV0gPVxyXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5CcmFuZFNlbGVjdElkKS5maW5kKFwib3B0aW9uOnNlbGVjdGVkXCIpLnZhbCgpOy8vYnJhbmRJZFxyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLkNhck1vZGVsSWRLZXldID1cclxuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuTW9kZWxTZWxlY3RJZCkuZmluZChcIm9wdGlvbjpzZWxlY3RlZFwiKS52YWwoKTsvL2Nhck1vZGVsSWRcclxuICAgIH1cclxuXHJcbiAgICBCaW5kRXZlbnRzKGNyaXRlcmlhQ2hhbmdlOiBJQ3JpdGVyaWFDaGFuZ2UpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9zZWFyY2hDcml0ZXJpYUNoYW5nZSA9IGNyaXRlcmlhQ2hhbmdlO1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLkJyYW5kU2VsZWN0SWQpLm9uKFwiY2hhbmdlXCIsIChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgc2VsZWN0ZWRCcmFuZElkOiBudW1iZXIgPSBwYXJzZUludCgkKGV2ZW50LmN1cnJlbnRUYXJnZXQpLmZpbmQoXCJvcHRpb246c2VsZWN0ZWRcIikudmFsKCkudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQ2FyTW9kZWxTZWxlY3Qoc2VsZWN0ZWRCcmFuZElkKTtcclxuICAgICAgICAgICAgY3JpdGVyaWFDaGFuZ2UuQ3VzdG9tQ3JpdGVyaWFDaGFuZ2VkKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuYmluZENhck1vZGVsKCk7XHJcbiAgICB9XHJcblxyXG4gICAgVW5CaW5kRXZlbnRzKCk6IHZvaWQge1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLkJyYW5kU2VsZWN0SWQpLm9mZihcImNoYW5nZVwiKTtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5Nb2RlbFNlbGVjdElkKS5vZmYoXCJjaGFuZ2VcIik7XHJcbiAgICB9XHJcbn0iLCLvu79pbXBvcnQge0lFdmVudH0gIGZyb20gXCIuL0lFdmVudFwiO1xyXG5cclxuXHJcbi8qIFRoZSBkaXNwYXRjaGVyIGhhbmRsZXMgdGhlIHN0b3JhZ2Ugb2Ygc3Vic2NpcHRpb25zIGFuZCBmYWNpbGl0YXRlc1xyXG4gIHN1YnNjcmlwdGlvbiwgdW5zdWJzY3JpcHRpb24gYW5kIGRpc3BhdGNoaW5nIG9mIHRoZSBldmVudCAqL1xyXG5leHBvcnQgIGNsYXNzIEV2ZW50RGlzcGF0Y2hlcjxUU2VuZGVyLCBUQXJncz4gaW1wbGVtZW50cyBJRXZlbnQ8VFNlbmRlciwgVEFyZ3M+IHtcclxuXHJcbiAgICBwcml2YXRlIF9zdWJzY3JpcHRpb25zOiBBcnJheTwoc2VuZGVyOiBUU2VuZGVyLCBhcmdzOiBUQXJncykgPT4gdm9pZD4gPSBuZXcgQXJyYXk8KHNlbmRlcjogVFNlbmRlciwgYXJnczogVEFyZ3MpID0+IHZvaWQ+KCk7XHJcblxyXG4gICAgcHVibGljIFN1YnNjcmliZShmbjogKHNlbmRlcjogVFNlbmRlciwgYXJnczogVEFyZ3MpID0+IHZvaWQpOiB2b2lkIHtcclxuICAgICAgICBpZiAoZm4pIHtcclxuICAgICAgICAgICAgdGhpcy5fc3Vic2NyaXB0aW9ucy5wdXNoKGZuKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljICBVbnN1YnNjcmliZShmbjogKHNlbmRlcjogVFNlbmRlciwgYXJnczogVEFyZ3MpID0+IHZvaWQpOiB2b2lkIHtcclxuICAgICAgICBsZXQgaSA9IHRoaXMuX3N1YnNjcmlwdGlvbnMuaW5kZXhPZihmbik7XHJcbiAgICAgICAgaWYgKGkgPiAtMSkge1xyXG4gICAgICAgICAgICB0aGlzLl9zdWJzY3JpcHRpb25zLnNwbGljZShpLCAxKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljICBEaXNwYXRjaChzZW5kZXI6IFRTZW5kZXIsIGFyZ3M6IFRBcmdzKTogdm9pZCB7XHJcbiAgICAgICAgZm9yIChsZXQgaGFuZGxlciBvZiB0aGlzLl9zdWJzY3JpcHRpb25zKSB7XHJcbiAgICAgICAgICAgIGhhbmRsZXIoc2VuZGVyLCBhcmdzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCLvu79pbXBvcnQge1VzZXJJbnB1dH0gZnJvbSBcIi4vVXNlcklucHV0XCI7XHJcbmltcG9ydCB7SVJlc3VsdEhhbmRsZXJ9IGZyb20gXCIuL0lSZXN1bHRIYW5kbGVyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQWpheENhbGxlciB7XHJcblxyXG4gICAgcHJpdmF0ZSBfbnVtYmVyT2ZQdXJlU2VydmVyQ2FsbHM6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF91cmw6IHN0cmluZztcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgIF9yZXN1bHRIYW5kbGVyOiBJUmVzdWx0SGFuZGxlcjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX3JlcXVlc3RDb2RlOm51bWJlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih1cmw6IHN0cmluZywgcmVzdWx0SGFuZGxlcjogSVJlc3VsdEhhbmRsZXIscmVxdWVzdENvZGU6bnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fdXJsID0gdXJsO1xyXG4gICAgICAgIHRoaXMuX3Jlc3VsdEhhbmRsZXIgPSByZXN1bHRIYW5kbGVyO1xyXG4gICAgICAgIHRoaXMuX3JlcXVlc3RDb2RlID0gcmVxdWVzdENvZGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIENhbGwodXNlcklucHV0OiBVc2VySW5wdXQpOiB2b2lkIHtcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0eXBlOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgdXJsOiB0aGlzLl91cmwsXHJcbiAgICAgICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeSksIC8vRGF0YSBzZW50IHRvIHNlcnZlclxyXG4gICAgICAgICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLCAvLyBjb250ZW50IHR5cGUgc2VudCB0byBzZXJ2ZXJcclxuICAgICAgICAgICAgc3VjY2VzczogKG1zZywgdGV4dFN0YXR1cywganFYSFIpID0+IHRoaXMub25TdWNjZXNzR2V0SXRlbXNGcm9tU2VydmVyKG1zZywgdGV4dFN0YXR1cywganFYSFIpLCAvL09uIFN1Y2Nlc3NmdWxsIHNlcnZpY2UgY2FsbFxyXG4gICAgICAgICAgICBlcnJvcjogKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikgPT4gdGhpcy5vbkVycm9yR2V0SXRlbXNGcm9tU2VydmVyKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikgLy8gV2hlbiBTZXJ2aWNlIGNhbGwgZmFpbHNcclxuICAgICAgICB9KTsgLy8uYWpheFxyXG5cclxuICAgICAgICB0aGlzLl9udW1iZXJPZlB1cmVTZXJ2ZXJDYWxscysrO1xyXG4gICAgICAgIHRoaXMuX3Jlc3VsdEhhbmRsZXIuQWpheENhbGxTdGFydGVkKHRoaXMuX3JlcXVlc3RDb2RlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9uU3VjY2Vzc0dldEl0ZW1zRnJvbVNlcnZlcihtc2c6IGFueSwgdGV4dFN0YXR1czogc3RyaW5nLCBqcVhIUjogSlF1ZXJ5WEhSKSB7XHJcblxyXG4gICAgICAgIHRoaXMuX251bWJlck9mUHVyZVNlcnZlckNhbGxzLS07XHJcbiAgICAgICAgaWYgKHRoaXMuX251bWJlck9mUHVyZVNlcnZlckNhbGxzID09PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Jlc3VsdEhhbmRsZXIuQWpheENhbGxGaW5pc2hlZCh0aGlzLl9yZXF1ZXN0Q29kZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3Jlc3VsdEhhbmRsZXIuT25SZXN1bHQobXNnLCB0aGlzLl9yZXF1ZXN0Q29kZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvbkVycm9yR2V0SXRlbXNGcm9tU2VydmVyKGpxWEhSOiBKUXVlcnlYSFIsIHRleHRTdGF0dXM6IHN0cmluZywgZXJyb3JUaHJvd246IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuX251bWJlck9mUHVyZVNlcnZlckNhbGxzLS07XHJcbiAgICAgICAgaWYgKHRoaXMuX251bWJlck9mUHVyZVNlcnZlckNhbGxzID09PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Jlc3VsdEhhbmRsZXIuQWpheENhbGxGaW5pc2hlZCh0aGlzLl9yZXF1ZXN0Q29kZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9yZXN1bHRIYW5kbGVyLk9uRXJyb3IodGV4dFN0YXR1cyArIFwiICwgXCIgKyBlcnJvclRocm93biwgdGhpcy5fcmVxdWVzdENvZGUpO1xyXG4gICAgfVxyXG59Iiwi77u/aW1wb3J0IHsgSUNyaXRlcmlhfSBmcm9tIFwiLi9JQ3JpdGVyaWFcIjtcclxuaW1wb3J0IHsgTnVtZXJpY0RpY3Rpb25hcnkgfSBmcm9tIFwibG9kYXNoL2luZGV4XCI7XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIENyaXRlcmlhTnVtZXJpY0RpY3Rpb25hcnkgaW1wbGVtZW50cyBOdW1lcmljRGljdGlvbmFyeTxJQ3JpdGVyaWE+IHtcclxuICAgIFtpbmRleDogbnVtYmVyXTogSUNyaXRlcmlhO1xyXG59Iiwi77u/aW50ZXJmYWNlIExvb3NlT2JqZWN0IHtcclxuICAgIFtrZXk6IHN0cmluZ106IGFueVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVXNlcklucHV0IHtcclxuICAgIHB1YmxpYyBQYXJhbWV0ZXJzRGljdGlvbmFyeTogTG9vc2VPYmplY3QgPSB7fTtcclxufVxyXG5cclxuXHJcblxyXG4iLCLvu79pbXBvcnQgeyBDYXRlZ29yeVNlbGVjdGlvbiB9IGZyb20gXCIuLi8uLi8uLi9Db21wb25lbnRzL0NhdGVnb3J5L0NhdGVnb3J5U2VsZWN0aW9uXCI7XHJcbmltcG9ydCB7IENhdGVnb3J5IH0gZnJvbSBcIi4uLy4uLy4uL01vZGVscy9DYXRlZ29yeVwiO1xyXG5pbXBvcnQge1VzZXJJbnB1dH0gZnJvbSBcIi4uLy4uLy4uL0hlbHBlci9Vc2VySW5wdXRcIjtcclxuaW1wb3J0IHtMZXRNZUtub3dTZXJ2ZXJDYWxsZXJ9IGZyb20gXCIuL0xldE1lS25vd1NlcnZlckNhbGxlclwiO1xyXG5pbXBvcnQge0xldE1lS25vd1BhcnRpYWxWaWV3TG9hZGVyfSBmcm9tIFwiLi9MZXRNZUtub3dQYXJ0aWFsVmlld0xvYWRlclwiO1xyXG5pbXBvcnQge0lDcml0ZXJpYUNoYW5nZX0gZnJvbSBcIi4uLy4uLy4uL0hlbHBlci9JQ3JpdGVyaWFDaGFuZ2VcIjtcclxuaW1wb3J0IHtMZXRNZUtub3dDcml0ZXJpYX0gIGZyb20gXCIuL0xldE1lS25vd0NyaXRlcmlhXCI7XHJcbmltcG9ydCB7SVJlc3VsdEhhbmRsZXJ9IGZyb20gXCIuLi8uLi8uLi9IZWxwZXIvSVJlc3VsdEhhbmRsZXJcIjtcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgTGV0TWVLbm93IGltcGxlbWVudHMgSUNyaXRlcmlhQ2hhbmdlLElSZXN1bHRIYW5kbGVyIHtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IEluc2VydExldE1lS25vd0ltYWdlSWQgPSBcImluc2VydExldE1lS25vd1wiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBMb2FkVmlld0ltYWdlSWQgPSBcImxvYWRWaWV3XCI7XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBFbWFpbE9yU21zS2V5OiBzdHJpbmcgPSBcIkVtYWlsT3JTbXNcIjtcclxuICAgIHB1YmxpYyByZWFkb25seSAgRW1haWxPclNtc1BhcmVudERpdklkOiBzdHJpbmcgPSBcImVtYWlsT3JTbXNcIjtcclxuICAgIFxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfcmVnaXN0ZXJMZXRNZUtub3dJbnB1dElkOiBzdHJpbmcgPSBcInJlZ2lzdGVyTGV0TWVLbm93XCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9jYXRlZ29yeVNwZWNpZmljQ3JpdGVyaWFEaXZJZDogc3RyaW5nID1cIkNhdGVnb3J5U3BlY2lmaWNDcml0ZXJpYVwiO1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX3BhcnRpYWxWaWV3RGl2SWQ6IHN0cmluZyA9XCJDYXRlZ29yeVNwZWNpZmljQ3JpdGVyaWFcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgTWVzc2FnZURpdklkOiBzdHJpbmcgPSBcIm1lc3NhZ2VcIjtcclxuXHJcbiAgICBwcml2YXRlIF9jYXRlZ29yeVNlbGVjdGlvbjogQ2F0ZWdvcnlTZWxlY3Rpb247XHJcbiAgICBwcml2YXRlIF9sZXRNZUtub3dDcml0ZXJpYTpMZXRNZUtub3dDcml0ZXJpYTtcclxuICAgIHByaXZhdGUgX2xldE1lS25vd1NlcnZlckNhbGxlcjogTGV0TWVLbm93U2VydmVyQ2FsbGVyO1xyXG4gICAgcHJpdmF0ZSBfbGV0TWVLbm93UGFydGlhbFZpZXdMb2FkZXI6IExldE1lS25vd1BhcnRpYWxWaWV3TG9hZGVyO1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgQWRkTGV0TWVLbm93UmVxdWVzdENvZGUgPSAxOy8vXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IExvYWRMZXRNZUtub3dQYXJ0aWFsVmlld1JlcXVlc3RDb2RlID0gMjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihjYXRlZ29yeVNlbGVjdG9yUGFyZW50RGl2SWQ6IHN0cmluZywgYWxsQ2F0ZWdvcmllc0lkOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLmluaXRDYXRlZ29yeVNlbGVjdChjYXRlZ29yeVNlbGVjdG9yUGFyZW50RGl2SWQsIGFsbENhdGVnb3JpZXNJZCk7XHJcbiAgICAgICAgdGhpcy5fbGV0TWVLbm93U2VydmVyQ2FsbGVyID0gbmV3IExldE1lS25vd1NlcnZlckNhbGxlcih0aGlzLHRoaXMuQWRkTGV0TWVLbm93UmVxdWVzdENvZGUpO1xyXG4gICAgICAgIHRoaXMuX2xldE1lS25vd0NyaXRlcmlhID0gbmV3IExldE1lS25vd0NyaXRlcmlhKCk7XHJcbiAgICAgICAgdGhpcy5fbGV0TWVLbm93UGFydGlhbFZpZXdMb2FkZXIgPVxyXG4gICAgICAgICAgICBuZXcgTGV0TWVLbm93UGFydGlhbFZpZXdMb2FkZXIoIHRoaXMsIHRoaXMsIHRoaXMuX2xldE1lS25vd0NyaXRlcmlhLHRoaXMuTG9hZExldE1lS25vd1BhcnRpYWxWaWV3UmVxdWVzdENvZGUpO1xyXG4gICAgICAgIHRoaXMuaW5pdEV2ZW50SGFuZGxlcnMoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgQ3VzdG9tQ3JpdGVyaWFDaGFuZ2VkKCk6IHZvaWQge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXRDYXRlZ29yeVNlbGVjdChjYXRlZ29yeVNlbGVjdG9yUGFyZW50RGl2SWQ6IHN0cmluZywgYWxsQ2F0ZWdvcmllc0lkOiBzdHJpbmcpOnZvaWQge1xyXG4gICAgICAgIGxldCBhbGxDYXRlZ29yaWVzU3RyaW5nID0gJChcIiNcIiArIGFsbENhdGVnb3JpZXNJZCkudmFsKCkudG9TdHJpbmcoKTtcclxuICAgICAgICBsZXQgYWxsQ2F0ZWdvcmllcyA9ICQucGFyc2VKU09OKGFsbENhdGVnb3JpZXNTdHJpbmcpIGFzIENhdGVnb3J5W107XHJcbiAgICAgICAgdGhpcy5fY2F0ZWdvcnlTZWxlY3Rpb24gPSBuZXcgQ2F0ZWdvcnlTZWxlY3Rpb24oY2F0ZWdvcnlTZWxlY3RvclBhcmVudERpdklkLCBhbGxDYXRlZ29yaWVzKTtcclxuICAgICAgICB0aGlzLl9jYXRlZ29yeVNlbGVjdGlvbi5DcmVhdGVGaXJzdExldmVsKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbml0RXZlbnRIYW5kbGVycygpOnZvaWQge1xyXG4gICAgICAgIHRoaXMuX2NhdGVnb3J5U2VsZWN0aW9uLlNlbGVjdGVkQ2F0ZWdvcnlDaGFuZ2VkRXZlbnQuU3Vic2NyaWJlKChzZW5kZXIsIGFyZ3MpID0+IHtcclxuICAgICAgICAgICAgbGV0IHVzZXJJbnB1dCA9IG5ldyBVc2VySW5wdXQoKTtcclxuICAgICAgICAgICAgdGhpcy5fY2F0ZWdvcnlTZWxlY3Rpb24uSW5zZXJ0Q2F0ZWdvcnlJZEluVXNlcklucHV0RGljdGlvbmFyeSh1c2VySW5wdXQpO1xyXG4gICAgICAgICAgICB0aGlzLl9sZXRNZUtub3dQYXJ0aWFsVmlld0xvYWRlci5HZXRQYXJ0aWFsVmlld0Zyb21TZXJ2ZXIodXNlcklucHV0LCBhcmdzLlNlbGVjdGVkQ2F0ZWdvcnlJZCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9yZWdpc3RlckxldE1lS25vd0lucHV0SWQpLm9uKFwiY2xpY2tcIiwgKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJMZXRNZUtub3coKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlICByZWdpc3RlckxldE1lS25vdygpOnZvaWQge1xyXG4gICAgICAgIC8vVE9ETyBkaXNhYmxlIHN1Ym1pdEFkIEJ1dHRvbiB1bnRpbCBjdXJyZW50IHN1Ym1pc3Npb24gaXMgb2sgb3IgZXJyb3Jub3VzIFxyXG5cclxuICAgICAgICBsZXQgdXNlcklucHV0ID0gbmV3IFVzZXJJbnB1dCgpO1xyXG4gICAgICAgIHRoaXMuX2NhdGVnb3J5U2VsZWN0aW9uLkluc2VydENhdGVnb3J5SWRJblVzZXJJbnB1dERpY3Rpb25hcnkodXNlcklucHV0KTtcclxuICAgICAgICB1c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnlbdGhpcy5FbWFpbE9yU21zS2V5XSA9ICQoXCIjXCIgKyB0aGlzLkVtYWlsT3JTbXNQYXJlbnREaXZJZCkuY2hpbGRyZW4oXCI6Y2hlY2tlZFwiKS52YWwoKTs7Ly9UT0RPIG1ha2UgYSB1aSB2aWV3IChyYWRpbyBidXR0b24pXHJcbiAgICAgICAgdGhpcy5fbGV0TWVLbm93Q3JpdGVyaWEuRmlsbENhdGVnb3J5U3BlY2lmaWNMZXRNZUtub3dDcml0ZXJpYSh0aGlzLl9jYXRlZ29yeVNlbGVjdGlvbi5HZXRTZWxlY3RlZENhdGVnb3J5SWQoKSx1c2VySW5wdXQpO1xyXG5cclxuICAgICAgICB0aGlzLl9sZXRNZUtub3dTZXJ2ZXJDYWxsZXIuU2F2ZUFkKHVzZXJJbnB1dCk7XHJcbiAgICB9XHJcblxyXG4gICAgT25SZXN1bHQocGFyYW06IGFueSwgcmVxdWVzdENvZGU6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIGlmIChyZXF1ZXN0Q29kZSA9PT0gdGhpcy5Mb2FkTGV0TWVLbm93UGFydGlhbFZpZXdSZXF1ZXN0Q29kZSkge1xyXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5fcGFydGlhbFZpZXdEaXZJZCkuY2hpbGRyZW4oKS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuX3BhcnRpYWxWaWV3RGl2SWQpLmh0bWwocGFyYW0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocmVxdWVzdENvZGUgPT09IHRoaXMuQWRkTGV0TWVLbm93UmVxdWVzdENvZGUpIHtcclxuICAgICAgICAgICAgZG9jdW1lbnQubG9jYXRpb24ucmVwbGFjZShcIi9MZXRNZUtub3cvQ29uZmlybVwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG4gICAgT25FcnJvcihtZXNzYWdlOiBzdHJpbmcsIHJlcXVlc3RDb2RlOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICBpZiAocmVxdWVzdENvZGUgPT09IHRoaXMuTG9hZExldE1lS25vd1BhcnRpYWxWaWV3UmVxdWVzdENvZGUpIHtcclxuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuTWVzc2FnZURpdklkKS5jaGlsZHJlbigpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5NZXNzYWdlRGl2SWQpLmh0bWwoXCI8cD5cIiArIG1lc3NhZ2UgKyBcIjwvcD5cIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChyZXF1ZXN0Q29kZSA9PT0gdGhpcy5BZGRMZXRNZUtub3dSZXF1ZXN0Q29kZSkge1xyXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5NZXNzYWdlRGl2SWQpLmNoaWxkcmVuKCkucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLk1lc3NhZ2VEaXZJZCkuaHRtbChcIjxwPlwiICsgbWVzc2FnZSArIFwiPC9wPlwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBBamF4Q2FsbEZpbmlzaGVkKHJlcXVlc3RDb2RlOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICBpZiAocmVxdWVzdENvZGUgPT09IHRoaXMuTG9hZExldE1lS25vd1BhcnRpYWxWaWV3UmVxdWVzdENvZGUpIHtcclxuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuTG9hZFZpZXdJbWFnZUlkKS5oaWRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChyZXF1ZXN0Q29kZSA9PT0gdGhpcy5BZGRMZXRNZUtub3dSZXF1ZXN0Q29kZSkge1xyXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5JbnNlcnRMZXRNZUtub3dJbWFnZUlkKS5oaWRlKCk7XHJcbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLl9yZWdpc3RlckxldE1lS25vd0lucHV0SWQpLnJlbW92ZUF0dHIoXCJkaXNhYmxlZFwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgQWpheENhbGxTdGFydGVkKHJlcXVlc3RDb2RlOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICBpZiAocmVxdWVzdENvZGUgPT09IHRoaXMuTG9hZExldE1lS25vd1BhcnRpYWxWaWV3UmVxdWVzdENvZGUpIHtcclxuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuTG9hZFZpZXdJbWFnZUlkKS5zaG93KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChyZXF1ZXN0Q29kZSA9PT0gdGhpcy5BZGRMZXRNZUtub3dSZXF1ZXN0Q29kZSkge1xyXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5JbnNlcnRMZXRNZUtub3dJbWFnZUlkKS5zaG93KCk7XHJcbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLl9yZWdpc3RlckxldE1lS25vd0lucHV0SWQpLmF0dHIoXCJkaXNhYmxlZFwiLCBcImRpc2FibGVkXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxubGV0IGNhdGVnb3J5U2VsZWN0b3JQYXJlbnREaXZJZDogc3RyaW5nID0gXCJjYXRlZ29yeVNlbGVjdG9yXCI7XHJcbmxldCBhbGxDYXRlZ29yaWVzSWQgPSBcImFsbENhdGVnb3JpZXNcIjtcclxuXHJcbiQoZG9jdW1lbnQpLnJlYWR5KCgpPT4ge1xyXG4gICAgbGV0IGxldE1lS25vdyA9IG5ldyBMZXRNZUtub3coY2F0ZWdvcnlTZWxlY3RvclBhcmVudERpdklkLGFsbENhdGVnb3JpZXNJZCk7XHJcbn0pOyIsIu+7v2ltcG9ydCB7IENyaXRlcmlhTnVtZXJpY0RpY3Rpb25hcnkgfSBmcm9tIFwiLi4vLi4vLi4vSGVscGVyL0NyaXRlcmlhTnVtZXJpY0RpY3Rpb25hcnlcIjtcclxuaW1wb3J0IHsgRGVmYXVsdExldE1lS25vd0NyaXRlcmlhIH0gZnJvbSBcIi4vTGV0TWVLbm93Q3JpdGVyaWEvRGVmYXVsdExldE1lS25vd0NyaXRlcmlhXCI7XHJcbmltcG9ydCB7IEFkVHJhbnNwb3J0YXRpb25MZXRNZUtub3dDcml0ZXJpYSB9IGZyb20gXCIuL0xldE1lS25vd0NyaXRlcmlhL0FkVHJhbnNwb3J0YXRpb25MZXRNZUtub3dDcml0ZXJpYVwiO1xyXG5pbXBvcnQgeyBVc2VySW5wdXQgfSBmcm9tIFwiLi4vLi4vLi4vSGVscGVyL1VzZXJJbnB1dFwiO1xyXG5pbXBvcnQgeyBJQ3JpdGVyaWEgfSBmcm9tIFwiLi4vLi4vLi4vSGVscGVyL0lDcml0ZXJpYVwiO1xyXG5pbXBvcnQgeyBJQ3JpdGVyaWFDaGFuZ2UgfSBmcm9tIFwiLi4vLi4vLi4vSGVscGVyL0lDcml0ZXJpYUNoYW5nZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIExldE1lS25vd0NyaXRlcmlhIHtcclxuICAgIHByaXZhdGUgX2xldE1lS25vd0NyaXRlcmlhSW9jQ29udGFpbmVyOiBDcml0ZXJpYU51bWVyaWNEaWN0aW9uYXJ5O1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5fbGV0TWVLbm93Q3JpdGVyaWFJb2NDb250YWluZXIgPSBuZXcgQ3JpdGVyaWFOdW1lcmljRGljdGlvbmFyeSgpO1xyXG4gICAgICAgIHRoaXMuaW5pdExldE1lS25vd0NyaXRlcmlhSW9jQ29udGFpbmVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbml0TGV0TWVLbm93Q3JpdGVyaWFJb2NDb250YWluZXIoKSB7XHJcbiAgICAgICAgdGhpcy5fbGV0TWVLbm93Q3JpdGVyaWFJb2NDb250YWluZXJbMF0gPSBuZXcgRGVmYXVsdExldE1lS25vd0NyaXRlcmlhKCk7XHJcbiAgICAgICAgdGhpcy5fbGV0TWVLbm93Q3JpdGVyaWFJb2NDb250YWluZXJbMTAwXSA9IG5ldyBBZFRyYW5zcG9ydGF0aW9uTGV0TWVLbm93Q3JpdGVyaWEoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgRmlsbENhdGVnb3J5U3BlY2lmaWNMZXRNZUtub3dDcml0ZXJpYShjYXRlZ29yeUlkOiBudW1iZXIsIHVzZXJJbnB1dDogVXNlcklucHV0KTogdm9pZCB7XHJcbiAgICAgICAgbGV0IGxldE1lS25vd0NyaXRlcmlhID0gdGhpcy5wb2x5bW9ycGhpY0Rpc3BhdGNoTGV0TWVLbm93Q3JpdGVyaWEoY2F0ZWdvcnlJZCk7XHJcbiAgICAgICAgbGV0TWVLbm93Q3JpdGVyaWEuRmlsbENyaXRlcmlhKHVzZXJJbnB1dCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIEJpbmQoY2F0ZWdvcnlJZDogbnVtYmVyLCBjcml0ZXJpYUNoYW5nZTogSUNyaXRlcmlhQ2hhbmdlKSB7XHJcbiAgICAgICAgbGV0IGNyaXRlcmlhID0gdGhpcy5wb2x5bW9ycGhpY0Rpc3BhdGNoTGV0TWVLbm93Q3JpdGVyaWEoY2F0ZWdvcnlJZCk7XHJcbiAgICAgICAgY3JpdGVyaWEuQmluZEV2ZW50cyhjcml0ZXJpYUNoYW5nZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIFVuQmluZChjYXRlZ29yeUlkOiBudW1iZXIpIHtcclxuICAgICAgICBsZXQgY3JpdGVyaWEgPSB0aGlzLnBvbHltb3JwaGljRGlzcGF0Y2hMZXRNZUtub3dDcml0ZXJpYShjYXRlZ29yeUlkKTtcclxuICAgICAgICBjcml0ZXJpYS5VbkJpbmRFdmVudHMoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHBvbHltb3JwaGljRGlzcGF0Y2hMZXRNZUtub3dDcml0ZXJpYShjYXRlZ29yeUlkOiBudW1iZXIpOiBJQ3JpdGVyaWEge1xyXG4gICAgICAgIGxldCByZXR1cm5WYWx1ZTogSUNyaXRlcmlhID0gdGhpcy5fbGV0TWVLbm93Q3JpdGVyaWFJb2NDb250YWluZXJbY2F0ZWdvcnlJZF07XHJcbiAgICAgICAgaWYgKHJldHVyblZhbHVlID09PSB1bmRlZmluZWQgfHwgcmV0dXJuVmFsdWUgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuVmFsdWUgPSB0aGlzLl9sZXRNZUtub3dDcml0ZXJpYUlvY0NvbnRhaW5lclswXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldHVyblZhbHVlO1xyXG4gICAgfVxyXG59XHJcblxyXG4iLCLvu79pbXBvcnQgeyBJQ3JpdGVyaWEsIENyaXRlcmlhVmFsaWRhdG9yIH0gZnJvbSBcIi4uLy4uLy4uLy4uL0hlbHBlci9JQ3JpdGVyaWFcIjtcclxuaW1wb3J0IHsgVXNlcklucHV0IH0gZnJvbSBcIi4uLy4uLy4uLy4uL0hlbHBlci9Vc2VySW5wdXRcIjtcclxuaW1wb3J0IHsgSUNyaXRlcmlhQ2hhbmdlIH0gZnJvbSBcIi4uLy4uLy4uLy4uL0hlbHBlci9JQ3JpdGVyaWFDaGFuZ2VcIjtcclxuaW1wb3J0IHsgQ2FyTW9kZWxCcmFuZENvbnRyb2xsZXIgfSBmcm9tIFwiLi4vLi4vLi4vLi4vQ29tcG9uZW50cy9UcmFuc2Zvcm1hdGlvbi9DYXJNb2RlbEJyYW5kQ29udHJvbGxlclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEFkVHJhbnNwb3J0YXRpb25MZXRNZUtub3dDcml0ZXJpYSBpbXBsZW1lbnRzIElDcml0ZXJpYSB7XHJcbiAgICBwcml2YXRlIF9jYXJNb2RlbEJyYW5kQ29udG9sbGVyOiBDYXJNb2RlbEJyYW5kQ29udHJvbGxlcjtcclxuXHJcbiAgICBwdWJsaWMgVmFsaWRhdGVDcml0ZXJpYSgpOiBDcml0ZXJpYVZhbGlkYXRvciB7IHRocm93IG5ldyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZFwiKTsgfVxyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgTWFrZVllYXJGcm9tS2V5OiBzdHJpbmcgPSBcIk1ha2VZZWFyRnJvbVwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBNYWtlWWVhckZyb21JbnB1dElkOiBzdHJpbmcgPSBcImZyb21ZZWFyXCI7XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBNYWtlWWVhclRvS2V5OiBzdHJpbmcgPSBcIk1ha2VZZWFyVG9cIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgTWFrZVllYXJUb0lucHV0SWQ6IHN0cmluZyA9IFwidG9ZZWFyXCI7XHJcbiAgICBcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgRnVlbEtleSA9IFwiRnVlbFwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBGdWVsU2VsZWN0SWQ6IHN0cmluZyA9IFwiZnVlbFwiO1xyXG5cclxuICAgIHB1YmxpYyByZWFkb25seSBHZWFyYm94S2V5OiBzdHJpbmcgPSBcIkdlYXJib3hcIjtcclxuICAgIHB1YmxpYyByZWFkb25seSBHZWFyYm94VHlwZVBhcmVudERpdklkOiBzdHJpbmcgPSBcImdlYXJib3hUeXBlXCI7XHJcblxyXG4gICAgcHVibGljIHJlYWRvbmx5IENhclN0YXR1c0tleTogc3RyaW5nID0gXCJDYXJTdGF0dXNcIjtcclxuICAgIHB1YmxpYyByZWFkb25seSBDYXJTdGF0dXNQYXJlbnREaXZJZDogc3RyaW5nID0gXCJjYXJTdGF0dXNcIjtcclxuXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgTWlsZWFnZUtleTogc3RyaW5nID0gXCJNaWxlYWdlXCI7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgTWlsZWFnZUlucHV0SWQ6IHN0cmluZyA9IFwibWlsZWFnZVwiO1xyXG5cclxuICAgIHB1YmxpYyByZWFkb25seSBQbGF0ZVR5cGVLZXk6IHN0cmluZyA9IFwiUGxhdGVUeXBlXCI7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgUGxhdGVUeXBlUGFyZW50RGl2SWQ6IHN0cmluZyA9IFwicGxhdGVUeXBlXCI7XHJcblxyXG4gICAgcHVibGljIHJlYWRvbmx5IEJvZHlTdGF0dXNLZXk6IHN0cmluZyA9IFwiQm9keVN0YXR1c1wiO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IEJvZHlTdGF0dXNTZWxlY3RJZDogc3RyaW5nID0gXCJib2R5U3RhdHVzXCI7XHJcblxyXG4gICAgcHVibGljIHJlYWRvbmx5IEJvZHlDb2xvcktleTogc3RyaW5nID0gXCJCb2R5Q29sb3JcIjtcclxuICAgIHB1YmxpYyByZWFkb25seSBCb2R5Q29sb3JTZWxlY3RJZDogc3RyaW5nID0gXCJib2R5Q29sb3JcIjtcclxuXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgSW50ZXJuYWxDb2xvcktleTogc3RyaW5nID0gXCJJbnRlcm5hbENvbG9yXCI7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgSW50ZXJuYWxDb2xvclNlbGVjdElkID0gXCJpbnRlcm5hbENvbG9yXCI7XHJcblxyXG5cclxuICAgIHByaXZhdGUgaW5pdFZpZXcoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fY2FyTW9kZWxCcmFuZENvbnRvbGxlciA9IG5ldyBDYXJNb2RlbEJyYW5kQ29udHJvbGxlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBGaWxsQ3JpdGVyaWEodXNlcklucHV0OiBVc2VySW5wdXQpOiB2b2lkIHtcclxuICAgICAgICAvL1RPRE8gdmFsaWRhdGUgdXNlciBpbnB1dCB0aGVuIHByb2NlZWRcclxuICAgICAgICB0aGlzLl9jYXJNb2RlbEJyYW5kQ29udG9sbGVyLkZpbGxDcml0ZXJpYSh1c2VySW5wdXQpO1xyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLk1ha2VZZWFyRnJvbUtleV0gPSAkKFwiI1wiICsgdGhpcy5NYWtlWWVhckZyb21JbnB1dElkKS52YWwoKTsvL01ha2VZZWFyRnJvbVxyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLk1ha2VZZWFyVG9LZXldID0gJChcIiNcIiArIHRoaXMuTWFrZVllYXJUb0lucHV0SWQpLnZhbCgpOy8vTWFrZVllYXJUb1xyXG5cclxuICAgICAgICAvL3VzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLkZ1ZWxLZXldID0gJChcIiNcIiArIHRoaXMuRnVlbFNlbGVjdElkKS5maW5kKFwib3B0aW9uOnNlbGVjdGVkXCIpLnZhbCgpOy8vRnVlbFxyXG4gICAgICAgIC8vdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuTWlsZWFnZUtleV0gPSAkKFwiI1wiICsgdGhpcy5NaWxlYWdlSW5wdXRJZCkudmFsKCk7Ly9NaWxlYWdlXHJcbiAgICAgICAgLy91c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnlbdGhpcy5HZWFyYm94S2V5XSA9ICQoXCIjXCIgKyB0aGlzLkdlYXJib3hUeXBlUGFyZW50RGl2SWQpLmNoaWxkcmVuKFwiOmNoZWNrZWRcIikudmFsKCk7XHJcbiAgICAgICAgLy91c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnlbdGhpcy5Cb2R5Q29sb3JLZXldID0gJChcIiNcIiArIHRoaXMuQm9keUNvbG9yU2VsZWN0SWQpLmZpbmQoXCJvcHRpb246c2VsZWN0ZWRcIikudmFsKCk7XHJcbiAgICAgICAgLy91c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnlbdGhpcy5JbnRlcm5hbENvbG9yS2V5XSA9ICQoXCIjXCIgKyB0aGlzLkludGVybmFsQ29sb3JTZWxlY3RJZCkuZmluZChcIm9wdGlvbjpzZWxlY3RlZFwiKS52YWwoKTtcclxuICAgICAgICAvL3VzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLkJvZHlTdGF0dXNLZXldID0gJChcIiNcIiArIHRoaXMuQm9keVN0YXR1c1NlbGVjdElkKS5maW5kKFwib3B0aW9uOnNlbGVjdGVkXCIpLnZhbCgpO1xyXG4gICAgICAgIC8vdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuQ2FyU3RhdHVzS2V5XSA9ICQoXCIjXCIgKyB0aGlzLkNhclN0YXR1c1BhcmVudERpdklkKS5jaGlsZHJlbihcIjpjaGVja2VkXCIpLnZhbCgpO1xyXG4gICAgICAgIC8vdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuUGxhdGVUeXBlS2V5XSA9ICQoXCIjXCIgKyB0aGlzLlBsYXRlVHlwZVBhcmVudERpdklkKS5jaGlsZHJlbihcIjpjaGVja2VkXCIpLnZhbCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBCaW5kRXZlbnRzKGNyaXRlcmlhQ2hhbmdlOiBJQ3JpdGVyaWFDaGFuZ2UpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmluaXRWaWV3KCk7XHJcbiAgICAgICAgdGhpcy5fY2FyTW9kZWxCcmFuZENvbnRvbGxlci5CaW5kRXZlbnRzKGNyaXRlcmlhQ2hhbmdlKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgVW5CaW5kRXZlbnRzKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX2Nhck1vZGVsQnJhbmRDb250b2xsZXIuVW5CaW5kRXZlbnRzKCk7XHJcbiAgICB9XHJcbn0iLCLvu79pbXBvcnQgeyBJQ3JpdGVyaWEsIENyaXRlcmlhVmFsaWRhdG9yIH0gZnJvbSBcIi4uLy4uLy4uLy4uL0hlbHBlci9JQ3JpdGVyaWFcIjtcclxuaW1wb3J0IHsgVXNlcklucHV0IH0gZnJvbSBcIi4uLy4uLy4uLy4uL0hlbHBlci9Vc2VySW5wdXRcIjtcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgRGVmYXVsdExldE1lS25vd0NyaXRlcmlhIGltcGxlbWVudHMgSUNyaXRlcmlhIHtcclxuICAgIEZpbGxDcml0ZXJpYShzZWFyY2hBZFVzZXJJbnB1dDogVXNlcklucHV0KTogdm9pZCB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIEJpbmRFdmVudHMoY3JpdGVyaWFDaGFuZ2U6IE9iamVjdCk6IHZvaWQge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBVbkJpbmRFdmVudHMoKTogdm9pZCB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIFZhbGlkYXRlQ3JpdGVyaWEoKTogQ3JpdGVyaWFWYWxpZGF0b3Ige1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZFwiKTtcclxuICAgIH1cclxufSIsIu+7v2ltcG9ydCB7SUNyaXRlcmlhQ2hhbmdlfSBmcm9tIFwiLi4vLi4vLi4vSGVscGVyL0lDcml0ZXJpYUNoYW5nZVwiO1xyXG5pbXBvcnQge05ld0FkQ3JpdGVyaWF9IGZyb20gXCIuLi8uLi8uLi9ob21lL25ld0FkL3NyYy9OZXdBZENyaXRlcmlhXCI7XHJcblxyXG5pbXBvcnQge0xldE1lS25vd0NyaXRlcmlhfSBmcm9tIFwiLi9MZXRNZUtub3dDcml0ZXJpYVwiO1xyXG5pbXBvcnQge0lSZXN1bHRIYW5kbGVyfSBmcm9tIFwiLi4vLi4vLi4vSGVscGVyL0lSZXN1bHRIYW5kbGVyXCI7XHJcbmltcG9ydCB7QWpheENhbGxlcn0gZnJvbSBcIi4uLy4uLy4uL0hlbHBlci9BamF4Q2FsbGVyXCI7XHJcbmltcG9ydCB7VXNlcklucHV0fSBmcm9tIFwiLi4vLi4vLi4vSGVscGVyL1VzZXJJbnB1dFwiO1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBMZXRNZUtub3dQYXJ0aWFsVmlld0xvYWRlciAgaW1wbGVtZW50cyBJUmVzdWx0SGFuZGxlciB7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IFJlcXVlc3RJbmRleEtleTogc3RyaW5nID0gXCJSZXF1ZXN0SW5kZXhcIjtcclxuICAgIHByaXZhdGUgX2N1cnJlbnRSZXF1ZXN0SW5kZXg6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIF91cmw6IHN0cmluZyA9IFwiL0xldE1lS25vdy9HZXRMZXRNZUtub3dQYXJ0aWFsVmlld1wiO1xyXG5cclxuICAgIHByaXZhdGUgX3Jlc3VsdEhhbmRsZXI6IElSZXN1bHRIYW5kbGVyO1xyXG4gICAgcHJpdmF0ZSBfYWpheENhbGxlcjogQWpheENhbGxlcjtcclxuXHJcbiAgICBwcml2YXRlIF9wYXJ0aWFsVmlld0RpdklkOiBzdHJpbmc7XHJcbiAgICBcclxuICAgIHByaXZhdGUgX3ByZXZpb3VzQ2F0ZWdvcnlJZDogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgX2N1cnJlbnRDYXRlZ29yeUlkOiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBfY3JpdGVyaWFDaGFuZ2U6IElDcml0ZXJpYUNoYW5nZTtcclxuICAgIHByaXZhdGUgX2xldE1lS25vd0NyaXRlcmlhOiBMZXRNZUtub3dDcml0ZXJpYTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihyZXN1bHRIYW5kbGVyOiBJUmVzdWx0SGFuZGxlciwgY3JpdGVyaWFDaGFuZ2U6IElDcml0ZXJpYUNoYW5nZSwgbGV0TWVLbm93Q3JpdGVyaWE6IExldE1lS25vd0NyaXRlcmlhLCByZXF1ZXN0Q29kZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fcmVzdWx0SGFuZGxlciA9IHJlc3VsdEhhbmRsZXI7XHJcbiAgICAgICAgdGhpcy5fYWpheENhbGxlciA9IG5ldyBBamF4Q2FsbGVyKHRoaXMuX3VybCwgdGhpcywgcmVxdWVzdENvZGUpO1xyXG4gICAgICAgIHRoaXMuX2NyaXRlcmlhQ2hhbmdlID0gY3JpdGVyaWFDaGFuZ2U7XHJcbiAgICAgICAgdGhpcy5fbGV0TWVLbm93Q3JpdGVyaWEgPSBsZXRNZUtub3dDcml0ZXJpYTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIEdldFBhcnRpYWxWaWV3RnJvbVNlcnZlcih1c2VySW5wdXQ6IFVzZXJJbnB1dCwgY2F0ZWdvcnlJZDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fY3VycmVudENhdGVnb3J5SWQgPSBjYXRlZ29yeUlkO1xyXG5cclxuICAgICAgICB0aGlzLl9jdXJyZW50UmVxdWVzdEluZGV4Kys7XHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuUmVxdWVzdEluZGV4S2V5XSA9IHRoaXMuX2N1cnJlbnRSZXF1ZXN0SW5kZXg7XHJcblxyXG4gICAgICAgIHRoaXMuX2FqYXhDYWxsZXIuQ2FsbCh1c2VySW5wdXQpO1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBPblJlc3VsdChwYXJhbSwgcmVxdWVzdENvZGU6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIGlmIChwYXJhbS5DdXN0b21EaWN0aW9uYXJ5W3RoaXMuUmVxdWVzdEluZGV4S2V5XSA9PSB0aGlzLl9jdXJyZW50UmVxdWVzdEluZGV4KSB7IC8vbGFzdCBjYWxsIHJlc3BvbnNlXHJcbiAgICAgICAgICAgIGlmIChwYXJhbS5TdWNjZXNzID09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2xldE1lS25vd0NyaXRlcmlhLlVuQmluZCh0aGlzLl9wcmV2aW91c0NhdGVnb3J5SWQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVzdWx0SGFuZGxlci5PblJlc3VsdChwYXJhbS5SZXNwb25zZURhdGEsIHJlcXVlc3RDb2RlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2xldE1lS25vd0NyaXRlcmlhLkJpbmQodGhpcy5fY3VycmVudENhdGVnb3J5SWQsIHRoaXMuX2NyaXRlcmlhQ2hhbmdlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3ByZXZpb3VzQ2F0ZWdvcnlJZCA9IHRoaXMuX2N1cnJlbnRDYXRlZ29yeUlkO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVzdWx0SGFuZGxlci5PbkVycm9yKHBhcmFtLk1lc3NhZ2UgKyBcIiAsIFwiICsgcGFyYW0uRXJyb3JDb2RlLCByZXF1ZXN0Q29kZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIE9uRXJyb3IobWVzc2FnZTogc3RyaW5nLCByZXF1ZXN0Q29kZTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fcmVzdWx0SGFuZGxlci5PbkVycm9yKG1lc3NhZ2UsIHJlcXVlc3RDb2RlKTtcclxuICAgIH1cclxuICAgIEFqYXhDYWxsRmluaXNoZWQocmVxdWVzdENvZGU6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX3Jlc3VsdEhhbmRsZXIuQWpheENhbGxGaW5pc2hlZChyZXF1ZXN0Q29kZSk7XHJcbiAgICB9XHJcbiAgICBBamF4Q2FsbFN0YXJ0ZWQocmVxdWVzdENvZGU6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX3Jlc3VsdEhhbmRsZXIuQWpheENhbGxTdGFydGVkKHJlcXVlc3RDb2RlKTtcclxuICAgIH1cclxufVxyXG4iLCLvu79pbXBvcnQge1VzZXJJbnB1dH0gZnJvbSBcIi4uLy4uLy4uL0hlbHBlci9Vc2VySW5wdXRcIjtcclxuaW1wb3J0IHtJUmVzdWx0SGFuZGxlciB9IGZyb20gXCIuLi8uLi8uLi9IZWxwZXIvSVJlc3VsdEhhbmRsZXJcIjtcclxuaW1wb3J0IHtBamF4Q2FsbGVyfSBmcm9tIFwiLi4vLi4vLi4vSGVscGVyL0FqYXhDYWxsZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBMZXRNZUtub3dTZXJ2ZXJDYWxsZXIgaW1wbGVtZW50cyBJUmVzdWx0SGFuZGxlcntcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IFJlcXVlc3RJbmRleEtleTogc3RyaW5nID0gXCJSZXF1ZXN0SW5kZXhcIjtcclxuICAgIHByaXZhdGUgX2N1cnJlbnRSZXF1ZXN0SW5kZXg6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF91cmw6IHN0cmluZyA9IFwiL2FwaS9MZXRNZUtub3dBcGkvQWRkTmV3TGV0TWVLbm93UmVjb3JkXCI7XHJcblxyXG4gICAgcHJpdmF0ZSBfcmVzdWx0SGFuZGxlcjogSVJlc3VsdEhhbmRsZXI7XHJcbiAgICBwcml2YXRlIF9hamF4Q2FsbGVyOiBBamF4Q2FsbGVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHJlc3VsdEhhbmRsZXI6SVJlc3VsdEhhbmRsZXIsIHJlcXVlc3RDb2RlOm51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX3Jlc3VsdEhhbmRsZXIgPSByZXN1bHRIYW5kbGVyO1xyXG4gICAgICAgIHRoaXMuX2FqYXhDYWxsZXIgPSBuZXcgQWpheENhbGxlcih0aGlzLl91cmwsIHRoaXMsIHJlcXVlc3RDb2RlKTtcclxuICAgIH1cclxuXHJcblxyXG4gICBcclxuXHJcblxyXG4gICAgcHVibGljIFNhdmVBZCh1c2VySW5wdXQ6IFVzZXJJbnB1dCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX2N1cnJlbnRSZXF1ZXN0SW5kZXgrKztcclxuICAgICAgICB1c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnlbdGhpcy5SZXF1ZXN0SW5kZXhLZXldID0gdGhpcy5fY3VycmVudFJlcXVlc3RJbmRleDtcclxuXHJcbiAgICAgICAgdGhpcy5fYWpheENhbGxlci5DYWxsKHVzZXJJbnB1dCk7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICBcclxuICAgIE9uUmVzdWx0KHBhcmFtOiBhbnksIHJlcXVlc3RDb2RlOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICBpZiAocGFyYW0uQ3VzdG9tRGljdGlvbmFyeVt0aGlzLlJlcXVlc3RJbmRleEtleV0gPT0gdGhpcy5fY3VycmVudFJlcXVlc3RJbmRleCkgeyAvL2xhc3QgY2FsbCByZXNwb25zZVxyXG4gICAgICAgICAgICBpZiAocGFyYW0uU3VjY2VzcyA9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZXN1bHRIYW5kbGVyLk9uUmVzdWx0KHBhcmFtLlJlc3BvbnNlRGF0YSxyZXF1ZXN0Q29kZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZXN1bHRIYW5kbGVyLk9uRXJyb3IocGFyYW0uTWVzc2FnZSxyZXF1ZXN0Q29kZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIE9uRXJyb3IobWVzc2FnZTogc3RyaW5nLCByZXF1ZXN0Q29kZTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fcmVzdWx0SGFuZGxlci5PbkVycm9yKG1lc3NhZ2UscmVxdWVzdENvZGUpO1xyXG4gICAgfVxyXG4gICAgQWpheENhbGxGaW5pc2hlZChyZXF1ZXN0Q29kZTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fcmVzdWx0SGFuZGxlci5BamF4Q2FsbEZpbmlzaGVkKHJlcXVlc3RDb2RlKTtcclxuICAgIH1cclxuICAgIEFqYXhDYWxsU3RhcnRlZChyZXF1ZXN0Q29kZTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fcmVzdWx0SGFuZGxlci5BamF4Q2FsbFN0YXJ0ZWQocmVxdWVzdENvZGUpO1xyXG4gICAgfVxyXG59Il19
