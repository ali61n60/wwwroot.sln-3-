import { ICriteria } from "../../../../Helper/ICriteria";
import { UserInput } from "../../../../Helper/UserInput";
import { ICriteriaChange } from "../../../../Helper/ICriteriaChange";
import { CarModel } from "../../../../Models/AdTransportation/CarModel";


export class DefaultNewAdCriteria implements ICriteria {
    FillCriteria(searchAdUserInput: UserInput): void { throw new Error("Not implemented"); }

    BindEvents(criteriaChange: Object): void { throw new Error("Not implemented"); }

    UnBindEvents(): void { throw new Error("Not implemented"); }
}