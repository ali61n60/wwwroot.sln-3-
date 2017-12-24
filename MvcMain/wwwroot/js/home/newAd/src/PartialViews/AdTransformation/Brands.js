var selectBrandId = "brands";
var selectModelId = "models";
$(document).ready(function () {
    $("#" + selectBrandId).on("change", function (event) {
        alert("brand changed value=" +
            $(event.currentTarget).val() +
            ", text=" +
            $(event.currentTarget).text());
    });
});
//# sourceMappingURL=Brands.js.map