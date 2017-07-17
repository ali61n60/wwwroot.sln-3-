<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage.Master" AutoEventWireup="true" CodeBehind="EditAdvertisement.aspx.cs" Inherits="WebUIMain.Advertisement.EditAdvertisement" %>

<%@ Register Src="~/UserControls/NewAd/NewAdCommonControl.ascx" TagPrefix="uc1" TagName="NewAdCommonControl" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <asp:ScriptManager ID="ScriptManager1" runat="server"></asp:ScriptManager>
    <asp:Label ID="LabelAdTitle" runat="server"></asp:Label>
    <uc1:NewAdCommonControl runat="server" ID="NewAdCommonControl" />
    <asp:PlaceHolder ID="PlaceHolderAdDetail" runat="server"></asp:PlaceHolder>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="ContentAsideLeft" runat="server">
</asp:Content>
