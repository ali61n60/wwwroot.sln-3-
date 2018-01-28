import { Category } from "../../../Models/Category";
import { CategorySelection } from "../../../Components/Category/CategorySelection";
import { ServerCaller } from "./ServerCaller";
import { SearchCriteriaViewLoader} from "./SearchCriteriaViewLoader";
import {SearchCriteria} from "./SearchCriteria";
import {ICriteriaChange} from "../../../Helper/ICriteriaChange";
import {UserInput} from "../../../Helper/UserInput";
import {IResultHandler} from "../../../Helper/IResultHandler";
import {AdvertisementCommon} from "../../../Models/AdvertisementCommon";



//TODO when category change before search criteia is loaded a search call is sent to server
//add an event like viewLoadStarted, viewLoadInProgress,viewLoadCompleted and disable search
//durng inProgress end enable it after completed
export class Index implements ICriteriaChange, IResultHandler<AdvertisementCommon[]> {

    private readonly AdTypeKey: string = "AdType";
    private readonly AdTypeParentDivId ="adType";

    private readonly SearchTextKey="SearchText";
    private readonly SearchTextInputId ="searchText";

    private readonly _adPlaceHolderDivId: string = "adPlaceHolder";

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
        let allCategoriesString = $("#" + this._allCategoriesId).val().toString();
        let allCategories = $.parseJSON(allCategoriesString) as Category[];
        this._categorySelection = new CategorySelection(this._categorySelectorParentDivId, allCategories);
        this._categorySelection.CreateFirstLevel();

    }//initCategorySelectionControl

    private initEventHandlers(): void {
        this._categorySelection.SelectedCategoryChangedEvent.Subscribe((sender, args) => {
            this.searchCriteriaChanged();
            this._searchCriteriaViewLoader.GetSearchCriteriaViewFromServer(args.SelectedCategoryId);
        });

        this._searchCriteria.Bind(this._categorySelection.GetSelectedCategoryId(),this);


       
        $("#" + this.AdTypeParentDivId).on("change",
            (event) => {
                this.searchCriteriaChanged();
            });

        $("#" + this.SearchTextInputId).on("input", () => {
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
            
            userInput.ParametersDictionary[this.AdTypeKey] = $("#" + this.AdTypeParentDivId).children(":checked").val();
            userInput.ParametersDictionary[this.SearchTextKey] = $("#" + this.SearchTextInputId).val();
            
            this._searchCriteria.FillCategorySpecificSearchCriteria(this._categorySelection.GetSelectedCategoryId(), userInput);//fill category specific search parameters
            
            this._serverCaller.GetAdItemsFromServer(userInput,this);
        }); //click
    }//initGetAdFromServer

    public OnResultOk(advertisementCommons: AdvertisementCommon[]): void {
        var template = $('#singleAdItem').html();
        var data;
        for (var i = 0; i < advertisementCommons.length; i++) {
            var adImage = null;
            if (advertisementCommons[i].AdvertisementImages[0] != null) {
                adImage = "data:image/jpg;base64," + advertisementCommons[i].AdvertisementImages[0];
            } //end if
            data = {
                AdvertisementId: advertisementCommons[i].AdvertisementId,
                AdvertisementCategoryId: advertisementCommons[i].AdvertisementCategoryId,
                AdvertisementCategory: advertisementCommons[i].AdvertisementCategory,
                adImage: adImage,
                adPrice: advertisementCommons[i].AdvertisementPrice.PriceString, //todo check the price type
                AdvertisementTitle: advertisementCommons[i].AdvertisementTitle,
                AdvertisementStatus: advertisementCommons[i].AdvertisementStatus
                //adDate: msg.ResponseData[i].AdTime
            } //end data

            var html = Mustache.to_html(template, data);
            $("#" + this._adPlaceHolderDivId).append(html);
        } //end for
    }
    public OnResultError(message: string): void {
        alert(message);
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

declare let window: any;
var index:Index;


$(document).ready(() => {
    index= new Index(categorySelectorParentDivId, allCategoriesId, getAdFromServerId);
    index.CustomCriteriaChanged();//to initiate a server call on page load for first time
    window.AliIndex = index;
});//ready






