﻿import { Category } from "../../../Models/Category";
import { CategorySelection } from "../../../Components/Category/SearchAd/CategorySelection";
import { ServerCaller } from "./ServerCaller";
import { SearchCriteriaViewLoader} from "./SearchCriteriaViewLoader";
import {SearchCriteria} from "./SearchCriteria";
import {ICriteriaChange} from "../../../Helper/ICriteriaChange";
import {UserInput} from "../../../Helper/UserInput";


//TODO when category change before search criteia is loaded a search call is sent to server
//add an event like viewLoadStarted, viewLoadInProgress,viewLoadCompleted and disable search
//durng inProgress end enable it after completed
export class Index implements ICriteriaChange {

    private readonly OrderByKey ="OrderBy";
    private readonly _orderBySelectIdDiv = "orderBy";

    private readonly MinimumPriceKey ="MinimumPrice";
    private readonly _minPriceInputId = "minPrice";

    private readonly MaximumPriceKey ="MaximumPrice";
    private readonly _maxPriceInputId ="maxPrice";

    private _serverCaller:ServerCaller;
    private _categorySelection: CategorySelection;
    private _searchCriteria:SearchCriteria;
    private _searchCriteriaViewLoader:SearchCriteriaViewLoader;

    private _categorySelectorParentDivId: string;
    private _getAdFromServerId: string;
    private _allCategoriesId: string;

    constructor(categorySelectorParentDivId: string,
        allCategoriesId: string,
        getAdFromServerId: string)
    {
        this._categorySelectorParentDivId = categorySelectorParentDivId;
        this._allCategoriesId = allCategoriesId;
        this._getAdFromServerId = getAdFromServerId;

        this._serverCaller = new ServerCaller();
        this._searchCriteria = new SearchCriteria();
        this._searchCriteriaViewLoader = new SearchCriteriaViewLoader("categorySpecificSearchCriteria", this, this._searchCriteria);

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

        $("#" + this._orderBySelectIdDiv).on("change",
            (event) => {
                this.searchCriteriaChanged();
            });
        //you can also user "input" instead of "change"
        $("#" + this._minPriceInputId).on("input",
            (event) => {
                this.searchCriteriaChanged();
            });
        $("#" + this._maxPriceInputId).on("change",
            (event) => {
                this.searchCriteriaChanged();
            });
    }

    public CustomCriteriaChanged():void {
        this.searchCriteriaChanged();
    }

    private searchCriteriaChanged(): void {
        $("#adPlaceHolder").children().remove();
        this._serverCaller.ResetSearchParameters();
       // $("#" + this._getAdFromServerId).trigger("click");

    }

    private initGetAdFromServer(): void {
        $("#" + this._getAdFromServerId).on("click", (event) => {
            event.preventDefault();
            let userInput = new UserInput();

            this._categorySelection.InsertCategoryIdInUserInputDictionary(userInput);
            
            let minPrice = parseInt($("#minPrice").val().toString());
            userInput.ParametersDictionary[this.MinimumPriceKey] = minPrice;

            let maxPrice = parseInt($("#maxPrice").val().toString());
            userInput.ParametersDictionary[this.MaximumPriceKey] = maxPrice;

            let orderBy = $("#orderBy").val().toString();
            userInput.ParametersDictionary[this.OrderByKey] = orderBy;
            
            this._searchCriteria.FillCategorySpecificSearchCriteria(this._categorySelection.GetSelectedCategoryId(), userInput);//fill category specific search parameters
            
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
    index.CustomCriteriaChanged();//to initiate a server call on page load for first time
});//ready






