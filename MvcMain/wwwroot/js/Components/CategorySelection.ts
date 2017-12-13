import {EventDispatcher} from "../Events/EventDispatcher";
import {Category} from "../Models/Category";



export class CategorySelection {
    //TODO what if a level has no item at all
    //TODO what if on level selected id is 0
    private _parentDivId: string;//div element that holds all CategorySelection elements
    private _allCategories: Category[];
    private readonly _firstLevelSelectId: string = "category1";
    private readonly _secondLevelSelectId: string = "category2";
    private readonly _thirdLevelSelectId: string = "category3";
    private readonly _rootCategoryId: number = 0;
    
    private _selectedCategoryIdLevelOne: number;
    private _selectedCategoryIdLevelTwo: number;
    private _selectedCategoryIdLevelThree:number;

    public SelectedCategoryChanged: EventDispatcher<CategorySelection, number> = new EventDispatcher<CategorySelection, number>();

    constructor(parentDivId: string, allCategories: Category[]) {
        this._parentDivId = parentDivId;
        this._allCategories = allCategories;
    }

    public GetSelectedCategoryId(): number {
        if (this._selectedCategoryIdLevelThree !== this._rootCategoryId)
            return this._selectedCategoryIdLevelThree;
        else if (this._selectedCategoryIdLevelTwo !== this._rootCategoryId)
            return this._selectedCategoryIdLevelTwo;
        else
            return this._selectedCategoryIdLevelOne; 
        
        
    }//GetSelectedCategoryId

    public CreateFirstLevel(): void {
        
        this._selectedCategoryIdLevelOne = this._rootCategoryId;
        this._allCategories.forEach(category => {
            if (category.parentCategoryId === this._rootCategoryId) {
                $("#" + this._firstLevelSelectId).append($("<option>", {
                    value: category.categoryId,
                    text: category.categoryName
                }));
            }//if
        });//forEach

        $("#" + this._firstLevelSelectId).change((event)=> {
            let selectedId = parseInt($(event.currentTarget).val().toString());
            this._selectedCategoryIdLevelOne = selectedId;
            this.createSecondLevel(selectedId);
            this.SelectedCategoryChanged.dispatch(this, this.GetSelectedCategoryId());
        });//change

    }//CreateFirstLevel

    private createSecondLevel(firstLevelCategoryId: number): void {
        
        this._selectedCategoryIdLevelTwo = this._rootCategoryId;
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

        $("#" + this._secondLevelSelectId).change((event)=> {
            let selectedId = parseInt($(event.currentTarget).val().toString());
            this._selectedCategoryIdLevelTwo = selectedId;
            this.CreateThirdLevel(selectedId);
            this.SelectedCategoryChanged.dispatch(this, this.GetSelectedCategoryId());
        });//change
    }

    CreateThirdLevel(secondLevelCategoryId: number):void {
        this._selectedCategoryIdLevelThree = this._rootCategoryId;
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

        $("#" + this._thirdLevelSelectId).change((event)=> {
            let selectedId = parseInt($(event.currentTarget).val().toString());
            this._selectedCategoryIdLevelThree = selectedId;
            this.SelectedCategoryChanged.dispatch(this, this.GetSelectedCategoryId());
        });//change
    }
}

