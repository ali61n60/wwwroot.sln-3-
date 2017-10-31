$(document).ready(function () {
    $("#getPartialViewFromServer").on("click",function (event) {
            event.preventDefault();
            getPartialViewFromServer();
        }); //click

    $("#submitNewAd").on("click", function(event) {
        var $apiAddress = getApiAddress();
        alert($apiAddress);
    });
});//ready

//CORE
function getPartialViewFromServer() {
    $.ajax({
        type: "GET", //GET or POST or PUT or DELETE verb
        url: "/Home/GetNewAdPartialView",
        success: OnSuccessGetItemsFromServer,//On Successfull service call
        error: OnErrorGetItemsFromServer// When Service call fails
    });//.ajax
}

function OnSuccessGetItemsFromServer(data) {
    
    $("#NewAdPlaceHolder").html(data);
    //  $("#adPlaceHolder").append(html);
}//end OnSuccessGetTimeFromServer

function OnErrorGetItemsFromServer(data) {
    alert(data);
}//end OnErrorGetTimeFromServer