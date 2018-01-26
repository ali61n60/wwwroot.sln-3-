import { ICriteria, CriteriaValidator } from "../../Helper/ICriteria";
import { UserInput } from "../../Helper/UserInput";
import { ICriteriaChange } from "../../Helper/ICriteriaChange";

export class DefaultPriceType implements ICriteria {
    //TODO it raises priceTypeChanged Event, OrderBy component update itself based on price type setting
    private readonly MinimumPriceKey = "MinimumPrice";
    private readonly _minPriceInputId = "minPrice";

    private readonly MaximumPriceKey = "MaximumPrice";
    private readonly _maxPriceInputId = "maxPrice";

    private _searchCriteriaChange: ICriteriaChange;

    constructor() {
        alert("DefaultPriceType");
    }

    BindEvents(criteriaChange: ICriteriaChange): void {
        this._searchCriteriaChange = criteriaChange;
        //you can also user "input" instead of "change"
        $("#" + this._minPriceInputId).on("change",
            (event) => {
                this._searchCriteriaChange.CustomCriteriaChanged();
            });
        $("#" + this._maxPriceInputId).on("change",
            (event) => {
                this._searchCriteriaChange.CustomCriteriaChanged();
            });
    }

    UnBindEvents(): void {
        $("#" + this._minPriceInputId).off("change");
        $("#" + this._maxPriceInputId).off("change");
    }

    ValidateCriteria(): CriteriaValidator { throw new Error("Not implemented"); }

    FillCriteria(userInput: UserInput): void {
        let minPrice = parseInt($("#" + this._minPriceInputId).val().toString());
        userInput.ParametersDictionary[this.MinimumPriceKey] = minPrice;

        let maxPrice = parseInt($("#" + this._maxPriceInputId).val().toString());
        userInput.ParametersDictionary[this.MaximumPriceKey] = maxPrice;

    }
}