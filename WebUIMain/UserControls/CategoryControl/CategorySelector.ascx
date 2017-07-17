<%@ Control AutoEventWireup="true" CodeBehind="CategorySelector.ascx.cs" Inherits="WebUIMain.UserControls.CategoryControl.CategorySelector" Language="C#" %>
<div>
    <div class="row">
        <div class="col-sm-1"></div>
        <div class="col-sm-10"> <asp:Label ID="LabelMessage" runat="server" Text=""></asp:Label></div>
        <div class="col-sm-1"></div>
    </div>   
    <asp:PlaceHolder ID="PlaceHolderCategories" runat="server"></asp:PlaceHolder>
</div>
