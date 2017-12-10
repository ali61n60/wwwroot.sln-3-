import {Category,CategorySelection} from "../../../Components/CategorySelection";
import { ServerCaller } from "./ServerCaller";

$(document).ready(function () {
    let serverCaller = new ServerCaller();
    $("#getAdFromServer").on("click",function (event) {
            event.preventDefault();
            let categoryId = new CategorySelection("#categorySelector",null).GetSelectedCategoryId();
            
            var minPrice=parseInt($("#minPrice").val().toString());
            var maxPrice=parseInt($("#maxPrice").val().toString());
            var orderBy= $("#orderBy").val().toString();

            serverCaller.GetAdItemsFromServer(categoryId,minPrice,maxPrice,orderBy);
        }); //click
});//ready



$(document).ready(function () {

    //show detail of singleAdItem when mouse over
    $(document).on("mouseenter mouseleave", ".blockDisplay", function () {
        $(this).find(".moreInfo").fadeToggle(250);
    });//end on

});//end ready

//Category Selection
//TODO move it to app.js file
$(document).ready(function () {
    //Add first level categories
    var allCategoriesString = $("#allCategories").val().toString();
    var allCategories = $.parseJSON(allCategoriesString) as Category[];
    let categorySelection = new CategorySelection("categorySelector", allCategories);
    categorySelection.CreateFirstLevel();
});//ready





