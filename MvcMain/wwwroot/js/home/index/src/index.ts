import { Category } from "../../../Models/Category";
import { CategorySelection } from "../../../Components/Category/SearchAd/CategorySelection";
import { ServerCaller } from "./ServerCaller";
import { SearchCriteriaLoader } from "./SearchCriteriaLoader";
import { SearchAdUserInput } from "./SearchAdUserInput";

declare function greet(): string;
declare class MyClass {
    public MyMethod():void;
}

export class Index {
    private _serverCaller = new ServerCaller();
    private _categorySelection: CategorySelection;
    private _searchCriteriaLoader = new SearchCriteriaLoader("categorySpecificSearchCriteria", this);

    private _categorySelectorParentDivId: string;
    private _getAdFromServerId: string;
    private _allCategoriesId: string;

    constructor(categorySelectorParentDivId: string,
        allCategoriesId: string,
        getAdFromServerId: string) {
        this._categorySelectorParentDivId = categorySelectorParentDivId;
        this._allCategoriesId = allCategoriesId;
        this._getAdFromServerId = getAdFromServerId;

        this.initPage();
        this.initEventHandlers();
    }

    private initPage(): void {

        this.initCategorySelectionControl();
        this.initGetAdFromServer();
        this.initSingleAdItemStyle();

    }//initPage

    private initCategorySelectionControl(): void {
        //Add first level categories
        let allCategoriesString = $("#" + this._allCategoriesId).val().toString();
        let allCategories = $.parseJSON(allCategoriesString) as Category[];
        this._categorySelection = new CategorySelection(this._categorySelectorParentDivId, allCategories);
        this._categorySelection.CreateFirstLevel();

    }//initCategorySelectionControl

    private initEventHandlers(): void {
        this._categorySelection.SelectedCategoryChangedEvent.Subscribe((sender, args) => {
            this.searchCriteriaChanged();
            this._searchCriteriaLoader.GetSearchCriteriaViewFromServer(args);
        });
    }

    public CustomSearchCriteriChanged() {
        this.searchCriteriaChanged();
    }

    private searchCriteriaChanged(): void {
        $("#adPlaceHolder").children().remove();
        this._serverCaller.ResetSearchParameters();

    }

    private initGetAdFromServer(): void {
        $("#" + this._getAdFromServerId).on("click", (event) => {
            event.preventDefault();

            let categoryId = this._categorySelection.GetSelectedCategoryId();
            let minPrice = parseInt($("#minPrice").val().toString());
            let maxPrice = parseInt($("#maxPrice").val().toString());
            let orderBy = $("#orderBy").val().toString();
            let userInput = new SearchAdUserInput();
            userInput.SearchParameters.CategoryId = categoryId;//100 for cars
            userInput.SearchParameters.MinimumPrice = minPrice;
            userInput.SearchParameters.MaximumPrice = maxPrice;
            userInput.SearchParameters.OrderBy = orderBy;
            //TODO What about category specific search parameters
            this.fillCategorySpecificSearchCriteria(userInput);
            this._serverCaller.GetAdItemsFromServer(userInput);
        }); //click
    }//initGetAdFromServer

    private fillCategorySpecificSearchCriteria(userInput: SearchAdUserInput) {
        let categoryId = this._categorySelection.GetSelectedCategoryId();
        switch (categoryId) {
            case 100:
                userInput.SearchParameters.BrandId = 100;
                userInput.SearchParameters.ModelId = 21;
                break;
            default:
                userInput.SearchParameters.defaultParameter = 1234;
                break;
        }
        greet();
        let myObj = new MyClass();
        myObj.MyMethod();
    }

    private initSingleAdItemStyle(): void {
        //show detail of singleAdItem when mouse over
        $(document).on("mouseenter mouseleave", ".blockDisplay", (event: JQuery.Event<HTMLElement, null>) => {
            $(event.currentTarget).find(".moreInfo").fadeToggle(250);
            //$(this).find(".moreInfo").fadeToggle(250);
        });//end on
    }//initSingleAdItemStyle
}

let categorySelectorParentDivId: string = "categorySelector";
let getAdFromServerId = "getAdFromServer";
let allCategoriesId = "allCategories";

$(document).ready(() => {
    let index = new Index(categorySelectorParentDivId, allCategoriesId, getAdFromServerId);
});//ready






