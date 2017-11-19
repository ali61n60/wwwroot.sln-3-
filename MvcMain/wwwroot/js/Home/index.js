var UserInput = (function () {
    function UserInput() {
    }
    return UserInput;
}());
var ServerCaller = (function () {
    function ServerCaller() {
        this._initialStart = 1;
        this._start = 1;
        this._count = 5;
        this._requestIndex = 0;
        this._previousRequestIndex = -1;
        this._isServerCalled = false;
        this._numberOfStartServerCallNotification = 0;
    }
    ServerCaller.prototype.GetAdItemsFromServer = function () {
        var userInput = new UserInput();
        if (this._isServerCalled && (this._previousRequestIndex === this._requestIndex)) {
            return;
        } //if
        else {
            this._previousRequestIndex = this._requestIndex;
            this._isServerCalled = true;
        } //else
        userInput.StartIndex = this._start;
        userInput.Count = this._count;
        //TODO pass the object to the category selector element and let it fill the categoryId
        //OR call a method on category selector element to get categoryId
        userInput.CategoryId = $("#category0").val(); //100 for cars
        userInput.MinimumPrice = $("#minPrice").val();
        userInput.MaximumPrice = $("#maxPrice").val();
        userInput.OrderBy = $("#orderBy").val();
        //var $myDictionary={};// = searchCriteriaObject.getSearchOptionDictionary();
        userInput.RequestIndex = this._requestIndex;
        //notifyUserAjaxCallStarted();
        $.ajax({
            type: "POST",
            url: "api/AdApi/GetAdvertisementCommon",
            data: JSON.stringify(userInput),
            contentType: 'application/json',
            success: this.onSuccessGetItemsFromServer,
            error: this.onErrorGetItemsFromServer // When Service call fails
            // When Service call fails
        }); //.ajax
    }; //GetAdItemsFromServer
    ServerCaller.prototype.onSuccessGetItemsFromServer = function (msg) {
        //notifyUserAjaxCallFinished();
        if (msg.success == true) {
            if (msg.customDictionary["RequestIndex"] == this._requestIndex) {
                this._start += parseInt(msg.customDictionary["numberOfItems"]);
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
                        adPrice: msg.responseData[i].advertisementPrice.price,
                        AdvertisementTitle: msg.responseData[i].advertisementTitle,
                        AdvertisementStatus: msg.responseData[i].advertisementStatus
                        //adDate: msg.ResponseData[i].AdTime
                    }; //end data
                    var html = Mustache.to_html(template, data);
                    $("#adPlaceHolder").append(html);
                } //end for
            } //end if
        } //end if
        else {
            //showErrorMessage(msg.Message + " , " + msg.ErrorCode);
        }
        this._isServerCalled = false;
        this._requestIndex++;
    }; //end OnSuccessGetTimeFromServer
    ServerCaller.prototype.onErrorGetItemsFromServer = function (XMLHttpRequest, textStatus, errorThrown) {
        this._isServerCalled = false;
        this._requestIndex++;
        //notifyUserAjaxCallFinished();
        //showErrorMessage(textStatus + " , " + errorThrown);
    }; //end OnErrorGetTimeFromServer
    return ServerCaller;
}());
$(document).ready(function () {
    var serverCaller = new ServerCaller();
    $("#getAdFromServer").on("click", function (event) {
        event.preventDefault();
        serverCaller.GetAdItemsFromServer();
    }); //click
}); //ready
$(document).ready(function () {
    //show detail of singleAdItem when mouse over
    $(document).on("mouseenter mouseleave", ".blockDisplay", function () {
        $(this).find(".moreInfo").fadeToggle(250);
    }); //end on
}); //end ready
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
        } //if
    }); //forEach
    $("#category0").change(function () {
        $("#category1").remove();
        var $selectedId = $(this).val();
        var $select = $("<br/> <select id='category1' class='form-control'></select>")
            .append("<option value='0'>تمام آگهی ها</option>");
        $allCategories.forEach(function (category) {
            if (category.parentCategoryId == $selectedId) {
                $select.append($("<option>", {
                    value: category.categoryId,
                    text: category.categoryName
                }));
            }
        }); //forEach
        $("#categorySelector").append($select);
        //TODO show second select  and populate it with data from server
    }); //change
}); //ready
//# sourceMappingURL=index.js.map