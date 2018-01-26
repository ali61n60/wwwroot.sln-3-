import {ICriteria, CriteriaValidator } from "../../Helper/ICriteria";
import {UserInput} from "../../Helper/UserInput";
import {ICriteriaChange} from "../../Helper/ICriteriaChange";
import {PriceType} from "../PriceType/DefaultPriceType";


export class DefaultOrderBy implements ICriteria  {
    private readonly OrderByKey = "OrderBy";
    private readonly _orderBySelectId = "orderBy";

    private _searchCriteriaChange: ICriteriaChange;

    constructor() {
        
    }

    BindEvents(criteriaChange: ICriteriaChange): void {
        this._searchCriteriaChange = criteriaChange;
        $("#" + this._orderBySelectId).on("change",
            (event) => {
                this._searchCriteriaChange.CustomCriteriaChanged();
            });
    }

    UnBindEvents(): void {
        $("#" + this._orderBySelectId).off("change");
    }

    ValidateCriteria(): CriteriaValidator { throw new Error("Not implemented"); }

    FillCriteria(userInput: UserInput): void {

        let orderBy = $("#" + this._orderBySelectId).val().toString();
        userInput.ParametersDictionary[this.OrderByKey] = orderBy;
    }

    public PriceTypeChanged(sender:object,args:PriceType): void {
        alert("PriceType Changed "+args.toString());
    }

   
}