<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="CommonSearchCriteriaControl.ascx.cs"
     Inherits="WebUIMain.UserControls.SearchCritetria.CommonSearchCriteriaControl" %>


<script src="../../StyleScript/jquery-1.11.3.js"></script>
<script src="../../Samples/MicrosoftAjaxLibrary/MicrosoftAjax.js"></script>
<script>
    //raise searchCriteriaChanged event

    var SearchCriteriaControl = SearchCriteriaControl || {};

    SearchCriteriaControl.SearchClass = function () {

    };


    SearchCriteriaControl.SearchClass.prototype.getSearchOptionDictionary = function () {
        var $myDictionary = [];

        var $categoryId = $("#<%=TextBoxCategoryId.ClientID%>").val();
        var $categoryIdPair = { "Key": "CategoryId", "Value": $categoryId };
        $myDictionary.push($categoryIdPair);

        var $orderBy = $("#<%=DropDownListOrderBy.ClientID%>").val();
        var $orderByPair = { "Key": "OrderBy", "Value": $orderBy };
        $myDictionary.push($orderByPair);

        var $minimumPrice = $("#<%=TextBoxMinimumPrice.ClientID%>").val();
         var $minimumPricePair = { "Key": "MinimumPrice", "Value": $minimumPrice };
         $myDictionary.push($minimumPricePair);

         var $maximumPrice = $("#<%=TextBoxMaximumPrice.ClientID%>").val();
         var $maximumPricePair = { "Key": "MaximumPrice", "Value": $maximumPrice };
         $myDictionary.push($maximumPricePair);
        //call getCategoryBasedSearchOption in searchTransportation
         if ($categoryId === "100") {
             var categoryRelatedOption = transportationObject.getCategoryBasedSearchOption();
             for (var i = 0; i < categoryRelatedOption.length; i++) {
                 //todo make the call as calling a method of an object
                 $myDictionary.push(categoryRelatedOption[i]);
             }

         }

         return $myDictionary;
    };//end getSearchOptionDictionary

     function onSearchCriteriaChanged(event) {
         $.event.trigger({
             type: "searchCriteriaChanged",
             message: "Hello World!",
             time: new Date(),
             target: event.target
         });

     }



     function BindControlEvents() {
         $("#<%=TextBoxCategoryId.ClientID%>").on("change", onSearchCriteriaChanged);
         $("#<%=TextBoxMaximumPrice.ClientID%>").on("change", onSearchCriteriaChanged);
         $("#<%=TextBoxMinimumPrice.ClientID%>").on("change", onSearchCriteriaChanged);
         $("#<%=DropDownListOrderBy.ClientID%>").on("change", onSearchCriteriaChanged);
         $("#<%=CheckBoxOnlyWithPictures.ClientID%>").on("change", onSearchCriteriaChanged);
     }//end BindControlEvents

     //Initial bind
     $(document).ready(function () {
         BindControlEvents();
     });//end ready

     //Re-bind for callbacks
     var prm = Sys.WebForms.PageRequestManager.getInstance();

     prm.add_endRequest(function () {
         BindControlEvents();
     });



</script>

<div class="row">
    <div class="col-sm-4">
        <asp:Label ID="Label1" runat="server" Text="CategoryId"></asp:Label>
        <asp:TextBox ID="TextBoxCategoryId" runat="server"></asp:TextBox>
    </div>
    <div class="col-sm-4 ">
        <asp:Label ID="LabelMaximumPrice" runat="server" Text="حداکثر قیمت"></asp:Label>
        <asp:TextBox ID="TextBoxMaximumPrice" runat="server"></asp:TextBox>
    </div>

    <div class="col-sm-4">
        <asp:Label ID="LabelMinimumPrice" runat="server" Text="حداقل قیمت"></asp:Label>
        <asp:TextBox ID="TextBoxMinimumPrice" runat="server"></asp:TextBox>
    </div>
</div>
<br />
<div class="row">
    <div class="col-sm-1">
        <asp:Label ID="LabelOrderBy" runat="server" Text="به ترتیب"></asp:Label>
    </div>
    <div class="col-sm-3">
        <asp:DropDownList ID="DropDownListOrderBy" runat="server" CssClass="form-control">
            <asp:ListItem Value="DateAsc">تاریخ صعودی</asp:ListItem>
            <asp:ListItem Value="DateDesc">تاریخ نزولی</asp:ListItem>
            <asp:ListItem Value="PriceAsc" Selected="True">قیمت صعودی</asp:ListItem>
            <asp:ListItem Value="PriceDesc">قیمت نزولی</asp:ListItem>
        </asp:DropDownList>
    </div>
    <div class="col-sm-4 ">
        <asp:Label ID="LabelOnlyWithPictures" runat="server" Text="فقط عکس دار"></asp:Label>
        <asp:CheckBox ID="CheckBoxOnlyWithPictures" runat="server" />
    </div>

    <div class="col-sm-4">
    </div>
    <div class="col-sm-4 ">
    </div>
</div>
<br />

