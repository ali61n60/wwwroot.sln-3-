"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CategorySelection_1 = require("../../../Components/CategorySelection");
var ServerCaller_1 = require("./ServerCaller");
$(document).ready(function () {
    var serverCaller = new ServerCaller_1.ServerCaller();
    $("#getAdFromServer").on("click", function (event) {
        event.preventDefault();
        var categoryId = new CategorySelection_1.CategorySelection("#categorySelector", null).GetSelectedCategoryId();
        var minPrice = parseInt($("#minPrice").val().toString());
        var maxPrice = parseInt($("#maxPrice").val().toString());
        var orderBy = $("#orderBy").val().toString();
        serverCaller.GetAdItemsFromServer(categoryId, minPrice, maxPrice, orderBy);
    }); //click
}); //ready
$(document).ready(function () {
    //show detail of singleAdItem when mouse over
    $(document).on("mouseenter mouseleave", ".blockDisplay", function () {
        $(this).find(".moreInfo").fadeToggle(250);
    }); //end on
}); //end ready
//# sourceMappingURL=index.js.map