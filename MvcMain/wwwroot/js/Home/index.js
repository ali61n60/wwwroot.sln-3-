var $initialStart = 1;
var $start = 1;
var $count = 5;
var $requestIndex = 0;
var $previousRequestIndex = -1;
var $isServerCalled = false;
var $numberOfStartServerCallNotification = 0;

$(document).ready(function () {
    $("#getAdFromServer").on("click",
        function (event) {
            event.preventDefault();
            getAdItemsFromServer();
        }); //click
});//ready

//CORE
function getAdItemsFromServer() {
    if ($isServerCalled && ($previousRequestIndex === $requestIndex)) {//a call is sent but no answer yet
        return;
    }//if
    else {
        $previousRequestIndex = $requestIndex;
        $isServerCalled = true;
    }//else
    var $userInput = {};
    $userInput.StartIndex = $start;
    $userInput.Count = $count;
    $userInput.CategoryId = $("#category0").val();//100 for cars
    $userInput.MinimumPrice = $("#minPrice").val();
    $userInput.MaximumPrice = $("#maxPrice").val();
    $userInput.OrderBy = $("#orderBy").val();

    //var $myDictionary={};// = searchCriteriaObject.getSearchOptionDictionary();
    $userInput.RequestIndex = $requestIndex;
    //notifyUserAjaxCallStarted();

    $.ajax({
        type: "POST", //GET or POST or PUT or DELETE verb
        url: "api/AdApi/GetAdvertisementCommon",
        data: JSON.stringify($userInput), //Data sent to server
        contentType: 'application/json', // content type sent to server
        success: OnSuccessGetItemsFromServer,//On Successfull service call
        error: OnErrorGetItemsFromServer// When Service call fails
    });//.ajax
}

function OnSuccessGetItemsFromServer(msg) {
    //notifyUserAjaxCallFinished();
    if (msg.success == true) {
        if (msg.customDictionary["RequestIndex"] == $requestIndex) {
            $start += parseInt(msg.customDictionary["numberOfItems"]);
            var template = $('#singleAdItem').html();
            var data;
            for (var i = 0; i < msg.responseData.length; i++) {
                var adImage = null;
                if (msg.responseData[i].advertisementImages[0] != null) {
                    adImage = "data:image/jpg;base64," + msg.responseData[i].advertisementImages[0];
                } //end if
                data = {
                    AdvertisementId: msg.responseData[i].advertisementId,
                    AdvertisementCategoryId: msg.responseData[i].advertisementCategoryId,
                    AdvertisementCategory: msg.responseData[i].advertisementCategory,
                    adImage: adImage,
                    adPrice: msg.responseData[i].advertisementPrice.price, //todo check the price type
                    AdvertisementTitle: msg.responseData[i].advertisementTitle,
                    AdvertisementStatus: msg.responseData[i].advertisementStatus
                    //adDate: msg.ResponseData[i].AdTime
                } //end data

                var html = Mustache.to_html(template, data);
                $("#adPlaceHolder").append(html);
            } //end for
        }//end if
    }//end if
    else {
        //showErrorMessage(msg.Message + " , " + msg.ErrorCode);
    }
    $isServerCalled = false;
    $requestIndex++;
}//end OnSuccessGetTimeFromServer

function OnErrorGetItemsFromServer(XMLHttpRequest, textStatus, errorThrown) {
    $isServerCalled = false;
    $requestIndex++;
    //notifyUserAjaxCallFinished();
    //showErrorMessage(textStatus + " , " + errorThrown);
}//end OnErrorGetTimeFromServer

$(document).ready(function () {

    //show detail of singleAdItem when mouse over
    $(document).on("mouseenter mouseleave", ".blockDisplay", function () {
        $(this).find(".moreInfo").fadeToggle(250);
    });//end on

});//end ready

//Category Selection
$(document).ready(function () {
    //Add first level categories
    var $allCategoriesString = $("#allCategories").val();
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
        $selectedId = $(this).val();
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
