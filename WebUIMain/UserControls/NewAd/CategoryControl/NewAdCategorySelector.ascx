<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="NewAdCategorySelector.ascx.cs" Inherits="WebUIMain.UserControls.NewAd.CategoryControl.NewAdCategorySelector" %>

<script src="../../../StyleScript/jquery-1.11.3.js"></script>
<script src="../../../StyleScript/mustache.js"></script>

<%--<script id="personTpl" type="text/template">
<h1>{{firstName}} {{lastName}}</h1>
<p>Blog URL: <a href="{{blogURL}}">{{blogURL}}</a></p>
</script>--%>

<script  id="categoryTemplate" type="text/template">
    <div class="col-sm-4">
        <select id='{{id}}' class="form-control">
            <option value="0">گروه را انتخاب نمایید </option>
            {{#categories}}
        <option value='{{categoryId}}'>گروه {{categoryName}} </option>
            {{/categories}}
        </select>
    </div>

</script>

<script>
    //raise categoryChanged event
    //raise categoryDataLoaded event



    //    $("p").click(function () {
    //        $.event.trigger({
    //            type: "newMessage",
    //            message: "Hello World!",
    //            time: new Date()
    //        });
    //    })//end click
    //});//end ready

    //var MYNamespace = MYNamespace || {};
    //MYNamespace.MyFirstClass = function (val) {
    //    this.value = val;
    //    this.getValue = function(){
    //        return this.value;
    //    };
    //}
    //var myFirstInstance = new MYNamespace.MyFirstClass(46);
    //alert(myFirstInstance.getValue());
</script>

<script>
    var NewAdCategoryControl = NewAdCategoryControl || {};

    NewAdCategoryControl.NewAdCategoryClass = function() {
        this.maximumCategoryLayer = 4;
        this.firstLevelId = "1thLevelCategory";
        this.secondLevelId = "2thLevelCategory";
        this.thirdLevelId = "3thLevelCategory";
        this.isCategoryDataLoaded = false;
        this.allCategories = new Array();
    };//end NewAdCategoryControl.NewAdCategoryClass

    //TODO use webService call instead of ashx call
    NewAdCategoryControl.NewAdCategoryClass.prototype.fillAllCategories = function () {
        "use strict";
        var formData = new FormData();       // Creating object of FormData class
        formData.append("method", "fillAllCategories");         // AddCriteriasing extra parameters to form_data
        var that = this;
        $.ajax({//C# Method call
            type: 'POST',
            processData: false, // important
            contentType: false, // important
            data: formData,
            async: true,
            url: "<%= Page.ResolveClientUrl(categoryHandlerAddress) %>",
            success: function (msg) {
                var jsonMessage = JSON.parse(msg);
                if (jsonMessage.status === "true") {
                    that.allCategories = jsonMessage.allCategories;
                    that.isCategoryDataLoaded = true;
                    //raise categoryDataLoaded event
                    $.event.trigger({ type: "categoryDataLoaded" });
                }//end if
                else {
                    that.reportMessageToUser(jsonMessage.message);
                }//end else
            }, //end success
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                that.reportMessageToUser("خطا در دریافت اطلاعات. لطفا صفحه را دوباره باز کنید");
            }// end error
        });//end $.ajax
    }//end fillAllCategories

    //return -1 if not found
    NewAdCategoryControl.NewAdCategoryClass.prototype.findParentCategoryId = function (categoryId) {
        for (var i = 0; i < this.allCategories.length; i++) {
            if (this.allCategories[i].categoryId === categoryId) {
                return this.allCategories[i].parentCategoryId;
            }//end if
        }//end for
        return -1;// not found
    }//end findParentCategoryId

    NewAdCategoryControl.NewAdCategoryClass.prototype.getAllParentCategoryId = function (childCategoryId) {
        var parentCategoryIdArray = new Array();
        var currentCategoryId = childCategoryId;
        while ((currentCategoryId = this.findParentCategoryId(currentCategoryId)) !== 0) {//test for 0 or -1
            parentCategoryIdArray.push(currentCategoryId);
        }//end while
        return parentCategoryIdArray;
    }//end getAllParentCategoryId

   
    ///
    ///called from CORE
    ///
    NewAdCategoryControl.NewAdCategoryClass.prototype.createCategorySelectors = function (categoryId) {
        //remove all elements in #categorySelect
        this.removeLevel(1);
        this.removeLevel(2);
        this.removeLevel(3);
        if (categoryId === 0 || this.findParentCategoryId(categoryId) === 0) {//root or firstLevel
            this.createNthLevelCategorySelector(1, 0, categoryId);
            return;
        }//end if        
        else {//not root

            var parentCategoryIdArray = this.getAllParentCategoryId(categoryId);
            //add parent selectros
            var firstLevelParentId;
            var secondLevelParentId;
            if (parentCategoryIdArray.length === 1) {
                firstLevelParentId = 0;
                secondLevelParentId = parentCategoryIdArray.pop();
                this.createNthLevelCategorySelector(1, firstLevelParentId, secondLevelParentId);
                this.createNthLevelCategorySelector(2, secondLevelParentId, categoryId);

            }
            else if (parentCategoryIdArray.length === 2) {
                firstLevelParentId = 0;
                secondLevelParentId = parentCategoryIdArray.pop();
                var thirdLevelParentId = parentCategoryIdArray.pop();
                this.createNthLevelCategorySelector(1, firstLevelParentId, secondLevelParentId);
                this.createNthLevelCategorySelector(2, secondLevelParentId, thirdLevelParentId);
                this.createNthLevelCategorySelector(3, thirdLevelParentId, categoryId);
            }
        }//end else not root

    }//end createCategorySelectors

    NewAdCategoryControl.NewAdCategoryClass.prototype.createNthLevelCategorySelector = function (level, parentId, selectedCategoryId) {
        var categoryInCurrentLevel = new Array();
        for (var i = 0; i < this.allCategories.length; i++) {
            if (this.allCategories[i].parentCategoryId === parentId) {
                categoryInCurrentLevel.push(this.allCategories[i]);
            }
        }
        var template = $('#categoryTemplate').html();
        var data;
        if (level === 1) {
            data = {
                id: this.firstLevelId,
                categories: categoryInCurrentLevel
            };
        }
        else if (level === 2) {
            data = {
                id: this.secondLevelId,
                categories: categoryInCurrentLevel
            };
        }
        else if (level === 3) {
            data = {
                id: this.thirdLevelId,
                categories: categoryInCurrentLevel
            };
        }
        else {
            this.reportMessageToUser("error in level parameter");
            return;
        }

        var html = Mustache.to_html(template, data);
        var $divCategory = $("#<%=categorySelect.ClientID%>");
        $divCategory.append(html);
        //register event handler
        if (level === 1) {
            $("#" + this.firstLevelId).on("change", { categoryLevel: 1, that: this }, this.changeInCategoryTree);
            //change select item based on selectedCategoryId
            $("#" + this.firstLevelId).val(selectedCategoryId);
        }
        else if (level === 2) {
            $("#" + this.secondLevelId).on("change", { categoryLevel: 2, that: this }, this.changeInCategoryTree);
            //change select item based on selectedCategoryId
            $("#" + this.secondLevelId).val(selectedCategoryId);
        }
        else if (level === 3) {
            $("#" + this.thirdLevelId).on("change", { categoryLevel: 3, that: this }, this.changeInCategoryTree);
            //change select item based on selectedCategoryId
            $("#" + this.thirdLevelId).val(selectedCategoryId);
        }


    }//end createFirstLevelCategorySelector

    NewAdCategoryControl.NewAdCategoryClass.prototype.changeInCategoryTree = function (event) {


        var categoryLevel = event.data.categoryLevel;
        var selectedId;
        var categoryObject = event.data.that;
        if (categoryLevel === 1) {
            selectedId = parseInt($("#" + categoryObject.firstLevelId).val());
            //remove level 2 ,3
            categoryObject.removeLevel(2);
            categoryObject.removeLevel(3);
            if (selectedId !== 0) {
                categoryObject.createNthLevelCategorySelector(2, selectedId, 0);
            }

        }
        else if (categoryLevel === 2) {
            selectedId = parseInt($("#" + categoryObject.secondLevelId).val());
            //remove level 3
            categoryObject.removeLevel(3);
            //TODO check to see selectedId has children
            if (selectedId !== 0) {
                if (categoryObject.hasChildren(selectedId)) {
                    categoryObject.createNthLevelCategorySelector(3, selectedId, 0);
                }
                else {
                    categoryObject.lowestLevelCategoryIsSelected(selectedId);
                }
            }
        }
        else if (categoryLevel === 3) {
            selectedId = parseInt($("#" + categoryObject.thirdLevelId).val());
            categoryObject.lowestLevelCategoryIsSelected(selectedId);
        }
    }

    NewAdCategoryControl.NewAdCategoryClass.prototype.hasChildren = function (categoryId) {
        for (var i = 0; i < this.allCategories.length; i++) {
            if (this.allCategories[i].parentCategoryId === categoryId) {
                return true;
            }
        }
        return false;
    }//end hasChildren


    NewAdCategoryControl.NewAdCategoryClass.prototype.removeLevel = function (levelToRemove) {
        if (levelToRemove === 1) {
            $("#" + this.firstLevelId).parent().remove();
        }
        else if (levelToRemove === 2) {
            $("#" + this.secondLevelId).parent().remove();
        }
        else if (levelToRemove === 3) {
            $("#" + this.thirdLevelId).parent().remove();
        }
    }

    NewAdCategoryControl.NewAdCategoryClass.prototype.lowestLevelCategoryIsSelected = function (selectedCategoryId) {
        $.event.trigger({
            type: "categoryChanged",
            message: "Hello World!",
            categoryId: selectedCategoryId,
            time: new Date()
        });
    }//end lowestLevelCategoryIsSelected


    NewAdCategoryControl.NewAdCategoryClass.prototype.reportMessageToUser = function (message) {
        var $newMessage = $("<span style=\"color:red\">" + message + "</span><br />");
        var $messageBox = $("#<%=messageBox.ClientID%>");
        $newMessage.hide();
        $messageBox.append($newMessage);
        $newMessage.show().delay(20000).hide(1000);
    }//end reportMessageToUser



</script>


<div class="row">
    <div id="categorySelect" runat="server">
    </div>
    <div id="messageBox" runat="server"></div>
</div>
<div class="row">
    <div id="attributeHolder" runat="server"></div>
</div>
