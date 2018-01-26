import {ICriteria,CriteriaValidator} from "../../../../Helper/ICriteria";
import { UserInput } from "../../../../Helper/UserInput";
import { ICriteriaChange } from "../../../../Helper/ICriteriaChange";
import {DefaultOrderBy} from "../../../../Components/OrderBy/DefaultOrderBy";
import {DefaultPriceType} from "../../../../Components/PriceType/DefaultPriceType";

export class DefaultSearchCriteria implements ICriteria{

    private _defaultOrderBy: DefaultOrderBy;
    private _defaultPriceType:DefaultPriceType;

    private initView(): void {
        this._defaultPriceType = new DefaultPriceType();
        this._defaultOrderBy = new DefaultOrderBy();
    }

    private registerEvents(): void {
        this._defaultPriceType.SelectedPriceTypeChangedEvent.Subscribe(this._defaultOrderBy.PriceTypeChanged);
    }

    private unRegisterEvents(): void {
        this._defaultPriceType.SelectedPriceTypeChangedEvent.Unsubscribe(this._defaultOrderBy.PriceTypeChanged);
    }

    public FillCriteria(userInput: UserInput): void {
        this._defaultOrderBy.FillCriteria(userInput);
        this._defaultPriceType.FillCriteria(userInput);
        userInput.ParametersDictionary.defaultParameter = 1234;
        
    }

    BindEvents(criteriaChange: ICriteriaChange): void {
        this.initView();
        this.registerEvents();
        this._defaultOrderBy.BindEvents(criteriaChange);
        this._defaultPriceType.BindEvents(criteriaChange);
    }

    UnBindEvents(): void {
        this._defaultOrderBy.UnBindEvents();
        this._defaultPriceType.UnBindEvents();
        this.unRegisterEvents();
    }

    ValidateCriteria(): CriteriaValidator {
        throw new Error("Not implemented");
    }
}