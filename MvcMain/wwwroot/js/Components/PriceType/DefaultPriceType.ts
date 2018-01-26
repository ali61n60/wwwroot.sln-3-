import { ICriteria, CriteriaValidator } from "../../Helper/ICriteria";
import { UserInput } from "../../Helper/UserInput";
import { ICriteriaChange } from "../../Helper/ICriteriaChange";
import {EventDispatcher} from "../../Events/EventDispatcher";

export class DefaultPriceType implements ICriteria {
    //TODO it raises priceTypeChanged Event, OrderBy component update itself based on price type setting
    public SelectedPriceTypeChangedEvent: EventDispatcher<DefaultPriceType, PriceType> =
        new EventDispatcher<DefaultPriceType, PriceType>();

    private readonly PriceTypeSelectId= "priceType";

    private readonly FixPriceDivId ="fixedPrice";
    private readonly MinimumPriceKey = "MinimumPrice";
    private readonly _minPriceInputId = "minPrice";

    private readonly MaximumPriceKey = "MaximumPrice";
    private readonly _maxPriceInputId = "maxPrice";

    private _searchCriteriaChange: ICriteriaChange;

    constructor() {
        
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
        $("#" + this.PriceTypeSelectId).on("change", (event)=> {
            let selectedPriceType = this.getPriceType($(event.currentTarget).val().toString());
            if (selectedPriceType === PriceType.Fixed) {
                $("#" + this.FixPriceDivId).show();
            } else {
                $("#" + this.FixPriceDivId).hide();
            }
            //hide min and max prices if type is not fix...
            this.SelectedPriceTypeChangedEvent.Dispatch(this, selectedPriceType);
        });
    }

    private getPriceType(stringPriceType: string): PriceType {
        return parseInt(stringPriceType);
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

export enum PriceType {
    Fixed = 1,
    Agreement = 2,
    Exchange = 3,
    Installment = 4,
    MortgageAndRent = 5
}