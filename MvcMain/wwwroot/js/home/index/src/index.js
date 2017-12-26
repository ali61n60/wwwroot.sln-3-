"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CategorySelection_1 = require("../../../Components/Category/SearchAd/CategorySelection");
var ServerCaller_1 = require("./ServerCaller");
var SearchCriteriaViewLoader_1 = require("./SearchCriteriaViewLoader");
var SearchAdUserInput_1 = require("./SearchAdUserInput");
var SearchCriteria_1 = require("./SearchCriteria");
var Index = /** @class */ (function () {
    function Index(categorySelectorParentDivId, allCategoriesId, getAdFromServerId) {
        this._serverCaller = new ServerCaller_1.ServerCaller();
        this._searchCriteriaViewLoader = new SearchCriteriaViewLoader_1.SearchCriteriaViewLoader("categorySpecificSearchCriteria", this);
        this._searchCriteria = new SearchCriteria_1.SearchCriteria();
        this._categorySelectorParentDivId = categorySelectorParentDivId;
        this._allCategoriesId = allCategoriesId;
        this._getAdFromServerId = getAdFromServerId;
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
    };
    Index.prototype.CustomSearchCriteriChanged = function () {
        this.searchCriteriaChanged();
    };
    Index.prototype.searchCriteriaChanged = function () {
        $("#adPlaceHolder").children().remove();
        this._serverCaller.ResetSearchParameters();
    };
    Index.prototype.initGetAdFromServer = function () {
        var _this = this;
        $("#" + this._getAdFromServerId).on("click", function (event) {
            event.preventDefault();
            var userInput = new SearchAdUserInput_1.SearchAdUserInput();
            var categoryId = _this._categorySelection.GetSelectedCategoryId();
            userInput.SearchParameters.CategoryId = categoryId; //100 for cars
            var minPrice = parseInt($("#minPrice").val().toString());
            userInput.SearchParameters.MinimumPrice = minPrice;
            var maxPrice = parseInt($("#maxPrice").val().toString());
            userInput.SearchParameters.MaximumPrice = maxPrice;
            var orderBy = $("#orderBy").val().toString();
            userInput.SearchParameters.OrderBy = orderBy;
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
}); //ready
//# sourceMappingURL=index.js.map