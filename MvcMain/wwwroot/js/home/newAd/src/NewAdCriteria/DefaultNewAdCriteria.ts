import { ICriteria,CriteriaValidator } from "../../../../Helper/ICriteria";
import { UserInput } from "../../../../Helper/UserInput";


export class DefaultNewAdCriteria implements ICriteria {
    FillCriteria(searchAdUserInput: UserInput): void {
        
    }

    BindEvents(criteriaChange: Object): void {
        
    }

    UnBindEvents(): void {
        
    }

    ValidateCriteria(): CriteriaValidator {
        throw new Error("Not implemented");
    }
}