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

export interface ServiceBase {
    name: string;
    type: ServiceType;
    domainId: string | null;
    url: string;
    apiKey: string;
    encoding: Encoding;
}


export interface Service extends ServiceBase{
    _id: string;
}





