import {ISearchCriteria} from "./ISearchCriteria";
import {SearchAdUserInput} from "../SearchAdUserInput";



export class DefaultSearchCriteria implements ISearchCriteria{
    public FillSearchCriteria(userInput: SearchAdUserInput): void {
        userInput.SearchParameters.defaultParameter = 1234;
    }
}