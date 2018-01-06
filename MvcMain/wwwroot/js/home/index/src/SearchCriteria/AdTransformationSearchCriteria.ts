import { UserInput } from "../../../../Helper/UserInput";
import { ICriteriaChange } from "../../../../Helper/ICriteriaChange";
import { ICriteria, CriteriaValidator } from "../../../../Helper/ICriteria";
import { CarModelBrandController } from "../../../../Components/Transformation/CarModelBrandController";



export class AdTransformationSearchCriteria implements ICriteria {
    ValidateCriteria(): CriteriaValidator { throw new Error("Not implemented"); }

    private _carModelBrandContoller: CarModelBrandController;

    private readonly MakeYearFromKey: string = "MakeYearFrom";
    private readonly MakeYearFromInputId: string = "fromYear";

    private readonly MakeYearToKey: string = "MakeYearTo";
    private readonly MakeYearToInputId: string = "toYear";

    private readonly FuelKey = "Fuel";
    private readonly FuelSelectId: string = "fuel";

    public readonly MileageFromKey: string = "MileageFrom";
    public readonly MileageFromInputId: string = "mileageFrom";

    public readonly MileageToKey: string = "MileageTo";
    public readonly MileageToInputId: string = "mileageTo";

    public readonly GearboxKey: string = "Gearbox";
    public readonly GearboxTypeSelectId: string = "gearboxType";

    public readonly BodyColorKey: string = "BodyColor";
    public readonly BodyColorSelectId: string = "bodyColor";

    public readonly InternalColorKey: string = "InternalColor";
    public readonly InternalColorSelectId = "internalColor";

    public readonly BodyStatusKey: string = "BodyStatus";
    public readonly BodyStatusSelectId: string = "bodyStatus";

    public readonly CarStatusKey: string = "CarStatus";
    public readonly CarStatusSelectId: string = "carStatus";

    public readonly PlateTypeKey: string = "PlateType";
    public readonly PlateTypeSelectId: string = "plateType";

    private initView(): void {
        this._carModelBrandContoller = new CarModelBrandController();
    }

    //TODO in orther to minimize bandwidth usage it is good prctice to not send criterias that have default value
    public FillCriteria(userInput: UserInput): void {
        this._carModelBrandContoller.FillCriteria(userInput);

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
        this.initView();
        this._carModelBrandContoller.BindEvents(criteriaChange);
    }

    public UnBindEvents(): void {
        this._carModelBrandContoller.UnBindEvents();
    }
}



