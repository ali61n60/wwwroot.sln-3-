<%@ Page Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeBehind="VerifyAdvertisements.aspx.cs" Inherits="WebUIMain.Manager.ManageAdvertisements.VerifyAdvertisements" %>

<%@ Register Src="~/UserControls/VerifyAd/VerifyAdControl.ascx" TagPrefix="uc1" TagName="VerifyAdControl" %>





<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">

    <script>
        $(document).ready(function () {
            $("#HyperLinkManager").css("background-color", "green");
            // alert('ali');
        });

    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <asp:ScriptManager ID="ScriptManager1" runat="server"></asp:ScriptManager>
    <asp:UpdatePanel ID="UpdatePanel1" runat="server">
        <ContentTemplate>
    <div class="row">
        <div class="col-sm-3">
            <asp:CheckBox ID="CheckBoxSubmitted1" runat="server" Text="1-Submitted" Checked="True" />
        </div>

        <div class="col-sm-3">
            <asp:CheckBox ID="CheckBoxUnderReview2" runat="server" Text="2-UnderReview" />
        </div>

        <div class="col-sm-3">
            <asp:CheckBox ID="CheckBoxApproved3" runat="server" Text="3-Approved" />
        </div>

        <div class="col-sm-3">
            <asp:CheckBox ID="CheckBoxRejected4" runat="server" Text="4-Rejected" />
        </div>
        <div class="col-sm-3">
            <asp:CheckBox ID="CheckBoxExpired5" runat="server" Text="5-Expired" />
        </div>
        <div class="col-sm-3">
            <asp:CheckBox ID="CheckBoxReSubmitted6" runat="server" Text="6-ReSubmitted" />
        </div>
        <div class="col-sm-3">
            <asp:CheckBox ID="CheckBoxDeleted7" runat="server" Text="7-Deleted" />

        </div>
    </div>
     
    <div class="row">
        <asp:Button ID="ButtonSearch" CssClass="btn btn-block btn-primary" runat="server" Text="Search" OnClick="ButtonSearch_Click"  />
    </div>
    <div class="row">
        <asp:Label ID="LabelMessage" runat="server" Text=""></asp:Label>
    </div>


    <div class="row">
        <div class="col-sm-2"></div>
        <div class="col-sm-2"></div>
    </div>
   
            <div class="row">
                <div id="place1" class="col-sm-12">
                    <asp:PlaceHolder ID="PlaceHolderControls" runat="server"></asp:PlaceHolder>
                </div>
            </div>
        </ContentTemplate>
    </asp:UpdatePanel>


</asp:Content>
