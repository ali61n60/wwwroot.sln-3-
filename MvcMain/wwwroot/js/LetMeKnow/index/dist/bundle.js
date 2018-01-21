(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventDispatcher_1 = require("../../Events/EventDispatcher");
var CategorySelection = /** @class */ (function () {
    function CategorySelection(parentDivId, allCategories) {
        this.SelectedCategoryChangedEvent = new EventDispatcher_1.EventDispatcher();
        this.CategoryIdKey = "CategoryId";
        this._firstLevelTemplate = "category1Template";
        this._firstLevelDiv = "category1";
        this._firstLevelSelect = "select1";
        this._secondLevelTemplate = "category2Template";
        this._secondLevelDiv = "category2";
        this._secondLevelSelect = "select2";
        this._thirdLevelTemplate = "category3Template";
        this._thirdLevelDiv = "category3";
        this._thirdLevelSelect = "select3";
        this._rootCategoryId = 0;
        this._parentDivId = parentDivId;
        this._allCategories = allCategories;
    }
    CategorySelection.prototype.SetCategoryId = function (selectedCategoryId) {
        var firstLevelId;
        var secondLevelId;
        var categoryLevel = this.getCategoryLevel(selectedCategoryId);
        switch (categoryLevel) {
            case CategoryLevel.Unkown:
                this.CreateFirstLevel();
                break;
            case CategoryLevel.Level1:
                this.CreateFirstLevel();
                this.setFirstLevelToSpecificId(selectedCategoryId);
                this.createSecondLevel(selectedCategoryId);
                $("#" + this._firstLevelSelect).trigger("change");
                break;
            case CategoryLevel.Level2:
                this.CreateFirstLevel();
                firstLevelId = this._allCategories.filter(function (category) { return category.CategoryId === selectedCategoryId; })[0]
                    .ParentCategoryId;
                this.setFirstLevelToSpecificId(firstLevelId);
                this.createSecondLevel(firstLevelId);
                this.setSecondLevelToSpecificId(selectedCategoryId);
                this.createThirdLevel(selectedCategoryId);
                $("#" + this._secondLevelSelect).trigger("change");
                break;
            case CategoryLevel.Level3:
                this.CreateFirstLevel();
                secondLevelId = this._allCategories.filter(function (category) { return category.CategoryId === selectedCategoryId; })[0]
                    .ParentCategoryId;
                firstLevelId = this._allCategories.filter(function (category) { return category.CategoryId === secondLevelId; })[0]
                    .ParentCategoryId;
                this.setFirstLevelToSpecificId(firstLevelId);
                this.createSecondLevel(firstLevelId);
                this.setSecondLevelToSpecificId(secondLevelId);
                this.createThirdLevel(secondLevelId);
                this.setThirdLevelToSpecificId(selectedCategoryId);
                $("#" + this._thirdLevelSelect).trigger("change");
                break;
        }
    };
    CategorySelection.prototype.setFirstLevelToSpecificId = function (categoryId) {
        $("#" + this._firstLevelSelect).val(categoryId);
    };
    CategorySelection.prototype.setSecondLevelToSpecificId = function (categoryId) {
        $("#" + this._secondLevelSelect).val(categoryId);
    };
    CategorySelection.prototype.setThirdLevelToSpecificId = function (categoryId) {
        $("#" + this._thirdLevelSelect).val(categoryId);
    };
    CategorySelection.prototype.getCategoryLevel = function (categoryId) {
        var tempCategoryArray = this._allCategories.filter(function (category) { return category.CategoryId === categoryId; });
        var tempCategory;
        if (tempCategoryArray.length === 0) {
            return CategoryLevel.Unkown;
        }
        tempCategory = tempCategoryArray[0];
        if (tempCategory.ParentCategoryId === this._rootCategoryId) {
            return CategoryLevel.Level1;
        }
        tempCategory = this._allCategories.filter(function (category) { return category.CategoryId === tempCategory.ParentCategoryId; })[0];
        if (tempCategory.ParentCategoryId === this._rootCategoryId) {
            return CategoryLevel.Level2;
        }
        return CategoryLevel.Level3;
    };
    CategorySelection.prototype.InsertCategoryIdInUserInputDictionary = function (userInput) {
        var categoryId = this.GetSelectedCategoryId();
        userInput.ParametersDictionary[this.CategoryIdKey] = categoryId; //100 for cars
    };
    CategorySelection.prototype.GetSelectedCategoryId = function () {
        if (this._selectedCategoryIdLevelThree !== undefined &&
            this._selectedCategoryIdLevelThree !== this._rootCategoryId)
            return this._selectedCategoryIdLevelThree;
        else if (this._selectedCategoryIdLevelTwo !== undefined &&
            this._selectedCategoryIdLevelTwo !== this._rootCategoryId)
            return this._selectedCategoryIdLevelTwo;
        else
            return this._selectedCategoryIdLevelOne;
    };
    CategorySelection.prototype.CreateFirstLevel = function () {
        var _this = this;
        this.removeElement(this._firstLevelDiv);
        this._selectedCategoryIdLevelOne = this._rootCategoryId;
        this.removeElement(this._secondLevelDiv);
        this._selectedCategoryIdLevelTwo = this._rootCategoryId;
        this.removeElement(this._thirdLevelDiv);
        this._selectedCategoryIdLevelThree = this._rootCategoryId;
        var template = $("#" + this._firstLevelTemplate).html();
        var categories = new Array();
        var data = { categories: categories };
        this._selectedCategoryIdLevelOne = this._rootCategoryId; //
        this._allCategories.forEach(function (category) {
            if (category.ParentCategoryId === _this._rootCategoryId) {
                categories.push(category);
            } //if
        }); //forEach
        var html = Mustache.to_html(template, data);
        $("#" + this._parentDivId).append(html);
        $("#" + this._firstLevelSelect).change(function (event) {
            var selectedId = parseInt($(event.currentTarget).val().toString());
            _this._selectedCategoryIdLevelOne = selectedId;
            _this.createSecondLevel(selectedId);
            var eventArg = new CategoryCahngedEventArg();
            eventArg.SelectedCategoryId = _this.GetSelectedCategoryId();
            eventArg.SelectedCategoryHasChild = _this.selectedCategoryHasChildren();
            _this.SelectedCategoryChangedEvent.Dispatch(_this, eventArg);
        }); //change
    }; //CreateFirstLevel
    CategorySelection.prototype.createSecondLevel = function (firstLevelCategoryId) {
        var _this = this;
        this.removeElement(this._secondLevelDiv);
        this._selectedCategoryIdLevelTwo = this._rootCategoryId;
        this.removeElement(this._thirdLevelDiv);
        this._selectedCategoryIdLevelThree = this._rootCategoryId;
        if (firstLevelCategoryId === this._rootCategoryId) {
            return;
        }
        var template = $("#" + this._secondLevelTemplate).html();
        var categories = new Array();
        var data = { categories: categories };
        this._allCategories.forEach(function (category) {
            if (category.ParentCategoryId === firstLevelCategoryId) {
                categories.push(category);
            } //if
        }); //forEach
        var html = Mustache.to_html(template, data);
        $("#" + this._parentDivId).append(html);
        $("#" + this._secondLevelSelect).change(function (event) {
            var selectedId = parseInt($(event.currentTarget).val().toString());
            _this._selectedCategoryIdLevelTwo = selectedId;
            _this.createThirdLevel(selectedId);
            var eventArg = new CategoryCahngedEventArg();
            eventArg.SelectedCategoryId = _this.GetSelectedCategoryId();
            eventArg.SelectedCategoryHasChild = _this.selectedCategoryHasChildren();
            _this.SelectedCategoryChangedEvent.Dispatch(_this, eventArg);
        }); //change
    };
    CategorySelection.prototype.createThirdLevel = function (secondLevelCategoryId) {
        var _this = this;
        this.removeElement(this._thirdLevelDiv);
        this._selectedCategoryIdLevelThree = this._rootCategoryId;
        if (secondLevelCategoryId === this._rootCategoryId) {
            return;
        }
        var template = $("#" + this._thirdLevelTemplate).html();
        var categories = new Array();
        var data = { categories: categories };
        this._allCategories.forEach(function (category) {
            if (category.ParentCategoryId === secondLevelCategoryId) {
                categories.push(category);
            } //if
        }); //forEach
        if (categories.length === 0) {
            return;
        }
        var html = Mustache.to_html(template, data);
        $("#" + this._parentDivId).append(html);
        $("#" + this._thirdLevelSelect).change(function (event) {
            _this._selectedCategoryIdLevelThree = parseInt($(event.currentTarget).val().toString());
            var eventArg = new CategoryCahngedEventArg();
            eventArg.SelectedCategoryId = _this.GetSelectedCategoryId();
            eventArg.SelectedCategoryHasChild = _this.selectedCategoryHasChildren();
            _this.SelectedCategoryChangedEvent.Dispatch(_this, eventArg);
        }); //change
    };
    CategorySelection.prototype.selectedCategoryHasChildren = function () {
        var selectedCategoryId = this.GetSelectedCategoryId();
        return this._allCategories.filter(function (category) { return category.ParentCategoryId === selectedCategoryId; }).length > 0;
    };
    CategorySelection.prototype.removeElement = function (id) {
        $("#" + id).remove();
    };
    return CategorySelection;
}());
exports.CategorySelection = CategorySelection;
var CategoryCahngedEventArg = /** @class */ (function () {
    function CategoryCahngedEventArg() {
    }
    return CategoryCahngedEventArg;
}());
exports.CategoryCahngedEventArg = CategoryCahngedEventArg;
var CategoryLevel;
(function (CategoryLevel) {
    CategoryLevel[CategoryLevel["Level1"] = 1] = "Level1";
    CategoryLevel[CategoryLevel["Level2"] = 2] = "Level2";
    CategoryLevel[CategoryLevel["Level3"] = 3] = "Level3";
    CategoryLevel[CategoryLevel["Unkown"] = 4] = "Unkown";
})(CategoryLevel || (CategoryLevel = {}));
},{"../../Events/EventDispatcher":2}],2:[function(require,module,exports){
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
    EventDispatcher.prototype.Dispatch = function (sender, args) {
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
var UserInput = /** @class */ (function () {
    function UserInput() {
        this.ParametersDictionary = {};
    }
    return UserInput;
}());
exports.UserInput = UserInput;
},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LetMeKnowServerCaller = /** @class */ (function () {
    function LetMeKnowServerCaller() {
        //TODO call server and send userinput fro new ad
        //get result and show to user
        this._url = "/api/LetMeKnowApi/AddNewLetMeKnowRecord";
    }
    LetMeKnowServerCaller.prototype.SaveAd = function (userInput) {
        var _this = this;
        $.ajax({
            type: "POST",
            url: this._url,
            data: JSON.stringify(userInput.ParametersDictionary),
            contentType: 'application/json',
            success: function (msg, textStatus, jqXHR) { return _this.onSuccessGetItemsFromServer(msg, textStatus, jqXHR); },
            error: function (jqXHR, textStatus, errorThrown) { return _this.onErrorGetItemsFromServer(jqXHR, textStatus, errorThrown); } // When Service call fails
        }); //.ajax
    };
    LetMeKnowServerCaller.prototype.onSuccessGetItemsFromServer = function (msg, textStatus, jqXHR) {
        //TODO redirect user to a new page
        if (msg.Success == true) {
            document.location.replace("/LetMeKnow/Confirm");
        }
    };
    LetMeKnowServerCaller.prototype.onErrorGetItemsFromServer = function (jqXHR, textStatus, errorThrown) {
        //TODO inform error to user
    };
    return LetMeKnowServerCaller;
}());
exports.LetMeKnowServerCaller = LetMeKnowServerCaller;
},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CategorySelection_1 = require("../../../Components/Category/CategorySelection");
var UserInput_1 = require("../../../Helper/UserInput");
var LetMeKnowServerCaller_1 = require("./LetMeKnowServerCaller");
var LetMeKnow = /** @class */ (function () {
    function LetMeKnow(categorySelectorParentDivId, allCategoriesId) {
        this._registerLetMeKnowInputId = "registerLetMeKnow";
        this.initCategorySelect(categorySelectorParentDivId, allCategoriesId);
        this._letMeKnowServerCaller = new LetMeKnowServerCaller_1.LetMeKnowServerCaller();
        this.initEventHandlers();
    }
    LetMeKnow.prototype.initCategorySelect = function (categorySelectorParentDivId, allCategoriesId) {
        var allCategoriesString = $("#" + allCategoriesId).val().toString();
        var allCategories = $.parseJSON(allCategoriesString);
        this._categorySelection = new CategorySelection_1.CategorySelection(categorySelectorParentDivId, allCategories);
        this._categorySelection.CreateFirstLevel();
    };
    LetMeKnow.prototype.initEventHandlers = function () {
        var _this = this;
        this._categorySelection.SelectedCategoryChangedEvent.Subscribe(function (sender, args) {
            //TODO load specific LetMeKnow View based on category id
        });
        $("#" + this._registerLetMeKnowInputId).on("click", function (event) {
            event.preventDefault();
            _this.registerLetMeKnow();
        });
    };
    LetMeKnow.prototype.registerLetMeKnow = function () {
        //TODO disable submitAd Button until current submission is ok or errornous 
        var userInput = new UserInput_1.UserInput();
        this._categorySelection.InsertCategoryIdInUserInputDictionary(userInput);
        this._letMeKnowServerCaller.SaveAd(userInput);
    };
    return LetMeKnow;
}());
exports.LetMeKnow = LetMeKnow;
var categorySelectorParentDivId = "categorySelector";
var allCategoriesId = "allCategories";
$(document).ready(function () {
    var letMeKnow = new LetMeKnow(categorySelectorParentDivId, allCategoriesId);
});
},{"../../../Components/Category/CategorySelection":1,"../../../Helper/UserInput":3,"./LetMeKnowServerCaller":4}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3d3dyb290L2pzL0NvbXBvbmVudHMvQ2F0ZWdvcnkvQ2F0ZWdvcnlTZWxlY3Rpb24udHMiLCJ3d3dyb290L2pzL0V2ZW50cy9FdmVudERpc3BhdGNoZXIudHMiLCJ3d3dyb290L2pzL0hlbHBlci9Vc2VySW5wdXQudHMiLCJ3d3dyb290L2pzL0xldE1lS25vdy9pbmRleC9zcmMvTGV0TWVLbm93U2VydmVyQ2FsbGVyLnRzIiwid3d3cm9vdC9qcy9MZXRNZUtub3cvaW5kZXgvc3JjL2xldE1lS25vdy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUMsZ0VBQStEO0FBSWhFO0lBMkJJLDJCQUFZLFdBQW1CLEVBQUUsYUFBeUI7UUF6Qm5ELGlDQUE0QixHQUFnRSxJQUFJLGlDQUFlLEVBQThDLENBQUM7UUFFcEosa0JBQWEsR0FBRyxZQUFZLENBQUM7UUFLN0Isd0JBQW1CLEdBQUcsbUJBQW1CLENBQUM7UUFDMUMsbUJBQWMsR0FBRyxXQUFXLENBQUM7UUFDN0Isc0JBQWlCLEdBQVcsU0FBUyxDQUFDO1FBRXRDLHlCQUFvQixHQUFHLG1CQUFtQixDQUFDO1FBQzNDLG9CQUFlLEdBQUcsV0FBVyxDQUFDO1FBQzlCLHVCQUFrQixHQUFXLFNBQVMsQ0FBQztRQUV2Qyx3QkFBbUIsR0FBRyxtQkFBbUIsQ0FBQztRQUMxQyxtQkFBYyxHQUFHLFdBQVcsQ0FBQztRQUM3QixzQkFBaUIsR0FBVyxTQUFTLENBQUM7UUFDdEMsb0JBQWUsR0FBVyxDQUFDLENBQUM7UUFRekMsSUFBSSxDQUFDLFlBQVksR0FBRyxXQUFXLENBQUM7UUFDaEMsSUFBSSxDQUFDLGNBQWMsR0FBRyxhQUFhLENBQUM7SUFDeEMsQ0FBQztJQUlNLHlDQUFhLEdBQXBCLFVBQXFCLGtCQUEwQjtRQUMzQyxJQUFJLFlBQW9CLENBQUM7UUFDekIsSUFBSSxhQUFxQixDQUFDO1FBQzFCLElBQUksYUFBYSxHQUFH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LCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwi77u/aW1wb3J0IHsgRXZlbnREaXNwYXRjaGVyIH0gZnJvbSBcIi4uLy4uL0V2ZW50cy9FdmVudERpc3BhdGNoZXJcIjtcclxuaW1wb3J0IHsgQ2F0ZWdvcnkgfSBmcm9tIFwiLi4vLi4vTW9kZWxzL0NhdGVnb3J5XCI7XHJcbmltcG9ydCB7IFVzZXJJbnB1dCB9IGZyb20gXCIuLi8uLi9IZWxwZXIvVXNlcklucHV0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQ2F0ZWdvcnlTZWxlY3Rpb24ge1xyXG5cclxuICAgIHB1YmxpYyBTZWxlY3RlZENhdGVnb3J5Q2hhbmdlZEV2ZW50OiBFdmVudERpc3BhdGNoZXI8Q2F0ZWdvcnlTZWxlY3Rpb24sIENhdGVnb3J5Q2FobmdlZEV2ZW50QXJnPiA9IG5ldyBFdmVudERpc3BhdGNoZXI8Q2F0ZWdvcnlTZWxlY3Rpb24sIENhdGVnb3J5Q2FobmdlZEV2ZW50QXJnPigpO1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgQ2F0ZWdvcnlJZEtleSA9IFwiQ2F0ZWdvcnlJZFwiO1xyXG5cclxuICAgIHByaXZhdGUgX3BhcmVudERpdklkOiBzdHJpbmc7Ly9kaXYgZWxlbWVudCB0aGF0IGhvbGRzIGFsbCBDYXRlZ29yeVNlbGVjdGlvbiBlbGVtZW50c1xyXG4gICAgcHJpdmF0ZSBfYWxsQ2F0ZWdvcmllczogQ2F0ZWdvcnlbXTtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9maXJzdExldmVsVGVtcGxhdGUgPSBcImNhdGVnb3J5MVRlbXBsYXRlXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9maXJzdExldmVsRGl2ID0gXCJjYXRlZ29yeTFcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2ZpcnN0TGV2ZWxTZWxlY3Q6IHN0cmluZyA9IFwic2VsZWN0MVwiO1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX3NlY29uZExldmVsVGVtcGxhdGUgPSBcImNhdGVnb3J5MlRlbXBsYXRlXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9zZWNvbmRMZXZlbERpdiA9IFwiY2F0ZWdvcnkyXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9zZWNvbmRMZXZlbFNlbGVjdDogc3RyaW5nID0gXCJzZWxlY3QyXCI7XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfdGhpcmRMZXZlbFRlbXBsYXRlID0gXCJjYXRlZ29yeTNUZW1wbGF0ZVwiO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfdGhpcmRMZXZlbERpdiA9IFwiY2F0ZWdvcnkzXCI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF90aGlyZExldmVsU2VsZWN0OiBzdHJpbmcgPSBcInNlbGVjdDNcIjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX3Jvb3RDYXRlZ29yeUlkOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIHByaXZhdGUgX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsT25lOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIF9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFR3bzogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBfc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUaHJlZTogbnVtYmVyO1xyXG5cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwYXJlbnREaXZJZDogc3RyaW5nLCBhbGxDYXRlZ29yaWVzOiBDYXRlZ29yeVtdKSB7XHJcbiAgICAgICAgdGhpcy5fcGFyZW50RGl2SWQgPSBwYXJlbnREaXZJZDtcclxuICAgICAgICB0aGlzLl9hbGxDYXRlZ29yaWVzID0gYWxsQ2F0ZWdvcmllcztcclxuICAgIH1cclxuXHJcbiAgICBcclxuXHJcbiAgICBwdWJsaWMgU2V0Q2F0ZWdvcnlJZChzZWxlY3RlZENhdGVnb3J5SWQ6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIGxldCBmaXJzdExldmVsSWQ6IG51bWJlcjtcclxuICAgICAgICBsZXQgc2Vjb25kTGV2ZWxJZDogbnVtYmVyO1xyXG4gICAgICAgIGxldCBjYXRlZ29yeUxldmVsID0gdGhpcy5nZXRDYXRlZ29yeUxldmVsKHNlbGVjdGVkQ2F0ZWdvcnlJZCk7XHJcbiAgICAgICAgc3dpdGNoIChjYXRlZ29yeUxldmVsKSB7XHJcbiAgICAgICAgY2FzZSBDYXRlZ29yeUxldmVsLlVua293bjpcclxuICAgICAgICAgICAgdGhpcy5DcmVhdGVGaXJzdExldmVsKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBDYXRlZ29yeUxldmVsLkxldmVsMTpcclxuICAgICAgICAgICAgICAgIHRoaXMuQ3JlYXRlRmlyc3RMZXZlbCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRGaXJzdExldmVsVG9TcGVjaWZpY0lkKHNlbGVjdGVkQ2F0ZWdvcnlJZCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVNlY29uZExldmVsKHNlbGVjdGVkQ2F0ZWdvcnlJZCk7XHJcbiAgICAgICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5fZmlyc3RMZXZlbFNlbGVjdCkudHJpZ2dlcihcImNoYW5nZVwiKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIENhdGVnb3J5TGV2ZWwuTGV2ZWwyOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5DcmVhdGVGaXJzdExldmVsKCk7XHJcbiAgICAgICAgICAgICAgICBmaXJzdExldmVsSWQgPSB0aGlzLl9hbGxDYXRlZ29yaWVzLmZpbHRlcihjYXRlZ29yeSA9PiBjYXRlZ29yeS5DYXRlZ29yeUlkID09PSBzZWxlY3RlZENhdGVnb3J5SWQpWzBdXHJcbiAgICAgICAgICAgICAgICAgICAgLlBhcmVudENhdGVnb3J5SWQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldEZpcnN0TGV2ZWxUb1NwZWNpZmljSWQoZmlyc3RMZXZlbElkKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlU2Vjb25kTGV2ZWwoZmlyc3RMZXZlbElkKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0U2Vjb25kTGV2ZWxUb1NwZWNpZmljSWQoc2VsZWN0ZWRDYXRlZ29yeUlkKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlVGhpcmRMZXZlbChzZWxlY3RlZENhdGVnb3J5SWQpO1xyXG4gICAgICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuX3NlY29uZExldmVsU2VsZWN0KS50cmlnZ2VyKFwiY2hhbmdlXCIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBDYXRlZ29yeUxldmVsLkxldmVsMzpcclxuICAgICAgICAgICAgdGhpcy5DcmVhdGVGaXJzdExldmVsKCk7XHJcbiAgICAgICAgICAgIHNlY29uZExldmVsSWQgPSB0aGlzLl9hbGxDYXRlZ29yaWVzLmZpbHRlcihjYXRlZ29yeSA9PiBjYXRlZ29yeS5DYXRlZ29yeUlkID09PSBzZWxlY3RlZENhdGVnb3J5SWQpWzBdXHJcbiAgICAgICAgICAgICAgICAgICAgLlBhcmVudENhdGVnb3J5SWQ7XHJcbiAgICAgICAgICAgIGZpcnN0TGV2ZWxJZCA9IHRoaXMuX2FsbENhdGVnb3JpZXMuZmlsdGVyKGNhdGVnb3J5ID0+IGNhdGVnb3J5LkNhdGVnb3J5SWQgPT09IHNlY29uZExldmVsSWQpWzBdXHJcbiAgICAgICAgICAgICAgICAuUGFyZW50Q2F0ZWdvcnlJZDtcclxuICAgICAgICAgICAgdGhpcy5zZXRGaXJzdExldmVsVG9TcGVjaWZpY0lkKGZpcnN0TGV2ZWxJZCk7XHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlU2Vjb25kTGV2ZWwoZmlyc3RMZXZlbElkKTtcclxuICAgICAgICAgICAgdGhpcy5zZXRTZWNvbmRMZXZlbFRvU3BlY2lmaWNJZChzZWNvbmRMZXZlbElkKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlVGhpcmRMZXZlbChzZWNvbmRMZXZlbElkKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0VGhpcmRMZXZlbFRvU3BlY2lmaWNJZChzZWxlY3RlZENhdGVnb3J5SWQpO1xyXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5fdGhpcmRMZXZlbFNlbGVjdCkudHJpZ2dlcihcImNoYW5nZVwiKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0Rmlyc3RMZXZlbFRvU3BlY2lmaWNJZChjYXRlZ29yeUlkOiBudW1iZXIpIHtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fZmlyc3RMZXZlbFNlbGVjdCkudmFsKGNhdGVnb3J5SWQpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBzZXRTZWNvbmRMZXZlbFRvU3BlY2lmaWNJZChjYXRlZ29yeUlkOiBudW1iZXIpIHtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fc2Vjb25kTGV2ZWxTZWxlY3QpLnZhbChjYXRlZ29yeUlkKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgc2V0VGhpcmRMZXZlbFRvU3BlY2lmaWNJZChjYXRlZ29yeUlkOiBudW1iZXIpIHtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fdGhpcmRMZXZlbFNlbGVjdCkudmFsKGNhdGVnb3J5SWQpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBnZXRDYXRlZ29yeUxldmVsKGNhdGVnb3J5SWQ6IG51bWJlcik6IENhdGVnb3J5TGV2ZWwge1xyXG5cclxuICAgICAgICBsZXQgdGVtcENhdGVnb3J5QXJyYXkgPSB0aGlzLl9hbGxDYXRlZ29yaWVzLmZpbHRlcihjYXRlZ29yeSA9PiBjYXRlZ29yeS5DYXRlZ29yeUlkID09PSBjYXRlZ29yeUlkKTtcclxuICAgICAgICBsZXQgdGVtcENhdGVnb3J5O1xyXG4gICAgICAgIGlmICh0ZW1wQ2F0ZWdvcnlBcnJheS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIENhdGVnb3J5TGV2ZWwuVW5rb3duO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0ZW1wQ2F0ZWdvcnkgPSB0ZW1wQ2F0ZWdvcnlBcnJheVswXTtcclxuICAgICAgICBpZiAodGVtcENhdGVnb3J5LlBhcmVudENhdGVnb3J5SWQgPT09IHRoaXMuX3Jvb3RDYXRlZ29yeUlkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBDYXRlZ29yeUxldmVsLkxldmVsMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGVtcENhdGVnb3J5ID0gdGhpcy5fYWxsQ2F0ZWdvcmllcy5maWx0ZXIoY2F0ZWdvcnkgPT4gY2F0ZWdvcnkuQ2F0ZWdvcnlJZCA9PT0gdGVtcENhdGVnb3J5LlBhcmVudENhdGVnb3J5SWQpWzBdO1xyXG4gICAgICAgIGlmICh0ZW1wQ2F0ZWdvcnkuUGFyZW50Q2F0ZWdvcnlJZCA9PT0gdGhpcy5fcm9vdENhdGVnb3J5SWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIENhdGVnb3J5TGV2ZWwuTGV2ZWwyO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gQ2F0ZWdvcnlMZXZlbC5MZXZlbDM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIEluc2VydENhdGVnb3J5SWRJblVzZXJJbnB1dERpY3Rpb25hcnkodXNlcklucHV0OiBVc2VySW5wdXQpOiB2b2lkIHtcclxuICAgICAgICBsZXQgY2F0ZWdvcnlJZCA9IHRoaXMuR2V0U2VsZWN0ZWRDYXRlZ29yeUlkKCk7XHJcbiAgICAgICAgdXNlcklucHV0LlBhcmFtZXRlcnNEaWN0aW9uYXJ5W3RoaXMuQ2F0ZWdvcnlJZEtleV0gPSBjYXRlZ29yeUlkOy8vMTAwIGZvciBjYXJzXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIEdldFNlbGVjdGVkQ2F0ZWdvcnlJZCgpOiBudW1iZXIge1xyXG4gICAgICAgIGlmICh0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFRocmVlICE9PSB1bmRlZmluZWQgJiZcclxuICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUaHJlZSAhPT0gdGhpcy5fcm9vdENhdGVnb3J5SWQpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFRocmVlO1xyXG4gICAgICAgIGVsc2UgaWYgKHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVHdvICE9PSB1bmRlZmluZWQgJiZcclxuICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUd28gIT09IHRoaXMuX3Jvb3RDYXRlZ29yeUlkKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUd287XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxPbmU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIENyZWF0ZUZpcnN0TGV2ZWwoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVFbGVtZW50KHRoaXMuX2ZpcnN0TGV2ZWxEaXYpO1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsT25lID0gdGhpcy5fcm9vdENhdGVnb3J5SWQ7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVFbGVtZW50KHRoaXMuX3NlY29uZExldmVsRGl2KTtcclxuICAgICAgICB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFR3byA9IHRoaXMuX3Jvb3RDYXRlZ29yeUlkO1xyXG4gICAgICAgIHRoaXMucmVtb3ZlRWxlbWVudCh0aGlzLl90aGlyZExldmVsRGl2KTtcclxuICAgICAgICB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFRocmVlID0gdGhpcy5fcm9vdENhdGVnb3J5SWQ7XHJcblxyXG4gICAgICAgIGxldCB0ZW1wbGF0ZSA9ICQoXCIjXCIgKyB0aGlzLl9maXJzdExldmVsVGVtcGxhdGUpLmh0bWwoKTtcclxuICAgICAgICBsZXQgY2F0ZWdvcmllczogQ2F0ZWdvcnlbXSA9IG5ldyBBcnJheTxDYXRlZ29yeT4oKTtcclxuICAgICAgICBsZXQgZGF0YSA9IHsgY2F0ZWdvcmllczogY2F0ZWdvcmllcyB9XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxPbmUgPSB0aGlzLl9yb290Q2F0ZWdvcnlJZDsvL1xyXG4gICAgICAgIHRoaXMuX2FsbENhdGVnb3JpZXMuZm9yRWFjaChjYXRlZ29yeSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChjYXRlZ29yeS5QYXJlbnRDYXRlZ29yeUlkID09PSB0aGlzLl9yb290Q2F0ZWdvcnlJZCkge1xyXG4gICAgICAgICAgICAgICAgY2F0ZWdvcmllcy5wdXNoKGNhdGVnb3J5KTtcclxuICAgICAgICAgICAgfS8vaWZcclxuICAgICAgICB9KTsvL2ZvckVhY2hcclxuXHJcbiAgICAgICAgbGV0IGh0bWwgPSBNdXN0YWNoZS50b19odG1sKHRlbXBsYXRlLCBkYXRhKTtcclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fcGFyZW50RGl2SWQpLmFwcGVuZChodG1sKTtcclxuXHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX2ZpcnN0TGV2ZWxTZWxlY3QpLmNoYW5nZSgoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgbGV0IHNlbGVjdGVkSWQgPSBwYXJzZUludCgkKGV2ZW50LmN1cnJlbnRUYXJnZXQpLnZhbCgpLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbE9uZSA9IHNlbGVjdGVkSWQ7XHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlU2Vjb25kTGV2ZWwoc2VsZWN0ZWRJZCk7XHJcbiAgICAgICAgICAgIGxldCBldmVudEFyZyA9IG5ldyBDYXRlZ29yeUNhaG5nZWRFdmVudEFyZygpO1xyXG4gICAgICAgICAgICBldmVudEFyZy5TZWxlY3RlZENhdGVnb3J5SWQgPSB0aGlzLkdldFNlbGVjdGVkQ2F0ZWdvcnlJZCgpO1xyXG4gICAgICAgICAgICBldmVudEFyZy5TZWxlY3RlZENhdGVnb3J5SGFzQ2hpbGQgPSB0aGlzLnNlbGVjdGVkQ2F0ZWdvcnlIYXNDaGlsZHJlbigpO1xyXG4gICAgICAgICAgICB0aGlzLlNlbGVjdGVkQ2F0ZWdvcnlDaGFuZ2VkRXZlbnQuRGlzcGF0Y2godGhpcywgZXZlbnRBcmcpO1xyXG4gICAgICAgIH0pOy8vY2hhbmdlXHJcbiAgICB9Ly9DcmVhdGVGaXJzdExldmVsXHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVTZWNvbmRMZXZlbChmaXJzdExldmVsQ2F0ZWdvcnlJZDogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVFbGVtZW50KHRoaXMuX3NlY29uZExldmVsRGl2KTtcclxuICAgICAgICB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFR3byA9IHRoaXMuX3Jvb3RDYXRlZ29yeUlkO1xyXG4gICAgICAgIHRoaXMucmVtb3ZlRWxlbWVudCh0aGlzLl90aGlyZExldmVsRGl2KTtcclxuICAgICAgICB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFRocmVlID0gdGhpcy5fcm9vdENhdGVnb3J5SWQ7XHJcbiAgICAgICAgaWYgKGZpcnN0TGV2ZWxDYXRlZ29yeUlkID09PSB0aGlzLl9yb290Q2F0ZWdvcnlJZCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgdGVtcGxhdGUgPSAkKFwiI1wiICsgdGhpcy5fc2Vjb25kTGV2ZWxUZW1wbGF0ZSkuaHRtbCgpO1xyXG4gICAgICAgIGxldCBjYXRlZ29yaWVzOiBDYXRlZ29yeVtdID0gbmV3IEFycmF5PENhdGVnb3J5PigpO1xyXG4gICAgICAgIGxldCBkYXRhID0geyBjYXRlZ29yaWVzOiBjYXRlZ29yaWVzIH1cclxuXHJcbiAgICAgICAgdGhpcy5fYWxsQ2F0ZWdvcmllcy5mb3JFYWNoKGNhdGVnb3J5ID0+IHtcclxuICAgICAgICAgICAgaWYgKGNhdGVnb3J5LlBhcmVudENhdGVnb3J5SWQgPT09IGZpcnN0TGV2ZWxDYXRlZ29yeUlkKSB7XHJcbiAgICAgICAgICAgICAgICBjYXRlZ29yaWVzLnB1c2goY2F0ZWdvcnkpO1xyXG4gICAgICAgICAgICB9Ly9pZlxyXG4gICAgICAgIH0pOy8vZm9yRWFjaFxyXG5cclxuICAgICAgICBsZXQgaHRtbCA9IE11c3RhY2hlLnRvX2h0bWwodGVtcGxhdGUsIGRhdGEpO1xyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9wYXJlbnREaXZJZCkuYXBwZW5kKGh0bWwpO1xyXG5cclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fc2Vjb25kTGV2ZWxTZWxlY3QpLmNoYW5nZSgoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgbGV0IHNlbGVjdGVkSWQgPSBwYXJzZUludCgkKGV2ZW50LmN1cnJlbnRUYXJnZXQpLnZhbCgpLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICB0aGlzLl9zZWxlY3RlZENhdGVnb3J5SWRMZXZlbFR3byA9IHNlbGVjdGVkSWQ7XHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlVGhpcmRMZXZlbChzZWxlY3RlZElkKTtcclxuICAgICAgICAgICAgbGV0IGV2ZW50QXJnID0gbmV3IENhdGVnb3J5Q2FobmdlZEV2ZW50QXJnKCk7XHJcbiAgICAgICAgICAgIGV2ZW50QXJnLlNlbGVjdGVkQ2F0ZWdvcnlJZCA9IHRoaXMuR2V0U2VsZWN0ZWRDYXRlZ29yeUlkKCk7XHJcbiAgICAgICAgICAgIGV2ZW50QXJnLlNlbGVjdGVkQ2F0ZWdvcnlIYXNDaGlsZCA9IHRoaXMuc2VsZWN0ZWRDYXRlZ29yeUhhc0NoaWxkcmVuKCk7XHJcbiAgICAgICAgICAgIHRoaXMuU2VsZWN0ZWRDYXRlZ29yeUNoYW5nZWRFdmVudC5EaXNwYXRjaCh0aGlzLCBldmVudEFyZyk7XHJcbiAgICAgICAgfSk7Ly9jaGFuZ2VcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZVRoaXJkTGV2ZWwoc2Vjb25kTGV2ZWxDYXRlZ29yeUlkOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnJlbW92ZUVsZW1lbnQodGhpcy5fdGhpcmRMZXZlbERpdik7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYXRlZ29yeUlkTGV2ZWxUaHJlZSA9IHRoaXMuX3Jvb3RDYXRlZ29yeUlkO1xyXG5cclxuICAgICAgICBpZiAoc2Vjb25kTGV2ZWxDYXRlZ29yeUlkID09PSB0aGlzLl9yb290Q2F0ZWdvcnlJZCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgdGVtcGxhdGUgPSAkKFwiI1wiICsgdGhpcy5fdGhpcmRMZXZlbFRlbXBsYXRlKS5odG1sKCk7XHJcbiAgICAgICAgbGV0IGNhdGVnb3JpZXM6IENhdGVnb3J5W10gPSBuZXcgQXJyYXk8Q2F0ZWdvcnk+KCk7XHJcbiAgICAgICAgbGV0IGRhdGEgPSB7IGNhdGVnb3JpZXM6IGNhdGVnb3JpZXMgfVxyXG5cclxuICAgICAgICB0aGlzLl9hbGxDYXRlZ29yaWVzLmZvckVhY2goY2F0ZWdvcnkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoY2F0ZWdvcnkuUGFyZW50Q2F0ZWdvcnlJZCA9PT0gc2Vjb25kTGV2ZWxDYXRlZ29yeUlkKSB7XHJcbiAgICAgICAgICAgICAgICBjYXRlZ29yaWVzLnB1c2goY2F0ZWdvcnkpO1xyXG4gICAgICAgICAgICB9Ly9pZlxyXG4gICAgICAgIH0pOy8vZm9yRWFjaFxyXG4gICAgICAgIGlmIChjYXRlZ29yaWVzLmxlbmd0aCA9PT0gMCkgey8vTm8gSXRlbSBpbiB0aGlyZCBsZXZlbCBjYXRlZ29yeVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBodG1sID0gTXVzdGFjaGUudG9faHRtbCh0ZW1wbGF0ZSwgZGF0YSk7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX3BhcmVudERpdklkKS5hcHBlbmQoaHRtbCk7XHJcblxyXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl90aGlyZExldmVsU2VsZWN0KS5jaGFuZ2UoKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkQ2F0ZWdvcnlJZExldmVsVGhyZWUgPSBwYXJzZUludCgkKGV2ZW50LmN1cnJlbnRUYXJnZXQpLnZhbCgpLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICBsZXQgZXZlbnRBcmcgPSBuZXcgQ2F0ZWdvcnlDYWhuZ2VkRXZlbnRBcmcoKTtcclxuICAgICAgICAgICAgZXZlbnRBcmcuU2VsZWN0ZWRDYXRlZ29yeUlkID0gdGhpcy5HZXRTZWxlY3RlZENhdGVnb3J5SWQoKTtcclxuICAgICAgICAgICAgZXZlbnRBcmcuU2VsZWN0ZWRDYXRlZ29yeUhhc0NoaWxkID0gdGhpcy5zZWxlY3RlZENhdGVnb3J5SGFzQ2hpbGRyZW4oKTtcclxuICAgICAgICAgICAgdGhpcy5TZWxlY3RlZENhdGVnb3J5Q2hhbmdlZEV2ZW50LkRpc3BhdGNoKHRoaXMsIGV2ZW50QXJnKTtcclxuICAgICAgICB9KTsvL2NoYW5nZVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2VsZWN0ZWRDYXRlZ29yeUhhc0NoaWxkcmVuKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGxldCBzZWxlY3RlZENhdGVnb3J5SWQgPSB0aGlzLkdldFNlbGVjdGVkQ2F0ZWdvcnlJZCgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9hbGxDYXRlZ29yaWVzLmZpbHRlclxyXG4gICAgICAgICAgICAoKGNhdGVnb3J5KSA9PiB7IHJldHVybiBjYXRlZ29yeS5QYXJlbnRDYXRlZ29yeUlkID09PSBzZWxlY3RlZENhdGVnb3J5SWQgfSkubGVuZ3RoID4gMDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlbW92ZUVsZW1lbnQoaWQ6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgICQoXCIjXCIgKyBpZCkucmVtb3ZlKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBDYXRlZ29yeUNhaG5nZWRFdmVudEFyZyB7XHJcbiAgICBwdWJsaWMgU2VsZWN0ZWRDYXRlZ29yeUlkOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgU2VsZWN0ZWRDYXRlZ29yeUhhc0NoaWxkOiBib29sZWFuO1xyXG59XHJcblxyXG5lbnVtIENhdGVnb3J5TGV2ZWwge1xyXG4gICAgTGV2ZWwxID0gMSxcclxuICAgIExldmVsMiA9IDIsXHJcbiAgICBMZXZlbDMgPSAzLFxyXG4gICAgVW5rb3duPTRcclxufVxyXG5cclxuIiwi77u/aW1wb3J0IHtJRXZlbnR9ICBmcm9tIFwiLi9JRXZlbnRcIjtcclxuXHJcblxyXG4vKiBUaGUgZGlzcGF0Y2hlciBoYW5kbGVzIHRoZSBzdG9yYWdlIG9mIHN1YnNjaXB0aW9ucyBhbmQgZmFjaWxpdGF0ZXNcclxuICBzdWJzY3JpcHRpb24sIHVuc3Vic2NyaXB0aW9uIGFuZCBkaXNwYXRjaGluZyBvZiB0aGUgZXZlbnQgKi9cclxuZXhwb3J0ICBjbGFzcyBFdmVudERpc3BhdGNoZXI8VFNlbmRlciwgVEFyZ3M+IGltcGxlbWVudHMgSUV2ZW50PFRTZW5kZXIsIFRBcmdzPiB7XHJcblxyXG4gICAgcHJpdmF0ZSBfc3Vic2NyaXB0aW9uczogQXJyYXk8KHNlbmRlcjogVFNlbmRlciwgYXJnczogVEFyZ3MpID0+IHZvaWQ+ID0gbmV3IEFycmF5PChzZW5kZXI6IFRTZW5kZXIsIGFyZ3M6IFRBcmdzKSA9PiB2b2lkPigpO1xyXG5cclxuICAgIHB1YmxpYyBTdWJzY3JpYmUoZm46IChzZW5kZXI6IFRTZW5kZXIsIGFyZ3M6IFRBcmdzKSA9PiB2b2lkKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKGZuKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMucHVzaChmbik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyAgVW5zdWJzY3JpYmUoZm46IChzZW5kZXI6IFRTZW5kZXIsIGFyZ3M6IFRBcmdzKSA9PiB2b2lkKTogdm9pZCB7XHJcbiAgICAgICAgbGV0IGkgPSB0aGlzLl9zdWJzY3JpcHRpb25zLmluZGV4T2YoZm4pO1xyXG4gICAgICAgIGlmIChpID4gLTEpIHtcclxuICAgICAgICAgICAgdGhpcy5fc3Vic2NyaXB0aW9ucy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyAgRGlzcGF0Y2goc2VuZGVyOiBUU2VuZGVyLCBhcmdzOiBUQXJncyk6IHZvaWQge1xyXG4gICAgICAgIGZvciAobGV0IGhhbmRsZXIgb2YgdGhpcy5fc3Vic2NyaXB0aW9ucykge1xyXG4gICAgICAgICAgICBoYW5kbGVyKHNlbmRlciwgYXJncyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59Iiwi77u/aW50ZXJmYWNlIExvb3NlT2JqZWN0IHtcclxuICAgIFtrZXk6IHN0cmluZ106IGFueVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVXNlcklucHV0IHtcclxuICAgIHB1YmxpYyBQYXJhbWV0ZXJzRGljdGlvbmFyeTogTG9vc2VPYmplY3QgPSB7fTtcclxufVxyXG5cclxuXHJcblxyXG4iLCLvu79pbXBvcnQge1VzZXJJbnB1dH0gZnJvbSBcIi4uLy4uLy4uL0hlbHBlci9Vc2VySW5wdXRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBMZXRNZUtub3dTZXJ2ZXJDYWxsZXIge1xyXG4gICAgLy9UT0RPIGNhbGwgc2VydmVyIGFuZCBzZW5kIHVzZXJpbnB1dCBmcm8gbmV3IGFkXHJcbiAgICAvL2dldCByZXN1bHQgYW5kIHNob3cgdG8gdXNlclxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfdXJsOiBzdHJpbmcgPSBcIi9hcGkvTGV0TWVLbm93QXBpL0FkZE5ld0xldE1lS25vd1JlY29yZFwiO1xyXG5cclxuICAgIHB1YmxpYyBTYXZlQWQodXNlcklucHV0OiBVc2VySW5wdXQpOiB2b2lkIHtcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0eXBlOiBcIlBPU1RcIiwgLy9HRVQgb3IgUE9TVCBvciBQVVQgb3IgREVMRVRFIHZlcmJcclxuICAgICAgICAgICAgdXJsOiB0aGlzLl91cmwsXHJcbiAgICAgICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KHVzZXJJbnB1dC5QYXJhbWV0ZXJzRGljdGlvbmFyeSksIC8vRGF0YSBzZW50IHRvIHNlcnZlclxyXG4gICAgICAgICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLCAvLyBjb250ZW50IHR5cGUgc2VudCB0byBzZXJ2ZXJcclxuICAgICAgICAgICAgc3VjY2VzczogKG1zZywgdGV4dFN0YXR1cywganFYSFIpID0+IHRoaXMub25TdWNjZXNzR2V0SXRlbXNGcm9tU2VydmVyKG1zZywgdGV4dFN0YXR1cywganFYSFIpLCAvL09uIFN1Y2Nlc3NmdWxsIHNlcnZpY2UgY2FsbFxyXG4gICAgICAgICAgICBlcnJvcjogKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikgPT4gdGhpcy5vbkVycm9yR2V0SXRlbXNGcm9tU2VydmVyKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikgLy8gV2hlbiBTZXJ2aWNlIGNhbGwgZmFpbHNcclxuICAgICAgICB9KTsgLy8uYWpheFxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25TdWNjZXNzR2V0SXRlbXNGcm9tU2VydmVyKG1zZzogYW55LCB0ZXh0U3RhdHVzOiBzdHJpbmcsIGpxWEhSOiBKUXVlcnlYSFIpIHtcclxuICAgICAgICAvL1RPRE8gcmVkaXJlY3QgdXNlciB0byBhIG5ldyBwYWdlXHJcbiAgICAgICAgaWYgKG1zZy5TdWNjZXNzID09IHRydWUpIHtcclxuICAgICAgICAgICAgZG9jdW1lbnQubG9jYXRpb24ucmVwbGFjZShcIi9MZXRNZUtub3cvQ29uZmlybVwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHByaXZhdGUgb25FcnJvckdldEl0ZW1zRnJvbVNlcnZlcihqcVhIUjogSlF1ZXJ5WEhSLCB0ZXh0U3RhdHVzOiBzdHJpbmcsIGVycm9yVGhyb3duOiBzdHJpbmcpIHtcclxuICAgICAgICAvL1RPRE8gaW5mb3JtIGVycm9yIHRvIHVzZXJcclxuICAgIH0gXHJcbn0iLCLvu79pbXBvcnQgeyBDYXRlZ29yeVNlbGVjdGlvbiB9IGZyb20gXCIuLi8uLi8uLi9Db21wb25lbnRzL0NhdGVnb3J5L0NhdGVnb3J5U2VsZWN0aW9uXCI7XHJcbmltcG9ydCB7IENhdGVnb3J5IH0gZnJvbSBcIi4uLy4uLy4uL01vZGVscy9DYXRlZ29yeVwiO1xyXG5pbXBvcnQge1VzZXJJbnB1dH0gZnJvbSBcIi4uLy4uLy4uL0hlbHBlci9Vc2VySW5wdXRcIjtcclxuaW1wb3J0IHtMZXRNZUtub3dTZXJ2ZXJDYWxsZXJ9IGZyb20gXCIuL0xldE1lS25vd1NlcnZlckNhbGxlclwiO1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBMZXRNZUtub3cge1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfcmVnaXN0ZXJMZXRNZUtub3dJbnB1dElkOiBzdHJpbmcgPSBcInJlZ2lzdGVyTGV0TWVLbm93XCI7XHJcblxyXG4gICAgcHJpdmF0ZSBfY2F0ZWdvcnlTZWxlY3Rpb246IENhdGVnb3J5U2VsZWN0aW9uO1xyXG4gICAgcHJpdmF0ZSBfbGV0TWVLbm93U2VydmVyQ2FsbGVyOkxldE1lS25vd1NlcnZlckNhbGxlcjtcclxuICAgIGNvbnN0cnVjdG9yKGNhdGVnb3J5U2VsZWN0b3JQYXJlbnREaXZJZDogc3RyaW5nLCBhbGxDYXRlZ29yaWVzSWQ6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuaW5pdENhdGVnb3J5U2VsZWN0KGNhdGVnb3J5U2VsZWN0b3JQYXJlbnREaXZJZCwgYWxsQ2F0ZWdvcmllc0lkKTtcclxuICAgICAgICB0aGlzLl9sZXRNZUtub3dTZXJ2ZXJDYWxsZXIgPSBuZXcgTGV0TWVLbm93U2VydmVyQ2FsbGVyKCk7XHJcbiAgICAgICAgdGhpcy5pbml0RXZlbnRIYW5kbGVycygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaW5pdENhdGVnb3J5U2VsZWN0KGNhdGVnb3J5U2VsZWN0b3JQYXJlbnREaXZJZDogc3RyaW5nLCBhbGxDYXRlZ29yaWVzSWQ6IHN0cmluZyk6dm9pZCB7XHJcbiAgICAgICAgbGV0IGFsbENhdGVnb3JpZXNTdHJpbmcgPSAkKFwiI1wiICsgYWxsQ2F0ZWdvcmllc0lkKS52YWwoKS50b1N0cmluZygpO1xyXG4gICAgICAgIGxldCBhbGxDYXRlZ29yaWVzID0gJC5wYXJzZUpTT04oYWxsQ2F0ZWdvcmllc1N0cmluZykgYXMgQ2F0ZWdvcnlbXTtcclxuICAgICAgICB0aGlzLl9jYXRlZ29yeVNlbGVjdGlvbiA9IG5ldyBDYXRlZ29yeVNlbGVjdGlvbihjYXRlZ29yeVNlbGVjdG9yUGFyZW50RGl2SWQsIGFsbENhdGVnb3JpZXMpO1xyXG4gICAgICAgIHRoaXMuX2NhdGVnb3J5U2VsZWN0aW9uLkNyZWF0ZUZpcnN0TGV2ZWwoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXRFdmVudEhhbmRsZXJzKCk6dm9pZCB7XHJcbiAgICAgICAgdGhpcy5fY2F0ZWdvcnlTZWxlY3Rpb24uU2VsZWN0ZWRDYXRlZ29yeUNoYW5nZWRFdmVudC5TdWJzY3JpYmUoKHNlbmRlciwgYXJncykgPT4ge1xyXG4gICAgICAgICAgICAvL1RPRE8gbG9hZCBzcGVjaWZpYyBMZXRNZUtub3cgVmlldyBiYXNlZCBvbiBjYXRlZ29yeSBpZFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKFwiI1wiICsgdGhpcy5fcmVnaXN0ZXJMZXRNZUtub3dJbnB1dElkKS5vbihcImNsaWNrXCIsIChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB0aGlzLnJlZ2lzdGVyTGV0TWVLbm93KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSAgcmVnaXN0ZXJMZXRNZUtub3coKTp2b2lkIHtcclxuICAgICAgICAvL1RPRE8gZGlzYWJsZSBzdWJtaXRBZCBCdXR0b24gdW50aWwgY3VycmVudCBzdWJtaXNzaW9uIGlzIG9rIG9yIGVycm9ybm91cyBcclxuXHJcbiAgICAgICAgbGV0IHVzZXJJbnB1dCA9IG5ldyBVc2VySW5wdXQoKTtcclxuICAgICAgICB0aGlzLl9jYXRlZ29yeVNlbGVjdGlvbi5JbnNlcnRDYXRlZ29yeUlkSW5Vc2VySW5wdXREaWN0aW9uYXJ5KHVzZXJJbnB1dCk7XHJcblxyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuX2xldE1lS25vd1NlcnZlckNhbGxlci5TYXZlQWQodXNlcklucHV0KTtcclxuICAgIH1cclxufVxyXG5cclxubGV0IGNhdGVnb3J5U2VsZWN0b3JQYXJlbnREaXZJZDogc3RyaW5nID0gXCJjYXRlZ29yeVNlbGVjdG9yXCI7XHJcbmxldCBhbGxDYXRlZ29yaWVzSWQgPSBcImFsbENhdGVnb3JpZXNcIjtcclxuXHJcbiQoZG9jdW1lbnQpLnJlYWR5KCgpPT4ge1xyXG4gICAgbGV0IGxldE1lS25vdyA9IG5ldyBMZXRNZUtub3coY2F0ZWdvcnlTZWxlY3RvclBhcmVudERpdklkLGFsbENhdGVnb3JpZXNJZCk7XHJcbn0pOyJdfQ==
