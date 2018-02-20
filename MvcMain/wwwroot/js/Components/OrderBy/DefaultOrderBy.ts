import {ICriteria, CriteriaValidator } from "../../Helper/ICriteria";
import {UserInput} from "../../Helper/UserInput";
import {ICriteriaChange} from "../../Helper/ICriteriaChange";
import {PriceType} from "../PriceType/DefaultPriceType";


export class DefaultOrderBy implements ICriteria  {
    private readonly OrderByKey = "OrderBy";
    private readonly OrderBySelectId = "orderBy";
    private readonly OrderByDivId = "orderByDiv";
    private readonly OrderByFixedPriceTemplateId = "orderByFixedPriceTemplate";
    private readonly OrderByOdersTemplateId = "orderByOthersTemplate";
    
    private _searchCriteriaChange: ICriteriaChange;
    
    BindEvents(criteriaChange: ICriteriaChange): void {
        this._searchCriteriaChange = criteriaChange;
        $("#" + this.OrderBySelectId).on("change",
            (event) => {
                this._searchCriteriaChange.CustomCriteriaChanged();
            });
    }

    UnBindEvents(): void {
        $("#" + this.OrderBySelectId).off("change");
    }

    ValidateCriteria(): CriteriaValidator { throw new Error("Not implemented"); }

    FillCriteria(userInput: UserInput): void {

        let orderBy = $("#" + this.OrderBySelectId).val().toString();
        userInput.ParametersDictionary[this.OrderByKey] = orderBy;
    }

    public PriceTypeChanged(sender:object,args:PriceType): void {
        this.UnBindEvents();
        $("#" + this.OrderByDivId).children().remove();
        if (args === PriceType.Fixed) {
            var template = $("#"+this.OrderByFixedPriceTemplateId).html();
            var html = Mustache.to_html(template, null);
            $("#" + this.OrderByDivId).append(html);
        } else {

            var template = $("#" + this.OrderByOdersTemplateId).html();
            var html = Mustache.to_html(template, null);
            $("#" + this.OrderByDivId).append(html);
        }
        this.BindEvents(this._searchCriteriaChange);
    }

   
}