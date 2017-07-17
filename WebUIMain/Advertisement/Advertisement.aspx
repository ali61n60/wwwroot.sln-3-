<%@ Page Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeBehind="Advertisement.aspx.cs" Inherits="WebUIMain.Advertisement.Advertisement" %>


<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
    <style type="text/css">
        .myLinks a {
            background-color:#33ff99;
        }
            .myLinks a:hover {
            background-color:#33cc99;
            }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
     <div class="row">
         <div class="well text-right">
             <asp:Label ID="LabelMessage" CssClass="text-right" runat="server" Font-Bold="True" Font-Size="X-Large" ForeColor="#FF3300"></asp:Label>
         </div>
        <div class="list-group myLinks">
            <br />
            <asp:HyperLink ID="HyperLink3" runat="server" CssClass="list-group-item  text-right" NavigateUrl="~/Advertisement/UserAdvertisements.aspx"> <h4 class="list-group-item-heading"><bdi>مشاهده آگهی های من</bdi></h4><p class="list-group-item-text"><bdi>در این صفحه می توانید تمام آگهی های فعال خود را مشاهده نمایید</bdi></p></asp:HyperLink>
            <br />
            <asp:HyperLink ID="HyperLink2" runat="server" CssClass="list-group-item text-right" NavigateUrl="~/Advertisement/AddNewAdvertisement.aspx"> <h4 class="list-group-item-heading"><span class="glyphicon glyphicon-plus"></span> <bdi>ثبت آگهی جدید</bdi></h4><p class="list-group-item-text"><bdi>در این صفحه می توانید آگهی جدید درج نمایید </bdi></p></asp:HyperLink>
            <br />
            <asp:HyperLink CssClass="list-group-item text-right" NavigateUrl="~/Advertisement/NotifyMe.aspx" ID="HyperLink1" runat="server"> <h4 class="list-group-item-heading"><span class="glyphicon glyphicon-bell"></span> 
                    <span class="glyphicon glyphicon-envelope"></span> <bdi>به من اطلاع بده</bdi></h4><p class="list-group-item-text"><bdi>اطلاع از اکهی های مورد علاقه به صورت ایمیل و پیامک</bdi></p></asp:HyperLink>

             <br />
            <asp:HyperLink CssClass="list-group-item text-right" NavigateUrl="~/Registration/UserInfo.aspx" ID="HyperLink4" runat="server"> <h4 class="list-group-item-heading"><span class="glyphicon glyphicon-user"></span> <bdi>تنظیمات شخصی</bdi></h4><p class="list-group-item-text"><bdi>تایید ایمیل و شماره تلفن و ....و</bdi></p></asp:HyperLink>
            
            <br />

        </div>
         
    </div>

</asp:Content>

