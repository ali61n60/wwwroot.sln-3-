<%@ Page Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeBehind="AbousUs.aspx.cs" Inherits="WebUIMain.General.AbousUs" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
    <script>
        $(document).ready(function () {
            $("#HyperLinkAboutUs").css("background-color", "green");
            //alert('ali');
        });

    </script>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <p><bdi>درباره ما</bdi></p>
</asp:Content>

