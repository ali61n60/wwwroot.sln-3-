import { Category } from "../../../Models/Category";
import { CategorySelection } from "../../../Components/Category/CategorySelection";
import { NewAdPartialViewLoader } from "./NewAdPartialViewLoader";
import { ICriteriaChange } from "../../../Helper/ICriteriaChange";
import { NewAdCriteria } from "./NewAdCriteria";
import { ImageUploader } from "./ImageUploader";
import { UserInput } from "../../../Helper/UserInput";
import { NewAdServerCaller } from "./NewAdServerCaller";
import {IResultHandler} from "../../../Helper/IResultHandler";

class NewAd implements ICriteriaChange, IResultHandler{
    
    private readonly AdTitleKey = "AdTitle";
    private readonly AdTitleInputId: string = "adTitle";

    private readonly AdCommentKey = "AdComment";
    private readonly AdCommentInputId = "adComment";

    private _allCategoriesInputId: string;
    private _allCategoriesDivId: string;
    private _categorySpecificPartialViewId: string;
    private readonly _submitAdInputId: string = "submitNewAd";


    private _currentNewAdGuid: string;
    private readonly CurrentNewAdGuidInputId: string = "currentNewAdGuid";

    private readonly AddAdvertisementRequestCode = 1;
    private readonly LoadNewAdPartialViewRequestCode = 2;

    private _categorySelection: CategorySelection;
    private _partialViewLoader: NewAdPartialViewLoader;
    private _newAdCriteria: NewAdCriteria;
    private _imageUploader: ImageUploader;
    private _newAdServerCaller: NewAdServerCaller;

    constructor(allCategoriesDiv: string, allCategoriesInputId: string, categorySpecificPartialViewId: string) {
        this._allCategoriesDivId = allCategoriesDiv;
        this._allCategoriesInputId = allCategoriesInputId;
        this._categorySpecificPartialViewId = categorySpecificPartialViewId;
        this._newAdCriteria = new NewAdCriteria();
        this.initPage();
        this._imageUploader = new ImageUploader(this._currentNewAdGuid);
        this._newAdServerCaller = new NewAdServerCaller(this, this.AddAdvertisementRequestCode);
        this.initEventHandlers();
    }

    public CustomCriteriaChanged(): void {

    }

    private initPage(): void {
        this.initNewAdCategory();
        this._partialViewLoader = new NewAdPartialViewLoader(this,this, this._newAdCriteria,this.LoadNewAdPartialViewRequestCode);
        this._currentNewAdGuid = $("#" + this.CurrentNewAdGuidInputId).val().toString();


    }

    private initNewAdCategory(): void {
        let allCategoriesString = $("#" + this._allCategoriesInputId).val().toString();
        let allCategories = $.parseJSON(allCategoriesString) as Category[];
        this._categorySelection = new CategorySelection(this._allCategoriesDivId, allCategories);
        this._categorySelection.CreateFirstLevel();
    }

    private initEventHandlers(): void {
        this._categorySelection.SelectedCategoryChangedEvent.Subscribe((sender, args) => {
            if (!args.SelectedCategoryHasChild) {
                let userInput = new UserInput();
                this._categorySelection.InsertCategoryIdInUserInputDictionary(userInput);
                this._partialViewLoader.GetPartialViewFromServer(userInput,args.SelectedCategoryId);
            }
        });
        $("#" + this._submitAdInputId).on("click", (event) => {
            event.preventDefault();
            this.submitAd();
        });
    }

    private submitAd():void {
        //TODO disable submitAd Button until current submission is ok or errornous 

        let userInput = new UserInput();
        userInput.ParametersDictionary["NewAdGuid"] = this._currentNewAdGuid;
        this._categorySelection.InsertCategoryIdInUserInputDictionary(userInput);
        userInput.ParametersDictionary[this.AdTitleKey] = $("#" + this.AdTitleInputId).val();
        userInput.ParametersDictionary[this.AdCommentKey] = $("#" + this.AdCommentInputId).val();
        this._newAdCriteria.FillCategorySpecificNewAdCriteria(this._categorySelection.GetSelectedCategoryId(), userInput);
        this._newAdServerCaller.SaveAd(userInput);
    }

    OnResult(param: any, requestCode: number): void {
        if (requestCode === this.LoadNewAdPartialViewRequestCode) {
            $("#" + this._categorySpecificPartialViewId).children().remove();
            $("#" + this._categorySpecificPartialViewId).html(param);
        }
        else if (requestCode === this.AddAdvertisementRequestCode) {
            document.location.replace("/NewAd/Confirm");
        }
    }
    OnError(message: string, requestCode: number): void {
        if (requestCode === this.LoadNewAdPartialViewRequestCode) {
            alert(message);
        }
        else if (requestCode === this.AddAdvertisementRequestCode) {
            alert(message);
        }
    }
    AjaxCallFinished(requestCode: number): void {
        if (requestCode === this.LoadNewAdPartialViewRequestCode) {

        }
        else if (requestCode === this.AddAdvertisementRequestCode) {

        }
    }
    AjaxCallStarted(requestCode: number): void {
        if (requestCode === this.LoadNewAdPartialViewRequestCode) {

        }
        else if (requestCode === this.AddAdvertisementRequestCode) {

        }
    }
}



let allCategoriesDivId: string = "categorySelector";
let allCategoriesInputId: string = "allCategories";
let categorySpecificPartialViewId: string = "CategorySpecificCriteria";
$(document).ready(() => {
    let newAd = new NewAd(allCategoriesDivId, allCategoriesInputId, categorySpecificPartialViewId);
});//ready