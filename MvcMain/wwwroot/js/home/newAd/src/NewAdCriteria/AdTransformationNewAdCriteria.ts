import {ICriteria} from "../../../../Helper/ICriteria";
import {UserInput} from "../../../../Helper/UserInput";
import {ICriteriaChange} from "../../../../Helper/ICriteriaChange";
import {CarModel} from "../../../../Models/AdTransportation/CarModel";
import {CarModelBrandController} from "../../../../Components/Transformation/CarModelBrandController";

export class AdTransformationNewAdCriteria implements ICriteria {
    private  _carModelBrandContoller: CarModelBrandController;
    
    private initView(): void {
        this._carModelBrandContoller = new CarModelBrandController();
    }
    
    public FillCriteria(userInput: UserInput): void {
        this._carModelBrandContoller.FillCriteria(userInput);
    }

    public BindEvents(criteriaChange: ICriteriaChange): void {
        this.initView();
        this._carModelBrandContoller.BindEvents(criteriaChange);
    }

    public UnBindEvents(): void {
        this._carModelBrandContoller.UnBindEvents();
    }
}