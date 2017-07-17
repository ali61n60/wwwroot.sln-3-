<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="NewAdCommonControl.ascx.cs" Inherits="WebUIMain.UserControls.NewAd.NewAdCommonUserControl" %>
<%@ Register Src="~/UserControls/NewAd/ImageWebUserControl/ImageWebUserControl.ascx" TagPrefix="uc1" TagName="ImageWebUserControl" %>
<%@ Register Src="~/UserControls/NewAd/CategoryControl/NewAdCategorySelector.ascx" TagPrefix="uc1" TagName="NewAdCategorySelector" %>




<script>
    $(document).ready(function () {

        //getting references of page elements
        var $aspButtonSelectedCategoryChanged = $("#<%=ButtonSelectedCategoryChanged.ClientID%>");
        var $aspHiddenSelectedCategoryChanged = $("#<%=HiddenFieldSelectedCategoryChanged.ClientID%>");

        //create a CategoryClass object
        var categoryObject = new NewAdCategoryControl.NewAdCategoryClass();
        //TODO load allCategories array on page load rather than ajax call
        categoryObject.fillAllCategories();
        
        
        //CORE
        //listen to categoryDataLoaded event raised by NewAdCategorySelector
        $(document).on("categoryDataLoaded", function(event) {
            //get selectedCategoryId and check to see it is a Numner
            var selectedCategoryId = parseInt($aspHiddenSelectedCategoryChanged.val());
            selectedCategoryId = isNaN(selectedCategoryId) ? 0 : selectedCategoryId;
            categoryObject.createCategorySelectors(selectedCategoryId);
            // createCategorySelectors($aspHiddenSelectedCategoryChanged.val());//call createCategorySelectors

        });//end on

        //CORE
        //listen to categoryChanged event raised by NewAdCategorySelector
        $(document).on("categoryChanged", function(event) {
            $aspHiddenSelectedCategoryChanged.val(event.categoryId); //grab categoryId from event object
            $aspButtonSelectedCategoryChanged.click(); //call click event, partially postback page
        }); //end on

    });//end ready

</script>

<div class="row">
    <div class="col-sm-12">
        <uc1:NewAdCategorySelector runat="server" ID="NewAdCategorySelector" />
        <div runat="server" hidden="hidden">
            <asp:Button ID="ButtonSelectedCategoryChanged" runat="server" Text="Button" OnClick="ButtonSelectedCategoryChanged_Click" />
            <asp:HiddenField ID="HiddenFieldSelectedCategoryChanged" Value="0" runat="server" />
        </div>
    </div>
</div>
<div class="row">
    <div class="col-sm-12 text-right">
        <asp:Label ID="LabelErrorMessage" runat="server" EnableViewState="False" Font-Size="XX-Large" ForeColor="Red"></asp:Label>
    </div>
</div>


<asp:Label ID="Label5" runat="server" Text="Label"></asp:Label>
<br />

<asp:UpdatePanel ID="UpdatePanelSelectedCategoryChanged" runat="server">
    <Triggers>
        <asp:AsyncPostBackTrigger ControlID="ButtonSelectedCategoryChanged" EventName="Click" />
    </Triggers>
    <ContentTemplate>
        <asp:Label ID="Label2" runat="server" Text="Label"></asp:Label>
        <br />
        <asp:Label ID="Label3" runat="server" Text="Label"></asp:Label>
        <br />
        <div class="row">
            <div class="col-sm-12 text-right">
                <asp:Label ID="Label4" runat="server" Text="عنوان" Font-Size="X-Large"></asp:Label>
            </div>
            <div class="col-sm-12 ">
                <asp:TextBox ID="TextBoxTitle" CssClass="text-right" runat="server" placeholder="عنوان آگهی را وارد کنید" Font-Size="X-Large" Width="100%"></asp:TextBox>
            </div>
        </div>
        <div class="row">
            <br />
            <br />
            <asp:PlaceHolder ID="PlaceHolderCustomAttribute" runat="server"></asp:PlaceHolder>
        </div>
    </ContentTemplate>
</asp:UpdatePanel>



<div class="row">
    <div class="col-sm-12 text-right">
        <asp:Label ID="Label1" runat="server" Text="توضیحات" Font-Size="Large"></asp:Label>
    </div>
</div>
<div class="row">
    <div class="col-sm-12 text-right">
        <asp:TextBox ID="TextBoxComments" CssClass="form-control text-right" runat="server" placeholder="توضیحات" TextMode="MultiLine" Rows="5" Width="100%" Font-Size="Larger"></asp:TextBox>
    </div>
</div>
<uc1:ImageWebUserControl runat="server" ID="ImageWebUserControl1" />
<br />

<div class="row">
    <div class="col-sm-12">
        <asp:Label ID="Label7" runat="server" Text="AdPrivilageId" Font-Size="Large"></asp:Label>
        <asp:TextBox ID="TextBoxAdPrivilageId" CssClass="text-right" runat="server" placeholder="1" Font-Size="X-Large"></asp:TextBox>
    </div>
    <div class="col-sm-12">
        <asp:Button ID="ButtonSubmitAd" CssClass="btn btn-success btn-lg btn-block" runat="server" Text="ارسال آگهی" OnClick="ButtonSubmitAd_Click" />
    </div>
    <div class="col-sm-12">
        <br />
        <br />
        <asp:Label ID="LabelSendResult" runat="server" Text=""></asp:Label>
    </div>
</div>
