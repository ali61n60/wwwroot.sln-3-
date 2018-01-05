(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventDispatcher_1 = require("../../../Events/EventDispatcher");
var CategorySelectionNewAd = /** @class */ (function () {
    function CategorySelectionNewAd(parentDivId, allCategories) {
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
    CategorySelectionNewAd.prototype.addOptionElementToSelectElement = function (selectElementId, category) {
        $("#" + selectElementId).append($("<option>", {
            value: category.categoryId,
            text: category.categoryName
        }));
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
        this.unBindCarModel();
    };
    CarModelBrandController.prototype.unBindCarModel = function () {
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
var ImageUploader = /** @class */ (function () {
    function ImageUploader() {
        this._imageUploadInputId = "imageUpload";
        this._messageToUserDivId = "labelMessageToUser";
        this._loadedImagesDivId = "loadedImageView";
        this._sendingImageTemplateId = "sendingImageTemplate";
        this._addedImageTemplateId = "addedImage";
        this._sendFilesToServerUrl = "/api/AdApi/AddTempImage";
        this._removeFileFromServerUrl = "/api/AdApi/RemoveTempImage";
        this.initView();
    }
    ImageUploader.prototype.initView = function () {
        var _this = this;
        $(document).ready(function () {
            $("#" + _this._imageUploadInputId).change(function (event) {
                var fileUpload = $("#" + _this._imageUploadInputId).get(0);
                var files = fileUpload.files;
                _this.sendFilesToServer(files);
            }); //change
            $(document).on("click", ".addedImage > input", function (event) {
                //todo call server to remove temp file and also remove it from page
                //create a method to use ajax and call
                // server to remove the image from the server 
                //also remove the image from current page
                _this.removeImageFromServer($(event.currentTarget).parent().attr("id").toString());
                //alert($(event.currentTarget).parent().attr("id"));
            }); //click
        }); //ready
    };
    ImageUploader.prototype.sendFilesToServer = function (fileList) {
        var _this = this;
        var data = new FormData();
        for (var i = 0; i < fileList.length; i++) {
            data.append(fileList[i].name, fileList[i]);
        } //for
        $.ajax({
            type: "POST",
            url: this._sendFilesToServerUrl,
            contentType: false,
            processData: false,
            data: data,
            success: function (msg, textStatus, jqXHR) {
                return _this.onSuccessGetItemsFromServer(msg, textStatus, jqXHR);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                return _this.onErrorGetItemsFromServer(jqXHR, textStatus, errorThrown);
            } // When Service call fails
        }); //ajax
        this.showSendingImage();
    };
    ImageUploader.prototype.onSuccessGetItemsFromServer = function (msg, textStatus, jqXHR) {
        this.showMessageToUser("");
        $("#" + this._imageUploadInputId).val("");
        if (msg.success == true) {
            this.addNewImageToPage(msg.responseData);
        } //if
        else {
            this.showMessageToUser(msg.messag + " ," + msg.errorCode);
        } //else
    }; //onSuccessGetItemsFromServer
    ImageUploader.prototype.onErrorGetItemsFromServer = function (jqXHR, textStatus, errorThrown) {
        this.showMessageToUser("خطا در ارسال");
    }; //end OnErrorGetTimeFromServer
    ImageUploader.prototype.showSendingImage = function () {
        var $sendingImageTemplate = $("#" + this._sendingImageTemplateId).clone();
        this.showMessageToUser($sendingImageTemplate.html());
    };
    ImageUploader.prototype.addNewImageToPage = function (data) {
        var template = $("#" + this._addedImageTemplateId).html();
        var uploadedImage = new UploadedImage();
        uploadedImage.ImageFileName = data.imageFileName;
        uploadedImage.Image = "data:image/jpg;base64," + data.image;
        var html = Mustache.to_html(template, uploadedImage);
        $("#" + this._loadedImagesDivId).append(html);
    };
    ImageUploader.prototype.showMessageToUser = function (msg) {
        $("#" + this._messageToUserDivId).html(msg);
    };
    //TODO refactor this method 
    ImageUploader.prototype.removeImageFromServer = function (fileName) {
        var _this = this;
        var callParams = {
            FileNameToBeRemoved: fileName
        };
        $.ajax({
            type: "GET",
            url: this._removeFileFromServerUrl,
            data: callParams,
            success: function (msg, textStatus, jqXHR) {
                return _this.onSuccessRemoveFileFromServer(msg, textStatus, jqXHR);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                return _this.onErrorRemoveFileFromServer(jqXHR, textStatus, errorThrown);
            } // When Service call fails
        }); //.ajax
        this.showMessageToUser("removing file from server");
    };
    ImageUploader.prototype.onSuccessRemoveFileFromServer = function (msg, textStatus, jqXHR) {
        this.showMessageToUser("done removing file from server");
    };
    ImageUploader.prototype.onErrorRemoveFileFromServer = function (jqXHR, textStatus, errorThrown) {
        this.showMessageToUser("error removing file from server, " + errorThrown);
    };
    return ImageUploader;
}());
exports.ImageUploader = ImageUploader;
var UploadedImage = /** @class */ (function () {
    function UploadedImage() {
    }
    return UploadedImage;
}());
},{}],6:[function(require,module,exports){
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
},{"../../../Helper/CriteriaNumericDictionary":4,"./NewAdCriteria/AdTransformationNewAdCriteria":7,"./NewAdCriteria/DefaultNewAdCriteria":8}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CarModelBrandController_1 = require("../../../../Components/Transformation/CarModelBrandController");
var AdTransformationNewAdCriteria = /** @class */ (function () {
    function AdTransformationNewAdCriteria() {
    }
    AdTransformationNewAdCriteria.prototype.initView = function () {
        this._carModelBrandContoller = new CarModelBrandController_1.CarModelBrandController();
    };
    AdTransformationNewAdCriteria.prototype.FillCriteria = function (userInput) {
        this._carModelBrandContoller.FillCriteria(userInput);
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
},{"../../../../Components/Transformation/CarModelBrandController":2}],8:[function(require,module,exports){
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
    return DefaultNewAdCriteria;
}());
exports.DefaultNewAdCriteria = DefaultNewAdCriteria;
},{}],9:[function(require,module,exports){
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
},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CategorySelectionNewAd_1 = require("../../../Components/Category/NewAd/CategorySelectionNewAd");
var NewAdPartialViewLoader_1 = require("./NewAdPartialViewLoader");
var NewAdCriteria_1 = require("./NewAdCriteria");
var ImageUploader_1 = require("./ImageUploader");
var NewAd = /** @class */ (function () {
    function NewAd(allCategoriesDiv, allCategoriesInputId, categorySpecificPartialViewId) {
        this._allCategoriesDivId = allCategoriesDiv;
        this._allCategoriesInputId = allCategoriesInputId;
        this._categorySpecificPartialViewId = categorySpecificPartialViewId;
        this._newAdCriteria = new NewAdCriteria_1.NewAdCriteria();
        this._imageUploader = new ImageUploader_1.ImageUploader();
        this.initPage();
        this.initEventHandlers();
    }
    NewAd.prototype.CustomCriteriaChanged = function () {
    };
    NewAd.prototype.initPage = function () {
        this.initNewAdCategory();
        this._partialViewLoader = new NewAdPartialViewLoader_1.NewAdPartialViewLoader(this._categorySpecificPartialViewId, this, this._newAdCriteria);
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
    };
    return NewAd;
}());
$(document).ready(function () {
    $("#submitNewAd").on("click", function (event) {
        var $apiAddress = "getApiAddress()";
        alert($apiAddress);
    });
}); //ready
var allCategoriesDivId = "allCategoriesDiv";
var allCategoriesInputId = "allCategoriesInput";
var categorySpecificPartialViewId = "CategorySpecificCriteria";
$(document).ready(function () {
    var newAd = new NewAd(allCategoriesDivId, allCategoriesInputId, categorySpecificPartialViewId);
}); //ready
},{"../../../Components/Category/NewAd/CategorySelectionNewAd":1,"./ImageUploader":5,"./NewAdCriteria":6,"./NewAdPartialViewLoader":9}]},{},[10])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3d3dyb290L2pzL0NvbXBvbmVudHMvQ2F0ZWdvcnkvTmV3QWQvQ2F0ZWdvcnlTZWxlY3Rpb25OZXdBZC50cyIsInd3d3Jvb3QvanMvQ29tcG9uZW50cy9UcmFuc2Zvcm1hdGlvbi9DYXJNb2RlbEJyYW5kQ29udHJvbGxlci50cyIsInd3d3Jvb3QvanMvRXZlbnRzL0V2ZW50RGlzcGF0Y2hlci50cyIsInd3d3Jvb3QvanMvSGVscGVyL0NyaXRlcmlhTnVtZXJpY0RpY3Rpb25hcnkudHMiLCJ3d3dyb290L2pzL2hvbWUvbmV3QWQvc3JjL0ltYWdlVXBsb2FkZXIudHMiLCJ3d3dyb290L2pzL2hvbWUvbmV3QWQvc3JjL05ld0FkQ3JpdGVyaWEudHMiLCJ3d3dyb290L2pzL2hvbWUvbmV3QWQvc3JjL05ld0FkQ3JpdGVyaWEvQWRUcmFuc2Zvcm1hdGlvbk5ld0FkQ3JpdGVyaWEudHMiLCJ3d3dyb290L2pzL2hvbWUvbmV3QWQvc3JjL05ld0FkQ3JpdGVyaWEvRGVmYXVsdE5ld0FkQ3JpdGVyaWEudHMiLCJ3d3dyb290L2pzL2hvbWUvbmV3QWQvc3JjL05ld0FkUGFydGlhbFZpZXdMb2FkZXIudHMiLCJ3d3dyb290L2pzL2hvbWUvbmV3QWQvc3JjL25ld0FkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQyxtRUFBa0U7QUFHbkU7SUEyQkksZ0NBQVksV0FBbUIsRUFBRSxhQUF5QjtRQXJCekMsd0JBQW1CLEdBQUcsbUJBQW1CLENBQUM7UUFDMUMsbUJBQWMsR0FBRyxXQUFXLENBQUM7UUFDN0Isc0JBQWlCLEdBQVcsU0FBUyxDQUFDO1FBRXRDLHlCQUFvQixHQUFHLG1CQUFtQixDQUFDO1FBQzNDLG9CQUFlLEdBQUcsV0FBVyxDQUFDO1FBQzlCLHVCQUFrQixHQUFXLFNBQVMsQ0FBQztRQUV2Qyx3QkFBbUIsR0FBRyxtQkFBbUIsQ0FBQztRQUMxQyxtQkFBYyxHQUFH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QUNQLENBQUM7SUFDTCxZQUFDO0FBQUQsQ0E1Q0EsQUE0Q0MsSUFBQTtBQUVELENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLENBQUM7SUFHZCxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxVQUFVLEtBQUs7UUFDekMsSUFBSSxXQUFXLEdBQUcsaUJBQWlCLENBQUM7UUFDcEMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3ZCLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDLENBQUMsQ0FBQSxPQUFPO0FBR1YsSUFBSSxrQkFBa0IsR0FBVyxrQkFBa0IsQ0FBQztBQUNwRCxJQUFJLG9CQUFvQixHQUFXLG9CQUFvQixDQUFDO0FBQ3hELElBQUksNkJBQTZCLEdBQVcsMEJBQTBCLENBQUM7QUFDdkUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQztJQUNkLElBQUksS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLGtCQUFrQixFQUFFLG9CQUFvQixFQUFDLDZCQUE2QixDQUFDLENBQUM7QUFDbEcsQ0FBQyxDQUFDLENBQUMsQ0FBQSxPQUFPIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIu+7v2ltcG9ydCB7IEV2ZW50RGlzcGF0Y2hlciB9IGZyb20gXCIuLi8uLi8uLi9FdmVudHMvRXZlbnREaXNwYXRjaGVyXCI7XHJcbmltcG9ydCB7IENhdGVnb3J5IH0gZnJvbSBcIi4uLy4uLy4uL01vZGVscy9DYXRlZ29yeVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIENhdGVnb3J5U2VsZWN0aW9uTmV3QWQge1xyXG4gICAgXHJcblxyXG4gICAgcHJpdmF0ZSBfcGFyZW50RGl2SWQ6IHN0cmluZzsvL2RpdiBlbGVtZW50IHRoYXQgaG9sZHMgYWxsIENhdGVnb3J5U2VsZWN0aW9uIGVsZW1lbnRzXHJcbiAgICBwcml2YXRlIF9hbGxDYXRlZ29yaWVzOiBDYXRlZ29yeVtdO1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2ZpcnN0TGV2ZWxUZW1wbGF0ZSA9IFwiY2F0ZWdvcnkxVGVtcGxhdGVcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2ZpcnN0TGV2ZWxEaXYgPSBcImNhdGVnb3J5MVwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfZmlyc3RMZXZlbFNlbGVjdDogc3RyaW5nID0gXCJzZWxlY3QxXCI7XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfc2Vjb25kTGV2ZWxUZW1wbGF0ZSA9IFwiY2F0ZWdvcnkyVGVtcGxhdGVcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX3NlY29uZExldmVsRGl2ID0gXCJjYXRlZ29yeTJcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX3NlY29uZExldmVsU2VsZWN0OiBzdHJpbmcgPSBcInNlbGVjdDJcIjtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF90aGlyZExldmVsVGVtcGxhdGUgPSBcImNhdGVnb3J5M1RlbXBsYXRlXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF90aGlyZExldmVsRGl2ID0gXCJjYXRlZ29yeTNcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX3RoaXJkTGV2ZWxTZWxlY3Q6IHN0cmluZyA9IFwic2VsZWN0M1wiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfcm9vdENhdGVnb3J5SWQ6IG51bWJlciA9IDA7XHJcblxyXG4gICAgcHJpdmF0ZSBfc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxPbmU6IG51bWJlcjtcclxuICAgIHByaXZhdGUgX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVHdvOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIF9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFRocmVlOiBudW1iZXI7XHJcblxyXG4gICAgcHVibGljIFNlbGVjdGVkQ2F0ZWdvcnlDaGFuZ2VkRXZlbnQ6IEV2ZW50RGlzcGF0Y2hlcjxDYXRlZ29yeVNlbGVjdGlvbk5ld0FkLCBudW1iZXI+ID1cclxuICAgICAgICBuZXcgRXZlbnREaXNwYXRjaGVyPENhdGVnb3J5U2VsZWN0aW9uTmV3QWQsIG51bWJlcj4oKTtcclxuXHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKHBhcmVudERpdklkOiBzdHJpbmcsIGFsbENhdGVnb3JpZXM6IENhdGVnb3J5W10pIHtcclxuICAgICAgICB0aGlzLl9wYXJlbnREaXZJZCA9IHBhcmVudERpdklkO1xyXG4gICAgICAgIHRoaXMuX2FsbENhdGVnb3JpZXMgPSBhbGxDYXRlZ29yaWVzO1xyXG4gICAgfVxyXG4gICAgcHVibGljIEdldFNlbGVjdGVkQ2F0ZWdvcnlJZCgpOiBudW1iZXIge1xyXG4gICAgICAgIGlmICh0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFRocmVlICE9PSB1bmRlZmluZWQgJiZcclxuICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUaHJlZSAhPT0gdGhpcy5fcm9vdENhdGVnb3J5SWQpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFRocmVlO1xyXG4gICAgICAgIGVsc2UgaWYgKHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVHdvICE9PSB1bmRlZmluZWQgJiZcclxuICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUd28gIT09IHRoaXMuX3Jvb3RDYXRlZ29yeUlkKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUd287XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxPbmU7XHJcbiAgICB9Ly9HZXRTZWxlY3RlZENhdGVnb3J5SWRcclxuXHJcbiAgICBwdWJsaWMgU2VsZWN0ZWRDYXRlZ29yeUhhc0NoaWxkcmVuKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGxldCBzZWxlY3RlZENhdGVnb3J5SWQgPSB0aGlzLkdldFNlbGVjdGVkQ2F0ZWdvcnlJZCgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9hbGxDYXRlZ29yaWVzLmZpbHRlclxyXG4gICAgICAgICAgICAoKGNhdGVnb3J5KSA9PiB7IHJldHVybiBjYXRlZ29yeS5wYXJlbnRDYXRlZ29yeUlkID09PSBzZWxlY3RlZENhdGVnb3J5SWQgfSkubGVuZ3RoID4gMDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGFkZE9wdGlvbkVsZW1lbnRUb1NlbGVjdEVsZW1lbnQoc2VsZWN0RWxlbWVudElkOiBzdHJpbmcsIGNhdGVnb3J5OiBDYXRlZ29yeSk6IHZvaWQge1xyXG4gICAgICAgICQoXCIjXCIgKyBzZWxlY3RFbGVtZW50SWQpLmFwcGVuZCgkKFwiPG9wdGlvbj5cIiwge1xyXG4gICAgICAgICAgICB2YWx1ZTogY2F0ZWdvcnkuY2F0ZWdvcnlJZCxcclxuICAgICAgICAgICAgdGV4dDogY2F0ZWdvcnkuY2F0ZWdvcnlOYW1lXHJcbiAgICAgICAgfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBDcmVhdGVGaXJzdExldmVsKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMucmVtb3ZlRWxlbWVudCh0aGlzLl9maXJzdExldmVsRGl2KTtcclxuICAgICAgICB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbE9uZSA9IHRoaXMuX3Jvb3RDYXRlZ29yeUlkO1xyXG4gICAgICAgIHRoaXMucmVtb3ZlRWxlbWVudCh0aGlzLl9zZWNvbmRMZXZlbERpdik7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUd28gPSB0aGlzLl9yb290Q2F0ZWdvcnlJZDtcclxuICAgICAgICB0aGlzLnJlbW92ZUVsZW1lbnQodGhpcy5fdGhpcmRMZXZlbERpdik7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUaHJlZSA9IHRoaXMuX3Jvb3RDYXRlZ29yeUlkO1xyXG5cclxuICAgICAgICBsZXQgdGVtcGxhdGUgPSAkKFwiI1wiICsgdGhpcy5fZmlyc3RMZXZlbFRlbXBsYXRlKS5odG1sKCk7XHJcbiAgICAgICAgbGV0IGNhdGVnb3JpZXM6IENhdGVnb3J5W10gPSBuZXcgQXJyYXk8Q2F0ZWdvcnk+KCk7XHJcbiAgICAgICAgbGV0IGRhdGEgPSB7IGNhdGVnb3JpZXM6IGNhdGVnb3JpZXMgfVxyXG4gICAgICAgIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsT25lID0gdGhpcy5fcm9vdENhdGVnb3J5SWQ7XHJcbiAgICAgICAgdGhpcy5fYWxsQ2F0ZWdvcmllcy5mb3JFYWNoKGNhdGVnb3J5ID0+IHtcclxuICAgICAgICAgICAgaWYgKGNhdGVnb3J5LnBhcmVudENhdGVnb3J5SWQgPT09IHRoaXMuX3Jvb3RDYXRlZ29yeUlkKSB7XHJcbiAgICAgICAgICAgICAgICBjYXRlZ29yaWVzLnB1c2goY2F0ZWdvcnkpO1xyXG4gICAgICAgICAgICB9Ly9pZlxyXG4gICAgICAgIH0pOy8vZm9yRWFjaFxyXG5cclxuICAgICAgICBsZXQgaHRtbCA9IE11c3RhY2hlLnRvX2h0bWwodGVtcGxhdGUsIGRhdGEpO1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9wYXJlbnREaXZJZCkuYXBwZW5kKGh0bWwpO1xyXG5cclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fZmlyc3RMZXZlbFNlbGVjdCkuY2hhbmdlKChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgc2VsZWN0ZWRJZCA9IHBhcnNlSW50KCQoZXZlbnQuY3VycmVudFRhcmdldCkudmFsKCkudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsT25lID0gc2VsZWN0ZWRJZDtcclxuICAgICAgICAgICAgdGhpcy5jcmVhdGVTZWNvbmRMZXZlbChzZWxlY3RlZElkKTtcclxuICAgICAgICAgICAgdGhpcy5TZWxlY3RlZENhdGVnb3J5Q2hhbmdlZEV2ZW50LkRpc3BhdGNoKHRoaXMsIHRoaXMuR2V0U2VsZWN0ZWRDYXRlZ29yeUlkKCkpO1xyXG4gICAgICAgIH0pOy8vY2hhbmdlXHJcblxyXG4gICAgfS8vQ3JlYXRlRmlyc3RMZXZlbFxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlU2Vjb25kTGV2ZWwoZmlyc3RMZXZlbENhdGVnb3J5SWQ6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMucmVtb3ZlRWxlbWVudCh0aGlzLl9zZWNvbmRMZXZlbERpdik7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUd28gPSB0aGlzLl9yb290Q2F0ZWdvcnlJZDtcclxuICAgICAgICB0aGlzLnJlbW92ZUVsZW1lbnQodGhpcy5fdGhpcmRMZXZlbERpdik7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUaHJlZSA9IHRoaXMuX3Jvb3RDYXRlZ29yeUlkO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChmaXJzdExldmVsQ2F0ZWdvcnlJZCA9PT0gdGhpcy5fcm9vdENhdGVnb3J5SWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHRlbXBsYXRlID0gJChcIiNcIiArIHRoaXMuX3NlY29uZExldmVsVGVtcGxhdGUpLmh0bWwoKTtcclxuICAgICAgICBsZXQgY2F0ZWdvcmllczogQ2F0ZWdvcnlbXSA9IG5ldyBBcnJheTxDYXRlZ29yeT4oKTtcclxuICAgICAgICBsZXQgZGF0YSA9IHsgY2F0ZWdvcmllczogY2F0ZWdvcmllcyB9XHJcblxyXG4gICAgICAgIHRoaXMuX2FsbENhdGVnb3JpZXMuZm9yRWFjaChjYXRlZ29yeSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChjYXRlZ29yeS5wYXJlbnRDYXRlZ29yeUlkID09PSBmaXJzdExldmVsQ2F0ZWdvcnlJZCkge1xyXG4gICAgICAgICAgICAgICAgY2F0ZWdvcmllcy5wdXNoKGNhdGVnb3J5KTtcclxuICAgICAgICAgICAgfS8vaWZcclxuICAgICAgICB9KTsvL2ZvckVhY2hcclxuXHJcbiAgICAgICAgbGV0IGh0bWwgPSBNdXN0YWNoZS50b19odG1sKHRlbXBsYXRlLCBkYXRhKTtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fcGFyZW50RGl2SWQpLmFwcGVuZChodG1sKTtcclxuXHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX3NlY29uZExldmVsU2VsZWN0KS5jaGFuZ2UoKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBzZWxlY3RlZElkID0gcGFyc2VJbnQoJChldmVudC5jdXJyZW50VGFyZ2V0KS52YWwoKS50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUd28gPSBzZWxlY3RlZElkO1xyXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVRoaXJkTGV2ZWwoc2VsZWN0ZWRJZCk7XHJcbiAgICAgICAgICAgIHRoaXMuU2VsZWN0ZWRDYXRlZ29yeUNoYW5nZWRFdmVudC5EaXNwYXRjaCh0aGlzLCB0aGlzLkdldFNlbGVjdGVkQ2F0ZWdvcnlJZCgpKTtcclxuICAgICAgICB9KTsvL2NoYW5nZVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlVGhpcmRMZXZlbChzZWNvbmRMZXZlbENhdGVnb3J5SWQ6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMucmVtb3ZlRWxlbWVudCh0aGlzLl90aGlyZExldmVsRGl2KTtcclxuICAgICAgICB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFRocmVlID0gdGhpcy5fcm9vdENhdGVnb3J5SWQ7XHJcblxyXG4gICAgICAgIGlmIChzZWNvbmRMZXZlbENhdGVnb3J5SWQgPT09IHRoaXMuX3Jvb3RDYXRlZ29yeUlkKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCB0ZW1wbGF0ZSA9ICQoXCIjXCIgKyB0aGlzLl90aGlyZExldmVsVGVtcGxhdGUpLmh0bWwoKTtcclxuICAgICAgICBsZXQgY2F0ZWdvcmllczogQ2F0ZWdvcnlbXSA9IG5ldyBBcnJheTxDYXRlZ29yeT4oKTtcclxuICAgICAgICBsZXQgZGF0YSA9IHsgY2F0ZWdvcmllczogY2F0ZWdvcmllcyB9XHJcblxyXG4gICAgICAgIHRoaXMuX2FsbENhdGVnb3JpZXMuZm9yRWFjaChjYXRlZ29yeSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChjYXRlZ29yeS5wYXJlbnRDYXRlZ29yeUlkID09PSBzZWNvbmRMZXZlbENhdGVnb3J5SWQpIHtcclxuICAgICAgICAgICAgICAgIGNhdGVnb3JpZXMucHVzaChjYXRlZ29yeSk7XHJcbiAgICAgICAgICAgIH0vL2lmXHJcbiAgICAgICAgfSk7Ly9mb3JFYWNoXHJcbiAgICAgICAgaWYgKGNhdGVnb3JpZXMubGVuZ3RoID09PSAwKSB7Ly9ObyBJdG1lIGluIHRoaXJkIGxldmVsIGNhdGVnb3J5XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGh0bWwgPSBNdXN0YWNoZS50b19odG1sKHRlbXBsYXRlLCBkYXRhKTtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fcGFyZW50RGl2SWQpLmFwcGVuZChodG1sKTtcclxuXHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX3RoaXJkTGV2ZWxTZWxlY3QpLmNoYW5nZSgoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUaHJlZSA9IHBhcnNlSW50KCQoZXZlbnQuY3VycmVudFRhcmdldCkudmFsKCkudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgIHRoaXMuU2VsZWN0ZWRDYXRlZ29yeUNoYW5nZWRFdmVudC5EaXNwYXRjaCh0aGlzLCB0aGlzLkdldFNlbGVjdGVkQ2F0ZWdvcnlJZCgpKTtcclxuICAgICAgICB9KTsvL2NoYW5nZVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVtb3ZlRWxlbWVudChpZDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgJChcIiNcIiArIGlkKS5yZW1vdmUoKTtcclxuICAgIH1cclxufSIsIu+7v2ltcG9ydCB7Q2FyTW9kZWx9IGZyb20gXCIuLi8uLi9Nb2RlbHMvQWRUcmFuc3BvcnRhdGlvbi9DYXJNb2RlbFwiO1xyXG5pbXBvcnQge1VzZXJJbnB1dH0gZnJvbSBcIi4uLy4uL0hlbHBlci9Vc2VySW5wdXRcIjtcclxuaW1wb3J0IENyaXRlcmlhID0gcmVxdWlyZShcIi4uLy4uL0hlbHBlci9JQ3JpdGVyaWFcIik7XHJcbmltcG9ydCBJQ3JpdGVyaWEgPSBDcml0ZXJpYS5JQ3JpdGVyaWE7XHJcbmltcG9ydCB7SUNyaXRlcmlhQ2hhbmdlfSBmcm9tIFwiLi4vLi4vSGVscGVyL0lDcml0ZXJpYUNoYW5nZVwiO1xyXG5cclxuXHJcblxyXG5leHBvcnQgY2xhc3MgQ2FyTW9kZWxCcmFuZENvbnRyb2xsZXIgaW1wbGVtZW50cyBJQ3JpdGVyaWEge1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBDYXJCcmFuZElkS2V5OiBzdHJpbmcgPSBcIkJyYW5kSWRcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgQnJhbmRTZWxlY3RJZDogc3RyaW5nID0gXCJicmFuZFwiO1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgQ2FyTW9kZWxUZW1wbGF0ZUlkOiBzdHJpbmcgPSBcIm1vZGVsVGVtcGxhdGVcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgQ2FyTW9kZWxEaXZQbGFjZUhvbGRlcklkOiBzdHJpbmcgPSBcIm1vZGVsUGxhY2VIb2xkZXJcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgQ2FyTW9kZWxJZEtleTogc3RyaW5nID0gXCJDYXJNb2RlbElkXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IEFsbENhck1vZGVsc0lucHV0SWQ6IHN0cmluZyA9IFwiYWxsQ2FyTW9kZWxzXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IE1vZGVsU2VsZWN0SWQ6IHN0cmluZyA9IFwibW9kZWxcIjtcclxuICAgIHByaXZhdGUgX2FsbENhck1vZGVsczogQ2FyTW9kZWxbXTtcclxuXHJcbiAgICBwcml2YXRlIF9zZWFyY2hDcml0ZXJpYUNoYW5nZTpJQ3JpdGVyaWFDaGFuZ2U7XHJcblxyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuaW5pdFZpZXcoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXRWaWV3KCk6IHZvaWQge1xyXG4gICAgICAgIGxldCBhbGxDYXJNb2RlbHNTdHJpbmcgPSAkKFwiI1wiICsgdGhpcy5BbGxDYXJNb2RlbHNJbnB1dElkKS52YWwoKS50b1N0cmluZygpO1xyXG4gICAgICAgIHRoaXMuX2FsbENhck1vZGVscyA9ICQucGFyc2VKU09OKGFsbENhck1vZGVsc1N0cmluZykgYXMgQ2FyTW9kZWxbXTtcclxuICAgICAgICB0aGlzLmluaXRDYXJNb2RlbCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaW5pdENhck1vZGVsKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuY3JlYXRlQ2FyTW9kZWxFbGVtZW50KG5ldyBBcnJheTxDYXJNb2RlbD4oKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVDYXJNb2RlbEVsZW1lbnQoY2FyTW9kZWxzOiBDYXJNb2RlbFtdKSB7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuQ2FyTW9kZWxEaXZQbGFjZUhvbGRlcklkKS5jaGlsZHJlbigpLnJlbW92ZSgpO1xyXG4gICAgICAgIGxldCB0ZW1wbGF0ZSA9ICQoXCIjXCIgKyB0aGlzLkNhck1vZGVsVGVtcGxhdGVJZCkuaHRtbCgpO1xyXG4gICAgICAgIGxldCBkYXRhID0geyBjYXJNb2RlbHM6IGNhck1vZGVscyB9XHJcbiAgICAgICAgbGV0IGh0bWwgPSBNdXN0YWNoZS50b19odG1sKHRlbXBsYXRlLCBkYXRhKTtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5DYXJNb2RlbERpdlBsYWNlSG9sZGVySWQpLmFwcGVuZChodG1sKTtcclxuICAgICAgICB0aGlzLmJpbmRDYXJNb2RlbCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYmluZENhck1vZGVsKCk6IHZvaWQge1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLk1vZGVsU2VsZWN0SWQpLm9uKFwiY2hhbmdlXCIsXHJcbiAgICAgICAgICAgIChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2VhcmNoQ3JpdGVyaWFDaGFuZ2UuQ3VzdG9tQ3JpdGVyaWFDaGFuZ2VkKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlQ2FyTW9kZWxTZWxlY3QoYnJhbmRJZDogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgbGV0IGNhck1vZGVscyA9IG5ldyBBcnJheTxDYXJNb2RlbD4oKTtcclxuICAgICAgICB0aGlzLl9hbGxDYXJNb2RlbHMuZm9yRWFjaCgoY2FyTW9kZWwsIGluZGV4LCBhcnJheSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoY2FyTW9kZWwuYnJhbmRJZCA9PT0gYnJhbmRJZClcclxuICAgICAgICAgICAgICAgIGNhck1vZGVscy5wdXNoKGNhck1vZGVsKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmNyZWF0ZUNhck1vZGVsRWxlbWVudChjYXJNb2RlbHMpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBwdWJsaWMgRmlsbENyaXRlcmlhKHVzZXJJbnB1dDpVc2VySW5wdXQpOnZvaWQge1xyXG4gICAgICAgIHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeVt0aGlzLkNhckJyYW5kSWRLZXldID1cclxuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuQnJhbmRTZWxlY3RJZCkuZmluZChcIm9wdGlvbjpzZWxlY3RlZFwiKS52YWwoKTsvL2JyYW5kSWRcclxuICAgICAgICB1c2VySW5wdXQuUGFyYW1ldGVyc0RpY3Rpb25hcnlbdGhpcy5DYXJNb2RlbElkS2V5XSA9XHJcbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLk1vZGVsU2VsZWN0SWQpLmZpbmQoXCJvcHRpb246c2VsZWN0ZWRcIikudmFsKCk7Ly9jYXJNb2RlbElkXHJcbiAgICB9XHJcblxyXG4gICAgQmluZEV2ZW50cyhjcml0ZXJpYUNoYW5nZTogSUNyaXRlcmlhQ2hhbmdlKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fc2VhcmNoQ3JpdGVyaWFDaGFuZ2UgPSBjcml0ZXJpYUNoYW5nZTtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5CcmFuZFNlbGVjdElkKS5vbihcImNoYW5nZVwiLCAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgbGV0IHNlbGVjdGVkQnJhbmRJZDogbnVtYmVyID0gcGFyc2VJbnQoJChldmVudC5jdXJyZW50VGFyZ2V0KS5maW5kKFwib3B0aW9uOnNlbGVjdGVkXCIpLnZhbCgpLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUNhck1vZGVsU2VsZWN0KHNlbGVjdGVkQnJhbmRJZCk7XHJcbiAgICAgICAgICAgIGNyaXRlcmlhQ2hhbmdlLkN1c3RvbUNyaXRlcmlhQ2hhbmdlZCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmJpbmRDYXJNb2RlbCgpO1xyXG4gICAgfVxyXG5cclxuICAgIFVuQmluZEV2ZW50cygpOiB2b2lkIHtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5CcmFuZFNlbGVjdElkKS5vZmYoXCJjaGFuZ2VcIik7XHJcbiAgICAgICAgdGhpcy51bkJpbmRDYXJNb2RlbCgpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSB1bkJpbmRDYXJNb2RlbCgpOiB2b2lkIHtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5Nb2RlbFNlbGVjdElkKS5vZmYoXCJjaGFuZ2VcIik7XHJcbiAgICB9XHJcbn0iLCLvu79pbXBvcnQge0lFdmVudH0gIGZyb20gXCIuL0lFdmVudFwiO1xyXG5cclxuXHJcbi8qIFRoZSBkaXNwYXRjaGVyIGhhbmRsZXMgdGhlIHN0b3JhZ2Ugb2Ygc3Vic2NpcHRpb25zIGFuZCBmYWNpbGl0YXRlc1xyXG4gIHN1YnNjcmlwdGlvbiwgdW5zdWJzY3JpcHRpb24gYW5kIGRpc3BhdGNoaW5nIG9mIHRoZSBldmVudCAqL1xyXG5leHBvcnQgIGNsYXNzIEV2ZW50RGlzcGF0Y2hlcjxUU2VuZGVyLCBUQXJncz4gaW1wbGVtZW50cyBJRXZlbnQ8VFNlbmRlciwgVEFyZ3M+IHtcclxuXHJcbiAgICBwcml2YXRlIF9zdWJzY3JpcHRpb25zOiBBcnJheTwoc2VuZGVyOiBUU2VuZGVyLCBhcmdzOiBUQXJncykgPT4gdm9pZD4gPSBuZXcgQXJyYXk8KHNlbmRlcjogVFNlbmRlciwgYXJnczogVEFyZ3MpID0+IHZvaWQ+KCk7XHJcblxyXG4gICAgcHVibGljIFN1YnNjcmliZShmbjogKHNlbmRlcjogVFNlbmRlciwgYXJnczogVEFyZ3MpID0+IHZvaWQpOiB2b2lkIHtcclxuICAgICAgICBpZiAoZm4pIHtcclxuICAgICAgICAgICAgdGhpcy5fc3Vic2NyaXB0aW9ucy5wdXNoKGZuKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljICBVbnN1YnNjcmliZShmbjogKHNlbmRlcjogVFNlbmRlciwgYXJnczogVEFyZ3MpID0+IHZvaWQpOiB2b2lkIHtcclxuICAgICAgICBsZXQgaSA9IHRoaXMuX3N1YnNjcmlwdGlvbnMuaW5kZXhPZihmbik7XHJcbiAgICAgICAgaWYgKGkgPiAtMSkge1xyXG4gICAgICAgICAgICB0aGlzLl9zdWJzY3JpcHRpb25zLnNwbGljZShpLCAxKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljICBEaXNwYXRjaChzZW5kZXI6IFRTZW5kZXIsIGFyZ3M6IFRBcmdzKTogdm9pZCB7XHJcbiAgICAgICAgZm9yIChsZXQgaGFuZGxlciBvZiB0aGlzLl9zdWJzY3JpcHRpb25zKSB7XHJcbiAgICAgICAgICAgIGhhbmRsZXIoc2VuZGVyLCBhcmdzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCLvu79pbXBvcnQgeyBJQ3JpdGVyaWF9IGZyb20gXCIuL0lDcml0ZXJpYVwiO1xyXG5pbXBvcnQgeyBOdW1lcmljRGljdGlvbmFyeSB9IGZyb20gXCJsb2Rhc2gvZGlzdC9sb2Rhc2hcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDcml0ZXJpYU51bWVyaWNEaWN0aW9uYXJ5IGltcGxlbWVudHMgTnVtZXJpY0RpY3Rpb25hcnk8SUNyaXRlcmlhPiB7XHJcbiAgICBbaW5kZXg6IG51bWJlcl06IElDcml0ZXJpYTtcclxufSIsIu+7v2V4cG9ydCBjbGFzcyBJbWFnZVVwbG9hZGVyIHtcclxuICAgIHByaXZhdGUgX2ltYWdlVXBsb2FkSW5wdXRJZDogc3RyaW5nID0gXCJpbWFnZVVwbG9hZFwiO1xyXG4gICAgcHJpdmF0ZSBfbWVzc2FnZVRvVXNlckRpdklkOiBzdHJpbmcgPSBcImxhYmVsTWVzc2FnZVRvVXNlclwiO1xyXG4gICAgcHJpdmF0ZSBfbG9hZGVkSW1hZ2VzRGl2SWQ6IHN0cmluZyA9IFwibG9hZGVkSW1hZ2VWaWV3XCI7XHJcbiAgICBwcml2YXRlIF9zZW5kaW5nSW1hZ2VUZW1wbGF0ZUlkOiBzdHJpbmcgPSBcInNlbmRpbmdJbWFnZVRlbXBsYXRlXCI7XHJcbiAgICBwcml2YXRlIF9hZGRlZEltYWdlVGVtcGxhdGVJZDogc3RyaW5nID0gXCJhZGRlZEltYWdlXCI7XHJcblxyXG4gICAgcHJpdmF0ZSBfc2VuZEZpbGVzVG9TZXJ2ZXJVcmw6IHN0cmluZyA9IFwiL2FwaS9BZEFwaS9BZGRUZW1wSW1hZ2VcIjtcclxuICAgIHByaXZhdGUgX3JlbW92ZUZpbGVGcm9tU2VydmVyVXJsOiBzdHJpbmcgPSBcIi9hcGkvQWRBcGkvUmVtb3ZlVGVtcEltYWdlXCI7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5pbml0VmlldygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaW5pdFZpZXcoKTogdm9pZCB7XHJcbiAgICAgICAgJChkb2N1bWVudCkucmVhZHkoKCkgPT4ge1xyXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5faW1hZ2VVcGxvYWRJbnB1dElkKS5jaGFuZ2UoKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgZmlsZVVwbG9hZDogSFRNTElucHV0RWxlbWVudCA9ICQoXCIjXCIgKyB0aGlzLl9pbWFnZVVwbG9hZElucHV0SWQpLmdldCgwKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgICAgICAgICAgICAgbGV0IGZpbGVzOiBGaWxlTGlzdCA9IGZpbGVVcGxvYWQuZmlsZXM7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNlbmRGaWxlc1RvU2VydmVyKGZpbGVzKTtcclxuXHJcbiAgICAgICAgICAgIH0pOyAvL2NoYW5nZVxyXG5cclxuICAgICAgICAgICAgJChkb2N1bWVudCkub24oXCJjbGlja1wiLFxyXG4gICAgICAgICAgICAgICAgXCIuYWRkZWRJbWFnZSA+IGlucHV0XCIsXHJcbiAgICAgICAgICAgICAgICAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAvL3RvZG8gY2FsbCBzZXJ2ZXIgdG8gcmVtb3ZlIHRlbXAgZmlsZSBhbmQgYWxzbyByZW1vdmUgaXQgZnJvbSBwYWdlXHJcbiAgICAgICAgICAgICAgICAgICAgLy9jcmVhdGUgYSBtZXRob2QgdG8gdXNlIGFqYXggYW5kIGNhbGxcclxuICAgICAgICAgICAgICAgICAgICAvLyBzZXJ2ZXIgdG8gcmVtb3ZlIHRoZSBpbWFnZSBmcm9tIHRoZSBzZXJ2ZXIgXHJcbiAgICAgICAgICAgICAgICAgICAgLy9hbHNvIHJlbW92ZSB0aGUgaW1hZ2UgZnJvbSBjdXJyZW50IHBhZ2VcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUltYWdlRnJvbVNlcnZlcigkKGV2ZW50LmN1cnJlbnRUYXJnZXQpLnBhcmVudCgpLmF0dHIoXCJpZFwiKS50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgICAgICAgICAvL2FsZXJ0KCQoZXZlbnQuY3VycmVudFRhcmdldCkucGFyZW50KCkuYXR0cihcImlkXCIpKTtcclxuICAgICAgICAgICAgICAgIH0pOyAvL2NsaWNrXHJcblxyXG4gICAgICAgIH0pOyAvL3JlYWR5XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZW5kRmlsZXNUb1NlcnZlcihmaWxlTGlzdDogRmlsZUxpc3QpOiB2b2lkIHtcclxuICAgICAgICB2YXIgZGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZmlsZUxpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgZGF0YS5hcHBlbmQoZmlsZUxpc3RbaV0ubmFtZSwgZmlsZUxpc3RbaV0pO1xyXG4gICAgICAgIH0gLy9mb3JcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0eXBlOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgdXJsOiB0aGlzLl9zZW5kRmlsZXNUb1NlcnZlclVybCxcclxuICAgICAgICAgICAgY29udGVudFR5cGU6IGZhbHNlLFxyXG4gICAgICAgICAgICBwcm9jZXNzRGF0YTogZmFsc2UsXHJcbiAgICAgICAgICAgIGRhdGE6IGRhdGEsXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IChtc2csIHRleHRTdGF0dXMsIGpxWEhSKSA9PlxyXG4gICAgICAgICAgICAgICAgdGhpcy5vblN1Y2Nlc3NHZXRJdGVtc0Zyb21TZXJ2ZXIobXNnLCB0ZXh0U3RhdHVzLCBqcVhIUiksIC8vT24gU3VjY2Vzc2Z1bGwgc2VydmljZSBjYWxsXHJcbiAgICAgICAgICAgIGVycm9yOiAoanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKSA9PlxyXG4gICAgICAgICAgICAgICAgdGhpcy5vbkVycm9yR2V0SXRlbXNGcm9tU2VydmVyKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikgLy8gV2hlbiBTZXJ2aWNlIGNhbGwgZmFpbHNcclxuXHJcbiAgICAgICAgfSk7IC8vYWpheFxyXG4gICAgICAgIHRoaXMuc2hvd1NlbmRpbmdJbWFnZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25TdWNjZXNzR2V0SXRlbXNGcm9tU2VydmVyKG1zZzogYW55LCB0ZXh0U3RhdHVzOiBzdHJpbmcsIGpxWEhSOiBKUXVlcnlYSFIpIHtcclxuICAgICAgICB0aGlzLnNob3dNZXNzYWdlVG9Vc2VyKFwiXCIpO1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9pbWFnZVVwbG9hZElucHV0SWQpLnZhbChcIlwiKTtcclxuICAgICAgICBpZiAobXNnLnN1Y2Nlc3MgPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLmFkZE5ld0ltYWdlVG9QYWdlKG1zZy5yZXNwb25zZURhdGEpO1xyXG4gICAgICAgIH0gLy9pZlxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnNob3dNZXNzYWdlVG9Vc2VyKG1zZy5tZXNzYWcgKyBcIiAsXCIgKyBtc2cuZXJyb3JDb2RlKTtcclxuICAgICAgICB9IC8vZWxzZVxyXG4gICAgfSAvL29uU3VjY2Vzc0dldEl0ZW1zRnJvbVNlcnZlclxyXG5cclxuICAgIHByaXZhdGUgb25FcnJvckdldEl0ZW1zRnJvbVNlcnZlcihqcVhIUjogSlF1ZXJ5WEhSLCB0ZXh0U3RhdHVzOiBzdHJpbmcsIGVycm9yVGhyb3duOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLnNob3dNZXNzYWdlVG9Vc2VyKFwi2K7Yt9inINiv2LEg2KfYsdiz2KfZhFwiKTtcclxuICAgIH0gLy9lbmQgT25FcnJvckdldFRpbWVGcm9tU2VydmVyXHJcblxyXG4gICAgcHJpdmF0ZSBzaG93U2VuZGluZ0ltYWdlKCkge1xyXG4gICAgICAgIHZhciAkc2VuZGluZ0ltYWdlVGVtcGxhdGUgPSAkKFwiI1wiICsgdGhpcy5fc2VuZGluZ0ltYWdlVGVtcGxhdGVJZCkuY2xvbmUoKTtcclxuICAgICAgICB0aGlzLnNob3dNZXNzYWdlVG9Vc2VyKCRzZW5kaW5nSW1hZ2VUZW1wbGF0ZS5odG1sKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYWRkTmV3SW1hZ2VUb1BhZ2UoZGF0YSkge1xyXG4gICAgICAgIGxldCB0ZW1wbGF0ZTogc3RyaW5nID0gJChcIiNcIiArIHRoaXMuX2FkZGVkSW1hZ2VUZW1wbGF0ZUlkKS5odG1sKCk7XHJcbiAgICAgICAgbGV0IHVwbG9hZGVkSW1hZ2U6IFVwbG9hZGVkSW1hZ2UgPSBuZXcgVXBsb2FkZWRJbWFnZSgpO1xyXG4gICAgICAgIHVwbG9hZGVkSW1hZ2UuSW1hZ2VGaWxlTmFtZSA9IGRhdGEuaW1hZ2VGaWxlTmFtZTtcclxuICAgICAgICB1cGxvYWRlZEltYWdlLkltYWdlID0gXCJkYXRhOmltYWdlL2pwZztiYXNlNjQsXCIgKyBkYXRhLmltYWdlO1xyXG4gICAgICAgIHZhciBodG1sID0gTXVzdGFjaGUudG9faHRtbCh0ZW1wbGF0ZSwgdXBsb2FkZWRJbWFnZSk7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX2xvYWRlZEltYWdlc0RpdklkKS5hcHBlbmQoaHRtbCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzaG93TWVzc2FnZVRvVXNlcihtc2cpIHtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fbWVzc2FnZVRvVXNlckRpdklkKS5odG1sKG1zZyk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8vVE9ETyByZWZhY3RvciB0aGlzIG1ldGhvZCBcclxuICAgIHByaXZhdGUgcmVtb3ZlSW1hZ2VGcm9tU2VydmVyKGZpbGVOYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICBsZXQgY2FsbFBhcmFtcyA9IHtcclxuICAgICAgICAgICAgRmlsZU5hbWVUb0JlUmVtb3ZlZDogZmlsZU5hbWVcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0eXBlOiBcIkdFVFwiLCAvL0dFVCBvciBQT1NUIG9yIFBVVCBvciBERUxFVEUgdmVyYlxyXG4gICAgICAgICAgICB1cmw6IHRoaXMuX3JlbW92ZUZpbGVGcm9tU2VydmVyVXJsLFxyXG4gICAgICAgICAgICBkYXRhOiBjYWxsUGFyYW1zLCAvL0RhdGEgc2VudCB0byBzZXJ2ZXJcclxuICAgICAgICAgICAgc3VjY2VzczogKG1zZywgdGV4dFN0YXR1cywganFYSFIpID0+XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uU3VjY2Vzc1JlbW92ZUZpbGVGcm9tU2VydmVyKG1zZywgdGV4dFN0YXR1cywganFYSFIpLCAvL09uIFN1Y2Nlc3NmdWxsIHNlcnZpY2UgY2FsbFxyXG4gICAgICAgICAgICBlcnJvcjogKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikgPT5cclxuICAgICAgICAgICAgICAgIHRoaXMub25FcnJvclJlbW92ZUZpbGVGcm9tU2VydmVyKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikgLy8gV2hlbiBTZXJ2aWNlIGNhbGwgZmFpbHNcclxuICAgICAgICB9KTsgLy8uYWpheFxyXG4gICAgICAgIHRoaXMuc2hvd01lc3NhZ2VUb1VzZXIoXCJyZW1vdmluZyBmaWxlIGZyb20gc2VydmVyXCIpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBwcml2YXRlIG9uU3VjY2Vzc1JlbW92ZUZpbGVGcm9tU2VydmVyKG1zZzogYW55LCB0ZXh0U3RhdHVzOiBzdHJpbmcsIGpxWEhSOiBKUXVlcnlYSFIpIHtcclxuICAgICAgICB0aGlzLnNob3dNZXNzYWdlVG9Vc2VyKFwiZG9uZSByZW1vdmluZyBmaWxlIGZyb20gc2VydmVyXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25FcnJvclJlbW92ZUZpbGVGcm9tU2VydmVyKGpxWEhSOiBKUXVlcnlYSFIsIHRleHRTdGF0dXM6IHN0cmluZywgZXJyb3JUaHJvd246IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuc2hvd01lc3NhZ2VUb1VzZXIoXCJlcnJvciByZW1vdmluZyBmaWxlIGZyb20gc2VydmVyLCBcIiArIGVycm9yVGhyb3duKTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcblxyXG5jbGFzcyBVcGxvYWRlZEltYWdlIHtcclxuICAgIHB1YmxpYyBJbWFnZTogc3RyaW5nO1xyXG4gICAgcHVibGljIEltYWdlRmlsZU5hbWU6IHN0cmluZztcclxufSIsIu+7v2ltcG9ydCB7IENyaXRlcmlhTnVtZXJpY0RpY3Rpb25hcnkgfSBmcm9tIFwiLi4vLi4vLi4vSGVscGVyL0NyaXRlcmlhTnVtZXJpY0RpY3Rpb25hcnlcIjtcclxuaW1wb3J0IHsgRGVmYXVsdE5ld0FkQ3JpdGVyaWEgfSBmcm9tIFwiLi9OZXdBZENyaXRlcmlhL0RlZmF1bHROZXdBZENyaXRlcmlhXCI7XHJcbmltcG9ydCB7QWRUcmFuc2Zvcm1hdGlvbk5ld0FkQ3JpdGVyaWF9IGZyb20gXCIuL05ld0FkQ3JpdGVyaWEvQWRUcmFuc2Zvcm1hdGlvbk5ld0FkQ3JpdGVyaWFcIjtcclxuaW1wb3J0IHtVc2VySW5wdXR9IGZyb20gXCIuLi8uLi8uLi9IZWxwZXIvVXNlcklucHV0XCI7XHJcbmltcG9ydCB7SUNyaXRlcmlhfSBmcm9tIFwiLi4vLi4vLi4vSGVscGVyL0lDcml0ZXJpYVwiO1xyXG5pbXBvcnQge0lDcml0ZXJpYUNoYW5nZX0gZnJvbSBcIi4uLy4uLy4uL0hlbHBlci9JQ3JpdGVyaWFDaGFuZ2VcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBOZXdBZENyaXRlcmlhIHtcclxuICAgIHByaXZhdGUgX25ld0FkQ3JpdGVyaWFJb2NDb250YWluZXI6IENyaXRlcmlhTnVtZXJpY0RpY3Rpb25hcnkgO1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5fbmV3QWRDcml0ZXJpYUlvY0NvbnRhaW5lciA9IG5ldyBDcml0ZXJpYU51bWVyaWNEaWN0aW9uYXJ5KCk7XHJcbiAgICAgICAgdGhpcy5pbml0TmV3QWRDcml0ZXJpYUlvY0NvbnRhaW5lcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaW5pdE5ld0FkQ3JpdGVyaWFJb2NDb250YWluZXIoKSB7XHJcbiAgICAgICAgdGhpcy5fbmV3QWRDcml0ZXJpYUlvY0NvbnRhaW5lclswXSA9IG5ldyBEZWZhdWx0TmV3QWRDcml0ZXJpYSgpO1xyXG4gICAgICAgIHRoaXMuX25ld0FkQ3JpdGVyaWFJb2NDb250YWluZXJbMTAwXSA9IG5ldyBBZFRyYW5zZm9ybWF0aW9uTmV3QWRDcml0ZXJpYSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBGaWxsQ2F0ZWdvcnlTcGVjaWZpY05ld0FkQ3JpdGVyaWEoY2F0ZWdvcnlJZDogbnVtYmVyLCB1c2VySW5wdXQ6IFVzZXJJbnB1dCk6IHZvaWQge1xyXG4gICAgICAgIGxldCBuZXdBZENyaXRlcmlhID0gdGhpcy5wb2x5bW9ycGhpY0Rpc3BhdGNoTmV3QWRDcml0ZXJpYShjYXRlZ29yeUlkKTtcclxuICAgICAgICBuZXdBZENyaXRlcmlhLkZpbGxDcml0ZXJpYSh1c2VySW5wdXQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBCaW5kKGNhdGVnb3J5SWQ6IG51bWJlciwgY3JpdGVyaWFDaGFuZ2U6IElDcml0ZXJpYUNoYW5nZSkge1xyXG4gICAgICAgIGxldCBjcml0ZXJpYSA9IHRoaXMucG9seW1vcnBoaWNEaXNwYXRjaE5ld0FkQ3JpdGVyaWEoY2F0ZWdvcnlJZCk7XHJcbiAgICAgICAgY3JpdGVyaWEuQmluZEV2ZW50cyhjcml0ZXJpYUNoYW5nZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIFVuQmluZChjYXRlZ29yeUlkOiBudW1iZXIpIHtcclxuICAgICAgICBsZXQgY3JpdGVyaWEgPSB0aGlzLnBvbHltb3JwaGljRGlzcGF0Y2hOZXdBZENyaXRlcmlhKGNhdGVnb3J5SWQpO1xyXG4gICAgICAgIGNyaXRlcmlhLlVuQmluZEV2ZW50cygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcG9seW1vcnBoaWNEaXNwYXRjaE5ld0FkQ3JpdGVyaWEoY2F0ZWdvcnlJZDogbnVtYmVyKTogSUNyaXRlcmlhIHtcclxuICAgICAgICBsZXQgcmV0dXJuVmFsdWU6IElDcml0ZXJpYSA9IHRoaXMuX25ld0FkQ3JpdGVyaWFJb2NDb250YWluZXJbY2F0ZWdvcnlJZF07XHJcbiAgICAgICAgaWYgKHJldHVyblZhbHVlID09PSB1bmRlZmluZWQgfHwgcmV0dXJuVmFsdWUgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuVmFsdWUgPSB0aGlzLl9uZXdBZENyaXRlcmlhSW9jQ29udGFpbmVyWzBdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmV0dXJuVmFsdWU7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG4iLCLvu79pbXBvcnQge0lDcml0ZXJpYX0gZnJvbSBcIi4uLy4uLy4uLy4uL0hlbHBlci9JQ3JpdGVyaWFcIjtcclxuaW1wb3J0IHtVc2VySW5wdXR9IGZyb20gXCIuLi8uLi8uLi8uLi9IZWxwZXIvVXNlcklucHV0XCI7XHJcbmltcG9ydCB7SUNyaXRlcmlhQ2hhbmdlfSBmcm9tIFwiLi4vLi4vLi4vLi4vSGVscGVyL0lDcml0ZXJpYUNoYW5nZVwiO1xyXG5pbXBvcnQge0Nhck1vZGVsfSBmcm9tIFwiLi4vLi4vLi4vLi4vTW9kZWxzL0FkVHJhbnNwb3J0YXRpb24vQ2FyTW9kZWxcIjtcclxuaW1wb3J0IHtDYXJNb2RlbEJyYW5kQ29udHJvbGxlcn0gZnJvbSBcIi4uLy4uLy4uLy4uL0NvbXBvbmVudHMvVHJhbnNmb3JtYXRpb24vQ2FyTW9kZWxCcmFuZENvbnRyb2xsZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBBZFRyYW5zZm9ybWF0aW9uTmV3QWRDcml0ZXJpYSBpbXBsZW1lbnRzIElDcml0ZXJpYSB7XHJcbiAgICBwcml2YXRlICBfY2FyTW9kZWxCcmFuZENvbnRvbGxlcjogQ2FyTW9kZWxCcmFuZENvbnRyb2xsZXI7XHJcbiAgICBcclxuICAgIHByaXZhdGUgaW5pdFZpZXcoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fY2FyTW9kZWxCcmFuZENvbnRvbGxlciA9IG5ldyBDYXJNb2RlbEJyYW5kQ29udHJvbGxlcigpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgRmlsbENyaXRlcmlhKHVzZXJJbnB1dDogVXNlcklucHV0KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fY2FyTW9kZWxCcmFuZENvbnRvbGxlci5GaWxsQ3JpdGVyaWEodXNlcklucHV0KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgQmluZEV2ZW50cyhjcml0ZXJpYUNoYW5nZTogSUNyaXRlcmlhQ2hhbmdlKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5pbml0VmlldygpO1xyXG4gICAgICAgIHRoaXMuX2Nhck1vZGVsQnJhbmRDb250b2xsZXIuQmluZEV2ZW50cyhjcml0ZXJpYUNoYW5nZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIFVuQmluZEV2ZW50cygpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9jYXJNb2RlbEJyYW5kQ29udG9sbGVyLlVuQmluZEV2ZW50cygpO1xyXG4gICAgfVxyXG59Iiwi77u/aW1wb3J0IHsgSUNyaXRlcmlhIH0gZnJvbSBcIi4uLy4uLy4uLy4uL0hlbHBlci9JQ3JpdGVyaWFcIjtcclxuaW1wb3J0IHsgVXNlcklucHV0IH0gZnJvbSBcIi4uLy4uLy4uLy4uL0hlbHBlci9Vc2VySW5wdXRcIjtcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgRGVmYXVsdE5ld0FkQ3JpdGVyaWEgaW1wbGVtZW50cyBJQ3JpdGVyaWEge1xyXG4gICAgRmlsbENyaXRlcmlhKHNlYXJjaEFkVXNlcklucHV0OiBVc2VySW5wdXQpOiB2b2lkIHtcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBCaW5kRXZlbnRzKGNyaXRlcmlhQ2hhbmdlOiBPYmplY3QpOiB2b2lkIHtcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBVbkJpbmRFdmVudHMoKTogdm9pZCB7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbn0iLCLvu79pbXBvcnQge05ld0FkQ3JpdGVyaWF9IGZyb20gXCIuL05ld0FkQ3JpdGVyaWFcIjtcclxuaW1wb3J0IHtJQ3JpdGVyaWFDaGFuZ2V9IGZyb20gXCIuLi8uLi8uLi9IZWxwZXIvSUNyaXRlcmlhQ2hhbmdlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTmV3QWRQYXJ0aWFsVmlld0xvYWRlciB7XHJcbiAgICBwcml2YXRlIF9wYXJ0aWFsVmlld0RpdklkOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIF91cmw6IHN0cmluZyA9IFwiL0hvbWUvR2V0TmV3QWRQYXJ0aWFsVmlld1wiO1xyXG4gICAgcHJpdmF0ZSBfcHJldmlvdXNDYXRlZ29yeUlkOiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBfY3VycmVudENhdGVnb3J5SWQ6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIF9uZXdBZENyaXRlcmlhQ2hhbmdlOiBJQ3JpdGVyaWFDaGFuZ2U7XHJcbiAgICBwcml2YXRlIF9uZXdBZENyaXRlcmlhOiBOZXdBZENyaXRlcmlhO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBhcnRpYWxWaWV3RGl2SWQ6IHN0cmluZywgbmV3QWRDcml0ZXJpYUNoYW5nZTogSUNyaXRlcmlhQ2hhbmdlLCBuZXdBZENyaXRlcmlhOk5ld0FkQ3JpdGVyaWEpIHtcclxuICAgICAgICB0aGlzLl9wYXJ0aWFsVmlld0RpdklkID0gcGFydGlhbFZpZXdEaXZJZDtcclxuICAgICAgICB0aGlzLl9uZXdBZENyaXRlcmlhQ2hhbmdlID0gbmV3QWRDcml0ZXJpYUNoYW5nZTtcclxuICAgICAgICB0aGlzLl9uZXdBZENyaXRlcmlhID0gbmV3QWRDcml0ZXJpYTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgR2V0UGFydGlhbFZpZXdGcm9tU2VydmVyKGNhdGVnb3J5SWQ6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX2N1cnJlbnRDYXRlZ29yeUlkID0gY2F0ZWdvcnlJZDtcclxuICAgICAgICBsZXQgY2FsbFBhcmFtcyA9IG5ldyBQYXJ0aWFsVmlld1NlcnZlckNhbGxQYXJhbWV0ZXJzKCk7XHJcbiAgICAgICAgY2FsbFBhcmFtcy5DYXRlZ29yeUlkID0gY2F0ZWdvcnlJZDtcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0eXBlOiBcIkdFVFwiLCAvL0dFVCBvciBQT1NUIG9yIFBVVCBvciBERUxFVEUgdmVyYlxyXG4gICAgICAgICAgICB1cmw6IHRoaXMuX3VybCxcclxuICAgICAgICAgICAgZGF0YTogY2FsbFBhcmFtcywgLy9EYXRhIHNlbnQgdG8gc2VydmVyXHJcbiAgICAgICAgICAgIC8vY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJywgLy8gY29udGVudCB0eXBlIHNlbnQgdG8gc2VydmVyXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IChtc2csIHRleHRTdGF0dXMsIGpxWEhSKSA9PiB0aGlzLm9uU3VjY2Vzc0dldEl0ZW1zRnJvbVNlcnZlcihtc2csIHRleHRTdGF0dXMsIGpxWEhSKSwvL09uIFN1Y2Nlc3NmdWxsIHNlcnZpY2UgY2FsbFxyXG4gICAgICAgICAgICBlcnJvcjogKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikgPT4gdGhpcy5vbkVycm9yR2V0SXRlbXNGcm9tU2VydmVyKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikvLyBXaGVuIFNlcnZpY2UgY2FsbCBmYWlsc1xyXG4gICAgICAgIH0pOy8vLmFqYXhcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9uU3VjY2Vzc0dldEl0ZW1zRnJvbVNlcnZlcihtc2c6IGFueSwgdGV4dFN0YXR1czogc3RyaW5nLCBqcVhIUjogSlF1ZXJ5WEhSKSB7XHJcbiAgICAgICAgdGhpcy5fbmV3QWRDcml0ZXJpYS5VbkJpbmQodGhpcy5fcHJldmlvdXNDYXRlZ29yeUlkKTtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fcGFydGlhbFZpZXdEaXZJZCkuY2hpbGRyZW4oKS5yZW1vdmUoKTtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fcGFydGlhbFZpZXdEaXZJZCkuaHRtbChtc2cpO1xyXG4gICAgICAgIHRoaXMuX25ld0FkQ3JpdGVyaWEuQmluZCh0aGlzLl9jdXJyZW50Q2F0ZWdvcnlJZCwgdGhpcy5fbmV3QWRDcml0ZXJpYUNoYW5nZSk7XHJcbiAgICAgICAgdGhpcy5fcHJldmlvdXNDYXRlZ29yeUlkID0gdGhpcy5fY3VycmVudENhdGVnb3J5SWQ7XHJcbiAgICB9Ly9vblN1Y2Nlc3NHZXRUaW1lRnJvbVNlcnZlclxyXG5cclxuICAgIHByaXZhdGUgb25FcnJvckdldEl0ZW1zRnJvbVNlcnZlcihqcVhIUjogSlF1ZXJ5WEhSLCB0ZXh0U3RhdHVzOiBzdHJpbmcsIGVycm9yVGhyb3duOiBzdHJpbmcpIHtcclxuICAgICAgICBhbGVydChlcnJvclRocm93bik7XHJcbiAgICB9Ly9vbkVycm9yR2V0VGltZUZyb21TZXJ2ZXJcclxufVxyXG5cclxuLy9UT0RPIHJlZmFjdG9yIHRoaXNcclxuZXhwb3J0IGNsYXNzIFBhcnRpYWxWaWV3U2VydmVyQ2FsbFBhcmFtZXRlcnMge1xyXG4gICAgcHVibGljIENhdGVnb3J5SWQ6bnVtYmVyO1xyXG59Iiwi77u/aW1wb3J0IHsgQ2F0ZWdvcnkgfSBmcm9tIFwiLi4vLi4vLi4vTW9kZWxzL0NhdGVnb3J5XCI7XHJcbmltcG9ydCB7IENhdGVnb3J5U2VsZWN0aW9uTmV3QWQgfSBmcm9tIFwiLi4vLi4vLi4vQ29tcG9uZW50cy9DYXRlZ29yeS9OZXdBZC9DYXRlZ29yeVNlbGVjdGlvbk5ld0FkXCI7XHJcbmltcG9ydCB7IE5ld0FkUGFydGlhbFZpZXdMb2FkZXJ9IGZyb20gXCIuL05ld0FkUGFydGlhbFZpZXdMb2FkZXJcIjtcclxuaW1wb3J0IHtJQ3JpdGVyaWFDaGFuZ2V9IGZyb20gXCIuLi8uLi8uLi9IZWxwZXIvSUNyaXRlcmlhQ2hhbmdlXCI7XHJcbmltcG9ydCB7TmV3QWRDcml0ZXJpYX0gZnJvbSBcIi4vTmV3QWRDcml0ZXJpYVwiO1xyXG5pbXBvcnQge0ltYWdlVXBsb2FkZXJ9IGZyb20gXCIuL0ltYWdlVXBsb2FkZXJcIjtcclxuXHJcblxyXG5jbGFzcyBOZXdBZCBpbXBsZW1lbnRzIElDcml0ZXJpYUNoYW5nZSB7XHJcbiAgICBcclxuICAgIHByaXZhdGUgX2FsbENhdGVnb3JpZXNJbnB1dElkOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIF9hbGxDYXRlZ29yaWVzRGl2SWQ6IHN0cmluZztcclxuICAgIHByaXZhdGUgX2NhdGVnb3J5U3BlY2lmaWNQYXJ0aWFsVmlld0lkOiBzdHJpbmc7XHJcblxyXG4gICAgcHJpdmF0ZSBfY2F0ZWdvcnlTZWxlY3Rpb25OZXdBZDogQ2F0ZWdvcnlTZWxlY3Rpb25OZXdBZDtcclxuICAgIHByaXZhdGUgX3BhcnRpYWxWaWV3TG9hZGVyOiBOZXdBZFBhcnRpYWxWaWV3TG9hZGVyO1xyXG4gICAgcHJpdmF0ZSBfbmV3QWRDcml0ZXJpYTogTmV3QWRDcml0ZXJpYTtcclxuICAgIHByaXZhdGUgX2ltYWdlVXBsb2FkZXI6SW1hZ2VVcGxvYWRlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihhbGxDYXRlZ29yaWVzRGl2OiBzdHJpbmcsYWxsQ2F0ZWdvcmllc0lucHV0SWQ6IHN0cmluZyxjYXRlZ29yeVNwZWNpZmljUGFydGlhbFZpZXdJZDpzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLl9hbGxDYXRlZ29yaWVzRGl2SWQgPSBhbGxDYXRlZ29yaWVzRGl2O1xyXG4gICAgICAgIHRoaXMuX2FsbENhdGVnb3JpZXNJbnB1dElkID0gYWxsQ2F0ZWdvcmllc0lucHV0SWQ7XHJcbiAgICAgICAgdGhpcy5fY2F0ZWdvcnlTcGVjaWZpY1BhcnRpYWxWaWV3SWQgPSBjYXRlZ29yeVNwZWNpZmljUGFydGlhbFZpZXdJZDtcclxuICAgICAgICB0aGlzLl9uZXdBZENyaXRlcmlhID0gbmV3IE5ld0FkQ3JpdGVyaWEoKTtcclxuICAgICAgICB0aGlzLl9pbWFnZVVwbG9hZGVyID0gbmV3IEltYWdlVXBsb2FkZXIoKTtcclxuICAgICAgICB0aGlzLmluaXRQYWdlKCk7XHJcbiAgICAgICAgdGhpcy5pbml0RXZlbnRIYW5kbGVycygpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBDdXN0b21Dcml0ZXJpYUNoYW5nZWQoKTogdm9pZCB7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbml0UGFnZSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmluaXROZXdBZENhdGVnb3J5KCk7XHJcbiAgICAgICAgdGhpcy5fcGFydGlhbFZpZXdMb2FkZXIgPSBuZXcgTmV3QWRQYXJ0aWFsVmlld0xvYWRlcih0aGlzLl9jYXRlZ29yeVNwZWNpZmljUGFydGlhbFZpZXdJZCx0aGlzLHRoaXMuX25ld0FkQ3JpdGVyaWEpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaW5pdE5ld0FkQ2F0ZWdvcnkoKTp2b2lkIHtcclxuICAgICAgICBsZXQgYWxsQ2F0ZWdvcmllc1N0cmluZyA9ICQoXCIjXCIgKyB0aGlzLl9hbGxDYXRlZ29yaWVzSW5wdXRJZCkudmFsKCkudG9TdHJpbmcoKTtcclxuICAgICAgICBsZXQgYWxsQ2F0ZWdvcmllcyA9ICQucGFyc2VKU09OKGFsbENhdGVnb3JpZXNTdHJpbmcpIGFzIENhdGVnb3J5W107XHJcbiAgICAgICAgdGhpcy5fY2F0ZWdvcnlTZWxlY3Rpb25OZXdBZCA9IG5ldyBDYXRlZ29yeVNlbGVjdGlvbk5ld0FkKHRoaXMuX2FsbENhdGVnb3JpZXNEaXZJZCwgYWxsQ2F0ZWdvcmllcyk7XHJcbiAgICAgICAgdGhpcy5fY2F0ZWdvcnlTZWxlY3Rpb25OZXdBZC5DcmVhdGVGaXJzdExldmVsKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbml0RXZlbnRIYW5kbGVycygpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9jYXRlZ29yeVNlbGVjdGlvbk5ld0FkLlNlbGVjdGVkQ2F0ZWdvcnlDaGFuZ2VkRXZlbnQuU3Vic2NyaWJlKChzZW5kZXIsIGFyZ3MpID0+IHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLl9jYXRlZ29yeVNlbGVjdGlvbk5ld0FkLlNlbGVjdGVkQ2F0ZWdvcnlIYXNDaGlsZHJlbigpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9wYXJ0aWFsVmlld0xvYWRlci5HZXRQYXJ0aWFsVmlld0Zyb21TZXJ2ZXIoYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xyXG4gICBcclxuXHJcbiAgICAkKFwiI3N1Ym1pdE5ld0FkXCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgdmFyICRhcGlBZGRyZXNzID0gXCJnZXRBcGlBZGRyZXNzKClcIjtcclxuICAgICAgICBhbGVydCgkYXBpQWRkcmVzcyk7XHJcbiAgICB9KTtcclxufSk7Ly9yZWFkeVxyXG5cclxuXHJcbmxldCBhbGxDYXRlZ29yaWVzRGl2SWQ6IHN0cmluZyA9IFwiYWxsQ2F0ZWdvcmllc0RpdlwiO1xyXG5sZXQgYWxsQ2F0ZWdvcmllc0lucHV0SWQ6IHN0cmluZyA9IFwiYWxsQ2F0ZWdvcmllc0lucHV0XCI7XHJcbmxldCBjYXRlZ29yeVNwZWNpZmljUGFydGlhbFZpZXdJZDogc3RyaW5nID0gXCJDYXRlZ29yeVNwZWNpZmljQ3JpdGVyaWFcIjtcclxuJChkb2N1bWVudCkucmVhZHkoKCkgPT4ge1xyXG4gICAgbGV0IG5ld0FkID0gbmV3IE5ld0FkKGFsbENhdGVnb3JpZXNEaXZJZCwgYWxsQ2F0ZWdvcmllc0lucHV0SWQsY2F0ZWdvcnlTcGVjaWZpY1BhcnRpYWxWaWV3SWQpO1xyXG59KTsvL3JlYWR5Il19
