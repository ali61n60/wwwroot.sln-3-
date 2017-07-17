<%@ Page Language="C#" AutoEventWireup="true" MasterPageFile="~/MasterPage.Master" CodeBehind="SetSmsMessages.aspx.cs" Inherits="WebUIMain.Manager.ManageAdvertisements.SetSmsMessages" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">

    <script>
        $(document).ready(function () {
            $("#HyperLinkManager").css("background-color", "green");
            // alert('ali');
        });

    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">

    <div class="row">
        <div class="col-sm-4">
            <asp:TextBox ID="TextBoxMessage" placeholder="message" CssClass="form-control" Width="100%" runat="server"></asp:TextBox>
        </div>
        <div class="col-sm-4">
        </div>
    </div>
    <br />
    <div class="row">
        <div class="col-sm-4">
            <asp:TextBox ID="TextBoxPhoneNumber" placeholder="phoneNumber" CssClass="form-control" Width="100%" runat="server"></asp:TextBox>
        </div>
        <div class="col-sm-4">
        </div>
    </div>
    <br/>
    <div class="row">
        <asp:Button ID="ButtonInsertNewMessage" runat="server" Text="Insert New Message" OnClick="ButtonInsertNewMessage_Click" />
        <br />
        <asp:Label ID="LabelResult" runat="server" Text=""></asp:Label>
    </div>

</asp:Content>
