import { string, nativeEnum, object, nullable, infer as zinfer} from "zod";

export enum ServiceType {
    PLANNER = 'PLANNER',
    EXPLAINER = 'EXPLAINER',
    PROPERTY_CHECKER = 'PROPERTY_CHECKER',
    TESTER = 'TESTER',
    VERIFIER = 'VERIFIER',
    NONE = 'NONE'
}

export enum Encoding{
    PDDL_CLASSIC = 'PDDL_CLASSIC',
    PDDL_NUMERIC = 'PDDL_NUMERIC',
    DOMAIN_DEPENDENT = 'DOMAIN_DEPENDENT',
    NONE = 'NONE'
}

export const ServiceTypeZ = nativeEnum(ServiceType);
export const EncodingZ = nativeEnum(Encoding);

export const ServiceBaseZ = object({
    name: string(),
    type : ServiceTypeZ,
    domainId: nullable(string()),
    url: string(),
    apiKey: string(),
    encoding: EncodingZ,
});

export type ServiceBase = zinfer<typeof ServiceBaseZ>;

export const ServiceZ = ServiceBaseZ.merge(
    object({
        _id: string(),
    })
)

export type Service = zinfer<typeof ServiceZ>;


