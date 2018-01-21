import { EventDispatcher } from "../../Events/EventDispatcher";
import { Category } from "../../Models/Category";
import { UserInput } from "../../Helper/UserInput";

export class CategorySelection {

    public SelectedCategoryChangedEvent: EventDispatcher<CategorySelection, CategoryCahngedEventArg> = new EventDispatcher<CategorySelection, CategoryCahngedEventArg>();

    private readonly CategoryIdKey = "CategoryId";

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


    constructor(parentDivId: string, allCategories: Category[]) {
        this._parentDivId = parentDivId;
        this._allCategories = allCategories;
    }

    

    public SetCategoryId(selectedCategoryId: number): void {
        let firstLevelId: number;
        let secondLevelId: number;
        let categoryLevel = this.getCategoryLevel(selectedCategoryId);
        switch (categoryLevel) {
        case CategoryLevel.Unkown:
            this.CreateFirstLevel();
                break;
            case CategoryLevel.Level1:
                this.CreateFirstLevel();
                this.setFirstLevelToSpecificId(selectedCategoryId);
                this.createSecondLevel(selectedCategoryId);
                $("#" + this._firstLevelSelect).trigger("change");
                break;
            case CategoryLevel.Level2:
                this.CreateFirstLevel();
                firstLevelId = this._allCategories.filter(category => category.CategoryId === selectedCategoryId)[0]
                    .ParentCategoryId;
                this.setFirstLevelToSpecificId(firstLevelId);
                this.createSecondLevel(firstLevelId);
                this.setSecondLevelToSpecificId(selectedCategoryId);
                this.createThirdLevel(selectedCategoryId);
                $("#" + this._secondLevelSelect).trigger("change");
                break;
        case CategoryLevel.Level3:
            this.CreateFirstLevel();
            secondLevelId = this._allCategories.filter(category => category.CategoryId === selectedCategoryId)[0]
                    .ParentCategoryId;
            firstLevelId = this._allCategories.filter(category => category.CategoryId === secondLevelId)[0]
                .ParentCategoryId;
            this.setFirstLevelToSpecificId(firstLevelId);
            this.createSecondLevel(firstLevelId);
            this.setSecondLevelToSpecificId(secondLevelId);
                this.createThirdLevel(secondLevelId);
                this.setThirdLevelToSpecificId(selectedCategoryId);
            $("#" + this._thirdLevelSelect).trigger("change");
            break;
        }
    }

    private setFirstLevelToSpecificId(categoryId: number) {
        $("#" + this._firstLevelSelect).val(categoryId);
    }
    private setSecondLevelToSpecificId(categoryId: number) {
        $("#" + this._secondLevelSelect).val(categoryId);
    }
    private setThirdLevelToSpecificId(categoryId: number) {
        $("#" + this._thirdLevelSelect).val(categoryId);
    }
    private getCategoryLevel(categoryId: number): CategoryLevel {

        let tempCategoryArray = this._allCategories.filter(category => category.CategoryId === categoryId);
        let tempCategory;
        if (tempCategoryArray.length === 0) {
            return CategoryLevel.Unkown;
        }
        tempCategory = tempCategoryArray[0];
        if (tempCategory.ParentCategoryId === this._rootCategoryId) {
            return CategoryLevel.Level1;
        }
        tempCategory = this._allCategories.filter(category => category.CategoryId === tempCategory.ParentCategoryId)[0];
        if (tempCategory.ParentCategoryId === this._rootCategoryId) {
            return CategoryLevel.Level2;
        }
        return CategoryLevel.Level3;
    }

    public InsertCategoryIdInUserInputDictionary(userInput: UserInput): void {
        let categoryId = this.GetSelectedCategoryId();
        userInput.ParametersDictionary[this.CategoryIdKey] = categoryId;//100 for cars
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
            eventArg.SelectedCategoryHasChild = this.selectedCategoryHasChildren();
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
            eventArg.SelectedCategoryHasChild = this.selectedCategoryHasChildren();
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
        if (categories.length === 0) {//No Item in third level category
            return;
        }
        let html = Mustache.to_html(template, data);
        $("#" + this._parentDivId).append(html);

        $("#" + this._thirdLevelSelect).change((event) => {
            this._selectedCategoryIdLevelThree = parseInt($(event.currentTarget).val().toString());
            let eventArg = new CategoryCahngedEventArg();
            eventArg.SelectedCategoryId = this.GetSelectedCategoryId();
            eventArg.SelectedCategoryHasChild = this.selectedCategoryHasChildren();
            this.SelectedCategoryChangedEvent.Dispatch(this, eventArg);
        });//change
    }

    private selectedCategoryHasChildren(): boolean {
        let selectedCategoryId = this.GetSelectedCategoryId();
        return this._allCategories.filter
            ((category) => { return category.ParentCategoryId === selectedCategoryId }).length > 0;
    }

    private removeElement(id: string): void {
        $("#" + id).remove();
    }
}

export class CategoryCahngedEventArg {
    public SelectedCategoryId: number;
    public SelectedCategoryHasChild: boolean;
}

enum CategoryLevel {
    Level1 = 1,
    Level2 = 2,
    Level3 = 3,
    Unkown=4
}

