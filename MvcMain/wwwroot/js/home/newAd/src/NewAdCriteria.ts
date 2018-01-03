
export class NewAdCriteria {
    private _newAdCriteriaIocContainer: NewADCriteriaNumericDictionary = new NewADCriteriaNumericDictionary();
    constructor() {
        this.initSearchCriteriaIocContainer();

    }

    private initSearchCriteriaIocContainer() {
        this._newAdCriteriaIocContainer[0] = new DefaultNewAdCriteria();
        this._newAdCriteriaIocContainer[100] = new AdTransformationNewADCriteria();
    }
}

class NewADCriteriaNumericDictionary implements NumericDictionary<INewAdCriteria> {
    [index: number]: INewAdCriteria;
}
