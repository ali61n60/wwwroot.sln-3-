import { CriteriaNumericDictionary } from "../../../Helper/CriteriaNumericDictionary";
import { DefaultNewAdCriteria } from "./NewAdCriteria/DefaultNewAdCriteria";
import {AdTransformationNewAdCriteria} from "./NewAdCriteria/AdTransformationNewAdCriteria";


export class NewAdCriteria {
    private _newAdCriteriaIocContainer: CriteriaNumericDictionary = new CriteriaNumericDictionary();
    constructor() {
        this.initSearchCriteriaIocContainer();

    }

    private initSearchCriteriaIocContainer() {
        this._newAdCriteriaIocContainer[0] = new DefaultNewAdCriteria();
        this._newAdCriteriaIocContainer[100] = new AdTransformationNewAdCriteria();
    }
}


