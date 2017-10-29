$(document).ready(function () {
    $("#getPartialViewFromServer").on("click",
        function (event) {
            event.preventDefault();
            getPartialViewFromServer();
        }); //click
});//ready

//CORE
function getPartialViewFromServer() {
    
    var $userInput = {};
    $userInput.StartIndex = 2;
   
    $.ajax({
        type: "GET", //GET or POST or PUT or DELETE verb
        url: "/Home/GetNewAdPartialView",
        //data: JSON.stringify($userInput), //Data sent to server
        //contentType: 'application/json', // content type sent to server
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