<%@ Page Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="WebUIMain.Default" %>


<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
    <script>
        $(document).ready(function () {
            $("#HyperLinkDefault").css("background-color", "green");
            //alert('ali');
        });

    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <asp:Label ID="Label1" runat="server" Text="صفحه اصلی"></asp:Label>
&nbsp;<asp:Button ID="Button1" runat="server" OnClick="Button1_Click" Text="Button" />
&nbsp;
    <asp:Label ID="Label2" runat="server" Text="Label"></asp:Label><span class="test"></span>
    <br />
     <div class="alert alert-info">
    <strong>Info!</strong> This alert box could indicate a neutral informative change or action.
  </div>
    <p>test</p>
     <p>test</p>
</asp:Content>

