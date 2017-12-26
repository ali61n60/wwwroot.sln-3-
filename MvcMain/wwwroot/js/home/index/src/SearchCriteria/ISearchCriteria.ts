import { SearchAdUserInput} from "../SearchAdUserInput";


export interface ISearchCriteria {
    FillSearchCriteria(searchAdUserInput: SearchAdUserInput): void;
    BindEvents(): void;
    UnBindEvents():void;
}