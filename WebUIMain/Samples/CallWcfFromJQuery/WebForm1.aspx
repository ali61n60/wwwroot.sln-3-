<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="WebForm1.aspx.cs" Inherits="WebUIMain.Samples.CallWcfFromJQuery.WebForm1" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <script src="../../StyleScript/jquery-1.11.3.js"></script>
    <script>
        $(document).ready(function() {
            $("#<%=ButtonTime.ClientID%>").click(function (event) {
                event.preventDefault();
                var userName = $("#<%=TextBoxName.ClientID%>").val();
                getTimeFromServer(userName);
            });//end click
        });//end ready

        function getTimeFromServer(userName) {
            $.ajax({
                type: "POST", //GET or POST or PUT or DELETE verb
                url: "<%= Page.ResolveClientUrl("~/Services/AdvertisementCommonService.svc/WhatTimeIsIt") %>", // Location of the service
                data: '{"queryName":'+'"'+userName+'"}', //Data sent to server
                contentType: 'application/json; charset=utf-8', // content type sent to server
                dataType: 'json', //Expected data format from server
                processdata: true, //True or False
                success: function (msg) {//On Successfull service call
                    OnSuccessGetTimeFromServer(msg);
                },
                error: OnErrorGetTimeFromServer// When Service call fails
            });//end .ajax
        }

        function OnSuccessGetTimeFromServer(message) {
            var $messageHolder = $("#<%=Label1.ClientID%>");
            $messageHolder.text($messageHolder.text() + message.WhatTimeIsItResult+"  ");
        }

        function OnErrorGetTimeFromServer(XMLHttpRequest, textStatus, errorThrown) {
            var $messageHolder = $("#<%=Label1.ClientID%>");
            $messageHolder.text($messageHolder.text() + textStatus + " , " + errorThrown);
        }

    </script>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <asp:Label ID="LabelName" runat="server" Text="Enter Your Name Here:"></asp:Label>
        <br/>
        <br /><asp:TextBox ID="TextBoxName" runat="server"></asp:TextBox>
        <asp:Button ID="ButtonTime" runat="server" Text="Get Time" />
        <asp:Label ID="Label1" runat="server"></asp:Label>
    </div>
    </form>
</body>
</html>
