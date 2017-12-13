"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CategorySelection_1 = require("../../../Components/CategorySelection");
var ServerCaller_1 = require("./ServerCaller");
var Index = (function () {
    function Index() {
        this.serverCaller = new ServerCaller_1.ServerCaller();
        this.initPage();
    }
    Index.prototype.initPage = function () {
        var _this = this;
        $(document).ready(function () {
            _this.initCategorySelectionControl(_this.categorySelection);
            _this.initGetAdFromServer();
        }); //ready
        $(document).ready(function () {
            //show detail of singleAdItem when mouse over
            $(document).on("mouseenter mouseleave", ".blockDisplay", function (event) {
                $(event.currentTarget).find(".moreInfo").fadeToggle(250);
                //$(this).find(".moreInfo").fadeToggle(250);
            }); //end on
        }); //end ready
    };
    Index.prototype.initCategorySelectionControl = function (categorySelection) {
        //Add first level categories
        var allCategoriesString = $("#allCategories").val().toString();
        var allCategories = $.parseJSON(allCategoriesString);
        categorySelection = new CategorySelection_1.CategorySelection("categorySelector", allCategories);
        categorySelection.SelectedCategoryChanged.Subscribe(function (sender, args) {
            alert("selected category changed " + args);
        });
        categorySelection.CreateFirstLevel();
    };
    Index.prototype.initGetAdFromServer = function () {
        var _this = this;
        $("#getAdFromServer").on("click", function (event) {
            event.preventDefault();
            var categoryId = _this.categorySelection.GetSelectedCategoryId();
            var minPrice = parseInt($("#minPrice").val().toString());
            var maxPrice = parseInt($("#maxPrice").val().toString());
            var orderBy = $("#orderBy").val().toString();
            _this.serverCaller.GetAdItemsFromServer(categoryId, minPrice, maxPrice, orderBy);
        }); //click
    };
    return Index;
}());
var index = new Index();
//# sourceMappingURL=index.js.map