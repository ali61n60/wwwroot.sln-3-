(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventDispatcher_1 = require("../../../Events/EventDispatcher");
var CategorySelection = /** @class */ (function () {
    function CategorySelection(parentDivId, allCategories) {
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
    }; //end OnSuccessGetTimeFromServer
    ServerCaller.prototype.onErrorGetItemsFromServer = function (jqXHR, textStatus, errorThrown) {
        this._isServerCalled = false;
        this.notifyUserAjaxCallFinished();
        //showErrorMessage(textStatus + " , " + errorThrown);
    }; //end OnErrorGetTimeFromServer
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
        this._orderBySelectIdDiv = "orderBy";
        this._minPriceInputId = "minPrice";
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
            var categoryId = _this._categorySelection.GetSelectedCategoryId();
            userInput.ParametersDictionary.CategoryId = categoryId; //100 for cars
            var minPrice = parseInt($("#minPrice").val().toString());
            userInput.ParametersDictionary.MinimumPrice = minPrice;
            var maxPrice = parseInt($("#maxPrice").val().toString());
            userInput.ParametersDictionary.MaximumPrice = maxPrice;
            var orderBy = $("#orderBy").val().toString();
            userInput.ParametersDictionary.OrderBy = orderBy;
            _this._searchCriteria.FillCategorySpecificSearchCriteria(categoryId, userInput); //fill category specific search parameters
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3d3dyb290L2pzL0NvbXBvbmVudHMvQ2F0ZWdvcnkvU2VhcmNoQWQvQ2F0ZWdvcnlTZWxlY3Rpb24udHMiLCJ3d3dyb290L2pzL0NvbXBvbmVudHMvVHJhbnNmb3JtYXRpb24vQ2FyTW9kZWxCcmFuZENvbnRyb2xsZXIudHMiLCJ3d3dyb290L2pzL0V2ZW50cy9FdmVudERpc3BhdGNoZXIudHMiLCJ3d3dyb290L2pzL0hlbHBlci9Dcml0ZXJpYU51bWVyaWNEaWN0aW9uYXJ5LnRzIiwid3d3cm9vdC9qcy9IZWxwZXIvVXNlcklucHV0LnRzIiwid3d3cm9vdC9qcy9ob21lL2luZGV4L3NyYy9TZWFyY2hDcml0ZXJpYS50cyIsInd3d3Jvb3QvanMvaG9tZS9pbmRleC9zcmMvU2VhcmNoQ3JpdGVyaWFWaWV3TG9hZGVyLnRzIiwid3d3cm9vdC9qcy9ob21lL2luZGV4L3NyYy9TZWFyY2hDcml0ZXJpYS9BZFRyYW5zZm9ybWF0aW9uU2VhcmNoQ3JpdGVyaWEudHMiLCJ3d3dyb290L2pzL2hvbWUvaW5kZXgvc3JjL1NlYXJjaENyaXRlcmlhL0RlZmF1bHRTZWFyY2hDcml0ZXJpYS50cyIsInd3d3Jvb3QvanMvaG9tZS9pbmRleC9zcmMvU2VydmVyQ2FsbGVyLnRzIiwid3d3cm9vdC9qcy9ob21lL2luZGV4L3NyYy9pbmRleC50cyIsInd3d3Jvb3QvanMvaG9tZS9uZXdBZC9zcmMvTmV3QWRQYXJ0aWFsVmlld0xvYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUMsbUVBQWtFO0FBR25FO0lBdUJJLDJCQUFZLFdBQW1CLEVBQUUsYUFBeUI7UUFuQnpDLHdCQUFtQixHQUFFLG1CQUFtQixDQUFDO1FBQ3pDLG1CQUFjLEdBQUMsV0FBVyxDQUFDO1FBQzNCLHNCQUFpQixHQUFXLFNBQVMsQ0FBQztRQUV0Qyx5QkFBb0IsR0FBRyxtQkFBbUIsQ0FBQztRQUMzQyxvQkFB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QUFELENBRkEsQUFFQyxJQUFBO0FBRlksMEVBQStCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIu+7v2ltcG9ydCB7IEV2ZW50RGlzcGF0Y2hlciB9IGZyb20gXCIuLi8uLi8uLi9FdmVudHMvRXZlbnREaXNwYXRjaGVyXCI7XHJcbmltcG9ydCB7IENhdGVnb3J5IH0gZnJvbSBcIi4uLy4uLy4uL01vZGVscy9DYXRlZ29yeVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIENhdGVnb3J5U2VsZWN0aW9uIHtcclxuICAgIHByaXZhdGUgX3BhcmVudERpdklkOiBzdHJpbmc7Ly9kaXYgZWxlbWVudCB0aGF0IGhvbGRzIGFsbCBDYXRlZ29yeVNlbGVjdGlvbiBlbGVtZW50c1xyXG4gICAgcHJpdmF0ZSBfYWxsQ2F0ZWdvcmllczogQ2F0ZWdvcnlbXTtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9maXJzdExldmVsVGVtcGxhdGUgPVwiY2F0ZWdvcnkxVGVtcGxhdGVcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2ZpcnN0TGV2ZWxEaXY9XCJjYXRlZ29yeTFcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2ZpcnN0TGV2ZWxTZWxlY3Q6IHN0cmluZyA9IFwic2VsZWN0MVwiO1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX3NlY29uZExldmVsVGVtcGxhdGUgPSBcImNhdGVnb3J5MlRlbXBsYXRlXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9zZWNvbmRMZXZlbERpdiA9IFwiY2F0ZWdvcnkyXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9zZWNvbmRMZXZlbFNlbGVjdDogc3RyaW5nID0gXCJzZWxlY3QyXCI7XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfdGhpcmRMZXZlbFRlbXBsYXRlID0gXCJjYXRlZ29yeTNUZW1wbGF0ZVwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfdGhpcmRMZXZlbERpdiA9IFwiY2F0ZWdvcnkzXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF90aGlyZExldmVsU2VsZWN0OiBzdHJpbmcgPSBcInNlbGVjdDNcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX3Jvb3RDYXRlZ29yeUlkOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIHByaXZhdGUgX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsT25lOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIF9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFR3bzogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBfc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUaHJlZTogbnVtYmVyO1xyXG5cclxuICAgIHB1YmxpYyBTZWxlY3RlZENhdGVnb3J5Q2hhbmdlZEV2ZW50OiBFdmVudERpc3BhdGNoZXI8Q2F0ZWdvcnlTZWxlY3Rpb24sIG51bWJlcj4gPSBuZXcgRXZlbnREaXNwYXRjaGVyPENhdGVnb3J5U2VsZWN0aW9uLCBudW1iZXI+KCk7XHJcblxyXG4gICAgY29uc3RydWN0b3IocGFyZW50RGl2SWQ6IHN0cmluZywgYWxsQ2F0ZWdvcmllczogQ2F0ZWdvcnlbXSkge1xyXG4gICAgICAgIHRoaXMuX3BhcmVudERpdklkID0gcGFyZW50RGl2SWQ7XHJcbiAgICAgICAgdGhpcy5fYWxsQ2F0ZWdvcmllcyA9IGFsbENhdGVnb3JpZXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIEdldFNlbGVjdGVkQ2F0ZWdvcnlJZCgpOiBudW1iZXIge1xyXG4gICAgICAgIGlmICh0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFRocmVlICE9PSB1bmRlZmluZWQgJiZcclxuICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUaHJlZSAhPT0gdGhpcy5fcm9vdENhdGVnb3J5SWQpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFRocmVlO1xyXG4gICAgICAgIGVsc2UgaWYgKHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVHdvICE9PSB1bmRlZmluZWQgJiZcclxuICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFR3byAhPT0gdGhpcy5fcm9vdENhdGVnb3J5SWQpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFR3bztcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbE9uZTtcclxuICAgIH0vL0dldFNlbGVjdGVkQ2F0ZWdvcnlJZFxyXG5cclxuICAgIHByaXZhdGUgcmVtb3ZlRWxlbWVudChpZDogc3RyaW5nKTp2b2lkIHtcclxuICAgICAgICAkKFwiI1wiICsgaWQpLnJlbW92ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgcHVibGljIENyZWF0ZUZpcnN0TGV2ZWwoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVFbGVtZW50KHRoaXMuX2ZpcnN0TGV2ZWxEaXYpO1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsT25lID0gdGhpcy5fcm9vdENhdGVnb3J5SWQ7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVFbGVtZW50KHRoaXMuX3NlY29uZExldmVsRGl2KTtcclxuICAgICAgICB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFR3byA9IHRoaXMuX3Jvb3RDYXRlZ29yeUlkO1xyXG4gICAgICAgIHRoaXMucmVtb3ZlRWxlbWVudCh0aGlzLl90aGlyZExldmVsRGl2KTtcclxuICAgICAgICB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFRocmVlID0gdGhpcy5fcm9vdENhdGVnb3J5SWQ7XHJcblxyXG4gICAgICAgIGxldCB0ZW1wbGF0ZSA9ICQoXCIjXCIrdGhpcy5fZmlyc3RMZXZlbFRlbXBsYXRlKS5odG1sKCk7XHJcbiAgICAgICAgbGV0IGNhdGVnb3JpZXM6IENhdGVnb3J5W10gPSBuZXcgQXJyYXk8Q2F0ZWdvcnk+KCk7XHJcbiAgICAgICAgbGV0IGRhdGEgPSB7Y2F0ZWdvcmllczpjYXRlZ29yaWVzfVxyXG4gICAgICAgIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsT25lID0gdGhpcy5fcm9vdENhdGVnb3J5SWQ7XHJcbiAgICAgICAgdGhpcy5fYWxsQ2F0ZWdvcmllcy5mb3JFYWNoKGNhdGVnb3J5ID0+IHtcclxuICAgICAgICAgICAgaWYgKGNhdGVnb3J5LnBhcmVudENhdGVnb3J5SWQgPT09IHRoaXMuX3Jvb3RDYXRlZ29yeUlkKSB7XHJcbiAgICAgICAgICAgICAgICBjYXRlZ29yaWVzLnB1c2goY2F0ZWdvcnkpO1xyXG4gICAgICAgICAgICB9Ly9pZlxyXG4gICAgICAgIH0pOy8vZm9yRWFjaFxyXG5cclxuICAgICAgICBsZXQgaHRtbCA9IE11c3RhY2hlLnRvX2h0bWwodGVtcGxhdGUsIGRhdGEpO1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9wYXJlbnREaXZJZCkuYXBwZW5kKGh0bWwpO1xyXG5cclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fZmlyc3RMZXZlbFNlbGVjdCkuY2hhbmdlKChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgc2VsZWN0ZWRJZCA9IHBhcnNlSW50KCQoZXZlbnQuY3VycmVudFRhcmdldCkudmFsKCkudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsT25lID0gc2VsZWN0ZWRJZDtcclxuICAgICAgICAgICAgdGhpcy5jcmVhdGVTZWNvbmRMZXZlbChzZWxlY3RlZElkKTtcclxuICAgICAgICAgICAgdGhpcy5TZWxlY3RlZENhdGVnb3J5Q2hhbmdlZEV2ZW50LkRpc3BhdGNoKHRoaXMsIHRoaXMuR2V0U2VsZWN0ZWRDYXRlZ29yeUlkKCkpO1xyXG4gICAgICAgIH0pOy8vY2hhbmdlXHJcblxyXG4gICAgfS8vQ3JlYXRlRmlyc3RMZXZlbFxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlU2Vjb25kTGV2ZWwoZmlyc3RMZXZlbENhdGVnb3J5SWQ6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMucmVtb3ZlRWxlbWVudCh0aGlzLl9zZWNvbmRMZXZlbERpdik7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUd28gPSB0aGlzLl9yb290Q2F0ZWdvcnlJZDtcclxuICAgICAgICB0aGlzLnJlbW92ZUVsZW1lbnQodGhpcy5fdGhpcmRMZXZlbERpdik7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUaHJlZSA9IHRoaXMuX3Jvb3RDYXRlZ29yeUlkO1xyXG4gICAgICAgIGlmIChmaXJzdExldmVsQ2F0ZWdvcnlJZCA9PT0gdGhpcy5fcm9vdENhdGVnb3J5SWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHRlbXBsYXRlID0gJChcIiNcIiArIHRoaXMuX3NlY29uZExldmVsVGVtcGxhdGUpLmh0bWwoKTtcclxuICAgICAgICBsZXQgY2F0ZWdvcmllczogQ2F0ZWdvcnlbXSA9IG5ldyBBcnJheTxDYXRlZ29yeT4oKTtcclxuICAgICAgICBsZXQgZGF0YSA9IHsgY2F0ZWdvcmllczogY2F0ZWdvcmllcyB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5fYWxsQ2F0ZWdvcmllcy5mb3JFYWNoKGNhdGVnb3J5ID0+IHtcclxuICAgICAgICAgICAgaWYgKGNhdGVnb3J5LnBhcmVudENhdGVnb3J5SWQgPT09IGZpcnN0TGV2ZWxDYXRlZ29yeUlkKSB7XHJcbiAgICAgICAgICAgICAgICBjYXRlZ29yaWVzLnB1c2goY2F0ZWdvcnkpO1xyXG4gICAgICAgICAgICB9Ly9pZlxyXG4gICAgICAgIH0pOy8vZm9yRWFjaFxyXG5cclxuICAgICAgICBsZXQgaHRtbCA9IE11c3RhY2hlLnRvX2h0bWwodGVtcGxhdGUsIGRhdGEpO1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9wYXJlbnREaXZJZCkuYXBwZW5kKGh0bWwpO1xyXG5cclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fc2Vjb25kTGV2ZWxTZWxlY3QpLmNoYW5nZSgoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgbGV0IHNlbGVjdGVkSWQgPSBwYXJzZUludCgkKGV2ZW50LmN1cnJlbnRUYXJnZXQpLnZhbCgpLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFR3byA9IHNlbGVjdGVkSWQ7XHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlVGhpcmRMZXZlbChzZWxlY3RlZElkKTtcclxuICAgICAgICAgICAgdGhpcy5TZWxlY3RlZENhdGVnb3J5Q2hhbmdlZEV2ZW50LkRpc3BhdGNoKHRoaXMsIHRoaXMuR2V0U2VsZWN0ZWRDYXRlZ29yeUlkKCkpO1xyXG4gICAgICAgIH0pOy8vY2hhbmdlXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVUaGlyZExldmVsKHNlY29uZExldmVsQ2F0ZWdvcnlJZDogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVFbGVtZW50KHRoaXMuX3RoaXJkTGV2ZWxEaXYpO1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVGhyZWUgPSB0aGlzLl9yb290Q2F0ZWdvcnlJZDtcclxuICAgICAgICBcclxuICAgICAgICBpZiAoc2Vjb25kTGV2ZWxDYXRlZ29yeUlkID09PSB0aGlzLl9yb290Q2F0ZWdvcnlJZCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgdGVtcGxhdGUgPSAkKFwiI1wiICsgdGhpcy5fdGhpcmRMZXZlbFRlbXBsYXRlKS5odG1sKCk7XHJcbiAgICAgICAgbGV0IGNhdGVnb3JpZXM6IENhdGVnb3J5W10gPSBuZXcgQXJyYXk8Q2F0ZWdvcnk+KCk7XHJcbiAgICAgICAgbGV0IGRhdGEgPSB7IGNhdGVnb3JpZXM6IGNhdGVnb3JpZXMgfVxyXG5cclxuICAgICAgICB0aGlzLl9hbGxDYXRlZ29yaWVzLmZvckVhY2goY2F0ZWdvcnkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoY2F0ZWdvcnkucGFyZW50Q2F0ZWdvcnlJZCA9PT0gc2Vjb25kTGV2ZWxDYXRlZ29yeUlkKSB7XHJcbiAgICAgICAgICAgICAgICBjYXRlZ29yaWVzLnB1c2goY2F0ZWdvcnkpO1xyXG4gICAgICAgICAgICB9Ly9pZlxyXG4gICAgICAgIH0pOy8vZm9yRWFjaFxyXG4gICAgICAgIGlmIChjYXRlZ29yaWVzLmxlbmd0aCA9PT0gMCkgey8vTm8gSXRtZSBpbiB0aGlyZCBsZXZlbCBjYXRlZ29yeVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBodG1sID0gTXVzdGFjaGUudG9faHRtbCh0ZW1wbGF0ZSwgZGF0YSk7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX3BhcmVudERpdklkKS5hcHBlbmQoaHRtbCk7XHJcblxyXG4gICAgICAgJChcIiNcIiArIHRoaXMuX3RoaXJkTGV2ZWxTZWxlY3QpLmNoYW5nZSgoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUaHJlZSA9IHBhcnNlSW50KCQoZXZlbnQuY3VycmVudFRhcmdldCkudmFsKCkudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgIHRoaXMuU2VsZWN0ZWRDYXRlZ29yeUNoYW5nZWRFdmVudC5EaXNwYXRjaCh0aGlzLCB0aGlzLkdldFNlbGVjdGVkQ2F0ZWdvcnlJZCgpKTtcclxuICAgICAgICB9KTsvL2NoYW5nZVxyXG4gICAgfVxyXG59XHJcblxyXG4iLCLvu79pbXBvcnQge0Nhck1vZGVsfSBmcm9tIFwiLi4vLi4vTW9kZWxzL0FkVHJhbnNwb3J0YXRpb24vQ2FyTW9kZWxcIjtcclxuaW1wb3J0IHtVc2VySW5wdXR9IGZyb20gXCIuLi8uLi9IZWxwZXIvVXNlcklucHV0XCI7XHJcbmltcG9ydCB7SUNyaXRlcmlhLENyaXRlcmlhVmFsaWRhdG9yfSBmcm9tIFwiLi4vLi4vSGVscGVyL0lDcml0ZXJpYVwiO1xyXG5cclxuaW1wb3J0IHtJQ3JpdGVyaWFDaGFuZ2V9IGZyb20gXCIuLi8uLi9IZWxwZXIvSUNyaXRlcmlhQ2hhbmdlXCI7XHJcblxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBDYXJNb2RlbEJyYW5kQ29udHJvbGxlciBpbXBsZW1lbnRzIElDcml0ZXJpYSB7XHJcbiAgICBWYWxpZGF0ZUNyaXRlcmlhKCk6IENyaXRlcmlhVmFsaWRhdG9yIHsgdGhyb3cgbmV3IEVycm9yKFwiTm90IGltcGxlbWVudGVkXCIpOyB9XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBDYXJCcmFuZElkS2V5OiBzdHJpbmcgPSBcIkJyYW5kSWRcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgQnJhbmRTZWxlY3RJZDogc3RyaW5nID0gXCJicmFuZFwiO1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgQ2FyTW9kZWxUZW1wbGF0ZUlkOiBzdHJpbmcgPSBcIm1vZGVsVGVtcGxhdGVcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgQ2FyTW9kZWxEaXZQbGFjZUhvbGRlcklkOiBzdHJpbmcgPSBcIm1vZGVsUGxhY2VIb2xkZXJcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgQ2FyTW9kZWxJZEtleTogc3RyaW5nID0gXCJDYXJNb2RlbElkXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IEFsbENhck1vZGVsc0lucHV0SWQ6IHN0cmluZyA9IFwiYWxsQ2FyTW9kZWxzXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IE1vZGVsU2VsZWN0SWQ6IHN0cmluZyA9IFwibW9kZWxcIjtcclxuICAgIHByaXZhdGUgX2FsbENhck1vZGVsczogQ2FyTW9kZWxbXTtcclxuXHJcbiAgICBwcml2YXRlIF9zZWFyY2hDcml0ZXJpYUNoYW5nZTpJQ3JpdGVyaWFDaGFuZ2U7XHJcblxyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuaW5pdFZpZXcoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXRWaWV3KCk6IHZvaWQge1xyXG4gICAgICAgIGxldCBhbGxDYXJNb2RlbHNTdHJpbmcgPSAkKFwiI1wiICsgdGhpcy5BbGxDYXJNb2RlbHNJbnB1dElkKS52YWwoKS50b1N0cmluZygpO1xyXG4gICAgICAgIHRoaXMuX2FsbENhck1vZGVscyA9ICQucGFyc2VKU09OKGFsbENhck1vZGVsc1N0cmluZykgYXMgQ2FyTW9kZWxbXTtcclxuICAgICAgICB0aGlzLmluaXRDYXJNb2RlbCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaW5pdENhck1vZGVsKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuY3JlYXRlQ2FyTW9kZWxFbGVtZW50KG5ldyBBcnJheTxDYXJNb2RlbD4oKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVDYXJNb2RlbEVsZW1lbnQoY2FyTW9kZWxzOiBDYXJNb2RlbFtdKSB7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuQ2FyTW9kZWxEaXZQbGFjZUhvbGRlcklkKS5jaGlsZHJlbigpLnJlbW92ZSgpO1xyXG4gICAgICAgIGxldCB0ZW1wbGF0ZSA9ICQoXCIjXCIgKyB0aGlzLkNhck1vZGVsVGVtcGxhdGVJZCkuaHRtbCgpO1xyXG4gICAgICAgIGxldCBkYXRhID0geyBjYXJNb2RlbHM6IGNhck1vZGVscyB9XHJcbiAgICAgICAgbGV0IGh0bWwgPSBNdXN0YWNoZS50b19odG1sKHRlbXBsYXRlLCBkYXRhKTtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5DYXJNb2RlbERpdlBsYWNlSG9sZGVySWQpLmFwcGVuZChodG1sKTtcclxuICAgICAgICB0aGlzLmJpbmRDYXJNb2RlbCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYmluZENhck1vZGVsKCk6IHZvaWQge1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLk1vZGVsU2VsZWN0SWQpLm9uKFwiY2hhbmdlXCIsXHJcbiAgICAgICAgICAgIChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2VhcmNoQ3JpdGVyaWFDaGFuZ2UuQ3VzdG9tQ3JpdGVyaWFDaGFuZ2VkKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlQ2FyTW9kZWxTZWxlY3QoYnJhbmRJZDogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgbGV0IGNhck1vZGVscyA9IG5ldyBBcnJheTxDYXJNb2RlbD4oKTtcclxuICAgICAgICB0aGlzLl9hbGxDYXJNb2RlbHMuZm9yRWFjaCgoY2FyTW9kZWwsIGluZGV4LCBhcnJheSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoY2FyTW9kZWwuYnJhbmRJZCA9PT0gYnJhbmRJZClcclxuICAgICAgICAgICAgICAgIGNhck1vZGVscy5wdXNoKGNhck1vZGVsKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmNyZWF0ZUNhck1vZGVsRWxlbWVudChjYXJNb2RlbHMpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBwdWJsaWMgRmlsbENyaXRlcmlhKHVzZXJJbnB1dDpVc2VySW5wdXQpOnZvaWQge1xyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLkNhckJyYW5kSWRLZXldID1cclxuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuQnJhbmRTZWxlY3RJZCkuZmluZChcIm9wdGlvbjpzZWxlY3RlZFwiKS52YWwoKTsvL2JyYW5kSWRcclxuICAgICAgICB1c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnlbdGhpcy5DYXJNb2RlbElkS2V5XSA9XHJcbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLk1vZGVsU2VsZWN0SWQpLmZpbmQoXCJvcHRpb246c2VsZWN0ZWRcIikudmFsKCk7Ly9jYXJNb2RlbElkXHJcbiAgICB9XHJcblxyXG4gICAgQmluZEV2ZW50cyhjcml0ZXJpYUNoYW5nZTogSUNyaXRlcmlhQ2hhbmdlKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fc2VhcmNoQ3JpdGVyaWFDaGFuZ2UgPSBjcml0ZXJpYUNoYW5nZTtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5CcmFuZFNlbGVjdElkKS5vbihcImNoYW5nZVwiLCAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgbGV0IHNlbGVjdGVkQnJhbmRJZDogbnVtYmVyID0gcGFyc2VJbnQoJChldmVudC5jdXJyZW50VGFyZ2V0KS5maW5kKFwib3B0aW9uOnNlbGVjdGVkXCIpLnZhbCgpLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUNhck1vZGVsU2VsZWN0KHNlbGVjdGVkQnJhbmRJZCk7XHJcbiAgICAgICAgICAgIGNyaXRlcmlhQ2hhbmdlLkN1c3RvbUNyaXRlcmlhQ2hhbmdlZCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmJpbmRDYXJNb2RlbCgpO1xyXG4gICAgfVxyXG5cclxuICAgIFVuQmluZEV2ZW50cygpOiB2b2lkIHtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5CcmFuZFNlbGVjdElkKS5vZmYoXCJjaGFuZ2VcIik7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuTW9kZWxTZWxlY3RJZCkub2ZmKFwiY2hhbmdlXCIpO1xyXG4gICAgfVxyXG59Iiwi77u/aW1wb3J0IHtJRXZlbnR9ICBmcm9tIFwiLi9JRXZlbnRcIjtcclxuXHJcblxyXG4vKiBUaGUgZGlzcGF0Y2hlciBoYW5kbGVzIHRoZSBzdG9yYWdlIG9mIHN1YnNjaXB0aW9ucyBhbmQgZmFjaWxpdGF0ZXNcclxuICBzdWJzY3JpcHRpb24sIHVuc3Vic2NyaXB0aW9uIGFuZCBkaXNwYXRjaGluZyBvZiB0aGUgZXZlbnQgKi9cclxuZXhwb3J0ICBjbGFzcyBFdmVudERpc3BhdGNoZXI8VFNlbmRlciwgVEFyZ3M+IGltcGxlbWVudHMgSUV2ZW50PFRTZW5kZXIsIFRBcmdzPiB7XHJcblxyXG4gICAgcHJpdmF0ZSBfc3Vic2NyaXB0aW9uczogQXJyYXk8KHNlbmRlcjogVFNlbmRlciwgYXJnczogVEFyZ3MpID0+IHZvaWQ+ID0gbmV3IEFycmF5PChzZW5kZXI6IFRTZW5kZXIsIGFyZ3M6IFRBcmdzKSA9PiB2b2lkPigpO1xyXG5cclxuICAgIHB1YmxpYyBTdWJzY3JpYmUoZm46IChzZW5kZXI6IFRTZW5kZXIsIGFyZ3M6IFRBcmdzKSA9PiB2b2lkKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKGZuKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMucHVzaChmbik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyAgVW5zdWJzY3JpYmUoZm46IChzZW5kZXI6IFRTZW5kZXIsIGFyZ3M6IFRBcmdzKSA9PiB2b2lkKTogdm9pZCB7XHJcbiAgICAgICAgbGV0IGkgPSB0aGlzLl9zdWJzY3JpcHRpb25zLmluZGV4T2YoZm4pO1xyXG4gICAgICAgIGlmIChpID4gLTEpIHtcclxuICAgICAgICAgICAgdGhpcy5fc3Vic2NyaXB0aW9ucy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyAgRGlzcGF0Y2goc2VuZGVyOiBUU2VuZGVyLCBhcmdzOiBUQXJncyk6IHZvaWQge1xyXG4gICAgICAgIGZvciAobGV0IGhhbmRsZXIgb2YgdGhpcy5fc3Vic2NyaXB0aW9ucykge1xyXG4gICAgICAgICAgICBoYW5kbGVyKHNlbmRlciwgYXJncyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59Iiwi77u/aW1wb3J0IHsgSUNyaXRlcmlhfSBmcm9tIFwiLi9JQ3JpdGVyaWFcIjtcclxuaW1wb3J0IHsgTnVtZXJpY0RpY3Rpb25hcnkgfSBmcm9tIFwibG9kYXNoL2luZGV4XCI7XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIENyaXRlcmlhTnVtZXJpY0RpY3Rpb25hcnkgaW1wbGVtZW50cyBOdW1lcmljRGljdGlvbmFyeTxJQ3JpdGVyaWE+IHtcclxuICAgIFtpbmRleDogbnVtYmVyXTogSUNyaXRlcmlhO1xyXG59Iiwi77u/aW50ZXJmYWNlIExvb3NlT2JqZWN0IHtcclxuICAgIFtrZXk6IHN0cmluZ106IGFueVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVXNlcklucHV0IHtcclxuICAgIHB1YmxpYyBQYXJhbWV0ZXJzRGljdGlvbmFyeTogTG9vc2VPYmplY3QgPSB7fTtcclxufVxyXG5cclxuXHJcblxyXG4iLCLvu79pbXBvcnQge0FkVHJhbnNmb3JtYXRpb25TZWFyY2hDcml0ZXJpYX0gZnJvbSBcIi4vU2VhcmNoQ3JpdGVyaWEvQWRUcmFuc2Zvcm1hdGlvblNlYXJjaENyaXRlcmlhXCI7XHJcbmltcG9ydCB7RGVmYXVsdFNlYXJjaENyaXRlcmlhfSBmcm9tIFwiLi9TZWFyY2hDcml0ZXJpYS9EZWZhdWx0U2VhcmNoQ3JpdGVyaWFcIjtcclxuaW1wb3J0IHtJQ3JpdGVyaWF9IGZyb20gXCIuLi8uLi8uLi9IZWxwZXIvSUNyaXRlcmlhXCI7XHJcbmltcG9ydCB7VXNlcklucHV0fSBmcm9tIFwiLi4vLi4vLi4vSGVscGVyL1VzZXJJbnB1dFwiO1xyXG5pbXBvcnQge0lDcml0ZXJpYUNoYW5nZX0gZnJvbSBcIi4uLy4uLy4uL0hlbHBlci9JQ3JpdGVyaWFDaGFuZ2VcIjtcclxuaW1wb3J0IHtDcml0ZXJpYU51bWVyaWNEaWN0aW9uYXJ5fSBmcm9tIFwiLi4vLi4vLi4vSGVscGVyL0NyaXRlcmlhTnVtZXJpY0RpY3Rpb25hcnlcIjtcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgU2VhcmNoQ3JpdGVyaWEge1xyXG4gICAgcHJpdmF0ZSBfc2VhcmNoQ3JpdGVyaWFJb2NDb250YWluZXI6IENyaXRlcmlhTnVtZXJpY0RpY3Rpb25hcnkgO1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5fc2VhcmNoQ3JpdGVyaWFJb2NDb250YWluZXIgPSBuZXcgQ3JpdGVyaWFOdW1lcmljRGljdGlvbmFyeSgpO1xyXG4gICAgICAgIHRoaXMuaW5pdFNlYXJjaENyaXRlcmlhSW9jQ29udGFpbmVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbml0U2VhcmNoQ3JpdGVyaWFJb2NDb250YWluZXIoKSB7XHJcbiAgICAgICAgdGhpcy5fc2VhcmNoQ3JpdGVyaWFJb2NDb250YWluZXJbMF0gPSBuZXcgRGVmYXVsdFNlYXJjaENyaXRlcmlhKCk7XHJcbiAgICAgICAgdGhpcy5fc2VhcmNoQ3JpdGVyaWFJb2NDb250YWluZXJbMTAwXSA9IG5ldyBBZFRyYW5zZm9ybWF0aW9uU2VhcmNoQ3JpdGVyaWEoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgRmlsbENhdGVnb3J5U3BlY2lmaWNTZWFyY2hDcml0ZXJpYShjYXRlZ29yeUlkOiBudW1iZXIsIHVzZXJJbnB1dDogVXNlcklucHV0KTogdm9pZCB7XHJcbiAgICAgICAgbGV0IHNlYXJjaENyaXRlcmlhID0gdGhpcy5wb2x5bW9ycGhpY0Rpc3BhdGNoU2VhcmNoQ3JpdGVyaWEoY2F0ZWdvcnlJZCk7XHJcbiAgICAgICAgc2VhcmNoQ3JpdGVyaWEuRmlsbENyaXRlcmlhKHVzZXJJbnB1dCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIEJpbmQoY2F0ZWdvcnlJZDogbnVtYmVyLCBzZWFyY2hDcml0ZXJpYUNoYW5nZTogSUNyaXRlcmlhQ2hhbmdlKSB7XHJcbiAgICAgICAgbGV0IHNlYXJjaENyaXRlcmlhID0gdGhpcy5wb2x5bW9ycGhpY0Rpc3BhdGNoU2VhcmNoQ3JpdGVyaWEoY2F0ZWdvcnlJZCk7XHJcbiAgICAgICAgc2VhcmNoQ3JpdGVyaWEuQmluZEV2ZW50cyhzZWFyY2hDcml0ZXJpYUNoYW5nZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIFVuQmluZChjYXRlZ29yeUlkOm51bWJlcikge1xyXG4gICAgICAgIGxldCBzZWFyY2hDcml0ZXJpYSA9IHRoaXMucG9seW1vcnBoaWNEaXNwYXRjaFNlYXJjaENyaXRlcmlhKGNhdGVnb3J5SWQpO1xyXG4gICAgICAgIHNlYXJjaENyaXRlcmlhLlVuQmluZEV2ZW50cygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcG9seW1vcnBoaWNEaXNwYXRjaFNlYXJjaENyaXRlcmlhKGNhdGVnb3J5SWQ6bnVtYmVyKTogSUNyaXRlcmlhIHtcclxuICAgICAgICBsZXQgcmV0dXJuVmFsdWU6IElDcml0ZXJpYSA9IHRoaXMuX3NlYXJjaENyaXRlcmlhSW9jQ29udGFpbmVyW2NhdGVnb3J5SWRdO1xyXG4gICAgICAgIGlmIChyZXR1cm5WYWx1ZT09PXVuZGVmaW5lZCB8fCByZXR1cm5WYWx1ZT09PW51bGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuVmFsdWUgPSB0aGlzLl9zZWFyY2hDcml0ZXJpYUlvY0NvbnRhaW5lclswXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldHVyblZhbHVlO1xyXG4gICAgfVxyXG59Iiwi77u/aW1wb3J0IHsgUGFydGlhbFZpZXdTZXJ2ZXJDYWxsUGFyYW1ldGVycyB9IGZyb20gXCIuLi8uLi9uZXdBZC9zcmMvTmV3QWRQYXJ0aWFsVmlld0xvYWRlclwiO1xyXG5pbXBvcnQge0lDcml0ZXJpYUNoYW5nZSB9IGZyb20gXCIuLi8uLi8uLi9IZWxwZXIvSUNyaXRlcmlhQ2hhbmdlXCI7XHJcbmltcG9ydCB7U2VhcmNoQ3JpdGVyaWF9IGZyb20gXCIuL1NlYXJjaENyaXRlcmlhXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU2VhcmNoQ3JpdGVyaWFWaWV3TG9hZGVyIHtcclxuICAgIHByaXZhdGUgX3BhcmVudERpdklkOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIF9zZWFyY2hDcml0ZXJpYUNoYW5nZTogSUNyaXRlcmlhQ2hhbmdlO1xyXG4gICAgcHJpdmF0ZSBfdXJsOiBzdHJpbmcgPSBcIi9Ib21lL0dldFNlYXJjaENyaXRlcmlhVmlld1wiO1xyXG4gICAgcHJpdmF0ZSBfcHJldmlvdXNDYXRlZ29yeUlkOm51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIF9jdXJyZW50Q2F0ZWdvcnlJZDogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgX3NlYXJjaENyaXRlcmlhOlNlYXJjaENyaXRlcmlhO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBhcmVudERpdklkOiBzdHJpbmcsIHNlYXJjaENyaXRlcmlhQ2hhbmdlOiBJQ3JpdGVyaWFDaGFuZ2Usc2VhcmNoQ3JpdGVyaWE6U2VhcmNoQ3JpdGVyaWEpIHtcclxuICAgICAgICB0aGlzLl9wYXJlbnREaXZJZCA9IHBhcmVudERpdklkO1xyXG4gICAgICAgIHRoaXMuX3NlYXJjaENyaXRlcmlhQ2hhbmdlID0gc2VhcmNoQ3JpdGVyaWFDaGFuZ2U7XHJcbiAgICAgICAgdGhpcy5fc2VhcmNoQ3JpdGVyaWEgPSBzZWFyY2hDcml0ZXJpYTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgR2V0U2VhcmNoQ3JpdGVyaWFWaWV3RnJvbVNlcnZlcihjYXRlZ29yeUlkOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9jdXJyZW50Q2F0ZWdvcnlJZCA9IGNhdGVnb3J5SWQ7XHJcbiAgICAgICAgbGV0IGNhbGxQYXJhbXMgPSBuZXcgUGFydGlhbFZpZXdTZXJ2ZXJDYWxsUGFyYW1ldGVycygpO1xyXG4gICAgICAgIGNhbGxQYXJhbXMuQ2F0ZWdvcnlJZCA9IGNhdGVnb3J5SWQ7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogXCJHRVRcIiwgLy9HRVQgb3IgUE9TVCBvciBQVVQgb3IgREVMRVRFIHZlcmJcclxuICAgICAgICAgICAgdXJsOiB0aGlzLl91cmwsXHJcbiAgICAgICAgICAgIGRhdGE6IGNhbGxQYXJhbXMsIC8vRGF0YSBzZW50IHRvIHNlcnZlclxyXG4gICAgICAgICAgICAvL2NvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbicsIC8vIGNvbnRlbnQgdHlwZSBzZW50IHRvIHNlcnZlclxyXG4gICAgICAgICAgICBzdWNjZXNzOiAobXNnLCB0ZXh0U3RhdHVzLCBqcVhIUikgPT4gdGhpcy5vblN1Y2Nlc3NHZXRJdGVtc0Zyb21TZXJ2ZXIobXNnLCB0ZXh0U3RhdHVzLCBqcVhIUiksLy9PbiBTdWNjZXNzZnVsbCBzZXJ2aWNlIGNhbGxcclxuICAgICAgICAgICAgZXJyb3I6IChqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pID0+IHRoaXMub25FcnJvckdldEl0ZW1zRnJvbVNlcnZlcihqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pLy8gV2hlbiBTZXJ2aWNlIGNhbGwgZmFpbHNcclxuICAgICAgICB9KTsvLy5hamF4XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICBwcml2YXRlIG9uU3VjY2Vzc0dldEl0ZW1zRnJvbVNlcnZlcihtc2c6IGFueSwgdGV4dFN0YXR1czogc3RyaW5nLCBqcVhIUjogSlF1ZXJ5WEhSKSB7XHJcbiAgICAgICAgdGhpcy5fc2VhcmNoQ3JpdGVyaWEuVW5CaW5kKHRoaXMuX3ByZXZpb3VzQ2F0ZWdvcnlJZCk7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX3BhcmVudERpdklkKS5jaGlsZHJlbigpLnJlbW92ZSgpO1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9wYXJlbnREaXZJZCkuaHRtbChtc2cpO1xyXG4gICAgICAgIHRoaXMuX3NlYXJjaENyaXRlcmlhLkJpbmQodGhpcy5fY3VycmVudENhdGVnb3J5SWQsIHRoaXMuX3NlYXJjaENyaXRlcmlhQ2hhbmdlKTtcclxuICAgICAgICB0aGlzLl9wcmV2aW91c0NhdGVnb3J5SWQgPSB0aGlzLl9jdXJyZW50Q2F0ZWdvcnlJZDtcclxuICAgIH0vL29uU3VjY2Vzc0dldFRpbWVGcm9tU2VydmVyXHJcblxyXG4gICAgcHJpdmF0ZSBvbkVycm9yR2V0SXRlbXNGcm9tU2VydmVyKGpxWEhSOiBKUXVlcnlYSFIsIHRleHRTdGF0dXM6IHN0cmluZywgZXJyb3JUaHJvd246IHN0cmluZykge1xyXG4gICAgICAgIGFsZXJ0KGVycm9yVGhyb3duKTtcclxuICAgIH0vL29uRXJyb3JHZXRUaW1lRnJvbVNlcnZlclxyXG5cclxuICAgIFxyXG4gICAgXHJcbn0iLCLvu79pbXBvcnQgeyBVc2VySW5wdXQgfSBmcm9tIFwiLi4vLi4vLi4vLi4vSGVscGVyL1VzZXJJbnB1dFwiO1xyXG5pbXBvcnQgeyBJQ3JpdGVyaWFDaGFuZ2UgfSBmcm9tIFwiLi4vLi4vLi4vLi4vSGVscGVyL0lDcml0ZXJpYUNoYW5nZVwiO1xyXG5pbXBvcnQgeyBJQ3JpdGVyaWEsIENyaXRlcmlhVmFsaWRhdG9yIH0gZnJvbSBcIi4uLy4uLy4uLy4uL0hlbHBlci9JQ3JpdGVyaWFcIjtcclxuaW1wb3J0IHsgQ2FyTW9kZWxCcmFuZENvbnRyb2xsZXIgfSBmcm9tIFwiLi4vLi4vLi4vLi4vQ29tcG9uZW50cy9UcmFuc2Zvcm1hdGlvbi9DYXJNb2RlbEJyYW5kQ29udHJvbGxlclwiO1xyXG5cclxuXHJcblxyXG5leHBvcnQgY2xhc3MgQWRUcmFuc2Zvcm1hdGlvblNlYXJjaENyaXRlcmlhIGltcGxlbWVudHMgSUNyaXRlcmlhIHtcclxuICAgIFZhbGlkYXRlQ3JpdGVyaWEoKTogQ3JpdGVyaWFWYWxpZGF0b3IgeyB0aHJvdyBuZXcgRXJyb3IoXCJOb3QgaW1wbGVtZW50ZWRcIik7IH1cclxuXHJcbiAgICBwcml2YXRlIF9jYXJNb2RlbEJyYW5kQ29udG9sbGVyOiBDYXJNb2RlbEJyYW5kQ29udHJvbGxlcjtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IE1ha2VZZWFyRnJvbUtleTogc3RyaW5nID0gXCJNYWtlWWVhckZyb21cIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgTWFrZVllYXJGcm9tSW5wdXRJZDogc3RyaW5nID0gXCJmcm9tWWVhclwiO1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgTWFrZVllYXJUb0tleTogc3RyaW5nID0gXCJNYWtlWWVhclRvXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IE1ha2VZZWFyVG9JbnB1dElkOiBzdHJpbmcgPSBcInRvWWVhclwiO1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgRnVlbEtleSA9IFwiRnVlbFwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBGdWVsU2VsZWN0SWQ6IHN0cmluZyA9IFwiZnVlbFwiO1xyXG5cclxuICAgIHB1YmxpYyByZWFkb25seSBNaWxlYWdlRnJvbUtleTogc3RyaW5nID0gXCJNaWxlYWdlRnJvbVwiO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IE1pbGVhZ2VGcm9tSW5wdXRJZDogc3RyaW5nID0gXCJtaWxlYWdlRnJvbVwiO1xyXG5cclxuICAgIHB1YmxpYyByZWFkb25seSBNaWxlYWdlVG9LZXk6IHN0cmluZyA9IFwiTWlsZWFnZVRvXCI7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgTWlsZWFnZVRvSW5wdXRJZDogc3RyaW5nID0gXCJtaWxlYWdlVG9cIjtcclxuXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgR2VhcmJveEtleTogc3RyaW5nID0gXCJHZWFyYm94XCI7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgR2VhcmJveFR5cGVTZWxlY3RJZDogc3RyaW5nID0gXCJnZWFyYm94VHlwZVwiO1xyXG5cclxuICAgIHB1YmxpYyByZWFkb25seSBCb2R5Q29sb3JLZXk6IHN0cmluZyA9IFwiQm9keUNvbG9yXCI7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgQm9keUNvbG9yU2VsZWN0SWQ6IHN0cmluZyA9IFwiYm9keUNvbG9yXCI7XHJcblxyXG4gICAgcHVibGljIHJlYWRvbmx5IEludGVybmFsQ29sb3JLZXk6IHN0cmluZyA9IFwiSW50ZXJuYWxDb2xvclwiO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IEludGVybmFsQ29sb3JTZWxlY3RJZCA9IFwiaW50ZXJuYWxDb2xvclwiO1xyXG5cclxuICAgIHB1YmxpYyByZWFkb25seSBCb2R5U3RhdHVzS2V5OiBzdHJpbmcgPSBcIkJvZHlTdGF0dXNcIjtcclxuICAgIHB1YmxpYyByZWFkb25seSBCb2R5U3RhdHVzU2VsZWN0SWQ6IHN0cmluZyA9IFwiYm9keVN0YXR1c1wiO1xyXG5cclxuICAgIHB1YmxpYyByZWFkb25seSBDYXJTdGF0dXNLZXk6IHN0cmluZyA9IFwiQ2FyU3RhdHVzXCI7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgQ2FyU3RhdHVzU2VsZWN0SWQ6IHN0cmluZyA9IFwiY2FyU3RhdHVzXCI7XHJcblxyXG4gICAgcHVibGljIHJlYWRvbmx5IFBsYXRlVHlwZUtleTogc3RyaW5nID0gXCJQbGF0ZVR5cGVcIjtcclxuICAgIHB1YmxpYyByZWFkb25seSBQbGF0ZVR5cGVTZWxlY3RJZDogc3RyaW5nID0gXCJwbGF0ZVR5cGVcIjtcclxuXHJcbiAgICBwcml2YXRlIGluaXRWaWV3KCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX2Nhck1vZGVsQnJhbmRDb250b2xsZXIgPSBuZXcgQ2FyTW9kZWxCcmFuZENvbnRyb2xsZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICAvL1RPRE8gaW4gb3J0aGVyIHRvIG1pbmltaXplIGJhbmR3aWR0aCB1c2FnZSBpdCBpcyBnb29kIHByY3RpY2UgdG8gbm90IHNlbmQgY3JpdGVyaWFzIHRoYXQgaGF2ZSBkZWZhdWx0IHZhbHVlXHJcbiAgICBwdWJsaWMgRmlsbENyaXRlcmlhKHVzZXJJbnB1dDogVXNlcklucHV0KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fY2FyTW9kZWxCcmFuZENvbnRvbGxlci5GaWxsQ3JpdGVyaWEodXNlcklucHV0KTtcclxuXHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuTWFrZVllYXJGcm9tS2V5XSA9XHJcbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLk1ha2VZZWFyRnJvbUlucHV0SWQpLnZhbCgpOy8vbWFrZVllYXJGcm9tXHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuTWFrZVllYXJUb0tleV0gPVxyXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5NYWtlWWVhclRvSW5wdXRJZCkudmFsKCk7Ly9tYWtlWWVhclRvXHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuRnVlbEtleV0gPVxyXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5GdWVsU2VsZWN0SWQpLmZpbmQoXCJvcHRpb246c2VsZWN0ZWRcIikudmFsKCk7Ly9mdWVsXHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuTWlsZWFnZUZyb21LZXldID1cclxuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuTWlsZWFnZUZyb21JbnB1dElkKS52YWwoKTsvL21pbGVhZ2VGcm9tXHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuTWlsZWFnZVRvS2V5XSA9XHJcbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLk1pbGVhZ2VUb0lucHV0SWQpLnZhbCgpOy8vbWlsZWFnZVRvXHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuR2VhcmJveEtleV0gPVxyXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5HZWFyYm94VHlwZVNlbGVjdElkKS5maW5kKFwib3B0aW9uOnNlbGVjdGVkXCIpLnZhbCgpOy8vZ2VhcmJveFR5cGUgICAgICAgIFxyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLkJvZHlDb2xvcktleV0gPVxyXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5Cb2R5Q29sb3JTZWxlY3RJZCkuZmluZChcIm9wdGlvbjpzZWxlY3RlZFwiKS52YWwoKTsvL2JvZHlDb2xvclxyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLkludGVybmFsQ29sb3JLZXldID1cclxuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuSW50ZXJuYWxDb2xvclNlbGVjdElkKS5maW5kKFwib3B0aW9uOnNlbGVjdGVkXCIpLnZhbCgpOy8vaW50ZXJuYWxDb2xvciAgICAgICAgXHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuQm9keVN0YXR1c0tleV0gPVxyXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5Cb2R5U3RhdHVzU2VsZWN0SWQpLmZpbmQoXCJvcHRpb246c2VsZWN0ZWRcIikudmFsKCk7Ly9ib2R5U3RhdHVzXHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuQ2FyU3RhdHVzS2V5XSA9XHJcbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLkNhclN0YXR1c1NlbGVjdElkKS5maW5kKFwib3B0aW9uOnNlbGVjdGVkXCIpLnZhbCgpOy8vY2FyU3RhdHVzICAgICAgICBcclxuICAgICAgICB1c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnlbdGhpcy5QbGF0ZVR5cGVLZXldID1cclxuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuUGxhdGVUeXBlU2VsZWN0SWQpLmZpbmQoXCJvcHRpb246c2VsZWN0ZWRcIikudmFsKCk7Ly9wbGF0ZVR5cGVcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgQmluZEV2ZW50cyhjcml0ZXJpYUNoYW5nZTogSUNyaXRlcmlhQ2hhbmdlKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5pbml0VmlldygpO1xyXG4gICAgICAgIHRoaXMuX2Nhck1vZGVsQnJhbmRDb250b2xsZXIuQmluZEV2ZW50cyhjcml0ZXJpYUNoYW5nZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIFVuQmluZEV2ZW50cygpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9jYXJNb2RlbEJyYW5kQ29udG9sbGVyLlVuQmluZEV2ZW50cygpO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcbiIsIu+7v2ltcG9ydCB7SUNyaXRlcmlhLENyaXRlcmlhVmFsaWRhdG9yfSBmcm9tIFwiLi4vLi4vLi4vLi4vSGVscGVyL0lDcml0ZXJpYVwiO1xyXG5pbXBvcnQgeyBVc2VySW5wdXQgfSBmcm9tIFwiLi4vLi4vLi4vLi4vSGVscGVyL1VzZXJJbnB1dFwiO1xyXG5pbXBvcnQgeyBJQ3JpdGVyaWFDaGFuZ2UgfSBmcm9tIFwiLi4vLi4vLi4vLi4vSGVscGVyL0lDcml0ZXJpYUNoYW5nZVwiO1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBEZWZhdWx0U2VhcmNoQ3JpdGVyaWEgaW1wbGVtZW50cyBJQ3JpdGVyaWF7XHJcbiAgICBwdWJsaWMgRmlsbENyaXRlcmlhKHVzZXJJbnB1dDogVXNlcklucHV0KTogdm9pZCB7XHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5LmRlZmF1bHRQYXJhbWV0ZXIgPSAxMjM0O1xyXG4gICAgfVxyXG5cclxuICAgIEJpbmRFdmVudHMoY3JpdGVyaWFDaGFuZ2U6IElDcml0ZXJpYUNoYW5nZSk6IHZvaWQge1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIFVuQmluZEV2ZW50cygpOiB2b2lkIHtcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBWYWxpZGF0ZUNyaXRlcmlhKCk6IENyaXRlcmlhVmFsaWRhdG9yIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJOb3QgaW1wbGVtZW50ZWRcIik7XHJcbiAgICB9XHJcbn0iLCLvu79pbXBvcnQgeyBVc2VySW5wdXQgIH0gZnJvbSBcIi4uLy4uLy4uL0hlbHBlci9Vc2VySW5wdXRcIjtcclxuLy9UT0RPIG1ha2UgY291bnQgb3B0aW9uYWwgdG8gdXNlclxyXG5leHBvcnQgY2xhc3MgU2VydmVyQ2FsbGVyIHtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgU3RhcnRJbmRleEtleTogc3RyaW5nID1cIlN0YXJ0SW5kZXhcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2luaXRpYWxTdGFydDogbnVtYmVyID0gMTtcclxuICAgIHByaXZhdGUgX3N0YXJ0OiBudW1iZXIgPSAxO1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgQ291bnRLZXk6IHN0cmluZyA9XCJDb3VudFwiO1xyXG4gICAgcHJpdmF0ZSBfY291bnQ6IG51bWJlciA9IDU7XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBSZXF1ZXN0SW5kZXhLZXk6IHN0cmluZyA9XCJSZXF1ZXN0SW5kZXhcIjtcclxuICAgIHByaXZhdGUgX2N1cnJlbnRSZXF1ZXN0SW5kZXg6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9pbml0aWFsUmVxdWVzdEluZGV4OiBudW1iZXIgPSAwO1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgTnVtYmVyT2ZJdGVtc0tleTogc3RyaW5nID1cIm51bWJlck9mSXRlbXNcIjtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IENhbGxJbWFnZUlkOiBzdHJpbmcgPVwic2VydmVyQ2FsbGVkSW1hZ2VcIjtcclxuICAgIHByaXZhdGUgX2lzU2VydmVyQ2FsbGVkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwcml2YXRlIF9udW1iZXJPZlN0YXJ0U2VydmVyQ2FsbE5vdGlmaWNhdGlvbjogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgIF91cmw6IHN0cmluZyA9IFwiYXBpL0FkQXBpL0dldEFkdmVydGlzZW1lbnRDb21tb25cIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgIF9hZFBsYWNlSG9sZGVyRGl2SWQ6IHN0cmluZyA9XCJhZFBsYWNlSG9sZGVyXCI7XHJcblxyXG4gICAgcHVibGljIEdldEFkSXRlbXNGcm9tU2VydmVyKHVzZXJJbnB1dDogVXNlcklucHV0KTogdm9pZCB7XHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuU3RhcnRJbmRleEtleV0gPSB0aGlzLl9zdGFydDtcclxuICAgICAgICB1c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnlbdGhpcy5Db3VudEtleV0gPSB0aGlzLl9jb3VudDtcclxuICAgICAgICB0aGlzLl9jdXJyZW50UmVxdWVzdEluZGV4Kys7XHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuUmVxdWVzdEluZGV4S2V5XSA9IHRoaXMuX2N1cnJlbnRSZXF1ZXN0SW5kZXg7XHJcbiAgICAgICAgXHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogXCJQT1NUXCIsIC8vR0VUIG9yIFBPU1Qgb3IgUFVUIG9yIERFTEVURSB2ZXJiXHJcbiAgICAgICAgICAgIHVybDogdGhpcy5fdXJsLFxyXG4gICAgICAgICAgICBkYXRhOkpTT04uc3RyaW5naWZ5KHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeSksIC8vRGF0YSBzZW50IHRvIHNlcnZlclxyXG4gICAgICAgICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLCAvLyBjb250ZW50IHR5cGUgc2VudCB0byBzZXJ2ZXJcclxuICAgICAgICAgICAgc3VjY2VzczogKG1zZyx0ZXh0U3RhdHVzLGpxWEhSKT0+IHRoaXMub25TdWNjZXNzR2V0SXRlbXNGcm9tU2VydmVyKG1zZyx0ZXh0U3RhdHVzLGpxWEhSKSwgLy9PbiBTdWNjZXNzZnVsbCBzZXJ2aWNlIGNhbGxcclxuICAgICAgICAgICAgZXJyb3I6IChqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pID0+IHRoaXMub25FcnJvckdldEl0ZW1zRnJvbVNlcnZlcihqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pIC8vIFdoZW4gU2VydmljZSBjYWxsIGZhaWxzXHJcbiAgICAgICAgfSk7IC8vLmFqYXhcclxuICAgICAgICB0aGlzLl9pc1NlcnZlckNhbGxlZCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5ub3RpZnlVc2VyQWpheENhbGxTdGFydGVkKCk7XHJcbiAgICB9IC8vR2V0QWRJdGVtc0Zyb21TZXJ2ZXJcclxuXHJcbiAgICAgXHJcbiAgICBwcml2YXRlIG9uU3VjY2Vzc0dldEl0ZW1zRnJvbVNlcnZlcihtc2c6YW55LHRleHRTdGF0dXM6c3RyaW5nLCBqcVhIUjpKUXVlcnlYSFIpIHtcclxuICAgICAgICAvL1RPRE8gY2hlY2sgZm9yIHVuZGVmaW5lZCBvciBudWxsIGluIG1zZyBhbmQgbXNnLmN1c3RvbURpY3Rpb25hcnlbXCJSZXF1ZXN0SW5kZXhcIl1cclxuICAgICAgICBpZiAodGhpcy5faXNTZXJ2ZXJDYWxsZWQpIHtcclxuICAgICAgICAgICAgaWYgKG1zZy5jdXN0b21EaWN0aW9uYXJ5W3RoaXMuUmVxdWVzdEluZGV4S2V5XSA9PSB0aGlzLl9jdXJyZW50UmVxdWVzdEluZGV4KSB7IC8vbGFzdCBjYWxsIHJlc3BvbnNlXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9pc1NlcnZlckNhbGxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ub3RpZnlVc2VyQWpheENhbGxGaW5pc2hlZCgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKG1zZy5zdWNjZXNzID09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdGFydCArPSBwYXJzZUludChtc2cuY3VzdG9tRGljdGlvbmFyeVt0aGlzLk51bWJlck9mSXRlbXNLZXldKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdGVtcGxhdGUgPSAkKCcjc2luZ2xlQWRJdGVtJykuaHRtbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBkYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbXNnLnJlc3BvbnNlRGF0YS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYWRJbWFnZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtc2cucmVzcG9uc2VEYXRhW2ldLmFkdmVydGlzZW1lbnRJbWFnZXNbMF0gIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRJbWFnZSA9IFwiZGF0YTppbWFnZS9qcGc7YmFzZTY0LFwiICsgbXNnLnJlc3BvbnNlRGF0YVtpXS5hZHZlcnRpc2VtZW50SW1hZ2VzWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IC8vZW5kIGlmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBZHZlcnRpc2VtZW50SWQ6IG1zZy5yZXNwb25zZURhdGFbaV0uYWR2ZXJ0aXNlbWVudElkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQWR2ZXJ0aXNlbWVudENhdGVnb3J5SWQ6IG1zZy5yZXNwb25zZURhdGFbaV0uYWR2ZXJ0aXNlbWVudENhdGVnb3J5SWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBZHZlcnRpc2VtZW50Q2F0ZWdvcnk6IG1zZy5yZXNwb25zZURhdGFbaV0uYWR2ZXJ0aXNlbWVudENhdGVnb3J5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRJbWFnZTogYWRJbWFnZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkUHJpY2U6IG1zZy5yZXNwb25zZURhdGFbaV0uYWR2ZXJ0aXNlbWVudFByaWNlLnByaWNlLCAvL3RvZG8gY2hlY2sgdGhlIHByaWNlIHR5cGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFkdmVydGlzZW1lbnRUaXRsZTogbXNnLnJlc3BvbnNlRGF0YVtpXS5hZHZlcnRpc2VtZW50VGl0bGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBZHZlcnRpc2VtZW50U3RhdHVzOiBtc2cucmVzcG9uc2VEYXRhW2ldLmFkdmVydGlzZW1lbnRTdGF0dXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vYWREYXRlOiBtc2cuUmVzcG9uc2VEYXRhW2ldLkFkVGltZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IC8vZW5kIGRhdGFcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBodG1sID0gTXVzdGFjaGUudG9faHRtbCh0ZW1wbGF0ZSwgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoXCIjXCIgK3RoaXMuX2FkUGxhY2VIb2xkZXJEaXZJZCkuYXBwZW5kKGh0bWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gLy9lbmQgZm9yXHJcbiAgICAgICAgICAgICAgICB9IC8vaWYgKG1zZy5zdWNjZXNzID09IHRydWUpXHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAvL1RPRE8gc2hvdyBlcnJvciBtZXNzYWdlIHRvIHVzZXJcclxuICAgICAgICAgICAgICAgICAgICAvL3Nob3dFcnJvck1lc3NhZ2UobXNnLk1lc3NhZ2UgKyBcIiAsIFwiICsgbXNnLkVycm9yQ29kZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gLy9pZiAobXNnLmN1c3RvbURpY3Rpb25hcnlbXCJSZXF1ZXN0SW5kZXhcIl1cclxuICAgICAgICB9IC8vaWYgKHRoaXMuX2lzU2VydmVyQ2FsbGVkKVxyXG4gICAgfSAvL2VuZCBPblN1Y2Nlc3NHZXRUaW1lRnJvbVNlcnZlclxyXG5cclxuICAgIFxyXG4gICAgcHJpdmF0ZSBvbkVycm9yR2V0SXRlbXNGcm9tU2VydmVyKGpxWEhSOkpRdWVyeVhIUiwgdGV4dFN0YXR1czpzdHJpbmcsIGVycm9yVGhyb3duOnN0cmluZykge1xyXG4gICAgICAgIHRoaXMuX2lzU2VydmVyQ2FsbGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5ub3RpZnlVc2VyQWpheENhbGxGaW5pc2hlZCgpO1xyXG4gICAgICAgIC8vc2hvd0Vycm9yTWVzc2FnZSh0ZXh0U3RhdHVzICsgXCIgLCBcIiArIGVycm9yVGhyb3duKTtcclxuICAgIH0gLy9lbmQgT25FcnJvckdldFRpbWVGcm9tU2VydmVyXHJcblxyXG4gICAgcHVibGljIFJlc2V0U2VhcmNoUGFyYW1ldGVycygpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9zdGFydCA9IHRoaXMuX2luaXRpYWxTdGFydDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG5vdGlmeVVzZXJBamF4Q2FsbFN0YXJ0ZWQoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJTdGFydGVkIEFqYXggQ2FsbFwiKTtcclxuICAgICAgICAkKFwiI1wiK3RoaXMuQ2FsbEltYWdlSWQpLnNob3coKTtcclxuICAgIH1cclxuXHJcbiAgICBub3RpZnlVc2VyQWpheENhbGxGaW5pc2hlZCgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkZpbmlzaGVkIEFqYXggQ2FsbFwiKTtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5DYWxsSW1hZ2VJZCkuaGlkZSgpO1xyXG4gICAgfVxyXG59XHJcblxyXG4iLCLvu79pbXBvcnQgeyBDYXRlZ29yeSB9IGZyb20gXCIuLi8uLi8uLi9Nb2RlbHMvQ2F0ZWdvcnlcIjtcclxuaW1wb3J0IHsgQ2F0ZWdvcnlTZWxlY3Rpb24gfSBmcm9tIFwiLi4vLi4vLi4vQ29tcG9uZW50cy9DYXRlZ29yeS9TZWFyY2hBZC9DYXRlZ29yeVNlbGVjdGlvblwiO1xyXG5pbXBvcnQgeyBTZXJ2ZXJDYWxsZXIgfSBmcm9tIFwiLi9TZXJ2ZXJDYWxsZXJcIjtcclxuaW1wb3J0IHsgU2VhcmNoQ3JpdGVyaWFWaWV3TG9hZGVyfSBmcm9tIFwiLi9TZWFyY2hDcml0ZXJpYVZpZXdMb2FkZXJcIjtcclxuaW1wb3J0IHtTZWFyY2hDcml0ZXJpYX0gZnJvbSBcIi4vU2VhcmNoQ3JpdGVyaWFcIjtcclxuaW1wb3J0IHtJQ3JpdGVyaWFDaGFuZ2V9IGZyb20gXCIuLi8uLi8uLi9IZWxwZXIvSUNyaXRlcmlhQ2hhbmdlXCI7XHJcbmltcG9ydCB7VXNlcklucHV0fSBmcm9tIFwiLi4vLi4vLi4vSGVscGVyL1VzZXJJbnB1dFwiO1xyXG5cclxuXHJcbi8vVE9ETyB3aGVuIGNhdGVnb3J5IGNoYW5nZSBiZWZvcmUgc2VhcmNoIGNyaXRlaWEgaXMgbG9hZGVkIGEgc2VhcmNoIGNhbGwgaXMgc2VudCB0byBzZXJ2ZXJcclxuLy9hZGQgYW4gZXZlbnQgbGlrZSB2aWV3TG9hZFN0YXJ0ZWQsIHZpZXdMb2FkSW5Qcm9ncmVzcyx2aWV3TG9hZENvbXBsZXRlZCBhbmQgZGlzYWJsZSBzZWFyY2hcclxuLy9kdXJuZyBpblByb2dyZXNzIGVuZCBlbmFibGUgaXQgYWZ0ZXIgY29tcGxldGVkXHJcbmV4cG9ydCBjbGFzcyBJbmRleCBpbXBsZW1lbnRzIElDcml0ZXJpYUNoYW5nZSB7XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfb3JkZXJCeVNlbGVjdElkRGl2ID0gXCJvcmRlckJ5XCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9taW5QcmljZUlucHV0SWQ9IFwibWluUHJpY2VcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX21heFByaWNlSW5wdXRJZCA9XCJtYXhQcmljZVwiO1xyXG5cclxuICAgIHByaXZhdGUgX3NlcnZlckNhbGxlcjpTZXJ2ZXJDYWxsZXI7XHJcbiAgICBwcml2YXRlIF9jYXRlZ29yeVNlbGVjdGlvbjogQ2F0ZWdvcnlTZWxlY3Rpb247XHJcbiAgICBwcml2YXRlIF9zZWFyY2hDcml0ZXJpYTpTZWFyY2hDcml0ZXJpYTtcclxuICAgIHByaXZhdGUgX3NlYXJjaENyaXRlcmlhVmlld0xvYWRlcjpTZWFyY2hDcml0ZXJpYVZpZXdMb2FkZXI7XHJcblxyXG4gICAgcHJpdmF0ZSBfY2F0ZWdvcnlTZWxlY3RvclBhcmVudERpdklkOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIF9nZXRBZEZyb21TZXJ2ZXJJZDogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBfYWxsQ2F0ZWdvcmllc0lkOiBzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IoY2F0ZWdvcnlTZWxlY3RvclBhcmVudERpdklkOiBzdHJpbmcsXHJcbiAgICAgICAgYWxsQ2F0ZWdvcmllc0lkOiBzdHJpbmcsXHJcbiAgICAgICAgZ2V0QWRGcm9tU2VydmVySWQ6IHN0cmluZylcclxuICAgIHtcclxuICAgICAgICB0aGlzLl9jYXRlZ29yeVNlbGVjdG9yUGFyZW50RGl2SWQgPSBjYXRlZ29yeVNlbGVjdG9yUGFyZW50RGl2SWQ7XHJcbiAgICAgICAgdGhpcy5fYWxsQ2F0ZWdvcmllc0lkID0gYWxsQ2F0ZWdvcmllc0lkO1xyXG4gICAgICAgIHRoaXMuX2dldEFkRnJvbVNlcnZlcklkID0gZ2V0QWRGcm9tU2VydmVySWQ7XHJcblxyXG4gICAgICAgIHRoaXMuX3NlcnZlckNhbGxlciA9IG5ldyBTZXJ2ZXJDYWxsZXIoKTtcclxuICAgICAgICB0aGlzLl9zZWFyY2hDcml0ZXJpYSA9IG5ldyBTZWFyY2hDcml0ZXJpYSgpO1xyXG4gICAgICAgIHRoaXMuX3NlYXJjaENyaXRlcmlhVmlld0xvYWRlciA9IG5ldyBTZWFyY2hDcml0ZXJpYVZpZXdMb2FkZXIoXCJjYXRlZ29yeVNwZWNpZmljU2VhcmNoQ3JpdGVyaWFcIiwgdGhpcywgdGhpcy5fc2VhcmNoQ3JpdGVyaWEpO1xyXG5cclxuICAgICAgICB0aGlzLmluaXRQYWdlKCk7XHJcbiAgICAgICAgdGhpcy5pbml0RXZlbnRIYW5kbGVycygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaW5pdFBhZ2UoKTogdm9pZCB7XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdENhdGVnb3J5U2VsZWN0aW9uQ29udHJvbCgpO1xyXG4gICAgICAgIHRoaXMuaW5pdEdldEFkRnJvbVNlcnZlcigpO1xyXG4gICAgICAgIHRoaXMuaW5pdFNpbmdsZUFkSXRlbVN0eWxlKCk7XHJcblxyXG4gICAgfS8vaW5pdFBhZ2VcclxuXHJcbiAgICBwcml2YXRlIGluaXRDYXRlZ29yeVNlbGVjdGlvbkNvbnRyb2woKTogdm9pZCB7XHJcbiAgICAgICAgLy9BZGQgZmlyc3QgbGV2ZWwgY2F0ZWdvcmllc1xyXG4gICAgICAgIGxldCBhbGxDYXRlZ29yaWVzU3RyaW5nID0gJChcIiNcIiArIHRoaXMuX2FsbENhdGVnb3JpZXNJZCkudmFsKCkudG9TdHJpbmcoKTtcclxuICAgICAgICBsZXQgYWxsQ2F0ZWdvcmllcyA9ICQucGFyc2VKU09OKGFsbENhdGVnb3JpZXNTdHJpbmcpIGFzIENhdGVnb3J5W107XHJcbiAgICAgICAgdGhpcy5fY2F0ZWdvcnlTZWxlY3Rpb24gPSBuZXcgQ2F0ZWdvcnlTZWxlY3Rpb24odGhpcy5fY2F0ZWdvcnlTZWxlY3RvclBhcmVudERpdklkLCBhbGxDYXRlZ29yaWVzKTtcclxuICAgICAgICB0aGlzLl9jYXRlZ29yeVNlbGVjdGlvbi5DcmVhdGVGaXJzdExldmVsKCk7XHJcblxyXG4gICAgfS8vaW5pdENhdGVnb3J5U2VsZWN0aW9uQ29udHJvbFxyXG5cclxuICAgIHByaXZhdGUgaW5pdEV2ZW50SGFuZGxlcnMoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fY2F0ZWdvcnlTZWxlY3Rpb24uU2VsZWN0ZWRDYXRlZ29yeUNoYW5nZWRFdmVudC5TdWJzY3JpYmUoKHNlbmRlciwgYXJncykgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnNlYXJjaENyaXRlcmlhQ2hhbmdlZCgpO1xyXG4gICAgICAgICAgICB0aGlzLl9zZWFyY2hDcml0ZXJpYVZpZXdMb2FkZXIuR2V0U2VhcmNoQ3JpdGVyaWFWaWV3RnJvbVNlcnZlcihhcmdzKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX29yZGVyQnlTZWxlY3RJZERpdikub24oXCJjaGFuZ2VcIixcclxuICAgICAgICAgICAgKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNlYXJjaENyaXRlcmlhQ2hhbmdlZCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAvL3lvdSBjYW4gYWxzbyB1c2VyIFwiaW5wdXRcIiBpbnN0ZWFkIG9mIFwiY2hhbmdlXCJcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fbWluUHJpY2VJbnB1dElkKS5vbihcImlucHV0XCIsXHJcbiAgICAgICAgICAgIChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZWFyY2hDcml0ZXJpYUNoYW5nZWQoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX21heFByaWNlSW5wdXRJZCkub24oXCJjaGFuZ2VcIixcclxuICAgICAgICAgICAgKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNlYXJjaENyaXRlcmlhQ2hhbmdlZCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgQ3VzdG9tQ3JpdGVyaWFDaGFuZ2VkKCk6dm9pZCB7XHJcbiAgICAgICAgdGhpcy5zZWFyY2hDcml0ZXJpYUNoYW5nZWQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNlYXJjaENyaXRlcmlhQ2hhbmdlZCgpOiB2b2lkIHtcclxuICAgICAgICAkKFwiI2FkUGxhY2VIb2xkZXJcIikuY2hpbGRyZW4oKS5yZW1vdmUoKTtcclxuICAgICAgICB0aGlzLl9zZXJ2ZXJDYWxsZXIuUmVzZXRTZWFyY2hQYXJhbWV0ZXJzKCk7XHJcbiAgICAgICAvLyAkKFwiI1wiICsgdGhpcy5fZ2V0QWRGcm9tU2VydmVySWQpLnRyaWdnZXIoXCJjbGlja1wiKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbml0R2V0QWRGcm9tU2VydmVyKCk6IHZvaWQge1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9nZXRBZEZyb21TZXJ2ZXJJZCkub24oXCJjbGlja1wiLCAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgbGV0IHVzZXJJbnB1dCA9IG5ldyBVc2VySW5wdXQoKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBjYXRlZ29yeUlkID0gdGhpcy5fY2F0ZWdvcnlTZWxlY3Rpb24uR2V0U2VsZWN0ZWRDYXRlZ29yeUlkKCk7XHJcbiAgICAgICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeS5DYXRlZ29yeUlkID0gY2F0ZWdvcnlJZDsvLzEwMCBmb3IgY2Fyc1xyXG5cclxuICAgICAgICAgICAgbGV0IG1pblByaWNlID0gcGFyc2VJbnQoJChcIiNtaW5QcmljZVwiKS52YWwoKS50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5Lk1pbmltdW1QcmljZSA9IG1pblByaWNlO1xyXG5cclxuICAgICAgICAgICAgbGV0IG1heFByaWNlID0gcGFyc2VJbnQoJChcIiNtYXhQcmljZVwiKS52YWwoKS50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5Lk1heGltdW1QcmljZSA9IG1heFByaWNlO1xyXG5cclxuICAgICAgICAgICAgbGV0IG9yZGVyQnkgPSAkKFwiI29yZGVyQnlcIikudmFsKCkudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5Lk9yZGVyQnkgPSBvcmRlckJ5O1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5fc2VhcmNoQ3JpdGVyaWEuRmlsbENhdGVnb3J5U3BlY2lmaWNTZWFyY2hDcml0ZXJpYShjYXRlZ29yeUlkLCB1c2VySW5wdXQpOy8vZmlsbCBjYXRlZ29yeSBzcGVjaWZpYyBzZWFyY2ggcGFyYW1ldGVyc1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5fc2VydmVyQ2FsbGVyLkdldEFkSXRlbXNGcm9tU2VydmVyKHVzZXJJbnB1dCk7XHJcbiAgICAgICAgfSk7IC8vY2xpY2tcclxuICAgIH0vL2luaXRHZXRBZEZyb21TZXJ2ZXJcclxuXHJcbiAgIFxyXG5cclxuICAgIHByaXZhdGUgaW5pdFNpbmdsZUFkSXRlbVN0eWxlKCk6IHZvaWQge1xyXG4gICAgICAgIC8vc2hvdyBkZXRhaWwgb2Ygc2luZ2xlQWRJdGVtIHdoZW4gbW91c2Ugb3ZlclxyXG4gICAgICAgICQoZG9jdW1lbnQpLm9uKFwibW91c2VlbnRlciBtb3VzZWxlYXZlXCIsIFwiLmJsb2NrRGlzcGxheVwiLCAoZXZlbnQ6IEpRdWVyeS5FdmVudDxIVE1MRWxlbWVudCwgbnVsbD4pID0+IHtcclxuICAgICAgICAgICAgJChldmVudC5jdXJyZW50VGFyZ2V0KS5maW5kKFwiLm1vcmVJbmZvXCIpLmZhZGVUb2dnbGUoMjUwKTtcclxuICAgICAgICAgICAgLy8kKHRoaXMpLmZpbmQoXCIubW9yZUluZm9cIikuZmFkZVRvZ2dsZSgyNTApO1xyXG4gICAgICAgIH0pOy8vZW5kIG9uXHJcbiAgICB9Ly9pbml0U2luZ2xlQWRJdGVtU3R5bGVcclxufVxyXG5cclxubGV0IGNhdGVnb3J5U2VsZWN0b3JQYXJlbnREaXZJZDogc3RyaW5nID0gXCJjYXRlZ29yeVNlbGVjdG9yXCI7XHJcbmxldCBnZXRBZEZyb21TZXJ2ZXJJZCA9IFwiZ2V0QWRGcm9tU2VydmVyXCI7XHJcbmxldCBhbGxDYXRlZ29yaWVzSWQgPSBcImFsbENhdGVnb3JpZXNcIjtcclxuXHJcbiQoZG9jdW1lbnQpLnJlYWR5KCgpID0+IHtcclxuICAgIGxldCBpbmRleCA9IG5ldyBJbmRleChjYXRlZ29yeVNlbGVjdG9yUGFyZW50RGl2SWQsIGFsbENhdGVnb3JpZXNJZCwgZ2V0QWRGcm9tU2VydmVySWQpO1xyXG4gICAgaW5kZXguQ3VzdG9tQ3JpdGVyaWFDaGFuZ2VkKCk7Ly90byBpbml0aWF0ZSBhIHNlcnZlciBjYWxsIG9uIHBhZ2UgbG9hZCBmb3IgZmlyc3QgdGltZVxyXG59KTsvL3JlYWR5XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiIsIu+7v2ltcG9ydCB7TmV3QWRDcml0ZXJpYX0gZnJvbSBcIi4vTmV3QWRDcml0ZXJpYVwiO1xyXG5pbXBvcnQge0lDcml0ZXJpYUNoYW5nZX0gZnJvbSBcIi4uLy4uLy4uL0hlbHBlci9JQ3JpdGVyaWFDaGFuZ2VcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBOZXdBZFBhcnRpYWxWaWV3TG9hZGVyIHtcclxuICAgIHByaXZhdGUgX3BhcnRpYWxWaWV3RGl2SWQ6IHN0cmluZztcclxuICAgIHByaXZhdGUgX3VybDogc3RyaW5nID0gXCIvSG9tZS9HZXROZXdBZFBhcnRpYWxWaWV3XCI7XHJcbiAgICBwcml2YXRlIF9wcmV2aW91c0NhdGVnb3J5SWQ6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIF9jdXJyZW50Q2F0ZWdvcnlJZDogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgX25ld0FkQ3JpdGVyaWFDaGFuZ2U6IElDcml0ZXJpYUNoYW5nZTtcclxuICAgIHByaXZhdGUgX25ld0FkQ3JpdGVyaWE6IE5ld0FkQ3JpdGVyaWE7XHJcblxyXG4gICAgY29uc3RydWN0b3IocGFydGlhbFZpZXdEaXZJZDogc3RyaW5nLCBuZXdBZENyaXRlcmlhQ2hhbmdlOiBJQ3JpdGVyaWFDaGFuZ2UsIG5ld0FkQ3JpdGVyaWE6TmV3QWRDcml0ZXJpYSkge1xyXG4gICAgICAgIHRoaXMuX3BhcnRpYWxWaWV3RGl2SWQgPSBwYXJ0aWFsVmlld0RpdklkO1xyXG4gICAgICAgIHRoaXMuX25ld0FkQ3JpdGVyaWFDaGFuZ2UgPSBuZXdBZENyaXRlcmlhQ2hhbmdlO1xyXG4gICAgICAgIHRoaXMuX25ld0FkQ3JpdGVyaWEgPSBuZXdBZENyaXRlcmlhO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBHZXRQYXJ0aWFsVmlld0Zyb21TZXJ2ZXIoY2F0ZWdvcnlJZDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fY3VycmVudENhdGVnb3J5SWQgPSBjYXRlZ29yeUlkO1xyXG4gICAgICAgIGxldCBjYWxsUGFyYW1zID0gbmV3IFBhcnRpYWxWaWV3U2VydmVyQ2FsbFBhcmFtZXRlcnMoKTtcclxuICAgICAgICBjYWxsUGFyYW1zLkNhdGVnb3J5SWQgPSBjYXRlZ29yeUlkO1xyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6IFwiR0VUXCIsIC8vR0VUIG9yIFBPU1Qgb3IgUFVUIG9yIERFTEVURSB2ZXJiXHJcbiAgICAgICAgICAgIHVybDogdGhpcy5fdXJsLFxyXG4gICAgICAgICAgICBkYXRhOiBjYWxsUGFyYW1zLCAvL0RhdGEgc2VudCB0byBzZXJ2ZXJcclxuICAgICAgICAgICAgLy9jb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLCAvLyBjb250ZW50IHR5cGUgc2VudCB0byBzZXJ2ZXJcclxuICAgICAgICAgICAgc3VjY2VzczogKG1zZywgdGV4dFN0YXR1cywganFYSFIpID0+IHRoaXMub25TdWNjZXNzR2V0SXRlbXNGcm9tU2VydmVyKG1zZywgdGV4dFN0YXR1cywganFYSFIpLC8vT24gU3VjY2Vzc2Z1bGwgc2VydmljZSBjYWxsXHJcbiAgICAgICAgICAgIGVycm9yOiAoanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKSA9PiB0aGlzLm9uRXJyb3JHZXRJdGVtc0Zyb21TZXJ2ZXIoanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKS8vIFdoZW4gU2VydmljZSBjYWxsIGZhaWxzXHJcbiAgICAgICAgfSk7Ly8uYWpheFxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25TdWNjZXNzR2V0SXRlbXNGcm9tU2VydmVyKG1zZzogYW55LCB0ZXh0U3RhdHVzOiBzdHJpbmcsIGpxWEhSOiBKUXVlcnlYSFIpIHtcclxuICAgICAgICB0aGlzLl9uZXdBZENyaXRlcmlhLlVuQmluZCh0aGlzLl9wcmV2aW91c0NhdGVnb3J5SWQpO1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9wYXJ0aWFsVmlld0RpdklkKS5jaGlsZHJlbigpLnJlbW92ZSgpO1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9wYXJ0aWFsVmlld0RpdklkKS5odG1sKG1zZyk7XHJcbiAgICAgICAgdGhpcy5fbmV3QWRDcml0ZXJpYS5CaW5kKHRoaXMuX2N1cnJlbnRDYXRlZ29yeUlkLCB0aGlzLl9uZXdBZENyaXRlcmlhQ2hhbmdlKTtcclxuICAgICAgICB0aGlzLl9wcmV2aW91c0NhdGVnb3J5SWQgPSB0aGlzLl9jdXJyZW50Q2F0ZWdvcnlJZDtcclxuICAgIH0vL29uU3VjY2Vzc0dldFRpbWVGcm9tU2VydmVyXHJcblxyXG4gICAgcHJpdmF0ZSBvbkVycm9yR2V0SXRlbXNGcm9tU2VydmVyKGpxWEhSOiBKUXVlcnlYSFIsIHRleHRTdGF0dXM6IHN0cmluZywgZXJyb3JUaHJvd246IHN0cmluZykge1xyXG4gICAgICAgIGFsZXJ0KGVycm9yVGhyb3duKTtcclxuICAgIH0vL29uRXJyb3JHZXRUaW1lRnJvbVNlcnZlclxyXG59XHJcblxyXG4vL1RPRE8gcmVmYWN0b3IgdGhpc1xyXG5leHBvcnQgY2xhc3MgUGFydGlhbFZpZXdTZXJ2ZXJDYWxsUGFyYW1ldGVycyB7XHJcbiAgICBwdWJsaWMgQ2F0ZWdvcnlJZDpudW1iZXI7XHJcbn0iXX0=
