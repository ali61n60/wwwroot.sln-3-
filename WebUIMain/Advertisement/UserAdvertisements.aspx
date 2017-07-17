<%@ Page Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeBehind="UserAdvertisements.aspx.cs" Inherits="WebUIMain.Advertisement.UserAdvertisements" %>

<%@ Register src="~/UserControls/SingleUserAdItem.ascx" tagname="Item" tagprefix="uc1" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
     
    <div class="row">
        <br />
        <asp:Label ID="LabelMessage" runat="server" Text=""></asp:Label>
        <div class=" col-sm-12">
             <asp:PlaceHolder ID="PlaceHolder1" runat="server"></asp:PlaceHolder>  
        </div>
    </div>
</asp:Content>