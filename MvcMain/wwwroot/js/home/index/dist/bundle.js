(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventDispatcher_1 = require("../Events/EventDispatcher");
var Category = /** @class */ (function () {
    function Category() {
    }
    return Category;
}());
exports.Category = Category;
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
    ;
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
            self.SelectedCategoryChanged.dispatch(self, self.GetSelectedCategoryId());
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
    return ServerCaller;
}());
exports.ServerCaller = ServerCaller;
},{"./SearchAdUserInput":3}],5:[function(require,module,exports){
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
//Category Selection
//TODO move it to app.js file
$(document).ready(function () {
    //Add first level categories
    var allCategoriesString = $("#allCategories").val().toString();
    var allCategories = $.parseJSON(allCategoriesString);
    var categorySelection = new CategorySelection_1.CategorySelection("categorySelector", allCategories);
    categorySelection.SelectedCategoryChanged.Subscribe(function (sender, args) {
        alert("selected category changed " + args);
    });
    categorySelection.CreateFirstLevel();
}); //ready
},{"../../../Components/CategorySelection":1,"./ServerCaller":4}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3d3dyb290L2pzL0NvbXBvbmVudHMvQ2F0ZWdvcnlTZWxlY3Rpb24udHMiLCJ3d3dyb290L2pzL0V2ZW50cy9FdmVudERpc3BhdGNoZXIudHMiLCJ3d3dyb290L2pzL2hvbWUvaW5kZXgvc3JjL1NlYXJjaEFkVXNlcklucHV0LnRzIiwid3d3cm9vdC9qcy9ob21lL2luZGV4L3NyYy9TZXJ2ZXJDYWxsZXIudHMiLCJ3d3dyb290L2pzL2hvbWUvaW5kZXgvc3JjL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQyw2REFBMEQ7QUFFM0Q7SUFBQTtJQUtBLENBQUM7SUFBRCxlQUFDO0FBQUQsQ0FMQSxBQUtDLElBQUE7QUFMWSw0QkFBUTtBQU1yQjtJQWdCSSwyQkFBWSxXQUFtQixFQUFFLGFBQXlCO1FBWHpDLHdCQUFtQixHQUFXLFdBQVcsQ0FBQztRQUMxQyx5QkFBb0IsR0FBVyxXQUFXLENBQUM7UUFDM0Msd0JBQW1CLEdBQVcsV0FBVyxDQUFDO1FBQzFDLG9CQUFlLEdBQVcsQ0FBQyxDQUFDO1FBTXRDLDRCQUF1QixHQUErQyxJQUFJLGlDQUFlLEVBQTZCLENBQUM7UUFHMUgsSUFBSSxDQUFDLFlBQVksR0FBRyxXQUFXLENBQUM7UUFDaEMsSUFBSSxDQUFDLGNBQWMsR0FBRyxhQUFhLENBQUM7SUFDeEMsQ0FBQztJQUw2SCxDQUFDO0lBT3hILGlEQUFxQixHQUE1QjtRQUNJLEVBQUUsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLDZCQUE2QixLQUFLLElBQUksQ0FBQyxlQUFlLENBQUM7WUFDekUsTUFBTSxDQUFDLGlCQUFpQixDQUFDLDZCQUE2QixDQUFDO1FBQzNELElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQywyQkFBMkIsS0FBSyxJQUFJLENBQUMsZUFBZSxDQUFDO1lBQzVFLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQywyQkFBMkIsQ0FB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Q0FBQztBQUN6QyxDQUFDLENBQUMsQ0FBQyxDQUFBLE9BQU8iLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwi77u/aW1wb3J0IHtFdmVudERpc3BhdGNoZXJ9IGZyb20gXCIuLi9FdmVudHMvRXZlbnREaXNwYXRjaGVyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQ2F0ZWdvcnkge1xyXG4gICAgcHVibGljIGNhdGVnb3J5SWQ6IG51bWJlcjtcclxuICAgIHB1YmxpYyBwYXJlbnRDYXRlZ29yeUlkOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgY2F0ZWdvcnlOYW1lOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgZW5nbGlzaENhdGVnb3J5TmFtZTogc3RyaW5nO1xyXG59XHJcbmV4cG9ydCBjbGFzcyBDYXRlZ29yeVNlbGVjdGlvbiB7XHJcbiAgICAvL1RPRE8gd2hhdCBpZiBhIGxldmVsIGhhcyBubyBpdGVtIGF0IGFsbFxyXG4gICAgLy9UT0RPIHdoYXQgaWYgb24gbGV2ZWwgc2VsZWN0ZWQgaWQgaXMgMFxyXG4gICAgcHJpdmF0ZSBfcGFyZW50RGl2SWQ6IHN0cmluZzsvL2RpdiBlbGVtZW50IHRoYXQgaG9sZHMgYWxsIENhdGVnb3J5U2VsZWN0aW9uIGVsZW1lbnRzXHJcbiAgICBwcml2YXRlIF9hbGxDYXRlZ29yaWVzOiBDYXRlZ29yeVtdO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfZmlyc3RMZXZlbFNlbGVjdElkOiBzdHJpbmcgPSBcImNhdGVnb3J5MVwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfc2Vjb25kTGV2ZWxTZWxlY3RJZDogc3RyaW5nID0gXCJjYXRlZ29yeTJcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX3RoaXJkTGV2ZWxTZWxlY3RJZDogc3RyaW5nID0gXCJjYXRlZ29yeTNcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX3Jvb3RDYXRlZ29yeUlkOiBudW1iZXIgPSAwO1xyXG4gICAgXHJcbiAgICBwcml2YXRlIHN0YXRpYyBfc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxPbmU6IG51bWJlcjtcclxuICAgIHByaXZhdGUgc3RhdGljIF9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFR3bzogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgIF9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFRocmVlOm51bWJlcjtcclxuXHJcbiAgICBwdWJsaWMgU2VsZWN0ZWRDYXRlZ29yeUNoYW5nZWQ6IEV2ZW50RGlzcGF0Y2hlcjxDYXRlZ29yeVNlbGVjdGlvbiwgbnVtYmVyPiA9IG5ldyBFdmVudERpc3BhdGNoZXI8Q2F0ZWdvcnlTZWxlY3Rpb24sIG51bWJlcj4oKTs7XHJcblxyXG4gICAgY29uc3RydWN0b3IocGFyZW50RGl2SWQ6IHN0cmluZywgYWxsQ2F0ZWdvcmllczogQ2F0ZWdvcnlbXSkge1xyXG4gICAgICAgIHRoaXMuX3BhcmVudERpdklkID0gcGFyZW50RGl2SWQ7XHJcbiAgICAgICAgdGhpcy5fYWxsQ2F0ZWdvcmllcyA9IGFsbENhdGVnb3JpZXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIEdldFNlbGVjdGVkQ2F0ZWdvcnlJZCgpOiBudW1iZXIge1xyXG4gICAgICAgIGlmIChDYXRlZ29yeVNlbGVjdGlvbi5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUaHJlZSAhPT0gdGhpcy5fcm9vdENhdGVnb3J5SWQpXHJcbiAgICAgICAgICAgIHJldHVybiBDYXRlZ29yeVNlbGVjdGlvbi5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUaHJlZTtcclxuICAgICAgICBlbHNlIGlmIChDYXRlZ29yeVNlbGVjdGlvbi5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUd28gIT09IHRoaXMuX3Jvb3RDYXRlZ29yeUlkKVxyXG4gICAgICAgICAgICByZXR1cm4gQ2F0ZWdvcnlTZWxlY3Rpb24uX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVHdvO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgcmV0dXJuIENhdGVnb3J5U2VsZWN0aW9uLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbE9uZTsgXHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICB9Ly9HZXRTZWxlY3RlZENhdGVnb3J5SWRcclxuXHJcbiAgICBwdWJsaWMgQ3JlYXRlRmlyc3RMZXZlbCgpOiB2b2lkIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgQ2F0ZWdvcnlTZWxlY3Rpb24uX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsT25lID0gdGhpcy5fcm9vdENhdGVnb3J5SWQ7XHJcbiAgICAgICAgdGhpcy5fYWxsQ2F0ZWdvcmllcy5mb3JFYWNoKGNhdGVnb3J5ID0+IHtcclxuICAgICAgICAgICAgaWYgKGNhdGVnb3J5LnBhcmVudENhdGVnb3J5SWQgPT09IHNlbGYuX3Jvb3RDYXRlZ29yeUlkKSB7XHJcbiAgICAgICAgICAgICAgICAkKFwiI1wiICsgc2VsZi5fZmlyc3RMZXZlbFNlbGVjdElkKS5hcHBlbmQoJChcIjxvcHRpb24+XCIsIHtcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogY2F0ZWdvcnkuY2F0ZWdvcnlJZCxcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBjYXRlZ29yeS5jYXRlZ29yeU5hbWVcclxuICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgfS8vaWZcclxuICAgICAgICB9KTsvL2ZvckVhY2hcclxuXHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX2ZpcnN0TGV2ZWxTZWxlY3RJZCkuY2hhbmdlKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgbGV0IHNlbGVjdGVkSWQgPSBwYXJzZUludCgkKHRoaXMpLnZhbCgpLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICBDYXRlZ29yeVNlbGVjdGlvbi5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxPbmUgPSBzZWxlY3RlZElkO1xyXG4gICAgICAgICAgICBzZWxmLkNyZWF0ZVNlY29uZExldmVsKHNlbGVjdGVkSWQpO1xyXG4gICAgICAgICAgICBzZWxmLlNlbGVjdGVkQ2F0ZWdvcnlDaGFuZ2VkLmRpc3BhdGNoKHNlbGYsIHNlbGYuR2V0U2VsZWN0ZWRDYXRlZ29yeUlkKCkpO1xyXG4gICAgICAgIH0pOy8vY2hhbmdlXHJcblxyXG4gICAgfS8vQ3JlYXRlRmlyc3RMZXZlbFxyXG5cclxuICAgIHByaXZhdGUgQ3JlYXRlU2Vjb25kTGV2ZWwoZmlyc3RMZXZlbENhdGVnb3J5SWQ6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBDYXRlZ29yeVNlbGVjdGlvbi5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUd28gPSB0aGlzLl9yb290Q2F0ZWdvcnlJZDtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fc2Vjb25kTGV2ZWxTZWxlY3RJZCkucmVtb3ZlKCk7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX3RoaXJkTGV2ZWxTZWxlY3RJZCkucmVtb3ZlKCk7XHJcbiAgICAgICAgaWYgKGZpcnN0TGV2ZWxDYXRlZ29yeUlkID09PSB0aGlzLl9yb290Q2F0ZWdvcnlJZCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciAkc2VsZWN0ID0gJChgPHNlbGVjdCBpZD1cIiR7dGhpcy5fc2Vjb25kTGV2ZWxTZWxlY3RJZH1cIiBjbGFzcz1cImZvcm0tY29udHJvbFwiPjwvc2VsZWN0PmApXHJcbiAgICAgICAgICAgIC5hcHBlbmQoYDxvcHRpb24gdmFsdWU9XCIke3RoaXMuX3Jvb3RDYXRlZ29yeUlkfVwiPtiq2YXYp9mFINii2q/Zh9uMINmH2Kc8L29wdGlvbj5gKTtcclxuICAgICAgICB0aGlzLl9hbGxDYXRlZ29yaWVzLmZvckVhY2goY2F0ZWdvcnkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoY2F0ZWdvcnkucGFyZW50Q2F0ZWdvcnlJZCA9PT0gZmlyc3RMZXZlbENhdGVnb3J5SWQpIHtcclxuICAgICAgICAgICAgICAgICRzZWxlY3QuYXBwZW5kKCQoXCI8b3B0aW9uPlwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGNhdGVnb3J5LmNhdGVnb3J5SWQsXHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogY2F0ZWdvcnkuY2F0ZWdvcnlOYW1lXHJcbiAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTsvL2ZvckVhY2hcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fcGFyZW50RGl2SWQpLmFwcGVuZCgkc2VsZWN0KTtcclxuXHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX3NlY29uZExldmVsU2VsZWN0SWQpLmNoYW5nZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGxldCBzZWxlY3RlZElkID0gcGFyc2VJbnQoJCh0aGlzKS52YWwoKS50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgQ2F0ZWdvcnlTZWxlY3Rpb24uX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVHdvID0gc2VsZWN0ZWRJZDtcclxuICAgICAgICAgICAgc2VsZi5DcmVhdGVUaGlyZExldmVsKHNlbGVjdGVkSWQpO1xyXG4gICAgICAgIH0pOy8vY2hhbmdlXHJcbiAgICB9XHJcblxyXG4gICAgQ3JlYXRlVGhpcmRMZXZlbChzZWNvbmRMZXZlbENhdGVnb3J5SWQ6IG51bWJlcik6dm9pZCB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIENhdGVnb3J5U2VsZWN0aW9uLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFRocmVlID0gdGhpcy5fcm9vdENhdGVnb3J5SWQ7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX3RoaXJkTGV2ZWxTZWxlY3RJZCkucmVtb3ZlKCk7XHJcbiAgICAgICAgaWYgKHNlY29uZExldmVsQ2F0ZWdvcnlJZCA9PT0gdGhpcy5fcm9vdENhdGVnb3J5SWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgJHNlbGVjdCA9ICQoYDxzZWxlY3QgaWQ9XCIke3RoaXMuX3RoaXJkTGV2ZWxTZWxlY3RJZH1cIiBjbGFzcz1cImZvcm0tY29udHJvbFwiPjwvc2VsZWN0PmApXHJcbiAgICAgICAgICAgIC5hcHBlbmQoYDxvcHRpb24gdmFsdWU9XCIke3RoaXMuX3Jvb3RDYXRlZ29yeUlkfVwiPtiq2YXYp9mFINii2q/Zh9uMINmH2Kc8L29wdGlvbj5gKTtcclxuICAgICAgICB0aGlzLl9hbGxDYXRlZ29yaWVzLmZvckVhY2goY2F0ZWdvcnkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoY2F0ZWdvcnkucGFyZW50Q2F0ZWdvcnlJZCA9PT0gc2Vjb25kTGV2ZWxDYXRlZ29yeUlkKSB7XHJcbiAgICAgICAgICAgICAgICAkc2VsZWN0LmFwcGVuZCgkKFwiPG9wdGlvbj5cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBjYXRlZ29yeS5jYXRlZ29yeUlkLFxyXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IGNhdGVnb3J5LmNhdGVnb3J5TmFtZVxyXG4gICAgICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7Ly9mb3JFYWNoXHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX3BhcmVudERpdklkKS5hcHBlbmQoJHNlbGVjdCk7XHJcblxyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl90aGlyZExldmVsU2VsZWN0SWQpLmNoYW5nZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGxldCBzZWxlY3RlZElkID0gcGFyc2VJbnQoJCh0aGlzKS52YWwoKS50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgQ2F0ZWdvcnlTZWxlY3Rpb24uX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVGhyZWUgPSBzZWxlY3RlZElkO1xyXG4gICAgICAgIH0pOy8vY2hhbmdlXHJcbiAgICB9XHJcbn1cclxuXHJcbiIsIu+7v2ltcG9ydCB7SUV2ZW50fSAgZnJvbSBcIi4vSUV2ZW50XCI7XHJcblxyXG5cclxuLyogVGhlIGRpc3BhdGNoZXIgaGFuZGxlcyB0aGUgc3RvcmFnZSBvZiBzdWJzY2lwdGlvbnMgYW5kIGZhY2lsaXRhdGVzXHJcbiAgc3Vic2NyaXB0aW9uLCB1bnN1YnNjcmlwdGlvbiBhbmQgZGlzcGF0Y2hpbmcgb2YgdGhlIGV2ZW50ICovXHJcbmV4cG9ydCAgY2xhc3MgRXZlbnREaXNwYXRjaGVyPFRTZW5kZXIsIFRBcmdzPiBpbXBsZW1lbnRzIElFdmVudDxUU2VuZGVyLCBUQXJncz4ge1xyXG5cclxuICAgIHByaXZhdGUgX3N1YnNjcmlwdGlvbnM6IEFycmF5PChzZW5kZXI6IFRTZW5kZXIsIGFyZ3M6IFRBcmdzKSA9PiB2b2lkPiA9IG5ldyBBcnJheTwoc2VuZGVyOiBUU2VuZGVyLCBhcmdzOiBUQXJncykgPT4gdm9pZD4oKTtcclxuXHJcbiAgICBTdWJzY3JpYmUoZm46IChzZW5kZXI6IFRTZW5kZXIsIGFyZ3M6IFRBcmdzKSA9PiB2b2lkKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKGZuKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMucHVzaChmbik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIFVuc3Vic2NyaWJlKGZuOiAoc2VuZGVyOiBUU2VuZGVyLCBhcmdzOiBUQXJncykgPT4gdm9pZCk6IHZvaWQge1xyXG4gICAgICAgIGxldCBpID0gdGhpcy5fc3Vic2NyaXB0aW9ucy5pbmRleE9mKGZuKTtcclxuICAgICAgICBpZiAoaSA+IC0xKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMuc3BsaWNlKGksIDEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBkaXNwYXRjaChzZW5kZXI6IFRTZW5kZXIsIGFyZ3M6IFRBcmdzKTogdm9pZCB7XHJcbiAgICAgICAgZm9yIChsZXQgaGFuZGxlciBvZiB0aGlzLl9zdWJzY3JpcHRpb25zKSB7XHJcbiAgICAgICAgICAgIGhhbmRsZXIoc2VuZGVyLCBhcmdzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCLvu79leHBvcnQgY2xhc3MgU2VhcmNoQWRVc2VySW5wdXQge1xyXG4gICAgcHVibGljIFN0YXJ0SW5kZXg6IG51bWJlcjtcclxuICAgIHB1YmxpYyBDb3VudDogbnVtYmVyO1xyXG4gICAgcHVibGljIENhdGVnb3J5SWQ6IG51bWJlcjtcclxuICAgIHB1YmxpYyBNaW5pbXVtUHJpY2U6IG51bWJlcjtcclxuICAgIHB1YmxpYyBNYXhpbXVtUHJpY2U6IG51bWJlcjtcclxuICAgIHB1YmxpYyBPcmRlckJ5OiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgUmVxdWVzdEluZGV4OiBudW1iZXI7XHJcbn1cclxuXHJcbiIsIu+7v2ltcG9ydCB7U2VhcmNoQWRVc2VySW5wdXR9IGZyb20gXCIuL1NlYXJjaEFkVXNlcklucHV0XCI7XHJcbmV4cG9ydCBjbGFzcyBTZXJ2ZXJDYWxsZXIge1xyXG4gICAgICAgIHByaXZhdGUgX2luaXRpYWxTdGFydDogbnVtYmVyID0gMTtcclxuICAgICAgICBwcml2YXRlIF9zdGFydDogbnVtYmVyID0gMTtcclxuICAgICAgICBwcml2YXRlIF9jb3VudDogbnVtYmVyID0gNTtcclxuICAgICAgICBwcml2YXRlIF9yZXF1ZXN0SW5kZXg6IG51bWJlciA9IDA7XHJcbiAgICAgICAgcHJpdmF0ZSBfcHJldmlvdXNSZXF1ZXN0SW5kZXg6IG51bWJlciA9IC0xO1xyXG4gICAgICAgIHByaXZhdGUgX2lzU2VydmVyQ2FsbGVkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgcHJpdmF0ZSBfbnVtYmVyT2ZTdGFydFNlcnZlckNhbGxOb3RpZmljYXRpb246IG51bWJlciA9IDA7XHJcblxyXG4gICAgICAgIHB1YmxpYyBHZXRBZEl0ZW1zRnJvbVNlcnZlcihjYXRlZ29yeUlkOiBudW1iZXIsXHJcbiAgICAgICAgICAgIG1pblByaWNlOiBudW1iZXIsXHJcbiAgICAgICAgICAgIG1heFByaWNlOiBudW1iZXIsXHJcbiAgICAgICAgICAgIG9yZGVyQnk6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgICAgICBsZXQgdXNlcklucHV0ID0gbmV3IFNlYXJjaEFkVXNlcklucHV0KCk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9pc1NlcnZlckNhbGxlZCAmJiAodGhpcy5fcHJldmlvdXNSZXF1ZXN0SW5kZXggPT09IHRoaXMuX3JlcXVlc3RJbmRleClcclxuICAgICAgICAgICAgKSB7IC8vYSBjYWxsIGlzIHNlbnQgYnV0IG5vIGFuc3dlciB5ZXRcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfSAvL2lmXHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcHJldmlvdXNSZXF1ZXN0SW5kZXggPSB0aGlzLl9yZXF1ZXN0SW5kZXg7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9pc1NlcnZlckNhbGxlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIH0gLy9lbHNlXHJcblxyXG4gICAgICAgICAgICB1c2VySW5wdXQuU3RhcnRJbmRleCA9IHRoaXMuX3N0YXJ0O1xyXG4gICAgICAgICAgICB1c2VySW5wdXQuQ291bnQgPSB0aGlzLl9jb3VudDtcclxuICAgICAgICAgICAgLy9UT0RPIHBhc3MgdGhlIG9iamVjdCB0byB0aGUgY2F0ZWdvcnkgc2VsZWN0b3IgZWxlbWVudCBhbmQgbGV0IGl0IGZpbGwgdGhlIGNhdGVnb3J5SWRcclxuICAgICAgICAgICAgLy9PUiBjYWxsIGEgbWV0aG9kIG9uIGNhdGVnb3J5IHNlbGVjdG9yIGVsZW1lbnQgdG8gZ2V0IGNhdGVnb3J5SWRcclxuICAgICAgICAgICAgdXNlcklucHV0LkNhdGVnb3J5SWQgPSBjYXRlZ29yeUlkOyAvLzEwMCBmb3IgY2Fyc1xyXG4gICAgICAgICAgICB1c2VySW5wdXQuTWluaW11bVByaWNlID0gbWluUHJpY2U7XHJcbiAgICAgICAgICAgIHVzZXJJbnB1dC5NYXhpbXVtUHJpY2UgPSBtYXhQcmljZTtcclxuICAgICAgICAgICAgdXNlcklucHV0Lk9yZGVyQnkgPSBvcmRlckJ5O1xyXG4gICAgICAgICAgICB1c2VySW5wdXQuUmVxdWVzdEluZGV4ID0gdGhpcy5fcmVxdWVzdEluZGV4O1xyXG5cclxuICAgICAgICAgICAgLy9ub3RpZnlVc2VyQWpheENhbGxTdGFydGVkKCk7XHJcbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwiUE9TVFwiLCAvL0dFVCBvciBQT1NUIG9yIFBVVCBvciBERUxFVEUgdmVyYlxyXG4gICAgICAgICAgICAgICAgdXJsOiBcImFwaS9BZEFwaS9HZXRBZHZlcnRpc2VtZW50Q29tbW9uXCIsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeSh1c2VySW5wdXQpLCAvL0RhdGEgc2VudCB0byBzZXJ2ZXJcclxuICAgICAgICAgICAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbicsIC8vIGNvbnRlbnQgdHlwZSBzZW50IHRvIHNlcnZlclxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oYXJnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5vblN1Y2Nlc3NHZXRJdGVtc0Zyb21TZXJ2ZXIoYXJnKVxyXG4gICAgICAgICAgICAgICAgfSwgLy9PbiBTdWNjZXNzZnVsbCBzZXJ2aWNlIGNhbGxcclxuICAgICAgICAgICAgICAgIGVycm9yOiBzZWxmLm9uRXJyb3JHZXRJdGVtc0Zyb21TZXJ2ZXIgLy8gV2hlbiBTZXJ2aWNlIGNhbGwgZmFpbHNcclxuICAgICAgICAgICAgICAgIC8vIFdoZW4gU2VydmljZSBjYWxsIGZhaWxzXHJcbiAgICAgICAgICAgIH0pOyAvLy5hamF4XHJcbiAgICAgICAgfSAvL0dldEFkSXRlbXNGcm9tU2VydmVyXHJcblxyXG4gICAgICAgIHByaXZhdGUgb25TdWNjZXNzR2V0SXRlbXNGcm9tU2VydmVyKG1zZykge1xyXG4gICAgICAgICAgICAvL25vdGlmeVVzZXJBamF4Q2FsbEZpbmlzaGVkKCk7XHJcbiAgICAgICAgICAgIGlmIChtc2cuc3VjY2VzcyA9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobXNnLmN1c3RvbURpY3Rpb25hcnlbXCJSZXF1ZXN0SW5kZXhcIl0gPT0gdGhpcy5fcmVxdWVzdEluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3RhcnQgKz0gcGFyc2VJbnQobXNnLmN1c3RvbURpY3Rpb25hcnlbXCJudW1iZXJPZkl0ZW1zXCJdKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdGVtcGxhdGUgPSAkKCcjc2luZ2xlQWRJdGVtJykuaHRtbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBkYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbXNnLnJlc3BvbnNlRGF0YS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYWRJbWFnZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtc2cucmVzcG9uc2VEYXRhW2ldLmFkdmVydGlzZW1lbnRJbWFnZXNbMF0gIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRJbWFnZSA9IFwiZGF0YTppbWFnZS9qcGc7YmFzZTY0LFwiICsgbXNnLnJlc3BvbnNlRGF0YVtpXS5hZHZlcnRpc2VtZW50SW1hZ2VzWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IC8vZW5kIGlmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBZHZlcnRpc2VtZW50SWQ6IG1zZy5yZXNwb25zZURhdGFbaV0uYWR2ZXJ0aXNlbWVudElkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQWR2ZXJ0aXNlbWVudENhdGVnb3J5SWQ6IG1zZy5yZXNwb25zZURhdGFbaV0uYWR2ZXJ0aXNlbWVudENhdGVnb3J5SWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBZHZlcnRpc2VtZW50Q2F0ZWdvcnk6IG1zZy5yZXNwb25zZURhdGFbaV0uYWR2ZXJ0aXNlbWVudENhdGVnb3J5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRJbWFnZTogYWRJbWFnZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkUHJpY2U6IG1zZy5yZXNwb25zZURhdGFbaV0uYWR2ZXJ0aXNlbWVudFByaWNlLnByaWNlLCAvL3RvZG8gY2hlY2sgdGhlIHByaWNlIHR5cGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFkdmVydGlzZW1lbnRUaXRsZTogbXNnLnJlc3BvbnNlRGF0YVtpXS5hZHZlcnRpc2VtZW50VGl0bGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBZHZlcnRpc2VtZW50U3RhdHVzOiBtc2cucmVzcG9uc2VEYXRhW2ldLmFkdmVydGlzZW1lbnRTdGF0dXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vYWREYXRlOiBtc2cuUmVzcG9uc2VEYXRhW2ldLkFkVGltZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IC8vZW5kIGRhdGFcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBodG1sID0gTXVzdGFjaGUudG9faHRtbCh0ZW1wbGF0ZSwgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoXCIjYWRQbGFjZUhvbGRlclwiKS5hcHBlbmQoaHRtbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSAvL2VuZCBmb3JcclxuICAgICAgICAgICAgICAgIH0gLy9lbmQgaWZcclxuICAgICAgICAgICAgfSAvL2VuZCBpZlxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vc2hvd0Vycm9yTWVzc2FnZShtc2cuTWVzc2FnZSArIFwiICwgXCIgKyBtc2cuRXJyb3JDb2RlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9pc1NlcnZlckNhbGxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLl9yZXF1ZXN0SW5kZXgrKztcclxuICAgICAgICB9IC8vZW5kIE9uU3VjY2Vzc0dldFRpbWVGcm9tU2VydmVyXHJcblxyXG4gICAgICAgIHByaXZhdGUgb25FcnJvckdldEl0ZW1zRnJvbVNlcnZlcihYTUxIdHRwUmVxdWVzdCwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pIHtcclxuICAgICAgICAgICAgdGhpcy5faXNTZXJ2ZXJDYWxsZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5fcmVxdWVzdEluZGV4Kys7XHJcbiAgICAgICAgICAgIC8vbm90aWZ5VXNlckFqYXhDYWxsRmluaXNoZWQoKTtcclxuICAgICAgICAgICAgLy9zaG93RXJyb3JNZXNzYWdlKHRleHRTdGF0dXMgKyBcIiAsIFwiICsgZXJyb3JUaHJvd24pO1xyXG4gICAgICAgIH0gLy9lbmQgT25FcnJvckdldFRpbWVGcm9tU2VydmVyXHJcbiAgICB9XHJcblxyXG4iLCLvu79pbXBvcnQge0NhdGVnb3J5LENhdGVnb3J5U2VsZWN0aW9ufSBmcm9tIFwiLi4vLi4vLi4vQ29tcG9uZW50cy9DYXRlZ29yeVNlbGVjdGlvblwiO1xyXG5pbXBvcnQgeyBTZXJ2ZXJDYWxsZXIgfSBmcm9tIFwiLi9TZXJ2ZXJDYWxsZXJcIjtcclxuXHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBzZXJ2ZXJDYWxsZXIgPSBuZXcgU2VydmVyQ2FsbGVyKCk7XHJcbiAgICAkKFwiI2dldEFkRnJvbVNlcnZlclwiKS5vbihcImNsaWNrXCIsZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIGxldCBjYXRlZ29yeUlkID0gbmV3IENhdGVnb3J5U2VsZWN0aW9uKFwiI2NhdGVnb3J5U2VsZWN0b3JcIixudWxsKS5HZXRTZWxlY3RlZENhdGVnb3J5SWQoKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHZhciBtaW5QcmljZT1wYXJzZUludCgkKFwiI21pblByaWNlXCIpLnZhbCgpLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICB2YXIgbWF4UHJpY2U9cGFyc2VJbnQoJChcIiNtYXhQcmljZVwiKS52YWwoKS50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgdmFyIG9yZGVyQnk9ICQoXCIjb3JkZXJCeVwiKS52YWwoKS50b1N0cmluZygpO1xyXG5cclxuICAgICAgICAgICAgc2VydmVyQ2FsbGVyLkdldEFkSXRlbXNGcm9tU2VydmVyKGNhdGVnb3J5SWQsbWluUHJpY2UsbWF4UHJpY2Usb3JkZXJCeSk7XHJcbiAgICAgICAgfSk7IC8vY2xpY2tcclxufSk7Ly9yZWFkeVxyXG5cclxuXHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgLy9zaG93IGRldGFpbCBvZiBzaW5nbGVBZEl0ZW0gd2hlbiBtb3VzZSBvdmVyXHJcbiAgICAkKGRvY3VtZW50KS5vbihcIm1vdXNlZW50ZXIgbW91c2VsZWF2ZVwiLCBcIi5ibG9ja0Rpc3BsYXlcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQodGhpcykuZmluZChcIi5tb3JlSW5mb1wiKS5mYWRlVG9nZ2xlKDI1MCk7XHJcbiAgICB9KTsvL2VuZCBvblxyXG5cclxufSk7Ly9lbmQgcmVhZHlcclxuXHJcbi8vQ2F0ZWdvcnkgU2VsZWN0aW9uXHJcbi8vVE9ETyBtb3ZlIGl0IHRvIGFwcC5qcyBmaWxlXHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuICAgIC8vQWRkIGZpcnN0IGxldmVsIGNhdGVnb3JpZXNcclxuICAgIHZhciBhbGxDYXRlZ29yaWVzU3RyaW5nID0gJChcIiNhbGxDYXRlZ29yaWVzXCIpLnZhbCgpLnRvU3RyaW5nKCk7XHJcbiAgICB2YXIgYWxsQ2F0ZWdvcmllcyA9ICQucGFyc2VKU09OKGFsbENhdGVnb3JpZXNTdHJpbmcpIGFzIENhdGVnb3J5W107XHJcbiAgICBsZXQgY2F0ZWdvcnlTZWxlY3Rpb24gPSBuZXcgQ2F0ZWdvcnlTZWxlY3Rpb24oXCJjYXRlZ29yeVNlbGVjdG9yXCIsIGFsbENhdGVnb3JpZXMpO1xyXG4gICAgY2F0ZWdvcnlTZWxlY3Rpb24uU2VsZWN0ZWRDYXRlZ29yeUNoYW5nZWQuU3Vic2NyaWJlKChzZW5kZXIsIGFyZ3MpID0+IHtcclxuICAgICAgICBhbGVydChcInNlbGVjdGVkIGNhdGVnb3J5IGNoYW5nZWQgXCIrYXJncyk7XHJcbiAgICB9KTtcclxuICAgIGNhdGVnb3J5U2VsZWN0aW9uLkNyZWF0ZUZpcnN0TGV2ZWwoKTtcclxufSk7Ly9yZWFkeVxyXG5cclxuXHJcblxyXG5cclxuXHJcbiJdfQ==
