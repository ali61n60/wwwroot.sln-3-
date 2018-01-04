import {ICriteria} from "../../../../Helper/ICriteria";
import {UserInput} from "../../../../Helper/UserInput";
import {ICriteriaChange} from "../../../../Helper/ICriteriaChange";
import {CarModel} from "../../../../Models/AdTransportation/CarModel";


export class AdTransformationNewAdCriteria implements ICriteria {
    private readonly CarBrandIdKey: string = "BrandId";
    private readonly BrandSelectId: string = "brand";

    private readonly CarModelTemplateId: string = "modelTemplate";
    private readonly CarModelDivPlaceHolderId: string = "modelPlaceHolder";
    private readonly CarModelIdKey: string = "CarModelId";
    private readonly AllCarModelsInputId: string = "allCarModels";
    private readonly ModelSelectId: string = "model";
    private _allCarModels: CarModel[];

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

    public FillCriteria(userInput: UserInput): void { }

    public BindEvents(searchCriteriaChange: ICriteriaChange): void {
        this.initView();

        $("#" + this.BrandSelectId).on("change", (event) => {
            let selectedBrandId: number = parseInt($(event.currentTarget).find("option:selected").val().toString());
            this.updateCarModelSelect(selectedBrandId);
            // searchCriteriaChange.CustomSearchCriteriChanged();
        });

        this.bindCarModel();
    }

    private bindCarModel(): void {
        $("#" + this.ModelSelectId).on("change",
            (event) => {
                //this._searchCriteriaChange.CustomSearchCriteriChanged();
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