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
    //TODO chech for undefined
    CategorySelection.prototype.GetSelectedCategoryId = function () {
        if (this._selectedCategoryIdLevelThree !== undefined &&
            this._selectedCategoryIdLevelThree !== this._rootCategoryId)
            return this._selectedCategoryIdLevelThree;
        else if (this._selectedCategoryIdLevelTwo !== undefined &&
            this._selectedCategoryIdLevelTwo !== this._rootCategoryId)
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
        var $thirdLevelElement = $("<div><p>testDiv</p></div>");
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
        $thirdLevelElement.append($select);
        $("#" + this._parentDivId).append($thirdLevelElement);
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
        this._url = "api/AdApi/GetAdvertisementCommon";
    }
    ServerCaller.prototype.GetAdItemsFromServer = function (categoryId, minPrice, maxPrice, orderBy) {
        var _this = this;
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
        $.ajax({
            type: "POST",
            url: this._url,
            data: JSON.stringify(userInput),
            contentType: 'application/json',
            success: function (msg, textStatus, jqXHR) { _this.onSuccessGetItemsFromServer(msg, textStatus, jqXHR); },
            error: function (jqXHR, textStatus, errorThrown) {
                _this.onErrorGetItemsFromServer(jqXHR, textStatus, errorThrown);
            } // When Service call fails
        }); //.ajax
    }; //GetAdItemsFromServer
    ServerCaller.prototype.onSuccessGetItemsFromServer = function (msg, textStatus, jqXHR) {
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
    ServerCaller.prototype.onErrorGetItemsFromServer = function (jqXHR, textStatus, errorThrown) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3d3dyb290L2pzL0NvbXBvbmVudHMvQ2F0ZWdvcnlTZWxlY3Rpb24udHMiLCJ3d3dyb290L2pzL0V2ZW50cy9FdmVudERpc3BhdGNoZXIudHMiLCJ3d3dyb290L2pzL2hvbWUvaW5kZXgvc3JjL1NlYXJjaEFkVXNlcklucHV0LnRzIiwid3d3cm9vdC9qcy9ob21lL2luZGV4L3NyYy9TZXJ2ZXJDYWxsZXIudHMiLCJ3d3dyb290L2pzL2hvbWUvaW5kZXgvc3JjL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQyw2REFBNEQ7QUFLN0Q7SUFpQkksMkJBQVksV0FBbUIsRUFBRSxhQUF5QjtRQVh6Qyx3QkFBbUIsR0FBVyxXQUFXLENBQUM7UUFDMUMseUJBQW9CLEdBQVcsV0FBVyxDQUFDO1FBQzNDLHdCQUFtQixHQUFXLFdBQVcsQ0FBQztRQUMxQyxvQkFBZSxHQUFXLENBQUMsQ0FBQztRQU10Qyw0QkFBdUIsR0FBK0MsSUFBSSxpQ0FBZSxFQUE2QixDQUFDO1FBRzFILElBQUksQ0FBQyxZQUFZLEdBQUcsV0FBVyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxjQUFjLEdBQUcsYUFBYSxDQUFDO0lBQ3hDLENBQUM7SUFFRCwwQkFBMEI7SUFDbkIsaURBQXFCLEdBQTVCO1FBQ0ksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLDZCQUE2QixLQUFLLFNBQVM7WUFDaEQsSUFBSSxDQUFDLDZCQUE2QixLQUFLLElBQUksQ0FBQyxlQUFlLENBQUM7WUFDNUQsTUFBTSxDQUFDLElBQUksQ0FBQyw2QkFBNkIsQ0FBQztRQUM5QyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLDJCQUEyQixLQUFLLFNBQVM7WUFDOUMsSUFBSSxDQUFDLDJCQUEyQixLQUFLLElBQUksQ0FBQyxlQUFlLENBQUM7WUFDL0QsTUFBTSxDQUFDLElBQUksQ0FBQywyQkFBMkIsQ0FBQztR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QUFDO1lBQ3pELDRDQUE0QztRQUNoRCxDQUFDLENBQUMsQ0FBQyxDQUFBLFFBQVE7SUFDZixDQUFDLEVBQUEsdUJBQXVCO0lBQzVCLFlBQUM7QUFBRCxDQS9EQSxBQStEQyxJQUFBO0FBRUQsSUFBSSwyQkFBMkIsR0FBVyxrQkFBa0IsQ0FBQztBQUM3RCxJQUFJLGlCQUFpQixHQUFHLGlCQUFpQixDQUFDO0FBQzFDLElBQUksZUFBZSxHQUFHLGVBQWUsQ0FBQztBQUV0QyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDO0lBQ2QsSUFBSSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsMkJBQTJCLEVBQUUsZUFBZSxFQUFFLGlCQUFpQixDQUFDLENBQUM7QUFDM0YsQ0FBQyxDQUFDLENBQUMsQ0FBQSxPQUFPIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIu+7v2ltcG9ydCB7IEV2ZW50RGlzcGF0Y2hlciB9IGZyb20gXCIuLi9FdmVudHMvRXZlbnREaXNwYXRjaGVyXCI7XHJcbmltcG9ydCB7IENhdGVnb3J5IH0gZnJvbSBcIi4uL01vZGVscy9DYXRlZ29yeVwiO1xyXG5cclxuXHJcblxyXG5leHBvcnQgY2xhc3MgQ2F0ZWdvcnlTZWxlY3Rpb24ge1xyXG4gICAgLy9UT0RPIHdoYXQgaWYgYSBsZXZlbCBoYXMgbm8gaXRlbSBhdCBhbGxcclxuICAgIC8vVE9ETyB3aGF0IGlmIG9uIGxldmVsIHNlbGVjdGVkIGlkIGlzIDBcclxuICAgIC8vVE9ETyByZW1vdmUgaHRtbCBjb2RlIGZyb20ganMgY29kZVxyXG4gICAgcHJpdmF0ZSBfcGFyZW50RGl2SWQ6IHN0cmluZzsvL2RpdiBlbGVtZW50IHRoYXQgaG9sZHMgYWxsIENhdGVnb3J5U2VsZWN0aW9uIGVsZW1lbnRzXHJcbiAgICBwcml2YXRlIF9hbGxDYXRlZ29yaWVzOiBDYXRlZ29yeVtdO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfZmlyc3RMZXZlbFNlbGVjdElkOiBzdHJpbmcgPSBcImNhdGVnb3J5MVwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfc2Vjb25kTGV2ZWxTZWxlY3RJZDogc3RyaW5nID0gXCJjYXRlZ29yeTJcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX3RoaXJkTGV2ZWxTZWxlY3RJZDogc3RyaW5nID0gXCJjYXRlZ29yeTNcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX3Jvb3RDYXRlZ29yeUlkOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIHByaXZhdGUgX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsT25lOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIF9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFR3bzogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBfc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUaHJlZTogbnVtYmVyO1xyXG5cclxuICAgIHB1YmxpYyBTZWxlY3RlZENhdGVnb3J5Q2hhbmdlZDogRXZlbnREaXNwYXRjaGVyPENhdGVnb3J5U2VsZWN0aW9uLCBudW1iZXI+ID0gbmV3IEV2ZW50RGlzcGF0Y2hlcjxDYXRlZ29yeVNlbGVjdGlvbiwgbnVtYmVyPigpO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBhcmVudERpdklkOiBzdHJpbmcsIGFsbENhdGVnb3JpZXM6IENhdGVnb3J5W10pIHtcclxuICAgICAgICB0aGlzLl9wYXJlbnREaXZJZCA9IHBhcmVudERpdklkO1xyXG4gICAgICAgIHRoaXMuX2FsbENhdGVnb3JpZXMgPSBhbGxDYXRlZ29yaWVzO1xyXG4gICAgfVxyXG5cclxuICAgIC8vVE9ETyBjaGVjaCBmb3IgdW5kZWZpbmVkXHJcbiAgICBwdWJsaWMgR2V0U2VsZWN0ZWRDYXRlZ29yeUlkKCk6IG51bWJlciB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVGhyZWUgIT09IHVuZGVmaW5lZCAmJlxyXG4gICAgICAgICAgICB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFRocmVlICE9PSB0aGlzLl9yb290Q2F0ZWdvcnlJZClcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVGhyZWU7XHJcbiAgICAgICAgZWxzZSBpZiAodGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUd28gIT09IHVuZGVmaW5lZCAmJlxyXG4gICAgICAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVHdvICE9PSB0aGlzLl9yb290Q2F0ZWdvcnlJZClcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVHdvO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsT25lO1xyXG5cclxuXHJcbiAgICB9Ly9HZXRTZWxlY3RlZENhdGVnb3J5SWRcclxuXHJcbiAgICBwdWJsaWMgQ3JlYXRlRmlyc3RMZXZlbCgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbE9uZSA9IHRoaXMuX3Jvb3RDYXRlZ29yeUlkO1xyXG4gICAgICAgIHRoaXMuX2FsbENhdGVnb3JpZXMuZm9yRWFjaChjYXRlZ29yeSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChjYXRlZ29yeS5wYXJlbnRDYXRlZ29yeUlkID09PSB0aGlzLl9yb290Q2F0ZWdvcnlJZCkge1xyXG4gICAgICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuX2ZpcnN0TGV2ZWxTZWxlY3RJZCkuYXBwZW5kKCQoXCI8b3B0aW9uPlwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGNhdGVnb3J5LmNhdGVnb3J5SWQsXHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogY2F0ZWdvcnkuY2F0ZWdvcnlOYW1lXHJcbiAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgIH0vL2lmXHJcbiAgICAgICAgfSk7Ly9mb3JFYWNoXHJcblxyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9maXJzdExldmVsU2VsZWN0SWQpLmNoYW5nZSgoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgbGV0IHNlbGVjdGVkSWQgPSBwYXJzZUludCgkKGV2ZW50LmN1cnJlbnRUYXJnZXQpLnZhbCgpLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbE9uZSA9IHNlbGVjdGVkSWQ7XHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlU2Vjb25kTGV2ZWwoc2VsZWN0ZWRJZCk7XHJcbiAgICAgICAgICAgIHRoaXMuU2VsZWN0ZWRDYXRlZ29yeUNoYW5nZWQuZGlzcGF0Y2godGhpcywgdGhpcy5HZXRTZWxlY3RlZENhdGVnb3J5SWQoKSk7XHJcbiAgICAgICAgfSk7Ly9jaGFuZ2VcclxuXHJcbiAgICB9Ly9DcmVhdGVGaXJzdExldmVsXHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVTZWNvbmRMZXZlbChmaXJzdExldmVsQ2F0ZWdvcnlJZDogbnVtYmVyKTogdm9pZCB7XHJcblxyXG4gICAgICAgIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVHdvID0gdGhpcy5fcm9vdENhdGVnb3J5SWQ7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX3NlY29uZExldmVsU2VsZWN0SWQpLnJlbW92ZSgpO1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl90aGlyZExldmVsU2VsZWN0SWQpLnJlbW92ZSgpO1xyXG4gICAgICAgIGlmIChmaXJzdExldmVsQ2F0ZWdvcnlJZCA9PT0gdGhpcy5fcm9vdENhdGVnb3J5SWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgJHNlbGVjdCA9ICQoYDxzZWxlY3QgaWQ9XCIke3RoaXMuX3NlY29uZExldmVsU2VsZWN0SWR9XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIj48L3NlbGVjdD5gKVxyXG4gICAgICAgICAgICAuYXBwZW5kKGA8b3B0aW9uIHZhbHVlPVwiJHt0aGlzLl9yb290Q2F0ZWdvcnlJZH1cIj7YqtmF2KfZhSDYotqv2YfbjCDZh9inPC9vcHRpb24+YCk7XHJcbiAgICAgICAgdGhpcy5fYWxsQ2F0ZWdvcmllcy5mb3JFYWNoKGNhdGVnb3J5ID0+IHtcclxuICAgICAgICAgICAgaWYgKGNhdGVnb3J5LnBhcmVudENhdGVnb3J5SWQgPT09IGZpcnN0TGV2ZWxDYXRlZ29yeUlkKSB7XHJcbiAgICAgICAgICAgICAgICAkc2VsZWN0LmFwcGVuZCgkKFwiPG9wdGlvbj5cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBjYXRlZ29yeS5jYXRlZ29yeUlkLFxyXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IGNhdGVnb3J5LmNhdGVnb3J5TmFtZVxyXG4gICAgICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7Ly9mb3JFYWNoXHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX3BhcmVudERpdklkKS5hcHBlbmQoJHNlbGVjdCk7XHJcblxyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9zZWNvbmRMZXZlbFNlbGVjdElkKS5jaGFuZ2UoKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBzZWxlY3RlZElkID0gcGFyc2VJbnQoJChldmVudC5jdXJyZW50VGFyZ2V0KS52YWwoKS50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUd28gPSBzZWxlY3RlZElkO1xyXG4gICAgICAgICAgICB0aGlzLkNyZWF0ZVRoaXJkTGV2ZWwoc2VsZWN0ZWRJZCk7XHJcbiAgICAgICAgICAgIHRoaXMuU2VsZWN0ZWRDYXRlZ29yeUNoYW5nZWQuZGlzcGF0Y2godGhpcywgdGhpcy5HZXRTZWxlY3RlZENhdGVnb3J5SWQoKSk7XHJcbiAgICAgICAgfSk7Ly9jaGFuZ2VcclxuICAgIH1cclxuXHJcbiAgICBDcmVhdGVUaGlyZExldmVsKHNlY29uZExldmVsQ2F0ZWdvcnlJZDogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUaHJlZSA9IHRoaXMuX3Jvb3RDYXRlZ29yeUlkO1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl90aGlyZExldmVsU2VsZWN0SWQpLnJlbW92ZSgpO1xyXG4gICAgICAgIGlmIChzZWNvbmRMZXZlbENhdGVnb3J5SWQgPT09IHRoaXMuX3Jvb3RDYXRlZ29yeUlkKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyICR0aGlyZExldmVsRWxlbWVudCA9ICQoYDxkaXY+PHA+dGVzdERpdjwvcD48L2Rpdj5gKTtcclxuICAgICAgICB2YXIgJHNlbGVjdCA9ICQoYDxzZWxlY3QgaWQ9XCIke3RoaXMuX3RoaXJkTGV2ZWxTZWxlY3RJZH1cIiBjbGFzcz1cImZvcm0tY29udHJvbFwiPjwvc2VsZWN0PmApXHJcbiAgICAgICAgICAgIC5hcHBlbmQoYDxvcHRpb24gdmFsdWU9XCIke3RoaXMuX3Jvb3RDYXRlZ29yeUlkfVwiPtiq2YXYp9mFINii2q/Zh9uMINmH2Kc8L29wdGlvbj5gKTtcclxuICAgICAgICB0aGlzLl9hbGxDYXRlZ29yaWVzLmZvckVhY2goY2F0ZWdvcnkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoY2F0ZWdvcnkucGFyZW50Q2F0ZWdvcnlJZCA9PT0gc2Vjb25kTGV2ZWxDYXRlZ29yeUlkKSB7XHJcbiAgICAgICAgICAgICAgICAkc2VsZWN0LmFwcGVuZCgkKFwiPG9wdGlvbj5cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBjYXRlZ29yeS5jYXRlZ29yeUlkLFxyXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IGNhdGVnb3J5LmNhdGVnb3J5TmFtZVxyXG4gICAgICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7Ly9mb3JFYWNoXHJcbiAgICAgICAgJHRoaXJkTGV2ZWxFbGVtZW50LmFwcGVuZCgkc2VsZWN0KTtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fcGFyZW50RGl2SWQpLmFwcGVuZCgkdGhpcmRMZXZlbEVsZW1lbnQpO1xyXG5cclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fdGhpcmRMZXZlbFNlbGVjdElkKS5jaGFuZ2UoKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBzZWxlY3RlZElkID0gcGFyc2VJbnQoJChldmVudC5jdXJyZW50VGFyZ2V0KS52YWwoKS50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUaHJlZSA9IHNlbGVjdGVkSWQ7XHJcbiAgICAgICAgICAgIHRoaXMuU2VsZWN0ZWRDYXRlZ29yeUNoYW5nZWQuZGlzcGF0Y2godGhpcywgdGhpcy5HZXRTZWxlY3RlZENhdGVnb3J5SWQoKSk7XHJcbiAgICAgICAgfSk7Ly9jaGFuZ2VcclxuICAgIH1cclxufVxyXG5cclxuIiwi77u/aW1wb3J0IHtJRXZlbnR9ICBmcm9tIFwiLi9JRXZlbnRcIjtcclxuXHJcblxyXG4vKiBUaGUgZGlzcGF0Y2hlciBoYW5kbGVzIHRoZSBzdG9yYWdlIG9mIHN1YnNjaXB0aW9ucyBhbmQgZmFjaWxpdGF0ZXNcclxuICBzdWJzY3JpcHRpb24sIHVuc3Vic2NyaXB0aW9uIGFuZCBkaXNwYXRjaGluZyBvZiB0aGUgZXZlbnQgKi9cclxuZXhwb3J0ICBjbGFzcyBFdmVudERpc3BhdGNoZXI8VFNlbmRlciwgVEFyZ3M+IGltcGxlbWVudHMgSUV2ZW50PFRTZW5kZXIsIFRBcmdzPiB7XHJcblxyXG4gICAgcHJpdmF0ZSBfc3Vic2NyaXB0aW9uczogQXJyYXk8KHNlbmRlcjogVFNlbmRlciwgYXJnczogVEFyZ3MpID0+IHZvaWQ+ID0gbmV3IEFycmF5PChzZW5kZXI6IFRTZW5kZXIsIGFyZ3M6IFRBcmdzKSA9PiB2b2lkPigpO1xyXG5cclxuICAgIFN1YnNjcmliZShmbjogKHNlbmRlcjogVFNlbmRlciwgYXJnczogVEFyZ3MpID0+IHZvaWQpOiB2b2lkIHtcclxuICAgICAgICBpZiAoZm4pIHtcclxuICAgICAgICAgICAgdGhpcy5fc3Vic2NyaXB0aW9ucy5wdXNoKGZuKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgVW5zdWJzY3JpYmUoZm46IChzZW5kZXI6IFRTZW5kZXIsIGFyZ3M6IFRBcmdzKSA9PiB2b2lkKTogdm9pZCB7XHJcbiAgICAgICAgbGV0IGkgPSB0aGlzLl9zdWJzY3JpcHRpb25zLmluZGV4T2YoZm4pO1xyXG4gICAgICAgIGlmIChpID4gLTEpIHtcclxuICAgICAgICAgICAgdGhpcy5fc3Vic2NyaXB0aW9ucy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGRpc3BhdGNoKHNlbmRlcjogVFNlbmRlciwgYXJnczogVEFyZ3MpOiB2b2lkIHtcclxuICAgICAgICBmb3IgKGxldCBoYW5kbGVyIG9mIHRoaXMuX3N1YnNjcmlwdGlvbnMpIHtcclxuICAgICAgICAgICAgaGFuZGxlcihzZW5kZXIsIGFyZ3MpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIu+7v2V4cG9ydCBjbGFzcyBTZWFyY2hBZFVzZXJJbnB1dCB7XHJcbiAgICBwdWJsaWMgU3RhcnRJbmRleDogbnVtYmVyO1xyXG4gICAgcHVibGljIENvdW50OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgQ2F0ZWdvcnlJZDogbnVtYmVyO1xyXG4gICAgcHVibGljIE1pbmltdW1QcmljZTogbnVtYmVyO1xyXG4gICAgcHVibGljIE1heGltdW1QcmljZTogbnVtYmVyO1xyXG4gICAgcHVibGljIE9yZGVyQnk6IHN0cmluZztcclxuICAgIHB1YmxpYyBSZXF1ZXN0SW5kZXg6IG51bWJlcjtcclxufVxyXG5cclxuIiwi77u/aW1wb3J0IHsgU2VhcmNoQWRVc2VySW5wdXQgfSBmcm9tIFwiLi9TZWFyY2hBZFVzZXJJbnB1dFwiO1xyXG5leHBvcnQgY2xhc3MgU2VydmVyQ2FsbGVyIHtcclxuICAgIHByaXZhdGUgX2luaXRpYWxTdGFydDogbnVtYmVyID0gMTtcclxuICAgIHByaXZhdGUgX3N0YXJ0OiBudW1iZXIgPSAxO1xyXG4gICAgcHJpdmF0ZSBfY291bnQ6IG51bWJlciA9IDU7XHJcbiAgICBwcml2YXRlIF9yZXF1ZXN0SW5kZXg6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIF9wcmV2aW91c1JlcXVlc3RJbmRleDogbnVtYmVyID0gLTE7XHJcbiAgICBwcml2YXRlIF9pc1NlcnZlckNhbGxlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBfbnVtYmVyT2ZTdGFydFNlcnZlckNhbGxOb3RpZmljYXRpb246IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIF91cmw6IHN0cmluZyA9IFwiYXBpL0FkQXBpL0dldEFkdmVydGlzZW1lbnRDb21tb25cIjtcclxuXHJcbiAgICBwdWJsaWMgR2V0QWRJdGVtc0Zyb21TZXJ2ZXIoY2F0ZWdvcnlJZDogbnVtYmVyLG1pblByaWNlOiBudW1iZXIsbWF4UHJpY2U6IG51bWJlcixvcmRlckJ5OiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICBsZXQgdXNlcklucHV0ID0gbmV3IFNlYXJjaEFkVXNlcklucHV0KCk7XHJcbiAgICAgICAgaWYgKHRoaXMuX2lzU2VydmVyQ2FsbGVkICYmICh0aGlzLl9wcmV2aW91c1JlcXVlc3RJbmRleCA9PT0gdGhpcy5fcmVxdWVzdEluZGV4KVxyXG4gICAgICAgICkgeyAvL2EgY2FsbCBpcyBzZW50IGJ1dCBubyBhbnN3ZXIgeWV0XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9IC8vaWZcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fcHJldmlvdXNSZXF1ZXN0SW5kZXggPSB0aGlzLl9yZXF1ZXN0SW5kZXg7XHJcbiAgICAgICAgICAgIHRoaXMuX2lzU2VydmVyQ2FsbGVkID0gdHJ1ZTtcclxuICAgICAgICB9IC8vZWxzZVxyXG5cclxuICAgICAgICB1c2VySW5wdXQuU3RhcnRJbmRleCA9IHRoaXMuX3N0YXJ0O1xyXG4gICAgICAgIHVzZXJJbnB1dC5Db3VudCA9IHRoaXMuX2NvdW50O1xyXG4gICAgICAgIC8vVE9ETyBwYXNzIHRoZSBvYmplY3QgdG8gdGhlIGNhdGVnb3J5IHNlbGVjdG9yIGVsZW1lbnQgYW5kIGxldCBpdCBmaWxsIHRoZSBjYXRlZ29yeUlkXHJcbiAgICAgICAgLy9PUiBjYWxsIGEgbWV0aG9kIG9uIGNhdGVnb3J5IHNlbGVjdG9yIGVsZW1lbnQgdG8gZ2V0IGNhdGVnb3J5SWRcclxuICAgICAgICB1c2VySW5wdXQuQ2F0ZWdvcnlJZCA9IGNhdGVnb3J5SWQ7IC8vMTAwIGZvciBjYXJzXHJcbiAgICAgICAgdXNlcklucHV0Lk1pbmltdW1QcmljZSA9IG1pblByaWNlO1xyXG4gICAgICAgIHVzZXJJbnB1dC5NYXhpbXVtUHJpY2UgPSBtYXhQcmljZTtcclxuICAgICAgICB1c2VySW5wdXQuT3JkZXJCeSA9IG9yZGVyQnk7XHJcbiAgICAgICAgdXNlcklucHV0LlJlcXVlc3RJbmRleCA9IHRoaXMuX3JlcXVlc3RJbmRleDtcclxuXHJcbiAgICAgICAgLy9ub3RpZnlVc2VyQWpheENhbGxTdGFydGVkKCk7XHJcbiAgICAgXHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogXCJQT1NUXCIsIC8vR0VUIG9yIFBPU1Qgb3IgUFVUIG9yIERFTEVURSB2ZXJiXHJcbiAgICAgICAgICAgIHVybDogdGhpcy5fdXJsLFxyXG4gICAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeSh1c2VySW5wdXQpLCAvL0RhdGEgc2VudCB0byBzZXJ2ZXJcclxuICAgICAgICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJywgLy8gY29udGVudCB0eXBlIHNlbnQgdG8gc2VydmVyXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IChtc2csdGV4dFN0YXR1cyxqcVhIUik9PiB7dGhpcy5vblN1Y2Nlc3NHZXRJdGVtc0Zyb21TZXJ2ZXIobXNnLHRleHRTdGF0dXMsanFYSFIpO30sIC8vT24gU3VjY2Vzc2Z1bGwgc2VydmljZSBjYWxsXHJcbiAgICAgICAgICAgIGVycm9yOiAoanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uRXJyb3JHZXRJdGVtc0Zyb21TZXJ2ZXIoanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKTtcclxuICAgICAgICAgICAgfSAvLyBXaGVuIFNlcnZpY2UgY2FsbCBmYWlsc1xyXG4gICAgICAgIH0pOyAvLy5hamF4XHJcbiAgICB9IC8vR2V0QWRJdGVtc0Zyb21TZXJ2ZXJcclxuXHJcbiAgICAgXHJcbiAgICBwcml2YXRlIG9uU3VjY2Vzc0dldEl0ZW1zRnJvbVNlcnZlcihtc2c6YW55LHRleHRTdGF0dXM6c3RyaW5nLCBqcVhIUjpKUXVlcnlYSFIpIHtcclxuICAgICAgICAvL25vdGlmeVVzZXJBamF4Q2FsbEZpbmlzaGVkKCk7XHJcbiAgICAgICAgaWYgKG1zZy5zdWNjZXNzID09IHRydWUpIHtcclxuICAgICAgICAgICAgaWYgKG1zZy5jdXN0b21EaWN0aW9uYXJ5W1wiUmVxdWVzdEluZGV4XCJdID09IHRoaXMuX3JlcXVlc3RJbmRleCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc3RhcnQgKz0gcGFyc2VJbnQobXNnLmN1c3RvbURpY3Rpb25hcnlbXCJudW1iZXJPZkl0ZW1zXCJdKTtcclxuICAgICAgICAgICAgICAgIHZhciB0ZW1wbGF0ZSA9ICQoJyNzaW5nbGVBZEl0ZW0nKS5odG1sKCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGF0YTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbXNnLnJlc3BvbnNlRGF0YS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBhZEltYWdlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobXNnLnJlc3BvbnNlRGF0YVtpXS5hZHZlcnRpc2VtZW50SW1hZ2VzWzBdICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWRJbWFnZSA9IFwiZGF0YTppbWFnZS9qcGc7YmFzZTY0LFwiICsgbXNnLnJlc3BvbnNlRGF0YVtpXS5hZHZlcnRpc2VtZW50SW1hZ2VzWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gLy9lbmQgaWZcclxuICAgICAgICAgICAgICAgICAgICBkYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBBZHZlcnRpc2VtZW50SWQ6IG1zZy5yZXNwb25zZURhdGFbaV0uYWR2ZXJ0aXNlbWVudElkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBBZHZlcnRpc2VtZW50Q2F0ZWdvcnlJZDogbXNnLnJlc3BvbnNlRGF0YVtpXS5hZHZlcnRpc2VtZW50Q2F0ZWdvcnlJZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgQWR2ZXJ0aXNlbWVudENhdGVnb3J5OiBtc2cucmVzcG9uc2VEYXRhW2ldLmFkdmVydGlzZW1lbnRDYXRlZ29yeSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWRJbWFnZTogYWRJbWFnZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWRQcmljZTogbXNnLnJlc3BvbnNlRGF0YVtpXS5hZHZlcnRpc2VtZW50UHJpY2UucHJpY2UsIC8vdG9kbyBjaGVjayB0aGUgcHJpY2UgdHlwZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBBZHZlcnRpc2VtZW50VGl0bGU6IG1zZy5yZXNwb25zZURhdGFbaV0uYWR2ZXJ0aXNlbWVudFRpdGxlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBBZHZlcnRpc2VtZW50U3RhdHVzOiBtc2cucmVzcG9uc2VEYXRhW2ldLmFkdmVydGlzZW1lbnRTdGF0dXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9hZERhdGU6IG1zZy5SZXNwb25zZURhdGFbaV0uQWRUaW1lXHJcbiAgICAgICAgICAgICAgICAgICAgfSAvL2VuZCBkYXRhXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBodG1sID0gTXVzdGFjaGUudG9faHRtbCh0ZW1wbGF0ZSwgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgJChcIiNhZFBsYWNlSG9sZGVyXCIpLmFwcGVuZChodG1sKTtcclxuICAgICAgICAgICAgICAgIH0gLy9lbmQgZm9yXHJcbiAgICAgICAgICAgIH0gLy9lbmQgaWZcclxuICAgICAgICB9IC8vZW5kIGlmXHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIC8vc2hvd0Vycm9yTWVzc2FnZShtc2cuTWVzc2FnZSArIFwiICwgXCIgKyBtc2cuRXJyb3JDb2RlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5faXNTZXJ2ZXJDYWxsZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9yZXF1ZXN0SW5kZXgrKztcclxuICAgIH0gLy9lbmQgT25TdWNjZXNzR2V0VGltZUZyb21TZXJ2ZXJcclxuXHJcbiAgICBcclxuICAgIHByaXZhdGUgb25FcnJvckdldEl0ZW1zRnJvbVNlcnZlcihqcVhIUjpKUXVlcnlYSFIsIHRleHRTdGF0dXM6c3RyaW5nLCBlcnJvclRocm93bjpzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLl9pc1NlcnZlckNhbGxlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX3JlcXVlc3RJbmRleCsrO1xyXG4gICAgICAgIC8vbm90aWZ5VXNlckFqYXhDYWxsRmluaXNoZWQoKTtcclxuICAgICAgICAvL3Nob3dFcnJvck1lc3NhZ2UodGV4dFN0YXR1cyArIFwiICwgXCIgKyBlcnJvclRocm93bik7XHJcbiAgICB9IC8vZW5kIE9uRXJyb3JHZXRUaW1lRnJvbVNlcnZlclxyXG5cclxuICAgIHB1YmxpYyBSZXNldFNlYXJjaFBhcmFtZXRlcnMoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fc3RhcnQgPSB0aGlzLl9pbml0aWFsU3RhcnQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbiIsIu+7v2ltcG9ydCB7Q2F0ZWdvcnl9IGZyb20gXCIuLi8uLi8uLi9Nb2RlbHMvQ2F0ZWdvcnlcIjtcclxuaW1wb3J0IHsgQ2F0ZWdvcnlTZWxlY3Rpb24gfSBmcm9tIFwiLi4vLi4vLi4vQ29tcG9uZW50cy9DYXRlZ29yeVNlbGVjdGlvblwiO1xyXG5pbXBvcnQgeyBTZXJ2ZXJDYWxsZXIgfSBmcm9tIFwiLi9TZXJ2ZXJDYWxsZXJcIjtcclxuXHJcbmNsYXNzIEluZGV4IHtcclxuICAgIHByaXZhdGUgIF9zZXJ2ZXJDYWxsZXIgPSBuZXcgU2VydmVyQ2FsbGVyKCk7XHJcbiAgICBwcml2YXRlICBfY2F0ZWdvcnlTZWxlY3Rpb246IENhdGVnb3J5U2VsZWN0aW9uO1xyXG5cclxuICAgIHByaXZhdGUgX2NhdGVnb3J5U2VsZWN0b3JQYXJlbnREaXZJZDogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBfZ2V0QWRGcm9tU2VydmVySWQ6IHN0cmluZztcclxuICAgIHByaXZhdGUgX2FsbENhdGVnb3JpZXNJZDogc3RyaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNhdGVnb3J5U2VsZWN0b3JQYXJlbnREaXZJZDogc3RyaW5nLFxyXG4gICAgICAgICAgICAgICAgYWxsQ2F0ZWdvcmllc0lkOnN0cmluZyxcclxuICAgICAgICAgICAgICAgIGdldEFkRnJvbVNlcnZlcklkOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLl9jYXRlZ29yeVNlbGVjdG9yUGFyZW50RGl2SWQgPSBjYXRlZ29yeVNlbGVjdG9yUGFyZW50RGl2SWQ7XHJcbiAgICAgICAgdGhpcy5fYWxsQ2F0ZWdvcmllc0lkID0gYWxsQ2F0ZWdvcmllc0lkO1xyXG4gICAgICAgIHRoaXMuX2dldEFkRnJvbVNlcnZlcklkID0gZ2V0QWRGcm9tU2VydmVySWQ7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5pbml0UGFnZSgpO1xyXG4gICAgICAgIHRoaXMuaW5pdEV2ZW50SGFuZGxlcnMoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXRQYWdlKCk6IHZvaWQge1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLmluaXRDYXRlZ29yeVNlbGVjdGlvbkNvbnRyb2woKTtcclxuICAgICAgICAgICAgdGhpcy5pbml0R2V0QWRGcm9tU2VydmVyKCk7XHJcbiAgICAgICAgICAgIHRoaXMuaW5pdFNpbmdsZUFkSXRlbVN0eWxlKCk7XHJcbiAgICAgICAgXHJcbiAgICB9Ly9pbml0UGFnZVxyXG5cclxuICAgIHByaXZhdGUgIGluaXRDYXRlZ29yeVNlbGVjdGlvbkNvbnRyb2woKTogdm9pZCB7XHJcbiAgICAgICAgLy9BZGQgZmlyc3QgbGV2ZWwgY2F0ZWdvcmllc1xyXG4gICAgICAgIGxldCBhbGxDYXRlZ29yaWVzU3RyaW5nID0gJChcIiNcIit0aGlzLl9hbGxDYXRlZ29yaWVzSWQpLnZhbCgpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgbGV0IGFsbENhdGVnb3JpZXMgPSAkLnBhcnNlSlNPTihhbGxDYXRlZ29yaWVzU3RyaW5nKSBhcyBDYXRlZ29yeVtdO1xyXG4gICAgICAgIHRoaXMuX2NhdGVnb3J5U2VsZWN0aW9uID0gbmV3IENhdGVnb3J5U2VsZWN0aW9uKHRoaXMuX2NhdGVnb3J5U2VsZWN0b3JQYXJlbnREaXZJZCwgYWxsQ2F0ZWdvcmllcyk7XHJcbiAgICAgICAgdGhpcy5fY2F0ZWdvcnlTZWxlY3Rpb24uQ3JlYXRlRmlyc3RMZXZlbCgpO1xyXG4gICAgICAgIFxyXG4gICAgfS8vaW5pdENhdGVnb3J5U2VsZWN0aW9uQ29udHJvbFxyXG5cclxuICAgIHByaXZhdGUgaW5pdEV2ZW50SGFuZGxlcnMoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fY2F0ZWdvcnlTZWxlY3Rpb24uU2VsZWN0ZWRDYXRlZ29yeUNoYW5nZWQuU3Vic2NyaWJlKChzZW5kZXIsIGFyZ3MpID0+IHtcclxuICAgICAgICAgICAgJChcIiNhZFBsYWNlSG9sZGVyXCIpLmNoaWxkcmVuKCkucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3NlcnZlckNhbGxlci5SZXNldFNlYXJjaFBhcmFtZXRlcnMoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXRHZXRBZEZyb21TZXJ2ZXIoKTp2b2lkIHtcclxuICAgICAgICAkKFwiI1wiK3RoaXMuX2dldEFkRnJvbVNlcnZlcklkKS5vbihcImNsaWNrXCIsIChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGNhdGVnb3J5SWQgPSB0aGlzLl9jYXRlZ29yeVNlbGVjdGlvbi5HZXRTZWxlY3RlZENhdGVnb3J5SWQoKTtcclxuICAgICAgICAgICAgbGV0IG1pblByaWNlID0gcGFyc2VJbnQoJChcIiNtaW5QcmljZVwiKS52YWwoKS50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgbGV0IG1heFByaWNlID0gcGFyc2VJbnQoJChcIiNtYXhQcmljZVwiKS52YWwoKS50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgbGV0IG9yZGVyQnkgPSAkKFwiI29yZGVyQnlcIikudmFsKCkudG9TdHJpbmcoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX3NlcnZlckNhbGxlci5HZXRBZEl0ZW1zRnJvbVNlcnZlcihjYXRlZ29yeUlkLCBtaW5QcmljZSwgbWF4UHJpY2UsIG9yZGVyQnkpO1xyXG4gICAgICAgIH0pOyAvL2NsaWNrXHJcbiAgICB9Ly9pbml0R2V0QWRGcm9tU2VydmVyXHJcblxyXG4gICAgcHJpdmF0ZSBpbml0U2luZ2xlQWRJdGVtU3R5bGUoKTogdm9pZCB7XHJcbiAgICAgICAgLy9zaG93IGRldGFpbCBvZiBzaW5nbGVBZEl0ZW0gd2hlbiBtb3VzZSBvdmVyXHJcbiAgICAgICAgJChkb2N1bWVudCkub24oXCJtb3VzZWVudGVyIG1vdXNlbGVhdmVcIiwgXCIuYmxvY2tEaXNwbGF5XCIsIChldmVudDogSlF1ZXJ5LkV2ZW50PEhUTUxFbGVtZW50LCBudWxsPikgPT4ge1xyXG4gICAgICAgICAgICAkKGV2ZW50LmN1cnJlbnRUYXJnZXQpLmZpbmQoXCIubW9yZUluZm9cIikuZmFkZVRvZ2dsZSgyNTApO1xyXG4gICAgICAgICAgICAvLyQodGhpcykuZmluZChcIi5tb3JlSW5mb1wiKS5mYWRlVG9nZ2xlKDI1MCk7XHJcbiAgICAgICAgfSk7Ly9lbmQgb25cclxuICAgIH0vL2luaXRTaW5nbGVBZEl0ZW1TdHlsZVxyXG59XHJcblxyXG5sZXQgY2F0ZWdvcnlTZWxlY3RvclBhcmVudERpdklkOiBzdHJpbmcgPSBcImNhdGVnb3J5U2VsZWN0b3JcIjtcclxubGV0IGdldEFkRnJvbVNlcnZlcklkID0gXCJnZXRBZEZyb21TZXJ2ZXJcIjtcclxubGV0IGFsbENhdGVnb3JpZXNJZCA9IFwiYWxsQ2F0ZWdvcmllc1wiO1xyXG5cclxuJChkb2N1bWVudCkucmVhZHkoKCkgPT4ge1xyXG4gICAgbGV0IGluZGV4ID0gbmV3IEluZGV4KGNhdGVnb3J5U2VsZWN0b3JQYXJlbnREaXZJZCwgYWxsQ2F0ZWdvcmllc0lkLCBnZXRBZEZyb21TZXJ2ZXJJZCk7XHJcbn0pOy8vcmVhZHlcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuIl19
