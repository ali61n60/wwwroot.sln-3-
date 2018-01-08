import {ICriteria,CriteriaValidator} from "../../../../Helper/ICriteria";
import {UserInput} from "../../../../Helper/UserInput";
import {ICriteriaChange} from "../../../../Helper/ICriteriaChange";
import {CarModelBrandController} from "../../../../Components/Transformation/CarModelBrandController";

export class AdTransformationNewAdCriteria implements ICriteria {
    private _carModelBrandContoller: CarModelBrandController;

    public ValidateCriteria(): CriteriaValidator { throw new Error("Not implemented"); }

    private readonly MakeYearKey: string = "MakeYear";
    private readonly MakeYearInputId: string = "makeYear";
   
    private readonly FuelKey = "Fuel";
    private readonly FuelSelectId: string = "fuel";

    public readonly GearboxKey: string = "Gearbox";
    public readonly GearboxTypeParentDivId: string = "gearboxType";

    public readonly CarStatusKey: string = "CarStatus";
    public readonly CarStatusParentDivId: string = "carStatus";

    public readonly MileageKey: string = "Mileage";
    public readonly MileageInputId: string = "mileage";

    public readonly PlateTypeKey: string = "PlateType";
    public readonly PlateTypeParentDivId: string = "plateType";

    public readonly BodyStatusKey: string = "BodyStatus";
    public readonly BodyStatusSelectId: string = "bodyStatus";

    public readonly BodyColorKey: string = "BodyColor";
    public readonly BodyColorSelectId: string = "bodyColor";

    public readonly InternalColorKey: string = "InternalColor";
    public readonly InternalColorSelectId = "internalColor";

    
    private initView(): void {
        this._carModelBrandContoller = new CarModelBrandController();
    }
    
    public FillCriteria(userInput: UserInput): void {
        //TODO validate user input then proceed
        this._carModelBrandContoller.FillCriteria(userInput);
        userInput.ParametersDictionary[this.MakeYearKey] =$("#" + this.MakeYearInputId).val();//MakeYear
        userInput.ParametersDictionary[this.FuelKey] = $("#" + this.FuelSelectId).find("option=selected").val();//Fuel
        userInput.ParametersDictionary[this.MileageKey] = $("#" + this.MileageInputId).val();//Mileage
        userInput.ParametersDictionary[this.GearboxKey] = $("#" + this.GearboxTypeParentDivId).children(":checked").val();
        userInput.ParametersDictionary[this.BodyColorKey] = $("#" + this.BodyColorSelectId).find("option=selected").val();
        userInput.ParametersDictionary[this.InternalColorKey] = $("#" + this.InternalColorSelectId).find("option=selected").val();
        userInput.ParametersDictionary[this.BodyStatusKey] = $("#" + this.BodyStatusSelectId).find("option=selected").val();
        userInput.ParametersDictionary[this.CarStatusKey] = $("#" + this.CarStatusParentDivId).children(":checked").val();
        userInput.ParametersDictionary[this.PlateTypeKey] = $("#" + this.PlateTypeParentDivId).children(":checked").val();
    }

    public BindEvents(criteriaChange: ICriteriaChange): void {
        this.initView();
        this._carModelBrandContoller.BindEvents(criteriaChange);
    }

    public UnBindEvents(): void {
        this._carModelBrandContoller.UnBindEvents();
    }
}