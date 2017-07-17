<%@ Page Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeBehind="CreateNewUser.aspx.cs" Inherits="WebUIMain.Registration.CreateNewUser" %>


<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    
    <%-- header--%>
    <div class="well">
        <div class="text-right">
            <asp:Label ID="LabelPageHeader" runat="server" Text="ایجاد کاربر جدید" Font-Size="XX-Large"></asp:Label>
            <br />
            <asp:Label ID="LabelMessage" runat="server" Font-Size="XX-Large" ForeColor="#CC3300" EnableViewState="False"></asp:Label>
        </div>
    </div>

    <div class="well">
        <div class="row form-group">
            <div class="col-sm-2">
                <asp:Label ID="LabelEmail" runat="server" Text="ایمیل"></asp:Label>
            </div>
            <div class="col-sm-10">
                <asp:TextBox ID="TextBoxEmail" CssClass="form-control" runat="server" placeholder="ایمیل"  Width="100%"></asp:TextBox>
            </div>
        </div>
        <br />
        <div class="row">
             <div class="col-sm-2">
                <asp:Label ID="LabelPassword" runat="server" Text="رمز ورود"></asp:Label>
            </div>
            <div class="col-sm-10">
                <asp:TextBox ID="TextBoxPassword" CssClass="form-control" runat="server" placeholder="رمز ورود" TextMode="Password"  Width="100%"></asp:TextBox>
            </div>
        </div>
        <br />
        <div class="row">
            <div class="col-sm-2">
                <asp:Label ID="Label1" runat="server" Text="تکرار رمز ورود"></asp:Label>
            </div>
            <div class="col-sm-10">
                <asp:TextBox ID="TextBoxPasswordRepeat" CssClass="form-control" runat="server" placeholder="تکرار رمز عبور" TextMode="Password"  Width="100%"></asp:TextBox>
            </div>
        </div>
        <br />
        <div class="row">
            <div class="col-sm-2">
                <asp:Label ID="LabelMobilePhoneNumber" runat="server" Text="تلفن همراه"></asp:Label>
            </div>
            <div class="col-sm-10">
                <asp:TextBox ID="TextBoxMobilePhoneNumber" CssClass="form-control" runat="server" placeholder="شماره تلفن همراه 09121234567"  Width="100%"></asp:TextBox>
            </div>
        </div>
        <br />
        <div class="row">
            <div class="col-sm-2">
            </div>
            <div class="col-sm-10">
                <asp:Button ID="ButtonCreateNewUser" CssClass="btn btn-primary btn-lg btn-block" runat="server" Text="ایجاد کاربر جدید" OnClick="ButtonCreateNewUser_Click" />
            </div>
        </div>
        <br />
        <div class="row">
            <div class="col-sm-2"></div>
            <div class="col-sm-4">
                <asp:Button ID="ButtonForgottenPassword" CssClass="btn btn-warning btn-block" runat="server" Text="رمز خود را فراموش کرده ام" OnClick="ButtonForgottenPassword_Click" />
            </div>
            <div class="col-sm-2"></div>
            <div class="col-sm-4">
                <asp:Button ID="ButtonLogin" CssClass="btn btn-success btn-block" runat="server" Text="ورود" OnClick="ButtonCreateNewUserPage_Click" />
            </div>
        </div>
    </div>
</asp:Content>

