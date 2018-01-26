import {CarModel} from "../../Models/AdTransportation/CarModel";
import {UserInput} from "../../Helper/UserInput";
import {ICriteria,CriteriaValidator} from "../../Helper/ICriteria";
import {ICriteriaChange} from "../../Helper/ICriteriaChange";

export class CarModelBrandController implements ICriteria {
    ValidateCriteria(): CriteriaValidator { throw new Error("Not implemented"); }

    private readonly CarBrandIdKey: string = "BrandId";
    private readonly BrandSelectId: string = "brand";

    private readonly CarModelTemplateId: string = "modelTemplate";
    private readonly CarModelDivPlaceHolderId: string = "modelPlaceHolder";

    private readonly CarModelIdKey: string = "CarModelId";
    private readonly AllCarModelsInputId: string = "allCarModels";
    private readonly ModelSelectId: string = "model";
    private _allCarModels: CarModel[];

    private _searchCriteriaChange:ICriteriaChange;

    constructor() {
        this.initView();
    }

    private initView(): void {
        let allCarModelsString = $("#" + this.AllCarModelsInputId).val().toString();
        this._allCarModels = $.parseJSON(allCarModelsString) as CarModel[];
        this.initCarModel();
    }

    private initCarModel(): void {
        this.createCarModelElement(new Array<CarModel>());
    }

    private createCarModelElement(carModels: CarModel[]) {
        $("#" + this.CarModelDivPlaceHolderId).children().remove();
        let template = $("#" + this.CarModelTemplateId).html();
        let data = { carModels: carModels }
        let html = Mustache.to_html(template, data);
        $("#" + this.CarModelDivPlaceHolderId).append(html);
        this.bindCarModel();
    }

    private bindCarModel(): void {
        $("#" + this.ModelSelectId).on("change",(event) => {
                this._searchCriteriaChange.CustomCriteriaChanged();
            });
    }

    private updateCarModelSelect(brandId: number): void {
        let carModels = new Array<CarModel>();
        if (brandId !== 0) {
            this._allCarModels.forEach((carModel, index, array) => {
                if (carModel.BrandId === brandId)
                    carModels.push(carModel);
            });
        }
        this.createCarModelElement(carModels);
    }

    public FillCriteria(userInput:UserInput):void {
        userInput.ParametersDictionary[this.CarBrandIdKey] =
            $("#" + this.BrandSelectId).find("option:selected").val();//brandId
        userInput.ParametersDictionary[this.CarModelIdKey] =
            $("#" + this.ModelSelectId).find("option:selected").val();//carModelId
    }

    BindEvents(criteriaChange: ICriteriaChange): void {
        this._searchCriteriaChange = criteriaChange;
        $("#" + this.BrandSelectId).on("change", (event) => {
            let selectedBrandId: number = parseInt($(event.currentTarget).find("option:selected").val().toString());
            this.updateCarModelSelect(selectedBrandId);
            criteriaChange.CustomCriteriaChanged();
        });

        this.bindCarModel();
    }

    UnBindEvents(): void {
        $("#" + this.BrandSelectId).off("change");
        $("#" + this.ModelSelectId).off("change");
    }
}