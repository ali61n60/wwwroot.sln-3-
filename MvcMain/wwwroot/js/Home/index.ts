/// <reference path ="../../node_modules/@types/jquery/index.d.ts"/>


$(document).ready(function () {
    let serverCaller = new ServerCaller();
    $("#getAdFromServer").on("click",
        function (event) {
            event.preventDefault();
            let categoryId = new CategorySelection("#categorySelector").GetSelectedCategoryId();
            
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


class CategorySelection {
    private _parentDivId: string;

    constructor(parentDivId: string) {
        this._parentDivId = parentDivId;
    }

    public GetSelectedCategoryId(): number {
        var $category0 = $(this._parentDivId + " #category0");
        let categoryId = parseInt($category0.val().toString());
        if (categoryId === NaN)
            categoryId = 0;
        return categoryId;
    }
}

//Category Selection
$(document).ready(function () {
    //Add first level categories
    var $allCategoriesString = $("#allCategories").val().toString();
    var $allCategories = $.parseJSON($allCategoriesString);
    $allCategories.forEach(function (category) {
        if (category.parentCategoryId === 0) {
            $("#category0").append($("<option>", {
                value: category.categoryId,
                text: category.categoryName
            }));
        }//if
    });//forEach


    $("#category0").change(function () {
        $("#category1").remove();
        let $selectedId = $(this).val();
        var $select = $("<br/> <select id='category1' class='form-control'></select>")
            .append("<option value='0'>تمام آگهی ها</option>");
        $allCategories.forEach(function (category) {
            if (category.parentCategoryId == $selectedId) {
                $select.append($("<option>", {
                    value: category.categoryId,
                    text: category.categoryName
                }));
            }
        });//forEach
        $("#categorySelector").append($select);
        //TODO show second select  and populate it with data from server
    });//change
});//ready
