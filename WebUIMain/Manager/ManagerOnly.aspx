<%@ Page Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeBehind="ManagerOnly.aspx.cs" Inherits="WebUIMain.Manager.ManagerOnly" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
   
     <script>
         $(document).ready(function () {
             $("#HyperLinkManager").css("background-color", "green");
             // alert('ali');
         });

    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <asp:Label ID="LabelManagerOnly" runat="server" Text="ManagerOnly"></asp:Label>
</asp:Content>