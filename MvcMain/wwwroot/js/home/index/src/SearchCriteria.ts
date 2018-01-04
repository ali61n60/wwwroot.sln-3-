import {AdTransformationSearchCriteria} from "./SearchCriteria/AdTransformationSearchCriteria";
import {DefaultSearchCriteria} from "./SearchCriteria/DefaultSearchCriteria";
import {ICriteria} from "../../../Helper/ICriteria";
import {UserInput} from "../../../Helper/UserInput";
import {ICriteriaChange} from "../../../Helper/ICriteriaChange";
import {CriteriaNumericDictionary} from "../../../Helper/CriteriaNumericDictionary";


export class SearchCriteria {
    private _searchCriteriaIocContainer: CriteriaNumericDictionary = new CriteriaNumericDictionary();
    constructor() {
        this.initSearchCriteriaIocContainer();
    }

    private initSearchCriteriaIocContainer() {
        this._searchCriteriaIocContainer[0] = new DefaultSearchCriteria();
        this._searchCriteriaIocContainer[100] = new AdTransformationSearchCriteria();
    }

    public FillCategorySpecificSearchCriteria(categoryId: number, userInput: UserInput): void {
        let searchCriteria = this.polymorphicDispatchSearchCriteria(categoryId);
        searchCriteria.FillCriteria(userInput);
    }

    public Bind(categoryId: number, searchCriteriaChange: ICriteriaChange) {
        let searchCriteria = this.polymorphicDispatchSearchCriteria(categoryId);
        searchCriteria.BindEvents(searchCriteriaChange);
    }

    public UnBind(categoryId:number) {
        let searchCriteria = this.polymorphicDispatchSearchCriteria(categoryId);
        searchCriteria.UnBindEvents();
    }

    private polymorphicDispatchSearchCriteria(categoryId:number): ICriteria {
        let returnValue: ICriteria = this._searchCriteriaIocContainer[categoryId];
        if (returnValue===undefined || returnValue===null) {
            returnValue = this._searchCriteriaIocContainer[0];
        }
        return returnValue;
    }
}