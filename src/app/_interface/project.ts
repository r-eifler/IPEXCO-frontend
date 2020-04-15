import {PDDLFile} from './pddlfile';

export interface Project {
  _id: string;
  name: string;
  domainFile: PDDLFile;
  problemFile: PDDLFile;
  description: string;
  properties: string[];
}
