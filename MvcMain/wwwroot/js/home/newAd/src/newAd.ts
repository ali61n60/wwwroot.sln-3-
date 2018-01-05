﻿import { Category } from "../../../Models/Category";
import { CategorySelectionNewAd } from "../../../Components/Category/NewAd/CategorySelectionNewAd";
import { NewAdPartialViewLoader} from "./NewAdPartialViewLoader";
import {ICriteriaChange} from "../../../Helper/ICriteriaChange";
import {NewAdCriteria} from "./NewAdCriteria";

class NewAd implements ICriteriaChange {
    
    private _allCategoriesInputId: string;
    private _categorySelectionNewAd: CategorySelectionNewAd;
    private _allCategoriesDivId: string;
    private _categorySpecificPartialViewId:string;
    private _partialViewLoader: NewAdPartialViewLoader;

    private _newAdCriteria:NewAdCriteria;

    constructor(allCategoriesDiv: string,allCategoriesInputId: string,categorySpecificPartialViewId:string) {
        this._allCategoriesDivId = allCategoriesDiv;
        this._allCategoriesInputId = allCategoriesInputId;
        this._categorySpecificPartialViewId = categorySpecificPartialViewId;
        this._newAdCriteria = new NewAdCriteria();
        this.initPage();
        this.initEventHandlers();
    }

    public CustomCriteriaChanged(): void {
        
    }

    private initPage(): void {
        this.initNewAdCategory();
        this._partialViewLoader = new NewAdPartialViewLoader(this._categorySpecificPartialViewId,this,this._newAdCriteria);
    }

    private initNewAdCategory():void {
        let allCategoriesString = $("#" + this._allCategoriesInputId).val().toString();
        let allCategories = $.parseJSON(allCategoriesString) as Category[];
        this._categorySelectionNewAd = new CategorySelectionNewAd(this._allCategoriesDivId, allCategories);
        this._categorySelectionNewAd.CreateFirstLevel();
    }

    private initEventHandlers(): void {
        this._categorySelectionNewAd.SelectedCategoryChangedEvent.Subscribe((sender, args) => {
            if (!this._categorySelectionNewAd.SelectedCategoryHasChildren()) {
                this._partialViewLoader.GetPartialViewFromServer(args);
            }
        });
    }
}

$(document).ready(function () {
   

    $("#submitNewAd").on("click", function (event) {
        var $apiAddress = "getApiAddress()";
        alert($apiAddress);
    });
});//ready


let allCategoriesDivId: string = "allCategoriesDiv";
let allCategoriesInputId: string = "allCategoriesInput";
let categorySpecificPartialViewId: string = "CategorySpecificCriteria";
$(document).ready(() => {
    let newAd = new NewAd(allCategoriesDivId, allCategoriesInputId,categorySpecificPartialViewId);
});//ready