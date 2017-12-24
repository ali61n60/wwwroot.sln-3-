let selectBrandId = "brands";
let selectModelId = "models";
$(document).ready(function() {
    $("#" + selectBrandId).on("change",
        function(event) {
            alert("brand changed value=" +
                $(event.currentTarget).val() +
                ", text=" +
                $(event.currentTarget).text());
        });
});