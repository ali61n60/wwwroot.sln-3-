import {ISearchCriteria} from "../../../index/src/SearchCriteria/ISearchCriteria";
import {SearchAdUserInput} from"../../../index/src/SearchAdUserInput";
import {ISearchCriteriaChange} from "../../../index/src/ISearchCriteriaChange";



export class NewAdTransformation implements ISearchCriteria {
    public FillSearchCriteria(searchAdUserInput: SearchAdUserInput): void {}
    public BindEvents(searchCriteriaChange: ISearchCriteriaChange): void {}
    public UnBindEvents(): void {}
}