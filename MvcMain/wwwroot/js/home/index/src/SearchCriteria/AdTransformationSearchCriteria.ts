import { UserInput } from "../../../../Helper/UserInput";
import { ICriteriaChange } from "../../../../Helper/ICriteriaChange";
import {ICriteria} from "../../../../Helper/ICriteria";
import {CarModel} from "../../../../Models/AdTransportation/CarModel";



export class AdTransformationSearchCriteria implements ICriteria {
    private _searchCriteriaChange: ICriteriaChange;
    //TODO this code for brand is also used on new add extract a common method
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
    public FillCriteria(userInput: UserInput): void {
        userInput.ParametersDictionary[this.CarBrandIdKey] =
            $("#" + this.BrandSelectId).find("option:selected").val();//brandId
        userInput.ParametersDictionary[this.CarModelIdKey] =
            $("#" + this.ModelSelectId).find("option:selected").val();//carModelId
        userInput.ParametersDictionary[this.MakeYearFromKey] =
            $("#" + this.MakeYearFromInputId).val();//makeYearFrom
        userInput.ParametersDictionary[this.MakeYearToKey] =
            $("#" + this.MakeYearToInputId).val();//makeYearTo
        userInput.ParametersDictionary[this.FuelKey] =
            $("#" + this.FuelSelectId).find("option:selected").val();//fuel
        userInput.ParametersDictionary[this.MileageFromKey] =
            $("#" + this.MileageFromInputId).val();//mileageFrom
        userInput.ParametersDictionary[this.MileageToKey] =
        $("#" + this.MileageToInputId).val();//mileageTo
        userInput.ParametersDictionary[this.GearboxKey] =
            $("#" + this.GearboxTypeSelectId).find("option:selected").val();//gearboxType        
        userInput.ParametersDictionary[this.BodyColorKey] =
        $("#" + this.BodyColorSelectId).find("option:selected").val();//bodyColor
        userInput.ParametersDictionary[this.InternalColorKey] =
        $("#" + this.InternalColorSelectId).find("option:selected").val();//internalColor        
        userInput.ParametersDictionary[this.BodyStatusKey] =
        $("#" + this.BodyStatusSelectId).find("option:selected").val();//bodyStatus
        userInput.ParametersDictionary[this.CarStatusKey] =
        $("#" + this.CarStatusSelectId).find("option:selected").val();//carStatus        
        userInput.ParametersDictionary[this.PlateTypeKey] =
            $("#" + this.PlateTypeSelectId).find("option:selected").val();//plateType
    }

    public BindEvents(criteriaChange: ICriteriaChange): void {
        this._searchCriteriaChange = criteriaChange;
        this.initView();

        $("#" + this.BrandSelectId).on("change", (event) => {
            let selectedBrandId: number = parseInt($(event.currentTarget).find("option:selected").val().toString());
            this.updateCarModelSelect(selectedBrandId);
            criteriaChange.CustomCriteriChanged();
        });

        this.bindCarModel();
    }

    private bindCarModel():void {
        $("#" + this.ModelSelectId).on("change",
            (event) => {
                this._searchCriteriaChange.CustomCriteriChanged();
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



