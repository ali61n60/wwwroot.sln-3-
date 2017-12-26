import {SearchAdUserInput} from "./SearchAdUserInput";
import {AdTransformationSearchCriteria} from "./SearchCriteria/AdTransformationSearchCriteria";
import {ISearchCriteria} from "./SearchCriteria/ISearchCriteria";
import {DefaultSearchCriteria} from "./SearchCriteria/DefaultSearchCriteria";
import {ISearchCriteriaChange} from "./ISearchCriteriaChange";



export class SearchCriteria {
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
        switch (categoryId) {
        case 100:
            return  new AdTransformationSearchCriteria();
        default:
            return new DefaultSearchCriteria();
        }
    }
}