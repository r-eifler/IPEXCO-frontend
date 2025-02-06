export enum ServiceType {
  PLANNER = 'PLANNER',
  EXPLAINER = 'EXPLAINER',
  PROPERTY_CHECKER = 'PROPERTY_CHECKER',
  TESTER = 'TESTER',
  VERIFIER = 'VERIFIER'
}

export enum Encoding{
    PDDL_CLASSIC = 'PDDL_CLASSIC',
    PDDL_NUMERIC = 'PDDL_NUMERIC',
    DOMAIN_DEPENDENT = 'DOMAIN_DEPENDENT'
  }


export interface Service{
    _id?: string;
    name: string;
    type: ServiceType;
    domainId?: string;
    url: string;
    apiKey: string;
    encoding: Encoding;
}





