var Category = (function () {
    function Category() {
    }
    return Category;
}());
var CategorySelection = (function () {
    function CategorySelection(parentDivId, allCategories) {
        this._firstLevelSelectId = "category1";
        this._secondLevelSelectId = "category2";
        this._thirdLevelSelectId = "category3";
        this._rootCategoryId = 0;
        this._parentDivId = parentDivId;
        this._allCategories = allCategories;
        console.log(this._allCategories);
    }
    CategorySelection.prototype.GetSelectedCategoryId = function () {
        var $category0 = $(this._parentDivId + " #" + this._firstLevelSelectId);
        var categoryId = parseInt($category0.val().toString());
        if (categoryId === NaN)
            categoryId = this._rootCategoryId;
        return categoryId;
    };
    CategorySelection.prototype.CreateFirstLevel = function () {
        var self = this;
        this._allCategories.forEach(function (category) {
            if (category.parentCategoryId === self._rootCategoryId) {
                $("#" + self._firstLevelSelectId).append($("<option>", {
                    value: category.categoryId,
                    text: category.categoryName
                }));
            } //if
        }); //forEach
        $("#" + this._firstLevelSelectId).change(function () {
            $("#" + self._secondLevelSelectId).remove();
            var $selectedId = parseInt($(this).val().toString());
            var $select = $("<select id=\"" + self._secondLevelSelectId + "\" class=\"form-control\"></select>")
                .append("<option value='0'>تمام آگهی ها</option>");
            self._allCategories.forEach(function (category) {
                if (category.parentCategoryId === $selectedId) {
                    $select.append($("<option>", {
                        value: category.categoryId,
                        text: category.categoryName
                    }));
                }
            }); //forEach
            $("#categorySelector").append($select);
            //TODO show second select  and populate it with data from server
        }); //change
    };
    CategorySelection.prototype.CreateSecondLevel = function (firstLevelCategoryId) {
    };
    return CategorySelection;
}());
//Category Selection
$(document).ready(function () {
    //Add first level categories
    var allCategoriesString = $("#allCategories").val().toString();
    var allCategories = $.parseJSON(allCategoriesString);
    var categorySelection = new CategorySelection("", allCategories);
    categorySelection.CreateFirstLevel();
}); //ready
//# sourceMappingURL=CategorySelection.js.map