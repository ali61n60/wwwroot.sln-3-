"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CategorySelection_1 = require("../../../Components/Category/SearchAd/CategorySelection");
var ServerCaller_1 = require("./ServerCaller");
var SearchCriteriaLoader_1 = require("./SearchCriteriaLoader");
var SearchAdUserInput_1 = require("./SearchAdUserInput");
var Index = /** @class */ (function () {
    function Index(categorySelectorParentDivId, allCategoriesId, getAdFromServerId) {
        this._serverCaller = new ServerCaller_1.ServerCaller();
        this._searchCriteriaLoader = new SearchCriteriaLoader_1.SearchCriteriaLoader("categorySpecificSearchCriteria", this);
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
            _this._searchCriteriaLoader.GetSearchCriteriaViewFromServer(args);
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
            var categoryId = _this._categorySelection.GetSelectedCategoryId();
            var minPrice = parseInt($("#minPrice").val().toString());
            var maxPrice = parseInt($("#maxPrice").val().toString());
            var orderBy = $("#orderBy").val().toString();
            var userInput = new SearchAdUserInput_1.SearchAdUserInput();
            userInput.SearchParameters.CategoryId = categoryId; //100 for cars
            userInput.SearchParameters.MinimumPrice = minPrice;
            userInput.SearchParameters.MaximumPrice = maxPrice;
            userInput.SearchParameters.OrderBy = orderBy;
            //TODO What about category specific search parameters
            _this.fillCategorySpecificSearchCriteria(userInput);
            _this._serverCaller.GetAdItemsFromServer(userInput);
        }); //click
    }; //initGetAdFromServer
    Index.prototype.fillCategorySpecificSearchCriteria = function (userInput) {
        var categoryId = this._categorySelection.GetSelectedCategoryId();
        switch (categoryId) {
            case 100:
                userInput.SearchParameters.BrandId = 100;
                userInput.SearchParameters.ModelId = 21;
                break;
            default:
                userInput.SearchParameters.defaultParameter = 1234;
                break;
        }
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
}); //ready
//# sourceMappingURL=index.js.map