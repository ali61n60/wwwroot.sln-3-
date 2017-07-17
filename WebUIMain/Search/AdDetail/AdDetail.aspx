<%@ Page Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeBehind="AdDetail.aspx.cs" Inherits="WebUIMain.Search.AdDetail.AdDetail" %>

<%@ Register Src="~/UserControls/AdDetail/AdDetailCommonControl.ascx" TagPrefix="uc1" TagName="AdDetailCommonControl" %>



<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
    <link href="../../style/css/lightslider.css" rel="stylesheet" />

      <script src="../../StyleScript/jquery-1.11.3.js"></script>
      <script src="../../bootstrap-3.3.5-dist/js/bootstrap.min.js"></script>
      <script src="../../StyleScript/lightslider.js"></script>
   
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <div class="row">
        <div class="col-sm-12">
            <asp:PlaceHolder ID="PlaceHolder1" runat="server"></asp:PlaceHolder>
            <uc1:AdDetailCommonControl runat="server" ID="AdDetailCommonControl" />
        </div>
       
    </div>
</asp:Content>

