import { Category } from "../../../Models/Category";
import { CategorySelection } from "../../../Components/Category/CategorySelection";
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

    private _categorySelection: CategorySelection;
    private _partialViewLoader: NewAdPartialViewLoader;
    private _newAdCriteria: NewAdCriteria;
    private _imageUploader: ImageUploader;
    private _newAdServerCaller:NewAdServerCaller;

    constructor(allCategoriesDiv: string,allCategoriesInputId: string,categorySpecificPartialViewId:string) {
        this._allCategoriesDivId = allCategoriesDiv;
        this._allCategoriesInputId = allCategoriesInputId;
        this._categorySpecificPartialViewId = categorySpecificPartialViewId;
        this._newAdCriteria = new NewAdCriteria();
        this.initPage();
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
        this._categorySelection = new CategorySelection(this._allCategoriesDivId, allCategories);
        this._categorySelection.CreateFirstLevel();
    }

    private initEventHandlers(): void {
        this._categorySelection.SelectedCategoryChangedEvent.Subscribe((sender, args) => {
            if (!args.SelectedCategoryHasChild) {
                this._partialViewLoader.GetPartialViewFromServer(args.SelectedCategoryId);
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
        this._categorySelection.InsertCategoryIdInUserInputDictionary(userInput);
        userInput.ParametersDictionary[this.AdTitleKey] = $("#" + this.AdTitleInputId).val();
        userInput.ParametersDictionary[this.AdCommentKey] = $("#" + this.AdCommentInputId).val();
        this._newAdCriteria.FillCategorySpecificNewAdCriteria(this._categorySelection.GetSelectedCategoryId(), userInput);
        this._newAdServerCaller.SaveAd(userInput);
    }
}



let allCategoriesDivId: string = "allCategoriesDiv";
let allCategoriesInputId: string = "allCategoriesInput";
let categorySpecificPartialViewId: string = "CategorySpecificCriteria";
$(document).ready(() => {
    let newAd = new NewAd(allCategoriesDivId, allCategoriesInputId,categorySpecificPartialViewId);
});//ready