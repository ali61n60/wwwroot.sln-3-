/// <reference path="../../node_modules/@types/jquery/index.d.ts" />

class Category {
    public categoryId: number;
    public parentCategoryId: number;
    public categoryName: string;
    public englishCategoryName: string;
}
export class CategorySelection {
    //TODO what if a level has no item at all
    //TODO what if on level selected id is 0
    private _parentDivId: string;
    private _allCategories: Category[];
    private readonly _firstLevelSelectId: string = "category1";
    private readonly _secondLevelSelectId: string = "category2";
    private readonly _thirdLevelSelectId: string = "category3";
    private readonly _rootCategoryId: number = 0;
    
    private static _selectedCategoryIdLevelOne: number;
    private static _selectedCategoryIdLevelTwo: number;
    private static  _selectedCategoryIdLevelThree:number;

    constructor(parentDivId: string, allCategories: Category[]) {
        this._parentDivId = parentDivId;
        this._allCategories = allCategories;
    }

    public GetSelectedCategoryId(): number {
        if (CategorySelection._selectedCategoryIdLevelThree !== this._rootCategoryId)
            return CategorySelection._selectedCategoryIdLevelThree;
        else if (CategorySelection._selectedCategoryIdLevelTwo !== this._rootCategoryId)
            return CategorySelection._selectedCategoryIdLevelTwo;
        else
            return CategorySelection._selectedCategoryIdLevelOne; 
        
        
    }//GetSelectedCategoryId

    public CreateFirstLevel(): void {
        var self = this;
        CategorySelection._selectedCategoryIdLevelOne = this._rootCategoryId;
        this._allCategories.forEach(category => {
            if (category.parentCategoryId === self._rootCategoryId) {
                $("#" + self._firstLevelSelectId).append($("<option>", {
                    value: category.categoryId,
                    text: category.categoryName
                }));
            }//if
        });//forEach

        $("#" + this._firstLevelSelectId).change(function () {
            let selectedId = parseInt($(this).val().toString());
            CategorySelection._selectedCategoryIdLevelOne = selectedId;
            self.CreateSecondLevel(selectedId);
        });//change

    }//CreateFirstLevel

    private CreateSecondLevel(firstLevelCategoryId: number): void {
        var self = this;
        CategorySelection._selectedCategoryIdLevelTwo = this._rootCategoryId;
        $("#" + this._secondLevelSelectId).remove();
        $("#" + this._thirdLevelSelectId).remove();
        if (firstLevelCategoryId === this._rootCategoryId) {
            return;
        }
        var $select = $(`<select id="${this._secondLevelSelectId}" class="form-control"></select>`)
            .append(`<option value="${this._rootCategoryId}">تمام آگهی ها</option>`);
        this._allCategories.forEach(category => {
            if (category.parentCategoryId === firstLevelCategoryId) {
                $select.append($("<option>", {
                    value: category.categoryId,
                    text: category.categoryName
                }));
            }
        });//forEach
        $("#" + this._parentDivId).append($select);

        $("#" + this._secondLevelSelectId).change(function () {
            let selectedId = parseInt($(this).val().toString());
            CategorySelection._selectedCategoryIdLevelTwo = selectedId;
            self.CreateThirdLevel(selectedId);
        });//change
    }

    CreateThirdLevel(secondLevelCategoryId: number):void {
        var self = this;
        CategorySelection._selectedCategoryIdLevelThree = this._rootCategoryId;
        $("#" + this._thirdLevelSelectId).remove();
        if (secondLevelCategoryId === this._rootCategoryId) {
            return;
        }
        var $select = $(`<select id="${this._thirdLevelSelectId}" class="form-control"></select>`)
            .append(`<option value="${this._rootCategoryId}">تمام آگهی ها</option>`);
        this._allCategories.forEach(category => {
            if (category.parentCategoryId === secondLevelCategoryId) {
                $select.append($("<option>", {
                    value: category.categoryId,
                    text: category.categoryName
                }));
            }
        });//forEach
        $("#" + this._parentDivId).append($select);

        $("#" + this._thirdLevelSelectId).change(function () {
            let selectedId = parseInt($(this).val().toString());
            CategorySelection._selectedCategoryIdLevelThree = selectedId;
        });//change
    }
}

//Category Selection
$(document).ready(function () {   
    //Add first level categories
    var allCategoriesString = $("#allCategories").val().toString();
    var allCategories = $.parseJSON(allCategoriesString) as Category[];
    let categorySelection = new CategorySelection("categorySelector", allCategories);
    categorySelection.CreateFirstLevel();
});//ready