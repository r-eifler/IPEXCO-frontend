import { PlanPropertyDefinitionZ } from "src/app/shared/domain/plan-property/plan-property";
import { array, boolean, nativeEnum, nullable, number, object, string, infer as zinfer } from "zod";

export const SimplePlanPropertyBaseZ = object({
    name: string(),
    definition: nullable(PlanPropertyDefinitionZ),
  });
  
  export type SimplePlanPropertyBase = zinfer<typeof SimplePlanPropertyBaseZ>;
  
  export const SimplePlanPropertyZ = SimplePlanPropertyBaseZ.merge(object({
  _id: string(),
  }));
  
  export type SimplePlanProperty = zinfer<typeof SimplePlanPropertyZ>;