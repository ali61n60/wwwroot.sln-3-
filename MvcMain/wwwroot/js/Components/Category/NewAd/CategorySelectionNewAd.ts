import {Category} from "../../../Models/Category";


export class CategorySelectionNewAd {

    private _parentDivId: string;//div element that holds all CategorySelection elements
    private _allCategories: Category[];

    constructor(parentDivId: string, allCategories: Category[]) {
        this._parentDivId = parentDivId;
        this._allCategories = allCategories;
    }

    public CreateFirstLevel() {
        alert("creating first level in new ad");
    }
}