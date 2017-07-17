<%@ Page Language="C#" MasterPageFile="~/MasterPage.Master" AutoEventWireup="true" CodeBehind="ForgottenPassword.aspx.cs" Inherits="WebUIMain.Registration.ForgottenPassword" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <br />
    <%-- header--%>
    <div class="well">
        <div class="text-right">
            <asp:Label ID="LabelPageHeader" runat="server" Text="فراموشی کلمه عبور" Font-Size="XX-Large"></asp:Label>
            <br />
            <asp:Label ID="LabelMessage" runat="server" Text="" Font-Size="XX-Large" ForeColor="#CC3300"></asp:Label>
        </div>
    </div>

    <div class="well">
        <div class="row form-group">
            <div class="col-sm-2">
                <asp:Label ID="LabelEmail" runat="server" Text="ایمیل"></asp:Label>
            </div>
            <div class="col-sm-10">
                <asp:TextBox ID="TextBoxEmail" CssClass="form-control" runat="server" placeholder="ایمیل" Width="100%"></asp:TextBox>
            </div>
        </div>
    <br />
    <div class="row">
        <div class="col-sm-2">
        </div>
        <div class="col-sm-10">
            <asp:Button ID="ButtonForgetPassword" CssClass="btn btn-primary btn-lg btn-block" runat="server" Text="ارسال کلمه عبور به ایمیل" OnClick="ButtonForgetPassword_Click" />
        </div>
    </div>
    <br />
    <div class="row">
        <div class="col-sm-2"></div>
        <div class="col-sm-4">
            <asp:Button ID="ButtonLogin" CssClass="btn btn-warning btn-block" runat="server" Text="ورود" OnClick="ButtonLogin_Click" />
        </div>
        <div class="col-sm-2"></div>
        <div class="col-sm-4">
            <asp:Button ID="ButtonCreateNewUserPage" CssClass="btn btn-success btn-block" runat="server" Text="ایجاد کاربر جدید" OnClick="ButtonCreateNewUserPage_Click" />
        </div>
    </div>
    </div>
</asp:Content>


