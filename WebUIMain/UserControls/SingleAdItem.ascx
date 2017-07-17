<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="SingleAdItem.ascx.cs" Inherits="WebUIMain.UserControls.SingleAdItem" %>


<div class="blockDisplay adDetail">
    <asp:HyperLink ID="adDetail" runat="server">
        <div>
            <%-- image section --%>
            <div class="imageSection">
                <asp:Image ID="Image1" CssClass="image" runat="server" />
                <asp:Label CssClass="price" ID="LabelPrice" runat="server" Text=""></asp:Label>
                <asp:Label CssClass="moreInfo" ID="LabelMoreInfo" runat="server" Text="برای دیدن جزییات کلیک کنید"></asp:Label>
            </div>

            <%-- other info section --%>
            <div class="otherInfo">                
                <div class="col-xs-12 text-center">
                    <asp:Label ID="LabelAdTitle" runat="server" Style="overflow: hidden;"></asp:Label>
                </div>
                
                <div class="col-xs-12 text-right">
                    <asp:Label ID="Label3" runat="server" Text="   وضعیت آگهی "></asp:Label>
                    <span class="glyphicon glyphicon-arrow-left"></span>
                    <asp:Label ID="LabelAdStatus" runat="server" Text="  نا مشخص  "></asp:Label>
                </div>
                
                <div class="col-xs-12 text-right">
                    <asp:Label ID="LabelCategory" runat="server" Text=""></asp:Label>
                </div>
                
                <div class="col-xs-12 text-right">
                    <asp:Label ID="LabelDate" runat="server" Text=""></asp:Label>
                </div>
            </div>
        </div>
        <br />
    </asp:HyperLink>
</div>
