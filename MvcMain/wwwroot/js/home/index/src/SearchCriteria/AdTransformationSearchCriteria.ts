import { SearchAdUserInput } from "../SearchAdUserInput";
import { ISearchCriteria } from "./ISearchCriteria";
import { ISearchCriteriaChange } from "../ISearchCriteriaChange";

export class AdTransformationSearchCriteria implements ISearchCriteria {
    private _searchCriteriaChange: ISearchCriteriaChange;

    private readonly CarBrandIdKey: string = "BrandId";
    private readonly BrandSelectId: string = "brand";

    private readonly CarModelTemplateId: string = "modelTemplate";
    private readonly CarModelDivPlaceHolderId: string = "modelPlaceHolder";
    private readonly CarModelIdKey:string = "CarModelId";
    private readonly AllCarModelsInputId: string = "allCarModels";
    private readonly ModelSelectId: string = "model";
    private _allCarModels: CarModel[];

    private readonly MakeYearFromKey: string = "MakeYearFrom";
    private readonly MakeYearFromInputId: string = "fromYear";

    private readonly MakeYearToKey: string = "MakeYearTo";
    private readonly MakeYearToInputId: string = "toYear";

    private readonly FuelKey="Fuel";
    private readonly FuelSelectId: string = "fuel";

    public readonly MileageFromKey: string = "MileageFrom";
    public readonly MileageFromInputId:string ="mileageFrom";

    public readonly MileageToKey: string = "MileageTo";
    public readonly MileageToInputId:string = "mileageTo";

    public readonly GearboxKey: string = "Gearbox";
    public  readonly GearboxTypeSelectId:string="gearboxType";

    public readonly BodyColorKey: string = "BodyColor";
    public  readonly BodyColorSelectId:string = "bodyColor";

    public readonly InternalColorKey: string = "InternalColor";
    public  readonly InternalColorSelectId = "internalColor";

    public readonly BodyStatusKey: string = "BodyStatus";
    public  readonly BodyStatusSelectId:string = "bodyStatus";

    public readonly CarStatusKey: string = "CarStatus";
    public  readonly CarStatusSelectId:string = "carStatus";

    public readonly PlateTypeKey: string = "PlateType";
    public  readonly PlateTypeSelectId:string= "plateType";
    


    private initView(): void {
        let allCarModelssString = $("#" + this.AllCarModelsInputId).val().toString();
        this._allCarModels = $.parseJSON(allCarModelssString) as CarModel[];
        this.initCarModel();
    }

    private initCarModel(): void {
        this.createCarModelElement(new Array<CarModel>());
    }

    private updateCarModelSelect(brandId: number): void {
        let carModels = new Array<CarModel>();
        this._allCarModels.forEach((carModel, index, array) => {
            if (carModel.brandId === brandId)
                carModels.push(carModel);
        });
        this.createCarModelElement(carModels);
    }

    private createCarModelElement(carModels: CarModel[]) {
        $("#" + this.CarModelDivPlaceHolderId).children().remove();
        let template = $("#" + this.CarModelTemplateId).html();
        let data = { carModels: carModels }
        let html = Mustache.to_html(template, data);
        $("#" + this.CarModelDivPlaceHolderId).append(html);
        this.bindCarModel();
    }

    //TODO in orther to minimize bandwidth usage it is good prctice to not send criterias that have default value
    public FillSearchCriteria(searchAdUserInput: SearchAdUserInput): void {
        searchAdUserInput.SearchParameters[this.CarBrandIdKey] =
            $("#" + this.BrandSelectId).find("option:selected").val();//brandId
        searchAdUserInput.SearchParameters[this.CarModelIdKey] =
            $("#" + this.ModelSelectId).find("option:selected").val();//carModelId
        searchAdUserInput.SearchParameters[this.MakeYearFromKey] =
            $("#" + this.MakeYearFromInputId).val();//makeYearFrom
        searchAdUserInput.SearchParameters[this.MakeYearToKey] =
            $("#" + this.MakeYearToInputId).val();//makeYearTo
        searchAdUserInput.SearchParameters[this.FuelKey] =
            $("#" + this.FuelSelectId).find("option:selected").val();//fuel
        searchAdUserInput.SearchParameters[this.MileageFromKey] =
            $("#" + this.MileageFromInputId).val();//mileageFrom
        searchAdUserInput.SearchParameters[this.MileageToKey] =
        $("#" + this.MileageToInputId).val();//mileageTo
        searchAdUserInput.SearchParameters[this.GearboxKey] =
            $("#" + this.GearboxTypeSelectId).find("option:selected").val();//gearboxType
        
        searchAdUserInput.SearchParameters[this.BodyColorKey] =
        $("#" + this.BodyColorSelectId).find("option:selected").val();//bodyColor
        

        searchAdUserInput.SearchParameters[this.InternalColorKey] =
        $("#" + this.InternalColorSelectId).find("option:selected").val();//internalColor
        
        searchAdUserInput.SearchParameters[this.BodyStatusKey] =
        $("#" + this.BodyStatusSelectId).find("option:selected").val();//bodyStatus

        searchAdUserInput.SearchParameters[this.CarStatusKey] =
        $("#" + this.CarStatusSelectId).find("option:selected").val();//carStatus
        
        searchAdUserInput.SearchParameters[this.PlateTypeKey] =
            $("#" + this.PlateTypeSelectId).find("option:selected").val();//internalColor


    }

    public BindEvents(searchCriteriaChange: ISearchCriteriaChange): void {
        this._searchCriteriaChange = searchCriteriaChange;
        this.initView();

        $("#" + this.BrandSelectId).on("change", (event) => {
            let selectedBrandId: number = parseInt($(event.currentTarget).find("option:selected").val().toString());
            this.updateCarModelSelect(selectedBrandId);
            searchCriteriaChange.CustomSearchCriteriChanged();
        });

        this.bindCarModel();
    }

    private bindCarModel():void {
        $("#" + this.ModelSelectId).on("change",
            (event) => {
                this._searchCriteriaChange.CustomSearchCriteriChanged();
            });
    }


    public UnBindEvents(): void {
        $("#" + this.BrandSelectId).off("change");
        this.unBindCarModel();
    }

    private unBindCarModel(): void {
        $("#" + this.ModelSelectId).off("change");
    }
}

class Brand {
    public brandId: number;
    public brandName: string;
}
class CarModel {
    public modelId: number;
    public modelName: string;
    public brandId: number;
}
