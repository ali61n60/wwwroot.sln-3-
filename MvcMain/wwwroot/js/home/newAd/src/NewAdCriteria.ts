import { CriteriaNumericDictionary } from "../../../Helper/CriteriaNumericDictionary";
import { DefaultNewAdCriteria } from "./NewAdCriteria/DefaultNewAdCriteria";
import {AdTransformationNewAdCriteria} from "./NewAdCriteria/AdTransformationNewAdCriteria";
import {UserInput} from "../../../Helper/UserInput";
import {ICriteria} from "../../../Helper/ICriteria";
import {ICriteriaChange} from "../../../Helper/ICriteriaChange";

export class NewAdCriteria {
    private _newAdCriteriaIocContainer: CriteriaNumericDictionary ;
    constructor() {
        this._newAdCriteriaIocContainer = new CriteriaNumericDictionary();
        this.initNewAdCriteriaIocContainer();
    }

    private initNewAdCriteriaIocContainer() {
        this._newAdCriteriaIocContainer[0] = new DefaultNewAdCriteria();
        this._newAdCriteriaIocContainer[100] = new AdTransformationNewAdCriteria();
    }

    public FillCategorySpecificNewAdCriteria(categoryId: number, userInput: UserInput): void {
        let newAdCriteria = this.polymorphicDispatchNewAdCriteria(categoryId);
        newAdCriteria.FillCriteria(userInput);
    }

    public Bind(categoryId: number, criteriaChange: ICriteriaChange) {
        let criteria = this.polymorphicDispatchNewAdCriteria(categoryId);
        criteria.BindEvents(criteriaChange);
    }

    public UnBind(categoryId: number) {
        let criteria = this.polymorphicDispatchNewAdCriteria(categoryId);
        criteria.UnBindEvents();
    }

    private polymorphicDispatchNewAdCriteria(categoryId: number): ICriteria {
        let returnValue: ICriteria = this._newAdCriteriaIocContainer[categoryId];
        if (returnValue === undefined || returnValue === null) {
            returnValue = this._newAdCriteriaIocContainer[0];
        }
        return returnValue;
    }
}


