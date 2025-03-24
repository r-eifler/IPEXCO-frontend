import { PlanPropertyTemplateZ } from "src/app/shared/domain/plan-property/plan-property-template";
import { array, object, string, infer as zinfer } from "zod";
import { EncodingZ } from "./services";

export const DomainSpecificationBaseZ = object({
    name: string(),
    encoding: EncodingZ,
    planPropertyTemplates: array(PlanPropertyTemplateZ),
    description: string(),
});

export type DomainSpecificationBase = zinfer<typeof DomainSpecificationBaseZ>;

export const DomainSpecificationZ = DomainSpecificationBaseZ.merge(
    object({
        _id: string(),
    })
);

export type DomainSpecification = zinfer<typeof DomainSpecificationZ>;
