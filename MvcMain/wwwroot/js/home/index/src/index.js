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
        this._adPlaceHolderDivId = "adPlaceHolder";
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
            _this._serverCaller.GetAdItemsFromServer(userInput, _this);
        }); //click
    }; //initGetAdFromServer
    Index.prototype.OnResultOk = function (advertisementCommons) {
        var template = $('#singleAdItem').html();
        var data;
        for (var i = 0; i < advertisementCommons.length; i++) {
            var adImage = null;
            if (advertisementCommons[i].advertisementImages[0] != null) {
                adImage = "data:image/jpg;base64," + advertisementCommons[i].advertisementImages[0];
            } //end if
            data = {
                AdvertisementId: advertisementCommons[i].advertisementId,
                AdvertisementCategoryId: advertisementCommons[i].advertisementCategoryId,
                AdvertisementCategory: advertisementCommons[i].advertisementCategory,
                adImage: adImage,
                adPrice: advertisementCommons[i].advertisementPrice,
                AdvertisementTitle: advertisementCommons[i].advertisementTitle,
                AdvertisementStatus: advertisementCommons[i].advertisementStatus
                //adDate: msg.ResponseData[i].AdTime
            }; //end data
            var html = Mustache.to_html(template, data);
            $("#" + this._adPlaceHolderDivId).append(html);
        } //end for
    };
    Index.prototype.OnResultError = function (message) {
        alert(message);
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
var getAdFromServerId = "getAdFromServer";
var allCategoriesId = "allCategories";
$(document).ready(function () {
    var index = new Index(categorySelectorParentDivId, allCategoriesId, getAdFromServerId);
    index.CustomCriteriaChanged(); //to initiate a server call on page load for first time
}); //ready
//# sourceMappingURL=index.js.map