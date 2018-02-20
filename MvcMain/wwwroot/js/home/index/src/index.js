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
        this.LoadAdImageId = "loadAds";
        this.LoadViewImageId = "loadView";
        this.AdTypeKey = "AdType";
        this.AdTypeParentDivId = "adType";
        this.SearchTextKey = "SearchText";
        this.SearchTextInputId = "searchText";
        this._adPlaceHolderDivId = "adPlaceHolder";
        this._defaultImageInputId = "defaultImage";
        this._getAdFromServerButtonId = "getAdFromServer";
        this._messageDivId = "message";
        this._categorySpecificSearchCriteriaParentDivId = "categorySpecificSearchCriteria";
        this.GetAdFromServerRequestCode = 1;
        this.LoadSearchPartialViewRequestCode = 2;
        this._categorySelectorParentDivId = categorySelectorParentDivId;
        this._allCategoriesId = allCategoriesId;
        this._serverCaller = new ServerCaller_1.ServerCaller(this, this.GetAdFromServerRequestCode);
        this._searchCriteria = new SearchCriteria_1.SearchCriteria();
        this._searchCriteriaViewLoader = new SearchCriteriaViewLoader_1.SearchCriteriaViewLoader(this, this, this._searchCriteria, this.LoadSearchPartialViewRequestCode);
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
    Index.prototype.getSearchCriteriaPartialView = function (categoryId) {
        var userInput = new UserInput_1.UserInput();
        this._categorySelection.InsertCategoryIdInUserInputDictionary(userInput);
        this._searchCriteriaViewLoader.GetSearchCriteriaViewFromServer(userInput, categoryId);
    };
    Index.prototype.initEventHandlers = function () {
        var _this = this;
        this._categorySelection.SelectedCategoryChangedEvent.Subscribe(function (sender, args) {
            _this.searchCriteriaChanged();
            _this.getSearchCriteriaPartialView(args.SelectedCategoryId);
        });
        this.getSearchCriteriaPartialView(this._categorySelection.GetSelectedCategoryId());
        this._searchCriteria.Bind(this._categorySelection.GetSelectedCategoryId(), this);
        $("#" + this.AdTypeParentDivId).on("change", function (event) {
            _this.searchCriteriaChanged();
        });
        $("#" + this.SearchTextInputId).on("input", function () {
            _this.searchCriteriaChanged();
        });
        $(document).keypress(function (e) {
            if (e.which == 13) {
                $("#" + _this._getAdFromServerButtonId).click();
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
        $("#" + this._getAdFromServerButtonId).on("click", function (event) {
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
    Index.prototype.OnResult = function (msg, requestCode) {
        if (requestCode === this.GetAdFromServerRequestCode) {
            this.onResultGetAdFromServer(msg);
        }
        else if (requestCode === this.LoadSearchPartialViewRequestCode) {
            this.onResultLoadSearchPartialView(msg);
        }
    };
    Index.prototype.OnError = function (message, requestCode) {
        if (requestCode === this.GetAdFromServerRequestCode) {
            this.onErrorGetAdFromServer(message);
        }
        else if (requestCode === this.LoadSearchPartialViewRequestCode) {
            this.onErrorLoadSearchPartialView(message);
        }
    };
    Index.prototype.AjaxCallFinished = function (requestCode) {
        if (requestCode === this.GetAdFromServerRequestCode) {
            this.ajaxCallFinishedGetAdFromServer();
        }
        else if (requestCode === this.LoadSearchPartialViewRequestCode) {
            this.ajaxCallFinishedLoadSearchPartialView();
        }
    };
    Index.prototype.AjaxCallStarted = function (requestCode) {
        if (requestCode === this.GetAdFromServerRequestCode) {
            this.ajaxCallStartedGetAdFromServer();
        }
        else if (requestCode === this.LoadSearchPartialViewRequestCode) {
            this.ajaxCallStartedLoadSearchPartialView();
        }
    };
    Index.prototype.onResultGetAdFromServer = function (advertisementCommons) {
        var template = $('#singleAdItem').html();
        var data;
        for (var i = 0; i < advertisementCommons.length; i++) {
            var adImage;
            if (advertisementCommons[i].AdImages[0] != null) {
                adImage = "data:image/jpg;base64," + advertisementCommons[i].AdImages[0];
            } //end if
            else {
                adImage = "data:image/jpg;base64," + $("#" + this._defaultImageInputId).val();
            }
            data = {
                AdvertisementId: advertisementCommons[i].AdId,
                AdvertisementCategoryId: advertisementCommons[i].CategoryId,
                AdvertisementCategory: advertisementCommons[i].CategoryName,
                adImage: adImage,
                adPrice: advertisementCommons[i].AdPrice.PriceString,
                AdvertisementTitle: advertisementCommons[i].AdTitle,
                AdvertisementStatus: advertisementCommons[i].AdStatus
                //adDate: msg.ResponseData[i].AdTime
            }; //end data
            var html = Mustache.to_html(template, data);
            $("#" + this._adPlaceHolderDivId).append(html);
        } //end for
    };
    Index.prototype.onResultLoadSearchPartialView = function (msg) {
        $("#" + this._categorySpecificSearchCriteriaParentDivId).children().remove();
        $("#" + this._categorySpecificSearchCriteriaParentDivId).html(msg);
    };
    Index.prototype.onErrorGetAdFromServer = function (message) {
        this.showErrorMessage(message);
    };
    Index.prototype.onErrorLoadSearchPartialView = function (message) {
        this.showErrorMessage(message);
    };
    Index.prototype.ajaxCallStartedGetAdFromServer = function () {
        $("#" + this.LoadAdImageId).show();
        $("#" + this._getAdFromServerButtonId).attr("disabled", "disabled");
    };
    Index.prototype.ajaxCallStartedLoadSearchPartialView = function () {
        $("#" + this.LoadViewImageId).show();
    };
    Index.prototype.ajaxCallFinishedGetAdFromServer = function () {
        $("#" + this.LoadAdImageId).hide();
        $("#" + this._getAdFromServerButtonId).removeAttr("disabled");
    };
    Index.prototype.ajaxCallFinishedLoadSearchPartialView = function () {
        $("#" + this.LoadViewImageId).hide();
    };
    Index.prototype.showErrorMessage = function (message) {
        this.removeErrorMessage();
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
//# sourceMappingURL=index.js.map