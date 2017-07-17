<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="CategoryControl.ascx.cs" Inherits="WebUIMain.UserControls.CommonControls.CategoryControl" %>

<script src="~/StyleScript/jquery-1.11.3.js"></script>
<script>
    //$(document).ready(function () {
    //    $(document).on("newMessage", function (e) {
    //        alert(e.message);
    //    });//end on
    //    $("p").click(function () {
    //        $.event.trigger({
    //            type: "newMessage",
    //            message: "Hello World!",
    //            time: new Date()
    //        });
    //    })//end click
    //});//end ready



</script>

<script>
    //var MYNamespace = MYNamespace || {};
    //MYNamespace.MyFirstClass = function (val) {
    //    this.value = val;
    //    this.getValue = function(){
    //        return this.value;
    //    };
    //}
    //var myFirstInstance = new MYNamespace.MyFirstClass(46);
    //alert(myFirstInstance.getValue());

    var NewAdCategoryControl = NewAdCategoryControl || {};
    var maximumCategoryLayer = 4;
    var allCategories = new Array();
    var categoryObject;

    $(document).ready(function () {
        categoryObject = new NewAdCategoryControl.CategoryClass();
        categoryObject.fillAllCategories();
    });//end ready

    NewAdCategoryControl.CategoryClass = function () {

        //TODO load allCategories array on page load rather than ajax call 
        this.fillAllCategories = function () {
            var form_data = new FormData();       // Creating object of FormData class
            form_data.append("method", "fillAllCategories");         // Adding extra parameters to form_data
            $.ajax({//C# Method call
                type: 'POST',
                processData: false, // important
                contentType: false, // important
                data: form_data,
                async: true,
                url: "<%= Page.ResolveClientUrl(categoryHandlerAddress) %>",
                success: function (msg) {
                    var jsonMessage = JSON.parse(msg);
                    if (jsonMessage.status === "true") {
                        allCategories = jsonMessage.allCategories;
                        categoryObject.createNthLevelCategorySelector(null, 1);//event is null, first layer is not event driven
                    }//end if
                    else {
                        categoryObject.reportMessageToUser(jsonMessage.message);
                    }//end else
                }, //end success
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    //that.reportMessageToUser(textStatus + "  ," + errorThrown);
                    categoryObject.reportMessageToUser("error in retriving category data. please refresh the page");
                }//end error
            });//end $.ajax
        };//end fillAllCategories

        this.createNthLevelCategorySelector = function (event, n) {
            var parentCategoryId;
            var numberOfChildren = 0;
            var currentN = n ? n : event.data.n;

            //remove old items
            for (var i = currentN; i <= maximumCategoryLayer; i++) {
                $("#" + i + "thLevelCategory").remove();
            }//end for
            $selectVariable = $("<select id='" + currentN + "thLevelCategory'><option>Choose Category</option></select>");
            if (currentN <= maximumCategoryLayer) {
                $selectVariable.on("change", { n: currentN + 1 }, categoryObject.createNthLevelCategorySelector);
            }//end if
            parentCategoryId = (currentN === 1) ? 0 : $(event.target).val();
            for (var i = 0; i < allCategories.length; i++) {
                if (allCategories[i].parentCategoryId == parentCategoryId) {
                    numberOfChildren++;
                    //categoryId: allCategories[i].CategoryId
                    //parentCategoryId: allCategories[i].ParentCategoryId
                    //categoryName:allCategories[i].CategoryName
                    //englishCategoryName:allCategories[i].EnglishCategoryName  
                    $newCategory = $("<option value='" +
                        allCategories[i].categoryId + "'" + ">" + allCategories[i].categoryName + "</option>");
                    $selectVariable.append($newCategory);
                }//end if
            }//end for
            if (numberOfChildren >= 1) {
                $divCategory = $("#<%=LabelUploadResult.ClientID%>");
                $divCategory.append($selectVariable);
            }//end if
            else if (!isNaN(parseInt(parentCategoryId))) {
                categoryObject.createAttributeElementsBasedOnSelectedCategoryId(parentCategoryId);
            }
        }//end createNthLevelCategorySelector        

        this.createAttributeElementsBasedOnSelectedCategoryId = function (categoryId) {

            $.event.trigger({
                type: "categoryChanged",
                message: "Hello World!",
                categoryId:categoryId,
                time: new Date()
            });
            
            

        };//end createAttributeElementsBasedOnSelectedCategoryId

        this.reportMessageToUser = function (message) {
            $newMessage = $("<span style=\"color:red\">" + message + "</span><br />");
            $newMessage.hide();
            //$("#<%=LabelUploadResult.ClientID%>").children().remove();
            $("#<%=LabelUploadResult.ClientID%>").append($newMessage);
            $newMessage.show().delay(200000).hide(1000);
        };//end reportMessageToUser
    }

</script>


<div class="row">
    <div id="categorySelect" runat="server">
    </div>
    <div id="LabelUploadResult" runat="server"></div>
</div>
<div class="row">
    <div id="attributeHolder" runat="server"></div>
</div>



