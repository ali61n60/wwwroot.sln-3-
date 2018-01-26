import {ICriteria, CriteriaValidator } from "../../Helper/ICriteria";
import {UserInput} from "../../Helper/UserInput";
import {ICriteriaChange} from "../../Helper/ICriteriaChange";


export class DefaultOrderBy implements ICriteria  {
    private readonly OrderByKey = "OrderBy";
    private readonly _orderBySelectIdDiv = "orderBy";

    private _searchCriteriaChange: ICriteriaChange;

    constructor() {
        
    }

    BindEvents(criteriaChange: ICriteriaChange): void {
        this._searchCriteriaChange = criteriaChange;
        $("#" + this._orderBySelectIdDiv).on("change",
            (event) => {
                this._searchCriteriaChange.CustomCriteriaChanged();
            });
    }

    UnBindEvents(): void {
        $("#" + this._orderBySelectIdDiv).off("change");
    }

    ValidateCriteria(): CriteriaValidator { throw new Error("Not implemented"); }

    FillCriteria(userInput: UserInput): void {

        let orderBy = $("#" + this._orderBySelectIdDiv).val().toString();
        userInput.ParametersDictionary[this.OrderByKey] = orderBy;
    }

    public PriceTypeChanged(): void {
        alert("PriceType Changed");
    }

   
}