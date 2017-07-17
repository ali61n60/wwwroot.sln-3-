<%@ Page Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeBehind="UserInfo.aspx.cs" Inherits="WebUIMain.Registration.UserInfo" %>


<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <div class="well">

        <div class="row form-group">
            <div class="col-sm-1">
                <asp:Label ID="LabelEmailText" runat="server" Text="ایمیل"></asp:Label>
            </div>
            <div class="col-sm-3">
                <asp:Label ID="LabelEmail" runat="server" Text=""></asp:Label>
            </div>
            <div class="col-sm-8">
                <div class="row">
                    <div class="col-sm-2">
                        <asp:Label ID="LabelEmailVerifid" runat="server" Text="تایید نشده"></asp:Label>
                    </div>
                    <div class="col-sm-10">
                        <asp:Panel ID="PanelRegisterEmailVerificationCode" runat="server">
                            <div class="row">
                                <div class="col-sm-3">
                                    <asp:Label ID="LabelRegisterEmailVerificationCode" runat="server" Text="ثبت کد تایید ایمیل"></asp:Label>
                                </div>
                                <div class="col-sm-3">
                                    <asp:TextBox ID="TextBoxRegisterEmailVerificationCode"
                                        runat="server" CssClass="form-control" placeholder="00000" Width="100%"></asp:TextBox>
                                </div>
                                <div class="col-sm-2">
                                    <asp:Button ID="ButtonRegisterEmailVerificationCode" runat="server" Text="ارسال" />
                                </div>
                                <div class="col-sm-2">
                                    <asp:Button ID="ButtonEmailMeVerificationCode" runat="server" Text="کد را به ایمیل من بفرست" />
                                </div>
                            </div>
                        </asp:Panel>
                    </div>
                </div>
            </div>

            <br />
        </div>

        <div class="row form-group">
            <div class="col-sm-1">
                <asp:Label ID="LabelPhoneNumberText" runat="server" Text="شماره تماس"></asp:Label>
            </div>
            <div class="col-sm-3">
                <asp:Label ID="LabelPhoneNumber" runat="server" Text=""></asp:Label>
            </div>
            <div class="col-sm-8">
                <div class="row">
                    <div class="col-sm-2">
                        <asp:Label ID="LabelPhoneNumberVerified" runat="server" Text="تایید نشده"></asp:Label>
                    </div>
                    <div class="col-sm-10">
                        <asp:Panel ID="PanelRegisterPhoneNumberVerificationCode" runat="server">
                            <div class="row">
                                <div class="col-sm-3">
                                    <asp:Label ID="LabelRegisterPhoneNumberVerificationCode" runat="server" Text="ثبت کد تایید شماره تلفن"></asp:Label>
                                </div>
                                <div class="col-sm-3">
                                    <asp:TextBox ID="TextBoxPhoneNumberVerificationCode"
                                        runat="server" CssClass="form-control" placeholder="00000" Width="100%"></asp:TextBox>
                                </div>
                                <div class="col-sm-2">
                                    <asp:Button ID="ButtonPhoneNumberVerificationCode" runat="server" Text="ثبت" />
                                </div>
                                <div class="col-sm-2">
                                    <asp:Button ID="ButtonSMSMeVerificationCode" runat="server" Text="کد را به من اس ام اس کن" />
                                </div>
                            </div>
                        </asp:Panel>
                    </div>
                </div>
            </div>

            <br />
        </div>

    </div>

</asp:Content>

