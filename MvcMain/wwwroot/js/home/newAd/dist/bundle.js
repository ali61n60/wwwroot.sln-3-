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
        this._allCarModels.forEach(function (carModel, index, array) {
            if (carModel.BrandId === brandId)
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
},{}],12:[function(require,module,exports){
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
        this._categorySelection = new CategorySelection_1.CategorySelection(this._allCategoriesDivId, allCategories);
        this._categorySelection.CreateFirstLevel();
    };
    NewAd.prototype.initEventHandlers = function () {
        var _this = this;
        this._categorySelection.SelectedCategoryChangedEvent.Subscribe(function (sender, args) {
            if (!args.SelectedCategoryHasChild) {
                _this._partialViewLoader.GetPartialViewFromServer(args.SelectedCategoryId);
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
    return NewAd;
}());
var allCategoriesDivId = "categorySelector";
var allCategoriesInputId = "allCategories";
var categorySpecificPartialViewId = "CategorySpecificCriteria";
$(document).ready(function () {
    var newAd = new NewAd(allCategoriesDivId, allCategoriesInputId, categorySpecificPartialViewId);
}); //ready
},{"../../../Components/Category/CategorySelection":1,"../../../Helper/UserInput":5,"./ImageUploader":6,"./NewAdCriteria":7,"./NewAdPartialViewLoader":10,"./NewAdServerCaller":11}]},{},[12])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3d3dyb290L2pzL0NvbXBvbmVudHMvQ2F0ZWdvcnkvQ2F0ZWdvcnlTZWxlY3Rpb24udHMiLCJ3d3dyb290L2pzL0NvbXBvbmVudHMvVHJhbnNmb3JtYXRpb24vQ2FyTW9kZWxCcmFuZENvbnRyb2xsZXIudHMiLCJ3d3dyb290L2pzL0V2ZW50cy9FdmVudERpc3BhdGNoZXIudHMiLCJ3d3dyb290L2pzL0hlbHBlci9Dcml0ZXJpYU51bWVyaWNEaWN0aW9uYXJ5LnRzIiwid3d3cm9vdC9qcy9IZWxwZXIvVXNlcklucHV0LnRzIiwid3d3cm9vdC9qcy9ob21lL25ld0FkL3NyYy9JbWFnZVVwbG9hZGVyLnRzIiwid3d3cm9vdC9qcy9ob21lL25ld0FkL3NyYy9OZXdBZENyaXRlcmlhLnRzIiwid3d3cm9vdC9qcy9ob21lL25ld0FkL3NyYy9OZXdBZENyaXRlcmlhL0FkVHJhbnNmb3JtYXRpb25OZXdBZENyaXRlcmlhLnRzIiwid3d3cm9vdC9qcy9ob21lL25ld0FkL3NyYy9OZXdBZENyaXRlcmlhL0RlZmF1bHROZXdBZENyaXRlcmlhLnRzIiwid3d3cm9vdC9qcy9ob21lL25ld0FkL3NyYy9OZXdBZFBhcnRpYWxWaWV3TG9hZGVyLnRzIiwid3d3cm9vdC9qcy9ob21lL25ld0FkL3NyYy9OZXdBZFNlcnZlckNhbGxlci50cyIsInd3d3Jvb3QvanMvaG9tZS9uZXdBZC9zcmMvbmV3QWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FDLGdFQUErRDtBQUloRTtJQTJCSSwyQkFBWSxXQUFtQixFQUFFLGFBQXlCO1FBekJuRCxpQ0FBNEIsR0FBZ0UsSUFBSSxpQ0FBZSxFQUE4QyxDQUFDO1FBRXBKLGtCQUFhLEdBQUcsWUFBWSxDQUFDO1FBSzdCLHdCQUFtQixHQUFHLG1CQUFtQixDQUFDO1FBQzFDLG1CQUFjLEdBQUcsV0FBVyxDQUFDO1FBQzdCLHNCQUFpQixHQUFXLFNB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LFNBQVMsQ0FBQyxDQUFDO1FBQ3pFLFNBQVMsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDckYsU0FBUyxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ3pGLElBQUksQ0FBQyxjQUFjLENBQUMsaUNBQWlDLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLHFCQUFxQixFQUFFLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDbEgsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBQ0wsWUFBQztBQUFELENBM0VBLEFBMkVDLElBQUE7QUFJRCxJQUFJLGtCQUFrQixHQUFXLGtCQUFrQixDQUFDO0FBQ3BELElBQUksb0JBQW9CLEdBQVcsZUFBZSxDQUFDO0FBQ25ELElBQUksNkJBQTZCLEdBQVcsMEJBQTBCLENBQUM7QUFDdkUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQztJQUNkLElBQUksS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLGtCQUFrQixFQUFFLG9CQUFvQixFQUFFLDZCQUE2QixDQUFDLENBQUM7QUFDbkcsQ0FBQyxDQUFDLENBQUMsQ0FBQSxPQUFPIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIu+7v2ltcG9ydCB7IEV2ZW50RGlzcGF0Y2hlciB9IGZyb20gXCIuLi8uLi9FdmVudHMvRXZlbnREaXNwYXRjaGVyXCI7XHJcbmltcG9ydCB7IENhdGVnb3J5IH0gZnJvbSBcIi4uLy4uL01vZGVscy9DYXRlZ29yeVwiO1xyXG5pbXBvcnQgeyBVc2VySW5wdXQgfSBmcm9tIFwiLi4vLi4vSGVscGVyL1VzZXJJbnB1dFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIENhdGVnb3J5U2VsZWN0aW9uIHtcclxuXHJcbiAgICBwdWJsaWMgU2VsZWN0ZWRDYXRlZ29yeUNoYW5nZWRFdmVudDogRXZlbnREaXNwYXRjaGVyPENhdGVnb3J5U2VsZWN0aW9uLCBDYXRlZ29yeUNhaG5nZWRFdmVudEFyZz4gPSBuZXcgRXZlbnREaXNwYXRjaGVyPENhdGVnb3J5U2VsZWN0aW9uLCBDYXRlZ29yeUNhaG5nZWRFdmVudEFyZz4oKTtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IENhdGVnb3J5SWRLZXkgPSBcIkNhdGVnb3J5SWRcIjtcclxuXHJcbiAgICBwcml2YXRlIF9wYXJlbnREaXZJZDogc3RyaW5nOy8vZGl2IGVsZW1lbnQgdGhhdCBob2xkcyBhbGwgQ2F0ZWdvcnlTZWxlY3Rpb24gZWxlbWVudHNcclxuICAgIHByaXZhdGUgX2FsbENhdGVnb3JpZXM6IENhdGVnb3J5W107XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfZmlyc3RMZXZlbFRlbXBsYXRlID0gXCJjYXRlZ29yeTFUZW1wbGF0ZVwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfZmlyc3RMZXZlbERpdiA9IFwiY2F0ZWdvcnkxXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9maXJzdExldmVsU2VsZWN0OiBzdHJpbmcgPSBcInNlbGVjdDFcIjtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9zZWNvbmRMZXZlbFRlbXBsYXRlID0gXCJjYXRlZ29yeTJUZW1wbGF0ZVwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfc2Vjb25kTGV2ZWxEaXYgPSBcImNhdGVnb3J5MlwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfc2Vjb25kTGV2ZWxTZWxlY3Q6IHN0cmluZyA9IFwic2VsZWN0MlwiO1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX3RoaXJkTGV2ZWxUZW1wbGF0ZSA9IFwiY2F0ZWdvcnkzVGVtcGxhdGVcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX3RoaXJkTGV2ZWxEaXYgPSBcImNhdGVnb3J5M1wiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfdGhpcmRMZXZlbFNlbGVjdDogc3RyaW5nID0gXCJzZWxlY3QzXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9yb290Q2F0ZWdvcnlJZDogbnVtYmVyID0gMDtcclxuXHJcbiAgICBwcml2YXRlIF9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbE9uZTogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBfc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUd286IG51bWJlcjtcclxuICAgIHByaXZhdGUgX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVGhyZWU6IG51bWJlcjtcclxuXHJcblxyXG4gICAgY29uc3RydWN0b3IocGFyZW50RGl2SWQ6IHN0cmluZywgYWxsQ2F0ZWdvcmllczogQ2F0ZWdvcnlbXSkge1xyXG4gICAgICAgIHRoaXMuX3BhcmVudERpdklkID0gcGFyZW50RGl2SWQ7XHJcbiAgICAgICAgdGhpcy5fYWxsQ2F0ZWdvcmllcyA9IGFsbENhdGVnb3JpZXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIFNldENhdGVnb3J5SWQoc2VsZWN0ZWRDYXRlZ29yeUlkOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICBsZXQgZmlyc3RMZXZlbElkOiBudW1iZXI7XHJcbiAgICAgICAgbGV0IHNlY29uZExldmVsSWQ6IG51bWJlcjtcclxuICAgICAgICBsZXQgY2F0ZWdvcnlMZXZlbCA9IHRoaXMuZ2V0Q2F0ZWdvcnlMZXZlbChzZWxlY3RlZENhdGVnb3J5SWQpO1xyXG4gICAgICAgIHN3aXRjaCAoY2F0ZWdvcnlMZXZlbCkge1xyXG4gICAgICAgIGNhc2UgQ2F0ZWdvcnlMZXZlbC5Vbmtvd246XHJcbiAgICAgICAgICAgIHRoaXMuQ3JlYXRlRmlyc3RMZXZlbCgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgQ2F0ZWdvcnlMZXZlbC5MZXZlbDE6XHJcbiAgICAgICAgICAgICAgICB0aGlzLkNyZWF0ZUZpcnN0TGV2ZWwoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0Rmlyc3RMZXZlbFRvU3BlY2lmaWNJZChzZWxlY3RlZENhdGVnb3J5SWQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVTZWNvbmRMZXZlbChzZWxlY3RlZENhdGVnb3J5SWQpO1xyXG4gICAgICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuX2ZpcnN0TGV2ZWxTZWxlY3QpLnRyaWdnZXIoXCJjaGFuZ2VcIik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBDYXRlZ29yeUxldmVsLkxldmVsMjpcclxuICAgICAgICAgICAgICAgIHRoaXMuQ3JlYXRlRmlyc3RMZXZlbCgpO1xyXG4gICAgICAgICAgICAgICAgZmlyc3RMZXZlbElkID0gdGhpcy5fYWxsQ2F0ZWdvcmllcy5maWx0ZXIoY2F0ZWdvcnkgPT4gY2F0ZWdvcnkuQ2F0ZWdvcnlJZCA9PT0gc2VsZWN0ZWRDYXRlZ29yeUlkKVswXVxyXG4gICAgICAgICAgICAgICAgICAgIC5QYXJlbnRDYXRlZ29yeUlkO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRGaXJzdExldmVsVG9TcGVjaWZpY0lkKGZpcnN0TGV2ZWxJZCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVNlY29uZExldmVsKGZpcnN0TGV2ZWxJZCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFNlY29uZExldmVsVG9TcGVjaWZpY0lkKHNlbGVjdGVkQ2F0ZWdvcnlJZCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVRoaXJkTGV2ZWwoc2VsZWN0ZWRDYXRlZ29yeUlkKTtcclxuICAgICAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLl9zZWNvbmRMZXZlbFNlbGVjdCkudHJpZ2dlcihcImNoYW5nZVwiKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgQ2F0ZWdvcnlMZXZlbC5MZXZlbDM6XHJcbiAgICAgICAgICAgIHRoaXMuQ3JlYXRlRmlyc3RMZXZlbCgpO1xyXG4gICAgICAgICAgICBzZWNvbmRMZXZlbElkID0gdGhpcy5fYWxsQ2F0ZWdvcmllcy5maWx0ZXIoY2F0ZWdvcnkgPT4gY2F0ZWdvcnkuQ2F0ZWdvcnlJZCA9PT0gc2VsZWN0ZWRDYXRlZ29yeUlkKVswXVxyXG4gICAgICAgICAgICAgICAgICAgIC5QYXJlbnRDYXRlZ29yeUlkO1xyXG4gICAgICAgICAgICBmaXJzdExldmVsSWQgPSB0aGlzLl9hbGxDYXRlZ29yaWVzLmZpbHRlcihjYXRlZ29yeSA9PiBjYXRlZ29yeS5DYXRlZ29yeUlkID09PSBzZWNvbmRMZXZlbElkKVswXVxyXG4gICAgICAgICAgICAgICAgLlBhcmVudENhdGVnb3J5SWQ7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0Rmlyc3RMZXZlbFRvU3BlY2lmaWNJZChmaXJzdExldmVsSWQpO1xyXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVNlY29uZExldmVsKGZpcnN0TGV2ZWxJZCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0U2Vjb25kTGV2ZWxUb1NwZWNpZmljSWQoc2Vjb25kTGV2ZWxJZCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVRoaXJkTGV2ZWwoc2Vjb25kTGV2ZWxJZCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFRoaXJkTGV2ZWxUb1NwZWNpZmljSWQoc2VsZWN0ZWRDYXRlZ29yeUlkKTtcclxuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuX3RoaXJkTGV2ZWxTZWxlY3QpLnRyaWdnZXIoXCJjaGFuZ2VcIik7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldEZpcnN0TGV2ZWxUb1NwZWNpZmljSWQoY2F0ZWdvcnlJZDogbnVtYmVyKSB7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX2ZpcnN0TGV2ZWxTZWxlY3QpLnZhbChjYXRlZ29yeUlkKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgc2V0U2Vjb25kTGV2ZWxUb1NwZWNpZmljSWQoY2F0ZWdvcnlJZDogbnVtYmVyKSB7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX3NlY29uZExldmVsU2VsZWN0KS52YWwoY2F0ZWdvcnlJZCk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHNldFRoaXJkTGV2ZWxUb1NwZWNpZmljSWQoY2F0ZWdvcnlJZDogbnVtYmVyKSB7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX3RoaXJkTGV2ZWxTZWxlY3QpLnZhbChjYXRlZ29yeUlkKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgZ2V0Q2F0ZWdvcnlMZXZlbChjYXRlZ29yeUlkOiBudW1iZXIpOiBDYXRlZ29yeUxldmVsIHtcclxuXHJcbiAgICAgICAgbGV0IHRlbXBDYXRlZ29yeUFycmF5ID0gdGhpcy5fYWxsQ2F0ZWdvcmllcy5maWx0ZXIoY2F0ZWdvcnkgPT4gY2F0ZWdvcnkuQ2F0ZWdvcnlJZCA9PT0gY2F0ZWdvcnlJZCk7XHJcbiAgICAgICAgbGV0IHRlbXBDYXRlZ29yeTtcclxuICAgICAgICBpZiAodGVtcENhdGVnb3J5QXJyYXkubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBDYXRlZ29yeUxldmVsLlVua293bjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGVtcENhdGVnb3J5ID0gdGVtcENhdGVnb3J5QXJyYXlbMF07XHJcbiAgICAgICAgaWYgKHRlbXBDYXRlZ29yeS5QYXJlbnRDYXRlZ29yeUlkID09PSB0aGlzLl9yb290Q2F0ZWdvcnlJZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gQ2F0ZWdvcnlMZXZlbC5MZXZlbDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRlbXBDYXRlZ29yeSA9IHRoaXMuX2FsbENhdGVnb3JpZXMuZmlsdGVyKGNhdGVnb3J5ID0+IGNhdGVnb3J5LkNhdGVnb3J5SWQgPT09IHRlbXBDYXRlZ29yeS5QYXJlbnRDYXRlZ29yeUlkKVswXTtcclxuICAgICAgICBpZiAodGVtcENhdGVnb3J5LlBhcmVudENhdGVnb3J5SWQgPT09IHRoaXMuX3Jvb3RDYXRlZ29yeUlkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBDYXRlZ29yeUxldmVsLkxldmVsMjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIENhdGVnb3J5TGV2ZWwuTGV2ZWwzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBJbnNlcnRDYXRlZ29yeUlkSW5Vc2VySW5wdXREaWN0aW9uYXJ5KHVzZXJJbnB1dDogVXNlcklucHV0KTogdm9pZCB7XHJcbiAgICAgICAgbGV0IGNhdGVnb3J5SWQgPSB0aGlzLkdldFNlbGVjdGVkQ2F0ZWdvcnlJZCgpO1xyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLkNhdGVnb3J5SWRLZXldID0gY2F0ZWdvcnlJZDsvLzEwMCBmb3IgY2Fyc1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBHZXRTZWxlY3RlZENhdGVnb3J5SWQoKTogbnVtYmVyIHtcclxuICAgICAgICBpZiAodGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUaHJlZSAhPT0gdW5kZWZpbmVkICYmXHJcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVGhyZWUgIT09IHRoaXMuX3Jvb3RDYXRlZ29yeUlkKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUaHJlZTtcclxuICAgICAgICBlbHNlIGlmICh0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFR3byAhPT0gdW5kZWZpbmVkICYmXHJcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVHdvICE9PSB0aGlzLl9yb290Q2F0ZWdvcnlJZClcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVHdvO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsT25lO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBDcmVhdGVGaXJzdExldmVsKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMucmVtb3ZlRWxlbWVudCh0aGlzLl9maXJzdExldmVsRGl2KTtcclxuICAgICAgICB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbE9uZSA9IHRoaXMuX3Jvb3RDYXRlZ29yeUlkO1xyXG4gICAgICAgIHRoaXMucmVtb3ZlRWxlbWVudCh0aGlzLl9zZWNvbmRMZXZlbERpdik7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUd28gPSB0aGlzLl9yb290Q2F0ZWdvcnlJZDtcclxuICAgICAgICB0aGlzLnJlbW92ZUVsZW1lbnQodGhpcy5fdGhpcmRMZXZlbERpdik7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUaHJlZSA9IHRoaXMuX3Jvb3RDYXRlZ29yeUlkO1xyXG5cclxuICAgICAgICBsZXQgdGVtcGxhdGUgPSAkKFwiI1wiICsgdGhpcy5fZmlyc3RMZXZlbFRlbXBsYXRlKS5odG1sKCk7XHJcbiAgICAgICAgbGV0IGNhdGVnb3JpZXM6IENhdGVnb3J5W10gPSBuZXcgQXJyYXk8Q2F0ZWdvcnk+KCk7XHJcbiAgICAgICAgbGV0IGRhdGEgPSB7IGNhdGVnb3JpZXM6IGNhdGVnb3JpZXMgfVxyXG4gICAgICAgIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsT25lID0gdGhpcy5fcm9vdENhdGVnb3J5SWQ7Ly9cclxuICAgICAgICB0aGlzLl9hbGxDYXRlZ29yaWVzLmZvckVhY2goY2F0ZWdvcnkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoY2F0ZWdvcnkuUGFyZW50Q2F0ZWdvcnlJZCA9PT0gdGhpcy5fcm9vdENhdGVnb3J5SWQpIHtcclxuICAgICAgICAgICAgICAgIGNhdGVnb3JpZXMucHVzaChjYXRlZ29yeSk7XHJcbiAgICAgICAgICAgIH0vL2lmXHJcbiAgICAgICAgfSk7Ly9mb3JFYWNoXHJcblxyXG4gICAgICAgIGxldCBodG1sID0gTXVzdGFjaGUudG9faHRtbCh0ZW1wbGF0ZSwgZGF0YSk7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX3BhcmVudERpdklkKS5hcHBlbmQoaHRtbCk7XHJcblxyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9maXJzdExldmVsU2VsZWN0KS5jaGFuZ2UoKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBzZWxlY3RlZElkID0gcGFyc2VJbnQoJChldmVudC5jdXJyZW50VGFyZ2V0KS52YWwoKS50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxPbmUgPSBzZWxlY3RlZElkO1xyXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVNlY29uZExldmVsKHNlbGVjdGVkSWQpO1xyXG4gICAgICAgICAgICBsZXQgZXZlbnRBcmcgPSBuZXcgQ2F0ZWdvcnlDYWhuZ2VkRXZlbnRBcmcoKTtcclxuICAgICAgICAgICAgZXZlbnRBcmcuU2VsZWN0ZWRDYXRlZ29yeUlkID0gdGhpcy5HZXRTZWxlY3RlZENhdGVnb3J5SWQoKTtcclxuICAgICAgICAgICAgZXZlbnRBcmcuU2VsZWN0ZWRDYXRlZ29yeUhhc0NoaWxkID0gdGhpcy5zZWxlY3RlZENhdGVnb3J5SGFzQ2hpbGRyZW4oKTtcclxuICAgICAgICAgICAgdGhpcy5TZWxlY3RlZENhdGVnb3J5Q2hhbmdlZEV2ZW50LkRpc3BhdGNoKHRoaXMsIGV2ZW50QXJnKTtcclxuICAgICAgICB9KTsvL2NoYW5nZVxyXG4gICAgfS8vQ3JlYXRlRmlyc3RMZXZlbFxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlU2Vjb25kTGV2ZWwoZmlyc3RMZXZlbENhdGVnb3J5SWQ6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMucmVtb3ZlRWxlbWVudCh0aGlzLl9zZWNvbmRMZXZlbERpdik7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUd28gPSB0aGlzLl9yb290Q2F0ZWdvcnlJZDtcclxuICAgICAgICB0aGlzLnJlbW92ZUVsZW1lbnQodGhpcy5fdGhpcmRMZXZlbERpdik7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUaHJlZSA9IHRoaXMuX3Jvb3RDYXRlZ29yeUlkO1xyXG4gICAgICAgIGlmIChmaXJzdExldmVsQ2F0ZWdvcnlJZCA9PT0gdGhpcy5fcm9vdENhdGVnb3J5SWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHRlbXBsYXRlID0gJChcIiNcIiArIHRoaXMuX3NlY29uZExldmVsVGVtcGxhdGUpLmh0bWwoKTtcclxuICAgICAgICBsZXQgY2F0ZWdvcmllczogQ2F0ZWdvcnlbXSA9IG5ldyBBcnJheTxDYXRlZ29yeT4oKTtcclxuICAgICAgICBsZXQgZGF0YSA9IHsgY2F0ZWdvcmllczogY2F0ZWdvcmllcyB9XHJcblxyXG4gICAgICAgIHRoaXMuX2FsbENhdGVnb3JpZXMuZm9yRWFjaChjYXRlZ29yeSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChjYXRlZ29yeS5QYXJlbnRDYXRlZ29yeUlkID09PSBmaXJzdExldmVsQ2F0ZWdvcnlJZCkge1xyXG4gICAgICAgICAgICAgICAgY2F0ZWdvcmllcy5wdXNoKGNhdGVnb3J5KTtcclxuICAgICAgICAgICAgfS8vaWZcclxuICAgICAgICB9KTsvL2ZvckVhY2hcclxuXHJcbiAgICAgICAgbGV0IGh0bWwgPSBNdXN0YWNoZS50b19odG1sKHRlbXBsYXRlLCBkYXRhKTtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fcGFyZW50RGl2SWQpLmFwcGVuZChodG1sKTtcclxuXHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX3NlY29uZExldmVsU2VsZWN0KS5jaGFuZ2UoKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBzZWxlY3RlZElkID0gcGFyc2VJbnQoJChldmVudC5jdXJyZW50VGFyZ2V0KS52YWwoKS50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUd28gPSBzZWxlY3RlZElkO1xyXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVRoaXJkTGV2ZWwoc2VsZWN0ZWRJZCk7XHJcbiAgICAgICAgICAgIGxldCBldmVudEFyZyA9IG5ldyBDYXRlZ29yeUNhaG5nZWRFdmVudEFyZygpO1xyXG4gICAgICAgICAgICBldmVudEFyZy5TZWxlY3RlZENhdGVnb3J5SWQgPSB0aGlzLkdldFNlbGVjdGVkQ2F0ZWdvcnlJZCgpO1xyXG4gICAgICAgICAgICBldmVudEFyZy5TZWxlY3RlZENhdGVnb3J5SGFzQ2hpbGQgPSB0aGlzLnNlbGVjdGVkQ2F0ZWdvcnlIYXNDaGlsZHJlbigpO1xyXG4gICAgICAgICAgICB0aGlzLlNlbGVjdGVkQ2F0ZWdvcnlDaGFuZ2VkRXZlbnQuRGlzcGF0Y2godGhpcywgZXZlbnRBcmcpO1xyXG4gICAgICAgIH0pOy8vY2hhbmdlXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVUaGlyZExldmVsKHNlY29uZExldmVsQ2F0ZWdvcnlJZDogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVFbGVtZW50KHRoaXMuX3RoaXJkTGV2ZWxEaXYpO1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVGhyZWUgPSB0aGlzLl9yb290Q2F0ZWdvcnlJZDtcclxuXHJcbiAgICAgICAgaWYgKHNlY29uZExldmVsQ2F0ZWdvcnlJZCA9PT0gdGhpcy5fcm9vdENhdGVnb3J5SWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHRlbXBsYXRlID0gJChcIiNcIiArIHRoaXMuX3RoaXJkTGV2ZWxUZW1wbGF0ZSkuaHRtbCgpO1xyXG4gICAgICAgIGxldCBjYXRlZ29yaWVzOiBDYXRlZ29yeVtdID0gbmV3IEFycmF5PENhdGVnb3J5PigpO1xyXG4gICAgICAgIGxldCBkYXRhID0geyBjYXRlZ29yaWVzOiBjYXRlZ29yaWVzIH1cclxuXHJcbiAgICAgICAgdGhpcy5fYWxsQ2F0ZWdvcmllcy5mb3JFYWNoKGNhdGVnb3J5ID0+IHtcclxuICAgICAgICAgICAgaWYgKGNhdGVnb3J5LlBhcmVudENhdGVnb3J5SWQgPT09IHNlY29uZExldmVsQ2F0ZWdvcnlJZCkge1xyXG4gICAgICAgICAgICAgICAgY2F0ZWdvcmllcy5wdXNoKGNhdGVnb3J5KTtcclxuICAgICAgICAgICAgfS8vaWZcclxuICAgICAgICB9KTsvL2ZvckVhY2hcclxuICAgICAgICBpZiAoY2F0ZWdvcmllcy5sZW5ndGggPT09IDApIHsvL05vIEl0ZW0gaW4gdGhpcmQgbGV2ZWwgY2F0ZWdvcnlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgaHRtbCA9IE11c3RhY2hlLnRvX2h0bWwodGVtcGxhdGUsIGRhdGEpO1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9wYXJlbnREaXZJZCkuYXBwZW5kKGh0bWwpO1xyXG5cclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fdGhpcmRMZXZlbFNlbGVjdCkuY2hhbmdlKChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFRocmVlID0gcGFyc2VJbnQoJChldmVudC5jdXJyZW50VGFyZ2V0KS52YWwoKS50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgbGV0IGV2ZW50QXJnID0gbmV3IENhdGVnb3J5Q2FobmdlZEV2ZW50QXJnKCk7XHJcbiAgICAgICAgICAgIGV2ZW50QXJnLlNlbGVjdGVkQ2F0ZWdvcnlJZCA9IHRoaXMuR2V0U2VsZWN0ZWRDYXRlZ29yeUlkKCk7XHJcbiAgICAgICAgICAgIGV2ZW50QXJnLlNlbGVjdGVkQ2F0ZWdvcnlIYXNDaGlsZCA9IHRoaXMuc2VsZWN0ZWRDYXRlZ29yeUhhc0NoaWxkcmVuKCk7XHJcbiAgICAgICAgICAgIHRoaXMuU2VsZWN0ZWRDYXRlZ29yeUNoYW5nZWRFdmVudC5EaXNwYXRjaCh0aGlzLCBldmVudEFyZyk7XHJcbiAgICAgICAgfSk7Ly9jaGFuZ2VcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNlbGVjdGVkQ2F0ZWdvcnlIYXNDaGlsZHJlbigpOiBib29sZWFuIHtcclxuICAgICAgICBsZXQgc2VsZWN0ZWRDYXRlZ29yeUlkID0gdGhpcy5HZXRTZWxlY3RlZENhdGVnb3J5SWQoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fYWxsQ2F0ZWdvcmllcy5maWx0ZXJcclxuICAgICAgICAgICAgKChjYXRlZ29yeSkgPT4geyByZXR1cm4gY2F0ZWdvcnkuUGFyZW50Q2F0ZWdvcnlJZCA9PT0gc2VsZWN0ZWRDYXRlZ29yeUlkIH0pLmxlbmd0aCA+IDA7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZW1vdmVFbGVtZW50KGlkOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICAkKFwiI1wiICsgaWQpLnJlbW92ZSgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ2F0ZWdvcnlDYWhuZ2VkRXZlbnRBcmcge1xyXG4gICAgcHVibGljIFNlbGVjdGVkQ2F0ZWdvcnlJZDogbnVtYmVyO1xyXG4gICAgcHVibGljIFNlbGVjdGVkQ2F0ZWdvcnlIYXNDaGlsZDogYm9vbGVhbjtcclxufVxyXG5cclxuZW51bSBDYXRlZ29yeUxldmVsIHtcclxuICAgIExldmVsMSA9IDEsXHJcbiAgICBMZXZlbDIgPSAyLFxyXG4gICAgTGV2ZWwzID0gMyxcclxuICAgIFVua293bj00XHJcbn1cclxuXHJcbiIsIu+7v2ltcG9ydCB7Q2FyTW9kZWx9IGZyb20gXCIuLi8uLi9Nb2RlbHMvQWRUcmFuc3BvcnRhdGlvbi9DYXJNb2RlbFwiO1xyXG5pbXBvcnQge1VzZXJJbnB1dH0gZnJvbSBcIi4uLy4uL0hlbHBlci9Vc2VySW5wdXRcIjtcclxuaW1wb3J0IHtJQ3JpdGVyaWEsQ3JpdGVyaWFWYWxpZGF0b3J9IGZyb20gXCIuLi8uLi9IZWxwZXIvSUNyaXRlcmlhXCI7XHJcblxyXG5pbXBvcnQge0lDcml0ZXJpYUNoYW5nZX0gZnJvbSBcIi4uLy4uL0hlbHBlci9JQ3JpdGVyaWFDaGFuZ2VcIjtcclxuXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIENhck1vZGVsQnJhbmRDb250cm9sbGVyIGltcGxlbWVudHMgSUNyaXRlcmlhIHtcclxuICAgIFZhbGlkYXRlQ3JpdGVyaWEoKTogQ3JpdGVyaWFWYWxpZGF0b3IgeyB0aHJvdyBuZXcgRXJyb3IoXCJOb3QgaW1wbGVtZW50ZWRcIik7IH1cclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IENhckJyYW5kSWRLZXk6IHN0cmluZyA9IFwiQnJhbmRJZFwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBCcmFuZFNlbGVjdElkOiBzdHJpbmcgPSBcImJyYW5kXCI7XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBDYXJNb2RlbFRlbXBsYXRlSWQ6IHN0cmluZyA9IFwibW9kZWxUZW1wbGF0ZVwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBDYXJNb2RlbERpdlBsYWNlSG9sZGVySWQ6IHN0cmluZyA9IFwibW9kZWxQbGFjZUhvbGRlclwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBDYXJNb2RlbElkS2V5OiBzdHJpbmcgPSBcIkNhck1vZGVsSWRcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgQWxsQ2FyTW9kZWxzSW5wdXRJZDogc3RyaW5nID0gXCJhbGxDYXJNb2RlbHNcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgTW9kZWxTZWxlY3RJZDogc3RyaW5nID0gXCJtb2RlbFwiO1xyXG4gICAgcHJpdmF0ZSBfYWxsQ2FyTW9kZWxzOiBDYXJNb2RlbFtdO1xyXG5cclxuICAgIHByaXZhdGUgX3NlYXJjaENyaXRlcmlhQ2hhbmdlOklDcml0ZXJpYUNoYW5nZTtcclxuXHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5pbml0VmlldygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaW5pdFZpZXcoKTogdm9pZCB7XHJcbiAgICAgICAgbGV0IGFsbENhck1vZGVsc1N0cmluZyA9ICQoXCIjXCIgKyB0aGlzLkFsbENhck1vZGVsc0lucHV0SWQpLnZhbCgpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgdGhpcy5fYWxsQ2FyTW9kZWxzID0gJC5wYXJzZUpTT04oYWxsQ2FyTW9kZWxzU3RyaW5nKSBhcyBDYXJNb2RlbFtdO1xyXG4gICAgICAgIHRoaXMuaW5pdENhck1vZGVsKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbml0Q2FyTW9kZWwoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVDYXJNb2RlbEVsZW1lbnQobmV3IEFycmF5PENhck1vZGVsPigpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZUNhck1vZGVsRWxlbWVudChjYXJNb2RlbHM6IENhck1vZGVsW10pIHtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5DYXJNb2RlbERpdlBsYWNlSG9sZGVySWQpLmNoaWxkcmVuKCkucmVtb3ZlKCk7XHJcbiAgICAgICAgbGV0IHRlbXBsYXRlID0gJChcIiNcIiArIHRoaXMuQ2FyTW9kZWxUZW1wbGF0ZUlkKS5odG1sKCk7XHJcbiAgICAgICAgbGV0IGRhdGEgPSB7IGNhck1vZGVsczogY2FyTW9kZWxzIH1cclxuICAgICAgICBsZXQgaHRtbCA9IE11c3RhY2hlLnRvX2h0bWwodGVtcGxhdGUsIGRhdGEpO1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLkNhck1vZGVsRGl2UGxhY2VIb2xkZXJJZCkuYXBwZW5kKGh0bWwpO1xyXG4gICAgICAgIHRoaXMuYmluZENhck1vZGVsKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBiaW5kQ2FyTW9kZWwoKTogdm9pZCB7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuTW9kZWxTZWxlY3RJZCkub24oXCJjaGFuZ2VcIixcclxuICAgICAgICAgICAgKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zZWFyY2hDcml0ZXJpYUNoYW5nZS5DdXN0b21Dcml0ZXJpYUNoYW5nZWQoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1cGRhdGVDYXJNb2RlbFNlbGVjdChicmFuZElkOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICBsZXQgY2FyTW9kZWxzID0gbmV3IEFycmF5PENhck1vZGVsPigpO1xyXG4gICAgICAgIHRoaXMuX2FsbENhck1vZGVscy5mb3JFYWNoKChjYXJNb2RlbCwgaW5kZXgsIGFycmF5KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChjYXJNb2RlbC5CcmFuZElkID09PSBicmFuZElkKVxyXG4gICAgICAgICAgICAgICAgY2FyTW9kZWxzLnB1c2goY2FyTW9kZWwpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlQ2FyTW9kZWxFbGVtZW50KGNhck1vZGVscyk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHB1YmxpYyBGaWxsQ3JpdGVyaWEodXNlcklucHV0OlVzZXJJbnB1dCk6dm9pZCB7XHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuQ2FyQnJhbmRJZEtleV0gPVxyXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5CcmFuZFNlbGVjdElkKS5maW5kKFwib3B0aW9uOnNlbGVjdGVkXCIpLnZhbCgpOy8vYnJhbmRJZFxyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLkNhck1vZGVsSWRLZXldID1cclxuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuTW9kZWxTZWxlY3RJZCkuZmluZChcIm9wdGlvbjpzZWxlY3RlZFwiKS52YWwoKTsvL2Nhck1vZGVsSWRcclxuICAgIH1cclxuXHJcbiAgICBCaW5kRXZlbnRzKGNyaXRlcmlhQ2hhbmdlOiBJQ3JpdGVyaWFDaGFuZ2UpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9zZWFyY2hDcml0ZXJpYUNoYW5nZSA9IGNyaXRlcmlhQ2hhbmdlO1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLkJyYW5kU2VsZWN0SWQpLm9uKFwiY2hhbmdlXCIsIChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgc2VsZWN0ZWRCcmFuZElkOiBudW1iZXIgPSBwYXJzZUludCgkKGV2ZW50LmN1cnJlbnRUYXJnZXQpLmZpbmQoXCJvcHRpb246c2VsZWN0ZWRcIikudmFsKCkudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQ2FyTW9kZWxTZWxlY3Qoc2VsZWN0ZWRCcmFuZElkKTtcclxuICAgICAgICAgICAgY3JpdGVyaWFDaGFuZ2UuQ3VzdG9tQ3JpdGVyaWFDaGFuZ2VkKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuYmluZENhck1vZGVsKCk7XHJcbiAgICB9XHJcblxyXG4gICAgVW5CaW5kRXZlbnRzKCk6IHZvaWQge1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLkJyYW5kU2VsZWN0SWQpLm9mZihcImNoYW5nZVwiKTtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5Nb2RlbFNlbGVjdElkKS5vZmYoXCJjaGFuZ2VcIik7XHJcbiAgICB9XHJcbn0iLCLvu79pbXBvcnQge0lFdmVudH0gIGZyb20gXCIuL0lFdmVudFwiO1xyXG5cclxuXHJcbi8qIFRoZSBkaXNwYXRjaGVyIGhhbmRsZXMgdGhlIHN0b3JhZ2Ugb2Ygc3Vic2NpcHRpb25zIGFuZCBmYWNpbGl0YXRlc1xyXG4gIHN1YnNjcmlwdGlvbiwgdW5zdWJzY3JpcHRpb24gYW5kIGRpc3BhdGNoaW5nIG9mIHRoZSBldmVudCAqL1xyXG5leHBvcnQgIGNsYXNzIEV2ZW50RGlzcGF0Y2hlcjxUU2VuZGVyLCBUQXJncz4gaW1wbGVtZW50cyBJRXZlbnQ8VFNlbmRlciwgVEFyZ3M+IHtcclxuXHJcbiAgICBwcml2YXRlIF9zdWJzY3JpcHRpb25zOiBBcnJheTwoc2VuZGVyOiBUU2VuZGVyLCBhcmdzOiBUQXJncykgPT4gdm9pZD4gPSBuZXcgQXJyYXk8KHNlbmRlcjogVFNlbmRlciwgYXJnczogVEFyZ3MpID0+IHZvaWQ+KCk7XHJcblxyXG4gICAgcHVibGljIFN1YnNjcmliZShmbjogKHNlbmRlcjogVFNlbmRlciwgYXJnczogVEFyZ3MpID0+IHZvaWQpOiB2b2lkIHtcclxuICAgICAgICBpZiAoZm4pIHtcclxuICAgICAgICAgICAgdGhpcy5fc3Vic2NyaXB0aW9ucy5wdXNoKGZuKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljICBVbnN1YnNjcmliZShmbjogKHNlbmRlcjogVFNlbmRlciwgYXJnczogVEFyZ3MpID0+IHZvaWQpOiB2b2lkIHtcclxuICAgICAgICBsZXQgaSA9IHRoaXMuX3N1YnNjcmlwdGlvbnMuaW5kZXhPZihmbik7XHJcbiAgICAgICAgaWYgKGkgPiAtMSkge1xyXG4gICAgICAgICAgICB0aGlzLl9zdWJzY3JpcHRpb25zLnNwbGljZShpLCAxKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljICBEaXNwYXRjaChzZW5kZXI6IFRTZW5kZXIsIGFyZ3M6IFRBcmdzKTogdm9pZCB7XHJcbiAgICAgICAgZm9yIChsZXQgaGFuZGxlciBvZiB0aGlzLl9zdWJzY3JpcHRpb25zKSB7XHJcbiAgICAgICAgICAgIGhhbmRsZXIoc2VuZGVyLCBhcmdzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCLvu79pbXBvcnQgeyBJQ3JpdGVyaWF9IGZyb20gXCIuL0lDcml0ZXJpYVwiO1xyXG5pbXBvcnQgeyBOdW1lcmljRGljdGlvbmFyeSB9IGZyb20gXCJsb2Rhc2gvaW5kZXhcIjtcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgQ3JpdGVyaWFOdW1lcmljRGljdGlvbmFyeSBpbXBsZW1lbnRzIE51bWVyaWNEaWN0aW9uYXJ5PElDcml0ZXJpYT4ge1xyXG4gICAgW2luZGV4OiBudW1iZXJdOiBJQ3JpdGVyaWE7XHJcbn0iLCLvu79pbnRlcmZhY2UgTG9vc2VPYmplY3Qge1xyXG4gICAgW2tleTogc3RyaW5nXTogYW55XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBVc2VySW5wdXQge1xyXG4gICAgcHVibGljIFBhcmFtZXRlcnNEaWN0aW9uYXJ5OiBMb29zZU9iamVjdCA9IHt9O1xyXG59XHJcblxyXG5cclxuXHJcbiIsIu+7v2V4cG9ydCBjbGFzcyBJbWFnZVVwbG9hZGVyIHtcclxuICAgICAgICBcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgTmV3QWRHdWlkS2V5ID0gXCJOZXdBZEd1aWRcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgUmVxdWVzdEluZGV4S2V5ID1cIlJlcXVlc3RJbmRleFwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBJbWFnZVVwbG9hZElucHV0SWQ6IHN0cmluZyA9IFwiaW1hZ2VVcGxvYWRcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgTWVzc2FnZVRvVXNlckRpdklkOiBzdHJpbmcgPSBcImxhYmVsTWVzc2FnZVRvVXNlclwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBMb2FkZWRJbWFnZXNEaXZJZDogc3RyaW5nID0gXCJsb2FkZWRJbWFnZVZpZXdcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgVXBsb2FkaW5nSW1hZ2VUZW1wbGF0ZTogc3RyaW5nID0gXCJ1cGxvYWRpbmdJbWFnZVRlbXBsYXRlXCI7XHJcblxyXG4gICAgcHJpdmF0ZSBfc2VuZEZpbGVzVG9TZXJ2ZXJVcmw6IHN0cmluZyA9IFwiL2FwaS9BZEFwaS9BZGRUZW1wSW1hZ2VcIjtcclxuICAgIHByaXZhdGUgX3JlbW92ZUZpbGVGcm9tU2VydmVyVXJsOiBzdHJpbmcgPSBcIi9hcGkvQWRBcGkvUmVtb3ZlVGVtcEltYWdlXCI7XHJcblxyXG4gICAgcHJpdmF0ZSBfY3VycmVudE5ld0FkR3VpZDogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBfcmVxdWVzdEluZGV4OiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBWYWxpZFVwbG9hZFRpbWU9MjAwMDA7XHJcblxyXG4gICAgY29uc3RydWN0b3IoY3VycmVudE5ld0FkR3VpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5fY3VycmVudE5ld0FkR3VpZCA9IGN1cnJlbnROZXdBZEd1aWQ7XHJcbiAgICAgICAgdGhpcy5pbml0VmlldygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaW5pdFZpZXcoKTogdm9pZCB7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuSW1hZ2VVcGxvYWRJbnB1dElkKS5jaGFuZ2UoKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBmaWxlVXBsb2FkOiBIVE1MSW5wdXRFbGVtZW50ID0gJChcIiNcIiArIHRoaXMuSW1hZ2VVcGxvYWRJbnB1dElkKS5nZXQoMCkgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICAgICAgICAgICAgbGV0IGZpbGVzOiBGaWxlTGlzdCA9IGZpbGVVcGxvYWQuZmlsZXM7XHJcbiAgICAgICAgICAgIHRoaXMuc2VuZEZpbGVzVG9TZXJ2ZXIoZmlsZXMpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKGRvY3VtZW50KS5vbihcImNsaWNrXCIsIFwiLmFkZGVkSW1hZ2UgPiBpbnB1dFwiLCAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5yZW1vdmVJbWFnZUZyb21TZXJ2ZXIoJChldmVudC5jdXJyZW50VGFyZ2V0KS5wYXJlbnQoKS5hdHRyKFwiaWRcIikudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZW5kRmlsZXNUb1NlcnZlcihmaWxlTGlzdDogRmlsZUxpc3QpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9yZXF1ZXN0SW5kZXgrKztcclxuICAgICAgICB2YXIgZGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xyXG4gICAgICAgIGRhdGEuYXBwZW5kKHRoaXMuTmV3QWRHdWlkS2V5LCB0aGlzLl9jdXJyZW50TmV3QWRHdWlkKTtcclxuICAgICAgICBkYXRhLmFwcGVuZCh0aGlzLlJlcXVlc3RJbmRleEtleSwgdGhpcy5fcmVxdWVzdEluZGV4LnRvU3RyaW5nKCkpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZmlsZUxpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgZGF0YS5hcHBlbmQoZmlsZUxpc3RbaV0ubmFtZSwgZmlsZUxpc3RbaV0pO1xyXG4gICAgICAgIH0gLy9mb3JcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0eXBlOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgdXJsOiB0aGlzLl9zZW5kRmlsZXNUb1NlcnZlclVybCxcclxuICAgICAgICAgICAgY29udGVudFR5cGU6IGZhbHNlLFxyXG4gICAgICAgICAgICBwcm9jZXNzRGF0YTogZmFsc2UsXHJcbiAgICAgICAgICAgIGRhdGE6IGRhdGEsXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IChtc2csIHRleHRTdGF0dXMsIGpxWEhSKSA9PiB0aGlzLm9uU3VjY2Vzc1NlbmRGaWxlVG9TZXJ2ZXIobXNnLCB0ZXh0U3RhdHVzLCBqcVhIUiksIC8vT24gU3VjY2Vzc2Z1bGwgc2VydmljZSBjYWxsXHJcbiAgICAgICAgICAgIGVycm9yOiAoanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKSA9PiB0aGlzLm9uRXJyb3JTZW5kRmlsZVRvU2VydmVyKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikgLy8gV2hlbiBTZXJ2aWNlIGNhbGwgZmFpbHNcclxuXHJcbiAgICAgICAgfSk7IC8vYWpheFxyXG4gICAgICAgIHRoaXMuYWRkVXBsb2FkaW5nSW1hZ2VUZW1wbGF0ZSh0aGlzLl9yZXF1ZXN0SW5kZXgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25TdWNjZXNzU2VuZEZpbGVUb1NlcnZlcihtc2c6IGFueSwgdGV4dFN0YXR1czogc3RyaW5nLCBqcVhIUjogSlF1ZXJ5WEhSKSB7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuSW1hZ2VVcGxvYWRJbnB1dElkKS52YWwoXCJcIik7XHJcblxyXG4gICAgICAgIGlmIChtc2cuU3VjY2VzcyA9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU2VuZGluZ0ltYWdlVGVtcGxhdGUobXNnLlJlc3BvbnNlRGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnNob3dNZXNzYWdlVG9Vc2VyKG1zZy5NZXNzYWcgKyBcIiAsXCIgKyBtc2cuRXJyb3JDb2RlKTtcclxuICAgICAgICAgICAgdGhpcy51cGxvYWRJbWFnZVRpbWVyRXhwaXJlKHBhcnNlSW50KG1zZy5SZXNwb25zZURhdGEuUmVxdWVzdEluZGV4KSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25FcnJvclNlbmRGaWxlVG9TZXJ2ZXIoanFYSFI6IEpRdWVyeVhIUiwgdGV4dFN0YXR1czogc3RyaW5nLCBlcnJvclRocm93bjogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5zaG93TWVzc2FnZVRvVXNlcihcItiu2LfYpyDYr9ixINin2LHYs9in2YRcIik7Ly9tYWdpYyBzdHJpbmdcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGFkZFVwbG9hZGluZ0ltYWdlVGVtcGxhdGUocmVxdWVzdEluZGV4Om51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIGxldCB0ZW1wbGF0ZSA9ICQoXCIjXCIgKyB0aGlzLlVwbG9hZGluZ0ltYWdlVGVtcGxhdGUpLmh0bWwoKTsvL21hZ2ljIHN0cmluZ1xyXG4gICAgICAgIGxldCBkYXRhID0geyBSZXF1ZXN0SW5kZXg6IHJlcXVlc3RJbmRleCB9Oy8vbWFnaWMgc3RyaW5nXHJcbiAgICAgICAgbGV0IGh0bWwgPSBNdXN0YWNoZS50b19odG1sKHRlbXBsYXRlLCBkYXRhKTtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5Mb2FkZWRJbWFnZXNEaXZJZCkuYXBwZW5kKGh0bWwpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHNldFRpbWVvdXQodGhpcy51cGxvYWRJbWFnZVRpbWVyRXhwaXJlLFxyXG4gICAgICAgICAgICB0aGlzLlZhbGlkVXBsb2FkVGltZSx0aGlzLl9yZXF1ZXN0SW5kZXgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBsb2FkSW1hZ2VUaW1lckV4cGlyZSh1cGxvYWRSZXF1ZXN0SW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgIGlmICgkKFwiI2xvYWRlZEltYWdlVmlldyA+ICN1cGxvYWRpbmdJbWFnZVwiICsgdXBsb2FkUmVxdWVzdEluZGV4ICsgXCIgPiBpbWdcIikuaGFzQ2xhc3MoXCJnaWZJbWFnZVwiKSkge1xyXG4gICAgICAgICAgICAkKFwiI2xvYWRlZEltYWdlVmlldyA+ICN1cGxvYWRpbmdJbWFnZVwiICsgdXBsb2FkUmVxdWVzdEluZGV4KS5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlU2VuZGluZ0ltYWdlVGVtcGxhdGUoZGF0YTogVXBsb2FkZWRJbWFnZSkge1xyXG4gICAgICAgIGlmICgkKFwiI2xvYWRlZEltYWdlVmlldyA+ICN1cGxvYWRpbmdJbWFnZVwiICsgZGF0YS5SZXF1ZXN0SW5kZXgpLmxlbmd0aCA9PT0gMCkgey8vcmVtb3ZlZCBieSB0aW1lclxyXG4gICAgICAgICAgICB0aGlzLmFkZFVwbG9hZGluZ0ltYWdlVGVtcGxhdGUocGFyc2VJbnQoZGF0YS5SZXF1ZXN0SW5kZXgpKTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVTZW5kaW5nSW1hZ2VUZW1wbGF0ZShkYXRhKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvL1RPRE8gY2FuY2VsIHRpbWVyXHJcbiAgICAgICAgICAgICQoXCIjbG9hZGVkSW1hZ2VWaWV3ID4gI3VwbG9hZGluZ0ltYWdlXCIgKyBkYXRhLlJlcXVlc3RJbmRleCArIFwiID5pbWdcIilcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwic3JjXCIsIFwiZGF0YTppbWFnZS9qcGc7YmFzZTY0LFwiICsgZGF0YS5JbWFnZSkucmVtb3ZlQ2xhc3MoXCJnaWZJbWFnZVwiKTtcclxuICAgICAgICAgICAgJChcIiNsb2FkZWRJbWFnZVZpZXcgPiAjdXBsb2FkaW5nSW1hZ2VcIiArIGRhdGEuUmVxdWVzdEluZGV4KS5hdHRyKFwiaWRcIiwgZGF0YS5JbWFnZUZpbGVOYW1lKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZW1vdmVJbWFnZUZyb21TZXJ2ZXIoZmlsZU5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIGFsZXJ0KGZpbGVOYW1lKTtcclxuICAgICAgICBsZXQgY2FsbFBhcmFtcyA9IHtcclxuICAgICAgICAgICAgRmlsZU5hbWVUb0JlUmVtb3ZlZDogZmlsZU5hbWUsXHJcbiAgICAgICAgICAgIE5ld0FkR3VpZDp0aGlzLl9jdXJyZW50TmV3QWRHdWlkXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogXCJHRVRcIiwgLy9HRVQgb3IgUE9TVCBvciBQVVQgb3IgREVMRVRFIHZlcmJcclxuICAgICAgICAgICAgdXJsOiB0aGlzLl9yZW1vdmVGaWxlRnJvbVNlcnZlclVybCxcclxuICAgICAgICAgICAgZGF0YTogY2FsbFBhcmFtcywgLy9EYXRhIHNlbnQgdG8gc2VydmVyXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IChtc2csIHRleHRTdGF0dXMsIGpxWEhSKSA9PiB0aGlzLm9uU3VjY2Vzc1JlbW92ZUZpbGVGcm9tU2VydmVyKG1zZywgdGV4dFN0YXR1cywganFYSFIpLCAvL09uIFN1Y2Nlc3NmdWxsIHNlcnZpY2UgY2FsbFxyXG4gICAgICAgICAgICBlcnJvcjogKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikgPT4gdGhpcy5vbkVycm9yUmVtb3ZlRmlsZUZyb21TZXJ2ZXIoanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKSAvLyBXaGVuIFNlcnZpY2UgY2FsbCBmYWlsc1xyXG4gICAgICAgIH0pOyAvLy5hamF4XHJcbiAgICAgICAgdGhpcy5zaG93TWVzc2FnZVRvVXNlcihcInJlbW92aW5nIGZpbGUgZnJvbSBzZXJ2ZXJcIik7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHByaXZhdGUgb25TdWNjZXNzUmVtb3ZlRmlsZUZyb21TZXJ2ZXIobXNnOiBhbnksIHRleHRTdGF0dXM6IHN0cmluZywganFYSFI6IEpRdWVyeVhIUikge1xyXG4gICAgICAgIGlmIChtc2cuU3VjY2VzcyA9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2hvd01lc3NhZ2VUb1VzZXIoXCJkb25lIHJlbW92aW5nIGZpbGUgZnJvbSBzZXJ2ZXJcIik7XHJcbiAgICAgICAgICAgIGxldCBmaWxlTmFtZTogc3RyaW5nID0gbXNnLlJlc3BvbnNlRGF0YTtcclxuICAgICAgICAgICAgJChgW2lkPVwiJHtmaWxlTmFtZX1cIl1gKS5yZW1vdmUoKTtcclxuXHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2hvd01lc3NhZ2VUb1VzZXIobXNnLk1lc3NhZ2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9uRXJyb3JSZW1vdmVGaWxlRnJvbVNlcnZlcihqcVhIUjogSlF1ZXJ5WEhSLCB0ZXh0U3RhdHVzOiBzdHJpbmcsIGVycm9yVGhyb3duOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLnNob3dNZXNzYWdlVG9Vc2VyKFwiZXJyb3IsIFwiICsgZXJyb3JUaHJvd24pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2hvd01lc3NhZ2VUb1VzZXIobXNnKSB7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuTWVzc2FnZVRvVXNlckRpdklkKS5odG1sKG1zZyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFVwbG9hZGVkSW1hZ2Uge1xyXG4gICAgcHVibGljIEltYWdlOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgSW1hZ2VGaWxlTmFtZTogc3RyaW5nO1xyXG4gICAgcHVibGljIFJlcXVlc3RJbmRleDpzdHJpbmc7XHJcbn0iLCLvu79pbXBvcnQgeyBDcml0ZXJpYU51bWVyaWNEaWN0aW9uYXJ5IH0gZnJvbSBcIi4uLy4uLy4uL0hlbHBlci9Dcml0ZXJpYU51bWVyaWNEaWN0aW9uYXJ5XCI7XHJcbmltcG9ydCB7IERlZmF1bHROZXdBZENyaXRlcmlhIH0gZnJvbSBcIi4vTmV3QWRDcml0ZXJpYS9EZWZhdWx0TmV3QWRDcml0ZXJpYVwiO1xyXG5pbXBvcnQge0FkVHJhbnNmb3JtYXRpb25OZXdBZENyaXRlcmlhfSBmcm9tIFwiLi9OZXdBZENyaXRlcmlhL0FkVHJhbnNmb3JtYXRpb25OZXdBZENyaXRlcmlhXCI7XHJcbmltcG9ydCB7VXNlcklucHV0fSBmcm9tIFwiLi4vLi4vLi4vSGVscGVyL1VzZXJJbnB1dFwiO1xyXG5pbXBvcnQge0lDcml0ZXJpYX0gZnJvbSBcIi4uLy4uLy4uL0hlbHBlci9JQ3JpdGVyaWFcIjtcclxuaW1wb3J0IHtJQ3JpdGVyaWFDaGFuZ2V9IGZyb20gXCIuLi8uLi8uLi9IZWxwZXIvSUNyaXRlcmlhQ2hhbmdlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTmV3QWRDcml0ZXJpYSB7XHJcbiAgICBwcml2YXRlIF9uZXdBZENyaXRlcmlhSW9jQ29udGFpbmVyOiBDcml0ZXJpYU51bWVyaWNEaWN0aW9uYXJ5IDtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuX25ld0FkQ3JpdGVyaWFJb2NDb250YWluZXIgPSBuZXcgQ3JpdGVyaWFOdW1lcmljRGljdGlvbmFyeSgpO1xyXG4gICAgICAgIHRoaXMuaW5pdE5ld0FkQ3JpdGVyaWFJb2NDb250YWluZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXROZXdBZENyaXRlcmlhSW9jQ29udGFpbmVyKCkge1xyXG4gICAgICAgIHRoaXMuX25ld0FkQ3JpdGVyaWFJb2NDb250YWluZXJbMF0gPSBuZXcgRGVmYXVsdE5ld0FkQ3JpdGVyaWEoKTtcclxuICAgICAgICB0aGlzLl9uZXdBZENyaXRlcmlhSW9jQ29udGFpbmVyWzEwMF0gPSBuZXcgQWRUcmFuc2Zvcm1hdGlvbk5ld0FkQ3JpdGVyaWEoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgRmlsbENhdGVnb3J5U3BlY2lmaWNOZXdBZENyaXRlcmlhKGNhdGVnb3J5SWQ6IG51bWJlciwgdXNlcklucHV0OiBVc2VySW5wdXQpOiB2b2lkIHtcclxuICAgICAgICBsZXQgbmV3QWRDcml0ZXJpYSA9IHRoaXMucG9seW1vcnBoaWNEaXNwYXRjaE5ld0FkQ3JpdGVyaWEoY2F0ZWdvcnlJZCk7XHJcbiAgICAgICAgbmV3QWRDcml0ZXJpYS5GaWxsQ3JpdGVyaWEodXNlcklucHV0KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgQmluZChjYXRlZ29yeUlkOiBudW1iZXIsIGNyaXRlcmlhQ2hhbmdlOiBJQ3JpdGVyaWFDaGFuZ2UpIHtcclxuICAgICAgICBsZXQgY3JpdGVyaWEgPSB0aGlzLnBvbHltb3JwaGljRGlzcGF0Y2hOZXdBZENyaXRlcmlhKGNhdGVnb3J5SWQpO1xyXG4gICAgICAgIGNyaXRlcmlhLkJpbmRFdmVudHMoY3JpdGVyaWFDaGFuZ2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBVbkJpbmQoY2F0ZWdvcnlJZDogbnVtYmVyKSB7XHJcbiAgICAgICAgbGV0IGNyaXRlcmlhID0gdGhpcy5wb2x5bW9ycGhpY0Rpc3BhdGNoTmV3QWRDcml0ZXJpYShjYXRlZ29yeUlkKTtcclxuICAgICAgICBjcml0ZXJpYS5VbkJpbmRFdmVudHMoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHBvbHltb3JwaGljRGlzcGF0Y2hOZXdBZENyaXRlcmlhKGNhdGVnb3J5SWQ6IG51bWJlcik6IElDcml0ZXJpYSB7XHJcbiAgICAgICAgbGV0IHJldHVyblZhbHVlOiBJQ3JpdGVyaWEgPSB0aGlzLl9uZXdBZENyaXRlcmlhSW9jQ29udGFpbmVyW2NhdGVnb3J5SWRdO1xyXG4gICAgICAgIGlmIChyZXR1cm5WYWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHJldHVyblZhbHVlID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHJldHVyblZhbHVlID0gdGhpcy5fbmV3QWRDcml0ZXJpYUlvY0NvbnRhaW5lclswXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldHVyblZhbHVlO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuIiwi77u/aW1wb3J0IHtJQ3JpdGVyaWEsQ3JpdGVyaWFWYWxpZGF0b3J9IGZyb20gXCIuLi8uLi8uLi8uLi9IZWxwZXIvSUNyaXRlcmlhXCI7XHJcbmltcG9ydCB7VXNlcklucHV0fSBmcm9tIFwiLi4vLi4vLi4vLi4vSGVscGVyL1VzZXJJbnB1dFwiO1xyXG5pbXBvcnQge0lDcml0ZXJpYUNoYW5nZX0gZnJvbSBcIi4uLy4uLy4uLy4uL0hlbHBlci9JQ3JpdGVyaWFDaGFuZ2VcIjtcclxuaW1wb3J0IHtDYXJNb2RlbEJyYW5kQ29udHJvbGxlcn0gZnJvbSBcIi4uLy4uLy4uLy4uL0NvbXBvbmVudHMvVHJhbnNmb3JtYXRpb24vQ2FyTW9kZWxCcmFuZENvbnRyb2xsZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBBZFRyYW5zZm9ybWF0aW9uTmV3QWRDcml0ZXJpYSBpbXBsZW1lbnRzIElDcml0ZXJpYSB7XHJcbiAgICBwcml2YXRlIF9jYXJNb2RlbEJyYW5kQ29udG9sbGVyOiBDYXJNb2RlbEJyYW5kQ29udHJvbGxlcjtcclxuXHJcbiAgICBwdWJsaWMgVmFsaWRhdGVDcml0ZXJpYSgpOiBDcml0ZXJpYVZhbGlkYXRvciB7IHRocm93IG5ldyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZFwiKTsgfVxyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgTWFrZVllYXJLZXk6IHN0cmluZyA9IFwiTWFrZVllYXJcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgTWFrZVllYXJJbnB1dElkOiBzdHJpbmcgPSBcIm1ha2VZZWFyXCI7XHJcbiAgIFxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBGdWVsS2V5ID0gXCJGdWVsXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IEZ1ZWxTZWxlY3RJZDogc3RyaW5nID0gXCJmdWVsXCI7XHJcblxyXG4gICAgcHVibGljIHJlYWRvbmx5IEdlYXJib3hLZXk6IHN0cmluZyA9IFwiR2VhcmJveFwiO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IEdlYXJib3hUeXBlUGFyZW50RGl2SWQ6IHN0cmluZyA9IFwiZ2VhcmJveFR5cGVcIjtcclxuXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgQ2FyU3RhdHVzS2V5OiBzdHJpbmcgPSBcIkNhclN0YXR1c1wiO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IENhclN0YXR1c1BhcmVudERpdklkOiBzdHJpbmcgPSBcImNhclN0YXR1c1wiO1xyXG5cclxuICAgIHB1YmxpYyByZWFkb25seSBNaWxlYWdlS2V5OiBzdHJpbmcgPSBcIk1pbGVhZ2VcIjtcclxuICAgIHB1YmxpYyByZWFkb25seSBNaWxlYWdlSW5wdXRJZDogc3RyaW5nID0gXCJtaWxlYWdlXCI7XHJcblxyXG4gICAgcHVibGljIHJlYWRvbmx5IFBsYXRlVHlwZUtleTogc3RyaW5nID0gXCJQbGF0ZVR5cGVcIjtcclxuICAgIHB1YmxpYyByZWFkb25seSBQbGF0ZVR5cGVQYXJlbnREaXZJZDogc3RyaW5nID0gXCJwbGF0ZVR5cGVcIjtcclxuXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgQm9keVN0YXR1c0tleTogc3RyaW5nID0gXCJCb2R5U3RhdHVzXCI7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgQm9keVN0YXR1c1NlbGVjdElkOiBzdHJpbmcgPSBcImJvZHlTdGF0dXNcIjtcclxuXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgQm9keUNvbG9yS2V5OiBzdHJpbmcgPSBcIkJvZHlDb2xvclwiO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IEJvZHlDb2xvclNlbGVjdElkOiBzdHJpbmcgPSBcImJvZHlDb2xvclwiO1xyXG5cclxuICAgIHB1YmxpYyByZWFkb25seSBJbnRlcm5hbENvbG9yS2V5OiBzdHJpbmcgPSBcIkludGVybmFsQ29sb3JcIjtcclxuICAgIHB1YmxpYyByZWFkb25seSBJbnRlcm5hbENvbG9yU2VsZWN0SWQgPSBcImludGVybmFsQ29sb3JcIjtcclxuXHJcbiAgICBcclxuICAgIHByaXZhdGUgaW5pdFZpZXcoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fY2FyTW9kZWxCcmFuZENvbnRvbGxlciA9IG5ldyBDYXJNb2RlbEJyYW5kQ29udHJvbGxlcigpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgRmlsbENyaXRlcmlhKHVzZXJJbnB1dDogVXNlcklucHV0KTogdm9pZCB7XHJcbiAgICAgICAgLy9UT0RPIHZhbGlkYXRlIHVzZXIgaW5wdXQgdGhlbiBwcm9jZWVkXHJcbiAgICAgICAgdGhpcy5fY2FyTW9kZWxCcmFuZENvbnRvbGxlci5GaWxsQ3JpdGVyaWEodXNlcklucHV0KTtcclxuICAgICAgICB1c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnlbdGhpcy5NYWtlWWVhcktleV0gPSQoXCIjXCIgKyB0aGlzLk1ha2VZZWFySW5wdXRJZCkudmFsKCk7Ly9NYWtlWWVhclxyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLkZ1ZWxLZXldID0gJChcIiNcIiArIHRoaXMuRnVlbFNlbGVjdElkKS5maW5kKFwib3B0aW9uOnNlbGVjdGVkXCIpLnZhbCgpOy8vRnVlbFxyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLk1pbGVhZ2VLZXldID0gJChcIiNcIiArIHRoaXMuTWlsZWFnZUlucHV0SWQpLnZhbCgpOy8vTWlsZWFnZVxyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLkdlYXJib3hLZXldID0gJChcIiNcIiArIHRoaXMuR2VhcmJveFR5cGVQYXJlbnREaXZJZCkuY2hpbGRyZW4oXCI6Y2hlY2tlZFwiKS52YWwoKTtcclxuICAgICAgICB1c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnlbdGhpcy5Cb2R5Q29sb3JLZXldID0gJChcIiNcIiArIHRoaXMuQm9keUNvbG9yU2VsZWN0SWQpLmZpbmQoXCJvcHRpb246c2VsZWN0ZWRcIikudmFsKCk7XHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuSW50ZXJuYWxDb2xvcktleV0gPSAkKFwiI1wiICsgdGhpcy5JbnRlcm5hbENvbG9yU2VsZWN0SWQpLmZpbmQoXCJvcHRpb246c2VsZWN0ZWRcIikudmFsKCk7XHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuQm9keVN0YXR1c0tleV0gPSAkKFwiI1wiICsgdGhpcy5Cb2R5U3RhdHVzU2VsZWN0SWQpLmZpbmQoXCJvcHRpb246c2VsZWN0ZWRcIikudmFsKCk7XHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuQ2FyU3RhdHVzS2V5XSA9ICQoXCIjXCIgKyB0aGlzLkNhclN0YXR1c1BhcmVudERpdklkKS5jaGlsZHJlbihcIjpjaGVja2VkXCIpLnZhbCgpO1xyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLlBsYXRlVHlwZUtleV0gPSAkKFwiI1wiICsgdGhpcy5QbGF0ZVR5cGVQYXJlbnREaXZJZCkuY2hpbGRyZW4oXCI6Y2hlY2tlZFwiKS52YWwoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgQmluZEV2ZW50cyhjcml0ZXJpYUNoYW5nZTogSUNyaXRlcmlhQ2hhbmdlKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5pbml0VmlldygpO1xyXG4gICAgICAgIHRoaXMuX2Nhck1vZGVsQnJhbmRDb250b2xsZXIuQmluZEV2ZW50cyhjcml0ZXJpYUNoYW5nZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIFVuQmluZEV2ZW50cygpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9jYXJNb2RlbEJyYW5kQ29udG9sbGVyLlVuQmluZEV2ZW50cygpO1xyXG4gICAgfVxyXG59Iiwi77u/aW1wb3J0IHsgSUNyaXRlcmlhLENyaXRlcmlhVmFsaWRhdG9yIH0gZnJvbSBcIi4uLy4uLy4uLy4uL0hlbHBlci9JQ3JpdGVyaWFcIjtcclxuaW1wb3J0IHsgVXNlcklucHV0IH0gZnJvbSBcIi4uLy4uLy4uLy4uL0hlbHBlci9Vc2VySW5wdXRcIjtcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgRGVmYXVsdE5ld0FkQ3JpdGVyaWEgaW1wbGVtZW50cyBJQ3JpdGVyaWEge1xyXG4gICAgRmlsbENyaXRlcmlhKHNlYXJjaEFkVXNlcklucHV0OiBVc2VySW5wdXQpOiB2b2lkIHtcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBCaW5kRXZlbnRzKGNyaXRlcmlhQ2hhbmdlOiBPYmplY3QpOiB2b2lkIHtcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBVbkJpbmRFdmVudHMoKTogdm9pZCB7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgVmFsaWRhdGVDcml0ZXJpYSgpOiBDcml0ZXJpYVZhbGlkYXRvciB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm90IGltcGxlbWVudGVkXCIpO1xyXG4gICAgfVxyXG59Iiwi77u/aW1wb3J0IHtOZXdBZENyaXRlcmlhfSBmcm9tIFwiLi9OZXdBZENyaXRlcmlhXCI7XHJcbmltcG9ydCB7SUNyaXRlcmlhQ2hhbmdlfSBmcm9tIFwiLi4vLi4vLi4vSGVscGVyL0lDcml0ZXJpYUNoYW5nZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIE5ld0FkUGFydGlhbFZpZXdMb2FkZXIge1xyXG4gICAgcHJpdmF0ZSBfcGFydGlhbFZpZXdEaXZJZDogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBfdXJsOiBzdHJpbmcgPSBcIi9OZXdBZC9HZXROZXdBZFBhcnRpYWxWaWV3XCI7XHJcbiAgICBwcml2YXRlIF9wcmV2aW91c0NhdGVnb3J5SWQ6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIF9jdXJyZW50Q2F0ZWdvcnlJZDogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgX25ld0FkQ3JpdGVyaWFDaGFuZ2U6IElDcml0ZXJpYUNoYW5nZTtcclxuICAgIHByaXZhdGUgX25ld0FkQ3JpdGVyaWE6IE5ld0FkQ3JpdGVyaWE7XHJcblxyXG4gICAgY29uc3RydWN0b3IocGFydGlhbFZpZXdEaXZJZDogc3RyaW5nLCBuZXdBZENyaXRlcmlhQ2hhbmdlOiBJQ3JpdGVyaWFDaGFuZ2UsIG5ld0FkQ3JpdGVyaWE6TmV3QWRDcml0ZXJpYSkge1xyXG4gICAgICAgIHRoaXMuX3BhcnRpYWxWaWV3RGl2SWQgPSBwYXJ0aWFsVmlld0RpdklkO1xyXG4gICAgICAgIHRoaXMuX25ld0FkQ3JpdGVyaWFDaGFuZ2UgPSBuZXdBZENyaXRlcmlhQ2hhbmdlO1xyXG4gICAgICAgIHRoaXMuX25ld0FkQ3JpdGVyaWEgPSBuZXdBZENyaXRlcmlhO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBHZXRQYXJ0aWFsVmlld0Zyb21TZXJ2ZXIoY2F0ZWdvcnlJZDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fY3VycmVudENhdGVnb3J5SWQgPSBjYXRlZ29yeUlkO1xyXG4gICAgICAgIGxldCBjYWxsUGFyYW1zID0gbmV3IFBhcnRpYWxWaWV3U2VydmVyQ2FsbFBhcmFtZXRlcnMoKTtcclxuICAgICAgICBjYWxsUGFyYW1zLkNhdGVnb3J5SWQgPSBjYXRlZ29yeUlkO1xyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6IFwiR0VUXCIsIC8vR0VUIG9yIFBPU1Qgb3IgUFVUIG9yIERFTEVURSB2ZXJiXHJcbiAgICAgICAgICAgIHVybDogdGhpcy5fdXJsLFxyXG4gICAgICAgICAgICBkYXRhOiBjYWxsUGFyYW1zLCAvL0RhdGEgc2VudCB0byBzZXJ2ZXJcclxuICAgICAgICAgICAgLy9jb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLCAvLyBjb250ZW50IHR5cGUgc2VudCB0byBzZXJ2ZXJcclxuICAgICAgICAgICAgc3VjY2VzczogKG1zZywgdGV4dFN0YXR1cywganFYSFIpID0+IHRoaXMub25TdWNjZXNzR2V0SXRlbXNGcm9tU2VydmVyKG1zZywgdGV4dFN0YXR1cywganFYSFIpLC8vT24gU3VjY2Vzc2Z1bGwgc2VydmljZSBjYWxsXHJcbiAgICAgICAgICAgIGVycm9yOiAoanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKSA9PiB0aGlzLm9uRXJyb3JHZXRJdGVtc0Zyb21TZXJ2ZXIoanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKS8vIFdoZW4gU2VydmljZSBjYWxsIGZhaWxzXHJcbiAgICAgICAgfSk7Ly8uYWpheFxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25TdWNjZXNzR2V0SXRlbXNGcm9tU2VydmVyKG1zZzogYW55LCB0ZXh0U3RhdHVzOiBzdHJpbmcsIGpxWEhSOiBKUXVlcnlYSFIpIHtcclxuICAgICAgICB0aGlzLl9uZXdBZENyaXRlcmlhLlVuQmluZCh0aGlzLl9wcmV2aW91c0NhdGVnb3J5SWQpO1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9wYXJ0aWFsVmlld0RpdklkKS5jaGlsZHJlbigpLnJlbW92ZSgpO1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9wYXJ0aWFsVmlld0RpdklkKS5odG1sKG1zZyk7XHJcbiAgICAgICAgdGhpcy5fbmV3QWRDcml0ZXJpYS5CaW5kKHRoaXMuX2N1cnJlbnRDYXRlZ29yeUlkLCB0aGlzLl9uZXdBZENyaXRlcmlhQ2hhbmdlKTtcclxuICAgICAgICB0aGlzLl9wcmV2aW91c0NhdGVnb3J5SWQgPSB0aGlzLl9jdXJyZW50Q2F0ZWdvcnlJZDtcclxuICAgIH0vL29uU3VjY2Vzc0dldFRpbWVGcm9tU2VydmVyXHJcblxyXG4gICAgcHJpdmF0ZSBvbkVycm9yR2V0SXRlbXNGcm9tU2VydmVyKGpxWEhSOiBKUXVlcnlYSFIsIHRleHRTdGF0dXM6IHN0cmluZywgZXJyb3JUaHJvd246IHN0cmluZykge1xyXG4gICAgICAgIGFsZXJ0KGVycm9yVGhyb3duKTtcclxuICAgIH0vL29uRXJyb3JHZXRUaW1lRnJvbVNlcnZlclxyXG59XHJcblxyXG4vL1RPRE8gcmVmYWN0b3IgdGhpc1xyXG5leHBvcnQgY2xhc3MgUGFydGlhbFZpZXdTZXJ2ZXJDYWxsUGFyYW1ldGVycyB7XHJcbiAgICBwdWJsaWMgQ2F0ZWdvcnlJZDpudW1iZXI7XHJcbn0iLCLvu79pbXBvcnQge1VzZXJJbnB1dH0gIGZyb20gXCIuLi8uLi8uLi9IZWxwZXIvVXNlcklucHV0XCI7XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIE5ld0FkU2VydmVyQ2FsbGVyIHtcclxuXHJcbiAgICAvL1RPRE8gY2FsbCBzZXJ2ZXIgYW5kIHNlbmQgdXNlcmlucHV0IGZybyBuZXcgYWRcclxuICAgIC8vZ2V0IHJlc3VsdCBhbmQgc2hvdyB0byB1c2VyXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF91cmw6IHN0cmluZyA9IFwiL2FwaS9BZEFwaS9BZGRBZHZlcnRpc2VtZW50XCI7XHJcblxyXG4gICAgcHVibGljIFNhdmVBZCh1c2VySW5wdXQ6IFVzZXJJbnB1dCk6IHZvaWQge1xyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6IFwiUE9TVFwiLCAvL0dFVCBvciBQT1NUIG9yIFBVVCBvciBERUxFVEUgdmVyYlxyXG4gICAgICAgICAgICB1cmw6IHRoaXMuX3VybCxcclxuICAgICAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkodXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5KSwgLy9EYXRhIHNlbnQgdG8gc2VydmVyXHJcbiAgICAgICAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbicsIC8vIGNvbnRlbnQgdHlwZSBzZW50IHRvIHNlcnZlclxyXG4gICAgICAgICAgICBzdWNjZXNzOiAobXNnLCB0ZXh0U3RhdHVzLCBqcVhIUikgPT4gdGhpcy5vblN1Y2Nlc3NHZXRJdGVtc0Zyb21TZXJ2ZXIobXNnLCB0ZXh0U3RhdHVzLCBqcVhIUiksIC8vT24gU3VjY2Vzc2Z1bGwgc2VydmljZSBjYWxsXHJcbiAgICAgICAgICAgIGVycm9yOiAoanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKSA9PiB0aGlzLm9uRXJyb3JHZXRJdGVtc0Zyb21TZXJ2ZXIoanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKSAvLyBXaGVuIFNlcnZpY2UgY2FsbCBmYWlsc1xyXG4gICAgICAgIH0pOyAvLy5hamF4XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvblN1Y2Nlc3NHZXRJdGVtc0Zyb21TZXJ2ZXIobXNnOiBhbnksIHRleHRTdGF0dXM6IHN0cmluZywganFYSFI6IEpRdWVyeVhIUikge1xyXG4gICAgICAgIC8vVE9ETyByZWRpcmVjdCB1c2VyIHRvIGEgbmV3IHBhZ2VcclxuICAgICAgICBpZiAobXNnLlN1Y2Nlc3MgPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5sb2NhdGlvbi5yZXBsYWNlKFwiL05ld0FkL0NvbmZpcm1cIik7XHJcbiAgICAgICAgfVxyXG4gICAgfSBcclxuXHJcblxyXG4gICAgcHJpdmF0ZSBvbkVycm9yR2V0SXRlbXNGcm9tU2VydmVyKGpxWEhSOiBKUXVlcnlYSFIsIHRleHRTdGF0dXM6IHN0cmluZywgZXJyb3JUaHJvd246IHN0cmluZykge1xyXG4gICAgICAgIC8vVE9ETyBpbmZvcm0gZXJyb3IgdG8gdXNlclxyXG4gICAgfSBcclxufVxyXG4iLCLvu79pbXBvcnQgeyBDYXRlZ29yeSB9IGZyb20gXCIuLi8uLi8uLi9Nb2RlbHMvQ2F0ZWdvcnlcIjtcclxuaW1wb3J0IHsgQ2F0ZWdvcnlTZWxlY3Rpb24gfSBmcm9tIFwiLi4vLi4vLi4vQ29tcG9uZW50cy9DYXRlZ29yeS9DYXRlZ29yeVNlbGVjdGlvblwiO1xyXG5pbXBvcnQgeyBOZXdBZFBhcnRpYWxWaWV3TG9hZGVyIH0gZnJvbSBcIi4vTmV3QWRQYXJ0aWFsVmlld0xvYWRlclwiO1xyXG5pbXBvcnQgeyBJQ3JpdGVyaWFDaGFuZ2UgfSBmcm9tIFwiLi4vLi4vLi4vSGVscGVyL0lDcml0ZXJpYUNoYW5nZVwiO1xyXG5pbXBvcnQgeyBOZXdBZENyaXRlcmlhIH0gZnJvbSBcIi4vTmV3QWRDcml0ZXJpYVwiO1xyXG5pbXBvcnQgeyBJbWFnZVVwbG9hZGVyIH0gZnJvbSBcIi4vSW1hZ2VVcGxvYWRlclwiO1xyXG5pbXBvcnQgeyBVc2VySW5wdXQgfSBmcm9tIFwiLi4vLi4vLi4vSGVscGVyL1VzZXJJbnB1dFwiO1xyXG5pbXBvcnQgeyBOZXdBZFNlcnZlckNhbGxlciB9IGZyb20gXCIuL05ld0FkU2VydmVyQ2FsbGVyXCI7XHJcblxyXG5cclxuY2xhc3MgTmV3QWQgaW1wbGVtZW50cyBJQ3JpdGVyaWFDaGFuZ2Uge1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBBZFRpdGxlS2V5ID0gXCJBZFRpdGxlXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IEFkVGl0bGVJbnB1dElkOiBzdHJpbmcgPSBcImFkVGl0bGVcIjtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IEFkQ29tbWVudEtleSA9IFwiQWRDb21tZW50XCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IEFkQ29tbWVudElucHV0SWQgPSBcImFkQ29tbWVudFwiO1xyXG5cclxuICAgIHByaXZhdGUgX2FsbENhdGVnb3JpZXNJbnB1dElkOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIF9hbGxDYXRlZ29yaWVzRGl2SWQ6IHN0cmluZztcclxuICAgIHByaXZhdGUgX2NhdGVnb3J5U3BlY2lmaWNQYXJ0aWFsVmlld0lkOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9zdWJtaXRBZElucHV0SWQ6IHN0cmluZyA9IFwic3VibWl0TmV3QWRcIjtcclxuXHJcblxyXG4gICAgcHJpdmF0ZSBfY3VycmVudE5ld0FkR3VpZDogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBDdXJyZW50TmV3QWRHdWlkSW5wdXRJZDogc3RyaW5nID0gXCJjdXJyZW50TmV3QWRHdWlkXCI7XHJcblxyXG4gICAgcHJpdmF0ZSBfY2F0ZWdvcnlTZWxlY3Rpb246IENhdGVnb3J5U2VsZWN0aW9uO1xyXG4gICAgcHJpdmF0ZSBfcGFydGlhbFZpZXdMb2FkZXI6IE5ld0FkUGFydGlhbFZpZXdMb2FkZXI7XHJcbiAgICBwcml2YXRlIF9uZXdBZENyaXRlcmlhOiBOZXdBZENyaXRlcmlhO1xyXG4gICAgcHJpdmF0ZSBfaW1hZ2VVcGxvYWRlcjogSW1hZ2VVcGxvYWRlcjtcclxuICAgIHByaXZhdGUgX25ld0FkU2VydmVyQ2FsbGVyOiBOZXdBZFNlcnZlckNhbGxlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihhbGxDYXRlZ29yaWVzRGl2OiBzdHJpbmcsIGFsbENhdGVnb3JpZXNJbnB1dElkOiBzdHJpbmcsIGNhdGVnb3J5U3BlY2lmaWNQYXJ0aWFsVmlld0lkOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLl9hbGxDYXRlZ29yaWVzRGl2SWQgPSBhbGxDYXRlZ29yaWVzRGl2O1xyXG4gICAgICAgIHRoaXMuX2FsbENhdGVnb3JpZXNJbnB1dElkID0gYWxsQ2F0ZWdvcmllc0lucHV0SWQ7XHJcbiAgICAgICAgdGhpcy5fY2F0ZWdvcnlTcGVjaWZpY1BhcnRpYWxWaWV3SWQgPSBjYXRlZ29yeVNwZWNpZmljUGFydGlhbFZpZXdJZDtcclxuICAgICAgICB0aGlzLl9uZXdBZENyaXRlcmlhID0gbmV3IE5ld0FkQ3JpdGVyaWEoKTtcclxuICAgICAgICB0aGlzLmluaXRQYWdlKCk7XHJcbiAgICAgICAgdGhpcy5faW1hZ2VVcGxvYWRlciA9IG5ldyBJbWFnZVVwbG9hZGVyKHRoaXMuX2N1cnJlbnROZXdBZEd1aWQpO1xyXG4gICAgICAgIHRoaXMuX25ld0FkU2VydmVyQ2FsbGVyID0gbmV3IE5ld0FkU2VydmVyQ2FsbGVyKCk7XHJcbiAgICAgICAgdGhpcy5pbml0RXZlbnRIYW5kbGVycygpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBDdXN0b21Dcml0ZXJpYUNoYW5nZWQoKTogdm9pZCB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaW5pdFBhZ2UoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5pbml0TmV3QWRDYXRlZ29yeSgpO1xyXG4gICAgICAgIHRoaXMuX3BhcnRpYWxWaWV3TG9hZGVyID0gbmV3IE5ld0FkUGFydGlhbFZpZXdMb2FkZXIodGhpcy5fY2F0ZWdvcnlTcGVjaWZpY1BhcnRpYWxWaWV3SWQsIHRoaXMsIHRoaXMuX25ld0FkQ3JpdGVyaWEpO1xyXG4gICAgICAgIHRoaXMuX2N1cnJlbnROZXdBZEd1aWQgPSAkKFwiI1wiICsgdGhpcy5DdXJyZW50TmV3QWRHdWlkSW5wdXRJZCkudmFsKCkudG9TdHJpbmcoKTtcclxuXHJcblxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaW5pdE5ld0FkQ2F0ZWdvcnkoKTogdm9pZCB7XHJcbiAgICAgICAgbGV0IGFsbENhdGVnb3JpZXNTdHJpbmcgPSAkKFwiI1wiICsgdGhpcy5fYWxsQ2F0ZWdvcmllc0lucHV0SWQpLnZhbCgpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgbGV0IGFsbENhdGVnb3JpZXMgPSAkLnBhcnNlSlNPTihhbGxDYXRlZ29yaWVzU3RyaW5nKSBhcyBDYXRlZ29yeVtdO1xyXG4gICAgICAgIHRoaXMuX2NhdGVnb3J5U2VsZWN0aW9uID0gbmV3IENhdGVnb3J5U2VsZWN0aW9uKHRoaXMuX2FsbENhdGVnb3JpZXNEaXZJZCwgYWxsQ2F0ZWdvcmllcyk7XHJcbiAgICAgICAgdGhpcy5fY2F0ZWdvcnlTZWxlY3Rpb24uQ3JlYXRlRmlyc3RMZXZlbCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaW5pdEV2ZW50SGFuZGxlcnMoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fY2F0ZWdvcnlTZWxlY3Rpb24uU2VsZWN0ZWRDYXRlZ29yeUNoYW5nZWRFdmVudC5TdWJzY3JpYmUoKHNlbmRlciwgYXJncykgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIWFyZ3MuU2VsZWN0ZWRDYXRlZ29yeUhhc0NoaWxkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9wYXJ0aWFsVmlld0xvYWRlci5HZXRQYXJ0aWFsVmlld0Zyb21TZXJ2ZXIoYXJncy5TZWxlY3RlZENhdGVnb3J5SWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX3N1Ym1pdEFkSW5wdXRJZCkub24oXCJjbGlja1wiLCAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdGhpcy5zdWJtaXRBZCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3VibWl0QWQoKSB7XHJcbiAgICAgICAgLy9UT0RPIGRpc2FibGUgc3VibWl0QWQgQnV0dG9uIHVudGlsIGN1cnJlbnQgc3VibWlzc2lvbiBpcyBvayBvciBlcnJvcm5vdXMgXHJcblxyXG4gICAgICAgIGxldCB1c2VySW5wdXQgPSBuZXcgVXNlcklucHV0KCk7XHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W1wiTmV3QWRHdWlkXCJdID0gdGhpcy5fY3VycmVudE5ld0FkR3VpZDtcclxuICAgICAgICB0aGlzLl9jYXRlZ29yeVNlbGVjdGlvbi5JbnNlcnRDYXRlZ29yeUlkSW5Vc2VySW5wdXREaWN0aW9uYXJ5KHVzZXJJbnB1dCk7XHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuQWRUaXRsZUtleV0gPSAkKFwiI1wiICsgdGhpcy5BZFRpdGxlSW5wdXRJZCkudmFsKCk7XHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuQWRDb21tZW50S2V5XSA9ICQoXCIjXCIgKyB0aGlzLkFkQ29tbWVudElucHV0SWQpLnZhbCgpO1xyXG4gICAgICAgIHRoaXMuX25ld0FkQ3JpdGVyaWEuRmlsbENhdGVnb3J5U3BlY2lmaWNOZXdBZENyaXRlcmlhKHRoaXMuX2NhdGVnb3J5U2VsZWN0aW9uLkdldFNlbGVjdGVkQ2F0ZWdvcnlJZCgpLCB1c2VySW5wdXQpO1xyXG4gICAgICAgIHRoaXMuX25ld0FkU2VydmVyQ2FsbGVyLlNhdmVBZCh1c2VySW5wdXQpO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcbmxldCBhbGxDYXRlZ29yaWVzRGl2SWQ6IHN0cmluZyA9IFwiY2F0ZWdvcnlTZWxlY3RvclwiO1xyXG5sZXQgYWxsQ2F0ZWdvcmllc0lucHV0SWQ6IHN0cmluZyA9IFwiYWxsQ2F0ZWdvcmllc1wiO1xyXG5sZXQgY2F0ZWdvcnlTcGVjaWZpY1BhcnRpYWxWaWV3SWQ6IHN0cmluZyA9IFwiQ2F0ZWdvcnlTcGVjaWZpY0NyaXRlcmlhXCI7XHJcbiQoZG9jdW1lbnQpLnJlYWR5KCgpID0+IHtcclxuICAgIGxldCBuZXdBZCA9IG5ldyBOZXdBZChhbGxDYXRlZ29yaWVzRGl2SWQsIGFsbENhdGVnb3JpZXNJbnB1dElkLCBjYXRlZ29yeVNwZWNpZmljUGFydGlhbFZpZXdJZCk7XHJcbn0pOy8vcmVhZHkiXX0=
