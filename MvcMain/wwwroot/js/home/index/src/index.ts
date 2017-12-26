import { Category } from "../../../Models/Category";
import { CategorySelection } from "../../../Components/Category/SearchAd/CategorySelection";
import { ServerCaller } from "./ServerCaller";
import { SearchCriteriaViewLoader} from "./SearchCriteriaViewLoader";
import { SearchAdUserInput } from "./SearchAdUserInput";
import {SearchCriteria} from "./SearchCriteria";



export class Index {
    private _serverCaller = new ServerCaller();
    private _categorySelection: CategorySelection;
    private _searchCriteriaViewLoader = new SearchCriteriaViewLoader("categorySpecificSearchCriteria", this);
    private _searchCriteria=new SearchCriteria();

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
            this._searchCriteriaViewLoader.GetSearchCriteriaViewFromServer(args);
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
            let userInput = new SearchAdUserInput();

            let categoryId = this._categorySelection.GetSelectedCategoryId();
            userInput.SearchParameters.CategoryId = categoryId;//100 for cars

            let minPrice = parseInt($("#minPrice").val().toString());
            userInput.SearchParameters.MinimumPrice = minPrice;

            let maxPrice = parseInt($("#maxPrice").val().toString());
            userInput.SearchParameters.MaximumPrice = maxPrice;

            let orderBy = $("#orderBy").val().toString();
            userInput.SearchParameters.OrderBy = orderBy;
            
            this._searchCriteria.FillCategorySpecificSearchCriteria(categoryId, userInput);//fill category specific search parameters
            
            this._serverCaller.GetAdItemsFromServer(userInput);
        }); //click
    }//initGetAdFromServer

   

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






