import { UserInput} from "./UserInput";
import {ICriteriaChange} from "./ICriteriaChange";

export interface ICriteria {
    FillCriteria(userInput: UserInput): void;
    BindEvents(criteriaChange: ICriteriaChange): void;
    UnBindEvents(): void;
    ValidateCriteria():CriteriaValidator;
}

export class CriteriaValidator {
    public IsValid: boolean;
    public Messages:string[];
}