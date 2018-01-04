import { CriteriaNumericDictionary } from "../../../Helper/CriteriaNumericDictionary";
import { DefaultNewAdCriteria } from "./NewAdCriteria/DefaultNewAdCriteria";
import {AdTransformationNewAdCriteria} from "./NewAdCriteria/AdTransformationNewAdCriteria";
import {UserInput} from "../../../Helper/UserInput";
import {ICriteria} from "../../../Helper/ICriteria";
import {ICriteriaChange} from "../../../Helper/ICriteriaChange";

export class NewAdCriteria {
    private _newAdCriteriaIocContainer: CriteriaNumericDictionary = new CriteriaNumericDictionary();
    constructor() {
        this.initNewAdCriteriaIocContainer();
    }

    private initNewAdCriteriaIocContainer() {
        this._newAdCriteriaIocContainer[0] = new DefaultNewAdCriteria();
        this._newAdCriteriaIocContainer[100] = new AdTransformationNewAdCriteria();
    }

    public FillCategorySpecificNewAdCriteria(categoryId: number, userInput: UserInput): void {
        let newAdCriteria = this.polymorphicDispatchNeaAdCriteria(categoryId);
        newAdCriteria.FillCriteria(userInput);
    }

    public Bind(categoryId: number, searchCriteriaChange: ICriteriaChange) {
        let searchCriteria = this.polymorphicDispatchNeaAdCriteria(categoryId);
        searchCriteria.BindEvents(searchCriteriaChange);
    }

    public UnBind(categoryId: number) {
        let searchCriteria = this.polymorphicDispatchNeaAdCriteria(categoryId);
        searchCriteria.UnBindEvents();
    }

    private polymorphicDispatchNeaAdCriteria(categoryId: number): ICriteria {
        let returnValue: ICriteria = this._newAdCriteriaIocContainer[categoryId];
        if (returnValue === undefined || returnValue === null) {
            returnValue = this._newAdCriteriaIocContainer[0];
        }
        return returnValue;
    }
}


