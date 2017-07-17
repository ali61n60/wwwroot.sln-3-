<%@ Page Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeBehind="urlError.aspx.cs" Inherits="WebUIMain.Search.urlError" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <div class="row">
        <div class="col-sm-12 text-center">
            <h1>
                <asp:Label ID="LabelResult" runat="server" Text=""></asp:Label>
            </h1>
        </div>
    </div>
</asp:Content>