import { CriteriaNumericDictionary } from "../../../Helper/CriteriaNumericDictionary";
import { DefaultLetMeKnowCriteria } from "./LetMeKnowCriteria/DefaultLetMeKnowCriteria";
import { AdTransportationLetMeKnowCriteria } from "./LetMeKnowCriteria/AdTransportationLetMeKnowCriteria";
import { UserInput } from "../../../Helper/UserInput";
import { ICriteria } from "../../../Helper/ICriteria";
import { ICriteriaChange } from "../../../Helper/ICriteriaChange";

export class LetMeKnowCriteria {
    private _letMeKnowCriteriaIocContainer: CriteriaNumericDictionary;
    constructor() {
        this._letMeKnowCriteriaIocContainer = new CriteriaNumericDictionary();
        this.initLetMeKnowCriteriaIocContainer();
    }

    private initLetMeKnowCriteriaIocContainer() {
        this._letMeKnowCriteriaIocContainer[0] = new DefaultLetMeKnowCriteria();
        this._letMeKnowCriteriaIocContainer[100] = new AdTransportationLetMeKnowCriteria();
    }

    public FillCategorySpecificLetMeKnowCriteria(categoryId: number, userInput: UserInput): void {
        let letMeKnowCriteria = this.polymorphicDispatchLetMeKnowCriteria(categoryId);
        letMeKnowCriteria.FillCriteria(userInput);
    }

    public Bind(categoryId: number, criteriaChange: ICriteriaChange) {
        let criteria = this.polymorphicDispatchLetMeKnowCriteria(categoryId);
        criteria.BindEvents(criteriaChange);
    }

    public UnBind(categoryId: number) {
        let criteria = this.polymorphicDispatchLetMeKnowCriteria(categoryId);
        criteria.UnBindEvents();
    }

    private polymorphicDispatchLetMeKnowCriteria(categoryId: number): ICriteria {
        let returnValue: ICriteria = this._letMeKnowCriteriaIocContainer[categoryId];
        if (returnValue === undefined || returnValue === null) {
            returnValue = this._letMeKnowCriteriaIocContainer[0];
        }
        return returnValue;
    }
}

