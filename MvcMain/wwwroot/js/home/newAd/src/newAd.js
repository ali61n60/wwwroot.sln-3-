"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CategorySelectionNewAd_1 = require("../../../Components/Category/NewAd/CategorySelectionNewAd");
var NewAd = /** @class */ (function () {
    function NewAd(categorySelectorParentDivId, allCategoriesId) {
        this._categorySelectorParentDivId = categorySelectorParentDivId;
        this._allCategoriesId = allCategoriesId;
        this.initPage();
        this.initEventHandlers();
    }
    NewAd.prototype.initPage = function () {
        this.initNewAdCategory();
    };
    NewAd.prototype.initNewAdCategory = function () {
        var allCategoriesString = $("#" + this._allCategoriesId).val().toString();
        var allCategories = $.parseJSON(allCategoriesString);
        this._categorySelectionNewAd = new CategorySelectionNewAd_1.CategorySelectionNewAd(this._categorySelectorParentDivId, allCategories);
        this._categorySelectionNewAd.CreateFirstLevel();
    };
    NewAd.prototype.initEventHandlers = function () {
        var _this = this;
        this._categorySelectionNewAd.SelectedCategoryChangedEvent.Subscribe(function (sender, args) {
            if (_this._categorySelectionNewAd.SelectedCategoryHasChildren()) {
                console.log("has child " + args);
            }
            else {
                console.log("NONONONO child " + args);
            }
        });
    };
    return NewAd;
}());
$(document).ready(function () {
    $("#getPartialViewFromServer").on("click", function (event) {
        event.preventDefault();
        getPartialViewFromServer();
    }); //click
    $("#submitNewAd").on("click", function (event) {
        var $apiAddress = "getApiAddress()";
        alert($apiAddress);
    });
}); //ready
//CORE
function getPartialViewFromServer() {
    $.ajax({
        type: "GET",
        url: "/Home/GetNewAdPartialView",
        success: OnSuccessGetItemsFromServer,
        error: OnErrorGetItemsFromServer // When Service call fails
    }); //.ajax
}
function OnSuccessGetItemsFromServer(data) {
    $("#NewAdPlaceHolder").html(data);
    //  $("#adPlaceHolder").append(html);
} //end OnSuccessGetTimeFromServer
function OnErrorGetItemsFromServer(data) {
    alert(data);
} //end OnErrorGetTimeFromServer
var categorySelectorParentDivId = "categorySelector";
var allCategoriesId = "allCategories";
$(document).ready(function () {
    var newAd = new NewAd(categorySelectorParentDivId, allCategoriesId);
}); //ready
//# sourceMappingURL=newAd.js.map