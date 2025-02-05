
export enum Encoding{
    PDDL_CLASSIC = 'PDDL_CLASSIC',
    PDDL_NUMERIC = 'PDDL_NUMERIC',
    DOMAIN_DEPENDENT = 'DOMAIN_DEPENDENT'
  }


export interface Service{
    _id?: string;
    name: string;
    domainId?: string;
    url: string;
    apiKey: string;
    encoding: Encoding;
}


export interface Planner  extends Service{
    
}


export interface Explainer  extends Service{

}



