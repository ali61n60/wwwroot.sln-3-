import {CarModel} from "../../Models/AdTransportation/CarModel";
import {UserInput} from "../../Helper/UserInput";
import Criteria = require("../../Helper/ICriteria");
import ICriteria = Criteria.ICriteria;
import {ICriteriaChange} from "../../Helper/ICriteriaChange";



export class CarModelBrandController implements ICriteria {
    private readonly CarBrandIdKey: string = "BrandId";
    private readonly BrandSelectId: string = "brand";

    private readonly CarModelTemplateId: string = "modelTemplate";
    private readonly CarModelDivPlaceHolderId: string = "modelPlaceHolder";
    private readonly CarModelIdKey: string = "CarModelId";
    private readonly AllCarModelsInputId: string = "allCarModels";
    private readonly ModelSelectId: string = "model";
    private _allCarModels: CarModel[];

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
        $("#" + this.ModelSelectId).on("change",
            (event) => {
                this._searchCriteriaChange.CustomCriteriChanged();
            });
    }

    


    private updateCarModelSelect(brandId: number): void {
        let carModels = new Array<CarModel>();
        this._allCarModels.forEach((carModel, index, array) => {
            if (carModel.brandId === brandId)
                carModels.push(carModel);
        });
        this.createCarModelElement(carModels);
    }


    public  FillCriteria(userInput:UserInput) {
        userInput.ParametersDictionary[this.CarBrandIdKey] =
            $("#" + this.BrandSelectId).find("option:selected").val();//brandId
        userInput.ParametersDictionary[this.CarModelIdKey] =
            $("#" + this.ModelSelectId).find("option:selected").val();//carModelId

    }

    BindEvents(criteriaChange:ICriteriaChange):void {
        $("#" + this.BrandSelectId).on("change", (event) => {
            let selectedBrandId: number = parseInt($(event.currentTarget).find("option:selected").val().toString());
            this.updateCarModelSelect(selectedBrandId);
            criteriaChange.CustomCriteriaChanged();
        });

        this.bindCarModel();
    }
}