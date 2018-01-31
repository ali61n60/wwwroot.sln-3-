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
        if (msg.Success == true) {
            this.updateSendingImageTemplate(msg.ResponseData);
        }
        else {
            this.showMessageToUser(msg.Messag + " ," + msg.ErrorCode);
            this.uploadImageTimerExpire(parseInt(msg.ResponseData.RequestIndex));
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
        if ($("#loadedImageView > #uploadingImage" + data.RequestIndex).length === 0) {
            this.addUploadingImageTemplate(parseInt(data.RequestIndex));
            this.updateSendingImageTemplate(data);
        }
        else {
            //TODO cancel timer
            $("#loadedImageView > #uploadingImage" + data.RequestIndex + " >img")
                .attr("src", "data:image/jpg;base64," + data.Image).removeClass("gifImage");
            $("#loadedImageView > #uploadingImage" + data.RequestIndex).attr("id", data.ImageFileName);
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
        if (msg.Success == true) {
            this.showMessageToUser("done removing file from server");
            var fileName = msg.ResponseData;
            $("[id=\"" + fileName + "\"]").remove();
        }
        else {
            this.showMessageToUser(msg.Message);
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
},{}],8:[function(require,module,exports){
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
},{"../../../Helper/CriteriaNumericDictionary":5,"./NewAdCriteria/AdTransformationNewAdCriteria":9,"./NewAdCriteria/DefaultNewAdCriteria":10}],9:[function(require,module,exports){
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
},{"../../../../Components/Transformation/CarModelBrandController":2}],10:[function(require,module,exports){
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
},{}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AjaxCaller_1 = require("../../../Helper/AjaxCaller");
var NewAdPartialViewLoader = /** @class */ (function () {
    function NewAdPartialViewLoader(resultHandler, newAdCriteriaChange, newAdCriteria, requestCode) {
        this.RequestIndexKey = "RequestIndex";
        this._currentRequestIndex = 0;
        this._url = "/NewAd/GetNewAdPartialView";
        this._previousCategoryId = 0;
        this._currentCategoryId = 0;
        this._resultHandler = resultHandler;
        this._newAdCriteriaChange = newAdCriteriaChange;
        this._newAdCriteria = newAdCriteria;
        this._ajaxCaller = new AjaxCaller_1.AjaxCaller(this._url, this, requestCode);
    }
    NewAdPartialViewLoader.prototype.GetPartialViewFromServer = function (userInput, categoryId) {
        this._currentCategoryId = categoryId;
        this._currentRequestIndex++;
        userInput.ParametersDictionary[this.RequestIndexKey] = this._currentRequestIndex;
        this._ajaxCaller.Call(userInput);
    };
    NewAdPartialViewLoader.prototype.onSuccessGetItemsFromServer = function (msg, textStatus, jqXHR) {
    }; //onSuccessGetTimeFromServer
    NewAdPartialViewLoader.prototype.onErrorGetItemsFromServer = function (jqXHR, textStatus, errorThrown) {
    }; //onErrorGetTimeFromServer
    NewAdPartialViewLoader.prototype.OnResult = function (param, requestCode) {
        if (param.CustomDictionary[this.RequestIndexKey] == this._currentRequestIndex) {
            if (param.Success == true) {
                this._newAdCriteria.UnBind(this._previousCategoryId);
                this._resultHandler.OnResult(param.ResponseData, requestCode);
                this._newAdCriteria.Bind(this._currentCategoryId, this._newAdCriteriaChange);
                this._previousCategoryId = this._currentCategoryId;
            }
            else {
                this._resultHandler.OnError(param.Message + " , " + param.ErrorCode, requestCode);
            }
        }
    };
    NewAdPartialViewLoader.prototype.OnError = function (message, requestCode) {
        this._resultHandler.OnError(message, requestCode);
    };
    NewAdPartialViewLoader.prototype.AjaxCallFinished = function (requestCode) {
        this._resultHandler.AjaxCallFinished(requestCode);
    };
    NewAdPartialViewLoader.prototype.AjaxCallStarted = function (requestCode) {
        this._resultHandler.AjaxCallStarted(requestCode);
    };
    return NewAdPartialViewLoader;
}());
exports.NewAdPartialViewLoader = NewAdPartialViewLoader;
////TODO refactor this
//export class PartialViewServerCallParameters {
//    public CategoryId: number;
//} 
},{"../../../Helper/AjaxCaller":4}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NewAdServerCaller = /** @class */ (function () {
    function NewAdServerCaller() {
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
        if (msg.Success == true) {
            document.location.replace("/NewAd/Confirm");
        }
    };
    NewAdServerCaller.prototype.onErrorGetItemsFromServer = function (jqXHR, textStatus, errorThrown) {
        //TODO inform error to user
    };
    return NewAdServerCaller;
}());
exports.NewAdServerCaller = NewAdServerCaller;
},{}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CategorySelection_1 = require("../../../Components/Category/CategorySelection");
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
        this.AddAdvertisementRequestCode = 1;
        this.LoadNewAdPartialViewRequestCode = 2;
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
        this._partialViewLoader = new NewAdPartialViewLoader_1.NewAdPartialViewLoader(this, this, this._newAdCriteria, this.LoadNewAdPartialViewRequestCode);
        this._currentNewAdGuid = $("#" + this.CurrentNewAdGuidInputId).val().toString();
    };
    NewAd.prototype.initNewAdCategory = function () {
        var allCategoriesString = $("#" + this._allCategoriesInputId).val().toString();
        var allCategories = $.parseJSON(allCategoriesString);
        this._categorySelection = new CategorySelection_1.CategorySelection(this._allCategoriesDivId, allCategories);
        this._categorySelection.CreateFirstLevel();
    };
    NewAd.prototype.initEventHandlers = function () {
        var _this = this;
        this._categorySelection.SelectedCategoryChangedEvent.Subscribe(function (sender, args) {
            if (!args.SelectedCategoryHasChild) {
                var userInput = new UserInput_1.UserInput();
                _this._categorySelection.InsertCategoryIdInUserInputDictionary(userInput);
                _this._partialViewLoader.GetPartialViewFromServer(userInput, args.SelectedCategoryId);
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
        this._categorySelection.InsertCategoryIdInUserInputDictionary(userInput);
        userInput.ParametersDictionary[this.AdTitleKey] = $("#" + this.AdTitleInputId).val();
        userInput.ParametersDictionary[this.AdCommentKey] = $("#" + this.AdCommentInputId).val();
        this._newAdCriteria.FillCategorySpecificNewAdCriteria(this._categorySelection.GetSelectedCategoryId(), userInput);
        this._newAdServerCaller.SaveAd(userInput);
    };
    NewAd.prototype.OnResult = function (param, requestCode) {
        if (requestCode === this.LoadNewAdPartialViewRequestCode) {
            $("#" + this._categorySpecificPartialViewId).children().remove();
            $("#" + this._categorySpecificPartialViewId).html(param);
        }
        else if (requestCode === this.AddAdvertisementRequestCode) {
        }
    };
    NewAd.prototype.OnError = function (message, requestCode) {
        if (requestCode === this.LoadNewAdPartialViewRequestCode) {
            alert(message);
        }
        else if (requestCode === this.AddAdvertisementRequestCode) {
        }
    };
    NewAd.prototype.AjaxCallFinished = function (requestCode) {
        if (requestCode === this.LoadNewAdPartialViewRequestCode) {
        }
        else if (requestCode === this.AddAdvertisementRequestCode) {
        }
    };
    NewAd.prototype.AjaxCallStarted = function (requestCode) {
        if (requestCode === this.LoadNewAdPartialViewRequestCode) {
        }
        else if (requestCode === this.AddAdvertisementRequestCode) {
        }
    };
    return NewAd;
}());
var allCategoriesDivId = "categorySelector";
var allCategoriesInputId = "allCategories";
var categorySpecificPartialViewId = "CategorySpecificCriteria";
$(document).ready(function () {
    var newAd = new NewAd(allCategoriesDivId, allCategoriesInputId, categorySpecificPartialViewId);
}); //ready
},{"../../../Components/Category/CategorySelection":1,"../../../Helper/UserInput":6,"./ImageUploader":7,"./NewAdCriteria":8,"./NewAdPartialViewLoader":11,"./NewAdServerCaller":12}]},{},[13])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3d3dyb290L2pzL0NvbXBvbmVudHMvQ2F0ZWdvcnkvQ2F0ZWdvcnlTZWxlY3Rpb24udHMiLCJ3d3dyb290L2pzL0NvbXBvbmVudHMvVHJhbnNmb3JtYXRpb24vQ2FyTW9kZWxCcmFuZENvbnRyb2xsZXIudHMiLCJ3d3dyb290L2pzL0V2ZW50cy9FdmVudERpc3BhdGNoZXIudHMiLCJ3d3dyb290L2pzL0hlbHBlci9BamF4Q2FsbGVyLnRzIiwid3d3cm9vdC9qcy9IZWxwZXIvQ3JpdGVyaWFOdW1lcmljRGljdGlvbmFyeS50cyIsInd3d3Jvb3QvanMvSGVscGVyL1VzZXJJbnB1dC50cyIsInd3d3Jvb3QvanMvaG9tZS9uZXdBZC9zcmMvSW1hZ2VVcGxvYWRlci50cyIsInd3d3Jvb3QvanMvaG9tZS9uZXdBZC9zcmMvTmV3QWRDcml0ZXJpYS50cyIsInd3d3Jvb3QvanMvaG9tZS9uZXdBZC9zcmMvTmV3QWRDcml0ZXJpYS9BZFRyYW5zZm9ybWF0aW9uTmV3QWRDcml0ZXJpYS50cyIsInd3d3Jvb3QvanMvaG9tZS9uZXdBZC9zcmMvTmV3QWRDcml0ZXJpYS9EZWZhdWx0TmV3QWRDcml0ZXJpYS50cyIsInd3d3Jvb3QvanMvaG9tZS9uZXdBZC9zcmMvTmV3QWRQYXJ0aWFsVmlld0xvYWRlci50cyIsInd3d3Jvb3QvanMvaG9tZS9uZXdBZC9zcmMvTmV3QWRTZXJ2ZXJDYWxsZXIudHMiLCJ3d3dyb290L2pzL2hvbWUvbmV3QWQvc3JjL25ld0FkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQyxnRUFBK0Q7QUFJaEU7SUEyQkksMkJBQVksV0FBbUIsRUFBRSxhQUF5QjtRQXpCbkQsaUNBQTRCLEdBQWdFLElBQUksaUNBQWUsRUFBOEMsQ0FBQztRQUVwSixrQkFBYSxHQUFHLFlBQVksQ0FBQztRQUs3Qix3QkFBbUIsR0FBRyxtQkFBbUIsQ0FBQztRQUMxQyxtQkFBYyxH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QUMsQ0FBQyxLQUFLLENBQUM7SUFDZCxJQUFJLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxrQkFBa0IsRUFBRSxvQkFBb0IsRUFBRSw2QkFBNkIsQ0FBQyxDQUFDO0FBQ25HLENBQUMsQ0FBQyxDQUFDLENBQUEsT0FBTyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCLvu79pbXBvcnQgeyBFdmVudERpc3BhdGNoZXIgfSBmcm9tIFwiLi4vLi4vRXZlbnRzL0V2ZW50RGlzcGF0Y2hlclwiO1xyXG5pbXBvcnQgeyBDYXRlZ29yeSB9IGZyb20gXCIuLi8uLi9Nb2RlbHMvQ2F0ZWdvcnlcIjtcclxuaW1wb3J0IHsgVXNlcklucHV0IH0gZnJvbSBcIi4uLy4uL0hlbHBlci9Vc2VySW5wdXRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDYXRlZ29yeVNlbGVjdGlvbiB7XHJcblxyXG4gICAgcHVibGljIFNlbGVjdGVkQ2F0ZWdvcnlDaGFuZ2VkRXZlbnQ6IEV2ZW50RGlzcGF0Y2hlcjxDYXRlZ29yeVNlbGVjdGlvbiwgQ2F0ZWdvcnlDYWhuZ2VkRXZlbnRBcmc+ID0gbmV3IEV2ZW50RGlzcGF0Y2hlcjxDYXRlZ29yeVNlbGVjdGlvbiwgQ2F0ZWdvcnlDYWhuZ2VkRXZlbnRBcmc+KCk7XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBDYXRlZ29yeUlkS2V5ID0gXCJDYXRlZ29yeUlkXCI7XHJcblxyXG4gICAgcHJpdmF0ZSBfcGFyZW50RGl2SWQ6IHN0cmluZzsvL2RpdiBlbGVtZW50IHRoYXQgaG9sZHMgYWxsIENhdGVnb3J5U2VsZWN0aW9uIGVsZW1lbnRzXHJcbiAgICBwcml2YXRlIF9hbGxDYXRlZ29yaWVzOiBDYXRlZ29yeVtdO1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2ZpcnN0TGV2ZWxUZW1wbGF0ZSA9IFwiY2F0ZWdvcnkxVGVtcGxhdGVcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2ZpcnN0TGV2ZWxEaXYgPSBcImNhdGVnb3J5MVwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfZmlyc3RMZXZlbFNlbGVjdDogc3RyaW5nID0gXCJzZWxlY3QxXCI7XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfc2Vjb25kTGV2ZWxUZW1wbGF0ZSA9IFwiY2F0ZWdvcnkyVGVtcGxhdGVcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX3NlY29uZExldmVsRGl2ID0gXCJjYXRlZ29yeTJcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX3NlY29uZExldmVsU2VsZWN0OiBzdHJpbmcgPSBcInNlbGVjdDJcIjtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF90aGlyZExldmVsVGVtcGxhdGUgPSBcImNhdGVnb3J5M1RlbXBsYXRlXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF90aGlyZExldmVsRGl2ID0gXCJjYXRlZ29yeTNcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX3RoaXJkTGV2ZWxTZWxlY3Q6IHN0cmluZyA9IFwic2VsZWN0M1wiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfcm9vdENhdGVnb3J5SWQ6IG51bWJlciA9IDA7XHJcblxyXG4gICAgcHJpdmF0ZSBfc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxPbmU6IG51bWJlcjtcclxuICAgIHByaXZhdGUgX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVHdvOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIF9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFRocmVlOiBudW1iZXI7XHJcblxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBhcmVudERpdklkOiBzdHJpbmcsIGFsbENhdGVnb3JpZXM6IENhdGVnb3J5W10pIHtcclxuICAgICAgICB0aGlzLl9wYXJlbnREaXZJZCA9IHBhcmVudERpdklkO1xyXG4gICAgICAgIHRoaXMuX2FsbENhdGVnb3JpZXMgPSBhbGxDYXRlZ29yaWVzO1xyXG4gICAgfVxyXG5cclxuICAgIFxyXG5cclxuICAgIHB1YmxpYyBTZXRDYXRlZ29yeUlkKHNlbGVjdGVkQ2F0ZWdvcnlJZDogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgbGV0IGZpcnN0TGV2ZWxJZDogbnVtYmVyO1xyXG4gICAgICAgIGxldCBzZWNvbmRMZXZlbElkOiBudW1iZXI7XHJcbiAgICAgICAgbGV0IGNhdGVnb3J5TGV2ZWwgPSB0aGlzLmdldENhdGVnb3J5TGV2ZWwoc2VsZWN0ZWRDYXRlZ29yeUlkKTtcclxuICAgICAgICBzd2l0Y2ggKGNhdGVnb3J5TGV2ZWwpIHtcclxuICAgICAgICBjYXNlIENhdGVnb3J5TGV2ZWwuVW5rb3duOlxyXG4gICAgICAgICAgICB0aGlzLkNyZWF0ZUZpcnN0TGV2ZWwoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIENhdGVnb3J5TGV2ZWwuTGV2ZWwxOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5DcmVhdGVGaXJzdExldmVsKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldEZpcnN0TGV2ZWxUb1NwZWNpZmljSWQoc2VsZWN0ZWRDYXRlZ29yeUlkKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlU2Vjb25kTGV2ZWwoc2VsZWN0ZWRDYXRlZ29yeUlkKTtcclxuICAgICAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLl9maXJzdExldmVsU2VsZWN0KS50cmlnZ2VyKFwiY2hhbmdlXCIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgQ2F0ZWdvcnlMZXZlbC5MZXZlbDI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLkNyZWF0ZUZpcnN0TGV2ZWwoKTtcclxuICAgICAgICAgICAgICAgIGZpcnN0TGV2ZWxJZCA9IHRoaXMuX2FsbENhdGVnb3JpZXMuZmlsdGVyKGNhdGVnb3J5ID0+IGNhdGVnb3J5LkNhdGVnb3J5SWQgPT09IHNlbGVjdGVkQ2F0ZWdvcnlJZClbMF1cclxuICAgICAgICAgICAgICAgICAgICAuQ2F0ZWdvcnlQYXJlbnRJZDtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0Rmlyc3RMZXZlbFRvU3BlY2lmaWNJZChmaXJzdExldmVsSWQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVTZWNvbmRMZXZlbChmaXJzdExldmVsSWQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTZWNvbmRMZXZlbFRvU3BlY2lmaWNJZChzZWxlY3RlZENhdGVnb3J5SWQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVUaGlyZExldmVsKHNlbGVjdGVkQ2F0ZWdvcnlJZCk7XHJcbiAgICAgICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5fc2Vjb25kTGV2ZWxTZWxlY3QpLnRyaWdnZXIoXCJjaGFuZ2VcIik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIENhdGVnb3J5TGV2ZWwuTGV2ZWwzOlxyXG4gICAgICAgICAgICB0aGlzLkNyZWF0ZUZpcnN0TGV2ZWwoKTtcclxuICAgICAgICAgICAgc2Vjb25kTGV2ZWxJZCA9IHRoaXMuX2FsbENhdGVnb3JpZXMuZmlsdGVyKGNhdGVnb3J5ID0+IGNhdGVnb3J5LkNhdGVnb3J5SWQgPT09IHNlbGVjdGVkQ2F0ZWdvcnlJZClbMF1cclxuICAgICAgICAgICAgICAgICAgICAuQ2F0ZWdvcnlQYXJlbnRJZDtcclxuICAgICAgICAgICAgZmlyc3RMZXZlbElkID0gdGhpcy5fYWxsQ2F0ZWdvcmllcy5maWx0ZXIoY2F0ZWdvcnkgPT4gY2F0ZWdvcnkuQ2F0ZWdvcnlJZCA9PT0gc2Vjb25kTGV2ZWxJZClbMF1cclxuICAgICAgICAgICAgICAgIC5DYXRlZ29yeVBhcmVudElkO1xyXG4gICAgICAgICAgICB0aGlzLnNldEZpcnN0TGV2ZWxUb1NwZWNpZmljSWQoZmlyc3RMZXZlbElkKTtcclxuICAgICAgICAgICAgdGhpcy5jcmVhdGVTZWNvbmRMZXZlbChmaXJzdExldmVsSWQpO1xyXG4gICAgICAgICAgICB0aGlzLnNldFNlY29uZExldmVsVG9TcGVjaWZpY0lkKHNlY29uZExldmVsSWQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVUaGlyZExldmVsKHNlY29uZExldmVsSWQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRUaGlyZExldmVsVG9TcGVjaWZpY0lkKHNlbGVjdGVkQ2F0ZWdvcnlJZCk7XHJcbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLl90aGlyZExldmVsU2VsZWN0KS50cmlnZ2VyKFwiY2hhbmdlXCIpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXRGaXJzdExldmVsVG9TcGVjaWZpY0lkKGNhdGVnb3J5SWQ6IG51bWJlcikge1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9maXJzdExldmVsU2VsZWN0KS52YWwoY2F0ZWdvcnlJZCk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHNldFNlY29uZExldmVsVG9TcGVjaWZpY0lkKGNhdGVnb3J5SWQ6IG51bWJlcikge1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9zZWNvbmRMZXZlbFNlbGVjdCkudmFsKGNhdGVnb3J5SWQpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBzZXRUaGlyZExldmVsVG9TcGVjaWZpY0lkKGNhdGVnb3J5SWQ6IG51bWJlcikge1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl90aGlyZExldmVsU2VsZWN0KS52YWwoY2F0ZWdvcnlJZCk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGdldENhdGVnb3J5TGV2ZWwoY2F0ZWdvcnlJZDogbnVtYmVyKTogQ2F0ZWdvcnlMZXZlbCB7XHJcblxyXG4gICAgICAgIGxldCB0ZW1wQ2F0ZWdvcnlBcnJheSA9IHRoaXMuX2FsbENhdGVnb3JpZXMuZmlsdGVyKGNhdGVnb3J5ID0+IGNhdGVnb3J5LkNhdGVnb3J5SWQgPT09IGNhdGVnb3J5SWQpO1xyXG4gICAgICAgIGxldCB0ZW1wQ2F0ZWdvcnk7XHJcbiAgICAgICAgaWYgKHRlbXBDYXRlZ29yeUFycmF5Lmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gQ2F0ZWdvcnlMZXZlbC5Vbmtvd247XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRlbXBDYXRlZ29yeSA9IHRlbXBDYXRlZ29yeUFycmF5WzBdO1xyXG4gICAgICAgIGlmICh0ZW1wQ2F0ZWdvcnkuUGFyZW50Q2F0ZWdvcnlJZCA9PT0gdGhpcy5fcm9vdENhdGVnb3J5SWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIENhdGVnb3J5TGV2ZWwuTGV2ZWwxO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0ZW1wQ2F0ZWdvcnkgPSB0aGlzLl9hbGxDYXRlZ29yaWVzLmZpbHRlcihjYXRlZ29yeSA9PiBjYXRlZ29yeS5DYXRlZ29yeUlkID09PSB0ZW1wQ2F0ZWdvcnkuUGFyZW50Q2F0ZWdvcnlJZClbMF07XHJcbiAgICAgICAgaWYgKHRlbXBDYXRlZ29yeS5QYXJlbnRDYXRlZ29yeUlkID09PSB0aGlzLl9yb290Q2F0ZWdvcnlJZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gQ2F0ZWdvcnlMZXZlbC5MZXZlbDI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBDYXRlZ29yeUxldmVsLkxldmVsMztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgSW5zZXJ0Q2F0ZWdvcnlJZEluVXNlcklucHV0RGljdGlvbmFyeSh1c2VySW5wdXQ6IFVzZXJJbnB1dCk6IHZvaWQge1xyXG4gICAgICAgIGxldCBjYXRlZ29yeUlkID0gdGhpcy5HZXRTZWxlY3RlZENhdGVnb3J5SWQoKTtcclxuICAgICAgICB1c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnlbdGhpcy5DYXRlZ29yeUlkS2V5XSA9IGNhdGVnb3J5SWQ7Ly8xMDAgZm9yIGNhcnNcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgR2V0U2VsZWN0ZWRDYXRlZ29yeUlkKCk6IG51bWJlciB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVGhyZWUgIT09IHVuZGVmaW5lZCAmJlxyXG4gICAgICAgICAgICB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFRocmVlICE9PSB0aGlzLl9yb290Q2F0ZWdvcnlJZClcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVGhyZWU7XHJcbiAgICAgICAgZWxzZSBpZiAodGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUd28gIT09IHVuZGVmaW5lZCAmJlxyXG4gICAgICAgICAgICB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFR3byAhPT0gdGhpcy5fcm9vdENhdGVnb3J5SWQpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFR3bztcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbE9uZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgQ3JlYXRlRmlyc3RMZXZlbCgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnJlbW92ZUVsZW1lbnQodGhpcy5fZmlyc3RMZXZlbERpdik7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxPbmUgPSB0aGlzLl9yb290Q2F0ZWdvcnlJZDtcclxuICAgICAgICB0aGlzLnJlbW92ZUVsZW1lbnQodGhpcy5fc2Vjb25kTGV2ZWxEaXYpO1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVHdvID0gdGhpcy5fcm9vdENhdGVnb3J5SWQ7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVFbGVtZW50KHRoaXMuX3RoaXJkTGV2ZWxEaXYpO1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVGhyZWUgPSB0aGlzLl9yb290Q2F0ZWdvcnlJZDtcclxuXHJcbiAgICAgICAgbGV0IHRlbXBsYXRlID0gJChcIiNcIiArIHRoaXMuX2ZpcnN0TGV2ZWxUZW1wbGF0ZSkuaHRtbCgpO1xyXG4gICAgICAgIGxldCBjYXRlZ29yaWVzOiBDYXRlZ29yeVtdID0gbmV3IEFycmF5PENhdGVnb3J5PigpO1xyXG4gICAgICAgIGxldCBkYXRhID0geyBjYXRlZ29yaWVzOiBjYXRlZ29yaWVzIH1cclxuICAgICAgICB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbE9uZSA9IHRoaXMuX3Jvb3RDYXRlZ29yeUlkOy8vXHJcbiAgICAgICAgdGhpcy5fYWxsQ2F0ZWdvcmllcy5mb3JFYWNoKGNhdGVnb3J5ID0+IHtcclxuICAgICAgICAgICAgaWYgKGNhdGVnb3J5LkNhdGVnb3J5UGFyZW50SWQgPT09IHRoaXMuX3Jvb3RDYXRlZ29yeUlkKSB7XHJcbiAgICAgICAgICAgICAgICBjYXRlZ29yaWVzLnB1c2goY2F0ZWdvcnkpO1xyXG4gICAgICAgICAgICB9Ly9pZlxyXG4gICAgICAgIH0pOy8vZm9yRWFjaFxyXG5cclxuICAgICAgICBsZXQgaHRtbCA9IE11c3RhY2hlLnRvX2h0bWwodGVtcGxhdGUsIGRhdGEpO1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9wYXJlbnREaXZJZCkuYXBwZW5kKGh0bWwpO1xyXG5cclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fZmlyc3RMZXZlbFNlbGVjdCkuY2hhbmdlKChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgc2VsZWN0ZWRJZCA9IHBhcnNlSW50KCQoZXZlbnQuY3VycmVudFRhcmdldCkudmFsKCkudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsT25lID0gc2VsZWN0ZWRJZDtcclxuICAgICAgICAgICAgdGhpcy5jcmVhdGVTZWNvbmRMZXZlbChzZWxlY3RlZElkKTtcclxuICAgICAgICAgICAgbGV0IGV2ZW50QXJnID0gbmV3IENhdGVnb3J5Q2FobmdlZEV2ZW50QXJnKCk7XHJcbiAgICAgICAgICAgIGV2ZW50QXJnLlNlbGVjdGVkQ2F0ZWdvcnlJZCA9IHRoaXMuR2V0U2VsZWN0ZWRDYXRlZ29yeUlkKCk7XHJcbiAgICAgICAgICAgIGV2ZW50QXJnLlNlbGVjdGVkQ2F0ZWdvcnlIYXNDaGlsZCA9IHRoaXMuc2VsZWN0ZWRDYXRlZ29yeUhhc0NoaWxkcmVuKCk7XHJcbiAgICAgICAgICAgIHRoaXMuU2VsZWN0ZWRDYXRlZ29yeUNoYW5nZWRFdmVudC5EaXNwYXRjaCh0aGlzLCBldmVudEFyZyk7XHJcbiAgICAgICAgfSk7Ly9jaGFuZ2VcclxuICAgIH0vL0NyZWF0ZUZpcnN0TGV2ZWxcclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZVNlY29uZExldmVsKGZpcnN0TGV2ZWxDYXRlZ29yeUlkOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnJlbW92ZUVsZW1lbnQodGhpcy5fc2Vjb25kTGV2ZWxEaXYpO1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVHdvID0gdGhpcy5fcm9vdENhdGVnb3J5SWQ7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVFbGVtZW50KHRoaXMuX3RoaXJkTGV2ZWxEaXYpO1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVGhyZWUgPSB0aGlzLl9yb290Q2F0ZWdvcnlJZDtcclxuICAgICAgICBpZiAoZmlyc3RMZXZlbENhdGVnb3J5SWQgPT09IHRoaXMuX3Jvb3RDYXRlZ29yeUlkKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCB0ZW1wbGF0ZSA9ICQoXCIjXCIgKyB0aGlzLl9zZWNvbmRMZXZlbFRlbXBsYXRlKS5odG1sKCk7XHJcbiAgICAgICAgbGV0IGNhdGVnb3JpZXM6IENhdGVnb3J5W10gPSBuZXcgQXJyYXk8Q2F0ZWdvcnk+KCk7XHJcbiAgICAgICAgbGV0IGRhdGEgPSB7IGNhdGVnb3JpZXM6IGNhdGVnb3JpZXMgfVxyXG5cclxuICAgICAgICB0aGlzLl9hbGxDYXRlZ29yaWVzLmZvckVhY2goY2F0ZWdvcnkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoY2F0ZWdvcnkuQ2F0ZWdvcnlQYXJlbnRJZCA9PT0gZmlyc3RMZXZlbENhdGVnb3J5SWQpIHtcclxuICAgICAgICAgICAgICAgIGNhdGVnb3JpZXMucHVzaChjYXRlZ29yeSk7XHJcbiAgICAgICAgICAgIH0vL2lmXHJcbiAgICAgICAgfSk7Ly9mb3JFYWNoXHJcblxyXG4gICAgICAgIGxldCBodG1sID0gTXVzdGFjaGUudG9faHRtbCh0ZW1wbGF0ZSwgZGF0YSk7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX3BhcmVudERpdklkKS5hcHBlbmQoaHRtbCk7XHJcblxyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9zZWNvbmRMZXZlbFNlbGVjdCkuY2hhbmdlKChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgc2VsZWN0ZWRJZCA9IHBhcnNlSW50KCQoZXZlbnQuY3VycmVudFRhcmdldCkudmFsKCkudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVHdvID0gc2VsZWN0ZWRJZDtcclxuICAgICAgICAgICAgdGhpcy5jcmVhdGVUaGlyZExldmVsKHNlbGVjdGVkSWQpO1xyXG4gICAgICAgICAgICBsZXQgZXZlbnRBcmcgPSBuZXcgQ2F0ZWdvcnlDYWhuZ2VkRXZlbnRBcmcoKTtcclxuICAgICAgICAgICAgZXZlbnRBcmcuU2VsZWN0ZWRDYXRlZ29yeUlkID0gdGhpcy5HZXRTZWxlY3RlZENhdGVnb3J5SWQoKTtcclxuICAgICAgICAgICAgZXZlbnRBcmcuU2VsZWN0ZWRDYXRlZ29yeUhhc0NoaWxkID0gdGhpcy5zZWxlY3RlZENhdGVnb3J5SGFzQ2hpbGRyZW4oKTtcclxuICAgICAgICAgICAgdGhpcy5TZWxlY3RlZENhdGVnb3J5Q2hhbmdlZEV2ZW50LkRpc3BhdGNoKHRoaXMsIGV2ZW50QXJnKTtcclxuICAgICAgICB9KTsvL2NoYW5nZVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlVGhpcmRMZXZlbChzZWNvbmRMZXZlbENhdGVnb3J5SWQ6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMucmVtb3ZlRWxlbWVudCh0aGlzLl90aGlyZExldmVsRGl2KTtcclxuICAgICAgICB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFRocmVlID0gdGhpcy5fcm9vdENhdGVnb3J5SWQ7XHJcblxyXG4gICAgICAgIGlmIChzZWNvbmRMZXZlbENhdGVnb3J5SWQgPT09IHRoaXMuX3Jvb3RDYXRlZ29yeUlkKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCB0ZW1wbGF0ZSA9ICQoXCIjXCIgKyB0aGlzLl90aGlyZExldmVsVGVtcGxhdGUpLmh0bWwoKTtcclxuICAgICAgICBsZXQgY2F0ZWdvcmllczogQ2F0ZWdvcnlbXSA9IG5ldyBBcnJheTxDYXRlZ29yeT4oKTtcclxuICAgICAgICBsZXQgZGF0YSA9IHsgY2F0ZWdvcmllczogY2F0ZWdvcmllcyB9XHJcblxyXG4gICAgICAgIHRoaXMuX2FsbENhdGVnb3JpZXMuZm9yRWFjaChjYXRlZ29yeSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChjYXRlZ29yeS5DYXRlZ29yeVBhcmVudElkID09PSBzZWNvbmRMZXZlbENhdGVnb3J5SWQpIHtcclxuICAgICAgICAgICAgICAgIGNhdGVnb3JpZXMucHVzaChjYXRlZ29yeSk7XHJcbiAgICAgICAgICAgIH0vL2lmXHJcbiAgICAgICAgfSk7Ly9mb3JFYWNoXHJcbiAgICAgICAgaWYgKGNhdGVnb3JpZXMubGVuZ3RoID09PSAwKSB7Ly9ObyBJdGVtIGluIHRoaXJkIGxldmVsIGNhdGVnb3J5XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGh0bWwgPSBNdXN0YWNoZS50b19odG1sKHRlbXBsYXRlLCBkYXRhKTtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fcGFyZW50RGl2SWQpLmFwcGVuZChodG1sKTtcclxuXHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX3RoaXJkTGV2ZWxTZWxlY3QpLmNoYW5nZSgoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUaHJlZSA9IHBhcnNlSW50KCQoZXZlbnQuY3VycmVudFRhcmdldCkudmFsKCkudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgIGxldCBldmVudEFyZyA9IG5ldyBDYXRlZ29yeUNhaG5nZWRFdmVudEFyZygpO1xyXG4gICAgICAgICAgICBldmVudEFyZy5TZWxlY3RlZENhdGVnb3J5SWQgPSB0aGlzLkdldFNlbGVjdGVkQ2F0ZWdvcnlJZCgpO1xyXG4gICAgICAgICAgICBldmVudEFyZy5TZWxlY3RlZENhdGVnb3J5SGFzQ2hpbGQgPSB0aGlzLnNlbGVjdGVkQ2F0ZWdvcnlIYXNDaGlsZHJlbigpO1xyXG4gICAgICAgICAgICB0aGlzLlNlbGVjdGVkQ2F0ZWdvcnlDaGFuZ2VkRXZlbnQuRGlzcGF0Y2godGhpcywgZXZlbnRBcmcpO1xyXG4gICAgICAgIH0pOy8vY2hhbmdlXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZWxlY3RlZENhdGVnb3J5SGFzQ2hpbGRyZW4oKTogYm9vbGVhbiB7XHJcbiAgICAgICAgbGV0IHNlbGVjdGVkQ2F0ZWdvcnlJZCA9IHRoaXMuR2V0U2VsZWN0ZWRDYXRlZ29yeUlkKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FsbENhdGVnb3JpZXMuZmlsdGVyXHJcbiAgICAgICAgICAgICgoY2F0ZWdvcnkpID0+IHsgcmV0dXJuIGNhdGVnb3J5LkNhdGVnb3J5UGFyZW50SWQgPT09IHNlbGVjdGVkQ2F0ZWdvcnlJZCB9KS5sZW5ndGggPiAwO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVtb3ZlRWxlbWVudChpZDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgJChcIiNcIiArIGlkKS5yZW1vdmUoKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIENhdGVnb3J5Q2FobmdlZEV2ZW50QXJnIHtcclxuICAgIHB1YmxpYyBTZWxlY3RlZENhdGVnb3J5SWQ6IG51bWJlcjtcclxuICAgIHB1YmxpYyBTZWxlY3RlZENhdGVnb3J5SGFzQ2hpbGQ6IGJvb2xlYW47XHJcbn1cclxuXHJcbmVudW0gQ2F0ZWdvcnlMZXZlbCB7XHJcbiAgICBMZXZlbDEgPSAxLFxyXG4gICAgTGV2ZWwyID0gMixcclxuICAgIExldmVsMyA9IDMsXHJcbiAgICBVbmtvd249NFxyXG59XHJcblxyXG4iLCLvu79pbXBvcnQge0Nhck1vZGVsfSBmcm9tIFwiLi4vLi4vTW9kZWxzL0FkVHJhbnNwb3J0YXRpb24vQ2FyTW9kZWxcIjtcclxuaW1wb3J0IHtVc2VySW5wdXR9IGZyb20gXCIuLi8uLi9IZWxwZXIvVXNlcklucHV0XCI7XHJcbmltcG9ydCB7SUNyaXRlcmlhLENyaXRlcmlhVmFsaWRhdG9yfSBmcm9tIFwiLi4vLi4vSGVscGVyL0lDcml0ZXJpYVwiO1xyXG5pbXBvcnQge0lDcml0ZXJpYUNoYW5nZX0gZnJvbSBcIi4uLy4uL0hlbHBlci9JQ3JpdGVyaWFDaGFuZ2VcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDYXJNb2RlbEJyYW5kQ29udHJvbGxlciBpbXBsZW1lbnRzIElDcml0ZXJpYSB7XHJcbiAgICBWYWxpZGF0ZUNyaXRlcmlhKCk6IENyaXRlcmlhVmFsaWRhdG9yIHsgdGhyb3cgbmV3IEVycm9yKFwiTm90IGltcGxlbWVudGVkXCIpOyB9XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBDYXJCcmFuZElkS2V5OiBzdHJpbmcgPSBcIkJyYW5kSWRcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgQnJhbmRTZWxlY3RJZDogc3RyaW5nID0gXCJicmFuZFwiO1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgQ2FyTW9kZWxUZW1wbGF0ZUlkOiBzdHJpbmcgPSBcIm1vZGVsVGVtcGxhdGVcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgQ2FyTW9kZWxEaXZQbGFjZUhvbGRlcklkOiBzdHJpbmcgPSBcIm1vZGVsUGxhY2VIb2xkZXJcIjtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IENhck1vZGVsSWRLZXk6IHN0cmluZyA9IFwiQ2FyTW9kZWxJZFwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBBbGxDYXJNb2RlbHNJbnB1dElkOiBzdHJpbmcgPSBcImFsbENhck1vZGVsc1wiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBNb2RlbFNlbGVjdElkOiBzdHJpbmcgPSBcIm1vZGVsXCI7XHJcbiAgICBwcml2YXRlIF9hbGxDYXJNb2RlbHM6IENhck1vZGVsW107XHJcblxyXG4gICAgcHJpdmF0ZSBfc2VhcmNoQ3JpdGVyaWFDaGFuZ2U6SUNyaXRlcmlhQ2hhbmdlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuaW5pdFZpZXcoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXRWaWV3KCk6IHZvaWQge1xyXG4gICAgICAgIGxldCBhbGxDYXJNb2RlbHNTdHJpbmcgPSAkKFwiI1wiICsgdGhpcy5BbGxDYXJNb2RlbHNJbnB1dElkKS52YWwoKS50b1N0cmluZygpO1xyXG4gICAgICAgIHRoaXMuX2FsbENhck1vZGVscyA9ICQucGFyc2VKU09OKGFsbENhck1vZGVsc1N0cmluZykgYXMgQ2FyTW9kZWxbXTtcclxuICAgICAgICB0aGlzLmluaXRDYXJNb2RlbCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaW5pdENhck1vZGVsKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuY3JlYXRlQ2FyTW9kZWxFbGVtZW50KG5ldyBBcnJheTxDYXJNb2RlbD4oKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVDYXJNb2RlbEVsZW1lbnQoY2FyTW9kZWxzOiBDYXJNb2RlbFtdKSB7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuQ2FyTW9kZWxEaXZQbGFjZUhvbGRlcklkKS5jaGlsZHJlbigpLnJlbW92ZSgpO1xyXG4gICAgICAgIGxldCB0ZW1wbGF0ZSA9ICQoXCIjXCIgKyB0aGlzLkNhck1vZGVsVGVtcGxhdGVJZCkuaHRtbCgpO1xyXG4gICAgICAgIGxldCBkYXRhID0geyBjYXJNb2RlbHM6IGNhck1vZGVscyB9XHJcbiAgICAgICAgbGV0IGh0bWwgPSBNdXN0YWNoZS50b19odG1sKHRlbXBsYXRlLCBkYXRhKTtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5DYXJNb2RlbERpdlBsYWNlSG9sZGVySWQpLmFwcGVuZChodG1sKTtcclxuICAgICAgICB0aGlzLmJpbmRDYXJNb2RlbCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYmluZENhck1vZGVsKCk6IHZvaWQge1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLk1vZGVsU2VsZWN0SWQpLm9uKFwiY2hhbmdlXCIsKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zZWFyY2hDcml0ZXJpYUNoYW5nZS5DdXN0b21Dcml0ZXJpYUNoYW5nZWQoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1cGRhdGVDYXJNb2RlbFNlbGVjdChicmFuZElkOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICBsZXQgY2FyTW9kZWxzID0gbmV3IEFycmF5PENhck1vZGVsPigpO1xyXG4gICAgICAgIGlmIChicmFuZElkICE9PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2FsbENhck1vZGVscy5mb3JFYWNoKChjYXJNb2RlbCwgaW5kZXgsIGFycmF5KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2FyTW9kZWwuQnJhbmRJZCA9PT0gYnJhbmRJZClcclxuICAgICAgICAgICAgICAgICAgICBjYXJNb2RlbHMucHVzaChjYXJNb2RlbCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNyZWF0ZUNhck1vZGVsRWxlbWVudChjYXJNb2RlbHMpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBGaWxsQ3JpdGVyaWEodXNlcklucHV0OlVzZXJJbnB1dCk6dm9pZCB7XHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuQ2FyQnJhbmRJZEtleV0gPVxyXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5CcmFuZFNlbGVjdElkKS5maW5kKFwib3B0aW9uOnNlbGVjdGVkXCIpLnZhbCgpOy8vYnJhbmRJZFxyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLkNhck1vZGVsSWRLZXldID1cclxuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuTW9kZWxTZWxlY3RJZCkuZmluZChcIm9wdGlvbjpzZWxlY3RlZFwiKS52YWwoKTsvL2Nhck1vZGVsSWRcclxuICAgIH1cclxuXHJcbiAgICBCaW5kRXZlbnRzKGNyaXRlcmlhQ2hhbmdlOiBJQ3JpdGVyaWFDaGFuZ2UpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9zZWFyY2hDcml0ZXJpYUNoYW5nZSA9IGNyaXRlcmlhQ2hhbmdlO1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLkJyYW5kU2VsZWN0SWQpLm9uKFwiY2hhbmdlXCIsIChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgc2VsZWN0ZWRCcmFuZElkOiBudW1iZXIgPSBwYXJzZUludCgkKGV2ZW50LmN1cnJlbnRUYXJnZXQpLmZpbmQoXCJvcHRpb246c2VsZWN0ZWRcIikudmFsKCkudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQ2FyTW9kZWxTZWxlY3Qoc2VsZWN0ZWRCcmFuZElkKTtcclxuICAgICAgICAgICAgY3JpdGVyaWFDaGFuZ2UuQ3VzdG9tQ3JpdGVyaWFDaGFuZ2VkKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuYmluZENhck1vZGVsKCk7XHJcbiAgICB9XHJcblxyXG4gICAgVW5CaW5kRXZlbnRzKCk6IHZvaWQge1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLkJyYW5kU2VsZWN0SWQpLm9mZihcImNoYW5nZVwiKTtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5Nb2RlbFNlbGVjdElkKS5vZmYoXCJjaGFuZ2VcIik7XHJcbiAgICB9XHJcbn0iLCLvu79pbXBvcnQge0lFdmVudH0gIGZyb20gXCIuL0lFdmVudFwiO1xyXG5cclxuXHJcbi8qIFRoZSBkaXNwYXRjaGVyIGhhbmRsZXMgdGhlIHN0b3JhZ2Ugb2Ygc3Vic2NpcHRpb25zIGFuZCBmYWNpbGl0YXRlc1xyXG4gIHN1YnNjcmlwdGlvbiwgdW5zdWJzY3JpcHRpb24gYW5kIGRpc3BhdGNoaW5nIG9mIHRoZSBldmVudCAqL1xyXG5leHBvcnQgIGNsYXNzIEV2ZW50RGlzcGF0Y2hlcjxUU2VuZGVyLCBUQXJncz4gaW1wbGVtZW50cyBJRXZlbnQ8VFNlbmRlciwgVEFyZ3M+IHtcclxuXHJcbiAgICBwcml2YXRlIF9zdWJzY3JpcHRpb25zOiBBcnJheTwoc2VuZGVyOiBUU2VuZGVyLCBhcmdzOiBUQXJncykgPT4gdm9pZD4gPSBuZXcgQXJyYXk8KHNlbmRlcjogVFNlbmRlciwgYXJnczogVEFyZ3MpID0+IHZvaWQ+KCk7XHJcblxyXG4gICAgcHVibGljIFN1YnNjcmliZShmbjogKHNlbmRlcjogVFNlbmRlciwgYXJnczogVEFyZ3MpID0+IHZvaWQpOiB2b2lkIHtcclxuICAgICAgICBpZiAoZm4pIHtcclxuICAgICAgICAgICAgdGhpcy5fc3Vic2NyaXB0aW9ucy5wdXNoKGZuKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljICBVbnN1YnNjcmliZShmbjogKHNlbmRlcjogVFNlbmRlciwgYXJnczogVEFyZ3MpID0+IHZvaWQpOiB2b2lkIHtcclxuICAgICAgICBsZXQgaSA9IHRoaXMuX3N1YnNjcmlwdGlvbnMuaW5kZXhPZihmbik7XHJcbiAgICAgICAgaWYgKGkgPiAtMSkge1xyXG4gICAgICAgICAgICB0aGlzLl9zdWJzY3JpcHRpb25zLnNwbGljZShpLCAxKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljICBEaXNwYXRjaChzZW5kZXI6IFRTZW5kZXIsIGFyZ3M6IFRBcmdzKTogdm9pZCB7XHJcbiAgICAgICAgZm9yIChsZXQgaGFuZGxlciBvZiB0aGlzLl9zdWJzY3JpcHRpb25zKSB7XHJcbiAgICAgICAgICAgIGhhbmRsZXIoc2VuZGVyLCBhcmdzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCLvu79pbXBvcnQge1VzZXJJbnB1dH0gZnJvbSBcIi4vVXNlcklucHV0XCI7XHJcbmltcG9ydCB7SVJlc3VsdEhhbmRsZXJ9IGZyb20gXCIuL0lSZXN1bHRIYW5kbGVyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQWpheENhbGxlciB7XHJcblxyXG4gICAgcHJpdmF0ZSBfbnVtYmVyT2ZQdXJlU2VydmVyQ2FsbHM6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF91cmw6IHN0cmluZztcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgIF9yZXN1bHRIYW5kbGVyOiBJUmVzdWx0SGFuZGxlcjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX3JlcXVlc3RDb2RlOm51bWJlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih1cmw6IHN0cmluZywgcmVzdWx0SGFuZGxlcjogSVJlc3VsdEhhbmRsZXIscmVxdWVzdENvZGU6bnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fdXJsID0gdXJsO1xyXG4gICAgICAgIHRoaXMuX3Jlc3VsdEhhbmRsZXIgPSByZXN1bHRIYW5kbGVyO1xyXG4gICAgICAgIHRoaXMuX3JlcXVlc3RDb2RlID0gcmVxdWVzdENvZGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIENhbGwodXNlcklucHV0OiBVc2VySW5wdXQpOiB2b2lkIHtcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0eXBlOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgdXJsOiB0aGlzLl91cmwsXHJcbiAgICAgICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeSksIC8vRGF0YSBzZW50IHRvIHNlcnZlclxyXG4gICAgICAgICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLCAvLyBjb250ZW50IHR5cGUgc2VudCB0byBzZXJ2ZXJcclxuICAgICAgICAgICAgc3VjY2VzczogKG1zZywgdGV4dFN0YXR1cywganFYSFIpID0+IHRoaXMub25TdWNjZXNzR2V0SXRlbXNGcm9tU2VydmVyKG1zZywgdGV4dFN0YXR1cywganFYSFIpLCAvL09uIFN1Y2Nlc3NmdWxsIHNlcnZpY2UgY2FsbFxyXG4gICAgICAgICAgICBlcnJvcjogKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikgPT4gdGhpcy5vbkVycm9yR2V0SXRlbXNGcm9tU2VydmVyKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikgLy8gV2hlbiBTZXJ2aWNlIGNhbGwgZmFpbHNcclxuICAgICAgICB9KTsgLy8uYWpheFxyXG5cclxuICAgICAgICB0aGlzLl9udW1iZXJPZlB1cmVTZXJ2ZXJDYWxscysrO1xyXG4gICAgICAgIHRoaXMuX3Jlc3VsdEhhbmRsZXIuQWpheENhbGxTdGFydGVkKHRoaXMuX3JlcXVlc3RDb2RlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9uU3VjY2Vzc0dldEl0ZW1zRnJvbVNlcnZlcihtc2c6IGFueSwgdGV4dFN0YXR1czogc3RyaW5nLCBqcVhIUjogSlF1ZXJ5WEhSKSB7XHJcblxyXG4gICAgICAgIHRoaXMuX251bWJlck9mUHVyZVNlcnZlckNhbGxzLS07XHJcbiAgICAgICAgaWYgKHRoaXMuX251bWJlck9mUHVyZVNlcnZlckNhbGxzID09PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Jlc3VsdEhhbmRsZXIuQWpheENhbGxGaW5pc2hlZCh0aGlzLl9yZXF1ZXN0Q29kZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3Jlc3VsdEhhbmRsZXIuT25SZXN1bHQobXNnLCB0aGlzLl9yZXF1ZXN0Q29kZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvbkVycm9yR2V0SXRlbXNGcm9tU2VydmVyKGpxWEhSOiBKUXVlcnlYSFIsIHRleHRTdGF0dXM6IHN0cmluZywgZXJyb3JUaHJvd246IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuX251bWJlck9mUHVyZVNlcnZlckNhbGxzLS07XHJcbiAgICAgICAgaWYgKHRoaXMuX251bWJlck9mUHVyZVNlcnZlckNhbGxzID09PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Jlc3VsdEhhbmRsZXIuQWpheENhbGxGaW5pc2hlZCh0aGlzLl9yZXF1ZXN0Q29kZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9yZXN1bHRIYW5kbGVyLk9uRXJyb3IodGV4dFN0YXR1cyArIFwiICwgXCIgKyBlcnJvclRocm93biwgdGhpcy5fcmVxdWVzdENvZGUpO1xyXG4gICAgfVxyXG59Iiwi77u/aW1wb3J0IHsgSUNyaXRlcmlhfSBmcm9tIFwiLi9JQ3JpdGVyaWFcIjtcclxuaW1wb3J0IHsgTnVtZXJpY0RpY3Rpb25hcnkgfSBmcm9tIFwibG9kYXNoL2luZGV4XCI7XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIENyaXRlcmlhTnVtZXJpY0RpY3Rpb25hcnkgaW1wbGVtZW50cyBOdW1lcmljRGljdGlvbmFyeTxJQ3JpdGVyaWE+IHtcclxuICAgIFtpbmRleDogbnVtYmVyXTogSUNyaXRlcmlhO1xyXG59Iiwi77u/aW50ZXJmYWNlIExvb3NlT2JqZWN0IHtcclxuICAgIFtrZXk6IHN0cmluZ106IGFueVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVXNlcklucHV0IHtcclxuICAgIHB1YmxpYyBQYXJhbWV0ZXJzRGljdGlvbmFyeTogTG9vc2VPYmplY3QgPSB7fTtcclxufVxyXG5cclxuXHJcblxyXG4iLCLvu79leHBvcnQgY2xhc3MgSW1hZ2VVcGxvYWRlciB7XHJcbiAgICAgICAgXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IE5ld0FkR3VpZEtleSA9IFwiTmV3QWRHdWlkXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IFJlcXVlc3RJbmRleEtleSA9XCJSZXF1ZXN0SW5kZXhcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgSW1hZ2VVcGxvYWRJbnB1dElkOiBzdHJpbmcgPSBcImltYWdlVXBsb2FkXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IE1lc3NhZ2VUb1VzZXJEaXZJZDogc3RyaW5nID0gXCJsYWJlbE1lc3NhZ2VUb1VzZXJcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgTG9hZGVkSW1hZ2VzRGl2SWQ6IHN0cmluZyA9IFwibG9hZGVkSW1hZ2VWaWV3XCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IFVwbG9hZGluZ0ltYWdlVGVtcGxhdGU6IHN0cmluZyA9IFwidXBsb2FkaW5nSW1hZ2VUZW1wbGF0ZVwiO1xyXG5cclxuICAgIHByaXZhdGUgX3NlbmRGaWxlc1RvU2VydmVyVXJsOiBzdHJpbmcgPSBcIi9hcGkvQWRBcGkvQWRkVGVtcEltYWdlXCI7XHJcbiAgICBwcml2YXRlIF9yZW1vdmVGaWxlRnJvbVNlcnZlclVybDogc3RyaW5nID0gXCIvYXBpL0FkQXBpL1JlbW92ZVRlbXBJbWFnZVwiO1xyXG5cclxuICAgIHByaXZhdGUgX2N1cnJlbnROZXdBZEd1aWQ6IHN0cmluZztcclxuICAgIHByaXZhdGUgX3JlcXVlc3RJbmRleDogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgVmFsaWRVcGxvYWRUaW1lPTIwMDAwO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGN1cnJlbnROZXdBZEd1aWQ6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuX2N1cnJlbnROZXdBZEd1aWQgPSBjdXJyZW50TmV3QWRHdWlkO1xyXG4gICAgICAgIHRoaXMuaW5pdFZpZXcoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXRWaWV3KCk6IHZvaWQge1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLkltYWdlVXBsb2FkSW5wdXRJZCkuY2hhbmdlKChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgZmlsZVVwbG9hZDogSFRNTElucHV0RWxlbWVudCA9ICQoXCIjXCIgKyB0aGlzLkltYWdlVXBsb2FkSW5wdXRJZCkuZ2V0KDApIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICAgICAgICAgIGxldCBmaWxlczogRmlsZUxpc3QgPSBmaWxlVXBsb2FkLmZpbGVzO1xyXG4gICAgICAgICAgICB0aGlzLnNlbmRGaWxlc1RvU2VydmVyKGZpbGVzKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJChkb2N1bWVudCkub24oXCJjbGlja1wiLCBcIi5hZGRlZEltYWdlID4gaW5wdXRcIiwgKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlSW1hZ2VGcm9tU2VydmVyKCQoZXZlbnQuY3VycmVudFRhcmdldCkucGFyZW50KCkuYXR0cihcImlkXCIpLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2VuZEZpbGVzVG9TZXJ2ZXIoZmlsZUxpc3Q6IEZpbGVMaXN0KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fcmVxdWVzdEluZGV4Kys7XHJcbiAgICAgICAgdmFyIGRhdGEgPSBuZXcgRm9ybURhdGEoKTtcclxuICAgICAgICBkYXRhLmFwcGVuZCh0aGlzLk5ld0FkR3VpZEtleSwgdGhpcy5fY3VycmVudE5ld0FkR3VpZCk7XHJcbiAgICAgICAgZGF0YS5hcHBlbmQodGhpcy5SZXF1ZXN0SW5kZXhLZXksIHRoaXMuX3JlcXVlc3RJbmRleC50b1N0cmluZygpKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZpbGVMaXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGRhdGEuYXBwZW5kKGZpbGVMaXN0W2ldLm5hbWUsIGZpbGVMaXN0W2ldKTtcclxuICAgICAgICB9IC8vZm9yXHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgIHVybDogdGhpcy5fc2VuZEZpbGVzVG9TZXJ2ZXJVcmwsXHJcbiAgICAgICAgICAgIGNvbnRlbnRUeXBlOiBmYWxzZSxcclxuICAgICAgICAgICAgcHJvY2Vzc0RhdGE6IGZhbHNlLFxyXG4gICAgICAgICAgICBkYXRhOiBkYXRhLFxyXG4gICAgICAgICAgICBzdWNjZXNzOiAobXNnLCB0ZXh0U3RhdHVzLCBqcVhIUikgPT4gdGhpcy5vblN1Y2Nlc3NTZW5kRmlsZVRvU2VydmVyKG1zZywgdGV4dFN0YXR1cywganFYSFIpLCAvL09uIFN1Y2Nlc3NmdWxsIHNlcnZpY2UgY2FsbFxyXG4gICAgICAgICAgICBlcnJvcjogKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikgPT4gdGhpcy5vbkVycm9yU2VuZEZpbGVUb1NlcnZlcihqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pIC8vIFdoZW4gU2VydmljZSBjYWxsIGZhaWxzXHJcblxyXG4gICAgICAgIH0pOyAvL2FqYXhcclxuICAgICAgICB0aGlzLmFkZFVwbG9hZGluZ0ltYWdlVGVtcGxhdGUodGhpcy5fcmVxdWVzdEluZGV4KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9uU3VjY2Vzc1NlbmRGaWxlVG9TZXJ2ZXIobXNnOiBhbnksIHRleHRTdGF0dXM6IHN0cmluZywganFYSFI6IEpRdWVyeVhIUikge1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLkltYWdlVXBsb2FkSW5wdXRJZCkudmFsKFwiXCIpO1xyXG5cclxuICAgICAgICBpZiAobXNnLlN1Y2Nlc3MgPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVNlbmRpbmdJbWFnZVRlbXBsYXRlKG1zZy5SZXNwb25zZURhdGEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zaG93TWVzc2FnZVRvVXNlcihtc2cuTWVzc2FnICsgXCIgLFwiICsgbXNnLkVycm9yQ29kZSk7XHJcbiAgICAgICAgICAgIHRoaXMudXBsb2FkSW1hZ2VUaW1lckV4cGlyZShwYXJzZUludChtc2cuUmVzcG9uc2VEYXRhLlJlcXVlc3RJbmRleCkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9uRXJyb3JTZW5kRmlsZVRvU2VydmVyKGpxWEhSOiBKUXVlcnlYSFIsIHRleHRTdGF0dXM6IHN0cmluZywgZXJyb3JUaHJvd246IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuc2hvd01lc3NhZ2VUb1VzZXIoXCLYrti32Kcg2K/YsSDYp9ix2LPYp9mEXCIpOy8vbWFnaWMgc3RyaW5nXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhZGRVcGxvYWRpbmdJbWFnZVRlbXBsYXRlKHJlcXVlc3RJbmRleDpudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICBsZXQgdGVtcGxhdGUgPSAkKFwiI1wiICsgdGhpcy5VcGxvYWRpbmdJbWFnZVRlbXBsYXRlKS5odG1sKCk7Ly9tYWdpYyBzdHJpbmdcclxuICAgICAgICBsZXQgZGF0YSA9IHsgUmVxdWVzdEluZGV4OiByZXF1ZXN0SW5kZXggfTsvL21hZ2ljIHN0cmluZ1xyXG4gICAgICAgIGxldCBodG1sID0gTXVzdGFjaGUudG9faHRtbCh0ZW1wbGF0ZSwgZGF0YSk7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuTG9hZGVkSW1hZ2VzRGl2SWQpLmFwcGVuZChodG1sKTtcclxuICAgICAgICBcclxuICAgICAgICBzZXRUaW1lb3V0KHRoaXMudXBsb2FkSW1hZ2VUaW1lckV4cGlyZSxcclxuICAgICAgICAgICAgdGhpcy5WYWxpZFVwbG9hZFRpbWUsdGhpcy5fcmVxdWVzdEluZGV4KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwbG9hZEltYWdlVGltZXJFeHBpcmUodXBsb2FkUmVxdWVzdEluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICBpZiAoJChcIiNsb2FkZWRJbWFnZVZpZXcgPiAjdXBsb2FkaW5nSW1hZ2VcIiArIHVwbG9hZFJlcXVlc3RJbmRleCArIFwiID4gaW1nXCIpLmhhc0NsYXNzKFwiZ2lmSW1hZ2VcIikpIHtcclxuICAgICAgICAgICAgJChcIiNsb2FkZWRJbWFnZVZpZXcgPiAjdXBsb2FkaW5nSW1hZ2VcIiArIHVwbG9hZFJlcXVlc3RJbmRleCkucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZVNlbmRpbmdJbWFnZVRlbXBsYXRlKGRhdGE6IFVwbG9hZGVkSW1hZ2UpIHtcclxuICAgICAgICBpZiAoJChcIiNsb2FkZWRJbWFnZVZpZXcgPiAjdXBsb2FkaW5nSW1hZ2VcIiArIGRhdGEuUmVxdWVzdEluZGV4KS5sZW5ndGggPT09IDApIHsvL3JlbW92ZWQgYnkgdGltZXJcclxuICAgICAgICAgICAgdGhpcy5hZGRVcGxvYWRpbmdJbWFnZVRlbXBsYXRlKHBhcnNlSW50KGRhdGEuUmVxdWVzdEluZGV4KSk7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU2VuZGluZ0ltYWdlVGVtcGxhdGUoZGF0YSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy9UT0RPIGNhbmNlbCB0aW1lclxyXG4gICAgICAgICAgICAkKFwiI2xvYWRlZEltYWdlVmlldyA+ICN1cGxvYWRpbmdJbWFnZVwiICsgZGF0YS5SZXF1ZXN0SW5kZXggKyBcIiA+aW1nXCIpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInNyY1wiLCBcImRhdGE6aW1hZ2UvanBnO2Jhc2U2NCxcIiArIGRhdGEuSW1hZ2UpLnJlbW92ZUNsYXNzKFwiZ2lmSW1hZ2VcIik7XHJcbiAgICAgICAgICAgICQoXCIjbG9hZGVkSW1hZ2VWaWV3ID4gI3VwbG9hZGluZ0ltYWdlXCIgKyBkYXRhLlJlcXVlc3RJbmRleCkuYXR0cihcImlkXCIsIGRhdGEuSW1hZ2VGaWxlTmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVtb3ZlSW1hZ2VGcm9tU2VydmVyKGZpbGVOYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICBhbGVydChmaWxlTmFtZSk7XHJcbiAgICAgICAgbGV0IGNhbGxQYXJhbXMgPSB7XHJcbiAgICAgICAgICAgIEZpbGVOYW1lVG9CZVJlbW92ZWQ6IGZpbGVOYW1lLFxyXG4gICAgICAgICAgICBOZXdBZEd1aWQ6dGhpcy5fY3VycmVudE5ld0FkR3VpZFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6IFwiR0VUXCIsIC8vR0VUIG9yIFBPU1Qgb3IgUFVUIG9yIERFTEVURSB2ZXJiXHJcbiAgICAgICAgICAgIHVybDogdGhpcy5fcmVtb3ZlRmlsZUZyb21TZXJ2ZXJVcmwsXHJcbiAgICAgICAgICAgIGRhdGE6IGNhbGxQYXJhbXMsIC8vRGF0YSBzZW50IHRvIHNlcnZlclxyXG4gICAgICAgICAgICBzdWNjZXNzOiAobXNnLCB0ZXh0U3RhdHVzLCBqcVhIUikgPT4gdGhpcy5vblN1Y2Nlc3NSZW1vdmVGaWxlRnJvbVNlcnZlcihtc2csIHRleHRTdGF0dXMsIGpxWEhSKSwgLy9PbiBTdWNjZXNzZnVsbCBzZXJ2aWNlIGNhbGxcclxuICAgICAgICAgICAgZXJyb3I6IChqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pID0+IHRoaXMub25FcnJvclJlbW92ZUZpbGVGcm9tU2VydmVyKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikgLy8gV2hlbiBTZXJ2aWNlIGNhbGwgZmFpbHNcclxuICAgICAgICB9KTsgLy8uYWpheFxyXG4gICAgICAgIHRoaXMuc2hvd01lc3NhZ2VUb1VzZXIoXCJyZW1vdmluZyBmaWxlIGZyb20gc2VydmVyXCIpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBwcml2YXRlIG9uU3VjY2Vzc1JlbW92ZUZpbGVGcm9tU2VydmVyKG1zZzogYW55LCB0ZXh0U3RhdHVzOiBzdHJpbmcsIGpxWEhSOiBKUXVlcnlYSFIpIHtcclxuICAgICAgICBpZiAobXNnLlN1Y2Nlc3MgPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLnNob3dNZXNzYWdlVG9Vc2VyKFwiZG9uZSByZW1vdmluZyBmaWxlIGZyb20gc2VydmVyXCIpO1xyXG4gICAgICAgICAgICBsZXQgZmlsZU5hbWU6IHN0cmluZyA9IG1zZy5SZXNwb25zZURhdGE7XHJcbiAgICAgICAgICAgICQoYFtpZD1cIiR7ZmlsZU5hbWV9XCJdYCkucmVtb3ZlKCk7XHJcblxyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnNob3dNZXNzYWdlVG9Vc2VyKG1zZy5NZXNzYWdlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvbkVycm9yUmVtb3ZlRmlsZUZyb21TZXJ2ZXIoanFYSFI6IEpRdWVyeVhIUiwgdGV4dFN0YXR1czogc3RyaW5nLCBlcnJvclRocm93bjogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5zaG93TWVzc2FnZVRvVXNlcihcImVycm9yLCBcIiArIGVycm9yVGhyb3duKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNob3dNZXNzYWdlVG9Vc2VyKG1zZykge1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLk1lc3NhZ2VUb1VzZXJEaXZJZCkuaHRtbChtc2cpO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBVcGxvYWRlZEltYWdlIHtcclxuICAgIHB1YmxpYyBJbWFnZTogc3RyaW5nO1xyXG4gICAgcHVibGljIEltYWdlRmlsZU5hbWU6IHN0cmluZztcclxuICAgIHB1YmxpYyBSZXF1ZXN0SW5kZXg6c3RyaW5nO1xyXG59Iiwi77u/aW1wb3J0IHsgQ3JpdGVyaWFOdW1lcmljRGljdGlvbmFyeSB9IGZyb20gXCIuLi8uLi8uLi9IZWxwZXIvQ3JpdGVyaWFOdW1lcmljRGljdGlvbmFyeVwiO1xyXG5pbXBvcnQgeyBEZWZhdWx0TmV3QWRDcml0ZXJpYSB9IGZyb20gXCIuL05ld0FkQ3JpdGVyaWEvRGVmYXVsdE5ld0FkQ3JpdGVyaWFcIjtcclxuaW1wb3J0IHtBZFRyYW5zZm9ybWF0aW9uTmV3QWRDcml0ZXJpYX0gZnJvbSBcIi4vTmV3QWRDcml0ZXJpYS9BZFRyYW5zZm9ybWF0aW9uTmV3QWRDcml0ZXJpYVwiO1xyXG5pbXBvcnQge1VzZXJJbnB1dH0gZnJvbSBcIi4uLy4uLy4uL0hlbHBlci9Vc2VySW5wdXRcIjtcclxuaW1wb3J0IHtJQ3JpdGVyaWF9IGZyb20gXCIuLi8uLi8uLi9IZWxwZXIvSUNyaXRlcmlhXCI7XHJcbmltcG9ydCB7SUNyaXRlcmlhQ2hhbmdlfSBmcm9tIFwiLi4vLi4vLi4vSGVscGVyL0lDcml0ZXJpYUNoYW5nZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIE5ld0FkQ3JpdGVyaWEge1xyXG4gICAgcHJpdmF0ZSBfbmV3QWRDcml0ZXJpYUlvY0NvbnRhaW5lcjogQ3JpdGVyaWFOdW1lcmljRGljdGlvbmFyeSA7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLl9uZXdBZENyaXRlcmlhSW9jQ29udGFpbmVyID0gbmV3IENyaXRlcmlhTnVtZXJpY0RpY3Rpb25hcnkoKTtcclxuICAgICAgICB0aGlzLmluaXROZXdBZENyaXRlcmlhSW9jQ29udGFpbmVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbml0TmV3QWRDcml0ZXJpYUlvY0NvbnRhaW5lcigpIHtcclxuICAgICAgICB0aGlzLl9uZXdBZENyaXRlcmlhSW9jQ29udGFpbmVyWzBdID0gbmV3IERlZmF1bHROZXdBZENyaXRlcmlhKCk7XHJcbiAgICAgICAgdGhpcy5fbmV3QWRDcml0ZXJpYUlvY0NvbnRhaW5lclsxMDBdID0gbmV3IEFkVHJhbnNmb3JtYXRpb25OZXdBZENyaXRlcmlhKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIEZpbGxDYXRlZ29yeVNwZWNpZmljTmV3QWRDcml0ZXJpYShjYXRlZ29yeUlkOiBudW1iZXIsIHVzZXJJbnB1dDogVXNlcklucHV0KTogdm9pZCB7XHJcbiAgICAgICAgbGV0IG5ld0FkQ3JpdGVyaWEgPSB0aGlzLnBvbHltb3JwaGljRGlzcGF0Y2hOZXdBZENyaXRlcmlhKGNhdGVnb3J5SWQpO1xyXG4gICAgICAgIG5ld0FkQ3JpdGVyaWEuRmlsbENyaXRlcmlhKHVzZXJJbnB1dCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIEJpbmQoY2F0ZWdvcnlJZDogbnVtYmVyLCBjcml0ZXJpYUNoYW5nZTogSUNyaXRlcmlhQ2hhbmdlKSB7XHJcbiAgICAgICAgbGV0IGNyaXRlcmlhID0gdGhpcy5wb2x5bW9ycGhpY0Rpc3BhdGNoTmV3QWRDcml0ZXJpYShjYXRlZ29yeUlkKTtcclxuICAgICAgICBjcml0ZXJpYS5CaW5kRXZlbnRzKGNyaXRlcmlhQ2hhbmdlKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgVW5CaW5kKGNhdGVnb3J5SWQ6IG51bWJlcikge1xyXG4gICAgICAgIGxldCBjcml0ZXJpYSA9IHRoaXMucG9seW1vcnBoaWNEaXNwYXRjaE5ld0FkQ3JpdGVyaWEoY2F0ZWdvcnlJZCk7XHJcbiAgICAgICAgY3JpdGVyaWEuVW5CaW5kRXZlbnRzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBwb2x5bW9ycGhpY0Rpc3BhdGNoTmV3QWRDcml0ZXJpYShjYXRlZ29yeUlkOiBudW1iZXIpOiBJQ3JpdGVyaWEge1xyXG4gICAgICAgIGxldCByZXR1cm5WYWx1ZTogSUNyaXRlcmlhID0gdGhpcy5fbmV3QWRDcml0ZXJpYUlvY0NvbnRhaW5lcltjYXRlZ29yeUlkXTtcclxuICAgICAgICBpZiAocmV0dXJuVmFsdWUgPT09IHVuZGVmaW5lZCB8fCByZXR1cm5WYWx1ZSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm5WYWx1ZSA9IHRoaXMuX25ld0FkQ3JpdGVyaWFJb2NDb250YWluZXJbMF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXR1cm5WYWx1ZTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbiIsIu+7v2ltcG9ydCB7SUNyaXRlcmlhLENyaXRlcmlhVmFsaWRhdG9yfSBmcm9tIFwiLi4vLi4vLi4vLi4vSGVscGVyL0lDcml0ZXJpYVwiO1xyXG5pbXBvcnQge1VzZXJJbnB1dH0gZnJvbSBcIi4uLy4uLy4uLy4uL0hlbHBlci9Vc2VySW5wdXRcIjtcclxuaW1wb3J0IHtJQ3JpdGVyaWFDaGFuZ2V9IGZyb20gXCIuLi8uLi8uLi8uLi9IZWxwZXIvSUNyaXRlcmlhQ2hhbmdlXCI7XHJcbmltcG9ydCB7Q2FyTW9kZWxCcmFuZENvbnRyb2xsZXJ9IGZyb20gXCIuLi8uLi8uLi8uLi9Db21wb25lbnRzL1RyYW5zZm9ybWF0aW9uL0Nhck1vZGVsQnJhbmRDb250cm9sbGVyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQWRUcmFuc2Zvcm1hdGlvbk5ld0FkQ3JpdGVyaWEgaW1wbGVtZW50cyBJQ3JpdGVyaWEge1xyXG4gICAgcHJpdmF0ZSBfY2FyTW9kZWxCcmFuZENvbnRvbGxlcjogQ2FyTW9kZWxCcmFuZENvbnRyb2xsZXI7XHJcblxyXG4gICAgcHVibGljIFZhbGlkYXRlQ3JpdGVyaWEoKTogQ3JpdGVyaWFWYWxpZGF0b3IgeyB0aHJvdyBuZXcgRXJyb3IoXCJOb3QgaW1wbGVtZW50ZWRcIik7IH1cclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IE1ha2VZZWFyS2V5OiBzdHJpbmcgPSBcIk1ha2VZZWFyXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IE1ha2VZZWFySW5wdXRJZDogc3RyaW5nID0gXCJtYWtlWWVhclwiO1xyXG4gICBcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgRnVlbEtleSA9IFwiRnVlbFwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBGdWVsU2VsZWN0SWQ6IHN0cmluZyA9IFwiZnVlbFwiO1xyXG5cclxuICAgIHB1YmxpYyByZWFkb25seSBHZWFyYm94S2V5OiBzdHJpbmcgPSBcIkdlYXJib3hcIjtcclxuICAgIHB1YmxpYyByZWFkb25seSBHZWFyYm94VHlwZVBhcmVudERpdklkOiBzdHJpbmcgPSBcImdlYXJib3hUeXBlXCI7XHJcblxyXG4gICAgcHVibGljIHJlYWRvbmx5IENhclN0YXR1c0tleTogc3RyaW5nID0gXCJDYXJTdGF0dXNcIjtcclxuICAgIHB1YmxpYyByZWFkb25seSBDYXJTdGF0dXNQYXJlbnREaXZJZDogc3RyaW5nID0gXCJjYXJTdGF0dXNcIjtcclxuXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgTWlsZWFnZUtleTogc3RyaW5nID0gXCJNaWxlYWdlXCI7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgTWlsZWFnZUlucHV0SWQ6IHN0cmluZyA9IFwibWlsZWFnZVwiO1xyXG5cclxuICAgIHB1YmxpYyByZWFkb25seSBQbGF0ZVR5cGVLZXk6IHN0cmluZyA9IFwiUGxhdGVUeXBlXCI7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgUGxhdGVUeXBlUGFyZW50RGl2SWQ6IHN0cmluZyA9IFwicGxhdGVUeXBlXCI7XHJcblxyXG4gICAgcHVibGljIHJlYWRvbmx5IEJvZHlTdGF0dXNLZXk6IHN0cmluZyA9IFwiQm9keVN0YXR1c1wiO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IEJvZHlTdGF0dXNTZWxlY3RJZDogc3RyaW5nID0gXCJib2R5U3RhdHVzXCI7XHJcblxyXG4gICAgcHVibGljIHJlYWRvbmx5IEJvZHlDb2xvcktleTogc3RyaW5nID0gXCJCb2R5Q29sb3JcIjtcclxuICAgIHB1YmxpYyByZWFkb25seSBCb2R5Q29sb3JTZWxlY3RJZDogc3RyaW5nID0gXCJib2R5Q29sb3JcIjtcclxuXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgSW50ZXJuYWxDb2xvcktleTogc3RyaW5nID0gXCJJbnRlcm5hbENvbG9yXCI7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgSW50ZXJuYWxDb2xvclNlbGVjdElkID0gXCJpbnRlcm5hbENvbG9yXCI7XHJcblxyXG4gICAgXHJcbiAgICBwcml2YXRlIGluaXRWaWV3KCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX2Nhck1vZGVsQnJhbmRDb250b2xsZXIgPSBuZXcgQ2FyTW9kZWxCcmFuZENvbnRyb2xsZXIoKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIEZpbGxDcml0ZXJpYSh1c2VySW5wdXQ6IFVzZXJJbnB1dCk6IHZvaWQge1xyXG4gICAgICAgIC8vVE9ETyB2YWxpZGF0ZSB1c2VyIGlucHV0IHRoZW4gcHJvY2VlZFxyXG4gICAgICAgIHRoaXMuX2Nhck1vZGVsQnJhbmRDb250b2xsZXIuRmlsbENyaXRlcmlhKHVzZXJJbnB1dCk7XHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuTWFrZVllYXJLZXldID0kKFwiI1wiICsgdGhpcy5NYWtlWWVhcklucHV0SWQpLnZhbCgpOy8vTWFrZVllYXJcclxuICAgICAgICB1c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnlbdGhpcy5GdWVsS2V5XSA9ICQoXCIjXCIgKyB0aGlzLkZ1ZWxTZWxlY3RJZCkuZmluZChcIm9wdGlvbjpzZWxlY3RlZFwiKS52YWwoKTsvL0Z1ZWxcclxuICAgICAgICB1c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnlbdGhpcy5NaWxlYWdlS2V5XSA9ICQoXCIjXCIgKyB0aGlzLk1pbGVhZ2VJbnB1dElkKS52YWwoKTsvL01pbGVhZ2VcclxuICAgICAgICB1c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnlbdGhpcy5HZWFyYm94S2V5XSA9ICQoXCIjXCIgKyB0aGlzLkdlYXJib3hUeXBlUGFyZW50RGl2SWQpLmNoaWxkcmVuKFwiOmNoZWNrZWRcIikudmFsKCk7XHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuQm9keUNvbG9yS2V5XSA9ICQoXCIjXCIgKyB0aGlzLkJvZHlDb2xvclNlbGVjdElkKS5maW5kKFwib3B0aW9uOnNlbGVjdGVkXCIpLnZhbCgpO1xyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLkludGVybmFsQ29sb3JLZXldID0gJChcIiNcIiArIHRoaXMuSW50ZXJuYWxDb2xvclNlbGVjdElkKS5maW5kKFwib3B0aW9uOnNlbGVjdGVkXCIpLnZhbCgpO1xyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLkJvZHlTdGF0dXNLZXldID0gJChcIiNcIiArIHRoaXMuQm9keVN0YXR1c1NlbGVjdElkKS5maW5kKFwib3B0aW9uOnNlbGVjdGVkXCIpLnZhbCgpO1xyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLkNhclN0YXR1c0tleV0gPSAkKFwiI1wiICsgdGhpcy5DYXJTdGF0dXNQYXJlbnREaXZJZCkuY2hpbGRyZW4oXCI6Y2hlY2tlZFwiKS52YWwoKTtcclxuICAgICAgICB1c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnlbdGhpcy5QbGF0ZVR5cGVLZXldID0gJChcIiNcIiArIHRoaXMuUGxhdGVUeXBlUGFyZW50RGl2SWQpLmNoaWxkcmVuKFwiOmNoZWNrZWRcIikudmFsKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIEJpbmRFdmVudHMoY3JpdGVyaWFDaGFuZ2U6IElDcml0ZXJpYUNoYW5nZSk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuaW5pdFZpZXcoKTtcclxuICAgICAgICB0aGlzLl9jYXJNb2RlbEJyYW5kQ29udG9sbGVyLkJpbmRFdmVudHMoY3JpdGVyaWFDaGFuZ2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBVbkJpbmRFdmVudHMoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fY2FyTW9kZWxCcmFuZENvbnRvbGxlci5VbkJpbmRFdmVudHMoKTtcclxuICAgIH1cclxufSIsIu+7v2ltcG9ydCB7IElDcml0ZXJpYSxDcml0ZXJpYVZhbGlkYXRvciB9IGZyb20gXCIuLi8uLi8uLi8uLi9IZWxwZXIvSUNyaXRlcmlhXCI7XHJcbmltcG9ydCB7IFVzZXJJbnB1dCB9IGZyb20gXCIuLi8uLi8uLi8uLi9IZWxwZXIvVXNlcklucHV0XCI7XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIERlZmF1bHROZXdBZENyaXRlcmlhIGltcGxlbWVudHMgSUNyaXRlcmlhIHtcclxuICAgIEZpbGxDcml0ZXJpYShzZWFyY2hBZFVzZXJJbnB1dDogVXNlcklucHV0KTogdm9pZCB7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgQmluZEV2ZW50cyhjcml0ZXJpYUNoYW5nZTogT2JqZWN0KTogdm9pZCB7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgVW5CaW5kRXZlbnRzKCk6IHZvaWQge1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIFZhbGlkYXRlQ3JpdGVyaWEoKTogQ3JpdGVyaWFWYWxpZGF0b3Ige1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZFwiKTtcclxuICAgIH1cclxufSIsIu+7v2ltcG9ydCB7IE5ld0FkQ3JpdGVyaWEgfSBmcm9tIFwiLi9OZXdBZENyaXRlcmlhXCI7XHJcbmltcG9ydCB7IElDcml0ZXJpYUNoYW5nZSB9IGZyb20gXCIuLi8uLi8uLi9IZWxwZXIvSUNyaXRlcmlhQ2hhbmdlXCI7XHJcbmltcG9ydCB7IElSZXN1bHRIYW5kbGVyIH0gZnJvbSBcIi4uLy4uLy4uL0hlbHBlci9JUmVzdWx0SGFuZGxlclwiO1xyXG5pbXBvcnQgeyBBamF4Q2FsbGVyIH0gZnJvbSBcIi4uLy4uLy4uL0hlbHBlci9BamF4Q2FsbGVyXCI7XHJcbmltcG9ydCB7VXNlcklucHV0fSBmcm9tIFwiLi4vLi4vLi4vSGVscGVyL1VzZXJJbnB1dFwiO1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBOZXdBZFBhcnRpYWxWaWV3TG9hZGVyIGltcGxlbWVudHMgSVJlc3VsdEhhbmRsZXIge1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgUmVxdWVzdEluZGV4S2V5OiBzdHJpbmcgPSBcIlJlcXVlc3RJbmRleFwiO1xyXG4gICAgcHJpdmF0ZSBfY3VycmVudFJlcXVlc3RJbmRleDogbnVtYmVyID0gMDtcclxuXHJcbiAgICBwcml2YXRlIF91cmw6IHN0cmluZyA9IFwiL05ld0FkL0dldE5ld0FkUGFydGlhbFZpZXdcIjtcclxuXHJcbiAgICBwcml2YXRlIF9yZXN1bHRIYW5kbGVyOiBJUmVzdWx0SGFuZGxlcjtcclxuICAgIHByaXZhdGUgX2FqYXhDYWxsZXI6IEFqYXhDYWxsZXI7XHJcblxyXG4gICAgcHJpdmF0ZSBfbmV3QWRDcml0ZXJpYUNoYW5nZTogSUNyaXRlcmlhQ2hhbmdlO1xyXG4gICAgcHJpdmF0ZSBfcHJldmlvdXNDYXRlZ29yeUlkOiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBfY3VycmVudENhdGVnb3J5SWQ6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIF9uZXdBZENyaXRlcmlhOiBOZXdBZENyaXRlcmlhO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHJlc3VsdEhhbmRsZXI6IElSZXN1bHRIYW5kbGVyLCBuZXdBZENyaXRlcmlhQ2hhbmdlOiBJQ3JpdGVyaWFDaGFuZ2UsIG5ld0FkQ3JpdGVyaWE6IE5ld0FkQ3JpdGVyaWEsIHJlcXVlc3RDb2RlOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9yZXN1bHRIYW5kbGVyID0gcmVzdWx0SGFuZGxlcjtcclxuICAgICAgICB0aGlzLl9uZXdBZENyaXRlcmlhQ2hhbmdlID0gbmV3QWRDcml0ZXJpYUNoYW5nZTtcclxuICAgICAgICB0aGlzLl9uZXdBZENyaXRlcmlhID0gbmV3QWRDcml0ZXJpYTtcclxuICAgICAgICB0aGlzLl9hamF4Q2FsbGVyID0gbmV3IEFqYXhDYWxsZXIodGhpcy5fdXJsLCB0aGlzLCByZXF1ZXN0Q29kZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIEdldFBhcnRpYWxWaWV3RnJvbVNlcnZlcih1c2VySW5wdXQ6IFVzZXJJbnB1dCwgY2F0ZWdvcnlJZDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fY3VycmVudENhdGVnb3J5SWQgPSBjYXRlZ29yeUlkO1xyXG4gICAgICAgIHRoaXMuX2N1cnJlbnRSZXF1ZXN0SW5kZXgrKztcclxuICAgICAgICB1c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnlbdGhpcy5SZXF1ZXN0SW5kZXhLZXldID0gdGhpcy5fY3VycmVudFJlcXVlc3RJbmRleDtcclxuXHJcbiAgICAgICAgdGhpcy5fYWpheENhbGxlci5DYWxsKHVzZXJJbnB1dCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvblN1Y2Nlc3NHZXRJdGVtc0Zyb21TZXJ2ZXIobXNnOiBhbnksIHRleHRTdGF0dXM6IHN0cmluZywganFYSFI6IEpRdWVyeVhIUikge1xyXG4gICAgICAgIFxyXG4gICAgfS8vb25TdWNjZXNzR2V0VGltZUZyb21TZXJ2ZXJcclxuXHJcbiAgICBwcml2YXRlIG9uRXJyb3JHZXRJdGVtc0Zyb21TZXJ2ZXIoanFYSFI6IEpRdWVyeVhIUiwgdGV4dFN0YXR1czogc3RyaW5nLCBlcnJvclRocm93bjogc3RyaW5nKSB7XHJcbiAgICAgICBcclxuICAgIH0vL29uRXJyb3JHZXRUaW1lRnJvbVNlcnZlclxyXG5cclxuICAgIE9uUmVzdWx0KHBhcmFtOiBhbnksIHJlcXVlc3RDb2RlOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICBpZiAocGFyYW0uQ3VzdG9tRGljdGlvbmFyeVt0aGlzLlJlcXVlc3RJbmRleEtleV0gPT0gdGhpcy5fY3VycmVudFJlcXVlc3RJbmRleCkgeyAvL2xhc3QgY2FsbCByZXNwb25zZVxyXG4gICAgICAgICAgICBpZiAocGFyYW0uU3VjY2VzcyA9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9uZXdBZENyaXRlcmlhLlVuQmluZCh0aGlzLl9wcmV2aW91c0NhdGVnb3J5SWQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVzdWx0SGFuZGxlci5PblJlc3VsdChwYXJhbS5SZXNwb25zZURhdGEsIHJlcXVlc3RDb2RlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX25ld0FkQ3JpdGVyaWEuQmluZCh0aGlzLl9jdXJyZW50Q2F0ZWdvcnlJZCwgdGhpcy5fbmV3QWRDcml0ZXJpYUNoYW5nZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9wcmV2aW91c0NhdGVnb3J5SWQgPSB0aGlzLl9jdXJyZW50Q2F0ZWdvcnlJZDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3Jlc3VsdEhhbmRsZXIuT25FcnJvcihwYXJhbS5NZXNzYWdlICsgXCIgLCBcIiArIHBhcmFtLkVycm9yQ29kZSwgcmVxdWVzdENvZGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgT25FcnJvcihtZXNzYWdlOiBzdHJpbmcsIHJlcXVlc3RDb2RlOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9yZXN1bHRIYW5kbGVyLk9uRXJyb3IobWVzc2FnZSxyZXF1ZXN0Q29kZSk7XHJcbiAgICB9XHJcbiAgICBBamF4Q2FsbEZpbmlzaGVkKHJlcXVlc3RDb2RlOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9yZXN1bHRIYW5kbGVyLkFqYXhDYWxsRmluaXNoZWQocmVxdWVzdENvZGUpO1xyXG4gICAgfVxyXG4gICAgQWpheENhbGxTdGFydGVkKHJlcXVlc3RDb2RlOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9yZXN1bHRIYW5kbGVyLkFqYXhDYWxsU3RhcnRlZChyZXF1ZXN0Q29kZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vLy9UT0RPIHJlZmFjdG9yIHRoaXNcclxuLy9leHBvcnQgY2xhc3MgUGFydGlhbFZpZXdTZXJ2ZXJDYWxsUGFyYW1ldGVycyB7XHJcbi8vICAgIHB1YmxpYyBDYXRlZ29yeUlkOiBudW1iZXI7XHJcbi8vfSIsIu+7v2ltcG9ydCB7VXNlcklucHV0fSAgZnJvbSBcIi4uLy4uLy4uL0hlbHBlci9Vc2VySW5wdXRcIjtcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgTmV3QWRTZXJ2ZXJDYWxsZXIge1xyXG5cclxuICAgIFxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfdXJsOiBzdHJpbmcgPSBcIi9hcGkvQWRBcGkvQWRkQWR2ZXJ0aXNlbWVudFwiO1xyXG5cclxuICAgIHB1YmxpYyBTYXZlQWQodXNlcklucHV0OiBVc2VySW5wdXQpOiB2b2lkIHtcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0eXBlOiBcIlBPU1RcIiwgLy9HRVQgb3IgUE9TVCBvciBQVVQgb3IgREVMRVRFIHZlcmJcclxuICAgICAgICAgICAgdXJsOiB0aGlzLl91cmwsXHJcbiAgICAgICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeSksIC8vRGF0YSBzZW50IHRvIHNlcnZlclxyXG4gICAgICAgICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLCAvLyBjb250ZW50IHR5cGUgc2VudCB0byBzZXJ2ZXJcclxuICAgICAgICAgICAgc3VjY2VzczogKG1zZywgdGV4dFN0YXR1cywganFYSFIpID0+IHRoaXMub25TdWNjZXNzR2V0SXRlbXNGcm9tU2VydmVyKG1zZywgdGV4dFN0YXR1cywganFYSFIpLCAvL09uIFN1Y2Nlc3NmdWxsIHNlcnZpY2UgY2FsbFxyXG4gICAgICAgICAgICBlcnJvcjogKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikgPT4gdGhpcy5vbkVycm9yR2V0SXRlbXNGcm9tU2VydmVyKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikgLy8gV2hlbiBTZXJ2aWNlIGNhbGwgZmFpbHNcclxuICAgICAgICB9KTsgLy8uYWpheFxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25TdWNjZXNzR2V0SXRlbXNGcm9tU2VydmVyKG1zZzogYW55LCB0ZXh0U3RhdHVzOiBzdHJpbmcsIGpxWEhSOiBKUXVlcnlYSFIpIHtcclxuICAgICAgICAvL1RPRE8gcmVkaXJlY3QgdXNlciB0byBhIG5ldyBwYWdlXHJcbiAgICAgICAgaWYgKG1zZy5TdWNjZXNzID09IHRydWUpIHtcclxuICAgICAgICAgICAgZG9jdW1lbnQubG9jYXRpb24ucmVwbGFjZShcIi9OZXdBZC9Db25maXJtXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH0gXHJcblxyXG5cclxuICAgIHByaXZhdGUgb25FcnJvckdldEl0ZW1zRnJvbVNlcnZlcihqcVhIUjogSlF1ZXJ5WEhSLCB0ZXh0U3RhdHVzOiBzdHJpbmcsIGVycm9yVGhyb3duOiBzdHJpbmcpIHtcclxuICAgICAgICAvL1RPRE8gaW5mb3JtIGVycm9yIHRvIHVzZXJcclxuICAgIH0gXHJcbn1cclxuIiwi77u/aW1wb3J0IHsgQ2F0ZWdvcnkgfSBmcm9tIFwiLi4vLi4vLi4vTW9kZWxzL0NhdGVnb3J5XCI7XHJcbmltcG9ydCB7IENhdGVnb3J5U2VsZWN0aW9uIH0gZnJvbSBcIi4uLy4uLy4uL0NvbXBvbmVudHMvQ2F0ZWdvcnkvQ2F0ZWdvcnlTZWxlY3Rpb25cIjtcclxuaW1wb3J0IHsgTmV3QWRQYXJ0aWFsVmlld0xvYWRlciB9IGZyb20gXCIuL05ld0FkUGFydGlhbFZpZXdMb2FkZXJcIjtcclxuaW1wb3J0IHsgSUNyaXRlcmlhQ2hhbmdlIH0gZnJvbSBcIi4uLy4uLy4uL0hlbHBlci9JQ3JpdGVyaWFDaGFuZ2VcIjtcclxuaW1wb3J0IHsgTmV3QWRDcml0ZXJpYSB9IGZyb20gXCIuL05ld0FkQ3JpdGVyaWFcIjtcclxuaW1wb3J0IHsgSW1hZ2VVcGxvYWRlciB9IGZyb20gXCIuL0ltYWdlVXBsb2FkZXJcIjtcclxuaW1wb3J0IHsgVXNlcklucHV0IH0gZnJvbSBcIi4uLy4uLy4uL0hlbHBlci9Vc2VySW5wdXRcIjtcclxuaW1wb3J0IHsgTmV3QWRTZXJ2ZXJDYWxsZXIgfSBmcm9tIFwiLi9OZXdBZFNlcnZlckNhbGxlclwiO1xyXG5pbXBvcnQge0lSZXN1bHRIYW5kbGVyfSBmcm9tIFwiLi4vLi4vLi4vSGVscGVyL0lSZXN1bHRIYW5kbGVyXCI7XHJcblxyXG5jbGFzcyBOZXdBZCBpbXBsZW1lbnRzIElDcml0ZXJpYUNoYW5nZSwgSVJlc3VsdEhhbmRsZXJ7XHJcbiAgICBcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgQWRUaXRsZUtleSA9IFwiQWRUaXRsZVwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBBZFRpdGxlSW5wdXRJZDogc3RyaW5nID0gXCJhZFRpdGxlXCI7XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBBZENvbW1lbnRLZXkgPSBcIkFkQ29tbWVudFwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBBZENvbW1lbnRJbnB1dElkID0gXCJhZENvbW1lbnRcIjtcclxuXHJcbiAgICBwcml2YXRlIF9hbGxDYXRlZ29yaWVzSW5wdXRJZDogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBfYWxsQ2F0ZWdvcmllc0RpdklkOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIF9jYXRlZ29yeVNwZWNpZmljUGFydGlhbFZpZXdJZDogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfc3VibWl0QWRJbnB1dElkOiBzdHJpbmcgPSBcInN1Ym1pdE5ld0FkXCI7XHJcblxyXG5cclxuICAgIHByaXZhdGUgX2N1cnJlbnROZXdBZEd1aWQ6IHN0cmluZztcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgQ3VycmVudE5ld0FkR3VpZElucHV0SWQ6IHN0cmluZyA9IFwiY3VycmVudE5ld0FkR3VpZFwiO1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgQWRkQWR2ZXJ0aXNlbWVudFJlcXVlc3RDb2RlID0gMTtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgTG9hZE5ld0FkUGFydGlhbFZpZXdSZXF1ZXN0Q29kZSA9IDI7XHJcblxyXG4gICAgcHJpdmF0ZSBfY2F0ZWdvcnlTZWxlY3Rpb246IENhdGVnb3J5U2VsZWN0aW9uO1xyXG4gICAgcHJpdmF0ZSBfcGFydGlhbFZpZXdMb2FkZXI6IE5ld0FkUGFydGlhbFZpZXdMb2FkZXI7XHJcbiAgICBwcml2YXRlIF9uZXdBZENyaXRlcmlhOiBOZXdBZENyaXRlcmlhO1xyXG4gICAgcHJpdmF0ZSBfaW1hZ2VVcGxvYWRlcjogSW1hZ2VVcGxvYWRlcjtcclxuICAgIHByaXZhdGUgX25ld0FkU2VydmVyQ2FsbGVyOiBOZXdBZFNlcnZlckNhbGxlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihhbGxDYXRlZ29yaWVzRGl2OiBzdHJpbmcsIGFsbENhdGVnb3JpZXNJbnB1dElkOiBzdHJpbmcsIGNhdGVnb3J5U3BlY2lmaWNQYXJ0aWFsVmlld0lkOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLl9hbGxDYXRlZ29yaWVzRGl2SWQgPSBhbGxDYXRlZ29yaWVzRGl2O1xyXG4gICAgICAgIHRoaXMuX2FsbENhdGVnb3JpZXNJbnB1dElkID0gYWxsQ2F0ZWdvcmllc0lucHV0SWQ7XHJcbiAgICAgICAgdGhpcy5fY2F0ZWdvcnlTcGVjaWZpY1BhcnRpYWxWaWV3SWQgPSBjYXRlZ29yeVNwZWNpZmljUGFydGlhbFZpZXdJZDtcclxuICAgICAgICB0aGlzLl9uZXdBZENyaXRlcmlhID0gbmV3IE5ld0FkQ3JpdGVyaWEoKTtcclxuICAgICAgICB0aGlzLmluaXRQYWdlKCk7XHJcbiAgICAgICAgdGhpcy5faW1hZ2VVcGxvYWRlciA9IG5ldyBJbWFnZVVwbG9hZGVyKHRoaXMuX2N1cnJlbnROZXdBZEd1aWQpO1xyXG4gICAgICAgIHRoaXMuX25ld0FkU2VydmVyQ2FsbGVyID0gbmV3IE5ld0FkU2VydmVyQ2FsbGVyKCk7XHJcbiAgICAgICAgdGhpcy5pbml0RXZlbnRIYW5kbGVycygpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBDdXN0b21Dcml0ZXJpYUNoYW5nZWQoKTogdm9pZCB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaW5pdFBhZ2UoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5pbml0TmV3QWRDYXRlZ29yeSgpO1xyXG4gICAgICAgIHRoaXMuX3BhcnRpYWxWaWV3TG9hZGVyID0gbmV3IE5ld0FkUGFydGlhbFZpZXdMb2FkZXIodGhpcyx0aGlzLCB0aGlzLl9uZXdBZENyaXRlcmlhLHRoaXMuTG9hZE5ld0FkUGFydGlhbFZpZXdSZXF1ZXN0Q29kZSk7XHJcbiAgICAgICAgdGhpcy5fY3VycmVudE5ld0FkR3VpZCA9ICQoXCIjXCIgKyB0aGlzLkN1cnJlbnROZXdBZEd1aWRJbnB1dElkKS52YWwoKS50b1N0cmluZygpO1xyXG5cclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbml0TmV3QWRDYXRlZ29yeSgpOiB2b2lkIHtcclxuICAgICAgICBsZXQgYWxsQ2F0ZWdvcmllc1N0cmluZyA9ICQoXCIjXCIgKyB0aGlzLl9hbGxDYXRlZ29yaWVzSW5wdXRJZCkudmFsKCkudG9TdHJpbmcoKTtcclxuICAgICAgICBsZXQgYWxsQ2F0ZWdvcmllcyA9ICQucGFyc2VKU09OKGFsbENhdGVnb3JpZXNTdHJpbmcpIGFzIENhdGVnb3J5W107XHJcbiAgICAgICAgdGhpcy5fY2F0ZWdvcnlTZWxlY3Rpb24gPSBuZXcgQ2F0ZWdvcnlTZWxlY3Rpb24odGhpcy5fYWxsQ2F0ZWdvcmllc0RpdklkLCBhbGxDYXRlZ29yaWVzKTtcclxuICAgICAgICB0aGlzLl9jYXRlZ29yeVNlbGVjdGlvbi5DcmVhdGVGaXJzdExldmVsKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbml0RXZlbnRIYW5kbGVycygpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9jYXRlZ29yeVNlbGVjdGlvbi5TZWxlY3RlZENhdGVnb3J5Q2hhbmdlZEV2ZW50LlN1YnNjcmliZSgoc2VuZGVyLCBhcmdzKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghYXJncy5TZWxlY3RlZENhdGVnb3J5SGFzQ2hpbGQpIHtcclxuICAgICAgICAgICAgICAgIGxldCB1c2VySW5wdXQgPSBuZXcgVXNlcklucHV0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jYXRlZ29yeVNlbGVjdGlvbi5JbnNlcnRDYXRlZ29yeUlkSW5Vc2VySW5wdXREaWN0aW9uYXJ5KHVzZXJJbnB1dCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9wYXJ0aWFsVmlld0xvYWRlci5HZXRQYXJ0aWFsVmlld0Zyb21TZXJ2ZXIodXNlcklucHV0LGFyZ3MuU2VsZWN0ZWRDYXRlZ29yeUlkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9zdWJtaXRBZElucHV0SWQpLm9uKFwiY2xpY2tcIiwgKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuc3VibWl0QWQoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN1Ym1pdEFkKCk6dm9pZCB7XHJcbiAgICAgICAgLy9UT0RPIGRpc2FibGUgc3VibWl0QWQgQnV0dG9uIHVudGlsIGN1cnJlbnQgc3VibWlzc2lvbiBpcyBvayBvciBlcnJvcm5vdXMgXHJcblxyXG4gICAgICAgIGxldCB1c2VySW5wdXQgPSBuZXcgVXNlcklucHV0KCk7XHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W1wiTmV3QWRHdWlkXCJdID0gdGhpcy5fY3VycmVudE5ld0FkR3VpZDtcclxuICAgICAgICB0aGlzLl9jYXRlZ29yeVNlbGVjdGlvbi5JbnNlcnRDYXRlZ29yeUlkSW5Vc2VySW5wdXREaWN0aW9uYXJ5KHVzZXJJbnB1dCk7XHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuQWRUaXRsZUtleV0gPSAkKFwiI1wiICsgdGhpcy5BZFRpdGxlSW5wdXRJZCkudmFsKCk7XHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuQWRDb21tZW50S2V5XSA9ICQoXCIjXCIgKyB0aGlzLkFkQ29tbWVudElucHV0SWQpLnZhbCgpO1xyXG4gICAgICAgIHRoaXMuX25ld0FkQ3JpdGVyaWEuRmlsbENhdGVnb3J5U3BlY2lmaWNOZXdBZENyaXRlcmlhKHRoaXMuX2NhdGVnb3J5U2VsZWN0aW9uLkdldFNlbGVjdGVkQ2F0ZWdvcnlJZCgpLCB1c2VySW5wdXQpO1xyXG4gICAgICAgIHRoaXMuX25ld0FkU2VydmVyQ2FsbGVyLlNhdmVBZCh1c2VySW5wdXQpO1xyXG4gICAgfVxyXG5cclxuICAgIE9uUmVzdWx0KHBhcmFtOiBhbnksIHJlcXVlc3RDb2RlOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICBpZiAocmVxdWVzdENvZGUgPT09IHRoaXMuTG9hZE5ld0FkUGFydGlhbFZpZXdSZXF1ZXN0Q29kZSkge1xyXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5fY2F0ZWdvcnlTcGVjaWZpY1BhcnRpYWxWaWV3SWQpLmNoaWxkcmVuKCkucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLl9jYXRlZ29yeVNwZWNpZmljUGFydGlhbFZpZXdJZCkuaHRtbChwYXJhbSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHJlcXVlc3RDb2RlID09PSB0aGlzLkFkZEFkdmVydGlzZW1lbnRSZXF1ZXN0Q29kZSkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBPbkVycm9yKG1lc3NhZ2U6IHN0cmluZywgcmVxdWVzdENvZGU6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIGlmIChyZXF1ZXN0Q29kZSA9PT0gdGhpcy5Mb2FkTmV3QWRQYXJ0aWFsVmlld1JlcXVlc3RDb2RlKSB7XHJcbiAgICAgICAgICAgIGFsZXJ0KG1lc3NhZ2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChyZXF1ZXN0Q29kZSA9PT0gdGhpcy5BZGRBZHZlcnRpc2VtZW50UmVxdWVzdENvZGUpIHtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgQWpheENhbGxGaW5pc2hlZChyZXF1ZXN0Q29kZTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHJlcXVlc3RDb2RlID09PSB0aGlzLkxvYWROZXdBZFBhcnRpYWxWaWV3UmVxdWVzdENvZGUpIHtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHJlcXVlc3RDb2RlID09PSB0aGlzLkFkZEFkdmVydGlzZW1lbnRSZXF1ZXN0Q29kZSkge1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBBamF4Q2FsbFN0YXJ0ZWQocmVxdWVzdENvZGU6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIGlmIChyZXF1ZXN0Q29kZSA9PT0gdGhpcy5Mb2FkTmV3QWRQYXJ0aWFsVmlld1JlcXVlc3RDb2RlKSB7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChyZXF1ZXN0Q29kZSA9PT0gdGhpcy5BZGRBZHZlcnRpc2VtZW50UmVxdWVzdENvZGUpIHtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcbmxldCBhbGxDYXRlZ29yaWVzRGl2SWQ6IHN0cmluZyA9IFwiY2F0ZWdvcnlTZWxlY3RvclwiO1xyXG5sZXQgYWxsQ2F0ZWdvcmllc0lucHV0SWQ6IHN0cmluZyA9IFwiYWxsQ2F0ZWdvcmllc1wiO1xyXG5sZXQgY2F0ZWdvcnlTcGVjaWZpY1BhcnRpYWxWaWV3SWQ6IHN0cmluZyA9IFwiQ2F0ZWdvcnlTcGVjaWZpY0NyaXRlcmlhXCI7XHJcbiQoZG9jdW1lbnQpLnJlYWR5KCgpID0+IHtcclxuICAgIGxldCBuZXdBZCA9IG5ldyBOZXdBZChhbGxDYXRlZ29yaWVzRGl2SWQsIGFsbENhdGVnb3JpZXNJbnB1dElkLCBjYXRlZ29yeVNwZWNpZmljUGFydGlhbFZpZXdJZCk7XHJcbn0pOy8vcmVhZHkiXX0=
