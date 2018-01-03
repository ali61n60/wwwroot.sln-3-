import {SearchAdUserInput} from "./SearchAdUserInput";
import {AdTransformationSearchCriteria} from "./SearchCriteria/AdTransformationSearchCriteria";
import {ISearchCriteria } from "./SearchCriteria/ISearchCriteria";
import {DefaultSearchCriteria} from "./SearchCriteria/DefaultSearchCriteria";
import {ISearchCriteriaChange} from "./ISearchCriteriaChange";
import { NumericDictionary } from "lodash";

class SearchCriteriaNumericDictionary implements NumericDictionary<ISearchCriteria> {
    [index: number]: ISearchCriteria;
}
export class SearchCriteria {
    private _searchCriteriaIocContainer: SearchCriteriaNumericDictionary=new SearchCriteriaNumericDictionary();
    constructor() {
        this.initSearchCriteriaIocContainer();
        
    }

    private initSearchCriteriaIocContainer() {
        this._searchCriteriaIocContainer[0] = new DefaultSearchCriteria();
        this._searchCriteriaIocContainer[100] = new AdTransformationSearchCriteria();
    }

    public FillCategorySpecificSearchCriteria(categoryId: number, userInput: SearchAdUserInput): void {
        let searchCriteria = this.polymorphicDispatchSearchCriteria(categoryId);
        searchCriteria.FillSearchCriteria(userInput);
    }

    public Bind(categoryId: number, searchCriteriaChange: ISearchCriteriaChange) {
        let searchCriteria = this.polymorphicDispatchSearchCriteria(categoryId);
        searchCriteria.BindEvents(searchCriteriaChange);
    }

    public UnBind(categoryId:number) {
        let searchCriteria = this.polymorphicDispatchSearchCriteria(categoryId);
        searchCriteria.UnBindEvents();
    }

    private polymorphicDispatchSearchCriteria(categoryId:number): ISearchCriteria {
        let returnValue: ISearchCriteria = this._searchCriteriaIocContainer[categoryId];
        if (returnValue===undefined || returnValue===null) {
            returnValue = this._searchCriteriaIocContainer[0];
        }
        return returnValue;
    }
}