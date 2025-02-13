import { PlanPropertyTemplate } from "src/app/shared/domain/plan-property/plan-property-template";
import { Encoding } from "./services";


export interface DomainSpecificationBase {
    name: string;
    encoding: Encoding,
    planPropertyTemplates: PlanPropertyTemplate[]  ;
    description: string;
}

export interface DomainSpecification extends DomainSpecificationBase{
    _id: string;
}
