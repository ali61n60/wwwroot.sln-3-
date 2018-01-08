import { Category } from "../../../Models/Category";
import { CategorySelectionNewAd } from "../../../Components/Category/NewAd/CategorySelectionNewAd";
import { NewAdPartialViewLoader} from "./NewAdPartialViewLoader";
import {ICriteriaChange} from "../../../Helper/ICriteriaChange";
import {NewAdCriteria} from "./NewAdCriteria";
import {ImageUploader} from "./ImageUploader";
import {UserInput} from "../../../Helper/UserInput";

class NewAd implements ICriteriaChange {
    private readonly TitleInputId: string ="title";


    private _allCategoriesInputId: string;
    private _allCategoriesDivId: string;
    private _categorySpecificPartialViewId: string;
    private readonly  _submitAdInputId: string ="submitNewAd";

    private _categorySelectionNewAd: CategorySelectionNewAd;
    private _partialViewLoader: NewAdPartialViewLoader;
    private _newAdCriteria: NewAdCriteria;
    private _imageUploader:ImageUploader;

    constructor(allCategoriesDiv: string,allCategoriesInputId: string,categorySpecificPartialViewId:string) {
        this._allCategoriesDivId = allCategoriesDiv;
        this._allCategoriesInputId = allCategoriesInputId;
        this._categorySpecificPartialViewId = categorySpecificPartialViewId;
        this._newAdCriteria = new NewAdCriteria();
        this._imageUploader = new ImageUploader();
        this.initPage();
        this.initEventHandlers();
    }

    public CustomCriteriaChanged(): void {
        
    }

    private initPage(): void {
        this.initNewAdCategory();
        this._partialViewLoader = new NewAdPartialViewLoader(this._categorySpecificPartialViewId, this, this._newAdCriteria);
        
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
        //TODO get user input
        //send user input to an api server method
        //on the server push data into database and also get user's pictures
        //from TempImage Directory
        
        let userInput = new UserInput();

        let categoryId = this._categorySelectionNewAd.GetSelectedCategoryId();
        userInput.ParametersDictionary.CategoryId = categoryId;//100 for cars
    }
}



let allCategoriesDivId: string = "allCategoriesDiv";
let allCategoriesInputId: string = "allCategoriesInput";
let categorySpecificPartialViewId: string = "CategorySpecificCriteria";
$(document).ready(() => {
    let newAd = new NewAd(allCategoriesDivId, allCategoriesInputId,categorySpecificPartialViewId);
});//ready