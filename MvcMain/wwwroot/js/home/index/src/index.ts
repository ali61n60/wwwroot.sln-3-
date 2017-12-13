import {Category,CategorySelection} from "../../../Components/CategorySelection";
import { ServerCaller } from "./ServerCaller";

class Index {
    private  _serverCaller = new ServerCaller();
    private  _categorySelection: CategorySelection;

    private _categorySelectorParentDivId: string;
    private _getAdFromServerId: string;
    private _allCategoriesId: string;

    constructor(categorySelectorParentDivId: string,
                allCategoriesId:string,
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

    private  initCategorySelectionControl(): void {
        //Add first level categories
        let allCategoriesString = $("#"+this._allCategoriesId).val().toString();
        let allCategories = $.parseJSON(allCategoriesString) as Category[];
        this._categorySelection = new CategorySelection(this._categorySelectorParentDivId, allCategories);
        this._categorySelection.CreateFirstLevel();
        
    }//initCategorySelectionControl

    private initEventHandlers(): void {
        this._categorySelection.SelectedCategoryChanged.Subscribe((sender, args) => {
            $("#adPlaceHolder").children().remove();
            this._serverCaller.ResetSearchParameters();
        });
    }

    private initGetAdFromServer():void {
        $("#"+this._getAdFromServerId).on("click", (event) => {
            event.preventDefault();

            let categoryId = this._categorySelection.GetSelectedCategoryId();
            let minPrice = parseInt($("#minPrice").val().toString());
            let maxPrice = parseInt($("#maxPrice").val().toString());
            let orderBy = $("#orderBy").val().toString();

            this._serverCaller.GetAdItemsFromServer(categoryId, minPrice, maxPrice, orderBy);
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






