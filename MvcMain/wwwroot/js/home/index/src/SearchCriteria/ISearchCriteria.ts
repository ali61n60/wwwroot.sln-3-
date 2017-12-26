import { SearchAdUserInput} from "../SearchAdUserInput";
import {ISearchCriteriaChange} from "../ISearchCriteriaChange";

export interface ISearchCriteria {
    FillSearchCriteria(searchAdUserInput: SearchAdUserInput): void;
    BindEvents(searchCriteriaChange: ISearchCriteriaChange): void;
    UnBindEvents():void;
}