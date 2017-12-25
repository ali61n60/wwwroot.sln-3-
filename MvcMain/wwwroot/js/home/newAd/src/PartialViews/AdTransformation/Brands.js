//TODO link models to brand changes Get data from hidden field
var selectBrandId = "brands";
var selectModelId = "models";
$(document).ready(()=> {
    $("#" + selectBrandId).change((event)=>
        {
            alert("brand changed value=" +
                $(event.currentTarget).val() +
                ", text=" +
                $(event.currentTarget).find("option:selected").text());
    });//change

    var timer = setInterval(() => {
        var date = new Date();
        console.log(date.getHours()+":"+date.getMinutes()+":"+date.getSeconds());
    },1000);
});