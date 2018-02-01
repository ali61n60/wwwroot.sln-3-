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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3d3dyb290L2pzL0NvbXBvbmVudHMvQ2F0ZWdvcnkvQ2F0ZWdvcnlTZWxlY3Rpb24udHMiLCJ3d3dyb290L2pzL0NvbXBvbmVudHMvVHJhbnNmb3JtYXRpb24vQ2FyTW9kZWxCcmFuZENvbnRyb2xsZXIudHMiLCJ3d3dyb290L2pzL0V2ZW50cy9FdmVudERpc3BhdGNoZXIudHMiLCJ3d3dyb290L2pzL0hlbHBlci9BamF4Q2FsbGVyLnRzIiwid3d3cm9vdC9qcy9IZWxwZXIvQ3JpdGVyaWFOdW1lcmljRGljdGlvbmFyeS50cyIsInd3d3Jvb3QvanMvSGVscGVyL1VzZXJJbnB1dC50cyIsInd3d3Jvb3QvanMvTGV0TWVLbm93L2luZGV4L3NyYy9MZXRNZUtub3cudHMiLCJ3d3dyb290L2pzL0xldE1lS25vdy9pbmRleC9zcmMvTGV0TWVLbm93Q3JpdGVyaWEudHMiLCJ3d3dyb290L2pzL0xldE1lS25vdy9pbmRleC9zcmMvTGV0TWVLbm93Q3JpdGVyaWEvQWRUcmFuc3BvcnRhdGlvbkxldE1lS25vd0NyaXRlcmlhLnRzIiwid3d3cm9vdC9qcy9MZXRNZUtub3cvaW5kZXgvc3JjL0xldE1lS25vd0NyaXRlcmlhL0RlZmF1bHRMZXRNZUtub3dDcml0ZXJpYS50cyIsInd3d3Jvb3QvanMvTGV0TWVLbm93L2luZGV4L3NyYy9MZXRNZUtub3dQYXJ0aWFsVmlld0xvYWRlci50cyIsInd3d3Jvb3QvanMvTGV0TWVLbm93L2luZGV4L3NyYy9MZXRNZUtub3dTZXJ2ZXJDYWxsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FDLGdFQUErRDtBQUloRTtJQTJCSSwyQkFBWSxXQUFtQixFQUFFLGFBQXlCO1FBekJuRCxpQ0FBNEIsR0FBZ0UsSUFBSSxpQ0FBZSxFQUE4QyxDQUFDO1FBRXBKLGtCQUFhLEdBQUcsWUFBWSxDQUFDO1FBSzdCLHdCQUFtQixHQUFHLG1CQUFtQixDQUFDO1FBQzFDLG1CQUFjLEdBQUcsV0FBVyxDQUFDO1FBQzdCLHNCQUFpQixHQUFXLFNBQVMsQ0FBQztRQUV0Qyx5QkFBb0IsR0FBRyxtQkFBbUIsQ0FBQztRQUMzQyxvQkFBZSxHQUFHLFdBQVcsQ0FBQztRQUM5Qix1QkFBa0IsR0FBVyxTQUFTLENBQUM7UUFFdkMsd0JBQW1CLEdBQUcsbUJBQW1CLENBQUM7UUFDMUMsbUJBQWMsR0FBRyxXQUFXLENBQUM7UUFDN0Isc0JBQWlCLEdBQVcsU0FBUyxDQUFDO1FBQ3RDLG9CQUFlLEdBQVcsQ0FBQyxDQUFDO1FBUXpDLElBQUksQ0FBQyxZQUFZLEdBQUcsV0FBVyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxjQUFjLEdBQUcsYUFBYSxDQUFDO0lBQ3hDLENBQUM7SUFJTSx5Q0FBYSxHQUFwQixVQUFxQixrQkFBMEI7UUFDM0MsSUFBSSxZQUFvQixDQUFDO1FBQ3pCLElBQUksYUFBcUIsQ0FBQztRQUMxQixJQUFJLGFBQWEsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUM5RCxNQUFNLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLEtBQUssYUFBYSxDQUFDLE1BQU07Z0JBQ3JCLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO2dCQUNwQixLQUFLLENBQUM7WUFDVixLQUFLLGFBQWEsQ0FBQyxNQUFNO2dCQUNyQixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztnQkFDeEIsSUFBSSxDQUFDLHlCQUF5QixDQUFDLGtCQUFrQixDQUFDLENBQUM7Z0JBQ25ELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO2dCQUMzQyxDQUFDLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDbEQsS0FBSyxDQUFDO1lBQ1YsS0FBSyxhQUFhLENBQUMsTUFBTTtnQkFDckIsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7Z0JBQ3hCLFlBQVksR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxVQUFBLFFBQVEsSUFBSSxPQUFBLFFBQVEsQ0FBQyxVQUFVLEtBQUssa0JBQWtCLEVBQTFDLENBQTBDLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQy9GLGdCQUFnQixDQUFDO2dCQUN0QixJQUFJLENBQUMseUJBQXlCLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBQzdDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFDckMsSUFBSSxDQUFDLDBCQUEwQixDQUFDLGtCQUFrQixDQUFDLENBQUM7Z0JBQ3BELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO2dCQUMxQyxDQUFDLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDbkQsS0FBSyxDQUFDO1lBQ2QsS0FBSyxhQUFhLENBQUMsTUFBTTtnQkFDckIsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7Z0JBQ3hCLGFBQWEsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxVQUFBLFFBQVEsSUFBSSxPQUFBLFFBQVEsQ0FBQyxVQUFVLEtBQUssa0JBQWtCLEVBQTFDLENBQTBDLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQzVGLGdCQUFnQixDQUFDO2dCQUMxQixZQUFZLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsVUFBQSxRQUFRLElBQUksT0FBQSxRQUFRLENBQUMsVUFBVSxLQUFLLGFBQWEsRUFBckMsQ0FBcUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDMUYsZ0JBQWdCLENBQUM7Z0JBQ3RCLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFDN0MsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUNyQyxJQUFJLENBQUMsMEJBQTBCLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQzNDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFDckMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLGtCQUFrQixDQUFDLENBQUM7Z0JBQ3ZELENBQUMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUNsRCxLQUFLLENBQUM7UUFDVixDQUFDO0lBQ0wsQ0FBQztJQUVPLHFEQUF5QixHQUFqQyxVQUFrQyxVQUFrQjtRQUNoRCxDQUFDLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBQ08sc0RBQTBCLEdBQWxDLFVBQW1DLFVBQWtCO1FBQ2pELENBQUMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFDTyxxREFBeUIsR0FBakMsVUFBa0MsVUFBa0I7UUFDaEQsQ0FBQyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQUNPLDRDQUFnQixHQUF4QixVQUF5QixVQUFrQjtRQUV2QyxJQUFJLGlCQUFpQixHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLFVBQUEsUUFBUSxJQUFJLE9BQUEsUUFBUSxDQUFDLFVBQVUsS0FBSyxVQUFVLEVBQWxDLENBQWtDLENBQUMsQ0FBQztRQUNuRyxJQUFJLFlBQVksQ0FBQztRQUNqQixFQUFFLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqQyxNQUFNLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQztRQUNoQyxDQUFDO1FBQ0QsWUFBWSxHQUFHLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BDLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsS0FBSyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztZQUN6RCxNQUFNLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQztRQUNoQyxDQUFDO1FBQ0QsWUFBWSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLFVBQUEsUUFBUSxJQUFJLE9BQUEsUUFBUSxDQUFDLFVBQVUsS0FBSyxZQUFZLENBQUMsZ0JBQWdCLEVBQXJELENBQXFELENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoSCxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLEtBQUssSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7WUFDekQsTUFBTSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUM7UUFDaEMsQ0FBQztRQUNELE1BQU0sQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDO0lBQ2hDLENBQUM7SUFFTSxpRUFBcUMsR0FBNUMsVUFBNkMsU0FBb0I7UUFDN0QsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7UUFDOUMsU0FBUyxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQSxjQUFjO0lBQ2xGLENBQUM7SUFFTSxpREFBcUIsR0FBNUI7UUFDSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsNkJBQTZCLEtBQUssU0FBUztZQUNoRCxJQUFJLENBQUMsNkJBQTZCLEtBQUssSUFBSSxDQUFDLGVBQWUsQ0FBQztZQUM1RCxNQUFNLENBQUMsSUFBSSxDQUFDLDZCQUE2QixDQUFDO1FBQzlDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsMkJBQTJCLEtBQUssU0FBUztZQUNuRCxJQUFJLENBQUMsMkJBQTJCLEtBQUssSUFBSSxDQUFDLGVBQWUsQ0FBQztZQUMxRCxNQUFNLENBQUMsSUFBSSxDQUFDLDJCQUEyQixDQUFDO1FBQzVDLElBQUk7WUFDQSxNQUFNLENBQUMsSUFBSSxDQUFDLDJCQUEyQixDQUFDO0lBQ2hELENBQUM7SUFFTSw0Q0FBZ0IsR0FBdkI7UUFBQSxpQkE4QkM7UUE3QkcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDeEMsSUFBSSxDQUFDLDJCQUEyQixHQUFHLElBQUksQ0FBQyxlQUFlLENBQUM7UUFDeEQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDekMsSUFBSSxDQUFDLDJCQUEyQixHQUFHLElBQUksQ0FBQyxlQUFlLENBQUM7UUFDeEQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDeEMsSUFBSSxDQUFDLDZCQUE2QixHQUFHLElBQUksQ0FBQyxlQUFlLENBQUM7UUFFMUQsSUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN4RCxJQUFJLFVBQVUsR0FBZSxJQUFJLEtBQUssRUFBWSxDQUFDO1FBQ25ELElBQUksSUFBSSxHQUFHLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxDQUFBO1FBQ3JDLElBQUksQ0FBQywyQkFBMkIsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUEsRUFBRTtRQUMxRCxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxVQUFBLFFBQVE7WUFDaEMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLGdCQUFnQixLQUFLLEtBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO2dCQUNyRCxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzlCLENBQUMsQ0FBQSxJQUFJO1FBQ1QsQ0FBQyxDQUFDLENBQUMsQ0FBQSxTQUFTO1FBRVosSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDNUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXhDLENBQUMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsTUFBTSxDQUFDLFVBQUMsS0FBSztZQUN6QyxJQUFJLFVBQVUsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1lBQ25FLEtBQUksQ0FBQywyQkFBMkIsR0FBRyxVQUFVLENBQUM7WUFDOUMsS0FBSSxDQUFDLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ25DLElBQUksUUFBUSxHQUFHLElBQUksdUJBQXVCLEVBQUUsQ0FBQztZQUM3QyxRQUFRLENBQUMsa0JBQWtCLEdBQUcsS0FBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7WUFDM0QsUUFBUSxDQUFDLHdCQUF3QixHQUFHLEtBQUksQ0FBQywyQkFBMkIsRUFBRSxDQUFDO1lBQ3ZFLEtBQUksQ0FBQyw0QkFBNEIsQ0FBQyxRQUFRLENBQUMsS0FBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQy9ELENBQUMsQ0FBQyxDQUFDLENBQUEsUUFBUTtJQUNmLENBQUMsRUFBQSxrQkFBa0I7SUFFWCw2Q0FBaUIsR0FBekIsVUFBMEIsb0JBQTRCO1FBQXRELGlCQStCQztRQTlCRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUN6QyxJQUFJLENBQUMsMkJBQTJCLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQztRQUN4RCxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUN4QyxJQUFJLENBQUMsNkJBQTZCLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQztRQUMxRCxFQUFFLENBQUMsQ0FBQyxvQkFBb0IsS0FBSyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztZQUNoRCxNQUFNLENBQUM7UUFDWCxDQUFDO1FBRUQsSUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN6RCxJQUFJLFVBQVUsR0FBZSxJQUFJLEtBQUssRUFBWSxDQUFDO1FBQ25ELElBQUksSUFBSSxHQUFHLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxDQUFBO1FBRXJDLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLFVBQUEsUUFBUTtZQUNoQyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLEtBQUssb0JBQW9CLENBQUMsQ0FBQyxDQUFDO2dCQUNyRCxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzlCLENBQUMsQ0FBQSxJQUFJO1FBQ1QsQ0FBQyxDQUFDLENBQUMsQ0FBQSxTQUFTO1FBRVosSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDNUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXhDLENBQUMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsTUFBTSxDQUFDLFVBQUMsS0FBSztZQUMxQyxJQUFJLFVBQVUsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1lBQ25FLEtBQUksQ0FBQywyQkFBMkIsR0FBRyxVQUFVLENBQUM7WUFDOUMsS0FBSSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ2xDLElBQUksUUFBUSxHQUFHLElBQUksdUJBQXVCLEVBQUUsQ0FBQztZQUM3QyxRQUFRLENBQUMsa0JBQWtCLEdBQUcsS0FBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7WUFDM0QsUUFBUSxDQUFDLHdCQUF3QixHQUFHLEtBQUksQ0FBQywyQkFBMkIsRUFBRSxDQUFDO1lBQ3ZFLEtBQUksQ0FBQyw0QkFBNEIsQ0FBQyxRQUFRLENBQUMsS0FBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQy9ELENBQUMsQ0FBQyxDQUFDLENBQUEsUUFBUTtJQUNmLENBQUM7SUFFTyw0Q0FBZ0IsR0FBeEIsVUFBeUIscUJBQTZCO1FBQXRELGlCQThCQztRQTdCRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUN4QyxJQUFJLENBQUMsNkJBQTZCLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQztRQUUxRCxFQUFFLENBQUMsQ0FBQyxxQkFBcUIsS0FBSyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztZQUNqRCxNQUFNLENBQUM7UUFDWCxDQUFDO1FBRUQsSUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN4RCxJQUFJLFVBQVUsR0FBZSxJQUFJLEtBQUssRUFBWSxDQUFDO1FBQ25ELElBQUksSUFBSSxHQUFHLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxDQUFBO1FBRXJDLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLFVBQUEsUUFBUTtZQUNoQyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLEtBQUsscUJBQXFCLENBQUMsQ0FBQyxDQUFDO2dCQUN0RCxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzlCLENBQUMsQ0FBQSxJQUFJO1FBQ1QsQ0FBQyxDQUFDLENBQUMsQ0FBQSxTQUFTO1FBQ1osRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFCLE1BQU0sQ0FBQztRQUNYLENBQUM7UUFDRCxJQUFJLElBQUksR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM1QyxDQUFDLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFeEMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBQyxLQUFLO1lBQ3pDLEtBQUksQ0FBQyw2QkFBNkIsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1lBQ3ZGLElBQUksUUFBUSxHQUFHLElBQUksdUJBQXVCLEVBQUUsQ0FBQztZQUM3QyxRQUFRLENBQUMsa0JBQWtCLEdBQUcsS0FBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7WUFDM0QsUUFBUSxDQUFDLHdCQUF3QixHQUFHLEtBQUksQ0FBQywyQkFBMkIsRUFBRSxDQUFDO1lBQ3ZFLEtBQUksQ0FBQyw0QkFBNEIsQ0FBQyxRQUFRLENBQUMsS0FBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQy9ELENBQUMsQ0FBQyxDQUFDLENBQUEsUUFBUTtJQUNmLENBQUM7SUFFTyx1REFBMkIsR0FBbkM7UUFDSSxJQUFJLGtCQUFrQixHQUFHLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBQ3RELE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FDNUIsVUFBQyxRQUFRLElBQU8sTUFBTSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsS0FBSyxrQkFBa0IsQ0FBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDL0YsQ0FBQztJQUVPLHlDQUFhLEdBQXJCLFVBQXNCLEVBQVU7UUFDNUIsQ0FBQyxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBQ0wsd0JBQUM7QUFBRCxDQS9OQSxBQStOQyxJQUFBO0FBL05ZLDhDQUFpQjtBQWlPOUI7SUFBQTtJQUdBLENBQUM7SUFBRCw4QkFBQztBQUFELENBSEEsQUFHQyxJQUFBO0FBSFksMERBQXVCO0FBS3BDLElBQUssYUFLSjtBQUxELFdBQUssYUFBYTtJQUNkLHFEQUFVLENBQUE7SUFDVixxREFBVSxDQUFBO0lBQ1YscURBQVUsQ0FBQTtJQUNWLHFEQUFRLENBQUE7QUFDWixDQUFDLEVBTEksYUFBYSxLQUFiLGFBQWEsUUFLakI7Ozs7QUMxT0Q7SUFnQkk7UUFiaUIsa0JBQWEsR0FBVyxTQUFTLENBQUM7UUFDbEMsa0JBQWEsR0FBVyxPQUFPLENBQUM7UUFFaEMsdUJBQWtCLEdBQVcsZUFBZSxDQUFDO1FBQzdDLDZCQUF3QixHQUFXLGtCQUFrQixDQUFDO1FBRXRELGtCQUFhLEdBQVcsWUFBWSxDQUFDO1FBQ3JDLHdCQUFtQixHQUFXLGNBQWMsQ0FBQztRQUM3QyxrQkFBYSxHQUFXLE9BQU8sQ0FBQztRQU03QyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDcEIsQ0FBQztJQWpCRCxrREFBZ0IsR0FBaEIsY0FBd0MsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQW1CckUsMENBQVEsR0FBaEI7UUFDSSxJQUFJLGtCQUFrQixHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDNUUsSUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFlLENBQUM7UUFDbkUsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3hCLENBQUM7SUFFTyw4Q0FBWSxHQUFwQjtRQUNJLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLEtBQUssRUFBWSxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUVPLHVEQUFxQixHQUE3QixVQUE4QixTQUFxQjtRQUMvQyxDQUFDLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQzNELElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDdkQsSUFBSSxJQUFJLEdBQUcsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLENBQUE7UUFDbkMsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDNUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEQsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3hCLENBQUM7SUFFTyw4Q0FBWSxHQUFwQjtRQUFBLGlCQUlDO1FBSEcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBQyxVQUFDLEtBQUs7WUFDdEMsS0FBSSxDQUFDLHFCQUFxQixDQUFDLHFCQUFxQixFQUFFLENBQUM7UUFDdkQsQ0FBQyxDQUFDLENBQUM7SUFDWCxDQUFDO0lBRU8sc0RBQW9CLEdBQTVCLFVBQTZCLE9BQWU7UUFDeEMsSUFBSSxTQUFTLEdBQUcsSUFBSSxLQUFLLEVBQVksQ0FBQztRQUN0QyxFQUFFLENBQUMsQ0FBQyxPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoQixJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxVQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsS0FBSztnQkFDOUMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sS0FBSyxPQUFPLENBQUM7b0JBQzdCLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDakMsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO1FBQ0QsSUFBSSxDQUFDLHFCQUFxQixDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFFTSw4Q0FBWSxHQUFuQixVQUFvQixTQUFtQjtRQUNuQyxTQUFTLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQztZQUM5QyxDQUFDLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFBLFNBQVM7UUFDdkUsU0FBUyxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxhQUFhLENBQUM7WUFDOUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQSxZQUFZO0lBQzlFLENBQUM7SUFFRCw0Q0FBVSxHQUFWLFVBQVcsY0FBK0I7UUFBMUMsaUJBU0M7UUFSRyxJQUFJLENBQUMscUJBQXFCLEdBQUcsY0FBYyxDQUFDO1FBQzVDLENBQUMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsVUFBQyxLQUFLO1lBQzNDLElBQUksZUFBZSxHQUFXLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7WUFDeEcsS0FBSSxDQUFDLG9CQUFvQixDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQzNDLGNBQWMsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBQzNDLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3hCLENBQUM7SUFFRCw4Q0FBWSxHQUFaO1FBQ0ksQ0FBQyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBQ0wsOEJBQUM7QUFBRCxDQTlFQSxBQThFQyxJQUFBO0FBOUVZLDBEQUF1Qjs7OztBQ0ZwQzs4REFDOEQ7QUFDOUQ7SUFBQTtRQUVZLG1CQUFjLEdBQWtELElBQUksS0FBSyxFQUEwQyxDQUFDO0lBb0JoSSxDQUFDO0lBbEJVLG1DQUFTLEdBQWhCLFVBQWlCLEVBQTBDO1FBQ3ZELEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDTCxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNqQyxDQUFDO0lBQ0wsQ0FBQztJQUVPLHFDQUFXLEdBQW5CLFVBQW9CLEVBQTBDO1FBQzFELElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3hDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDVCxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDckMsQ0FBQztJQUNMLENBQUM7SUFFTyxrQ0FBUSxHQUFoQixVQUFpQixNQUFlLEVBQUUsSUFBVztRQUN6QyxHQUFHLENBQUMsQ0FBZ0IsVUFBbUIsRUFBbkIsS0FBQSxJQUFJLENBQUMsY0FBYyxFQUFuQixjQUFtQixFQUFuQixJQUFtQjtZQUFsQyxJQUFJLE9BQU8sU0FBQTtZQUNaLE9BQU8sQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDekI7SUFDTCxDQUFDO0lBQ0wsc0JBQUM7QUFBRCxDQXRCQSxBQXNCQyxJQUFBO0FBdEJhLDBDQUFlOzs7O0FDRjdCO0lBT0ksb0JBQVksR0FBVyxFQUFFLGFBQTZCLEVBQUMsV0FBa0I7UUFMakUsNkJBQXdCLEdBQVcsQ0FBQyxDQUFDO1FBTXpDLElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDO1FBQ2hCLElBQUksQ0FBQyxjQUFjLEdBQUcsYUFBYSxDQUFDO1FBQ3BDLElBQUksQ0FBQyxZQUFZLEdBQUcsV0FBVyxDQUFDO0lBQ3BDLENBQUM7SUFFTSx5QkFBSSxHQUFYLFVBQVksU0FBb0I7UUFBaEMsaUJBWUM7UUFYRyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQ0gsSUFBSSxFQUFFLE1BQU07WUFDWixHQUFHLEVBQUUsSUFBSSxDQUFDLElBQUk7WUFDZCxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsb0JBQW9CLENBQUM7WUFDcEQsV0FBVyxFQUFFLGtCQUFrQjtZQUMvQixPQUFPLEVBQUUsVUFBQyxHQUFHLEVBQUUsVUFBVSxFQUFFLEtBQUssSUFBSyxPQUFBLEtBQUksQ0FBQywyQkFBMkIsQ0FBQyxHQUFHLEVBQUUsVUFBVSxFQUFFLEtBQUssQ0FBQyxFQUF4RCxDQUF3RDtZQUM3RixLQUFLLEVBQUUsVUFBQyxLQUFLLEVBQUUsVUFBVSxFQUFFLFdBQVcsSUFBSyxPQUFBLEtBQUksQ0FBQyx5QkFBeUIsQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFLFdBQVcsQ0FBQyxFQUE5RCxDQUE4RCxDQUFDLDBCQUEwQjtTQUN2SSxDQUFDLENBQUMsQ0FBQyxPQUFPO1FBRVgsSUFBSSxDQUFDLHdCQUF3QixFQUFFLENBQUM7UUFDaEMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFFTyxnREFBMkIsR0FBbkMsVUFBb0MsR0FBUSxFQUFFLFVBQWtCLEVBQUUsS0FBZ0I7UUFFOUUsSUFBSSxDQUFDLHdCQUF3QixFQUFFLENBQUM7UUFDaEMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLHdCQUF3QixLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdEMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDNUQsQ0FBQztRQUNELElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUVPLDhDQUF5QixHQUFqQyxVQUFrQyxLQUFnQixFQUFFLFVBQWtCLEVBQUUsV0FBbUI7UUFDdkYsSUFBSSxDQUFDLHdCQUF3QixFQUFFLENBQUM7UUFDaEMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLHdCQUF3QixLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdEMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDNUQsQ0FBQztRQUVELElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRyxLQUFLLEdBQUcsV0FBVyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUNyRixDQUFDO0lBQ0wsaUJBQUM7QUFBRCxDQTVDQSxBQTRDQyxJQUFBO0FBNUNZLGdDQUFVOzs7O0FDQ3ZCO0lBQUE7SUFFQSxDQUFDO0lBQUQsZ0NBQUM7QUFBRCxDQUZBLEFBRUMsSUFBQTtBQUZZLDhEQUF5Qjs7OztBQ0F0QztJQUFBO1FBQ1cseUJBQW9CLEdBQWdCLEVBQUUsQ0FBQztJQUNsRCxDQUFDO0lBQUQsZ0JBQUM7QUFBRCxDQUZBLEFBRUMsSUFBQTtBQUZZLDhCQUFTOzs7O0FDSnJCLG9GQUFtRjtBQUVwRix1REFBb0Q7QUFDcEQsaUVBQThEO0FBQzlELDJFQUF3RTtBQUV4RSx5REFBdUQ7QUFJdkQ7SUFzQkksbUJBQVksMkJBQW1DLEVBQUUsZUFBdUI7UUFwQnZELDJCQUFzQixHQUFHLGlCQUFpQixDQUFDO1FBQzNDLG9CQUFlLEdBQUcsVUFBVSxDQUFDO1FBRTdCLGtCQUFhLEdBQVcsWUFBWSxDQUFDO1FBQ3JDLDBCQUFxQixHQUFXLFlBQVksQ0FBQztRQUU3Qyw4QkFBeUIsR0FBVyxtQkFBbUIsQ0FBQztRQUN4RCxtQ0FBOEIsR0FBVSwwQkFBMEIsQ0FBQztRQUVuRSxzQkFBaUIsR0FBVSwwQkFBMEIsQ0FBQztRQUN0RCxpQkFBWSxHQUFXLFNBQVMsQ0FBQztRQU9qQyw0QkFBdUIsR0FBRyxDQUFDLENBQUMsQ0FBQSxFQUFFO1FBQzlCLHdDQUFtQyxHQUFHLENBQUMsQ0FBQztRQUdyRCxJQUFJLENBQUMsa0JBQWtCLENBQUMsMkJBQTJCLEVBQUUsZUFBZSxDQUFDLENBQUM7UUFDdEUsSUFBSSxDQUFDLHNCQUFzQixHQUFHLElBQUksNkNBQXFCLENBQUMsSUFBSSxFQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1FBQzNGLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLHFDQUFpQixFQUFFLENBQUM7UUFDbEQsSUFBSSxDQUFDLDJCQUEyQjtZQUM1QixJQUFJLHVEQUEwQixDQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixFQUFDLElBQUksQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO1FBQ2xILElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0lBQzdCLENBQUM7SUFFTSx5Q0FBcUIsR0FBNUI7SUFFQSxDQUFDO0lBRU8sc0NBQWtCLEdBQTFCLFVBQTJCLDJCQUFtQyxFQUFFLGVBQXVCO1FBQ25GLElBQUksbUJBQW1CLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxlQUFlLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNwRSxJQUFJLGFBQWEsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLG1CQUFtQixDQUFlLENBQUM7UUFDbkUsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUkscUNBQWlCLENBQUMsMkJBQTJCLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDNUYsSUFBSSxDQUFDLGtCQUFrQixDQUFDLGdCQUFnQixFQUFFLENBQUM7SUFDL0MsQ0FBQztJQUVPLHFDQUFpQixHQUF6QjtRQUFBLGlCQVdDO1FBVkcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLDRCQUE0QixDQUFDLFNBQVMsQ0FBQyxVQUFDLE1BQU0sRUFBRSxJQUFJO1lBQ3hFLElBQUksU0FBUyxHQUFHLElBQUkscUJBQVMsRUFBRSxDQUFDO1lBQ2hDLEtBQUksQ0FBQyxrQkFBa0IsQ0FBQyxxQ0FBcUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUN6RSxLQUFJLENBQUMsMkJBQTJCLENBQUMsd0JBQXdCLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQ2xHLENBQUMsQ0FBQyxDQUFDO1FBRUgsQ0FBQyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMseUJBQXlCLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFVBQUMsS0FBSztZQUN0RCxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDdkIsS0FBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDN0IsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRVEscUNBQWlCLEdBQTFCO1FBQ0ksMkVBQTJFO1FBRTNFLElBQUksU0FBUyxHQUFHLElBQUkscUJBQVMsRUFBRSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxxQ0FBcUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN6RSxTQUFTLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQUEsQ0FBQyxDQUFBLG9DQUFvQztRQUN6SixJQUFJLENBQUMsa0JBQWtCLENBQUMscUNBQXFDLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLHFCQUFxQixFQUFFLEVBQUMsU0FBUyxDQUFDLENBQUM7UUFFekgsSUFBSSxDQUFDLHNCQUFzQixDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRUQsNEJBQVEsR0FBUixVQUFTLEtBQVUsRUFBRSxXQUFtQjtRQUNwQyxFQUFFLENBQUMsQ0FBQyxXQUFXLEtBQUssSUFBSSxDQUFDLG1DQUFtQyxDQUFDLENBQUMsQ0FBQztZQUMzRCxDQUFDLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ3BELENBQUMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2hELENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxXQUFXLEtBQUssSUFBSSxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQztZQUMvQyxRQUFRLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1FBQ3BELENBQUM7SUFFTCxDQUFDO0lBQ0QsMkJBQU8sR0FBUCxVQUFRLE9BQWUsRUFBRSxXQUFtQjtRQUN4QyxFQUFFLENBQUMsQ0FBQyxXQUFXLEtBQUssSUFBSSxDQUFDLG1DQUFtQyxDQUFDLENBQUMsQ0FBQztZQUMzRCxDQUFDLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUMvQyxDQUFDLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLE9BQU8sR0FBRyxNQUFNLENBQUMsQ0FBQztRQUM5RCxDQUFDO1FBQ0QsRUFBRSxDQUFDLENBQUMsV0FBVyxLQUFLLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUM7WUFDL0MsQ0FBQyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDL0MsQ0FBQyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLEdBQUcsTUFBTSxDQUFDLENBQUM7UUFDOUQsQ0FBQztJQUNMLENBQUM7SUFDRCxvQ0FBZ0IsR0FBaEIsVUFBaUIsV0FBbUI7UUFDaEMsRUFBRSxDQUFDLENBQUMsV0FBVyxLQUFLLElBQUksQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDLENBQUM7WUFDM0QsQ0FBQyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDekMsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLFdBQVcsS0FBSyxJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDO1lBQy9DLENBQUMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDNUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMseUJBQXlCLENBQUMsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDbkUsQ0FBQztJQUNMLENBQUM7SUFFRCxtQ0FBZSxHQUFmLFVBQWdCLFdBQW1CO1FBQy9CLEVBQUUsQ0FBQyxDQUFDLFdBQVcsS0FBSyxJQUFJLENBQUMsbUNBQW1DLENBQUMsQ0FBQyxDQUFDO1lBQzNELENBQUMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3pDLENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxXQUFXLEtBQUssSUFBSSxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQztZQUMvQyxDQUFDLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQzVDLENBQUMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLHlCQUF5QixDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUN6RSxDQUFDO0lBQ0wsQ0FBQztJQUNMLGdCQUFDO0FBQUQsQ0F6R0EsQUF5R0MsSUFBQTtBQXpHWSw4QkFBUztBQTJHdEIsSUFBSSwyQkFBMkIsR0FBVyxrQkFBa0IsQ0FBQztBQUM3RCxJQUFJLGVBQWUsR0FBRyxlQUFlLENBQUM7QUFFdEMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQztJQUNkLElBQUksU0FBUyxHQUFHLElBQUksU0FBUyxDQUFDLDJCQUEyQixFQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQy9FLENBQUMsQ0FBQyxDQUFDOzs7O0FDMUhGLHVGQUFzRjtBQUN2Rix5RkFBd0Y7QUFDeEYsMkdBQTBHO0FBSzFHO0lBRUk7UUFDSSxJQUFJLENBQUMsOEJBQThCLEdBQUcsSUFBSSxxREFBeUIsRUFBRSxDQUFDO1FBQ3RFLElBQUksQ0FBQyxpQ0FBaUMsRUFBRSxDQUFDO0lBQzdDLENBQUM7SUFFTyw2REFBaUMsR0FBekM7UUFDSSxJQUFJLENBQUMsOEJBQThCLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxtREFBd0IsRUFBRSxDQUFDO1FBQ3hFLElBQUksQ0FBQyw4QkFBOEIsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLHFFQUFpQyxFQUFFLENBQUM7SUFDdkYsQ0FBQztJQUVNLGlFQUFxQyxHQUE1QyxVQUE2QyxVQUFrQixFQUFFLFNBQW9CO1FBQ2pGLElBQUksaUJBQWlCLEdBQUcsSUFBSSxDQUFDLG9DQUFvQyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzlFLGlCQUFpQixDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBRU0sZ0NBQUksR0FBWCxVQUFZLFVBQWtCLEVBQUUsY0FBK0I7UUFDM0QsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLG9DQUFvQyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3JFLFFBQVEsQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVNLGtDQUFNLEdBQWIsVUFBYyxVQUFrQjtRQUM1QixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsb0NBQW9DLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDckUsUUFBUSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQzVCLENBQUM7SUFFTyxnRUFBb0MsR0FBNUMsVUFBNkMsVUFBa0I7UUFDM0QsSUFBSSxXQUFXLEdBQWMsSUFBSSxDQUFDLDhCQUE4QixDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzdFLEVBQUUsQ0FBQyxDQUFDLFdBQVcsS0FBSyxTQUFTLElBQUksV0FBVyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDcEQsV0FBVyxHQUFHLElBQUksQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6RCxDQUFDO1FBQ0QsTUFBTSxDQUFDLFdBQVcsQ0FBQztJQUN2QixDQUFDO0lBQ0wsd0JBQUM7QUFBRCxDQWxDQSxBQWtDQyxJQUFBO0FBbENZLDhDQUFpQjs7OztBQ0o5Qix5R0FBd0c7QUFFeEc7SUFBQTtRQUtxQixnQkFBVyxHQUFXLFVBQVUsQ0FBQztRQUNqQyxvQkFBZSxHQUFXLFVBQVUsQ0FBQztRQUVyQyxZQUFPLEdBQUcsTUFBTSxDQUFDO1FBQ2pCLGlCQUFZLEdBQVcsTUFBTSxDQUFDO1FBRS9CLGVBQVUsR0FBVyxTQUFTLENBQUM7UUFDL0IsMkJBQXNCLEdBQVcsYUFBYSxDQUFDO1FBRS9DLGlCQUFZLEdBQVcsV0FBVyxDQUFDO1FBQ25DLHlCQUFvQixHQUFXLFdBQVcsQ0FBQztRQUUzQyxlQUFVLEdBQVcsU0FBUyxDQUFDO1FBQy9CLG1CQUFjLEdBQVcsU0FBUyxDQUFDO1FBRW5DLGlCQUFZLEdBQVcsV0FBVyxDQUFDO1FBQ25DLHlCQUFvQixHQUFXLFdBQVcsQ0FBQztRQUUzQyxrQkFBYSxHQUFXLFlBQVksQ0FBQztRQUNyQyx1QkFBa0IsR0FBVyxZQUFZLENBQUM7UUFFMUMsaUJBQVksR0FBVyxXQUFXLENBQUM7UUFDbkMsc0JBQWlCLEdBQVcsV0FBVyxDQUFDO1FBRXhDLHFCQUFnQixHQUFXLGVBQWUsQ0FBQztRQUMzQywwQkFBcUIsR0FBRyxlQUFlLENBQUM7SUE2QjVELENBQUM7SUF4RFUsNERBQWdCLEdBQXZCLGNBQStDLE1BQU0sSUFBSSxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUM7SUE4QjVFLG9EQUFRLEdBQWhCO1FBQ0ksSUFBSSxDQUFDLHVCQUF1QixHQUFHLElBQUksaURBQXVCLEVBQUUsQ0FBQztJQUNqRSxDQUFDO0lBRU0sd0RBQVksR0FBbkIsVUFBb0IsU0FBb0I7UUFDcEMsdUNBQXVDO1FBQ3ZDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDckQsbUdBQW1HO1FBQ25HLGdIQUFnSDtRQUNoSCxnR0FBZ0c7UUFDaEcsb0hBQW9IO1FBQ3BILG9IQUFvSDtRQUNwSCw0SEFBNEg7UUFDNUgsc0hBQXNIO1FBQ3RILG9IQUFvSDtRQUNwSCxvSEFBb0g7SUFDeEgsQ0FBQztJQUVNLHNEQUFVLEdBQWpCLFVBQWtCLGNBQStCO1FBQzdDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNoQixJQUFJLENBQUMsdUJBQXVCLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQzVELENBQUM7SUFFTSx3REFBWSxHQUFuQjtRQUNJLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUNoRCxDQUFDO0lBQ0wsd0NBQUM7QUFBRCxDQTNEQSxBQTJEQyxJQUFBO0FBM0RZLDhFQUFpQzs7OztBQ0Q5QztJQUFBO0lBZ0JBLENBQUM7SUFmRywrQ0FBWSxHQUFaLFVBQWEsaUJBQTRCO0lBRXpDLENBQUM7SUFFRCw2Q0FBVSxHQUFWLFVBQVcsY0FBc0I7SUFFakMsQ0FBQztJQUVELCtDQUFZLEdBQVo7SUFFQSxDQUFDO0lBRUQsbURBQWdCLEdBQWhCO1FBQ0ksTUFBTSxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFDTCwrQkFBQztBQUFELENBaEJBLEFBZ0JDLElBQUE7QUFoQlksNERBQXdCOzs7O0FDQ3JDLHlEQUFzRDtBQUl0RDtJQWVJLG9DQUFZLGFBQTZCLEVBQUUsY0FBK0IsRUFBRSxpQkFBb0MsRUFBRSxXQUFtQjtRQWRwSCxvQkFBZSxHQUFXLGNBQWMsQ0FBQztRQUNsRCx5QkFBb0IsR0FBVyxDQUFDLENBQUM7UUFDakMsU0FBSSxHQUFXLG9DQUFvQyxDQUFDO1FBT3BELHdCQUFtQixHQUFXLENBQUMsQ0FBQztRQUNoQyx1QkFBa0IsR0FBVyxDQUFDLENBQUM7UUFLbkMsSUFBSSxDQUFDLGNBQWMsR0FBRyxhQUFhLENBQUM7UUFDcEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLHVCQUFVLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDaEUsSUFBSSxDQUFDLGVBQWUsR0FBRyxjQUFjLENBQUM7UUFDdEMsSUFBSSxDQUFDLGtCQUFrQixHQUFHLGlCQUFpQixDQUFDO0lBRWhELENBQUM7SUFFTSw2REFBd0IsR0FBL0IsVUFBZ0MsU0FBb0IsRUFBRSxVQUFrQjtRQUNwRSxJQUFJLENBQUMsa0JBQWtCLEdBQUcsVUFBVSxDQUFDO1FBRXJDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1FBQzVCLFNBQVMsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDO1FBRWpGLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBRXJDLENBQUM7SUFFRCw2Q0FBUSxHQUFSLFVBQVMsS0FBSyxFQUFFLFdBQW1CO1FBQy9CLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQztZQUM1RSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ3hCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUM7Z0JBQ3pELElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUUsV0FBVyxDQUFDLENBQUM7Z0JBQzlELElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztnQkFDNUUsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQztZQUN2RCxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxLQUFLLEdBQUcsS0FBSyxDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUMsQ0FBQztZQUN0RixDQUFDO1FBQ0wsQ0FBQztJQUNMLENBQUM7SUFFRCw0Q0FBTyxHQUFQLFVBQVEsT0FBZSxFQUFFLFdBQW1CO1FBQ3hDLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxXQUFXLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBQ0QscURBQWdCLEdBQWhCLFVBQWlCLFdBQW1CO1FBQ2hDLElBQUksQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUNELG9EQUFlLEdBQWYsVUFBZ0IsV0FBbUI7UUFDL0IsSUFBSSxDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUNMLGlDQUFDO0FBQUQsQ0F2REEsQUF1REMsSUFBQTtBQXZEWSxnRUFBMEI7Ozs7QUNQdkMseURBQXNEO0FBRXREO0lBU0ksK0JBQVksYUFBNEIsRUFBRSxXQUFrQjtRQVAzQyxvQkFBZSxHQUFXLGNBQWMsQ0FBQztRQUNsRCx5QkFBb0IsR0FBVyxDQUFDLENBQUM7UUFDeEIsU0FBSSxHQUFXLHlDQUF5QyxDQUFDO1FBTXRFLElBQUksQ0FBQyxjQUFjLEdBQUcsYUFBYSxDQUFDO1FBQ3BDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSx1QkFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQ3BFLENBQUM7SUFNTSxzQ0FBTSxHQUFiLFVBQWMsU0FBb0I7UUFDOUIsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7UUFDNUIsU0FBUyxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUM7UUFFakYsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFFckMsQ0FBQztJQUdELHdDQUFRLEdBQVIsVUFBUyxLQUFVLEVBQUUsV0FBbUI7UUFDcEMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDO1lBQzVFLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDeEIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBQyxXQUFXLENBQUMsQ0FBQztZQUNqRSxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBQyxXQUFXLENBQUMsQ0FBQztZQUMzRCxDQUFDO1FBQ0wsQ0FBQztJQUNMLENBQUM7SUFHRCx1Q0FBTyxHQUFQLFVBQVEsT0FBZSxFQUFFLFdBQW1CO1FBQ3hDLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBQyxXQUFXLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBQ0QsZ0RBQWdCLEdBQWhCLFVBQWlCLFdBQW1CO1FBQ2hDLElBQUksQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUNELCtDQUFlLEdBQWYsVUFBZ0IsV0FBbUI7UUFDL0IsSUFBSSxDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUNMLDRCQUFDO0FBQUQsQ0EvQ0EsQUErQ0MsSUFBQTtBQS9DWSxzREFBcUIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwi77u/aW1wb3J0IHsgRXZlbnREaXNwYXRjaGVyIH0gZnJvbSBcIi4uLy4uL0V2ZW50cy9FdmVudERpc3BhdGNoZXJcIjtcclxuaW1wb3J0IHsgQ2F0ZWdvcnkgfSBmcm9tIFwiLi4vLi4vTW9kZWxzL0NhdGVnb3J5XCI7XHJcbmltcG9ydCB7IFVzZXJJbnB1dCB9IGZyb20gXCIuLi8uLi9IZWxwZXIvVXNlcklucHV0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQ2F0ZWdvcnlTZWxlY3Rpb24ge1xyXG5cclxuICAgIHB1YmxpYyBTZWxlY3RlZENhdGVnb3J5Q2hhbmdlZEV2ZW50OiBFdmVudERpc3BhdGNoZXI8Q2F0ZWdvcnlTZWxlY3Rpb24sIENhdGVnb3J5Q2FobmdlZEV2ZW50QXJnPiA9IG5ldyBFdmVudERpc3BhdGNoZXI8Q2F0ZWdvcnlTZWxlY3Rpb24sIENhdGVnb3J5Q2FobmdlZEV2ZW50QXJnPigpO1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgQ2F0ZWdvcnlJZEtleSA9IFwiQ2F0ZWdvcnlJZFwiO1xyXG5cclxuICAgIHByaXZhdGUgX3BhcmVudERpdklkOiBzdHJpbmc7Ly9kaXYgZWxlbWVudCB0aGF0IGhvbGRzIGFsbCBDYXRlZ29yeVNlbGVjdGlvbiBlbGVtZW50c1xyXG4gICAgcHJpdmF0ZSBfYWxsQ2F0ZWdvcmllczogQ2F0ZWdvcnlbXTtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9maXJzdExldmVsVGVtcGxhdGUgPSBcImNhdGVnb3J5MVRlbXBsYXRlXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9maXJzdExldmVsRGl2ID0gXCJjYXRlZ29yeTFcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2ZpcnN0TGV2ZWxTZWxlY3Q6IHN0cmluZyA9IFwic2VsZWN0MVwiO1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX3NlY29uZExldmVsVGVtcGxhdGUgPSBcImNhdGVnb3J5MlRlbXBsYXRlXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9zZWNvbmRMZXZlbERpdiA9IFwiY2F0ZWdvcnkyXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9zZWNvbmRMZXZlbFNlbGVjdDogc3RyaW5nID0gXCJzZWxlY3QyXCI7XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfdGhpcmRMZXZlbFRlbXBsYXRlID0gXCJjYXRlZ29yeTNUZW1wbGF0ZVwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfdGhpcmRMZXZlbERpdiA9IFwiY2F0ZWdvcnkzXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF90aGlyZExldmVsU2VsZWN0OiBzdHJpbmcgPSBcInNlbGVjdDNcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX3Jvb3RDYXRlZ29yeUlkOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIHByaXZhdGUgX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsT25lOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIF9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFR3bzogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBfc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUaHJlZTogbnVtYmVyO1xyXG5cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwYXJlbnREaXZJZDogc3RyaW5nLCBhbGxDYXRlZ29yaWVzOiBDYXRlZ29yeVtdKSB7XHJcbiAgICAgICAgdGhpcy5fcGFyZW50RGl2SWQgPSBwYXJlbnREaXZJZDtcclxuICAgICAgICB0aGlzLl9hbGxDYXRlZ29yaWVzID0gYWxsQ2F0ZWdvcmllcztcclxuICAgIH1cclxuXHJcbiAgICBcclxuXHJcbiAgICBwdWJsaWMgU2V0Q2F0ZWdvcnlJZChzZWxlY3RlZENhdGVnb3J5SWQ6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIGxldCBmaXJzdExldmVsSWQ6IG51bWJlcjtcclxuICAgICAgICBsZXQgc2Vjb25kTGV2ZWxJZDogbnVtYmVyO1xyXG4gICAgICAgIGxldCBjYXRlZ29yeUxldmVsID0gdGhpcy5nZXRDYXRlZ29yeUxldmVsKHNlbGVjdGVkQ2F0ZWdvcnlJZCk7XHJcbiAgICAgICAgc3dpdGNoIChjYXRlZ29yeUxldmVsKSB7XHJcbiAgICAgICAgY2FzZSBDYXRlZ29yeUxldmVsLlVua293bjpcclxuICAgICAgICAgICAgdGhpcy5DcmVhdGVGaXJzdExldmVsKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBDYXRlZ29yeUxldmVsLkxldmVsMTpcclxuICAgICAgICAgICAgICAgIHRoaXMuQ3JlYXRlRmlyc3RMZXZlbCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRGaXJzdExldmVsVG9TcGVjaWZpY0lkKHNlbGVjdGVkQ2F0ZWdvcnlJZCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVNlY29uZExldmVsKHNlbGVjdGVkQ2F0ZWdvcnlJZCk7XHJcbiAgICAgICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5fZmlyc3RMZXZlbFNlbGVjdCkudHJpZ2dlcihcImNoYW5nZVwiKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIENhdGVnb3J5TGV2ZWwuTGV2ZWwyOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5DcmVhdGVGaXJzdExldmVsKCk7XHJcbiAgICAgICAgICAgICAgICBmaXJzdExldmVsSWQgPSB0aGlzLl9hbGxDYXRlZ29yaWVzLmZpbHRlcihjYXRlZ29yeSA9PiBjYXRlZ29yeS5DYXRlZ29yeUlkID09PSBzZWxlY3RlZENhdGVnb3J5SWQpWzBdXHJcbiAgICAgICAgICAgICAgICAgICAgLkNhdGVnb3J5UGFyZW50SWQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldEZpcnN0TGV2ZWxUb1NwZWNpZmljSWQoZmlyc3RMZXZlbElkKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlU2Vjb25kTGV2ZWwoZmlyc3RMZXZlbElkKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0U2Vjb25kTGV2ZWxUb1NwZWNpZmljSWQoc2VsZWN0ZWRDYXRlZ29yeUlkKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlVGhpcmRMZXZlbChzZWxlY3RlZENhdGVnb3J5SWQpO1xyXG4gICAgICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuX3NlY29uZExldmVsU2VsZWN0KS50cmlnZ2VyKFwiY2hhbmdlXCIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBDYXRlZ29yeUxldmVsLkxldmVsMzpcclxuICAgICAgICAgICAgdGhpcy5DcmVhdGVGaXJzdExldmVsKCk7XHJcbiAgICAgICAgICAgIHNlY29uZExldmVsSWQgPSB0aGlzLl9hbGxDYXRlZ29yaWVzLmZpbHRlcihjYXRlZ29yeSA9PiBjYXRlZ29yeS5DYXRlZ29yeUlkID09PSBzZWxlY3RlZENhdGVnb3J5SWQpWzBdXHJcbiAgICAgICAgICAgICAgICAgICAgLkNhdGVnb3J5UGFyZW50SWQ7XHJcbiAgICAgICAgICAgIGZpcnN0TGV2ZWxJZCA9IHRoaXMuX2FsbENhdGVnb3JpZXMuZmlsdGVyKGNhdGVnb3J5ID0+IGNhdGVnb3J5LkNhdGVnb3J5SWQgPT09IHNlY29uZExldmVsSWQpWzBdXHJcbiAgICAgICAgICAgICAgICAuQ2F0ZWdvcnlQYXJlbnRJZDtcclxuICAgICAgICAgICAgdGhpcy5zZXRGaXJzdExldmVsVG9TcGVjaWZpY0lkKGZpcnN0TGV2ZWxJZCk7XHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlU2Vjb25kTGV2ZWwoZmlyc3RMZXZlbElkKTtcclxuICAgICAgICAgICAgdGhpcy5zZXRTZWNvbmRMZXZlbFRvU3BlY2lmaWNJZChzZWNvbmRMZXZlbElkKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlVGhpcmRMZXZlbChzZWNvbmRMZXZlbElkKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0VGhpcmRMZXZlbFRvU3BlY2lmaWNJZChzZWxlY3RlZENhdGVnb3J5SWQpO1xyXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5fdGhpcmRMZXZlbFNlbGVjdCkudHJpZ2dlcihcImNoYW5nZVwiKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0Rmlyc3RMZXZlbFRvU3BlY2lmaWNJZChjYXRlZ29yeUlkOiBudW1iZXIpIHtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fZmlyc3RMZXZlbFNlbGVjdCkudmFsKGNhdGVnb3J5SWQpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBzZXRTZWNvbmRMZXZlbFRvU3BlY2lmaWNJZChjYXRlZ29yeUlkOiBudW1iZXIpIHtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fc2Vjb25kTGV2ZWxTZWxlY3QpLnZhbChjYXRlZ29yeUlkKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgc2V0VGhpcmRMZXZlbFRvU3BlY2lmaWNJZChjYXRlZ29yeUlkOiBudW1iZXIpIHtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fdGhpcmRMZXZlbFNlbGVjdCkudmFsKGNhdGVnb3J5SWQpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBnZXRDYXRlZ29yeUxldmVsKGNhdGVnb3J5SWQ6IG51bWJlcik6IENhdGVnb3J5TGV2ZWwge1xyXG5cclxuICAgICAgICBsZXQgdGVtcENhdGVnb3J5QXJyYXkgPSB0aGlzLl9hbGxDYXRlZ29yaWVzLmZpbHRlcihjYXRlZ29yeSA9PiBjYXRlZ29yeS5DYXRlZ29yeUlkID09PSBjYXRlZ29yeUlkKTtcclxuICAgICAgICBsZXQgdGVtcENhdGVnb3J5O1xyXG4gICAgICAgIGlmICh0ZW1wQ2F0ZWdvcnlBcnJheS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIENhdGVnb3J5TGV2ZWwuVW5rb3duO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0ZW1wQ2F0ZWdvcnkgPSB0ZW1wQ2F0ZWdvcnlBcnJheVswXTtcclxuICAgICAgICBpZiAodGVtcENhdGVnb3J5LlBhcmVudENhdGVnb3J5SWQgPT09IHRoaXMuX3Jvb3RDYXRlZ29yeUlkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBDYXRlZ29yeUxldmVsLkxldmVsMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGVtcENhdGVnb3J5ID0gdGhpcy5fYWxsQ2F0ZWdvcmllcy5maWx0ZXIoY2F0ZWdvcnkgPT4gY2F0ZWdvcnkuQ2F0ZWdvcnlJZCA9PT0gdGVtcENhdGVnb3J5LlBhcmVudENhdGVnb3J5SWQpWzBdO1xyXG4gICAgICAgIGlmICh0ZW1wQ2F0ZWdvcnkuUGFyZW50Q2F0ZWdvcnlJZCA9PT0gdGhpcy5fcm9vdENhdGVnb3J5SWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIENhdGVnb3J5TGV2ZWwuTGV2ZWwyO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gQ2F0ZWdvcnlMZXZlbC5MZXZlbDM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIEluc2VydENhdGVnb3J5SWRJblVzZXJJbnB1dERpY3Rpb25hcnkodXNlcklucHV0OiBVc2VySW5wdXQpOiB2b2lkIHtcclxuICAgICAgICBsZXQgY2F0ZWdvcnlJZCA9IHRoaXMuR2V0U2VsZWN0ZWRDYXRlZ29yeUlkKCk7XHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuQ2F0ZWdvcnlJZEtleV0gPSBjYXRlZ29yeUlkOy8vMTAwIGZvciBjYXJzXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIEdldFNlbGVjdGVkQ2F0ZWdvcnlJZCgpOiBudW1iZXIge1xyXG4gICAgICAgIGlmICh0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFRocmVlICE9PSB1bmRlZmluZWQgJiZcclxuICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUaHJlZSAhPT0gdGhpcy5fcm9vdENhdGVnb3J5SWQpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFRocmVlO1xyXG4gICAgICAgIGVsc2UgaWYgKHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVHdvICE9PSB1bmRlZmluZWQgJiZcclxuICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUd28gIT09IHRoaXMuX3Jvb3RDYXRlZ29yeUlkKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUd287XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxPbmU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIENyZWF0ZUZpcnN0TGV2ZWwoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVFbGVtZW50KHRoaXMuX2ZpcnN0TGV2ZWxEaXYpO1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsT25lID0gdGhpcy5fcm9vdENhdGVnb3J5SWQ7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVFbGVtZW50KHRoaXMuX3NlY29uZExldmVsRGl2KTtcclxuICAgICAgICB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFR3byA9IHRoaXMuX3Jvb3RDYXRlZ29yeUlkO1xyXG4gICAgICAgIHRoaXMucmVtb3ZlRWxlbWVudCh0aGlzLl90aGlyZExldmVsRGl2KTtcclxuICAgICAgICB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFRocmVlID0gdGhpcy5fcm9vdENhdGVnb3J5SWQ7XHJcblxyXG4gICAgICAgIGxldCB0ZW1wbGF0ZSA9ICQoXCIjXCIgKyB0aGlzLl9maXJzdExldmVsVGVtcGxhdGUpLmh0bWwoKTtcclxuICAgICAgICBsZXQgY2F0ZWdvcmllczogQ2F0ZWdvcnlbXSA9IG5ldyBBcnJheTxDYXRlZ29yeT4oKTtcclxuICAgICAgICBsZXQgZGF0YSA9IHsgY2F0ZWdvcmllczogY2F0ZWdvcmllcyB9XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxPbmUgPSB0aGlzLl9yb290Q2F0ZWdvcnlJZDsvL1xyXG4gICAgICAgIHRoaXMuX2FsbENhdGVnb3JpZXMuZm9yRWFjaChjYXRlZ29yeSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChjYXRlZ29yeS5DYXRlZ29yeVBhcmVudElkID09PSB0aGlzLl9yb290Q2F0ZWdvcnlJZCkge1xyXG4gICAgICAgICAgICAgICAgY2F0ZWdvcmllcy5wdXNoKGNhdGVnb3J5KTtcclxuICAgICAgICAgICAgfS8vaWZcclxuICAgICAgICB9KTsvL2ZvckVhY2hcclxuXHJcbiAgICAgICAgbGV0IGh0bWwgPSBNdXN0YWNoZS50b19odG1sKHRlbXBsYXRlLCBkYXRhKTtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fcGFyZW50RGl2SWQpLmFwcGVuZChodG1sKTtcclxuXHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX2ZpcnN0TGV2ZWxTZWxlY3QpLmNoYW5nZSgoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgbGV0IHNlbGVjdGVkSWQgPSBwYXJzZUludCgkKGV2ZW50LmN1cnJlbnRUYXJnZXQpLnZhbCgpLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbE9uZSA9IHNlbGVjdGVkSWQ7XHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlU2Vjb25kTGV2ZWwoc2VsZWN0ZWRJZCk7XHJcbiAgICAgICAgICAgIGxldCBldmVudEFyZyA9IG5ldyBDYXRlZ29yeUNhaG5nZWRFdmVudEFyZygpO1xyXG4gICAgICAgICAgICBldmVudEFyZy5TZWxlY3RlZENhdGVnb3J5SWQgPSB0aGlzLkdldFNlbGVjdGVkQ2F0ZWdvcnlJZCgpO1xyXG4gICAgICAgICAgICBldmVudEFyZy5TZWxlY3RlZENhdGVnb3J5SGFzQ2hpbGQgPSB0aGlzLnNlbGVjdGVkQ2F0ZWdvcnlIYXNDaGlsZHJlbigpO1xyXG4gICAgICAgICAgICB0aGlzLlNlbGVjdGVkQ2F0ZWdvcnlDaGFuZ2VkRXZlbnQuRGlzcGF0Y2godGhpcywgZXZlbnRBcmcpO1xyXG4gICAgICAgIH0pOy8vY2hhbmdlXHJcbiAgICB9Ly9DcmVhdGVGaXJzdExldmVsXHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVTZWNvbmRMZXZlbChmaXJzdExldmVsQ2F0ZWdvcnlJZDogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVFbGVtZW50KHRoaXMuX3NlY29uZExldmVsRGl2KTtcclxuICAgICAgICB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFR3byA9IHRoaXMuX3Jvb3RDYXRlZ29yeUlkO1xyXG4gICAgICAgIHRoaXMucmVtb3ZlRWxlbWVudCh0aGlzLl90aGlyZExldmVsRGl2KTtcclxuICAgICAgICB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFRocmVlID0gdGhpcy5fcm9vdENhdGVnb3J5SWQ7XHJcbiAgICAgICAgaWYgKGZpcnN0TGV2ZWxDYXRlZ29yeUlkID09PSB0aGlzLl9yb290Q2F0ZWdvcnlJZCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgdGVtcGxhdGUgPSAkKFwiI1wiICsgdGhpcy5fc2Vjb25kTGV2ZWxUZW1wbGF0ZSkuaHRtbCgpO1xyXG4gICAgICAgIGxldCBjYXRlZ29yaWVzOiBDYXRlZ29yeVtdID0gbmV3IEFycmF5PENhdGVnb3J5PigpO1xyXG4gICAgICAgIGxldCBkYXRhID0geyBjYXRlZ29yaWVzOiBjYXRlZ29yaWVzIH1cclxuXHJcbiAgICAgICAgdGhpcy5fYWxsQ2F0ZWdvcmllcy5mb3JFYWNoKGNhdGVnb3J5ID0+IHtcclxuICAgICAgICAgICAgaWYgKGNhdGVnb3J5LkNhdGVnb3J5UGFyZW50SWQgPT09IGZpcnN0TGV2ZWxDYXRlZ29yeUlkKSB7XHJcbiAgICAgICAgICAgICAgICBjYXRlZ29yaWVzLnB1c2goY2F0ZWdvcnkpO1xyXG4gICAgICAgICAgICB9Ly9pZlxyXG4gICAgICAgIH0pOy8vZm9yRWFjaFxyXG5cclxuICAgICAgICBsZXQgaHRtbCA9IE11c3RhY2hlLnRvX2h0bWwodGVtcGxhdGUsIGRhdGEpO1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9wYXJlbnREaXZJZCkuYXBwZW5kKGh0bWwpO1xyXG5cclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fc2Vjb25kTGV2ZWxTZWxlY3QpLmNoYW5nZSgoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgbGV0IHNlbGVjdGVkSWQgPSBwYXJzZUludCgkKGV2ZW50LmN1cnJlbnRUYXJnZXQpLnZhbCgpLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFR3byA9IHNlbGVjdGVkSWQ7XHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlVGhpcmRMZXZlbChzZWxlY3RlZElkKTtcclxuICAgICAgICAgICAgbGV0IGV2ZW50QXJnID0gbmV3IENhdGVnb3J5Q2FobmdlZEV2ZW50QXJnKCk7XHJcbiAgICAgICAgICAgIGV2ZW50QXJnLlNlbGVjdGVkQ2F0ZWdvcnlJZCA9IHRoaXMuR2V0U2VsZWN0ZWRDYXRlZ29yeUlkKCk7XHJcbiAgICAgICAgICAgIGV2ZW50QXJnLlNlbGVjdGVkQ2F0ZWdvcnlIYXNDaGlsZCA9IHRoaXMuc2VsZWN0ZWRDYXRlZ29yeUhhc0NoaWxkcmVuKCk7XHJcbiAgICAgICAgICAgIHRoaXMuU2VsZWN0ZWRDYXRlZ29yeUNoYW5nZWRFdmVudC5EaXNwYXRjaCh0aGlzLCBldmVudEFyZyk7XHJcbiAgICAgICAgfSk7Ly9jaGFuZ2VcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZVRoaXJkTGV2ZWwoc2Vjb25kTGV2ZWxDYXRlZ29yeUlkOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnJlbW92ZUVsZW1lbnQodGhpcy5fdGhpcmRMZXZlbERpdik7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUaHJlZSA9IHRoaXMuX3Jvb3RDYXRlZ29yeUlkO1xyXG5cclxuICAgICAgICBpZiAoc2Vjb25kTGV2ZWxDYXRlZ29yeUlkID09PSB0aGlzLl9yb290Q2F0ZWdvcnlJZCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgdGVtcGxhdGUgPSAkKFwiI1wiICsgdGhpcy5fdGhpcmRMZXZlbFRlbXBsYXRlKS5odG1sKCk7XHJcbiAgICAgICAgbGV0IGNhdGVnb3JpZXM6IENhdGVnb3J5W10gPSBuZXcgQXJyYXk8Q2F0ZWdvcnk+KCk7XHJcbiAgICAgICAgbGV0IGRhdGEgPSB7IGNhdGVnb3JpZXM6IGNhdGVnb3JpZXMgfVxyXG5cclxuICAgICAgICB0aGlzLl9hbGxDYXRlZ29yaWVzLmZvckVhY2goY2F0ZWdvcnkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoY2F0ZWdvcnkuQ2F0ZWdvcnlQYXJlbnRJZCA9PT0gc2Vjb25kTGV2ZWxDYXRlZ29yeUlkKSB7XHJcbiAgICAgICAgICAgICAgICBjYXRlZ29yaWVzLnB1c2goY2F0ZWdvcnkpO1xyXG4gICAgICAgICAgICB9Ly9pZlxyXG4gICAgICAgIH0pOy8vZm9yRWFjaFxyXG4gICAgICAgIGlmIChjYXRlZ29yaWVzLmxlbmd0aCA9PT0gMCkgey8vTm8gSXRlbSBpbiB0aGlyZCBsZXZlbCBjYXRlZ29yeVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBodG1sID0gTXVzdGFjaGUudG9faHRtbCh0ZW1wbGF0ZSwgZGF0YSk7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX3BhcmVudERpdklkKS5hcHBlbmQoaHRtbCk7XHJcblxyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl90aGlyZExldmVsU2VsZWN0KS5jaGFuZ2UoKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVGhyZWUgPSBwYXJzZUludCgkKGV2ZW50LmN1cnJlbnRUYXJnZXQpLnZhbCgpLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICBsZXQgZXZlbnRBcmcgPSBuZXcgQ2F0ZWdvcnlDYWhuZ2VkRXZlbnRBcmcoKTtcclxuICAgICAgICAgICAgZXZlbnRBcmcuU2VsZWN0ZWRDYXRlZ29yeUlkID0gdGhpcy5HZXRTZWxlY3RlZENhdGVnb3J5SWQoKTtcclxuICAgICAgICAgICAgZXZlbnRBcmcuU2VsZWN0ZWRDYXRlZ29yeUhhc0NoaWxkID0gdGhpcy5zZWxlY3RlZENhdGVnb3J5SGFzQ2hpbGRyZW4oKTtcclxuICAgICAgICAgICAgdGhpcy5TZWxlY3RlZENhdGVnb3J5Q2hhbmdlZEV2ZW50LkRpc3BhdGNoKHRoaXMsIGV2ZW50QXJnKTtcclxuICAgICAgICB9KTsvL2NoYW5nZVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2VsZWN0ZWRDYXRlZ29yeUhhc0NoaWxkcmVuKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGxldCBzZWxlY3RlZENhdGVnb3J5SWQgPSB0aGlzLkdldFNlbGVjdGVkQ2F0ZWdvcnlJZCgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9hbGxDYXRlZ29yaWVzLmZpbHRlclxyXG4gICAgICAgICAgICAoKGNhdGVnb3J5KSA9PiB7IHJldHVybiBjYXRlZ29yeS5DYXRlZ29yeVBhcmVudElkID09PSBzZWxlY3RlZENhdGVnb3J5SWQgfSkubGVuZ3RoID4gMDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlbW92ZUVsZW1lbnQoaWQ6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgICQoXCIjXCIgKyBpZCkucmVtb3ZlKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBDYXRlZ29yeUNhaG5nZWRFdmVudEFyZyB7XHJcbiAgICBwdWJsaWMgU2VsZWN0ZWRDYXRlZ29yeUlkOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgU2VsZWN0ZWRDYXRlZ29yeUhhc0NoaWxkOiBib29sZWFuO1xyXG59XHJcblxyXG5lbnVtIENhdGVnb3J5TGV2ZWwge1xyXG4gICAgTGV2ZWwxID0gMSxcclxuICAgIExldmVsMiA9IDIsXHJcbiAgICBMZXZlbDMgPSAzLFxyXG4gICAgVW5rb3duPTRcclxufVxyXG5cclxuIiwi77u/aW1wb3J0IHtDYXJNb2RlbH0gZnJvbSBcIi4uLy4uL01vZGVscy9BZFRyYW5zcG9ydGF0aW9uL0Nhck1vZGVsXCI7XHJcbmltcG9ydCB7VXNlcklucHV0fSBmcm9tIFwiLi4vLi4vSGVscGVyL1VzZXJJbnB1dFwiO1xyXG5pbXBvcnQge0lDcml0ZXJpYSxDcml0ZXJpYVZhbGlkYXRvcn0gZnJvbSBcIi4uLy4uL0hlbHBlci9JQ3JpdGVyaWFcIjtcclxuaW1wb3J0IHtJQ3JpdGVyaWFDaGFuZ2V9IGZyb20gXCIuLi8uLi9IZWxwZXIvSUNyaXRlcmlhQ2hhbmdlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQ2FyTW9kZWxCcmFuZENvbnRyb2xsZXIgaW1wbGVtZW50cyBJQ3JpdGVyaWEge1xyXG4gICAgVmFsaWRhdGVDcml0ZXJpYSgpOiBDcml0ZXJpYVZhbGlkYXRvciB7IHRocm93IG5ldyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZFwiKTsgfVxyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgQ2FyQnJhbmRJZEtleTogc3RyaW5nID0gXCJCcmFuZElkXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IEJyYW5kU2VsZWN0SWQ6IHN0cmluZyA9IFwiYnJhbmRcIjtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IENhck1vZGVsVGVtcGxhdGVJZDogc3RyaW5nID0gXCJtb2RlbFRlbXBsYXRlXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IENhck1vZGVsRGl2UGxhY2VIb2xkZXJJZDogc3RyaW5nID0gXCJtb2RlbFBsYWNlSG9sZGVyXCI7XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBDYXJNb2RlbElkS2V5OiBzdHJpbmcgPSBcIkNhck1vZGVsSWRcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgQWxsQ2FyTW9kZWxzSW5wdXRJZDogc3RyaW5nID0gXCJhbGxDYXJNb2RlbHNcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgTW9kZWxTZWxlY3RJZDogc3RyaW5nID0gXCJtb2RlbFwiO1xyXG4gICAgcHJpdmF0ZSBfYWxsQ2FyTW9kZWxzOiBDYXJNb2RlbFtdO1xyXG5cclxuICAgIHByaXZhdGUgX3NlYXJjaENyaXRlcmlhQ2hhbmdlOklDcml0ZXJpYUNoYW5nZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmluaXRWaWV3KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbml0VmlldygpOiB2b2lkIHtcclxuICAgICAgICBsZXQgYWxsQ2FyTW9kZWxzU3RyaW5nID0gJChcIiNcIiArIHRoaXMuQWxsQ2FyTW9kZWxzSW5wdXRJZCkudmFsKCkudG9TdHJpbmcoKTtcclxuICAgICAgICB0aGlzLl9hbGxDYXJNb2RlbHMgPSAkLnBhcnNlSlNPTihhbGxDYXJNb2RlbHNTdHJpbmcpIGFzIENhck1vZGVsW107XHJcbiAgICAgICAgdGhpcy5pbml0Q2FyTW9kZWwoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXRDYXJNb2RlbCgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmNyZWF0ZUNhck1vZGVsRWxlbWVudChuZXcgQXJyYXk8Q2FyTW9kZWw+KCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlQ2FyTW9kZWxFbGVtZW50KGNhck1vZGVsczogQ2FyTW9kZWxbXSkge1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLkNhck1vZGVsRGl2UGxhY2VIb2xkZXJJZCkuY2hpbGRyZW4oKS5yZW1vdmUoKTtcclxuICAgICAgICBsZXQgdGVtcGxhdGUgPSAkKFwiI1wiICsgdGhpcy5DYXJNb2RlbFRlbXBsYXRlSWQpLmh0bWwoKTtcclxuICAgICAgICBsZXQgZGF0YSA9IHsgY2FyTW9kZWxzOiBjYXJNb2RlbHMgfVxyXG4gICAgICAgIGxldCBodG1sID0gTXVzdGFjaGUudG9faHRtbCh0ZW1wbGF0ZSwgZGF0YSk7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuQ2FyTW9kZWxEaXZQbGFjZUhvbGRlcklkKS5hcHBlbmQoaHRtbCk7XHJcbiAgICAgICAgdGhpcy5iaW5kQ2FyTW9kZWwoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGJpbmRDYXJNb2RlbCgpOiB2b2lkIHtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5Nb2RlbFNlbGVjdElkKS5vbihcImNoYW5nZVwiLChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2VhcmNoQ3JpdGVyaWFDaGFuZ2UuQ3VzdG9tQ3JpdGVyaWFDaGFuZ2VkKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlQ2FyTW9kZWxTZWxlY3QoYnJhbmRJZDogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgbGV0IGNhck1vZGVscyA9IG5ldyBBcnJheTxDYXJNb2RlbD4oKTtcclxuICAgICAgICBpZiAoYnJhbmRJZCAhPT0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLl9hbGxDYXJNb2RlbHMuZm9yRWFjaCgoY2FyTW9kZWwsIGluZGV4LCBhcnJheSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNhck1vZGVsLkJyYW5kSWQgPT09IGJyYW5kSWQpXHJcbiAgICAgICAgICAgICAgICAgICAgY2FyTW9kZWxzLnB1c2goY2FyTW9kZWwpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jcmVhdGVDYXJNb2RlbEVsZW1lbnQoY2FyTW9kZWxzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgRmlsbENyaXRlcmlhKHVzZXJJbnB1dDpVc2VySW5wdXQpOnZvaWQge1xyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLkNhckJyYW5kSWRLZXldID1cclxuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuQnJhbmRTZWxlY3RJZCkuZmluZChcIm9wdGlvbjpzZWxlY3RlZFwiKS52YWwoKTsvL2JyYW5kSWRcclxuICAgICAgICB1c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnlbdGhpcy5DYXJNb2RlbElkS2V5XSA9XHJcbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLk1vZGVsU2VsZWN0SWQpLmZpbmQoXCJvcHRpb246c2VsZWN0ZWRcIikudmFsKCk7Ly9jYXJNb2RlbElkXHJcbiAgICB9XHJcblxyXG4gICAgQmluZEV2ZW50cyhjcml0ZXJpYUNoYW5nZTogSUNyaXRlcmlhQ2hhbmdlKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fc2VhcmNoQ3JpdGVyaWFDaGFuZ2UgPSBjcml0ZXJpYUNoYW5nZTtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5CcmFuZFNlbGVjdElkKS5vbihcImNoYW5nZVwiLCAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgbGV0IHNlbGVjdGVkQnJhbmRJZDogbnVtYmVyID0gcGFyc2VJbnQoJChldmVudC5jdXJyZW50VGFyZ2V0KS5maW5kKFwib3B0aW9uOnNlbGVjdGVkXCIpLnZhbCgpLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUNhck1vZGVsU2VsZWN0KHNlbGVjdGVkQnJhbmRJZCk7XHJcbiAgICAgICAgICAgIGNyaXRlcmlhQ2hhbmdlLkN1c3RvbUNyaXRlcmlhQ2hhbmdlZCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmJpbmRDYXJNb2RlbCgpO1xyXG4gICAgfVxyXG5cclxuICAgIFVuQmluZEV2ZW50cygpOiB2b2lkIHtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5CcmFuZFNlbGVjdElkKS5vZmYoXCJjaGFuZ2VcIik7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuTW9kZWxTZWxlY3RJZCkub2ZmKFwiY2hhbmdlXCIpO1xyXG4gICAgfVxyXG59Iiwi77u/aW1wb3J0IHtJRXZlbnR9ICBmcm9tIFwiLi9JRXZlbnRcIjtcclxuXHJcblxyXG4vKiBUaGUgZGlzcGF0Y2hlciBoYW5kbGVzIHRoZSBzdG9yYWdlIG9mIHN1YnNjaXB0aW9ucyBhbmQgZmFjaWxpdGF0ZXNcclxuICBzdWJzY3JpcHRpb24sIHVuc3Vic2NyaXB0aW9uIGFuZCBkaXNwYXRjaGluZyBvZiB0aGUgZXZlbnQgKi9cclxuZXhwb3J0ICBjbGFzcyBFdmVudERpc3BhdGNoZXI8VFNlbmRlciwgVEFyZ3M+IGltcGxlbWVudHMgSUV2ZW50PFRTZW5kZXIsIFRBcmdzPiB7XHJcblxyXG4gICAgcHJpdmF0ZSBfc3Vic2NyaXB0aW9uczogQXJyYXk8KHNlbmRlcjogVFNlbmRlciwgYXJnczogVEFyZ3MpID0+IHZvaWQ+ID0gbmV3IEFycmF5PChzZW5kZXI6IFRTZW5kZXIsIGFyZ3M6IFRBcmdzKSA9PiB2b2lkPigpO1xyXG5cclxuICAgIHB1YmxpYyBTdWJzY3JpYmUoZm46IChzZW5kZXI6IFRTZW5kZXIsIGFyZ3M6IFRBcmdzKSA9PiB2b2lkKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKGZuKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMucHVzaChmbik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyAgVW5zdWJzY3JpYmUoZm46IChzZW5kZXI6IFRTZW5kZXIsIGFyZ3M6IFRBcmdzKSA9PiB2b2lkKTogdm9pZCB7XHJcbiAgICAgICAgbGV0IGkgPSB0aGlzLl9zdWJzY3JpcHRpb25zLmluZGV4T2YoZm4pO1xyXG4gICAgICAgIGlmIChpID4gLTEpIHtcclxuICAgICAgICAgICAgdGhpcy5fc3Vic2NyaXB0aW9ucy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyAgRGlzcGF0Y2goc2VuZGVyOiBUU2VuZGVyLCBhcmdzOiBUQXJncyk6IHZvaWQge1xyXG4gICAgICAgIGZvciAobGV0IGhhbmRsZXIgb2YgdGhpcy5fc3Vic2NyaXB0aW9ucykge1xyXG4gICAgICAgICAgICBoYW5kbGVyKHNlbmRlciwgYXJncyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59Iiwi77u/aW1wb3J0IHtVc2VySW5wdXR9IGZyb20gXCIuL1VzZXJJbnB1dFwiO1xyXG5pbXBvcnQge0lSZXN1bHRIYW5kbGVyfSBmcm9tIFwiLi9JUmVzdWx0SGFuZGxlclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEFqYXhDYWxsZXIge1xyXG5cclxuICAgIHByaXZhdGUgX251bWJlck9mUHVyZVNlcnZlckNhbGxzOiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfdXJsOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5ICBfcmVzdWx0SGFuZGxlcjogSVJlc3VsdEhhbmRsZXI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9yZXF1ZXN0Q29kZTpudW1iZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IodXJsOiBzdHJpbmcsIHJlc3VsdEhhbmRsZXI6IElSZXN1bHRIYW5kbGVyLHJlcXVlc3RDb2RlOm51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX3VybCA9IHVybDtcclxuICAgICAgICB0aGlzLl9yZXN1bHRIYW5kbGVyID0gcmVzdWx0SGFuZGxlcjtcclxuICAgICAgICB0aGlzLl9yZXF1ZXN0Q29kZSA9IHJlcXVlc3RDb2RlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBDYWxsKHVzZXJJbnB1dDogVXNlcklucHV0KTogdm9pZCB7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgIHVybDogdGhpcy5fdXJsLFxyXG4gICAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeSh1c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnkpLCAvL0RhdGEgc2VudCB0byBzZXJ2ZXJcclxuICAgICAgICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJywgLy8gY29udGVudCB0eXBlIHNlbnQgdG8gc2VydmVyXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IChtc2csIHRleHRTdGF0dXMsIGpxWEhSKSA9PiB0aGlzLm9uU3VjY2Vzc0dldEl0ZW1zRnJvbVNlcnZlcihtc2csIHRleHRTdGF0dXMsIGpxWEhSKSwgLy9PbiBTdWNjZXNzZnVsbCBzZXJ2aWNlIGNhbGxcclxuICAgICAgICAgICAgZXJyb3I6IChqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pID0+IHRoaXMub25FcnJvckdldEl0ZW1zRnJvbVNlcnZlcihqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pIC8vIFdoZW4gU2VydmljZSBjYWxsIGZhaWxzXHJcbiAgICAgICAgfSk7IC8vLmFqYXhcclxuXHJcbiAgICAgICAgdGhpcy5fbnVtYmVyT2ZQdXJlU2VydmVyQ2FsbHMrKztcclxuICAgICAgICB0aGlzLl9yZXN1bHRIYW5kbGVyLkFqYXhDYWxsU3RhcnRlZCh0aGlzLl9yZXF1ZXN0Q29kZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvblN1Y2Nlc3NHZXRJdGVtc0Zyb21TZXJ2ZXIobXNnOiBhbnksIHRleHRTdGF0dXM6IHN0cmluZywganFYSFI6IEpRdWVyeVhIUikge1xyXG5cclxuICAgICAgICB0aGlzLl9udW1iZXJPZlB1cmVTZXJ2ZXJDYWxscy0tO1xyXG4gICAgICAgIGlmICh0aGlzLl9udW1iZXJPZlB1cmVTZXJ2ZXJDYWxscyA9PT0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLl9yZXN1bHRIYW5kbGVyLkFqYXhDYWxsRmluaXNoZWQodGhpcy5fcmVxdWVzdENvZGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9yZXN1bHRIYW5kbGVyLk9uUmVzdWx0KG1zZywgdGhpcy5fcmVxdWVzdENvZGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25FcnJvckdldEl0ZW1zRnJvbVNlcnZlcihqcVhIUjogSlF1ZXJ5WEhSLCB0ZXh0U3RhdHVzOiBzdHJpbmcsIGVycm9yVGhyb3duOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLl9udW1iZXJPZlB1cmVTZXJ2ZXJDYWxscy0tO1xyXG4gICAgICAgIGlmICh0aGlzLl9udW1iZXJPZlB1cmVTZXJ2ZXJDYWxscyA9PT0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLl9yZXN1bHRIYW5kbGVyLkFqYXhDYWxsRmluaXNoZWQodGhpcy5fcmVxdWVzdENvZGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fcmVzdWx0SGFuZGxlci5PbkVycm9yKHRleHRTdGF0dXMgKyBcIiAsIFwiICsgZXJyb3JUaHJvd24sIHRoaXMuX3JlcXVlc3RDb2RlKTtcclxuICAgIH1cclxufSIsIu+7v2ltcG9ydCB7IElDcml0ZXJpYX0gZnJvbSBcIi4vSUNyaXRlcmlhXCI7XHJcbmltcG9ydCB7IE51bWVyaWNEaWN0aW9uYXJ5IH0gZnJvbSBcImxvZGFzaC9pbmRleFwiO1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBDcml0ZXJpYU51bWVyaWNEaWN0aW9uYXJ5IGltcGxlbWVudHMgTnVtZXJpY0RpY3Rpb25hcnk8SUNyaXRlcmlhPiB7XHJcbiAgICBbaW5kZXg6IG51bWJlcl06IElDcml0ZXJpYTtcclxufSIsIu+7v2ludGVyZmFjZSBMb29zZU9iamVjdCB7XHJcbiAgICBba2V5OiBzdHJpbmddOiBhbnlcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFVzZXJJbnB1dCB7XHJcbiAgICBwdWJsaWMgUGFyYW1ldGVyc0RpY3Rpb25hcnk6IExvb3NlT2JqZWN0ID0ge307XHJcbn1cclxuXHJcblxyXG5cclxuIiwi77u/aW1wb3J0IHsgQ2F0ZWdvcnlTZWxlY3Rpb24gfSBmcm9tIFwiLi4vLi4vLi4vQ29tcG9uZW50cy9DYXRlZ29yeS9DYXRlZ29yeVNlbGVjdGlvblwiO1xyXG5pbXBvcnQgeyBDYXRlZ29yeSB9IGZyb20gXCIuLi8uLi8uLi9Nb2RlbHMvQ2F0ZWdvcnlcIjtcclxuaW1wb3J0IHtVc2VySW5wdXR9IGZyb20gXCIuLi8uLi8uLi9IZWxwZXIvVXNlcklucHV0XCI7XHJcbmltcG9ydCB7TGV0TWVLbm93U2VydmVyQ2FsbGVyfSBmcm9tIFwiLi9MZXRNZUtub3dTZXJ2ZXJDYWxsZXJcIjtcclxuaW1wb3J0IHtMZXRNZUtub3dQYXJ0aWFsVmlld0xvYWRlcn0gZnJvbSBcIi4vTGV0TWVLbm93UGFydGlhbFZpZXdMb2FkZXJcIjtcclxuaW1wb3J0IHtJQ3JpdGVyaWFDaGFuZ2V9IGZyb20gXCIuLi8uLi8uLi9IZWxwZXIvSUNyaXRlcmlhQ2hhbmdlXCI7XHJcbmltcG9ydCB7TGV0TWVLbm93Q3JpdGVyaWF9ICBmcm9tIFwiLi9MZXRNZUtub3dDcml0ZXJpYVwiO1xyXG5pbXBvcnQge0lSZXN1bHRIYW5kbGVyfSBmcm9tIFwiLi4vLi4vLi4vSGVscGVyL0lSZXN1bHRIYW5kbGVyXCI7XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIExldE1lS25vdyBpbXBsZW1lbnRzIElDcml0ZXJpYUNoYW5nZSxJUmVzdWx0SGFuZGxlciB7XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBJbnNlcnRMZXRNZUtub3dJbWFnZUlkID0gXCJpbnNlcnRMZXRNZUtub3dcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgTG9hZFZpZXdJbWFnZUlkID0gXCJsb2FkVmlld1wiO1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgRW1haWxPclNtc0tleTogc3RyaW5nID0gXCJFbWFpbE9yU21zXCI7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgIEVtYWlsT3JTbXNQYXJlbnREaXZJZDogc3RyaW5nID0gXCJlbWFpbE9yU21zXCI7XHJcbiAgICBcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX3JlZ2lzdGVyTGV0TWVLbm93SW5wdXRJZDogc3RyaW5nID0gXCJyZWdpc3RlckxldE1lS25vd1wiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfY2F0ZWdvcnlTcGVjaWZpY0NyaXRlcmlhRGl2SWQ6IHN0cmluZyA9XCJDYXRlZ29yeVNwZWNpZmljQ3JpdGVyaWFcIjtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9wYXJ0aWFsVmlld0RpdklkOiBzdHJpbmcgPVwiQ2F0ZWdvcnlTcGVjaWZpY0NyaXRlcmlhXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IE1lc3NhZ2VEaXZJZDogc3RyaW5nID0gXCJtZXNzYWdlXCI7XHJcblxyXG4gICAgcHJpdmF0ZSBfY2F0ZWdvcnlTZWxlY3Rpb246IENhdGVnb3J5U2VsZWN0aW9uO1xyXG4gICAgcHJpdmF0ZSBfbGV0TWVLbm93Q3JpdGVyaWE6TGV0TWVLbm93Q3JpdGVyaWE7XHJcbiAgICBwcml2YXRlIF9sZXRNZUtub3dTZXJ2ZXJDYWxsZXI6IExldE1lS25vd1NlcnZlckNhbGxlcjtcclxuICAgIHByaXZhdGUgX2xldE1lS25vd1BhcnRpYWxWaWV3TG9hZGVyOiBMZXRNZUtub3dQYXJ0aWFsVmlld0xvYWRlcjtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IEFkZExldE1lS25vd1JlcXVlc3RDb2RlID0gMTsvL1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBMb2FkTGV0TWVLbm93UGFydGlhbFZpZXdSZXF1ZXN0Q29kZSA9IDI7XHJcblxyXG4gICAgY29uc3RydWN0b3IoY2F0ZWdvcnlTZWxlY3RvclBhcmVudERpdklkOiBzdHJpbmcsIGFsbENhdGVnb3JpZXNJZDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5pbml0Q2F0ZWdvcnlTZWxlY3QoY2F0ZWdvcnlTZWxlY3RvclBhcmVudERpdklkLCBhbGxDYXRlZ29yaWVzSWQpO1xyXG4gICAgICAgIHRoaXMuX2xldE1lS25vd1NlcnZlckNhbGxlciA9IG5ldyBMZXRNZUtub3dTZXJ2ZXJDYWxsZXIodGhpcyx0aGlzLkFkZExldE1lS25vd1JlcXVlc3RDb2RlKTtcclxuICAgICAgICB0aGlzLl9sZXRNZUtub3dDcml0ZXJpYSA9IG5ldyBMZXRNZUtub3dDcml0ZXJpYSgpO1xyXG4gICAgICAgIHRoaXMuX2xldE1lS25vd1BhcnRpYWxWaWV3TG9hZGVyID1cclxuICAgICAgICAgICAgbmV3IExldE1lS25vd1BhcnRpYWxWaWV3TG9hZGVyKCB0aGlzLCB0aGlzLCB0aGlzLl9sZXRNZUtub3dDcml0ZXJpYSx0aGlzLkxvYWRMZXRNZUtub3dQYXJ0aWFsVmlld1JlcXVlc3RDb2RlKTtcclxuICAgICAgICB0aGlzLmluaXRFdmVudEhhbmRsZXJzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIEN1c3RvbUNyaXRlcmlhQ2hhbmdlZCgpOiB2b2lkIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbml0Q2F0ZWdvcnlTZWxlY3QoY2F0ZWdvcnlTZWxlY3RvclBhcmVudERpdklkOiBzdHJpbmcsIGFsbENhdGVnb3JpZXNJZDogc3RyaW5nKTp2b2lkIHtcclxuICAgICAgICBsZXQgYWxsQ2F0ZWdvcmllc1N0cmluZyA9ICQoXCIjXCIgKyBhbGxDYXRlZ29yaWVzSWQpLnZhbCgpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgbGV0IGFsbENhdGVnb3JpZXMgPSAkLnBhcnNlSlNPTihhbGxDYXRlZ29yaWVzU3RyaW5nKSBhcyBDYXRlZ29yeVtdO1xyXG4gICAgICAgIHRoaXMuX2NhdGVnb3J5U2VsZWN0aW9uID0gbmV3IENhdGVnb3J5U2VsZWN0aW9uKGNhdGVnb3J5U2VsZWN0b3JQYXJlbnREaXZJZCwgYWxsQ2F0ZWdvcmllcyk7XHJcbiAgICAgICAgdGhpcy5fY2F0ZWdvcnlTZWxlY3Rpb24uQ3JlYXRlRmlyc3RMZXZlbCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaW5pdEV2ZW50SGFuZGxlcnMoKTp2b2lkIHtcclxuICAgICAgICB0aGlzLl9jYXRlZ29yeVNlbGVjdGlvbi5TZWxlY3RlZENhdGVnb3J5Q2hhbmdlZEV2ZW50LlN1YnNjcmliZSgoc2VuZGVyLCBhcmdzKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCB1c2VySW5wdXQgPSBuZXcgVXNlcklucHV0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2NhdGVnb3J5U2VsZWN0aW9uLkluc2VydENhdGVnb3J5SWRJblVzZXJJbnB1dERpY3Rpb25hcnkodXNlcklucHV0KTtcclxuICAgICAgICAgICAgdGhpcy5fbGV0TWVLbm93UGFydGlhbFZpZXdMb2FkZXIuR2V0UGFydGlhbFZpZXdGcm9tU2VydmVyKHVzZXJJbnB1dCwgYXJncy5TZWxlY3RlZENhdGVnb3J5SWQpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fcmVnaXN0ZXJMZXRNZUtub3dJbnB1dElkKS5vbihcImNsaWNrXCIsIChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB0aGlzLnJlZ2lzdGVyTGV0TWVLbm93KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSAgcmVnaXN0ZXJMZXRNZUtub3coKTp2b2lkIHtcclxuICAgICAgICAvL1RPRE8gZGlzYWJsZSBzdWJtaXRBZCBCdXR0b24gdW50aWwgY3VycmVudCBzdWJtaXNzaW9uIGlzIG9rIG9yIGVycm9ybm91cyBcclxuXHJcbiAgICAgICAgbGV0IHVzZXJJbnB1dCA9IG5ldyBVc2VySW5wdXQoKTtcclxuICAgICAgICB0aGlzLl9jYXRlZ29yeVNlbGVjdGlvbi5JbnNlcnRDYXRlZ29yeUlkSW5Vc2VySW5wdXREaWN0aW9uYXJ5KHVzZXJJbnB1dCk7XHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuRW1haWxPclNtc0tleV0gPSAkKFwiI1wiICsgdGhpcy5FbWFpbE9yU21zUGFyZW50RGl2SWQpLmNoaWxkcmVuKFwiOmNoZWNrZWRcIikudmFsKCk7Oy8vVE9ETyBtYWtlIGEgdWkgdmlldyAocmFkaW8gYnV0dG9uKVxyXG4gICAgICAgIHRoaXMuX2xldE1lS25vd0NyaXRlcmlhLkZpbGxDYXRlZ29yeVNwZWNpZmljTGV0TWVLbm93Q3JpdGVyaWEodGhpcy5fY2F0ZWdvcnlTZWxlY3Rpb24uR2V0U2VsZWN0ZWRDYXRlZ29yeUlkKCksdXNlcklucHV0KTtcclxuXHJcbiAgICAgICAgdGhpcy5fbGV0TWVLbm93U2VydmVyQ2FsbGVyLlNhdmVBZCh1c2VySW5wdXQpO1xyXG4gICAgfVxyXG5cclxuICAgIE9uUmVzdWx0KHBhcmFtOiBhbnksIHJlcXVlc3RDb2RlOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICBpZiAocmVxdWVzdENvZGUgPT09IHRoaXMuTG9hZExldE1lS25vd1BhcnRpYWxWaWV3UmVxdWVzdENvZGUpIHtcclxuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuX3BhcnRpYWxWaWV3RGl2SWQpLmNoaWxkcmVuKCkucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLl9wYXJ0aWFsVmlld0RpdklkKS5odG1sKHBhcmFtKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHJlcXVlc3RDb2RlID09PSB0aGlzLkFkZExldE1lS25vd1JlcXVlc3RDb2RlKSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmxvY2F0aW9uLnJlcGxhY2UoXCIvTGV0TWVLbm93L0NvbmZpcm1cIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuICAgIE9uRXJyb3IobWVzc2FnZTogc3RyaW5nLCByZXF1ZXN0Q29kZTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHJlcXVlc3RDb2RlID09PSB0aGlzLkxvYWRMZXRNZUtub3dQYXJ0aWFsVmlld1JlcXVlc3RDb2RlKSB7XHJcbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLk1lc3NhZ2VEaXZJZCkuY2hpbGRyZW4oKS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuTWVzc2FnZURpdklkKS5odG1sKFwiPHA+XCIgKyBtZXNzYWdlICsgXCI8L3A+XCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocmVxdWVzdENvZGUgPT09IHRoaXMuQWRkTGV0TWVLbm93UmVxdWVzdENvZGUpIHtcclxuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuTWVzc2FnZURpdklkKS5jaGlsZHJlbigpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5NZXNzYWdlRGl2SWQpLmh0bWwoXCI8cD5cIiArIG1lc3NhZ2UgKyBcIjwvcD5cIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgQWpheENhbGxGaW5pc2hlZChyZXF1ZXN0Q29kZTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHJlcXVlc3RDb2RlID09PSB0aGlzLkxvYWRMZXRNZUtub3dQYXJ0aWFsVmlld1JlcXVlc3RDb2RlKSB7XHJcbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLkxvYWRWaWV3SW1hZ2VJZCkuaGlkZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocmVxdWVzdENvZGUgPT09IHRoaXMuQWRkTGV0TWVLbm93UmVxdWVzdENvZGUpIHtcclxuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuSW5zZXJ0TGV0TWVLbm93SW1hZ2VJZCkuaGlkZSgpO1xyXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5fcmVnaXN0ZXJMZXRNZUtub3dJbnB1dElkKS5yZW1vdmVBdHRyKFwiZGlzYWJsZWRcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEFqYXhDYWxsU3RhcnRlZChyZXF1ZXN0Q29kZTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHJlcXVlc3RDb2RlID09PSB0aGlzLkxvYWRMZXRNZUtub3dQYXJ0aWFsVmlld1JlcXVlc3RDb2RlKSB7XHJcbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLkxvYWRWaWV3SW1hZ2VJZCkuc2hvdygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocmVxdWVzdENvZGUgPT09IHRoaXMuQWRkTGV0TWVLbm93UmVxdWVzdENvZGUpIHtcclxuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuSW5zZXJ0TGV0TWVLbm93SW1hZ2VJZCkuc2hvdygpO1xyXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5fcmVnaXN0ZXJMZXRNZUtub3dJbnB1dElkKS5hdHRyKFwiZGlzYWJsZWRcIiwgXCJkaXNhYmxlZFwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmxldCBjYXRlZ29yeVNlbGVjdG9yUGFyZW50RGl2SWQ6IHN0cmluZyA9IFwiY2F0ZWdvcnlTZWxlY3RvclwiO1xyXG5sZXQgYWxsQ2F0ZWdvcmllc0lkID0gXCJhbGxDYXRlZ29yaWVzXCI7XHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeSgoKT0+IHtcclxuICAgIGxldCBsZXRNZUtub3cgPSBuZXcgTGV0TWVLbm93KGNhdGVnb3J5U2VsZWN0b3JQYXJlbnREaXZJZCxhbGxDYXRlZ29yaWVzSWQpO1xyXG59KTsiLCLvu79pbXBvcnQgeyBDcml0ZXJpYU51bWVyaWNEaWN0aW9uYXJ5IH0gZnJvbSBcIi4uLy4uLy4uL0hlbHBlci9Dcml0ZXJpYU51bWVyaWNEaWN0aW9uYXJ5XCI7XHJcbmltcG9ydCB7IERlZmF1bHRMZXRNZUtub3dDcml0ZXJpYSB9IGZyb20gXCIuL0xldE1lS25vd0NyaXRlcmlhL0RlZmF1bHRMZXRNZUtub3dDcml0ZXJpYVwiO1xyXG5pbXBvcnQgeyBBZFRyYW5zcG9ydGF0aW9uTGV0TWVLbm93Q3JpdGVyaWEgfSBmcm9tIFwiLi9MZXRNZUtub3dDcml0ZXJpYS9BZFRyYW5zcG9ydGF0aW9uTGV0TWVLbm93Q3JpdGVyaWFcIjtcclxuaW1wb3J0IHsgVXNlcklucHV0IH0gZnJvbSBcIi4uLy4uLy4uL0hlbHBlci9Vc2VySW5wdXRcIjtcclxuaW1wb3J0IHsgSUNyaXRlcmlhIH0gZnJvbSBcIi4uLy4uLy4uL0hlbHBlci9JQ3JpdGVyaWFcIjtcclxuaW1wb3J0IHsgSUNyaXRlcmlhQ2hhbmdlIH0gZnJvbSBcIi4uLy4uLy4uL0hlbHBlci9JQ3JpdGVyaWFDaGFuZ2VcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBMZXRNZUtub3dDcml0ZXJpYSB7XHJcbiAgICBwcml2YXRlIF9sZXRNZUtub3dDcml0ZXJpYUlvY0NvbnRhaW5lcjogQ3JpdGVyaWFOdW1lcmljRGljdGlvbmFyeTtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuX2xldE1lS25vd0NyaXRlcmlhSW9jQ29udGFpbmVyID0gbmV3IENyaXRlcmlhTnVtZXJpY0RpY3Rpb25hcnkoKTtcclxuICAgICAgICB0aGlzLmluaXRMZXRNZUtub3dDcml0ZXJpYUlvY0NvbnRhaW5lcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaW5pdExldE1lS25vd0NyaXRlcmlhSW9jQ29udGFpbmVyKCkge1xyXG4gICAgICAgIHRoaXMuX2xldE1lS25vd0NyaXRlcmlhSW9jQ29udGFpbmVyWzBdID0gbmV3IERlZmF1bHRMZXRNZUtub3dDcml0ZXJpYSgpO1xyXG4gICAgICAgIHRoaXMuX2xldE1lS25vd0NyaXRlcmlhSW9jQ29udGFpbmVyWzEwMF0gPSBuZXcgQWRUcmFuc3BvcnRhdGlvbkxldE1lS25vd0NyaXRlcmlhKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIEZpbGxDYXRlZ29yeVNwZWNpZmljTGV0TWVLbm93Q3JpdGVyaWEoY2F0ZWdvcnlJZDogbnVtYmVyLCB1c2VySW5wdXQ6IFVzZXJJbnB1dCk6IHZvaWQge1xyXG4gICAgICAgIGxldCBsZXRNZUtub3dDcml0ZXJpYSA9IHRoaXMucG9seW1vcnBoaWNEaXNwYXRjaExldE1lS25vd0NyaXRlcmlhKGNhdGVnb3J5SWQpO1xyXG4gICAgICAgIGxldE1lS25vd0NyaXRlcmlhLkZpbGxDcml0ZXJpYSh1c2VySW5wdXQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBCaW5kKGNhdGVnb3J5SWQ6IG51bWJlciwgY3JpdGVyaWFDaGFuZ2U6IElDcml0ZXJpYUNoYW5nZSkge1xyXG4gICAgICAgIGxldCBjcml0ZXJpYSA9IHRoaXMucG9seW1vcnBoaWNEaXNwYXRjaExldE1lS25vd0NyaXRlcmlhKGNhdGVnb3J5SWQpO1xyXG4gICAgICAgIGNyaXRlcmlhLkJpbmRFdmVudHMoY3JpdGVyaWFDaGFuZ2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBVbkJpbmQoY2F0ZWdvcnlJZDogbnVtYmVyKSB7XHJcbiAgICAgICAgbGV0IGNyaXRlcmlhID0gdGhpcy5wb2x5bW9ycGhpY0Rpc3BhdGNoTGV0TWVLbm93Q3JpdGVyaWEoY2F0ZWdvcnlJZCk7XHJcbiAgICAgICAgY3JpdGVyaWEuVW5CaW5kRXZlbnRzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBwb2x5bW9ycGhpY0Rpc3BhdGNoTGV0TWVLbm93Q3JpdGVyaWEoY2F0ZWdvcnlJZDogbnVtYmVyKTogSUNyaXRlcmlhIHtcclxuICAgICAgICBsZXQgcmV0dXJuVmFsdWU6IElDcml0ZXJpYSA9IHRoaXMuX2xldE1lS25vd0NyaXRlcmlhSW9jQ29udGFpbmVyW2NhdGVnb3J5SWRdO1xyXG4gICAgICAgIGlmIChyZXR1cm5WYWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHJldHVyblZhbHVlID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHJldHVyblZhbHVlID0gdGhpcy5fbGV0TWVLbm93Q3JpdGVyaWFJb2NDb250YWluZXJbMF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXR1cm5WYWx1ZTtcclxuICAgIH1cclxufVxyXG5cclxuIiwi77u/aW1wb3J0IHsgSUNyaXRlcmlhLCBDcml0ZXJpYVZhbGlkYXRvciB9IGZyb20gXCIuLi8uLi8uLi8uLi9IZWxwZXIvSUNyaXRlcmlhXCI7XHJcbmltcG9ydCB7IFVzZXJJbnB1dCB9IGZyb20gXCIuLi8uLi8uLi8uLi9IZWxwZXIvVXNlcklucHV0XCI7XHJcbmltcG9ydCB7IElDcml0ZXJpYUNoYW5nZSB9IGZyb20gXCIuLi8uLi8uLi8uLi9IZWxwZXIvSUNyaXRlcmlhQ2hhbmdlXCI7XHJcbmltcG9ydCB7IENhck1vZGVsQnJhbmRDb250cm9sbGVyIH0gZnJvbSBcIi4uLy4uLy4uLy4uL0NvbXBvbmVudHMvVHJhbnNmb3JtYXRpb24vQ2FyTW9kZWxCcmFuZENvbnRyb2xsZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBBZFRyYW5zcG9ydGF0aW9uTGV0TWVLbm93Q3JpdGVyaWEgaW1wbGVtZW50cyBJQ3JpdGVyaWEge1xyXG4gICAgcHJpdmF0ZSBfY2FyTW9kZWxCcmFuZENvbnRvbGxlcjogQ2FyTW9kZWxCcmFuZENvbnRyb2xsZXI7XHJcblxyXG4gICAgcHVibGljIFZhbGlkYXRlQ3JpdGVyaWEoKTogQ3JpdGVyaWFWYWxpZGF0b3IgeyB0aHJvdyBuZXcgRXJyb3IoXCJOb3QgaW1wbGVtZW50ZWRcIik7IH1cclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IE1ha2VZZWFyS2V5OiBzdHJpbmcgPSBcIk1ha2VZZWFyXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IE1ha2VZZWFySW5wdXRJZDogc3RyaW5nID0gXCJtYWtlWWVhclwiO1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgRnVlbEtleSA9IFwiRnVlbFwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBGdWVsU2VsZWN0SWQ6IHN0cmluZyA9IFwiZnVlbFwiO1xyXG5cclxuICAgIHB1YmxpYyByZWFkb25seSBHZWFyYm94S2V5OiBzdHJpbmcgPSBcIkdlYXJib3hcIjtcclxuICAgIHB1YmxpYyByZWFkb25seSBHZWFyYm94VHlwZVBhcmVudERpdklkOiBzdHJpbmcgPSBcImdlYXJib3hUeXBlXCI7XHJcblxyXG4gICAgcHVibGljIHJlYWRvbmx5IENhclN0YXR1c0tleTogc3RyaW5nID0gXCJDYXJTdGF0dXNcIjtcclxuICAgIHB1YmxpYyByZWFkb25seSBDYXJTdGF0dXNQYXJlbnREaXZJZDogc3RyaW5nID0gXCJjYXJTdGF0dXNcIjtcclxuXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgTWlsZWFnZUtleTogc3RyaW5nID0gXCJNaWxlYWdlXCI7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgTWlsZWFnZUlucHV0SWQ6IHN0cmluZyA9IFwibWlsZWFnZVwiO1xyXG5cclxuICAgIHB1YmxpYyByZWFkb25seSBQbGF0ZVR5cGVLZXk6IHN0cmluZyA9IFwiUGxhdGVUeXBlXCI7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgUGxhdGVUeXBlUGFyZW50RGl2SWQ6IHN0cmluZyA9IFwicGxhdGVUeXBlXCI7XHJcblxyXG4gICAgcHVibGljIHJlYWRvbmx5IEJvZHlTdGF0dXNLZXk6IHN0cmluZyA9IFwiQm9keVN0YXR1c1wiO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IEJvZHlTdGF0dXNTZWxlY3RJZDogc3RyaW5nID0gXCJib2R5U3RhdHVzXCI7XHJcblxyXG4gICAgcHVibGljIHJlYWRvbmx5IEJvZHlDb2xvcktleTogc3RyaW5nID0gXCJCb2R5Q29sb3JcIjtcclxuICAgIHB1YmxpYyByZWFkb25seSBCb2R5Q29sb3JTZWxlY3RJZDogc3RyaW5nID0gXCJib2R5Q29sb3JcIjtcclxuXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgSW50ZXJuYWxDb2xvcktleTogc3RyaW5nID0gXCJJbnRlcm5hbENvbG9yXCI7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgSW50ZXJuYWxDb2xvclNlbGVjdElkID0gXCJpbnRlcm5hbENvbG9yXCI7XHJcblxyXG5cclxuICAgIHByaXZhdGUgaW5pdFZpZXcoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fY2FyTW9kZWxCcmFuZENvbnRvbGxlciA9IG5ldyBDYXJNb2RlbEJyYW5kQ29udHJvbGxlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBGaWxsQ3JpdGVyaWEodXNlcklucHV0OiBVc2VySW5wdXQpOiB2b2lkIHtcclxuICAgICAgICAvL1RPRE8gdmFsaWRhdGUgdXNlciBpbnB1dCB0aGVuIHByb2NlZWRcclxuICAgICAgICB0aGlzLl9jYXJNb2RlbEJyYW5kQ29udG9sbGVyLkZpbGxDcml0ZXJpYSh1c2VySW5wdXQpO1xyXG4gICAgICAgIC8vdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuTWFrZVllYXJLZXldID0gJChcIiNcIiArIHRoaXMuTWFrZVllYXJJbnB1dElkKS52YWwoKTsvL01ha2VZZWFyXHJcbiAgICAgICAgLy91c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnlbdGhpcy5GdWVsS2V5XSA9ICQoXCIjXCIgKyB0aGlzLkZ1ZWxTZWxlY3RJZCkuZmluZChcIm9wdGlvbjpzZWxlY3RlZFwiKS52YWwoKTsvL0Z1ZWxcclxuICAgICAgICAvL3VzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLk1pbGVhZ2VLZXldID0gJChcIiNcIiArIHRoaXMuTWlsZWFnZUlucHV0SWQpLnZhbCgpOy8vTWlsZWFnZVxyXG4gICAgICAgIC8vdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuR2VhcmJveEtleV0gPSAkKFwiI1wiICsgdGhpcy5HZWFyYm94VHlwZVBhcmVudERpdklkKS5jaGlsZHJlbihcIjpjaGVja2VkXCIpLnZhbCgpO1xyXG4gICAgICAgIC8vdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuQm9keUNvbG9yS2V5XSA9ICQoXCIjXCIgKyB0aGlzLkJvZHlDb2xvclNlbGVjdElkKS5maW5kKFwib3B0aW9uOnNlbGVjdGVkXCIpLnZhbCgpO1xyXG4gICAgICAgIC8vdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuSW50ZXJuYWxDb2xvcktleV0gPSAkKFwiI1wiICsgdGhpcy5JbnRlcm5hbENvbG9yU2VsZWN0SWQpLmZpbmQoXCJvcHRpb246c2VsZWN0ZWRcIikudmFsKCk7XHJcbiAgICAgICAgLy91c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnlbdGhpcy5Cb2R5U3RhdHVzS2V5XSA9ICQoXCIjXCIgKyB0aGlzLkJvZHlTdGF0dXNTZWxlY3RJZCkuZmluZChcIm9wdGlvbjpzZWxlY3RlZFwiKS52YWwoKTtcclxuICAgICAgICAvL3VzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLkNhclN0YXR1c0tleV0gPSAkKFwiI1wiICsgdGhpcy5DYXJTdGF0dXNQYXJlbnREaXZJZCkuY2hpbGRyZW4oXCI6Y2hlY2tlZFwiKS52YWwoKTtcclxuICAgICAgICAvL3VzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLlBsYXRlVHlwZUtleV0gPSAkKFwiI1wiICsgdGhpcy5QbGF0ZVR5cGVQYXJlbnREaXZJZCkuY2hpbGRyZW4oXCI6Y2hlY2tlZFwiKS52YWwoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgQmluZEV2ZW50cyhjcml0ZXJpYUNoYW5nZTogSUNyaXRlcmlhQ2hhbmdlKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5pbml0VmlldygpO1xyXG4gICAgICAgIHRoaXMuX2Nhck1vZGVsQnJhbmRDb250b2xsZXIuQmluZEV2ZW50cyhjcml0ZXJpYUNoYW5nZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIFVuQmluZEV2ZW50cygpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9jYXJNb2RlbEJyYW5kQ29udG9sbGVyLlVuQmluZEV2ZW50cygpO1xyXG4gICAgfVxyXG59Iiwi77u/aW1wb3J0IHsgSUNyaXRlcmlhLCBDcml0ZXJpYVZhbGlkYXRvciB9IGZyb20gXCIuLi8uLi8uLi8uLi9IZWxwZXIvSUNyaXRlcmlhXCI7XHJcbmltcG9ydCB7IFVzZXJJbnB1dCB9IGZyb20gXCIuLi8uLi8uLi8uLi9IZWxwZXIvVXNlcklucHV0XCI7XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIERlZmF1bHRMZXRNZUtub3dDcml0ZXJpYSBpbXBsZW1lbnRzIElDcml0ZXJpYSB7XHJcbiAgICBGaWxsQ3JpdGVyaWEoc2VhcmNoQWRVc2VySW5wdXQ6IFVzZXJJbnB1dCk6IHZvaWQge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBCaW5kRXZlbnRzKGNyaXRlcmlhQ2hhbmdlOiBPYmplY3QpOiB2b2lkIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgVW5CaW5kRXZlbnRzKCk6IHZvaWQge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBWYWxpZGF0ZUNyaXRlcmlhKCk6IENyaXRlcmlhVmFsaWRhdG9yIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJOb3QgaW1wbGVtZW50ZWRcIik7XHJcbiAgICB9XHJcbn0iLCLvu79pbXBvcnQge0lDcml0ZXJpYUNoYW5nZX0gZnJvbSBcIi4uLy4uLy4uL0hlbHBlci9JQ3JpdGVyaWFDaGFuZ2VcIjtcclxuaW1wb3J0IHtOZXdBZENyaXRlcmlhfSBmcm9tIFwiLi4vLi4vLi4vaG9tZS9uZXdBZC9zcmMvTmV3QWRDcml0ZXJpYVwiO1xyXG5cclxuaW1wb3J0IHtMZXRNZUtub3dDcml0ZXJpYX0gZnJvbSBcIi4vTGV0TWVLbm93Q3JpdGVyaWFcIjtcclxuaW1wb3J0IHtJUmVzdWx0SGFuZGxlcn0gZnJvbSBcIi4uLy4uLy4uL0hlbHBlci9JUmVzdWx0SGFuZGxlclwiO1xyXG5pbXBvcnQge0FqYXhDYWxsZXJ9IGZyb20gXCIuLi8uLi8uLi9IZWxwZXIvQWpheENhbGxlclwiO1xyXG5pbXBvcnQge1VzZXJJbnB1dH0gZnJvbSBcIi4uLy4uLy4uL0hlbHBlci9Vc2VySW5wdXRcIjtcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgTGV0TWVLbm93UGFydGlhbFZpZXdMb2FkZXIgIGltcGxlbWVudHMgSVJlc3VsdEhhbmRsZXIge1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBSZXF1ZXN0SW5kZXhLZXk6IHN0cmluZyA9IFwiUmVxdWVzdEluZGV4XCI7XHJcbiAgICBwcml2YXRlIF9jdXJyZW50UmVxdWVzdEluZGV4OiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBfdXJsOiBzdHJpbmcgPSBcIi9MZXRNZUtub3cvR2V0TGV0TWVLbm93UGFydGlhbFZpZXdcIjtcclxuXHJcbiAgICBwcml2YXRlIF9yZXN1bHRIYW5kbGVyOiBJUmVzdWx0SGFuZGxlcjtcclxuICAgIHByaXZhdGUgX2FqYXhDYWxsZXI6IEFqYXhDYWxsZXI7XHJcblxyXG4gICAgcHJpdmF0ZSBfcGFydGlhbFZpZXdEaXZJZDogc3RyaW5nO1xyXG4gICAgXHJcbiAgICBwcml2YXRlIF9wcmV2aW91c0NhdGVnb3J5SWQ6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIF9jdXJyZW50Q2F0ZWdvcnlJZDogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgX2NyaXRlcmlhQ2hhbmdlOiBJQ3JpdGVyaWFDaGFuZ2U7XHJcbiAgICBwcml2YXRlIF9sZXRNZUtub3dDcml0ZXJpYTogTGV0TWVLbm93Q3JpdGVyaWE7XHJcblxyXG4gICAgY29uc3RydWN0b3IocmVzdWx0SGFuZGxlcjogSVJlc3VsdEhhbmRsZXIsIGNyaXRlcmlhQ2hhbmdlOiBJQ3JpdGVyaWFDaGFuZ2UsIGxldE1lS25vd0NyaXRlcmlhOiBMZXRNZUtub3dDcml0ZXJpYSwgcmVxdWVzdENvZGU6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX3Jlc3VsdEhhbmRsZXIgPSByZXN1bHRIYW5kbGVyO1xyXG4gICAgICAgIHRoaXMuX2FqYXhDYWxsZXIgPSBuZXcgQWpheENhbGxlcih0aGlzLl91cmwsIHRoaXMsIHJlcXVlc3RDb2RlKTtcclxuICAgICAgICB0aGlzLl9jcml0ZXJpYUNoYW5nZSA9IGNyaXRlcmlhQ2hhbmdlO1xyXG4gICAgICAgIHRoaXMuX2xldE1lS25vd0NyaXRlcmlhID0gbGV0TWVLbm93Q3JpdGVyaWE7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBHZXRQYXJ0aWFsVmlld0Zyb21TZXJ2ZXIodXNlcklucHV0OiBVc2VySW5wdXQsIGNhdGVnb3J5SWQ6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX2N1cnJlbnRDYXRlZ29yeUlkID0gY2F0ZWdvcnlJZDtcclxuXHJcbiAgICAgICAgdGhpcy5fY3VycmVudFJlcXVlc3RJbmRleCsrO1xyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLlJlcXVlc3RJbmRleEtleV0gPSB0aGlzLl9jdXJyZW50UmVxdWVzdEluZGV4O1xyXG5cclxuICAgICAgICB0aGlzLl9hamF4Q2FsbGVyLkNhbGwodXNlcklucHV0KTtcclxuICAgICAgICBcclxuICAgIH1cclxuICAgIFxyXG4gICAgT25SZXN1bHQocGFyYW0sIHJlcXVlc3RDb2RlOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICBpZiAocGFyYW0uQ3VzdG9tRGljdGlvbmFyeVt0aGlzLlJlcXVlc3RJbmRleEtleV0gPT0gdGhpcy5fY3VycmVudFJlcXVlc3RJbmRleCkgeyAvL2xhc3QgY2FsbCByZXNwb25zZVxyXG4gICAgICAgICAgICBpZiAocGFyYW0uU3VjY2VzcyA9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9sZXRNZUtub3dDcml0ZXJpYS5VbkJpbmQodGhpcy5fcHJldmlvdXNDYXRlZ29yeUlkKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3Jlc3VsdEhhbmRsZXIuT25SZXN1bHQocGFyYW0uUmVzcG9uc2VEYXRhLCByZXF1ZXN0Q29kZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9sZXRNZUtub3dDcml0ZXJpYS5CaW5kKHRoaXMuX2N1cnJlbnRDYXRlZ29yeUlkLCB0aGlzLl9jcml0ZXJpYUNoYW5nZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9wcmV2aW91c0NhdGVnb3J5SWQgPSB0aGlzLl9jdXJyZW50Q2F0ZWdvcnlJZDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3Jlc3VsdEhhbmRsZXIuT25FcnJvcihwYXJhbS5NZXNzYWdlICsgXCIgLCBcIiArIHBhcmFtLkVycm9yQ29kZSwgcmVxdWVzdENvZGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBPbkVycm9yKG1lc3NhZ2U6IHN0cmluZywgcmVxdWVzdENvZGU6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX3Jlc3VsdEhhbmRsZXIuT25FcnJvcihtZXNzYWdlLCByZXF1ZXN0Q29kZSk7XHJcbiAgICB9XHJcbiAgICBBamF4Q2FsbEZpbmlzaGVkKHJlcXVlc3RDb2RlOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9yZXN1bHRIYW5kbGVyLkFqYXhDYWxsRmluaXNoZWQocmVxdWVzdENvZGUpO1xyXG4gICAgfVxyXG4gICAgQWpheENhbGxTdGFydGVkKHJlcXVlc3RDb2RlOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9yZXN1bHRIYW5kbGVyLkFqYXhDYWxsU3RhcnRlZChyZXF1ZXN0Q29kZSk7XHJcbiAgICB9XHJcbn1cclxuIiwi77u/aW1wb3J0IHtVc2VySW5wdXR9IGZyb20gXCIuLi8uLi8uLi9IZWxwZXIvVXNlcklucHV0XCI7XHJcbmltcG9ydCB7SVJlc3VsdEhhbmRsZXIgfSBmcm9tIFwiLi4vLi4vLi4vSGVscGVyL0lSZXN1bHRIYW5kbGVyXCI7XHJcbmltcG9ydCB7QWpheENhbGxlcn0gZnJvbSBcIi4uLy4uLy4uL0hlbHBlci9BamF4Q2FsbGVyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTGV0TWVLbm93U2VydmVyQ2FsbGVyIGltcGxlbWVudHMgSVJlc3VsdEhhbmRsZXJ7XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBSZXF1ZXN0SW5kZXhLZXk6IHN0cmluZyA9IFwiUmVxdWVzdEluZGV4XCI7XHJcbiAgICBwcml2YXRlIF9jdXJyZW50UmVxdWVzdEluZGV4OiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfdXJsOiBzdHJpbmcgPSBcIi9hcGkvTGV0TWVLbm93QXBpL0FkZE5ld0xldE1lS25vd1JlY29yZFwiO1xyXG5cclxuICAgIHByaXZhdGUgX3Jlc3VsdEhhbmRsZXI6IElSZXN1bHRIYW5kbGVyO1xyXG4gICAgcHJpdmF0ZSBfYWpheENhbGxlcjogQWpheENhbGxlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihyZXN1bHRIYW5kbGVyOklSZXN1bHRIYW5kbGVyLCByZXF1ZXN0Q29kZTpudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9yZXN1bHRIYW5kbGVyID0gcmVzdWx0SGFuZGxlcjtcclxuICAgICAgICB0aGlzLl9hamF4Q2FsbGVyID0gbmV3IEFqYXhDYWxsZXIodGhpcy5fdXJsLCB0aGlzLCByZXF1ZXN0Q29kZSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgXHJcblxyXG5cclxuICAgIHB1YmxpYyBTYXZlQWQodXNlcklucHV0OiBVc2VySW5wdXQpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9jdXJyZW50UmVxdWVzdEluZGV4Kys7XHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuUmVxdWVzdEluZGV4S2V5XSA9IHRoaXMuX2N1cnJlbnRSZXF1ZXN0SW5kZXg7XHJcblxyXG4gICAgICAgIHRoaXMuX2FqYXhDYWxsZXIuQ2FsbCh1c2VySW5wdXQpO1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgXHJcbiAgICBPblJlc3VsdChwYXJhbTogYW55LCByZXF1ZXN0Q29kZTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHBhcmFtLkN1c3RvbURpY3Rpb25hcnlbdGhpcy5SZXF1ZXN0SW5kZXhLZXldID09IHRoaXMuX2N1cnJlbnRSZXF1ZXN0SW5kZXgpIHsgLy9sYXN0IGNhbGwgcmVzcG9uc2VcclxuICAgICAgICAgICAgaWYgKHBhcmFtLlN1Y2Nlc3MgPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVzdWx0SGFuZGxlci5PblJlc3VsdChwYXJhbS5SZXNwb25zZURhdGEscmVxdWVzdENvZGUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVzdWx0SGFuZGxlci5PbkVycm9yKHBhcmFtLk1lc3NhZ2UscmVxdWVzdENvZGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBPbkVycm9yKG1lc3NhZ2U6IHN0cmluZywgcmVxdWVzdENvZGU6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX3Jlc3VsdEhhbmRsZXIuT25FcnJvcihtZXNzYWdlLHJlcXVlc3RDb2RlKTtcclxuICAgIH1cclxuICAgIEFqYXhDYWxsRmluaXNoZWQocmVxdWVzdENvZGU6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX3Jlc3VsdEhhbmRsZXIuQWpheENhbGxGaW5pc2hlZChyZXF1ZXN0Q29kZSk7XHJcbiAgICB9XHJcbiAgICBBamF4Q2FsbFN0YXJ0ZWQocmVxdWVzdENvZGU6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX3Jlc3VsdEhhbmRsZXIuQWpheENhbGxTdGFydGVkKHJlcXVlc3RDb2RlKTtcclxuICAgIH1cclxufSJdfQ==
