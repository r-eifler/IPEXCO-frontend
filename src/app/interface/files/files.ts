export interface File {
  _id: string;
  name: string;
  domain: string;
  type: string;
  path: string;
  content: string;
}

export interface PDDLFile extends File {}

export interface DomainSpecificationFile extends File {}
