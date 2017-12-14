(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventDispatcher_1 = require("../Events/EventDispatcher");
var CategorySelection = /** @class */ (function () {
    function CategorySelection(parentDivId, allCategories) {
        this._firstLevelSelectId = "category1";
        this._secondLevelSelectId = "category2";
        this._thirdLevelSelectId = "category3";
        this._rootCategoryId = 0;
        this.SelectedCategoryChanged = new EventDispatcher_1.EventDispatcher();
        this._parentDivId = parentDivId;
        this._allCategories = allCategories;
    }
    CategorySelection.prototype.GetSelectedCategoryId = function () {
        if (this._selectedCategoryIdLevelThree !== this._rootCategoryId)
            return this._selectedCategoryIdLevelThree;
        else if (this._selectedCategoryIdLevelTwo !== this._rootCategoryId)
            return this._selectedCategoryIdLevelTwo;
        else
            return this._selectedCategoryIdLevelOne;
    }; //GetSelectedCategoryId
    CategorySelection.prototype.CreateFirstLevel = function () {
        var _this = this;
        this._selectedCategoryIdLevelOne = this._rootCategoryId;
        this._allCategories.forEach(function (category) {
            if (category.parentCategoryId === _this._rootCategoryId) {
                $("#" + _this._firstLevelSelectId).append($("<option>", {
                    value: category.categoryId,
                    text: category.categoryName
                }));
            } //if
        }); //forEach
        $("#" + this._firstLevelSelectId).change(function (event) {
            var selectedId = parseInt($(event.currentTarget).val().toString());
            _this._selectedCategoryIdLevelOne = selectedId;
            _this.createSecondLevel(selectedId);
            _this.SelectedCategoryChanged.dispatch(_this, _this.GetSelectedCategoryId());
        }); //change
    }; //CreateFirstLevel
    CategorySelection.prototype.createSecondLevel = function (firstLevelCategoryId) {
        var _this = this;
        this._selectedCategoryIdLevelTwo = this._rootCategoryId;
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
        $("#" + this._secondLevelSelectId).change(function (event) {
            var selectedId = parseInt($(event.currentTarget).val().toString());
            _this._selectedCategoryIdLevelTwo = selectedId;
            _this.CreateThirdLevel(selectedId);
            _this.SelectedCategoryChanged.dispatch(_this, _this.GetSelectedCategoryId());
        }); //change
    };
    CategorySelection.prototype.CreateThirdLevel = function (secondLevelCategoryId) {
        var _this = this;
        this._selectedCategoryIdLevelThree = this._rootCategoryId;
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
        $("#" + this._thirdLevelSelectId).change(function (event) {
            var selectedId = parseInt($(event.currentTarget).val().toString());
            _this._selectedCategoryIdLevelThree = selectedId;
            _this.SelectedCategoryChanged.dispatch(_this, _this.GetSelectedCategoryId());
        }); //change
    };
    return CategorySelection;
}());
exports.CategorySelection = CategorySelection;
},{"../Events/EventDispatcher":2}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* The dispatcher handles the storage of subsciptions and facilitates
  subscription, unsubscription and dispatching of the event */
var EventDispatcher = /** @class */ (function () {
    function EventDispatcher() {
        this._subscriptions = new Array();
    }
    EventDispatcher.prototype.Subscribe = function (fn) {
        if (fn) {
            this._subscriptions.push(fn);
        }
    };
    EventDispatcher.prototype.Unsubscribe = function (fn) {
        var i = this._subscriptions.indexOf(fn);
        if (i > -1) {
            this._subscriptions.splice(i, 1);
        }
    };
    EventDispatcher.prototype.dispatch = function (sender, args) {
        for (var _i = 0, _a = this._subscriptions; _i < _a.length; _i++) {
            var handler = _a[_i];
            handler(sender, args);
        }
    };
    return EventDispatcher;
}());
exports.EventDispatcher = EventDispatcher;
},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SearchAdUserInput = /** @class */ (function () {
    function SearchAdUserInput() {
    }
    return SearchAdUserInput;
}());
exports.SearchAdUserInput = SearchAdUserInput;
},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SearchAdUserInput_1 = require("./SearchAdUserInput");
var ServerCaller = /** @class */ (function () {
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
        var userInput = new SearchAdUserInput_1.SearchAdUserInput();
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
    ServerCaller.prototype.ResetSearchParameters = function () {
        this._start = this._initialStart;
    };
    return ServerCaller;
}());
exports.ServerCaller = ServerCaller;
},{"./SearchAdUserInput":3}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CategorySelection_1 = require("../../../Components/CategorySelection");
var ServerCaller_1 = require("./ServerCaller");
var Index = /** @class */ (function () {
    function Index(categorySelectorParentDivId, allCategoriesId, getAdFromServerId) {
        this._serverCaller = new ServerCaller_1.ServerCaller();
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
        this._categorySelection.SelectedCategoryChanged.Subscribe(function (sender, args) {
            $("#adPlaceHolder").children().remove();
            _this._serverCaller.ResetSearchParameters();
        });
    };
    Index.prototype.initGetAdFromServer = function () {
        var _this = this;
        $("#" + this._getAdFromServerId).on("click", function (event) {
            event.preventDefault();
            var categoryId = _this._categorySelection.GetSelectedCategoryId();
            var minPrice = parseInt($("#minPrice").val().toString());
            var maxPrice = parseInt($("#maxPrice").val().toString());
            var orderBy = $("#orderBy").val().toString();
            _this._serverCaller.GetAdItemsFromServer(categoryId, minPrice, maxPrice, orderBy);
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
var categorySelectorParentDivId = "categorySelector";
var getAdFromServerId = "getAdFromServer";
var allCategoriesId = "allCategories";
$(document).ready(function () {
    var index = new Index(categorySelectorParentDivId, allCategoriesId, getAdFromServerId);
}); //ready
},{"../../../Components/CategorySelection":1,"./ServerCaller":4}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3d3dyb290L2pzL0NvbXBvbmVudHMvQ2F0ZWdvcnlTZWxlY3Rpb24udHMiLCJ3d3dyb290L2pzL0V2ZW50cy9FdmVudERpc3BhdGNoZXIudHMiLCJ3d3dyb290L2pzL2hvbWUvaW5kZXgvc3JjL1NlYXJjaEFkVXNlcklucHV0LnRzIiwid3d3cm9vdC9qcy9ob21lL2luZGV4L3NyYy9TZXJ2ZXJDYWxsZXIudHMiLCJ3d3dyb290L2pzL2hvbWUvaW5kZXgvc3JjL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQyw2REFBMEQ7QUFLM0Q7SUFnQkksMkJBQVksV0FBbUIsRUFBRSxhQUF5QjtRQVh6Qyx3QkFBbUIsR0FBVyxXQUFXLENBQUM7UUFDMUMseUJBQW9CLEdBQVcsV0FBVyxDQUFDO1FBQzNDLHdCQUFtQixHQUFXLFdBQVcsQ0FBQztRQUMxQyxvQkFBZSxHQUFXLENBQUMsQ0FBQztRQU10Qyw0QkFBdUIsR0FBK0MsSUFBSSxpQ0FBZSxFQUE2QixDQUFDO1FBRzFILElBQUksQ0FBQyxZQUFZLEdBQUcsV0FBVyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxjQUFjLEdBQUcsYUFBYSxDQUFDO0lBQ3hDLENBQUM7SUFFTSxpREFBcUIsR0FBNUI7UUFDSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsNkJBQTZCLEtBQUssSUFBSSxDQUFDLGVBQWUsQ0FBQztZQUM1RCxNQUFNLENBQUMsSUFBSSxDQUFDLDZCQUE2QixDQUFDO1FBQzlDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsMkJBQTJCLEtBQUssSUFBSSxDQUFDLGVBQWUsQ0FBQztZQUMvRCxNQUFNLENBQUMsSUFBSSxDQUFDLDJCQUEyQixDQUFDO1FBQzVDLElBQUk7WUFDQSxNQUFNLENBQUMsSUFBSSxDQUFDLDJCQUEyQixDQUFDO0lBR2hELENBQUMsRUFBQSx1QkFBdUI7SUFFakIsNENBQWdCLEdBQXZCO1FBQUEsaUJBbUJDO1FBakJHLElBQUksQ0FBQywyQkFBMkIsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDO1FBQ3hELElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLFVBQUEsUUFBUTtZQUNoQyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLEtBQUssS0FBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JELENBQUMsQ0FBQyxHQUFHLEdBQUcsS0FBSSxDQUFDLG1CQUFtQixDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUU7b0JBQ25ELEtBQUssRUFBRSxRQUFRLENBQUMsVUFBVTtvQkFDMUIsSUFBSSxFQUFFLFFBQVEsQ0FBQyxZQUFZO2lCQUM5QixDQUFDLENBQUMsQ0FBQztZQUNSLENBQUMsQ0FBQSxJQUFJO1FBQ1QsQ0FBQyxDQUFDLENBQUMsQ0FBQSxTQUFTO1FBRVosQ0FBQyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBQyxLQUFLO1lBQzNDLElBQUksVUFBVSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7WUFDbkUsS0FBSSxDQUFDLDJCQUEyQixHQUFHLFVBQVUsQ0FBQztZQUM5QyxLQUFJLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDbkMsS0FBSSxDQUFDLHVCQUF1QixDQUFDLFFBQVEsQ0FBQyxLQUFJLEVBQUUsS0FBSSxDQUFDLHFCQUFxQixFQUFFLENBQUMsQ0FBQztRQUM5RSxDQUFDLENBQUMsQ0FBQyxDQUFBLFFBQVE7SUFFZixDQUFDLEVBQUEsa0JBQWtCO0lBRVgsNkNBQWlCLEdBQXpCLFVBQTBCLG9CQUE0QjtRQUF0RCxpQkEwQkM7UUF4QkcsSUFBSSxDQUFDLDJCQUEyQixHQUFHLElBQUksQ0FBQyxlQUFlLENBQUM7UUFDeEQsQ0FBQyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUM1QyxDQUFDLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQzNDLEVBQUUsQ0FBQyxDQUFDLG9CQUFvQixLQUFLLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO1lBQ2hELE1BQU0sQ0FBQztRQUNYLENBQUM7UUFDRCxJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUMsa0JBQWUsSUFBSSxDQUFDLG9CQUFvQix3Q0FBa0MsQ0FBQzthQUN0RixNQUFNLENBQUMscUJBQWtCLElBQUksQ0FBQyxlQUFlLCtFQUF5QixDQUFDLENBQUM7UUFDN0UsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsVUFBQSxRQUFRO1lBQ2hDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsS0FBSyxvQkFBb0IsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JELE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRTtvQkFDekIsS0FBSyxFQUFFLFFBQVEsQ0FBQyxVQUFVO29CQUMxQixJQUFJLEVBQUUsUUFBUSxDQUFDLFlBQVk7aUJBQzlCLENBQUMsQ0FBQyxDQUFDO1lBQ1IsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDLENBQUEsU0FBUztRQUNaLENBQUMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUUzQyxDQUFDLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFDLEtBQUs7WUFDNUMsSUFBSSxVQUFVLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztZQUNuRSxLQUFJLENBQUMsMkJBQTJCLEdBQUcsVUFBVSxDQUFDO1lBQzlDLEtBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNsQyxLQUFJLENBQUMsdUJBQXVCLENBQUMsUUFBUSxDQUFDLEtBQUksRUFBRSxLQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxDQUFDO1FBQzlFLENBQUMsQ0FBQyxDQUFDLENBQUEsUUFBUTtJQUNmLENBQUM7SUFFRCw0Q0FBZ0IsR0FBaEIsVUFBaUIscUJBQTZCO1FBQTlDLGlCQXVCQztRQXRCRyxJQUFJLENBQUMsNkJBQTZCLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQztRQUMxRCxDQUFDLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQzNDLEVBQUUsQ0FBQyxDQUFDLHFCQUFxQixLQUFLLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO1lBQ2pELE1BQU0sQ0FBQztRQUNYLENBQUM7UUFDRCxJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUMsa0JBQWUsSUFBSSxDQUFDLG1CQUFtQix3Q0FBa0MsQ0FBQzthQUNyRixNQUFNLENBQUMscUJBQWtCLElBQUksQ0FBQyxlQUFlLCtFQUF5QixDQUFDLENBQUM7UUFDN0UsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsVUFBQSxRQUFRO1lBQ2hDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsS0FBSyxxQkFBcUIsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RELE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRTtvQkFDekIsS0FBSyxFQUFFLFFBQVEsQ0FBQyxVQUFVO29CQUMxQixJQUFJLEVBQUUsUUFBUSxDQUFDLFlBQVk7aUJBQzlCLENBQUMsQ0FBQyxDQUFDO1lBQ1IsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDLENBQUEsU0FBUztRQUNaLENBQUMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUUzQyxDQUFDLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFDLEtBQUs7WUFDM0MsSUFBSSxVQUFVLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztZQUNuRSxLQUFJLENBQUMsNkJBQTZCLEdBQUcsVUFBVSxDQUFDO1lBQ2hELEtBQUksQ0FBQyx1QkFBdUIsQ0FBQyxRQUFRLENBQUMsS0FBSSxFQUFFLEtBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLENBQUM7UUFDOUUsQ0FBQyxDQUFDLENBQUMsQ0FBQSxRQUFRO0lBQ2YsQ0FBQztJQUNMLHdCQUFDO0FBQUQsQ0F6R0EsQUF5R0MsSUFBQTtBQXpHWSw4Q0FBaUI7Ozs7QUNGOUI7OERBQzhEO0FBQzlEO0lBQUE7UUFFWSxtQkFBYyxHQUFrRCxJQUFJLEtBQUssRUFBMEMsQ0FBQztJQW9CaEksQ0FBQztJQWxCRyxtQ0FBUyxHQUFULFVBQVUsRUFBMEM7UUFDaEQsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNMLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2pDLENBQUM7SUFDTCxDQUFDO0lBRUQscUNBQVcsR0FBWCxVQUFZLEVBQTBDO1FBQ2xELElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3hDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDVCxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDckMsQ0FBQztJQUNMLENBQUM7SUFFRCxrQ0FBUSxHQUFSLFVBQVMsTUFBZSxFQUFFLElBQVc7UUFDakMsR0FBRyxDQUFDLENBQWdCLFVBQW1CLEVBQW5CLEtBQUEsSUFBSSxDQUFDLGNBQWMsRUFBbkIsY0FBbUIsRUFBbkIsSUFBbUI7WUFBbEMsSUFBSSxPQUFPLFNBQUE7WUFDWixPQUFPLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQ3pCO0lBQ0wsQ0FBQztJQUNMLHNCQUFDO0FBQUQsQ0F0QkEsQUFzQkMsSUFBQTtBQXRCYSwwQ0FBZTs7OztBQ0w1QjtJQUFBO0lBUUQsQ0FBQztJQUFELHdCQUFDO0FBQUQsQ0FSQyxBQVFBLElBQUE7QUFSYSw4Q0FBaUI7Ozs7QUNBOUIseURBQXdEO0FBQ3pEO0lBQUE7UUFDWSxrQkFBYSxHQUFXLENBQUMsQ0FBQztRQUMxQixXQUFNLEdBQVcsQ0FBQyxDQUFDO1FBQ25CLFdBQU0sR0FBVyxDQUFDLENBQUM7UUFDbkIsa0JBQWEsR0FBVyxDQUFDLENBQUM7UUFDMUIsMEJBQXFCLEdBQVcsQ0FBQyxDQUFDLENBQUM7UUFDbkMsb0JBQWUsR0FBWSxLQUFLLENBQUM7UUFDakMseUNBQW9DLEdBQVcsQ0FBQyxDQUFDO0lBc0Y3RCxDQUFDO0lBcEZVLDJDQUFvQixHQUEzQixVQUE0QixVQUFrQixFQUMxQyxRQUFnQixFQUNoQixRQUFnQixFQUNoQixPQUFlO1FBQ2YsSUFBSSxTQUFTLEdBQUcsSUFBSSxxQ0FBaUIsRUFBRSxDQUFDO1FBQ3hDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLElBQUksQ0FBQyxJQUFJLENBQUMscUJBQXFCLEtBQUssSUFBSSxDQUFDLGFBQWEsQ0FDOUUsQ0FBQyxDQUFDLENBQUM7WUFDQyxNQUFNLENBQUM7UUFDWCxDQUFDLENBQUMsSUFBSTtRQUNOLElBQUksQ0FBQyxDQUFDO1lBQ0YsSUFBSSxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7WUFDaEQsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7UUFDaEMsQ0FBQyxDQUFDLE1BQU07UUFFUixTQUFTLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDbkMsU0FBUyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQzlCLHNGQUFzRjtRQUN0RixpRUFBaUU7UUFDakUsU0FBUyxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUMsQ0FBQyxjQUFjO1FBQ2pELFNBQVMsQ0FBQyxZQUFZLEdBQUcsUUFBUSxDQUFDO1FBQ2xDLFNBQVMsQ0FBQyxZQUFZLEdBQUcsUUFBUSxDQUFDO1FBQ2xDLFNBQVMsQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQzVCLFNBQVMsQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQztRQUU1Qyw4QkFBOEI7UUFDOUIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2hCLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDSCxJQUFJLEVBQUUsTUFBTTtZQUNaLEdBQUcsRUFBRSxrQ0FBa0M7WUFDdkMsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDO1lBQy9CLFdBQVcsRUFBRSxrQkFBa0I7WUFDL0IsT0FBTyxFQUFFLFVBQVUsR0FBRztnQkFDbEIsSUFBSSxDQUFDLDJCQUEyQixDQUFDLEdBQUcsQ0FBQyxDQUFBO1lBQ3pDLENBQUM7WUFDRCxLQUFLLEVBQUUsSUFBSSxDQUFDLHlCQUF5QixDQUFDLDBCQUEwQjtZQUNoRSwwQkFBMEI7U0FDN0IsQ0FBQyxDQUFDLENBQUMsT0FBTztJQUNmLENBQUMsRUFBQyxzQkFBc0I7SUFFaEIsa0RBQTJCLEdBQW5DLFVBQW9DLEdBQUc7UUFDbkMsK0JBQStCO1FBQy9CLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztZQUN0QixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsY0FBYyxDQUFDLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7Z0JBQzdELElBQUksQ0FBQyxNQUFNLElBQUksUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO2dCQUMvRCxJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ3pDLElBQUksSUFBSSxDQUFDO2dCQUNULEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztvQkFDL0MsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDO29CQUNuQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7d0JBQ3JELE9BQU8sR0FBRyx3QkFBd0IsR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNwRixDQUFDLENBQUMsUUFBUTtvQkFDVixJQUFJLEdBQUc7d0JBQ0gsZUFBZSxFQUFFLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZTt3QkFDcEQsdUJBQXVCLEVBQUUsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyx1QkFBdUI7d0JBQ3BFLHFCQUFxQixFQUFFLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMscUJBQXFCO3dCQUNoRSxPQUFPLEVBQUUsT0FBTzt3QkFDaEIsT0FBTyxFQUFFLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsS0FBSzt3QkFDckQsa0JBQWtCLEVBQUUsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxrQkFBa0I7d0JBQzFELG1CQUFtQixFQUFFLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsbUJBQW1CO3dCQUM1RCxvQ0FBb0M7cUJBQ3ZDLENBQUEsQ0FBQyxVQUFVO29CQUVaLElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO29CQUM1QyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3JDLENBQUMsQ0FBQyxTQUFTO1lBQ2YsQ0FBQyxDQUFDLFFBQVE7UUFDZCxDQUFDLENBQUMsUUFBUTtRQUNWLElBQUksQ0FBQyxDQUFDO1lBQ0Ysd0RBQXdEO1FBQzVELENBQUM7UUFDRCxJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQztRQUM3QixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDekIsQ0FBQyxFQUFDLGdDQUFnQztJQUUxQixnREFBeUIsR0FBakMsVUFBa0MsY0FBYyxFQUFFLFVBQVUsRUFBRSxXQUFXO1FBQ3JFLElBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDO1FBQzdCLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUNyQiwrQkFBK0I7UUFDL0IscURBQXFEO0lBQ3pELENBQUMsRUFBQyw4QkFBOEI7SUFFekIsNENBQXFCLEdBQTVCO1FBQ0ksSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDO0lBQ3JDLENBQUM7SUFDTCxtQkFBQztBQUFELENBN0ZBLEFBNkZDLElBQUE7QUE3Rlksb0NBQVk7Ozs7QUNBekIsMkVBQTBFO0FBQzFFLCtDQUE4QztBQUU5QztJQVFJLGVBQVksMkJBQW1DLEVBQ25DLGVBQXNCLEVBQ3RCLGlCQUF5QjtRQVQ1QixrQkFBYSxHQUFHLElBQUksMkJBQVksRUFBRSxDQUFDO1FBVXhDLElBQUksQ0FBQyw0QkFBNEIsR0FBRywyQkFBMkIsQ0FBQztRQUNoRSxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsZUFBZSxDQUFDO1FBQ3hDLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxpQkFBaUIsQ0FBQztRQUU1QyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDaEIsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7SUFDN0IsQ0FBQztJQUVPLHdCQUFRLEdBQWhCO1FBRVEsSUFBSSxDQUFDLDRCQUE0QixFQUFFLENBQUM7UUFDcEMsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7UUFDM0IsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7SUFFckMsQ0FBQyxFQUFBLFVBQVU7SUFFRiw0Q0FBNEIsR0FBckM7UUFDSSw0QkFBNEI7UUFDNUIsSUFBSSxtQkFBbUIsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3hFLElBQUksYUFBYSxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsbUJBQW1CLENBQWUsQ0FBQztRQUNuRSxJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxxQ0FBaUIsQ0FBQyxJQUFJLENBQUMsNEJBQTRCLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDbEcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLGdCQUFnQixFQUFFLENBQUM7SUFFL0MsQ0FBQyxFQUFBLDhCQUE4QjtJQUV2QixpQ0FBaUIsR0FBekI7UUFBQSxpQkFLQztRQUpHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyx1QkFBdUIsQ0FBQyxTQUFTLENBQUMsVUFBQyxNQUFNLEVBQUUsSUFBSTtZQUNuRSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUN4QyxLQUFJLENBQUMsYUFBYSxDQUFDLHFCQUFxQixFQUFFLENBQUM7UUFDL0MsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRU8sbUNBQW1CLEdBQTNCO1FBQUEsaUJBV0M7UUFWRyxDQUFDLENBQUMsR0FBRyxHQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsVUFBQyxLQUFLO1lBQzdDLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUV2QixJQUFJLFVBQVUsR0FBRyxLQUFJLENBQUMsa0JBQWtCLENBQUMscUJBQXFCLEVBQUUsQ0FBQztZQUNqRSxJQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7WUFDekQsSUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1lBQ3pELElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUU3QyxLQUFJLENBQUMsYUFBYSxDQUFDLG9CQUFvQixDQUFDLFVBQVUsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3JGLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTztJQUNmLENBQUMsRUFBQSxxQkFBcUI7SUFFZCxxQ0FBcUIsR0FBN0I7UUFDSSw2Q0FBNkM7UUFDN0MsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyx1QkFBdUIsRUFBRSxlQUFlLEVBQUUsVUFBQyxLQUFzQztZQUM1RixDQUFDLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDekQsNENBQTRDO1FBQ2hELENBQUMsQ0FBQyxDQUFDLENBQUEsUUFBUTtJQUNmLENBQUMsRUFBQSx1QkFBdUI7SUFDNUIsWUFBQztBQUFELENBL0RBLEFBK0RDLElBQUE7QUFFRCxJQUFJLDJCQUEyQixHQUFXLGtCQUFrQixDQUFDO0FBQzdELElBQUksaUJBQWlCLEdBQUcsaUJBQWlCLENBQUM7QUFDMUMsSUFBSSxlQUFlLEdBQUcsZUFBZSxDQUFDO0FBRXRDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLENBQUM7SUFDZCxJQUFJLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQywyQkFBMkIsRUFBRSxlQUFlLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztBQUMzRixDQUFDLENBQUMsQ0FBQyxDQUFBLE9BQU8iLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwi77u/aW1wb3J0IHtFdmVudERpc3BhdGNoZXJ9IGZyb20gXCIuLi9FdmVudHMvRXZlbnREaXNwYXRjaGVyXCI7XHJcbmltcG9ydCB7Q2F0ZWdvcnl9IGZyb20gXCIuLi9Nb2RlbHMvQ2F0ZWdvcnlcIjtcclxuXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIENhdGVnb3J5U2VsZWN0aW9uIHtcclxuICAgIC8vVE9ETyB3aGF0IGlmIGEgbGV2ZWwgaGFzIG5vIGl0ZW0gYXQgYWxsXHJcbiAgICAvL1RPRE8gd2hhdCBpZiBvbiBsZXZlbCBzZWxlY3RlZCBpZCBpcyAwXHJcbiAgICBwcml2YXRlIF9wYXJlbnREaXZJZDogc3RyaW5nOy8vZGl2IGVsZW1lbnQgdGhhdCBob2xkcyBhbGwgQ2F0ZWdvcnlTZWxlY3Rpb24gZWxlbWVudHNcclxuICAgIHByaXZhdGUgX2FsbENhdGVnb3JpZXM6IENhdGVnb3J5W107XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9maXJzdExldmVsU2VsZWN0SWQ6IHN0cmluZyA9IFwiY2F0ZWdvcnkxXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9zZWNvbmRMZXZlbFNlbGVjdElkOiBzdHJpbmcgPSBcImNhdGVnb3J5MlwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfdGhpcmRMZXZlbFNlbGVjdElkOiBzdHJpbmcgPSBcImNhdGVnb3J5M1wiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfcm9vdENhdGVnb3J5SWQ6IG51bWJlciA9IDA7XHJcbiAgICBcclxuICAgIHByaXZhdGUgX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsT25lOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIF9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFR3bzogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBfc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUaHJlZTpudW1iZXI7XHJcblxyXG4gICAgcHVibGljIFNlbGVjdGVkQ2F0ZWdvcnlDaGFuZ2VkOiBFdmVudERpc3BhdGNoZXI8Q2F0ZWdvcnlTZWxlY3Rpb24sIG51bWJlcj4gPSBuZXcgRXZlbnREaXNwYXRjaGVyPENhdGVnb3J5U2VsZWN0aW9uLCBudW1iZXI+KCk7XHJcblxyXG4gICAgY29uc3RydWN0b3IocGFyZW50RGl2SWQ6IHN0cmluZywgYWxsQ2F0ZWdvcmllczogQ2F0ZWdvcnlbXSkge1xyXG4gICAgICAgIHRoaXMuX3BhcmVudERpdklkID0gcGFyZW50RGl2SWQ7XHJcbiAgICAgICAgdGhpcy5fYWxsQ2F0ZWdvcmllcyA9IGFsbENhdGVnb3JpZXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIEdldFNlbGVjdGVkQ2F0ZWdvcnlJZCgpOiBudW1iZXIge1xyXG4gICAgICAgIGlmICh0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFRocmVlICE9PSB0aGlzLl9yb290Q2F0ZWdvcnlJZClcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVGhyZWU7XHJcbiAgICAgICAgZWxzZSBpZiAodGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUd28gIT09IHRoaXMuX3Jvb3RDYXRlZ29yeUlkKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUd287XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxPbmU7IFxyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgfS8vR2V0U2VsZWN0ZWRDYXRlZ29yeUlkXHJcblxyXG4gICAgcHVibGljIENyZWF0ZUZpcnN0TGV2ZWwoKTogdm9pZCB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxPbmUgPSB0aGlzLl9yb290Q2F0ZWdvcnlJZDtcclxuICAgICAgICB0aGlzLl9hbGxDYXRlZ29yaWVzLmZvckVhY2goY2F0ZWdvcnkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoY2F0ZWdvcnkucGFyZW50Q2F0ZWdvcnlJZCA9PT0gdGhpcy5fcm9vdENhdGVnb3J5SWQpIHtcclxuICAgICAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLl9maXJzdExldmVsU2VsZWN0SWQpLmFwcGVuZCgkKFwiPG9wdGlvbj5cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBjYXRlZ29yeS5jYXRlZ29yeUlkLFxyXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IGNhdGVnb3J5LmNhdGVnb3J5TmFtZVxyXG4gICAgICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICB9Ly9pZlxyXG4gICAgICAgIH0pOy8vZm9yRWFjaFxyXG5cclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fZmlyc3RMZXZlbFNlbGVjdElkKS5jaGFuZ2UoKGV2ZW50KT0+IHtcclxuICAgICAgICAgICAgbGV0IHNlbGVjdGVkSWQgPSBwYXJzZUludCgkKGV2ZW50LmN1cnJlbnRUYXJnZXQpLnZhbCgpLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbE9uZSA9IHNlbGVjdGVkSWQ7XHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlU2Vjb25kTGV2ZWwoc2VsZWN0ZWRJZCk7XHJcbiAgICAgICAgICAgIHRoaXMuU2VsZWN0ZWRDYXRlZ29yeUNoYW5nZWQuZGlzcGF0Y2godGhpcywgdGhpcy5HZXRTZWxlY3RlZENhdGVnb3J5SWQoKSk7XHJcbiAgICAgICAgfSk7Ly9jaGFuZ2VcclxuXHJcbiAgICB9Ly9DcmVhdGVGaXJzdExldmVsXHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVTZWNvbmRMZXZlbChmaXJzdExldmVsQ2F0ZWdvcnlJZDogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUd28gPSB0aGlzLl9yb290Q2F0ZWdvcnlJZDtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fc2Vjb25kTGV2ZWxTZWxlY3RJZCkucmVtb3ZlKCk7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX3RoaXJkTGV2ZWxTZWxlY3RJZCkucmVtb3ZlKCk7XHJcbiAgICAgICAgaWYgKGZpcnN0TGV2ZWxDYXRlZ29yeUlkID09PSB0aGlzLl9yb290Q2F0ZWdvcnlJZCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciAkc2VsZWN0ID0gJChgPHNlbGVjdCBpZD1cIiR7dGhpcy5fc2Vjb25kTGV2ZWxTZWxlY3RJZH1cIiBjbGFzcz1cImZvcm0tY29udHJvbFwiPjwvc2VsZWN0PmApXHJcbiAgICAgICAgICAgIC5hcHBlbmQoYDxvcHRpb24gdmFsdWU9XCIke3RoaXMuX3Jvb3RDYXRlZ29yeUlkfVwiPtiq2YXYp9mFINii2q/Zh9uMINmH2Kc8L29wdGlvbj5gKTtcclxuICAgICAgICB0aGlzLl9hbGxDYXRlZ29yaWVzLmZvckVhY2goY2F0ZWdvcnkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoY2F0ZWdvcnkucGFyZW50Q2F0ZWdvcnlJZCA9PT0gZmlyc3RMZXZlbENhdGVnb3J5SWQpIHtcclxuICAgICAgICAgICAgICAgICRzZWxlY3QuYXBwZW5kKCQoXCI8b3B0aW9uPlwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGNhdGVnb3J5LmNhdGVnb3J5SWQsXHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogY2F0ZWdvcnkuY2F0ZWdvcnlOYW1lXHJcbiAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTsvL2ZvckVhY2hcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fcGFyZW50RGl2SWQpLmFwcGVuZCgkc2VsZWN0KTtcclxuXHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX3NlY29uZExldmVsU2VsZWN0SWQpLmNoYW5nZSgoZXZlbnQpPT4ge1xyXG4gICAgICAgICAgICBsZXQgc2VsZWN0ZWRJZCA9IHBhcnNlSW50KCQoZXZlbnQuY3VycmVudFRhcmdldCkudmFsKCkudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVHdvID0gc2VsZWN0ZWRJZDtcclxuICAgICAgICAgICAgdGhpcy5DcmVhdGVUaGlyZExldmVsKHNlbGVjdGVkSWQpO1xyXG4gICAgICAgICAgICB0aGlzLlNlbGVjdGVkQ2F0ZWdvcnlDaGFuZ2VkLmRpc3BhdGNoKHRoaXMsIHRoaXMuR2V0U2VsZWN0ZWRDYXRlZ29yeUlkKCkpO1xyXG4gICAgICAgIH0pOy8vY2hhbmdlXHJcbiAgICB9XHJcblxyXG4gICAgQ3JlYXRlVGhpcmRMZXZlbChzZWNvbmRMZXZlbENhdGVnb3J5SWQ6IG51bWJlcik6dm9pZCB7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUaHJlZSA9IHRoaXMuX3Jvb3RDYXRlZ29yeUlkO1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl90aGlyZExldmVsU2VsZWN0SWQpLnJlbW92ZSgpO1xyXG4gICAgICAgIGlmIChzZWNvbmRMZXZlbENhdGVnb3J5SWQgPT09IHRoaXMuX3Jvb3RDYXRlZ29yeUlkKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyICRzZWxlY3QgPSAkKGA8c2VsZWN0IGlkPVwiJHt0aGlzLl90aGlyZExldmVsU2VsZWN0SWR9XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIj48L3NlbGVjdD5gKVxyXG4gICAgICAgICAgICAuYXBwZW5kKGA8b3B0aW9uIHZhbHVlPVwiJHt0aGlzLl9yb290Q2F0ZWdvcnlJZH1cIj7YqtmF2KfZhSDYotqv2YfbjCDZh9inPC9vcHRpb24+YCk7XHJcbiAgICAgICAgdGhpcy5fYWxsQ2F0ZWdvcmllcy5mb3JFYWNoKGNhdGVnb3J5ID0+IHtcclxuICAgICAgICAgICAgaWYgKGNhdGVnb3J5LnBhcmVudENhdGVnb3J5SWQgPT09IHNlY29uZExldmVsQ2F0ZWdvcnlJZCkge1xyXG4gICAgICAgICAgICAgICAgJHNlbGVjdC5hcHBlbmQoJChcIjxvcHRpb24+XCIsIHtcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogY2F0ZWdvcnkuY2F0ZWdvcnlJZCxcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBjYXRlZ29yeS5jYXRlZ29yeU5hbWVcclxuICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pOy8vZm9yRWFjaFxyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9wYXJlbnREaXZJZCkuYXBwZW5kKCRzZWxlY3QpO1xyXG5cclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fdGhpcmRMZXZlbFNlbGVjdElkKS5jaGFuZ2UoKGV2ZW50KT0+IHtcclxuICAgICAgICAgICAgbGV0IHNlbGVjdGVkSWQgPSBwYXJzZUludCgkKGV2ZW50LmN1cnJlbnRUYXJnZXQpLnZhbCgpLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFRocmVlID0gc2VsZWN0ZWRJZDtcclxuICAgICAgICAgICAgdGhpcy5TZWxlY3RlZENhdGVnb3J5Q2hhbmdlZC5kaXNwYXRjaCh0aGlzLCB0aGlzLkdldFNlbGVjdGVkQ2F0ZWdvcnlJZCgpKTtcclxuICAgICAgICB9KTsvL2NoYW5nZVxyXG4gICAgfVxyXG59XHJcblxyXG4iLCLvu79pbXBvcnQge0lFdmVudH0gIGZyb20gXCIuL0lFdmVudFwiO1xyXG5cclxuXHJcbi8qIFRoZSBkaXNwYXRjaGVyIGhhbmRsZXMgdGhlIHN0b3JhZ2Ugb2Ygc3Vic2NpcHRpb25zIGFuZCBmYWNpbGl0YXRlc1xyXG4gIHN1YnNjcmlwdGlvbiwgdW5zdWJzY3JpcHRpb24gYW5kIGRpc3BhdGNoaW5nIG9mIHRoZSBldmVudCAqL1xyXG5leHBvcnQgIGNsYXNzIEV2ZW50RGlzcGF0Y2hlcjxUU2VuZGVyLCBUQXJncz4gaW1wbGVtZW50cyBJRXZlbnQ8VFNlbmRlciwgVEFyZ3M+IHtcclxuXHJcbiAgICBwcml2YXRlIF9zdWJzY3JpcHRpb25zOiBBcnJheTwoc2VuZGVyOiBUU2VuZGVyLCBhcmdzOiBUQXJncykgPT4gdm9pZD4gPSBuZXcgQXJyYXk8KHNlbmRlcjogVFNlbmRlciwgYXJnczogVEFyZ3MpID0+IHZvaWQ+KCk7XHJcblxyXG4gICAgU3Vic2NyaWJlKGZuOiAoc2VuZGVyOiBUU2VuZGVyLCBhcmdzOiBUQXJncykgPT4gdm9pZCk6IHZvaWQge1xyXG4gICAgICAgIGlmIChmbikge1xyXG4gICAgICAgICAgICB0aGlzLl9zdWJzY3JpcHRpb25zLnB1c2goZm4pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBVbnN1YnNjcmliZShmbjogKHNlbmRlcjogVFNlbmRlciwgYXJnczogVEFyZ3MpID0+IHZvaWQpOiB2b2lkIHtcclxuICAgICAgICBsZXQgaSA9IHRoaXMuX3N1YnNjcmlwdGlvbnMuaW5kZXhPZihmbik7XHJcbiAgICAgICAgaWYgKGkgPiAtMSkge1xyXG4gICAgICAgICAgICB0aGlzLl9zdWJzY3JpcHRpb25zLnNwbGljZShpLCAxKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZGlzcGF0Y2goc2VuZGVyOiBUU2VuZGVyLCBhcmdzOiBUQXJncyk6IHZvaWQge1xyXG4gICAgICAgIGZvciAobGV0IGhhbmRsZXIgb2YgdGhpcy5fc3Vic2NyaXB0aW9ucykge1xyXG4gICAgICAgICAgICBoYW5kbGVyKHNlbmRlciwgYXJncyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59Iiwi77u/ZXhwb3J0IGNsYXNzIFNlYXJjaEFkVXNlcklucHV0IHtcclxuICAgIHB1YmxpYyBTdGFydEluZGV4OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgQ291bnQ6IG51bWJlcjtcclxuICAgIHB1YmxpYyBDYXRlZ29yeUlkOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgTWluaW11bVByaWNlOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgTWF4aW11bVByaWNlOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgT3JkZXJCeTogc3RyaW5nO1xyXG4gICAgcHVibGljIFJlcXVlc3RJbmRleDogbnVtYmVyO1xyXG59XHJcblxyXG4iLCLvu79pbXBvcnQgeyBTZWFyY2hBZFVzZXJJbnB1dCB9IGZyb20gXCIuL1NlYXJjaEFkVXNlcklucHV0XCI7XHJcbmV4cG9ydCBjbGFzcyBTZXJ2ZXJDYWxsZXIge1xyXG4gICAgcHJpdmF0ZSBfaW5pdGlhbFN0YXJ0OiBudW1iZXIgPSAxO1xyXG4gICAgcHJpdmF0ZSBfc3RhcnQ6IG51bWJlciA9IDE7XHJcbiAgICBwcml2YXRlIF9jb3VudDogbnVtYmVyID0gNTtcclxuICAgIHByaXZhdGUgX3JlcXVlc3RJbmRleDogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgX3ByZXZpb3VzUmVxdWVzdEluZGV4OiBudW1iZXIgPSAtMTtcclxuICAgIHByaXZhdGUgX2lzU2VydmVyQ2FsbGVkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwcml2YXRlIF9udW1iZXJPZlN0YXJ0U2VydmVyQ2FsbE5vdGlmaWNhdGlvbjogbnVtYmVyID0gMDtcclxuXHJcbiAgICBwdWJsaWMgR2V0QWRJdGVtc0Zyb21TZXJ2ZXIoY2F0ZWdvcnlJZDogbnVtYmVyLFxyXG4gICAgICAgIG1pblByaWNlOiBudW1iZXIsXHJcbiAgICAgICAgbWF4UHJpY2U6IG51bWJlcixcclxuICAgICAgICBvcmRlckJ5OiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICBsZXQgdXNlcklucHV0ID0gbmV3IFNlYXJjaEFkVXNlcklucHV0KCk7XHJcbiAgICAgICAgaWYgKHRoaXMuX2lzU2VydmVyQ2FsbGVkICYmICh0aGlzLl9wcmV2aW91c1JlcXVlc3RJbmRleCA9PT0gdGhpcy5fcmVxdWVzdEluZGV4KVxyXG4gICAgICAgICkgeyAvL2EgY2FsbCBpcyBzZW50IGJ1dCBubyBhbnN3ZXIgeWV0XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9IC8vaWZcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fcHJldmlvdXNSZXF1ZXN0SW5kZXggPSB0aGlzLl9yZXF1ZXN0SW5kZXg7XHJcbiAgICAgICAgICAgIHRoaXMuX2lzU2VydmVyQ2FsbGVkID0gdHJ1ZTtcclxuICAgICAgICB9IC8vZWxzZVxyXG5cclxuICAgICAgICB1c2VySW5wdXQuU3RhcnRJbmRleCA9IHRoaXMuX3N0YXJ0O1xyXG4gICAgICAgIHVzZXJJbnB1dC5Db3VudCA9IHRoaXMuX2NvdW50O1xyXG4gICAgICAgIC8vVE9ETyBwYXNzIHRoZSBvYmplY3QgdG8gdGhlIGNhdGVnb3J5IHNlbGVjdG9yIGVsZW1lbnQgYW5kIGxldCBpdCBmaWxsIHRoZSBjYXRlZ29yeUlkXHJcbiAgICAgICAgLy9PUiBjYWxsIGEgbWV0aG9kIG9uIGNhdGVnb3J5IHNlbGVjdG9yIGVsZW1lbnQgdG8gZ2V0IGNhdGVnb3J5SWRcclxuICAgICAgICB1c2VySW5wdXQuQ2F0ZWdvcnlJZCA9IGNhdGVnb3J5SWQ7IC8vMTAwIGZvciBjYXJzXHJcbiAgICAgICAgdXNlcklucHV0Lk1pbmltdW1QcmljZSA9IG1pblByaWNlO1xyXG4gICAgICAgIHVzZXJJbnB1dC5NYXhpbXVtUHJpY2UgPSBtYXhQcmljZTtcclxuICAgICAgICB1c2VySW5wdXQuT3JkZXJCeSA9IG9yZGVyQnk7XHJcbiAgICAgICAgdXNlcklucHV0LlJlcXVlc3RJbmRleCA9IHRoaXMuX3JlcXVlc3RJbmRleDtcclxuXHJcbiAgICAgICAgLy9ub3RpZnlVc2VyQWpheENhbGxTdGFydGVkKCk7XHJcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6IFwiUE9TVFwiLCAvL0dFVCBvciBQT1NUIG9yIFBVVCBvciBERUxFVEUgdmVyYlxyXG4gICAgICAgICAgICB1cmw6IFwiYXBpL0FkQXBpL0dldEFkdmVydGlzZW1lbnRDb21tb25cIixcclxuICAgICAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkodXNlcklucHV0KSwgLy9EYXRhIHNlbnQgdG8gc2VydmVyXHJcbiAgICAgICAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbicsIC8vIGNvbnRlbnQgdHlwZSBzZW50IHRvIHNlcnZlclxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoYXJnKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLm9uU3VjY2Vzc0dldEl0ZW1zRnJvbVNlcnZlcihhcmcpXHJcbiAgICAgICAgICAgIH0sIC8vT24gU3VjY2Vzc2Z1bGwgc2VydmljZSBjYWxsXHJcbiAgICAgICAgICAgIGVycm9yOiBzZWxmLm9uRXJyb3JHZXRJdGVtc0Zyb21TZXJ2ZXIgLy8gV2hlbiBTZXJ2aWNlIGNhbGwgZmFpbHNcclxuICAgICAgICAgICAgLy8gV2hlbiBTZXJ2aWNlIGNhbGwgZmFpbHNcclxuICAgICAgICB9KTsgLy8uYWpheFxyXG4gICAgfSAvL0dldEFkSXRlbXNGcm9tU2VydmVyXHJcblxyXG4gICAgcHJpdmF0ZSBvblN1Y2Nlc3NHZXRJdGVtc0Zyb21TZXJ2ZXIobXNnKSB7XHJcbiAgICAgICAgLy9ub3RpZnlVc2VyQWpheENhbGxGaW5pc2hlZCgpO1xyXG4gICAgICAgIGlmIChtc2cuc3VjY2VzcyA9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIGlmIChtc2cuY3VzdG9tRGljdGlvbmFyeVtcIlJlcXVlc3RJbmRleFwiXSA9PSB0aGlzLl9yZXF1ZXN0SW5kZXgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3N0YXJ0ICs9IHBhcnNlSW50KG1zZy5jdXN0b21EaWN0aW9uYXJ5W1wibnVtYmVyT2ZJdGVtc1wiXSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGVtcGxhdGUgPSAkKCcjc2luZ2xlQWRJdGVtJykuaHRtbCgpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGRhdGE7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1zZy5yZXNwb25zZURhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgYWRJbWFnZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1zZy5yZXNwb25zZURhdGFbaV0uYWR2ZXJ0aXNlbWVudEltYWdlc1swXSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkSW1hZ2UgPSBcImRhdGE6aW1hZ2UvanBnO2Jhc2U2NCxcIiArIG1zZy5yZXNwb25zZURhdGFbaV0uYWR2ZXJ0aXNlbWVudEltYWdlc1swXTtcclxuICAgICAgICAgICAgICAgICAgICB9IC8vZW5kIGlmXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgQWR2ZXJ0aXNlbWVudElkOiBtc2cucmVzcG9uc2VEYXRhW2ldLmFkdmVydGlzZW1lbnRJZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgQWR2ZXJ0aXNlbWVudENhdGVnb3J5SWQ6IG1zZy5yZXNwb25zZURhdGFbaV0uYWR2ZXJ0aXNlbWVudENhdGVnb3J5SWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEFkdmVydGlzZW1lbnRDYXRlZ29yeTogbXNnLnJlc3BvbnNlRGF0YVtpXS5hZHZlcnRpc2VtZW50Q2F0ZWdvcnksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkSW1hZ2U6IGFkSW1hZ2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkUHJpY2U6IG1zZy5yZXNwb25zZURhdGFbaV0uYWR2ZXJ0aXNlbWVudFByaWNlLnByaWNlLCAvL3RvZG8gY2hlY2sgdGhlIHByaWNlIHR5cGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgQWR2ZXJ0aXNlbWVudFRpdGxlOiBtc2cucmVzcG9uc2VEYXRhW2ldLmFkdmVydGlzZW1lbnRUaXRsZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgQWR2ZXJ0aXNlbWVudFN0YXR1czogbXNnLnJlc3BvbnNlRGF0YVtpXS5hZHZlcnRpc2VtZW50U3RhdHVzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vYWREYXRlOiBtc2cuUmVzcG9uc2VEYXRhW2ldLkFkVGltZVxyXG4gICAgICAgICAgICAgICAgICAgIH0gLy9lbmQgZGF0YVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgaHRtbCA9IE11c3RhY2hlLnRvX2h0bWwodGVtcGxhdGUsIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoXCIjYWRQbGFjZUhvbGRlclwiKS5hcHBlbmQoaHRtbCk7XHJcbiAgICAgICAgICAgICAgICB9IC8vZW5kIGZvclxyXG4gICAgICAgICAgICB9IC8vZW5kIGlmXHJcbiAgICAgICAgfSAvL2VuZCBpZlxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAvL3Nob3dFcnJvck1lc3NhZ2UobXNnLk1lc3NhZ2UgKyBcIiAsIFwiICsgbXNnLkVycm9yQ29kZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2lzU2VydmVyQ2FsbGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fcmVxdWVzdEluZGV4Kys7XHJcbiAgICB9IC8vZW5kIE9uU3VjY2Vzc0dldFRpbWVGcm9tU2VydmVyXHJcblxyXG4gICAgcHJpdmF0ZSBvbkVycm9yR2V0SXRlbXNGcm9tU2VydmVyKFhNTEh0dHBSZXF1ZXN0LCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikge1xyXG4gICAgICAgIHRoaXMuX2lzU2VydmVyQ2FsbGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fcmVxdWVzdEluZGV4Kys7XHJcbiAgICAgICAgLy9ub3RpZnlVc2VyQWpheENhbGxGaW5pc2hlZCgpO1xyXG4gICAgICAgIC8vc2hvd0Vycm9yTWVzc2FnZSh0ZXh0U3RhdHVzICsgXCIgLCBcIiArIGVycm9yVGhyb3duKTtcclxuICAgIH0gLy9lbmQgT25FcnJvckdldFRpbWVGcm9tU2VydmVyXHJcblxyXG4gICAgcHVibGljIFJlc2V0U2VhcmNoUGFyYW1ldGVycygpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9zdGFydCA9IHRoaXMuX2luaXRpYWxTdGFydDtcclxuICAgIH1cclxufVxyXG5cclxuIiwi77u/aW1wb3J0IHtDYXRlZ29yeX0gZnJvbSBcIi4uLy4uLy4uL01vZGVscy9DYXRlZ29yeVwiO1xyXG5pbXBvcnQgeyBDYXRlZ29yeVNlbGVjdGlvbiB9IGZyb20gXCIuLi8uLi8uLi9Db21wb25lbnRzL0NhdGVnb3J5U2VsZWN0aW9uXCI7XHJcbmltcG9ydCB7IFNlcnZlckNhbGxlciB9IGZyb20gXCIuL1NlcnZlckNhbGxlclwiO1xyXG5cclxuY2xhc3MgSW5kZXgge1xyXG4gICAgcHJpdmF0ZSAgX3NlcnZlckNhbGxlciA9IG5ldyBTZXJ2ZXJDYWxsZXIoKTtcclxuICAgIHByaXZhdGUgIF9jYXRlZ29yeVNlbGVjdGlvbjogQ2F0ZWdvcnlTZWxlY3Rpb247XHJcblxyXG4gICAgcHJpdmF0ZSBfY2F0ZWdvcnlTZWxlY3RvclBhcmVudERpdklkOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIF9nZXRBZEZyb21TZXJ2ZXJJZDogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBfYWxsQ2F0ZWdvcmllc0lkOiBzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IoY2F0ZWdvcnlTZWxlY3RvclBhcmVudERpdklkOiBzdHJpbmcsXHJcbiAgICAgICAgICAgICAgICBhbGxDYXRlZ29yaWVzSWQ6c3RyaW5nLFxyXG4gICAgICAgICAgICAgICAgZ2V0QWRGcm9tU2VydmVySWQ6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuX2NhdGVnb3J5U2VsZWN0b3JQYXJlbnREaXZJZCA9IGNhdGVnb3J5U2VsZWN0b3JQYXJlbnREaXZJZDtcclxuICAgICAgICB0aGlzLl9hbGxDYXRlZ29yaWVzSWQgPSBhbGxDYXRlZ29yaWVzSWQ7XHJcbiAgICAgICAgdGhpcy5fZ2V0QWRGcm9tU2VydmVySWQgPSBnZXRBZEZyb21TZXJ2ZXJJZDtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmluaXRQYWdlKCk7XHJcbiAgICAgICAgdGhpcy5pbml0RXZlbnRIYW5kbGVycygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaW5pdFBhZ2UoKTogdm9pZCB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuaW5pdENhdGVnb3J5U2VsZWN0aW9uQ29udHJvbCgpO1xyXG4gICAgICAgICAgICB0aGlzLmluaXRHZXRBZEZyb21TZXJ2ZXIoKTtcclxuICAgICAgICAgICAgdGhpcy5pbml0U2luZ2xlQWRJdGVtU3R5bGUoKTtcclxuICAgICAgICBcclxuICAgIH0vL2luaXRQYWdlXHJcblxyXG4gICAgcHJpdmF0ZSAgaW5pdENhdGVnb3J5U2VsZWN0aW9uQ29udHJvbCgpOiB2b2lkIHtcclxuICAgICAgICAvL0FkZCBmaXJzdCBsZXZlbCBjYXRlZ29yaWVzXHJcbiAgICAgICAgbGV0IGFsbENhdGVnb3JpZXNTdHJpbmcgPSAkKFwiI1wiK3RoaXMuX2FsbENhdGVnb3JpZXNJZCkudmFsKCkudG9TdHJpbmcoKTtcclxuICAgICAgICBsZXQgYWxsQ2F0ZWdvcmllcyA9ICQucGFyc2VKU09OKGFsbENhdGVnb3JpZXNTdHJpbmcpIGFzIENhdGVnb3J5W107XHJcbiAgICAgICAgdGhpcy5fY2F0ZWdvcnlTZWxlY3Rpb24gPSBuZXcgQ2F0ZWdvcnlTZWxlY3Rpb24odGhpcy5fY2F0ZWdvcnlTZWxlY3RvclBhcmVudERpdklkLCBhbGxDYXRlZ29yaWVzKTtcclxuICAgICAgICB0aGlzLl9jYXRlZ29yeVNlbGVjdGlvbi5DcmVhdGVGaXJzdExldmVsKCk7XHJcbiAgICAgICAgXHJcbiAgICB9Ly9pbml0Q2F0ZWdvcnlTZWxlY3Rpb25Db250cm9sXHJcblxyXG4gICAgcHJpdmF0ZSBpbml0RXZlbnRIYW5kbGVycygpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9jYXRlZ29yeVNlbGVjdGlvbi5TZWxlY3RlZENhdGVnb3J5Q2hhbmdlZC5TdWJzY3JpYmUoKHNlbmRlciwgYXJncykgPT4ge1xyXG4gICAgICAgICAgICAkKFwiI2FkUGxhY2VIb2xkZXJcIikuY2hpbGRyZW4oKS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgdGhpcy5fc2VydmVyQ2FsbGVyLlJlc2V0U2VhcmNoUGFyYW1ldGVycygpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaW5pdEdldEFkRnJvbVNlcnZlcigpOnZvaWQge1xyXG4gICAgICAgICQoXCIjXCIrdGhpcy5fZ2V0QWRGcm9tU2VydmVySWQpLm9uKFwiY2xpY2tcIiwgKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICBsZXQgY2F0ZWdvcnlJZCA9IHRoaXMuX2NhdGVnb3J5U2VsZWN0aW9uLkdldFNlbGVjdGVkQ2F0ZWdvcnlJZCgpO1xyXG4gICAgICAgICAgICBsZXQgbWluUHJpY2UgPSBwYXJzZUludCgkKFwiI21pblByaWNlXCIpLnZhbCgpLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICBsZXQgbWF4UHJpY2UgPSBwYXJzZUludCgkKFwiI21heFByaWNlXCIpLnZhbCgpLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICBsZXQgb3JkZXJCeSA9ICQoXCIjb3JkZXJCeVwiKS52YWwoKS50b1N0cmluZygpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fc2VydmVyQ2FsbGVyLkdldEFkSXRlbXNGcm9tU2VydmVyKGNhdGVnb3J5SWQsIG1pblByaWNlLCBtYXhQcmljZSwgb3JkZXJCeSk7XHJcbiAgICAgICAgfSk7IC8vY2xpY2tcclxuICAgIH0vL2luaXRHZXRBZEZyb21TZXJ2ZXJcclxuXHJcbiAgICBwcml2YXRlIGluaXRTaW5nbGVBZEl0ZW1TdHlsZSgpOiB2b2lkIHtcclxuICAgICAgICAvL3Nob3cgZGV0YWlsIG9mIHNpbmdsZUFkSXRlbSB3aGVuIG1vdXNlIG92ZXJcclxuICAgICAgICAkKGRvY3VtZW50KS5vbihcIm1vdXNlZW50ZXIgbW91c2VsZWF2ZVwiLCBcIi5ibG9ja0Rpc3BsYXlcIiwgKGV2ZW50OiBKUXVlcnkuRXZlbnQ8SFRNTEVsZW1lbnQsIG51bGw+KSA9PiB7XHJcbiAgICAgICAgICAgICQoZXZlbnQuY3VycmVudFRhcmdldCkuZmluZChcIi5tb3JlSW5mb1wiKS5mYWRlVG9nZ2xlKDI1MCk7XHJcbiAgICAgICAgICAgIC8vJCh0aGlzKS5maW5kKFwiLm1vcmVJbmZvXCIpLmZhZGVUb2dnbGUoMjUwKTtcclxuICAgICAgICB9KTsvL2VuZCBvblxyXG4gICAgfS8vaW5pdFNpbmdsZUFkSXRlbVN0eWxlXHJcbn1cclxuXHJcbmxldCBjYXRlZ29yeVNlbGVjdG9yUGFyZW50RGl2SWQ6IHN0cmluZyA9IFwiY2F0ZWdvcnlTZWxlY3RvclwiO1xyXG5sZXQgZ2V0QWRGcm9tU2VydmVySWQgPSBcImdldEFkRnJvbVNlcnZlclwiO1xyXG5sZXQgYWxsQ2F0ZWdvcmllc0lkID0gXCJhbGxDYXRlZ29yaWVzXCI7XHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeSgoKSA9PiB7XHJcbiAgICBsZXQgaW5kZXggPSBuZXcgSW5kZXgoY2F0ZWdvcnlTZWxlY3RvclBhcmVudERpdklkLCBhbGxDYXRlZ29yaWVzSWQsIGdldEFkRnJvbVNlcnZlcklkKTtcclxufSk7Ly9yZWFkeVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4iXX0=
