<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="AdDetailCommonControl.ascx.cs" Inherits="WebUIMain.UserControls.AdDetail.AdDetailCommonControl" %>

<script src="../../StyleScript/lightslider.js"></script>

<script type="text/javascript">
    $(document).ready(function () {
        $('#<%=imageGallery.ClientID%>').lightSlider({
            auto: true,
            pause: 5000,
            pager: true,

            gallery: true,
            item: 1,
            loop: true,
            thumbItem: 6,
           
            slideMargin: 0,
            enableDrag: true,
            currentPagerPosition: 'left',
            onSliderLoad: function (el) {
               el.lightGallery({
                   selector: '#<%=imageGallery.ClientID%> .lslide'
                });
            }
        });
    });
</script>
<style>
   
    .lSPager li.active{
         border: 5px blue double;
     }
</style>
<div class="row">
    <div class="col-sm-1">
    </div>
    <div class="col-sm-5 imageSection">
        <ul id="imageGallery" runat="server">
            <%--<li class=".lslide" data-thumb="../../AdvertisementImages/1e0bd8ee-f961-4376-a409-8c477fbc6bfe/0.jpeg">
                    <img src="../../AdvertisementImages/1e0bd8ee-f961-4376-a409-8c477fbc6bfe/1.jpeg" />
                </li>
                <li data-thumb="../../AdvertisementImages/1e0bd8ee-f961-4376-a409-8c477fbc6bfe/2.jpeg">
                    <img src="../../AdvertisementImages/1e0bd8ee-f961-4376-a409-8c477fbc6bfe/3.jpeg" />
                </li>--%>
        </ul>
    </div>

    <div class="col-sm-6 dataSection">
        <div class="row">
            <div class="col-xs-12 text-center">
                <asp:Label ID="LabelAdTitle" runat="server" Text="" Font-Size="XX-Large" ForeColor="#660033"></asp:Label>
            </div>
        </div>
        <div class="row">
            <div class="col-xs-8 text-right">
                <asp:Label ID="LabelPhoneNumber" runat="server" Text=""></asp:Label>
            </div>
            <div class="col-xs-4">
                <asp:Label ID="Label11" runat="server" Text="شماره تماس"></asp:Label>
            </div>
            <div class="col-xs-8 text-right">
                <asp:Label ID="LabelEmail" runat="server" Text=""></asp:Label>
            </div>
            <div class="col-xs-4">
                <asp:Label ID="Label13" runat="server" Text="ایمیل"></asp:Label>
            </div>
            <div class="col-xs-8 text-right">
                <asp:Label ID="LabelPrice" runat="server" Text=""></asp:Label>
            </div>
            <div class="col-xs-4">
                <asp:Label ID="Label1" runat="server" Text="قیمت"></asp:Label>
            </div>

            <div class="col-xs-8 text-right">
                <asp:Label ID="LabelPriceType" runat="server" Text=""></asp:Label>
            </div>
            <div class="col-xs-4">
                <asp:Label ID="Label4" runat="server" Text="نوع قیمت"></asp:Label>
            </div>


        </div>
        <div class="row">
            <div class="col-xs-8 text-right">
                <asp:Label ID="LabelTime" runat="server" Text=""></asp:Label>
            </div>
            <div class="col-xs-4">
                <asp:Label ID="Label2" runat="server" Text="زمان"></asp:Label>
            </div>
        </div>
        <div class="row">
            <asp:PlaceHolder ID="PlaceHolderAdCustomControl" runat="server"></asp:PlaceHolder>
        </div>
    </div>
</div>
<br />
<br />
<div class="row">
    <div class="well">
        <div class="row text-right">
            <asp:Label ID="Label9" runat="server" Text="توضیحات"></asp:Label>
        </div>
        <div class="well">
            <div class="row text-right">
                <asp:Label ID="LabelComments" runat="server" Text=""></asp:Label>
            </div>
        </div>

    </div>
</div>
