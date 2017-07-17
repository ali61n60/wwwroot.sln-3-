var SearchCriteriaAdTransportationControl = SearchCriteriaAdTransportationControl || {};

SearchCriteriaAdTransportationControl.TransportationClass = function () {
    this.allModels = new Array();
};//end NewAdCategoryControl.NewAdCategoryClass

SearchCriteriaAdTransportationControl.TransportationClass.prototype.BindControlEvents=function () {
    $(document).on("change", "#brandSelect",transportationObject.onSelectedBrandChanged);
    $(document).on("change", "#modelSelect",transportationObject.onSelectedModelChanged);
}//BindControlEvents

SearchCriteriaAdTransportationControl.TransportationClass.prototype.notifyUserAjaxCallStarted = function () {

}//end notifyUserAjaxCallStarted

SearchCriteriaAdTransportationControl.TransportationClass.prototype.notifyUserAjaxCallFinished = function () {

}//end notifyUserAjaxCallFinished

SearchCriteriaAdTransportationControl.TransportationClass.prototype.showErrorMessage = function (message) {
    alert(message);
}//end showErrorMessage

SearchCriteriaAdTransportationControl.TransportationClass.prototype.fillAllModels = function () {
    "use strict";

    transportationObject.notifyUserAjaxCallStarted();

    var $ajaxData = {};
    $.ajax({
        type: "POST", //GET or POST or PUT or DELETE verb
        url: "/Services/AdvertisementTransportationService.svc/GetAllVehicles", // Location of the service
        data: JSON.stringify($ajaxData), //Data sent to server
        contentType: 'application/json; charset=utf-8', // content type sent to server
        dataType: 'json', //Expected data format from server
        processdata: true, //True or False
        success: function (msg) {//On Successfull service call
            OnSuccessFillAllModels(msg.GetAllVehiclesResult);
        },
        error: OnErrorFillAllModels// When Service call fails
    });//end .ajax
}//end fillAllModels

SearchCriteriaAdTransportationControl.TransportationClass.prototype.onSelectedBrandChanged=function (event) {
    var $brandSelect = $("#brandSelect");
    var selectedValue = $brandSelect.val();
    createModelSelect(selectedValue);

    $.event.trigger({
        type: "searchCriteriaChanged",
        message: "Hello World!",
        time: new Date(),
        target: event.target
    });
}//end onSelectedBrandChanged

SearchCriteriaAdTransportationControl.TransportationClass.prototype.onSelectedModelChanged=function (event) {
    $.event.trigger({
        type: "searchCriteriaChanged",
        message: "Hello World!",
        time: new Date(),
        target: event.target
    });
}//end onSelectedModelChanged


function OnSuccessFillAllModels(msg) {
    transportationObject.notifyUserAjaxCallFinished();
    if (msg.Success === true) {
        for (var i = 0; i < msg.ResponseData.length; i++) {
            transportationObject.allModels[i] = {
                ModelId: msg.ResponseData[i].ModelId,
                ModelName: msg.ResponseData[i].ModelName,
                BrandId: msg.ResponseData[i].BrandId,
                BrandName: msg.ResponseData[i].BrandName
            }
        }//end for
        transportationObject.createBrandSelect();
    }//end if
    else {
        showErrorMessage(msg.Message + " , " + msg.ErrorCode);
    }
}//end OnSuccessFillAllModels

function OnErrorFillAllModels(XMLHttpRequest, textStatus, errorThrown) {
    transportationObject.notifyUserAjaxCallFinished();
    showErrorMessage(textStatus + " , " + errorThrown);
}//end OnErrorFillAllModels

SearchCriteriaAdTransportationControl.TransportationClass.prototype.createBrandSelect=function () {

    var template = $('#brandTemplate').html();
    var allBrands = new Array();
    var j = 1;
    for (var i = 0; i < transportationObject.allModels.length; i++) {
        if (transportationObject.allModels[i].BrandId == j) {
            allBrands.push({ BrandId: transportationObject.allModels[i].BrandId, BrandName: transportationObject.allModels[i].BrandName });
            j++;
        }
    }
    var data = { AllBrands: allBrands }; //end data

    var html = Mustache.to_html(template, data);
    $(".BrandSelect").children().remove();
    $(".BrandSelect").append(html);

    template = $("#modelTemplate").html();
    data = {};
    html = Mustache.to_html(template, data);
    $(".ModelSelect").children().remove();
    $(".ModelSelect").append(html);

}//end createBrandAndModelSelect



function createModelSelect(brandId) {
    var allModelsForSelectedBrandId = new Array();
    for (var i = 0; i < transportationObject.allModels.length; i++) {
        if (transportationObject.allModels[i].BrandId == brandId) {
            allModelsForSelectedBrandId.push({
                ModelId: transportationObject.allModels[i].ModelId,
                ModelName: transportationObject.allModels[i].ModelName
            });
        }
    }
    var template = $("#modelTemplate").html();
    var data = { AllModels: allModelsForSelectedBrandId };
    var html = Mustache.to_html(template, data);
    $(".ModelSelect").children().remove();
    $(".ModelSelect").append(html);
}//end createModelSelect

var transportationObject;
$(document).ready(function () {
    createTransportationObject();
});//end ready

function searchCriteriaUserControlLoaded() {
    if (transportationObject == undefined) {
        createTransportationObject();//create transportationObject and fill allModels Array and bind event handlers
    } else {
        transportationObject.createBrandSelect();
    }
    
}//end searchCriteriaUserControlLoaded

///create transportationObject and fill allModels Array and bind event handlers
function createTransportationObject() {
    transportationObject = new SearchCriteriaAdTransportationControl.TransportationClass();
    transportationObject.fillAllModels();
    transportationObject.BindControlEvents();
}//end createTransportationObject

SearchCriteriaAdTransportationControl.TransportationClass.prototype.getCategoryBasedSearchOption=function() {
    var $transportDictionary = [];

    var $brandId = $("#brandSelect").val();
    var $brandIdPair = { "Key": "BrandId", "Value": $brandId };
    $transportDictionary.push($brandIdPair);

    var $brandName = $("#brandSelect option[value='"+$brandId+"']").text();
    var $brandNamePair = { "Key": "BrandName", "Value": $brandName };
    $transportDictionary.push($brandNamePair);

    var $modelId = $("#modelSelect").val();
    var $modelIdPair = { "Key": "ModelId", "Value": $modelId };
    $transportDictionary.push($modelIdPair);

    var $modelName = $("#modelSelect option[value='"+$modelId+"']").text();
    var $modelNamePair = { "Key": "ModelName", "Value": $modelName };
    $transportDictionary.push($modelNamePair);
    
    return $transportDictionary;
}


