<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="SingleUserAdItem.ascx.cs" Inherits="WebUIMain.UserControls.SingleUserAdItem" %>


<style type="text/css">
    #container {
        height: 150px;
        width: 150px;
        position: relative;
    }

    #image {
        position: absolute;
        left: 0;
        top: 0;
    }

    #text {
        z-index: 100;
        position: absolute;
        color: white;
        font-size: 14px;
        font-weight: bold;
        left: 40px;
        top: 100px;
    }
</style>
<style type="text/css">
    .myLinks {
        background-color: #CCCCCC;
    }

        .myLinks:hover {
            background-color: #999999;
        }

    .myRightToLeft {
        float: right;
    }
</style>

<div class="row myLinks">
    <div class="col-xs-1"></div>
    <div class="col-xs-5">
        <div>
            <br />
            <asp:Image ID="Image1" class="img-rounded img-responsive" Height="150px" Width="150px" runat="server" />
            <br />
        </div>
    </div>
    <div class="col-xs-1"></div>
    <div class="col-xs-5  myRightToLeft ">
        <div class="row">
            <div class="col-xs-12">
                <asp:Label ID="LabelAdTitle" runat="server" Font-Size="X-Large"></asp:Label>
            </div>
        </div>
        <div class="row">
            <div class="col-xs-12">
                <br />
                <div class="myRightToLeft">
                    <asp:Button ID="ButtonDelete" class="btn btn-lg btn-danger" runat="server" Text="حذف" 
                        OnClientClick="return confirm('آگهی حذف شود؟')"  OnClick="ButtonDelete_Click" />
                    
                </div>
                <div class="myRightToLeft">
                    <asp:Button ID="ButtonExtension" class="btn btn-lg  btn-info" runat="server" Text="تمدید" 
                        OnClientClick="return confirm('آگهی تمدید شود؟')" OnClick="ButtonExtension_Click"  />
                    &nbsp;&nbsp;&nbsp;
                </div>
                <div class="myRightToLeft">
                    <asp:Button ID="ButtonViewDetail" class="btn btn-lg btn-primary" runat="server" Text="مشاهده جزییات" OnClick="ButtonViewDetail_Click" />
                    &nbsp;&nbsp;&nbsp;
                </div>
                 <div class="myRightToLeft">
                     <asp:Button ID="ButtonEditAd" class="btn btn-lg btn-primary" runat="server" Text="ویرایش" OnClick="ButtonEditAd_Click"  />
                    &nbsp;&nbsp;&nbsp;
                 </div>

            </div>
        </div>
        <div class="row ">
            <div class="col-xs-12">
                <asp:Label CssClass="pull-right" ID="Label1" runat="server" Text=" ایمیل"></asp:Label>
                &nbsp;                
                <asp:Label CssClass="pull-right" ID="LabelEmail" runat="server" Text=""></asp:Label>
            </div>
        </div>
        <div class="row">
            <div class="col-xs-12">
                <asp:Label ID="Label2" CssClass="pull-right" runat="server" Text="زمان آگهی  "></asp:Label>
                &nbsp;&nbsp;&nbsp;
                <asp:Label ID="LabelAdTime" CssClass="pull-right"  runat="server" Text="نا مشخص"></asp:Label>
            </div>
            <div class="col-xs-12">
                <asp:Label ID="Label3" CssClass="pull-right" runat="server" Text=" وضعیت آگهی"></asp:Label>
                &nbsp;&nbsp;&nbsp;
                <asp:Label ID="LabelAdStatus" CssClass="pull-right"  runat="server" Text="نا مشخص"></asp:Label>
            </div>
             <div class="col-xs-12">
                <br />
                 <br />
                <asp:Label ID="LabelCategory" CssClass="pull-right"  runat="server" Text=""></asp:Label>
            </div>
        </div>
        <div class="col-xs-1"></div>
    </div>
</div>
<br />
