import { CategorySelection } from "../../../Components/Category/CategorySelection";
import { Category } from "../../../Models/Category";
import {UserInput} from "../../../Helper/UserInput";
import {LetMeKnowServerCaller} from "./LetMeKnowServerCaller";
import {LetMeKnowPartialViewLoader} from "./LetMeKnowPartialViewLoader";
import {ICriteriaChange} from "../../../Helper/ICriteriaChange";
import {LetMeKnowCriteria}  from "./LetMeKnowCriteria";


export class LetMeKnow implements ICriteriaChange {
    private readonly _registerLetMeKnowInputId: string = "registerLetMeKnow";
    private readonly _categorySpecificCriteriaDivId: string ="CategorySpecificCriteria";

    private _categorySelection: CategorySelection;
    private _letMeKnowCriteria:LetMeKnowCriteria;
    private _letMeKnowServerCaller: LetMeKnowServerCaller;
    private _letMeKnowPartialViewLoader:LetMeKnowPartialViewLoader;

    constructor(categorySelectorParentDivId: string, allCategoriesId: string) {
        this.initCategorySelect(categorySelectorParentDivId, allCategoriesId);
        this._letMeKnowServerCaller = new LetMeKnowServerCaller();
        this._letMeKnowCriteria = new LetMeKnowCriteria();
        this._letMeKnowPartialViewLoader =
            new LetMeKnowPartialViewLoader(this._categorySpecificCriteriaDivId, this, this._letMeKnowCriteria);
        this.initEventHandlers();
    }

    public CustomCriteriaChanged(): void {

    }

    private initCategorySelect(categorySelectorParentDivId: string, allCategoriesId: string):void {
        let allCategoriesString = $("#" + allCategoriesId).val().toString();
        let allCategories = $.parseJSON(allCategoriesString) as Category[];
        this._categorySelection = new CategorySelection(categorySelectorParentDivId, allCategories);
        this._categorySelection.CreateFirstLevel();
    }

    private initEventHandlers():void {
        this._categorySelection.SelectedCategoryChangedEvent.Subscribe((sender, args) => {
            this._letMeKnowPartialViewLoader.GetPartialViewFromServer(args.SelectedCategoryId);
        });

        $("#" + this._registerLetMeKnowInputId).on("click", (event) => {
            event.preventDefault();
            this.registerLetMeKnow();
        });
    }

    private  registerLetMeKnow():void {
        //TODO disable submitAd Button until current submission is ok or errornous 

        let userInput = new UserInput();
        this._categorySelection.InsertCategoryIdInUserInputDictionary(userInput);

        
        this._letMeKnowServerCaller.SaveAd(userInput);
    }
}

let categorySelectorParentDivId: string = "categorySelector";
let allCategoriesId = "allCategories";

$(document).ready(()=> {
    let letMeKnow = new LetMeKnow(categorySelectorParentDivId,allCategoriesId);
});