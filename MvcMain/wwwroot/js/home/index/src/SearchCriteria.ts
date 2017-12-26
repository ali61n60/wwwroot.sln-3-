import {SearchAdUserInput} from "./SearchAdUserInput";
import {AdTransformationSearchCriteria} from "./SearchCriteria/AdTransformationSearchCriteria";
import {ISearchCriteria} from "./SearchCriteria/ISearchCriteria";
import {DefaultSearchCriteria} from "./SearchCriteria/DefaultSearchCriteria";



export class SearchCriteria {
    public FillCategorySpecificSearchCriteria(categoryId: number, userInput: SearchAdUserInput): void {
        let searchCriteria = this.polymorphicDispatchSearchCriteria(categoryId);
        searchCriteria.FillSearchCriteria(userInput);
    }

    public Bind(categoryId:number) {
        
    }

    public UnBind(categoryId:number) {
        
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