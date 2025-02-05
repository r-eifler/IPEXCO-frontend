import { PlanPropertyTemplate } from "src/app/shared/domain/plan-property/plan-property-template";
import { Encoding } from "./services";

export interface DomainSpecification {
    _id?: string;
    name: string;
    encoding: Encoding,
    planPropertyTemplates: PlanPropertyTemplate[]  ;
    description: string;
}
