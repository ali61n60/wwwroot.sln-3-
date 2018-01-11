(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//TODO merge this class with CategorySelection Class
var EventDispatcher_1 = require("../../../Events/EventDispatcher");
var CategorySelectionNewAd = /** @class */ (function () {
    function CategorySelectionNewAd(parentDivId, allCategories) {
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
    CategorySelectionNewAd.prototype.InsertCategoryIdInUserInputDictionary = function (userInput) {
        var categoryId = this.GetSelectedCategoryId();
        userInput.ParametersDictionary[this.CategoryIdKey] = categoryId; //100 for cars
    };
    CategorySelectionNewAd.prototype.GetSelectedCategoryId = function () {
        if (this._selectedCategoryIdLevelThree !== undefined &&
            this._selectedCategoryIdLevelThree !== this._rootCategoryId)
            return this._selectedCategoryIdLevelThree;
        else if (this._selectedCategoryIdLevelTwo !== undefined &&
            this._selectedCategoryIdLevelTwo !== this._rootCategoryId)
            return this._selectedCategoryIdLevelTwo;
        else
            return this._selectedCategoryIdLevelOne;
    }; //GetSelectedCategoryId
    CategorySelectionNewAd.prototype.SelectedCategoryHasChildren = function () {
        var selectedCategoryId = this.GetSelectedCategoryId();
        return this._allCategories.filter(function (category) { return category.parentCategoryId === selectedCategoryId; }).length > 0;
    };
    CategorySelectionNewAd.prototype.CreateFirstLevel = function () {
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
    CategorySelectionNewAd.prototype.createSecondLevel = function (firstLevelCategoryId) {
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
    CategorySelectionNewAd.prototype.createThirdLevel = function (secondLevelCategoryId) {
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
    CategorySelectionNewAd.prototype.removeElement = function (id) {
        $("#" + id).remove();
    };
    return CategorySelectionNewAd;
}());
exports.CategorySelectionNewAd = CategorySelectionNewAd;
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
//TODO remove uploade image from server
var ImageUploader = /** @class */ (function () {
    function ImageUploader(currentNewAdGuid) {
        this.NewAdGuidKey = "NewAdGuid";
        this.RequestIndexKey = "RequestIndex";
        this.ImageUploadInputId = "imageUpload";
        this.MessageToUserDivId = "labelMessageToUser";
        this.LoadedImagesDivId = "loadedImageView";
        this.UploadingImageTemplate = "uploadingImageTemplate";
        this._sendFilesToServerUrl = "/api/AdApi/AddTempImage";
        this._removeFileFromServerUrl = "/api/AdApi/RemoveTempImage";
        this._requestIndex = 0;
        this.ValidUploadTime = 20000;
        this._currentNewAdGuid = currentNewAdGuid;
        this.initView();
    }
    ImageUploader.prototype.initView = function () {
        var _this = this;
        $("#" + this.ImageUploadInputId).change(function (event) {
            var fileUpload = $("#" + _this.ImageUploadInputId).get(0);
            var files = fileUpload.files;
            _this.sendFilesToServer(files);
        });
        $(document).on("click", ".addedImage > input", function (event) {
            _this.removeImageFromServer($(event.currentTarget).parent().attr("id").toString());
        });
    };
    ImageUploader.prototype.sendFilesToServer = function (fileList) {
        var _this = this;
        this._requestIndex++;
        var data = new FormData();
        data.append(this.NewAdGuidKey, this._currentNewAdGuid);
        data.append(this.RequestIndexKey, this._requestIndex.toString());
        for (var i = 0; i < fileList.length; i++) {
            data.append(fileList[i].name, fileList[i]);
        } //for
        $.ajax({
            type: "POST",
            url: this._sendFilesToServerUrl,
            contentType: false,
            processData: false,
            data: data,
            success: function (msg, textStatus, jqXHR) { return _this.onSuccessSendFileToServer(msg, textStatus, jqXHR); },
            error: function (jqXHR, textStatus, errorThrown) { return _this.onErrorSendFileToServer(jqXHR, textStatus, errorThrown); } // When Service call fails
        }); //ajax
        this.addUploadingImageTemplate(this._requestIndex);
    };
    ImageUploader.prototype.onSuccessSendFileToServer = function (msg, textStatus, jqXHR) {
        $("#" + this.ImageUploadInputId).val("");
        if (msg.success == true) {
            this.updateSendingImageTemplate(msg.responseData);
        }
        else {
            this.showMessageToUser(msg.messag + " ," + msg.errorCode);
            this.uploadImageTimerExpire(parseInt(msg.responseData.requestIndex));
        }
    };
    ImageUploader.prototype.onErrorSendFileToServer = function (jqXHR, textStatus, errorThrown) {
        this.showMessageToUser("خطا در ارسال"); //magic string
    };
    ImageUploader.prototype.addUploadingImageTemplate = function (requestIndex) {
        var template = $("#" + this.UploadingImageTemplate).html(); //magic string
        var data = { RequestIndex: requestIndex }; //magic string
        var html = Mustache.to_html(template, data);
        $("#" + this.LoadedImagesDivId).append(html);
        setTimeout(this.uploadImageTimerExpire, this.ValidUploadTime, this._requestIndex);
    };
    ImageUploader.prototype.uploadImageTimerExpire = function (uploadRequestIndex) {
        if ($("#loadedImageView > #uploadingImage" + uploadRequestIndex + " > img").hasClass("gifImage")) {
            $("#loadedImageView > #uploadingImage" + uploadRequestIndex).remove();
        }
    };
    ImageUploader.prototype.updateSendingImageTemplate = function (data) {
        if ($("#loadedImageView > #uploadingImage" + data.requestIndex).length === 0) {
            this.addUploadingImageTemplate(parseInt(data.requestIndex));
            this.updateSendingImageTemplate(data);
        }
        else {
            //TODO cancel timer
            $("#loadedImageView > #uploadingImage" + data.requestIndex + " >img")
                .attr("src", "data:image/jpg;base64," + data.image).removeClass("gifImage");
            $("#loadedImageView > #uploadingImage" + data.requestIndex).attr("id", data.imageFileName);
        }
    };
    ImageUploader.prototype.removeImageFromServer = function (fileName) {
        var _this = this;
        alert(fileName);
        var callParams = {
            FileNameToBeRemoved: fileName,
            NewAdGuid: this._currentNewAdGuid
        };
        $.ajax({
            type: "GET",
            url: this._removeFileFromServerUrl,
            data: callParams,
            success: function (msg, textStatus, jqXHR) { return _this.onSuccessRemoveFileFromServer(msg, textStatus, jqXHR); },
            error: function (jqXHR, textStatus, errorThrown) { return _this.onErrorRemoveFileFromServer(jqXHR, textStatus, errorThrown); } // When Service call fails
        }); //.ajax
        this.showMessageToUser("removing file from server");
    };
    ImageUploader.prototype.onSuccessRemoveFileFromServer = function (msg, textStatus, jqXHR) {
        if (msg.success == true) {
            this.showMessageToUser("done removing file from server");
            var fileName = msg.responseData;
            $("[id=\"" + fileName + "\"]").remove();
        }
        else {
            this.showMessageToUser(msg.message);
        }
    };
    ImageUploader.prototype.onErrorRemoveFileFromServer = function (jqXHR, textStatus, errorThrown) {
        this.showMessageToUser("error, " + errorThrown);
    };
    ImageUploader.prototype.showMessageToUser = function (msg) {
        $("#" + this.MessageToUserDivId).html(msg);
    };
    return ImageUploader;
}());
exports.ImageUploader = ImageUploader;
var UploadedImage = /** @class */ (function () {
    function UploadedImage() {
    }
    return UploadedImage;
}());
},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CriteriaNumericDictionary_1 = require("../../../Helper/CriteriaNumericDictionary");
var DefaultNewAdCriteria_1 = require("./NewAdCriteria/DefaultNewAdCriteria");
var AdTransformationNewAdCriteria_1 = require("./NewAdCriteria/AdTransformationNewAdCriteria");
var NewAdCriteria = /** @class */ (function () {
    function NewAdCriteria() {
        this._newAdCriteriaIocContainer = new CriteriaNumericDictionary_1.CriteriaNumericDictionary();
        this.initNewAdCriteriaIocContainer();
    }
    NewAdCriteria.prototype.initNewAdCriteriaIocContainer = function () {
        this._newAdCriteriaIocContainer[0] = new DefaultNewAdCriteria_1.DefaultNewAdCriteria();
        this._newAdCriteriaIocContainer[100] = new AdTransformationNewAdCriteria_1.AdTransformationNewAdCriteria();
    };
    NewAdCriteria.prototype.FillCategorySpecificNewAdCriteria = function (categoryId, userInput) {
        var newAdCriteria = this.polymorphicDispatchNewAdCriteria(categoryId);
        newAdCriteria.FillCriteria(userInput);
    };
    NewAdCriteria.prototype.Bind = function (categoryId, criteriaChange) {
        var criteria = this.polymorphicDispatchNewAdCriteria(categoryId);
        criteria.BindEvents(criteriaChange);
    };
    NewAdCriteria.prototype.UnBind = function (categoryId) {
        var criteria = this.polymorphicDispatchNewAdCriteria(categoryId);
        criteria.UnBindEvents();
    };
    NewAdCriteria.prototype.polymorphicDispatchNewAdCriteria = function (categoryId) {
        var returnValue = this._newAdCriteriaIocContainer[categoryId];
        if (returnValue === undefined || returnValue === null) {
            returnValue = this._newAdCriteriaIocContainer[0];
        }
        return returnValue;
    };
    return NewAdCriteria;
}());
exports.NewAdCriteria = NewAdCriteria;
},{"../../../Helper/CriteriaNumericDictionary":4,"./NewAdCriteria/AdTransformationNewAdCriteria":8,"./NewAdCriteria/DefaultNewAdCriteria":9}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CarModelBrandController_1 = require("../../../../Components/Transformation/CarModelBrandController");
var AdTransformationNewAdCriteria = /** @class */ (function () {
    function AdTransformationNewAdCriteria() {
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
    AdTransformationNewAdCriteria.prototype.ValidateCriteria = function () { throw new Error("Not implemented"); };
    AdTransformationNewAdCriteria.prototype.initView = function () {
        this._carModelBrandContoller = new CarModelBrandController_1.CarModelBrandController();
    };
    AdTransformationNewAdCriteria.prototype.FillCriteria = function (userInput) {
        //TODO validate user input then proceed
        this._carModelBrandContoller.FillCriteria(userInput);
        userInput.ParametersDictionary[this.MakeYearKey] = $("#" + this.MakeYearInputId).val(); //MakeYear
        userInput.ParametersDictionary[this.FuelKey] = $("#" + this.FuelSelectId).find("option:selected").val(); //Fuel
        userInput.ParametersDictionary[this.MileageKey] = $("#" + this.MileageInputId).val(); //Mileage
        userInput.ParametersDictionary[this.GearboxKey] = $("#" + this.GearboxTypeParentDivId).children(":checked").val();
        userInput.ParametersDictionary[this.BodyColorKey] = $("#" + this.BodyColorSelectId).find("option:selected").val();
        userInput.ParametersDictionary[this.InternalColorKey] = $("#" + this.InternalColorSelectId).find("option:selected").val();
        userInput.ParametersDictionary[this.BodyStatusKey] = $("#" + this.BodyStatusSelectId).find("option:selected").val();
        userInput.ParametersDictionary[this.CarStatusKey] = $("#" + this.CarStatusParentDivId).children(":checked").val();
        userInput.ParametersDictionary[this.PlateTypeKey] = $("#" + this.PlateTypeParentDivId).children(":checked").val();
    };
    AdTransformationNewAdCriteria.prototype.BindEvents = function (criteriaChange) {
        this.initView();
        this._carModelBrandContoller.BindEvents(criteriaChange);
    };
    AdTransformationNewAdCriteria.prototype.UnBindEvents = function () {
        this._carModelBrandContoller.UnBindEvents();
    };
    return AdTransformationNewAdCriteria;
}());
exports.AdTransformationNewAdCriteria = AdTransformationNewAdCriteria;
},{"../../../../Components/Transformation/CarModelBrandController":2}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DefaultNewAdCriteria = /** @class */ (function () {
    function DefaultNewAdCriteria() {
    }
    DefaultNewAdCriteria.prototype.FillCriteria = function (searchAdUserInput) {
    };
    DefaultNewAdCriteria.prototype.BindEvents = function (criteriaChange) {
    };
    DefaultNewAdCriteria.prototype.UnBindEvents = function () {
    };
    DefaultNewAdCriteria.prototype.ValidateCriteria = function () {
        throw new Error("Not implemented");
    };
    return DefaultNewAdCriteria;
}());
exports.DefaultNewAdCriteria = DefaultNewAdCriteria;
},{}],10:[function(require,module,exports){
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
},{}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NewAdServerCaller = /** @class */ (function () {
    function NewAdServerCaller() {
        //TODO call server and send userinput fro new ad
        //get result and show to user
        this._url = "/api/AdApi/AddAdvertisement";
    }
    NewAdServerCaller.prototype.SaveAd = function (userInput) {
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
    NewAdServerCaller.prototype.onSuccessGetItemsFromServer = function (msg, textStatus, jqXHR) {
        //TODO redirect user to a new page
        if (msg.success == true) {
            document.location.replace("/Home/LetMeKnow");
        }
    };
    NewAdServerCaller.prototype.onErrorGetItemsFromServer = function (jqXHR, textStatus, errorThrown) {
        //TODO inform error to user
    };
    return NewAdServerCaller;
}());
exports.NewAdServerCaller = NewAdServerCaller;
},{}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CategorySelectionNewAd_1 = require("../../../Components/Category/NewAd/CategorySelectionNewAd");
var NewAdPartialViewLoader_1 = require("./NewAdPartialViewLoader");
var NewAdCriteria_1 = require("./NewAdCriteria");
var ImageUploader_1 = require("./ImageUploader");
var UserInput_1 = require("../../../Helper/UserInput");
var NewAdServerCaller_1 = require("./NewAdServerCaller");
var NewAd = /** @class */ (function () {
    function NewAd(allCategoriesDiv, allCategoriesInputId, categorySpecificPartialViewId) {
        this.AdTitleKey = "AdTitle";
        this.AdTitleInputId = "adTitle";
        this.AdCommentKey = "AdComment";
        this.AdCommentInputId = "adComment";
        this._submitAdInputId = "submitNewAd";
        this.CurrentNewAdGuidInputId = "currentNewAdGuid";
        this._allCategoriesDivId = allCategoriesDiv;
        this._allCategoriesInputId = allCategoriesInputId;
        this._categorySpecificPartialViewId = categorySpecificPartialViewId;
        this._newAdCriteria = new NewAdCriteria_1.NewAdCriteria();
        this.initPage();
        this._imageUploader = new ImageUploader_1.ImageUploader(this._currentNewAdGuid);
        this._newAdServerCaller = new NewAdServerCaller_1.NewAdServerCaller();
        this.initEventHandlers();
    }
    NewAd.prototype.CustomCriteriaChanged = function () {
    };
    NewAd.prototype.initPage = function () {
        this.initNewAdCategory();
        this._partialViewLoader = new NewAdPartialViewLoader_1.NewAdPartialViewLoader(this._categorySpecificPartialViewId, this, this._newAdCriteria);
        this._currentNewAdGuid = $("#" + this.CurrentNewAdGuidInputId).val().toString();
    };
    NewAd.prototype.initNewAdCategory = function () {
        var allCategoriesString = $("#" + this._allCategoriesInputId).val().toString();
        var allCategories = $.parseJSON(allCategoriesString);
        this._categorySelectionNewAd = new CategorySelectionNewAd_1.CategorySelectionNewAd(this._allCategoriesDivId, allCategories);
        this._categorySelectionNewAd.CreateFirstLevel();
    };
    NewAd.prototype.initEventHandlers = function () {
        var _this = this;
        this._categorySelectionNewAd.SelectedCategoryChangedEvent.Subscribe(function (sender, args) {
            if (!_this._categorySelectionNewAd.SelectedCategoryHasChildren()) {
                _this._partialViewLoader.GetPartialViewFromServer(args);
            }
        });
        $("#" + this._submitAdInputId).on("click", function (event) {
            event.preventDefault();
            _this.submitAd();
        });
    };
    NewAd.prototype.submitAd = function () {
        //TODO disable submitAd Button until current submission is ok or errornous 
        var userInput = new UserInput_1.UserInput();
        userInput.ParametersDictionary["NewAdGuid"] = this._currentNewAdGuid;
        this._categorySelectionNewAd.InsertCategoryIdInUserInputDictionary(userInput);
        userInput.ParametersDictionary[this.AdTitleKey] = $("#" + this.AdTitleInputId).val();
        userInput.ParametersDictionary[this.AdCommentKey] = $("#" + this.AdCommentInputId).val();
        this._newAdCriteria.FillCategorySpecificNewAdCriteria(this._categorySelectionNewAd.GetSelectedCategoryId(), userInput);
        this._newAdServerCaller.SaveAd(userInput);
    };
    return NewAd;
}());
var allCategoriesDivId = "allCategoriesDiv";
var allCategoriesInputId = "allCategoriesInput";
var categorySpecificPartialViewId = "CategorySpecificCriteria";
$(document).ready(function () {
    var newAd = new NewAd(allCategoriesDivId, allCategoriesInputId, categorySpecificPartialViewId);
}); //ready
},{"../../../Components/Category/NewAd/CategorySelectionNewAd":1,"../../../Helper/UserInput":5,"./ImageUploader":6,"./NewAdCriteria":7,"./NewAdPartialViewLoader":10,"./NewAdServerCaller":11}]},{},[12])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3d3dyb290L2pzL0NvbXBvbmVudHMvQ2F0ZWdvcnkvTmV3QWQvQ2F0ZWdvcnlTZWxlY3Rpb25OZXdBZC50cyIsInd3d3Jvb3QvanMvQ29tcG9uZW50cy9UcmFuc2Zvcm1hdGlvbi9DYXJNb2RlbEJyYW5kQ29udHJvbGxlci50cyIsInd3d3Jvb3QvanMvRXZlbnRzL0V2ZW50RGlzcGF0Y2hlci50cyIsInd3d3Jvb3QvanMvSGVscGVyL0NyaXRlcmlhTnVtZXJpY0RpY3Rpb25hcnkudHMiLCJ3d3dyb290L2pzL0hlbHBlci9Vc2VySW5wdXQudHMiLCJ3d3dyb290L2pzL2hvbWUvbmV3QWQvc3JjL0ltYWdlVXBsb2FkZXIudHMiLCJ3d3dyb290L2pzL2hvbWUvbmV3QWQvc3JjL05ld0FkQ3JpdGVyaWEudHMiLCJ3d3dyb290L2pzL2hvbWUvbmV3QWQvc3JjL05ld0FkQ3JpdGVyaWEvQWRUcmFuc2Zvcm1hdGlvbk5ld0FkQ3JpdGVyaWEudHMiLCJ3d3dyb290L2pzL2hvbWUvbmV3QWQvc3JjL05ld0FkQ3JpdGVyaWEvRGVmYXVsdE5ld0FkQ3JpdGVyaWEudHMiLCJ3d3dyb290L2pzL2hvbWUvbmV3QWQvc3JjL05ld0FkUGFydGlhbFZpZXdMb2FkZXIudHMiLCJ3d3dyb290L2pzL2hvbWUvbmV3QWQvc3JjL05ld0FkU2VydmVyQ2FsbGVyLnRzIiwid3d3cm9vdC9qcy9ob21lL25ld0FkL3NyYy9uZXdBZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUMsb0RBQW9EO0FBQ3JELG1FQUFrRTtBQUtsRTtJQStCSSxnQ0FBWSxXQUFtQixFQUFFLGFBQXlCO1FBN0J6QyxrQkFBYSxHQUFHLFlBQVksQ0FBQztRQVE3Qix3QkFBbUIsR0FBRyxtQkFBbUIsQ0FBQztRQUMxQyxtQkFBYyxHQUFHLFdBQVcsQ0FBQztRQUM3QixzQkFBaUIsR0FBVyxTQUFTLENBQUM7UUFFdEMseUJB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QUFvQixFQUFDLDZCQUE2QixDQUFDLENBQUM7QUFDbEcsQ0FBQyxDQUFDLENBQUMsQ0FBQSxPQUFPIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIu+7vy8vVE9ETyBtZXJnZSB0aGlzIGNsYXNzIHdpdGggQ2F0ZWdvcnlTZWxlY3Rpb24gQ2xhc3NcclxuaW1wb3J0IHsgRXZlbnREaXNwYXRjaGVyIH0gZnJvbSBcIi4uLy4uLy4uL0V2ZW50cy9FdmVudERpc3BhdGNoZXJcIjtcclxuaW1wb3J0IHsgQ2F0ZWdvcnkgfSBmcm9tIFwiLi4vLi4vLi4vTW9kZWxzL0NhdGVnb3J5XCI7XHJcbmltcG9ydCB7VXNlcklucHV0fSBmcm9tIFwiLi4vLi4vLi4vSGVscGVyL1VzZXJJbnB1dFwiO1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBDYXRlZ29yeVNlbGVjdGlvbk5ld0FkIHtcclxuICAgIFxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBDYXRlZ29yeUlkS2V5ID0gXCJDYXRlZ29yeUlkXCI7XHJcbiAgICBJbnNlcnRDYXRlZ29yeUlkSW5Vc2VySW5wdXREaWN0aW9uYXJ5KHVzZXJJbnB1dDogVXNlcklucHV0KSB7XHJcbiAgICAgICAgbGV0IGNhdGVnb3J5SWQgPSB0aGlzLkdldFNlbGVjdGVkQ2F0ZWdvcnlJZCgpO1xyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLkNhdGVnb3J5SWRLZXldID0gY2F0ZWdvcnlJZDsvLzEwMCBmb3IgY2Fyc1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBfcGFyZW50RGl2SWQ6IHN0cmluZzsvL2RpdiBlbGVtZW50IHRoYXQgaG9sZHMgYWxsIENhdGVnb3J5U2VsZWN0aW9uIGVsZW1lbnRzXHJcbiAgICBwcml2YXRlIF9hbGxDYXRlZ29yaWVzOiBDYXRlZ29yeVtdO1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2ZpcnN0TGV2ZWxUZW1wbGF0ZSA9IFwiY2F0ZWdvcnkxVGVtcGxhdGVcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2ZpcnN0TGV2ZWxEaXYgPSBcImNhdGVnb3J5MVwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfZmlyc3RMZXZlbFNlbGVjdDogc3RyaW5nID0gXCJzZWxlY3QxXCI7XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfc2Vjb25kTGV2ZWxUZW1wbGF0ZSA9IFwiY2F0ZWdvcnkyVGVtcGxhdGVcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX3NlY29uZExldmVsRGl2ID0gXCJjYXRlZ29yeTJcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX3NlY29uZExldmVsU2VsZWN0OiBzdHJpbmcgPSBcInNlbGVjdDJcIjtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF90aGlyZExldmVsVGVtcGxhdGUgPSBcImNhdGVnb3J5M1RlbXBsYXRlXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF90aGlyZExldmVsRGl2ID0gXCJjYXRlZ29yeTNcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX3RoaXJkTGV2ZWxTZWxlY3Q6IHN0cmluZyA9IFwic2VsZWN0M1wiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfcm9vdENhdGVnb3J5SWQ6IG51bWJlciA9IDA7XHJcblxyXG4gICAgcHJpdmF0ZSBfc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxPbmU6IG51bWJlcjtcclxuICAgIHByaXZhdGUgX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVHdvOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIF9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFRocmVlOiBudW1iZXI7XHJcblxyXG4gICAgcHVibGljIFNlbGVjdGVkQ2F0ZWdvcnlDaGFuZ2VkRXZlbnQ6IEV2ZW50RGlzcGF0Y2hlcjxDYXRlZ29yeVNlbGVjdGlvbk5ld0FkLCBudW1iZXI+ID1cclxuICAgICAgICBuZXcgRXZlbnREaXNwYXRjaGVyPENhdGVnb3J5U2VsZWN0aW9uTmV3QWQsIG51bWJlcj4oKTtcclxuXHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKHBhcmVudERpdklkOiBzdHJpbmcsIGFsbENhdGVnb3JpZXM6IENhdGVnb3J5W10pIHtcclxuICAgICAgICB0aGlzLl9wYXJlbnREaXZJZCA9IHBhcmVudERpdklkO1xyXG4gICAgICAgIHRoaXMuX2FsbENhdGVnb3JpZXMgPSBhbGxDYXRlZ29yaWVzO1xyXG4gICAgfVxyXG4gICAgcHVibGljIEdldFNlbGVjdGVkQ2F0ZWdvcnlJZCgpOiBudW1iZXIge1xyXG4gICAgICAgIGlmICh0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFRocmVlICE9PSB1bmRlZmluZWQgJiZcclxuICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUaHJlZSAhPT0gdGhpcy5fcm9vdENhdGVnb3J5SWQpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFRocmVlO1xyXG4gICAgICAgIGVsc2UgaWYgKHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVHdvICE9PSB1bmRlZmluZWQgJiZcclxuICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUd28gIT09IHRoaXMuX3Jvb3RDYXRlZ29yeUlkKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUd287XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxPbmU7XHJcbiAgICB9Ly9HZXRTZWxlY3RlZENhdGVnb3J5SWRcclxuXHJcbiAgICBwdWJsaWMgU2VsZWN0ZWRDYXRlZ29yeUhhc0NoaWxkcmVuKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGxldCBzZWxlY3RlZENhdGVnb3J5SWQgPSB0aGlzLkdldFNlbGVjdGVkQ2F0ZWdvcnlJZCgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9hbGxDYXRlZ29yaWVzLmZpbHRlclxyXG4gICAgICAgICAgICAoKGNhdGVnb3J5KSA9PiB7IHJldHVybiBjYXRlZ29yeS5wYXJlbnRDYXRlZ29yeUlkID09PSBzZWxlY3RlZENhdGVnb3J5SWQgfSkubGVuZ3RoID4gMDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIENyZWF0ZUZpcnN0TGV2ZWwoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVFbGVtZW50KHRoaXMuX2ZpcnN0TGV2ZWxEaXYpO1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsT25lID0gdGhpcy5fcm9vdENhdGVnb3J5SWQ7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVFbGVtZW50KHRoaXMuX3NlY29uZExldmVsRGl2KTtcclxuICAgICAgICB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFR3byA9IHRoaXMuX3Jvb3RDYXRlZ29yeUlkO1xyXG4gICAgICAgIHRoaXMucmVtb3ZlRWxlbWVudCh0aGlzLl90aGlyZExldmVsRGl2KTtcclxuICAgICAgICB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFRocmVlID0gdGhpcy5fcm9vdENhdGVnb3J5SWQ7XHJcblxyXG4gICAgICAgIGxldCB0ZW1wbGF0ZSA9ICQoXCIjXCIgKyB0aGlzLl9maXJzdExldmVsVGVtcGxhdGUpLmh0bWwoKTtcclxuICAgICAgICBsZXQgY2F0ZWdvcmllczogQ2F0ZWdvcnlbXSA9IG5ldyBBcnJheTxDYXRlZ29yeT4oKTtcclxuICAgICAgICBsZXQgZGF0YSA9IHsgY2F0ZWdvcmllczogY2F0ZWdvcmllcyB9XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxPbmUgPSB0aGlzLl9yb290Q2F0ZWdvcnlJZDtcclxuICAgICAgICB0aGlzLl9hbGxDYXRlZ29yaWVzLmZvckVhY2goY2F0ZWdvcnkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoY2F0ZWdvcnkucGFyZW50Q2F0ZWdvcnlJZCA9PT0gdGhpcy5fcm9vdENhdGVnb3J5SWQpIHtcclxuICAgICAgICAgICAgICAgIGNhdGVnb3JpZXMucHVzaChjYXRlZ29yeSk7XHJcbiAgICAgICAgICAgIH0vL2lmXHJcbiAgICAgICAgfSk7Ly9mb3JFYWNoXHJcblxyXG4gICAgICAgIGxldCBodG1sID0gTXVzdGFjaGUudG9faHRtbCh0ZW1wbGF0ZSwgZGF0YSk7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX3BhcmVudERpdklkKS5hcHBlbmQoaHRtbCk7XHJcblxyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9maXJzdExldmVsU2VsZWN0KS5jaGFuZ2UoKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBzZWxlY3RlZElkID0gcGFyc2VJbnQoJChldmVudC5jdXJyZW50VGFyZ2V0KS52YWwoKS50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxPbmUgPSBzZWxlY3RlZElkO1xyXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVNlY29uZExldmVsKHNlbGVjdGVkSWQpO1xyXG4gICAgICAgICAgICB0aGlzLlNlbGVjdGVkQ2F0ZWdvcnlDaGFuZ2VkRXZlbnQuRGlzcGF0Y2godGhpcywgdGhpcy5HZXRTZWxlY3RlZENhdGVnb3J5SWQoKSk7XHJcbiAgICAgICAgfSk7Ly9jaGFuZ2VcclxuXHJcbiAgICB9Ly9DcmVhdGVGaXJzdExldmVsXHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVTZWNvbmRMZXZlbChmaXJzdExldmVsQ2F0ZWdvcnlJZDogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVFbGVtZW50KHRoaXMuX3NlY29uZExldmVsRGl2KTtcclxuICAgICAgICB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFR3byA9IHRoaXMuX3Jvb3RDYXRlZ29yeUlkO1xyXG4gICAgICAgIHRoaXMucmVtb3ZlRWxlbWVudCh0aGlzLl90aGlyZExldmVsRGl2KTtcclxuICAgICAgICB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFRocmVlID0gdGhpcy5fcm9vdENhdGVnb3J5SWQ7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKGZpcnN0TGV2ZWxDYXRlZ29yeUlkID09PSB0aGlzLl9yb290Q2F0ZWdvcnlJZCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgdGVtcGxhdGUgPSAkKFwiI1wiICsgdGhpcy5fc2Vjb25kTGV2ZWxUZW1wbGF0ZSkuaHRtbCgpO1xyXG4gICAgICAgIGxldCBjYXRlZ29yaWVzOiBDYXRlZ29yeVtdID0gbmV3IEFycmF5PENhdGVnb3J5PigpO1xyXG4gICAgICAgIGxldCBkYXRhID0geyBjYXRlZ29yaWVzOiBjYXRlZ29yaWVzIH1cclxuXHJcbiAgICAgICAgdGhpcy5fYWxsQ2F0ZWdvcmllcy5mb3JFYWNoKGNhdGVnb3J5ID0+IHtcclxuICAgICAgICAgICAgaWYgKGNhdGVnb3J5LnBhcmVudENhdGVnb3J5SWQgPT09IGZpcnN0TGV2ZWxDYXRlZ29yeUlkKSB7XHJcbiAgICAgICAgICAgICAgICBjYXRlZ29yaWVzLnB1c2goY2F0ZWdvcnkpO1xyXG4gICAgICAgICAgICB9Ly9pZlxyXG4gICAgICAgIH0pOy8vZm9yRWFjaFxyXG5cclxuICAgICAgICBsZXQgaHRtbCA9IE11c3RhY2hlLnRvX2h0bWwodGVtcGxhdGUsIGRhdGEpO1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9wYXJlbnREaXZJZCkuYXBwZW5kKGh0bWwpO1xyXG5cclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fc2Vjb25kTGV2ZWxTZWxlY3QpLmNoYW5nZSgoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgbGV0IHNlbGVjdGVkSWQgPSBwYXJzZUludCgkKGV2ZW50LmN1cnJlbnRUYXJnZXQpLnZhbCgpLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFR3byA9IHNlbGVjdGVkSWQ7XHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlVGhpcmRMZXZlbChzZWxlY3RlZElkKTtcclxuICAgICAgICAgICAgdGhpcy5TZWxlY3RlZENhdGVnb3J5Q2hhbmdlZEV2ZW50LkRpc3BhdGNoKHRoaXMsIHRoaXMuR2V0U2VsZWN0ZWRDYXRlZ29yeUlkKCkpO1xyXG4gICAgICAgIH0pOy8vY2hhbmdlXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVUaGlyZExldmVsKHNlY29uZExldmVsQ2F0ZWdvcnlJZDogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVFbGVtZW50KHRoaXMuX3RoaXJkTGV2ZWxEaXYpO1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVGhyZWUgPSB0aGlzLl9yb290Q2F0ZWdvcnlJZDtcclxuXHJcbiAgICAgICAgaWYgKHNlY29uZExldmVsQ2F0ZWdvcnlJZCA9PT0gdGhpcy5fcm9vdENhdGVnb3J5SWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHRlbXBsYXRlID0gJChcIiNcIiArIHRoaXMuX3RoaXJkTGV2ZWxUZW1wbGF0ZSkuaHRtbCgpO1xyXG4gICAgICAgIGxldCBjYXRlZ29yaWVzOiBDYXRlZ29yeVtdID0gbmV3IEFycmF5PENhdGVnb3J5PigpO1xyXG4gICAgICAgIGxldCBkYXRhID0geyBjYXRlZ29yaWVzOiBjYXRlZ29yaWVzIH1cclxuXHJcbiAgICAgICAgdGhpcy5fYWxsQ2F0ZWdvcmllcy5mb3JFYWNoKGNhdGVnb3J5ID0+IHtcclxuICAgICAgICAgICAgaWYgKGNhdGVnb3J5LnBhcmVudENhdGVnb3J5SWQgPT09IHNlY29uZExldmVsQ2F0ZWdvcnlJZCkge1xyXG4gICAgICAgICAgICAgICAgY2F0ZWdvcmllcy5wdXNoKGNhdGVnb3J5KTtcclxuICAgICAgICAgICAgfS8vaWZcclxuICAgICAgICB9KTsvL2ZvckVhY2hcclxuICAgICAgICBpZiAoY2F0ZWdvcmllcy5sZW5ndGggPT09IDApIHsvL05vIEl0bWUgaW4gdGhpcmQgbGV2ZWwgY2F0ZWdvcnlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgaHRtbCA9IE11c3RhY2hlLnRvX2h0bWwodGVtcGxhdGUsIGRhdGEpO1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9wYXJlbnREaXZJZCkuYXBwZW5kKGh0bWwpO1xyXG5cclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fdGhpcmRMZXZlbFNlbGVjdCkuY2hhbmdlKChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFRocmVlID0gcGFyc2VJbnQoJChldmVudC5jdXJyZW50VGFyZ2V0KS52YWwoKS50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgdGhpcy5TZWxlY3RlZENhdGVnb3J5Q2hhbmdlZEV2ZW50LkRpc3BhdGNoKHRoaXMsIHRoaXMuR2V0U2VsZWN0ZWRDYXRlZ29yeUlkKCkpO1xyXG4gICAgICAgIH0pOy8vY2hhbmdlXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZW1vdmVFbGVtZW50KGlkOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICAkKFwiI1wiICsgaWQpLnJlbW92ZSgpO1xyXG4gICAgfVxyXG59Iiwi77u/aW1wb3J0IHtDYXJNb2RlbH0gZnJvbSBcIi4uLy4uL01vZGVscy9BZFRyYW5zcG9ydGF0aW9uL0Nhck1vZGVsXCI7XHJcbmltcG9ydCB7VXNlcklucHV0fSBmcm9tIFwiLi4vLi4vSGVscGVyL1VzZXJJbnB1dFwiO1xyXG5pbXBvcnQge0lDcml0ZXJpYSxDcml0ZXJpYVZhbGlkYXRvcn0gZnJvbSBcIi4uLy4uL0hlbHBlci9JQ3JpdGVyaWFcIjtcclxuXHJcbmltcG9ydCB7SUNyaXRlcmlhQ2hhbmdlfSBmcm9tIFwiLi4vLi4vSGVscGVyL0lDcml0ZXJpYUNoYW5nZVwiO1xyXG5cclxuXHJcblxyXG5leHBvcnQgY2xhc3MgQ2FyTW9kZWxCcmFuZENvbnRyb2xsZXIgaW1wbGVtZW50cyBJQ3JpdGVyaWEge1xyXG4gICAgVmFsaWRhdGVDcml0ZXJpYSgpOiBDcml0ZXJpYVZhbGlkYXRvciB7IHRocm93IG5ldyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZFwiKTsgfVxyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgQ2FyQnJhbmRJZEtleTogc3RyaW5nID0gXCJCcmFuZElkXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IEJyYW5kU2VsZWN0SWQ6IHN0cmluZyA9IFwiYnJhbmRcIjtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IENhck1vZGVsVGVtcGxhdGVJZDogc3RyaW5nID0gXCJtb2RlbFRlbXBsYXRlXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IENhck1vZGVsRGl2UGxhY2VIb2xkZXJJZDogc3RyaW5nID0gXCJtb2RlbFBsYWNlSG9sZGVyXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IENhck1vZGVsSWRLZXk6IHN0cmluZyA9IFwiQ2FyTW9kZWxJZFwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBBbGxDYXJNb2RlbHNJbnB1dElkOiBzdHJpbmcgPSBcImFsbENhck1vZGVsc1wiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBNb2RlbFNlbGVjdElkOiBzdHJpbmcgPSBcIm1vZGVsXCI7XHJcbiAgICBwcml2YXRlIF9hbGxDYXJNb2RlbHM6IENhck1vZGVsW107XHJcblxyXG4gICAgcHJpdmF0ZSBfc2VhcmNoQ3JpdGVyaWFDaGFuZ2U6SUNyaXRlcmlhQ2hhbmdlO1xyXG5cclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmluaXRWaWV3KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbml0VmlldygpOiB2b2lkIHtcclxuICAgICAgICBsZXQgYWxsQ2FyTW9kZWxzU3RyaW5nID0gJChcIiNcIiArIHRoaXMuQWxsQ2FyTW9kZWxzSW5wdXRJZCkudmFsKCkudG9TdHJpbmcoKTtcclxuICAgICAgICB0aGlzLl9hbGxDYXJNb2RlbHMgPSAkLnBhcnNlSlNPTihhbGxDYXJNb2RlbHNTdHJpbmcpIGFzIENhck1vZGVsW107XHJcbiAgICAgICAgdGhpcy5pbml0Q2FyTW9kZWwoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXRDYXJNb2RlbCgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmNyZWF0ZUNhck1vZGVsRWxlbWVudChuZXcgQXJyYXk8Q2FyTW9kZWw+KCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlQ2FyTW9kZWxFbGVtZW50KGNhck1vZGVsczogQ2FyTW9kZWxbXSkge1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLkNhck1vZGVsRGl2UGxhY2VIb2xkZXJJZCkuY2hpbGRyZW4oKS5yZW1vdmUoKTtcclxuICAgICAgICBsZXQgdGVtcGxhdGUgPSAkKFwiI1wiICsgdGhpcy5DYXJNb2RlbFRlbXBsYXRlSWQpLmh0bWwoKTtcclxuICAgICAgICBsZXQgZGF0YSA9IHsgY2FyTW9kZWxzOiBjYXJNb2RlbHMgfVxyXG4gICAgICAgIGxldCBodG1sID0gTXVzdGFjaGUudG9faHRtbCh0ZW1wbGF0ZSwgZGF0YSk7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuQ2FyTW9kZWxEaXZQbGFjZUhvbGRlcklkKS5hcHBlbmQoaHRtbCk7XHJcbiAgICAgICAgdGhpcy5iaW5kQ2FyTW9kZWwoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGJpbmRDYXJNb2RlbCgpOiB2b2lkIHtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5Nb2RlbFNlbGVjdElkKS5vbihcImNoYW5nZVwiLFxyXG4gICAgICAgICAgICAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NlYXJjaENyaXRlcmlhQ2hhbmdlLkN1c3RvbUNyaXRlcmlhQ2hhbmdlZCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZUNhck1vZGVsU2VsZWN0KGJyYW5kSWQ6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIGxldCBjYXJNb2RlbHMgPSBuZXcgQXJyYXk8Q2FyTW9kZWw+KCk7XHJcbiAgICAgICAgdGhpcy5fYWxsQ2FyTW9kZWxzLmZvckVhY2goKGNhck1vZGVsLCBpbmRleCwgYXJyYXkpID0+IHtcclxuICAgICAgICAgICAgaWYgKGNhck1vZGVsLmJyYW5kSWQgPT09IGJyYW5kSWQpXHJcbiAgICAgICAgICAgICAgICBjYXJNb2RlbHMucHVzaChjYXJNb2RlbCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVDYXJNb2RlbEVsZW1lbnQoY2FyTW9kZWxzKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgcHVibGljIEZpbGxDcml0ZXJpYSh1c2VySW5wdXQ6VXNlcklucHV0KTp2b2lkIHtcclxuICAgICAgICB1c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnlbdGhpcy5DYXJCcmFuZElkS2V5XSA9XHJcbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLkJyYW5kU2VsZWN0SWQpLmZpbmQoXCJvcHRpb246c2VsZWN0ZWRcIikudmFsKCk7Ly9icmFuZElkXHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuQ2FyTW9kZWxJZEtleV0gPVxyXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5Nb2RlbFNlbGVjdElkKS5maW5kKFwib3B0aW9uOnNlbGVjdGVkXCIpLnZhbCgpOy8vY2FyTW9kZWxJZFxyXG4gICAgfVxyXG5cclxuICAgIEJpbmRFdmVudHMoY3JpdGVyaWFDaGFuZ2U6IElDcml0ZXJpYUNoYW5nZSk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX3NlYXJjaENyaXRlcmlhQ2hhbmdlID0gY3JpdGVyaWFDaGFuZ2U7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuQnJhbmRTZWxlY3RJZCkub24oXCJjaGFuZ2VcIiwgKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBzZWxlY3RlZEJyYW5kSWQ6IG51bWJlciA9IHBhcnNlSW50KCQoZXZlbnQuY3VycmVudFRhcmdldCkuZmluZChcIm9wdGlvbjpzZWxlY3RlZFwiKS52YWwoKS50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVDYXJNb2RlbFNlbGVjdChzZWxlY3RlZEJyYW5kSWQpO1xyXG4gICAgICAgICAgICBjcml0ZXJpYUNoYW5nZS5DdXN0b21Dcml0ZXJpYUNoYW5nZWQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5iaW5kQ2FyTW9kZWwoKTtcclxuICAgIH1cclxuXHJcbiAgICBVbkJpbmRFdmVudHMoKTogdm9pZCB7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuQnJhbmRTZWxlY3RJZCkub2ZmKFwiY2hhbmdlXCIpO1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLk1vZGVsU2VsZWN0SWQpLm9mZihcImNoYW5nZVwiKTtcclxuICAgIH1cclxufSIsIu+7v2ltcG9ydCB7SUV2ZW50fSAgZnJvbSBcIi4vSUV2ZW50XCI7XHJcblxyXG5cclxuLyogVGhlIGRpc3BhdGNoZXIgaGFuZGxlcyB0aGUgc3RvcmFnZSBvZiBzdWJzY2lwdGlvbnMgYW5kIGZhY2lsaXRhdGVzXHJcbiAgc3Vic2NyaXB0aW9uLCB1bnN1YnNjcmlwdGlvbiBhbmQgZGlzcGF0Y2hpbmcgb2YgdGhlIGV2ZW50ICovXHJcbmV4cG9ydCAgY2xhc3MgRXZlbnREaXNwYXRjaGVyPFRTZW5kZXIsIFRBcmdzPiBpbXBsZW1lbnRzIElFdmVudDxUU2VuZGVyLCBUQXJncz4ge1xyXG5cclxuICAgIHByaXZhdGUgX3N1YnNjcmlwdGlvbnM6IEFycmF5PChzZW5kZXI6IFRTZW5kZXIsIGFyZ3M6IFRBcmdzKSA9PiB2b2lkPiA9IG5ldyBBcnJheTwoc2VuZGVyOiBUU2VuZGVyLCBhcmdzOiBUQXJncykgPT4gdm9pZD4oKTtcclxuXHJcbiAgICBwdWJsaWMgU3Vic2NyaWJlKGZuOiAoc2VuZGVyOiBUU2VuZGVyLCBhcmdzOiBUQXJncykgPT4gdm9pZCk6IHZvaWQge1xyXG4gICAgICAgIGlmIChmbikge1xyXG4gICAgICAgICAgICB0aGlzLl9zdWJzY3JpcHRpb25zLnB1c2goZm4pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgIFVuc3Vic2NyaWJlKGZuOiAoc2VuZGVyOiBUU2VuZGVyLCBhcmdzOiBUQXJncykgPT4gdm9pZCk6IHZvaWQge1xyXG4gICAgICAgIGxldCBpID0gdGhpcy5fc3Vic2NyaXB0aW9ucy5pbmRleE9mKGZuKTtcclxuICAgICAgICBpZiAoaSA+IC0xKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMuc3BsaWNlKGksIDEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgIERpc3BhdGNoKHNlbmRlcjogVFNlbmRlciwgYXJnczogVEFyZ3MpOiB2b2lkIHtcclxuICAgICAgICBmb3IgKGxldCBoYW5kbGVyIG9mIHRoaXMuX3N1YnNjcmlwdGlvbnMpIHtcclxuICAgICAgICAgICAgaGFuZGxlcihzZW5kZXIsIGFyZ3MpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIu+7v2ltcG9ydCB7IElDcml0ZXJpYX0gZnJvbSBcIi4vSUNyaXRlcmlhXCI7XHJcbmltcG9ydCB7IE51bWVyaWNEaWN0aW9uYXJ5IH0gZnJvbSBcImxvZGFzaC9pbmRleFwiO1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBDcml0ZXJpYU51bWVyaWNEaWN0aW9uYXJ5IGltcGxlbWVudHMgTnVtZXJpY0RpY3Rpb25hcnk8SUNyaXRlcmlhPiB7XHJcbiAgICBbaW5kZXg6IG51bWJlcl06IElDcml0ZXJpYTtcclxufSIsIu+7v2ludGVyZmFjZSBMb29zZU9iamVjdCB7XHJcbiAgICBba2V5OiBzdHJpbmddOiBhbnlcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFVzZXJJbnB1dCB7XHJcbiAgICBwdWJsaWMgUGFyYW1ldGVyc0RpY3Rpb25hcnk6IExvb3NlT2JqZWN0ID0ge307XHJcbn1cclxuXHJcblxyXG5cclxuIiwi77u/Ly9UT0RPIHJlbW92ZSB1cGxvYWRlIGltYWdlIGZyb20gc2VydmVyXHJcbmV4cG9ydCBjbGFzcyBJbWFnZVVwbG9hZGVyIHtcclxuICAgICAgICBcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgTmV3QWRHdWlkS2V5ID0gXCJOZXdBZEd1aWRcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgUmVxdWVzdEluZGV4S2V5ID1cIlJlcXVlc3RJbmRleFwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBJbWFnZVVwbG9hZElucHV0SWQ6IHN0cmluZyA9IFwiaW1hZ2VVcGxvYWRcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgTWVzc2FnZVRvVXNlckRpdklkOiBzdHJpbmcgPSBcImxhYmVsTWVzc2FnZVRvVXNlclwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBMb2FkZWRJbWFnZXNEaXZJZDogc3RyaW5nID0gXCJsb2FkZWRJbWFnZVZpZXdcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgVXBsb2FkaW5nSW1hZ2VUZW1wbGF0ZTogc3RyaW5nID0gXCJ1cGxvYWRpbmdJbWFnZVRlbXBsYXRlXCI7XHJcblxyXG4gICAgcHJpdmF0ZSBfc2VuZEZpbGVzVG9TZXJ2ZXJVcmw6IHN0cmluZyA9IFwiL2FwaS9BZEFwaS9BZGRUZW1wSW1hZ2VcIjtcclxuICAgIHByaXZhdGUgX3JlbW92ZUZpbGVGcm9tU2VydmVyVXJsOiBzdHJpbmcgPSBcIi9hcGkvQWRBcGkvUmVtb3ZlVGVtcEltYWdlXCI7XHJcblxyXG4gICAgcHJpdmF0ZSBfY3VycmVudE5ld0FkR3VpZDogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBfcmVxdWVzdEluZGV4OiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBWYWxpZFVwbG9hZFRpbWU9MjAwMDA7XHJcblxyXG4gICAgY29uc3RydWN0b3IoY3VycmVudE5ld0FkR3VpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5fY3VycmVudE5ld0FkR3VpZCA9IGN1cnJlbnROZXdBZEd1aWQ7XHJcbiAgICAgICAgdGhpcy5pbml0VmlldygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaW5pdFZpZXcoKTogdm9pZCB7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuSW1hZ2VVcGxvYWRJbnB1dElkKS5jaGFuZ2UoKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBmaWxlVXBsb2FkOiBIVE1MSW5wdXRFbGVtZW50ID0gJChcIiNcIiArIHRoaXMuSW1hZ2VVcGxvYWRJbnB1dElkKS5nZXQoMCkgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICAgICAgICAgICAgbGV0IGZpbGVzOiBGaWxlTGlzdCA9IGZpbGVVcGxvYWQuZmlsZXM7XHJcbiAgICAgICAgICAgIHRoaXMuc2VuZEZpbGVzVG9TZXJ2ZXIoZmlsZXMpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKGRvY3VtZW50KS5vbihcImNsaWNrXCIsIFwiLmFkZGVkSW1hZ2UgPiBpbnB1dFwiLCAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5yZW1vdmVJbWFnZUZyb21TZXJ2ZXIoJChldmVudC5jdXJyZW50VGFyZ2V0KS5wYXJlbnQoKS5hdHRyKFwiaWRcIikudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZW5kRmlsZXNUb1NlcnZlcihmaWxlTGlzdDogRmlsZUxpc3QpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9yZXF1ZXN0SW5kZXgrKztcclxuICAgICAgICB2YXIgZGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xyXG4gICAgICAgIGRhdGEuYXBwZW5kKHRoaXMuTmV3QWRHdWlkS2V5LCB0aGlzLl9jdXJyZW50TmV3QWRHdWlkKTtcclxuICAgICAgICBkYXRhLmFwcGVuZCh0aGlzLlJlcXVlc3RJbmRleEtleSwgdGhpcy5fcmVxdWVzdEluZGV4LnRvU3RyaW5nKCkpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZmlsZUxpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgZGF0YS5hcHBlbmQoZmlsZUxpc3RbaV0ubmFtZSwgZmlsZUxpc3RbaV0pO1xyXG4gICAgICAgIH0gLy9mb3JcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0eXBlOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgdXJsOiB0aGlzLl9zZW5kRmlsZXNUb1NlcnZlclVybCxcclxuICAgICAgICAgICAgY29udGVudFR5cGU6IGZhbHNlLFxyXG4gICAgICAgICAgICBwcm9jZXNzRGF0YTogZmFsc2UsXHJcbiAgICAgICAgICAgIGRhdGE6IGRhdGEsXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IChtc2csIHRleHRTdGF0dXMsIGpxWEhSKSA9PiB0aGlzLm9uU3VjY2Vzc1NlbmRGaWxlVG9TZXJ2ZXIobXNnLCB0ZXh0U3RhdHVzLCBqcVhIUiksIC8vT24gU3VjY2Vzc2Z1bGwgc2VydmljZSBjYWxsXHJcbiAgICAgICAgICAgIGVycm9yOiAoanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKSA9PiB0aGlzLm9uRXJyb3JTZW5kRmlsZVRvU2VydmVyKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikgLy8gV2hlbiBTZXJ2aWNlIGNhbGwgZmFpbHNcclxuXHJcbiAgICAgICAgfSk7IC8vYWpheFxyXG4gICAgICAgIHRoaXMuYWRkVXBsb2FkaW5nSW1hZ2VUZW1wbGF0ZSh0aGlzLl9yZXF1ZXN0SW5kZXgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25TdWNjZXNzU2VuZEZpbGVUb1NlcnZlcihtc2c6IGFueSwgdGV4dFN0YXR1czogc3RyaW5nLCBqcVhIUjogSlF1ZXJ5WEhSKSB7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuSW1hZ2VVcGxvYWRJbnB1dElkKS52YWwoXCJcIik7XHJcblxyXG4gICAgICAgIGlmIChtc2cuc3VjY2VzcyA9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU2VuZGluZ0ltYWdlVGVtcGxhdGUobXNnLnJlc3BvbnNlRGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnNob3dNZXNzYWdlVG9Vc2VyKG1zZy5tZXNzYWcgKyBcIiAsXCIgKyBtc2cuZXJyb3JDb2RlKTtcclxuICAgICAgICAgICAgdGhpcy51cGxvYWRJbWFnZVRpbWVyRXhwaXJlKHBhcnNlSW50KG1zZy5yZXNwb25zZURhdGEucmVxdWVzdEluZGV4KSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25FcnJvclNlbmRGaWxlVG9TZXJ2ZXIoanFYSFI6IEpRdWVyeVhIUiwgdGV4dFN0YXR1czogc3RyaW5nLCBlcnJvclRocm93bjogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5zaG93TWVzc2FnZVRvVXNlcihcItiu2LfYpyDYr9ixINin2LHYs9in2YRcIik7Ly9tYWdpYyBzdHJpbmdcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGFkZFVwbG9hZGluZ0ltYWdlVGVtcGxhdGUocmVxdWVzdEluZGV4Om51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIGxldCB0ZW1wbGF0ZSA9ICQoXCIjXCIgKyB0aGlzLlVwbG9hZGluZ0ltYWdlVGVtcGxhdGUpLmh0bWwoKTsvL21hZ2ljIHN0cmluZ1xyXG4gICAgICAgIGxldCBkYXRhID0geyBSZXF1ZXN0SW5kZXg6IHJlcXVlc3RJbmRleCB9Oy8vbWFnaWMgc3RyaW5nXHJcbiAgICAgICAgbGV0IGh0bWwgPSBNdXN0YWNoZS50b19odG1sKHRlbXBsYXRlLCBkYXRhKTtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5Mb2FkZWRJbWFnZXNEaXZJZCkuYXBwZW5kKGh0bWwpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHNldFRpbWVvdXQodGhpcy51cGxvYWRJbWFnZVRpbWVyRXhwaXJlLFxyXG4gICAgICAgICAgICB0aGlzLlZhbGlkVXBsb2FkVGltZSx0aGlzLl9yZXF1ZXN0SW5kZXgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBsb2FkSW1hZ2VUaW1lckV4cGlyZSh1cGxvYWRSZXF1ZXN0SW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgIGlmICgkKFwiI2xvYWRlZEltYWdlVmlldyA+ICN1cGxvYWRpbmdJbWFnZVwiICsgdXBsb2FkUmVxdWVzdEluZGV4ICsgXCIgPiBpbWdcIikuaGFzQ2xhc3MoXCJnaWZJbWFnZVwiKSkge1xyXG4gICAgICAgICAgICAkKFwiI2xvYWRlZEltYWdlVmlldyA+ICN1cGxvYWRpbmdJbWFnZVwiICsgdXBsb2FkUmVxdWVzdEluZGV4KS5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlU2VuZGluZ0ltYWdlVGVtcGxhdGUoZGF0YTogVXBsb2FkZWRJbWFnZSkge1xyXG4gICAgICAgIGlmICgkKFwiI2xvYWRlZEltYWdlVmlldyA+ICN1cGxvYWRpbmdJbWFnZVwiICsgZGF0YS5yZXF1ZXN0SW5kZXgpLmxlbmd0aCA9PT0gMCkgey8vcmVtb3ZlZCBieSB0aW1lclxyXG4gICAgICAgICAgICB0aGlzLmFkZFVwbG9hZGluZ0ltYWdlVGVtcGxhdGUocGFyc2VJbnQoZGF0YS5yZXF1ZXN0SW5kZXgpKTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVTZW5kaW5nSW1hZ2VUZW1wbGF0ZShkYXRhKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvL1RPRE8gY2FuY2VsIHRpbWVyXHJcbiAgICAgICAgICAgICQoXCIjbG9hZGVkSW1hZ2VWaWV3ID4gI3VwbG9hZGluZ0ltYWdlXCIgKyBkYXRhLnJlcXVlc3RJbmRleCArIFwiID5pbWdcIilcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwic3JjXCIsIFwiZGF0YTppbWFnZS9qcGc7YmFzZTY0LFwiICsgZGF0YS5pbWFnZSkucmVtb3ZlQ2xhc3MoXCJnaWZJbWFnZVwiKTtcclxuICAgICAgICAgICAgJChcIiNsb2FkZWRJbWFnZVZpZXcgPiAjdXBsb2FkaW5nSW1hZ2VcIiArIGRhdGEucmVxdWVzdEluZGV4KS5hdHRyKFwiaWRcIiwgZGF0YS5pbWFnZUZpbGVOYW1lKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZW1vdmVJbWFnZUZyb21TZXJ2ZXIoZmlsZU5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIGFsZXJ0KGZpbGVOYW1lKTtcclxuICAgICAgICBsZXQgY2FsbFBhcmFtcyA9IHtcclxuICAgICAgICAgICAgRmlsZU5hbWVUb0JlUmVtb3ZlZDogZmlsZU5hbWUsXHJcbiAgICAgICAgICAgIE5ld0FkR3VpZDp0aGlzLl9jdXJyZW50TmV3QWRHdWlkXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogXCJHRVRcIiwgLy9HRVQgb3IgUE9TVCBvciBQVVQgb3IgREVMRVRFIHZlcmJcclxuICAgICAgICAgICAgdXJsOiB0aGlzLl9yZW1vdmVGaWxlRnJvbVNlcnZlclVybCxcclxuICAgICAgICAgICAgZGF0YTogY2FsbFBhcmFtcywgLy9EYXRhIHNlbnQgdG8gc2VydmVyXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IChtc2csIHRleHRTdGF0dXMsIGpxWEhSKSA9PiB0aGlzLm9uU3VjY2Vzc1JlbW92ZUZpbGVGcm9tU2VydmVyKG1zZywgdGV4dFN0YXR1cywganFYSFIpLCAvL09uIFN1Y2Nlc3NmdWxsIHNlcnZpY2UgY2FsbFxyXG4gICAgICAgICAgICBlcnJvcjogKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikgPT4gdGhpcy5vbkVycm9yUmVtb3ZlRmlsZUZyb21TZXJ2ZXIoanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKSAvLyBXaGVuIFNlcnZpY2UgY2FsbCBmYWlsc1xyXG4gICAgICAgIH0pOyAvLy5hamF4XHJcbiAgICAgICAgdGhpcy5zaG93TWVzc2FnZVRvVXNlcihcInJlbW92aW5nIGZpbGUgZnJvbSBzZXJ2ZXJcIik7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHByaXZhdGUgb25TdWNjZXNzUmVtb3ZlRmlsZUZyb21TZXJ2ZXIobXNnOiBhbnksIHRleHRTdGF0dXM6IHN0cmluZywganFYSFI6IEpRdWVyeVhIUikge1xyXG4gICAgICAgIGlmIChtc2cuc3VjY2VzcyA9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2hvd01lc3NhZ2VUb1VzZXIoXCJkb25lIHJlbW92aW5nIGZpbGUgZnJvbSBzZXJ2ZXJcIik7XHJcbiAgICAgICAgICAgIGxldCBmaWxlTmFtZTogc3RyaW5nID0gbXNnLnJlc3BvbnNlRGF0YTtcclxuICAgICAgICAgICAgJChgW2lkPVwiJHtmaWxlTmFtZX1cIl1gKS5yZW1vdmUoKTtcclxuXHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2hvd01lc3NhZ2VUb1VzZXIobXNnLm1lc3NhZ2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9uRXJyb3JSZW1vdmVGaWxlRnJvbVNlcnZlcihqcVhIUjogSlF1ZXJ5WEhSLCB0ZXh0U3RhdHVzOiBzdHJpbmcsIGVycm9yVGhyb3duOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLnNob3dNZXNzYWdlVG9Vc2VyKFwiZXJyb3IsIFwiICsgZXJyb3JUaHJvd24pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2hvd01lc3NhZ2VUb1VzZXIobXNnKSB7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuTWVzc2FnZVRvVXNlckRpdklkKS5odG1sKG1zZyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFVwbG9hZGVkSW1hZ2Uge1xyXG4gICAgcHVibGljIGltYWdlOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgaW1hZ2VGaWxlTmFtZTogc3RyaW5nO1xyXG4gICAgcHVibGljIHJlcXVlc3RJbmRleDpzdHJpbmc7XHJcbn0iLCLvu79pbXBvcnQgeyBDcml0ZXJpYU51bWVyaWNEaWN0aW9uYXJ5IH0gZnJvbSBcIi4uLy4uLy4uL0hlbHBlci9Dcml0ZXJpYU51bWVyaWNEaWN0aW9uYXJ5XCI7XHJcbmltcG9ydCB7IERlZmF1bHROZXdBZENyaXRlcmlhIH0gZnJvbSBcIi4vTmV3QWRDcml0ZXJpYS9EZWZhdWx0TmV3QWRDcml0ZXJpYVwiO1xyXG5pbXBvcnQge0FkVHJhbnNmb3JtYXRpb25OZXdBZENyaXRlcmlhfSBmcm9tIFwiLi9OZXdBZENyaXRlcmlhL0FkVHJhbnNmb3JtYXRpb25OZXdBZENyaXRlcmlhXCI7XHJcbmltcG9ydCB7VXNlcklucHV0fSBmcm9tIFwiLi4vLi4vLi4vSGVscGVyL1VzZXJJbnB1dFwiO1xyXG5pbXBvcnQge0lDcml0ZXJpYX0gZnJvbSBcIi4uLy4uLy4uL0hlbHBlci9JQ3JpdGVyaWFcIjtcclxuaW1wb3J0IHtJQ3JpdGVyaWFDaGFuZ2V9IGZyb20gXCIuLi8uLi8uLi9IZWxwZXIvSUNyaXRlcmlhQ2hhbmdlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTmV3QWRDcml0ZXJpYSB7XHJcbiAgICBwcml2YXRlIF9uZXdBZENyaXRlcmlhSW9jQ29udGFpbmVyOiBDcml0ZXJpYU51bWVyaWNEaWN0aW9uYXJ5IDtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuX25ld0FkQ3JpdGVyaWFJb2NDb250YWluZXIgPSBuZXcgQ3JpdGVyaWFOdW1lcmljRGljdGlvbmFyeSgpO1xyXG4gICAgICAgIHRoaXMuaW5pdE5ld0FkQ3JpdGVyaWFJb2NDb250YWluZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXROZXdBZENyaXRlcmlhSW9jQ29udGFpbmVyKCkge1xyXG4gICAgICAgIHRoaXMuX25ld0FkQ3JpdGVyaWFJb2NDb250YWluZXJbMF0gPSBuZXcgRGVmYXVsdE5ld0FkQ3JpdGVyaWEoKTtcclxuICAgICAgICB0aGlzLl9uZXdBZENyaXRlcmlhSW9jQ29udGFpbmVyWzEwMF0gPSBuZXcgQWRUcmFuc2Zvcm1hdGlvbk5ld0FkQ3JpdGVyaWEoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgRmlsbENhdGVnb3J5U3BlY2lmaWNOZXdBZENyaXRlcmlhKGNhdGVnb3J5SWQ6IG51bWJlciwgdXNlcklucHV0OiBVc2VySW5wdXQpOiB2b2lkIHtcclxuICAgICAgICBsZXQgbmV3QWRDcml0ZXJpYSA9IHRoaXMucG9seW1vcnBoaWNEaXNwYXRjaE5ld0FkQ3JpdGVyaWEoY2F0ZWdvcnlJZCk7XHJcbiAgICAgICAgbmV3QWRDcml0ZXJpYS5GaWxsQ3JpdGVyaWEodXNlcklucHV0KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgQmluZChjYXRlZ29yeUlkOiBudW1iZXIsIGNyaXRlcmlhQ2hhbmdlOiBJQ3JpdGVyaWFDaGFuZ2UpIHtcclxuICAgICAgICBsZXQgY3JpdGVyaWEgPSB0aGlzLnBvbHltb3JwaGljRGlzcGF0Y2hOZXdBZENyaXRlcmlhKGNhdGVnb3J5SWQpO1xyXG4gICAgICAgIGNyaXRlcmlhLkJpbmRFdmVudHMoY3JpdGVyaWFDaGFuZ2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBVbkJpbmQoY2F0ZWdvcnlJZDogbnVtYmVyKSB7XHJcbiAgICAgICAgbGV0IGNyaXRlcmlhID0gdGhpcy5wb2x5bW9ycGhpY0Rpc3BhdGNoTmV3QWRDcml0ZXJpYShjYXRlZ29yeUlkKTtcclxuICAgICAgICBjcml0ZXJpYS5VbkJpbmRFdmVudHMoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHBvbHltb3JwaGljRGlzcGF0Y2hOZXdBZENyaXRlcmlhKGNhdGVnb3J5SWQ6IG51bWJlcik6IElDcml0ZXJpYSB7XHJcbiAgICAgICAgbGV0IHJldHVyblZhbHVlOiBJQ3JpdGVyaWEgPSB0aGlzLl9uZXdBZENyaXRlcmlhSW9jQ29udGFpbmVyW2NhdGVnb3J5SWRdO1xyXG4gICAgICAgIGlmIChyZXR1cm5WYWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHJldHVyblZhbHVlID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHJldHVyblZhbHVlID0gdGhpcy5fbmV3QWRDcml0ZXJpYUlvY0NvbnRhaW5lclswXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldHVyblZhbHVlO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuIiwi77u/aW1wb3J0IHtJQ3JpdGVyaWEsQ3JpdGVyaWFWYWxpZGF0b3J9IGZyb20gXCIuLi8uLi8uLi8uLi9IZWxwZXIvSUNyaXRlcmlhXCI7XHJcbmltcG9ydCB7VXNlcklucHV0fSBmcm9tIFwiLi4vLi4vLi4vLi4vSGVscGVyL1VzZXJJbnB1dFwiO1xyXG5pbXBvcnQge0lDcml0ZXJpYUNoYW5nZX0gZnJvbSBcIi4uLy4uLy4uLy4uL0hlbHBlci9JQ3JpdGVyaWFDaGFuZ2VcIjtcclxuaW1wb3J0IHtDYXJNb2RlbEJyYW5kQ29udHJvbGxlcn0gZnJvbSBcIi4uLy4uLy4uLy4uL0NvbXBvbmVudHMvVHJhbnNmb3JtYXRpb24vQ2FyTW9kZWxCcmFuZENvbnRyb2xsZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBBZFRyYW5zZm9ybWF0aW9uTmV3QWRDcml0ZXJpYSBpbXBsZW1lbnRzIElDcml0ZXJpYSB7XHJcbiAgICBwcml2YXRlIF9jYXJNb2RlbEJyYW5kQ29udG9sbGVyOiBDYXJNb2RlbEJyYW5kQ29udHJvbGxlcjtcclxuXHJcbiAgICBwdWJsaWMgVmFsaWRhdGVDcml0ZXJpYSgpOiBDcml0ZXJpYVZhbGlkYXRvciB7IHRocm93IG5ldyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZFwiKTsgfVxyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgTWFrZVllYXJLZXk6IHN0cmluZyA9IFwiTWFrZVllYXJcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgTWFrZVllYXJJbnB1dElkOiBzdHJpbmcgPSBcIm1ha2VZZWFyXCI7XHJcbiAgIFxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBGdWVsS2V5ID0gXCJGdWVsXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IEZ1ZWxTZWxlY3RJZDogc3RyaW5nID0gXCJmdWVsXCI7XHJcblxyXG4gICAgcHVibGljIHJlYWRvbmx5IEdlYXJib3hLZXk6IHN0cmluZyA9IFwiR2VhcmJveFwiO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IEdlYXJib3hUeXBlUGFyZW50RGl2SWQ6IHN0cmluZyA9IFwiZ2VhcmJveFR5cGVcIjtcclxuXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgQ2FyU3RhdHVzS2V5OiBzdHJpbmcgPSBcIkNhclN0YXR1c1wiO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IENhclN0YXR1c1BhcmVudERpdklkOiBzdHJpbmcgPSBcImNhclN0YXR1c1wiO1xyXG5cclxuICAgIHB1YmxpYyByZWFkb25seSBNaWxlYWdlS2V5OiBzdHJpbmcgPSBcIk1pbGVhZ2VcIjtcclxuICAgIHB1YmxpYyByZWFkb25seSBNaWxlYWdlSW5wdXRJZDogc3RyaW5nID0gXCJtaWxlYWdlXCI7XHJcblxyXG4gICAgcHVibGljIHJlYWRvbmx5IFBsYXRlVHlwZUtleTogc3RyaW5nID0gXCJQbGF0ZVR5cGVcIjtcclxuICAgIHB1YmxpYyByZWFkb25seSBQbGF0ZVR5cGVQYXJlbnREaXZJZDogc3RyaW5nID0gXCJwbGF0ZVR5cGVcIjtcclxuXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgQm9keVN0YXR1c0tleTogc3RyaW5nID0gXCJCb2R5U3RhdHVzXCI7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgQm9keVN0YXR1c1NlbGVjdElkOiBzdHJpbmcgPSBcImJvZHlTdGF0dXNcIjtcclxuXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgQm9keUNvbG9yS2V5OiBzdHJpbmcgPSBcIkJvZHlDb2xvclwiO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IEJvZHlDb2xvclNlbGVjdElkOiBzdHJpbmcgPSBcImJvZHlDb2xvclwiO1xyXG5cclxuICAgIHB1YmxpYyByZWFkb25seSBJbnRlcm5hbENvbG9yS2V5OiBzdHJpbmcgPSBcIkludGVybmFsQ29sb3JcIjtcclxuICAgIHB1YmxpYyByZWFkb25seSBJbnRlcm5hbENvbG9yU2VsZWN0SWQgPSBcImludGVybmFsQ29sb3JcIjtcclxuXHJcbiAgICBcclxuICAgIHByaXZhdGUgaW5pdFZpZXcoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fY2FyTW9kZWxCcmFuZENvbnRvbGxlciA9IG5ldyBDYXJNb2RlbEJyYW5kQ29udHJvbGxlcigpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgRmlsbENyaXRlcmlhKHVzZXJJbnB1dDogVXNlcklucHV0KTogdm9pZCB7XHJcbiAgICAgICAgLy9UT0RPIHZhbGlkYXRlIHVzZXIgaW5wdXQgdGhlbiBwcm9jZWVkXHJcbiAgICAgICAgdGhpcy5fY2FyTW9kZWxCcmFuZENvbnRvbGxlci5GaWxsQ3JpdGVyaWEodXNlcklucHV0KTtcclxuICAgICAgICB1c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnlbdGhpcy5NYWtlWWVhcktleV0gPSQoXCIjXCIgKyB0aGlzLk1ha2VZZWFySW5wdXRJZCkudmFsKCk7Ly9NYWtlWWVhclxyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLkZ1ZWxLZXldID0gJChcIiNcIiArIHRoaXMuRnVlbFNlbGVjdElkKS5maW5kKFwib3B0aW9uOnNlbGVjdGVkXCIpLnZhbCgpOy8vRnVlbFxyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLk1pbGVhZ2VLZXldID0gJChcIiNcIiArIHRoaXMuTWlsZWFnZUlucHV0SWQpLnZhbCgpOy8vTWlsZWFnZVxyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLkdlYXJib3hLZXldID0gJChcIiNcIiArIHRoaXMuR2VhcmJveFR5cGVQYXJlbnREaXZJZCkuY2hpbGRyZW4oXCI6Y2hlY2tlZFwiKS52YWwoKTtcclxuICAgICAgICB1c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnlbdGhpcy5Cb2R5Q29sb3JLZXldID0gJChcIiNcIiArIHRoaXMuQm9keUNvbG9yU2VsZWN0SWQpLmZpbmQoXCJvcHRpb246c2VsZWN0ZWRcIikudmFsKCk7XHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuSW50ZXJuYWxDb2xvcktleV0gPSAkKFwiI1wiICsgdGhpcy5JbnRlcm5hbENvbG9yU2VsZWN0SWQpLmZpbmQoXCJvcHRpb246c2VsZWN0ZWRcIikudmFsKCk7XHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuQm9keVN0YXR1c0tleV0gPSAkKFwiI1wiICsgdGhpcy5Cb2R5U3RhdHVzU2VsZWN0SWQpLmZpbmQoXCJvcHRpb246c2VsZWN0ZWRcIikudmFsKCk7XHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuQ2FyU3RhdHVzS2V5XSA9ICQoXCIjXCIgKyB0aGlzLkNhclN0YXR1c1BhcmVudERpdklkKS5jaGlsZHJlbihcIjpjaGVja2VkXCIpLnZhbCgpO1xyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLlBsYXRlVHlwZUtleV0gPSAkKFwiI1wiICsgdGhpcy5QbGF0ZVR5cGVQYXJlbnREaXZJZCkuY2hpbGRyZW4oXCI6Y2hlY2tlZFwiKS52YWwoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgQmluZEV2ZW50cyhjcml0ZXJpYUNoYW5nZTogSUNyaXRlcmlhQ2hhbmdlKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5pbml0VmlldygpO1xyXG4gICAgICAgIHRoaXMuX2Nhck1vZGVsQnJhbmRDb250b2xsZXIuQmluZEV2ZW50cyhjcml0ZXJpYUNoYW5nZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIFVuQmluZEV2ZW50cygpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9jYXJNb2RlbEJyYW5kQ29udG9sbGVyLlVuQmluZEV2ZW50cygpO1xyXG4gICAgfVxyXG59Iiwi77u/aW1wb3J0IHsgSUNyaXRlcmlhLENyaXRlcmlhVmFsaWRhdG9yIH0gZnJvbSBcIi4uLy4uLy4uLy4uL0hlbHBlci9JQ3JpdGVyaWFcIjtcclxuaW1wb3J0IHsgVXNlcklucHV0IH0gZnJvbSBcIi4uLy4uLy4uLy4uL0hlbHBlci9Vc2VySW5wdXRcIjtcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgRGVmYXVsdE5ld0FkQ3JpdGVyaWEgaW1wbGVtZW50cyBJQ3JpdGVyaWEge1xyXG4gICAgRmlsbENyaXRlcmlhKHNlYXJjaEFkVXNlcklucHV0OiBVc2VySW5wdXQpOiB2b2lkIHtcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBCaW5kRXZlbnRzKGNyaXRlcmlhQ2hhbmdlOiBPYmplY3QpOiB2b2lkIHtcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBVbkJpbmRFdmVudHMoKTogdm9pZCB7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgVmFsaWRhdGVDcml0ZXJpYSgpOiBDcml0ZXJpYVZhbGlkYXRvciB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm90IGltcGxlbWVudGVkXCIpO1xyXG4gICAgfVxyXG59Iiwi77u/aW1wb3J0IHtOZXdBZENyaXRlcmlhfSBmcm9tIFwiLi9OZXdBZENyaXRlcmlhXCI7XHJcbmltcG9ydCB7SUNyaXRlcmlhQ2hhbmdlfSBmcm9tIFwiLi4vLi4vLi4vSGVscGVyL0lDcml0ZXJpYUNoYW5nZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIE5ld0FkUGFydGlhbFZpZXdMb2FkZXIge1xyXG4gICAgcHJpdmF0ZSBfcGFydGlhbFZpZXdEaXZJZDogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBfdXJsOiBzdHJpbmcgPSBcIi9Ib21lL0dldE5ld0FkUGFydGlhbFZpZXdcIjtcclxuICAgIHByaXZhdGUgX3ByZXZpb3VzQ2F0ZWdvcnlJZDogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgX2N1cnJlbnRDYXRlZ29yeUlkOiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBfbmV3QWRDcml0ZXJpYUNoYW5nZTogSUNyaXRlcmlhQ2hhbmdlO1xyXG4gICAgcHJpdmF0ZSBfbmV3QWRDcml0ZXJpYTogTmV3QWRDcml0ZXJpYTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwYXJ0aWFsVmlld0RpdklkOiBzdHJpbmcsIG5ld0FkQ3JpdGVyaWFDaGFuZ2U6IElDcml0ZXJpYUNoYW5nZSwgbmV3QWRDcml0ZXJpYTpOZXdBZENyaXRlcmlhKSB7XHJcbiAgICAgICAgdGhpcy5fcGFydGlhbFZpZXdEaXZJZCA9IHBhcnRpYWxWaWV3RGl2SWQ7XHJcbiAgICAgICAgdGhpcy5fbmV3QWRDcml0ZXJpYUNoYW5nZSA9IG5ld0FkQ3JpdGVyaWFDaGFuZ2U7XHJcbiAgICAgICAgdGhpcy5fbmV3QWRDcml0ZXJpYSA9IG5ld0FkQ3JpdGVyaWE7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIEdldFBhcnRpYWxWaWV3RnJvbVNlcnZlcihjYXRlZ29yeUlkOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9jdXJyZW50Q2F0ZWdvcnlJZCA9IGNhdGVnb3J5SWQ7XHJcbiAgICAgICAgbGV0IGNhbGxQYXJhbXMgPSBuZXcgUGFydGlhbFZpZXdTZXJ2ZXJDYWxsUGFyYW1ldGVycygpO1xyXG4gICAgICAgIGNhbGxQYXJhbXMuQ2F0ZWdvcnlJZCA9IGNhdGVnb3J5SWQ7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogXCJHRVRcIiwgLy9HRVQgb3IgUE9TVCBvciBQVVQgb3IgREVMRVRFIHZlcmJcclxuICAgICAgICAgICAgdXJsOiB0aGlzLl91cmwsXHJcbiAgICAgICAgICAgIGRhdGE6IGNhbGxQYXJhbXMsIC8vRGF0YSBzZW50IHRvIHNlcnZlclxyXG4gICAgICAgICAgICAvL2NvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbicsIC8vIGNvbnRlbnQgdHlwZSBzZW50IHRvIHNlcnZlclxyXG4gICAgICAgICAgICBzdWNjZXNzOiAobXNnLCB0ZXh0U3RhdHVzLCBqcVhIUikgPT4gdGhpcy5vblN1Y2Nlc3NHZXRJdGVtc0Zyb21TZXJ2ZXIobXNnLCB0ZXh0U3RhdHVzLCBqcVhIUiksLy9PbiBTdWNjZXNzZnVsbCBzZXJ2aWNlIGNhbGxcclxuICAgICAgICAgICAgZXJyb3I6IChqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pID0+IHRoaXMub25FcnJvckdldEl0ZW1zRnJvbVNlcnZlcihqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pLy8gV2hlbiBTZXJ2aWNlIGNhbGwgZmFpbHNcclxuICAgICAgICB9KTsvLy5hamF4XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvblN1Y2Nlc3NHZXRJdGVtc0Zyb21TZXJ2ZXIobXNnOiBhbnksIHRleHRTdGF0dXM6IHN0cmluZywganFYSFI6IEpRdWVyeVhIUikge1xyXG4gICAgICAgIHRoaXMuX25ld0FkQ3JpdGVyaWEuVW5CaW5kKHRoaXMuX3ByZXZpb3VzQ2F0ZWdvcnlJZCk7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX3BhcnRpYWxWaWV3RGl2SWQpLmNoaWxkcmVuKCkucmVtb3ZlKCk7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX3BhcnRpYWxWaWV3RGl2SWQpLmh0bWwobXNnKTtcclxuICAgICAgICB0aGlzLl9uZXdBZENyaXRlcmlhLkJpbmQodGhpcy5fY3VycmVudENhdGVnb3J5SWQsIHRoaXMuX25ld0FkQ3JpdGVyaWFDaGFuZ2UpO1xyXG4gICAgICAgIHRoaXMuX3ByZXZpb3VzQ2F0ZWdvcnlJZCA9IHRoaXMuX2N1cnJlbnRDYXRlZ29yeUlkO1xyXG4gICAgfS8vb25TdWNjZXNzR2V0VGltZUZyb21TZXJ2ZXJcclxuXHJcbiAgICBwcml2YXRlIG9uRXJyb3JHZXRJdGVtc0Zyb21TZXJ2ZXIoanFYSFI6IEpRdWVyeVhIUiwgdGV4dFN0YXR1czogc3RyaW5nLCBlcnJvclRocm93bjogc3RyaW5nKSB7XHJcbiAgICAgICAgYWxlcnQoZXJyb3JUaHJvd24pO1xyXG4gICAgfS8vb25FcnJvckdldFRpbWVGcm9tU2VydmVyXHJcbn1cclxuXHJcbi8vVE9ETyByZWZhY3RvciB0aGlzXHJcbmV4cG9ydCBjbGFzcyBQYXJ0aWFsVmlld1NlcnZlckNhbGxQYXJhbWV0ZXJzIHtcclxuICAgIHB1YmxpYyBDYXRlZ29yeUlkOm51bWJlcjtcclxufSIsIu+7v2ltcG9ydCB7VXNlcklucHV0fSAgZnJvbSBcIi4uLy4uLy4uL0hlbHBlci9Vc2VySW5wdXRcIjtcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgTmV3QWRTZXJ2ZXJDYWxsZXIge1xyXG5cclxuICAgIC8vVE9ETyBjYWxsIHNlcnZlciBhbmQgc2VuZCB1c2VyaW5wdXQgZnJvIG5ldyBhZFxyXG4gICAgLy9nZXQgcmVzdWx0IGFuZCBzaG93IHRvIHVzZXJcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX3VybDogc3RyaW5nID0gXCIvYXBpL0FkQXBpL0FkZEFkdmVydGlzZW1lbnRcIjtcclxuXHJcbiAgICBwdWJsaWMgU2F2ZUFkKHVzZXJJbnB1dDogVXNlcklucHV0KTogdm9pZCB7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogXCJQT1NUXCIsIC8vR0VUIG9yIFBPU1Qgb3IgUFVUIG9yIERFTEVURSB2ZXJiXHJcbiAgICAgICAgICAgIHVybDogdGhpcy5fdXJsLFxyXG4gICAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeSh1c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnkpLCAvL0RhdGEgc2VudCB0byBzZXJ2ZXJcclxuICAgICAgICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJywgLy8gY29udGVudCB0eXBlIHNlbnQgdG8gc2VydmVyXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IChtc2csIHRleHRTdGF0dXMsIGpxWEhSKSA9PiB0aGlzLm9uU3VjY2Vzc0dldEl0ZW1zRnJvbVNlcnZlcihtc2csIHRleHRTdGF0dXMsIGpxWEhSKSwgLy9PbiBTdWNjZXNzZnVsbCBzZXJ2aWNlIGNhbGxcclxuICAgICAgICAgICAgZXJyb3I6IChqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pID0+IHRoaXMub25FcnJvckdldEl0ZW1zRnJvbVNlcnZlcihqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pIC8vIFdoZW4gU2VydmljZSBjYWxsIGZhaWxzXHJcbiAgICAgICAgfSk7IC8vLmFqYXhcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9uU3VjY2Vzc0dldEl0ZW1zRnJvbVNlcnZlcihtc2c6IGFueSwgdGV4dFN0YXR1czogc3RyaW5nLCBqcVhIUjogSlF1ZXJ5WEhSKSB7XHJcbiAgICAgICAgLy9UT0RPIHJlZGlyZWN0IHVzZXIgdG8gYSBuZXcgcGFnZVxyXG4gICAgICAgIGlmIChtc2cuc3VjY2VzcyA9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmxvY2F0aW9uLnJlcGxhY2UoXCIvSG9tZS9MZXRNZUtub3dcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfSBcclxuXHJcblxyXG4gICAgcHJpdmF0ZSBvbkVycm9yR2V0SXRlbXNGcm9tU2VydmVyKGpxWEhSOiBKUXVlcnlYSFIsIHRleHRTdGF0dXM6IHN0cmluZywgZXJyb3JUaHJvd246IHN0cmluZykge1xyXG4gICAgICAgIC8vVE9ETyBpbmZvcm0gZXJyb3IgdG8gdXNlclxyXG4gICAgfSBcclxufVxyXG4iLCLvu79pbXBvcnQgeyBDYXRlZ29yeSB9IGZyb20gXCIuLi8uLi8uLi9Nb2RlbHMvQ2F0ZWdvcnlcIjtcclxuaW1wb3J0IHsgQ2F0ZWdvcnlTZWxlY3Rpb25OZXdBZCB9IGZyb20gXCIuLi8uLi8uLi9Db21wb25lbnRzL0NhdGVnb3J5L05ld0FkL0NhdGVnb3J5U2VsZWN0aW9uTmV3QWRcIjtcclxuaW1wb3J0IHsgTmV3QWRQYXJ0aWFsVmlld0xvYWRlcn0gZnJvbSBcIi4vTmV3QWRQYXJ0aWFsVmlld0xvYWRlclwiO1xyXG5pbXBvcnQge0lDcml0ZXJpYUNoYW5nZX0gZnJvbSBcIi4uLy4uLy4uL0hlbHBlci9JQ3JpdGVyaWFDaGFuZ2VcIjtcclxuaW1wb3J0IHtOZXdBZENyaXRlcmlhfSBmcm9tIFwiLi9OZXdBZENyaXRlcmlhXCI7XHJcbmltcG9ydCB7SW1hZ2VVcGxvYWRlcn0gZnJvbSBcIi4vSW1hZ2VVcGxvYWRlclwiO1xyXG5pbXBvcnQge1VzZXJJbnB1dH0gZnJvbSBcIi4uLy4uLy4uL0hlbHBlci9Vc2VySW5wdXRcIjtcclxuaW1wb3J0IHtOZXdBZFNlcnZlckNhbGxlcn0gZnJvbSBcIi4vTmV3QWRTZXJ2ZXJDYWxsZXJcIjtcclxuXHJcblxyXG5jbGFzcyBOZXdBZCBpbXBsZW1lbnRzIElDcml0ZXJpYUNoYW5nZSB7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IEFkVGl0bGVLZXkgPSBcIkFkVGl0bGVcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgQWRUaXRsZUlucHV0SWQ6IHN0cmluZyA9IFwiYWRUaXRsZVwiO1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgQWRDb21tZW50S2V5ID1cIkFkQ29tbWVudFwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBBZENvbW1lbnRJbnB1dElkID1cImFkQ29tbWVudFwiO1xyXG5cclxuICAgIHByaXZhdGUgX2FsbENhdGVnb3JpZXNJbnB1dElkOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIF9hbGxDYXRlZ29yaWVzRGl2SWQ6IHN0cmluZztcclxuICAgIHByaXZhdGUgX2NhdGVnb3J5U3BlY2lmaWNQYXJ0aWFsVmlld0lkOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9zdWJtaXRBZElucHV0SWQ6IHN0cmluZyA9IFwic3VibWl0TmV3QWRcIjtcclxuXHJcblxyXG4gICAgcHJpdmF0ZSBfY3VycmVudE5ld0FkR3VpZDpzdHJpbmc7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IEN1cnJlbnROZXdBZEd1aWRJbnB1dElkOiBzdHJpbmcgPVwiY3VycmVudE5ld0FkR3VpZFwiO1xyXG5cclxuICAgIHByaXZhdGUgX2NhdGVnb3J5U2VsZWN0aW9uTmV3QWQ6IENhdGVnb3J5U2VsZWN0aW9uTmV3QWQ7XHJcbiAgICBwcml2YXRlIF9wYXJ0aWFsVmlld0xvYWRlcjogTmV3QWRQYXJ0aWFsVmlld0xvYWRlcjtcclxuICAgIHByaXZhdGUgX25ld0FkQ3JpdGVyaWE6IE5ld0FkQ3JpdGVyaWE7XHJcbiAgICBwcml2YXRlIF9pbWFnZVVwbG9hZGVyOiBJbWFnZVVwbG9hZGVyO1xyXG4gICAgcHJpdmF0ZSBfbmV3QWRTZXJ2ZXJDYWxsZXI6TmV3QWRTZXJ2ZXJDYWxsZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IoYWxsQ2F0ZWdvcmllc0Rpdjogc3RyaW5nLGFsbENhdGVnb3JpZXNJbnB1dElkOiBzdHJpbmcsY2F0ZWdvcnlTcGVjaWZpY1BhcnRpYWxWaWV3SWQ6c3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5fYWxsQ2F0ZWdvcmllc0RpdklkID0gYWxsQ2F0ZWdvcmllc0RpdjtcclxuICAgICAgICB0aGlzLl9hbGxDYXRlZ29yaWVzSW5wdXRJZCA9IGFsbENhdGVnb3JpZXNJbnB1dElkO1xyXG4gICAgICAgIHRoaXMuX2NhdGVnb3J5U3BlY2lmaWNQYXJ0aWFsVmlld0lkID0gY2F0ZWdvcnlTcGVjaWZpY1BhcnRpYWxWaWV3SWQ7XHJcbiAgICAgICAgdGhpcy5fbmV3QWRDcml0ZXJpYSA9IG5ldyBOZXdBZENyaXRlcmlhKCk7XHJcbiAgICAgICAgdGhpcy5pbml0UGFnZSgpO1xyXG4gICAgICAgIHRoaXMuX2ltYWdlVXBsb2FkZXIgPSBuZXcgSW1hZ2VVcGxvYWRlcih0aGlzLl9jdXJyZW50TmV3QWRHdWlkKTtcclxuICAgICAgICB0aGlzLl9uZXdBZFNlcnZlckNhbGxlciA9IG5ldyBOZXdBZFNlcnZlckNhbGxlcigpO1xyXG4gICAgICAgIHRoaXMuaW5pdEV2ZW50SGFuZGxlcnMoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgQ3VzdG9tQ3JpdGVyaWFDaGFuZ2VkKCk6IHZvaWQge1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaW5pdFBhZ2UoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5pbml0TmV3QWRDYXRlZ29yeSgpO1xyXG4gICAgICAgIHRoaXMuX3BhcnRpYWxWaWV3TG9hZGVyID0gbmV3IE5ld0FkUGFydGlhbFZpZXdMb2FkZXIodGhpcy5fY2F0ZWdvcnlTcGVjaWZpY1BhcnRpYWxWaWV3SWQsIHRoaXMsIHRoaXMuX25ld0FkQ3JpdGVyaWEpO1xyXG4gICAgICAgIHRoaXMuX2N1cnJlbnROZXdBZEd1aWQgPSAkKFwiI1wiICsgdGhpcy5DdXJyZW50TmV3QWRHdWlkSW5wdXRJZCkudmFsKCkudG9TdHJpbmcoKTtcclxuICAgICAgICBcclxuXHJcbiAgICB9XHJcblxyXG4gICBcclxuXHJcbiAgICBwcml2YXRlIGluaXROZXdBZENhdGVnb3J5KCk6dm9pZCB7XHJcbiAgICAgICAgbGV0IGFsbENhdGVnb3JpZXNTdHJpbmcgPSAkKFwiI1wiICsgdGhpcy5fYWxsQ2F0ZWdvcmllc0lucHV0SWQpLnZhbCgpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgbGV0IGFsbENhdGVnb3JpZXMgPSAkLnBhcnNlSlNPTihhbGxDYXRlZ29yaWVzU3RyaW5nKSBhcyBDYXRlZ29yeVtdO1xyXG4gICAgICAgIHRoaXMuX2NhdGVnb3J5U2VsZWN0aW9uTmV3QWQgPSBuZXcgQ2F0ZWdvcnlTZWxlY3Rpb25OZXdBZCh0aGlzLl9hbGxDYXRlZ29yaWVzRGl2SWQsIGFsbENhdGVnb3JpZXMpO1xyXG4gICAgICAgIHRoaXMuX2NhdGVnb3J5U2VsZWN0aW9uTmV3QWQuQ3JlYXRlRmlyc3RMZXZlbCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaW5pdEV2ZW50SGFuZGxlcnMoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fY2F0ZWdvcnlTZWxlY3Rpb25OZXdBZC5TZWxlY3RlZENhdGVnb3J5Q2hhbmdlZEV2ZW50LlN1YnNjcmliZSgoc2VuZGVyLCBhcmdzKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5fY2F0ZWdvcnlTZWxlY3Rpb25OZXdBZC5TZWxlY3RlZENhdGVnb3J5SGFzQ2hpbGRyZW4oKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcGFydGlhbFZpZXdMb2FkZXIuR2V0UGFydGlhbFZpZXdGcm9tU2VydmVyKGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJChcIiNcIit0aGlzLl9zdWJtaXRBZElucHV0SWQpLm9uKFwiY2xpY2tcIiwgKGV2ZW50KT0+IHtcclxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdGhpcy5zdWJtaXRBZCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3VibWl0QWQoKSB7XHJcbiAgICAgICAgLy9UT0RPIGRpc2FibGUgc3VibWl0QWQgQnV0dG9uIHVudGlsIGN1cnJlbnQgc3VibWlzc2lvbiBpcyBvayBvciBlcnJvcm5vdXMgXHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHVzZXJJbnB1dCA9IG5ldyBVc2VySW5wdXQoKTtcclxuICAgICAgICB1c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnlbXCJOZXdBZEd1aWRcIl0gPSB0aGlzLl9jdXJyZW50TmV3QWRHdWlkO1xyXG4gICAgICAgIHRoaXMuX2NhdGVnb3J5U2VsZWN0aW9uTmV3QWQuSW5zZXJ0Q2F0ZWdvcnlJZEluVXNlcklucHV0RGljdGlvbmFyeSh1c2VySW5wdXQpO1xyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLkFkVGl0bGVLZXldID0gJChcIiNcIiArIHRoaXMuQWRUaXRsZUlucHV0SWQpLnZhbCgpO1xyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLkFkQ29tbWVudEtleV0gPSAkKFwiI1wiICsgdGhpcy5BZENvbW1lbnRJbnB1dElkKS52YWwoKTtcclxuICAgICAgICB0aGlzLl9uZXdBZENyaXRlcmlhLkZpbGxDYXRlZ29yeVNwZWNpZmljTmV3QWRDcml0ZXJpYSh0aGlzLl9jYXRlZ29yeVNlbGVjdGlvbk5ld0FkLkdldFNlbGVjdGVkQ2F0ZWdvcnlJZCgpLCB1c2VySW5wdXQpO1xyXG4gICAgICAgIHRoaXMuX25ld0FkU2VydmVyQ2FsbGVyLlNhdmVBZCh1c2VySW5wdXQpO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcbmxldCBhbGxDYXRlZ29yaWVzRGl2SWQ6IHN0cmluZyA9IFwiYWxsQ2F0ZWdvcmllc0RpdlwiO1xyXG5sZXQgYWxsQ2F0ZWdvcmllc0lucHV0SWQ6IHN0cmluZyA9IFwiYWxsQ2F0ZWdvcmllc0lucHV0XCI7XHJcbmxldCBjYXRlZ29yeVNwZWNpZmljUGFydGlhbFZpZXdJZDogc3RyaW5nID0gXCJDYXRlZ29yeVNwZWNpZmljQ3JpdGVyaWFcIjtcclxuJChkb2N1bWVudCkucmVhZHkoKCkgPT4ge1xyXG4gICAgbGV0IG5ld0FkID0gbmV3IE5ld0FkKGFsbENhdGVnb3JpZXNEaXZJZCwgYWxsQ2F0ZWdvcmllc0lucHV0SWQsY2F0ZWdvcnlTcGVjaWZpY1BhcnRpYWxWaWV3SWQpO1xyXG59KTsvL3JlYWR5Il19
