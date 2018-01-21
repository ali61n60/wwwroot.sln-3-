import { CategorySelection } from "../../../Components/Category/CategorySelection";
import { Category } from "../../../Models/Category";

export class LetMeKnow {
    private _categorySelection:CategorySelection;
    constructor(categorySelectorParentDivId: string, allCategoriesId: string) {
        this.initCategorySelect(categorySelectorParentDivId, allCategoriesId);
    }

    private initCategorySelect(categorySelectorParentDivId: string, allCategoriesId: string) {
        let allCategoriesString = $("#" + allCategoriesId).val().toString();
        let allCategories = $.parseJSON(allCategoriesString) as Category[];
        this._categorySelection = new CategorySelection(categorySelectorParentDivId, allCategories);
        this._categorySelection.CreateFirstLevel();
    }
}

let categorySelectorParentDivId: string = "categorySelector";
let allCategoriesId = "allCategories";

$(document).ready(()=> {
    let letMeKnow = new LetMeKnow(categorySelectorParentDivId,allCategoriesId);
});