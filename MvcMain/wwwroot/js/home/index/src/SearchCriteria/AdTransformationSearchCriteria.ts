import {SearchAdUserInput} from "../SearchAdUserInput";
import {ISearchCriteria} from"./ISearchCriteria";



export class AdTransformationSearchCriteria implements ISearchCriteria {
    private BrandParameter: string = "BrandId";
    private BrandSelectId:string="brand";
    
    public FillSearchCriteria(searchAdUserInput:SearchAdUserInput): void {
        searchAdUserInput.SearchParameters[this.BrandParameter] =
            $("#" + this.BrandSelectId).find("option:selected").val();
    }

    public BindEvents():void {
        
    }

    public UnBindEvents(): void {
        
    }
}
