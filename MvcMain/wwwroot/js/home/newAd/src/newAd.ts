import { Category } from "../../../Models/Category";
import { CategorySelectionNewAd } from "../../../Components/Category/NewAd/CategorySelectionNewAd";
import { NewAdPartialViewLoader} from "./NewAdPartialViewLoader";


class NewAd {
    private _allCategoriesId: string;
    private _categorySelectionNewAd: CategorySelectionNewAd;
    private _categorySelectorParentDivId: string;
    private _categorySpecificPartialViewId:string;
    private _partialViewLoader: NewAdPartialViewLoader;

    constructor(categorySelectorParentDivId: string,
        allCategoriesId: string,
        categorySpecificPartialViewId:string) {

        this._categorySelectorParentDivId = categorySelectorParentDivId;
        this._allCategoriesId = allCategoriesId;
        this._categorySpecificPartialViewId = categorySpecificPartialViewId;
        this.initPage();
        this.initEventHandlers();
    }

    private initPage(): void {
        this.initNewAdCategory();
        this._partialViewLoader = new NewAdPartialViewLoader(this._categorySpecificPartialViewId);
    }

    private initNewAdCategory():void {
        let allCategoriesString = $("#" + this._allCategoriesId).val().toString();
        let allCategories = $.parseJSON(allCategoriesString) as Category[];
        this._categorySelectionNewAd = new CategorySelectionNewAd(this._categorySelectorParentDivId, allCategories);
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


let categorySelectorParentDivId: string = "categorySelector";
let allCategoriesId:string = "allCategories";
let categorySpecificPartialViewId:string = "NewAdPlaceHolder";
$(document).ready(() => {
    let newAd = new NewAd(categorySelectorParentDivId, allCategoriesId,categorySpecificPartialViewId);
});//ready