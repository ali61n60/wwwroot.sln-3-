import { ICriteria} from "./ICriteria";
import { NumericDictionary } from "lodash/dist/lodash";

export class CriteriaNumericDictionary implements NumericDictionary<ICriteria> {
    [index: number]: ICriteria;
}