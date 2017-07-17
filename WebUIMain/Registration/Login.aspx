<%@ Page Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeBehind="Login.aspx.cs" Inherits="WebUIMain.Registration.Login" %>



<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
    <script>
        $(document).ready(function () {
            $("#HyperLinkManager").css("background-color", "#336699");
            // alert('ali');
        });

    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <br />
    <%-- header--%>
    <div class="well">
        <div class="text-right">
            <asp:Label ID="LabelPageHeader" runat="server" Text="ورود" Font-Size="XX-Large"></asp:Label>
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
                <asp:TextBox ID="TextBoxEmail" CssClass="form-control" runat="server" placeholder="ایمیل"  Width="100%" ></asp:TextBox>
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
            <br />
        </div>
        <br />
        <div class="row">   
                 <div class="col-sm-2">
                <asp:CheckBox ID="CheckBoxRememberMe" runat="server" Text="مرا به خاطر داشته باش" />
            </div>   
            <div class="col-sm-10">
                <asp:Button ID="ButtonLogin" CssClass="btn btn-primary btn-lg btn-block" runat="server" Text="ورود" OnClick="ButtonLogin_Click" />
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
                <asp:Button ID="ButtonCreateNewUserPage" CssClass="btn btn-success btn-block" runat="server" Text="ایجاد کاربر جدید" OnClick="ButtonCreateNewUserPage_Click" />
            </div>
        </div>
    </div>
</asp:Content>

