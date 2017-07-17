<%@ Page Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeBehind="AddNewAdvertisement.aspx.cs" Inherits="WebUIMain.Advertisement.AddNewAdvertisement" %>

<%@ Register Src="~/UserControls/NewAd/NewAdCommonControl.ascx" TagPrefix="uc1" TagName="AdCommonControl" %>


<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
    <style type="text/css">
        .myRightToLeft {
            float: right;
        }
    </style>
    <script src="<%= Page.ResolveClientUrl("~/StyleScript/jquery-1.11.3.js") %>"></script>
    <script src="~/StyleScript/jquery-1.11.3.js"></script>
    <script>
        $(document).ready(function () {
            //focus on upload Image item
            $("#<%=AdCommonControl.currentImageWebUserControl.Controls[1].ClientID%>").focus(); 
        });//end ready
    </script>

</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <asp:ScriptManager ID="ScriptManager1" runat="server"></asp:ScriptManager>
    <uc1:AdCommonControl runat="server" ID="AdCommonControl" />        
</asp:Content>
