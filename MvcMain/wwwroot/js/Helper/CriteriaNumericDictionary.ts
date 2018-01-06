import { ICriteria} from "./ICriteria";
import { NumericDictionary } from "lodash/index";


export class CriteriaNumericDictionary implements NumericDictionary<ICriteria> {
    [index: number]: ICriteria;
}