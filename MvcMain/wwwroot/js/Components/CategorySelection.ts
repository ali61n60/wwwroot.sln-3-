class Category {
    public categoryId: number;
    public parentCategoryId:number;
    public categoryName :string;
    public englishCategoryName: string ;
}
class CategorySelection {
    private _parentDivId: string;
    private _allCategories: Category[];

    private readonly _firstLevelSelectId: string = "category1";
    private readonly _secondLevelSelectId: string = "category2";
    private readonly _thirdLevelSelectId: string = "category3";
    private readonly _rootCategoryId:number=0;

    constructor(parentDivId: string, allCategories:Category[]) {
        this._parentDivId = parentDivId;
        this._allCategories = allCategories;
        console.log(this._allCategories);
    }

    public GetSelectedCategoryId(): number {
        var $category0 = $(this._parentDivId + " #"+this._firstLevelSelectId);
        let categoryId = parseInt($category0.val().toString());
        if (categoryId === NaN)
            categoryId = this._rootCategoryId;
        return categoryId;
    }

    public CreateFirstLevel(): void {
        var self = this;
        this._allCategories.forEach(category => {
            if (category.parentCategoryId === self._rootCategoryId) {
                $("#" + self._firstLevelSelectId).append($("<option>", {
                    value: category.categoryId,
                    text: category.categoryName
                }));
            }//if
        });//forEach
        
        $("#"+this._firstLevelSelectId).change(function () {
            $("#" + self._secondLevelSelectId).remove();
            let $selectedId = parseInt($(this).val().toString());

            var $select = $(`<select id="${self._secondLevelSelectId}" class="form-control"></select>`)
                .append("<option value='0'>تمام آگهی ها</option>");
            self._allCategories.forEach(category => {
                if (category.parentCategoryId === $selectedId) {
                    $select.append($("<option>", {
                        value: category.categoryId,
                        text: category.categoryName
                    }));
                }
            });//forEach
            $("#categorySelector").append($select);
            //TODO show second select  and populate it with data from server
        });//change
    }

    public CreateSecondLevel(firstLevelCategoryId: number):void {
        
    }


}

//Category Selection
$(document).ready(function () {
    //Add first level categories
    var allCategoriesString = $("#allCategories").val().toString();
    var allCategories = $.parseJSON(allCategoriesString) as Category[];
    let categorySelection = new CategorySelection("", allCategories);
    categorySelection.CreateFirstLevel();
});//ready