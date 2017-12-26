import {SearchAdUserInput} from "../SearchAdUserInput";
import {ISearchCriteria} from"./ISearchCriteria";
import {ISearchCriteriaChange} from "../ISearchCriteriaChange";



export class AdTransformationSearchCriteria implements ISearchCriteria {
    private BrandParameter: string = "BrandId";
    private BrandSelectId:string="brand";
    
    public FillSearchCriteria(searchAdUserInput:SearchAdUserInput): void {
        searchAdUserInput.SearchParameters[this.BrandParameter] =
            $("#" + this.BrandSelectId).find("option:selected").val();
    }

    public BindEvents(searchCriteriaChange: ISearchCriteriaChange):void {
        $("#brand").on("change", (event) => {
            console.log($(event.currentTarget).find("option:selected").text());
            searchCriteriaChange.CustomSearchCriteriChanged();
        });
    }

    public UnBindEvents(): void {
        $("#brand").off("change");
    }
}
