import { Category } from "../../../Models/Category";
import { CategorySelectionNewAd } from "../../../Components/Category/NewAd/CategorySelectionNewAd";
import { NewAdPartialViewLoader} from "./NewAdPartialViewLoader";
import {ICriteriaChange} from "../../../Helper/ICriteriaChange";
import {NewAdCriteria} from "./NewAdCriteria";
import {ImageUploader} from "./ImageUploader";
import {UserInput} from "../../../Helper/UserInput";
import {NewAdServerCaller} from "./NewAdServerCaller";


class NewAd implements ICriteriaChange {
    private readonly AdTitleKey = "AdTitle";
    private readonly AdTitleInputId: string = "adTitle";

    private readonly AdCommentKey ="AdComment";
    private readonly AdCommentInputId ="adComment";

    private _allCategoriesInputId: string;
    private _allCategoriesDivId: string;
    private _categorySpecificPartialViewId: string;
    private readonly _submitAdInputId: string = "submitNewAd";


    private _currentNewAdGuid:string;
    private readonly CurrentNewAdGuidInputId: string ="currentNewAdGuid";

    private _categorySelectionNewAd: CategorySelectionNewAd;
    private _partialViewLoader: NewAdPartialViewLoader;
    private _newAdCriteria: NewAdCriteria;
    private _imageUploader: ImageUploader;
    private _newAdServerCaller:NewAdServerCaller;

    constructor(allCategoriesDiv: string,allCategoriesInputId: string,categorySpecificPartialViewId:string) {
        this._allCategoriesDivId = allCategoriesDiv;
        this._allCategoriesInputId = allCategoriesInputId;
        this._categorySpecificPartialViewId = categorySpecificPartialViewId;
        this.initPage();
        this._newAdCriteria = new NewAdCriteria();
        this._imageUploader = new ImageUploader(this._currentNewAdGuid);
        this._newAdServerCaller = new NewAdServerCaller();
        
        this.initEventHandlers();
    }

    public CustomCriteriaChanged(): void {
        
    }

    private initPage(): void {
        this.initNewAdCategory();
        this._partialViewLoader = new NewAdPartialViewLoader(this._categorySpecificPartialViewId, this, this._newAdCriteria);
        this._currentNewAdGuid = $("#" + this.CurrentNewAdGuidInputId).val().toString();
        

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
        $("#"+this._submitAdInputId).on("click", (event)=> {
            event.preventDefault();
            this.submitAd();
        });
    }

    private submitAd() {
        //TODO disable submitAd Button until current submission is ok or errornous 
        
        let userInput = new UserInput();
        userInput.ParametersDictionary["NewAdGuid"] = this._currentNewAdGuid;
        this._categorySelectionNewAd.InsertCategoryIdInUserInputDictionary(userInput);
        userInput.ParametersDictionary[this.AdTitleKey] = $("#" + this.AdTitleInputId).val();
        userInput.ParametersDictionary[this.AdCommentKey] = $("#" + this.AdCommentInputId).val();
        this._newAdCriteria.FillCategorySpecificNewAdCriteria(this._categorySelectionNewAd.GetSelectedCategoryId(), userInput);
        this._newAdServerCaller.SaveAd(userInput);
    }
}



let allCategoriesDivId: string = "allCategoriesDiv";
let allCategoriesInputId: string = "allCategoriesInput";
let categorySpecificPartialViewId: string = "CategorySpecificCriteria";
$(document).ready(() => {
    let newAd = new NewAd(allCategoriesDivId, allCategoriesInputId,categorySpecificPartialViewId);
});//ready