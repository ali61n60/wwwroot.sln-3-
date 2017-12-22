import { Category } from "../../../Models/Category";
import { CategorySelectionNewAd } from "../../../Components/Category/NewAd/CategorySelectionNewAd";
class NewAd {
    private _allCategoriesId: string;
    private _categorySelectionNewAd: CategorySelectionNewAd;
    private _categorySelectorParentDivId:string;

    constructor(categorySelectorParentDivId: string,
        allCategoriesId: string) {

        this._categorySelectorParentDivId = categorySelectorParentDivId;
        this._allCategoriesId = allCategoriesId;
        this.initPage();
        
    }

    private initPage(): void {
        this.initNewAdCategory();
    }

    private initNewAdCategory():void {
        let allCategoriesString = $("#" + this._allCategoriesId).val().toString();
        let allCategories = $.parseJSON(allCategoriesString) as Category[];
        this._categorySelectionNewAd = new CategorySelectionNewAd(this._categorySelectorParentDivId, allCategories);
        this._categorySelectionNewAd.CreateFirstLevel();
    }
}

let categorySelectorParentDivId: string = "categorySelector";
let allCategoriesId = "allCategories";
$(document).ready(() => {
    let newAd = new NewAd(categorySelectorParentDivId, allCategoriesId);
});//ready