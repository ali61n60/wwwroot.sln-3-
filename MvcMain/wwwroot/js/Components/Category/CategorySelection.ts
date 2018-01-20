import { EventDispatcher } from "../../Events/EventDispatcher";
import { Category } from "../../Models/Category";
import { UserInput } from "../../Helper/UserInput";
//TODO implement setCategoryId method which gets an integer an update view
export class CategorySelection {
    private readonly CategoryIdKey = "CategoryId";
    InsertCategoryIdInUserInputDictionary(userInput: UserInput) {
        let categoryId = this.GetSelectedCategoryId();
        userInput.ParametersDictionary[this.CategoryIdKey] = categoryId;//100 for cars
    }

    private _parentDivId: string;//div element that holds all CategorySelection elements
    private _allCategories: Category[];

    private readonly _firstLevelTemplate = "category1Template";
    private readonly _firstLevelDiv = "category1";
    private readonly _firstLevelSelect: string = "select1";

    private readonly _secondLevelTemplate = "category2Template";
    private readonly _secondLevelDiv = "category2";
    private readonly _secondLevelSelect: string = "select2";

    private readonly _thirdLevelTemplate = "category3Template";
    private readonly _thirdLevelDiv = "category3";
    private readonly _thirdLevelSelect: string = "select3";
    private readonly _rootCategoryId: number = 0;

    private _selectedCategoryIdLevelOne: number;
    private _selectedCategoryIdLevelTwo: number;
    private _selectedCategoryIdLevelThree: number;

    public SelectedCategoryChangedEvent: EventDispatcher<CategorySelection, CategoryCahngedEventArg> = new EventDispatcher<CategorySelection, CategoryCahngedEventArg>();

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
    }

    private  SelectedCategoryHasChildren(): boolean {
        let selectedCategoryId = this.GetSelectedCategoryId();
        return this._allCategories.filter
            ((category) => { return category.ParentCategoryId === selectedCategoryId }).length > 0;
    }

    private removeElement(id: string): void {
        $("#" + id).remove();
    }

    public CreateFirstLevel(): void {
        this.removeElement(this._firstLevelDiv);
        this._selectedCategoryIdLevelOne = this._rootCategoryId;
        this.removeElement(this._secondLevelDiv);
        this._selectedCategoryIdLevelTwo = this._rootCategoryId;
        this.removeElement(this._thirdLevelDiv);
        this._selectedCategoryIdLevelThree = this._rootCategoryId;

        let template = $("#" + this._firstLevelTemplate).html();
        let categories: Category[] = new Array<Category>();
        let data = { categories: categories }
        this._selectedCategoryIdLevelOne = this._rootCategoryId;//
        this._allCategories.forEach(category => {
            if (category.ParentCategoryId === this._rootCategoryId) {
                categories.push(category);
            }//if
        });//forEach

        let html = Mustache.to_html(template, data);
        $("#" + this._parentDivId).append(html);

        $("#" + this._firstLevelSelect).change((event) => {
            let selectedId = parseInt($(event.currentTarget).val().toString());
            this._selectedCategoryIdLevelOne = selectedId;
            this.createSecondLevel(selectedId);
            let eventArg = new CategoryCahngedEventArg();
            eventArg.SelectedCategoryId = this.GetSelectedCategoryId();
            eventArg.SelectedCategoryHasChild = this.SelectedCategoryHasChildren();
            this.SelectedCategoryChangedEvent.Dispatch(this, eventArg);
        });//change
    }//CreateFirstLevel

    private createSecondLevel(firstLevelCategoryId: number): void {
        this.removeElement(this._secondLevelDiv);
        this._selectedCategoryIdLevelTwo = this._rootCategoryId;
        this.removeElement(this._thirdLevelDiv);
        this._selectedCategoryIdLevelThree = this._rootCategoryId;
        if (firstLevelCategoryId === this._rootCategoryId) {
            return;
        }

        let template = $("#" + this._secondLevelTemplate).html();
        let categories: Category[] = new Array<Category>();
        let data = { categories: categories }

        this._allCategories.forEach(category => {
            if (category.ParentCategoryId === firstLevelCategoryId) {
                categories.push(category);
            }//if
        });//forEach

        let html = Mustache.to_html(template, data);
        $("#" + this._parentDivId).append(html);

        $("#" + this._secondLevelSelect).change((event) => {
            let selectedId = parseInt($(event.currentTarget).val().toString());
            this._selectedCategoryIdLevelTwo = selectedId;
            this.createThirdLevel(selectedId);
            let eventArg = new CategoryCahngedEventArg();
            eventArg.SelectedCategoryId = this.GetSelectedCategoryId();
            eventArg.SelectedCategoryHasChild = this.SelectedCategoryHasChildren();
            this.SelectedCategoryChangedEvent.Dispatch(this, eventArg);
        });//change
    }

    private createThirdLevel(secondLevelCategoryId: number): void {
        this.removeElement(this._thirdLevelDiv);
        this._selectedCategoryIdLevelThree = this._rootCategoryId;

        if (secondLevelCategoryId === this._rootCategoryId) {
            return;
        }

        let template = $("#" + this._thirdLevelTemplate).html();
        let categories: Category[] = new Array<Category>();
        let data = { categories: categories }

        this._allCategories.forEach(category => {
            if (category.ParentCategoryId === secondLevelCategoryId) {
                categories.push(category);
            }//if
        });//forEach
        if (categories.length === 0) {//No Itme in third level category
            return;
        }
        let html = Mustache.to_html(template, data);
        $("#" + this._parentDivId).append(html);

        $("#" + this._thirdLevelSelect).change((event) => {
            this._selectedCategoryIdLevelThree = parseInt($(event.currentTarget).val().toString());
            let eventArg = new CategoryCahngedEventArg();
            eventArg.SelectedCategoryId = this.GetSelectedCategoryId();
            eventArg.SelectedCategoryHasChild = this.SelectedCategoryHasChildren();
            this.SelectedCategoryChangedEvent.Dispatch(this, eventArg);
        });//change
    }
}

export class CategoryCahngedEventArg {
    public SelectedCategoryId: number;
    public SelectedCategoryHasChild: boolean;
}

