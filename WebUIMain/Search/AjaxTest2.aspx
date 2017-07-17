<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage.Master" AutoEventWireup="true" CodeBehind="AjaxTest2.aspx.cs" Inherits="WebUIMain.Search.AjaxTest2" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <script src="../StyleScript/jquery-1.11.3.js"></script>
    <script type="text/javascript">

        function createNewTable(element) {
            var html = "";
            for (i = 0 ; i < element.length; i += 1) {
                html += " <div class=\"col-sm-4\">";
                html += "<a href=\"";
                html += element[i].href;

                html += "\">";//<a>

                html += "<div class=\"row myLinks\" style=\"margin-left: 1px\">";
                html += "<div class=\"col-xs-6\">";
                html += "<div>";
                html += "<br/>";
                html += "<img  src=\"" + element[i].image + "\"" + " class=\"img-rounded img-responsive\" style=\"height:140px;width:140px;\"   />";
                html += "<br/>";
                html += "</div>";
                html += "</div>";
                html += "<div class=\"col-xs-6  text-right \">";
                html += "<div class=\"row\">";
                html += "<div class=\"col-xs-12 text-center\">";
                html += "<span style=\"display:inline-block;font-size:X-Large;width:100%;\">";
                html += element[i].title;
                html += "</span>";
                html += "</div>";
                html += "<div class=\"col-xs-12 text-right\">";
                html += "<span>   وضعیت آگهی </span>";
                html += "<span class=\"glyphicon glyphicon-arrow-left\"></span>";
                html += " <span>";
                html += element[i].adStatus;
                html+="</span>";
                html += "</div>";
                html += "</div>";
                html += "<div class=\"row\">";
                html += "<div class=\"col-xs-12\">";
                html += "<br/>";
                html += "<br/>";
                html += "<span>";
                html+=element[i].category;
                html+="</span>";
                html += "</div>";
                html += "</div>";
                html += "<div class=\"row\">";
                html += "<div class=\"col-xs-12\">";
                html += "<br/>";
                html += "<br/>";
                html += "<span>";
                html+=element[i].date;
                html+="</span>";
                html += "</div>";
                html += "</div>";
                html += "<div class=\"row\">";
                html += "<div class=\"col-xs-12\">";
                html += "<br/>";
                html += "<br/>";
                html += "<span>";
                html += element[i].price;
                html+="</span>";
                html += "</div>";
                html += "</div>";
                html += "</div>";
                html += "</div>";
                html += "<br/>";
                html += "</a>";//</a>
                html += "</div>";
            }            
            return html;
        }

        $(document).ready(function () {

            $('#<%=Button1.ClientID%>').click(function () {
                $("#<%=div1.ClientID%>").html($("#<%=div1.ClientID%>").html() + "start ");
                ///   $.ajax({
                //     url: "<%= Page.ResolveClientUrl("~/Search/demo_test.txt") %>",
                //   dataType:"json",
                // async:true,
                //success: function (result) {                        
                //  $("#div1").html($("#div1").html() + result.firstName);
                //},
                //error: function (xhr) {                        
                //  $("#div1").html($("#div1").html() + "An error occured: " + xhr.status + " " + xhr.statusText);
                //}                    
                //});               
                $.ajax({//C# Method call
                    type: 'POST',
                    async: true,
                    url: "<%= Page.ResolveClientUrl("~/Search/WebService1.asmx/GetDate") %>",
                    data: '{ }',
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',

                    success: function (msg) {
                        var myObject = JSON.parse(msg.d);
                        $("#<%=div1.ClientID%>").html($("#<%=div1.ClientID%>").html() + createNewTable(myObject));
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        $("#<%=div1.ClientID%>").html($("#<%=div1.ClientID%>").html() + textStatus + "  ," + errorThrown);
                    }
                });//$.ajax C# call

                $("#<%=div1.ClientID%>").html($("#<%=div1.ClientID%>").html() + " end ");

                return false;
            });//$Button1


            $('#<%=Button2.ClientID%>').click(function () {
                $("#<%=div2.ClientID%>").html($("#<%=div2.ClientID%>").html() + "hello there");
                return false;
            });//$Button2

            $('#<%=Button3.ClientID%>').click(function () {
                
                $.ajax({//C# Method call
                    type: 'POST',
                    async: true,
                    url: "<%= Page.ResolveClientUrl("~/Search/AjaxTest2.aspx/HelloWorld22") %>",
                    data: '{ }',
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    

                    success: function (msg) {
                        $("#<%=div2.ClientID%>").html($("#<%=div2.ClientID%>").html() + msg.d);
                        
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        $("#<%=div1.ClientID%>").html($("#<%=div1.ClientID%>").html() + textStatus + "  ," + errorThrown);
                    }
                });//$.ajax C# call

                $("#<%=div1.ClientID%>").html($("#<%=div1.ClientID%>").html() + " end ");


                return false;
            });//$Button3
        });//$document       

    </script>


</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <asp:Button ID="Button1" runat="server" Text="Button1" />
    <br />
    <div id="div1" runat="server" style="background-color:#333333">
        &nbsp;
    </div>
    <br />
    <br />
    <div id="div2" runat="server" style="background-color:#cccccc">
        &nbsp;
    </div>    
    <asp:Button ID="Button2" runat="server" Text="Button2" />
    <br />
    <br />
    <asp:Button ID="Button3" runat="server" Text="Button3" />

    <asp:Panel ID="Panel1" runat="server" BackColor="#999966"></asp:Panel>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="ContentAsideLeft" runat="server">
</asp:Content>
