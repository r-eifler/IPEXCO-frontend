import {DomainSpecificationFile, PDDLFile} from './files/files';

export interface Project {
  _id: string;
  name: string;
  user?: string;
  domainFile?: PDDLFile;
  problemFile?: PDDLFile;
  domainSpecification?: DomainSpecificationFile;
  description?: string;
  taskSchema?: string;
  properties?: string[];
  settings?: string;
  animationSettings?: string;
}
