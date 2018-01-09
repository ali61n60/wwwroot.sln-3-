(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//TODO merge this class with CategorySelectionNewAd Class
var EventDispatcher_1 = require("../../../Events/EventDispatcher");
var CategorySelection = /** @class */ (function () {
    function CategorySelection(parentDivId, allCategories) {
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
        this.SelectedCategoryChangedEvent = new EventDispatcher_1.EventDispatcher();
        this._parentDivId = parentDivId;
        this._allCategories = allCategories;
    }
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
    }; //GetSelectedCategoryId
    CategorySelection.prototype.removeElement = function (id) {
        $("#" + id).remove();
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
        this._selectedCategoryIdLevelOne = this._rootCategoryId;
        this._allCategories.forEach(function (category) {
            if (category.parentCategoryId === _this._rootCategoryId) {
                categories.push(category);
            } //if
        }); //forEach
        var html = Mustache.to_html(template, data);
        $("#" + this._parentDivId).append(html);
        $("#" + this._firstLevelSelect).change(function (event) {
            var selectedId = parseInt($(event.currentTarget).val().toString());
            _this._selectedCategoryIdLevelOne = selectedId;
            _this.createSecondLevel(selectedId);
            _this.SelectedCategoryChangedEvent.Dispatch(_this, _this.GetSelectedCategoryId());
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
            if (category.parentCategoryId === firstLevelCategoryId) {
                categories.push(category);
            } //if
        }); //forEach
        var html = Mustache.to_html(template, data);
        $("#" + this._parentDivId).append(html);
        $("#" + this._secondLevelSelect).change(function (event) {
            var selectedId = parseInt($(event.currentTarget).val().toString());
            _this._selectedCategoryIdLevelTwo = selectedId;
            _this.createThirdLevel(selectedId);
            _this.SelectedCategoryChangedEvent.Dispatch(_this, _this.GetSelectedCategoryId());
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
            if (category.parentCategoryId === secondLevelCategoryId) {
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
            _this.SelectedCategoryChangedEvent.Dispatch(_this, _this.GetSelectedCategoryId());
        }); //change
    };
    return CategorySelection;
}());
exports.CategorySelection = CategorySelection;
},{"../../../Events/EventDispatcher":3}],2:[function(require,module,exports){
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
        this._allCarModels.forEach(function (carModel, index, array) {
            if (carModel.brandId === brandId)
                carModels.push(carModel);
        });
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
},{"../../../Helper/CriteriaNumericDictionary":4,"./SearchCriteria/AdTransformationSearchCriteria":8,"./SearchCriteria/DefaultSearchCriteria":9}],7:[function(require,module,exports){
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
},{"../../newAd/src/NewAdPartialViewLoader":12}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CarModelBrandController_1 = require("../../../../Components/Transformation/CarModelBrandController");
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
    AdTransformationSearchCriteria.prototype.ValidateCriteria = function () { throw new Error("Not implemented"); };
    AdTransformationSearchCriteria.prototype.initView = function () {
        this._carModelBrandContoller = new CarModelBrandController_1.CarModelBrandController();
    };
    //TODO in orther to minimize bandwidth usage it is good prctice to not send criterias that have default value
    AdTransformationSearchCriteria.prototype.FillCriteria = function (userInput) {
        this._carModelBrandContoller.FillCriteria(userInput);
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
        this._carModelBrandContoller.BindEvents(criteriaChange);
    };
    AdTransformationSearchCriteria.prototype.UnBindEvents = function () {
        this._carModelBrandContoller.UnBindEvents();
    };
    return AdTransformationSearchCriteria;
}());
exports.AdTransformationSearchCriteria = AdTransformationSearchCriteria;
},{"../../../../Components/Transformation/CarModelBrandController":2}],9:[function(require,module,exports){
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
},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//TODO make count optional to user
//TODO instead of adding new ads to the page here call a method on index class to add it by defining an interface in the index class 
var ServerCaller = /** @class */ (function () {
    function ServerCaller() {
        this.StartIndexKey = "StartIndex";
        this._initialStart = 1;
        this._start = 1;
        this.CountKey = "Count";
        this._count = 5;
        this.RequestIndexKey = "RequestIndex";
        this._currentRequestIndex = 0;
        this._initialRequestIndex = 0;
        this.NumberOfItemsKey = "numberOfItems";
        this.CallImageId = "serverCalledImage";
        this._isServerCalled = false;
        this._numberOfStartServerCallNotification = 0;
        this._url = "api/AdApi/GetAdvertisementCommon";
        this._adPlaceHolderDivId = "adPlaceHolder";
    }
    ServerCaller.prototype.GetAdItemsFromServer = function (userInput) {
        var _this = this;
        userInput.ParametersDictionary[this.StartIndexKey] = this._start;
        userInput.ParametersDictionary[this.CountKey] = this._count;
        this._currentRequestIndex++;
        userInput.ParametersDictionary[this.RequestIndexKey] = this._currentRequestIndex;
        $.ajax({
            type: "POST",
            url: this._url,
            data: JSON.stringify(userInput.ParametersDictionary),
            contentType: 'application/json',
            success: function (msg, textStatus, jqXHR) { return _this.onSuccessGetItemsFromServer(msg, textStatus, jqXHR); },
            error: function (jqXHR, textStatus, errorThrown) { return _this.onErrorGetItemsFromServer(jqXHR, textStatus, errorThrown); } // When Service call fails
        }); //.ajax
        this._isServerCalled = true;
        this.notifyUserAjaxCallStarted();
    }; //GetAdItemsFromServer
    ServerCaller.prototype.onSuccessGetItemsFromServer = function (msg, textStatus, jqXHR) {
        //TODO check for undefined or null in msg and msg.customDictionary["RequestIndex"]
        if (this._isServerCalled) {
            if (msg.customDictionary[this.RequestIndexKey] == this._currentRequestIndex) {
                this._isServerCalled = false;
                this.notifyUserAjaxCallFinished();
                if (msg.success == true) {
                    this._start += parseInt(msg.customDictionary[this.NumberOfItemsKey]);
                    var template = $('#singleAdItem').html();
                    var data;
                    for (var i = 0; i < msg.responseData.length; i++) {
                        var adImage = null;
                        if (msg.responseData[i].advertisementImages[0] != null) {
                            adImage = "data:image/jpg;base64," + msg.responseData[i].advertisementImages[0];
                        } //end if
                        data = {
                            AdvertisementId: msg.responseData[i].advertisementId,
                            AdvertisementCategoryId: msg.responseData[i].advertisementCategoryId,
                            AdvertisementCategory: msg.responseData[i].advertisementCategory,
                            adImage: adImage,
                            adPrice: msg.responseData[i].advertisementPrice.price,
                            AdvertisementTitle: msg.responseData[i].advertisementTitle,
                            AdvertisementStatus: msg.responseData[i].advertisementStatus
                            //adDate: msg.ResponseData[i].AdTime
                        }; //end data
                        var html = Mustache.to_html(template, data);
                        $("#" + this._adPlaceHolderDivId).append(html);
                    } //end for
                } //if (msg.success == true)
                else {
                    //TODO show error message to user
                    //showErrorMessage(msg.Message + " , " + msg.ErrorCode);
                }
            } //if (msg.customDictionary["RequestIndex"]
        } //if (this._isServerCalled)
    };
    ServerCaller.prototype.onErrorGetItemsFromServer = function (jqXHR, textStatus, errorThrown) {
        this._isServerCalled = false;
        this.notifyUserAjaxCallFinished();
        //showErrorMessage(textStatus + " , " + errorThrown);
    };
    ServerCaller.prototype.ResetSearchParameters = function () {
        this._start = this._initialStart;
    };
    ServerCaller.prototype.notifyUserAjaxCallStarted = function () {
        console.log("Started Ajax Call");
        $("#" + this.CallImageId).show();
    };
    ServerCaller.prototype.notifyUserAjaxCallFinished = function () {
        console.log("Finished Ajax Call");
        $("#" + this.CallImageId).hide();
    };
    return ServerCaller;
}());
exports.ServerCaller = ServerCaller;
},{}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CategorySelection_1 = require("../../../Components/Category/SearchAd/CategorySelection");
var ServerCaller_1 = require("./ServerCaller");
var SearchCriteriaViewLoader_1 = require("./SearchCriteriaViewLoader");
var SearchCriteria_1 = require("./SearchCriteria");
var UserInput_1 = require("../../../Helper/UserInput");
//TODO when category change before search criteia is loaded a search call is sent to server
//add an event like viewLoadStarted, viewLoadInProgress,viewLoadCompleted and disable search
//durng inProgress end enable it after completed
var Index = /** @class */ (function () {
    function Index(categorySelectorParentDivId, allCategoriesId, getAdFromServerId) {
        this.OrderByKey = "OrderBy";
        this._orderBySelectIdDiv = "orderBy";
        this.MinimumPriceKey = "MinimumPrice";
        this._minPriceInputId = "minPrice";
        this.MaximumPriceKey = "MaximumPrice";
        this._maxPriceInputId = "maxPrice";
        this._categorySelectorParentDivId = categorySelectorParentDivId;
        this._allCategoriesId = allCategoriesId;
        this._getAdFromServerId = getAdFromServerId;
        this._serverCaller = new ServerCaller_1.ServerCaller();
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
        //Add first level categories
        var allCategoriesString = $("#" + this._allCategoriesId).val().toString();
        var allCategories = $.parseJSON(allCategoriesString);
        this._categorySelection = new CategorySelection_1.CategorySelection(this._categorySelectorParentDivId, allCategories);
        this._categorySelection.CreateFirstLevel();
    }; //initCategorySelectionControl
    Index.prototype.initEventHandlers = function () {
        var _this = this;
        this._categorySelection.SelectedCategoryChangedEvent.Subscribe(function (sender, args) {
            _this.searchCriteriaChanged();
            _this._searchCriteriaViewLoader.GetSearchCriteriaViewFromServer(args);
        });
        $("#" + this._orderBySelectIdDiv).on("change", function (event) {
            _this.searchCriteriaChanged();
        });
        //you can also user "input" instead of "change"
        $("#" + this._minPriceInputId).on("input", function (event) {
            _this.searchCriteriaChanged();
        });
        $("#" + this._maxPriceInputId).on("change", function (event) {
            _this.searchCriteriaChanged();
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
            var minPrice = parseInt($("#" + _this._minPriceInputId).val().toString());
            userInput.ParametersDictionary[_this.MinimumPriceKey] = minPrice;
            var maxPrice = parseInt($("#" + _this._maxPriceInputId).val().toString());
            userInput.ParametersDictionary[_this.MaximumPriceKey] = maxPrice;
            var orderBy = $("#" + _this._orderBySelectIdDiv).val().toString();
            userInput.ParametersDictionary[_this.OrderByKey] = orderBy;
            _this._searchCriteria.FillCategorySpecificSearchCriteria(_this._categorySelection.GetSelectedCategoryId(), userInput); //fill category specific search parameters
            _this._serverCaller.GetAdItemsFromServer(userInput);
        }); //click
    }; //initGetAdFromServer
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
var getAdFromServerId = "getAdFromServer";
var allCategoriesId = "allCategories";
$(document).ready(function () {
    var index = new Index(categorySelectorParentDivId, allCategoriesId, getAdFromServerId);
    index.CustomCriteriaChanged(); //to initiate a server call on page load for first time
}); //ready
},{"../../../Components/Category/SearchAd/CategorySelection":1,"../../../Helper/UserInput":5,"./SearchCriteria":6,"./SearchCriteriaViewLoader":7,"./ServerCaller":10}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NewAdPartialViewLoader = /** @class */ (function () {
    function NewAdPartialViewLoader(partialViewDivId, newAdCriteriaChange, newAdCriteria) {
        this._url = "/Home/GetNewAdPartialView";
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
},{}]},{},[11])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3d3dyb290L2pzL0NvbXBvbmVudHMvQ2F0ZWdvcnkvU2VhcmNoQWQvQ2F0ZWdvcnlTZWxlY3Rpb24udHMiLCJ3d3dyb290L2pzL0NvbXBvbmVudHMvVHJhbnNmb3JtYXRpb24vQ2FyTW9kZWxCcmFuZENvbnRyb2xsZXIudHMiLCJ3d3dyb290L2pzL0V2ZW50cy9FdmVudERpc3BhdGNoZXIudHMiLCJ3d3dyb290L2pzL0hlbHBlci9Dcml0ZXJpYU51bWVyaWNEaWN0aW9uYXJ5LnRzIiwid3d3cm9vdC9qcy9IZWxwZXIvVXNlcklucHV0LnRzIiwid3d3cm9vdC9qcy9ob21lL2luZGV4L3NyYy9TZWFyY2hDcml0ZXJpYS50cyIsInd3d3Jvb3QvanMvaG9tZS9pbmRleC9zcmMvU2VhcmNoQ3JpdGVyaWFWaWV3TG9hZGVyLnRzIiwid3d3cm9vdC9qcy9ob21lL2luZGV4L3NyYy9TZWFyY2hDcml0ZXJpYS9BZFRyYW5zZm9ybWF0aW9uU2VhcmNoQ3JpdGVyaWEudHMiLCJ3d3dyb290L2pzL2hvbWUvaW5kZXgvc3JjL1NlYXJjaENyaXRlcmlhL0RlZmF1bHRTZWFyY2hDcml0ZXJpYS50cyIsInd3d3Jvb3QvanMvaG9tZS9pbmRleC9zcmMvU2VydmVyQ2FsbGVyLnRzIiwid3d3cm9vdC9qcy9ob21lL2luZGV4L3NyYy9pbmRleC50cyIsInd3d3Jvb3QvanMvaG9tZS9uZXdBZC9zcmMvTmV3QWRQYXJ0aWFsVmlld0xvYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUMseURBQXlEO0FBQzFELG1FQUFrRTtBQUtsRTtJQTZCSSwyQkFBWSxXQUFtQixFQUFFLGFBQXlCO1FBNUJ6QyxrQkFBYSxHQUFDLFlBQVksQ0FBQztRQVMzQix3QkFBbUIsR0FBRSxtQkFBbUIsQ0FBQztRQUN6QyxtQkFBYyxHQUFDLFdBQVcsQ0FBQztRQUMzQixzQkFBaUIsR0FBVyxTQUFTLENBQUM7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SSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1FBQzdFLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUM7SUFDdkQsQ0FBQyxFQUFBLDRCQUE0QjtJQUVyQiwwREFBeUIsR0FBakMsVUFBa0MsS0FBZ0IsRUFBRSxVQUFrQixFQUFFLFdBQW1CO1FBQ3ZGLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUN2QixDQUFDLEVBQUEsMEJBQTBCO0lBQy9CLDZCQUFDO0FBQUQsQ0F2Q0EsQUF1Q0MsSUFBQTtBQXZDWSx3REFBc0I7QUF5Q25DLG9CQUFvQjtBQUNwQjtJQUFBO0lBRUEsQ0FBQztJQUFELHNDQUFDO0FBQUQsQ0FGQSxBQUVDLElBQUE7QUFGWSwwRUFBK0IiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwi77u/Ly9UT0RPIG1lcmdlIHRoaXMgY2xhc3Mgd2l0aCBDYXRlZ29yeVNlbGVjdGlvbk5ld0FkIENsYXNzXHJcbmltcG9ydCB7IEV2ZW50RGlzcGF0Y2hlciB9IGZyb20gXCIuLi8uLi8uLi9FdmVudHMvRXZlbnREaXNwYXRjaGVyXCI7XHJcbmltcG9ydCB7IENhdGVnb3J5IH0gZnJvbSBcIi4uLy4uLy4uL01vZGVscy9DYXRlZ29yeVwiO1xyXG5pbXBvcnQge1VzZXJJbnB1dH0gZnJvbSBcIi4uLy4uLy4uL0hlbHBlci9Vc2VySW5wdXRcIjtcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgQ2F0ZWdvcnlTZWxlY3Rpb24ge1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBDYXRlZ29yeUlkS2V5PVwiQ2F0ZWdvcnlJZFwiO1xyXG4gICAgSW5zZXJ0Q2F0ZWdvcnlJZEluVXNlcklucHV0RGljdGlvbmFyeSh1c2VySW5wdXQ6IFVzZXJJbnB1dCkge1xyXG4gICAgICAgIGxldCBjYXRlZ29yeUlkID0gdGhpcy5HZXRTZWxlY3RlZENhdGVnb3J5SWQoKTtcclxuICAgICAgICB1c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnlbdGhpcy5DYXRlZ29yeUlkS2V5XSA9IGNhdGVnb3J5SWQ7Ly8xMDAgZm9yIGNhcnNcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9wYXJlbnREaXZJZDogc3RyaW5nOy8vZGl2IGVsZW1lbnQgdGhhdCBob2xkcyBhbGwgQ2F0ZWdvcnlTZWxlY3Rpb24gZWxlbWVudHNcclxuICAgIHByaXZhdGUgX2FsbENhdGVnb3JpZXM6IENhdGVnb3J5W107XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfZmlyc3RMZXZlbFRlbXBsYXRlID1cImNhdGVnb3J5MVRlbXBsYXRlXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9maXJzdExldmVsRGl2PVwiY2F0ZWdvcnkxXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9maXJzdExldmVsU2VsZWN0OiBzdHJpbmcgPSBcInNlbGVjdDFcIjtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9zZWNvbmRMZXZlbFRlbXBsYXRlID0gXCJjYXRlZ29yeTJUZW1wbGF0ZVwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfc2Vjb25kTGV2ZWxEaXYgPSBcImNhdGVnb3J5MlwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfc2Vjb25kTGV2ZWxTZWxlY3Q6IHN0cmluZyA9IFwic2VsZWN0MlwiO1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX3RoaXJkTGV2ZWxUZW1wbGF0ZSA9IFwiY2F0ZWdvcnkzVGVtcGxhdGVcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX3RoaXJkTGV2ZWxEaXYgPSBcImNhdGVnb3J5M1wiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfdGhpcmRMZXZlbFNlbGVjdDogc3RyaW5nID0gXCJzZWxlY3QzXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9yb290Q2F0ZWdvcnlJZDogbnVtYmVyID0gMDtcclxuXHJcbiAgICBwcml2YXRlIF9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbE9uZTogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBfc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUd286IG51bWJlcjtcclxuICAgIHByaXZhdGUgX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVGhyZWU6IG51bWJlcjtcclxuXHJcbiAgICBwdWJsaWMgU2VsZWN0ZWRDYXRlZ29yeUNoYW5nZWRFdmVudDogRXZlbnREaXNwYXRjaGVyPENhdGVnb3J5U2VsZWN0aW9uLCBudW1iZXI+ID0gbmV3IEV2ZW50RGlzcGF0Y2hlcjxDYXRlZ29yeVNlbGVjdGlvbiwgbnVtYmVyPigpO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBhcmVudERpdklkOiBzdHJpbmcsIGFsbENhdGVnb3JpZXM6IENhdGVnb3J5W10pIHtcclxuICAgICAgICB0aGlzLl9wYXJlbnREaXZJZCA9IHBhcmVudERpdklkO1xyXG4gICAgICAgIHRoaXMuX2FsbENhdGVnb3JpZXMgPSBhbGxDYXRlZ29yaWVzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBHZXRTZWxlY3RlZENhdGVnb3J5SWQoKTogbnVtYmVyIHtcclxuICAgICAgICBpZiAodGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUaHJlZSAhPT0gdW5kZWZpbmVkICYmXHJcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVGhyZWUgIT09IHRoaXMuX3Jvb3RDYXRlZ29yeUlkKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUaHJlZTtcclxuICAgICAgICBlbHNlIGlmICh0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFR3byAhPT0gdW5kZWZpbmVkICYmXHJcbiAgICAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUd28gIT09IHRoaXMuX3Jvb3RDYXRlZ29yeUlkKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUd287XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxPbmU7XHJcbiAgICB9Ly9HZXRTZWxlY3RlZENhdGVnb3J5SWRcclxuXHJcbiAgICBwcml2YXRlIHJlbW92ZUVsZW1lbnQoaWQ6IHN0cmluZyk6dm9pZCB7XHJcbiAgICAgICAgJChcIiNcIiArIGlkKS5yZW1vdmUoKTtcclxuICAgIH1cclxuXHJcbiAgIHB1YmxpYyBDcmVhdGVGaXJzdExldmVsKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMucmVtb3ZlRWxlbWVudCh0aGlzLl9maXJzdExldmVsRGl2KTtcclxuICAgICAgICB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbE9uZSA9IHRoaXMuX3Jvb3RDYXRlZ29yeUlkO1xyXG4gICAgICAgIHRoaXMucmVtb3ZlRWxlbWVudCh0aGlzLl9zZWNvbmRMZXZlbERpdik7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUd28gPSB0aGlzLl9yb290Q2F0ZWdvcnlJZDtcclxuICAgICAgICB0aGlzLnJlbW92ZUVsZW1lbnQodGhpcy5fdGhpcmRMZXZlbERpdik7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUaHJlZSA9IHRoaXMuX3Jvb3RDYXRlZ29yeUlkO1xyXG5cclxuICAgICAgICBsZXQgdGVtcGxhdGUgPSAkKFwiI1wiK3RoaXMuX2ZpcnN0TGV2ZWxUZW1wbGF0ZSkuaHRtbCgpO1xyXG4gICAgICAgIGxldCBjYXRlZ29yaWVzOiBDYXRlZ29yeVtdID0gbmV3IEFycmF5PENhdGVnb3J5PigpO1xyXG4gICAgICAgIGxldCBkYXRhID0ge2NhdGVnb3JpZXM6Y2F0ZWdvcmllc31cclxuICAgICAgICB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbE9uZSA9IHRoaXMuX3Jvb3RDYXRlZ29yeUlkO1xyXG4gICAgICAgIHRoaXMuX2FsbENhdGVnb3JpZXMuZm9yRWFjaChjYXRlZ29yeSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChjYXRlZ29yeS5wYXJlbnRDYXRlZ29yeUlkID09PSB0aGlzLl9yb290Q2F0ZWdvcnlJZCkge1xyXG4gICAgICAgICAgICAgICAgY2F0ZWdvcmllcy5wdXNoKGNhdGVnb3J5KTtcclxuICAgICAgICAgICAgfS8vaWZcclxuICAgICAgICB9KTsvL2ZvckVhY2hcclxuXHJcbiAgICAgICAgbGV0IGh0bWwgPSBNdXN0YWNoZS50b19odG1sKHRlbXBsYXRlLCBkYXRhKTtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fcGFyZW50RGl2SWQpLmFwcGVuZChodG1sKTtcclxuXHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX2ZpcnN0TGV2ZWxTZWxlY3QpLmNoYW5nZSgoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgbGV0IHNlbGVjdGVkSWQgPSBwYXJzZUludCgkKGV2ZW50LmN1cnJlbnRUYXJnZXQpLnZhbCgpLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbE9uZSA9IHNlbGVjdGVkSWQ7XHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlU2Vjb25kTGV2ZWwoc2VsZWN0ZWRJZCk7XHJcbiAgICAgICAgICAgIHRoaXMuU2VsZWN0ZWRDYXRlZ29yeUNoYW5nZWRFdmVudC5EaXNwYXRjaCh0aGlzLCB0aGlzLkdldFNlbGVjdGVkQ2F0ZWdvcnlJZCgpKTtcclxuICAgICAgICB9KTsvL2NoYW5nZVxyXG5cclxuICAgIH0vL0NyZWF0ZUZpcnN0TGV2ZWxcclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZVNlY29uZExldmVsKGZpcnN0TGV2ZWxDYXRlZ29yeUlkOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnJlbW92ZUVsZW1lbnQodGhpcy5fc2Vjb25kTGV2ZWxEaXYpO1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVHdvID0gdGhpcy5fcm9vdENhdGVnb3J5SWQ7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVFbGVtZW50KHRoaXMuX3RoaXJkTGV2ZWxEaXYpO1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVGhyZWUgPSB0aGlzLl9yb290Q2F0ZWdvcnlJZDtcclxuICAgICAgICBpZiAoZmlyc3RMZXZlbENhdGVnb3J5SWQgPT09IHRoaXMuX3Jvb3RDYXRlZ29yeUlkKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCB0ZW1wbGF0ZSA9ICQoXCIjXCIgKyB0aGlzLl9zZWNvbmRMZXZlbFRlbXBsYXRlKS5odG1sKCk7XHJcbiAgICAgICAgbGV0IGNhdGVnb3JpZXM6IENhdGVnb3J5W10gPSBuZXcgQXJyYXk8Q2F0ZWdvcnk+KCk7XHJcbiAgICAgICAgbGV0IGRhdGEgPSB7IGNhdGVnb3JpZXM6IGNhdGVnb3JpZXMgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuX2FsbENhdGVnb3JpZXMuZm9yRWFjaChjYXRlZ29yeSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChjYXRlZ29yeS5wYXJlbnRDYXRlZ29yeUlkID09PSBmaXJzdExldmVsQ2F0ZWdvcnlJZCkge1xyXG4gICAgICAgICAgICAgICAgY2F0ZWdvcmllcy5wdXNoKGNhdGVnb3J5KTtcclxuICAgICAgICAgICAgfS8vaWZcclxuICAgICAgICB9KTsvL2ZvckVhY2hcclxuXHJcbiAgICAgICAgbGV0IGh0bWwgPSBNdXN0YWNoZS50b19odG1sKHRlbXBsYXRlLCBkYXRhKTtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fcGFyZW50RGl2SWQpLmFwcGVuZChodG1sKTtcclxuXHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX3NlY29uZExldmVsU2VsZWN0KS5jaGFuZ2UoKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBzZWxlY3RlZElkID0gcGFyc2VJbnQoJChldmVudC5jdXJyZW50VGFyZ2V0KS52YWwoKS50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUd28gPSBzZWxlY3RlZElkO1xyXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVRoaXJkTGV2ZWwoc2VsZWN0ZWRJZCk7XHJcbiAgICAgICAgICAgIHRoaXMuU2VsZWN0ZWRDYXRlZ29yeUNoYW5nZWRFdmVudC5EaXNwYXRjaCh0aGlzLCB0aGlzLkdldFNlbGVjdGVkQ2F0ZWdvcnlJZCgpKTtcclxuICAgICAgICB9KTsvL2NoYW5nZVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlVGhpcmRMZXZlbChzZWNvbmRMZXZlbENhdGVnb3J5SWQ6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMucmVtb3ZlRWxlbWVudCh0aGlzLl90aGlyZExldmVsRGl2KTtcclxuICAgICAgICB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFRocmVlID0gdGhpcy5fcm9vdENhdGVnb3J5SWQ7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKHNlY29uZExldmVsQ2F0ZWdvcnlJZCA9PT0gdGhpcy5fcm9vdENhdGVnb3J5SWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHRlbXBsYXRlID0gJChcIiNcIiArIHRoaXMuX3RoaXJkTGV2ZWxUZW1wbGF0ZSkuaHRtbCgpO1xyXG4gICAgICAgIGxldCBjYXRlZ29yaWVzOiBDYXRlZ29yeVtdID0gbmV3IEFycmF5PENhdGVnb3J5PigpO1xyXG4gICAgICAgIGxldCBkYXRhID0geyBjYXRlZ29yaWVzOiBjYXRlZ29yaWVzIH1cclxuXHJcbiAgICAgICAgdGhpcy5fYWxsQ2F0ZWdvcmllcy5mb3JFYWNoKGNhdGVnb3J5ID0+IHtcclxuICAgICAgICAgICAgaWYgKGNhdGVnb3J5LnBhcmVudENhdGVnb3J5SWQgPT09IHNlY29uZExldmVsQ2F0ZWdvcnlJZCkge1xyXG4gICAgICAgICAgICAgICAgY2F0ZWdvcmllcy5wdXNoKGNhdGVnb3J5KTtcclxuICAgICAgICAgICAgfS8vaWZcclxuICAgICAgICB9KTsvL2ZvckVhY2hcclxuICAgICAgICBpZiAoY2F0ZWdvcmllcy5sZW5ndGggPT09IDApIHsvL05vIEl0bWUgaW4gdGhpcmQgbGV2ZWwgY2F0ZWdvcnlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgaHRtbCA9IE11c3RhY2hlLnRvX2h0bWwodGVtcGxhdGUsIGRhdGEpO1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9wYXJlbnREaXZJZCkuYXBwZW5kKGh0bWwpO1xyXG5cclxuICAgICAgICQoXCIjXCIgKyB0aGlzLl90aGlyZExldmVsU2VsZWN0KS5jaGFuZ2UoKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVGhyZWUgPSBwYXJzZUludCgkKGV2ZW50LmN1cnJlbnRUYXJnZXQpLnZhbCgpLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICB0aGlzLlNlbGVjdGVkQ2F0ZWdvcnlDaGFuZ2VkRXZlbnQuRGlzcGF0Y2godGhpcywgdGhpcy5HZXRTZWxlY3RlZENhdGVnb3J5SWQoKSk7XHJcbiAgICAgICAgfSk7Ly9jaGFuZ2VcclxuICAgIH1cclxufVxyXG5cclxuIiwi77u/aW1wb3J0IHtDYXJNb2RlbH0gZnJvbSBcIi4uLy4uL01vZGVscy9BZFRyYW5zcG9ydGF0aW9uL0Nhck1vZGVsXCI7XHJcbmltcG9ydCB7VXNlcklucHV0fSBmcm9tIFwiLi4vLi4vSGVscGVyL1VzZXJJbnB1dFwiO1xyXG5pbXBvcnQge0lDcml0ZXJpYSxDcml0ZXJpYVZhbGlkYXRvcn0gZnJvbSBcIi4uLy4uL0hlbHBlci9JQ3JpdGVyaWFcIjtcclxuXHJcbmltcG9ydCB7SUNyaXRlcmlhQ2hhbmdlfSBmcm9tIFwiLi4vLi4vSGVscGVyL0lDcml0ZXJpYUNoYW5nZVwiO1xyXG5cclxuXHJcblxyXG5leHBvcnQgY2xhc3MgQ2FyTW9kZWxCcmFuZENvbnRyb2xsZXIgaW1wbGVtZW50cyBJQ3JpdGVyaWEge1xyXG4gICAgVmFsaWRhdGVDcml0ZXJpYSgpOiBDcml0ZXJpYVZhbGlkYXRvciB7IHRocm93IG5ldyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZFwiKTsgfVxyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgQ2FyQnJhbmRJZEtleTogc3RyaW5nID0gXCJCcmFuZElkXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IEJyYW5kU2VsZWN0SWQ6IHN0cmluZyA9IFwiYnJhbmRcIjtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IENhck1vZGVsVGVtcGxhdGVJZDogc3RyaW5nID0gXCJtb2RlbFRlbXBsYXRlXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IENhck1vZGVsRGl2UGxhY2VIb2xkZXJJZDogc3RyaW5nID0gXCJtb2RlbFBsYWNlSG9sZGVyXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IENhck1vZGVsSWRLZXk6IHN0cmluZyA9IFwiQ2FyTW9kZWxJZFwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBBbGxDYXJNb2RlbHNJbnB1dElkOiBzdHJpbmcgPSBcImFsbENhck1vZGVsc1wiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBNb2RlbFNlbGVjdElkOiBzdHJpbmcgPSBcIm1vZGVsXCI7XHJcbiAgICBwcml2YXRlIF9hbGxDYXJNb2RlbHM6IENhck1vZGVsW107XHJcblxyXG4gICAgcHJpdmF0ZSBfc2VhcmNoQ3JpdGVyaWFDaGFuZ2U6SUNyaXRlcmlhQ2hhbmdlO1xyXG5cclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmluaXRWaWV3KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbml0VmlldygpOiB2b2lkIHtcclxuICAgICAgICBsZXQgYWxsQ2FyTW9kZWxzU3RyaW5nID0gJChcIiNcIiArIHRoaXMuQWxsQ2FyTW9kZWxzSW5wdXRJZCkudmFsKCkudG9TdHJpbmcoKTtcclxuICAgICAgICB0aGlzLl9hbGxDYXJNb2RlbHMgPSAkLnBhcnNlSlNPTihhbGxDYXJNb2RlbHNTdHJpbmcpIGFzIENhck1vZGVsW107XHJcbiAgICAgICAgdGhpcy5pbml0Q2FyTW9kZWwoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXRDYXJNb2RlbCgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmNyZWF0ZUNhck1vZGVsRWxlbWVudChuZXcgQXJyYXk8Q2FyTW9kZWw+KCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlQ2FyTW9kZWxFbGVtZW50KGNhck1vZGVsczogQ2FyTW9kZWxbXSkge1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLkNhck1vZGVsRGl2UGxhY2VIb2xkZXJJZCkuY2hpbGRyZW4oKS5yZW1vdmUoKTtcclxuICAgICAgICBsZXQgdGVtcGxhdGUgPSAkKFwiI1wiICsgdGhpcy5DYXJNb2RlbFRlbXBsYXRlSWQpLmh0bWwoKTtcclxuICAgICAgICBsZXQgZGF0YSA9IHsgY2FyTW9kZWxzOiBjYXJNb2RlbHMgfVxyXG4gICAgICAgIGxldCBodG1sID0gTXVzdGFjaGUudG9faHRtbCh0ZW1wbGF0ZSwgZGF0YSk7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuQ2FyTW9kZWxEaXZQbGFjZUhvbGRlcklkKS5hcHBlbmQoaHRtbCk7XHJcbiAgICAgICAgdGhpcy5iaW5kQ2FyTW9kZWwoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGJpbmRDYXJNb2RlbCgpOiB2b2lkIHtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5Nb2RlbFNlbGVjdElkKS5vbihcImNoYW5nZVwiLFxyXG4gICAgICAgICAgICAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NlYXJjaENyaXRlcmlhQ2hhbmdlLkN1c3RvbUNyaXRlcmlhQ2hhbmdlZCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZUNhck1vZGVsU2VsZWN0KGJyYW5kSWQ6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIGxldCBjYXJNb2RlbHMgPSBuZXcgQXJyYXk8Q2FyTW9kZWw+KCk7XHJcbiAgICAgICAgdGhpcy5fYWxsQ2FyTW9kZWxzLmZvckVhY2goKGNhck1vZGVsLCBpbmRleCwgYXJyYXkpID0+IHtcclxuICAgICAgICAgICAgaWYgKGNhck1vZGVsLmJyYW5kSWQgPT09IGJyYW5kSWQpXHJcbiAgICAgICAgICAgICAgICBjYXJNb2RlbHMucHVzaChjYXJNb2RlbCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVDYXJNb2RlbEVsZW1lbnQoY2FyTW9kZWxzKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgcHVibGljIEZpbGxDcml0ZXJpYSh1c2VySW5wdXQ6VXNlcklucHV0KTp2b2lkIHtcclxuICAgICAgICB1c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnlbdGhpcy5DYXJCcmFuZElkS2V5XSA9XHJcbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLkJyYW5kU2VsZWN0SWQpLmZpbmQoXCJvcHRpb246c2VsZWN0ZWRcIikudmFsKCk7Ly9icmFuZElkXHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuQ2FyTW9kZWxJZEtleV0gPVxyXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5Nb2RlbFNlbGVjdElkKS5maW5kKFwib3B0aW9uOnNlbGVjdGVkXCIpLnZhbCgpOy8vY2FyTW9kZWxJZFxyXG4gICAgfVxyXG5cclxuICAgIEJpbmRFdmVudHMoY3JpdGVyaWFDaGFuZ2U6IElDcml0ZXJpYUNoYW5nZSk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX3NlYXJjaENyaXRlcmlhQ2hhbmdlID0gY3JpdGVyaWFDaGFuZ2U7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuQnJhbmRTZWxlY3RJZCkub24oXCJjaGFuZ2VcIiwgKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBzZWxlY3RlZEJyYW5kSWQ6IG51bWJlciA9IHBhcnNlSW50KCQoZXZlbnQuY3VycmVudFRhcmdldCkuZmluZChcIm9wdGlvbjpzZWxlY3RlZFwiKS52YWwoKS50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVDYXJNb2RlbFNlbGVjdChzZWxlY3RlZEJyYW5kSWQpO1xyXG4gICAgICAgICAgICBjcml0ZXJpYUNoYW5nZS5DdXN0b21Dcml0ZXJpYUNoYW5nZWQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5iaW5kQ2FyTW9kZWwoKTtcclxuICAgIH1cclxuXHJcbiAgICBVbkJpbmRFdmVudHMoKTogdm9pZCB7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuQnJhbmRTZWxlY3RJZCkub2ZmKFwiY2hhbmdlXCIpO1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLk1vZGVsU2VsZWN0SWQpLm9mZihcImNoYW5nZVwiKTtcclxuICAgIH1cclxufSIsIu+7v2ltcG9ydCB7SUV2ZW50fSAgZnJvbSBcIi4vSUV2ZW50XCI7XHJcblxyXG5cclxuLyogVGhlIGRpc3BhdGNoZXIgaGFuZGxlcyB0aGUgc3RvcmFnZSBvZiBzdWJzY2lwdGlvbnMgYW5kIGZhY2lsaXRhdGVzXHJcbiAgc3Vic2NyaXB0aW9uLCB1bnN1YnNjcmlwdGlvbiBhbmQgZGlzcGF0Y2hpbmcgb2YgdGhlIGV2ZW50ICovXHJcbmV4cG9ydCAgY2xhc3MgRXZlbnREaXNwYXRjaGVyPFRTZW5kZXIsIFRBcmdzPiBpbXBsZW1lbnRzIElFdmVudDxUU2VuZGVyLCBUQXJncz4ge1xyXG5cclxuICAgIHByaXZhdGUgX3N1YnNjcmlwdGlvbnM6IEFycmF5PChzZW5kZXI6IFRTZW5kZXIsIGFyZ3M6IFRBcmdzKSA9PiB2b2lkPiA9IG5ldyBBcnJheTwoc2VuZGVyOiBUU2VuZGVyLCBhcmdzOiBUQXJncykgPT4gdm9pZD4oKTtcclxuXHJcbiAgICBwdWJsaWMgU3Vic2NyaWJlKGZuOiAoc2VuZGVyOiBUU2VuZGVyLCBhcmdzOiBUQXJncykgPT4gdm9pZCk6IHZvaWQge1xyXG4gICAgICAgIGlmIChmbikge1xyXG4gICAgICAgICAgICB0aGlzLl9zdWJzY3JpcHRpb25zLnB1c2goZm4pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgIFVuc3Vic2NyaWJlKGZuOiAoc2VuZGVyOiBUU2VuZGVyLCBhcmdzOiBUQXJncykgPT4gdm9pZCk6IHZvaWQge1xyXG4gICAgICAgIGxldCBpID0gdGhpcy5fc3Vic2NyaXB0aW9ucy5pbmRleE9mKGZuKTtcclxuICAgICAgICBpZiAoaSA+IC0xKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMuc3BsaWNlKGksIDEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgIERpc3BhdGNoKHNlbmRlcjogVFNlbmRlciwgYXJnczogVEFyZ3MpOiB2b2lkIHtcclxuICAgICAgICBmb3IgKGxldCBoYW5kbGVyIG9mIHRoaXMuX3N1YnNjcmlwdGlvbnMpIHtcclxuICAgICAgICAgICAgaGFuZGxlcihzZW5kZXIsIGFyZ3MpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIu+7v2ltcG9ydCB7IElDcml0ZXJpYX0gZnJvbSBcIi4vSUNyaXRlcmlhXCI7XHJcbmltcG9ydCB7IE51bWVyaWNEaWN0aW9uYXJ5IH0gZnJvbSBcImxvZGFzaC9pbmRleFwiO1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBDcml0ZXJpYU51bWVyaWNEaWN0aW9uYXJ5IGltcGxlbWVudHMgTnVtZXJpY0RpY3Rpb25hcnk8SUNyaXRlcmlhPiB7XHJcbiAgICBbaW5kZXg6IG51bWJlcl06IElDcml0ZXJpYTtcclxufSIsIu+7v2ludGVyZmFjZSBMb29zZU9iamVjdCB7XHJcbiAgICBba2V5OiBzdHJpbmddOiBhbnlcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFVzZXJJbnB1dCB7XHJcbiAgICBwdWJsaWMgUGFyYW1ldGVyc0RpY3Rpb25hcnk6IExvb3NlT2JqZWN0ID0ge307XHJcbn1cclxuXHJcblxyXG5cclxuIiwi77u/aW1wb3J0IHtBZFRyYW5zZm9ybWF0aW9uU2VhcmNoQ3JpdGVyaWF9IGZyb20gXCIuL1NlYXJjaENyaXRlcmlhL0FkVHJhbnNmb3JtYXRpb25TZWFyY2hDcml0ZXJpYVwiO1xyXG5pbXBvcnQge0RlZmF1bHRTZWFyY2hDcml0ZXJpYX0gZnJvbSBcIi4vU2VhcmNoQ3JpdGVyaWEvRGVmYXVsdFNlYXJjaENyaXRlcmlhXCI7XHJcbmltcG9ydCB7SUNyaXRlcmlhfSBmcm9tIFwiLi4vLi4vLi4vSGVscGVyL0lDcml0ZXJpYVwiO1xyXG5pbXBvcnQge1VzZXJJbnB1dH0gZnJvbSBcIi4uLy4uLy4uL0hlbHBlci9Vc2VySW5wdXRcIjtcclxuaW1wb3J0IHtJQ3JpdGVyaWFDaGFuZ2V9IGZyb20gXCIuLi8uLi8uLi9IZWxwZXIvSUNyaXRlcmlhQ2hhbmdlXCI7XHJcbmltcG9ydCB7Q3JpdGVyaWFOdW1lcmljRGljdGlvbmFyeX0gZnJvbSBcIi4uLy4uLy4uL0hlbHBlci9Dcml0ZXJpYU51bWVyaWNEaWN0aW9uYXJ5XCI7XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIFNlYXJjaENyaXRlcmlhIHtcclxuICAgIHByaXZhdGUgX3NlYXJjaENyaXRlcmlhSW9jQ29udGFpbmVyOiBDcml0ZXJpYU51bWVyaWNEaWN0aW9uYXJ5IDtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuX3NlYXJjaENyaXRlcmlhSW9jQ29udGFpbmVyID0gbmV3IENyaXRlcmlhTnVtZXJpY0RpY3Rpb25hcnkoKTtcclxuICAgICAgICB0aGlzLmluaXRTZWFyY2hDcml0ZXJpYUlvY0NvbnRhaW5lcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaW5pdFNlYXJjaENyaXRlcmlhSW9jQ29udGFpbmVyKCkge1xyXG4gICAgICAgIHRoaXMuX3NlYXJjaENyaXRlcmlhSW9jQ29udGFpbmVyWzBdID0gbmV3IERlZmF1bHRTZWFyY2hDcml0ZXJpYSgpO1xyXG4gICAgICAgIHRoaXMuX3NlYXJjaENyaXRlcmlhSW9jQ29udGFpbmVyWzEwMF0gPSBuZXcgQWRUcmFuc2Zvcm1hdGlvblNlYXJjaENyaXRlcmlhKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIEZpbGxDYXRlZ29yeVNwZWNpZmljU2VhcmNoQ3JpdGVyaWEoY2F0ZWdvcnlJZDogbnVtYmVyLCB1c2VySW5wdXQ6IFVzZXJJbnB1dCk6IHZvaWQge1xyXG4gICAgICAgIGxldCBzZWFyY2hDcml0ZXJpYSA9IHRoaXMucG9seW1vcnBoaWNEaXNwYXRjaFNlYXJjaENyaXRlcmlhKGNhdGVnb3J5SWQpO1xyXG4gICAgICAgIHNlYXJjaENyaXRlcmlhLkZpbGxDcml0ZXJpYSh1c2VySW5wdXQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBCaW5kKGNhdGVnb3J5SWQ6IG51bWJlciwgc2VhcmNoQ3JpdGVyaWFDaGFuZ2U6IElDcml0ZXJpYUNoYW5nZSkge1xyXG4gICAgICAgIGxldCBzZWFyY2hDcml0ZXJpYSA9IHRoaXMucG9seW1vcnBoaWNEaXNwYXRjaFNlYXJjaENyaXRlcmlhKGNhdGVnb3J5SWQpO1xyXG4gICAgICAgIHNlYXJjaENyaXRlcmlhLkJpbmRFdmVudHMoc2VhcmNoQ3JpdGVyaWFDaGFuZ2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBVbkJpbmQoY2F0ZWdvcnlJZDpudW1iZXIpIHtcclxuICAgICAgICBsZXQgc2VhcmNoQ3JpdGVyaWEgPSB0aGlzLnBvbHltb3JwaGljRGlzcGF0Y2hTZWFyY2hDcml0ZXJpYShjYXRlZ29yeUlkKTtcclxuICAgICAgICBzZWFyY2hDcml0ZXJpYS5VbkJpbmRFdmVudHMoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHBvbHltb3JwaGljRGlzcGF0Y2hTZWFyY2hDcml0ZXJpYShjYXRlZ29yeUlkOm51bWJlcik6IElDcml0ZXJpYSB7XHJcbiAgICAgICAgbGV0IHJldHVyblZhbHVlOiBJQ3JpdGVyaWEgPSB0aGlzLl9zZWFyY2hDcml0ZXJpYUlvY0NvbnRhaW5lcltjYXRlZ29yeUlkXTtcclxuICAgICAgICBpZiAocmV0dXJuVmFsdWU9PT11bmRlZmluZWQgfHwgcmV0dXJuVmFsdWU9PT1udWxsKSB7XHJcbiAgICAgICAgICAgIHJldHVyblZhbHVlID0gdGhpcy5fc2VhcmNoQ3JpdGVyaWFJb2NDb250YWluZXJbMF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXR1cm5WYWx1ZTtcclxuICAgIH1cclxufSIsIu+7v2ltcG9ydCB7IFBhcnRpYWxWaWV3U2VydmVyQ2FsbFBhcmFtZXRlcnMgfSBmcm9tIFwiLi4vLi4vbmV3QWQvc3JjL05ld0FkUGFydGlhbFZpZXdMb2FkZXJcIjtcclxuaW1wb3J0IHtJQ3JpdGVyaWFDaGFuZ2UgfSBmcm9tIFwiLi4vLi4vLi4vSGVscGVyL0lDcml0ZXJpYUNoYW5nZVwiO1xyXG5pbXBvcnQge1NlYXJjaENyaXRlcmlhfSBmcm9tIFwiLi9TZWFyY2hDcml0ZXJpYVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNlYXJjaENyaXRlcmlhVmlld0xvYWRlciB7XHJcbiAgICBwcml2YXRlIF9wYXJlbnREaXZJZDogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBfc2VhcmNoQ3JpdGVyaWFDaGFuZ2U6IElDcml0ZXJpYUNoYW5nZTtcclxuICAgIHByaXZhdGUgX3VybDogc3RyaW5nID0gXCIvSG9tZS9HZXRTZWFyY2hDcml0ZXJpYVZpZXdcIjtcclxuICAgIHByaXZhdGUgX3ByZXZpb3VzQ2F0ZWdvcnlJZDpudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBfY3VycmVudENhdGVnb3J5SWQ6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIF9zZWFyY2hDcml0ZXJpYTpTZWFyY2hDcml0ZXJpYTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwYXJlbnREaXZJZDogc3RyaW5nLCBzZWFyY2hDcml0ZXJpYUNoYW5nZTogSUNyaXRlcmlhQ2hhbmdlLHNlYXJjaENyaXRlcmlhOlNlYXJjaENyaXRlcmlhKSB7XHJcbiAgICAgICAgdGhpcy5fcGFyZW50RGl2SWQgPSBwYXJlbnREaXZJZDtcclxuICAgICAgICB0aGlzLl9zZWFyY2hDcml0ZXJpYUNoYW5nZSA9IHNlYXJjaENyaXRlcmlhQ2hhbmdlO1xyXG4gICAgICAgIHRoaXMuX3NlYXJjaENyaXRlcmlhID0gc2VhcmNoQ3JpdGVyaWE7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIEdldFNlYXJjaENyaXRlcmlhVmlld0Zyb21TZXJ2ZXIoY2F0ZWdvcnlJZDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fY3VycmVudENhdGVnb3J5SWQgPSBjYXRlZ29yeUlkO1xyXG4gICAgICAgIGxldCBjYWxsUGFyYW1zID0gbmV3IFBhcnRpYWxWaWV3U2VydmVyQ2FsbFBhcmFtZXRlcnMoKTtcclxuICAgICAgICBjYWxsUGFyYW1zLkNhdGVnb3J5SWQgPSBjYXRlZ29yeUlkO1xyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6IFwiR0VUXCIsIC8vR0VUIG9yIFBPU1Qgb3IgUFVUIG9yIERFTEVURSB2ZXJiXHJcbiAgICAgICAgICAgIHVybDogdGhpcy5fdXJsLFxyXG4gICAgICAgICAgICBkYXRhOiBjYWxsUGFyYW1zLCAvL0RhdGEgc2VudCB0byBzZXJ2ZXJcclxuICAgICAgICAgICAgLy9jb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLCAvLyBjb250ZW50IHR5cGUgc2VudCB0byBzZXJ2ZXJcclxuICAgICAgICAgICAgc3VjY2VzczogKG1zZywgdGV4dFN0YXR1cywganFYSFIpID0+IHRoaXMub25TdWNjZXNzR2V0SXRlbXNGcm9tU2VydmVyKG1zZywgdGV4dFN0YXR1cywganFYSFIpLC8vT24gU3VjY2Vzc2Z1bGwgc2VydmljZSBjYWxsXHJcbiAgICAgICAgICAgIGVycm9yOiAoanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKSA9PiB0aGlzLm9uRXJyb3JHZXRJdGVtc0Zyb21TZXJ2ZXIoanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKS8vIFdoZW4gU2VydmljZSBjYWxsIGZhaWxzXHJcbiAgICAgICAgfSk7Ly8uYWpheFxyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gICAgcHJpdmF0ZSBvblN1Y2Nlc3NHZXRJdGVtc0Zyb21TZXJ2ZXIobXNnOiBhbnksIHRleHRTdGF0dXM6IHN0cmluZywganFYSFI6IEpRdWVyeVhIUikge1xyXG4gICAgICAgIHRoaXMuX3NlYXJjaENyaXRlcmlhLlVuQmluZCh0aGlzLl9wcmV2aW91c0NhdGVnb3J5SWQpO1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9wYXJlbnREaXZJZCkuY2hpbGRyZW4oKS5yZW1vdmUoKTtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fcGFyZW50RGl2SWQpLmh0bWwobXNnKTtcclxuICAgICAgICB0aGlzLl9zZWFyY2hDcml0ZXJpYS5CaW5kKHRoaXMuX2N1cnJlbnRDYXRlZ29yeUlkLCB0aGlzLl9zZWFyY2hDcml0ZXJpYUNoYW5nZSk7XHJcbiAgICAgICAgdGhpcy5fcHJldmlvdXNDYXRlZ29yeUlkID0gdGhpcy5fY3VycmVudENhdGVnb3J5SWQ7XHJcbiAgICB9Ly9vblN1Y2Nlc3NHZXRUaW1lRnJvbVNlcnZlclxyXG5cclxuICAgIHByaXZhdGUgb25FcnJvckdldEl0ZW1zRnJvbVNlcnZlcihqcVhIUjogSlF1ZXJ5WEhSLCB0ZXh0U3RhdHVzOiBzdHJpbmcsIGVycm9yVGhyb3duOiBzdHJpbmcpIHtcclxuICAgICAgICBhbGVydChlcnJvclRocm93bik7XHJcbiAgICB9Ly9vbkVycm9yR2V0VGltZUZyb21TZXJ2ZXJcclxuXHJcbiAgICBcclxuICAgIFxyXG59Iiwi77u/aW1wb3J0IHsgVXNlcklucHV0IH0gZnJvbSBcIi4uLy4uLy4uLy4uL0hlbHBlci9Vc2VySW5wdXRcIjtcclxuaW1wb3J0IHsgSUNyaXRlcmlhQ2hhbmdlIH0gZnJvbSBcIi4uLy4uLy4uLy4uL0hlbHBlci9JQ3JpdGVyaWFDaGFuZ2VcIjtcclxuaW1wb3J0IHsgSUNyaXRlcmlhLCBDcml0ZXJpYVZhbGlkYXRvciB9IGZyb20gXCIuLi8uLi8uLi8uLi9IZWxwZXIvSUNyaXRlcmlhXCI7XHJcbmltcG9ydCB7IENhck1vZGVsQnJhbmRDb250cm9sbGVyIH0gZnJvbSBcIi4uLy4uLy4uLy4uL0NvbXBvbmVudHMvVHJhbnNmb3JtYXRpb24vQ2FyTW9kZWxCcmFuZENvbnRyb2xsZXJcIjtcclxuXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIEFkVHJhbnNmb3JtYXRpb25TZWFyY2hDcml0ZXJpYSBpbXBsZW1lbnRzIElDcml0ZXJpYSB7XHJcbiAgICBWYWxpZGF0ZUNyaXRlcmlhKCk6IENyaXRlcmlhVmFsaWRhdG9yIHsgdGhyb3cgbmV3IEVycm9yKFwiTm90IGltcGxlbWVudGVkXCIpOyB9XHJcblxyXG4gICAgcHJpdmF0ZSBfY2FyTW9kZWxCcmFuZENvbnRvbGxlcjogQ2FyTW9kZWxCcmFuZENvbnRyb2xsZXI7XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBNYWtlWWVhckZyb21LZXk6IHN0cmluZyA9IFwiTWFrZVllYXJGcm9tXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IE1ha2VZZWFyRnJvbUlucHV0SWQ6IHN0cmluZyA9IFwiZnJvbVllYXJcIjtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IE1ha2VZZWFyVG9LZXk6IHN0cmluZyA9IFwiTWFrZVllYXJUb1wiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBNYWtlWWVhclRvSW5wdXRJZDogc3RyaW5nID0gXCJ0b1llYXJcIjtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IEZ1ZWxLZXkgPSBcIkZ1ZWxcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgRnVlbFNlbGVjdElkOiBzdHJpbmcgPSBcImZ1ZWxcIjtcclxuXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgTWlsZWFnZUZyb21LZXk6IHN0cmluZyA9IFwiTWlsZWFnZUZyb21cIjtcclxuICAgIHB1YmxpYyByZWFkb25seSBNaWxlYWdlRnJvbUlucHV0SWQ6IHN0cmluZyA9IFwibWlsZWFnZUZyb21cIjtcclxuXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgTWlsZWFnZVRvS2V5OiBzdHJpbmcgPSBcIk1pbGVhZ2VUb1wiO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IE1pbGVhZ2VUb0lucHV0SWQ6IHN0cmluZyA9IFwibWlsZWFnZVRvXCI7XHJcblxyXG4gICAgcHVibGljIHJlYWRvbmx5IEdlYXJib3hLZXk6IHN0cmluZyA9IFwiR2VhcmJveFwiO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IEdlYXJib3hUeXBlU2VsZWN0SWQ6IHN0cmluZyA9IFwiZ2VhcmJveFR5cGVcIjtcclxuXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgQm9keUNvbG9yS2V5OiBzdHJpbmcgPSBcIkJvZHlDb2xvclwiO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IEJvZHlDb2xvclNlbGVjdElkOiBzdHJpbmcgPSBcImJvZHlDb2xvclwiO1xyXG5cclxuICAgIHB1YmxpYyByZWFkb25seSBJbnRlcm5hbENvbG9yS2V5OiBzdHJpbmcgPSBcIkludGVybmFsQ29sb3JcIjtcclxuICAgIHB1YmxpYyByZWFkb25seSBJbnRlcm5hbENvbG9yU2VsZWN0SWQgPSBcImludGVybmFsQ29sb3JcIjtcclxuXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgQm9keVN0YXR1c0tleTogc3RyaW5nID0gXCJCb2R5U3RhdHVzXCI7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgQm9keVN0YXR1c1NlbGVjdElkOiBzdHJpbmcgPSBcImJvZHlTdGF0dXNcIjtcclxuXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgQ2FyU3RhdHVzS2V5OiBzdHJpbmcgPSBcIkNhclN0YXR1c1wiO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IENhclN0YXR1c1NlbGVjdElkOiBzdHJpbmcgPSBcImNhclN0YXR1c1wiO1xyXG5cclxuICAgIHB1YmxpYyByZWFkb25seSBQbGF0ZVR5cGVLZXk6IHN0cmluZyA9IFwiUGxhdGVUeXBlXCI7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgUGxhdGVUeXBlU2VsZWN0SWQ6IHN0cmluZyA9IFwicGxhdGVUeXBlXCI7XHJcblxyXG4gICAgcHJpdmF0ZSBpbml0VmlldygpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9jYXJNb2RlbEJyYW5kQ29udG9sbGVyID0gbmV3IENhck1vZGVsQnJhbmRDb250cm9sbGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy9UT0RPIGluIG9ydGhlciB0byBtaW5pbWl6ZSBiYW5kd2lkdGggdXNhZ2UgaXQgaXMgZ29vZCBwcmN0aWNlIHRvIG5vdCBzZW5kIGNyaXRlcmlhcyB0aGF0IGhhdmUgZGVmYXVsdCB2YWx1ZVxyXG4gICAgcHVibGljIEZpbGxDcml0ZXJpYSh1c2VySW5wdXQ6IFVzZXJJbnB1dCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX2Nhck1vZGVsQnJhbmRDb250b2xsZXIuRmlsbENyaXRlcmlhKHVzZXJJbnB1dCk7XHJcblxyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLk1ha2VZZWFyRnJvbUtleV0gPVxyXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5NYWtlWWVhckZyb21JbnB1dElkKS52YWwoKTsvL21ha2VZZWFyRnJvbVxyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLk1ha2VZZWFyVG9LZXldID1cclxuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuTWFrZVllYXJUb0lucHV0SWQpLnZhbCgpOy8vbWFrZVllYXJUb1xyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLkZ1ZWxLZXldID1cclxuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuRnVlbFNlbGVjdElkKS5maW5kKFwib3B0aW9uOnNlbGVjdGVkXCIpLnZhbCgpOy8vZnVlbFxyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLk1pbGVhZ2VGcm9tS2V5XSA9XHJcbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLk1pbGVhZ2VGcm9tSW5wdXRJZCkudmFsKCk7Ly9taWxlYWdlRnJvbVxyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLk1pbGVhZ2VUb0tleV0gPVxyXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5NaWxlYWdlVG9JbnB1dElkKS52YWwoKTsvL21pbGVhZ2VUb1xyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLkdlYXJib3hLZXldID1cclxuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuR2VhcmJveFR5cGVTZWxlY3RJZCkuZmluZChcIm9wdGlvbjpzZWxlY3RlZFwiKS52YWwoKTsvL2dlYXJib3hUeXBlICAgICAgICBcclxuICAgICAgICB1c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnlbdGhpcy5Cb2R5Q29sb3JLZXldID1cclxuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuQm9keUNvbG9yU2VsZWN0SWQpLmZpbmQoXCJvcHRpb246c2VsZWN0ZWRcIikudmFsKCk7Ly9ib2R5Q29sb3JcclxuICAgICAgICB1c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnlbdGhpcy5JbnRlcm5hbENvbG9yS2V5XSA9XHJcbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLkludGVybmFsQ29sb3JTZWxlY3RJZCkuZmluZChcIm9wdGlvbjpzZWxlY3RlZFwiKS52YWwoKTsvL2ludGVybmFsQ29sb3IgICAgICAgIFxyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLkJvZHlTdGF0dXNLZXldID1cclxuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuQm9keVN0YXR1c1NlbGVjdElkKS5maW5kKFwib3B0aW9uOnNlbGVjdGVkXCIpLnZhbCgpOy8vYm9keVN0YXR1c1xyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLkNhclN0YXR1c0tleV0gPVxyXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5DYXJTdGF0dXNTZWxlY3RJZCkuZmluZChcIm9wdGlvbjpzZWxlY3RlZFwiKS52YWwoKTsvL2NhclN0YXR1cyAgICAgICAgXHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuUGxhdGVUeXBlS2V5XSA9XHJcbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLlBsYXRlVHlwZVNlbGVjdElkKS5maW5kKFwib3B0aW9uOnNlbGVjdGVkXCIpLnZhbCgpOy8vcGxhdGVUeXBlXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIEJpbmRFdmVudHMoY3JpdGVyaWFDaGFuZ2U6IElDcml0ZXJpYUNoYW5nZSk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuaW5pdFZpZXcoKTtcclxuICAgICAgICB0aGlzLl9jYXJNb2RlbEJyYW5kQ29udG9sbGVyLkJpbmRFdmVudHMoY3JpdGVyaWFDaGFuZ2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBVbkJpbmRFdmVudHMoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fY2FyTW9kZWxCcmFuZENvbnRvbGxlci5VbkJpbmRFdmVudHMoKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG4iLCLvu79pbXBvcnQge0lDcml0ZXJpYSxDcml0ZXJpYVZhbGlkYXRvcn0gZnJvbSBcIi4uLy4uLy4uLy4uL0hlbHBlci9JQ3JpdGVyaWFcIjtcclxuaW1wb3J0IHsgVXNlcklucHV0IH0gZnJvbSBcIi4uLy4uLy4uLy4uL0hlbHBlci9Vc2VySW5wdXRcIjtcclxuaW1wb3J0IHsgSUNyaXRlcmlhQ2hhbmdlIH0gZnJvbSBcIi4uLy4uLy4uLy4uL0hlbHBlci9JQ3JpdGVyaWFDaGFuZ2VcIjtcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgRGVmYXVsdFNlYXJjaENyaXRlcmlhIGltcGxlbWVudHMgSUNyaXRlcmlhe1xyXG4gICAgcHVibGljIEZpbGxDcml0ZXJpYSh1c2VySW5wdXQ6IFVzZXJJbnB1dCk6IHZvaWQge1xyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeS5kZWZhdWx0UGFyYW1ldGVyID0gMTIzNDtcclxuICAgIH1cclxuXHJcbiAgICBCaW5kRXZlbnRzKGNyaXRlcmlhQ2hhbmdlOiBJQ3JpdGVyaWFDaGFuZ2UpOiB2b2lkIHtcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBVbkJpbmRFdmVudHMoKTogdm9pZCB7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgVmFsaWRhdGVDcml0ZXJpYSgpOiBDcml0ZXJpYVZhbGlkYXRvciB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm90IGltcGxlbWVudGVkXCIpO1xyXG4gICAgfVxyXG59Iiwi77u/aW1wb3J0IHsgVXNlcklucHV0ICB9IGZyb20gXCIuLi8uLi8uLi9IZWxwZXIvVXNlcklucHV0XCI7XHJcbi8vVE9ETyBtYWtlIGNvdW50IG9wdGlvbmFsIHRvIHVzZXJcclxuLy9UT0RPIGluc3RlYWQgb2YgYWRkaW5nIG5ldyBhZHMgdG8gdGhlIHBhZ2UgaGVyZSBjYWxsIGEgbWV0aG9kIG9uIGluZGV4IGNsYXNzIHRvIGFkZCBpdCBieSBkZWZpbmluZyBhbiBpbnRlcmZhY2UgaW4gdGhlIGluZGV4IGNsYXNzIFxyXG5leHBvcnQgY2xhc3MgU2VydmVyQ2FsbGVyIHtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgU3RhcnRJbmRleEtleTogc3RyaW5nID1cIlN0YXJ0SW5kZXhcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2luaXRpYWxTdGFydDogbnVtYmVyID0gMTtcclxuICAgIHByaXZhdGUgX3N0YXJ0OiBudW1iZXIgPSAxO1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgQ291bnRLZXk6IHN0cmluZyA9XCJDb3VudFwiO1xyXG4gICAgcHJpdmF0ZSBfY291bnQ6IG51bWJlciA9IDU7XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBSZXF1ZXN0SW5kZXhLZXk6IHN0cmluZyA9XCJSZXF1ZXN0SW5kZXhcIjtcclxuICAgIHByaXZhdGUgX2N1cnJlbnRSZXF1ZXN0SW5kZXg6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9pbml0aWFsUmVxdWVzdEluZGV4OiBudW1iZXIgPSAwO1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgTnVtYmVyT2ZJdGVtc0tleTogc3RyaW5nID1cIm51bWJlck9mSXRlbXNcIjtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IENhbGxJbWFnZUlkOiBzdHJpbmcgPVwic2VydmVyQ2FsbGVkSW1hZ2VcIjtcclxuICAgIHByaXZhdGUgX2lzU2VydmVyQ2FsbGVkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwcml2YXRlIF9udW1iZXJPZlN0YXJ0U2VydmVyQ2FsbE5vdGlmaWNhdGlvbjogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX3VybDogc3RyaW5nID0gXCJhcGkvQWRBcGkvR2V0QWR2ZXJ0aXNlbWVudENvbW1vblwiO1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgIF9hZFBsYWNlSG9sZGVyRGl2SWQ6IHN0cmluZyA9XCJhZFBsYWNlSG9sZGVyXCI7XHJcblxyXG4gICAgcHVibGljIEdldEFkSXRlbXNGcm9tU2VydmVyKHVzZXJJbnB1dDogVXNlcklucHV0KTogdm9pZCB7XHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuU3RhcnRJbmRleEtleV0gPSB0aGlzLl9zdGFydDtcclxuICAgICAgICB1c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnlbdGhpcy5Db3VudEtleV0gPSB0aGlzLl9jb3VudDtcclxuICAgICAgICB0aGlzLl9jdXJyZW50UmVxdWVzdEluZGV4Kys7XHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuUmVxdWVzdEluZGV4S2V5XSA9IHRoaXMuX2N1cnJlbnRSZXF1ZXN0SW5kZXg7XHJcbiAgICAgICAgXHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogXCJQT1NUXCIsIC8vR0VUIG9yIFBPU1Qgb3IgUFVUIG9yIERFTEVURSB2ZXJiXHJcbiAgICAgICAgICAgIHVybDogdGhpcy5fdXJsLFxyXG4gICAgICAgICAgICBkYXRhOkpTT04uc3RyaW5naWZ5KHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeSksIC8vRGF0YSBzZW50IHRvIHNlcnZlclxyXG4gICAgICAgICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLCAvLyBjb250ZW50IHR5cGUgc2VudCB0byBzZXJ2ZXJcclxuICAgICAgICAgICAgc3VjY2VzczogKG1zZyx0ZXh0U3RhdHVzLGpxWEhSKT0+IHRoaXMub25TdWNjZXNzR2V0SXRlbXNGcm9tU2VydmVyKG1zZyx0ZXh0U3RhdHVzLGpxWEhSKSwgLy9PbiBTdWNjZXNzZnVsbCBzZXJ2aWNlIGNhbGxcclxuICAgICAgICAgICAgZXJyb3I6IChqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pID0+IHRoaXMub25FcnJvckdldEl0ZW1zRnJvbVNlcnZlcihqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pIC8vIFdoZW4gU2VydmljZSBjYWxsIGZhaWxzXHJcbiAgICAgICAgfSk7IC8vLmFqYXhcclxuICAgICAgICB0aGlzLl9pc1NlcnZlckNhbGxlZCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5ub3RpZnlVc2VyQWpheENhbGxTdGFydGVkKCk7XHJcbiAgICB9IC8vR2V0QWRJdGVtc0Zyb21TZXJ2ZXJcclxuXHJcbiAgICAgXHJcbiAgICBwcml2YXRlIG9uU3VjY2Vzc0dldEl0ZW1zRnJvbVNlcnZlcihtc2c6YW55LHRleHRTdGF0dXM6c3RyaW5nLCBqcVhIUjpKUXVlcnlYSFIpIHtcclxuICAgICAgICAvL1RPRE8gY2hlY2sgZm9yIHVuZGVmaW5lZCBvciBudWxsIGluIG1zZyBhbmQgbXNnLmN1c3RvbURpY3Rpb25hcnlbXCJSZXF1ZXN0SW5kZXhcIl1cclxuICAgICAgICBpZiAodGhpcy5faXNTZXJ2ZXJDYWxsZWQpIHtcclxuICAgICAgICAgICAgaWYgKG1zZy5jdXN0b21EaWN0aW9uYXJ5W3RoaXMuUmVxdWVzdEluZGV4S2V5XSA9PSB0aGlzLl9jdXJyZW50UmVxdWVzdEluZGV4KSB7IC8vbGFzdCBjYWxsIHJlc3BvbnNlXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9pc1NlcnZlckNhbGxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ub3RpZnlVc2VyQWpheENhbGxGaW5pc2hlZCgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKG1zZy5zdWNjZXNzID09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdGFydCArPSBwYXJzZUludChtc2cuY3VzdG9tRGljdGlvbmFyeVt0aGlzLk51bWJlck9mSXRlbXNLZXldKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdGVtcGxhdGUgPSAkKCcjc2luZ2xlQWRJdGVtJykuaHRtbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBkYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbXNnLnJlc3BvbnNlRGF0YS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYWRJbWFnZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtc2cucmVzcG9uc2VEYXRhW2ldLmFkdmVydGlzZW1lbnRJbWFnZXNbMF0gIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRJbWFnZSA9IFwiZGF0YTppbWFnZS9qcGc7YmFzZTY0LFwiICsgbXNnLnJlc3BvbnNlRGF0YVtpXS5hZHZlcnRpc2VtZW50SW1hZ2VzWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IC8vZW5kIGlmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBZHZlcnRpc2VtZW50SWQ6IG1zZy5yZXNwb25zZURhdGFbaV0uYWR2ZXJ0aXNlbWVudElkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQWR2ZXJ0aXNlbWVudENhdGVnb3J5SWQ6IG1zZy5yZXNwb25zZURhdGFbaV0uYWR2ZXJ0aXNlbWVudENhdGVnb3J5SWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBZHZlcnRpc2VtZW50Q2F0ZWdvcnk6IG1zZy5yZXNwb25zZURhdGFbaV0uYWR2ZXJ0aXNlbWVudENhdGVnb3J5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRJbWFnZTogYWRJbWFnZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkUHJpY2U6IG1zZy5yZXNwb25zZURhdGFbaV0uYWR2ZXJ0aXNlbWVudFByaWNlLnByaWNlLCAvL3RvZG8gY2hlY2sgdGhlIHByaWNlIHR5cGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFkdmVydGlzZW1lbnRUaXRsZTogbXNnLnJlc3BvbnNlRGF0YVtpXS5hZHZlcnRpc2VtZW50VGl0bGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBZHZlcnRpc2VtZW50U3RhdHVzOiBtc2cucmVzcG9uc2VEYXRhW2ldLmFkdmVydGlzZW1lbnRTdGF0dXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vYWREYXRlOiBtc2cuUmVzcG9uc2VEYXRhW2ldLkFkVGltZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IC8vZW5kIGRhdGFcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBodG1sID0gTXVzdGFjaGUudG9faHRtbCh0ZW1wbGF0ZSwgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoXCIjXCIgK3RoaXMuX2FkUGxhY2VIb2xkZXJEaXZJZCkuYXBwZW5kKGh0bWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gLy9lbmQgZm9yXHJcbiAgICAgICAgICAgICAgICB9IC8vaWYgKG1zZy5zdWNjZXNzID09IHRydWUpXHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAvL1RPRE8gc2hvdyBlcnJvciBtZXNzYWdlIHRvIHVzZXJcclxuICAgICAgICAgICAgICAgICAgICAvL3Nob3dFcnJvck1lc3NhZ2UobXNnLk1lc3NhZ2UgKyBcIiAsIFwiICsgbXNnLkVycm9yQ29kZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gLy9pZiAobXNnLmN1c3RvbURpY3Rpb25hcnlbXCJSZXF1ZXN0SW5kZXhcIl1cclxuICAgICAgICB9IC8vaWYgKHRoaXMuX2lzU2VydmVyQ2FsbGVkKVxyXG4gICAgfSBcclxuXHJcbiAgICBcclxuICAgIHByaXZhdGUgb25FcnJvckdldEl0ZW1zRnJvbVNlcnZlcihqcVhIUjpKUXVlcnlYSFIsIHRleHRTdGF0dXM6c3RyaW5nLCBlcnJvclRocm93bjpzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLl9pc1NlcnZlckNhbGxlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMubm90aWZ5VXNlckFqYXhDYWxsRmluaXNoZWQoKTtcclxuICAgICAgICAvL3Nob3dFcnJvck1lc3NhZ2UodGV4dFN0YXR1cyArIFwiICwgXCIgKyBlcnJvclRocm93bik7XHJcbiAgICB9IFxyXG5cclxuICAgIHB1YmxpYyBSZXNldFNlYXJjaFBhcmFtZXRlcnMoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fc3RhcnQgPSB0aGlzLl9pbml0aWFsU3RhcnQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBub3RpZnlVc2VyQWpheENhbGxTdGFydGVkKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiU3RhcnRlZCBBamF4IENhbGxcIik7XHJcbiAgICAgICAgJChcIiNcIit0aGlzLkNhbGxJbWFnZUlkKS5zaG93KCk7XHJcbiAgICB9XHJcblxyXG4gICAgbm90aWZ5VXNlckFqYXhDYWxsRmluaXNoZWQoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJGaW5pc2hlZCBBamF4IENhbGxcIik7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuQ2FsbEltYWdlSWQpLmhpZGUoKTtcclxuICAgIH1cclxufVxyXG5cclxuIiwi77u/aW1wb3J0IHsgQ2F0ZWdvcnkgfSBmcm9tIFwiLi4vLi4vLi4vTW9kZWxzL0NhdGVnb3J5XCI7XHJcbmltcG9ydCB7IENhdGVnb3J5U2VsZWN0aW9uIH0gZnJvbSBcIi4uLy4uLy4uL0NvbXBvbmVudHMvQ2F0ZWdvcnkvU2VhcmNoQWQvQ2F0ZWdvcnlTZWxlY3Rpb25cIjtcclxuaW1wb3J0IHsgU2VydmVyQ2FsbGVyIH0gZnJvbSBcIi4vU2VydmVyQ2FsbGVyXCI7XHJcbmltcG9ydCB7IFNlYXJjaENyaXRlcmlhVmlld0xvYWRlcn0gZnJvbSBcIi4vU2VhcmNoQ3JpdGVyaWFWaWV3TG9hZGVyXCI7XHJcbmltcG9ydCB7U2VhcmNoQ3JpdGVyaWF9IGZyb20gXCIuL1NlYXJjaENyaXRlcmlhXCI7XHJcbmltcG9ydCB7SUNyaXRlcmlhQ2hhbmdlfSBmcm9tIFwiLi4vLi4vLi4vSGVscGVyL0lDcml0ZXJpYUNoYW5nZVwiO1xyXG5pbXBvcnQge1VzZXJJbnB1dH0gZnJvbSBcIi4uLy4uLy4uL0hlbHBlci9Vc2VySW5wdXRcIjtcclxuXHJcblxyXG4vL1RPRE8gd2hlbiBjYXRlZ29yeSBjaGFuZ2UgYmVmb3JlIHNlYXJjaCBjcml0ZWlhIGlzIGxvYWRlZCBhIHNlYXJjaCBjYWxsIGlzIHNlbnQgdG8gc2VydmVyXHJcbi8vYWRkIGFuIGV2ZW50IGxpa2Ugdmlld0xvYWRTdGFydGVkLCB2aWV3TG9hZEluUHJvZ3Jlc3Msdmlld0xvYWRDb21wbGV0ZWQgYW5kIGRpc2FibGUgc2VhcmNoXHJcbi8vZHVybmcgaW5Qcm9ncmVzcyBlbmQgZW5hYmxlIGl0IGFmdGVyIGNvbXBsZXRlZFxyXG5leHBvcnQgY2xhc3MgSW5kZXggaW1wbGVtZW50cyBJQ3JpdGVyaWFDaGFuZ2Uge1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgT3JkZXJCeUtleSA9XCJPcmRlckJ5XCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9vcmRlckJ5U2VsZWN0SWREaXYgPSBcIm9yZGVyQnlcIjtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IE1pbmltdW1QcmljZUtleSA9XCJNaW5pbXVtUHJpY2VcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX21pblByaWNlSW5wdXRJZCA9IFwibWluUHJpY2VcIjtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IE1heGltdW1QcmljZUtleSA9XCJNYXhpbXVtUHJpY2VcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX21heFByaWNlSW5wdXRJZCA9XCJtYXhQcmljZVwiO1xyXG5cclxuICAgIHByaXZhdGUgX3NlcnZlckNhbGxlcjpTZXJ2ZXJDYWxsZXI7XHJcbiAgICBwcml2YXRlIF9jYXRlZ29yeVNlbGVjdGlvbjogQ2F0ZWdvcnlTZWxlY3Rpb247XHJcbiAgICBwcml2YXRlIF9zZWFyY2hDcml0ZXJpYTpTZWFyY2hDcml0ZXJpYTtcclxuICAgIHByaXZhdGUgX3NlYXJjaENyaXRlcmlhVmlld0xvYWRlcjpTZWFyY2hDcml0ZXJpYVZpZXdMb2FkZXI7XHJcblxyXG4gICAgcHJpdmF0ZSBfY2F0ZWdvcnlTZWxlY3RvclBhcmVudERpdklkOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIF9nZXRBZEZyb21TZXJ2ZXJJZDogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBfYWxsQ2F0ZWdvcmllc0lkOiBzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IoY2F0ZWdvcnlTZWxlY3RvclBhcmVudERpdklkOiBzdHJpbmcsXHJcbiAgICAgICAgYWxsQ2F0ZWdvcmllc0lkOiBzdHJpbmcsXHJcbiAgICAgICAgZ2V0QWRGcm9tU2VydmVySWQ6IHN0cmluZylcclxuICAgIHtcclxuICAgICAgICB0aGlzLl9jYXRlZ29yeVNlbGVjdG9yUGFyZW50RGl2SWQgPSBjYXRlZ29yeVNlbGVjdG9yUGFyZW50RGl2SWQ7XHJcbiAgICAgICAgdGhpcy5fYWxsQ2F0ZWdvcmllc0lkID0gYWxsQ2F0ZWdvcmllc0lkO1xyXG4gICAgICAgIHRoaXMuX2dldEFkRnJvbVNlcnZlcklkID0gZ2V0QWRGcm9tU2VydmVySWQ7XHJcblxyXG4gICAgICAgIHRoaXMuX3NlcnZlckNhbGxlciA9IG5ldyBTZXJ2ZXJDYWxsZXIoKTtcclxuICAgICAgICB0aGlzLl9zZWFyY2hDcml0ZXJpYSA9IG5ldyBTZWFyY2hDcml0ZXJpYSgpO1xyXG4gICAgICAgIHRoaXMuX3NlYXJjaENyaXRlcmlhVmlld0xvYWRlciA9IG5ldyBTZWFyY2hDcml0ZXJpYVZpZXdMb2FkZXIoXCJjYXRlZ29yeVNwZWNpZmljU2VhcmNoQ3JpdGVyaWFcIiwgdGhpcywgdGhpcy5fc2VhcmNoQ3JpdGVyaWEpO1xyXG5cclxuICAgICAgICB0aGlzLmluaXRQYWdlKCk7XHJcbiAgICAgICAgdGhpcy5pbml0RXZlbnRIYW5kbGVycygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaW5pdFBhZ2UoKTogdm9pZCB7XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdENhdGVnb3J5U2VsZWN0aW9uQ29udHJvbCgpO1xyXG4gICAgICAgIHRoaXMuaW5pdEdldEFkRnJvbVNlcnZlcigpO1xyXG4gICAgICAgIHRoaXMuaW5pdFNpbmdsZUFkSXRlbVN0eWxlKCk7XHJcblxyXG4gICAgfS8vaW5pdFBhZ2VcclxuXHJcbiAgICBwcml2YXRlIGluaXRDYXRlZ29yeVNlbGVjdGlvbkNvbnRyb2woKTogdm9pZCB7XHJcbiAgICAgICAgLy9BZGQgZmlyc3QgbGV2ZWwgY2F0ZWdvcmllc1xyXG4gICAgICAgIGxldCBhbGxDYXRlZ29yaWVzU3RyaW5nID0gJChcIiNcIiArIHRoaXMuX2FsbENhdGVnb3JpZXNJZCkudmFsKCkudG9TdHJpbmcoKTtcclxuICAgICAgICBsZXQgYWxsQ2F0ZWdvcmllcyA9ICQucGFyc2VKU09OKGFsbENhdGVnb3JpZXNTdHJpbmcpIGFzIENhdGVnb3J5W107XHJcbiAgICAgICAgdGhpcy5fY2F0ZWdvcnlTZWxlY3Rpb24gPSBuZXcgQ2F0ZWdvcnlTZWxlY3Rpb24odGhpcy5fY2F0ZWdvcnlTZWxlY3RvclBhcmVudERpdklkLCBhbGxDYXRlZ29yaWVzKTtcclxuICAgICAgICB0aGlzLl9jYXRlZ29yeVNlbGVjdGlvbi5DcmVhdGVGaXJzdExldmVsKCk7XHJcblxyXG4gICAgfS8vaW5pdENhdGVnb3J5U2VsZWN0aW9uQ29udHJvbFxyXG5cclxuICAgIHByaXZhdGUgaW5pdEV2ZW50SGFuZGxlcnMoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fY2F0ZWdvcnlTZWxlY3Rpb24uU2VsZWN0ZWRDYXRlZ29yeUNoYW5nZWRFdmVudC5TdWJzY3JpYmUoKHNlbmRlciwgYXJncykgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnNlYXJjaENyaXRlcmlhQ2hhbmdlZCgpO1xyXG4gICAgICAgICAgICB0aGlzLl9zZWFyY2hDcml0ZXJpYVZpZXdMb2FkZXIuR2V0U2VhcmNoQ3JpdGVyaWFWaWV3RnJvbVNlcnZlcihhcmdzKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX29yZGVyQnlTZWxlY3RJZERpdikub24oXCJjaGFuZ2VcIixcclxuICAgICAgICAgICAgKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNlYXJjaENyaXRlcmlhQ2hhbmdlZCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAvL3lvdSBjYW4gYWxzbyB1c2VyIFwiaW5wdXRcIiBpbnN0ZWFkIG9mIFwiY2hhbmdlXCJcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fbWluUHJpY2VJbnB1dElkKS5vbihcImlucHV0XCIsXHJcbiAgICAgICAgICAgIChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZWFyY2hDcml0ZXJpYUNoYW5nZWQoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX21heFByaWNlSW5wdXRJZCkub24oXCJjaGFuZ2VcIixcclxuICAgICAgICAgICAgKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNlYXJjaENyaXRlcmlhQ2hhbmdlZCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgQ3VzdG9tQ3JpdGVyaWFDaGFuZ2VkKCk6dm9pZCB7XHJcbiAgICAgICAgdGhpcy5zZWFyY2hDcml0ZXJpYUNoYW5nZWQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNlYXJjaENyaXRlcmlhQ2hhbmdlZCgpOiB2b2lkIHtcclxuICAgICAgICAkKFwiI2FkUGxhY2VIb2xkZXJcIikuY2hpbGRyZW4oKS5yZW1vdmUoKTtcclxuICAgICAgICB0aGlzLl9zZXJ2ZXJDYWxsZXIuUmVzZXRTZWFyY2hQYXJhbWV0ZXJzKCk7XHJcbiAgICAgICAvLyAkKFwiI1wiICsgdGhpcy5fZ2V0QWRGcm9tU2VydmVySWQpLnRyaWdnZXIoXCJjbGlja1wiKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbml0R2V0QWRGcm9tU2VydmVyKCk6IHZvaWQge1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9nZXRBZEZyb21TZXJ2ZXJJZCkub24oXCJjbGlja1wiLCAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgbGV0IHVzZXJJbnB1dCA9IG5ldyBVc2VySW5wdXQoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2NhdGVnb3J5U2VsZWN0aW9uLkluc2VydENhdGVnb3J5SWRJblVzZXJJbnB1dERpY3Rpb25hcnkodXNlcklucHV0KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGxldCBtaW5QcmljZSA9IHBhcnNlSW50KCQoXCIjXCIrdGhpcy5fbWluUHJpY2VJbnB1dElkKS52YWwoKS50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuTWluaW11bVByaWNlS2V5XSA9IG1pblByaWNlO1xyXG5cclxuICAgICAgICAgICAgbGV0IG1heFByaWNlID0gcGFyc2VJbnQoJChcIiNcIit0aGlzLl9tYXhQcmljZUlucHV0SWQpLnZhbCgpLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICB1c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnlbdGhpcy5NYXhpbXVtUHJpY2VLZXldID0gbWF4UHJpY2U7XHJcblxyXG4gICAgICAgICAgICBsZXQgb3JkZXJCeSA9ICQoXCIjXCIrdGhpcy5fb3JkZXJCeVNlbGVjdElkRGl2KS52YWwoKS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICB1c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnlbdGhpcy5PcmRlckJ5S2V5XSA9IG9yZGVyQnk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLl9zZWFyY2hDcml0ZXJpYS5GaWxsQ2F0ZWdvcnlTcGVjaWZpY1NlYXJjaENyaXRlcmlhKHRoaXMuX2NhdGVnb3J5U2VsZWN0aW9uLkdldFNlbGVjdGVkQ2F0ZWdvcnlJZCgpLCB1c2VySW5wdXQpOy8vZmlsbCBjYXRlZ29yeSBzcGVjaWZpYyBzZWFyY2ggcGFyYW1ldGVyc1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5fc2VydmVyQ2FsbGVyLkdldEFkSXRlbXNGcm9tU2VydmVyKHVzZXJJbnB1dCk7XHJcbiAgICAgICAgfSk7IC8vY2xpY2tcclxuICAgIH0vL2luaXRHZXRBZEZyb21TZXJ2ZXJcclxuXHJcbiAgIFxyXG5cclxuICAgIHByaXZhdGUgaW5pdFNpbmdsZUFkSXRlbVN0eWxlKCk6IHZvaWQge1xyXG4gICAgICAgIC8vc2hvdyBkZXRhaWwgb2Ygc2luZ2xlQWRJdGVtIHdoZW4gbW91c2Ugb3ZlclxyXG4gICAgICAgICQoZG9jdW1lbnQpLm9uKFwibW91c2VlbnRlciBtb3VzZWxlYXZlXCIsIFwiLmJsb2NrRGlzcGxheVwiLCAoZXZlbnQ6IEpRdWVyeS5FdmVudDxIVE1MRWxlbWVudCwgbnVsbD4pID0+IHtcclxuICAgICAgICAgICAgJChldmVudC5jdXJyZW50VGFyZ2V0KS5maW5kKFwiLm1vcmVJbmZvXCIpLmZhZGVUb2dnbGUoMjUwKTtcclxuICAgICAgICAgICAgLy8kKHRoaXMpLmZpbmQoXCIubW9yZUluZm9cIikuZmFkZVRvZ2dsZSgyNTApO1xyXG4gICAgICAgIH0pOy8vZW5kIG9uXHJcbiAgICB9Ly9pbml0U2luZ2xlQWRJdGVtU3R5bGVcclxufVxyXG5cclxubGV0IGNhdGVnb3J5U2VsZWN0b3JQYXJlbnREaXZJZDogc3RyaW5nID0gXCJjYXRlZ29yeVNlbGVjdG9yXCI7XHJcbmxldCBnZXRBZEZyb21TZXJ2ZXJJZCA9IFwiZ2V0QWRGcm9tU2VydmVyXCI7XHJcbmxldCBhbGxDYXRlZ29yaWVzSWQgPSBcImFsbENhdGVnb3JpZXNcIjtcclxuXHJcbiQoZG9jdW1lbnQpLnJlYWR5KCgpID0+IHtcclxuICAgIGxldCBpbmRleCA9IG5ldyBJbmRleChjYXRlZ29yeVNlbGVjdG9yUGFyZW50RGl2SWQsIGFsbENhdGVnb3JpZXNJZCwgZ2V0QWRGcm9tU2VydmVySWQpO1xyXG4gICAgaW5kZXguQ3VzdG9tQ3JpdGVyaWFDaGFuZ2VkKCk7Ly90byBpbml0aWF0ZSBhIHNlcnZlciBjYWxsIG9uIHBhZ2UgbG9hZCBmb3IgZmlyc3QgdGltZVxyXG59KTsvL3JlYWR5XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiIsIu+7v2ltcG9ydCB7TmV3QWRDcml0ZXJpYX0gZnJvbSBcIi4vTmV3QWRDcml0ZXJpYVwiO1xyXG5pbXBvcnQge0lDcml0ZXJpYUNoYW5nZX0gZnJvbSBcIi4uLy4uLy4uL0hlbHBlci9JQ3JpdGVyaWFDaGFuZ2VcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBOZXdBZFBhcnRpYWxWaWV3TG9hZGVyIHtcclxuICAgIHByaXZhdGUgX3BhcnRpYWxWaWV3RGl2SWQ6IHN0cmluZztcclxuICAgIHByaXZhdGUgX3VybDogc3RyaW5nID0gXCIvSG9tZS9HZXROZXdBZFBhcnRpYWxWaWV3XCI7XHJcbiAgICBwcml2YXRlIF9wcmV2aW91c0NhdGVnb3J5SWQ6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIF9jdXJyZW50Q2F0ZWdvcnlJZDogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgX25ld0FkQ3JpdGVyaWFDaGFuZ2U6IElDcml0ZXJpYUNoYW5nZTtcclxuICAgIHByaXZhdGUgX25ld0FkQ3JpdGVyaWE6IE5ld0FkQ3JpdGVyaWE7XHJcblxyXG4gICAgY29uc3RydWN0b3IocGFydGlhbFZpZXdEaXZJZDogc3RyaW5nLCBuZXdBZENyaXRlcmlhQ2hhbmdlOiBJQ3JpdGVyaWFDaGFuZ2UsIG5ld0FkQ3JpdGVyaWE6TmV3QWRDcml0ZXJpYSkge1xyXG4gICAgICAgIHRoaXMuX3BhcnRpYWxWaWV3RGl2SWQgPSBwYXJ0aWFsVmlld0RpdklkO1xyXG4gICAgICAgIHRoaXMuX25ld0FkQ3JpdGVyaWFDaGFuZ2UgPSBuZXdBZENyaXRlcmlhQ2hhbmdlO1xyXG4gICAgICAgIHRoaXMuX25ld0FkQ3JpdGVyaWEgPSBuZXdBZENyaXRlcmlhO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBHZXRQYXJ0aWFsVmlld0Zyb21TZXJ2ZXIoY2F0ZWdvcnlJZDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fY3VycmVudENhdGVnb3J5SWQgPSBjYXRlZ29yeUlkO1xyXG4gICAgICAgIGxldCBjYWxsUGFyYW1zID0gbmV3IFBhcnRpYWxWaWV3U2VydmVyQ2FsbFBhcmFtZXRlcnMoKTtcclxuICAgICAgICBjYWxsUGFyYW1zLkNhdGVnb3J5SWQgPSBjYXRlZ29yeUlkO1xyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6IFwiR0VUXCIsIC8vR0VUIG9yIFBPU1Qgb3IgUFVUIG9yIERFTEVURSB2ZXJiXHJcbiAgICAgICAgICAgIHVybDogdGhpcy5fdXJsLFxyXG4gICAgICAgICAgICBkYXRhOiBjYWxsUGFyYW1zLCAvL0RhdGEgc2VudCB0byBzZXJ2ZXJcclxuICAgICAgICAgICAgLy9jb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLCAvLyBjb250ZW50IHR5cGUgc2VudCB0byBzZXJ2ZXJcclxuICAgICAgICAgICAgc3VjY2VzczogKG1zZywgdGV4dFN0YXR1cywganFYSFIpID0+IHRoaXMub25TdWNjZXNzR2V0SXRlbXNGcm9tU2VydmVyKG1zZywgdGV4dFN0YXR1cywganFYSFIpLC8vT24gU3VjY2Vzc2Z1bGwgc2VydmljZSBjYWxsXHJcbiAgICAgICAgICAgIGVycm9yOiAoanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKSA9PiB0aGlzLm9uRXJyb3JHZXRJdGVtc0Zyb21TZXJ2ZXIoanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKS8vIFdoZW4gU2VydmljZSBjYWxsIGZhaWxzXHJcbiAgICAgICAgfSk7Ly8uYWpheFxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25TdWNjZXNzR2V0SXRlbXNGcm9tU2VydmVyKG1zZzogYW55LCB0ZXh0U3RhdHVzOiBzdHJpbmcsIGpxWEhSOiBKUXVlcnlYSFIpIHtcclxuICAgICAgICB0aGlzLl9uZXdBZENyaXRlcmlhLlVuQmluZCh0aGlzLl9wcmV2aW91c0NhdGVnb3J5SWQpO1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9wYXJ0aWFsVmlld0RpdklkKS5jaGlsZHJlbigpLnJlbW92ZSgpO1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9wYXJ0aWFsVmlld0RpdklkKS5odG1sKG1zZyk7XHJcbiAgICAgICAgdGhpcy5fbmV3QWRDcml0ZXJpYS5CaW5kKHRoaXMuX2N1cnJlbnRDYXRlZ29yeUlkLCB0aGlzLl9uZXdBZENyaXRlcmlhQ2hhbmdlKTtcclxuICAgICAgICB0aGlzLl9wcmV2aW91c0NhdGVnb3J5SWQgPSB0aGlzLl9jdXJyZW50Q2F0ZWdvcnlJZDtcclxuICAgIH0vL29uU3VjY2Vzc0dldFRpbWVGcm9tU2VydmVyXHJcblxyXG4gICAgcHJpdmF0ZSBvbkVycm9yR2V0SXRlbXNGcm9tU2VydmVyKGpxWEhSOiBKUXVlcnlYSFIsIHRleHRTdGF0dXM6IHN0cmluZywgZXJyb3JUaHJvd246IHN0cmluZykge1xyXG4gICAgICAgIGFsZXJ0KGVycm9yVGhyb3duKTtcclxuICAgIH0vL29uRXJyb3JHZXRUaW1lRnJvbVNlcnZlclxyXG59XHJcblxyXG4vL1RPRE8gcmVmYWN0b3IgdGhpc1xyXG5leHBvcnQgY2xhc3MgUGFydGlhbFZpZXdTZXJ2ZXJDYWxsUGFyYW1ldGVycyB7XHJcbiAgICBwdWJsaWMgQ2F0ZWdvcnlJZDpudW1iZXI7XHJcbn0iXX0=
