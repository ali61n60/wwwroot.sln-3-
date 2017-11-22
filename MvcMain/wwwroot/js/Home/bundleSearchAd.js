/// <reference path ="../../node_modules/@types/jquery/index.d.ts"/>
$(document).ready(function () {
    var serverCaller = new ServerCaller();
    $("#getAdFromServer").on("click", function (event) {
        event.preventDefault();
        var categoryId = new CategorySelection("#categorySelector", null).GetSelectedCategoryId();
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
var SearchAdUserInput = (function () {
    function SearchAdUserInput() {
    }
    return SearchAdUserInput;
}());
//# sourceMappingURL=SearchAdUserInput.js.map
/// <reference path ="../../node_modules/@types/jquery/index.d.ts"/>
/// <reference path ="../../node_modules/@types/mustache/index.d.ts"/>
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
    ServerCaller.prototype.GetAdItemsFromServer = function (categoryId, minPrice, maxPrice, orderBy) {
        var userInput = new SearchAdUserInput();
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
        userInput.CategoryId = categoryId; //100 for cars
        userInput.MinimumPrice = minPrice;
        userInput.MaximumPrice = maxPrice;
        userInput.OrderBy = orderBy;
        userInput.RequestIndex = this._requestIndex;
        //notifyUserAjaxCallStarted();
        var self = this;
        $.ajax({
            type: "POST",
            url: "api/AdApi/GetAdvertisementCommon",
            data: JSON.stringify(userInput),
            contentType: 'application/json',
            success: function (arg) {
                self.onSuccessGetItemsFromServer(arg);
            },
            error: self.onErrorGetItemsFromServer // When Service call fails
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
//# sourceMappingURL=ServerCaller.js.map
var Category = (function () {
    function Category() {
    }
    return Category;
}());
var CategorySelection = (function () {
    function CategorySelection(parentDivId, allCategories) {
        this._firstLevelSelectId = "category1";
        this._secondLevelSelectId = "category2";
        this._thirdLevelSelectId = "category3";
        this._rootCategoryId = 0;
        this._parentDivId = parentDivId;
        this._allCategories = allCategories;
    }
    CategorySelection.prototype.GetSelectedCategoryId = function () {
        if (CategorySelection._selectedCategoryIdLevelThree !== this._rootCategoryId)
            return CategorySelection._selectedCategoryIdLevelThree;
        else if (CategorySelection._selectedCategoryIdLevelTwo !== this._rootCategoryId)
            return CategorySelection._selectedCategoryIdLevelTwo;
        else
            return CategorySelection._selectedCategoryIdLevelOne;
    }; //GetSelectedCategoryId
    CategorySelection.prototype.CreateFirstLevel = function () {
        var self = this;
        CategorySelection._selectedCategoryIdLevelOne = this._rootCategoryId;
        this._allCategories.forEach(function (category) {
            if (category.parentCategoryId === self._rootCategoryId) {
                $("#" + self._firstLevelSelectId).append($("<option>", {
                    value: category.categoryId,
                    text: category.categoryName
                }));
            } //if
        }); //forEach
        $("#" + this._firstLevelSelectId).change(function () {
            var selectedId = parseInt($(this).val().toString());
            CategorySelection._selectedCategoryIdLevelOne = selectedId;
            self.CreateSecondLevel(selectedId);
        }); //change
    }; //CreateFirstLevel
    CategorySelection.prototype.CreateSecondLevel = function (firstLevelCategoryId) {
        var self = this;
        CategorySelection._selectedCategoryIdLevelTwo = this._rootCategoryId;
        $("#" + this._secondLevelSelectId).remove();
        $("#" + this._thirdLevelSelectId).remove();
        if (firstLevelCategoryId === this._rootCategoryId) {
            return;
        }
        var $select = $("<select id=\"" + this._secondLevelSelectId + "\" class=\"form-control\"></select>")
            .append("<option value=\"" + this._rootCategoryId + "\">\u062A\u0645\u0627\u0645 \u0622\u06AF\u0647\u06CC \u0647\u0627</option>");
        this._allCategories.forEach(function (category) {
            if (category.parentCategoryId === firstLevelCategoryId) {
                $select.append($("<option>", {
                    value: category.categoryId,
                    text: category.categoryName
                }));
            }
        }); //forEach
        $("#" + this._parentDivId).append($select);
        $("#" + this._secondLevelSelectId).change(function () {
            var selectedId = parseInt($(this).val().toString());
            CategorySelection._selectedCategoryIdLevelTwo = selectedId;
            self.CreateThirdLevel(selectedId);
        }); //change
    };
    CategorySelection.prototype.CreateThirdLevel = function (secondLevelCategoryId) {
        var self = this;
        CategorySelection._selectedCategoryIdLevelThree = this._rootCategoryId;
        $("#" + this._thirdLevelSelectId).remove();
        if (secondLevelCategoryId === this._rootCategoryId) {
            return;
        }
        var $select = $("<select id=\"" + this._thirdLevelSelectId + "\" class=\"form-control\"></select>")
            .append("<option value=\"" + this._rootCategoryId + "\">\u062A\u0645\u0627\u0645 \u0622\u06AF\u0647\u06CC \u0647\u0627</option>");
        this._allCategories.forEach(function (category) {
            if (category.parentCategoryId === secondLevelCategoryId) {
                $select.append($("<option>", {
                    value: category.categoryId,
                    text: category.categoryName
                }));
            }
        }); //forEach
        $("#" + this._parentDivId).append($select);
        $("#" + this._thirdLevelSelectId).change(function () {
            var selectedId = parseInt($(this).val().toString());
            CategorySelection._selectedCategoryIdLevelThree = selectedId;
        }); //change
    };
    return CategorySelection;
}());
//Category Selection
$(document).ready(function () {
    //Add first level categories
    var allCategoriesString = $("#allCategories").val().toString();
    var allCategories = $.parseJSON(allCategoriesString);
    var categorySelection = new CategorySelection("categorySelector", allCategories);
    categorySelection.CreateFirstLevel();
}); //ready
//# sourceMappingURL=CategorySelection.js.map