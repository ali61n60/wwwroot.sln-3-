import {ICriteria,CriteriaValidator} from "../../../../Helper/ICriteria";
import { UserInput } from "../../../../Helper/UserInput";
import { ICriteriaChange } from "../../../../Helper/ICriteriaChange";


export class DefaultSearchCriteria implements ICriteria{
    public FillCriteria(userInput: UserInput): void {
        userInput.ParametersDictionary.defaultParameter = 1234;
    }

    BindEvents(criteriaChange: ICriteriaChange): void {
        
    }

    UnBindEvents(): void {
        
    }

    ValidateCriteria(): CriteriaValidator {
        throw new Error("Not implemented");
    }
}