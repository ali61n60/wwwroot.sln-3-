<%@ Page Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeBehind="Search.aspx.cs" Inherits="WebUIMain.Search.Search" %>

<%@ Register Src="../UserControls/SingleAdItem.ascx" TagName="SingleAdItem" TagPrefix="uc1" %>
<%@ Register Src="../UserControls/SearchCritetria/CommonSearchCriteriaControl.ascx" TagName="CommonSearchCriteriaControl" TagPrefix="uc2" %>

<%@ Register Src="~/UserControls/CategoryControl/CategorySelector.ascx" TagPrefix="uc1" TagName="CategorySelector" %>
<%@ Register Src="~/UserControls/SearchCritetria/SearchCriteriaAdTransportationControl.ascx" TagPrefix="uc1" TagName="SearchCriteriaAdTransportationControl" %>
<%@ Register Src="~/UserControls/SearchCritetria/CommonSearchCriteriaControl.ascx" TagPrefix="uc1" TagName="CommonSearchCriteriaControl" %>


<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">

    <style type="text/css">
        .myLinks {
            background-color: #CCCCCC;
        }

            .myLinks:hover {
                background-color: #999;
            }

        .adContainer {
            display: table;
            text-align: center;
        }

        .ajaxServerCall {
            visibility: hidden;
        }
    </style>
    <script src="../StyleScript/jquery-1.11.3.js"></script>
    <script src="../StyleScript/mustache.js"></script>
    
    
   

    <script id="singleAdItem" type="text/template">
        <div class="blockDisplay adDetail">
            <a href="./AdDetail/AdDetail.aspx?adId={{AdvertisementId}}&categoryId={{AdvertisementCategoryId}}">
                <div>
                    <%-- image section --%>
                    <div class="imageSection">
                        <img class="image" src="{{adImage}}" />
                        <span class="price">{{adPrice}} تومان</span>
                        <span class="moreInfo">برای دیدن جزییات کلیک کنید</span>
                    </div>
                    <%-- other info section --%>
                    <div class="otherInfo">
                        <div class="col-xs-12 text-center">
                            <span style="overflow: hidden;">{{AdvertisementTitle}}</span>
                        </div>
                        <div class="col-xs-12 text-right">
                            <span>وضعیت آگهی</span>
                            <span class="glyphicon glyphicon-arrow-left"></span>
                            <span>{{AdvertisementStatus}}</span>
                        </div>

                        <div class="col-xs-12 text-right">
                            <span>{{AdvertisementCategory}}</span>
                        </div>

                        <div class="col-xs-12 text-right">
                            <span>{{adDate}}</span>
                        </div>
                    </div>
                </div>
                <br />
            </a>
        </div>
    </script>


    <script>
        $(document).ready(function () {

            //show detail of singleAdItem when mouse over
            $(document).on('mouseenter mouseleave', '.blockDisplay', function () {
                $(this).find('.moreInfo').fadeToggle(250);
            });//end on

        });//end ready
    </script>

    <script type="text/javascript">
        
        var $initialStart = 1;
        var $start = 1;
        var $count = 5;
        var $requestIndex = 0;
        var $previousRequestIndex = -1;
        var $isServerCalled = false;
        var $numberOfStartServerCallNotification = 0;
        var searchCriteriaObject;
        $(document).ready(function () {

            searchCriteriaObject = new SearchCriteriaControl.SearchClass();

            $(document).on("searchCriteriaChanged", function() {
                
                $requestIndex++;
                $start = $initialStart;
                $("#<%=AdPlaceHolder.ClientID%>").children().remove();
                getAdItemsFromServer();//refresh search
            });//end on searchCriteriaChanged

        });//end ready


        //CORE
        function getAdItemsFromServer() {
            if ($isServerCalled && ($previousRequestIndex===$requestIndex)) {
                return;
            } else {
                $previousRequestIndex = $requestIndex;
                $isServerCalled = true;
            }
            var $ajaxData = {};

            $ajaxData.startIndex = $start;
            $ajaxData.count = $count;

            var $myDictionary = searchCriteriaObject.getSearchOptionDictionary();
            
            $myDictionary.push({ "Key": "RequestIndex", "Value": $requestIndex });
            $ajaxData.userInput = $myDictionary;

            //var ajaxString = JSON.stringify($ajaxData);
            notifyUserAjaxCallStarted();
           
            
            $.ajax({
                type: "POST", //GET or POST or PUT or DELETE verb
                url: "<%= Page.ResolveClientUrl("~/Services/AdvertisementCommonService.svc/GetAdvertisementCommon") %>", // Location of the service
                data: JSON.stringify($ajaxData), //Data sent to server
                contentType: 'application/json; charset=utf-8', // content type sent to server
                dataType: 'json', //Expected data format from server
                processdata: true, //True or False
                success: function (msg) {//On Successfull service call
                    OnSuccessGetTimeFromServer(msg.GetAdvertisementCommonResult);
                },
                error: OnErrorGetTimeFromServer// When Service call fails
            });//end .ajax
        }

        function OnSuccessGetTimeFromServer(msg) {
            $isServerCalled = false;
            notifyUserAjaxCallFinished();
            if (msg.Success === true) {
                if (msg.CustomDictionary[1].Value == $requestIndex) {
                    $start += parseInt(msg.CustomDictionary[0].Value);
                    var template = $('#singleAdItem').html();
                    var data;
                    for (var i = 0; i < msg.ResponseData.length; i++) {
                        var adImage = null;
                        if (msg.ResponseData[i].AdvertisementImages[0] != null) {
                            adImage = "data:image/jpg;base64," + msg.ResponseData[i].AdvertisementImages[0];
                        } //end if
                        data = {
                            AdvertisementId: msg.ResponseData[i].AdvertisementId,
                            AdvertisementCategoryId: msg.ResponseData[i].AdvertisementCategoryId,
                            AdvertisementCategory: msg.ResponseData[i].AdvertisementCategory,
                            adImage: adImage,
                            adPrice: msg.ResponseData[i].AdvertisementPrice.price, //todo check the price type
                            AdvertisementTitle: msg.ResponseData[i].AdvertisementTitle,
                            AdvertisementStatus: msg.ResponseData[i].AdvertisementStatus
                            //adDate: msg.ResponseData[i].AdTime
                        } //end data

                        var html = Mustache.to_html(template, data);
                        $("#<%=AdPlaceHolder.ClientID%>").append(html);
                    } //end for
                }//end if
            }//end if
            else {
                showErrorMessage(msg.Message + " , " + msg.ErrorCode);
            }
        }//end OnSuccessGetTimeFromServer

        function OnErrorGetTimeFromServer(XMLHttpRequest, textStatus, errorThrown) {
            $isServerCalled = false;
            notifyUserAjaxCallFinished();
            showErrorMessage(textStatus + " , " + errorThrown);
        }//end OnErrorGetTimeFromServer

        $(document).ready(function () {
            $("#<%=ButtonSearch.ClientID%>").on("click", function (event) {
                event.preventDefault();
                getAdItemsFromServer();
            });//end click

            $(window).scroll(function () {
                if ($(window).scrollTop() === $(document).height() - $(window).height()) {

                    getAdItemsFromServer();
                }
            });
           

        });//end ready

        function showErrorMessage(message) {
            $("#<%=LabelErrorMessage.ClientID%>").text(message);
        }

        function notifyUserAjaxCallStarted() {
            $numberOfStartServerCallNotification++;
            $(".ajaxServerCall").css("visibility", "visible");
        }//end notifyUserAjaxCallStarted

        function notifyUserAjaxCallFinished() {
            $numberOfStartServerCallNotification--;
            if ($numberOfStartServerCallNotification === 0) {
                $(".ajaxServerCall").css("visibility", "hidden");
            }//end if
        }//end notifyUserAjaxCallFinished


    </script>

</asp:Content>
<asp:Content ContentPlaceHolderID="ContentAsideLeft" runat="server">
    <asp:UpdatePanel ID="UpdatePanelCategory" runat="server" UpdateMode="Conditional">
        <ContentTemplate>
            <div class="col-sm-1"></div>
            <div class="col-sm-10">
                <div class="row">
                    <uc1:CategorySelector runat="server" ID="CategorySelector" OnSelectedCategoryChanged="CategorySelector_OnSelectedCategoryChanged" />
                </div>
            </div>
            <div class="col-sm-1"></div>
            <br />
            <br />
            <br />
        </ContentTemplate>
    </asp:UpdatePanel>

</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <asp:ScriptManager ID="ScriptManager1" runat="server">
        <Services>
        </Services>
    </asp:ScriptManager>

    <asp:UpdatePanel runat="server">
        <ContentTemplate>
            <div class="row">
                <div class="col-sm-1"></div>
                <div class="col-sm-10">
                     <uc1:CommonSearchCriteriaControl runat="server" ID="searchCriteriaControl" />
                    <asp:PlaceHolder ID="PlaceHolderSearchCriteria" runat="server">
                    </asp:PlaceHolder>
                </div>
                <div class="col-sm-1"></div>
            </div>
            <br/>
            <br/>
        </ContentTemplate>
    </asp:UpdatePanel>
    <div class="row">
        <div class="col-sm-12">
            <div class="well">
                <br />
                <asp:Button ID="ButtonSearch" CssClass="btn btn-success btn-block btn-lg" runat="server" Text="جستجو" />
                <br />
                <p>this is a test 1395-07-18</p>
                
                <br />
                <div class="row">
                    <div class="col-sm-4">
                        <asp:Label ID="LabelErrorMessage" runat="server" Text=""></asp:Label>
                    </div>
                    <div class="col-sm-4"></div>
                    <div class="col-sm-4"></div>
                </div>
            </div>
        </div>
    </div>
    <asp:UpdatePanel ID="UpdatePanelMain" runat="server" UpdateMode="Always">
        <ContentTemplate>


            <br />
            <div class="row">
                <div class="ajaxServerCall">
                    <asp:Label ID="Label2" runat="server" Text="دریافت اطلاعات"></asp:Label>
                    <asp:Image ID="Image1" runat="server" ImageUrl="~/General/loader.gif" Width="70px" Height="70px" />
                </div>
            </div>

            <div id="place1" class="row adContainer" style="background-color: #555;">
                <div>
                    <div id="AdPlaceHolder" runat="server">
                    </div>
                    <asp:PlaceHolder ID="PlaceHolderControls" runat="server"></asp:PlaceHolder>
                </div>
            </div>

            <div class="row">

                <div class="ajaxServerCall">
                    <asp:Label ID="Label1" runat="server" Text="دریافت اطلاعات"></asp:Label>
                    <asp:Image ID="ImageUpdateProgress" runat="server" ImageUrl="~/General/loader.gif" Width="70px" Height="70px" />
                </div>
            </div>
        </ContentTemplate>
    </asp:UpdatePanel>

</asp:Content>

