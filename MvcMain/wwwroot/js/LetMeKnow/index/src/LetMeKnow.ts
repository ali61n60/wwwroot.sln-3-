import { CategorySelection } from "../../../Components/Category/CategorySelection";
import { Category } from "../../../Models/Category";
import {UserInput} from "../../../Helper/UserInput";
import {LetMeKnowServerCaller} from "./LetMeKnowServerCaller";
import {LetMeKnowPartialViewLoader} from "./LetMeKnowPartialViewLoader";
import {ICriteriaChange} from "../../../Helper/ICriteriaChange";
import {LetMeKnowCriteria}  from "./LetMeKnowCriteria";
import {IResultHandler} from "../../../Helper/IResultHandler";


export class LetMeKnow implements ICriteriaChange,IResultHandler {

    private readonly InsertLetMeKnowImageId = "insertLetMeKnow";
    private readonly LoadViewImageId = "loadView";

    private readonly EmailOrSmsKey: string = "EmailOrSms";
    public readonly  EmailOrSmsParentDivId: string = "emailOrSms";
    
    private readonly _registerLetMeKnowInputId: string = "registerLetMeKnow";
    private readonly _categorySpecificCriteriaDivId: string ="CategorySpecificCriteria";

    private readonly _partialViewDivId: string ="CategorySpecificCriteria";

    private _categorySelection: CategorySelection;
    private _letMeKnowCriteria:LetMeKnowCriteria;
    private _letMeKnowServerCaller: LetMeKnowServerCaller;
    private _letMeKnowPartialViewLoader: LetMeKnowPartialViewLoader;

    private readonly AddAdvertisementRequestCode = 1;//
    private readonly LoadLetMeKnowPartialViewRequestCode = 2;

    constructor(categorySelectorParentDivId: string, allCategoriesId: string) {
        this.initCategorySelect(categorySelectorParentDivId, allCategoriesId);
        this._letMeKnowServerCaller = new LetMeKnowServerCaller();
        this._letMeKnowCriteria = new LetMeKnowCriteria();
        this._letMeKnowPartialViewLoader =
            new LetMeKnowPartialViewLoader( this, this, this._letMeKnowCriteria,this.LoadLetMeKnowPartialViewRequestCode);
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
            let userInput = new UserInput();
            this._categorySelection.InsertCategoryIdInUserInputDictionary(userInput);
            this._letMeKnowPartialViewLoader.GetPartialViewFromServer(userInput, args.SelectedCategoryId);
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
        userInput.ParametersDictionary[this.EmailOrSmsKey] = $("#" + this.EmailOrSmsParentDivId).children(":checked").val();;//TODO make a ui view (radio button)
        this._letMeKnowCriteria.FillCategorySpecificLetMeKnowCriteria(this._categorySelection.GetSelectedCategoryId(),userInput);

        this._letMeKnowServerCaller.SaveAd(userInput);
    }

    OnResult(param: any, requestCode: number): void {
        if (requestCode === this.LoadLetMeKnowPartialViewRequestCode) {
            $("#" + this._partialViewDivId).children().remove();
            $("#" + this._partialViewDivId).html(param);
        }
        
    }
    OnError(message: string, requestCode: number): void {
        alert(message);
    }
    AjaxCallFinished(requestCode: number): void {
        if (requestCode === this.LoadLetMeKnowPartialViewRequestCode) {
            $("#" + this.LoadViewImageId).hide();
        }
    }
    AjaxCallStarted(requestCode: number): void {
        if (requestCode === this.LoadLetMeKnowPartialViewRequestCode) {
            $("#" + this.LoadViewImageId).show();
        }
    }
}

let categorySelectorParentDivId: string = "categorySelector";
let allCategoriesId = "allCategories";

$(document).ready(()=> {
    let letMeKnow = new LetMeKnow(categorySelectorParentDivId,allCategoriesId);
});