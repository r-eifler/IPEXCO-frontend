import {PDDLFile, DomainSpecificationFile} from './files';

export interface Project {
  _id: string;
  name: string;
  domainFile: PDDLFile;
  problemFile: PDDLFile;
  domainSpecification: DomainSpecificationFile;
  description: string;
  taskSchema?: string;
  properties?: string[];
}
