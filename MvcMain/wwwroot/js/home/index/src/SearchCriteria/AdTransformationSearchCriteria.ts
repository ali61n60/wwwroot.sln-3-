import {SearchAdUserInput} from "../SearchAdUserInput";
import {ISearchCriteria} from"./ISearchCriteria";
import {ISearchCriteriaChange} from "../ISearchCriteriaChange";

export class AdTransformationSearchCriteria implements ISearchCriteria {
    private BrandParameter: string = "BrandId";
    private BrandSelectId: string = "brand";
    private AllCarModelsInputId: string = "allCarModels";
    private ModelSelectId:string="model";
    private _allCarModels:CarModel[];

    constructor() {
        let allCarModelssString = $("#" + this.AllCarModelsInputId).val().toString();
        this._allCarModels = $.parseJSON(allCarModelssString) as CarModel[];

        this.initView();

    }

    private initView(): void {
        this._allCarModels.forEach((carModel, index, array) => {
            $("#"+this.ModelSelectId).append(`<option value="${carModel.modelId}">${carModel.modelName}</option>`)
        });
    }
    
    
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

class Brand {
    public brandId: number;
    public brandName: string;
}
class CarModel {
    public modelId:number;
    public modelName: string;
    public brandId:number;
}
