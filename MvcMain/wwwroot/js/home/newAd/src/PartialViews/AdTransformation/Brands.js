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
        });
});