import { EventDispatcher } from "../Events/EventDispatcher";
import { Category } from "../Models/Category";



export class CategorySelection {
    //TODO what if a level has no item at all
    //TODO what if on level selected id is 0
    //TODO remove html code from js code
    private _parentDivId: string;//div element that holds all CategorySelection elements
    private _allCategories: Category[];

    private readonly _firstLevelDiv="category1";
    private readonly _firstLevelSelect: string = "select1";
    private readonly _secondLevelDiv = "category2";
    private readonly _secondLevelSelect: string = "select2";
    private readonly _thirdLevelDiv = "category3";
    private readonly _thirdLevelSelect: string = "select3";
    private readonly _rootCategoryId: number = 0;

    private _selectedCategoryIdLevelOne: number;
    private _selectedCategoryIdLevelTwo: number;
    private _selectedCategoryIdLevelThree: number;

    public SelectedCategoryChanged: EventDispatcher<CategorySelection, number> = new EventDispatcher<CategorySelection, number>();

    constructor(parentDivId: string, allCategories: Category[]) {
        this._parentDivId = parentDivId;
        this._allCategories = allCategories;
    }

    public GetSelectedCategoryId(): number {
        if (this._selectedCategoryIdLevelThree !== undefined &&
            this._selectedCategoryIdLevelThree !== this._rootCategoryId)
            return this._selectedCategoryIdLevelThree;
        else if (this._selectedCategoryIdLevelTwo !== undefined &&
                 this._selectedCategoryIdLevelTwo !== this._rootCategoryId)
            return this._selectedCategoryIdLevelTwo;
        else
            return this._selectedCategoryIdLevelOne;
    }//GetSelectedCategoryId
    private removeElement(id: string):void {
        $("#" + id).remove();
    }
    private addOptionElementToSelectElement(selectElementId:string,category: Category):void {
        $("#" + selectElementId).append($("<option>", {
            value: category.categoryId,
            text: category.categoryName
        }));
    }
    public CreateFirstLevel(): void {
        this.removeElement(this._secondLevelDiv);
        this.removeElement(this._thirdLevelDiv);

        this._selectedCategoryIdLevelOne = this._rootCategoryId;
        this._allCategories.forEach(category => {
            if (category.parentCategoryId === this._rootCategoryId) {
                this.addOptionElementToSelectElement(this._firstLevelSelect,category);
            }//if
        });//forEach

        $("#" + this._firstLevelSelect).change((event) => {
            let selectedId = parseInt($(event.currentTarget).val().toString());
            this._selectedCategoryIdLevelOne = selectedId;
            this.createSecondLevel(selectedId);
            this.SelectedCategoryChanged.dispatch(this, this.GetSelectedCategoryId());
        });//change

    }//CreateFirstLevel

    private createSecondLevel(firstLevelCategoryId: number): void {

        this._selectedCategoryIdLevelTwo = this._rootCategoryId;
        $("#" + this._secondLevelSelect).remove();
        $("#" + this._thirdLevelSelect).remove();
        if (firstLevelCategoryId === this._rootCategoryId) {
            return;
        }
        var $select = $(`<select id="${this._secondLevelSelect}" class="form-control"></select>`)
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

        $("#" + this._secondLevelSelect).change((event) => {
            let selectedId = parseInt($(event.currentTarget).val().toString());
            this._selectedCategoryIdLevelTwo = selectedId;
            this.CreateThirdLevel(selectedId);
            this.SelectedCategoryChanged.dispatch(this, this.GetSelectedCategoryId());
        });//change
    }

    CreateThirdLevel(secondLevelCategoryId: number): void {
        this._selectedCategoryIdLevelThree = this._rootCategoryId;
        $("#" + this._thirdLevelSelect).remove();
        if (secondLevelCategoryId === this._rootCategoryId) {
            return;
        }
        var $thirdLevelElement = $(`<div><p>testDiv</p></div>`);
        var $select = $(`<select id="${this._thirdLevelSelect}" class="form-control"></select>`)
            .append(`<option value="${this._rootCategoryId}">تمام آگهی ها</option>`);
        this._allCategories.forEach(category => {
            if (category.parentCategoryId === secondLevelCategoryId) {
                $select.append($("<option>", {
                    value: category.categoryId,
                    text: category.categoryName
                }));
            }
        });//forEach
        $thirdLevelElement.append($select);
        $("#" + this._parentDivId).append($thirdLevelElement);

        $("#" + this._thirdLevelSelect).change((event) => {
            this._selectedCategoryIdLevelThree = parseInt($(event.currentTarget).val().toString());
            this.SelectedCategoryChanged.dispatch(this, this.GetSelectedCategoryId());
        });//change
    }
}

