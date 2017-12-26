import {ISearchCriteria} from "./ISearchCriteria";
import {SearchAdUserInput} from "../SearchAdUserInput";
import {ISearchCriteriaChange} from "../ISearchCriteriaChange";


export class DefaultSearchCriteria implements ISearchCriteria{
    public FillSearchCriteria(userInput: SearchAdUserInput): void {
        userInput.SearchParameters.defaultParameter = 1234;
    }

    BindEvents(searchCriteriaChange: ISearchCriteriaChange): void {
        
    }

    UnBindEvents(): void {
        
    }
}