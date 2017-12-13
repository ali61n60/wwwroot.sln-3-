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
var Index = /** @class */ (function () {
    function Index(categorySelectorParentDivId, allCategoriesId, getAdFromServerId) {
        this._serverCaller = new ServerCaller_1.ServerCaller();
        this._categorySelectorParentDivId = categorySelectorParentDivId;
        this._allCategoriesId = allCategoriesId;
        this._getAdFromServerId = getAdFromServerId;
        this.initPage();
    }
    Index.prototype.initPage = function () {
        var _this = this;
        $(document).ready(function () {
            _this.initCategorySelectionControl();
            _this.initGetAdFromServer();
            _this.initSingleAdItemStyle();
        }); //ready
    };
    Index.prototype.initCategorySelectionControl = function () {
        //Add first level categories
        var allCategoriesString = $("#" + this._allCategoriesId).val().toString();
        var allCategories = $.parseJSON(allCategoriesString);
        this._categorySelection = new CategorySelection_1.CategorySelection(this._categorySelectorParentDivId, allCategories);
        this._categorySelection.SelectedCategoryChanged.Subscribe(function (sender, args) {
            alert("selected category changed " + args);
        });
        this._categorySelection.CreateFirstLevel();
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
    };
    Index.prototype.initSingleAdItemStyle = function () {
        //show detail of singleAdItem when mouse over
        $(document).on("mouseenter mouseleave", ".blockDisplay", function (event) {
            $(event.currentTarget).find(".moreInfo").fadeToggle(250);
            //$(this).find(".moreInfo").fadeToggle(250);
        }); //end on
    };
    return Index;
}());
var categorySelectorParentDivId = "categorySelector";
var getAdFromServerId = "getAdFromServer";
var allCategoriesId = "allCategories";
var index = new Index(categorySelectorParentDivId, allCategoriesId, getAdFromServerId);
},{"../../../Components/CategorySelection":1,"./ServerCaller":4}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3d3dyb290L2pzL0NvbXBvbmVudHMvQ2F0ZWdvcnlTZWxlY3Rpb24udHMiLCJ3d3dyb290L2pzL0V2ZW50cy9FdmVudERpc3BhdGNoZXIudHMiLCJ3d3dyb290L2pzL2hvbWUvaW5kZXgvc3JjL1NlYXJjaEFkVXNlcklucHV0LnRzIiwid3d3cm9vdC9qcy9ob21lL2luZGV4L3NyYy9TZXJ2ZXJDYWxsZXIudHMiLCJ3d3dyb290L2pzL2hvbWUvaW5kZXgvc3JjL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQyw2REFBMEQ7QUFFM0Q7SUFBQTtJQUtBLENBQUM7SUFBRCxlQUFDO0FBQUQsQ0FMQSxBQUtDLElBQUE7QUFMWSw0QkFBUTtBQU1yQjtJQWdCSSwyQkFBWSxXQUFtQixFQUFFLGFBQXlCO1FBWHpDLHdCQUFtQixHQUFXLFdBQVcsQ0FBQztRQUMxQyx5QkFBb0IsR0FBVyxXQUFXLENBQUM7UUFDM0Msd0JBQW1CLEdBQVcsV0FBVyxDQUFDO1FBQzFDLG9CQUFlLEdBQVcsQ0FBQyxDQUFDO1FBTXRDLDRCQUF1QixHQUErQyxJQUFJLGlDQUFlLEVBQTZCLENBQUM7UUFHMUgsSUFBSSxDQUFDLFlBQVksR0FBRyxXQUFXLENBQUM7UUFDaEMsSUFBSSxDQUFDLGNBQWMsR0FBRyxhQUFhLENBQUM7SUFDeEMsQ0FBQztJQUw2SCxDQUFDO0lBT3hILGlEQUFxQixHQUE1QjtRQUNJLEVBQUUsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLDZCQUE2QixLQUFLLElBQUksQ0FBQyxlQUFlLENBQUM7WUFDekUsTUFBTSxDQUFDLGlCQUFpQixDQUFDLDZCQUE2QixDQUFDO1FBQzNELElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQywyQkFBMkIsS0FBSyxJQUFJLENBQUMsZUFBZSxDQUFDO1lBQzVFLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQywyQkFBMkIsQ0FB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QUcsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBRTdDLEtBQUksQ0FBQyxhQUFhLENBQUMsb0JBQW9CLENBQUMsVUFBVSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDckYsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPO0lBQ2YsQ0FBQztJQUVPLHFDQUFxQixHQUE3QjtRQUNJLDZDQUE2QztRQUM3QyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLHVCQUF1QixFQUFFLGVBQWUsRUFBRSxVQUFDLEtBQXNDO1lBQzVGLENBQUMsQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN6RCw0Q0FBNEM7UUFDaEQsQ0FBQyxDQUFDLENBQUMsQ0FBQSxRQUFRO0lBQ2YsQ0FBQztJQUNMLFlBQUM7QUFBRCxDQS9EQSxBQStEQyxJQUFBO0FBRUQsSUFBSSwyQkFBMkIsR0FBVyxrQkFBa0IsQ0FBQztBQUM3RCxJQUFJLGlCQUFpQixHQUFHLGlCQUFpQixDQUFDO0FBQzFDLElBQUksZUFBZSxHQUFHLGVBQWUsQ0FBQztBQUV0QyxJQUFJLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQywyQkFBMkIsRUFBQyxlQUFlLEVBQUUsaUJBQWlCLENBQUMsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCLvu79pbXBvcnQge0V2ZW50RGlzcGF0Y2hlcn0gZnJvbSBcIi4uL0V2ZW50cy9FdmVudERpc3BhdGNoZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDYXRlZ29yeSB7XHJcbiAgICBwdWJsaWMgY2F0ZWdvcnlJZDogbnVtYmVyO1xyXG4gICAgcHVibGljIHBhcmVudENhdGVnb3J5SWQ6IG51bWJlcjtcclxuICAgIHB1YmxpYyBjYXRlZ29yeU5hbWU6IHN0cmluZztcclxuICAgIHB1YmxpYyBlbmdsaXNoQ2F0ZWdvcnlOYW1lOiBzdHJpbmc7XHJcbn1cclxuZXhwb3J0IGNsYXNzIENhdGVnb3J5U2VsZWN0aW9uIHtcclxuICAgIC8vVE9ETyB3aGF0IGlmIGEgbGV2ZWwgaGFzIG5vIGl0ZW0gYXQgYWxsXHJcbiAgICAvL1RPRE8gd2hhdCBpZiBvbiBsZXZlbCBzZWxlY3RlZCBpZCBpcyAwXHJcbiAgICBwcml2YXRlIF9wYXJlbnREaXZJZDogc3RyaW5nOy8vZGl2IGVsZW1lbnQgdGhhdCBob2xkcyBhbGwgQ2F0ZWdvcnlTZWxlY3Rpb24gZWxlbWVudHNcclxuICAgIHByaXZhdGUgX2FsbENhdGVnb3JpZXM6IENhdGVnb3J5W107XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9maXJzdExldmVsU2VsZWN0SWQ6IHN0cmluZyA9IFwiY2F0ZWdvcnkxXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9zZWNvbmRMZXZlbFNlbGVjdElkOiBzdHJpbmcgPSBcImNhdGVnb3J5MlwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfdGhpcmRMZXZlbFNlbGVjdElkOiBzdHJpbmcgPSBcImNhdGVnb3J5M1wiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfcm9vdENhdGVnb3J5SWQ6IG51bWJlciA9IDA7XHJcbiAgICBcclxuICAgIHByaXZhdGUgc3RhdGljIF9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbE9uZTogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVHdvOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIHN0YXRpYyAgX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVGhyZWU6bnVtYmVyO1xyXG5cclxuICAgIHB1YmxpYyBTZWxlY3RlZENhdGVnb3J5Q2hhbmdlZDogRXZlbnREaXNwYXRjaGVyPENhdGVnb3J5U2VsZWN0aW9uLCBudW1iZXI+ID0gbmV3IEV2ZW50RGlzcGF0Y2hlcjxDYXRlZ29yeVNlbGVjdGlvbiwgbnVtYmVyPigpOztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwYXJlbnREaXZJZDogc3RyaW5nLCBhbGxDYXRlZ29yaWVzOiBDYXRlZ29yeVtdKSB7XHJcbiAgICAgICAgdGhpcy5fcGFyZW50RGl2SWQgPSBwYXJlbnREaXZJZDtcclxuICAgICAgICB0aGlzLl9hbGxDYXRlZ29yaWVzID0gYWxsQ2F0ZWdvcmllcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgR2V0U2VsZWN0ZWRDYXRlZ29yeUlkKCk6IG51bWJlciB7XHJcbiAgICAgICAgaWYgKENhdGVnb3J5U2VsZWN0aW9uLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFRocmVlICE9PSB0aGlzLl9yb290Q2F0ZWdvcnlJZClcclxuICAgICAgICAgICAgcmV0dXJuIENhdGVnb3J5U2VsZWN0aW9uLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFRocmVlO1xyXG4gICAgICAgIGVsc2UgaWYgKENhdGVnb3J5U2VsZWN0aW9uLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFR3byAhPT0gdGhpcy5fcm9vdENhdGVnb3J5SWQpXHJcbiAgICAgICAgICAgIHJldHVybiBDYXRlZ29yeVNlbGVjdGlvbi5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUd287XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICByZXR1cm4gQ2F0ZWdvcnlTZWxlY3Rpb24uX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsT25lOyBcclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgIH0vL0dldFNlbGVjdGVkQ2F0ZWdvcnlJZFxyXG5cclxuICAgIHB1YmxpYyBDcmVhdGVGaXJzdExldmVsKCk6IHZvaWQge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBDYXRlZ29yeVNlbGVjdGlvbi5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxPbmUgPSB0aGlzLl9yb290Q2F0ZWdvcnlJZDtcclxuICAgICAgICB0aGlzLl9hbGxDYXRlZ29yaWVzLmZvckVhY2goY2F0ZWdvcnkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoY2F0ZWdvcnkucGFyZW50Q2F0ZWdvcnlJZCA9PT0gc2VsZi5fcm9vdENhdGVnb3J5SWQpIHtcclxuICAgICAgICAgICAgICAgICQoXCIjXCIgKyBzZWxmLl9maXJzdExldmVsU2VsZWN0SWQpLmFwcGVuZCgkKFwiPG9wdGlvbj5cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBjYXRlZ29yeS5jYXRlZ29yeUlkLFxyXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IGNhdGVnb3J5LmNhdGVnb3J5TmFtZVxyXG4gICAgICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICB9Ly9pZlxyXG4gICAgICAgIH0pOy8vZm9yRWFjaFxyXG5cclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fZmlyc3RMZXZlbFNlbGVjdElkKS5jaGFuZ2UoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBsZXQgc2VsZWN0ZWRJZCA9IHBhcnNlSW50KCQodGhpcykudmFsKCkudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgIENhdGVnb3J5U2VsZWN0aW9uLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbE9uZSA9IHNlbGVjdGVkSWQ7XHJcbiAgICAgICAgICAgIHNlbGYuQ3JlYXRlU2Vjb25kTGV2ZWwoc2VsZWN0ZWRJZCk7XHJcbiAgICAgICAgICAgIHNlbGYuU2VsZWN0ZWRDYXRlZ29yeUNoYW5nZWQuZGlzcGF0Y2goc2VsZiwgc2VsZi5HZXRTZWxlY3RlZENhdGVnb3J5SWQoKSk7XHJcbiAgICAgICAgfSk7Ly9jaGFuZ2VcclxuXHJcbiAgICB9Ly9DcmVhdGVGaXJzdExldmVsXHJcblxyXG4gICAgcHJpdmF0ZSBDcmVhdGVTZWNvbmRMZXZlbChmaXJzdExldmVsQ2F0ZWdvcnlJZDogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIENhdGVnb3J5U2VsZWN0aW9uLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFR3byA9IHRoaXMuX3Jvb3RDYXRlZ29yeUlkO1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9zZWNvbmRMZXZlbFNlbGVjdElkKS5yZW1vdmUoKTtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fdGhpcmRMZXZlbFNlbGVjdElkKS5yZW1vdmUoKTtcclxuICAgICAgICBpZiAoZmlyc3RMZXZlbENhdGVnb3J5SWQgPT09IHRoaXMuX3Jvb3RDYXRlZ29yeUlkKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyICRzZWxlY3QgPSAkKGA8c2VsZWN0IGlkPVwiJHt0aGlzLl9zZWNvbmRMZXZlbFNlbGVjdElkfVwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCI+PC9zZWxlY3Q+YClcclxuICAgICAgICAgICAgLmFwcGVuZChgPG9wdGlvbiB2YWx1ZT1cIiR7dGhpcy5fcm9vdENhdGVnb3J5SWR9XCI+2KrZhdin2YUg2KLar9mH24wg2YfYpzwvb3B0aW9uPmApO1xyXG4gICAgICAgIHRoaXMuX2FsbENhdGVnb3JpZXMuZm9yRWFjaChjYXRlZ29yeSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChjYXRlZ29yeS5wYXJlbnRDYXRlZ29yeUlkID09PSBmaXJzdExldmVsQ2F0ZWdvcnlJZCkge1xyXG4gICAgICAgICAgICAgICAgJHNlbGVjdC5hcHBlbmQoJChcIjxvcHRpb24+XCIsIHtcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogY2F0ZWdvcnkuY2F0ZWdvcnlJZCxcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBjYXRlZ29yeS5jYXRlZ29yeU5hbWVcclxuICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pOy8vZm9yRWFjaFxyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9wYXJlbnREaXZJZCkuYXBwZW5kKCRzZWxlY3QpO1xyXG5cclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fc2Vjb25kTGV2ZWxTZWxlY3RJZCkuY2hhbmdlKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgbGV0IHNlbGVjdGVkSWQgPSBwYXJzZUludCgkKHRoaXMpLnZhbCgpLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICBDYXRlZ29yeVNlbGVjdGlvbi5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUd28gPSBzZWxlY3RlZElkO1xyXG4gICAgICAgICAgICBzZWxmLkNyZWF0ZVRoaXJkTGV2ZWwoc2VsZWN0ZWRJZCk7XHJcbiAgICAgICAgfSk7Ly9jaGFuZ2VcclxuICAgIH1cclxuXHJcbiAgICBDcmVhdGVUaGlyZExldmVsKHNlY29uZExldmVsQ2F0ZWdvcnlJZDogbnVtYmVyKTp2b2lkIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgQ2F0ZWdvcnlTZWxlY3Rpb24uX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVGhyZWUgPSB0aGlzLl9yb290Q2F0ZWdvcnlJZDtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fdGhpcmRMZXZlbFNlbGVjdElkKS5yZW1vdmUoKTtcclxuICAgICAgICBpZiAoc2Vjb25kTGV2ZWxDYXRlZ29yeUlkID09PSB0aGlzLl9yb290Q2F0ZWdvcnlJZCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciAkc2VsZWN0ID0gJChgPHNlbGVjdCBpZD1cIiR7dGhpcy5fdGhpcmRMZXZlbFNlbGVjdElkfVwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCI+PC9zZWxlY3Q+YClcclxuICAgICAgICAgICAgLmFwcGVuZChgPG9wdGlvbiB2YWx1ZT1cIiR7dGhpcy5fcm9vdENhdGVnb3J5SWR9XCI+2KrZhdin2YUg2KLar9mH24wg2YfYpzwvb3B0aW9uPmApO1xyXG4gICAgICAgIHRoaXMuX2FsbENhdGVnb3JpZXMuZm9yRWFjaChjYXRlZ29yeSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChjYXRlZ29yeS5wYXJlbnRDYXRlZ29yeUlkID09PSBzZWNvbmRMZXZlbENhdGVnb3J5SWQpIHtcclxuICAgICAgICAgICAgICAgICRzZWxlY3QuYXBwZW5kKCQoXCI8b3B0aW9uPlwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGNhdGVnb3J5LmNhdGVnb3J5SWQsXHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogY2F0ZWdvcnkuY2F0ZWdvcnlOYW1lXHJcbiAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTsvL2ZvckVhY2hcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fcGFyZW50RGl2SWQpLmFwcGVuZCgkc2VsZWN0KTtcclxuXHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX3RoaXJkTGV2ZWxTZWxlY3RJZCkuY2hhbmdlKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgbGV0IHNlbGVjdGVkSWQgPSBwYXJzZUludCgkKHRoaXMpLnZhbCgpLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICBDYXRlZ29yeVNlbGVjdGlvbi5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUaHJlZSA9IHNlbGVjdGVkSWQ7XHJcbiAgICAgICAgfSk7Ly9jaGFuZ2VcclxuICAgIH1cclxufVxyXG5cclxuIiwi77u/aW1wb3J0IHtJRXZlbnR9ICBmcm9tIFwiLi9JRXZlbnRcIjtcclxuXHJcblxyXG4vKiBUaGUgZGlzcGF0Y2hlciBoYW5kbGVzIHRoZSBzdG9yYWdlIG9mIHN1YnNjaXB0aW9ucyBhbmQgZmFjaWxpdGF0ZXNcclxuICBzdWJzY3JpcHRpb24sIHVuc3Vic2NyaXB0aW9uIGFuZCBkaXNwYXRjaGluZyBvZiB0aGUgZXZlbnQgKi9cclxuZXhwb3J0ICBjbGFzcyBFdmVudERpc3BhdGNoZXI8VFNlbmRlciwgVEFyZ3M+IGltcGxlbWVudHMgSUV2ZW50PFRTZW5kZXIsIFRBcmdzPiB7XHJcblxyXG4gICAgcHJpdmF0ZSBfc3Vic2NyaXB0aW9uczogQXJyYXk8KHNlbmRlcjogVFNlbmRlciwgYXJnczogVEFyZ3MpID0+IHZvaWQ+ID0gbmV3IEFycmF5PChzZW5kZXI6IFRTZW5kZXIsIGFyZ3M6IFRBcmdzKSA9PiB2b2lkPigpO1xyXG5cclxuICAgIFN1YnNjcmliZShmbjogKHNlbmRlcjogVFNlbmRlciwgYXJnczogVEFyZ3MpID0+IHZvaWQpOiB2b2lkIHtcclxuICAgICAgICBpZiAoZm4pIHtcclxuICAgICAgICAgICAgdGhpcy5fc3Vic2NyaXB0aW9ucy5wdXNoKGZuKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgVW5zdWJzY3JpYmUoZm46IChzZW5kZXI6IFRTZW5kZXIsIGFyZ3M6IFRBcmdzKSA9PiB2b2lkKTogdm9pZCB7XHJcbiAgICAgICAgbGV0IGkgPSB0aGlzLl9zdWJzY3JpcHRpb25zLmluZGV4T2YoZm4pO1xyXG4gICAgICAgIGlmIChpID4gLTEpIHtcclxuICAgICAgICAgICAgdGhpcy5fc3Vic2NyaXB0aW9ucy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGRpc3BhdGNoKHNlbmRlcjogVFNlbmRlciwgYXJnczogVEFyZ3MpOiB2b2lkIHtcclxuICAgICAgICBmb3IgKGxldCBoYW5kbGVyIG9mIHRoaXMuX3N1YnNjcmlwdGlvbnMpIHtcclxuICAgICAgICAgICAgaGFuZGxlcihzZW5kZXIsIGFyZ3MpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIu+7v2V4cG9ydCBjbGFzcyBTZWFyY2hBZFVzZXJJbnB1dCB7XHJcbiAgICBwdWJsaWMgU3RhcnRJbmRleDogbnVtYmVyO1xyXG4gICAgcHVibGljIENvdW50OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgQ2F0ZWdvcnlJZDogbnVtYmVyO1xyXG4gICAgcHVibGljIE1pbmltdW1QcmljZTogbnVtYmVyO1xyXG4gICAgcHVibGljIE1heGltdW1QcmljZTogbnVtYmVyO1xyXG4gICAgcHVibGljIE9yZGVyQnk6IHN0cmluZztcclxuICAgIHB1YmxpYyBSZXF1ZXN0SW5kZXg6IG51bWJlcjtcclxufVxyXG5cclxuIiwi77u/aW1wb3J0IHtTZWFyY2hBZFVzZXJJbnB1dH0gZnJvbSBcIi4vU2VhcmNoQWRVc2VySW5wdXRcIjtcclxuZXhwb3J0IGNsYXNzIFNlcnZlckNhbGxlciB7XHJcbiAgICAgICAgcHJpdmF0ZSBfaW5pdGlhbFN0YXJ0OiBudW1iZXIgPSAxO1xyXG4gICAgICAgIHByaXZhdGUgX3N0YXJ0OiBudW1iZXIgPSAxO1xyXG4gICAgICAgIHByaXZhdGUgX2NvdW50OiBudW1iZXIgPSA1O1xyXG4gICAgICAgIHByaXZhdGUgX3JlcXVlc3RJbmRleDogbnVtYmVyID0gMDtcclxuICAgICAgICBwcml2YXRlIF9wcmV2aW91c1JlcXVlc3RJbmRleDogbnVtYmVyID0gLTE7XHJcbiAgICAgICAgcHJpdmF0ZSBfaXNTZXJ2ZXJDYWxsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICBwcml2YXRlIF9udW1iZXJPZlN0YXJ0U2VydmVyQ2FsbE5vdGlmaWNhdGlvbjogbnVtYmVyID0gMDtcclxuXHJcbiAgICAgICAgcHVibGljIEdldEFkSXRlbXNGcm9tU2VydmVyKGNhdGVnb3J5SWQ6IG51bWJlcixcclxuICAgICAgICAgICAgbWluUHJpY2U6IG51bWJlcixcclxuICAgICAgICAgICAgbWF4UHJpY2U6IG51bWJlcixcclxuICAgICAgICAgICAgb3JkZXJCeTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGxldCB1c2VySW5wdXQgPSBuZXcgU2VhcmNoQWRVc2VySW5wdXQoKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2lzU2VydmVyQ2FsbGVkICYmICh0aGlzLl9wcmV2aW91c1JlcXVlc3RJbmRleCA9PT0gdGhpcy5fcmVxdWVzdEluZGV4KVxyXG4gICAgICAgICAgICApIHsgLy9hIGNhbGwgaXMgc2VudCBidXQgbm8gYW5zd2VyIHlldFxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9IC8vaWZcclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9wcmV2aW91c1JlcXVlc3RJbmRleCA9IHRoaXMuX3JlcXVlc3RJbmRleDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2lzU2VydmVyQ2FsbGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfSAvL2Vsc2VcclxuXHJcbiAgICAgICAgICAgIHVzZXJJbnB1dC5TdGFydEluZGV4ID0gdGhpcy5fc3RhcnQ7XHJcbiAgICAgICAgICAgIHVzZXJJbnB1dC5Db3VudCA9IHRoaXMuX2NvdW50O1xyXG4gICAgICAgICAgICAvL1RPRE8gcGFzcyB0aGUgb2JqZWN0IHRvIHRoZSBjYXRlZ29yeSBzZWxlY3RvciBlbGVtZW50IGFuZCBsZXQgaXQgZmlsbCB0aGUgY2F0ZWdvcnlJZFxyXG4gICAgICAgICAgICAvL09SIGNhbGwgYSBtZXRob2Qgb24gY2F0ZWdvcnkgc2VsZWN0b3IgZWxlbWVudCB0byBnZXQgY2F0ZWdvcnlJZFxyXG4gICAgICAgICAgICB1c2VySW5wdXQuQ2F0ZWdvcnlJZCA9IGNhdGVnb3J5SWQ7IC8vMTAwIGZvciBjYXJzXHJcbiAgICAgICAgICAgIHVzZXJJbnB1dC5NaW5pbXVtUHJpY2UgPSBtaW5QcmljZTtcclxuICAgICAgICAgICAgdXNlcklucHV0Lk1heGltdW1QcmljZSA9IG1heFByaWNlO1xyXG4gICAgICAgICAgICB1c2VySW5wdXQuT3JkZXJCeSA9IG9yZGVyQnk7XHJcbiAgICAgICAgICAgIHVzZXJJbnB1dC5SZXF1ZXN0SW5kZXggPSB0aGlzLl9yZXF1ZXN0SW5kZXg7XHJcblxyXG4gICAgICAgICAgICAvL25vdGlmeVVzZXJBamF4Q2FsbFN0YXJ0ZWQoKTtcclxuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJQT1NUXCIsIC8vR0VUIG9yIFBPU1Qgb3IgUFVUIG9yIERFTEVURSB2ZXJiXHJcbiAgICAgICAgICAgICAgICB1cmw6IFwiYXBpL0FkQXBpL0dldEFkdmVydGlzZW1lbnRDb21tb25cIixcclxuICAgICAgICAgICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KHVzZXJJbnB1dCksIC8vRGF0YSBzZW50IHRvIHNlcnZlclxyXG4gICAgICAgICAgICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJywgLy8gY29udGVudCB0eXBlIHNlbnQgdG8gc2VydmVyXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihhcmcpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLm9uU3VjY2Vzc0dldEl0ZW1zRnJvbVNlcnZlcihhcmcpXHJcbiAgICAgICAgICAgICAgICB9LCAvL09uIFN1Y2Nlc3NmdWxsIHNlcnZpY2UgY2FsbFxyXG4gICAgICAgICAgICAgICAgZXJyb3I6IHNlbGYub25FcnJvckdldEl0ZW1zRnJvbVNlcnZlciAvLyBXaGVuIFNlcnZpY2UgY2FsbCBmYWlsc1xyXG4gICAgICAgICAgICAgICAgLy8gV2hlbiBTZXJ2aWNlIGNhbGwgZmFpbHNcclxuICAgICAgICAgICAgfSk7IC8vLmFqYXhcclxuICAgICAgICB9IC8vR2V0QWRJdGVtc0Zyb21TZXJ2ZXJcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBvblN1Y2Nlc3NHZXRJdGVtc0Zyb21TZXJ2ZXIobXNnKSB7XHJcbiAgICAgICAgICAgIC8vbm90aWZ5VXNlckFqYXhDYWxsRmluaXNoZWQoKTtcclxuICAgICAgICAgICAgaWYgKG1zZy5zdWNjZXNzID09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChtc2cuY3VzdG9tRGljdGlvbmFyeVtcIlJlcXVlc3RJbmRleFwiXSA9PSB0aGlzLl9yZXF1ZXN0SW5kZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdGFydCArPSBwYXJzZUludChtc2cuY3VzdG9tRGljdGlvbmFyeVtcIm51bWJlck9mSXRlbXNcIl0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0ZW1wbGF0ZSA9ICQoJyNzaW5nbGVBZEl0ZW0nKS5odG1sKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtc2cucmVzcG9uc2VEYXRhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhZEltYWdlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1zZy5yZXNwb25zZURhdGFbaV0uYWR2ZXJ0aXNlbWVudEltYWdlc1swXSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZEltYWdlID0gXCJkYXRhOmltYWdlL2pwZztiYXNlNjQsXCIgKyBtc2cucmVzcG9uc2VEYXRhW2ldLmFkdmVydGlzZW1lbnRJbWFnZXNbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gLy9lbmQgaWZcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFkdmVydGlzZW1lbnRJZDogbXNnLnJlc3BvbnNlRGF0YVtpXS5hZHZlcnRpc2VtZW50SWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBZHZlcnRpc2VtZW50Q2F0ZWdvcnlJZDogbXNnLnJlc3BvbnNlRGF0YVtpXS5hZHZlcnRpc2VtZW50Q2F0ZWdvcnlJZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFkdmVydGlzZW1lbnRDYXRlZ29yeTogbXNnLnJlc3BvbnNlRGF0YVtpXS5hZHZlcnRpc2VtZW50Q2F0ZWdvcnksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZEltYWdlOiBhZEltYWdlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRQcmljZTogbXNnLnJlc3BvbnNlRGF0YVtpXS5hZHZlcnRpc2VtZW50UHJpY2UucHJpY2UsIC8vdG9kbyBjaGVjayB0aGUgcHJpY2UgdHlwZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQWR2ZXJ0aXNlbWVudFRpdGxlOiBtc2cucmVzcG9uc2VEYXRhW2ldLmFkdmVydGlzZW1lbnRUaXRsZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFkdmVydGlzZW1lbnRTdGF0dXM6IG1zZy5yZXNwb25zZURhdGFbaV0uYWR2ZXJ0aXNlbWVudFN0YXR1c1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9hZERhdGU6IG1zZy5SZXNwb25zZURhdGFbaV0uQWRUaW1lXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gLy9lbmQgZGF0YVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGh0bWwgPSBNdXN0YWNoZS50b19odG1sKHRlbXBsYXRlLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJChcIiNhZFBsYWNlSG9sZGVyXCIpLmFwcGVuZChodG1sKTtcclxuICAgICAgICAgICAgICAgICAgICB9IC8vZW5kIGZvclxyXG4gICAgICAgICAgICAgICAgfSAvL2VuZCBpZlxyXG4gICAgICAgICAgICB9IC8vZW5kIGlmXHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy9zaG93RXJyb3JNZXNzYWdlKG1zZy5NZXNzYWdlICsgXCIgLCBcIiArIG1zZy5FcnJvckNvZGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX2lzU2VydmVyQ2FsbGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlcXVlc3RJbmRleCsrO1xyXG4gICAgICAgIH0gLy9lbmQgT25TdWNjZXNzR2V0VGltZUZyb21TZXJ2ZXJcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBvbkVycm9yR2V0SXRlbXNGcm9tU2VydmVyKFhNTEh0dHBSZXF1ZXN0LCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikge1xyXG4gICAgICAgICAgICB0aGlzLl9pc1NlcnZlckNhbGxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLl9yZXF1ZXN0SW5kZXgrKztcclxuICAgICAgICAgICAgLy9ub3RpZnlVc2VyQWpheENhbGxGaW5pc2hlZCgpO1xyXG4gICAgICAgICAgICAvL3Nob3dFcnJvck1lc3NhZ2UodGV4dFN0YXR1cyArIFwiICwgXCIgKyBlcnJvclRocm93bik7XHJcbiAgICAgICAgfSAvL2VuZCBPbkVycm9yR2V0VGltZUZyb21TZXJ2ZXJcclxuICAgIH1cclxuXHJcbiIsIu+7v2ltcG9ydCB7Q2F0ZWdvcnksQ2F0ZWdvcnlTZWxlY3Rpb259IGZyb20gXCIuLi8uLi8uLi9Db21wb25lbnRzL0NhdGVnb3J5U2VsZWN0aW9uXCI7XHJcbmltcG9ydCB7IFNlcnZlckNhbGxlciB9IGZyb20gXCIuL1NlcnZlckNhbGxlclwiO1xyXG5cclxuY2xhc3MgSW5kZXgge1xyXG4gICAgXHJcblxyXG4gICAgcHJpdmF0ZSAgX3NlcnZlckNhbGxlciA9IG5ldyBTZXJ2ZXJDYWxsZXIoKTtcclxuICAgIHByaXZhdGUgIF9jYXRlZ29yeVNlbGVjdGlvbjogQ2F0ZWdvcnlTZWxlY3Rpb247XHJcblxyXG4gICAgcHJpdmF0ZSBfY2F0ZWdvcnlTZWxlY3RvclBhcmVudERpdklkOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIF9nZXRBZEZyb21TZXJ2ZXJJZDogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBfYWxsQ2F0ZWdvcmllc0lkOiBzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IoY2F0ZWdvcnlTZWxlY3RvclBhcmVudERpdklkOiBzdHJpbmcsXHJcbiAgICAgICAgICAgICAgICBhbGxDYXRlZ29yaWVzSWQ6c3RyaW5nLFxyXG4gICAgICAgICAgICAgICAgZ2V0QWRGcm9tU2VydmVySWQ6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuX2NhdGVnb3J5U2VsZWN0b3JQYXJlbnREaXZJZCA9IGNhdGVnb3J5U2VsZWN0b3JQYXJlbnREaXZJZDtcclxuICAgICAgICB0aGlzLl9hbGxDYXRlZ29yaWVzSWQgPSBhbGxDYXRlZ29yaWVzSWQ7XHJcbiAgICAgICAgdGhpcy5fZ2V0QWRGcm9tU2VydmVySWQgPSBnZXRBZEZyb21TZXJ2ZXJJZDtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmluaXRQYWdlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbml0UGFnZSgpOiB2b2lkIHtcclxuICAgICAgICAkKGRvY3VtZW50KS5yZWFkeSgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5pdENhdGVnb3J5U2VsZWN0aW9uQ29udHJvbCgpO1xyXG4gICAgICAgICAgICB0aGlzLmluaXRHZXRBZEZyb21TZXJ2ZXIoKTtcclxuICAgICAgICAgICAgdGhpcy5pbml0U2luZ2xlQWRJdGVtU3R5bGUoKTtcclxuICAgICAgICAgICBcclxuXHJcbiAgICAgICAgfSk7Ly9yZWFkeVxyXG5cclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlICBpbml0Q2F0ZWdvcnlTZWxlY3Rpb25Db250cm9sKCk6IHZvaWQge1xyXG4gICAgICAgIC8vQWRkIGZpcnN0IGxldmVsIGNhdGVnb3JpZXNcclxuICAgICAgICBsZXQgYWxsQ2F0ZWdvcmllc1N0cmluZyA9ICQoXCIjXCIrdGhpcy5fYWxsQ2F0ZWdvcmllc0lkKS52YWwoKS50b1N0cmluZygpO1xyXG4gICAgICAgIGxldCBhbGxDYXRlZ29yaWVzID0gJC5wYXJzZUpTT04oYWxsQ2F0ZWdvcmllc1N0cmluZykgYXMgQ2F0ZWdvcnlbXTtcclxuICAgICAgICB0aGlzLl9jYXRlZ29yeVNlbGVjdGlvbiA9IG5ldyBDYXRlZ29yeVNlbGVjdGlvbih0aGlzLl9jYXRlZ29yeVNlbGVjdG9yUGFyZW50RGl2SWQsIGFsbENhdGVnb3JpZXMpO1xyXG4gICAgICAgIHRoaXMuX2NhdGVnb3J5U2VsZWN0aW9uLlNlbGVjdGVkQ2F0ZWdvcnlDaGFuZ2VkLlN1YnNjcmliZSgoc2VuZGVyLCBhcmdzKSA9PiB7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwic2VsZWN0ZWQgY2F0ZWdvcnkgY2hhbmdlZCBcIiArIGFyZ3MpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuX2NhdGVnb3J5U2VsZWN0aW9uLkNyZWF0ZUZpcnN0TGV2ZWwoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXRHZXRBZEZyb21TZXJ2ZXIoKTp2b2lkIHtcclxuICAgICAgICAkKFwiI1wiK3RoaXMuX2dldEFkRnJvbVNlcnZlcklkKS5vbihcImNsaWNrXCIsIChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGNhdGVnb3J5SWQgPSB0aGlzLl9jYXRlZ29yeVNlbGVjdGlvbi5HZXRTZWxlY3RlZENhdGVnb3J5SWQoKTtcclxuICAgICAgICAgICAgbGV0IG1pblByaWNlID0gcGFyc2VJbnQoJChcIiNtaW5QcmljZVwiKS52YWwoKS50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgbGV0IG1heFByaWNlID0gcGFyc2VJbnQoJChcIiNtYXhQcmljZVwiKS52YWwoKS50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgbGV0IG9yZGVyQnkgPSAkKFwiI29yZGVyQnlcIikudmFsKCkudG9TdHJpbmcoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX3NlcnZlckNhbGxlci5HZXRBZEl0ZW1zRnJvbVNlcnZlcihjYXRlZ29yeUlkLCBtaW5QcmljZSwgbWF4UHJpY2UsIG9yZGVyQnkpO1xyXG4gICAgICAgIH0pOyAvL2NsaWNrXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbml0U2luZ2xlQWRJdGVtU3R5bGUoKTogdm9pZCB7XHJcbiAgICAgICAgLy9zaG93IGRldGFpbCBvZiBzaW5nbGVBZEl0ZW0gd2hlbiBtb3VzZSBvdmVyXHJcbiAgICAgICAgJChkb2N1bWVudCkub24oXCJtb3VzZWVudGVyIG1vdXNlbGVhdmVcIiwgXCIuYmxvY2tEaXNwbGF5XCIsIChldmVudDogSlF1ZXJ5LkV2ZW50PEhUTUxFbGVtZW50LCBudWxsPikgPT4ge1xyXG4gICAgICAgICAgICAkKGV2ZW50LmN1cnJlbnRUYXJnZXQpLmZpbmQoXCIubW9yZUluZm9cIikuZmFkZVRvZ2dsZSgyNTApO1xyXG4gICAgICAgICAgICAvLyQodGhpcykuZmluZChcIi5tb3JlSW5mb1wiKS5mYWRlVG9nZ2xlKDI1MCk7XHJcbiAgICAgICAgfSk7Ly9lbmQgb25cclxuICAgIH1cclxufVxyXG5cclxubGV0IGNhdGVnb3J5U2VsZWN0b3JQYXJlbnREaXZJZDogc3RyaW5nID0gXCJjYXRlZ29yeVNlbGVjdG9yXCI7XHJcbmxldCBnZXRBZEZyb21TZXJ2ZXJJZCA9IFwiZ2V0QWRGcm9tU2VydmVyXCI7XHJcbmxldCBhbGxDYXRlZ29yaWVzSWQgPSBcImFsbENhdGVnb3JpZXNcIjtcclxuXHJcbmxldCBpbmRleCA9IG5ldyBJbmRleChjYXRlZ29yeVNlbGVjdG9yUGFyZW50RGl2SWQsYWxsQ2F0ZWdvcmllc0lkLCBnZXRBZEZyb21TZXJ2ZXJJZCk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuIl19
